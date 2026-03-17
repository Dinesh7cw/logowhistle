'use strict'
const fs = require('fs')
const path = require('path')

const files = [
  'node_modules/@strapi/strapi/node_modules/@strapi/admin/dist/admin/admin/src/components/GuidedTour/Steps/ContentTypeBuilderSteps.mjs',
  'node_modules/@strapi/core/node_modules/@strapi/admin/dist/admin/admin/src/components/GuidedTour/Steps/ContentTypeBuilderSteps.mjs',
  'node_modules/@strapi/admin/dist/admin/admin/src/components/GuidedTour/Steps/ContentTypeBuilderSteps.mjs',
]

const UNSAFE = 'state.tours.contentTypeBuilder.currentStep'
const SAFE   = 'state.tours?.contentTypeBuilder?.currentStep ?? 0'

let patchCount = 0
for (const rel of files) {
  const abs = path.join(__dirname, '..', rel)
  if (!fs.existsSync(abs)) { console.log('SKIP (not found):', rel); continue }
  let src = fs.readFileSync(abs, 'utf8')
  const count = (src.match(new RegExp(UNSAFE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length
  if (count === 0) { console.log('SKIP (already patched or no match):', rel); continue }
  src = src.replaceAll(UNSAFE, SAFE)
  fs.writeFileSync(abs, src, 'utf8')
  console.log(`✅ Patched ${count} occurrence(s) in:`, rel)
  patchCount += count
}
console.log(`\nTotal replacements: ${patchCount}`)
