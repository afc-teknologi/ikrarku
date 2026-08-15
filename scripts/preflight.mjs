import fs from 'node:fs'
import process from 'node:process'

const [major, minor] = process.versions.node.split('.').map(Number)
if (major < 22 || (major === 22 && minor < 13)) {
  console.error(`Node.js ${process.versions.node} is unsupported. Use Node.js 22.13.0 or newer.`)
  process.exit(1)
}

const lock = fs.readFileSync(new URL('../package-lock.json', import.meta.url), 'utf8')
const forbidden = ['packages.applied-caas', 'internal.api.openai', 'packages.hub']
const found = forbidden.find(value => lock.includes(value))
if (found) {
  console.error(`package-lock.json contains forbidden internal registry reference: ${found}`)
  process.exit(1)
}

if (process.env.NODE_ENV === 'production') {
  const required = ['CLIENT_ORIGIN','ADMIN_BOOTSTRAP_PASSWORD']
  const missing = required.filter(key => !process.env[key])
  if (missing.length) {
    console.error(`Missing production environment variables: ${missing.join(', ')}`)
    process.exit(1)
  }
  if (['admin','password','changeme','CHANGE_ME_USE_A_LONG_RANDOM_PASSWORD'].includes(process.env.ADMIN_BOOTSTRAP_PASSWORD || '')) {
    console.error('ADMIN_BOOTSTRAP_PASSWORD masih menggunakan nilai default/placeholder. Gunakan password staging yang kuat.')
    process.exit(1)
  }
  if (!process.env.SMTP_HOST) console.warn('SMTP_HOST is empty. Verification and receipt emails will remain in email_outbox.')
}

console.log('Preflight passed.')
console.log(`Node.js: ${process.versions.node}`)
console.log('Package lock: public registry only')
