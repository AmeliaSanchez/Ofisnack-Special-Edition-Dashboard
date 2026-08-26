import {createSign} from 'node:crypto';
import {copyFile,mkdir,readFile,rm,writeFile} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {adaptSalesRows} from '../src/data/sales-adapter.js';
import {localSalesSnapshot} from '../src/data/sales.js';
import {catalog as localCatalog} from '../src/data/catalog.js';
import {dashboardConfig as localConfig,sourceConfig} from '../src/data/source-config.js';
import {validatePermanentRules,validateInitialEquivalence} from './lib/validate-dashboard-data.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..'),outputPath=resolve(root,'assets/data/dashboard-data.json');
const SALES_HEADERS=['Período','Cliente','Nombre del cliente','Cód. artículo','Nombre histórico','Cantidad'];
const CATALOG_HEADERS=['Codigo','Nombre','Estado'];

function base64url(value){return Buffer.from(value).toString('base64url')}
function requireEnv(name){const value=process.env[name];if(!value)throw new Error(`Falta la variable de entorno ${name}.`);return value}
function parseCredentials(){
  let credentials;
  try{credentials=JSON.parse(requireEnv('GOOGLE_SERVICE_ACCOUNT_JSON'))}catch(error){throw new Error(`GOOGLE_SERVICE_ACCOUNT_JSON inválido: ${error.message}`)}
  if(!credentials.client_email||!credentials.private_key)throw new Error('La credencial debe incluir client_email y private_key.');
  return credentials;
}
async function accessToken(credentials){
  const now=Math.floor(Date.now()/1000),header=base64url(JSON.stringify({alg:'RS256',typ:'JWT'}));
  const claim=base64url(JSON.stringify({iss:credentials.client_email,scope:'https://www.googleapis.com/auth/spreadsheets.readonly',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600}));
  const unsigned=`${header}.${claim}`,signer=createSign('RSA-SHA256');signer.update(unsigned);signer.end();
  const assertion=`${unsigned}.${signer.sign(credentials.private_key.replace(/\\n/g,'\n'),'base64url')}`;
  const response=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion})});
  if(!response.ok)throw new Error(`Autenticación Google falló (${response.status}): ${await response.text()}`);
  return (await response.json()).access_token;
}
async function readSheets(spreadsheetId,token){
  const ranges=[sourceConfig.salesSheet,sourceConfig.catalogSheet,sourceConfig.configSheet];
  const query=ranges.map(range=>`ranges=${encodeURIComponent(`'${range.replaceAll("'","''")}'`)}`).join('&');
  const response=await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values:batchGet?majorDimension=ROWS&valueRenderOption=UNFORMATTED_VALUE&${query}`,{headers:{authorization:`Bearer ${token}`}});
  if(!response.ok)throw new Error(`Lectura de Google Sheets falló (${response.status}): ${await response.text()}`);
  const payload=await response.json();
  if(payload.valueRanges?.length!==ranges.length)throw new Error('Google Sheets no devolvió las tres solapas requeridas.');
  return Object.fromEntries(ranges.map((name,index)=>[name,payload.valueRanges[index].values||[]]));
}
function tableRows(values,expectedHeaders,label){
  const headerIndex=values.findIndex(row=>Array.isArray(row)&&row.some(value=>String(value??'').trim()));
  if(headerIndex<0)throw new Error(`${label}: no se encontró encabezado.`);
  const headers=values[headerIndex].map(value=>String(value??'').trim());
  if(expectedHeaders.some((header,index)=>headers[index]!==header))throw new Error(`${label}: encabezados inválidos. Esperados: ${expectedHeaders.join(' | ')}.`);
  return values.slice(headerIndex+1).filter(row=>row.some(value=>String(value??'').trim()));
}
function salesFrom(values){
  const rows=tableRows(values,SALES_HEADERS,'VENTAS').map(row=>({period:row[0],clientCode:row[1],clientName:row[2],productCode:row[3],historicalName:row[4],quantity:row[5]}));
  adaptSalesRows(rows);
  return rows.map(row=>({...row,period:String(row.period).trim(),clientCode:String(row.clientCode).trim().padStart(5,'0'),clientName:String(row.clientName).trim(),productCode:String(row.productCode).trim(),historicalName:String(row.historicalName).trim(),quantity:Number(row.quantity)}));
}
function catalogFrom(values){return tableRows(values,CATALOG_HEADERS,'CATÁLOGO').map(row=>({code:row[0],name:row[1],status:row[2]}))}
function configFrom(values){
  const pairs=values.filter(row=>Array.isArray(row)&&row.some(value=>String(value??'').trim())).filter(row=>!['clave','key'].includes(String(row[0]??'').trim().toLowerCase()));
  const entries=new Map(pairs.map(row=>[String(row[0]??'').trim(),row[1]]));
  return {fechaActualizacion:entries.get('fecha_actualizacion'),ultimoMesCerrado:entries.get('ultimo_mes_cerrado'),versionEsquema:entries.get('version_esquema')};
}
function fixtureDataset(){return {sales:localSalesSnapshot,catalog:localCatalog,config:localConfig,generatedAt:new Date().toISOString()}}
async function remoteDataset(){
  const credentials=parseCredentials(),spreadsheetId=requireEnv('GOOGLE_SPREADSHEET_ID'),token=await accessToken(credentials),sheets=await readSheets(spreadsheetId,token);
  return {sales:salesFrom(sheets[sourceConfig.salesSheet]),catalog:catalogFrom(sheets[sourceConfig.catalogSheet]),config:configFrom(sheets[sourceConfig.configSheet]),generatedAt:new Date().toISOString()};
}
async function replaceValidated(dataset,{initialEquivalence=false}={}){
  try{
    const previous=JSON.parse(await readFile(outputPath,'utf8'));
    const core=value=>JSON.stringify({sales:value.sales,catalog:value.catalog,config:value.config});
    if(core(previous)===core(dataset)&&previous.generatedAt)dataset.generatedAt=previous.generatedAt;
  }catch{}
  validatePermanentRules(dataset);if(initialEquivalence)validateInitialEquivalence(dataset);
  await mkdir(dirname(outputPath),{recursive:true});
  const temporary=`${outputPath}.tmp-${process.pid}`;
  try{await writeFile(temporary,`${JSON.stringify(dataset,null,2)}\n`,'utf8');JSON.parse(await readFile(temporary,'utf8'));await copyFile(temporary,outputPath)}finally{await rm(temporary,{force:true})}
}

const fixture=process.argv.includes('--fixture'),initialEquivalence=process.argv.includes('--expect-initial-snapshot');
try{
  const dataset=fixture?fixtureDataset():await remoteDataset();
  await replaceValidated(dataset,{initialEquivalence});
  console.log(`Sincronización válida: ${dataset.sales.length} movimientos · ${outputPath}`);
}catch(error){console.error(`Sincronización cancelada: ${error.message}`);process.exitCode=1}
