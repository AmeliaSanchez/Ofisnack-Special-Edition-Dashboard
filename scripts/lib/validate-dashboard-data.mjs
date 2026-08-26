import {validateDashboardDataset} from '../../src/data/dataset-validator.js';
import {normalizeSales} from '../../src/modules/normalizer.js';
import {summarize,clientSummary,portfolioSummary,opportunitySummary} from '../../src/modules/analytics.js';

const assert=(condition,message)=>{if(!condition)throw new Error(message)};
const equals=(actual,expected,label)=>assert(Object.is(actual,expected),`${label}: esperado ${expected}, obtenido ${actual}`);

export function validatePermanentRules(dataset){
  const validated=validateDashboardDataset(dataset),sales=normalizeSales(validated.sales,validated.catalog);
  const home=summarize(sales),clients=clientSummary(sales,sales),portfolio=portfolioSummary(sales,validated.catalog,sales);
  const latestYear=Math.max(...sales.map(row=>row.year));
  const opportunities=opportunitySummary(sales,validated.catalog,{year:latestYear,asOf:validated.config.fechaActualizacion,lastCompletePeriod:validated.config.ultimoMesCerrado});
  assert(home.total===sales.reduce((sum,row)=>sum+row.quantity,0),'Inicio no coincide con el saldo de VENTAS.');
  assert(clients.unique===clients.clients.length,'Clientes únicos inconsistente.');
  assert(portfolio.sold===portfolio.products.filter(product=>product.net>0).length,'Portfolio vendido inconsistente.');
  assert(!opportunities.products.some(product=>opportunities.cancelledProducts.some(cancelled=>cancelled.code===product.code)),'Un producto no puede ser Activo sin ventas y Venta neta anulada simultáneamente.');
  return {validated,sales,metrics:{home,clients,portfolio,opportunities}};
}

export function validateInitialEquivalence(dataset){
  const {sales,metrics}=validatePermanentRules(dataset),{home,clients,portfolio,opportunities}=metrics;
  equals(sales.length,46,'Snapshot / filas');
  equals(home.total,229,'Inicio / Boxes vendidos');equals(home.clients,14,'Inicio / Clientes');equals(home.portfolio,11,'Inicio / Portfolio');equals(home.recurring,4,'Inicio / Recurrentes');
  equals(clients.unique,14,'Clientes / únicos');equals(clients.multiMonth,4,'Clientes / recurrentes');equals(clients.total,229,'Clientes / unidades');equals(clients.average,229/14,'Clientes / promedio');
  equals(portfolio.sold,11,'Portfolio / vendidos');equals(portfolio.total,229,'Portfolio / unidades');equals(portfolio.buyers,14,'Portfolio / compradores');equals(portfolio.activeNoSales,4,'Portfolio / sin ventas');
  equals(opportunities.counts.reactivate,0,'Oportunidades / reactivar');equals(opportunities.counts.oneTime,10,'Oportunidades / compra única');equals(opportunities.counts.expand,0,'Oportunidades / ampliar');equals(opportunities.counts.activate,4,'Oportunidades / activar');
  equals(clients.clients.find(client=>client.clientCode==='05640')?.net,96,'Prominente');
  assert(opportunities.cancelledProducts.map(product=>product.code).sort().join(',')==='IA0034,IA0035','Venta neta anulada incorrecta.');
  return metrics;
}
