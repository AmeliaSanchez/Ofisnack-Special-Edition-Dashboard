import {hydrateDashboardData} from '../src/data/data-loader.js';

const originalFetch=globalThis.fetch,assert=(condition,message)=>{if(!condition)throw new Error(message)};
const fallbackSales=[{period:'2026-01',year:2026,month:1,clientCode:'00001',clientName:'Fallback',productCode:'IA0001',historicalName:'Box',quantity:1}];
const fallbackCatalog=[{code:'IA0001',name:'Box',status:'Activo'}],fallbackConfig={fechaActualizacion:'2026-08-24',ultimoMesCerrado:'2026-07',versionEsquema:1};
const before=JSON.stringify({fallbackSales,fallbackCatalog,fallbackConfig});

try{
  globalThis.fetch=async()=>{throw new Error('sin conexión')};
  const offline=await hydrateDashboardData({fallbackSales,fallbackCatalog,fallbackConfig});
  assert(offline.source==='fallback','La falta de conexión no activó el fallback.');
  assert(JSON.stringify({fallbackSales,fallbackCatalog,fallbackConfig})===before,'El fallo de red modificó el snapshot válido.');
  globalThis.fetch=async()=>({ok:true,json:async()=>({sales:[{period:'2026-13'}],catalog:[],config:{}})});
  const invalid=await hydrateDashboardData({fallbackSales,fallbackCatalog,fallbackConfig});
  assert(invalid.source==='fallback','Un dataset inválido no activó el fallback.');
  assert(JSON.stringify({fallbackSales,fallbackCatalog,fallbackConfig})===before,'El dataset inválido modificó el snapshot válido.');
  console.log('Fallback validado: red ausente y dataset inválido conservan el snapshot.');
}finally{globalThis.fetch=originalFetch}
