import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

const root=resolve(import.meta.dirname,'..');
const sources=[
  'src/data/source-config.js',
  'src/data/catalog.js',
  'src/data/sales-adapter.js',
  'src/data/dataset-validator.js',
  'src/data/sales.js',
  'src/data/data-loader.js',
  'src/modules/normalizer.js',
  'src/modules/analytics.js',
  'src/modules/charts.js',
  'assets/js/app.js'
];

const body=sources.map(file=>{
  const code=readFileSync(resolve(root,file),'utf8')
    .replace(/^import .*;\s*$/gm,'')
    .replace(/^export\s+/gm,'');
  return `\n/* ${file} */\n${code}`;
}).join('\n');

writeFileSync(resolve(root,'assets/js/app.bundle.js'),`/* Generated from modular source. Do not edit directly. */\n(async()=>{\n'use strict';\n${body}\n})().catch(error=>{console.error(error);document.documentElement.dataset.loadError='true'});\n`);
