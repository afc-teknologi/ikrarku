import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { DatabaseSync } from 'node:sqlite'
import bcrypt from 'bcryptjs'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import multer from 'multer'
import PDFDocument from 'pdfkit'
import nodemailer from 'nodemailer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = Number(process.env.API_PORT || 5180)
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'
const NODE_ENV = process.env.NODE_ENV || 'development'
const DIST_DIR = path.resolve(__dirname, '..', 'dist')
const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(__dirname, 'data'))
const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || path.join(__dirname, 'uploads'))
const RECEIPT_DIR = path.resolve(process.env.RECEIPT_DIR || path.join(__dirname, 'receipts'))
const DB_FILE = path.resolve(process.env.DB_FILE || path.join(DATA_DIR, 'ikrarku.sqlite'))
for (const dir of [DATA_DIR, UPLOAD_DIR, RECEIPT_DIR]) fs.mkdirSync(dir, { recursive: true })

const db = new DatabaseSync(DB_FILE)
db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;')

const now = () => new Date().toISOString()
const id = (prefix) => `${prefix}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`
const parseJson = (value, fallback = null) => {
  try { return value ? JSON.parse(value) : fallback } catch { return fallback }
}

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS roles (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      permissions_json TEXT NOT NULL DEFAULT '[]',
      is_system INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL DEFAULT '',
      email TEXT UNIQUE NOT NULL,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role_id TEXT NOT NULL REFERENCES roles(id),
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS templates (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      price INTEGER NOT NULL DEFAULT 0,
      currency TEXT NOT NULL DEFAULT 'IDR',
      status TEXT NOT NULL DEFAULT 'Pending',
      preview_url TEXT,
      accent TEXT NOT NULL DEFAULT '#125946',
      background TEXT NOT NULL DEFAULT '#f7f2e8',
      premium INTEGER NOT NULL DEFAULT 0,
      preset TEXT NOT NULL DEFAULT 'classic',
      created_by TEXT REFERENCES users(id),
      approved_by TEXT REFERENCES users(id),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      category TEXT NOT NULL,
      excerpt TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'Draft',
      author_id TEXT REFERENCES users(id),
      tags_json TEXT NOT NULL DEFAULT '[]',
      cover_url TEXT,
      published_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sounds (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      file_name TEXT,
      file_path TEXT,
      mime_type TEXT,
      created_by TEXT REFERENCES users(id),
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS media_assets (
      id TEXT PRIMARY KEY,
      owner_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      category TEXT NOT NULL DEFAULT 'general',
      original_name TEXT NOT NULL,
      file_name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      size_bytes INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS payment_methods (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      label TEXT NOT NULL,
      enabled INTEGER NOT NULL DEFAULT 1,
      config_json TEXT NOT NULL DEFAULT '{}',
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_no TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL DEFAULT '',
      template_id TEXT NOT NULL REFERENCES templates(id),
      amount INTEGER NOT NULL,
      currency TEXT NOT NULL DEFAULT 'IDR',
      payment_method TEXT,
      payment_status TEXT NOT NULL DEFAULT 'Pending',
      order_status TEXT NOT NULL DEFAULT 'Awaiting Payment',
      assigned_cs_id TEXT REFERENCES users(id),
      assigned_editor_id TEXT REFERENCES users(id),
      receipt_no TEXT,
      receipt_path TEXT,
      created_at TEXT NOT NULL,
      paid_at TEXT
    );
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'Open',
      priority TEXT NOT NULL DEFAULT 'Normal',
      assigned_user_id TEXT REFERENCES users(id),
      assigned_role_id TEXT REFERENCES roles(id),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      order_id TEXT REFERENCES orders(id) ON DELETE SET NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'Open',
      assigned_cs_id TEXT REFERENCES users(id),
      channel TEXT NOT NULL DEFAULT 'Web',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
      sender_type TEXT NOT NULL,
      sender_user_id TEXT REFERENCES users(id),
      body TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sites (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL DEFAULT '',
      slug TEXT NOT NULL DEFAULT '',
      template_id TEXT REFERENCES templates(id),
      canvas_json TEXT NOT NULL DEFAULT '[]',
      status TEXT NOT NULL DEFAULT 'Draft',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS site_assignments (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      editor_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      assigned_by TEXT REFERENCES users(id) ON DELETE SET NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS rsvp_responses (
      id TEXT PRIMARY KEY,
      site_id TEXT NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
      canvas_id TEXT NOT NULL,
      guest_name TEXT NOT NULL,
      email TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL,
      pax INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS greetings (
      id TEXT PRIMARY KEY,
      site_id TEXT NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
      canvas_id TEXT NOT NULL DEFAULT '',
      guest_name TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS platform_settings (
      key TEXT PRIMARY KEY,
      value_json TEXT NOT NULL DEFAULT '{}',
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS email_outbox (
      id TEXT PRIMARY KEY,
      to_email TEXT NOT NULL,
      subject TEXT NOT NULL,
      html TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Queued',
      attachment_path TEXT,
      error TEXT,
      created_at TEXT NOT NULL,
      sent_at TEXT
    );
    CREATE TABLE IF NOT EXISTS conversation_reads (
      conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      last_read_at TEXT NOT NULL,
      PRIMARY KEY(conversation_id,user_id)
    );
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      actor_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT,
      details_json TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS site_revisions (
      id TEXT PRIMARY KEY,
      site_id TEXT NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
      actor_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      title TEXT NOT NULL DEFAULT '',
      slug TEXT NOT NULL DEFAULT '',
      template_id TEXT,
      canvas_json TEXT NOT NULL DEFAULT '[]',
      status TEXT NOT NULL DEFAULT 'Draft',
      reason TEXT NOT NULL DEFAULT 'Save',
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS site_autosaves (
      user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      actor_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      title TEXT NOT NULL DEFAULT '',
      slug TEXT NOT NULL DEFAULT '',
      template_id TEXT,
      canvas_json TEXT NOT NULL DEFAULT '[]',
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS template_revisions (
      id TEXT PRIMARY KEY,
      template_id TEXT NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
      actor_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      metadata_json TEXT NOT NULL DEFAULT '{}',
      canvas_json TEXT NOT NULL DEFAULT '[]',
      reason TEXT NOT NULL DEFAULT 'Save',
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS template_autosaves (
      template_id TEXT PRIMARY KEY REFERENCES templates(id) ON DELETE CASCADE,
      actor_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
      canvas_json TEXT NOT NULL DEFAULT '[]',
      updated_at TEXT NOT NULL
    );
  `)

  const ensureColumn = (table, column, definition) => {
    const columns = db.prepare(`PRAGMA table_info(${table})`).all().map(item => item.name)
    if (!columns.includes(column)) db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`)
  }
  ensureColumn('tasks','task_type',"TEXT NOT NULL DEFAULT 'General'")
  ensureColumn('tasks','template_id','TEXT')
  ensureColumn('tasks','requestor_id','TEXT')
  ensureColumn('tasks','decision_note',"TEXT NOT NULL DEFAULT ''")
  ensureColumn('users','email_verified',"INTEGER NOT NULL DEFAULT 1")
  ensureColumn('users','verification_token','TEXT')
  ensureColumn('users','verification_expires','TEXT')
  ensureColumn('users','settings_json',"TEXT NOT NULL DEFAULT '{}'")
  ensureColumn('templates','canvas_json',"TEXT NOT NULL DEFAULT '[]'")
  ensureColumn('conversations','public_token','TEXT')
  ensureColumn('orders','user_id','TEXT')
  ensureColumn('orders','gateway_ref','TEXT')
  try { db.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_sites_slug_unique ON sites(slug) WHERE slug <> ''") } catch { /* legacy duplicate slug can be corrected in CMS */ }
  db.exec("UPDATE templates SET status='Published' WHERE status IN ('Published','Approved')")
  db.exec("UPDATE users SET email_verified=1 WHERE email_verified IS NULL OR role_id!='role_user'")

  const roleSeeds = [
    ['role_admin', 'Admin', ['*'], 1],
    ['role_editor', 'Editor', ['dashboard.editor','users.view','sites.manage.assigned','templates.view','templates.create','templates.edit','canvas.manage','tasks.view','tasks.update','articles.view','articles.manage','sounds.view','conversations.view','conversations.reply','conversations.outbound'], 1],
    ['role_cs', 'Customer Service', ['dashboard.cs','tasks.view','tasks.update','conversations.view','conversations.reply','conversations.outbound','orders.view','articles.view'], 1],
    ['role_user', 'User', ['dashboard.user','templates.view','canvas.manage','canvas.manage.own','articles.view','orders.create','orders.view.own'], 1],
  ]
  const insertRole = db.prepare(`INSERT OR IGNORE INTO roles(id,name,permissions_json,is_system,created_at) VALUES(?,?,?,?,?)`)
  for (const [rid, name, permissions, system] of roleSeeds) insertRole.run(rid, name, JSON.stringify(permissions), system, now())
  for (const [rid, _name, permissions] of roleSeeds) db.prepare('UPDATE roles SET permissions_json=? WHERE id=?').run(JSON.stringify(permissions), rid)

  const userCount = db.prepare('SELECT COUNT(*) count FROM users').get().count
  if (!userCount) {
    const bootstrapPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD || (NODE_ENV === 'production' ? '' : 'admin')
    if (!bootstrapPassword) throw new Error('ADMIN_BOOTSTRAP_PASSWORD wajib di-set untuk deployment production/staging.')
    const bootstrapUsername = process.env.ADMIN_BOOTSTRAP_USERNAME || 'admin'
    const bootstrapEmail = process.env.ADMIN_BOOTSTRAP_EMAIL || 'admin@ikrarku.local'
    const insertUser = db.prepare(`INSERT INTO users(id,first_name,last_name,email,username,password_hash,role_id,active,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?)`)
    insertUser.run('user_admin','Platform','Admin',bootstrapEmail,bootstrapUsername,bcrypt.hashSync(bootstrapPassword,10),'role_admin',1,now(),now())
  }

  // Ensure at least one active Customer Service and one active Editor exist so paid orders
  // can be assigned (payment is rejected otherwise). Idempotent: only seeds when missing.
  const domain=(process.env.ADMIN_BOOTSTRAP_EMAIL||'admin@ikrarku.local').split('@')[1]||'ikrarku.local'
  const staffPassword=process.env.STAFF_BOOTSTRAP_PASSWORD||process.env.ADMIN_BOOTSTRAP_PASSWORD||(NODE_ENV==='production'?crypto.randomBytes(18).toString('base64'):'staff')
  const ensureStaff=(roleId,uname,fname)=>{
    const existing=db.prepare('SELECT COUNT(*) count FROM users WHERE role_id=? AND active=1').get(roleId).count
    if(existing) return
    try{
      db.prepare(`INSERT INTO users(id,first_name,last_name,email,username,password_hash,role_id,active,email_verified,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?)`)
        .run(id('usr'),fname,'ikrarku',`${uname}@${domain}`,uname,bcrypt.hashSync(staffPassword,10),roleId,1,1,now(),now())
    }catch{/* username/email may already exist */}
  }
  ensureStaff('role_cs','cs','Customer Service')
  ensureStaff('role_editor','editor','Web Designer')

  const templateCount = db.prepare('SELECT COUNT(*) count FROM templates').get().count
  if (!templateCount) {
    const insert = db.prepare(`INSERT INTO templates(id,name,category,description,price,currency,status,preview_url,accent,background,premium,preset,created_by,approved_by,canvas_json,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
    const rows = [
      ['split-serenity','Split Serenity','Editorial','Layout editorial dua kolom dengan panel fixed dan area cerita yang dapat di-scroll.',499000,'IDR','Published','/themes/split-reference.png','#f4eadc','#17241f',0,'split'],
      ['cinematic-story','Cinema Night','Cinematic','Pengalaman undangan sinematik dengan kontras gelap, scene-based storytelling, dan motion premium.',699000,'IDR','Published',null,'#e11d2e','#090909',1,'cinematic'],
      ['storybook-magic','Storybook Magic','Fairytale','Tema fairytale modern dengan chapter storytelling, warna lembut, dan aksen champagne gold.',649000,'IDR','Published',null,'#d7b66f','#dceafa',1,'storybook'],
    ]
    for (const row of rows) insert.run(...row,'user_admin','user_admin','[]',now(),now())
  }

  const methodCount = db.prepare('SELECT COUNT(*) count FROM payment_methods').get().count
  if (!methodCount) {
    const insert = db.prepare(`INSERT INTO payment_methods(id,code,label,enabled,config_json,updated_at) VALUES(?,?,?,?,?,?)`)
    insert.run('pay_qris','QRIS','QRIS',1,JSON.stringify({merchantName:'ikrarku Sites', instructions:'Scan QR melalui aplikasi pembayaran.'}),now())
    insert.run('pay_gopay','GOPAY','GoPay',1,JSON.stringify({merchantName:'ikrarku Sites', instructions:'Lanjutkan ke aplikasi GoPay.'}),now())
    insert.run('pay_card','CARD','Debit / Credit Card',1,JSON.stringify({merchantName:'ikrarku Sites', instructions:'Masukkan informasi kartu melalui payment gateway.'}),now())
  }

  const settingInsert=db.prepare(`INSERT OR IGNORE INTO platform_settings(key,value_json,updated_at) VALUES(?,?,?)`)
  settingInsert.run('staging',JSON.stringify({appName:'ikrarku Sites',maintenanceMode:false}),now())
}
initDb()

const app = express()
app.disable('x-powered-by')
app.set('trust proxy', 1)
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }))
app.use(express.json({ limit: '25mb' }))
app.use('/uploads', express.static(UPLOAD_DIR))
app.use('/receipts', express.static(RECEIPT_DIR))
const upload = multer({ dest: UPLOAD_DIR, limits: { fileSize: 25 * 1024 * 1024 } })

function userPayload(user) {
  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    name: `${user.first_name} ${user.last_name}`.trim(),
    email: user.email,
    username: user.username,
    roleId: user.role_id,
    role: user.role_name,
    permissions: parseJson(user.permissions_json, []),
    emailVerified: Boolean(user.email_verified),
    settings: parseJson(user.settings_json, {}),
  }
}
function auth(req, res, next) {
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '')
  if (!token) return res.status(401).json({ error: 'Authentication required' })
  const row = db.prepare(`SELECT s.token,s.expires_at,u.*,r.name role_name,r.permissions_json FROM sessions s JOIN users u ON u.id=s.user_id JOIN roles r ON r.id=u.role_id WHERE s.token=?`).get(token)
  if (!row || new Date(row.expires_at) < new Date()) return res.status(401).json({ error: 'Session expired' })
  req.user = userPayload(row)
  req.token = token
  next()
}
function permit(permission) {
  return (req,res,next) => {
    const permissions = req.user?.permissions || []
    if (permissions.includes('*') || permissions.includes(permission)) return next()
    res.status(403).json({ error: 'Permission denied' })
  }
}

function hasPermission(user, permission) {
  const permissions=user?.permissions || []
  return permissions.includes('*') || permissions.includes(permission)
}
function canManageSiteFor(user, targetUserId) {
  if (!user) return false
  if (user.id === targetUserId) return true
  if (hasPermission(user,'*')) return true
  if (!hasPermission(user,'sites.manage.assigned')) return false
  const assignment=db.prepare('SELECT editor_id FROM site_assignments WHERE user_id=?').get(targetUserId)
  return assignment?.editor_id === user.id
}
function normalizeSlug(value='') { return String(value).toLowerCase().trim().replace(/[^a-z0-9-]/g,'').replace(/^-+|-+$/g,'') }
function escapeHtml(value='') { return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char])) }

function auditLog(actorUserId, action, entityType, entityId='', details={}) {
  try { db.prepare('INSERT INTO audit_logs(id,actor_user_id,action,entity_type,entity_id,details_json,created_at) VALUES(?,?,?,?,?,?,?)').run(id('audit'),actorUserId||null,action,entityType,entityId||null,JSON.stringify(details||{}),now()) } catch { /* audit failure should not break the business transaction */ }
}
function saveSiteRevision(site, actorUserId, reason='Save') {
  if(!site) return
  db.prepare('INSERT INTO site_revisions(id,site_id,actor_user_id,title,slug,template_id,canvas_json,status,reason,created_at) VALUES(?,?,?,?,?,?,?,?,?,?)').run(id('srev'),site.id,actorUserId||null,site.title||'',site.slug||'',site.template_id||null,site.canvas_json||'[]',site.status||'Draft',reason,now())
}
function saveTemplateRevision(template, actorUserId, reason='Save') {
  if(!template) return
  const metadata={name:template.name,category:template.category,description:template.description,price:template.price,currency:template.currency,status:template.status,accent:template.accent,background:template.background,premium:template.premium,preset:template.preset}
  db.prepare('INSERT INTO template_revisions(id,template_id,actor_user_id,metadata_json,canvas_json,reason,created_at) VALUES(?,?,?,?,?,?,?)').run(id('trev'),template.id,actorUserId||null,JSON.stringify(metadata),template.canvas_json||'[]',reason,now())
}
function optionalUser(req) {
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '')
  if(!token) return null
  const row=db.prepare(`SELECT s.token,s.expires_at,u.*,r.name role_name,r.permissions_json FROM sessions s JOIN users u ON u.id=s.user_id JOIN roles r ON r.id=u.role_id WHERE s.token=?`).get(token)
  if(!row || new Date(row.expires_at)<new Date()) return null
  return userPayload(row)
}

const rateBuckets = new Map()
function rateLimit(name, max, windowMs) {
  return (req,res,next) => {
    const key=`${name}:${req.ip || req.socket.remoteAddress || 'unknown'}`
    const timestamp=Date.now(); const bucket=rateBuckets.get(key) || {count:0,reset:timestamp+windowMs}
    if(timestamp>bucket.reset){bucket.count=0;bucket.reset=timestamp+windowMs}
    bucket.count += 1; rateBuckets.set(key,bucket)
    if(bucket.count>max){res.setHeader('Retry-After',String(Math.ceil((bucket.reset-timestamp)/1000)));return res.status(429).json({error:'Terlalu banyak permintaan. Silakan coba lagi beberapa saat.'})}
    next()
  }
}

app.get('/api/health', (_req,res) => res.json({ ok:true, database:'sqlite', time:now() }))

app.get('/api/public/bootstrap', (_req,res) => {
  const templates = db.prepare(`SELECT * FROM templates WHERE status IN ('Published','Approved') ORDER BY created_at DESC`).all().map(mapTemplate)
  const articles = db.prepare(`SELECT a.*,u.first_name||' '||u.last_name author FROM articles a LEFT JOIN users u ON u.id=a.author_id WHERE a.status='Published' ORDER BY COALESCE(a.published_at,a.created_at) DESC`).all().map(mapArticle)
  const paymentMethods = db.prepare(`SELECT * FROM payment_methods WHERE enabled=1 ORDER BY label`).all().map(mapPayment)
  res.json({ templates, articles, paymentMethods, environment: NODE_ENV === 'production' ? 'production' : 'staging' })
})

app.get('/api/public/sites/:slug', (_req,res) => {
  const row=db.prepare(`SELECT s.*,t.name template_name,t.preset template_preset,t.accent template_accent,t.background template_background FROM sites s LEFT JOIN templates t ON t.id=s.template_id WHERE s.slug=? AND s.status='Published'`).get(_req.params.slug)
  if(!row)return res.status(404).json({error:'Website tidak ditemukan'})
  res.json({id:row.id,title:row.title,slug:row.slug,templateId:row.template_id,template:{name:row.template_name,preset:row.template_preset,accent:row.template_accent,bg:row.template_background},sections:parseJson(row.canvas_json,[]),status:row.status})
})
app.post('/api/public/sites/:slug/rsvp', (req,res) => {
  const site=db.prepare(`SELECT id FROM sites WHERE slug=? AND status='Published'`).get(req.params.slug); if(!site)return res.status(404).json({error:'Website tidak ditemukan'})
  const responseId=id('rsvp'); const {canvasId='',name,status='Menunggu',pax=0,email=''}=req.body||{}; if(!name)return res.status(400).json({error:'Nama tamu wajib diisi'})
  db.prepare('INSERT INTO rsvp_responses(id,site_id,canvas_id,guest_name,email,status,pax,created_at) VALUES(?,?,?,?,?,?,?,?)').run(responseId,site.id,canvasId,name,email,status,Number(pax)||0,now()); res.status(201).json({id:responseId})
})
app.post('/api/public/sites/:slug/greetings', (req,res) => {
  const site=db.prepare(`SELECT id FROM sites WHERE slug=? AND status='Published'`).get(req.params.slug); if(!site)return res.status(404).json({error:'Website tidak ditemukan'})
  const greetingId=id('greeting'); const {canvasId='',name,message}=req.body||{}; if(!name||!message)return res.status(400).json({error:'Nama dan pesan wajib diisi'})
  db.prepare('INSERT INTO greetings(id,site_id,canvas_id,guest_name,message,created_at) VALUES(?,?,?,?,?,?)').run(greetingId,site.id,canvasId,name,message,now()); res.status(201).json({id:greetingId})
})
app.post('/api/public/chat', rateLimit('public-chat',30,60_000), (req,res) => {
  const {name='Website Visitor',email='',phone='',body,channel='Web',conversationToken=''}=req.body||{}; if(!String(body).trim())return res.status(400).json({error:'Pesan wajib diisi'})
  const existingConversation=conversationToken?db.prepare('SELECT * FROM conversations WHERE public_token=?').get(conversationToken):null
  const conversation=existingConversation||createOrFindConversation({customerName:name,customerEmail:email,customerPhone:phone,channel})
  const messageId=id('msg'); db.prepare(`INSERT INTO messages(id,conversation_id,sender_type,body,created_at) VALUES(?,?,?,?,?)`).run(messageId,conversation.id,'customer',String(body).trim(),now()); db.prepare('UPDATE conversations SET updated_at=? WHERE id=?').run(now(),conversation.id)
  res.status(201).json({conversationId:conversation.id,conversationToken:conversation.public_token,messageId,assignedCsId:conversation.assigned_cs_id})
})

app.post('/api/auth/login', rateLimit('login',12,60_000), (req,res) => {
  const { username, password } = req.body || {}
  const row = db.prepare(`SELECT u.*,r.name role_name,r.permissions_json FROM users u JOIN roles r ON r.id=u.role_id WHERE u.username=?`).get(username)
  if (!row || !bcrypt.compareSync(String(password || ''), row.password_hash)) return res.status(401).json({ error:'Username atau password tidak valid' })
  if (!row.active || !row.email_verified) return res.status(403).json({ error:'Email belum diverifikasi. Silakan cek email konfirmasi Anda.' })
  const token = crypto.randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + 7*24*60*60*1000).toISOString()
  db.prepare(`INSERT INTO sessions(token,user_id,expires_at,created_at) VALUES(?,?,?,?)`).run(token,row.id,expires,now())
  res.json({ token, user:userPayload(row) })
})
app.post('/api/auth/signup', rateLimit('signup',8,60_000), (req,res) => {
  const { firstName, lastName='', email, username, password, passwordConfirm } = req.body || {}
  if (!firstName || !email || !username || !password || !passwordConfirm) return res.status(400).json({ error:'Data registrasi belum lengkap' })
  if (String(password).length < 8) return res.status(400).json({ error:'Password minimal 8 karakter' })
  if (password !== passwordConfirm) return res.status(400).json({ error:'Konfirmasi password tidak sama' })
  if (db.prepare('SELECT 1 FROM users WHERE email=? OR username=?').get(email,username)) return res.status(409).json({ error:'Email atau username sudah digunakan' })
  const userId=id('usr')
  const verificationToken=crypto.randomBytes(32).toString('hex')
  const verificationExpires=new Date(Date.now()+24*60*60*1000).toISOString()
  db.prepare(`INSERT INTO users(id,first_name,last_name,email,username,password_hash,role_id,active,email_verified,verification_token,verification_expires,settings_json,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(userId,firstName,lastName,email,username,bcrypt.hashSync(password,10),'role_user',0,0,verificationToken,verificationExpires,JSON.stringify({notificationSoundMuted:false}),now(),now())
  db.prepare(`INSERT INTO sites(id,user_id,title,slug,canvas_json,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?)`).run(id('site'),userId,`${firstName} ${lastName}`.trim(),username,'[]','Draft',now(),now())
  const verifyUrl=`${CLIENT_ORIGIN.replace(/\/$/,'')}/verify-email?token=${verificationToken}`
  queueEmail(email,'Konfirmasi akun ikrarku',`<h2>Konfirmasi email Anda</h2><p>Halo ${firstName}, klik tautan berikut untuk mengaktifkan akun ikrarku Anda:</p><p><a href="${verifyUrl}">Verifikasi Email</a></p><p>Tautan berlaku selama 24 jam.</p>`)
  res.status(201).json({ ok:true, verificationRequired:true, emailQueued:true, ...(NODE_ENV!=='production'?{devVerificationUrl:verifyUrl}:{}) })
})
app.post('/api/auth/verify-email', (req,res) => {
  const token=String(req.body?.token||'')
  const row=db.prepare('SELECT * FROM users WHERE verification_token=?').get(token)
  if(!row) return res.status(400).json({error:'Token verifikasi tidak valid'})
  if(!row.verification_expires || new Date(row.verification_expires).getTime()<Date.now()) return res.status(400).json({error:'Token verifikasi telah kedaluwarsa'})
  db.prepare(`UPDATE users SET active=1,email_verified=1,verification_token=NULL,verification_expires=NULL,updated_at=? WHERE id=?`).run(now(),row.id)
  queueEmail(row.email,'Akun ikrarku aktif',`<h2>Akun berhasil diverifikasi</h2><p>Halo ${row.first_name}, akun Anda sudah aktif dan dapat digunakan untuk login.</p>`)
  res.json({ok:true})
})
app.post('/api/auth/resend-verification', rateLimit('verify-resend',8,60_000), (req,res) => {
  const email=String(req.body?.email||'').trim().toLowerCase()
  const row=db.prepare('SELECT * FROM users WHERE email=?').get(email)
  if(!row || row.email_verified) return res.json({ok:true,message:'Jika akun memerlukan verifikasi, email baru telah dikirim.'})
  const token=crypto.randomBytes(32).toString('hex'); const expires=new Date(Date.now()+24*60*60*1000).toISOString()
  db.prepare('UPDATE users SET verification_token=?,verification_expires=?,updated_at=? WHERE id=?').run(token,expires,now(),row.id)
  const verifyUrl=`${CLIENT_ORIGIN.replace(/\/$/,'')}/verify-email?token=${token}`
  queueEmail(row.email,'Konfirmasi akun ikrarku',`<h2>Konfirmasi email Anda</h2><p>Halo ${escapeHtml(row.first_name)}, klik tautan berikut untuk mengaktifkan akun ikrarku Anda:</p><p><a href="${verifyUrl}">Verifikasi Email</a></p><p>Tautan berlaku selama 24 jam.</p>`)
  res.json({ok:true,message:'Email verifikasi dikirim ulang.',...(NODE_ENV!=='production'||!process.env.SMTP_HOST?{devVerificationUrl:verifyUrl}:{})})
})
app.get('/api/me', auth, (req,res) => res.json({ user:req.user }))
app.patch('/api/me', auth, (req,res) => {
  const { firstName,lastName,email,password,currentPassword,settings } = req.body || {}
  const current = db.prepare('SELECT * FROM users WHERE id=?').get(req.user.id)
  if(password && String(password).length < 8) return res.status(400).json({error:'Password minimal 8 karakter'})
  const nextEmail=String(email ?? current.email).trim().toLowerCase()
  const sensitiveChange = Boolean(password) || nextEmail !== String(current.email).toLowerCase()
  if(sensitiveChange && (!currentPassword || !bcrypt.compareSync(String(currentPassword), current.password_hash))) return res.status(401).json({error:'Password saat ini diperlukan untuk mengubah email atau password'})
  const duplicate=db.prepare('SELECT id FROM users WHERE email=? AND id<>?').get(nextEmail,req.user.id)
  if(duplicate) return res.status(409).json({error:'Email sudah digunakan akun lain'})
  const hash = password ? bcrypt.hashSync(String(password),10) : current.password_hash
  const nextSettings={...parseJson(current.settings_json,{}),...(settings||{})}
  db.prepare(`UPDATE users SET first_name=?,last_name=?,email=?,password_hash=?,settings_json=?,updated_at=? WHERE id=?`).run(firstName ?? current.first_name,lastName ?? current.last_name,nextEmail,hash,JSON.stringify(nextSettings),now(),req.user.id)
  auditLog(req.user.id,'account.update','user',req.user.id,{emailChanged:nextEmail!==String(current.email).toLowerCase(),passwordChanged:Boolean(password)})
  res.json({ ok:true, settings:nextSettings })
})
app.post('/api/auth/logout', auth, (req,res) => { db.prepare('DELETE FROM sessions WHERE token=?').run(req.token); res.json({ok:true}) })

function mapTemplate(row) { return { id:row.id,name:row.name,category:row.category,description:row.description,price:row.price,currency:row.currency,status:row.status,preview:row.preview_url,accent:row.accent,bg:row.background,premium:Boolean(row.premium),preset:row.preset,createdBy:row.created_by,approvedBy:row.approved_by,createdAt:row.created_at,canvasSections:parseJson(row.canvas_json,[]) } }
function mapArticle(row) { return { id:row.id,title:row.title,slug:row.slug,category:row.category,excerpt:row.excerpt,content:row.content,status:row.status,author:row.author || '',tags:parseJson(row.tags_json,[]),coverUrl:row.cover_url,date:row.published_at || row.created_at,views:'0' } }
function mapPayment(row) { return { id:row.id,code:row.code,label:row.label,enabled:Boolean(row.enabled),config:parseJson(row.config_json,{}) } }
function queueEmail(toEmail, subject, html, attachmentPath=null) {
  const outboxId=id('mail')
  db.prepare(`INSERT INTO email_outbox(id,to_email,subject,html,status,attachment_path,created_at) VALUES(?,?,?,?,?,?,?)`).run(outboxId,toEmail,subject,html,process.env.SMTP_HOST?'Queued':'Ready for SMTP',attachmentPath,now())
  void deliverEmail(outboxId)
  return outboxId
}
function createOrFindConversation({customerName,customerEmail,customerPhone='',assignedCsId=null,channel='Web',orderId=null}) {
  let row = customerEmail ? db.prepare(`SELECT * FROM conversations WHERE customer_email=? AND status IN ('Open','Pending') ORDER BY updated_at DESC LIMIT 1`).get(customerEmail) : null
  if (row) return row
  const conversationId=id('conv')
  const csId=assignedCsId || chooseAssignee('role_cs')
  const publicToken=crypto.randomBytes(24).toString('hex')
  db.prepare(`INSERT INTO conversations(id,order_id,customer_name,customer_email,customer_phone,status,assigned_cs_id,channel,created_at,updated_at,public_token) VALUES(?,?,?,?,?,?,?,?,?,?,?)`).run(conversationId,orderId,customerName||'Website Visitor',customerEmail||'',customerPhone,'Open',csId,channel,now(),now(),publicToken)
  return db.prepare('SELECT * FROM conversations WHERE id=?').get(conversationId)
}

app.get('/api/templates', auth, (req,res) => {
  const isAdmin = req.user.permissions.includes('*')
  const rows = isAdmin ? db.prepare('SELECT * FROM templates ORDER BY created_at DESC').all() : db.prepare(`SELECT * FROM templates WHERE status IN ('Published','Approved') OR created_by=? ORDER BY created_at DESC`).all(req.user.id)
  res.json(rows.map(mapTemplate))
})
app.post('/api/templates', auth, permit('templates.create'), (req,res) => {
  const { name,category='Elegant',description='',price=0,accent='#125946',bg='#f7f2e8',premium=false,preset='classic',preview=null,canvasJson=[] } = req.body || {}
  if (!name) return res.status(400).json({error:'Nama template wajib diisi'})
  const templateId=id('tpl')
  const status=req.user.permissions.includes('*')?'Published':'Pending'
  db.prepare(`INSERT INTO templates(id,name,category,description,price,currency,status,preview_url,accent,background,premium,preset,created_by,approved_by,canvas_json,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(templateId,name,category,description,Number(price)||0,'IDR',status,preview,accent,bg,premium?1:0,preset,req.user.id,status==='Published'?req.user.id:null,JSON.stringify(canvasJson||[]),now(),now())
  if(status==='Pending') {
    db.prepare(`INSERT INTO tasks(id,title,description,status,priority,assigned_role_id,task_type,template_id,requestor_id,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?)`).run(id('task'),`Approval template: ${name}`,`Review harga, deskripsi, dan kelayakan template ${name}.`,'Open','High','role_admin','Approval',templateId,req.user.id,now(),now())
    queueEmail(req.user.email,`Template ${name} menunggu approval`,`<h2>Pengajuan template diterima</h2><p>Template <strong>${name}</strong> telah masuk ke antrean approval Superadmin.</p><p>Status saat ini: Pending.</p>`)
  }
  res.status(201).json(mapTemplate(db.prepare('SELECT * FROM templates WHERE id=?').get(templateId)))
})
app.patch('/api/templates/:id', auth, (req,res) => {
  const row=db.prepare('SELECT * FROM templates WHERE id=?').get(req.params.id)
  if(!row) return res.status(404).json({error:'Template tidak ditemukan'})
  const canAll=req.user.permissions.includes('*')
  if(!canAll && row.created_by!==req.user.id) return res.status(403).json({error:'Tidak dapat mengubah template ini'})
  const next={...row,...req.body,canvas_json:req.body.canvasJson!==undefined?JSON.stringify(req.body.canvasJson):row.canvas_json}
  const requestedStatus=req.body.status==='Approved'?'Published':req.body.status
  const status=canAll && requestedStatus ? requestedStatus : row.status
  saveTemplateRevision(row,req.user.id,'Before save')
  db.prepare(`UPDATE templates SET name=?,category=?,description=?,price=?,status=?,preview_url=?,accent=?,background=?,premium=?,preset=?,approved_by=?,canvas_json=?,updated_at=? WHERE id=?`).run(next.name,next.category,next.description,Number(next.price)||0,status,next.preview ?? next.preview_url,next.accent,next.bg ?? next.background,next.premium?1:0,next.preset,status==='Published'?req.user.id:row.approved_by,next.canvas_json,now(),row.id)
  db.prepare('DELETE FROM template_autosaves WHERE template_id=?').run(row.id)
  res.json(mapTemplate(db.prepare('SELECT * FROM templates WHERE id=?').get(row.id)))
})

app.put('/api/templates/:id/autosave', auth, permit('templates.edit'), (req,res) => {
  const row=db.prepare('SELECT * FROM templates WHERE id=?').get(req.params.id); if(!row)return res.status(404).json({error:'Template tidak ditemukan'})
  if(!req.user.permissions.includes('*') && row.created_by!==req.user.id)return res.status(403).json({error:'Tidak dapat mengubah template ini'})
  db.prepare(`INSERT INTO template_autosaves(template_id,actor_user_id,canvas_json,updated_at) VALUES(?,?,?,?) ON CONFLICT(template_id) DO UPDATE SET actor_user_id=excluded.actor_user_id,canvas_json=excluded.canvas_json,updated_at=excluded.updated_at`).run(row.id,req.user.id,JSON.stringify(req.body.canvasJson||[]),now())
  res.json({ok:true,updatedAt:now()})
})
app.get('/api/templates/:id/revisions', auth, (req,res) => {
  const row=db.prepare('SELECT * FROM templates WHERE id=?').get(req.params.id); if(!row)return res.status(404).json({error:'Template tidak ditemukan'})
  if(!req.user.permissions.includes('*') && row.created_by!==req.user.id)return res.status(403).json({error:'Tidak dapat melihat revisi template ini'})
  res.json(db.prepare(`SELECT r.*,u.first_name||' '||u.last_name actor_name FROM template_revisions r LEFT JOIN users u ON u.id=r.actor_user_id WHERE r.template_id=? ORDER BY r.created_at DESC LIMIT 30`).all(row.id).map(r=>({...r,metadata:parseJson(r.metadata_json,{}),sections:parseJson(r.canvas_json,[])})))
})
app.post('/api/templates/:id/review', auth, (req,res) => {
  if(!(req.user.permissions.includes('*') || req.user.permissions.includes('templates.approve'))) return res.status(403).json({error:'Permission denied'})
  const row=db.prepare(`SELECT t.*,u.email requestor_email,u.first_name||' '||u.last_name requestor_name FROM templates t LEFT JOIN users u ON u.id=t.created_by WHERE t.id=?`).get(req.params.id)
  if(!row)return res.status(404).json({error:'Template tidak ditemukan'})
  const decision=String(req.body.decision||'').toLowerCase()
  if(!['approved','published','rejected','reject'].includes(decision))return res.status(400).json({error:'Decision harus Approved atau Reject'})
  const status=['approved','published'].includes(decision)?'Published':'Rejected'
  const feedback=String(req.body.feedback||'')
  db.prepare(`UPDATE templates SET status=?,approved_by=?,updated_at=? WHERE id=?`).run(status,status==='Published'?req.user.id:null,now(),row.id)
  db.prepare(`UPDATE tasks SET status=?,decision_note=?,updated_at=? WHERE template_id=? AND task_type='Approval'`).run(status==='Published'?'Approved':'Rejected',feedback,now(),row.id)
  if(row.requestor_email) queueEmail(row.requestor_email,`Status template ${row.name}: ${status}`,`<h2>${status==='Published'?'Template disetujui':'Template ditolak'}</h2><p>Halo ${row.requestor_name||'Creator'}, status template <strong>${row.name}</strong> kini <strong>${status}</strong>.</p>${feedback?`<p>Feedback: ${escapeHtml(feedback)}</p>`:''}`)
  res.json(mapTemplate(db.prepare('SELECT * FROM templates WHERE id=?').get(row.id)))
})

app.get('/api/articles', auth, (req,res) => {
  const rows = req.user.permissions.includes('articles.manage') || req.user.permissions.includes('*') ? db.prepare(`SELECT a.*,u.first_name||' '||u.last_name author FROM articles a LEFT JOIN users u ON u.id=a.author_id ORDER BY a.created_at DESC`).all() : db.prepare(`SELECT a.*,u.first_name||' '||u.last_name author FROM articles a LEFT JOIN users u ON u.id=a.author_id WHERE a.status='Published' ORDER BY COALESCE(a.published_at,a.created_at) DESC`).all()
  res.json(rows.map(mapArticle))
})
app.post('/api/articles', auth, permit('articles.manage'), (req,res) => {
  const { title,slug,category='Planning',excerpt='',content='',status='Draft',tags=[],coverUrl=null }=req.body||{}
  if(!title) return res.status(400).json({error:'Judul wajib diisi'})
  const articleId=id('art'); const finalSlug=slug||title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')+'-'+Date.now().toString().slice(-5)
  db.prepare(`INSERT INTO articles(id,title,slug,category,excerpt,content,status,author_id,tags_json,cover_url,published_at,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(articleId,title,finalSlug,category,excerpt,content,status,req.user.id,JSON.stringify(tags),coverUrl,status==='Published'?now():null,now(),now())
  const row=db.prepare(`SELECT a.*,u.first_name||' '||u.last_name author FROM articles a LEFT JOIN users u ON u.id=a.author_id WHERE a.id=?`).get(articleId)
  auditLog(req.user.id,'article.create','article',articleId,{title,status}); res.status(201).json(mapArticle(row))
})
app.patch('/api/articles/:id', auth, permit('articles.manage'), (req,res) => {
  const row=db.prepare('SELECT * FROM articles WHERE id=?').get(req.params.id); if(!row)return res.status(404).json({error:'Article tidak ditemukan'})
  const next={...row,...req.body,canvas_json:req.body.canvasJson!==undefined?JSON.stringify(req.body.canvasJson):row.canvas_json}
  db.prepare(`UPDATE articles SET title=?,slug=?,category=?,excerpt=?,content=?,status=?,tags_json=?,cover_url=?,published_at=?,updated_at=? WHERE id=?`).run(next.title,next.slug,next.category,next.excerpt,next.content,next.status,JSON.stringify(next.tags || parseJson(row.tags_json,[])),next.coverUrl ?? row.cover_url,next.status==='Published'?(row.published_at||now()):null,now(),row.id)
  const updated=db.prepare(`SELECT a.*,u.first_name||' '||u.last_name author FROM articles a LEFT JOIN users u ON u.id=a.author_id WHERE a.id=?`).get(row.id)
  auditLog(req.user.id,'article.update','article',row.id,{title:next.title,status:next.status}); res.json(mapArticle(updated))
})

app.get('/api/audit-logs', auth, (req,res) => {
  if(!req.user.permissions.includes('*')) return res.status(403).json({error:'Permission denied'})
  const rows=db.prepare(`SELECT a.*,u.first_name||' '||u.last_name actor_name,u.email actor_email FROM audit_logs a LEFT JOIN users u ON u.id=a.actor_user_id ORDER BY a.created_at DESC LIMIT 500`).all()
  res.json(rows.map(row=>({...row,details:parseJson(row.details_json,{})})))
})

app.get('/api/payment-methods', auth, permit('settings.payment'), (_req,res) => res.json(db.prepare('SELECT * FROM payment_methods ORDER BY label').all().map(mapPayment)))
app.put('/api/payment-methods/:id', auth, permit('settings.payment'), (req,res) => {
  const row=db.prepare('SELECT * FROM payment_methods WHERE id=?').get(req.params.id); if(!row)return res.status(404).json({error:'Metode pembayaran tidak ditemukan'})
  db.prepare('UPDATE payment_methods SET enabled=?,config_json=?,updated_at=? WHERE id=?').run(req.body.enabled?1:0,JSON.stringify(req.body.config||parseJson(row.config_json,{})),now(),row.id)
  auditLog(req.user.id,'payment-method.update','payment_method',row.id,{enabled:Boolean(req.body.enabled)})
  res.json(mapPayment(db.prepare('SELECT * FROM payment_methods WHERE id=?').get(row.id)))
})

app.get('/api/roles', auth, permit('roles.manage'), (_req,res) => res.json(db.prepare(`SELECT r.*,COUNT(u.id) user_count FROM roles r LEFT JOIN users u ON u.role_id=r.id GROUP BY r.id ORDER BY r.name`).all().map(r=>({id:r.id,name:r.name,permissions:parseJson(r.permissions_json,[]),isSystem:Boolean(r.is_system),userCount:Number(r.user_count)||0}))))
app.post('/api/roles', auth, permit('roles.manage'), (req,res) => {
  const roleId=id('role'); db.prepare('INSERT INTO roles(id,name,permissions_json,is_system,created_at) VALUES(?,?,?,?,?)').run(roleId,req.body.name,JSON.stringify(req.body.permissions||[]),0,now()); auditLog(req.user.id,'role.create','role',roleId,{name:req.body.name,permissions:req.body.permissions||[]}); res.status(201).json({id:roleId,name:req.body.name,permissions:req.body.permissions||[],isSystem:false,userCount:0})
})
app.patch('/api/roles/:id', auth, permit('roles.manage'), (req,res) => {
  const row=db.prepare('SELECT * FROM roles WHERE id=?').get(req.params.id); if(!row)return res.status(404).json({error:'Role tidak ditemukan'})
  const nextPermissions=req.body.permissions||parseJson(row.permissions_json,[]); db.prepare('UPDATE roles SET name=?,permissions_json=? WHERE id=?').run(req.body.name||row.name,JSON.stringify(nextPermissions),row.id); auditLog(req.user.id,'role.update','role',row.id,{name:req.body.name||row.name,permissions:nextPermissions}); res.json({ok:true})
})
app.delete('/api/roles/:id', auth, permit('roles.manage'), (req,res) => {
  const row=db.prepare('SELECT * FROM roles WHERE id=?').get(req.params.id); if(!row)return res.status(404).json({error:'Role tidak ditemukan'}); if(row.is_system)return res.status(400).json({error:'System role tidak dapat dihapus'})
  const used=db.prepare('SELECT COUNT(*) count FROM users WHERE role_id=?').get(row.id).count
  if(used) return res.status(409).json({error:`Role masih digunakan oleh ${used} akun. Pindahkan role user terlebih dahulu.`})
  db.prepare('DELETE FROM roles WHERE id=?').run(row.id); auditLog(req.user.id,'role.delete','role',row.id,{name:row.name}); res.json({ok:true})
})

app.get('/api/users', auth, permit('users.manage'), (_req,res) => {
  const rows=db.prepare(`SELECT u.id,u.first_name,u.last_name,u.email,u.username,u.active,u.email_verified,u.settings_json,u.created_at,r.id role_id,r.name role_name,r.permissions_json FROM users u JOIN roles r ON r.id=u.role_id ORDER BY u.created_at DESC`).all()
  res.json(rows.map(r=>({id:r.id,firstName:r.first_name,lastName:r.last_name,name:`${r.first_name} ${r.last_name}`.trim(),email:r.email,username:r.username,active:Boolean(r.active),emailVerified:Boolean(r.email_verified),settings:parseJson(r.settings_json,{}),roleId:r.role_id,role:r.role_name,permissions:parseJson(r.permissions_json,[]),createdAt:r.created_at})))
})
app.post('/api/users', auth, permit('users.manage'), (req,res) => {
  const {firstName,lastName='',email,username,password,roleId}=req.body||{}; if(!firstName||!email||!username||!password||!roleId)return res.status(400).json({error:'Data belum lengkap'}); const userId=id('usr')
  try{db.prepare(`INSERT INTO users(id,first_name,last_name,email,username,password_hash,role_id,active,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?)`).run(userId,firstName,lastName,email,username,bcrypt.hashSync(password,10),roleId,1,now(),now()); if(roleId==='role_user')db.prepare(`INSERT INTO sites(id,user_id,title,slug,canvas_json,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?)`).run(id('site'),userId,`${firstName} ${lastName}`.trim(),username,'[]','Draft',now(),now()); auditLog(req.user.id,'user.create','user',userId,{email,username,roleId}); res.status(201).json({id:userId})}catch{res.status(409).json({error:'Email atau username sudah digunakan'})}
})
app.patch('/api/users/:id/role', auth, permit('users.manage'), (req,res) => { db.prepare('UPDATE users SET role_id=?,updated_at=? WHERE id=?').run(req.body.roleId,now(),req.params.id); auditLog(req.user.id,'user.role.change','user',req.params.id,{roleId:req.body.roleId}); res.json({ok:true}) })

app.get('/api/clients', auth, permit('users.view'), (req,res) => {
  const base=`SELECT u.id,u.first_name,u.last_name,u.email,u.username,u.active,u.created_at,s.id site_id,s.title site_title,s.slug,s.status site_status,s.canvas_json,a.editor_id,e.first_name||' '||e.last_name assigned_editor FROM users u JOIN roles r ON r.id=u.role_id LEFT JOIN sites s ON s.user_id=u.id LEFT JOIN site_assignments a ON a.user_id=u.id LEFT JOIN users e ON e.id=a.editor_id WHERE r.name='User'`
  const rows=hasPermission(req.user,'*') ? db.prepare(`${base} ORDER BY u.created_at DESC`).all() : db.prepare(`${base} AND (a.editor_id=? OR a.editor_id IS NULL) ORDER BY u.created_at DESC`).all(req.user.id)
  res.json(rows.map(row=>({id:row.id,name:`${row.first_name} ${row.last_name}`.trim(),email:row.email,username:row.username,active:Boolean(row.active),siteId:row.site_id,siteTitle:row.site_title||`${row.first_name} ${row.last_name}`.trim(),slug:row.slug||'',siteStatus:row.site_status||'Draft',canvasIds:parseJson(row.canvas_json,[]).map(section=>section.id),assignedEditorId:row.editor_id||'',assignedTo:row.assigned_editor||'',status:row.editor_id?'Assigned':'Unassigned',plan:'Free'})))
})
app.put('/api/clients/:id/assignment', auth, permit('users.view'), (req,res) => {
  const target=db.prepare(`SELECT u.id FROM users u JOIN roles r ON r.id=u.role_id WHERE u.id=? AND r.name='User'`).get(req.params.id)
  if(!target)return res.status(404).json({error:'User client tidak ditemukan'})
  let editorId=String(req.body.editorId||'') || null
  if(!hasPermission(req.user,'*')) editorId=req.user.id
  if(editorId){const editor=db.prepare(`SELECT u.id FROM users u JOIN roles r ON r.id=u.role_id WHERE u.id=? AND (r.name='Editor' OR r.name='Admin') AND u.active=1`).get(editorId);if(!editor)return res.status(400).json({error:'Editor tidak valid'})}
  const existing=db.prepare('SELECT id FROM site_assignments WHERE user_id=?').get(target.id)
  if(existing) db.prepare('UPDATE site_assignments SET editor_id=?,assigned_by=?,updated_at=? WHERE user_id=?').run(editorId,req.user.id,now(),target.id)
  else db.prepare('INSERT INTO site_assignments(id,user_id,editor_id,assigned_by,created_at,updated_at) VALUES(?,?,?,?,?,?)').run(id('assign'),target.id,editorId,req.user.id,now(),now())
  res.json({ok:true,editorId})
})
app.get('/api/clients/:id/site', auth, permit('users.view'), (req,res) => {
  if(!canManageSiteFor(req.user,req.params.id)) return res.status(403).json({error:'User belum di-assign kepada Editor ini'})
  const row=db.prepare('SELECT * FROM sites WHERE user_id=?').get(req.params.id)
  res.json(row ? {id:row.id,userId:row.user_id,title:row.title,slug:row.slug,templateId:row.template_id,sections:parseJson(row.canvas_json,[]),status:row.status,updatedAt:row.updated_at} : null)
})
app.put('/api/clients/:id/site', auth, permit('users.view'), (req,res) => {
  if(!canManageSiteFor(req.user,req.params.id)) return res.status(403).json({error:'User belum di-assign kepada Editor ini'})
  const existing=db.prepare('SELECT * FROM sites WHERE user_id=?').get(req.params.id)
  const payload={title:String(req.body.title||''),slug:normalizeSlug(req.body.slug||''),templateId:req.body.templateId||null,sections:Array.isArray(req.body.sections)?req.body.sections:[],status:req.body.status||'Draft'}
  if(!payload.slug)return res.status(400).json({error:'URL slug wajib diisi'})
  const conflict=db.prepare('SELECT id FROM sites WHERE slug=? AND user_id<>?').get(payload.slug,req.params.id); if(conflict)return res.status(409).json({error:'URL sudah digunakan'})
  if(existing) saveSiteRevision(existing,req.user.id,'Before client save')
  if(existing) db.prepare('UPDATE sites SET title=?,slug=?,template_id=?,canvas_json=?,status=?,updated_at=? WHERE user_id=?').run(payload.title,payload.slug,payload.templateId,JSON.stringify(payload.sections),payload.status,now(),req.params.id)
  else db.prepare(`INSERT INTO sites(id,user_id,title,slug,template_id,canvas_json,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?)`).run(id('site'),req.params.id,payload.title,payload.slug,payload.templateId,JSON.stringify(payload.sections),payload.status,now(),now())
  db.prepare('DELETE FROM site_autosaves WHERE user_id=?').run(req.params.id)
  auditLog(req.user.id,'client-site.save','site',existing?.id||'',{customerUserId:req.params.id,slug:payload.slug,status:payload.status})
  res.json({ok:true,url:`${CLIENT_ORIGIN.replace(/\/$/,'')}/${payload.slug}`})
})

app.put('/api/clients/:id/site/autosave', auth, permit('users.view'), (req,res) => {
  if(!canManageSiteFor(req.user,req.params.id)) return res.status(403).json({error:'Customer belum di-assign kepada Web Designer ini'})
  const payload={title:String(req.body.title||''),slug:normalizeSlug(req.body.slug||''),templateId:req.body.templateId||null,sections:Array.isArray(req.body.sections)?req.body.sections:[]}
  db.prepare(`INSERT INTO site_autosaves(user_id,actor_user_id,title,slug,template_id,canvas_json,updated_at) VALUES(?,?,?,?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET actor_user_id=excluded.actor_user_id,title=excluded.title,slug=excluded.slug,template_id=excluded.template_id,canvas_json=excluded.canvas_json,updated_at=excluded.updated_at`).run(req.params.id,req.user.id,payload.title,payload.slug,payload.templateId,JSON.stringify(payload.sections),now())
  res.json({ok:true,updatedAt:now()})
})
app.get('/api/clients/:id/site/revisions', auth, permit('users.view'), (req,res) => {
  if(!canManageSiteFor(req.user,req.params.id)) return res.status(403).json({error:'Customer belum di-assign kepada Web Designer ini'})
  const site=db.prepare('SELECT id FROM sites WHERE user_id=?').get(req.params.id); if(!site)return res.json([])
  res.json(db.prepare(`SELECT r.*,u.first_name||' '||u.last_name actor_name FROM site_revisions r LEFT JOIN users u ON u.id=r.actor_user_id WHERE r.site_id=? ORDER BY r.created_at DESC LIMIT 30`).all(site.id).map(r=>({...r,sections:parseJson(r.canvas_json,[])})))
})
app.get('/api/contactable-users', auth, permit('conversations.outbound'), (_req,res) => {
  const rows=db.prepare(`SELECT u.id,u.first_name,u.last_name,u.email,u.username,r.name role FROM users u JOIN roles r ON r.id=u.role_id WHERE r.name='User' AND u.active=1 ORDER BY u.first_name,u.last_name`).all()
  res.json(rows.map(row=>({id:row.id,name:`${row.first_name} ${row.last_name}`.trim(),email:row.email,username:row.username,role:row.role})))
})
app.get('/api/me/conversation', auth, (req,res) => {
  const conversation=db.prepare(`SELECT * FROM conversations WHERE customer_email=? ORDER BY updated_at DESC LIMIT 1`).get(req.user.email)
  if(!conversation) return res.json({conversation:null,messages:[]})
  const messages=db.prepare(`SELECT * FROM messages WHERE conversation_id=? ORDER BY created_at`).all(conversation.id)
  res.json({conversation,messages})
})

app.post('/api/conversations/inbound', auth, (req,res) => {
  const body=String(req.body.body||''); if(!body)return res.status(400).json({error:'Pesan wajib diisi'})
  const conversation=createOrFindConversation({customerName:req.user.name,customerEmail:req.user.email,customerPhone:req.body.phone||'',channel:req.body.channel||'Web'})
  const messageId=id('msg'); db.prepare(`INSERT INTO messages(id,conversation_id,sender_type,sender_user_id,body,created_at) VALUES(?,?,?,?,?,?)`).run(messageId,conversation.id,'customer',req.user.id,body,now()); db.prepare('UPDATE conversations SET updated_at=? WHERE id=?').run(now(),conversation.id)
  res.status(201).json({conversationId:conversation.id,messageId})
})
app.post('/api/conversations/outbound', auth, permit('conversations.outbound'), (req,res) => {
  const {userId,email,body,channel='Web'}=req.body||{}; if(!body)return res.status(400).json({error:'Pesan wajib diisi'})
  const target=userId?db.prepare('SELECT * FROM users WHERE id=?').get(userId):db.prepare('SELECT * FROM users WHERE email=?').get(email)
  if(!target)return res.status(404).json({error:'User tidak ditemukan'})
  const assignedCsId=req.user.role==='Customer Service'?req.user.id:chooseAssignee('role_cs')
  const conversation=createOrFindConversation({customerName:`${target.first_name} ${target.last_name}`.trim(),customerEmail:target.email,assignedCsId,channel})
  const messageId=id('msg'); db.prepare(`INSERT INTO messages(id,conversation_id,sender_type,sender_user_id,body,created_at) VALUES(?,?,?,?,?,?)`).run(messageId,conversation.id,'support',req.user.id,body,now()); db.prepare('UPDATE conversations SET updated_at=? WHERE id=?').run(now(),conversation.id)
  queueEmail(target.email,'Pesan baru dari ikrarku',`<h2>Pesan baru</h2><p>${escapeHtml(body)}</p><p>Silakan login ke ikrarku atau balas melalui channel support.</p>`)
  res.status(201).json({conversationId:conversation.id,messageId})
})

app.post('/api/media', auth, upload.single('file'), (req,res) => {
  if(!req.file)return res.status(400).json({error:'File wajib diunggah'})
  const allowedPrefixes=['image/','video/','audio/']; if(!allowedPrefixes.some(prefix=>String(req.file.mimetype||'').startsWith(prefix))){try{fs.unlinkSync(req.file.path)}catch{};return res.status(415).json({error:'Format file tidak didukung'})}
  const mediaId=id('media')
  const original=req.file.originalname || 'file'
  const finalName=`${mediaId}_${original.replace(/[^a-zA-Z0-9._-]/g,'_')}`
  const finalPath=path.join(UPLOAD_DIR,finalName)
  fs.renameSync(req.file.path,finalPath)
  db.prepare(`INSERT INTO media_assets(id,owner_user_id,category,original_name,file_name,file_path,mime_type,size_bytes,created_at) VALUES(?,?,?,?,?,?,?,?,?)`).run(mediaId,req.user.id,req.body.category||'general',original,finalName,finalPath,req.file.mimetype,req.file.size||0,now())
  res.status(201).json({id:mediaId,name:original,url:`/uploads/${finalName}`,mimeType:req.file.mimetype,size:req.file.size||0,category:req.body.category||'general'})
})

app.get('/api/sounds', auth, (_req,res) => res.json(db.prepare('SELECT * FROM sounds ORDER BY created_at DESC').all().map(r=>({id:r.id,name:r.name,category:r.category,description:r.description,fileName:r.file_name,url:r.file_path?`/uploads/${path.basename(r.file_path)}`:null,mimeType:r.mime_type,createdAt:r.created_at}))))
app.post('/api/sounds', auth, permit('sounds.manage'), upload.single('file'), (req,res) => {
  if(!req.file)return res.status(400).json({error:'File wajib diunggah'})
  const mime=String(req.file.mimetype||''); if(!(mime.startsWith('audio/')||mime==='video/mp4')){try{fs.unlinkSync(req.file.path)}catch{};return res.status(415).json({error:'Sound hanya menerima audio atau MP4'})}
  if((req.file.size||0)>15*1024*1024){try{fs.unlinkSync(req.file.path)}catch{};return res.status(413).json({error:'Sound maksimal 15 MB'})}
  const soundId=id('snd'); const finalName=`${soundId}_${req.file.originalname.replace(/[^a-zA-Z0-9._-]/g,'_')}`; const finalPath=path.join(UPLOAD_DIR,finalName); fs.renameSync(req.file.path,finalPath)
  db.prepare(`INSERT INTO sounds(id,name,category,description,file_name,file_path,mime_type,created_by,created_at) VALUES(?,?,?,?,?,?,?,?,?)`).run(soundId,req.body.name||req.file.originalname,req.body.category||'Wedding',req.body.description||'',req.file.originalname,finalPath,req.file.mimetype,req.user.id,now())
  res.status(201).json({id:soundId,name:req.body.name||req.file.originalname,url:`/uploads/${finalName}`})
})

app.delete('/api/sounds/:id', auth, permit('sounds.manage'), (req,res) => {
  const row=db.prepare('SELECT * FROM sounds WHERE id=?').get(req.params.id)
  if(!row)return res.status(404).json({error:'Sound tidak ditemukan'})
  if(row.file_path && fs.existsSync(row.file_path)) fs.unlinkSync(row.file_path)
  db.prepare('DELETE FROM sounds WHERE id=?').run(row.id)
  res.json({ok:true})
})

app.get('/api/site', auth, (req,res) => {
  const row=db.prepare('SELECT * FROM sites WHERE user_id=?').get(req.user.id)
  res.json(row ? {id:row.id,title:row.title,slug:row.slug,templateId:row.template_id,sections:parseJson(row.canvas_json,[]),status:row.status,updatedAt:row.updated_at} : null)
})
app.put('/api/site', auth, (req,res) => {
  const existing=db.prepare('SELECT * FROM sites WHERE user_id=?').get(req.user.id)
  const payload={title:req.body.title||'',slug:normalizeSlug(req.body.slug||''),templateId:req.body.templateId||null,sections:req.body.sections||[],status:req.body.status||'Draft'}
  if(!payload.slug)return res.status(400).json({error:'URL slug wajib diisi'})
  const conflict=db.prepare('SELECT id FROM sites WHERE slug=? AND user_id<>?').get(payload.slug,req.user.id); if(conflict)return res.status(409).json({error:'URL sudah digunakan'})
  if(existing) saveSiteRevision(existing,req.user.id,'Before publish/save')
  if(existing) db.prepare('UPDATE sites SET title=?,slug=?,template_id=?,canvas_json=?,status=?,updated_at=? WHERE user_id=?').run(payload.title,payload.slug,payload.templateId,JSON.stringify(payload.sections),payload.status,now(),req.user.id)
  else db.prepare(`INSERT INTO sites(id,user_id,title,slug,template_id,canvas_json,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?)`).run(id('site'),req.user.id,payload.title,payload.slug,payload.templateId,JSON.stringify(payload.sections),payload.status,now(),now())
  db.prepare('DELETE FROM site_autosaves WHERE user_id=?').run(req.user.id)
  auditLog(req.user.id,'site.save','site',existing?.id||'',{slug:payload.slug,status:payload.status})
  res.json({ok:true,url:`${CLIENT_ORIGIN}/${payload.slug}`})
})

app.put('/api/site/autosave', auth, permit('canvas.manage.own'), (req,res) => {
  const payload={title:req.body.title||'',slug:normalizeSlug(req.body.slug||''),templateId:req.body.templateId||null,sections:req.body.sections||[]}
  db.prepare(`INSERT INTO site_autosaves(user_id,actor_user_id,title,slug,template_id,canvas_json,updated_at) VALUES(?,?,?,?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET actor_user_id=excluded.actor_user_id,title=excluded.title,slug=excluded.slug,template_id=excluded.template_id,canvas_json=excluded.canvas_json,updated_at=excluded.updated_at`).run(req.user.id,req.user.id,payload.title,payload.slug,payload.templateId,JSON.stringify(payload.sections),now())
  res.json({ok:true,updatedAt:now()})
})
app.get('/api/site/revisions', auth, permit('canvas.manage.own'), (req,res) => {
  const site=db.prepare('SELECT id FROM sites WHERE user_id=?').get(req.user.id); if(!site)return res.json([])
  res.json(db.prepare(`SELECT r.*,u.first_name||' '||u.last_name actor_name FROM site_revisions r LEFT JOIN users u ON u.id=r.actor_user_id WHERE r.site_id=? ORDER BY r.created_at DESC LIMIT 30`).all(site.id).map(r=>({...r,sections:parseJson(r.canvas_json,[])})))
})
app.get('/api/site/interactions', auth, (req,res) => {
  const site=db.prepare('SELECT id FROM sites WHERE user_id=?').get(req.user.id)
  if(!site)return res.json({guests:[],greetings:[]})
  const guests=db.prepare('SELECT id,canvas_id,guest_name,email,status,pax,created_at FROM rsvp_responses WHERE site_id=? ORDER BY created_at DESC').all(site.id).map(row=>({id:row.id,canvasId:row.canvas_id,name:row.guest_name,email:row.email,status:row.status,pax:row.pax,time:row.created_at,initials:String(row.guest_name).slice(0,2).toUpperCase()}))
  const greetings=db.prepare('SELECT id,canvas_id,guest_name,message,created_at FROM greetings WHERE site_id=? ORDER BY created_at DESC').all(site.id).map(row=>({id:row.id,canvasId:row.canvas_id,name:row.guest_name,message:row.message,date:row.created_at}))
  res.json({guests,greetings})
})
app.post('/api/site/rsvp', auth, (req,res) => {
  const site=db.prepare('SELECT id FROM sites WHERE user_id=?').get(req.user.id)
  if(!site)return res.status(404).json({error:'Website belum tersedia'})
  const responseId=id('rsvp'); const {canvasId='',name,status='Menunggu',pax=0,email=''}=req.body||{}
  if(!name)return res.status(400).json({error:'Nama tamu wajib diisi'})
  db.prepare('INSERT INTO rsvp_responses(id,site_id,canvas_id,guest_name,email,status,pax,created_at) VALUES(?,?,?,?,?,?,?,?)').run(responseId,site.id,canvasId,name,email,status,Number(pax)||0,now())
  res.status(201).json({id:responseId})
})
app.post('/api/site/greetings', auth, (req,res) => {
  const site=db.prepare('SELECT id FROM sites WHERE user_id=?').get(req.user.id)
  if(!site)return res.status(404).json({error:'Website belum tersedia'})
  const greetingId=id('greeting'); const {canvasId='',name,message}=req.body||{}
  if(!name||!message)return res.status(400).json({error:'Nama dan pesan wajib diisi'})
  db.prepare('INSERT INTO greetings(id,site_id,canvas_id,guest_name,message,created_at) VALUES(?,?,?,?,?,?)').run(greetingId,site.id,canvasId,name,message,now())
  res.status(201).json({id:greetingId})
})

function chooseAssignee(roleId){
  return db.prepare(`SELECT u.id,COUNT(t.id) workload FROM users u LEFT JOIN tasks t ON t.assigned_user_id=u.id AND t.status NOT IN ('Done','Cancelled') WHERE u.role_id=? AND u.active=1 GROUP BY u.id ORDER BY workload ASC,u.created_at ASC LIMIT 1`).get(roleId)?.id || null
}
async function createReceipt(order, template) {
  const receiptNo=`RCPT-${new Date().getFullYear()}-${order.order_no.split('-').at(-1)}`
  const filename=`${receiptNo}.pdf`; const filepath=path.join(RECEIPT_DIR,filename)
  await new Promise((resolve,reject)=>{
    const stream=fs.createWriteStream(filepath)
    const doc=new PDFDocument({size:'A4',margin:52})
    stream.on('finish',resolve);stream.on('error',reject);doc.on('error',reject);doc.pipe(stream)
    doc.fontSize(22).fillColor('#125946').text('ikrarku Sites'); doc.moveDown(.2); doc.fontSize(10).fillColor('#777').text('Wedding websites, beautifully managed.')
    doc.moveDown(2); doc.fontSize(18).fillColor('#1c342d').text('Payment Receipt'); doc.moveDown()
    const lines=[['Receipt No.',receiptNo],['Order No.',order.order_no],['Customer',order.customer_name],['Email',order.email],['Template',template.name],['Payment Method',order.payment_method],['Payment Status','PAID'],['Amount',`Rp ${Number(order.amount).toLocaleString('id-ID')}`],['Paid At',new Date(order.paid_at).toLocaleString('id-ID')]]
    for(const [label,value] of lines){doc.fontSize(10).fillColor('#777').text(label,52,doc.y,{continued:true,width:160});doc.fillColor('#222').text(value);doc.moveDown(.5)}
    doc.moveDown(2);doc.fontSize(9).fillColor('#777').text('Receipt ini dibuat otomatis oleh ikrarku Sites. Tim Customer Service dan Web Designer akan menghubungi Anda untuk proses onboarding.');doc.end()
  })
  return {receiptNo,filepath,publicUrl:`/receipts/${filename}`}
}
async function deliverEmail(outboxId){
  const mail=db.prepare('SELECT * FROM email_outbox WHERE id=?').get(outboxId); if(!mail)return
  if(!process.env.SMTP_HOST){return}
  try{
    const transporter=nodemailer.createTransport({host:process.env.SMTP_HOST,port:Number(process.env.SMTP_PORT||587),secure:String(process.env.SMTP_SECURE)==='true',auth:process.env.SMTP_USER?{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}:undefined})
    await transporter.sendMail({from:process.env.SMTP_FROM||'ikrarku Sites <noreply@ikrarku.local>',to:mail.to_email,subject:mail.subject,html:mail.html,attachments:mail.attachment_path?[{filename:path.basename(mail.attachment_path),path:mail.attachment_path}]:[]})
    db.prepare("UPDATE email_outbox SET status='Sent',sent_at=? WHERE id=?").run(now(),outboxId)
  }catch(e){db.prepare("UPDATE email_outbox SET status='Failed',error=? WHERE id=?").run(String(e),outboxId)}
}
app.post('/api/orders', rateLimit('orders',20,60_000), (req,res) => {
  const viewer=optionalUser(req)
  const {customerName,email,phone='',templateId}=req.body||{}; const template=db.prepare("SELECT * FROM templates WHERE id=? AND status IN ('Published','Approved')").get(templateId); if(!template)return res.status(404).json({error:'Template tidak tersedia'}); if(!customerName||!email||!phone)return res.status(400).json({error:'Nama, email, dan nomor telepon wajib diisi'})
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email)))return res.status(400).json({error:'Format email tidak valid'})
  if(String(phone).replace(/\D/g,'').length<9)return res.status(400).json({error:'Nomor telepon minimal 9 digit'})
  const orderId=id('ord'); const orderNo=`IKR-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}${crypto.randomBytes(2).toString('hex').toUpperCase()}`
  db.prepare(`INSERT INTO orders(id,order_no,customer_name,email,phone,template_id,amount,currency,payment_status,order_status,created_at,user_id) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`).run(orderId,orderNo,customerName,email,phone,template.id,template.price,template.currency,'Pending','Awaiting Payment',now(),viewer?.id||null)
  res.status(201).json({id:orderId,orderNo,amount:template.price,currency:template.currency})
})
// Shared fulfilment used by both simulation payments and the Mayar payment webhook.
async function fulfillPaidOrder(order, methodCode){
  const csId=chooseAssignee('role_cs'); const editorId=chooseAssignee('role_editor')
  if(!csId || !editorId){ const err=new Error('Pembayaran belum dapat diterima. Admin harus menambahkan minimal satu Customer Service dan satu Editor aktif.'); err.status=409; throw err }
  const paidAt=now()
  db.prepare(`UPDATE orders SET payment_method=?,payment_status='Paid',order_status='Paid - Onboarding',assigned_cs_id=?,assigned_editor_id=?,paid_at=? WHERE id=?`).run(methodCode,csId,editorId,paidAt,order.id)
  const paidOrder=db.prepare('SELECT * FROM orders WHERE id=?').get(order.id); const template=db.prepare('SELECT * FROM templates WHERE id=?').get(order.template_id); const receipt=await createReceipt(paidOrder,template)
  db.prepare('UPDATE orders SET receipt_no=?,receipt_path=? WHERE id=?').run(receipt.receiptNo,receipt.filepath,order.id)
  const taskInsert=db.prepare(`INSERT INTO tasks(id,order_id,title,description,status,priority,assigned_user_id,assigned_role_id,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?)`)
  taskInsert.run(id('task'),order.id,`Onboarding order ${order.order_no}`,`Hubungi ${order.customer_name} dan konfirmasi channel Email/Web/WhatsApp.`,'Open','High',csId,'role_cs',now(),now())
  taskInsert.run(id('task'),order.id,`Build website ${template.name}`,`Siapkan Canvas dan konfigurasi template untuk ${order.customer_name}.`,'Open','Normal',editorId,'role_editor',now(),now())
  const conversationId=id('conv'); db.prepare(`INSERT INTO conversations(id,order_id,customer_name,customer_email,customer_phone,status,assigned_cs_id,channel,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?)`).run(conversationId,order.id,order.customer_name,order.email,order.phone,'Open',csId,'Web',now(),now())
  db.prepare(`INSERT INTO messages(id,conversation_id,sender_type,body,created_at) VALUES(?,?,?,?,?)`).run(id('msg'),conversationId,'system',`Order ${order.order_no} telah dibayar. Hubungi customer untuk onboarding.`,now())
  const html=`<h2>Pembayaran diterima</h2><p>Halo ${order.customer_name}, pembayaran untuk template <strong>${template.name}</strong> telah kami terima.</p><p>Order: ${order.order_no}<br>Jumlah: Rp ${Number(order.amount).toLocaleString('id-ID')}</p><p>Tim Customer Service dan Web Designer ikrarku akan menghubungi Anda.</p>`
  const outboxId=id('mail'); db.prepare(`INSERT INTO email_outbox(id,to_email,subject,html,status,attachment_path,created_at) VALUES(?,?,?,?,?,?,?)`).run(outboxId,order.email,`Receipt pembayaran ${order.order_no}`,html,process.env.SMTP_HOST?'Queued':'Ready for SMTP',receipt.filepath,now()); void deliverEmail(outboxId)
  return { receiptUrl:receipt.publicUrl, assignedCsId:csId, assignedEditorId:editorId, conversationId }
}

// Create a Mayar (mayar.id) payment/invoice and return its hosted payment URL.
async function createMayarInvoice(order, template){
  const base=(process.env.MAYAR_API_BASE||'https://api.mayar.id/hl/v1').replace(/\/$/,'')
  const key=process.env.MAYAR_API_KEY
  if(!key) throw Object.assign(new Error('MAYAR_API_KEY belum diset'),{status:500})
  const payload={
    name:order.customer_name, email:order.email, mobile:order.phone||'',
    amount:Number(order.amount), description:`Template ${template?.name||order.template_id} · ${order.order_no}`,
    redirectUrl:`${CLIENT_ORIGIN.replace(/\/$/,'')}/pembayaran-berhasil?order=${encodeURIComponent(order.order_no)}`,
    webhookUrl:`${CLIENT_ORIGIN.replace(/\/$/,'')}/api/webhooks/mayar`,
    // reference is echoed back by Mayar webhooks so we can match the order.
    reference:order.id
  }
  const response=await fetch(`${base}/invoice/create`,{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${key}`},body:JSON.stringify(payload)})
  const data=await response.json().catch(()=>({}))
  if(!response.ok) throw Object.assign(new Error(data?.messages||data?.message||'Gagal membuat invoice Mayar'),{status:502})
  const link=data?.data?.link||data?.data?.paymentUrl||data?.link||data?.paymentUrl
  const transactionId=data?.data?.id||data?.data?.transactionId||data?.id
  if(!link) throw Object.assign(new Error('Mayar tidak mengembalikan payment URL'),{status:502})
  return { link, transactionId }
}

app.post('/api/orders/:id/pay', async (req,res) => {
  const order=db.prepare('SELECT * FROM orders WHERE id=?').get(req.params.id); if(!order)return res.status(404).json({error:'Order tidak ditemukan'}); const method=db.prepare('SELECT * FROM payment_methods WHERE code=? AND enabled=1').get(req.body.paymentMethod); if(!method)return res.status(400).json({error:'Metode pembayaran tidak aktif'})
  if(order.payment_status==='Paid') return res.status(409).json({error:'Order sudah dibayar'})
  const mode=process.env.PAYMENT_MODE||(NODE_ENV==='production'?'gateway':'simulation')
  // Gateway mode: Mayar (mayar.id). Create a hosted invoice and let the customer pay there;
  // the order stays "Pending" until Mayar calls our webhook. Simulation stays instant for local/staging QA.
  if(mode==='mayar'){
    try{
      const template=db.prepare('SELECT * FROM templates WHERE id=?').get(order.template_id)
      const { link, transactionId }=await createMayarInvoice(order, template)
      db.prepare(`UPDATE orders SET payment_method=?,order_status='Awaiting Payment',gateway_ref=? WHERE id=?`).run(method.code,transactionId||null,order.id)
      return res.json({ok:true,status:'Pending',paymentUrl:link,gateway:'mayar'})
    }catch(error){ return res.status(error.status||502).json({error:error.message||'Gagal memproses pembayaran Mayar'}) }
  }
  if(mode!=='simulation') return res.status(501).json({error:'Payment gateway belum dikonfigurasi. Set PAYMENT_MODE=mayar dan MAYAR_API_KEY, atau PAYMENT_MODE=simulation.'})
  // Localhost/staging simulation marks payment as accepted immediately.
  try{
    const result=await fulfillPaidOrder(order, method.code)
    res.json({ok:true,status:'Paid',...result})
  }catch(error){ res.status(error.status||500).json({error:error.message||'Pembayaran gagal.'}) }
})

// Mayar payment webhook: confirms payment and fulfils the order. Verifies a shared token.
app.post('/api/webhooks/mayar', async (req,res) => {
  const configuredToken=process.env.MAYAR_WEBHOOK_TOKEN
  const provided=req.headers['x-mayar-token']||req.query.token||req.body?.token
  if(configuredToken && provided!==configuredToken) return res.status(401).json({error:'Invalid webhook token'})
  const event=String(req.body?.event||req.body?.status||'').toLowerCase()
  const reference=req.body?.data?.reference||req.body?.reference||req.body?.data?.merchantRef
  const isPaid=['paid','settled','success','payment.received','testing'].some(flag=>event.includes(flag))
  if(!reference) return res.status(400).json({error:'Missing reference'})
  const order=db.prepare('SELECT * FROM orders WHERE id=? OR gateway_ref=?').get(reference,reference)
  if(!order) return res.status(404).json({error:'Order tidak ditemukan'})
  if(order.payment_status==='Paid') return res.json({ok:true,already:true})
  if(!isPaid) return res.json({ok:true,ignored:event})
  try{ await fulfillPaidOrder(order, order.payment_method||'MAYAR'); res.json({ok:true}) }
  catch(error){ res.status(error.status||500).json({error:error.message}) }
})
app.get('/api/me/orders', auth, (req,res) => {
  const rows=db.prepare(`SELECT o.*,t.name template_name,t.category template_category,cs.first_name||' '||cs.last_name cs_name,ed.first_name||' '||ed.last_name editor_name FROM orders o JOIN templates t ON t.id=o.template_id LEFT JOIN users cs ON cs.id=o.assigned_cs_id LEFT JOIN users ed ON ed.id=o.assigned_editor_id WHERE o.user_id=? OR lower(o.email)=lower(?) ORDER BY o.created_at DESC`).all(req.user.id,req.user.email)
  res.json(rows.map(o=>({...o,tasks:db.prepare('SELECT id,title,status,priority,assigned_role_id,created_at,updated_at FROM tasks WHERE order_id=? ORDER BY created_at').all(o.id),conversation:db.prepare('SELECT id,status,channel,updated_at FROM conversations WHERE order_id=? ORDER BY updated_at DESC LIMIT 1').get(o.id)||null,receiptUrl:o.receipt_path?`/receipts/${path.basename(o.receipt_path)}`:null})))
})
app.get('/api/orders/analytics', auth, permit('orders.view'), (_req,res) => {
  const summary=db.prepare(`SELECT COUNT(*) qty,COALESCE(SUM(CASE WHEN payment_status='Paid' THEN amount ELSE 0 END),0) nominal,COUNT(DISTINCT email) customers FROM orders`).get()
  const rows=db.prepare(`SELECT o.order_no,o.customer_name,o.email,o.phone,t.name template_name,o.amount,o.currency,o.payment_status,o.order_status,o.payment_method,o.created_at,o.paid_at,cs.first_name||' '||cs.last_name cs_name,ed.first_name||' '||ed.last_name editor_name FROM orders o JOIN templates t ON t.id=o.template_id LEFT JOIN users cs ON cs.id=o.assigned_cs_id LEFT JOIN users ed ON ed.id=o.assigned_editor_id ORDER BY o.created_at DESC`).all()
  res.json({summary,rows})
})
function csvCell(value){const s=String(value??'');return /[",\n]/.test(s)?`"${s.replace(/"/g,'""')}"`:s}
app.get('/api/orders/export.csv', auth, permit('orders.view'), (_req,res) => {
  const rows=db.prepare(`SELECT o.order_no,o.customer_name,o.email,o.phone,t.name template_name,o.amount,o.currency,o.payment_status,o.order_status,o.payment_method,o.created_at,o.paid_at,cs.first_name||' '||cs.last_name cs_name,ed.first_name||' '||ed.last_name editor_name FROM orders o JOIN templates t ON t.id=o.template_id LEFT JOIN users cs ON cs.id=o.assigned_cs_id LEFT JOIN users ed ON ed.id=o.assigned_editor_id ORDER BY o.created_at DESC`).all()
  const headers=['Order No','Customer','Email','Phone','Template','Amount','Currency','Payment Status','Order Status','Payment Method','Created At','Paid At','Assigned CS','Assigned Editor']
  const body=[headers.join(','),...rows.map(r=>[r.order_no,r.customer_name,r.email,r.phone,r.template_name,r.amount,r.currency,r.payment_status,r.order_status,r.payment_method,r.created_at,r.paid_at,r.cs_name,r.editor_name].map(csvCell).join(','))].join('\n')
  res.setHeader('Content-Type','text/csv; charset=utf-8');res.setHeader('Content-Disposition','attachment; filename="ikrarku-orders.csv"');res.send('﻿'+body)
})
app.get('/api/orders/export.xls', auth, permit('orders.view'), (_req,res) => {
  const rows=db.prepare(`SELECT o.order_no,o.customer_name,o.email,o.phone,t.name template_name,o.amount,o.currency,o.payment_status,o.order_status,o.payment_method,o.created_at,o.paid_at,cs.first_name||' '||cs.last_name cs_name,ed.first_name||' '||ed.last_name editor_name FROM orders o JOIN templates t ON t.id=o.template_id LEFT JOIN users cs ON cs.id=o.assigned_cs_id LEFT JOIN users ed ON ed.id=o.assigned_editor_id ORDER BY o.created_at DESC`).all()
  const esc=v=>String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  const headers=['Order No','Customer','Email','Phone','Template','Amount','Currency','Payment Status','Order Status','Payment Method','Created At','Paid At','Assigned CS','Assigned Editor']
  const rowXml=values=>`<Row>${values.map(v=>`<Cell><Data ss:Type="String">${esc(v)}</Data></Cell>`).join('')}</Row>`
  const xml=`<?xml version="1.0"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="Orders"><Table>${rowXml(headers)}${rows.map(r=>rowXml([r.order_no,r.customer_name,r.email,r.phone,r.template_name,r.amount,r.currency,r.payment_status,r.order_status,r.payment_method,r.created_at,r.paid_at,r.cs_name,r.editor_name])).join('')}</Table></Worksheet></Workbook>`
  res.setHeader('Content-Type','application/vnd.ms-excel');res.setHeader('Content-Disposition','attachment; filename="ikrarku-orders.xls"');res.send(xml)
})

app.get('/api/orders/:id', auth, (req,res) => { const row=db.prepare(`SELECT o.*,t.name template_name,cs.first_name||' '||cs.last_name cs_name,ed.first_name||' '||ed.last_name editor_name FROM orders o JOIN templates t ON t.id=o.template_id LEFT JOIN users cs ON cs.id=o.assigned_cs_id LEFT JOIN users ed ON ed.id=o.assigned_editor_id WHERE o.id=?`).get(req.params.id); if(!row)return res.status(404).json({error:'Order tidak ditemukan'}); if(!hasPermission(req.user,'orders.view') && String(row.email).toLowerCase()!==String(req.user.email).toLowerCase())return res.status(403).json({error:'Tidak dapat mengakses order ini'}); res.json({...row,receiptUrl:row.receipt_path?`/receipts/${path.basename(row.receipt_path)}`:null}) })

app.get('/api/tasks', auth, permit('tasks.view'), (req,res) => {
  const selectSql=`SELECT t.*,o.order_no,o.customer_name,o.email,o.phone,tp.name template_name,tp.status template_status,u.first_name||' '||u.last_name requestor_name,u.email requestor_email FROM tasks t LEFT JOIN orders o ON o.id=t.order_id LEFT JOIN templates tp ON tp.id=t.template_id LEFT JOIN users u ON u.id=t.requestor_id`
  const rows=req.user.permissions.includes('*')
    ? db.prepare(`${selectSql} ORDER BY t.created_at DESC`).all()
    : req.user.permissions.includes('templates.approve')
      ? db.prepare(`${selectSql} WHERE t.task_type='Approval' OR t.assigned_user_id=? OR t.assigned_role_id=? ORDER BY t.created_at DESC`).all(req.user.id,req.user.roleId)
      : db.prepare(`${selectSql} WHERE t.assigned_user_id=? OR t.assigned_role_id=? ORDER BY t.created_at DESC`).all(req.user.id,req.user.roleId)
  res.json(rows)
})
app.patch('/api/tasks/:id', auth, permit('tasks.update'), (req,res) => { db.prepare('UPDATE tasks SET status=?,priority=?,assigned_user_id=COALESCE(?,assigned_user_id),updated_at=? WHERE id=?').run(req.body.status||'Open',req.body.priority||'Normal',req.body.assignedUserId||null,now(),req.params.id); res.json({ok:true}) })

app.get('/api/conversations', auth, permit('conversations.view'), (req,res) => {
  let rows=[]
  if(req.user.permissions.includes('*')) rows=db.prepare('SELECT * FROM conversations ORDER BY updated_at DESC').all()
  else if(req.user.roleId==='role_cs') rows=db.prepare('SELECT * FROM conversations WHERE assigned_cs_id=? ORDER BY updated_at DESC').all(req.user.id)
  else if(req.user.roleId==='role_editor') rows=db.prepare(`SELECT DISTINCT c.* FROM conversations c JOIN users customer ON lower(customer.email)=lower(c.customer_email) JOIN site_assignments sa ON sa.user_id=customer.id WHERE sa.editor_id=? ORDER BY c.updated_at DESC`).all(req.user.id)
  const result=rows.map(c=>{
    const messages=db.prepare('SELECT * FROM messages WHERE conversation_id=? ORDER BY created_at').all(c.id)
    const read=db.prepare('SELECT last_read_at FROM conversation_reads WHERE conversation_id=? AND user_id=?').get(c.id,req.user.id)
    const unreadCount=db.prepare(`SELECT COUNT(*) count FROM messages WHERE conversation_id=? AND sender_type='customer' AND created_at>?`).get(c.id,read?.last_read_at||'').count
    const latestCustomer=[...messages].reverse().find(m=>m.sender_type==='customer'); const latestSupport=[...messages].reverse().find(m=>m.sender_type==='support')
    const needsReply=Boolean(latestCustomer && (!latestSupport || latestSupport.created_at<latestCustomer.created_at)); const slaDueAt=needsReply?new Date(new Date(latestCustomer.created_at).getTime()+15*60*1000).toISOString():null
    const order=c.order_id?db.prepare(`SELECT o.order_no,o.amount,o.currency,o.payment_status,o.order_status,o.payment_method,t.name template_name,ed.first_name||' '||ed.last_name editor_name,cs.first_name||' '||cs.last_name cs_name FROM orders o LEFT JOIN templates t ON t.id=o.template_id LEFT JOIN users ed ON ed.id=o.assigned_editor_id LEFT JOIN users cs ON cs.id=o.assigned_cs_id WHERE o.id=?`).get(c.order_id):null
    const tasks=c.order_id?db.prepare(`SELECT id,title,status,priority,assigned_role_id,updated_at FROM tasks WHERE order_id=? ORDER BY created_at`).all(c.order_id):[]
    return {...c,messages,unreadCount:Number(unreadCount)||0,needsReply,slaDueAt,order,tasks}
  });res.json(result)
})
app.post('/api/conversations/:id/read', auth, permit('conversations.view'), (req,res) => {
  const c=db.prepare('SELECT id FROM conversations WHERE id=?').get(req.params.id);if(!c)return res.status(404).json({error:'Conversation tidak ditemukan'})
  db.prepare(`INSERT INTO conversation_reads(conversation_id,user_id,last_read_at) VALUES(?,?,?) ON CONFLICT(conversation_id,user_id) DO UPDATE SET last_read_at=excluded.last_read_at`).run(c.id,req.user.id,now());res.json({ok:true})
})
app.post('/api/conversations/:id/messages', auth, permit('conversations.reply'), (req,res) => { const conversation=db.prepare('SELECT * FROM conversations WHERE id=?').get(req.params.id);if(!conversation)return res.status(404).json({error:'Conversation tidak ditemukan'});const messageId=id('msg');db.prepare(`INSERT INTO messages(id,conversation_id,sender_type,sender_user_id,body,created_at) VALUES(?,?,?,?,?,?)`).run(messageId,req.params.id,'support',req.user.id,req.body.body,now());db.prepare('UPDATE conversations SET updated_at=? WHERE id=?').run(now(),req.params.id);auditLog(req.user.id,'conversation.reply','conversation',req.params.id,{});if(conversation.customer_email)queueEmail(conversation.customer_email,'Balasan baru dari ikrarku',`<p>${escapeHtml(req.body.body)}</p>`);res.status(201).json({id:messageId}) })
app.patch('/api/conversations/:id', auth, permit('conversations.reply'), (req,res) => { const status=req.body.status||'Open';if(!['Open','Pending','Resolved'].includes(status))return res.status(400).json({error:'Status conversation tidak valid'});db.prepare('UPDATE conversations SET status=?,updated_at=? WHERE id=?').run(status,now(),req.params.id);auditLog(req.user.id,'conversation.status','conversation',req.params.id,{status});res.json({ok:true}) })
app.get('/api/cs/metrics', auth, (req,res) => {
  if(!(req.user.permissions.includes('*')||req.user.permissions.includes('dashboard.cs')))return res.status(403).json({error:'Permission denied'})
  const scope=req.user.permissions.includes('*')?'':' WHERE assigned_cs_id=@id'; const params={id:req.user.id}
  const runCount=(sql)=>scope?db.prepare(sql).get(params).count:db.prepare(sql).get().count
  const incoming=runCount(`SELECT COUNT(*) count FROM messages m JOIN conversations c ON c.id=m.conversation_id ${scope}${scope?' AND':' WHERE'} m.sender_type='customer'`)
  const replies=runCount(`SELECT COUNT(*) count FROM messages m JOIN conversations c ON c.id=m.conversation_id ${scope}${scope?' AND':' WHERE'} m.sender_type='support'`)
  const active=runCount(`SELECT COUNT(*) count FROM conversations${scope}${scope?' AND':' WHERE'} status IN ('Open','Pending')`)
  const resolved=runCount(`SELECT COUNT(*) count FROM conversations${scope}${scope?' AND':' WHERE'} status='Resolved'`)
  res.json({incoming,replies,active,resolved})
})

app.get('/api/email-outbox', auth, permit('orders.view'), (_req,res) => res.json(db.prepare('SELECT id,to_email,subject,status,created_at,sent_at,error FROM email_outbox ORDER BY created_at DESC').all()))

if (NODE_ENV === 'production' && fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR))
  app.get(/^(?!\/api|\/uploads|\/receipts).*/, (_req,res)=>res.sendFile(path.join(DIST_DIR,'index.html')))
}

app.use((err, _req, res, _next) => { console.error(err); res.status(500).json({error:err.message || 'Server error'}) })
app.listen(PORT, () => console.log(`ikrarku v0.15 API listening on http://localhost:${PORT}`))
