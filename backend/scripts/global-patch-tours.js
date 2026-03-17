'use strict'
const fs = require('fs')
const path = require('path')

const files = [
  'node_modules/.strapi/vite/deps/App-FB6C3BMB.js',
  'node_modules/.strapi/vite/deps/chunk-R6PIPLEI.js',
  'node_modules/.strapi/vite/deps/chunk-WHGVKQ7B.js',
  'node_modules/.strapi/vite/deps/chunk-KBQXP57A.js',
  'node_modules/.strapi/vite/deps/chunk-BHQR6FWR.js',
]

for (const rel of files) {
  const abs = path.join(__dirname, '..', rel)
  if (!fs.existsSync(abs)) { console.log('SKIP (not found):', rel); continue }
  let src = fs.readFileSync(abs, 'utf8')
  
  // Replace state.tours with state?.tours
  // Replace s.state.tours with s.state?.tours
  const original = src
  src = src.replace(/state\.tours(?!\?)/g, 'state?.tours')
  src = src.replace(/s\.state\.tours(?!\?)/g, 's.state?.tours')
  
  if (src !== original) {
    fs.writeFileSync(abs, src, 'utf8')
    console.log('✅ Patched:', rel)
  } else {
    console.log('NO CHANGE:', rel)
  }
}
