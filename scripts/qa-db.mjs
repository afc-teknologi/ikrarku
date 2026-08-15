import fs from 'node:fs'
import { DatabaseSync } from 'node:sqlite'
import process from 'node:process'

const source=fs.readFileSync(new URL('../server/index.mjs',import.meta.url),'utf8')
const match=source.match(/function initDb\(\) \{\s*db\.exec\(`([\s\S]*?)`\)/)
if(!match) throw new Error('Unable to extract schema')
const db=new DatabaseSync(':memory:')
db.exec('PRAGMA foreign_keys = ON;')
db.exec(match[1])
const alters=[
 ['tasks','task_type',"TEXT NOT NULL DEFAULT 'General'"],['tasks','template_id','TEXT'],['tasks','requestor_id','TEXT'],['tasks','decision_note',"TEXT NOT NULL DEFAULT ''"],
 ['users','email_verified','INTEGER NOT NULL DEFAULT 1'],['users','verification_token','TEXT'],['users','verification_expires','TEXT'],['users','settings_json',"TEXT NOT NULL DEFAULT '{}'"],
 ['templates','canvas_json',"TEXT NOT NULL DEFAULT '[]'"],['conversations','public_token','TEXT'],['orders','user_id','TEXT']
]
for(const [table,column,definition] of alters){const cols=db.prepare(`PRAGMA table_info(${table})`).all().map(r=>r.name);if(!cols.includes(column))db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`)}
db.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_sites_slug_unique ON sites(slug) WHERE slug <> ''")
const checks=[];const check=(name,condition)=>checks.push({name,pass:Boolean(condition)})
const tables=new Set(db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(r=>r.name))
for(const table of ['roles','users','sessions','templates','articles','sounds','media_assets','payment_methods','orders','tasks','conversations','messages','sites','site_assignments','rsvp_responses','greetings','platform_settings','email_outbox','conversation_reads','audit_logs','site_revisions','site_autosaves','template_revisions','template_autosaves'])check(`table ${table}`,tables.has(table))
check('sites user_id unique',db.prepare("PRAGMA index_list(sites)").all().some(i=>i.unique===1))
check('site slug unique index exists',db.prepare("SELECT 1 ok FROM sqlite_master WHERE type='index' AND name='idx_sites_slug_unique'").get()?.ok===1)
check('assignment user FK exists',db.prepare('PRAGMA foreign_key_list(site_assignments)').all().some(f=>f.from==='user_id'&&f.table==='users'))
check('assignment editor FK exists',db.prepare('PRAGMA foreign_key_list(site_assignments)').all().some(f=>f.from==='editor_id'&&f.table==='users'))
check('messages conversation cascade exists',db.prepare('PRAGMA foreign_key_list(messages)').all().some(f=>f.from==='conversation_id'&&f.on_delete==='CASCADE'))
check('RSVP site cascade exists',db.prepare('PRAGMA foreign_key_list(rsvp_responses)').all().some(f=>f.from==='site_id'&&f.on_delete==='CASCADE'))
check('conversations has public_token',db.prepare('PRAGMA table_info(conversations)').all().some(c=>c.name==='public_token'))
check('orders has user_id',db.prepare('PRAGMA table_info(orders)').all().some(c=>c.name==='user_id'))
check('conversation_reads conversation FK exists',db.prepare('PRAGMA foreign_key_list(conversation_reads)').all().some(f=>f.from==='conversation_id'&&f.table==='conversations'))
check('conversation_reads user FK exists',db.prepare('PRAGMA foreign_key_list(conversation_reads)').all().some(f=>f.from==='user_id'&&f.table==='users'))
check('site_revisions site FK exists',db.prepare('PRAGMA foreign_key_list(site_revisions)').all().some(f=>f.from==='site_id'&&f.table==='sites'))
check('template_revisions template FK exists',db.prepare('PRAGMA foreign_key_list(template_revisions)').all().some(f=>f.from==='template_id'&&f.table==='templates'))

// real constraint tests
const t='2026-08-12T00:00:00.000Z'
db.prepare("INSERT INTO roles(id,name,permissions_json,is_system,created_at) VALUES('role_user','User','[]',1,?)").run(t)
db.prepare("INSERT INTO roles(id,name,permissions_json,is_system,created_at) VALUES('role_editor','Editor','[]',1,?)").run(t)
db.prepare("INSERT INTO users(id,first_name,last_name,email,username,password_hash,role_id,active,created_at,updated_at) VALUES('u1','A','','a@example.com','a','hash','role_user',1,?,?)").run(t,t)
db.prepare("INSERT INTO users(id,first_name,last_name,email,username,password_hash,role_id,active,created_at,updated_at) VALUES('e1','E','','e@example.com','e','hash','role_editor',1,?,?)").run(t,t)
db.prepare("INSERT INTO sites(id,user_id,title,slug,canvas_json,status,created_at,updated_at) VALUES('s1','u1','A','unique-slug','[]','Draft',?,?)").run(t,t)
let duplicateRejected=false
try{db.prepare("INSERT INTO sites(id,user_id,title,slug,canvas_json,status,created_at,updated_at) VALUES('s2','u1','B','unique-slug','[]','Draft',?,?)").run(t,t)}catch{duplicateRejected=true}
check('duplicate user/site or slug rejected',duplicateRejected)
db.prepare("INSERT INTO site_assignments(id,user_id,editor_id,assigned_by,created_at,updated_at) VALUES('as1','u1','e1','e1',?,?)").run(t,t)
check('assignment row inserts with valid FK',db.prepare("SELECT editor_id FROM site_assignments WHERE user_id='u1'").get()?.editor_id==='e1')
const failed=checks.filter(c=>!c.pass)
for(const c of checks)console.log(`${c.pass?'PASS':'FAIL'} | ${c.name}`)
console.log(`\nDB QA: ${checks.length-failed.length}/${checks.length} passed`)
if(failed.length)process.exitCode=1
