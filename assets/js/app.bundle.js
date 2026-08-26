/* Generated from modular source. Do not edit directly. */
(async()=>{
'use strict';

/* src/data/source-config.js */
const sourceConfig = {
  type: 'local-ventas-validation',
  salesSheet: 'VENTAS',
  catalogSheet: 'listado de boxes Special Edition',
  configSheet: 'Dashboard_Config',
  snapshotThrough: '2026-08',
  adapter: 'src/data/sales-adapter.js'
};

const dashboardConfig = {
  fechaActualizacion: '2026-08-24',
  ultimoMesCerrado: '2026-07',
  versionEsquema: 1
};


/* src/data/catalog.js */
const catalog = [
  ['IA0008','Box Ofisnack After Office x 12 productos','Activo'],['IA0011','Box Ofisnack All Stars x 30 productos','Activo'],['IA0019','Box Ofisnack Cine en Casa x 20 productos','Activo'],['IA0007','Box Ofisnack Desayuno x 13 productos','Activo'],['IA0006','Box Ofisnack Fit x 12 productos','Activo'],['IA0020','Box Ofisnack Sala de Reuniones x 20 Bocaditos','Activo'],['IA0003','Box Ofisnack Special Edition Cumpleaños x 15 snack','Activo'],['IA0001','Box Ofisnack Special Kids Edition x 50 Snacks','Activo'],['IA0024','Box Ofisnack Special Edition Kids x 20 Snacks','Activo'],['IA0036','Box Ofisnack Special Edition Picada x 12 unidades','Activo'],['IA0035','Box Ofisnack Special Edition Sorpresa Fit x 12 unidades','Activo'],['IA0034','Box Ofisnack Special Edition Sorpresa x 12 unidades','Activo'],['IA0002','Box Ofisnack Special Love Edition x 12 Snacks','Activo'],['IA0021','Box Ofisnack Sweets x 120 Caramelos','Activo'],['IA0012','Box Ofisnack Wellness x 12 productos','Activo'],['IA0022','Refill Box Ofisnack Sala de Reuniones x 20 Bocaditos','Activo'],['IA0023','Refill Box Ofisnack Sweets x 120 Caramelos','Activo']
].map(([code,name,status])=>({code,name,status}));


/* src/data/sales-adapter.js */
const PERIOD_PATTERN=/^(\d{4})-(0[1-9]|1[0-2])$/;

function adaptSalesRows(rows){
  if(!Array.isArray(rows))throw new TypeError('VENTAS debe ser una lista de filas.');
  return rows.map((row,index)=>{
    const line=index+2;
    if(!row||typeof row!=='object')throw new TypeError(`VENTAS fila ${line}: formato inválido.`);
    const period=String(row.period??'').trim(),match=PERIOD_PATTERN.exec(period);
    if(!match)throw new TypeError(`VENTAS fila ${line}: Período debe usar YYYY-MM.`);
    const sourceClientCode=String(row.clientCode??'').trim();
    const clientCode=sourceClientCode.padStart(5,'0');
    const clientName=String(row.clientName??'').trim();
    const productCode=String(row.productCode??'').trim();
    const historicalName=String(row.historicalName??'').trim();
    const quantity=Number(row.quantity);
    if(!sourceClientCode||!clientName||!productCode||!historicalName)throw new TypeError(`VENTAS fila ${line}: faltan campos obligatorios.`);
    if(!Number.isFinite(quantity))throw new TypeError(`VENTAS fila ${line}: Cantidad debe ser numérica.`);
    return {...row,period,year:Number(match[1]),month:Number(match[2]),clientCode,clientName,productCode,historicalName,quantity};
  });
}


/* src/data/dataset-validator.js */

const CONFIG_DATE_PATTERN=/^\d{4}-(0[1-9]|1[0-2])-([0-2]\d|3[01])$/;
const CONFIG_PERIOD_PATTERN=/^\d{4}-(0[1-9]|1[0-2])$/;

function validateCatalogRows(rows){
  if(!Array.isArray(rows)||!rows.length)throw new TypeError('El catálogo debe contener filas.');
  const seen=new Set();
  return rows.map((row,index)=>{
    const line=index+2,code=String(row?.code??'').trim(),name=String(row?.name??'').trim(),status=String(row?.status??'').trim();
    if(!code||!name||!status)throw new TypeError(`CATÁLOGO fila ${line}: faltan campos obligatorios.`);
    if(seen.has(code))throw new TypeError(`CATÁLOGO fila ${line}: código duplicado ${code}.`);
    seen.add(code);
    return {code,name,status};
  });
}

function validateDashboardConfig(config){
  const fechaActualizacion=String(config?.fechaActualizacion??'').trim();
  const ultimoMesCerrado=String(config?.ultimoMesCerrado??'').trim();
  const versionEsquema=Number(config?.versionEsquema);
  if(!CONFIG_DATE_PATTERN.test(fechaActualizacion)||Number.isNaN(Date.parse(`${fechaActualizacion}T12:00:00Z`)))throw new TypeError('CONFIG: fecha_actualizacion inválida.');
  if(!CONFIG_PERIOD_PATTERN.test(ultimoMesCerrado))throw new TypeError('CONFIG: ultimo_mes_cerrado debe usar YYYY-MM.');
  if(!Number.isInteger(versionEsquema)||versionEsquema<1)throw new TypeError('CONFIG: version_esquema inválida.');
  return {fechaActualizacion,ultimoMesCerrado,versionEsquema};
}

function validateDashboardDataset(dataset){
  if(!dataset||typeof dataset!=='object')throw new TypeError('Dataset inválido.');
  const sales=adaptSalesRows(dataset.sales),catalog=validateCatalogRows(dataset.catalog),config=validateDashboardConfig(dataset.config);
  if(!sales.length)throw new TypeError('VENTAS no contiene movimientos.');
  if(dataset.generatedAt&&!Number.isFinite(Date.parse(dataset.generatedAt)))throw new TypeError('generatedAt inválido.');
  return {sales,catalog,config,generatedAt:dataset.generatedAt||null};
}


/* src/data/sales.js */

const snapshotRows = [
['2026-01','09365','Accenture S.R.L.','IA0022','Refill Box Ofisnack Sala de Reuniones x 20 Bocaditos',1],['2026-01','05640','Prominente S.A.','IA0008','Box Ofisnack After Office x 12 productos',6],['2026-01','05640','Prominente S.A.','IA0019','Box Ofisnack Cine en Casa x 20 productos',4],['2026-01','05640','Prominente S.A.','IA0007','Box Ofisnack Desayuno x 13 productos',1],['2026-01','05640','Prominente S.A.','IA0012','Box Ofisnack Wellness x 12 productos',1],
['2026-02','09082','Corporación Afiliada Del Sur S.A.','IA0021','Box Ofisnack Sweets x 120 Caramelos',2],['2026-02','44876','Dutto, Marcos','IA0024','Box Ofisnack Special Edition Kids x 20 Snacks',1],['2026-02','43996','Mediterranean Shipping Company S.A.','IA0003','Box Ofisnack Special Edition Cumpleaños x 15 snack',1],['2026-02','05640','Prominente S.A.','IA0008','Box Ofisnack After Office x 12 productos',4],['2026-02','05640','Prominente S.A.','IA0019','Box Ofisnack Cine en Casa x 20 productos',2],
['2026-03','45420','Carena , Alberto','IA0011','Box Ofisnack All Stars x 25 productos',1],['2026-03','36964','Equanet S.A.','IA0012','Box Ofisnack Wellness x 12 productos',35],['2026-03','13222','First Corporate Finance Advisors S.A.','IA0022','Refill Box Ofisnack Sala de Reuniones x 20 Bocaditos',1],['2026-03','05640','Prominente S.A.','IA0008','Box Ofisnack After Office x 12 productos',3],['2026-03','05640','Prominente S.A.','IA0019','Box Ofisnack Cine en Casa x 20 productos',7],['2026-03','05640','Prominente S.A.','IA0007','Box Ofisnack Desayuno x 13 productos',1],['2026-03','05640','Prominente S.A.','IA0012','Box Ofisnack Wellness x 12 productos',4],
['2026-04','36965','ACS Soluciones S.A.','IA0012','Box Ofisnack Wellness x 12 productos',79],['2026-04','33375','Delegacion de Asociaciones Israelitas Argentinas','IA0001','Box Ofisnack Special Kids Edition x 50 Snacks',1],['2026-04','05640','Prominente S.A.','IA0008','Box Ofisnack After Office x 12 productos',4],['2026-04','05640','Prominente S.A.','IA0019','Box Ofisnack Cine en Casa x 20 productos',11],['2026-04','05640','Prominente S.A.','IA0007','Box Ofisnack Desayuno x 13 productos',1],['2026-04','05640','Prominente S.A.','IA0012','Box Ofisnack Wellness x 12 productos',1],['2026-04','41636','Vizrt South America S.A.','IA0011','Box Ofisnack All Stars x 30 productos',1],
['2026-05','41692','Ammaturo , Daniela','IA0024','Box Ofisnack Special Edition Kids x 20 Snacks',1],['2026-05','05640','Prominente S.A.','IA0008','Box Ofisnack After Office x 12 productos',3],['2026-05','05640','Prominente S.A.','IA0019','Box Ofisnack Cine en Casa x 20 productos',11],['2026-05','05640','Prominente S.A.','IA0007','Box Ofisnack Desayuno x 13 productos',1],['2026-05','05640','Prominente S.A.','IA0012','Box Ofisnack Wellness x 12 productos',1],
['2026-06','42402','Beone Medicines Argentina S.R.L.','IA0022','Refill Box Ofisnack Sala de Reuniones x 20 Bocaditos',1],['2026-06','36289','Media Monks Bs As SRL','IA0011','Box Ofisnack All Stars x 30 productos',2],['2026-06','43996','Mediterranean Shipping Company S.A.','IA0035','Box Ofisnack Special Edition Sorpresa Fit x 12 unidades',1],['2026-06','43996','Mediterranean Shipping Company S.A.','IA0034','Box Ofisnack Special Edition Sorpresa x 12 unidades',1],['2026-06','05640','Prominente S.A.','IA0008','Box Ofisnack After Office x 12 productos',1],['2026-06','05640','Prominente S.A.','IA0019','Box Ofisnack Cine en Casa x 20 productos',5],['2026-06','05640','Prominente S.A.','IA0007','Box Ofisnack Desayuno x 13 productos',2],
['2026-07','36289','Media Monks Bs As SRL','IA0001','Box Ofisnack Special Kids Edition x 50 Snacks',5],['2026-07','05640','Prominente S.A.','IA0008','Box Ofisnack After Office x 12 productos',1],['2026-07','05640','Prominente S.A.','IA0019','Box Ofisnack Cine en Casa x 20 productos',9],['2026-07','05640','Prominente S.A.','IA0007','Box Ofisnack Desayuno x 13 productos',2],
['2026-08','42402','Beone Medicines Argentina S.R.L.','IA0020','Box Ofisnack Sala de Reuniones x 20 Bocaditos',1],['2026-08','43996','Mediterranean Shipping Company S.A.','IA0035','Box Ofisnack Special Edition Sorpresa Fit x 12 unidades',-1],['2026-08','43996','Mediterranean Shipping Company S.A.','IA0034','Box Ofisnack Special Edition Sorpresa x 12 unidades',-1],['2026-08','05640','Prominente S.A.','IA0008','Box Ofisnack After Office x 12 productos',3],['2026-08','05640','Prominente S.A.','IA0019','Box Ofisnack Cine en Casa x 20 productos',5],['2026-08','05640','Prominente S.A.','IA0012','Box Ofisnack Wellness x 12 productos',2]
];
const localSalesSnapshot = snapshotRows.map(([period,clientCode,clientName,productCode,historicalName,quantity])=>({period,clientCode,clientName,productCode,historicalName,quantity}));
const rawSales = adaptSalesRows(localSalesSnapshot);


/* src/data/data-loader.js */

async function hydrateDashboardData({fallbackSales,fallbackCatalog,fallbackConfig,url='assets/data/dashboard-data.json'}){
  try{
    const response=await fetch(`${url}?v=${Date.now()}`,{cache:'no-store'});
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    const loaded=validateDashboardDataset(await response.json());
    fallbackSales.splice(0,fallbackSales.length,...loaded.sales);
    fallbackCatalog.splice(0,fallbackCatalog.length,...loaded.catalog);
    Object.assign(fallbackConfig,loaded.config);
    return {source:'generated',generatedAt:loaded.generatedAt,error:null};
  }catch(error){
    return {source:'fallback',generatedAt:null,error:error instanceof Error?error.message:String(error)};
  }
}


/* src/modules/normalizer.js */
function normalizeSales(rawSales, catalog){
  const byCode=new Map(catalog.map(p=>[p.code,p]));
  return rawSales.map(row=>{const current=byCode.get(row.productCode);return {...row,currentName:current?.name||row.historicalName,status:current?.status||'Discontinuado',inCurrentCatalog:Boolean(current)};});
}


/* src/modules/analytics.js */
const MONTHS=['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
let configuredLastCompletePeriod=null;
function configureAnalytics({lastCompletePeriod}={}){configuredLastCompletePeriod=lastCompletePeriod||null;}
const sum=rows=>rows.reduce((a,r)=>a+r.quantity,0);
function filterSales(rows,{year,month,client,product}){return rows.filter(r=>(!year||r.year==year)&&(!month||r.month==month)&&(!client||r.clientCode===client)&&(!product||r.productCode===product));}
function aggregate(rows,key){const m=new Map();rows.forEach(r=>m.set(r[key],(m.get(r[key])||0)+r.quantity));return m;}
function summarize(rows){
  const total=sum(rows); const clientTotals=aggregate(rows,'clientCode'); const productTotals=aggregate(rows,'productCode');
  const buyers=[...clientTotals].filter(([,v])=>v>0); const soldProducts=[...productTotals].filter(([,v])=>v>0);
  const clientMonths=new Map(); rows.forEach(r=>{if(r.quantity<=0)return;const k=`${r.clientCode}|${r.period}`;clientMonths.set(k,(clientMonths.get(k)||0)+r.quantity);});
  const monthSets=new Map(); [...clientMonths].filter(([,v])=>v>0).forEach(([k])=>{const [c,p]=k.split('|');if(!monthSets.has(c))monthSets.set(c,new Set());monthSets.get(c).add(p);});
  const recurring=[...monthSets.values()].filter(s=>s.size>1).length; const oneTime=[...monthSets.values()].filter(s=>s.size===1).length;
  const sortedClients=buyers.sort((a,b)=>b[1]-a[1]); const top3=sortedClients.slice(0,3).reduce((a,[,v])=>a+v,0);
  return {total,clients:buyers.length,portfolio:soldProducts.length,recurring,oneTime,top3Share:total>0?top3/total:0};
}
function monthly(rows){return Array.from({length:12},(_,i)=>rows.filter(r=>r.month===i+1).reduce((a,r)=>a+r.quantity,0));}
function ranking(rows,key,labelKey){const m=new Map();rows.forEach(r=>{const k=r[key],v=m.get(k)||{code:k,label:r[labelKey],value:0};v.value+=r.quantity;m.set(k,v);});return [...m.values()].filter(x=>x.value!==0).sort((a,b)=>b.value-a.value);}

function recurrenceLabel(monthCount){
  if(monthCount>=3)return 'Recurrente';
  if(monthCount===2)return 'Ocasional';
  return 'Compra única';
}

function clientPortfolio(rows){
  const total=rows.reduce((a,r)=>a+r.quantity,0),groups=new Map();
  rows.forEach(r=>{if(!groups.has(r.clientCode))groups.set(r.clientCode,[]);groups.get(r.clientCode).push(r)});
  return [...groups].map(([clientCode,items])=>{
    const net=items.reduce((a,r)=>a+r.quantity,0);
    const positive=items.filter(r=>r.quantity>0);
    const periodTotals=new Map();items.forEach(r=>periodTotals.set(r.period,(periodTotals.get(r.period)||0)+r.quantity));
    const buyingPeriods=[...periodTotals].filter(([,v])=>v>0).map(([p])=>p).sort();
    const productTotals=new Map();items.forEach(r=>productTotals.set(r.productCode,(productTotals.get(r.productCode)||0)+r.quantity));
    return {clientCode,clientName:items[0].clientName,net,share:total?net/total:0,positiveMovements:positive.length,months:buyingPeriods.length,products:[...productTotals.values()].filter(v=>v>0).length,lastPeriod:buyingPeriods.at(-1)||null,recurrence:recurrenceLabel(buyingPeriods.length),items};
  }).filter(c=>c.net>0).sort((a,b)=>b.net-a.net);
}

function clientSummary(rows,historyRows=rows){
  const visibleClients=clientPortfolio(rows),historyByClient=new Map(clientPortfolio(historyRows).map(c=>[c.clientCode,c]));
  const clients=visibleClients.map(client=>{
    const history=historyByClient.get(client.clientCode);
    return {...client,months:history?.months??client.months,recurrence:history?.recurrence??client.recurrence};
  });
  const total=rows.reduce((a,r)=>a+r.quantity,0);
  const distribution={Recurrente:0,Ocasional:0,'Compra única':0};clients.forEach(c=>distribution[c.recurrence]++);
  return {clients,total,unique:clients.length,multiMovement:clients.filter(c=>c.positiveMovements>1).length,multiMonth:clients.filter(c=>c.months>1).length,average:clients.length?total/clients.length:0,distribution};
}

function portfolioSummary(rows,catalog,allRows=rows){
  const total=sum(rows),catalogByCode=new Map(catalog.map(p=>[p.code,p]));
  const codes=new Set([...catalogByCode.keys(),...allRows.filter(r=>!catalogByCode.has(r.productCode)).map(r=>r.productCode)]);
  const products=[...codes].map(code=>{
    const itemRows=rows.filter(r=>r.productCode===code),history=allRows.filter(r=>r.productCode===code),catalogItem=catalogByCode.get(code);
    const net=sum(itemRows),clientTotals=aggregate(itemRows,'clientCode'),clients=[...clientTotals.values()].filter(v=>v>0).length;
    const periodTotals=aggregate(itemRows,'period'),positivePeriods=[...periodTotals].filter(([,v])=>v>0).map(([p])=>p).sort();
    const active=Boolean(catalogItem&&catalogItem.status==='Activo'),hadPositiveSale=itemRows.some(r=>r.quantity>0);
    const status=active?(net>0?'Activo con ventas':hadPositiveSale?'Venta neta anulada':'Activo sin ventas'):'Histórico / discontinuado';
    return {code,name:catalogItem?.name||history.at(-1)?.currentName||history.at(-1)?.historicalName||code,status,active,net,clients,share:total?net/total:0,lastPeriod:positivePeriods.at(-1)||null,items:itemRows};
  });
  const clientTotals=aggregate(rows,'clientCode');
  return {products,total,sold:products.filter(p=>p.net>0).length,buyers:[...clientTotals.values()].filter(v=>v>0).length,activeNoSales:products.filter(p=>p.status==='Activo sin ventas').length};
}

function boxSummary(rows,code,catalog){
  const itemRows=rows.filter(r=>r.productCode===code),net=sum(itemRows),total=sum(rows),clientTotals=aggregate(itemRows,'clientCode');
  const periodTotals=aggregate(itemRows,'period'),positivePeriods=[...periodTotals].filter(([,v])=>v>0).map(([p])=>p).sort();
  const catalogItem=catalog.find(p=>p.code===code),historyName=itemRows.at(-1)?.currentName||itemRows.at(-1)?.historicalName;
  return {code,name:catalogItem?.name||historyName||code,status:catalogItem?.status||'Histórico / discontinuado',net,total,share:total?net/total:0,clients:[...clientTotals.values()].filter(v=>v>0).length,months:positivePeriods.length,lastPeriod:positivePeriods.at(-1)||null,items:itemRows};
}

function opportunitySummary(rows,catalog,{year,asOf,lastCompletePeriod:requestedLastCompletePeriod}){
  const selectedYear=Number(year)||Math.max(...rows.map(r=>r.year)),asOfDate=new Date(`${asOf}T12:00:00`),asOfYear=asOfDate.getFullYear(),asOfMonth=asOfDate.getMonth()+1;
  const lastCompleteMonth=selectedYear<asOfYear?12:selectedYear===asOfYear?Math.max(1,asOfMonth-1):0;
  const operationalLastCompletePeriod=requestedLastCompletePeriod||configuredLastCompletePeriod;
  const configuredYear=Number(String(operationalLastCompletePeriod||'').slice(0,4));
  const lastCompletePeriod=operationalLastCompletePeriod&&configuredYear===selectedYear?operationalLastCompletePeriod:(lastCompleteMonth?`${selectedYear}-${String(lastCompleteMonth).padStart(2,'0')}`:null);
  const annualRows=rows.filter(r=>r.year===selectedYear),activeCatalog=catalog.filter(p=>p.status==='Activo'),activeCodes=new Set(activeCatalog.map(p=>p.code));
  const byClient=new Map();annualRows.forEach(r=>{if(!byClient.has(r.clientCode))byClient.set(r.clientCode,[]);byClient.get(r.clientCode).push(r)});
  const monthDistance=(from,to)=>{if(!from||!to)return 0;const [fy,fm]=from.split('-').map(Number),[ty,tm]=to.split('-').map(Number);return Math.max(0,(ty-fy)*12+tm-fm)};
  const clients=[...byClient].map(([clientCode,items])=>{
    const monthTotals=aggregate(items,'period'),positiveMonths=[...monthTotals].filter(([,v])=>v>0).map(([p])=>p).sort();
    const productTotals=aggregate(items,'productCode'),purchasedCodes=[...productTotals].filter(([,v])=>v>0).map(([code])=>code);
    const lastPeriod=positiveMonths.at(-1)||null,inactiveMonths=lastCompletePeriod?monthDistance(lastPeriod,lastCompletePeriod):0;
    const flags=[];if(positiveMonths.length>=2&&inactiveMonths>=2)flags.push('Reactivar');if(positiveMonths.length===1)flags.push('Convertir en recurrente');if(positiveMonths.length>=3&&purchasedCodes.length<3)flags.push('Ampliar portfolio');
    const precedence=['Reactivar','Convertir en recurrente','Ampliar portfolio'],primary=precedence.find(type=>flags.includes(type))||null;
    return {entity:'client',clientCode,name:items[0].clientName,months:positiveMonths.length,lastPeriod,inactiveMonths,products:purchasedCodes.length,available:activeCatalog.filter(p=>!purchasedCodes.includes(p.code)).length,primary,secondary:flags.filter(type=>type!==primary)};
  }).filter(c=>c.primary);
  const productTotals=aggregate(annualRows,'productCode'),positiveCodes=new Set(annualRows.filter(r=>r.quantity>0).map(r=>r.productCode));
  const products=activeCatalog.filter(p=>!positiveCodes.has(p.code)).map(p=>({entity:'product',code:p.code,name:p.name,net:productTotals.get(p.code)||0,primary:'Activar Box',secondary:[]}));
  const cancelledProducts=activeCatalog.filter(p=>positiveCodes.has(p.code)&&(productTotals.get(p.code)||0)<=0).map(p=>({entity:'product',code:p.code,name:p.name,net:productTotals.get(p.code)||0,primary:'Venta neta anulada',secondary:[]}));
  return {year:selectedYear,lastCompletePeriod,clients,products,cancelledProducts,counts:{reactivate:clients.filter(c=>c.primary==='Reactivar'||c.secondary.includes('Reactivar')).length,oneTime:clients.filter(c=>c.primary==='Convertir en recurrente'||c.secondary.includes('Convertir en recurrente')).length,expand:clients.filter(c=>c.primary==='Ampliar portfolio'||c.secondary.includes('Ampliar portfolio')).length,activate:products.length,netCancelled:cancelledProducts.length},activeCodes};
}


/* src/modules/charts.js */

const chartFmt=n=>new Intl.NumberFormat('es-AR',{maximumFractionDigits:1}).format(n);
function renderMonthly(el,values){const max=Math.max(...values,1);el.innerHTML=values.map((v,i)=>`<div class="month-col"><span class="bar-value">${v?chartFmt(v):''}</span><div class="bar-track"><div class="bar ${v<0?'negative':''}" style="height:${Math.max(Math.abs(v)/max*100,v?3:0)}%"></div></div><small>${MONTHS[i]}</small></div>`).join('');}
function renderRanking(el,items,total,{showCode=false,limit=6}={}){const max=Math.max(...items.map(x=>Math.abs(x.value)),1);el.innerHTML=items.slice(0,limit).map((x,i)=>`<div class="rank-row"><div class="rank-meta"><span class="rank-no">${i+1}</span><span class="rank-name">${showCode?`<small>${x.code}</small>`:''}${x.label}</span><strong>${chartFmt(x.value)}${showCode?` <em>${total?chartFmt(x.value/total*100):0}%</em>`:''}</strong></div><div class="rank-track"><i style="width:${Math.abs(x.value)/max*100}%"></i></div></div>`).join('')||'<p class="empty-inline">Sin datos para mostrar</p>';}
function renderRecurrence(el,recurring,oneTime){const total=recurring+oneTime,p=total?recurring/total*100:0;el.innerHTML=`<div class="donut" style="--p:${p}"><div><strong>${chartFmt(p)}%</strong><span>recurrentes</span></div></div><div class="recurrence-legend"><p><i class="rec"></i><span>Recurrentes</span><strong>${recurring}</strong></p><p><i class="once"></i><span>Compra puntual</span><strong>${oneTime}</strong></p></div>`;}


/* assets/js/app.js */







const dataLoadStatus=await hydrateDashboardData({fallbackSales:rawSales,fallbackCatalog:catalog,fallbackConfig:dashboardConfig});
configureAnalytics({lastCompletePeriod:dashboardConfig.ultimoMesCerrado});
const sales=normalizeSales(rawSales,catalog),$=s=>document.querySelector(s),fmt=n=>new Intl.NumberFormat('es-AR',{maximumFractionDigits:1}).format(n);
const sourceNote=$('#dataSourceNote'),rangeNote=$('#dataRangeNote'),periods=sales.map(row=>row.period).sort();
sourceNote.textContent=dataLoadStatus.source==='generated'?`Dataset actualizado · ${dashboardConfig.fechaActualizacion}`:`Dataset de respaldo · ${dashboardConfig.fechaActualizacion}`;
rangeNote.textContent=periods.length?`${periodName(periods[0])} — ${periodName(periods.at(-1))}`:'Sin períodos';
const filters={year:$('#yearFilter'),month:$('#monthFilter'),client:$('#clientFilter'),product:$('#productFilter')},opportunityTypeFilter=$('#opportunityTypeFilter'),OPPORTUNITY_AS_OF=dashboardConfig.fechaActualizacion;let sort={key:'period',direction:-1},clientSort={key:'net',direction:-1},productSort={key:'net',direction:-1},activeView='home',selectedClient=null,selectedProduct=null,portfolioRankingExpanded=false,portfolioCoverageExpanded=false,client360ReturnView='clients',box360ReturnView='portfolio';
function options(el,items,all){el.innerHTML=`<option value="">${all}</option>`+items.map(([v,l])=>`<option value="${v}">${l}</option>`).join('')}
options(filters.year,[...new Set(sales.map(r=>r.year))].sort().map(v=>[v,v]),'Todos los años');options(filters.month,MONTHS.map((v,i)=>[i+1,v]),'Todo el año');options(filters.client,[...new Map(sales.map(r=>[r.clientCode,r.clientName])).entries()].sort((a,b)=>a[1].localeCompare(b[1])),'Todos los clientes');options(filters.product,catalog.map(p=>[p.code,`${p.code} · ${p.name}`]).sort((a,b)=>a[1].localeCompare(b[1])),'Todos los boxes');
function state(){return{year:filters.year.value,month:filters.month.value,client:filters.client.value,product:filters.product.value}}
function render(){const current=state(),rows=filterSales(sales,current),clientRows=filterSales(sales,{...current,client:''}),portfolioRows=filterSales(sales,{...current,product:''}),annualRows=filterSales(sales,{year:current.year,month:'',client:'',product:''}),s=summarize(rows);$('#kpiUnits').textContent=fmt(s.total);$('#kpiClients').textContent=fmt(s.clients);$('#kpiPortfolio').textContent=fmt(s.portfolio);$('#kpiRecurring').textContent=fmt(s.recurring);renderMonthly($('#monthlyChart'),monthly(rows));renderRanking($('#productRanking'),ranking(rows,'productCode','currentName'),s.total,{showCode:true});renderRanking($('#clientRanking'),ranking(rows,'clientCode','clientName'),s.total,{limit:6});renderRecurrence($('#recurrenceChart'),s.recurring,s.oneTime);const pct=Math.max(0,Math.min(100,s.top3Share*100));$('#top3Share').textContent=`${fmt(pct)}%`;$('#concentrationGauge').style.setProperty('--p',pct);$('#concentrationText').textContent=s.total?`Los 3 principales clientes explican ${fmt(pct)}% de las unidades netas del período.`:'No hay ventas netas positivas en el período seleccionado.';renderTable(rows);renderClients(clientRows,annualRows);renderPortfolio(portfolioRows);renderOpportunities(current);if(activeView==='client360'&&selectedClient)renderClient360(selectedClient);if(activeView==='box360'&&selectedProduct)renderBox360(selectedProduct)}
function renderTable(rows){const sorted=[...rows].sort((a,b)=>{let x=a[sort.key],y=b[sort.key];return(typeof x==='number'?x-y:String(x).localeCompare(String(y),'es'))*sort.direction});$('#rowCount').textContent=`${rows.length} movimientos`;$('#emptyState').hidden=rows.length>0;$('#detailBody').innerHTML=sorted.map(r=>`<tr><td class="code">${r.clientCode}</td><td>${r.clientName}</td><td class="code product-code">${r.productCode}</td><td>${r.currentName}${r.historicalName!==r.currentName?'<span class="normalized">Normalizado</span>':''}</td><td class="numeric ${r.quantity<0?'negative-value':''}">${fmt(r.quantity)}</td></tr>`).join('')}
function periodName(period){if(!period)return '—';const [y,m]=period.split('-');return `${MONTHS[+m-1]} ${y}`}
function renderClients(rows,historyRows){const cs=clientSummary(rows,historyRows);$('#clientKpiUnique').textContent=fmt(cs.unique);$('#clientKpiRecurring').textContent=fmt(cs.multiMonth);$('#clientKpiUnits').textContent=fmt(cs.total);$('#clientKpiAverage').textContent=fmt(cs.average);renderRanking($('#clientsMainRanking'),cs.clients.map(c=>({code:c.clientCode,label:c.clientName,value:c.net})),cs.total,{limit:8});const max=Math.max(...Object.values(cs.distribution),1);$('#clientDistribution').innerHTML=Object.entries(cs.distribution).map(([label,value])=>`<div class="distribution-row"><div><span>${label}</span><strong>${value}</strong></div><div><i style="width:${value/max*100}%"></i></div></div>`).join('');renderClientTable(cs.clients)}
function renderClientTable(clients){const sorted=[...clients].sort((a,b)=>{const x=a[clientSort.key]??'',y=b[clientSort.key]??'';return(typeof x==='number'?x-y:String(x).localeCompare(String(y),'es'))*clientSort.direction});$('#clientTableCount').textContent=`${clients.length} clientes`;$('#clientTableBody').innerHTML=sorted.map(c=>`<tr><td><button class="client-link" data-client="${c.clientCode}"><span class="code">${c.clientCode}</span>${c.clientName}</button></td><td class="numeric"><strong>${fmt(c.net)}</strong></td><td class="numeric">${fmt(c.share*100)}%</td><td class="numeric">${c.months}</td><td class="numeric">${c.products}</td><td>${periodName(c.lastPeriod)}</td><td><span class="recurrence-badge ${c.recurrence.toLowerCase().replace(' ','-')}">${c.recurrence}</span></td><td><button class="row-arrow client-link" data-client="${c.clientCode}" aria-label="Ver detalle de ${c.clientName}">→</button></td></tr>`).join('');document.querySelectorAll('.client-link').forEach(b=>b.addEventListener('click',()=>showClient360(b.dataset.client)))}
function showClient360(clientCode,returnView){client360ReturnView=returnView||'clients';selectedClient=clientCode;filters.client.value=clientCode;$('#backToClients').textContent=client360ReturnView==='opportunities'?'← Volver a Oportunidades':'← Volver a Clientes';activeView='client360';showView('client360');renderClient360(clientCode);scrollTo({top:0,behavior:'smooth'})}
function returnToClients(){const target=client360ReturnView;selectedClient=null;filters.client.value='';showView(target);render();scrollTo({top:0,behavior:'smooth'})}
function renderClient360(clientCode){const baseState=state();baseState.client='';const baseRows=filterSales(sales,baseState),annualRows=filterSales(sales,{year:baseState.year,month:'',client:'',product:''}),cs=clientSummary(baseRows,annualRows),client=cs.clients.find(c=>c.clientCode===clientCode);if(!client){showView('clients');return}const items=baseRows.filter(r=>r.clientCode===clientCode);$('#client360Code').textContent=client.clientCode;$('#client360Name').textContent=client.clientName;$('#client360Badge').textContent=client.recurrence;$('#client360Units').textContent=fmt(client.net);$('#client360Share').textContent=`${fmt(client.share*100)}%`;$('#client360Months').textContent=client.months;$('#client360Products').textContent=client.products;$('#client360Last').textContent=periodName(client.lastPeriod);renderMonthly($('#client360Monthly'),monthly(items));renderRanking($('#client360Mix'),ranking(items,'productCode','currentName'),client.net,{showCode:true,limit:8});$('#client360MovementCount').textContent=`${items.length} movimientos`;$('#client360History').innerHTML=[...items].sort((a,b)=>b.period.localeCompare(a.period)).map(r=>`<tr><td>${periodName(r.period)}</td><td class="code product-code">${r.productCode}</td><td>${r.currentName}${r.historicalName!==r.currentName?'<span class="normalized">Normalizado</span>':''}</td><td class="numeric ${r.quantity<0?'negative-value':''}">${fmt(r.quantity)}</td></tr>`).join('')}
function statusClass(status){return status==='Activo sin ventas'?'no-sales':status.startsWith('Histórico')?'historical':''}
function renderPortfolio(rows){const ps=portfolioSummary(rows,catalog,sales);$('#portfolioKpiSold').textContent=fmt(ps.sold);$('#portfolioKpiUnits').textContent=fmt(ps.total);$('#portfolioKpiClients').textContent=fmt(ps.buyers);$('#portfolioKpiNoSales').textContent=fmt(ps.activeNoSales);renderPortfolioBars(ps.products.filter(p=>p.net>0).sort((a,b)=>b.net-a.net),ps.total);renderPortfolioCoverage(ps.products.filter(p=>p.clients>0).sort((a,b)=>b.clients-a.clients));const counts={'Activo con ventas':0,'Venta neta anulada':0,'Activo sin ventas':0,'Histórico / discontinuado':0};ps.products.forEach(p=>counts[p.status]++);$('#portfolioStatus').innerHTML=Object.entries(counts).map(([label,value])=>`<div class="status-chip"><span>${label}</span><strong>${value}</strong></div>`).join('');renderPortfolioTable(ps.products)}
function shortProductName(name){return name.replace(/^Refill Box Ofisnack /,'Refill ').replace(/^Box Ofisnack /,'').replace(/^Special Edition /,'').replace(/ x (\d+)/,' x$1').replace(/ (productos|unidades|Snacks|snack|Bocaditos|Caramelos)$/i,'')}
function renderPortfolioBars(products,total){const shown=portfolioRankingExpanded?products:products.slice(0,6),max=Math.max(...products.map(p=>Math.abs(p.net)),1);$('#portfolioRanking').innerHTML=shown.map(p=>`<button class="portfolio-bar product-link" data-product="${p.code}" title="${p.name}"><span class="portfolio-bar-head"><span class="portfolio-bar-label"><small class="portfolio-bar-code">${p.code}</small><span class="portfolio-bar-name">${shortProductName(p.name)}</span></span><strong class="portfolio-bar-value">${fmt(p.net)} <em>${total?fmt(p.net/total*100):0}%</em></strong></span><span class="portfolio-bar-track"><i style="width:${Math.abs(p.net)/max*100}%"></i></span></button>`).join('')||'<p class="empty-inline">Sin datos para mostrar</p>';$('#togglePortfolioRanking').hidden=products.length<=6;$('#togglePortfolioRanking').textContent=portfolioRankingExpanded?'Ver Top 6':'Ver todos los boxes';bindProductLinks()}
function renderPortfolioCoverage(products){const shown=portfolioCoverageExpanded?products:products.slice(0,6);$('#portfolioCoverage').innerHTML=shown.map(p=>`<button class="coverage-item product-link" data-product="${p.code}" title="${p.name}"><span class="coverage-top"><span><small class="coverage-code">${p.code}</small><span class="coverage-name">${shortProductName(p.name)}</span></span><span class="coverage-count"><strong>${p.clients}</strong> cliente${p.clients===1?'':'s'}</span></span><span class="coverage-dots">${Array.from({length:Math.min(p.clients,8)},()=>'<i></i>').join('')}${p.clients>8?`<small>+${p.clients-8}</small>`:''}</span></button>`).join('')||'<p class="empty-inline">Sin datos para mostrar</p>';$('#togglePortfolioCoverage').hidden=products.length<=6;$('#togglePortfolioCoverage').textContent=portfolioCoverageExpanded?'Ver Top 6':'Ver todos';bindProductLinks()}
function renderPortfolioTable(products){const sorted=[...products].sort((a,b)=>{const x=a[productSort.key]??'',y=b[productSort.key]??'';return(typeof x==='number'?x-y:String(x).localeCompare(String(y),'es'))*productSort.direction});$('#portfolioTableCount').textContent=`${products.length} productos`;$('#portfolioTableBody').innerHTML=sorted.map(p=>`<tr><td><button class="product-link code" data-product="${p.code}">${p.code}</button></td><td><button class="product-link" data-product="${p.code}">${p.name}</button></td><td><span class="portfolio-status ${statusClass(p.status)}">${p.status}</span></td><td class="numeric ${p.net<0?'negative-value':''}"><strong>${fmt(p.net)}</strong></td><td class="numeric">${p.clients}</td><td class="numeric">${fmt(p.share*100)}%</td><td>${periodName(p.lastPeriod)}</td><td><button class="row-arrow product-link" data-product="${p.code}" aria-label="Ver detalle de ${p.name}">→</button></td></tr>`).join('');bindProductLinks()}
function bindProductLinks(){document.querySelectorAll('.product-link[data-product]').forEach(b=>{if(b.dataset.bound)return;b.dataset.bound='1';b.addEventListener('click',()=>showBox360(b.dataset.product))})}
function showBox360(code,returnView){box360ReturnView=returnView||'portfolio';selectedProduct=code;filters.product.value=code;$('#backToPortfolio').textContent=box360ReturnView==='opportunities'?'← Volver a Oportunidades':'← Volver a Portfolio';showView('box360');renderBox360(code);scrollTo({top:0,behavior:'smooth'})}
function returnToPortfolio(){const target=box360ReturnView;selectedProduct=null;filters.product.value='';showView(target);render();scrollTo({top:0,behavior:'smooth'})}
function renderBox360(code){const current=state(),contextRows=filterSales(sales,{...current,product:''}),box=boxSummary(contextRows,code,catalog),items=box.items,clientRanks=ranking(items,'clientCode','clientName').filter(x=>x.value>0),dependencyRows=filterSales(sales,{...current,client:'',product:''}),dependencyBox=boxSummary(dependencyRows,code,catalog),dependencyRanks=ranking(dependencyBox.items,'clientCode','clientName').filter(x=>x.value>0),principal=dependencyRanks[0],pct=principal&&dependencyBox.net>0?principal.value/dependencyBox.net*100:0;$('#box360Code').textContent=box.code;$('#box360Name').textContent=box.name;$('#box360Status').textContent=box.status;$('#box360Status').className=`portfolio-status ${statusClass(box.status)}`;$('#box360Last').textContent=periodName(box.lastPeriod);$('#box360Units').textContent=fmt(box.net);$('#box360Clients').textContent=fmt(box.clients);$('#box360Share').textContent=`${fmt(box.share*100)}%`;$('#box360Months').textContent=fmt(box.months);renderMonthly($('#box360Monthly'),monthly(items));renderRanking($('#box360Buyers'),clientRanks,box.net,{limit:20});$('#box360Top3').textContent=`${fmt(pct)}%`;$('#box360Gauge').style.setProperty('--p',Math.max(0,Math.min(100,pct)));$('#box360PrincipalName').textContent=principal?.label||'Sin comprador principal';$('#box360PrincipalUnits').textContent=principal?`${fmt(principal.value)} de ${fmt(dependencyBox.net)} unidades`:'Sin unidades netas positivas';$('#box360ConcentrationText').textContent=principal?`${principal.label} explica el ${fmt(pct)}% de las unidades del box.`:'No hay compradores con saldo neto positivo en el período seleccionado.'}
function opportunityTypes(item){return[item.primary,...item.secondary]}
function renderOpportunities(current){const year=current.year||Math.max(...sales.map(r=>r.year)),os=opportunitySummary(sales,catalog,{year,asOf:OPPORTUNITY_AS_OF}),selectedClient=current.client,clients=os.clients.filter(c=>!selectedClient||c.clientCode===selectedClient),products=selectedClient?[]:os.products,cancelledProducts=selectedClient?[]:os.cancelledProducts,type=opportunityTypeFilter.value;const has=(item,t)=>opportunityTypes(item).includes(t),counts={reactivate:clients.filter(c=>has(c,'Reactivar')).length,oneTime:clients.filter(c=>has(c,'Convertir en recurrente')).length,expand:clients.filter(c=>has(c,'Ampliar portfolio')).length,activate:products.length};$('#opportunityKpiReactivate').textContent=fmt(counts.reactivate);$('#opportunityKpiOneTime').textContent=fmt(counts.oneTime);$('#opportunityKpiExpand').textContent=fmt(counts.expand);$('#opportunityKpiActivate').textContent=fmt(counts.activate);$('#opportunityContext').textContent=`Último mes completo para ${os.year}: ${periodName(os.lastCompletePeriod)} · Fuente actualizada el 24 Ago 2026`;$('#opportunityCancelledInfo').textContent=cancelledProducts.length?`Venta neta anulada: ${cancelledProducts.map(p=>p.code).join(', ')}.`:'Sin productos con venta neta anulada.';document.querySelectorAll('.opportunity-kpi').forEach(k=>k.classList.toggle('is-filtered',k.dataset.opportunityType===type));let items=[...clients,...products,...cancelledProducts];if(type)items=items.filter(item=>has(item,type));const priority={Reactivar:0,'Convertir en recurrente':1,'Ampliar portfolio':2,'Activar Box':3,'Venta neta anulada':4};items.sort((a,b)=>(priority[a.primary]-priority[b.primary])||a.name.localeCompare(b.name,'es'));$('#opportunityTableCount').textContent=`${items.length} prioridades`;$('#opportunityEmpty').hidden=items.length>0;$('#opportunityTableBody').innerHTML=items.map(opportunityRow).join('');document.querySelectorAll('.opportunity-client-link').forEach(b=>b.addEventListener('click',()=>showClient360(b.dataset.client,'opportunities')));document.querySelectorAll('.opportunity-product-link').forEach(b=>b.addEventListener('click',()=>showBox360(b.dataset.product,'opportunities')))}
function opportunityRow(item){const client=item.entity==='client',priority=item.primary==='Ampliar portfolio'?'MEDIA':item.primary==='Activar Box'||item.primary==='Venta neta anulada'?'PRODUCTO':'ALTA',priorityClass=priority.toLowerCase(),evidence=item.primary==='Reactivar'?`Última compra ${periodName(item.lastPeriod)} · ${item.inactiveMonths} meses completos sin compra`:item.primary==='Convertir en recurrente'?`1 mes con compra · Última compra ${periodName(item.lastPeriod)}`:item.primary==='Ampliar portfolio'?`Recurrente · ${item.products} boxes comprados · ${item.available} opciones activas no compradas`:item.primary==='Venta neta anulada'?`Tuvo venta positiva · saldo neto final ${fmt(item.net)}`:`Activo · nunca registró una venta positiva`,action=item.primary==='Reactivar'?'Contactar para generar una nueva compra.':item.primary==='Convertir en recurrente'?'Buscar una segunda compra.':item.primary==='Ampliar portfolio'?'Ofrecer nuevos Special Edition.':item.primary==='Venta neta anulada'?'Revisar devoluciones y definir una nueva activación.':'Impulsar entre clientes compradores.',secondary=item.secondary.length?`<small class="secondary-opportunity"><strong>También detectado:</strong> ${item.secondary.join(' · ')}</small>`:'';return`<tr><td><span class="priority-badge ${priorityClass}">${priority}</span></td><td><button class="opportunity-entity ${client?'opportunity-client-link':'opportunity-product-link'}" ${client?`data-client="${item.clientCode}"`:`data-product="${item.code}"`}><small>${client?item.clientCode:item.code}</small>${item.name}</button></td><td><span class="opportunity-type">${item.primary}</span></td><td class="opportunity-evidence">${evidence}${secondary}</td><td class="opportunity-action">${action}</td></tr>`}
function showView(view){document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));document.querySelectorAll('.nav-item[data-view]').forEach(n=>n.classList.toggle('active',n.dataset.view===view||(view==='box360'&&n.dataset.view===box360ReturnView)||(view==='client360'&&n.dataset.view===client360ReturnView)));const titles={home:['Vista ejecutiva','Una lectura clara del desempeño comercial de los boxes.'],clients:['Clientes','Comportamiento, relevancia y recurrencia de la cartera compradora.'],client360:['Cliente 360°','Detalle verificable de la relación comercial.'],portfolio:['Portfolio','Desempeño, alcance y vigencia del portfolio Special Edition.'],box360:['Box 360°','Detalle verificable del desempeño comercial del producto.'],opportunities:['Oportunidades','Prioridades comerciales detectadas a partir del comportamiento de compra.']};$('#'+view+'View').classList.add('active');$('#pageTitle').textContent=titles[view][0];$('#pageSubtitle').textContent=titles[view][1];activeView=view}
[filters.year,filters.month].forEach(el=>el.addEventListener('change',render));filters.client.addEventListener('change',()=>{const clientCode=filters.client.value;if(activeView==='client360'){if(clientCode)showClient360(clientCode,client360ReturnView);else returnToClients();return}render();if(['home','clients'].includes(activeView)&&clientCode)showClient360(clientCode)});filters.product.addEventListener('change',()=>{const code=filters.product.value;if(activeView==='box360'){if(code)showBox360(code,box360ReturnView);else returnToPortfolio();return}render();if(activeView==='portfolio'&&code)showBox360(code)});opportunityTypeFilter.addEventListener('change',render);$('#clearFilters').addEventListener('click',()=>{Object.values(filters).forEach(el=>el.value='');opportunityTypeFilter.value='';if(activeView==='client360'){returnToClients();return}if(activeView==='box360'){returnToPortfolio();return}render()});document.querySelectorAll('th button[data-sort]').forEach(b=>b.addEventListener('click',()=>{sort={key:b.dataset.sort,direction:sort.key===b.dataset.sort?-sort.direction:1};render()}));document.querySelectorAll('[data-client-sort]').forEach(b=>b.addEventListener('click',()=>{clientSort={key:b.dataset.clientSort,direction:clientSort.key===b.dataset.clientSort?-clientSort.direction:1};render()}));document.querySelectorAll('[data-product-sort]').forEach(b=>b.addEventListener('click',()=>{productSort={key:b.dataset.productSort,direction:productSort.key===b.dataset.productSort?-productSort.direction:1};render()}));document.querySelectorAll('.opportunity-kpi').forEach(k=>k.addEventListener('click',()=>{opportunityTypeFilter.value=opportunityTypeFilter.value===k.dataset.opportunityType?'':k.dataset.opportunityType;render()}));$('#togglePortfolioRanking').addEventListener('click',()=>{portfolioRankingExpanded=!portfolioRankingExpanded;render()});$('#togglePortfolioCoverage').addEventListener('click',()=>{portfolioCoverageExpanded=!portfolioCoverageExpanded;render()});document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{const view=b.dataset.view;if(view==='portfolio'){selectedProduct=null;filters.product.value='';showView('portfolio');render();return}showView(view)}));$('#backToClients').addEventListener('click',returnToClients);$('#backToPortfolio').addEventListener('click',returnToPortfolio);render();

})().catch(error=>{console.error(error);document.documentElement.dataset.loadError='true'});
