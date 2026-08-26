import {adaptSalesRows} from './sales-adapter.js';

const CONFIG_DATE_PATTERN=/^\d{4}-(0[1-9]|1[0-2])-([0-2]\d|3[01])$/;
const CONFIG_PERIOD_PATTERN=/^\d{4}-(0[1-9]|1[0-2])$/;

export function validateCatalogRows(rows){
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

export function validateDashboardConfig(config){
  const fechaActualizacion=String(config?.fechaActualizacion??'').trim();
  const ultimoMesCerrado=String(config?.ultimoMesCerrado??'').trim();
  const versionEsquema=Number(config?.versionEsquema);
  if(!CONFIG_DATE_PATTERN.test(fechaActualizacion)||Number.isNaN(Date.parse(`${fechaActualizacion}T12:00:00Z`)))throw new TypeError('CONFIG: fecha_actualizacion inválida.');
  if(!CONFIG_PERIOD_PATTERN.test(ultimoMesCerrado))throw new TypeError('CONFIG: ultimo_mes_cerrado debe usar YYYY-MM.');
  if(!Number.isInteger(versionEsquema)||versionEsquema<1)throw new TypeError('CONFIG: version_esquema inválida.');
  return {fechaActualizacion,ultimoMesCerrado,versionEsquema};
}

export function validateDashboardDataset(dataset){
  if(!dataset||typeof dataset!=='object')throw new TypeError('Dataset inválido.');
  const sales=adaptSalesRows(dataset.sales),catalog=validateCatalogRows(dataset.catalog),config=validateDashboardConfig(dataset.config);
  if(!sales.length)throw new TypeError('VENTAS no contiene movimientos.');
  if(dataset.generatedAt&&!Number.isFinite(Date.parse(dataset.generatedAt)))throw new TypeError('generatedAt inválido.');
  return {sales,catalog,config,generatedAt:dataset.generatedAt||null};
}
