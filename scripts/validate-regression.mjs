import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {localSalesSnapshot} from '../src/data/sales.js';
import {catalog} from '../src/data/catalog.js';
import {dashboardConfig} from '../src/data/source-config.js';
import {adaptSalesRows} from '../src/data/sales-adapter.js';
import {validatePermanentRules,validateInitialEquivalence} from './lib/validate-dashboard-data.mjs';

const target=resolve('assets/data/dashboard-data.json');
let dataset;
try{dataset=JSON.parse(await readFile(target,'utf8'))}catch{dataset={sales:localSalesSnapshot,catalog,config:dashboardConfig,generatedAt:new Date().toISOString()}}

const {sales,metrics}=validatePermanentRules(dataset),initial=process.argv.includes('--expect-initial-snapshot');
if(initial)validateInitialEquivalence(dataset);

const assert=(condition,message)=>{if(!condition)throw new Error(message)};
const sample=adaptSalesRows([{period:'2027-01',clientCode:'1',clientName:'Cliente',productCode:'IA0001',historicalName:'Box',quantity:'2'}])[0];
assert(sample.year===2027&&sample.month===1,'Año/Mes no se derivan correctamente desde Período.');
for(const invalid of ['2026-8','2026-13','26-08','']){
  let rejected=false;try{adaptSalesRows([{...sample,period:invalid}])}catch{rejected=true}assert(rejected,`Período inválido aceptado: ${invalid}`);
}

console.log(JSON.stringify({mode:initial?'permanent+initial':'permanent',rows:sales.length,latest:{home:metrics.home,clients:{unique:metrics.clients.unique,recurring:metrics.clients.multiMonth,total:metrics.clients.total,average:metrics.clients.average},portfolio:{sold:metrics.portfolio.sold,total:metrics.portfolio.total,buyers:metrics.portfolio.buyers,activeNoSales:metrics.portfolio.activeNoSales},opportunities:metrics.opportunities.counts}},null,2));
