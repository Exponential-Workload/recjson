const childProcess = require('child_process');
const { writeFileSync, readFileSync } = require('fs');
const oldPkg = readFileSync('package.json')
const pkg = JSON.parse(readFileSync('package.json', 'utf-8'))
pkg.private = 'true';
pkg.main = 'dist/lib.web.cjs';
pkg.module = 'dist/lib.web.mjs';
pkg.source = 'src/web.ts';
pkg.targets = {
  main: {
    includeNodeModules: true,
    context: 'browser',
  }
};
delete pkg.types;
writeFileSync('src/web.ts', `export * as exports from './main';
// @ts-ignore
window.exports = exports;
`)
try {
  writeFileSync('package.json', JSON.stringify(pkg));
  // build cjs
  childProcess.execSync(`parcel build ${JSON.stringify(pkg.source)}`, {
    stdio: 'inherit'
  });
  // minify
  (['lib.web.cjs', 'lib.web.mjs']).forEach;
  writeFileSync('package.json', oldPkg);
} catch (error) {
  writeFileSync('package.json', oldPkg);
  throw error;
}
