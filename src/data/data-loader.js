import {validateDashboardDataset} from './dataset-validator.js';

export async function hydrateDashboardData({fallbackSales,fallbackCatalog,fallbackConfig,url='assets/data/dashboard-data.json'}){
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
