export const sourceConfig = {
  type: 'local-ventas-validation',
  salesSheet: 'VENTAS',
  catalogSheet: 'listado de boxes Special Edition',
  configSheet: 'Dashboard_Config',
  snapshotThrough: '2026-08',
  adapter: 'src/data/sales-adapter.js'
};

export const dashboardConfig = {
  fechaActualizacion: '2026-08-24',
  ultimoMesCerrado: '2026-07',
  versionEsquema: 1
};
