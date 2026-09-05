const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5180/api'
const ASSET_BASE = API_BASE.replace(/\/api$/, '')

export type ApiUser = { id:string; firstName:string; lastName:string; name:string; email:string; username:string; roleId:string; role:string; permissions:string[]; emailVerified?:boolean; settings?:Record<string,unknown> }

function token() { return localStorage.getItem('ikrarku-api-token') || '' }
export function setApiToken(value:string) { if(value) localStorage.setItem('ikrarku-api-token',value); else localStorage.removeItem('ikrarku-api-token') }
export function assetUrl(value?:string|null) { if(!value) return ''; return value.startsWith('http') || value.startsWith('data:') ? value : `${ASSET_BASE}${value}` }

async function request<T>(path:string, options:RequestInit={}) : Promise<T> {
  const headers = new Headers(options.headers || {})
  if(!(options.body instanceof FormData)) headers.set('Content-Type','application/json')
  if(token()) headers.set('Authorization',`Bearer ${token()}`)
  const response = await fetch(`${API_BASE}${path}`,{...options,headers})
  const data = await response.json().catch(()=>({}))
  if(!response.ok) throw new Error(data.error || `HTTP ${response.status}`)
  return data as T
}

async function download(path:string, filename:string) {
  const headers=new Headers()
  if(token()) headers.set('Authorization',`Bearer ${token()}`)
  const response=await fetch(`${API_BASE}${path}`,{headers})
  if(!response.ok){const data=await response.json().catch(()=>({}));throw new Error(data.error||`HTTP ${response.status}`)}
  const blob=await response.blob();const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=filename;link.click();URL.revokeObjectURL(url)
}

