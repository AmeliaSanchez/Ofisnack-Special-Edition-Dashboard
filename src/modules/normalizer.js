export function normalizeSales(rawSales, catalog){
  const byCode=new Map(catalog.map(p=>[p.code,p]));
  return rawSales.map(row=>{const current=byCode.get(row.productCode);return {...row,currentName:current?.name||row.historicalName,status:current?.status||'Discontinuado',inCurrentCatalog:Boolean(current)};});
}
