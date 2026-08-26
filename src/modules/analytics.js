export const MONTHS=['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
let configuredLastCompletePeriod=null;
export function configureAnalytics({lastCompletePeriod}={}){configuredLastCompletePeriod=lastCompletePeriod||null;}
const sum=rows=>rows.reduce((a,r)=>a+r.quantity,0);
export function filterSales(rows,{year,month,client,product}){return rows.filter(r=>(!year||r.year==year)&&(!month||r.month==month)&&(!client||r.clientCode===client)&&(!product||r.productCode===product));}
function aggregate(rows,key){const m=new Map();rows.forEach(r=>m.set(r[key],(m.get(r[key])||0)+r.quantity));return m;}
export function summarize(rows){
  const total=sum(rows); const clientTotals=aggregate(rows,'clientCode'); const productTotals=aggregate(rows,'productCode');
  const buyers=[...clientTotals].filter(([,v])=>v>0); const soldProducts=[...productTotals].filter(([,v])=>v>0);
  const clientMonths=new Map(); rows.forEach(r=>{if(r.quantity<=0)return;const k=`${r.clientCode}|${r.period}`;clientMonths.set(k,(clientMonths.get(k)||0)+r.quantity);});
  const monthSets=new Map(); [...clientMonths].filter(([,v])=>v>0).forEach(([k])=>{const [c,p]=k.split('|');if(!monthSets.has(c))monthSets.set(c,new Set());monthSets.get(c).add(p);});
  const recurring=[...monthSets.values()].filter(s=>s.size>1).length; const oneTime=[...monthSets.values()].filter(s=>s.size===1).length;
  const sortedClients=buyers.sort((a,b)=>b[1]-a[1]); const top3=sortedClients.slice(0,3).reduce((a,[,v])=>a+v,0);
  return {total,clients:buyers.length,portfolio:soldProducts.length,recurring,oneTime,top3Share:total>0?top3/total:0};
}
export function monthly(rows){return Array.from({length:12},(_,i)=>rows.filter(r=>r.month===i+1).reduce((a,r)=>a+r.quantity,0));}
export function ranking(rows,key,labelKey){const m=new Map();rows.forEach(r=>{const k=r[key],v=m.get(k)||{code:k,label:r[labelKey],value:0};v.value+=r.quantity;m.set(k,v);});return [...m.values()].filter(x=>x.value!==0).sort((a,b)=>b.value-a.value);}

export function recurrenceLabel(monthCount){
  if(monthCount>=3)return 'Recurrente';
  if(monthCount===2)return 'Ocasional';
  return 'Compra única';
}

export function clientPortfolio(rows){
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

export function clientSummary(rows,historyRows=rows){
  const visibleClients=clientPortfolio(rows),historyByClient=new Map(clientPortfolio(historyRows).map(c=>[c.clientCode,c]));
  const clients=visibleClients.map(client=>{
    const history=historyByClient.get(client.clientCode);
    return {...client,months:history?.months??client.months,recurrence:history?.recurrence??client.recurrence};
  });
  const total=rows.reduce((a,r)=>a+r.quantity,0);
  const distribution={Recurrente:0,Ocasional:0,'Compra única':0};clients.forEach(c=>distribution[c.recurrence]++);
  return {clients,total,unique:clients.length,multiMovement:clients.filter(c=>c.positiveMovements>1).length,multiMonth:clients.filter(c=>c.months>1).length,average:clients.length?total/clients.length:0,distribution};
}

export function portfolioSummary(rows,catalog,allRows=rows){
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

export function boxSummary(rows,code,catalog){
  const itemRows=rows.filter(r=>r.productCode===code),net=sum(itemRows),total=sum(rows),clientTotals=aggregate(itemRows,'clientCode');
  const periodTotals=aggregate(itemRows,'period'),positivePeriods=[...periodTotals].filter(([,v])=>v>0).map(([p])=>p).sort();
  const catalogItem=catalog.find(p=>p.code===code),historyName=itemRows.at(-1)?.currentName||itemRows.at(-1)?.historicalName;
  return {code,name:catalogItem?.name||historyName||code,status:catalogItem?.status||'Histórico / discontinuado',net,total,share:total?net/total:0,clients:[...clientTotals.values()].filter(v=>v>0).length,months:positivePeriods.length,lastPeriod:positivePeriods.at(-1)||null,items:itemRows};
}

export function opportunitySummary(rows,catalog,{year,asOf,lastCompletePeriod:requestedLastCompletePeriod}){
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