export const api = {
  health:()=>request<{ok:boolean}>('/health'),
  publicBootstrap:()=>request<any>('/public/bootstrap'),
  publicSite:(slug:string)=>request<any>(`/public/sites/${slug}`),
  publicRsvp:(slug:string,payload:any)=>request<any>(`/public/sites/${slug}/rsvp`,{method:'POST',body:JSON.stringify(payload)}),
  publicGreeting:(slug:string,payload:any)=>request<any>(`/public/sites/${slug}/greetings`,{method:'POST',body:JSON.stringify(payload)}),
  publicChat:(payload:any)=>request<any>('/public/chat',{method:'POST',body:JSON.stringify(payload)}),
  login:(username:string,password:string)=>request<{token:string;user:ApiUser}>('/auth/login',{method:'POST',body:JSON.stringify({username,password})}),
  signup:(payload:any)=>request<any>('/auth/signup',{method:'POST',body:JSON.stringify(payload)}),
  verifyEmail:(tokenValue:string)=>request<any>('/auth/verify-email',{method:'POST',body:JSON.stringify({token:tokenValue})}),
  resendVerification:(email:string)=>request<any>('/auth/resend-verification',{method:'POST',body:JSON.stringify({email})}),
  me:()=>request<{user:ApiUser}>('/me'),
  updateMe:(payload:any)=>request('/me',{method:'PATCH',body:JSON.stringify(payload)}),
  myConversation:()=>request<any>('/me/conversation'),
  logout:()=>request('/auth/logout',{method:'POST'}),
  templates:()=>request<any[]>('/templates'),
  createTemplate:(payload:any)=>request<any>('/templates',{method:'POST',body:JSON.stringify(payload)}),
  updateTemplate:(id:string,payload:any)=>request<any>(`/templates/${id}`,{method:'PATCH',body:JSON.stringify(payload)}),
  autosaveTemplate:(id:string,canvasJson:any[])=>request<any>(`/templates/${id}/autosave`,{method:'PUT',body:JSON.stringify({canvasJson})}),
  templateRevisions:(id:string)=>request<any[]>(`/templates/${id}/revisions`),
  reviewTemplate:(id:string,decision:'Approved'|'Rejected',feedback='')=>request<any>(`/templates/${id}/review`,{method:'POST',body:JSON.stringify({decision,feedback})}),
  articles:()=>request<any[]>('/articles'),
  createArticle:(payload:any)=>request<any>('/articles',{method:'POST',body:JSON.stringify(payload)}),
  updateArticle:(id:string,payload:any)=>request<any>(`/articles/${id}`,{method:'PATCH',body:JSON.stringify(payload)}),
  paymentMethods:()=>request<any[]>('/payment-methods'),
  updatePaymentMethod:(id:string,payload:any)=>request<any>(`/payment-methods/${id}`,{method:'PUT',body:JSON.stringify(payload)}),
  roles:()=>request<any[]>('/roles'),
  createRole:(payload:any)=>request<any>('/roles',{method:'POST',body:JSON.stringify(payload)}),
  updateRole:(id:string,payload:any)=>request(`/roles/${id}`,{method:'PATCH',body:JSON.stringify(payload)}),
  deleteRole:(id:string)=>request(`/roles/${id}`,{method:'DELETE'}),
  users:()=>request<any[]>('/users'),
  clients:()=>request<any[]>('/clients'),
  assignClient:(id:string,editorId?:string)=>request(`/clients/${id}/assignment`,{method:'PUT',body:JSON.stringify({editorId})}),
  clientSite:(id:string)=>request<any>(`/clients/${id}/site`),
  saveClientSite:(id:string,payload:any)=>request(`/clients/${id}/site`,{method:'PUT',body:JSON.stringify(payload)}),
  autosaveClientSite:(id:string,payload:any)=>request(`/clients/${id}/site/autosave`,{method:'PUT',body:JSON.stringify(payload)}),
  clientSiteRevisions:(id:string)=>request<any[]>(`/clients/${id}/site/revisions`),
  createUser:(payload:any)=>request<any>('/users',{method:'POST',body:JSON.stringify(payload)}),
  deleteUser:(id:string)=>request<any>(`/users/${id}`,{method:'DELETE'}),
  setUserRole:(id:string,roleId:string)=>request(`/users/${id}/role`,{method:'PATCH',body:JSON.stringify({roleId})}),
  contactableUsers:()=>request<any[]>('/contactable-users'),
  uploadMedia:(payload:FormData)=>request<any>('/media',{method:'POST',body:payload}),
  sounds:()=>request<any[]>('/sounds'),
  uploadSound:(payload:FormData)=>request<any>('/sounds',{method:'POST',body:payload}),
  deleteSound:(id:string)=>request(`/sounds/${id}`,{method:'DELETE'}),
  site:()=>request<any>('/site'),
  saveSite:(payload:any)=>request('/site',{method:'PUT',body:JSON.stringify(payload)}),
  autosaveSite:(payload:any)=>request<any>('/site/autosave',{method:'PUT',body:JSON.stringify(payload)}),
  siteRevisions:()=>request<any[]>('/site/revisions'),
  siteInteractions:()=>request<any>('/site/interactions'),
  addRsvp:(payload:any)=>request<any>('/site/rsvp',{method:'POST',body:JSON.stringify(payload)}),
  addGreeting:(payload:any)=>request<any>('/site/greetings',{method:'POST',body:JSON.stringify(payload)}),
  createOrder:(payload:any)=>request<any>('/orders',{method:'POST',body:JSON.stringify(payload)}),
  payOrder:(id:string,paymentMethod:string)=>request<any>(`/orders/${id}/pay`,{method:'POST',body:JSON.stringify({paymentMethod})}),
  order:(id:string)=>request<any>(`/orders/${id}`),
  myOrders:()=>request<any[]>('/me/orders'),
  orderAnalytics:()=>request<any>('/orders/analytics'),
  exportOrdersCsv:()=>download('/orders/export.csv','ikrarku-orders.csv'),
  exportOrdersExcel:()=>download('/orders/export.xls','ikrarku-orders.xls'),
  tasks:()=>request<any[]>('/tasks'),
  updateTask:(id:string,payload:any)=>request(`/tasks/${id}`,{method:'PATCH',body:JSON.stringify(payload)}),
  conversations:()=>request<any[]>('/conversations'),
  markConversationRead:(id:string)=>request(`/conversations/${id}/read`,{method:'POST'}),
  inboundMessage:(body:string,channel='Web')=>request<any>('/conversations/inbound',{method:'POST',body:JSON.stringify({body,channel})}),
  outboundMessage:(payload:{userId?:string;email?:string;body:string;channel?:string})=>request<any>('/conversations/outbound',{method:'POST',body:JSON.stringify(payload)}),
  updateConversation:(id:string,status:string)=>request(`/conversations/${id}`,{method:'PATCH',body:JSON.stringify({status})}),
  reply:(id:string,body:string)=>request(`/conversations/${id}/messages`,{method:'POST',body:JSON.stringify({body})}),
  csMetrics:()=>request<any>('/cs/metrics'),
  emailOutbox:()=>request<any[]>('/email-outbox'),
  auditLogs:()=>request<any[]>('/audit-logs'),
}
