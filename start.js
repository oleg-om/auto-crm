// Transpile all code following this line with babel and use 'env' (aka ES6) preset.
// Extensions widened to pick up .ts/.tsx as the server migrates to TypeScript
// file by file (babel.config.js already includes @babel/preset-typescript -
// this only strips types, it doesn't type-check; `yarn typecheck` is the gate).
require('@babel/register')({
  extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.cjs', '.ts', '.tsx']
})

module.exports = require('./server/server.js')
