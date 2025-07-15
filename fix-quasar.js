// fix-quasar.js
// Script de pós-instalação para corrigir loader do Quasar
const fs = require('fs');
const path = require('path');

// Caminho do loader problemático
const loaderPath = path.resolve(__dirname, 'node_modules/@quasar/app-webpack/lib/webpack/loader.js.transform-quasar-imports.js');

try {
  let code = fs.readFileSync(loaderPath, 'utf8');

  // RegExp para localizar a função importTransformation original
  const importTransformRegex = /const importTransformation[\s\S]*?\};/;

  // Nova implementação com fallback usando import-map.json
  const newImportTransformation = `const getPackage = require('../helpers/get-package');
const getPkgTransform = getPackage('quasar/dist/transforms/import-transformation.js');
const importMap = require('quasar/dist/transforms/import-map.json');

// Fallback function quando não há import-transformation.js
const importTransformation = (name) => {
  if (typeof getPkgTransform === 'function') {
    return getPkgTransform(name);
  }
  const relPath = importMap[name];
  if (!relPath) {
    throw new Error(\`Could not transform import for Quasar component: \\${name}\`);
  }
  return `quasar/\\${relPath}`;
};`;

  if (importTransformRegex.test(code)) {
    code = code.replace(importTransformRegex, newImportTransformation);
    fs.writeFileSync(loaderPath, code, 'utf8');
    console.log('Loader do Quasar corrigido com sucesso.');
  } else {
    console.warn('Não foi possível localizar a função importTransformation para substituição.');
  }
} catch (err) {
  console.error('Erro ao corrigir loader do Quasar:', err);
  process.exit(1);
}
