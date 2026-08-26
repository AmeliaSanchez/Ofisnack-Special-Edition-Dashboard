const PERIOD_PATTERN=/^(\d{4})-(0[1-9]|1[0-2])$/;

export function adaptSalesRows(rows){
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
