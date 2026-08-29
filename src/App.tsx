import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  AlignCenter, AlignJustify, AlignLeft, AlignRight, ArrowLeft,
  BarChart3, Bold, BookOpen, CalendarDays, Check, ChevronDown, ChevronLeft,
  ChevronRight, CircleHelp, Clock3, Columns2, Columns3, Columns4, Copy,
  Crown, Eye, EyeOff, FileText, FormInput, Globe2, GripVertical, Heart,
  Image as ImageIcon, Italic, LayoutDashboard, LogOut,
  MessageCircle, MessageSquareText, Menu, Monitor, MoveDown, MoveUp,
  Palette, PanelLeftClose, Play, Plus, Repeat2, Save, Search, Send,
  Settings, ShieldCheck, Smartphone, Sparkles, Trash2, Type, Underline,
  Upload, Users, Video, WandSparkles, X, Zap, MapPin, MailOpen, UserPlus, Download, TimerReset, Film, Castle,
  ArrowRight, CheckCircle2, Layers3, UserCog, LayoutTemplate, MousePointer2, PlayCircle, UserCheck,
  List, Link2, Quote, Heading1, Heading2, Disc3, Volume2, VolumeX, ExternalLink, Music2, Pause, FileAudio,
  ShoppingCart, CreditCard, QrCode, WalletCards, ClipboardList, ReceiptText, CheckCircle, KeyRound, UserRoundCog, PackageCheck, History as HistoryIcon
} from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import './App.css'
import { api, assetUrl, setApiToken } from './api'

type Role = 'User' | 'Editor' | 'Admin' | 'Customer Service'
type View = 'landing' | 'login' | 'signup' | 'verify-email' | 'not-found' | 'dashboard' | 'templates' | 'template-detail' | 'checkout' | 'payment-success' | 'editor' | 'articles' | 'article-editor' | 'settings' | 'payment-settings' | 'orders' | 'my-orders' | 'audit-log' | 'admin' | 'users' | 'roles' | 'tasks' | 'help' | 'customer-service' | 'cs-dashboard' | 'sound-library'
type PageKey = 'pages' | 'invitees' | 'rsvp-page'
type InspectorTab = 'content' | 'style' | 'advanced'
type Alignment = 'left' | 'center' | 'right' | 'justify'
type FeatureObjectAlign = 'left' | 'center' | 'right' | 'stretch'
type CoverIconName = 'mail' | 'heart' | 'sparkles' | 'crown' | 'calendar' | 'none'
type CoverExitEffect = 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'zoom' | 'curtain' | 'split' | 'dissolve'
type FeatureType = 'text' | 'form' | 'image' | 'video' | 'gallery' | 'event' | 'greetings' | 'quote' | 'gift' | 'invitation-cover' | 'countdown' | 'location' | 'sound'
type ColumnCount = 1 | 2 | 3 | 4
type BackgroundEffect = 'none' | 'grayscale' | 'sepia' | 'darken' | 'soft-blur' | 'warm' | 'cool' | 'high-contrast'
type BackgroundMotion = 'none' | 'zoom-in' | 'zoom-out' | 'pan-left' | 'pan-right' | 'ken-burns' | 'float-soft'
type GalleryStyle = 'grid' | 'carousel' | 'filmstrip'
type CanvasLayoutMode = 'standard' | 'split-fixed-left' | 'split-fixed-right'
type Invitee = { id: string; name: string; email: string; phone: string; city: string }

type Feature = {
  id: string
  type: FeatureType
  title: string
  body: string
  fontFamily: string
  fontSize: number
  bold: boolean
  italic: boolean
  underline: boolean
  align: Alignment
  lineHeight: number
  textColor: string
  backgroundColor: string
  borderRadius: number
  padding: number
  margin: number
  entranceEffect: string
  transition: string
  mediaUrl?: string
  mediaKey?: string
  mediaName?: string
  galleryUrls?: string[]
  galleryKeys?: string[]
  galleryStyle?: GalleryStyle
  galleryAutoplay?: boolean
  galleryFullWidth?: boolean
  galleryTransitionMs?: number
  formFields?: string[]
  buttonLabel?: string
  eventDate?: string
  mapUrl?: string
  locationName?: string
  locationAddress?: string
  backgroundEffect?: BackgroundEffect
  backgroundPosition?: 'center' | 'top' | 'bottom' | 'left' | 'right'
  backgroundRepeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y'
  backgroundSize?: 'cover' | 'contain' | 'auto'
  overlayOpacity?: number
  visualEffect?: string
  effectIntensity?: number
  soundPreset?: string
  soundCatalogId?: string
  autoplay?: boolean
  backgroundGradientEnabled?: boolean
  backgroundGradientFrom?: string
  backgroundGradientTo?: string
  backgroundGradientAngle?: number
  backgroundMotion?: BackgroundMotion
  eyebrowText?: string
  guestLabelText?: string
  guestNameText?: string
  objectAlign?: FeatureObjectAlign
  objectWidth?: number
  locked?: boolean
  coverIcon?: CoverIconName
  coverIconSize?: number
  coverIconPosition?: 'top' | 'left' | 'right'
  coverButtonRadius?: number
  coverButtonBorderWidth?: number
  coverButtonBorderColor?: string
  coverButtonBackground?: string
  coverButtonTextColor?: string
  coverButtonPaddingX?: number
  coverButtonPaddingY?: number
  coverVerticalAlign?: 'top' | 'center' | 'bottom'
  coverExitEffect?: CoverExitEffect
  coverExitDuration?: number
  coverExitEasing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear'
}

type AuthAccount = { id: string; name: string; firstName?: string; lastName?: string; username: string; password: string; currentPassword?: string; role: Role; email: string; permissions?: string[]; settings?: Record<string,unknown>; emailVerified?: boolean; linkedManagedUserId?: string }

type CanvasColumn = { id: string; features: Feature[] }

type CanvasSection = {
  id: string
  name: string
  columns: CanvasColumn[]
  backgroundColor: string
  backgroundUrl?: string
  backgroundKey?: string
  backgroundEffect: BackgroundEffect
  backgroundPosition: 'center' | 'top' | 'bottom' | 'left' | 'right'
  backgroundRepeat: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y'
  backgroundGradientEnabled?: boolean
  backgroundGradientFrom?: string
  backgroundGradientTo?: string
  backgroundGradientAngle?: number
  backgroundMotion?: BackgroundMotion
  paddingX?: number
  paddingY: number
  minHeight: number
  layoutMode: CanvasLayoutMode
  invitees: Invitee[]
  templateInstanceId?: string
  sourceTemplateId?: string
  sourceTemplateName?: string
}

type Guest = { initials: string; name: string; status: 'Hadir' | 'Tidak hadir' | 'Menunggu'; pax: number; time: string; canvasId: string }
type Greeting = { name: string; message: string; date: string }
type ChatMessage = { id: string; sender: 'user' | 'support'; text: string; time: string; conversationId?: string; senderName?: string }
type ConversationStatus = 'Open' | 'Pending' | 'Resolved'
type ArticleItem = { id: string; title: string; slug: string; category: string; date: string; status: 'Published' | 'Draft'; views: string; excerpt: string; content: string; author: string; tags: string[]; coverUrl?: string }
type SoundCatalogItem = { id: string; name: string; category: string; description: string; builtIn: boolean; preset?: string; mediaKey?: string; mediaUrl?: string; fileName?: string; createdAt: string }

type Template = { id: string; name: string; category: string; accent: string; bg: string; premium: boolean; preset?: 'classic' | 'split' | 'cinematic' | 'storybook'; preview?: string; createdBy?: string; description?: string; price?: number; currency?: string; status?: 'Pending' | 'Published' | 'Approved' | 'Rejected'; canvasSections?: CanvasSection[] }


type PaymentMethod = { id:string; code:string; label:string; enabled:boolean; config:Record<string,unknown> }
type OrderResult = { id:string; orderNo:string; amount:number; currency:string; receiptUrl?:string; assignedCsId?:string; assignedEditorId?:string; status?:string; conversationId?:string }
type OrderAnalytics = { summary:{qty:number;nominal:number;customers:number}; rows:Array<Record<string,any>> }
type TaskItem = { id:string; order_id?:string; order_no?:string; customer_name?:string; email?:string; phone?:string; title:string; description:string; status:string; priority:string; assigned_user_id?:string; assigned_role_id?:string; task_type?:string; template_id?:string; template_name?:string; template_status?:string; requestor_id?:string; requestor_name?:string; requestor_email?:string; decision_note?:string; created_at:string; updated_at:string }
type RoleItem = { id:string; name:string; permissions:string[]; isSystem:boolean; userCount?:number }

type ManagedUser = {
  id: string
  name: string
  email: string
  siteTitle: string
  slug: string
  assignedTo: string
  assignedEditorId?: string
  status: 'Assigned' | 'Unassigned' | 'Active'
  plan: 'Free' | 'Essential' | 'Signature'
  canvasIds: string[]
}

const uid = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
const formatRupiah = (value:number) => new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(value||0)

function displayRole(value:string){ return value==='User'?'Customer':value==='Editor'?'Web Designer':value==='Admin'?'Administrator':value }


function getBackgroundFilter(effect: BackgroundEffect = 'none') {
  if (effect === 'grayscale') return 'grayscale(1)'
  if (effect === 'sepia') return 'sepia(.78)'
  if (effect === 'darken') return 'brightness(.55)'
  if (effect === 'soft-blur') return 'blur(2px) scale(1.02)'
  if (effect === 'warm') return 'sepia(.18) saturate(1.18) brightness(1.03)'
  if (effect === 'cool') return 'hue-rotate(168deg) saturate(.78) brightness(.98)'
  if (effect === 'high-contrast') return 'contrast(1.35) saturate(1.08)'
  return 'none'
}

function getGradientBackground(enabled: boolean | undefined, from: string | undefined, to: string | undefined, angle: number | undefined, fallback: string) {
  return enabled ? `linear-gradient(${angle ?? 135}deg, ${from || fallback}, ${to || '#d7b66f'})` : fallback
}

function getBackgroundMotionClass(motion?: BackgroundMotion) {
  return motion && motion !== 'none' ? `bg-motion-${motion}` : ''
}

function CoverIconGlyph({ name = 'mail', size = 20 }: { name?: CoverIconName; size?: number }) {
  if (name === 'none') return null
  const map: Record<Exclude<CoverIconName, 'none'>, typeof MailOpen> = { mail: MailOpen, heart: Heart, sparkles: Sparkles, crown: Crown, calendar: CalendarDays }
  const Icon = map[name as Exclude<CoverIconName, 'none'>] || MailOpen
  return <Icon size={size} />
}

function getFeatureObjectStyle(feature: Feature): React.CSSProperties {
  const width = Math.max(20, Math.min(100, feature.objectWidth ?? 100))
  const align = feature.objectAlign || 'stretch'
  if (align === 'stretch' || width >= 100) return { width: '100%', alignSelf: 'stretch' }
  if (align === 'left') return { width: `${width}%`, alignSelf: 'flex-start' }
  if (align === 'right') return { width: `${width}%`, alignSelf: 'flex-end' }
  return { width: `${width}%`, alignSelf: 'center' }
}

function getCoverContentObjectStyle(feature: Feature): React.CSSProperties {
  const width = Math.max(20, Math.min(100, feature.objectWidth ?? 82))
  const align = feature.objectAlign || 'center'
  if (align === 'stretch' || width >= 100) return { width: '100%', maxWidth: 'none', marginLeft: 0, marginRight: 0 }
  if (align === 'left') return { width: `${width}%`, maxWidth: 'none', marginLeft: 0, marginRight: 'auto' }
  if (align === 'right') return { width: `${width}%`, maxWidth: 'none', marginLeft: 'auto', marginRight: 0 }
  return { width: `${width}%`, maxWidth: 'none', marginLeft: 'auto', marginRight: 'auto' }
}

function getCoverContentAlignment(align: Alignment): React.CSSProperties['alignItems'] {
  if (align === 'left') return 'flex-start'
  if (align === 'right') return 'flex-end'
  return 'center'
}

function getCoverVerticalJustify(value?: Feature['coverVerticalAlign']): React.CSSProperties['justifyContent'] {
  if (value === 'top') return 'flex-start'
  if (value === 'bottom') return 'flex-end'
  return 'center'
}

const defaultFeatureStyle = {
  fontFamily: 'Playfair Display', fontSize: 34, bold: false, italic: false,
  underline: false, align: 'center' as Alignment, lineHeight: 1.45,
  textColor: '#154f40', backgroundColor: 'transparent', borderRadius: 12,
  padding: 12, margin: 8, entranceEffect: 'fade-up', transition: 'smooth',
  backgroundEffect: 'none' as BackgroundEffect, backgroundPosition: 'center' as const,
  backgroundRepeat: 'no-repeat' as const, backgroundSize: 'cover' as const, overlayOpacity: 45,
  visualEffect: 'none', effectIntensity: 55, backgroundGradientEnabled: false,
  backgroundGradientFrom: '#154f40', backgroundGradientTo: '#d7b66f', backgroundGradientAngle: 135,
  backgroundMotion: 'none' as BackgroundMotion,
  objectAlign: 'stretch' as FeatureObjectAlign, objectWidth: 100, locked: false,
  coverIcon: 'mail' as CoverIconName, coverIconSize: 20, coverIconPosition: 'left' as const,
  coverButtonRadius: 12, coverButtonBorderWidth: 1, coverButtonBorderColor: '#ffffff',
  coverButtonBackground: '#102f27', coverButtonTextColor: '#ffffff', coverButtonPaddingX: 30, coverButtonPaddingY: 15,
  coverVerticalAlign: 'center' as const, coverExitEffect: 'fade' as CoverExitEffect, coverExitDuration: 700, coverExitEasing: 'ease' as const
}

function makeFeature(type: FeatureType, title?: string, body?: string): Feature {
  const copy: Record<FeatureType, [string, string]> = {
    text: ['Aurelia & Reynard', '22 Juni 2026 · Yogyakarta'],
    form: ['Guest Form', 'Silakan isi informasi berikut.'],
    image: ['Our Moment', 'Klik upload untuk menambahkan gambar.'],
    video: ['Our Film', 'Tambahkan video dari perangkat Anda.'],
    gallery: ['Our Gallery', 'Kumpulan momen terbaik kami.'],
    event: ['Wedding Day', 'Akad 09.00 · Resepsi 11.00'],
    greetings: ['Greetings from Our Guests', 'Tinggalkan doa dan ucapan terbaik untuk kami.'],
    quote: ['Favorite Quote', 'Two souls, one beautiful journey.'],
    gift: ['Wedding Gift', 'Doa dan restu Anda adalah hadiah terindah.'],
    'invitation-cover': ['Chyntia & Rian', 'Dengan penuh kebahagiaan kami mengundang Anda'],
    countdown: ['Save The Date', '20 Agustus 2026 · 09.00 WIB'],
    location: ['Lokasi Pernikahan', 'Grand Ballroom Arunika, Semarang'],
    sound: ['Wedding Sound', 'Romantic Piano']
  }
  const [defaultTitle, defaultBody] = copy[type]
  return {
    id: uid(type), type, title: title ?? defaultTitle, body: body ?? defaultBody,
    ...defaultFeatureStyle,
    fontSize: type === 'invitation-cover' ? 64 : type === 'text' ? 46 : type === 'quote' ? 29 : 30,
    italic: type === 'quote',
    formFields: type === 'form' ? ['Nama lengkap', 'Email', 'Pesan'] : undefined,
    galleryUrls: type === 'gallery' ? [] : undefined,
    galleryKeys: type === 'gallery' ? [] : undefined,
    galleryStyle: type === 'gallery' ? 'grid' : undefined,
    galleryAutoplay: type === 'gallery' ? true : undefined,
    galleryFullWidth: type === 'gallery' ? false : undefined,
    galleryTransitionMs: type === 'gallery' ? 850 : undefined,
    textColor: type === 'invitation-cover' ? '#ffffff' : defaultFeatureStyle.textColor,
    objectAlign: type === 'invitation-cover' ? 'center' : defaultFeatureStyle.objectAlign,
    objectWidth: type === 'invitation-cover' ? 82 : defaultFeatureStyle.objectWidth,
    buttonLabel: type === 'invitation-cover' ? 'Buka Undangan' : undefined,
    overlayOpacity: type === 'invitation-cover' ? 0 : defaultFeatureStyle.overlayOpacity,
    eventDate: type === 'countdown' ? '2026-08-20T09:00' : undefined,
    mapUrl: type === 'location' ? 'https://maps.google.com/?q=-6.966667,110.416664' : undefined,
    locationName: type === 'location' ? 'Grand Ballroom Arunika' : undefined,
    locationAddress: type === 'location' ? 'Jl. Pemuda No. 123, Semarang' : undefined,
    soundPreset: type === 'sound' ? 'romantic-piano' : undefined,
    soundCatalogId: type === 'sound' ? 'sound-romantic-piano' : undefined,
    eyebrowText: type === 'invitation-cover' ? 'UNDANGAN PERNIKAHAN' : undefined,
    guestLabelText: type === 'invitation-cover' ? 'Kepada Yth. Bapak/Ibu/Saudara/i' : undefined,
    guestNameText: type === 'invitation-cover' ? 'Tamu Terhormat' : undefined,
    autoplay: type === 'sound' ? false : undefined
  }
}

const defaultSections: CanvasSection[] = [
  {
    id: 'canvas-hero', name: 'Hero Canvas', backgroundColor: '#f7f2e8', backgroundEffect: 'none',
    backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundGradientEnabled: false, backgroundGradientFrom: '#fffdf8', backgroundGradientTo: '#d7b66f', backgroundGradientAngle: 135, backgroundMotion: 'none', paddingX: 32, paddingY: 86, minHeight: 520, layoutMode: 'standard', invitees: [],
    columns: [{ id: 'hero-col-1', features: [makeFeature('text')] }]
  },
  {
    id: 'canvas-story', name: 'Story Canvas', backgroundColor: '#fffdf8', backgroundEffect: 'none',
    backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundGradientEnabled: false, backgroundGradientFrom: '#fffdf8', backgroundGradientTo: '#d7b66f', backgroundGradientAngle: 135, backgroundMotion: 'none', paddingX: 32, paddingY: 68, minHeight: 360, layoutMode: 'standard', invitees: [],
    columns: [
      { id: 'story-col-1', features: [makeFeature('quote', 'Our Story', 'Sebuah cerita yang bermula dari pertemuan sederhana.')] },
      { id: 'story-col-2', features: [makeFeature('image')] }
    ]
  },
  {
    id: 'canvas-event', name: 'Event Canvas', backgroundColor: '#f3eee4', backgroundEffect: 'none',
    backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundGradientEnabled: false, backgroundGradientFrom: '#fffdf8', backgroundGradientTo: '#d7b66f', backgroundGradientAngle: 135, backgroundMotion: 'none', paddingX: 32, paddingY: 64, minHeight: 340, layoutMode: 'standard', invitees: [],
    columns: [
      { id: 'event-col-1', features: [makeFeature('event', 'Akad Nikah', '09.00 WIB · Pendopo Arunika')] },
      { id: 'event-col-2', features: [makeFeature('event', 'Resepsi', '11.00 WIB · Pendopo Arunika')] }
    ]
  },
  {
    id: 'canvas-gallery', name: 'Gallery Canvas', backgroundColor: '#fffdf8', backgroundEffect: 'none',
    backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundGradientEnabled: false, backgroundGradientFrom: '#fffdf8', backgroundGradientTo: '#d7b66f', backgroundGradientAngle: 135, backgroundMotion: 'none', paddingX: 32, paddingY: 64, minHeight: 420, layoutMode: 'standard', invitees: [],
    columns: [{ id: 'gallery-col-1', features: [makeFeature('gallery')] }]
  },
  {
    id: 'canvas-guest', name: 'Guest Interaction', backgroundColor: '#125946', backgroundEffect: 'none',
    backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundGradientEnabled: false, backgroundGradientFrom: '#fffdf8', backgroundGradientTo: '#d7b66f', backgroundGradientAngle: 135, backgroundMotion: 'none', paddingX: 32, paddingY: 64, minHeight: 420, layoutMode: 'standard', invitees: [],
    columns: [
      { id: 'guest-col-1', features: [{ ...makeFeature('form', 'RSVP', 'Konfirmasikan kehadiran Anda.'), textColor: '#ffffff' }] },
      { id: 'guest-col-2', features: [{ ...makeFeature('greetings'), textColor: '#ffffff' }] }
    ]
  }
]


const templates: Template[] = [
  { id: 'split-serenity', name: 'Split Serenity', category: 'Editorial', accent: '#f4eadc', bg: '#17241f', premium: false, preset: 'split', preview: '/themes/split-reference.png' },
  { id: 'cinematic-story', name: 'Cinema Night', category: 'Cinematic', accent: '#e11d2e', bg: '#090909', premium: true, preset: 'cinematic' },
  { id: 'storybook-magic', name: 'Storybook Magic', category: 'Fairytale', accent: '#d7b66f', bg: '#dceafa', premium: true, preset: 'storybook' },
  { id: 'emerald', name: 'Emerald Vow', category: 'Elegant', accent: '#0d5442', bg: '#f7f2e8', premium: false, preset: 'classic' },
  { id: 'serenity', name: 'Serenity Bloom', category: 'Romantic', accent: '#a56f78', bg: '#f8eff0', premium: false, preset: 'classic' },
  { id: 'nusantara', name: 'Nusantara Grace', category: 'Traditional', accent: '#704b31', bg: '#f4eadc', premium: true, preset: 'classic' },
  { id: 'midnight', name: 'Midnight Promise', category: 'Modern', accent: '#20283b', bg: '#e9ecf4', premium: true, preset: 'classic' },
  { id: 'olive', name: 'Olive Garden', category: 'Garden', accent: '#687359', bg: '#f1f2e9', premium: false, preset: 'classic' },
  { id: 'sakura', name: 'Sakura Whisper', category: 'Minimalist', accent: '#b98686', bg: '#fbf4f1', premium: true, preset: 'classic' }
]

// Runtime content, accounts, customers, articles, and sound catalog are loaded from the API/database.

const widgetLibrary: { type: FeatureType; label: string; description: string; icon: typeof Type }[] = [
  { type: 'invitation-cover', label: 'Buka Undangan', description: 'Kunci scroll sampai undangan dibuka', icon: MailOpen },
  { type: 'countdown', label: 'Save The Date', description: 'Countdown menuju hari pernikahan', icon: TimerReset },
  { type: 'location', label: 'Location', description: 'QR dan tautan Google Maps', icon: MapPin },
  { type: 'text', label: 'Text', description: 'Heading dan paragraph editable', icon: Type },
  { type: 'form', label: 'Form', description: 'Form no-code dengan field kustom', icon: FormInput },
  { type: 'image', label: 'Image', description: 'Upload file maksimal 1 MB', icon: ImageIcon },
  { type: 'video', label: 'Video', description: 'Upload video maksimal 5 MB', icon: Video },
  { type: 'gallery', label: 'Gallery', description: 'Grid, carousel, atau filmstrip', icon: ImageIcon },
  { type: 'greetings', label: 'Greetings', description: 'Komentar dan doa dari tamu', icon: MessageCircle },
  { type: 'event', label: 'Event', description: 'Detail akad dan resepsi', icon: CalendarDays },
  { type: 'quote', label: 'Quote', description: 'Kutipan atau pesan pasangan', icon: Sparkles },
  { type: 'gift', label: 'Wedding Gift', description: 'Informasi hadiah pernikahan', icon: Crown },
  { type: 'sound', label: 'Sound', description: 'Preset backsound untuk opening atau section', icon: PlayCircle }
]

const entranceEffects = [
  ['none', 'None'], ['fade-up', 'Fade Up'], ['fade-down', 'Fade Down'], ['fade-left', 'Fade Left'],
  ['fade-right', 'Fade Right'], ['zoom-in', 'Zoom In'], ['zoom-out', 'Zoom Out'], ['flip-up', 'Flip Up'],
  ['flip-left', 'Flip Left'], ['rotate-in', 'Rotate In'], ['bounce-in', 'Bounce In'], ['blur-in', 'Blur In'],
  ['scale-rise', 'Scale Rise'], ['slide-spring', 'Slide Spring'], ['swing-in', 'Swing In'], ['fold-open', 'Fold Open'],
  ['letter-reveal', 'Letter Reveal'], ['mask-up', 'Mask Up'], ['mask-center', 'Mask Center'], ['glide-in', 'Glide In'],
  ['float-in', 'Float In'], ['pulse-in', 'Pulse In'], ['cinematic-rise', 'Cinematic Rise'], ['storybook-pop', 'Storybook Pop'],
  ['soft-particles', 'Soft Particles'], ['flower-petals', 'Flower Petals'], ['heart-burst', 'Heart Burst'], ['aurora-in', 'Aurora In'],
  ['shimmer-in', 'Shimmer In'], ['focus-in', 'Focus In']
]

const transitions = [
  ['smooth', 'Smooth'], ['reveal-left', 'Reveal Left'], ['reveal-right', 'Reveal Right'], ['wipe-up', 'Wipe Up'],
  ['wipe-down', 'Wipe Down'], ['parallax', 'Parallax'], ['zoom-softly', 'Zoom Softly'], ['curtain', 'Curtain'],
  ['curtain-center', 'Curtain Center'], ['dissolve', 'Dissolve'], ['slide-over', 'Slide Over'], ['elastic', 'Elastic'],
  ['crossfade', 'Crossfade'], ['cinematic-cut', 'Cinematic Cut'], ['page-turn', 'Page Turn'], ['depth-shift', 'Depth Shift'],
  ['blur-cross', 'Blur Cross'], ['light-sweep', 'Light Sweep'], ['morph', 'Morph'], ['soft-stack', 'Soft Stack']
]

const visualEffects = [
  ['none', 'None'], ['soft-glow', 'Soft Glow'], ['floating-hearts', 'Floating Hearts'], ['gold-sparkles', 'Gold Sparkles'],
  ['flower-rain', 'Flower Rain'], ['bokeh', 'Bokeh Lights'], ['aurora', 'Aurora'], ['film-grain', 'Film Grain'],
  ['light-leak', 'Light Leak'], ['confetti', 'Celebration Confetti'], ['starfield', 'Starfield'], ['water-ripple', 'Water Ripple']
]

const faqItems = [
  { category: 'Web Designer', q: 'Bagaimana menambahkan feature ke column?', a: 'Buka Site Editor, pilih column pada canvas, lalu klik atau drag feature dari panel kanan ke column tersebut.' },
  { category: 'Web Designer', q: 'Bagaimana membuat layout 1 sampai 4 column?', a: 'Klik Canvas pada Page Structure. Pada panel kanan pilih jumlah column. Feature dari column yang dihapus akan dipindahkan ke column terakhir yang tersisa.' },
  { category: 'Media', q: 'Berapa batas ukuran upload image?', a: 'Feature Image maksimal 1 MB. Background dan setiap gambar Gallery maksimal 2 MB. Video maksimal 5 MB.' },
  { category: 'Media', q: 'Bagaimana membuat gallery carousel?', a: 'Pilih feature Gallery, buka tab Style, lalu pilih Carousel. Aktifkan autoplay bila diperlukan.' },
  { category: 'Publishing', q: 'Bagaimana menyimpan dan mempublikasikan website?', a: 'Klik Save & Publish pada pojok kanan atas. Status dan struktur Canvas akan tersimpan pada website aktif.' },
  { category: 'RSVP', q: 'Di mana saya melihat konfirmasi tamu?', a: 'Buka Dashboard, lalu klik Lihat semua pada kartu RSVP terbaru untuk melihat seluruh respons.' },
  { category: 'Account', q: 'Apa perbedaan Customer, Web Designer, dan Administrator?', a: 'Customer mengelola website. Web Designer membuat template dan membantu desain. Administrator mengelola platform, approval, assignment, dan Customer Service.' },
  { category: 'Invitation', q: 'Bagaimana mengimpor daftar undangan?', a: 'Pilih Canvas, buka Content, lalu unggah CSV dengan kolom name,email,phone,city. Daftar undangan disimpan pada Canvas tersebut.' },
  { category: 'Invitation', q: 'Apa fungsi Buka Undangan?', a: 'Feature Buka Undangan mengunci scroll viewer. Setelah tombol diklik, cover akan menghilang dan isi website dapat diakses.' },
  { category: 'Layout', q: 'Bagaimana membuat column kiri fixed dan kanan scroll?', a: 'Pilih Canvas, lalu ubah Layout Mode menjadi Split: fixed left + scroll right. Layout otomatis menggunakan dua column.' },
  { category: 'Support', q: 'Bagaimana menghubungi Customer Service?', a: 'Klik tombol Live Chat di pojok kanan bawah. Percakapan akan masuk ke dashboard Customer Service.' }
]


function sampleInvitees(): Invitee[] {
  return [
    { id: uid('invitee'), name: 'Ardiani Safitri', email: 'ardiani@example.com', phone: '081234567890', city: 'Semarang' },
    { id: uid('invitee'), name: 'Bima & Keluarga', email: 'bima@example.com', phone: '081298765432', city: 'Jakarta' }
  ]
}

function hydrateSections(raw: CanvasSection[]): CanvasSection[] {
  return raw.map(section => ({
    ...section,
    layoutMode: section.layoutMode || 'standard',
    backgroundGradientEnabled: section.backgroundGradientEnabled ?? false,
    backgroundGradientFrom: section.backgroundGradientFrom || section.backgroundColor || '#ffffff',
    backgroundGradientTo: section.backgroundGradientTo || '#d7b66f',
    backgroundGradientAngle: section.backgroundGradientAngle ?? 135,
    backgroundMotion: section.backgroundMotion || 'none',
    paddingX: section.paddingX ?? 32,
    invitees: Array.isArray(section.invitees) ? section.invitees : [],
    columns: (section.columns || []).map(column => ({
      ...column,
      features: (column.features || []).map(feature => ({
        ...feature,
        buttonLabel: feature.buttonLabel || (feature.type === 'invitation-cover' ? 'Buka Undangan' : undefined),
        eventDate: feature.eventDate || (feature.type === 'countdown' ? '2026-08-20T09:00' : undefined),
        mapUrl: feature.mapUrl || (feature.type === 'location' ? 'https://maps.google.com/?q=-6.966667,110.416664' : undefined),
        backgroundEffect: feature.backgroundEffect || 'none',
        backgroundPosition: feature.backgroundPosition || 'center',
        backgroundRepeat: feature.backgroundRepeat || 'no-repeat',
        backgroundSize: feature.backgroundSize || 'cover',
        overlayOpacity: feature.type === 'invitation-cover' && !feature.mediaKey && !feature.mediaUrl ? 0 : (feature.overlayOpacity ?? 45),
        visualEffect: feature.visualEffect || 'none',
        effectIntensity: feature.effectIntensity ?? 55,
        soundPreset: feature.soundPreset || (feature.type === 'sound' ? 'romantic-piano' : undefined),
        soundCatalogId: feature.soundCatalogId || (feature.type === 'sound' ? 'sound-romantic-piano' : undefined),
        backgroundGradientEnabled: feature.backgroundGradientEnabled ?? false,
        backgroundGradientFrom: feature.backgroundGradientFrom || '#154f40',
        backgroundGradientTo: feature.backgroundGradientTo || '#d7b66f',
        backgroundGradientAngle: feature.backgroundGradientAngle ?? 135,
        backgroundMotion: feature.backgroundMotion || 'none',
        textColor: feature.type === 'invitation-cover' && (!feature.textColor || feature.textColor.toLowerCase() === '#154f40') ? '#ffffff' : (feature.textColor || defaultFeatureStyle.textColor),
        objectAlign: feature.objectAlign || (feature.type === 'invitation-cover' ? 'center' : 'stretch'),
        objectWidth: feature.objectWidth ?? (feature.type === 'invitation-cover' ? 82 : 100),
        coverIcon: feature.coverIcon || (feature.type === 'invitation-cover' ? 'mail' : undefined),
        coverIconSize: feature.coverIconSize ?? (feature.type === 'invitation-cover' ? 20 : undefined),
        coverIconPosition: feature.coverIconPosition || (feature.type === 'invitation-cover' ? 'left' : undefined),
        coverVerticalAlign: feature.coverVerticalAlign || (feature.type === 'invitation-cover' ? 'center' : undefined),
        coverExitEffect: feature.coverExitEffect || (feature.type === 'invitation-cover' ? 'fade' : undefined),
        coverExitDuration: feature.coverExitDuration ?? (feature.type === 'invitation-cover' ? 700 : undefined),
        coverExitEasing: feature.coverExitEasing || (feature.type === 'invitation-cover' ? 'ease' : undefined),
        autoplay: feature.autoplay ?? (feature.type === 'sound' ? false : undefined),
        galleryFullWidth: feature.galleryFullWidth ?? (feature.type === 'gallery' ? false : undefined),
        galleryTransitionMs: feature.galleryTransitionMs ?? (feature.type === 'gallery' ? 850 : undefined),
        eyebrowText: feature.eyebrowText || (feature.type === 'invitation-cover' ? 'UNDANGAN PERNIKAHAN' : undefined),
        guestLabelText: feature.guestLabelText || (feature.type === 'invitation-cover' ? 'Kepada Yth. Bapak/Ibu/Saudara/i' : undefined),
        guestNameText: feature.guestNameText || (feature.type === 'invitation-cover' ? 'Tamu Terhormat' : undefined)
      }))
    }))
  }))
}

function buildTemplateSections(templateId: string): CanvasSection[] {
  const standard = (id: string, name: string, backgroundColor: string, columns: CanvasColumn[], minHeight = 420): CanvasSection => ({
    id, name, columns, backgroundColor, backgroundEffect: 'none', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundGradientEnabled: false, backgroundGradientFrom: backgroundColor, backgroundGradientTo: '#d7b66f', backgroundGradientAngle: 135, backgroundMotion: 'none', paddingX: 32, paddingY: 72, minHeight, layoutMode: 'standard', invitees: sampleInvitees()
  })
  if (templateId === 'split-serenity') {
    const cover = standard('split-cover', 'Opening Cover', '#10231d', [{ id: 'split-cover-col', features: [{ ...makeFeature('invitation-cover'), title: 'Chyntia & Rian', body: 'Dengan penuh kebahagiaan kami mengundang Anda', textColor: '#ffffff', backgroundColor: 'rgba(0,0,0,.28)' }] }], 760)
    const split = standard('split-story', 'Fixed Story Canvas', '#111b17', [
      { id: 'split-left', features: [{ ...makeFeature('text', 'Chyntia & Rian', 'Ardiani Safitri · Semarang'), textColor: '#ffffff', fontSize: 58 }, { ...makeFeature('quote', 'Undangan Pernikahan', '20 · 08 · 2026'), textColor: '#f2e8d9' }] },
      { id: 'split-right', features: [{ ...makeFeature('countdown'), textColor: '#ffffff' }, { ...makeFeature('event', 'Akad & Resepsi', 'Kamis, 20 Agustus 2026 · 09.00 WIB'), textColor: '#ffffff' }, { ...makeFeature('location'), textColor: '#ffffff' }, { ...makeFeature('gallery'), textColor: '#ffffff' }, { ...makeFeature('greetings'), textColor: '#ffffff' }] }
    ], 760)
    split.layoutMode = 'split-fixed-left'
    split.paddingY = 0
    return [cover, split]
  }
  if (templateId === 'cinematic-story') {
    return [
      standard('cinema-cover', 'Premiere Cover', '#070707', [{ id: 'cinema-cover-col', features: [{ ...makeFeature('invitation-cover', 'THE WEDDING PREMIERE', 'Aurelia & Reynard'), textColor: '#ffffff', backgroundColor: 'rgba(0,0,0,.58)', buttonLabel: 'Play Our Story' }] }], 760),
      standard('cinema-hero', 'Featured Story', '#0b0b0b', [{ id: 'cinema-hero-col', features: [{ ...makeFeature('text', 'A Love Story', 'Now streaming: 22 June 2026'), textColor: '#ffffff', fontSize: 62 }, { ...makeFeature('countdown'), textColor: '#ffffff' }] }], 620),
      standard('cinema-scenes', 'Episodes & Moments', '#111111', [{ id: 'cinema-scenes-1', features: [{ ...makeFeature('gallery', 'Season of Us', 'Our favorite scenes.'), textColor: '#ffffff', galleryStyle: 'filmstrip' }] }, { id: 'cinema-scenes-2', features: [{ ...makeFeature('location'), textColor: '#ffffff' }, { ...makeFeature('greetings'), textColor: '#ffffff' }] }], 560)
    ]
  }
  if (templateId === 'storybook-magic') {
    return [
      standard('story-cover', 'Magic Gate', '#dceafa', [{ id: 'story-cover-col', features: [{ ...makeFeature('invitation-cover', 'Once Upon Our Promise', 'Aurelia & Reynard invite you to their enchanted day'), textColor: '#213b5c', backgroundColor: 'rgba(255,255,255,.72)', buttonLabel: 'Enter Our Story' }] }], 760),
      standard('story-hero', 'Storybook Chapter', '#f6f0df', [{ id: 'story-hero-1', features: [{ ...makeFeature('quote', 'Chapter One', 'Two hearts found their way home.'), textColor: '#294664' }] }, { id: 'story-hero-2', features: [{ ...makeFeature('countdown'), textColor: '#294664' }] }], 540),
      standard('story-details', 'Royal Celebration', '#dceafa', [{ id: 'story-details-1', features: [{ ...makeFeature('event', 'The Royal Ceremony', '22 June 2026 · 09.00 WIB'), textColor: '#294664' }] }, { id: 'story-details-2', features: [{ ...makeFeature('location'), textColor: '#294664' }] }], 480),
      standard('story-wishes', 'Wishes & Memories', '#f9f4e9', [{ id: 'story-wishes-col', features: [{ ...makeFeature('gallery'), textColor: '#294664', galleryStyle: 'carousel' }, { ...makeFeature('greetings'), textColor: '#294664' }] }], 620)
    ]
  }
  return hydrateSections(defaultSections.map(section => ({ ...section, id: uid('canvas'), columns: section.columns.map(column => ({ ...column, id: uid('column'), features: column.features.map(feature => ({ ...feature, id: uid(feature.type) })) })) })))
}

function normalizeCoverSections(raw: CanvasSection[]): CanvasSection[] {
  const hydrated = hydrateSections(raw)
  let found = false
  const cleaned = hydrated.map(section => ({ ...section, columns: section.columns.map(column => ({ ...column, features: column.features.filter(feature => { if (feature.type !== 'invitation-cover') return true; if (found) return false; found = true; return true }) })) }))
  const coverIndex = cleaned.findIndex(section => section.columns.some(column => column.features.some(feature => feature.type === 'invitation-cover')))
  if (coverIndex > 0) cleaned.unshift(cleaned.splice(coverIndex, 1)[0])
  return cleaned
}

function _loadSections(): CanvasSection[] {
  try {
    const saved = localStorage.getItem('ikrarku-site-v6') || localStorage.getItem('ikrarku-site-v5') || localStorage.getItem('ikrara-site-v3')
    if (!saved) return normalizeCoverSections(buildTemplateSections('split-serenity'))
    const parsed = JSON.parse(saved) as { sections?: CanvasSection[] }
    return Array.isArray(parsed.sections) ? normalizeCoverSections(parsed.sections) : normalizeCoverSections(buildTemplateSections('split-serenity'))
  } catch {
    return normalizeCoverSections(buildTemplateSections('split-serenity'))
  }
}



function loadSession(): { view: View; role: Role; accountId: string } {
  try {
    const saved = JSON.parse(localStorage.getItem('ikrarku-session-v7') || 'null') as { view?: View; role?: Role; accountId?: string } | null
    if (saved?.view && saved?.role && saved?.accountId) return { view: saved.view, role: saved.role, accountId: saved.accountId }
  } catch { /* ignore invalid session */ }
  return { view: 'landing', role: 'User', accountId: 'acc-user-demo' }
}

function _loadConversationStatuses(): Record<string, ConversationStatus> {
  try { return JSON.parse(localStorage.getItem('ikrarku-conversation-status-v7') || '{}') as Record<string, ConversationStatus> } catch { return {} }
}

function playNotificationTone() {
  const AudioContextClass=window.AudioContext || (window as typeof window & {webkitAudioContext?:typeof AudioContext}).webkitAudioContext
  if(!AudioContextClass) return
  const context=new AudioContextClass();const gain=context.createGain();const osc=context.createOscillator();osc.type='sine';osc.frequency.setValueAtTime(880,context.currentTime);gain.gain.setValueAtTime(.0001,context.currentTime);gain.gain.exponentialRampToValueAtTime(.12,context.currentTime+.02);gain.gain.exponentialRampToValueAtTime(.0001,context.currentTime+.35);osc.connect(gain);gain.connect(context.destination);osc.start();osc.stop(context.currentTime+.38)
}

function App() {
  const initialSession = useMemo(() => localStorage.getItem('ikrarku-api-token') ? loadSession() : ({ view:'landing' as View, role:'User' as Role, accountId:'' }), [])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<View>(initialSession.view)
  const [role, setRole] = useState<Role>(initialSession.role)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [templateCatalog, setTemplateCatalog] = useState<Template[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(templates[0])
  const [sections, setSections] = useState<CanvasSection[]>([])
  const [slug, setSlug] = useState('')
  const [siteTitle, setSiteTitle] = useState('')
  const [saved, setSaved] = useState(false)
  const [accounts, setAccounts] = useState<AuthAccount[]>([])
  const [currentAccountId, setCurrentAccountId] = useState(initialSession.accountId)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [guestsOpen, setGuestsOpen] = useState(false)
  const [guests, setGuests] = useState<Guest[]>([])
  const [greetings, setGreetings] = useState<Greeting[]>([])
  const [toast, setToast] = useState('')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [managedUsers, setManagedUsers] = useState<ManagedUser[]>([])
  const [articleItems, setArticleItems] = useState<ArticleItem[]>([])
  const [soundCatalog, setSoundCatalog] = useState<SoundCatalogItem[]>([])
  const [articleEditorId, setArticleEditorId] = useState<string>('new')
  const [activeManagedUserId, setActiveManagedUserId] = useState('')
  const [siteOwnerUserId, setSiteOwnerUserId] = useState('')
  const [selectedDashboardCanvasId, setSelectedDashboardCanvasId] = useState(sections[0]?.id || '')
  const [confirmCanvasDeleteIds, setConfirmCanvasDeleteIds] = useState<string[]>([])
  const [templateCreatorOpen, setTemplateCreatorOpen] = useState(false)
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(false)
  const [chatWidgetOpen, setChatWidgetOpen] = useState(false)
  const [publicTemplates, setPublicTemplates] = useState<Template[]>([])
  const [selectedPublicTemplate, setSelectedPublicTemplate] = useState<Template | null>(null)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [checkoutOrder, setCheckoutOrder] = useState<OrderResult | null>(null)
  const [landingScrollTarget, setLandingScrollTarget] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)
  const funnelPrevViewRef = useRef<View>('landing')
  const [lastPaidOrder, setLastPaidOrder] = useState<OrderResult | null>(null)
  const [taskItems, setTaskItems] = useState<TaskItem[]>([])
  const [roleItems, setRoleItems] = useState<RoleItem[]>([])
  const [databaseOnline, setDatabaseOnline] = useState(false)
  const [csMetricData,setCsMetricData]=useState({incoming:0,replies:0,active:0,resolved:0})
  const [serverConversations,setServerConversations]=useState<any[]>([])
  const [publicSiteData,setPublicSiteData]=useState<any|null>(null)
  const [contactableUsers,setContactableUsers]=useState<any[]>([])
  const [editorMode,setEditorMode]=useState<'site'|'template'>('site')
  const [orderAnalytics,setOrderAnalytics]=useState<OrderAnalytics>({summary:{qty:0,nominal:0,customers:0},rows:[]})
  const [myOrders,setMyOrders]=useState<any[]>([])
  const [auditLogs,setAuditLogs]=useState<any[]>([])
  const [notificationMuted,setNotificationMuted]=useState<boolean>(()=>localStorage.getItem('ikrarku-notification-muted')==='true')
  const notificationBaseline=useRef<{tasks:number;messages:number}|null>(null)
  const customerSupportBaseline=useRef<number|null>(null)

  useEffect(() => {
    let active = true
    const bootstrap = async () => {
      try {
        const data = await api.publicBootstrap()
        if (!active) return
        const mappedTemplates = (data.templates || []).map((item: any) => ({ ...item, preview: item.preview ? assetUrl(item.preview) : undefined })) as Template[]
        setPublicTemplates(mappedTemplates)
        setTemplateCatalog(mappedTemplates)
        if (mappedTemplates[0]) setSelectedTemplate(mappedTemplates[0])
        setArticleItems((data.articles || []).map((item: ArticleItem) => ({ ...item, coverUrl: item.coverUrl ? assetUrl(item.coverUrl) : undefined })))
        setPaymentMethods(data.paymentMethods || [])
        setDatabaseOnline(true)
        const pathSlug=window.location.pathname.replace(/^\/+|\/+$/g,'')
        const reserved=new Set(['','login','signup','verify-email','dashboard','templates','template-detail','pesan-sekarang','pembayaran-berhasil','articles','settings','admin','orders','my-orders','users','roles','tasks','audit-log','help','cs-dashboard','customer-service','sound-library','payment-settings','editor'])
        let slugNotFound=false
        if(pathSlug==='verify-email') setView('verify-email')
        if(pathSlug && !reserved.has(pathSlug)) {
          try {
            const publicSite=await api.publicSite(pathSlug)
            setPublicSiteData({...publicSite,sections:hydrateSections(publicSite.sections || [])})
          } catch { setPublicSiteData(null); slugNotFound=true; setNotFound(true) }
        }
        const token = localStorage.getItem('ikrarku-api-token')
        if (token) {
          try {
            const me = await api.me()
            const user = me.user
            const mappedRole = (user.role === 'Customer Service' ? 'Customer Service' : user.role) as Role
            const account: AuthAccount = { id:user.id, name:user.name, firstName:user.firstName, lastName:user.lastName, username:user.username, password:'', role:mappedRole, email:user.email, permissions:user.permissions || [],settings:user.settings || {},emailVerified:user.emailVerified }
            setAccounts([account])
            setCurrentAccountId(user.id)
            setRole(mappedRole)
            if(mappedRole==='User'){setSiteOwnerUserId(user.id);setActiveManagedUserId(user.id)}
            const savedSession = (() => { try { return JSON.parse(localStorage.getItem('ikrarku-session-v7') || 'null') as {view?:View;role?:Role;accountId?:string}|null } catch { return null } })()
            const fallbackView:View = mappedRole === 'Admin' ? 'admin' : mappedRole === 'Customer Service' ? 'cs-dashboard' : 'dashboard'
            const protectedView = savedSession?.accountId === user.id && savedSession.view && !['landing','login','signup','verify-email'].includes(savedSession.view) ? savedSession.view : fallbackView
            setView(previous => previous === 'landing' ? protectedView : previous)
          } catch {
            setApiToken('')
            localStorage.removeItem('ikrarku-session-v7')
            setView('landing')
          }
        }
        if(slugNotFound) setView('not-found')
      } catch (error) {
        console.error(error)
        setDatabaseOnline(false)
      } finally {
        if (active) setLoading(false)
      }
    }
    void bootstrap()
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (view === 'landing' || view === 'login' || view === 'signup') return
    localStorage.setItem('ikrarku-session-v7', JSON.stringify({ view, role, accountId: currentAccountId }))
  }, [view, role, currentAccountId])

  const currentAccount = accounts.find(account => account.id === currentAccountId) || accounts[0]
  useEffect(()=>{const stored=currentAccount?.settings?.notificationSoundMuted;if(typeof stored==='boolean'){setNotificationMuted(stored);localStorage.setItem('ikrarku-notification-muted',String(stored))}},[currentAccountId,currentAccount?.settings])
  const hasPermission = (permission: string) => Boolean(currentAccount?.permissions?.includes('*') || currentAccount?.permissions?.includes(permission))
  const permissionKey = (currentAccount?.permissions || []).join('|')

  useEffect(() => {
    if (!currentAccountId) return
    const protectedPermissions = permissionKey ? permissionKey.split('|') : []
    const permitted = (permission: string) => protectedPermissions.includes('*') || protectedPermissions.includes(permission)
    const loadProtected = async () => {
      try {
        const [serverTemplates, serverArticles] = await Promise.all([api.templates(), api.articles()])
        setTemplateCatalog(serverTemplates.map((item:any) => ({ ...item, preview:item.preview ? assetUrl(item.preview) : undefined })))
        setArticleItems(serverArticles.map((item:ArticleItem) => ({ ...item, coverUrl:item.coverUrl ? assetUrl(item.coverUrl) : undefined })))
        if (permitted('tasks.view')) {
          try { setTaskItems(await api.tasks()) } catch { setTaskItems([]) }
        }
        try {
          const sounds = await api.sounds()
          setSoundCatalog(sounds.map((item:any)=>({id:item.id,name:item.name,category:item.category,description:item.description,builtIn:false,mediaUrl:item.url?assetUrl(item.url):undefined,fileName:item.fileName,createdAt:item.createdAt})))
        } catch { setSoundCatalog([]) }
        if (permitted('dashboard.cs') || permitted('conversations.view')) {
          try { setCsMetricData(await api.csMetrics()) } catch { setCsMetricData({incoming:0,replies:0,active:0,resolved:0}) }
          try { setServerConversations(await api.conversations()) } catch { setServerConversations([]) }
        }
        if (permitted('conversations.outbound')) {
          try { setContactableUsers(await api.contactableUsers()) } catch { setContactableUsers([]) }
        }
        if (permitted('orders.view')) { try { setOrderAnalytics(await api.orderAnalytics()) } catch { setOrderAnalytics({summary:{qty:0,nominal:0,customers:0},rows:[]}) } }
        if (permitted('dashboard.user')) { try { setMyOrders(await api.myOrders()) } catch { setMyOrders([]) } }
        if (protectedPermissions.includes('*')) { try { setAuditLogs(await api.auditLogs()) } catch { setAuditLogs([]) } }
        if (permitted('users.view')) {
          try {
            const clients=await api.clients()
            setManagedUsers(clients.map((user:any)=>({id:user.id,name:user.name,email:user.email,siteTitle:user.siteTitle||user.name,slug:user.slug||'',assignedTo:user.assignedTo||'',assignedEditorId:user.assignedEditorId||'',status:user.assignedTo?'Assigned':'Unassigned',plan:'Free',canvasIds:user.canvasIds||[]})))
          } catch { setManagedUsers([]) }
        }
        if (permitted('users.manage') || permitted('roles.manage') || permitted('settings.payment')) {
          if (permitted('settings.payment')) try { setPaymentMethods(await api.paymentMethods()) } catch { /* permission state handled by UI */ }
          if (permitted('roles.manage')) try { setRoleItems(await api.roles()) } catch { setRoleItems([]) }
          if (permitted('users.manage')) try {
            const serverUsers = await api.users()
            setAccounts(serverUsers.map((user:any) => ({ id:user.id,name:user.name,firstName:user.firstName,lastName:user.lastName,username:user.username,password:'',role:user.role as Role,email:user.email,permissions:user.permissions || [],settings:user.settings || {},emailVerified:user.emailVerified })))
          } catch { /* keep current account */ }
        }
        if (permitted('dashboard.user')) try {
          const site = await api.site()
          if (site) {
            setSiteOwnerUserId(currentAccountId)
            setActiveManagedUserId(currentAccountId)
            setSiteTitle(site.title || '')
            setSlug(site.slug || '')
            setSections(hydrateSections(site.sections || []))
            if (site.templateId) {
              const match = serverTemplates.find((item:any) => item.id === site.templateId)
              if (match) setSelectedTemplate(match)
            }
          }
        } catch { /* user site may not exist yet */ }
        if (permitted('dashboard.user')) {
          try {
            const interactions=await api.siteInteractions()
            setGuests(interactions.guests || [])
            setGreetings(interactions.greetings || [])
          } catch { setGuests([]); setGreetings([]) }
        }
        try {
          const ownConversation=await api.myConversation()
          if(ownConversation?.conversation) {
            setChatMessages((ownConversation.messages || []).map((message:any)=>({
              id:message.id,
              sender:message.sender_type==='support'?'support':'user',
              text:message.body,
              time:message.created_at,
              conversationId:currentAccountId,
              senderName:message.sender_type==='support'?'ikrarku Support':currentAccount?.name || 'User'
            })))
          }
        } catch { /* no customer conversation yet */ }
      } catch (error) { console.error(error) }
    }
    void loadProtected()
  }, [currentAccountId, role, permissionKey])

  useEffect(() => {
    if (!currentAccountId || view==='landing' || view==='login' || view==='signup' || view==='verify-email') return
    let stopped=false
    const poll=async()=>{
      try{
        let nextTasks=taskItems.length;let nextMessages=serverConversations.reduce((total,conv)=>total+(conv.messages||[]).filter((message:any)=>message.sender_type!=='support').length,0)
        if(hasPermission('tasks.view')) { const fresh=await api.tasks();if(!stopped){setTaskItems(fresh);nextTasks=fresh.filter((task:any)=>!['Done','Cancelled','Approved','Rejected'].includes(task.status)).length} }
        if(hasPermission('conversations.view')) { const fresh=await api.conversations();if(!stopped){setServerConversations(fresh);nextMessages=fresh.reduce((total:number,conv:any)=>total+(conv.messages||[]).filter((message:any)=>message.sender_type!=='support').length,0);try{setCsMetricData(await api.csMetrics())}catch{/* ignore */}} }
        const previous=notificationBaseline.current
        if(previous && (nextTasks>previous.tasks || nextMessages>previous.messages) && !notificationMuted){playNotificationTone();flash(nextMessages>previous.messages?'Pesan baru masuk ke Customer Service.':'Task baru masuk ke dashboard.')}
        notificationBaseline.current={tasks:nextTasks,messages:nextMessages}
      }catch{/* polling remains silent while API is unavailable */}
    }
    void poll();const interval=window.setInterval(()=>void poll(),10000)
    return()=>{stopped=true;window.clearInterval(interval)}
  },[currentAccountId,view,notificationMuted,permissionKey])

  const refreshMyChat=useCallback(async(notify=true)=>{
    if(!currentAccountId) return
    try{
      const own=await api.myConversation()
      if(!own?.conversation) return
      const mapped=(own.messages||[]).map((message:any)=>({id:message.id,sender:message.sender_type==='support'?'support':'user',text:message.body,time:message.created_at,conversationId:currentAccountId,senderName:message.sender_type==='support'?'ikrarku Support':currentAccount?.name || 'User'}))
      setChatMessages(previousMessages=>{ const otherThreads=previousMessages.filter(message=>(message.conversationId||currentAccountId)!==currentAccountId); return [...otherThreads,...mapped] })
      const supportCount=mapped.filter((message:any)=>message.sender==='support').length
      const previousSupport=customerSupportBaseline.current
      if(notify && previousSupport!==null && supportCount>previousSupport && !notificationMuted){playNotificationTone();flash('Balasan baru dari ikrarku Support.')}
      customerSupportBaseline.current=supportCount
    }catch{/* customer conversation optional */}
  },[currentAccountId,currentAccount,notificationMuted])

  useEffect(()=>{
    if(!currentAccountId || view==='landing' || view==='login' || view==='signup' || view==='verify-email') return
    let stopped=false
    const tick=async()=>{ if(!stopped) await refreshMyChat() }
    void tick()
    const interval=window.setInterval(()=>void tick(), chatWidgetOpen?2500:8000)
    return()=>{stopped=true;window.clearInterval(interval)}
  },[currentAccountId,view,chatWidgetOpen,refreshMyChat])

  // Browser back button support for the public order funnel (template-detail / checkout / payment-success)
  useEffect(()=>{
    const funnel=new Set<View>(['template-detail','checkout','payment-success','login','signup'])
    if(funnel.has(view) && !funnel.has(funnelPrevViewRef.current)) window.history.pushState({ikrarkuFunnel:true},'')
    funnelPrevViewRef.current=view
  },[view])
  useEffect(()=>{
    const funnel=new Set<View>(['template-detail','checkout','payment-success','login','signup'])
    const onPop=()=>{ if(funnel.has(funnelPrevViewRef.current)){ const cur=funnelPrevViewRef.current; if(cur==='template-detail'||cur==='checkout'||cur==='payment-success') setLandingScrollTarget('templates'); setView('landing') } }
    window.addEventListener('popstate',onPop)
    return ()=>window.removeEventListener('popstate',onPop)
  },[])

  // Per-view browser tab title and address-bar path (TC-018 SEO / URL relevance)
  useEffect(()=>{
    const titles:Partial<Record<View,string>>={
      landing:'ikrarku Sites — Wedding Website & Undangan Digital',
      login:'Masuk — ikrarku Sites', signup:'Daftar Akun — ikrarku Sites', 'verify-email':'Verifikasi Email — ikrarku Sites',
      'not-found':'Halaman tidak ditemukan — ikrarku Sites',
      templates:'Templates — ikrarku Sites', 'template-detail':'Detail Template — ikrarku Sites',
      checkout:'Pesan Sekarang — ikrarku Sites', 'payment-success':'Pembayaran Berhasil — ikrarku Sites',
      articles:'ikrarku Journal — ikrarku Sites', dashboard:'Dashboard — ikrarku Sites', admin:'Administrator — ikrarku Sites',
      'cs-dashboard':'Customer Service — ikrarku Sites', 'customer-service':'Support Inbox — ikrarku Sites',
    }
    document.title=titles[view]||'ikrarku Sites'
    const paths:Partial<Record<View,string>>={
      landing:'/', login:'/login', signup:'/signup', 'verify-email':'/verify-email', 'not-found':window.location.pathname,
      templates:'/templates', 'template-detail':'/templates', checkout:'/pesan-sekarang', 'payment-success':'/pembayaran-berhasil', articles:'/articles',
    }
    const target=paths[view]
    if(target && window.location.pathname!==target){ try{ window.history.replaceState(window.history.state,'',target+window.location.search) }catch{/* ignore */} }
  },[view])

  const flash = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2300)
  }

  const applyTemplate = (template: Template) => {
    setEditorMode('site')
    const sourceSections=template.canvasSections?.length ? hydrateSections(template.canvasSections) : buildTemplateSections(template.id)
    const templateInstanceId=uid('template-instance')
    const generated = sourceSections.map(section => ({
      ...section, id:uid('canvas'), name:section.name,
      templateInstanceId, sourceTemplateId:template.id, sourceTemplateName:template.name,
      columns:section.columns.map(column=>({...column,id:uid('column'),features:column.features.map(feature=>({...feature,id:uid(feature.type)}))}))
    }))
    const existingHasCover=sections.some(section=>section.columns.some(column=>column.features.some(feature=>feature.type==='invitation-cover')))
    const additions=existingHasCover?generated.map(section=>({...section,columns:section.columns.map(column=>({...column,features:column.features.filter(feature=>feature.type!=='invitation-cover')}))})):generated
    const nextSections=normalizeCoverSections([...sections,...additions])
    const firstNewId=additions[0]?.id || nextSections[0]?.id || ''
    setSelectedTemplate(template)
    setSections(nextSections)
    setSelectedDashboardCanvasId(firstNewId)
    setGuests([])
    sessionStorage.setItem('ikrarku-edit-canvas',firstNewId)
    setView('editor')
    flash(`Template ${template.name} ditambahkan sebagai satu design pada website.`)
  }

  const addBlankCanvasFromTemplates = () => {
    setEditorMode('site')
    const section: CanvasSection = { id: uid('canvas'), name: 'New Canvas', columns: [{ id: uid('column'), features: [] }], backgroundColor: '#fffdf8', backgroundEffect: 'none', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundGradientEnabled: false, backgroundGradientFrom: '#fffdf8', backgroundGradientTo: '#d7b66f', backgroundGradientAngle: 135, backgroundMotion: 'none', paddingX: 32, paddingY: 60, minHeight: 420, layoutMode: 'standard', invitees: [], templateInstanceId:uid('custom-design'), sourceTemplateName:'Custom Design' }
    setSections(previous => [...previous, section])
    sessionStorage.setItem('ikrarku-edit-canvas', section.id)
    setView('editor')
  }

  const deleteCanvasFromTemplates = (sectionIds: string[]) => {
    setConfirmCanvasDeleteIds(sectionIds)
  }

  const performDeleteCanvas = () => {
    if (!confirmCanvasDeleteIds.length) return
    const deleting = new Set(confirmCanvasDeleteIds)
    const nextSections = sections.filter(section => !deleting.has(section.id))
    setSections(nextSections)
    setSelectedDashboardCanvasId(previous => deleting.has(previous) ? (nextSections[0]?.id || '') : previous)
    setConfirmCanvasDeleteIds([])
    flash('Design berhasil dihapus dari website.')
  }

  const duplicateCanvasFromTemplates = (sectionIds: string[]) => {
    const sources = sections.filter(section => sectionIds.includes(section.id))
    if (!sources.length) return
    const nextInstanceId=uid('template-instance')
    const siteAlreadyHasCover=sections.some(section=>section.columns.some(column=>column.features.some(feature=>feature.type==='invitation-cover')))
    const duplicates:CanvasSection[]=sources.map(source => ({
      ...source,
      id: uid('canvas'),
      name: `${source.name} Copy`,
      templateInstanceId:nextInstanceId,
      columns: source.columns.map(column => ({
        ...column,
        id: uid('column'),
        features: column.features.filter(feature => !(siteAlreadyHasCover && feature.type === 'invitation-cover')).map(feature => ({ ...feature, id: uid(feature.type) }))
      })),
      invitees: source.invitees.map(item => ({ ...item, id: uid('invitee') }))
    }))
    setSections(previous => normalizeCoverSections([...previous, ...duplicates]))
    flash('Template design berhasil diduplikasi sebagai satu group baru.')
  }

  const editCanvasFromTemplates = (sectionId: string) => {
    setEditorMode('site')
    sessionStorage.setItem('ikrarku-edit-canvas', sectionId)
    setView('editor')
  }

  const login = async (username: string, password: string) => {
    try {
      const result = await api.login(username, password)
      setApiToken(result.token)
      const user = result.user
      const mappedRole = user.role as Role
      const account: AuthAccount = { id:user.id,name:user.name,firstName:user.firstName,lastName:user.lastName,username:user.username,password:'',role:mappedRole,email:user.email,permissions:user.permissions || [],settings:user.settings || {},emailVerified:user.emailVerified }
      setAccounts([account])
      setCurrentAccountId(user.id)
      setRole(mappedRole)
      if(mappedRole==='User'){setSiteOwnerUserId(user.id);setActiveManagedUserId(user.id)}
      const checkoutReturn=sessionStorage.getItem('ikrarku-checkout-return')==='true'
      const nextView: View = checkoutReturn && mappedRole==='User' && selectedPublicTemplate ? 'checkout' : user.permissions?.includes('*') ? 'admin' : user.permissions?.includes('dashboard.cs') ? 'cs-dashboard' : 'dashboard'
      if(nextView==='checkout')sessionStorage.removeItem('ikrarku-checkout-return')
      setView(nextView)
      localStorage.setItem('ikrarku-session-v7', JSON.stringify({ view: nextView, role: mappedRole, accountId: user.id }))
      flash(`Selamat datang, ${user.name}.`)
      return true
    } catch (error) {
      flash(error instanceof Error ? error.message : 'Login gagal.')
      return false
    }
  }

  const signupAccount = async (name:string, username:string, password:string, passwordConfirm:string, email:string) => {
    try {
      const [firstName,...restName]=name.trim().split(/\s+/)
      const result=await api.signup({firstName:firstName||'User',lastName:restName.join(' '),email,username,password,passwordConfirm})
      flash('Registrasi berhasil. Silakan verifikasi email sebelum login.')
      return {ok:true,devVerificationUrl:result.devVerificationUrl as string|undefined}
    } catch(error){flash(error instanceof Error?error.message:'Registrasi gagal.');return {ok:false}}
  }

  const createAccount = async (name: string, username: string, password: string, accountRole: Role, email: string) => {
    try {
      const [firstName, ...restName] = name.trim().split(/\s+/)
      const roles = roleItems.length ? roleItems : await api.roles()
      const roleMatch = roles.find(item => item.name === accountRole)
      if (!roleMatch) throw new Error('Role belum tersedia di database.')
      await api.createUser({ firstName:firstName || 'User', lastName:restName.join(' '), email, username, password, roleId:roleMatch.id })
      flash('Akun berhasil dibuat oleh Admin dan dapat digunakan untuk login.')
      return true
    } catch (error) {
      flash(error instanceof Error ? error.message : 'Gagal membuat akun.')
      return false
    }
  }

  const saveArticles = async (article: Omit<ArticleItem, 'id' | 'date' | 'views'>, existingId?: string) => {
    try {
      const payload = { ...article, coverUrl:article.coverUrl || null }
      const item = existingId ? await api.updateArticle(existingId, payload) : await api.createArticle(payload)
      setArticleItems(previous => existingId ? previous.map(value => value.id === existingId ? item : value) : [item, ...previous])
      flash(article.status === 'Published' ? 'Article berhasil dipublikasikan.' : 'Article berhasil disimpan sebagai draft.')
      setView('articles')
    } catch (error) { flash(error instanceof Error ? error.message : 'Gagal menyimpan article.') }
  }

  const openArticleEditor = (id = 'new') => {
    setArticleEditorId(id)
    setView('article-editor')
  }

  const addSoundToCatalog = async (name: string, category: string, description: string, file: File) => {
    if (!file.type.startsWith('audio/') && !file.type.startsWith('video/')) { flash('Sound harus berupa audio atau MP4/video dengan audio.'); return false }
    if (file.size > 15 * 1024 * 1024) { flash('File sound maksimal 15 MB.'); return false }
    try {
      const form = new FormData()
      form.append('name',name); form.append('category',category); form.append('description',description); form.append('file',file)
      const saved = await api.uploadSound(form)
      const item: SoundCatalogItem = { id:saved.id,name:saved.name,category,description,builtIn:false,mediaUrl:assetUrl(saved.url),fileName:file.name,createdAt:new Intl.DateTimeFormat('id-ID',{dateStyle:'medium'}).format(new Date()) }
      setSoundCatalog(previous => [item, ...previous])
      flash('Sound berhasil ditambahkan ke database catalog.')
      return true
    } catch (error) { flash(error instanceof Error ? error.message : 'Gagal mengunggah sound.'); return false }
  }

  const deleteSoundFromCatalog = (id: string) => {
    const item = soundCatalog.find(sound => sound.id === id)
    if (item?.builtIn) { flash('Built-in sound tidak dapat dihapus.'); return }
    void api.deleteSound(id).then(()=>{setSoundCatalog(previous=>previous.filter(sound=>sound.id!==id));flash('Sound dihapus dari database catalog.')}).catch(error=>flash(error instanceof Error?error.message:'Gagal menghapus sound.'))
  }

  const changeUserRole = async (userId:string, roleId:string) => {
    try {
      await api.setUserRole(userId,roleId)
      const serverUsers=await api.users()
      setAccounts(serverUsers.map((user:any)=>({id:user.id,name:user.name,firstName:user.firstName,lastName:user.lastName,username:user.username,password:'',role:user.role as Role,email:user.email,permissions:user.permissions || []})))
      flash('Role user berhasil diperbarui.')
    } catch(error){ flash(error instanceof Error ? error.message : 'Gagal memperbarui role.') }
  }

  const assignClient = async (userId:string, editorId?:string) => {
    try {
      await api.assignClient(userId,editorId || currentAccountId)
      const clients=await api.clients()
      setManagedUsers(clients.map((item:any)=>({id:item.id,name:item.name,email:item.email,siteTitle:item.siteTitle||item.name,slug:item.slug||'',assignedTo:item.assignedTo||'',assignedEditorId:item.assignedEditorId||'',status:item.assignedTo?'Assigned':'Unassigned',plan:'Free',canvasIds:item.canvasIds||[]})))
      flash(editorId?'Assignment Customer diperbarui.':'Customer berhasil di-assign ke Web Designer aktif.')
    } catch(error){flash(error instanceof Error?error.message:'Gagal melakukan assignment.')}
  }

  const manageUserCanvas = async (userId: string) => {
    const user = managedUsers.find(item => item.id === userId)
    if (!user) return
    try {
      if(!user.assignedEditorId && role==='Editor') { await api.assignClient(userId,currentAccountId) }
      const site=await api.clientSite(userId)
      setActiveManagedUserId(userId)
      setSiteOwnerUserId(userId)
      setSiteTitle(site?.title || user.siteTitle || user.name)
      setSlug(site?.slug || user.slug || user.email.split('@')[0].replace(/[^a-z0-9-]/gi,'-').toLowerCase())
      setSections(hydrateSections(site?.sections || []))
      if(site?.templateId){const match=templateCatalog.find(item=>item.id===site.templateId);if(match)setSelectedTemplate(match)}
      setView('templates')
      const clients=await api.clients()
      setManagedUsers(clients.map((item:any)=>({id:item.id,name:item.name,email:item.email,siteTitle:item.siteTitle||item.name,slug:item.slug||'',assignedTo:item.assignedTo||'',assignedEditorId:item.assignedEditorId||'',status:item.assignedTo?'Assigned':'Unassigned',plan:'Free',canvasIds:item.canvasIds||[]})))
      flash(`Sekarang mengelola Canvas milik ${user.name}.`)
    } catch(error){flash(error instanceof Error?error.message:'Gagal membuka Canvas Customer.')}
  }

  const createTemplate = async (name: string, category: string, accent: string, price: number, description: string) => {
    try {
      const template = await api.createTemplate({ name, category, accent, bg:'#f7f2e8', price, description, premium:price > 0, preset:'classic', canvasJson:[] }) as Template
      const firstCanvas: CanvasSection = {
        id: uid('canvas'), name: 'Main Canvas', columns: [{ id: uid('column'), features: [] }],
        backgroundColor: '#fffdf8', backgroundEffect: 'none', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
        backgroundGradientEnabled: false, backgroundGradientFrom: '#fffdf8', backgroundGradientTo: accent, backgroundGradientAngle: 135,
        backgroundMotion: 'none', paddingY: 60, minHeight: 560, layoutMode: 'standard', invitees: []
      }
      setTemplateCatalog(previous => [template, ...previous])
      if (template.status === 'Published' || template.status === 'Approved') setPublicTemplates(previous => [template, ...previous.filter(item => item.id !== template.id)])
      setSelectedTemplate(template)
      setEditorMode('template')
      setSiteTitle(name)
      setSections([firstCanvas])
      setSelectedDashboardCanvasId(firstCanvas.id)
      sessionStorage.setItem('ikrarku-edit-canvas', firstCanvas.id)
      setTemplateCreatorOpen(false)
      setView('editor')
      if(template.status==='Pending' && hasPermission('tasks.view')) { try { setTaskItems(await api.tasks()) } catch { /* approval remains stored server-side */ } }
      flash(template.status === 'Pending' ? `Template ${name} dibuat dan masuk ke Approval Administrator.` : `Template ${name} dibuat.`)
    } catch (error) { flash(error instanceof Error ? error.message : 'Gagal membuat template.') }
  }

  const approveTemplate = async (templateId:string, status:'Approved'|'Rejected', feedback='') => {
    try {
      const updated = await api.reviewTemplate(templateId,status,feedback)
      setTemplateCatalog(previous => previous.map(item => item.id===templateId ? updated : item))
      setTaskItems(await api.tasks())
      if(status==='Approved') setPublicTemplates(previous => [updated,...previous.filter(item=>item.id!==templateId)])
      else setPublicTemplates(previous=>previous.filter(item=>item.id!==templateId))
      flash(`Template ${status === 'Approved' ? 'disetujui dan dipublish' : 'ditolak'}. Email notifikasi telah masuk outbox.`)
    } catch(error){ flash(error instanceof Error ? error.message : 'Gagal memperbarui approval.') }
  }

  const saveSite = async () => {
    const cleanSections = sections.map(section => ({
      ...section,
      backgroundUrl: section.backgroundUrl,
      columns: section.columns.map(column => ({ ...column, features: column.features.map(feature => ({ ...feature })) }))
    }))
    try {
      const payload={ title:siteTitle, slug, templateId:selectedTemplate.id, sections:cleanSections, status:'Published' }
      const result:any=siteOwnerUserId && siteOwnerUserId!==currentAccountId ? await api.saveClientSite(siteOwnerUserId,payload) : await api.saveSite(payload)
      setSaved(true)
      flash(`Website dipublikasikan: ${result.url || `${window.location.origin}/${slug}`}`)
      window.setTimeout(() => setSaved(false), 1800)
    } catch (error) { flash(error instanceof Error ? error.message : 'Gagal menyimpan website.') }
  }

  const saveEditorContent = async () => {
    if(editorMode==='site') return saveSite()
    const cleanSections=sections.map(section=>({...section,columns:section.columns.map(column=>({...column,features:column.features.map(feature=>({...feature}))}))}))
    try{
      const updated=await api.updateTemplate(selectedTemplate.id,{canvasJson:cleanSections,name:siteTitle}) as Template
      setTemplateCatalog(previous=>previous.map(item=>item.id===updated.id?{...updated,canvasSections:cleanSections}:item))
      setSelectedTemplate({...updated,canvasSections:cleanSections})
      setSaved(true);flash(updated.status==='Pending'?'Draft template disimpan. Approval tetap Pending.':'Template berhasil disimpan.');window.setTimeout(()=>setSaved(false),1800)
    }catch(error){flash(error instanceof Error?error.message:'Gagal menyimpan template.')}
  }

  const openTemplateJourney = (template: Template) => {
    setSelectedPublicTemplate(template)
    setView('template-detail')
  }

  const beginCheckout = (template: Template) => {
    try{ const draft=JSON.parse(sessionStorage.getItem('ikrarku-checkout-draft')||'{}'); if(draft.templateId && draft.templateId!==template.id) sessionStorage.removeItem('ikrarku-checkout-draft') }catch{ sessionStorage.removeItem('ikrarku-checkout-draft') }
    setSelectedPublicTemplate(template)
    setCheckoutOrder(null)
    setView('checkout')
  }

  const createCheckoutOrder = async (customerName:string,email:string,phone:string) => {
    if (!selectedPublicTemplate) return null
    try {
      const order = await api.createOrder({ customerName,email,phone,templateId:selectedPublicTemplate.id })
      setCheckoutOrder(order)
      return order
    } catch (error) { flash(error instanceof Error ? error.message : 'Gagal membuat order.'); return null }
  }

  const payCheckoutOrder = async (paymentMethod:string) => {
    if (!checkoutOrder) return false
    try {
      const paid = await api.payOrder(checkoutOrder.id,paymentMethod)
      if(paid.paymentUrl){ window.location.href=paid.paymentUrl; return true }
      const result = { ...checkoutOrder, ...paid, receiptUrl:paid.receiptUrl ? assetUrl(paid.receiptUrl) : undefined }
      setLastPaidOrder(result)
      sessionStorage.removeItem('ikrarku-checkout-draft')
      setCheckoutOrder(null)
      setView('payment-success')
      return true
    } catch (error) { flash(error instanceof Error ? error.message : 'Pembayaran gagal.'); return false }
  }

  const addGreeting = (name: string, message: string) => {
    const canvasId=selectedDashboardCanvasId || sections[0]?.id || ''
    void api.addGreeting({name,message,canvasId}).then(result=>setGreetings(previous => [{ id:result.id, name, message, date:new Date().toISOString(), canvasId }, ...previous])).catch(error=>flash(error instanceof Error?error.message:'Gagal menyimpan greeting.'))
  }
  const addGuest = (name: string, status: Guest['status'], pax: number, canvasId = selectedDashboardCanvasId || sections[0]?.id || '') => {
    void api.addRsvp({name,status,pax,canvasId}).then(result=>setGuests(previous => [{ id:result.id, initials:name.slice(0,2).toUpperCase(), name, status, pax, time:new Date().toISOString(), canvasId }, ...previous])).catch(error=>flash(error instanceof Error?error.message:'Gagal menyimpan RSVP.'))
  }
  const sendChat = async (sender: ChatMessage['sender'], text: string, conversationId = currentAccountId, senderName = currentAccount?.name || 'Guest') => {
    if (!text.trim()) return
    const optimistic={ id:uid('chat'),sender,text:text.trim(),time:'Baru saja',conversationId,senderName } as ChatMessage
    setChatMessages(previous=>[...previous,optimistic])
    try {
      const token=localStorage.getItem('ikrarku-api-token')
      const publicConversationToken=localStorage.getItem('ikrarku-public-chat-token')||''
      const result=token ? await api.inboundMessage(text.trim(),'Web') : await api.publicChat({name:senderName,email:conversationId==='guest'?'':currentAccount?.email||'',body:text.trim(),channel:'Web',conversationToken:publicConversationToken})
      if(!token&&result.conversationToken)localStorage.setItem('ikrarku-public-chat-token',result.conversationToken)
      if(token) {
        try {
          const ownConversation=await api.myConversation()
          if(ownConversation?.conversation) setChatMessages((ownConversation.messages || []).map((message:any)=>({id:message.id,sender:message.sender_type==='support'?'support':'user',text:message.body,time:message.created_at,conversationId:currentAccountId,senderName:message.sender_type==='support'?'ikrarku Support':currentAccount?.name || 'User'})))
        } catch { /* optimistic message remains visible */ }
      }
      // Keep the local conversation key stable so the message remains visible after it is persisted to the CS inbox.
      if(hasPermission('conversations.view')) { setServerConversations(await api.conversations()); setCsMetricData(await api.csMetrics()) }
    } catch(error){ flash(error instanceof Error?error.message:'Pesan belum tersimpan ke inbound CS.') }
  }

  const updateCurrentAccount = async (patch: Partial<AuthAccount>) => {
    try {
      await api.updateMe({ firstName:patch.firstName, lastName:patch.lastName, email:patch.email, password:patch.password || undefined, currentPassword:patch.currentPassword || undefined, settings:patch.settings })
      const nextName = `${patch.firstName ?? currentAccount?.firstName ?? ''} ${patch.lastName ?? currentAccount?.lastName ?? ''}`.trim() || currentAccount?.name || 'User'
      setAccounts(previous => previous.map(account => account.id === currentAccountId ? { ...account, ...patch, name:nextName } : account))
      flash('Pengaturan akun berhasil disimpan ke database.')
    } catch (error) { flash(error instanceof Error ? error.message : 'Gagal menyimpan akun.') }
  }

  const updateNotificationSetting = async (muted:boolean) => {
    setNotificationMuted(muted);localStorage.setItem('ikrarku-notification-muted',String(muted))
    try { await api.updateMe({settings:{notificationSoundMuted:muted}});setAccounts(previous=>previous.map(account=>account.id===currentAccountId?{...account,settings:{...(account.settings||{}),notificationSoundMuted:muted}}:account));flash(muted?'Notifikasi suara dimute.':'Notifikasi suara diaktifkan.') } catch(error){flash(error instanceof Error?error.message:'Gagal menyimpan pengaturan notifikasi.')}
  }

  const signOut = () => {
    void api.logout().catch(()=>undefined)
    setApiToken('')
    localStorage.removeItem('ikrarku-session-v7')
    setView('landing')
    setChatWidgetOpen(false)
  }

  if (loading) return <LoadingScreen />

  if (notFound) return <NotFoundPage onHome={() => { setNotFound(false); window.history.replaceState(window.history.state,'','/'); setView('landing') }} />


  if (publicSiteData) return <PublicWeddingPage site={publicSiteData} />

  if (view === 'landing') return <><LandingPage setView={setView} articles={articleItems.filter(article => article.status === 'Published')} templates={publicTemplates} onTemplate={openTemplateJourney} databaseOnline={databaseOnline} scrollTarget={landingScrollTarget} onScrolled={() => setLandingScrollTarget(null)} /><ChatWidget messages={chatMessages.filter(message => (message.conversationId || 'guest') === 'guest')} sendChat={text => sendChat('user', text, 'guest', 'Website Visitor')} open={chatWidgetOpen} onOpenChange={setChatWidgetOpen} /></>


  if (view === 'template-detail' && selectedPublicTemplate) return <TemplateJourneyPage template={selectedPublicTemplate} onBack={() => { setLandingScrollTarget('templates'); setView('landing') }} onPreview={() => setSelectedTemplate(selectedPublicTemplate)} onOrder={() => beginCheckout(selectedPublicTemplate)} />

  if (view === 'checkout' && selectedPublicTemplate) return <CheckoutPage template={selectedPublicTemplate} paymentMethods={paymentMethods.filter(method => method.enabled)} order={checkoutOrder} onBack={() => setView('template-detail')} createOrder={createCheckoutOrder} payOrder={payCheckoutOrder} onSignIn={()=>{sessionStorage.setItem('ikrarku-checkout-return','true');setView('login')}} onRegister={()=>{sessionStorage.setItem('ikrarku-checkout-return','true');setView('signup')}} />

  if (view === 'payment-success' && lastPaidOrder) return <PaymentSuccessPage order={lastPaidOrder} template={selectedPublicTemplate} onHome={() => setView('landing')} />

  if (view === 'login' || view === 'signup') return <Auth view={view} setView={setView} login={login} signupAccount={signupAccount} />
  if (view === 'verify-email') return <VerifyEmailPage setView={setView} />

  if (view === 'not-found') return <NotFoundPage onHome={() => { window.history.replaceState(window.history.state,'','/'); setView('landing') }} />


  if (view === 'editor') {
    return <>
      <Editor
        sections={sections} setSections={setSections} slug={slug} setSlug={setSlug}
        siteTitle={siteTitle} setSiteTitle={setSiteTitle} selectedTemplate={selectedTemplate}
        saveSite={saveEditorContent} saved={saved} editorMode={editorMode} setView={setView} setPreviewOpen={setPreviewOpen}
        greetings={greetings} addGreeting={addGreeting} guests={guests} addGuest={addGuest} flash={flash} soundCatalog={soundCatalog} autosaveContent={async draft=>{const payload={title:draft.siteTitle,slug:draft.slug,templateId:selectedTemplate.id,sections:draft.sections};if(editorMode==='template')await api.autosaveTemplate(selectedTemplate.id,draft.sections);else if(siteOwnerUserId&&siteOwnerUserId!==currentAccountId)await api.autosaveClientSite(siteOwnerUserId,payload);else await api.autosaveSite(payload)}} loadRevisions={async()=>editorMode==='template'?api.templateRevisions(selectedTemplate.id):siteOwnerUserId&&siteOwnerUserId!==currentAccountId?api.clientSiteRevisions(siteOwnerUserId):api.siteRevisions()}
      />
      <ChatWidget messages={chatMessages.filter(message => (message.conversationId || currentAccountId) === currentAccountId)} sendChat={text => sendChat('user', text)} open={chatWidgetOpen} onOpenChange={setChatWidgetOpen} />
      {previewOpen && <PreviewModal sections={sections} template={selectedTemplate} greetings={greetings} addGreeting={addGreeting} guests={guests} addGuest={addGuest} onClose={() => setPreviewOpen(false)} />}
      {toast && <Toast message={toast} />}
    </>
  }

  return <div className="app-shell">
    <Sidebar role={role} view={view} setView={setView} open={sidebarOpen} logout={signOut} currentAccount={currentAccount} />
    <main className={`main-content ${sidebarOpen ? '' : 'collapsed'}`}>
      <Topbar role={role} toggleSidebar={() => setSidebarOpen(previous => !previous)} currentAccount={currentAccount} onChat={() => hasPermission('conversations.view') ? setView('customer-service') : setChatWidgetOpen(true)} onSettings={() => setAccountSettingsOpen(true)} onPaymentSettings={() => setView('payment-settings')} canPaymentSettings={hasPermission('settings.payment')} onLogout={signOut} />
      {view === 'dashboard' && !hasPermission('dashboard.editor') && !hasPermission('dashboard.cs') && <Dashboard setView={setView} slug={slug} siteTitle={siteTitle} guests={guests} sections={sections} orders={myOrders} selectedCanvasId={selectedDashboardCanvasId} setSelectedCanvasId={setSelectedDashboardCanvasId} setGuestsOpen={setGuestsOpen} setPreviewOpen={setPreviewOpen} />}
      {view === 'dashboard' && hasPermission('dashboard.editor') && <EditorDashboard users={managedUsers} setView={setView} manageUserCanvas={manageUserCanvas} templateCount={templateCatalog.length} supportCount={serverConversations.length} />}
      {view === 'dashboard' && hasPermission('dashboard.cs') && <CustomerServiceDashboard metrics={csMetricData} conversations={serverConversations} setView={setView} />}
      {view === 'cs-dashboard' && <CustomerServiceDashboard metrics={csMetricData} conversations={serverConversations} setView={setView} />}
      {view === 'templates' && <Templates role={role} siteTitle={siteTitle} activeUser={managedUsers.find(user => user.id === activeManagedUserId)} selectedTemplate={selectedTemplate} templateCatalog={templateCatalog} sections={sections} applyTemplate={applyTemplate} addBlankCanvas={addBlankCanvasFromTemplates} deleteCanvas={deleteCanvasFromTemplates} duplicateCanvas={duplicateCanvasFromTemplates} editCanvas={editCanvasFromTemplates} openTemplateCreator={() => setTemplateCreatorOpen(true)} canCreate={hasPermission('templates.create')} />}
      {view === 'users' && hasPermission('users.manage') && <UserManagement role={role} accounts={accounts} roles={roleItems} createAccount={createAccount} changeUserRole={changeUserRole} clients={managedUsers} onAssign={assignClient} onManage={manageUserCanvas} />}
      {view === 'users' && !hasPermission('users.manage') && hasPermission('users.view') && <ClientManagement clients={managedUsers} onAssign={(userId)=>assignClient(userId,currentAccountId)} onManage={manageUserCanvas} />}
      {view === 'articles' && <Articles articles={articleItems} openEditor={openArticleEditor} canManage={hasPermission('articles.manage')} />}
      {view === 'article-editor' && <ArticleEditorPage article={articleEditorId === 'new' ? undefined : articleItems.find(item => item.id === articleEditorId)} role={role} onBack={() => setView('articles')} onSave={(article) => saveArticles(article, articleEditorId === 'new' ? undefined : articleEditorId)} />}
      {view === 'settings' && <SettingsPage slug={slug} setSlug={setSlug} flash={flash} notificationMuted={notificationMuted} onNotificationMuted={updateNotificationSetting} />}
      {view === 'my-orders' && <MyOrdersPage orders={myOrders} setView={setView} />}
      {view === 'audit-log' && <AuditLogPage logs={auditLogs} onRefresh={async()=>setAuditLogs(await api.auditLogs())} />}
      {view === 'orders' && <OrdersAnalyticsPage data={orderAnalytics} onRefresh={async()=>{try{setOrderAnalytics(await api.orderAnalytics())}catch(error){flash(error instanceof Error?error.message:'Gagal memuat order.')}}} />}
      {view === 'payment-settings' && <PaymentSettingsPage methods={paymentMethods} onChange={async (method) => { try { const updated = await api.updatePaymentMethod(method.id,method); setPaymentMethods(previous => previous.map(item => item.id===updated.id?updated:item)); flash('Payment Method diperbarui.') } catch(error){ flash(error instanceof Error ? error.message : 'Gagal memperbarui Payment Method.') } }} />}
      {view === 'tasks' && <TasksPage tasks={taskItems} onRefresh={async () => { try { setTaskItems(await api.tasks()) } catch(error){ flash(error instanceof Error ? error.message : 'Gagal memuat task.') } }} onUpdate={async (taskId,status) => { await api.updateTask(taskId,{status}); setTaskItems(previous => previous.map(item=>item.id===taskId?{...item,status}:item)) }} onReview={approveTemplate} canApprove={hasPermission('templates.approve')} />}
      {view === 'roles' && <RolesPermissionsPage roles={roleItems} onRefresh={async()=>setRoleItems(await api.roles())} onCreate={async(name,permissions)=>{ await api.createRole({name,permissions}); setRoleItems(await api.roles()); flash('Role berhasil ditambahkan.') }} onUpdate={async(id,name,permissions)=>{ await api.updateRole(id,{name,permissions}); setRoleItems(await api.roles()); flash('Role diperbarui.') }} onDelete={async(id)=>{ await api.deleteRole(id); setRoleItems(await api.roles()); flash('Role dihapus.') }} />}
      {view === 'admin' && <AdminDashboard setView={setView} templates={templateCatalog} articles={articleItems} accounts={accounts} tasks={taskItems} metrics={csMetricData} roles={roleItems} createAccount={createAccount} orderAnalytics={orderAnalytics} />}
      {view === 'help' && <HelpCenter />}
      {view === 'sound-library' && <SoundLibrary catalog={soundCatalog} addSound={addSoundToCatalog} deleteSound={deleteSoundFromCatalog} />}
      {view === 'customer-service' && <CustomerServiceDatabase conversations={serverConversations} users={contactableUsers} onRefresh={async()=>{setServerConversations(await api.conversations());setCsMetricData(await api.csMetrics())}} onReply={async(conversationId,text)=>{await api.reply(conversationId,text);setServerConversations(await api.conversations());setCsMetricData(await api.csMetrics());void refreshMyChat(false)}} onOutbound={async(userId,text)=>{await api.outboundMessage({userId,body:text,channel:'Web'});setServerConversations(await api.conversations());setCsMetricData(await api.csMetrics());void refreshMyChat(false);flash('Pesan dikirim ke Customer.')}} onStatus={async(conversationId,status)=>{await api.updateConversation(conversationId,status);setServerConversations(await api.conversations());setCsMetricData(await api.csMetrics())}} onRead={async(conversationId)=>{await api.markConversationRead(conversationId);setServerConversations(previous=>previous.map(item=>item.id===conversationId?{...item,unreadCount:0}:item))}} />}
    </main>
    <ChatWidget messages={chatMessages.filter(message => (message.conversationId || currentAccountId) === currentAccountId)} sendChat={text => sendChat('user', text)} open={chatWidgetOpen} onOpenChange={setChatWidgetOpen} />
    {previewOpen && <PreviewModal sections={sections} template={selectedTemplate} greetings={greetings} addGreeting={addGreeting} guests={guests} addGuest={addGuest} onClose={() => setPreviewOpen(false)} />}
    {guestsOpen && <GuestsModal guests={guests.filter(guest => guest.canvasId === selectedDashboardCanvasId)} onClose={() => setGuestsOpen(false)} />}
    {confirmCanvasDeleteIds.length > 0 && <ConfirmModal title="Hapus Design dari Website?" description="Seluruh Canvas, Column, Feature, daftar undangan, dan struktur internal yang berada di dalam design ini akan dihapus dari website. Tindakan ini tidak dapat dibatalkan." confirmLabel="Hapus Design" onCancel={() => setConfirmCanvasDeleteIds([])} onConfirm={performDeleteCanvas} />}
    {accountSettingsOpen && currentAccount && <AccountSettingsModal account={currentAccount} onClose={() => setAccountSettingsOpen(false)} onSave={patch => { updateCurrentAccount(patch); setAccountSettingsOpen(false) }} />}
    {templateCreatorOpen && <TemplateCreatorModal onClose={() => setTemplateCreatorOpen(false)} onCreate={createTemplate} />}
    {toast && <Toast message={toast} />}
  </div>
}

function PublicWeddingPage({site}:{site:any}) {
  const [guests,setGuests]=useState<Guest[]>([])
  const [greetings,setGreetings]=useState<Greeting[]>([])
  const template:Template={id:site.templateId||'public',name:site.template?.name||site.title,category:'Wedding',accent:site.template?.accent||'#125946',bg:site.template?.bg||'#fffdf8',premium:false,preset:site.template?.preset||'classic',status:'Published'}
  const addGuest=(name:string,status:Guest['status'],pax:number,canvasId='')=>{void api.publicRsvp(site.slug,{name,status,pax,canvasId}).then(result=>setGuests(previous=>[{id:result.id,initials:name.slice(0,2).toUpperCase(),name,status,pax,time:new Date().toISOString(),canvasId},...previous]))}
  const addGreeting=(name:string,message:string)=>{const canvasId=site.sections?.[0]?.id||'';void api.publicGreeting(site.slug,{name,message,canvasId}).then(result=>setGreetings(previous=>[{id:result.id,name,message,date:new Date().toISOString(),canvasId},...previous]))}
  return <div className="public-site-route"><WeddingCanvas page="pages" sections={site.sections||[]} selectedTemplate={template} greetings={greetings} addGreeting={addGreeting} guests={guests} addGuest={addGuest}/></div>
}

function LandingPage({ setView, articles, templates, onTemplate, databaseOnline: _databaseOnline, scrollTarget, onScrolled }: { setView: (view: View) => void; articles: ArticleItem[]; templates: Template[]; onTemplate: (template: Template) => void; databaseOnline: boolean; scrollTarget?: string | null; onScrolled?: () => void }) {
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pricedTemplates = useMemo(() => [...templates].sort((a, b) => (a.price || 0) - (b.price || 0)), [templates])
  const featuredTemplates = pricedTemplates.slice(0, 3)
  useEffect(() => {
    if (!scrollTarget) return
    const timer = window.setTimeout(() => { document.getElementById(scrollTarget)?.scrollIntoView({ behavior: 'smooth' }); onScrolled?.() }, 60)
    return () => window.clearTimeout(timer)
  }, [scrollTarget, onScrolled])
  if (selectedArticle) return <ArticleReaderPage article={selectedArticle} onBack={() => setSelectedArticle(null)} publicMode />
  return <div className="landing-page landing-v015">
    <header className="landing-nav"><Brand /><nav><a href="#inspiration">Inspiration</a><a href="#templates">Templates</a><a href="#how-it-works">How it works</a><a href="#articles">Articles</a></nav><div className="landing-nav-actions"><button className="landing-login" onClick={() => setView('login')}>Sign in</button><button className="landing-cta" onClick={() => document.getElementById('templates')?.scrollIntoView({behavior:'smooth'})}>Explore templates <ArrowRight size={16} /></button><button className="landing-burger" aria-label="Buka menu" aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen(value => !value)}>{mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}</button></div>{mobileMenuOpen && <div className="landing-mobile-menu"><a href="#inspiration" onClick={() => setMobileMenuOpen(false)}>Inspiration</a><a href="#templates" onClick={() => setMobileMenuOpen(false)}>Templates</a><a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How it works</a><a href="#articles" onClick={() => setMobileMenuOpen(false)}>Articles</a><button className="mobile-menu-signin" onClick={() => { setMobileMenuOpen(false); setView('login') }}>Sign in</button><button className="mobile-menu-cta" onClick={() => { setMobileMenuOpen(false); document.getElementById('templates')?.scrollIntoView({behavior:'smooth'}) }}>Explore templates <ArrowRight size={15} /></button></div>}</header>
    <main>
      <section className="landing-hero creative-hero"><div className="hero-glow one" /><div className="hero-glow two" /><div className="hero-copy"><div className="hero-pill"><WandSparkles size={14} /> Create a wedding story that feels like you</div><h1>Design your day.<br /><em>Share it beautifully.</em></h1><p>Pilih design, personalisasi setiap section, tambahkan RSVP, galeri, lokasi, musik, dan Buka Undangan—semuanya dalam visual editor yang mudah dipahami.</p><div className="hero-actions"><button onClick={() => document.getElementById('templates')?.scrollIntoView({behavior:'smooth'})}>Start with a template <ArrowRight size={17} /></button><button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({behavior:'smooth'})}><PlayCircle size={17} /> See how it works</button></div><div className="hero-trust"><div><strong>Visual</strong><span>Design without code</span></div><div><strong>Responsive</strong><span>Desktop & mobile</span></div><div><strong>Supported</strong><span>CS + Web Designer</span></div></div></div>
        <div className="hero-creative-studio"><div className="studio-toolbar"><span><MousePointer2 size={14}/> Select</span><span><Palette size={14}/> Style</span><span><WandSparkles size={14}/> Animate</span></div><div className="studio-stage"><div className="studio-page"><small>THE WEDDING OF</small><h3>Aurelia <em>&</em> Raynard</h3><p>Every promise deserves a beautiful beginning.</p><button>Open Invitation</button></div><div className="studio-floating-card card-a"><ImageIcon size={15}/><span>Gallery</span></div><div className="studio-floating-card card-b"><MessageCircle size={15}/><span>Greetings</span></div><div className="studio-floating-card card-c"><Palette size={15}/><span>Gradient</span></div></div><div className="studio-pages">{featuredTemplates.length ? featuredTemplates.map((template,index)=><button key={template.id} onClick={()=>onTemplate(template)} className={index===0?'active':''}><i style={{background:template.bg}}/><span>{template.name}</span></button>) : <><button className="active"><i/><span>Classic</span></button><button><i/><span>Editorial</span></button><button><i/><span>Storybook</span></button></>}</div></div>
      </section>
      <section className="logo-strip creative-strip"><span>DRAG & DROP</span><span>GRADIENT</span><span>ANIMATION</span><span>RSVP</span><span>GALLERY</span><span>SOUND</span><span>LIVE PREVIEW</span></section>
      <section id="inspiration" className="landing-section inspiration-section"><div className="section-intro"><span>DESIGN INSPIRATION</span><h2>Start from a feeling, not a blank page.</h2><p>Jelajahi gaya yang paling dekat dengan karakter pernikahan Anda, lalu personalisasi warna, typography, media, dan motion.</p></div><div className="inspiration-rail">{[['Editorial','Clean & timeless'],['Romantic','Soft & intimate'],['Modern','Bold & minimal'],['Traditional','Warm & cultural'],['Cinematic','Dramatic & immersive']].map(([name,desc],index)=><article key={name} className={`inspiration-card tone-${index}`} onClick={()=>document.getElementById('templates')?.scrollIntoView({behavior:'smooth'})}><span>{String(index+1).padStart(2,'0')}</span><h3>{name}</h3><p>{desc}</p><ArrowRight size={16}/></article>)}</div></section>
      <section id="how-it-works" className="landing-section product-section"><div className="section-intro"><span>CREATE VISUALLY</span><h2>Simple enough to start. Powerful enough to make it yours.</h2><p>Editor menggunakan pola yang familiar: pilih object, atur style, align, preview, undo, lalu publish.</p></div><div className="product-grid"><article className="product-card large"><div className="card-icon"><MousePointer2 size={20} /></div><h3>Direct visual editing</h3><p>Klik teks untuk edit langsung, drag Feature ke Column, align object, atur width, gradient, background, dan animation dari inspector.</p><div className="editor-mini"><div className="mini-tree"><span>Pages</span><i>Hero</i><i>Story</i><i>Gallery</i></div><div className="mini-canvas"><strong>Your Wedding</strong><span>Click to edit</span></div><div className="mini-style"><b>Style</b><i /><i /><i /></div></div></article><article className="product-card"><div className="card-icon"><Palette size={20} /></div><h3>Design system</h3><p>Solid, gradient, image background, spacing, typography, object alignment, dan responsive preview tersedia dalam satu workflow.</p><div className="gradient-orb-demo"><i/><i/><i/></div></article><article className="product-card dark"><div className="card-icon"><WandSparkles size={20} /></div><h3>Motion with control</h3><p>Pilih entrance, transition, visual effect, dan opening animation. Reduced-motion fallback menjaga pengalaman tetap nyaman.</p><div className="motion-demo"><i /><i /><i /><i /></div></article><article className="product-card wide"><div className="card-icon"><CheckCircle2 size={20} /></div><h3>Preview before you publish</h3><p>Desktop/mobile preview membantu memastikan hasil editor tetap representatif sebelum website dibagikan.</p><div className="role-flow"><span>Edit</span><ArrowRight size={16} /><span>Preview</span><ArrowRight size={16} /><span>Publish</span></div></article></div></section>
      <section id="templates" className="landing-section template-showcase"><div className="section-intro light"><span>BEAUTIFUL BY DEFAULT</span><h2>Choose a design, then make it unmistakably yours.</h2><p>Klik template untuk melihat actual design, detail, harga, dan journey pemesanan.</p></div><div className="showcase-track">{pricedTemplates.slice(0,6).map((template,index)=><article key={template.id} className={`showcase-card ${template.preset === 'split' ? 'split' : template.preset === 'cinematic' ? 'cinema' : template.preset === 'storybook' ? 'story' : index%2?'cinema':'split'}`} onClick={()=>onTemplate(template)}><div className="showcase-mini-preview">{template.canvasSections?.slice(0,2).map(section=><i key={section.id} style={{background:getGradientBackground(section.backgroundGradientEnabled,section.backgroundGradientFrom,section.backgroundGradientTo,section.backgroundGradientAngle,section.backgroundColor)}}/> )}</div><small>{template.category.toUpperCase()} · {template.premium?'PREMIUM':'STANDARD'}</small><h3>{template.name}</h3><p>{template.description || 'A thoughtfully designed wedding website experience.'}</p><div className="showcase-price">{formatRupiah(template.price || 0)} <span>one-time</span></div><button>View design <ArrowRight size={14}/></button></article>)}</div></section>
      <section className="landing-section trust-section"><div className="section-intro"><span>FROM DESIGN TO WEDDING DAY</span><h2>Everything stays connected after you choose a template.</h2></div><div className="trust-steps"><article><span>01</span><strong>Choose</strong><p>Pilih design yang paling sesuai.</p></article><article><span>02</span><strong>Personalize</strong><p>Atur content, photo, warna, effect, dan pages.</p></article><article><span>03</span><strong>Collaborate</strong><p>Customer Service dan Web Designer membantu proses Anda.</p></article><article><span>04</span><strong>Publish</strong><p>Bagikan URL personal dan mulai menerima RSVP.</p></article></div></section>
      <section id="articles" className="landing-section article-catalog-section"><div className="section-intro"><span>IKRARKU JOURNAL</span><h2>Ideas and guidance for a wedding that feels personal.</h2><p>Inspirasi design, planning, content, dan digital invitation yang dapat membantu Anda membuat keputusan dengan lebih mudah.</p></div>{articles.length?<div className="article-catalog-grid">{articles.slice(0,8).map((article,index)=><article key={article.id} className={`article-catalog-card tone-${index%4}`} onClick={()=>setSelectedArticle(article)}><div className="article-catalog-cover" style={article.coverUrl?{backgroundImage:`linear-gradient(180deg,rgba(4,22,17,.04),rgba(4,22,17,.68)),url(${article.coverUrl})`}:undefined}><span>{article.category}</span><small>{new Date(article.date).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'})}</small></div><div><h3>{article.title}</h3><p>{article.excerpt}</p><button>Read article <ArrowRight size={14}/></button></div></article>)}</div>:<div className="public-empty"><BookOpen size={28}/><strong>Wedding journal segera hadir</strong><span>Inspirasi dan panduan terbaru akan tampil di sini.</span></div>}</section>
      <section className="landing-cta-section"><div><span>READY TO BEGIN?</span><h2>Start with a design you already love.</h2><p>Pilih template, personalisasi bersama tim kami, lalu bagikan wedding website Anda.</p></div><button onClick={() => document.getElementById('templates')?.scrollIntoView({behavior:'smooth'})}>Explore templates <ArrowRight size={18} /></button></section>
    </main><footer className="landing-footer"><Brand /><p>Wedding websites, beautifully yours.</p><span>© 2026 ikrarku Sites</span></footer>
  </div>
}

function Auth({ view, setView, login, signupAccount }: { view: View; setView: (view: View) => void; login: (username: string, password: string) => Promise<boolean>; signupAccount: (name:string,username:string,password:string,passwordConfirm:string,email:string)=>Promise<{ok:boolean;devVerificationUrl?:string}> }) {
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [username,setUsername]=useState('')
  const [password,setPassword]=useState('')
  const [passwordConfirm,setPasswordConfirm]=useState('')
  const [showPassword,setShowPassword]=useState(false)
  const [showConfirm,setShowConfirm]=useState(false)
  const [submitting,setSubmitting]=useState(false)
  const [verificationUrl,setVerificationUrl]=useState('')
  const [authError,setAuthError]=useState('')
  const [signupSubmitted,setSignupSubmitted]=useState(false)
  const passwordMatch=password===passwordConfirm
  const signupDisabled=view==='signup'&&(!name||!email||!username||password.length<8||!passwordMatch)
  const submit=async()=>{
    if(submitting) return
    setSubmitting(true);setAuthError('')
    if(view==='signup'){
      if(signupDisabled){setAuthError('Lengkapi data dan pastikan password minimal 8 karakter serta cocok.');setSubmitting(false);return}
      const result=await signupAccount(name,username,password,passwordConfirm,email)
      if(result.ok)setSignupSubmitted(true)
      if(result.devVerificationUrl)setVerificationUrl(result.devVerificationUrl)
    } else {
      if(!username||!password){setAuthError('Username dan password wajib diisi.')}
      else{const ok=await login(username,password);if(!ok)setAuthError('Username atau password salah. Periksa kembali lalu coba lagi.')}
    }
    setSubmitting(false)
  }
  const onFieldKeyDown=(event:{key:string;preventDefault:()=>void})=>{ if(event.key==='Enter'){ event.preventDefault(); void submit() } }
  return <div className="auth-page">
    <section className="auth-visual"><button className="auth-back" onClick={() => setView('landing')}><ArrowLeft size={16} /> Kembali ke website</button><Brand light /><div><div className="eyebrow light">WEDDING WEBSITE WORKSPACE</div><h1>Every promise deserves<br />a beautiful beginning.</h1><p>Gunakan akun Anda untuk melanjutkan ke workspace ikrarku dan mengakses fitur sesuai peran Anda.</p></div><div className="auth-quote">“Rencanakan janji, rayakan cerita.”</div></section>
    <section className="auth-form-wrap"><div className="auth-card"><div className="mobile-brand"><Brand /></div><span className="auth-kicker">{view === 'signup' ? 'CREATE USER ACCOUNT' : 'WELCOME BACK'}</span><h2>{view === 'signup' ? 'Mulai cerita Anda' : 'Masuk ke ikrarku'}</h2><p>{view === 'signup' ? 'Email wajib diverifikasi sebelum akun dapat digunakan.' : 'Masukkan username dan password akun terdaftar.'}</p><form className="auth-fields" onSubmit={event=>{event.preventDefault();if(!submitting)void submit()}}>{view === 'signup' && <><label>Full name<input value={name} onChange={event=>setName(event.target.value)} onKeyDown={onFieldKeyDown}/></label><label>Email<input value={email} onChange={event=>setEmail(event.target.value)} type="email" onKeyDown={onFieldKeyDown}/></label></>}<label>Username<input value={username} onChange={event=>{setUsername(event.target.value);setAuthError('')}} onKeyDown={onFieldKeyDown}/></label><label>Password<div className="password-field"><input type={showPassword?'text':'password'} value={password} onChange={event=>{setPassword(event.target.value);setAuthError('')}} onKeyDown={onFieldKeyDown}/><button type="button" aria-label={showPassword?'Hide password':'Show password'} onClick={()=>setShowPassword(value=>!value)}>{showPassword?<EyeOff size={16}/>:<Eye size={16}/>}</button></div>{view==='signup'&&<small className={`field-hint ${password && password.length<8?'field-hint-warn':''}`}>Minimal 8 karakter. Disarankan gabungan huruf besar, angka, dan simbol.</small>}</label>{view==='signup'&&<label>Repeat Password<div className="password-field"><input type={showConfirm?'text':'password'} value={passwordConfirm} onChange={event=>setPasswordConfirm(event.target.value)} onKeyDown={onFieldKeyDown}/><button type="button" aria-label={showConfirm?'Hide repeated password':'Show repeated password'} onClick={()=>setShowConfirm(value=>!value)}>{showConfirm?<EyeOff size={16}/>:<Eye size={16}/>}</button></div>{passwordConfirm&&<small className={passwordMatch?'password-ok':'password-error'}>{passwordMatch?'Password sesuai':'Password belum sama'}</small>}</label>}{view==='login'&&<div className="login-hints"><span>Akun tim dikelola oleh Administrator</span><span>Butuh bantuan akses? Hubungi Administrator tim Anda.</span></div>}{signupSubmitted&&<div className="verification-dev-link"><CheckCircle2 size={18}/><div><strong>Registrasi berhasil.</strong><span>Kami mengirim tautan verifikasi ke {email}. Buka email dan klik tautannya untuk mengaktifkan akun sebelum login.</span>{verificationUrl&&<button type="button" onClick={()=>{window.history.pushState({},'',new URL(verificationUrl).pathname+new URL(verificationUrl).search);setView('verify-email')}}>Buka tautan verifikasi (dev)</button>}</div></div>}{authError&&<div className="auth-error" role="alert"><X size={16}/><span>{authError}</span></div>}<button type="submit" className="primary-btn full" disabled={submitting || signupDisabled}>{submitting?'Processing...':view === 'signup' ? 'Register & Send Verification' : 'Sign in'} <ArrowRight size={16}/></button></form><div className="auth-switch">{view === 'signup' ? 'Sudah memiliki akun?' : 'Belum memiliki akun?'} <button type="button" onClick={() => { setName('');setEmail('');setUsername('');setPassword('');setPasswordConfirm('');setAuthError('');setVerificationUrl('');setSignupSubmitted(false);setShowPassword(false);setShowConfirm(false);setView(view === 'signup' ? 'login' : 'signup') }}>{view === 'signup' ? 'Sign in' : 'Sign up'}</button></div></div></section>
  </div>
}

function NotFoundPage({onHome}:{onHome:()=>void}){
  return <div className="notfound-page"><Brand/><div className="notfound-card"><span className="notfound-code">404</span><h1>Halaman tidak ditemukan</h1><p>Maaf, alamat yang Anda tuju tidak tersedia atau sudah dipindahkan. Periksa kembali tautannya atau kembali ke beranda.</p><button className="primary-btn" onClick={onHome}><ArrowLeft size={16}/>Kembali ke beranda</button></div></div>
}

function VerifyEmailPage({setView}:{setView:(view:View)=>void}){
  const [status,setStatus]=useState<'loading'|'success'|'error'>('loading')
  const [message,setMessage]=useState('Memverifikasi email Anda...')
  const [email,setEmail]=useState('')
  const [resending,setResending]=useState(false)
  useEffect(()=>{const token=new URLSearchParams(window.location.search).get('token')||'';if(!token){setStatus('error');setMessage('Token verifikasi tidak ditemukan atau tautan tidak lengkap.');return}void api.verifyEmail(token).then(()=>{setStatus('success');setMessage('Email berhasil diverifikasi. Akun Anda sudah aktif.')}).catch(error=>{setStatus('error');setMessage(error instanceof Error?error.message:'Verifikasi gagal.')})},[])
  return <div className="verification-page"><Brand/><div className={`verification-card ${status}`}>{status==='loading'?<Clock3 size={34}/>:status==='success'?<CheckCircle2 size={34}/>:<X size={34}/>}<span>EMAIL VERIFICATION</span><h1>{status==='success'?'Akun berhasil diaktifkan':status==='error'?'Verifikasi tidak berhasil':'Mohon tunggu'}</h1><p>{message}</p>{status==='error'&&<div className="verification-resend"><label>Email akun<input type="email" value={email} onChange={event=>setEmail(event.target.value)} placeholder="nama@email.com"/></label><button className="secondary-btn" disabled={!email.includes('@')||resending} onClick={async()=>{setResending(true);try{const result=await api.resendVerification(email);setMessage(result.message||'Email verifikasi dikirim ulang. Periksa inbox Anda.')}catch(error){setMessage(error instanceof Error?error.message:'Gagal mengirim ulang email.')}setResending(false)}}><MailOpen size={15}/>{resending?'Mengirim…':'Kirim ulang verifikasi'}</button></div>}{status!=='loading'&&<button className="primary-btn" onClick={()=>{window.history.pushState({},'','/login');setView('login')}}>Masuk ke ikrarku <ArrowRight size={16}/></button>}</div></div>
}

function TemplateJourneyPage({ template, onBack, onPreview, onOrder }: { template:Template; onBack:()=>void; onPreview:()=>void; onOrder:()=>void }) {
  const [previewOpen,setPreviewOpen]=useState(false)
  return <div className="journey-page"><header><button onClick={onBack}><ArrowLeft size={17}/>Kembali</button><Brand/><button className="journey-order" onClick={onOrder}><ShoppingCart size={16}/>Pesan Sekarang</button></header><main><section className={`journey-visual preset-${template.preset || 'classic'}`} style={template.preview?{backgroundImage:`linear-gradient(180deg,rgba(5,20,15,.1),rgba(5,20,15,.65)),url(${template.preview})`}:{background:template.bg}}><div><span>{template.category}</span><h1>{template.name}</h1><p>A wedding website collection by ikrarku Sites.</p></div></section><section className="journey-content"><div><span className="eyebrow">TEMPLATE JOURNEY</span><h2>A story designed to feel unmistakably yours.</h2><p>{template.description || 'Template premium dengan storytelling, responsif, dan siap dikustomisasi melalui visual Canvas Editor.'}</p><div className="journey-features"><article><LayoutTemplate size={20}/><strong>Responsive Canvas</strong><span>Desktop dan mobile experience yang konsisten.</span></article><article><WandSparkles size={20}/><strong>No-code customization</strong><span>Text, image, motion, sound, RSVP, dan gallery.</span></article><article><UserCheck size={20}/><strong>Managed onboarding</strong><span>Setelah pembayaran, order di-assign ke CS dan Web Designer.</span></article></div><button className="secondary-btn" onClick={()=>{setPreviewOpen(true);onPreview()}}><Eye size={16}/>Preview Template</button></div><aside><small>ONE-TIME PACKAGE · {template.premium?'PREMIUM':'STANDARD'}</small><strong>{formatRupiah(template.price || 0)}</strong><span>Sudah termasuk onboarding dan project assignment.</span><hr/><ul><li><Check size={14}/>Template license</li><li><Check size={14}/>Customer Service onboarding</li><li><Check size={14}/>Web Designer assignment</li><li><Check size={14}/>Email & PDF receipt</li>{template.premium&&<><li><Check size={14}/>Premium motion & sound library</li><li><Check size={14}/>Priority onboarding</li></>}</ul><button onClick={onOrder}><ShoppingCart size={17}/>Pesan Sekarang</button></aside></section></main>{previewOpen&&<div className="journey-preview-overlay actual-template-preview"><button className="preview-close" onClick={()=>setPreviewOpen(false)}><X size={18}/></button><div className="actual-template-preview-shell">{template.canvasSections?.length?<WeddingCanvas page="pages" sections={hydrateSections(template.canvasSections)} selectedTemplate={template} greetings={[]} addGreeting={()=>undefined} guests={[]} addGuest={()=>undefined}/>:<div className={`journey-preview-window preset-${template.preset || 'classic'}`} style={template.preview?{backgroundImage:`linear-gradient(180deg,rgba(5,20,15,.08),rgba(5,20,15,.58)),url(${template.preview})`}:{background:template.bg}}><h2>{template.name}</h2><p>Preview image template.</p></div>}</div></div>}</div>
}

function CheckoutPage({ template, paymentMethods, order, onBack, createOrder, payOrder, onSignIn, onRegister }: { template:Template; paymentMethods:PaymentMethod[]; order:OrderResult|null; onBack:()=>void; createOrder:(name:string,email:string,phone:string)=>Promise<OrderResult|null>; payOrder:(method:string)=>Promise<boolean>; onSignIn:()=>void; onRegister:()=>void }) {
  const draft=useMemo(()=>{try{return JSON.parse(sessionStorage.getItem('ikrarku-checkout-draft')||'{}')}catch{return {}}},[])
  const [name,setName]=useState(String(draft.name||''));const[email,setEmail]=useState(String(draft.email||''));const[phone,setPhone]=useState(String(draft.phone||''));const[method,setMethod]=useState(paymentMethods[0]?.code||'');const[working,setWorking]=useState(false)
  useEffect(()=>{sessionStorage.setItem('ikrarku-checkout-draft',JSON.stringify({templateId:template.id,name,email,phone}))},[template.id,name,email,phone])
  const validEmail=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);const validPhone=phone.replace(/\D/g,'').length>=9
  return <div className="checkout-page"><header><button onClick={onBack}><ArrowLeft size={17}/>Template detail</button><Brand/><span>Secure checkout</span></header><main><section className="checkout-form"><span className="eyebrow">{order?'STEP 2 OF 2':'STEP 1 OF 2'}</span><h1>{order?'Pilih metode pembayaran':'Data pemesan'}</h1>{!order?<><p>Email digunakan untuk receipt dan nomor telepon digunakan CS untuk proses onboarding.</p><div className="checkout-auth-options"><button onClick={onSignIn}>Sudah punya akun? Sign In</button><button onClick={onRegister}>Belum punya akun? Register</button></div><label>Nama lengkap<input value={name} onChange={e=>setName(e.target.value)} placeholder="Nama pemesan"/></label><label>Email receipt<input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="nama@email.com"/>{email&&!validEmail&&<small className="password-error">Format email belum valid.</small>}</label><label>Nomor WhatsApp<input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="08xxxxxxxxxx"/>{phone&&!validPhone&&<small className="password-error">Nomor telepon minimal 9 digit.</small>}</label><button className="primary-btn checkout-next" disabled={!name.trim()||!validEmail||!validPhone||working} onClick={async()=>{setWorking(true);await createOrder(name,email,phone);setWorking(false)}}>{working?'Menyimpan order...':'Lanjut ke Pembayaran'}<ArrowRight size={16}/></button></>:<><p>Order <strong>{order.orderNo}</strong> sudah dibuat. Pilih kanal pembayaran.</p><div className="payment-method-grid">{paymentMethods.map(item=><button key={item.id} className={method===item.code?'active':''} onClick={()=>setMethod(item.code)}>{item.code==='QRIS'?<QrCode size={25}/>:item.code==='GOPAY'?<WalletCards size={25}/>:<CreditCard size={25}/>}<strong>{item.label}</strong><span>{String(item.config?.instructions || '')}</span></button>)}</div><div className="local-payment-note"><ShieldCheck size={18}/><p><strong>Secure payment confirmation</strong><span>Pastikan metode pembayaran yang dipilih sudah benar sebelum melanjutkan.</span></p></div><button className="primary-btn checkout-next" disabled={!method||working} onClick={async()=>{setWorking(true);await payOrder(method);setWorking(false)}}>{working?'Memproses pembayaran...':'Lanjutkan Pembayaran'}<CheckCircle size={16}/></button></>}</section><aside className="checkout-summary"><div className={`checkout-template preset-${template.preset || 'classic'}`} style={template.preview?{backgroundImage:`linear-gradient(180deg,rgba(5,20,15,.05),rgba(5,20,15,.6)),url(${template.preview})`}:{background:template.bg}}><span>{template.category}</span><strong>{template.name}</strong></div><h3>Order summary</h3><div><span>Template package</span><strong>{formatRupiah(template.price||0)}</strong></div><div><span>Onboarding CS</span><strong>Included</strong></div><div><span>Web Designer</span><strong>Included</strong></div><hr/><div className="checkout-total"><span>Total</span><strong>{formatRupiah(template.price||0)}</strong></div></aside></main></div>
}

function PaymentSuccessPage({ order, template, onHome }: { order:OrderResult; template:Template|null; onHome:()=>void }) {
  return <div className="payment-success-page"><div className="success-rings"><CheckCircle size={46}/></div><span>PAYMENT RECEIVED</span><h1>Terima kasih. Project Anda sudah masuk ke tim kami.</h1><p>Order <strong>{order.orderNo}</strong> telah dibayar. Satu Customer Service dan satu Web Designer sudah dialokasikan melalui workload assignment.</p><div className="success-summary"><div><small>Template</small><strong>{template?.name||'Wedding Template'}</strong></div><div><small>Total</small><strong>{formatRupiah(order.amount)}</strong></div><div><small>Status</small><strong>Paid · Onboarding</strong></div></div><div className="success-steps"><article><span>1</span><div><strong>Email receipt</strong><p>Receipt PDF dan email konfirmasi akan dikirim ke alamat email pemesan.</p></div></article><article><span>2</span><div><strong>CS follow-up</strong><p>CS menghubungi via Email, Web, atau WhatsApp.</p></div></article><article><span>3</span><div><strong>Web production</strong><p>Web Designer menerima task pembuatan website.</p></div></article></div><div className="success-actions">{order.receiptUrl&&<a href={order.receiptUrl} target="_blank" rel="noreferrer"><ReceiptText size={16}/>Download PDF Receipt</a>}<button onClick={onHome}>Kembali ke Landing Page</button></div></div>
}

function PaymentSettingsPage({ methods, onChange }: { methods:PaymentMethod[]; onChange:(method:PaymentMethod)=>void }) {
  return <div className="page"><div className="page-heading"><div><div className="eyebrow">COMMERCE SETTINGS</div><h1>Payment Methods</h1><p>Aktifkan kanal pembayaran dan atur informasi merchant yang tampil saat checkout.</p></div></div><div className="payment-settings-grid">{methods.map(method=><PaymentMethodCard key={method.id} method={method} onSave={onChange}/>)}</div></div>
}
function PaymentMethodCard({method,onSave}:{method:PaymentMethod;onSave:(method:PaymentMethod)=>void}){const[enabled,setEnabled]=useState(method.enabled);const[merchantName,setMerchantName]=useState(String(method.config?.merchantName||''));const[instructions,setInstructions]=useState(String(method.config?.instructions||''));return <article className="payment-setting-card"><header>{method.code==='QRIS'?<QrCode/>:method.code==='GOPAY'?<WalletCards/>:<CreditCard/>}<div><strong>{method.label}</strong><span>{method.code}</span></div><button className={`toggle ${enabled?'on':''}`} onClick={()=>setEnabled(v=>!v)}><i/></button></header><label>Merchant name<input value={merchantName} onChange={e=>setMerchantName(e.target.value)}/></label><label>Checkout instructions<textarea value={instructions} onChange={e=>setInstructions(e.target.value)}/></label><button className="primary-btn" onClick={()=>onSave({...method,enabled,config:{...method.config,merchantName,instructions}})}><Save size={15}/>Save Method</button></article>}

function TasksPage({tasks,onRefresh,onUpdate,onReview,canApprove}:{tasks:TaskItem[];onRefresh:()=>void;onUpdate:(id:string,status:string)=>Promise<void>;onReview:(templateId:string,status:'Approved'|'Rejected',feedback?:string)=>Promise<void>;canApprove:boolean}) {
  const [filter,setFilter]=useState('All')
  const [feedback,setFeedback]=useState<Record<string,string>>({})
  const approvalTasks=tasks.filter(task=>task.task_type==='Approval')
  const regularTasks=tasks.filter(task=>task.task_type!=='Approval')
  const visible=regularTasks.filter(task=>filter==='All'||task.status===filter)
  return <div className="page"><div className="page-heading"><div><div className="eyebrow">WORK MANAGEMENT</div><h1>Tasks & Tickets</h1><p>Ticket order, project, inbound follow-up, dan approval template tersimpan pada database.</p></div><button className="secondary-btn" onClick={onRefresh}><Repeat2 size={16}/>Refresh Database</button></div>{canApprove&&<section className="approval-task-section"><div className="section-heading"><div><span>ADMINISTRATOR APPROVAL</span><h2>Template Approval</h2><p>Setiap pengajuan Web Designer masuk ke antrean ini. Keputusan akan memperbarui status template dan mengirim email ke requestor.</p></div><strong>{approvalTasks.filter(task=>task.status==='Open').length} Pending</strong></div><div className="approval-task-grid">{approvalTasks.length?approvalTasks.map(task=><article key={task.id} className={`approval-task-card status-${task.status.toLowerCase()}`}><header><span>{task.template_status||task.status}</span><small>{task.requestor_name||'Template Creator'}</small></header><h3>{task.template_name||task.title}</h3><p>{task.description}</p><label>Feedback untuk requestor<textarea value={feedback[task.id]||task.decision_note||''} onChange={event=>setFeedback(previous=>({...previous,[task.id]:event.target.value}))} placeholder="Catatan approval atau alasan reject..."/></label><footer>{task.status==='Open'?<><button className="approve" onClick={()=>void onReview(task.template_id||'','Approved',feedback[task.id]||'')}><Check size={15}/>Approved & Publish</button><button className="reject" onClick={()=>void onReview(task.template_id||'','Rejected',feedback[task.id]||'')}><X size={15}/>Reject</button></>:<span className={`approval-decision ${task.status.toLowerCase()}`}>{task.status}</span>}<small>{new Date(task.created_at).toLocaleString('id-ID')}</small></footer></article>):<div className="empty-state"><CheckCircle size={32}/><h2>Tidak ada approval pending</h2></div>}</div></section>}<div className="task-filter">{['All','Open','In Progress','Waiting Customer','Done'].map(item=><button className={filter===item?'active':''} onClick={()=>setFilter(item)} key={item}>{item}</button>)}</div>{visible.length?<div className="task-board">{visible.map(task=><article key={task.id}><header><span className={`task-priority ${task.priority.toLowerCase()}`}>{task.priority}</span><small>{task.order_no||task.task_type||'Internal task'}</small></header><h3>{task.title}</h3><p>{task.description}</p><div className="task-customer"><strong>{task.customer_name||task.requestor_name||'Platform'}</strong><span>{task.email||task.requestor_email||''} {task.phone||''}</span></div><footer><select value={task.status} onChange={event=>void onUpdate(task.id,event.target.value)}><option>Open</option><option>In Progress</option><option>Waiting Customer</option><option>Done</option><option>Cancelled</option></select><small>{new Date(task.created_at).toLocaleString('id-ID')}</small></footer></article>)}</div>:<div className="empty-state"><ClipboardList size={34}/><h2>Belum ada task operasional</h2><p>Task akan dibuat otomatis dari order atau workflow platform.</p></div>}</div>
}

const permissionCatalog=[['dashboard.user','Customer Dashboard'],['dashboard.editor','Web Designer Dashboard'],['dashboard.cs','CS Dashboard'],['templates.view','View Templates'],['templates.create','Create Templates'],['templates.edit','Edit Templates'],['canvas.manage','Manage Canvas'],['tasks.view','View Tasks'],['tasks.update','Update Tasks'],['articles.view','View Articles'],['articles.manage','Manage Articles'],['sounds.view','View Sounds'],['sounds.manage','Manage Sounds'],['settings.payment','Payment Settings'],['orders.view','View Orders'],['users.manage','Manage Users'],['roles.manage','Manage Roles'],['conversations.view','View Conversations'],['conversations.reply','Reply Conversations'],['conversations.outbound','Message Users'],['templates.approve','Approve Templates']]
function RolesPermissionsPage({roles,onRefresh,onCreate,onUpdate,onDelete}:{roles:RoleItem[];onRefresh:()=>Promise<void>;onCreate:(name:string,p:string[])=>Promise<void>;onUpdate:(id:string,name:string,p:string[])=>Promise<void>;onDelete:(id:string)=>Promise<void>}){const[selectedId,setSelectedId]=useState(roles[0]?.id||'');const[current,setCurrent]=useState<RoleItem|undefined>(roles.find(r=>r.id===selectedId));const[newName,setNewName]=useState('');useEffect(()=>setCurrent(roles.find(r=>r.id===selectedId)),[selectedId,roles]);return <div className="page roles-page"><div className="page-heading"><div><div className="eyebrow">BACKEND ACCESS CONTROL</div><h1>Roles & Permissions</h1><p>Administrator dapat menambah, mengurangi, dan menentukan fitur yang dapat dilihat oleh setiap role.</p></div><button className="secondary-btn" onClick={()=>void onRefresh()}><Repeat2 size={16}/>Refresh</button></div><div className="roles-layout"><aside><h3>Available roles</h3>{roles.map(role=><button key={role.id} className={selectedId===role.id?'active':''} onClick={()=>setSelectedId(role.id)}><KeyRound size={15}/><span><strong>{displayRole(role.name)}</strong><small>{role.permissions.length} permissions · {role.userCount||0} accounts</small></span>{role.isSystem&&<ShieldCheck size={13}/>}</button>)}<div className="new-role"><input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="New role name"/><button disabled={!newName.trim()} onClick={async()=>{await onCreate(newName.trim(),[]);setNewName('')}}><Plus size={14}/>Add Role</button></div></aside><section>{current?<><header><div><span>ROLE CONFIGURATION</span><h2>{displayRole(current.name)}</h2></div>{!current.isSystem&&<button className="danger-btn" disabled={Boolean(current.userCount)} title={current.userCount?`Role masih digunakan ${current.userCount} akun`:undefined} onClick={()=>{if(window.confirm(`Delete role ${displayRole(current.name)}? Tindakan ini tidak dapat dibatalkan.`))void onDelete(current.id)}}><Trash2 size={14}/>{current.userCount?`Used by ${current.userCount} accounts`:'Delete Role'}</button>}</header><div className="permission-grid">{permissionCatalog.map(([key,label])=>{const checked=current.permissions.includes('*')||current.permissions.includes(key);return <label key={key} className={checked?'active':''}><input type="checkbox" checked={checked} disabled={current.permissions.includes('*')} onChange={e=>setCurrent({...current,permissions:e.target.checked?[...current.permissions,key]:current.permissions.filter(item=>item!==key)})}/><span><strong>{label}</strong><small>{key}</small></span></label>})}</div><button className="primary-btn" disabled={current.permissions.includes('*')} onClick={()=>void onUpdate(current.id,current.name,current.permissions)}><Save size={15}/>Save Permissions</button></>:<div className="empty-state"><KeyRound size={32}/><h2>Pilih role</h2></div>}</section></div></div>}

function Brand({ light = false }: { light?: boolean }) {
  return <div className={`brand ${light ? 'brand-light' : ''}`}><div className="brand-mark"><Heart size={17} /></div><div><strong>ikrarku</strong><span>Sites</span></div></div>
}

function Sidebar({ role, view, setView, open, logout, currentAccount }: { role: Role; view: View; setView: (view: View) => void; open: boolean; logout: () => void; currentAccount?: AuthAccount }) {
  const permissions=currentAccount?.permissions || []
  const can=(permission:string)=>permissions.includes('*')||permissions.includes(permission)
  const menuCandidates: [View, typeof LayoutDashboard, string, string][] = [
    ['admin',LayoutDashboard,'Platform Overview','*'],['dashboard',LayoutDashboard,can('dashboard.editor')?'Web Designer Dashboard':'Wedding Dashboard',can('dashboard.editor')?'dashboard.editor':'dashboard.user'],['my-orders',PackageCheck,'My Project','dashboard.user'],['cs-dashboard',BarChart3,'CS Dashboard','dashboard.cs'],['tasks',ClipboardList,'Tasks & Tickets','tasks.view'],['users',UserCog,can('users.manage')?'Users & Roles':'Client Assignment',can('users.manage')?'users.manage':'users.view'],['roles',KeyRound,'Roles & Permissions','roles.manage'],['templates',Palette,can('templates.create')?'Templates & Approval':'Templates & Canvas','templates.view'],['editor',WandSparkles,'Canvas Editor','canvas.manage'],['articles',BookOpen,can('articles.manage')?'Articles CMS':'Articles','articles.view'],['sound-library',Music2,'Sound Library','sounds.manage'],['payment-settings',CreditCard,'Payment Methods','settings.payment'],['orders',ReceiptText,'Orders & Revenue','orders.view'],['audit-log',ShieldCheck,'Audit Trail','*'],['customer-service',MessageSquareText,'Support Inbox','conversations.view'],['help',CircleHelp,'Pusat Bantuan',''],['settings',Settings,'Settings','']
  ]
  const menus: [View, typeof LayoutDashboard, string][] = menuCandidates.filter(([, , , permission])=>!permission||can(permission)).map(([target,icon,label])=>[target,icon,label])
  return <aside className={`sidebar ${open ? '' : 'hidden'}`}><Brand /><div className="workspace-pill"><div className="avatar-mini">{(currentAccount?.name || 'IK').slice(0,2).toUpperCase()}</div><div><strong>{currentAccount?.name || (role === 'User' ? 'Customer Workspace' : role === 'Editor' ? 'Web Designer Studio' : role === 'Customer Service' ? 'Support Desk' : 'Administrator Console')}</strong><span>{currentAccount?.email || `${displayRole(role)} workspace`}</span></div><ChevronDown size={14} /></div><nav>{menus.map(([target, Icon, label]) => <button className={view === target ? 'active' : ''} onClick={() => setView(target)} key={target}><Icon size={18} /><span>{label}</span></button>)}</nav><div className="sidebar-bottom">{role === 'User' && <div className="upgrade-card"><Crown size={18} /><strong>ikrarku Signature</strong><span>Buka template premium dan analytics lengkap.</span><button>Explore plan</button></div>}<button className="support-link" onClick={() => setView('help')}><CircleHelp size={16} /> Pusat Bantuan</button><button className="support-link danger" onClick={logout}><LogOut size={16} /> Sign out</button></div></aside>
}

function Topbar({ role, toggleSidebar, currentAccount, onChat, onSettings, onPaymentSettings, onLogout, canPaymentSettings }: { role: Role; toggleSidebar: () => void; currentAccount?: AuthAccount; onChat: () => void; onSettings: () => void; onPaymentSettings: () => void; onLogout: () => void; canPaymentSettings:boolean }) {
  const [profileOpen,setProfileOpen]=useState(false)
  return <header className="topbar"><button className="icon-btn" onClick={toggleSidebar}><PanelLeftClose size={18}/></button><div className="topbar-right"><div className="status-dot"><span/>ikrarku Workspace</div><button className="icon-btn topbar-chat" onClick={onChat} title="Open chat"><MessageCircle size={17}/></button><div className="profile-menu-wrap"><button className="profile-btn" onClick={()=>setProfileOpen(v=>!v)}><div className="avatar">{(currentAccount?.name||'IK').slice(0,2).toUpperCase()}</div><div><strong>{currentAccount?.name||'User'}</strong><span>{displayRole(role)}</span></div><ChevronDown size={14}/></button>{profileOpen&&<div className="profile-dropdown"><button onClick={()=>{setProfileOpen(false);onSettings()}}><Settings size={16}/><span><strong>Account Settings</strong><small>Nama, email, dan password</small></span></button>{canPaymentSettings&&<button onClick={()=>{setProfileOpen(false);onPaymentSettings()}}><CreditCard size={16}/><span><strong>Payment Methods</strong><small>QRIS, GoPay, Debit / Credit</small></span></button>}<button className="danger" onClick={()=>{setProfileOpen(false);onLogout()}}><LogOut size={16}/><span><strong>Sign Out</strong><small>Keluar dari akun ini</small></span></button></div>}</div></div></header>
}


function Dashboard({ setView, slug, siteTitle, guests, sections, orders, selectedCanvasId, setSelectedCanvasId, setGuestsOpen, setPreviewOpen }: {
  setView: (view: View) => void
  slug: string
  siteTitle: string
  guests: Guest[]
  sections: CanvasSection[]
  orders: any[]
  selectedCanvasId: string
  setSelectedCanvasId: (id: string) => void
  setGuestsOpen: (value: boolean) => void
  setPreviewOpen: (value: boolean) => void
}) {
  const selectedCanvas = sections.find(section => section.id === selectedCanvasId) || sections[0]
  const canvasGuests = guests.filter(guest => guest.canvasId === selectedCanvas?.id)
  const invited = selectedCanvas?.invitees.length || 0
  const hadir = canvasGuests.filter(guest => guest.status === 'Hadir').reduce((total, guest) => total + Math.max(guest.pax, 1), 0)
  const tidakHadir = canvasGuests.filter(guest => guest.status === 'Tidak hadir').length
  const menunggu = Math.max(0, invited - canvasGuests.filter(guest => guest.status !== 'Menunggu').length)
  const responseCount = canvasGuests.length
  const readinessChecks = [
    ['Website title',Boolean(siteTitle.trim())],['Public URL',Boolean(slug.trim())],['Canvas',sections.length>0],
    ['Buka Undangan',sections.some(section=>section.columns.some(column=>column.features.some(feature=>feature.type==='invitation-cover')))],
    ['Event detail',sections.some(section=>section.columns.some(column=>column.features.some(feature=>feature.type==='event')))],
    ['Location',sections.some(section=>section.columns.some(column=>column.features.some(feature=>feature.type==='location')))],
    ['Guest list',sections.some(section=>section.invitees.length>0)]
  ] as [string,boolean][]
  const readinessDone=readinessChecks.filter(([,done])=>done).length
  const readinessPercent=Math.round(readinessDone/readinessChecks.length*100)
  const activityData = Array.from({length:7},(_,offset)=>{
    const date=new Date();date.setHours(0,0,0,0);date.setDate(date.getDate()-(6-offset))
    const next=new Date(date);next.setDate(next.getDate()+1)
    const confirmed=canvasGuests.filter(guest=>{const ts=new Date(guest.time);return !Number.isNaN(ts.getTime())&&ts>=date&&ts<next}).length
    return {day:new Intl.DateTimeFormat('id-ID',{weekday:'short'}).format(date),confirmed}
  })
  const copyLink = () => void navigator.clipboard?.writeText(`${window.location.origin}/${slug}`)
  if (!selectedCanvas) return <div className="page"><div className="empty-state"><Layers3 size={34} /><h2>Belum ada Canvas</h2><p>Tambahkan Canvas dari menu Templates untuk mulai membangun website.</p></div></div>
  return <div className="page dashboard-page"><div className="page-heading"><div><div className="eyebrow">GOOD AFTERNOON</div><h1>Wedding dashboard</h1><p>Data di bawah mengikuti Canvas yang dipilih secara real-time.</p></div><div className="heading-actions"><label className="canvas-dashboard-select"><span>Active Canvas</span><select value={selectedCanvas.id} onChange={event => setSelectedCanvasId(event.target.value)}>{sections.map(section => <option value={section.id} key={section.id}>{section.name}</option>)}</select></label><button className="primary-btn" onClick={() => { sessionStorage.setItem('ikrarku-edit-canvas', selectedCanvas.id); setView('editor') }}><WandSparkles size={17} /> Edit Canvas</button></div></div><div className="site-status-card"><CanvasThumbnail section={selectedCanvas} title={siteTitle} /><div className="site-status-info"><div className="published-badge"><span />Published</div><h3>{siteTitle}</h3><p>{selectedCanvas.name} · ikrarku.id/{slug} · {selectedCanvas.columns.length} column · {selectedCanvas.columns.reduce((total, column) => total + column.features.length, 0)} features</p><div className="inline-actions"><button onClick={() => setPreviewOpen(true)}><Eye size={16} /> Preview</button><button onClick={copyLink}><Copy size={16} /> Copy link</button></div></div><div className="site-progress"><span>Website readiness</span><strong>{readinessPercent}%</strong><div className="progress"><i style={{ width: `${readinessPercent}%` }} /></div><small>{readinessDone}/{readinessChecks.length} setup penting selesai</small><div className="readiness-mini-list">{readinessChecks.map(([label,done])=><span key={label} className={done?'done':''}>{done?<Check size={11}/>:<Clock3 size={11}/>} {label}</span>)}</div></div></div>{orders.length>0&&<button className="customer-project-banner" onClick={()=>setView('my-orders')}><PackageCheck size={20}/><div><strong>Project & order Anda</strong><span>{orders[0].order_no} · {orders[0].payment_status} · {orders[0].order_status}</span></div><ArrowRight size={17}/></button>}<div className="stats-grid"><Stat icon={Users} label="Tamu diundang" value={String(invited)} note="Berdasarkan list Canvas" /><Stat icon={Check} label="Hadir" value={String(hadir)} note={`${responseCount ? Math.round((hadir / Math.max(invited, 1)) * 100) : 0}% dari undangan`} /><Stat icon={Clock3} label="Menunggu" value={String(menunggu)} note="Belum memberikan respons" /><Stat icon={X} label="Tidak hadir" value={String(tidakHadir)} note="Respons declined" /></div><div className="dashboard-grid"><div className="panel chart-panel"><div className="panel-head"><div><h3>RSVP activity · {selectedCanvas.name}</h3><p>Aktivitas respons pada Canvas terpilih</p></div><span className="data-live"><i /> Live data</span></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={activityData}><defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#125946" stopOpacity={0.25} /><stop offset="95%" stopColor="#125946" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ece8df" /><XAxis dataKey="day" axisLine={false} tickLine={false} /><YAxis allowDecimals={false} axisLine={false} tickLine={false} /><Tooltip /><Area type="monotone" dataKey="confirmed" stroke="#125946" strokeWidth={2.5} fill="url(#fill)" /></AreaChart></ResponsiveContainer></div></div><div className="panel recent-panel"><div className="panel-head"><div><h3>RSVP terbaru</h3><p>{canvasGuests.length} respons pada Canvas ini</p></div><button className="text-btn interactive-link" onClick={() => setGuestsOpen(true)}>Lihat semua</button></div>{canvasGuests.slice(0, 4).map((guest, index) => <GuestRow key={`${guest.name}-${index}`} guest={guest} index={index} />)}{canvasGuests.length === 0 && <div className="panel-empty"><Users size={24} /><strong>Belum ada respons</strong><span>Respons RSVP akan muncul setelah tamu mengisi form pada Canvas ini.</span></div>}</div></div></div>
}

function EditorDashboard({ users, setView, manageUserCanvas, templateCount, supportCount }: { users: ManagedUser[]; setView: (view: View) => void; manageUserCanvas: (userId: string) => void; templateCount: number; supportCount: number }) {
  const assigned = users.filter(user => user.assignedTo)
  return <div className="page"><div className="page-heading"><div><div className="eyebrow">WEB DESIGNER STUDIO</div><h1>Creative operations dashboard</h1><p>Kelola template, assignment Customer, dan website client dalam satu tempat.</p></div><div className="heading-actions"><button className="secondary-btn" onClick={() => setView('users')}><UserCog size={17} /> Assign Customer</button><button className="primary-btn" onClick={() => setView('templates')}><LayoutTemplate size={17} /> Manage Templates</button></div></div><div className="stats-grid"><Stat icon={Users} label="Assigned customers" value={String(assigned.length)} note={`${users.filter(user => !user.assignedTo).length} waiting assignment`} /><Stat icon={Layers3} label="Managed Canvas" value={String(users.reduce((total, user) => total + (user.canvasIds?.length || 0), 0))} note="Across assigned clients" /><Stat icon={Palette} label="Template library" value={String(templateCount)} note="Available for assignment" /><Stat icon={MessageCircle} label="Support inbox" value={String(supportCount)} note="Percakapan dari pengguna" /></div><div className="editor-dashboard-grid"><section className="panel"><div className="panel-head"><div><h3>Client assignments</h3><p>Customer yang dapat Anda kelola</p></div><button className="text-btn" onClick={() => setView('users')}>Lihat semua</button></div><div className="client-list">{users.map(user => <article key={user.id}><div className="client-avatar">{user.name.slice(0, 2).toUpperCase()}</div><div><strong>{user.name}</strong><span>{user.email} · {user.plan}</span></div><span className={`assignment-status ${user.assignedTo ? 'assigned' : 'unassigned'}`}>{user.assignedTo ? user.assignedTo : 'Unassigned'}</span><button disabled={!user.assignedTo} onClick={() => manageUserCanvas(user.id)}>Manage Canvas <ArrowRight size={14} /></button></article>)}</div></section><section className="panel editor-quick-panel"><div className="panel-head"><div><h3>Quick actions</h3><p>Continue your design workflow</p></div></div><button onClick={() => setView('templates')}><Palette size={18} /><span><strong>Create a template</strong><small>Build a reusable theme from Canvas.</small></span><ArrowRight size={16} /></button><button onClick={() => setView('users')}><UserCog size={18} /><span><strong>Assign a Customer</strong><small>Connect a Customer to your Web Designer account.</small></span><ArrowRight size={16} /></button><button onClick={() => setView('customer-service')}><MessageSquareText size={18} /><span><strong>Open support inbox</strong><small>Respond to customer conversations.</small></span><ArrowRight size={16} /></button></section></div></div>
}

function UserManagement({ role, accounts, roles, createAccount, changeUserRole, clients, onAssign, onManage }: { role:Role; accounts:AuthAccount[]; roles:RoleItem[]; createAccount:(name:string,username:string,password:string,role:Role,email:string)=>Promise<boolean>; changeUserRole:(userId:string,roleId:string)=>Promise<void>; clients:ManagedUser[]; onAssign:(userId:string,editorId?:string)=>Promise<void>; onManage:(userId:string)=>void }) {
  const [query,setQuery]=useState('');const[showCreate,setShowCreate]=useState(false);const filtered=accounts.filter(account=>`${account.name} ${account.email} ${account.username}`.toLowerCase().includes(query.toLowerCase()))
  return <div className="page"><div className="page-heading"><div><div className="eyebrow">ACCOUNT & ACCESS OPERATIONS</div><h1>Users & Roles</h1><p>{displayRole(role)} mengelola akun yang tersimpan pada tabel users dan roles.</p></div><button className="primary-btn" onClick={()=>setShowCreate(true)}><UserPlus size={16}/>Add Account</button></div><div className="panel user-management"><div className="panel-head"><div><h3>Account directory</h3><p>{accounts.length} akun terdaftar</p></div><div className="search-field compact"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Cari nama, username, email"/></div></div><table><thead><tr><th>Account</th><th>Username</th><th>Role</th><th>Email</th></tr></thead><tbody>{filtered.map(account=><tr key={account.id}><td><div className="table-user"><div>{account.name.slice(0,2).toUpperCase()}</div><span><strong>{account.name}</strong><small>{account.id}</small></span></div></td><td>{account.username}</td><td><select value={roles.find(item=>item.name===account.role)?.id||''} onChange={e=>void changeUserRole(account.id,e.target.value)}>{roles.map(roleItem=><option value={roleItem.id} key={roleItem.id}>{displayRole(roleItem.name)}</option>)}</select></td><td>{account.email}</td></tr>)}</tbody></table></div><ClientManagement clients={clients} editors={accounts.filter(account=>account.role==='Editor'||account.role==='Admin')} onAssign={onAssign} onManage={onManage} adminMode />{showCreate&&<AccountCreateModal onClose={()=>setShowCreate(false)} roles={roles} onCreate={async payload=>{if(await createAccount(payload.name,payload.username,payload.password,payload.role,payload.email))setShowCreate(false)}} existingUsernames={accounts.map(item=>item.username)}/>}</div>
}

function ClientManagement({clients,editors=[],onAssign,onManage,adminMode=false}:{clients:ManagedUser[];editors?:AuthAccount[];onAssign:(userId:string,editorId?:string)=>Promise<void>;onManage:(userId:string)=>void;adminMode?:boolean}) {
  const [query,setQuery]=useState('')
  const filtered=clients.filter(client=>`${client.name} ${client.email}`.toLowerCase().includes(query.toLowerCase()))
  return <section className={`panel client-management-panel ${adminMode?'embedded':''}`}><div className="panel-head"><div><h3>Client Assignment</h3><p>{clients.filter(client=>client.assignedTo).length} assigned · {clients.filter(client=>!client.assignedTo).length} unassigned</p></div><div className="search-field compact"><Search size={15}/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Cari client..."/></div></div>{filtered.length?<div className="client-assignment-list">{filtered.map(client=><article key={client.id}><div className="client-avatar">{client.name.slice(0,2).toUpperCase()}</div><div className="client-assignment-info"><strong>{client.name}</strong><span>{client.email} · {client.siteTitle || 'Website belum diberi judul'}</span><small>{client.canvasIds.length} Canvas · {client.assignedTo || 'Belum di-assign'}</small></div>{adminMode?<select value={client.assignedEditorId||''} onChange={event=>void onAssign(client.id,event.target.value)}><option value="">Unassigned</option>{editors.map(editor=><option key={editor.id} value={editor.id}>{editor.name}</option>)}</select>:!client.assignedTo?<button className="secondary-btn" onClick={()=>void onAssign(client.id)}>Assign to Me</button>:<span className="assignment-status assigned">{client.assignedTo}</span>}<button className="primary-btn" disabled={!client.assignedTo&&!adminMode} onClick={()=>onManage(client.id)}><WandSparkles size={14}/>Manage Canvas</button></article>)}</div>:<div className="panel-empty"><Users size={24}/><strong>Belum ada Customer</strong><span>Customer akan muncul di sini setelah akun dibuat.</span></div>}</section>
}

function Stat({ icon: Icon, label, value, note }: { icon: typeof Users; label: string; value: string; note: string }) {
  return <div className="stat-card"><div className="stat-icon"><Icon size={18} /></div><div><span>{label}</span><strong>{value}</strong><small>{note}</small></div></div>
}

function GuestRow({ guest, index }: { guest: Guest; index: number }) {
  return <div className="guest-row"><div className={`guest-avatar g${index % 4}`}>{guest.initials}</div><div><strong>{guest.name}</strong><span>{guest.pax ? `${guest.pax} tamu` : guest.status}</span></div><div className={`guest-status ${guest.status === 'Hadir' ? 'yes' : guest.status === 'Tidak hadir' ? 'no' : 'wait'}`}>{guest.status}</div><small>{guest.time}</small></div>
}

function resolveTemplateForSection(section: CanvasSection, templateCatalog: Template[], _selectedTemplate: Template) {
  if (section.sourceTemplateId) return templateCatalog.find(template => template.id === section.sourceTemplateId)
  const byPrefix = templateCatalog.find(template => section.name.toLowerCase().startsWith(`${template.name.toLowerCase()} ·`))
  if (byPrefix) return byPrefix
  return undefined
}

function buildWebsiteDesignGroups(sections: CanvasSection[], templateCatalog: Template[], selectedTemplate: Template) {
  const groups = new Map<string, { id:string; template?:Template; name:string; sections:CanvasSection[] }>()
  const prefixMatches=sections.map(section=>resolveTemplateForSection(section,templateCatalog,selectedTemplate)).filter(Boolean) as Template[]
  const allLegacyUntagged=sections.length>0 && sections.every(section=>!section.templateInstanceId && !section.sourceTemplateId && !section.sourceTemplateName)
  const singleLegacyTemplate=prefixMatches.length===0 && allLegacyUntagged ? selectedTemplate : undefined
  sections.forEach(section => {
    const canUseLegacyFallback=!section.templateInstanceId && !section.sourceTemplateId && !section.sourceTemplateName
    const template=resolveTemplateForSection(section,templateCatalog,selectedTemplate) || (canUseLegacyFallback ? singleLegacyTemplate : undefined)
    const key=section.templateInstanceId || (template ? `legacy-template-${template.id}` : `custom-${section.id}`)
    const name=section.sourceTemplateName || template?.name || 'Custom Design'
    const current=groups.get(key)
    if(current) current.sections.push(section)
    else groups.set(key,{id:key,template,name,sections:[section]})
  })
  return Array.from(groups.values())
}

function WebsiteTemplatePreview({template,title,sections}:{template?:Template;title:string;sections:CanvasSection[]}) {
  const preset=template?.preset || 'classic'
  const section=sections[0]
  const cover=section?.columns.flatMap(column=>column.features).find(feature=>feature.type==='invitation-cover')
  const background=getGradientBackground(
    cover?.backgroundGradientEnabled ?? section?.backgroundGradientEnabled,
    cover?.backgroundGradientFrom ?? section?.backgroundGradientFrom,
    cover?.backgroundGradientTo ?? section?.backgroundGradientTo,
    cover?.backgroundGradientAngle ?? section?.backgroundGradientAngle,
    cover?.backgroundColor || section?.backgroundColor || '#f7f4ee'
  )
  const image=cover?.mediaUrl || section?.backgroundUrl
  const imageEffect=cover?.backgroundEffect || section?.backgroundEffect || 'none'
  const imagePosition=cover?.backgroundPosition || section?.backgroundPosition || 'center'
  const imageRepeat=cover?.backgroundRepeat || section?.backgroundRepeat || 'no-repeat'
  return <div className={`template-preview website-template-preview actual-design-preview preset-${preset}`}>
    <div className="template-browser"><span/><span/><span/><em>Canvas 01 · actual saved preview</em></div>
    <div className="actual-preview-stage first-section-only">
      {section?<div className="actual-preview-section first-only" style={{background}}>
        <div className="actual-preview-bg" style={{backgroundImage:image?`url(${image})`:undefined,backgroundPosition:imagePosition,backgroundRepeat:imageRepeat,backgroundSize:imageRepeat==='no-repeat'?'cover':'auto',filter:getBackgroundFilter(imageEffect)}}/>
        {cover?<div className="actual-preview-cover"><div className="actual-preview-cover-content" style={{...getCoverContentObjectStyle(cover),fontFamily:cover.fontFamily,color:cover.textColor,textAlign:cover.align,lineHeight:cover.lineHeight,fontWeight:cover.bold?700:400,fontStyle:cover.italic?'italic':'normal'}}>
          <small>{cover.eyebrowText||'UNDANGAN PERNIKAHAN'}</small>
          <strong>{cover.title||title}</strong>
          <span>{cover.guestLabelText||'Kepada Yth. Bapak/Ibu/Saudara/i'}</span>
          <b>{section.invitees[0]?.name||cover.guestNameText||'Tamu Terhormat'}</b>
          <em>{cover.body||'Dengan penuh kebahagiaan kami mengundang Anda'}</em>
          <button type="button" tabIndex={-1} style={{borderRadius:Math.min(cover.coverButtonRadius??12,40),borderWidth:Math.min(cover.coverButtonBorderWidth??1,4),borderColor:cover.coverButtonBorderColor||'#fff',background:cover.coverButtonBackground||'#102f27',color:cover.coverButtonTextColor||'#fff'}}><CoverIconGlyph name={cover.coverIcon} size={8}/><span>{cover.buttonLabel||'Buka Undangan'}</span></button>
        </div></div>:<div className={`actual-preview-columns count-${section.columns.length}`}>{section.columns.map(column=><div key={column.id} className="actual-preview-column">{column.features.filter(item=>item.type!=='sound').slice(0,4).map(feature=><div key={feature.id} className={`actual-preview-feature type-${feature.type}`} style={{...getFeatureObjectStyle(feature),background:getGradientBackground(feature.backgroundGradientEnabled,feature.backgroundGradientFrom,feature.backgroundGradientTo,feature.backgroundGradientAngle,feature.backgroundColor),color:feature.textColor,borderRadius:Math.min(feature.borderRadius||0,10),textAlign:feature.align}}><FeatureIcon type={feature.type}/><span>{feature.type==='image'||feature.type==='gallery'?'Media':feature.title||feature.type}</span></div>)}</div>)}</div>}
        <small>Canvas 01</small>
      </div>:<div className="actual-preview-empty"><LayoutTemplate size={28}/><span>Blank design</span></div>}
    </div>
    <div className="actual-preview-footer"><strong>{title}</strong><span>{section?`Preview Canvas 01 · ${section.columns.length} Column · ${section.columns.reduce((total,column)=>total+column.features.length,0)} Feature`:'Belum ada Canvas'}</span></div>
  </div>
}

function Templates({ role, siteTitle, activeUser: _activeUser, selectedTemplate, templateCatalog, sections, applyTemplate, addBlankCanvas, deleteCanvas, duplicateCanvas, editCanvas, openTemplateCreator, canCreate }: {
  role: Role
  siteTitle: string
  activeUser?: ManagedUser
  selectedTemplate: Template
  templateCatalog: Template[]
  sections: CanvasSection[]
  applyTemplate: (template: Template) => void
  addBlankCanvas: () => void
  deleteCanvas: (sectionIds: string[]) => void
  duplicateCanvas: (sectionIds: string[]) => void
  editCanvas: (sectionId: string) => void
  openTemplateCreator: () => void
  canCreate:boolean
}) {
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')
  const [previewTemplate,setPreviewTemplate]=useState<Template|null>(null)
  const filtered = templateCatalog.filter(template => (filter === 'All' || template.category === filter) && template.name.toLowerCase().includes(query.toLowerCase()))
  const websiteDesigns=buildWebsiteDesignGroups(sections,templateCatalog,selectedTemplate)
  return <div className="page"><div className="page-heading"><div><div className="eyebrow">DESIGN LIBRARY</div><h1>Template & Canvas</h1><p>{role === 'User' ? 'Pilih template dan kelola design website Anda.' : 'Kelola template website client tanpa menampilkan struktur internal sebagai kartu terpisah.'}</p></div><div className="heading-actions">{canCreate && <button className="secondary-btn" onClick={openTemplateCreator}><Palette size={17} /> Create Template</button>}<button className="primary-btn" onClick={addBlankCanvas}><Plus size={17} /> Add Canvas</button></div></div>
    <section className="canvas-manager-section"><div className="section-heading"><div><span>WEBSITE DESIGN</span><h2>Template pada website</h2><p>Satu card mewakili satu template/design yang digunakan. Canvas, Column, dan Feature tetap menjadi struktur internal dan hanya terlihat saat Edit.</p></div></div><div className="website-canvas-grid">{websiteDesigns.length === 0 && <div className="zero-canvas-state"><Layers3 size={34} /><span>WEBSITE EMPTY</span><h3>Website ini belum memiliki design</h3><p>Mulai dari Canvas kosong atau gunakan template dari library di bawah.</p><button className="primary-btn" onClick={addBlankCanvas}><Plus size={16} /> Create First Canvas</button></div>}{websiteDesigns.map((design,index) => {const ids=design.sections.map(section=>section.id);const totalFeatures=design.sections.reduce((total,section)=>total+section.columns.reduce((sum,column)=>sum+column.features.length,0),0);const totalInvitees=design.sections.reduce((total,section)=>total+section.invitees.length,0);return <article className="website-canvas-card website-template-card" key={design.id}><div className="website-canvas-cover"><WebsiteTemplatePreview template={design.template} title={siteTitle} sections={design.sections}/><span className="canvas-index">{String(index+1).padStart(2,'0')}</span></div><div className="website-canvas-meta"><div><span className="published-dot">{design.template ? 'Applied Template' : 'Custom Design'} · {design.name}</span><h3>{siteTitle}</h3><p>{design.sections.length} Canvas di dalam design</p><small>{totalFeatures} feature · {totalInvitees} undangan</small></div><div className="website-canvas-actions"><button onClick={()=>duplicateCanvas(ids)}><Copy size={15}/> Copy</button><button className="primary" onClick={()=>editCanvas(design.sections[0].id)}><WandSparkles size={15}/> Edit</button><button className="danger" onClick={()=>deleteCanvas(ids)}><Trash2 size={15}/> Delete</button></div></div></article>})}</div></section>
    <div className="template-toolbar"><div className="search-field"><Search size={17} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Cari template..." /></div><div className="filter-tabs">{['All', 'Editorial', 'Cinematic', 'Fairytale', 'Elegant', 'Romantic', 'Traditional', 'Modern'].map(item => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div></div>
    <div className="template-grid">{filtered.map(template => <div className={`template-card preset-${template.preset || 'classic'} ${selectedTemplate.id === template.id ? 'selected' : ''}`} key={template.id}><div className="template-preview" style={{ background: template.preview ? `linear-gradient(rgba(4,18,14,.18),rgba(4,18,14,.28)), url(${template.preview}) center/cover` : template.bg }}><div className="template-browser"><span /><span /><span /></div><div className="template-art" style={{ color: template.preset === 'cinematic' ? '#fff' : template.accent }}>{template.preset === 'cinematic' ? <Film size={27} /> : template.preset === 'storybook' ? <Castle size={27} /> : template.preset === 'split' ? <Columns2 size={27} /> : null}<small>{template.preset === 'cinematic' ? 'A WEDDING ORIGINAL' : template.preset === 'storybook' ? 'ONCE UPON A PROMISE' : 'THE WEDDING OF'}</small><strong>Amara<br />& Arjuna</strong><i /><em>12 · 12 · 2026</em></div>{template.premium && <div className="premium-chip"><Crown size={12} /> Premium</div>}{template.createdBy && <div className="creator-chip">Created by {template.createdBy}</div>}<div className="template-hover"><button onClick={() => applyTemplate(template)}><WandSparkles size={16} /> Use template</button><button onClick={() => setPreviewTemplate(template)}><Eye size={16} /></button></div></div><div className="template-meta database-template-meta"><div><strong>{template.name}</strong><span>{template.category} · {formatRupiah(template.price || 0)}</span><small className={`approval-status ${(template.status || 'Published').toLowerCase()}`}>{template.status === 'Published' || template.status === 'Approved' ? 'Publish' : template.status === 'Rejected' ? 'Reject' : template.status || 'Publish'}</small></div><div className="template-db-actions">{template.status === 'Pending' && <span className="review-task-hint"><ClipboardList size={13}/>Review melalui Tasks</span>}{selectedTemplate.id === template.id && <div className="selected-check"><Check size={15} /></div>}</div></div></div>)}</div>{previewTemplate&&<div className="dialog-overlay template-quick-preview"><div className="template-preview-dialog"><header><div><span>SAFE PREVIEW</span><h2>{previewTemplate.name}</h2></div><button onClick={()=>setPreviewTemplate(null)}><X size={18}/></button></header><div className="template-dialog-actual-preview"><WebsiteTemplatePreview template={previewTemplate} title={previewTemplate.name} sections={previewTemplate.canvasSections||[]} /></div><footer><button className="secondary-btn" onClick={()=>setPreviewTemplate(null)}>Close</button><button className="primary-btn" onClick={()=>{setPreviewTemplate(null);applyTemplate(previewTemplate)}}><WandSparkles size={15}/>Use Template</button></footer></div></div>}
  </div>
}

function CanvasThumbnail({ section, title }: { section: CanvasSection; title?: string }) {
  const firstFeature = section.columns.flatMap(column => column.features).find(feature => feature.type === 'invitation-cover' || feature.type === 'text' || feature.type === 'quote')
  const coverFeature = section.columns.flatMap(column => column.features).find(feature => feature.type === 'invitation-cover')
  const image = coverFeature?.mediaUrl || section.backgroundUrl
  const filter = getBackgroundFilter(coverFeature?.backgroundEffect || section.backgroundEffect)
  return <div className={`canvas-manager-preview real-preview layout-${section.layoutMode}`} style={{ background: getGradientBackground(section.backgroundGradientEnabled, section.backgroundGradientFrom, section.backgroundGradientTo, section.backgroundGradientAngle, section.backgroundColor) }}><div className={`thumbnail-bg ${getBackgroundMotionClass(section.backgroundMotion)}`} style={{ backgroundImage: image ? `url(${image})` : undefined, backgroundPosition: coverFeature?.backgroundPosition || section.backgroundPosition, backgroundRepeat: 'no-repeat', backgroundSize: 'contain', filter }} /><div className={`thumbnail-columns count-${section.columns.length}`}>{section.columns.map((column, columnIndex) => <div key={column.id} className="thumbnail-column"><small>COL {columnIndex + 1}</small>{column.features.slice(0, 3).map(feature => <div key={feature.id} className={`thumbnail-feature type-${feature.type}`}>{['text', 'quote', 'invitation-cover', 'event', 'countdown', 'location'].includes(feature.type) ? <><strong>{feature.title.slice(0, 28)}</strong><span>{feature.body.slice(0, 36)}</span></> : feature.type === 'image' || feature.type === 'gallery' ? <ImageIcon size={16} /> : <FeatureIcon type={feature.type} />}</div>)}</div>)}</div>{(title || firstFeature) && <div className="thumbnail-title">{title || firstFeature?.title}</div>}</div>
}

type EditorProps = {
  sections: CanvasSection[]
  setSections: React.Dispatch<React.SetStateAction<CanvasSection[]>>
  slug: string
  setSlug: (slug: string) => void
  siteTitle: string
  setSiteTitle: (title: string) => void
  selectedTemplate: Template
  saveSite: () => void
  editorMode: 'site' | 'template'
  saved: boolean
  setView: (view: View) => void
  setPreviewOpen: (value: boolean) => void
  greetings: Greeting[]
  addGreeting: (name: string, message: string) => void
  guests: Guest[]
  addGuest: (name: string, status: Guest['status'], pax: number, canvasId?: string) => void
  flash: (message: string) => void
  soundCatalog: SoundCatalogItem[]
  autosaveContent: (draft:{sections:CanvasSection[];slug:string;siteTitle:string})=>Promise<void>
  loadRevisions: ()=>Promise<any[]>
}

function Editor({ sections, setSections: setSectionsRaw, slug, setSlug, siteTitle, setSiteTitle, selectedTemplate, saveSite, editorMode, saved, setView, setPreviewOpen, greetings, addGreeting, guests, addGuest, flash, soundCatalog, autosaveContent, loadRevisions }: EditorProps) {
  const [activePage, setActivePage] = useState<PageKey>('pages')
  const requestedCanvasId = sessionStorage.getItem('ikrarku-edit-canvas')
  const initialSection = sections.find(section => section.id === requestedCanvasId) || sections[0]
  const [selectedSectionId, setSelectedSectionId] = useState(initialSection?.id || '')
  const [selectedColumnId, setSelectedColumnId] = useState(initialSection?.columns[0]?.id || '')
  const [selectedFeatureId, setSelectedFeatureId] = useState(initialSection?.columns[0]?.features[0]?.id || '')
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>('content')
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [animationNonce, setAnimationNonce] = useState(0)
  const [widgetQuery, setWidgetQuery] = useState('')
  const [dirty, setDirty] = useState(false)
  const [leavePromptOpen, setLeavePromptOpen] = useState(false)
  const [autosaveState,setAutosaveState]=useState<'idle'|'saving'|'saved'|'error'>('idle')
  const [revisionOpen,setRevisionOpen]=useState(false)
  const [revisions,setRevisions]=useState<any[]>([])
  const [revisionsLoading,setRevisionsLoading]=useState(false)
  const historyRef=useRef<CanvasSection[][]>([])
  const futureRef=useRef<CanvasSection[][]>([])
  const savedBaselineRef=useRef<{sections:CanvasSection[];slug:string;siteTitle:string}>({sections:structuredClone(sections),slug,siteTitle})
  const captureSavedBaseline=()=>{savedBaselineRef.current={sections:structuredClone(sections),slug,siteTitle}}
  const discardToSavedBaseline=()=>{const baseline=savedBaselineRef.current;setSectionsRaw(structuredClone(baseline.sections));setSlug(baseline.slug);setSiteTitle(baseline.siteTitle);historyRef.current=[];futureRef.current=[];setDirty(false);setAutosaveState('idle')}
  const commitSections=(updater:React.SetStateAction<CanvasSection[]>,record=true)=>{
    if(record){historyRef.current.push(structuredClone(sections));if(historyRef.current.length>40)historyRef.current.shift();futureRef.current=[]}
    setDirty(true);setSectionsRaw(updater)
  }
  const undo=()=>{const previous=historyRef.current.pop();if(!previous)return;futureRef.current.push(structuredClone(sections));setSectionsRaw(structuredClone(previous));setDirty(true)}
  const redo=()=>{const next=futureRef.current.pop();if(!next)return;historyRef.current.push(structuredClone(sections));setSectionsRaw(structuredClone(next));setDirty(true)}
  useEffect(()=>{if(!dirty)return;setAutosaveState('saving');const timer=window.setTimeout(()=>{void autosaveContent({sections,slug,siteTitle}).then(()=>setAutosaveState('saved')).catch(()=>setAutosaveState('error'))},1400);return()=>window.clearTimeout(timer)},[sections,slug,siteTitle,dirty,editorMode,selectedTemplate.id])
  useEffect(()=>{const handler=(event:KeyboardEvent)=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='z'){event.preventDefault();if(event.shiftKey)redo();else undo()}else if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='y'){event.preventDefault();redo()}};window.addEventListener('keydown',handler);return()=>window.removeEventListener('keydown',handler)},[sections])
  const openRevisionHistory=async()=>{setRevisionOpen(true);setRevisionsLoading(true);try{setRevisions(await loadRevisions())}catch(error){flash(error instanceof Error?error.message:'Gagal memuat revision history.')}finally{setRevisionsLoading(false)}}
  const restoreRevision=(revision:any)=>{if(!Array.isArray(revision.sections))return;commitSections(structuredClone(revision.sections));if(editorMode==='site'){if(typeof revision.slug==='string')setSlug(revision.slug);if(typeof revision.title==='string')setSiteTitle(revision.title)}setDirty(true);setRevisionOpen(false);flash('Revision dipulihkan sebagai draft. Review lalu Save untuk menyimpan.')}
  const imageInput = useRef<HTMLInputElement>(null)
  const videoInput = useRef<HTMLInputElement>(null)
  const galleryInput = useRef<HTMLInputElement>(null)
  const backgroundInput = useRef<HTMLInputElement>(null)
  const coverBackgroundInput = useRef<HTMLInputElement>(null)
  const soundInput = useRef<HTMLInputElement>(null)

  const selectedSection = useMemo(() => sections.find(section => section.id === selectedSectionId), [sections, selectedSectionId])
  const selectedColumn = useMemo(() => selectedSection?.columns.find(column => column.id === selectedColumnId), [selectedSection, selectedColumnId])
  const selectedFeature = useMemo(() => selectedColumn?.features.find(feature => feature.id === selectedFeatureId) ?? sections.flatMap(section => section.columns).flatMap(column => column.features).find(feature => feature.id === selectedFeatureId), [sections, selectedColumn, selectedFeatureId])

  const selectSection = (section: CanvasSection) => {
    setSelectedSectionId(section.id)
    setSelectedColumnId(section.columns[0]?.id || '')
    setSelectedFeatureId('')
    setActivePage('pages')
  }

  const selectColumn = (sectionId: string, columnId: string) => {
    setSelectedSectionId(sectionId)
    setSelectedColumnId(columnId)
    setSelectedFeatureId('')
    setActivePage('pages')
  }

  const selectFeature = (sectionId: string, columnId: string, featureId: string) => {
    setSelectedSectionId(sectionId)
    setSelectedColumnId(columnId)
    setSelectedFeatureId(featureId)
    setActivePage('pages')
  }

  const updateSection = (sectionId: string, patch: Partial<CanvasSection>) => { setDirty(true); commitSections(previous => previous.map(section => section.id === sectionId ? { ...section, ...patch } : section)) }

  const updateFeature = (featureId: string, patch: Partial<Feature>) => { setDirty(true); commitSections(previous => previous.map(section => ({
    ...section,
    columns: section.columns.map(column => ({ ...column, features: column.features.map(feature => feature.id === featureId ? { ...feature, ...patch } : feature) }))
  }))) }

  const addCanvas = () => {
    const anchor=sections.find(item=>item.id===selectedSectionId) || sections[sections.length-1]
    const section: CanvasSection = { id: uid('canvas'), name: 'New Canvas', columns: [{ id: uid('column'), features: [] }], backgroundColor: '#fffdf8', backgroundEffect: 'none', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundGradientEnabled: false, backgroundGradientFrom: '#fffdf8', backgroundGradientTo: '#d7b66f', backgroundGradientAngle: 135, backgroundMotion: 'none', paddingX: 32, paddingY: 60, minHeight: 300, layoutMode: 'standard', invitees: [], ...(editorMode==='site'?{templateInstanceId:anchor?.templateInstanceId || uid('custom-design'),sourceTemplateId:anchor?.sourceTemplateId,sourceTemplateName:anchor?.sourceTemplateName || (anchor?'Custom Design':undefined)}:{}) }
    commitSections(previous => [...previous, section])
    selectSection(section)
  }

  const deleteSection = (sectionId: string) => {
    const section = sections.find(item => item.id === sectionId)
    if (!window.confirm(`Hapus Canvas "${section?.name || 'ini'}" beserta seluruh Column dan Feature di dalamnya?`)) return
    const next = sections.filter(item => item.id !== sectionId)
    setDirty(true); commitSections(next)
    if (next[0]) selectSection(next[0]); else { setSelectedSectionId(''); setSelectedColumnId(''); setSelectedFeatureId('') }
  }

  const deleteFeature = (featureId: string) => {
    setDirty(true); commitSections(previous => previous.map(section => ({ ...section, columns: section.columns.map(column => ({ ...column, features: column.features.filter(feature => feature.id !== featureId) })) })))
    setSelectedFeatureId('')
  }

  const duplicateFeature = (featureId: string) => {
    let nextId = ''
    commitSections(previous => previous.map(section => ({ ...section, columns: section.columns.map(column => {
      const index = column.features.findIndex(item => item.id === featureId)
      if (index < 0) return column
      const copy = structuredClone(column.features[index]); copy.id = uid('feature'); nextId = copy.id
      return { ...column, features: [...column.features.slice(0,index+1), copy, ...column.features.slice(index+1)] }
    }) })))
    if (nextId) setSelectedFeatureId(nextId)
  }

  const setColumnCount = (sectionId: string, count: ColumnCount) => {
    setDirty(true); commitSections(previous => previous.map(section => {
      if (section.id !== sectionId) return section
      const existing = section.columns
      if (count === existing.length) return section
      if (count > existing.length) {
        const additions = Array.from({ length: count - existing.length }, () => ({ id: uid('column'), features: [] as Feature[] }))
        return { ...section, columns: [...existing, ...additions] }
      }
      const kept = existing.slice(0, count)
      const overflow = existing.slice(count).flatMap(column => column.features)
      const last = kept[count - 1]
      const merged = kept.map((column, index) => index === count - 1 ? { ...last, features: [...last.features, ...overflow] } : column)
      return { ...section, columns: merged }
    }))
    const current = sections.find(section => section.id === sectionId)
    if (current?.columns[0]) setSelectedColumnId(current.columns[0].id)
  }

  const addFeature = (type: FeatureType, sectionId = selectedSectionId, columnId = selectedColumnId) => {
    const firstSection = sections[0]
    const requestedSection = sections.find(item => item.id === sectionId) ?? firstSection
    if (!requestedSection) return
    if (type === 'invitation-cover' && sections.some(section => section.columns.some(column => column.features.some(feature => feature.type === 'invitation-cover')))) {
      flash('Feature Buka Undangan hanya dapat digunakan satu kali pada Canvas paling awal.')
      return
    }
    const section = type === 'invitation-cover' ? firstSection : requestedSection
    const column = type === 'invitation-cover' ? section.columns[0] : (section.columns.find(item => item.id === columnId) ?? section.columns[0])
    if (!column) return
    const feature = makeFeature(type)
    setDirty(true); commitSections(previous => previous.map(item => item.id === section.id ? { ...item, columns: item.columns.map(itemColumn => itemColumn.id === column.id ? { ...itemColumn, features: type === 'invitation-cover' ? [feature, ...itemColumn.features] : [...itemColumn.features, feature] } : itemColumn) } : item))
    selectFeature(section.id, column.id, feature.id)
    if (type === 'invitation-cover' && requestedSection.id !== firstSection.id) flash('Buka Undangan otomatis ditempatkan pada Canvas paling awal.')
    setInspectorTab('content')
    window.setTimeout(() => document.getElementById(`feature-${feature.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 60)
  }

  const moveFeature = (featureId: string, targetSectionId: string, targetColumnId: string) => {
    let moved: Feature | undefined
    const without = sections.map(section => ({
      ...section,
      columns: section.columns.map(column => ({
        ...column,
        features: column.features.filter(feature => {
          if (feature.id === featureId) { moved = feature; return false }
          return true
        })
      }))
    }))
    if (!moved) return
    if (moved.type === 'invitation-cover' && targetSectionId !== sections[0]?.id) { flash('Buka Undangan wajib berada pada Canvas paling awal.'); return }
    setDirty(true); commitSections(without.map(section => section.id === targetSectionId ? { ...section, columns: section.columns.map(column => column.id === targetColumnId ? { ...column, features: [...column.features, moved as Feature] } : column) } : section))
    selectFeature(targetSectionId, targetColumnId, featureId)
  }

  const onColumnDrop = (event: React.DragEvent, sectionId: string, columnId: string) => {
    event.preventDefault()
    const widgetType = event.dataTransfer.getData('application/x-ikrarku-widget') as FeatureType
    const featureId = event.dataTransfer.getData('application/x-ikrarku-feature')
    if (widgetType) addFeature(widgetType, sectionId, columnId)
    else if (featureId) moveFeature(featureId, sectionId, columnId)
  }

  const moveSection = (sectionId: string, direction: -1 | 1) => {
    const index = sections.findIndex(section => section.id === sectionId)
    const nextIndex = index + direction
    if (index < 0 || nextIndex < 0 || nextIndex >= sections.length) return
    setDirty(true); commitSections(previous => {
      const copy = [...previous]
      ;[copy[index], copy[nextIndex]] = [copy[nextIndex], copy[index]]
      const coverIndex = copy.findIndex(section => section.columns.some(column => column.features.some(feature => feature.type === 'invitation-cover')))
      if (coverIndex > 0) copy.unshift(copy.splice(coverIndex, 1)[0])
      return copy
    })
  }

  const reorderSectionByDrop = (draggedId: string, targetId: string) => {
    if (!draggedId || draggedId === targetId) return
    setDirty(true)
    commitSections(previous => {
      const copy=[...previous]
      const from=copy.findIndex(item=>item.id===draggedId)
      const to=copy.findIndex(item=>item.id===targetId)
      if(from<0||to<0)return previous
      const [moved]=copy.splice(from,1)
      copy.splice(to,0,moved)
      return normalizeCoverSections(copy)
    })
  }

  const uploadToServer = async (file: File, category: string) => {
    const form = new FormData()
    form.append('file', file)
    form.append('category', category)
    const saved = await api.uploadMedia(form)
    return { key: saved.id as string, url: assetUrl(saved.url), name: saved.name as string }
  }

  const uploadSingleMedia = async (file: File | undefined, type: 'image' | 'video') => {
    if (!file || !selectedFeature) return
    const limit = type === 'image' ? 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > limit) { flash(`${type === 'image' ? 'Image' : 'Video'} melebihi batas ${type === 'image' ? '1 MB' : '5 MB'}.`); return }
    if (type === 'image' && !file.type.startsWith('image/')) { flash('File harus berupa image.'); return }
    if (type === 'video' && !file.type.startsWith('video/')) { flash('File harus berupa video.'); return }
    try {
      const saved = await uploadToServer(file, `canvas-${type}`)
      updateFeature(selectedFeature.id, { mediaKey: saved.key, mediaUrl: saved.url, mediaName: saved.name })
      flash(`${type === 'image' ? 'Image' : 'Video'} berhasil disimpan ke server.`)
    } catch (error) { flash(error instanceof Error ? error.message : 'Upload gagal.') }
  }

  const uploadFeatureBackground = async (file: File | undefined) => {
    if (!file || !selectedFeature || selectedFeature.type !== 'invitation-cover') return
    if (!file.type.startsWith('image/')) { flash('Background Buka Undangan harus berupa image.'); return }
    if (file.size > 2 * 1024 * 1024) { flash('Background Buka Undangan maksimal 2 MB.'); return }
    try {
      const saved = await uploadToServer(file, 'invitation-background')
      updateFeature(selectedFeature.id, { mediaKey: saved.key, mediaUrl: saved.url, mediaName: saved.name })
      flash('Background Buka Undangan berhasil disimpan ke server.')
    } catch (error) { flash(error instanceof Error ? error.message : 'Upload gagal.') }
  }

  const uploadSoundMedia = async (file: File | undefined) => {
    if (!file || !selectedFeature || selectedFeature.type !== 'sound') return
    const allowed = file.type.startsWith('audio/') || file.type.startsWith('video/') || /\.(mp3|m4a|wav|ogg|aac|mp4|webm)$/i.test(file.name)
    if (!allowed) { flash('Gunakan file audio/video seperti MP3, M4A, WAV, OGG, AAC, MP4, atau WebM.'); return }
    if (file.size > 15 * 1024 * 1024) { flash('File sound maksimal 15 MB.'); return }
    try {
      const saved = await uploadToServer(file, 'canvas-sound')
      updateFeature(selectedFeature.id, { mediaKey: saved.key, mediaUrl: saved.url, mediaName: saved.name, soundPreset: 'custom-upload' })
      flash('Sound berhasil disimpan ke server.')
    } catch (error) { flash(error instanceof Error ? error.message : 'Upload gagal.') }
  }

  const uploadGallery = async (files: FileList | null) => {
    if (!files || !selectedFeature) return
    const validFiles = Array.from(files).filter(file => file.type.startsWith('image/') && file.size <= 2 * 1024 * 1024)
    if (validFiles.length !== files.length) flash('Sebagian file dilewati. Gallery hanya menerima image maksimal 2 MB per file.')
    try {
      const saved = await Promise.all(validFiles.map(file => uploadToServer(file, 'gallery')))
      updateFeature(selectedFeature.id, { galleryKeys: [...(selectedFeature.galleryKeys || []), ...saved.map(item => item.key)], galleryUrls: [...(selectedFeature.galleryUrls || []), ...saved.map(item => item.url)] })
      flash(`${saved.length} image disimpan ke Gallery server.`)
    } catch (error) { flash(error instanceof Error ? error.message : 'Upload gallery gagal.') }
  }

  const uploadBackground = async (file: File | undefined) => {
    if (!file || !selectedSection) return
    if (!file.type.startsWith('image/')) { flash('Background harus berupa image.'); return }
    if (file.size > 2 * 1024 * 1024) { flash('Background image maksimal 2 MB.'); return }
    try {
      const saved = await uploadToServer(file, 'canvas-background')
      updateSection(selectedSection.id, { backgroundKey: saved.key, backgroundUrl: saved.url })
      flash('Background image berhasil disimpan ke server.')
    } catch (error) { flash(error instanceof Error ? error.message : 'Upload gagal.') }
  }

  const addFormField = () => {
    if (!selectedFeature) return
    updateFeature(selectedFeature.id, { formFields: [...(selectedFeature.formFields || []), `Field ${(selectedFeature.formFields?.length || 0) + 1}`] })
  }

  return <><div className="editor-shell"><header className="editor-topbar"><div className="editor-top-left"><button className="icon-btn" onClick={() => { if (dirty) setLeavePromptOpen(true); else setView('templates') }}><ArrowLeft size={19} /></button><Brand /><div className="doc-name"><strong>{siteTitle}</strong><span><span className="green-dot" /> {editorMode==='template'?'Template workspace · no public URL':'Website workspace'}</span></div></div><div className="device-switch"><button className={previewMode === 'desktop' ? 'active' : ''} onClick={() => setPreviewMode('desktop')}><Monitor size={17} /></button><button className={previewMode === 'mobile' ? 'active' : ''} onClick={() => setPreviewMode('mobile')}><Smartphone size={17} /></button></div><div className="editor-actions"><div className="history-actions"><button className="icon-btn" title="Undo (Ctrl/Cmd+Z)" disabled={!historyRef.current.length} onClick={undo}><ChevronLeft size={17}/></button><button className="icon-btn" title="Redo (Ctrl/Cmd+Y)" disabled={!futureRef.current.length} onClick={redo}><ChevronRight size={17}/></button></div><span className={`autosave-indicator ${autosaveState}`}>{autosaveState==='saving'?'Saving draft…':autosaveState==='saved'?'Autosaved':autosaveState==='error'?'Autosave failed':'Draft ready'}</span><button className="secondary-btn" onClick={()=>void openRevisionHistory()}><HistoryIcon size={17}/> Revisions</button><button className="secondary-btn" onClick={() => setPreviewOpen(true)}><Eye size={17} /> Preview</button><button className="primary-btn" onClick={() => { saveSite(); captureSavedBaseline(); setDirty(false); setAutosaveState('saved'); historyRef.current=[]; futureRef.current=[] }}>{saved ? <Check size={17} /> : <Save size={17} />} {saved ? 'Saved' : editorMode==='template' ? 'Save Template Draft' : 'Save & Publish'}</button></div></header><div className="editor-body"><aside className="editor-left"><div className="editor-panel-title"><strong>Page Structure</strong><button className="icon-btn small" onClick={addCanvas}><Plus size={16} /></button></div><div className="structure-tree">{sections.map((section, sectionIndex) => <div className="tree-canvas" key={section.id} onDragOver={event=>event.preventDefault()} onDrop={event=>{event.preventDefault();reorderSectionByDrop(event.dataTransfer.getData('application/x-ikrarku-canvas'),section.id)}}><div draggable className={`tree-row canvas-node ${selectedSectionId === section.id && !selectedFeatureId ? 'active' : ''}`} onDragStart={event=>{event.dataTransfer.setData('application/x-ikrarku-canvas',section.id);event.dataTransfer.effectAllowed='move'}} onClick={() => selectSection(section)}><GripVertical size={14} /><LayoutDashboard size={15} /><span>{section.name}</span><div className="tree-actions"><button title="Move up" onClick={event => { event.stopPropagation(); moveSection(section.id, -1) }} disabled={sectionIndex === 0}><MoveUp size={13} /></button><button title="Move down" onClick={event => { event.stopPropagation(); moveSection(section.id, 1) }} disabled={sectionIndex === sections.length - 1}><MoveDown size={13} /></button><button title="Delete canvas" onClick={event => { event.stopPropagation(); deleteSection(section.id) }}><Trash2 size={13} /></button></div></div>{section.columns.map((column, columnIndex) => <div className="tree-column" key={column.id}><button className={`tree-row column-node ${selectedColumnId === column.id && !selectedFeatureId ? 'active' : ''}`} onClick={() => selectColumn(section.id, column.id)}><span className="column-number">{columnIndex + 1}</span><span>Column {columnIndex + 1}</span><small>{column.features.length} features</small></button><div className="tree-features">{column.features.map(feature => <div className={`tree-row feature-node ${selectedFeatureId === feature.id ? 'active' : ''}`} onClick={() => selectFeature(section.id, column.id, feature.id)} key={feature.id}><FeatureIcon type={feature.type} /><span>{feature.title || feature.type}</span><div className="tree-feature-actions"><button title="Duplicate feature" onClick={event=>{event.stopPropagation();duplicateFeature(feature.id)}}><Copy size={12}/></button><button title="Delete feature" onClick={event => { event.stopPropagation(); deleteFeature(feature.id) }}><Trash2 size={13} /></button></div></div>)}</div></div>)}</div>)}</div><button className="add-section" onClick={addCanvas}><Plus size={17} /> Add Canvas</button><div className="page-settings"><strong>Site Pages</strong><button className={activePage === 'pages' ? 'active' : ''} onClick={() => setActivePage('pages')}><FileText size={16} /> Pages <span>Home</span></button><button className={activePage === 'invitees' ? 'active' : ''} onClick={() => setActivePage('invitees')}><Users size={16} /> List Undangan</button><button className={activePage === 'rsvp-page' ? 'active' : ''} onClick={() => setActivePage('rsvp-page')}><CheckCircle2 size={16} /> RSVP Confirmation</button></div></aside><main className="canvas-workspace"><div className="workspace-toolbar">{editorMode==='site'?<div className="slug-field"><Globe2 size={15} /><span>ikrarku.id/</span><input value={slug} onChange={event => {setDirty(true);setSlug(event.target.value.replace(/[^a-z0-9-]/g, ''))}} /></div>:<div className="template-mode-chip"><Palette size={15}/> Template Design · URL tidak diperlukan</div>}<span className="canvas-hint"><Sparkles size={14} /> Klik teks untuk edit langsung · Drag feature ke column</span></div><div className={`canvas-frame ${previewMode}`}>{activePage==='invitees'?<InviteeManagementPage sections={sections} selectedSectionId={selectedSectionId} selectSection={selectSection} updateSection={updateSection} flash={flash}/>:<WeddingCanvas page={activePage} sections={sections} selectedTemplate={selectedTemplate} greetings={greetings} addGreeting={addGreeting} guests={guests} addGuest={addGuest} editable selectedSectionId={selectedSectionId} selectedColumnId={selectedColumnId} selectedFeatureId={selectedFeatureId} selectSection={selectSection} selectColumn={selectColumn} selectFeature={selectFeature} updateFeature={updateFeature} onColumnDrop={onColumnDrop} onCanvasDrop={reorderSectionByDrop} animationNonce={animationNonce} />}</div></main><aside className="editor-right"><div className="inspector-tabs"><button className={inspectorTab === 'content' ? 'active' : ''} onClick={() => setInspectorTab('content')}>Content</button><button className={inspectorTab === 'style' ? 'active' : ''} onClick={() => setInspectorTab('style')}>Style</button><button className={inspectorTab === 'advanced' ? 'active' : ''} onClick={() => setInspectorTab('advanced')}>Advanced</button></div><div className="inspector-scroll">{selectedFeature ? <FeatureInspector feature={selectedFeature} tab={inspectorTab} update={patch => updateFeature(selectedFeature.id, patch)} addFormField={addFormField} imageInput={imageInput} videoInput={videoInput} galleryInput={galleryInput} coverBackgroundInput={coverBackgroundInput} soundInput={soundInput} uploadSingleMedia={uploadSingleMedia} uploadFeatureBackground={uploadFeatureBackground} uploadSoundMedia={uploadSoundMedia} uploadGallery={uploadGallery} replay={() => setAnimationNonce(previous => previous + 1)} soundCatalog={soundCatalog} /> : selectedSection ? <SectionInspector section={selectedSection} tab={inspectorTab} update={patch => updateSection(selectedSection.id, patch)} setColumnCount={count => setColumnCount(selectedSection.id, count)} backgroundInput={backgroundInput} uploadBackground={uploadBackground} /> : <div className="empty-inspector"><Sparkles size={24} /><strong>Pilih Canvas, Column, atau Feature</strong><p>Pengaturan yang relevan akan muncul di sini.</p></div>}<div className="widget-library"><div className="library-head"><strong>Feature Library</strong><span>Click atau drag ke Column</span></div><div className="feature-library-search"><Search size={14}/><input value={widgetQuery} onChange={event=>setWidgetQuery(event.target.value)} placeholder="Cari feature..."/></div><div className="widget-grid">{widgetLibrary.filter(widget=>`${widget.label} ${widget.description}`.toLowerCase().includes(widgetQuery.toLowerCase())).map(widget => <button key={widget.type} draggable onDragStart={event => { event.dataTransfer.setData('application/x-ikrarku-widget', widget.type); event.dataTransfer.effectAllowed = 'copy' }} onClick={() => addFeature(widget.type)} className="widget-card"><widget.icon size={18} /><strong>{widget.label}</strong><small>{widget.description}</small><GripVertical size={14} /></button>)}</div></div><div className="site-identity"><label>Website title<input value={siteTitle} onChange={event => {setDirty(true);setSiteTitle(event.target.value)}} /></label></div></div></aside></div></div>{revisionOpen&&<div className="dialog-overlay"><div className="revision-dialog"><header><div><span>REVISION HISTORY</span><h2>Restore a previous version</h2></div><button className="icon-btn" onClick={()=>setRevisionOpen(false)}><X size={18}/></button></header><p>Revision tersimpan saat manual save. Restore akan memuat versi tersebut sebagai draft dan tidak menimpa data sampai Anda menekan Save.</p><div className="revision-list">{revisionsLoading?<div className="panel-empty"><Repeat2 size={20}/><strong>Loading revisions…</strong></div>:revisions.length?revisions.map((revision:any)=><button key={revision.id} onClick={()=>restoreRevision(revision)}><HistoryIcon size={16}/><span><strong>{revision.reason||'Saved version'}</strong><small>{new Date(revision.created_at).toLocaleString('id-ID')} · {revision.actor_name||'System'}</small></span><ArrowRight size={15}/></button>):<div className="panel-empty"><HistoryIcon size={20}/><strong>Belum ada revision</strong><span>Revision pertama akan tersedia setelah manual save berikutnya.</span></div>}</div><footer><button className="secondary-btn" onClick={()=>setRevisionOpen(false)}>Close</button></footer></div></div>}{leavePromptOpen && <LeaveEditorModal onCancel={() => setLeavePromptOpen(false)} onDiscard={() => { discardToSavedBaseline(); setLeavePromptOpen(false); setView('templates') }} onSave={() => { saveSite(); captureSavedBaseline(); setDirty(false); setAutosaveState('saved'); setLeavePromptOpen(false); setView('templates') }} />} </>
}

function FeatureInspector({ feature, tab, update, addFormField, imageInput, videoInput, galleryInput, coverBackgroundInput, soundInput, uploadSingleMedia, uploadFeatureBackground, uploadSoundMedia, uploadGallery, replay, soundCatalog }: {
  feature: Feature
  tab: InspectorTab
  update: (patch: Partial<Feature>) => void
  addFormField: () => void
  imageInput: React.RefObject<HTMLInputElement | null>
  videoInput: React.RefObject<HTMLInputElement | null>
  galleryInput: React.RefObject<HTMLInputElement | null>
  coverBackgroundInput: React.RefObject<HTMLInputElement | null>
  soundInput: React.RefObject<HTMLInputElement | null>
  uploadSingleMedia: (file: File | undefined, type: 'image' | 'video') => Promise<void>
  uploadFeatureBackground: (file: File | undefined) => Promise<void>
  uploadSoundMedia: (file: File | undefined) => Promise<void>
  uploadGallery: (files: FileList | null) => Promise<void>
  replay: () => void
  soundCatalog: SoundCatalogItem[]
}) {
  const textTypes: FeatureType[] = ['text', 'quote', 'event', 'gift', 'form', 'greetings', 'invitation-cover', 'countdown', 'location', 'sound']
  const objectAlign = feature.objectAlign || (feature.type === 'invitation-cover' ? 'center' : 'stretch')
  const featureWidth = feature.objectWidth ?? (feature.type === 'invitation-cover' ? 82 : 100)
  const widthUnavailable = feature.type === 'sound' || (feature.type === 'gallery' && feature.galleryFullWidth)
  const layoutLabel = feature.type === 'invitation-cover' ? 'Cover content position' : feature.type === 'sound' ? 'Player position' : 'Feature alignment'
  const widthLabel = feature.type === 'invitation-cover' ? 'Cover content width' : 'Feature width'
  const layoutHelp = feature.type === 'invitation-cover'
    ? 'Background Buka Undangan tetap full Canvas. Position dan width hanya mengatur blok konten (judul, tamu, body, tombol) agar Editor dan Preview konsisten.'
    : feature.type === 'sound'
      ? 'Sound menggunakan fixed player. Alignment mengatur posisi player; width tidak digunakan agar tidak menjadi dead control.'
      : feature.type === 'gallery' && feature.galleryFullWidth
        ? 'Full Width Gallery mengunci lebar ke viewport. Nonaktifkan Full Width untuk memakai Feature width dan alignment.'
        : 'Content alignment mengatur isi/text. Feature alignment mengatur posisi seluruh card/object di dalam Column.'
  const layoutControls = <div className="feature-layout-controls"><div className="group-heading"><strong>Feature Layout</strong><span>{feature.type === 'invitation-cover' ? 'Cover content block' : 'Object alignment'}</span></div><label>{layoutLabel}<div className="toolbar-row alignment object-alignment">{([['left',AlignLeft],['center',AlignCenter],['right',AlignRight],['stretch',AlignJustify]] as [FeatureObjectAlign,typeof AlignLeft][]).map(([value,Icon])=><button key={value} title={value} disabled={feature.type==='gallery'&&feature.galleryFullWidth} className={objectAlign===value?'active':''} onClick={()=>update({objectAlign:value,objectWidth:value==='stretch'?100:Math.min(featureWidth,92)})}><Icon size={16}/></button>)}</div></label>{!widthUnavailable&&<label>{widthLabel} <span>{featureWidth}%</span><input type="range" min="20" max="100" step="1" value={featureWidth} onChange={event=>update({objectWidth:Number(event.target.value),objectAlign:Number(event.target.value)>=100?'stretch':feature.objectAlign==='stretch'?'center':feature.objectAlign})}/></label>}<div className="layout-help">{layoutHelp}</div></div>

  if (tab === 'content') return <div className="inspector-group"><div className="selection-label"><FeatureIcon type={feature.type}/><div><strong>{feature.title || feature.type}</strong><span>Feature</span></div></div>{textTypes.includes(feature.type) && feature.type !== 'location' && <><label>Heading<input value={feature.title} onChange={event=>update({title:event.target.value})}/></label><label>Supporting text<textarea value={feature.body} onChange={event=>update({body:event.target.value})}/></label></>}{feature.type==='form'&&<div className="form-field-editor"><div className="group-heading"><strong>Form fields</strong><button onClick={addFormField}><Plus size={14}/> Add</button></div>{feature.formFields?.map((field,index)=><div className="form-field-row" key={`${field}-${index}`}><input value={field} onChange={event=>update({formFields:feature.formFields?.map((item,itemIndex)=>itemIndex===index?event.target.value:item)})}/><button onClick={()=>update({formFields:feature.formFields?.filter((_,itemIndex)=>itemIndex!==index)})}><Trash2 size={13}/></button></div>)}</div>}{feature.type==='image'&&<><input ref={imageInput} hidden type="file" accept="image/*" onChange={event=>void uploadSingleMedia(event.target.files?.[0],'image')}/><button className="upload-control" onClick={()=>imageInput.current?.click()}><Upload size={18}/><span><strong>Upload Image</strong><small>Maksimal 1 MB</small></span></button>{feature.mediaName&&<div className="media-file"><ImageIcon size={15}/><span>{feature.mediaName}</span><Check size={14}/></div>}</>}{feature.type==='video'&&<><input ref={videoInput} hidden type="file" accept="video/*" onChange={event=>void uploadSingleMedia(event.target.files?.[0],'video')}/><button className="upload-control" onClick={()=>videoInput.current?.click()}><Video size={18}/><span><strong>Upload Video</strong><small>Maksimal 5 MB</small></span></button>{feature.mediaName&&<div className="media-file"><Video size={15}/><span>{feature.mediaName}</span><Check size={14}/></div>}</>}{feature.type==='gallery'&&<><input ref={galleryInput} hidden multiple type="file" accept="image/*" onChange={event=>void uploadGallery(event.target.files)}/><button className="upload-control" onClick={()=>galleryInput.current?.click()}><ImageIcon size={18}/><span><strong>Upload Gallery Images</strong><small>Maksimal 2 MB per image</small></span></button><div className="gallery-counter">{feature.galleryUrls?.length||0} image tersedia</div><div className="gallery-media-manager">{(feature.galleryUrls||[]).map((url,index)=><div key={`${url}-${index}`} className="gallery-media-item"><img src={url} alt={`Gallery ${index+1}`}/><span>Image {index+1}</span><button onClick={()=>update({galleryUrls:feature.galleryUrls?.filter((_,itemIndex)=>itemIndex!==index),galleryKeys:feature.galleryKeys?.filter((_,itemIndex)=>itemIndex!==index)})}><Trash2 size={13}/></button></div>)}</div></>}{feature.type==='invitation-cover'&&<><input ref={coverBackgroundInput} hidden type="file" accept="image/*" onChange={event=>void uploadFeatureBackground(event.target.files?.[0])}/><button className="upload-control cover-upload" onClick={()=>coverBackgroundInput.current?.click()}><ImageIcon size={18}/><span><strong>Upload Cover Background</strong><small>Optional · background image default None</small></span></button>{feature.mediaUrl&&<div className="cover-bg-thumb" style={{backgroundImage:`url(${feature.mediaUrl})`}}><button onClick={()=>update({mediaUrl:undefined,mediaKey:undefined,mediaName:undefined})}><Trash2 size={14}/> Remove</button></div>}<label>Eyebrow / label<input value={feature.eyebrowText||''} onChange={event=>update({eyebrowText:event.target.value})}/></label><label>Recipient label<input value={feature.guestLabelText||''} onChange={event=>update({guestLabelText:event.target.value})}/></label><label>Default guest name<input value={feature.guestNameText||''} onChange={event=>update({guestNameText:event.target.value})}/></label><label>Button label<input value={feature.buttonLabel||''} onChange={event=>update({buttonLabel:event.target.value})}/></label><div className="cover-icon-editor"><div className="group-heading"><strong>Opening Icon</strong><span>Editable</span></div><label>Icon<select value={feature.coverIcon||'mail'} onChange={event=>update({coverIcon:event.target.value as CoverIconName})}><option value="mail">Envelope</option><option value="heart">Heart</option><option value="sparkles">Sparkles</option><option value="crown">Crown</option><option value="calendar">Calendar</option><option value="none">No icon</option></select></label><label>Icon position<select value={feature.coverIconPosition||'left'} onChange={event=>update({coverIconPosition:event.target.value as Feature['coverIconPosition']})}><option value="left">Left of label</option><option value="right">Right of label</option><option value="top">Above label</option></select></label><label>Icon size <span>{feature.coverIconSize??20}px</span><input type="range" min="12" max="56" value={feature.coverIconSize??20} onChange={event=>update({coverIconSize:Number(event.target.value)})}/></label></div><div className="info-box"><MailOpen size={17}/><p>Buka Undangan hanya berada pada Canvas pertama. Viewer tidak dapat scroll sebelum tombol dibuka.</p></div></>}{feature.type==='countdown'&&<label>Tanggal & waktu acara<input type="datetime-local" value={feature.eventDate||''} onChange={event=>update({eventDate:event.target.value})}/></label>}{feature.type==='location'&&<><label>Nama lokasi<input value={feature.locationName||''} onChange={event=>update({locationName:event.target.value,title:event.target.value})}/></label><label>Alamat<textarea value={feature.locationAddress||''} onChange={event=>update({locationAddress:event.target.value,body:event.target.value})}/></label><label>Google Maps URL<input value={feature.mapUrl||''} onChange={event=>update({mapUrl:event.target.value})} placeholder="https://maps.google.com/..."/></label></>}{feature.type==='sound'&&<><label>Sound catalog<select value={feature.soundCatalogId||''} onChange={event=>{const item=soundCatalog.find(sound=>sound.id===event.target.value);if(!item)return;update({soundCatalogId:item.id,soundPreset:item.preset,mediaKey:item.mediaKey,mediaUrl:item.mediaUrl,mediaName:item.fileName,title:item.name,body:item.description})}}>{soundCatalog.map(item=><option key={item.id} value={item.id}>{item.name} · {item.category}</option>)}</select></label><div className="sound-source-divider"><span>atau upload sound sendiri</span></div><input ref={soundInput} hidden type="file" accept="audio/*,video/mp4,.mp3,.m4a,.wav,.ogg,.aac,.mp4" onChange={event=>void uploadSoundMedia(event.target.files?.[0])}/><button className="upload-control" onClick={()=>soundInput.current?.click()}><FileAudio size={18}/><span><strong>Upload Sound</strong><small>MP3, M4A, WAV, OGG, AAC, MP4 · maksimal 15 MB</small></span></button>{feature.mediaName&&<div className="media-file"><Music2 size={15}/><span>{feature.mediaName}</span><button onClick={()=>update({mediaKey:undefined,mediaUrl:undefined,mediaName:undefined,soundCatalogId:'sound-romantic-piano',soundPreset:'romantic-piano',body:'Romantic Piano'})}><Trash2 size={13}/></button></div>}<div className="setting-row compact"><div><PlayCircle size={16}/><span><strong>Autoplay</strong><small>Dimulai setelah interaksi pengunjung.</small></span></div><button className={`toggle ${feature.autoplay?'on':''}`} onClick={()=>update({autoplay:!feature.autoplay})}><i/></button></div></>}</div>

  if (tab === 'style') return <div className="inspector-group"><div className="selection-label"><Palette size={17}/><div><strong>Feature Style</strong><span>{feature.type}</span></div></div>{layoutControls}<BackgroundDesignControls value={feature} update={patch=>update(patch)} hasImage={feature.type==='invitation-cover'&&Boolean(feature.mediaUrl)}/>{textTypes.includes(feature.type)&&<><label>Font family<select value={feature.fontFamily} onChange={event=>update({fontFamily:event.target.value})}><option>Playfair Display</option><option>DM Sans</option><option>Georgia</option><option>Arial</option><option>Times New Roman</option><option>Verdana</option><option>Courier New</option></select></label><div className="toolbar-row"><button className={feature.bold?'active':''} onClick={()=>update({bold:!feature.bold})}><Bold size={16}/></button><button className={feature.italic?'active':''} onClick={()=>update({italic:!feature.italic})}><Italic size={16}/></button><button className={feature.underline?'active':''} onClick={()=>update({underline:!feature.underline})}><Underline size={16}/></button></div><label>Content alignment<div className="toolbar-row alignment">{([['left',AlignLeft],['center',AlignCenter],['right',AlignRight],['justify',AlignJustify]] as [Alignment,typeof AlignLeft][]).map(([value,Icon])=><button key={value} className={feature.align===value?'active':''} onClick={()=>update({align:value})}><Icon size={16}/></button>)}</div></label><label>Font size <span>{feature.fontSize}px</span><input type="range" min="16" max="96" value={feature.fontSize} onChange={event=>update({fontSize:Number(event.target.value)})}/></label><label>Line spacing <span>{feature.lineHeight.toFixed(2)}</span><input type="range" min="1" max="2.5" step="0.05" value={feature.lineHeight} onChange={event=>update({lineHeight:Number(event.target.value)})}/></label><div className="two-inputs"><label>Text color<input type="color" value={feature.textColor} onChange={event=>update({textColor:event.target.value})}/></label><label>Background<input type="color" value={feature.backgroundColor==='transparent'?'#ffffff':feature.backgroundColor} onChange={event=>update({backgroundColor:event.target.value})}/></label></div></>}{feature.type==='invitation-cover'&&<div className="cover-style-group"><div className="group-heading"><strong>Opening Layout & Button</strong><span>Canvas-like controls</span></div><label>Vertical position<select value={feature.coverVerticalAlign||'center'} onChange={event=>update({coverVerticalAlign:event.target.value as Feature['coverVerticalAlign']})}><option value="top">Top</option><option value="center">Middle</option><option value="bottom">Bottom</option></select></label><label>Button radius <span>{feature.coverButtonRadius??12}px</span><input type="range" min="0" max="999" value={feature.coverButtonRadius??12} onChange={event=>update({coverButtonRadius:Number(event.target.value)})}/></label><label>Border width <span>{feature.coverButtonBorderWidth??1}px</span><input type="range" min="0" max="8" value={feature.coverButtonBorderWidth??1} onChange={event=>update({coverButtonBorderWidth:Number(event.target.value)})}/></label><div className="two-inputs"><label>Border color<input type="color" value={feature.coverButtonBorderColor||'#ffffff'} onChange={event=>update({coverButtonBorderColor:event.target.value})}/></label><label>Button color<input type="color" value={feature.coverButtonBackground||'#102f27'} onChange={event=>update({coverButtonBackground:event.target.value})}/></label></div><label>Button text<input type="color" value={feature.coverButtonTextColor||'#ffffff'} onChange={event=>update({coverButtonTextColor:event.target.value})}/></label><label>Horizontal padding <span>{feature.coverButtonPaddingX??30}px</span><input type="range" min="8" max="64" value={feature.coverButtonPaddingX??30} onChange={event=>update({coverButtonPaddingX:Number(event.target.value)})}/></label><label>Vertical padding <span>{feature.coverButtonPaddingY??15}px</span><input type="range" min="6" max="30" value={feature.coverButtonPaddingY??15} onChange={event=>update({coverButtonPaddingY:Number(event.target.value)})}/></label><div className="group-heading"><strong>Cover Background Image</strong></div><label>Background effect<select value={feature.backgroundEffect||'none'} onChange={event=>update({backgroundEffect:event.target.value as BackgroundEffect})}><option value="none">Original</option><option value="grayscale">Black & White</option><option value="sepia">Sepia</option><option value="darken">Darken</option><option value="soft-blur">Soft Blur</option><option value="warm">Warm Tone</option><option value="cool">Cool Tone</option><option value="high-contrast">High Contrast</option></select></label><label>Position<select value={feature.backgroundPosition||'center'} onChange={event=>update({backgroundPosition:event.target.value as Feature['backgroundPosition']})}><option value="center">Center</option><option value="top">Top</option><option value="bottom">Bottom</option><option value="left">Left</option><option value="right">Right</option></select></label><label>Size<select value={feature.backgroundSize||'cover'} onChange={event=>update({backgroundSize:event.target.value as Feature['backgroundSize']})}><option value="cover">Cover</option><option value="contain">Contain</option><option value="auto">Original size</option></select></label><label>Repeat<select value={feature.backgroundRepeat||'no-repeat'} onChange={event=>update({backgroundRepeat:event.target.value as Feature['backgroundRepeat']})}><option value="no-repeat">No repeat</option><option value="repeat">Repeat</option><option value="repeat-x">Repeat horizontal</option><option value="repeat-y">Repeat vertical</option></select></label><label>Dark overlay <span>{feature.overlayOpacity??45}%</span><input type="range" min="0" max="90" value={feature.overlayOpacity??45} onChange={event=>update({overlayOpacity:Number(event.target.value)})}/></label></div>}{feature.type==='gallery'&&<><label>Gallery layout<select value={feature.galleryStyle} onChange={event=>update({galleryStyle:event.target.value as GalleryStyle})}><option value="grid">Grid</option><option value="carousel">Carousel</option><option value="filmstrip">Filmstrip</option></select></label><div className="setting-row compact"><div><Repeat2 size={16}/><span><strong>Autoplay carousel</strong><small>Berjalan otomatis pada live website.</small></span></div><button className={`toggle ${feature.galleryAutoplay?'on':''}`} onClick={()=>update({galleryAutoplay:!feature.galleryAutoplay})}><i/></button></div><div className="setting-row compact"><div><Monitor size={16}/><span><strong>Full width gallery</strong><small>Gunakan seluruh lebar viewport.</small></span></div><button className={`toggle ${feature.galleryFullWidth?'on':''}`} onClick={()=>update({galleryFullWidth:!feature.galleryFullWidth})}><i/></button></div><label>Transition speed <span>{feature.galleryTransitionMs||850}ms</span><input type="range" min="300" max="1800" step="50" value={feature.galleryTransitionMs||850} onChange={event=>update({galleryTransitionMs:Number(event.target.value)})}/></label></>}<BoxStyle feature={feature} update={update}/></div>

  return <div className="inspector-group"><div className="selection-label"><Zap size={17}/><div><strong>Animation Library</strong><span>Advanced live preview</span></div></div>{feature.type==='invitation-cover'&&<div className="opening-transition-controls"><div className="group-heading"><strong>Open Invitation Transition</strong><span>Viewer interaction</span></div><label>Opening effect<select value={feature.coverExitEffect||'fade'} onChange={event=>update({coverExitEffect:event.target.value as CoverExitEffect})}><option value="fade">Fade</option><option value="slide-up">Slide Up</option><option value="slide-down">Slide Down</option><option value="slide-left">Slide Left</option><option value="slide-right">Slide Right</option><option value="zoom">Zoom Out</option><option value="curtain">Curtain</option><option value="split">Split Reveal</option><option value="dissolve">Dissolve</option></select></label><label>Duration <span>{feature.coverExitDuration??700}ms</span><input type="range" min="150" max="1800" step="50" value={feature.coverExitDuration??700} onChange={event=>update({coverExitDuration:Number(event.target.value)})}/></label><label>Easing<select value={feature.coverExitEasing||'ease'} onChange={event=>update({coverExitEasing:event.target.value as Feature['coverExitEasing']})}><option value="ease">Ease</option><option value="ease-in">Ease In</option><option value="ease-out">Ease Out</option><option value="ease-in-out">Ease In Out</option><option value="linear">Linear</option></select></label><div className="reduced-motion-note"><CircleHelp size={15}/><span>Jika device menggunakan Reduce Motion, transition otomatis disederhanakan.</span></div></div>}<label>Entrance Effect<select value={feature.entranceEffect} onChange={event=>{update({entranceEffect:event.target.value});window.setTimeout(replay,0)}}>{entranceEffects.map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label><label>Transition<select value={feature.transition} onChange={event=>{update({transition:event.target.value});window.setTimeout(replay,0)}}>{transitions.map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label><label>Visual Effect<select value={feature.visualEffect||'none'} onChange={event=>{update({visualEffect:event.target.value});window.setTimeout(replay,0)}}>{visualEffects.map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label><label>Effect intensity <span>{feature.effectIntensity??55}%</span><input type="range" min="10" max="100" value={feature.effectIntensity??55} onChange={event=>update({effectIntensity:Number(event.target.value)})}/></label><div className="animation-preview-card"><div className={`animation-preview-object fx-${feature.entranceEffect} trans-${feature.transition} effect-${feature.visualEffect||'none'}`} style={{'--effect-intensity':`${(feature.effectIntensity??55)/100}`} as React.CSSProperties}><Sparkles size={18}/><span>Live Motion Preview</span><FeatureEffect effect={feature.visualEffect||'none'}/></div></div><button className="replay-btn" onClick={replay}><Play size={15}/> Replay animation</button></div>
}

type BackgroundDesignState = {
  backgroundColor: string
  backgroundGradientEnabled?: boolean
  backgroundGradientFrom?: string
  backgroundGradientTo?: string
  backgroundGradientAngle?: number
  backgroundEffect?: BackgroundEffect
  backgroundPosition?: 'center' | 'top' | 'bottom' | 'left' | 'right'
  backgroundRepeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y'
  backgroundMotion?: BackgroundMotion
}

function BackgroundDesignControls({ value, update, hasImage }: { value: BackgroundDesignState; update: (patch: Partial<BackgroundDesignState>) => void; hasImage: boolean }) {
  return <div className="background-design-controls"><div className="group-heading"><strong>Background Design</strong><span>{value.backgroundGradientEnabled ? 'Gradient' : 'Solid'}</span></div><div className="setting-row compact"><div><Palette size={16} /><span><strong>Enable gradient</strong><small>Gunakan dua warna sebagai background.</small></span></div><button className={`toggle ${value.backgroundGradientEnabled ? 'on' : ''}`} onClick={() => update({ backgroundGradientEnabled: !value.backgroundGradientEnabled })}><i /></button></div>{value.backgroundGradientEnabled ? <><div className="two-inputs"><label>From<input type="color" value={value.backgroundGradientFrom || value.backgroundColor} onChange={event => update({ backgroundGradientFrom: event.target.value })} /></label><label>To<input type="color" value={value.backgroundGradientTo || '#d7b66f'} onChange={event => update({ backgroundGradientTo: event.target.value })} /></label></div><label>Gradient angle <span>{value.backgroundGradientAngle ?? 135}°</span><input type="range" min="0" max="360" value={value.backgroundGradientAngle ?? 135} onChange={event => update({ backgroundGradientAngle: Number(event.target.value) })} /></label><div className="gradient-preview" style={{ background: getGradientBackground(true, value.backgroundGradientFrom, value.backgroundGradientTo, value.backgroundGradientAngle, value.backgroundColor) }} /></> : <label>Background color<input type="color" value={value.backgroundColor === 'transparent' ? '#ffffff' : value.backgroundColor} onChange={event => update({ backgroundColor: event.target.value })} /></label>}{hasImage && <div className="background-image-options"><div className="group-heading"><strong>Background Image</strong><span>Interactive</span></div><label>Image effect<select value={value.backgroundEffect || 'none'} onChange={event => update({ backgroundEffect: event.target.value as BackgroundEffect })}><option value="none">Original</option><option value="grayscale">Black & White</option><option value="sepia">Sepia</option><option value="darken">Darken</option><option value="soft-blur">Soft Blur</option><option value="warm">Warm Tone</option><option value="cool">Cool Tone</option><option value="high-contrast">High Contrast</option></select></label><label>Image motion<select value={value.backgroundMotion || 'none'} onChange={event => update({ backgroundMotion: event.target.value as BackgroundMotion })}><option value="none">Static</option><option value="zoom-in">Slow Zoom In</option><option value="zoom-out">Slow Zoom Out</option><option value="pan-left">Pan to Left</option><option value="pan-right">Pan to Right</option><option value="ken-burns">Ken Burns</option><option value="float-soft">Soft Floating</option></select></label><label>Position<select value={value.backgroundPosition || 'center'} onChange={event => update({ backgroundPosition: event.target.value as BackgroundDesignState['backgroundPosition'] })}><option value="center">Center</option><option value="top">Top</option><option value="bottom">Bottom</option><option value="left">Left</option><option value="right">Right</option></select></label><label>Repeat<select value={value.backgroundRepeat || 'no-repeat'} onChange={event => update({ backgroundRepeat: event.target.value as BackgroundDesignState['backgroundRepeat'] })}><option value="no-repeat">No repeat</option><option value="repeat">Repeat both</option><option value="repeat-x">Repeat horizontal</option><option value="repeat-y">Repeat vertical</option></select></label></div>}</div>
}

function BoxStyle({ feature, update }: { feature: Feature; update: (patch: Partial<Feature>) => void }) {
  if (feature.type === 'sound') return <div className="layout-help">Sound memakai fixed player. Padding, margin, dan border radius Feature tidak ditampilkan karena tidak memengaruhi public player.</div>
  if (feature.type === 'invitation-cover') return <div className="box-style"><label>Content padding <span>{feature.padding}px</span><input type="range" min="0" max="80" value={feature.padding} onChange={event => update({ padding: Number(event.target.value) })} /></label><label>Vertical spacing <span>{feature.margin}px</span><input type="range" min="0" max="80" value={feature.margin} onChange={event => update({ margin: Number(event.target.value) })} /></label><div className="layout-help">Border radius tombol diatur melalui <strong>Button radius</strong>. Cover background tetap full Canvas.</div></div>
  return <div className="box-style"><label>Border radius <span>{feature.borderRadius}px</span><input type="range" min="0" max="80" value={feature.borderRadius} onChange={event => update({ borderRadius: Number(event.target.value) })} /></label><label>Padding <span>{feature.padding}px</span><input type="range" min="0" max="80" value={feature.padding} onChange={event => update({ padding: Number(event.target.value) })} /></label><label>Margin <span>{feature.margin}px</span><input type="range" min="0" max="80" value={feature.margin} onChange={event => update({ margin: Number(event.target.value) })} /></label></div>
}

function InviteeManagementPage({sections,selectedSectionId,selectSection,updateSection,flash}:{sections:CanvasSection[];selectedSectionId:string;selectSection:(section:CanvasSection)=>void;updateSection:(sectionId:string,patch:Partial<CanvasSection>)=>void;flash:(message:string)=>void}) {
  const section=sections.find(item=>item.id===selectedSectionId)||sections[0]
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const csvRef=useRef<HTMLInputElement>(null)
  if(!section)return <div className="invitee-page empty-state"><Users size={34}/><h2>Belum ada Canvas</h2><p>Buat Canvas terlebih dahulu untuk menambahkan daftar undangan.</p></div>
  const add=()=>{if(!name.trim())return;updateSection(section.id,{invitees:[...section.invitees,{id:uid('invitee'),name:name.trim(),email:email.trim(),phone:'',city:''}]});setName('');setEmail('');flash('Undangan ditambahkan ke Canvas.')}
  const importCsv=async(file?:File)=>{if(!file)return;const rows=(await file.text()).split(/\r?\n/).filter(Boolean);if(rows.length<2)return;const headers=rows[0].split(',').map(item=>item.trim().toLowerCase());const at=(key:string)=>headers.indexOf(key);if(at('name')<0){flash('CSV wajib memiliki header name,email,phone,city.');return}const imported=rows.slice(1).map(row=>{const values=row.split(',').map(value=>value.trim().replace(/^"|"$/g,''));return{id:uid('invitee'),name:values[at('name')]||'',email:at('email')>=0?values[at('email')]||'':'',phone:at('phone')>=0?values[at('phone')]||'':'',city:at('city')>=0?values[at('city')]||'':''}}).filter(item=>item.name);updateSection(section.id,{invitees:[...section.invitees,...imported]});flash(`${imported.length} undangan berhasil diimpor.`)}
  const download=()=>{const blob=new Blob(['name,email,phone,city\nAdi Pratama,adi@example.com,08123456789,Jakarta'],{type:'text/csv'});const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download='format-list-undangan.csv';link.click();URL.revokeObjectURL(link.href)}
  return <div className="invitee-page"><header><div><span>LIST UNDANGAN</span><h2>Guest management per Canvas</h2><p>Daftar ini digunakan untuk personalisasi Buka Undangan dan pelacakan RSVP.</p></div><label>Canvas<select value={section.id} onChange={event=>{const next=sections.find(item=>item.id===event.target.value);if(next)selectSection(next)}}>{sections.map(item=><option key={item.id} value={item.id}>{item.name}</option>)}</select></label></header><section className="invitee-summary"><article><Users size={20}/><strong>{section.invitees.length}</strong><span>Total undangan</span></article><article><MailOpen size={20}/><strong>{section.invitees.filter(item=>item.email).length}</strong><span>Memiliki email</span></article><article><MapPin size={20}/><strong>{new Set(section.invitees.map(item=>item.city).filter(Boolean)).size}</strong><span>Kota</span></article></section><section className="invitee-editor-card"><div className="invitee-create-row"><input value={name} onChange={event=>setName(event.target.value)} placeholder="Nama undangan"/><input value={email} onChange={event=>setEmail(event.target.value)} placeholder="Email (opsional)"/><button onClick={add}><UserPlus size={15}/>Add</button></div><input ref={csvRef} hidden type="file" accept=".csv,text/csv" onChange={event=>void importCsv(event.target.files?.[0])}/><div className="csv-actions"><button onClick={()=>csvRef.current?.click()}><Upload size={14}/>Import CSV</button><button onClick={download}><Download size={14}/>Download Format</button></div><div className="invitee-table"><div className="invitee-table-head"><span>Name</span><span>Email</span><span>Phone</span><span>City</span><span/></div>{section.invitees.map(item=><div key={item.id}><strong>{item.name}</strong><span>{item.email||'—'}</span><span>{item.phone||'—'}</span><span>{item.city||'—'}</span><button onClick={()=>updateSection(section.id,{invitees:section.invitees.filter(value=>value.id!==item.id)})}><Trash2 size={14}/></button></div>)}{!section.invitees.length&&<div className="invitee-empty">Belum ada undangan pada Canvas ini.</div>}</div></section></div>
}

function SectionInspector({ section, tab, update, setColumnCount, backgroundInput, uploadBackground }: {
  section: CanvasSection
  tab: InspectorTab
  update: (patch: Partial<CanvasSection>) => void
  setColumnCount: (count: ColumnCount) => void
  backgroundInput: React.RefObject<HTMLInputElement | null>
  uploadBackground: (file: File | undefined) => Promise<void>
}) {
  if (tab === 'content') return <div className="inspector-group"><div className="selection-label"><LayoutDashboard size={17} /><div><strong>{section.name}</strong><span>Canvas</span></div></div><label>Canvas name<input value={section.name} onChange={event => update({ name: event.target.value })} /></label><label>Layout mode<select value={section.layoutMode} onChange={event => { const value = event.target.value as CanvasLayoutMode; update({ layoutMode: value }); if (value === 'split-fixed-left' || value === 'split-fixed-right') setColumnCount(2) }}><option value="standard">Standard responsive</option><option value="split-fixed-left">Split: fixed left + scroll right</option><option value="split-fixed-right">Split: scroll left + fixed right</option></select></label><label>Column layout<div className="column-picker">{([1, 2, 3, 4] as ColumnCount[]).map(count => <button key={count} className={section.columns.length === count ? 'active' : ''} onClick={() => setColumnCount(count)}>{count === 1 ? <LayoutDashboard size={17} /> : count === 2 ? <Columns2 size={17} /> : count === 3 ? <Columns3 size={17} /> : <Columns4 size={17} />}<span>{count}</span></button>)}</div></label><div className="info-box"><Columns2 size={17} /><p>Struktur editor mengikuti <strong>Canvas → Column → Features</strong>. Mode Split mendukung <strong>Fixed Left</strong> maupun <strong>Fixed Right</strong>.</p></div></div>
  if (tab === 'style') return <div className="inspector-group"><div className="selection-label"><Palette size={17} /><div><strong>Canvas Background</strong><span>Color, gradient, image motion</span></div></div><BackgroundDesignControls value={section} update={patch => update(patch)} hasImage={Boolean(section.backgroundUrl)} /><input ref={backgroundInput} hidden type="file" accept="image/*" onChange={event => void uploadBackground(event.target.files?.[0])} /><button className="upload-control" onClick={() => backgroundInput.current?.click()}><Upload size={18} /><span><strong>Upload Background</strong><small>Maksimal 2 MB</small></span></button>{section.backgroundUrl && <button className="clear-media" onClick={() => update({ backgroundUrl: undefined, backgroundKey: undefined })}><Trash2 size={14} /> Remove background image</button>}</div>
  return <div className="inspector-group"><div className="selection-label"><Settings size={17} /><div><strong>Canvas Advanced</strong><span>Spacing dan height</span></div></div><label>Horizontal padding <span>{section.paddingX ?? 32}px</span><input type="range" min="0" max="160" value={section.paddingX ?? 32} onChange={event => update({ paddingX: Number(event.target.value) })} /></label><label>Vertical padding <span>{section.paddingY}px</span><input type="range" min="0" max="180" value={section.paddingY} onChange={event => update({ paddingY: Number(event.target.value) })} /></label><label>Minimum height <span>{section.minHeight}px</span><input type="range" min="180" max="1200" step="10" value={section.minHeight} onChange={event => update({ minHeight: Number(event.target.value) })} /></label><div className="danger-zone"><strong>Canvas structure</strong><p>Canvas ini memiliki {section.columns.length} Column dan {section.columns.reduce((total, column) => total + column.features.length, 0)} Feature.</p></div></div>
}

function WeddingCanvas({ page, sections, selectedTemplate, greetings, addGreeting, guests, addGuest, editable = false, selectedSectionId = '', selectedColumnId = '', selectedFeatureId = '', selectSection, selectColumn, selectFeature, updateFeature, onColumnDrop, onCanvasDrop, animationNonce = 0 }: {
  page: PageKey
  sections: CanvasSection[]
  selectedTemplate: Template
  greetings: Greeting[]
  addGreeting: (name: string, message: string) => void
  guests: Guest[]
  addGuest: (name: string, status: Guest['status'], pax: number, canvasId?: string) => void
  editable?: boolean
  selectedSectionId?: string
  selectedColumnId?: string
  selectedFeatureId?: string
  selectSection?: (section: CanvasSection) => void
  selectColumn?: (sectionId: string, columnId: string) => void
  selectFeature?: (sectionId: string, columnId: string, featureId: string) => void
  updateFeature?: (featureId: string, patch: Partial<Feature>) => void
  onColumnDrop?: (event: React.DragEvent, sectionId: string, columnId: string) => void
  onCanvasDrop?: (draggedId:string,targetId:string) => void
  animationNonce?: number
}) {
  const coverEntry = useMemo(() => {
    for (const section of sections) for (const column of section.columns) for (const feature of column.features) if (feature.type === 'invitation-cover') return { section, feature }
    return undefined
  }, [sections])
  const hasCover = Boolean(coverEntry)
  const coverFeatureId = coverEntry?.feature.id
  const soundFeature = useMemo(() => sections.flatMap(section => section.columns).flatMap(column => column.features).find(feature => feature.type === 'sound'), [sections])
  const [opened, setOpened] = useState(editable || !hasCover)
  const [opening, setOpening] = useState(false)
  useEffect(() => { setOpened(editable || !hasCover) }, [editable, hasCover, coverFeatureId])
  if (page === 'rsvp-page') return <RsvpPage guests={guests} addGuest={addGuest} />
  if (!editable && coverEntry && !opened) {
    const invitee = coverEntry.section.invitees[0]
    return <div className="wedding-site invitation-locked" style={{ '--accent': selectedTemplate.accent } as React.CSSProperties}><InvitationCover section={coverEntry.section} feature={coverEntry.feature} inviteeName={invitee?.name} opening={opening} onOpen={() => { setOpening(true); window.setTimeout(() => { setOpened(true); setOpening(false) }, Math.max(150, coverEntry.feature.coverExitDuration ?? 700)) }} />{soundFeature && <FixedSoundPlayer feature={soundFeature} />}</div>
  }
  return <div className={`wedding-site theme-${selectedTemplate.preset || 'classic'}`} style={{ '--accent': selectedTemplate.accent } as React.CSSProperties}><nav><Brand /><div><a>Our Story</a><a>Event</a><a>Gallery</a><a>RSVP</a></div></nav>{sections.map(section => {
    const filter = getBackgroundFilter(section.backgroundEffect)
    const hasVisibleFeatures = editable || section.columns.some(column => column.features.some(feature => feature.type !== 'invitation-cover' && feature.type !== 'sound'))
    if (!hasVisibleFeatures) return null
    return <section key={section.id} className={`canvas-section layout-${section.layoutMode} ${editable && selectedSectionId === section.id ? 'selected-canvas' : ''}`} onDragOver={event=>{if(editable&&event.dataTransfer.types.includes('application/x-ikrarku-canvas'))event.preventDefault()}} onDrop={event=>{if(editable){const dragged=event.dataTransfer.getData('application/x-ikrarku-canvas');if(dragged){event.preventDefault();onCanvasDrop?.(dragged,section.id)}}}} onClick={event => { if (editable && event.target === event.currentTarget) selectSection?.(section) }} style={{ background: getGradientBackground(section.backgroundGradientEnabled, section.backgroundGradientFrom, section.backgroundGradientTo, section.backgroundGradientAngle, section.backgroundColor), minHeight: section.minHeight, paddingTop: section.layoutMode !== 'standard' ? 0 : section.paddingY, paddingBottom: section.layoutMode !== 'standard' ? 0 : section.paddingY, '--canvas-padding-x': `${section.paddingX ?? 32}px` } as React.CSSProperties}><div className={`background-layer ${getBackgroundMotionClass(section.backgroundMotion)}`} style={{ backgroundImage: section.backgroundUrl ? `url(${section.backgroundUrl})` : undefined, backgroundPosition: section.backgroundPosition, backgroundRepeat: section.backgroundRepeat, backgroundSize: section.backgroundRepeat === 'no-repeat' ? 'cover' : 'auto', filter }} />{editable&&<div className="canvas-drag-handle" draggable onDragStart={event=>{event.stopPropagation();event.dataTransfer.setData('application/x-ikrarku-canvas',section.id);event.dataTransfer.effectAllowed='move'}}><GripVertical size={15}/> Drag Canvas</div>}<div className={`canvas-columns columns-${section.columns.length}`}>{section.columns.map((column, columnIndex) => <div key={column.id} className={`canvas-column ${editable && selectedColumnId === column.id ? 'selected-column' : ''}`} onClick={event => { if (editable) { event.stopPropagation(); selectColumn?.(section.id, column.id) } }} onDragOver={event => { if (editable) { event.preventDefault(); event.currentTarget.classList.add('drop-ready') } }} onDragLeave={event => event.currentTarget.classList.remove('drop-ready')} onDrop={event => { event.currentTarget.classList.remove('drop-ready'); onColumnDrop?.(event, section.id, column.id) }}><div className="column-label">Column {columnIndex + 1}{section.layoutMode === 'split-fixed-left' && columnIndex === 0 ? ' · Fixed' : section.layoutMode === 'split-fixed-left' ? ' · Scroll' : section.layoutMode === 'split-fixed-right' && columnIndex === 1 ? ' · Fixed' : section.layoutMode === 'split-fixed-right' ? ' · Scroll' : ''}</div>{column.features.filter(feature => editable || (feature.type !== 'invitation-cover' && feature.type !== 'sound')).length === 0 && editable && <div className="empty-column"><Plus size={18} /><span>Drag feature here</span></div>}{column.features.map(feature => (editable || (feature.type !== 'invitation-cover' && feature.type !== 'sound')) && <FeatureBlock key={`${feature.id}-${animationNonce}`} feature={feature} editable={editable} selected={selectedFeatureId === feature.id} onSelect={() => selectFeature?.(section.id, column.id, feature.id)} onUpdate={patch => updateFeature?.(feature.id, patch)} greetings={greetings} addGreeting={addGreeting} guests={guests} addGuest={addGuest} inviteeName={section.invitees[0]?.name} canvasId={section.id} />)}</div>)}</div></section>
  })}{soundFeature && <FixedSoundPlayer feature={soundFeature} />}</div>
}

function InvitationCover({ section, feature, inviteeName, onOpen, opening = false }: { section: CanvasSection; feature: Feature; inviteeName?: string; onOpen: () => void; opening?: boolean }) {
  const exitEffect=feature.coverExitEffect||'fade'
  return <section className={`invitation-cover-screen columns-${section.columns.length} ${opening ? `opening cover-exit-${exitEffect}` : ''}`} style={{ background: getGradientBackground(section.backgroundGradientEnabled, section.backgroundGradientFrom, section.backgroundGradientTo, section.backgroundGradientAngle, section.backgroundColor), '--cover-exit-duration': `${feature.coverExitDuration??700}ms`, '--cover-exit-easing': feature.coverExitEasing||'ease' } as React.CSSProperties}><div className={`invitation-section-bg ${getBackgroundMotionClass(section.backgroundMotion)}`} style={{ backgroundImage: section.backgroundUrl ? `url(${section.backgroundUrl})` : undefined, backgroundPosition: section.backgroundPosition, backgroundRepeat: section.backgroundRepeat, backgroundSize: 'cover', filter: getBackgroundFilter(section.backgroundEffect) }} /><div className={`invitation-cover-grid columns-${section.columns.length}`}>{section.columns.map((column, columnIndex) => { const cover = column.features.find(item => item.type === 'invitation-cover'); const companions = column.features.filter(item => item.type !== 'invitation-cover'); const active = cover || (columnIndex === 0 ? feature : undefined); return <div className="invitation-cover-column" key={column.id} style={active?{background:getGradientBackground(active.backgroundGradientEnabled,active.backgroundGradientFrom,active.backgroundGradientTo,active.backgroundGradientAngle,active.backgroundColor)}:undefined}>{active && <><div className={`invitation-column-bg ${getBackgroundMotionClass(active.backgroundMotion)}`} style={{ backgroundImage: active.mediaUrl ? `url(${active.mediaUrl})` : undefined, backgroundPosition: active.backgroundPosition || 'center', backgroundRepeat: active.backgroundRepeat || 'no-repeat', backgroundSize: active.backgroundSize || 'cover', filter: getBackgroundFilter(active.backgroundEffect) }} /><div className="invitation-column-overlay" style={{ opacity: (active.overlayOpacity ?? 45) / 100 }} /><div className="cover-content" style={{ ...getCoverContentObjectStyle(active), fontFamily: active.fontFamily, color: active.textColor, textAlign:active.align, alignItems:getCoverContentAlignment(active.align), justifyContent:getCoverVerticalJustify(active.coverVerticalAlign), padding:active.padding, marginTop:active.margin, marginBottom:active.margin, lineHeight:active.lineHeight, fontWeight:active.bold?700:400, fontStyle:active.italic?'italic':'normal', textDecoration:active.underline?'underline':'none' }}><small>{active.eyebrowText || 'UNDANGAN PERNIKAHAN'}</small><h1 style={{ fontSize: Math.min(active.fontSize, section.columns.length > 1 ? 58 : 82) }}>{active.title}</h1><p>{active.guestLabelText || 'Kepada Yth. Bapak/Ibu/Saudara/i'}</p><strong>{inviteeName || active.guestNameText || 'Tamu Terhormat'}</strong><span>{active.body || 'Dengan penuh kebahagiaan kami mengundang Anda'}</span><button className={`cover-open-button icon-${active.coverIconPosition||'left'}`} onClick={onOpen} style={{borderRadius:active.coverButtonRadius??12,borderWidth:active.coverButtonBorderWidth??1,borderColor:active.coverButtonBorderColor||'#fff',background:active.coverButtonBackground||'#102f27',color:active.coverButtonTextColor||'#fff',padding:`${active.coverButtonPaddingY??15}px ${active.coverButtonPaddingX??30}px`}}>{active.coverIconPosition==='top'&&<CoverIconGlyph name={active.coverIcon} size={active.coverIconSize}/>} {active.coverIconPosition!=='top'&&active.coverIconPosition!=='right'&&<CoverIconGlyph name={active.coverIcon} size={active.coverIconSize}/>}<span>{active.buttonLabel || 'Buka Undangan'}</span>{active.coverIconPosition==='right'&&<CoverIconGlyph name={active.coverIcon} size={active.coverIconSize}/>}</button><em>*Mohon maaf jika terdapat kesalahan dalam penulisan nama & gelar</em></div></>}{!active && <div className="cover-companion"><small>OUR WEDDING STORY</small>{companions.map(item => <div key={item.id}><FeatureIcon type={item.type} /><strong>{item.title}</strong><p>{item.body}</p></div>)}</div>}{active && companions.length > 0 && <div className="cover-companion-floating">{companions.slice(0, 2).map(item => <div key={item.id}><FeatureIcon type={item.type} /><span>{item.title}</span></div>)}</div>}</div> })}</div><div className="cover-orb one" /><div className="cover-orb two" /></section>
}

function FeatureBlock({ feature, editable, selected, onSelect, onUpdate, greetings, addGreeting, guests, addGuest, inviteeName, canvasId }: {
  feature: Feature
  editable: boolean
  selected: boolean
  onSelect: () => void
  onUpdate: (patch: Partial<Feature>) => void
  greetings: Greeting[]
  addGreeting: (name: string, message: string) => void
  guests: Guest[]
  addGuest: (name: string, status: Guest['status'], pax: number, canvasId?: string) => void
  inviteeName?: string
  canvasId: string
}) {
  const objectStyle: React.CSSProperties=feature.type==='invitation-cover'?{width:'100%',alignSelf:'stretch'}:getFeatureObjectStyle(feature)
  const style: React.CSSProperties = {
    ...objectStyle,
    fontFamily: feature.fontFamily, textAlign: feature.align, lineHeight: feature.lineHeight,
    color: feature.textColor, background: getGradientBackground(feature.backgroundGradientEnabled, feature.backgroundGradientFrom, feature.backgroundGradientTo, feature.backgroundGradientAngle, feature.backgroundColor), borderRadius: feature.borderRadius,
    padding: feature.type==='invitation-cover'?0:feature.padding, marginTop: feature.margin, marginBottom: feature.margin, fontWeight: feature.bold ? 700 : 400,
    fontStyle: feature.italic ? 'italic' : 'normal', textDecoration: feature.underline ? 'underline' : 'none',
    position: 'relative', overflow: feature.type === 'gallery' && feature.galleryFullWidth ? 'visible' : 'hidden', '--effect-intensity': `${(feature.effectIntensity ?? 55) / 100}`
  } as React.CSSProperties
  const editableText = (field: 'title' | 'body', className: string) => <div className={className} contentEditable={editable && !feature.locked} suppressContentEditableWarning onBlur={event => onUpdate({ [field]: event.currentTarget.textContent || '' })} style={field === 'title' ? { fontSize: feature.fontSize } : undefined}>{feature[field]}</div>
  const canvasGuests = guests.filter(guest => guest.canvasId === canvasId)
  return <div id={`feature-${feature.id}`} draggable={editable&&!feature.locked} onDragStart={event => { event.dataTransfer.setData('application/x-ikrarku-feature', feature.id); event.dataTransfer.effectAllowed = 'move' }} onClick={event => { if (editable) { event.stopPropagation(); onSelect() } }} className={`feature-block feature-${feature.type} object-${feature.objectAlign||'stretch'} fx-${feature.entranceEffect} trans-${feature.transition} effect-${feature.visualEffect || 'none'} ${feature.backgroundGradientEnabled?'has-gradient':''} ${selected ? 'selected-feature' : ''}`} style={style}><FeatureEffect effect={feature.visualEffect || 'none'} />{editable && <div className="feature-handle"><GripVertical size={13} /> {feature.type}</div>}{feature.type === 'text' && <div className="text-feature">{editableText('title', 'editable-title')}{editableText('body', 'editable-body')}</div>}{feature.type === 'quote' && <div className="quote-feature"><Sparkles size={20} />{editableText('title', 'editable-title')}{editableText('body', 'editable-body')}</div>}{feature.type === 'event' && <div className="event-feature"><CalendarDays size={25} />{editableText('title', 'editable-title')}{editableText('body', 'editable-body')}</div>}{feature.type === 'gift' && <div className="event-feature"><Crown size={25} />{editableText('title', 'editable-title')}{editableText('body', 'editable-body')}</div>}{feature.type === 'invitation-cover' && <div className="cover-feature-editor" style={{background:getGradientBackground(feature.backgroundGradientEnabled,feature.backgroundGradientFrom,feature.backgroundGradientTo,feature.backgroundGradientAngle,feature.backgroundColor),color:feature.textColor}}><div className={`cover-editor-bg ${getBackgroundMotionClass(feature.backgroundMotion)}`} style={{ backgroundImage: feature.mediaUrl ? `url(${feature.mediaUrl})` : undefined, backgroundPosition: feature.backgroundPosition || 'center', backgroundRepeat: feature.backgroundRepeat || 'no-repeat', backgroundSize: feature.backgroundSize || 'cover', filter: getBackgroundFilter(feature.backgroundEffect) }} /><div className="cover-editor-overlay" style={{ opacity: (feature.overlayOpacity ?? 45) / 100 }} /><div className="cover-editor-content" style={{...getCoverContentObjectStyle(feature),alignSelf:feature.objectAlign==='left'?'flex-start':feature.objectAlign==='right'?'flex-end':feature.objectAlign==='stretch'?'stretch':'center',color:feature.textColor,textAlign:feature.align,alignItems:getCoverContentAlignment(feature.align),justifyContent:getCoverVerticalJustify(feature.coverVerticalAlign),padding:feature.padding,lineHeight:feature.lineHeight,fontWeight:feature.bold?700:400,fontStyle:feature.italic?'italic':'normal',textDecoration:feature.underline?'underline':'none'}}><small contentEditable={editable} suppressContentEditableWarning onBlur={event=>onUpdate({eyebrowText:event.currentTarget.textContent||''})}>{feature.eyebrowText||'UNDANGAN PERNIKAHAN'}</small>{editableText('title', 'editable-title')}<p contentEditable={editable} suppressContentEditableWarning onBlur={event=>onUpdate({guestLabelText:event.currentTarget.textContent||''})}>{feature.guestLabelText||'Kepada Yth. Bapak/Ibu/Saudara/i'}</p><strong contentEditable={editable} suppressContentEditableWarning onBlur={event=>onUpdate({guestNameText:event.currentTarget.textContent||''})}>{inviteeName||feature.guestNameText||'Tamu Terhormat'}</strong>{editableText('body','editable-body')}<button type="button" className={`cover-open-button icon-${feature.coverIconPosition||'left'}`} style={{borderRadius:feature.coverButtonRadius??12,borderWidth:feature.coverButtonBorderWidth??1,borderColor:feature.coverButtonBorderColor||'#fff',background:feature.coverButtonBackground||'#102f27',color:feature.coverButtonTextColor||'#fff',padding:`${feature.coverButtonPaddingY??15}px ${feature.coverButtonPaddingX??30}px`}}>{feature.coverIconPosition==='top'&&<CoverIconGlyph name={feature.coverIcon} size={feature.coverIconSize}/>} {feature.coverIconPosition!=='top'&&feature.coverIconPosition!=='right'&&<CoverIconGlyph name={feature.coverIcon} size={feature.coverIconSize}/>}<span contentEditable={editable} suppressContentEditableWarning onBlur={event=>onUpdate({buttonLabel:event.currentTarget.textContent||''})}>{feature.buttonLabel||'Buka Undangan'}</span>{feature.coverIconPosition==='right'&&<CoverIconGlyph name={feature.coverIcon} size={feature.coverIconSize}/>}</button></div></div>}{feature.type === 'countdown' && <CountdownFeature feature={feature} />}{feature.type === 'location' && <LocationFeature feature={feature} />}{feature.type === 'image' && <div className="image-feature">{feature.mediaUrl ? <img src={feature.mediaUrl} alt={feature.title} style={{ borderRadius: feature.borderRadius }} /> : <div className="media-placeholder"><ImageIcon size={26} /><strong>Image Feature</strong><span>Upload melalui panel Content</span></div>}</div>}{feature.type === 'video' && <div className="video-feature">{feature.mediaUrl ? <video controls src={feature.mediaUrl} /> : <div className="media-placeholder"><Video size={26} /><strong>Video Feature</strong><span>Upload maksimal 5 MB</span></div>}</div>}{feature.type === 'gallery' && <GalleryFeature feature={feature} />}{feature.type === 'form' && <CanvasForm feature={feature} guests={canvasGuests} addGuest={(name, status, pax) => addGuest(name, status, pax, canvasId)} />}{feature.type === 'greetings' && <GreetingsWidget feature={feature} greetings={greetings} addGreeting={addGreeting} compact />}{feature.type === 'sound' && editable && <SoundFeature feature={feature} />}</div>
}

function FeatureEffect({ effect }: { effect: string }) {
  if (!effect || effect === 'none') return null
  const items = Array.from({ length: effect === 'confetti' ? 18 : 10 })
  return <div className={`feature-effect-layer ${effect}`} aria-hidden>{items.map((_, index) => <i key={index} style={{ '--i': index } as React.CSSProperties} />)}</div>
}

function CountdownFeature({ feature }: { feature: Feature }) {
  const getTime = () => {
    const target = new Date(feature.eventDate || '2026-08-20T09:00').getTime()
    const distance = Math.max(0, target - Date.now())
    return { days: Math.floor(distance / 86400000), hours: Math.floor((distance / 3600000) % 24), minutes: Math.floor((distance / 60000) % 60), seconds: Math.floor((distance / 1000) % 60) }
  }
  const [time, setTime] = useState(getTime)
  useEffect(() => {
    const tick = () => {
      const target = new Date(feature.eventDate || '2026-08-20T09:00').getTime()
      const distance = Math.max(0, target - Date.now())
      setTime({ days: Math.floor(distance / 86400000), hours: Math.floor((distance / 3600000) % 24), minutes: Math.floor((distance / 60000) % 60), seconds: Math.floor((distance / 1000) % 60) })
    }
    tick()
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [feature.eventDate])
  return <div className="countdown-feature"><small>SAVE THE DATE</small><h3>{feature.title}</h3><p>{feature.body}</p><div>{[['Hari', time.days], ['Jam', time.hours], ['Menit', time.minutes], ['Detik', time.seconds]].map(([label, value]) => <span key={label}><strong>{String(value).padStart(2, '0')}</strong><em>{label}</em></span>)}</div></div>
}

function LocationFeature({ feature }: { feature: Feature }) {
  const mapUrl = feature.mapUrl || 'https://maps.google.com'
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=210x210&margin=8&data=${encodeURIComponent(mapUrl)}`
  return <div className="location-feature"><div><MapPin size={27} /><small>LOCATION</small><h3>{feature.locationName || feature.title}</h3><p>{feature.locationAddress || feature.body}</p><a href={mapUrl} target="_blank" rel="noreferrer"><MapPin size={15} /> Buka Google Maps</a></div><div className="location-qr"><img src={qrUrl} alt="QR Google Maps" /><span>Scan lokasi</span></div></div>
}

function GalleryFeature({ feature }: { feature: Feature }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const images = feature.galleryUrls || []
  useEffect(() => { if (activeIndex >= images.length) setActiveIndex(Math.max(0, images.length - 1)) }, [images.length, activeIndex])
  useEffect(() => {
    if (feature.galleryStyle !== 'carousel' || !feature.galleryAutoplay || images.length < 2) return
    const timer = window.setInterval(() => setActiveIndex(previous => (previous + 1) % images.length), Math.max(2600, (feature.galleryTransitionMs || 850) + 1400))
    return () => window.clearInterval(timer)
  }, [feature.galleryAutoplay, feature.galleryStyle, feature.galleryTransitionMs, images.length])
  if (!images.length) return <div className="media-placeholder"><ImageIcon size={28} /><strong>Gallery Feature</strong><span>Upload image maksimal 2 MB per file</span></div>
  if (feature.galleryStyle === 'carousel') return <div className={`gallery-carousel ${feature.galleryFullWidth ? 'full-width' : ''}`}><div className="gallery-carousel-track" style={{ transform: `translateX(-${activeIndex * 100}%)`, transitionDuration: `${feature.galleryTransitionMs || 850}ms` }}>{images.map((url, index) => <div className="gallery-carousel-slide" key={`${url}-${index}`}><img src={url} alt={`Gallery ${index + 1}`} /></div>)}</div><button className="carousel-prev" onClick={event => { event.stopPropagation(); setActiveIndex(previous => (previous - 1 + images.length) % images.length) }}><ChevronLeft size={18} /></button><button className="carousel-next" onClick={event => { event.stopPropagation(); setActiveIndex(previous => (previous + 1) % images.length) }}><ChevronRight size={18} /></button><div className="carousel-dots">{images.map((_, index) => <button key={index} className={activeIndex === index ? 'active' : ''} onClick={event => { event.stopPropagation(); setActiveIndex(index) }} />)}</div></div>
  if (feature.galleryStyle === 'filmstrip') return <div className={`gallery-filmstrip ${feature.galleryFullWidth ? 'full-width' : ''}`}>{images.map((url, index) => <img src={url} alt={`Gallery ${index + 1}`} key={`${url}-${index}`} />)}</div>
  return <div className={`gallery-grid ${feature.galleryFullWidth ? 'full-width' : ''}`}>{images.map((url, index) => <img src={url} alt={`Gallery ${index + 1}`} key={`${url}-${index}`} />)}</div>
}

function CanvasForm({ feature, guests, addGuest }: { feature: Feature; guests: Guest[]; addGuest: (name: string, status: Guest['status'], pax: number, canvasId?: string) => void }) {
  const [name, setName] = useState('')
  return <form className="canvas-form" style={{textAlign:feature.align}} onSubmit={event => { event.preventDefault(); if (name.trim()) { addGuest(name.trim(), 'Hadir', 1); setName('') } }}><h3 style={{ fontSize: feature.fontSize }}>{feature.title}</h3><p>{feature.body}</p>{feature.formFields?.map((field, index) => <label key={`${field}-${index}`}>{field}<input value={index === 0 ? name : undefined} onChange={index === 0 ? event => setName(event.target.value) : undefined} placeholder={field} /></label>)}<button type="submit">Submit RSVP ({guests.length})</button></form>
}

function GreetingsWidget({ feature, greetings, addGreeting, compact = false }: { feature?: Feature; greetings: Greeting[]; addGreeting: (name: string, message: string) => void; compact?: boolean }) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const align=feature?.align||'left'
  return <div className={`greetings-widget ${compact ? 'compact' : ''} ${feature?.backgroundGradientEnabled?'gradient-active':''} align-${align}`} style={{textAlign:align}}><form onSubmit={event => { event.preventDefault(); if (name.trim() && message.trim()) { addGreeting(name.trim(), message.trim()); setName(''); setMessage('') } }}><input value={name} onChange={event => setName(event.target.value)} placeholder="Nama Anda" /><textarea value={message} onChange={event => setMessage(event.target.value)} placeholder="Tuliskan ucapan dan doa..." /><button type="submit"><Send size={14} /> Kirim ucapan</button></form><div className="greeting-list">{greetings.slice(0, compact ? 3 : 8).map((greeting, index) => <article key={`${greeting.name}-${index}`}><div className="greeting-avatar">{greeting.name.slice(0, 1)}</div><div><strong>{greeting.name}</strong><p>{greeting.message}</p><small>{greeting.date}</small></div></article>)}{!greetings.length&&<div className="greeting-empty"><MessageCircle size={17}/><span>Belum ada ucapan. Jadilah yang pertama.</span></div>}</div></div>
}

function RsvpPage({ guests, addGuest }: { guests: Guest[]; addGuest: (name: string, status: Guest['status'], pax: number, canvasId?: string) => void }) {
  const [name, setName] = useState('')
  const [status, setStatus] = useState<Guest['status']>('Hadir')
  const [pax, setPax] = useState(1)
  return <section className="system-page rsvp-system-page"><div className="system-page-heading"><Users size={25} /><small>RSVP CONFIRMATION</small><h1>Konfirmasi Kehadiran</h1><p>Bantu kami mempersiapkan hari istimewa dengan lebih baik.</p></div><div className="rsvp-layout"><form onSubmit={event => { event.preventDefault(); if (name.trim()) { addGuest(name.trim(), status, status === 'Hadir' ? pax : 0); setName('') } }}><label>Nama lengkap<input value={name} onChange={event => setName(event.target.value)} placeholder="Nama tamu" /></label><label>Konfirmasi<select value={status} onChange={event => setStatus(event.target.value as Guest['status'])}><option>Hadir</option><option>Tidak hadir</option><option>Menunggu</option></select></label><label>Jumlah tamu<input type="number" min="1" max="5" value={pax} disabled={status !== 'Hadir'} onChange={event => setPax(Number(event.target.value))} /></label><button type="submit">Kirim konfirmasi</button></form><div className="rsvp-summary"><strong>{guests.filter(guest => guest.status === 'Hadir').length}</strong><span>Respons hadir terbaru</span>{guests.slice(0, 4).map((guest, index) => <GuestRow key={`${guest.name}-${index}`} guest={guest} index={index} />)}</div></div></section>
}

function PreviewModal({ sections, template, greetings, addGreeting, guests, addGuest, onClose }: { sections: CanvasSection[]; template: Template; greetings: Greeting[]; addGreeting: (name: string, message: string) => void; guests: Guest[]; addGuest: (name: string, status: Guest['status'], pax: number, canvasId?: string) => void; onClose: () => void }) {
  const [page, setPage] = useState<PageKey>('pages')
  const [mode, setMode] = useState<'desktop' | 'mobile'>('desktop')
  return <div className="preview-overlay"><div className="preview-full"><header><div><strong>Live Preview</strong><span>Full width website preview</span></div><div className="preview-page-tabs"><button className={page === 'pages' ? 'active' : ''} onClick={() => setPage('pages')}>Pages</button><button className={page === 'rsvp-page' ? 'active' : ''} onClick={() => setPage('rsvp-page')}>RSVP</button></div><div className="preview-controls"><button className={mode === 'desktop' ? 'active' : ''} onClick={() => setMode('desktop')}><Monitor size={17} /></button><button className={mode === 'mobile' ? 'active' : ''} onClick={() => setMode('mobile')}><Smartphone size={17} /></button><button onClick={onClose}><X size={19} /></button></div></header><div className={`preview-full-stage ${mode}`}><div className="preview-content"><WeddingCanvas page={page} sections={sections} selectedTemplate={template} greetings={greetings} addGreeting={addGreeting} guests={guests} addGuest={addGuest} /></div></div></div></div>
}

function GuestsModal({ guests, onClose }: { guests: Guest[]; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const filtered = guests.filter(guest => `${guest.name} ${guest.status}`.toLowerCase().includes(query.toLowerCase()))
  return <div className="modal-backdrop"><div className="guest-modal"><div className="modal-heading"><div><div className="eyebrow">RSVP DATABASE</div><h2>Semua konfirmasi tamu</h2><p>{filtered.length} respons ditampilkan</p></div><button className="icon-btn" onClick={onClose}><X size={18} /></button></div><div className="search-field guest-search"><Search size={16} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Cari nama atau status..." /></div><div className="guest-modal-list">{filtered.map((guest, index) => <GuestRow key={`${guest.name}-${index}`} guest={guest} index={index} />)}</div></div></div>
}

function HelpCenter() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Semua')
  const categories = ['Semua', ...Array.from(new Set(faqItems.map(item => item.category)))]
  const filtered = faqItems.filter(item => (category === 'Semua' || item.category === category) && `${item.q} ${item.a}`.toLowerCase().includes(query.toLowerCase()))
  return <div className="help-page"><section className="help-hero"><CircleHelp size={28} /><div className="eyebrow light">ikrarku HELP CENTER</div><h1>Apa yang dapat kami bantu?</h1><p>Cari panduan berdasarkan fitur, media, RSVP, publishing, atau akun.</p><div className="help-search"><Search size={20} /><input autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder="Cari fitur, contoh: column, gallery, background..." /></div></section><div className="help-content"><div className="faq-categories">{categories.map(item => <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="faq-results"><div className="section-heading"><div><span>SEARCH RESULTS</span><h2>{filtered.length} artikel bantuan ditemukan</h2></div></div>{filtered.map(item => <details key={item.q}><summary><div><span>{item.category}</span><strong>{item.q}</strong></div><Plus size={17} /></summary><p>{item.a}</p></details>)}{filtered.length === 0 && <div className="faq-empty"><Search size={28} /><h3>Panduan tidak ditemukan</h3><p>Coba gunakan kata kunci lain atau hubungi Live Chat.</p></div>}</div></div></div>
}

function ChatWidget({ messages, sendChat, open, onOpenChange }: { messages: ChatMessage[]; sendChat: (text: string) => void; open: boolean; onOpenChange: (open: boolean) => void }) {
  const [text, setText] = useState('')
  return <div className={`chat-widget ${open ? 'open' : ''}`}>{open && <div className="chat-window"><header><div className="chat-agent"><div className="agent-avatar">IK</div><div><strong>ikrarku Support</strong><span><i /> Online · biasanya membalas cepat</span></div></div><button onClick={() => onOpenChange(false)}><X size={17} /></button></header><div className="chat-messages">{messages.length === 0 && <div className="chat-empty"><MessageCircle size={22} /><p>Mulai percakapan dengan Customer Service.</p></div>}{messages.map(message => <div key={message.id} className={`chat-message ${message.sender}`}><p>{message.text}</p><span>{message.time}</span></div>)}</div><form onSubmit={event => { event.preventDefault(); sendChat(text); setText('') }}><input value={text} onChange={event => setText(event.target.value)} placeholder="Tulis pesan..." /><button type="submit"><Send size={16} /></button></form></div>}<button className="chat-launcher" onClick={() => onOpenChange(!open)}>{open ? <X size={22} /> : <><MessageCircle size={22} /><span>Live Chat</span></>}</button></div>
}

function Articles({ articles, openEditor, canManage }: { articles: ArticleItem[]; openEditor: (id?: string) => void; canManage:boolean }) {
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null)
  const [query,setQuery]=useState('')
  const sourceArticles = canManage ? articles : articles.filter(article => article.status === 'Published')
  const visibleArticles = sourceArticles.filter(article=>`${article.title} ${article.category} ${article.excerpt} ${article.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase()))
  const featured = sourceArticles.find(article => article.status === 'Published')
  if (selectedArticle) return <ArticleReaderPage article={selectedArticle} onBack={() => setSelectedArticle(null)} />
  return <div className="page"><div className="page-heading"><div><div className="eyebrow">CONTENT HUB</div><h1>Berita & Articles</h1><p>{canManage ? 'Kelola article melalui halaman editor tersendiri dengan workflow draft dan publish.' : 'Inspirasi dan panduan terbaru dari ikrarku.'}</p></div>{canManage && <button className="primary-btn" onClick={() => openEditor('new')}><Plus size={17} /> New Article</button>}</div>{featured && <div className="article-feature" onClick={() => setSelectedArticle(featured)}><div><span>EDITOR'S PICK</span><h2>{featured.title}</h2><p>{featured.excerpt}</p><button>Read article <ArrowRight size={16} /></button></div><div className="feature-art" style={{ backgroundImage: featured.coverUrl ? `url(${featured.coverUrl})` : undefined }}><Heart size={72} /></div></div>}<div className="panel article-table"><div className="panel-head"><div><h3>All articles</h3><p>{visibleArticles.length} konten tersedia</p></div><div className="search-field compact"><Search size={16} /><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search title, category, or tag" /></div></div><table><thead><tr><th>Article</th><th>Category</th><th>Published</th><th>Status</th><th>Views</th><th /></tr></thead><tbody>{visibleArticles.map(article => <tr key={article.id}><td><button className="article-title-button" onClick={() => canManage ? openEditor(article.id) : setSelectedArticle(article)}><strong>{article.title}</strong><span>{article.excerpt}</span></button></td><td>{article.category}</td><td>{article.date}</td><td><span className={`status ${article.status.toLowerCase()}`}>{article.status}</span></td><td>{article.views}</td><td><button className="icon-btn small" onClick={() => canManage ? openEditor(article.id) : setSelectedArticle(article)}>{canManage ? <WandSparkles size={15} /> : <ExternalLink size={15} />}</button></td></tr>)}</tbody></table></div></div>
}

function ArticleEditorPage({ article, role, onBack, onSave }: { article?: ArticleItem; role: Role; onBack: () => void; onSave: (payload: Omit<ArticleItem, 'id' | 'date' | 'views'>) => void }) {
  const [title, setTitle] = useState(article?.title || '')
  const [slug, setSlug] = useState(article?.slug || '')
  const [category, setCategory] = useState(article?.category || 'Planning')
  const [status, setStatus] = useState<'Published' | 'Draft'>(article?.status || 'Draft')
  const [excerpt, setExcerpt] = useState(article?.excerpt || '')
  const [tags, setTags] = useState(article?.tags.join(', ') || '')
  const [coverUrl, setCoverUrl] = useState<string | undefined>(article?.coverUrl)
  const editorRef = useRef<HTMLDivElement>(null)
  const coverRef = useRef<HTMLInputElement>(null)
  const imageRef = useRef<HTMLInputElement>(null)
  useEffect(() => { if (editorRef.current) editorRef.current.innerHTML = article?.content || '<h2>Mulai menulis artikel...</h2><p>Gunakan toolbar untuk menambahkan heading, format teks, list, quote, link, dan image.</p>' }, [article])
  const command = (name: string, value?: string) => { editorRef.current?.focus(); document.execCommand(name, false, value) }
  const uploadArticleMedia = async (file:File,category:string) => { const form=new FormData();form.append('file',file);form.append('category',category);const saved=await api.uploadMedia(form);return assetUrl(saved.url) }
  const insertImage = async (file?: File) => { if (!file || !file.type.startsWith('image/') || file.size > 2*1024*1024) return; const url=await uploadArticleMedia(file,'article-inline');command('insertImage',url) }
  const uploadCover = async (file?: File) => { if (!file || !file.type.startsWith('image/') || file.size > 2*1024*1024) return; setCoverUrl(await uploadArticleMedia(file,'article-cover')) }
  const createLink = () => { const url = window.prompt('Masukkan URL tautan'); if (url) command('createLink', url) }
  const save = (forcedStatus: 'Published' | 'Draft') => { const cleanSlug = (slug || title).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); onSave({ title: title.trim(), slug: cleanSlug, category, status: forcedStatus, excerpt: excerpt.trim(), content: editorRef.current?.innerHTML || '<p></p>', author: role === 'Admin' ? 'Platform Admin' : 'ikrarku Editorial', tags: tags.split(',').map(tag => tag.trim()).filter(Boolean), coverUrl }) }
  return <div className="page article-editor-page"><div className="article-editor-page-top"><button className="secondary-btn" onClick={onBack}><ArrowLeft size={16} /> Back to Articles</button><div><span>{article ? 'EDIT ARTICLE' : 'NEW ARTICLE'}</span><strong>{article ? article.title : 'WordPress-style publishing workspace'}</strong></div><div className="heading-actions"><button className="secondary-btn" disabled={!title.trim()} onClick={() => save('Draft')}><Save size={16} /> Save Draft</button><button className="primary-btn" disabled={!title.trim()} onClick={() => save('Published')}><Globe2 size={16} /> Publish</button></div></div><div className="article-editor-layout page-layout"><main><input className="article-title-input" value={title} onChange={event => { setTitle(event.target.value); if (!slug) setSlug(event.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')) }} placeholder="Add article title" /><div className="article-permalink"><span>ikrarku.id/articles/</span><input value={slug} onChange={event => setSlug(event.target.value.replace(/[^a-z0-9-]/g, ''))} /></div><div className="rich-toolbar"><button onClick={() => command('formatBlock', 'h1')}><Heading1 size={16} /></button><button onClick={() => command('formatBlock', 'h2')}><Heading2 size={16} /></button><button onClick={() => command('bold')}><Bold size={16} /></button><button onClick={() => command('italic')}><Italic size={16} /></button><button onClick={() => command('underline')}><Underline size={16} /></button><button onClick={() => command('insertUnorderedList')}><List size={16} /></button><button onClick={() => command('formatBlock', 'blockquote')}><Quote size={16} /></button><button onClick={createLink}><Link2 size={16} /></button><button onClick={() => imageRef.current?.click()}><ImageIcon size={16} /></button><button onClick={() => command('justifyLeft')}><AlignLeft size={16} /></button><button onClick={() => command('justifyCenter')}><AlignCenter size={16} /></button><button onClick={() => command('justifyRight')}><AlignRight size={16} /></button></div><input ref={imageRef} hidden type="file" accept="image/*" onChange={event => void insertImage(event.target.files?.[0])} /><div ref={editorRef} className="article-rich-editor" contentEditable suppressContentEditableWarning /><label>Excerpt<textarea value={excerpt} onChange={event => setExcerpt(event.target.value)} placeholder="Ringkasan untuk landing page dan daftar article." /></label></main><aside><section><h3>Publishing</h3><label>Status<select value={status} onChange={event => setStatus(event.target.value as 'Published' | 'Draft')}><option>Draft</option><option>Published</option></select></label><button className="primary-btn full" disabled={!title.trim()} onClick={() => save(status)}>{status === 'Published' ? 'Publish Article' : 'Save Article'}</button></section><section><h3>Category & Tags</h3><label>Category<select value={category} onChange={event => setCategory(event.target.value)}><option>Planning</option><option>Inspiration</option><option>Product Guide</option><option>Venue</option><option>Budgeting</option><option>Wedding Trends</option></select></label><label>Tags<input value={tags} onChange={event => setTags(event.target.value)} placeholder="planning, venue, tips" /></label></section><section><h3>Featured Image</h3><input ref={coverRef} hidden type="file" accept="image/*" onChange={event => void uploadCover(event.target.files?.[0])} /><button className="upload-control" onClick={() => coverRef.current?.click()}><Upload size={17} /><span><strong>Upload cover</strong><small>Max 1 MB</small></span></button>{coverUrl && <div className="article-cover-preview" style={{ backgroundImage: `url(${coverUrl})` }}><button onClick={() => setCoverUrl(undefined)}><Trash2 size={13} /></button></div>}</section></aside></div></div>
}

function SettingsPage({ slug, setSlug, flash, notificationMuted, onNotificationMuted }: { slug: string; setSlug: (slug: string) => void; flash: (message: string) => void; notificationMuted:boolean; onNotificationMuted:(muted:boolean)=>Promise<void> }) {
  const [tab,setTab]=useState<'general'|'notifications'|'domain'|'privacy'>('general')
  const tabs:[typeof tab,string][]=[['general','General'],['notifications','Notifications'],['domain','Domain'],['privacy','Privacy']]
  return <div className="page narrow-page"><div className="page-heading"><div><div className="eyebrow">PREFERENCES</div><h1>Website & Notification Settings</h1><p>Kelola pengalaman workspace, domain publik, notifikasi, dan visibilitas website.</p></div></div><div className="settings-layout"><div className="settings-nav">{tabs.map(([key,label])=><button key={key} className={tab===key?'active':''} onClick={()=>setTab(key)}>{label}</button>)}</div><div className="settings-card">{tab==='general'&&<><h3>Workspace preferences</h3><p>Gunakan menu ini untuk mengelola preferensi umum. Perubahan konten website tetap disimpan melalui Canvas Editor.</p><div className="setting-row"><div><WandSparkles size={18}/><span><strong>Visual website editor</strong><small>Edit konten, layout, dan styling dari Canvas Editor.</small></span></div><button className="secondary-btn" onClick={()=>flash('Buka Canvas Editor dari menu Templates & Canvas.')}>How it works</button></div></>}{tab==='notifications'&&<><h3>Notification sound</h3><p>Suara diputar saat task atau chat baru masuk. Visual notification tetap muncul saat suara dimute.</p><div className="setting-row"><div>{notificationMuted?<VolumeX size={18}/>:<Volume2 size={18}/>}<span><strong>{notificationMuted?'Notification sound muted':'Notification sound active'}</strong><small>Preferensi disimpan ke akun Anda.</small></span></div><button className={`toggle ${notificationMuted?'':'on'}`} onClick={()=>void onNotificationMuted(!notificationMuted)}><i /></button></div><button className="secondary-btn" onClick={()=>playNotificationTone()}><Play size={14}/> Test sound</button></>}{tab==='domain'&&<><h3>Public website URL</h3><p>Pilih URL yang mudah dibaca. Sistem akan memvalidasi duplikasi saat Save & Publish.</p><div className="slug-field large"><span>{window.location.origin}/</span><input value={slug} onChange={event=>setSlug(event.target.value.toLowerCase().replace(/[^a-z0-9-]/g,''))} /><button onClick={() => void navigator.clipboard?.writeText(`${window.location.origin}/${slug}`)}><Copy size={16} /></button></div><div className="availability"><Check size={15} /> Availability diperiksa saat publish</div></>}{tab==='privacy'&&<><h3>Website visibility</h3><p>Website dengan status Published dapat dibuka oleh siapa pun yang mengetahui URL. Draft dan template editor tidak dipublikasikan sebagai URL customer.</p><div className="setting-row"><div><ShieldCheck size={18}/><span><strong>Public after publish</strong><small>Pastikan data tamu dan konten yang ditampilkan memang dimaksudkan untuk publik.</small></span></div><span className="published-badge"><i/>Controlled by publish status</span></div></>}</div></div></div>
}

function AdminDashboard({setView,templates,articles,accounts,tasks,metrics,roles,createAccount,orderAnalytics}:{setView:(view:View)=>void;templates:Template[];articles:ArticleItem[];accounts:AuthAccount[];tasks:TaskItem[];metrics:{incoming:number;replies:number;active:number;resolved:number};roles:RoleItem[];createAccount:(name:string,username:string,password:string,role:Role,email:string)=>Promise<boolean>;orderAnalytics:OrderAnalytics}){const[showCreate,setShowCreate]=useState(false);const pendingTemplates=templates.filter(item=>item.status==='Pending');const openTasks=tasks.filter(item=>!['Done','Cancelled'].includes(item.status));return <div className="page"><div className="page-heading"><div><div className="eyebrow">ADMINISTRATOR CONSOLE</div><h1>Platform operations overview</h1><p>Pantau approval, revenue, content, support, dan operasional platform dari satu tempat.</p></div><div className="heading-actions"><button className="secondary-btn" onClick={()=>setView('tasks')}><ClipboardList size={16}/>Tasks</button><button className="secondary-btn" onClick={()=>setView('roles')}><KeyRound size={16}/>Roles</button><button className="primary-btn" onClick={()=>setShowCreate(true)}><UserPlus size={16}/>Add Account</button></div></div><div className="stats-grid"><Stat icon={Users} label="Accounts" value={String(accounts.length)} note={`${roles.length} roles configured`}/><Stat icon={Palette} label="Templates" value={String(templates.length)} note={`${pendingTemplates.length} pending approval`}/><Stat icon={BookOpen} label="Articles" value={String(articles.length)} note={`${articles.filter(item=>item.status==='Published').length} published`}/><Stat icon={ReceiptText} label="Paid Revenue" value={formatRupiah(orderAnalytics.summary.nominal||0)} note={`${orderAnalytics.summary.qty||0} checkout records`}/></div><div className="admin-action-grid"><article onClick={()=>setView('tasks')}><Palette size={22}/><div><strong>Template approval</strong><span>{pendingTemplates.length} submission waiting</span></div><ArrowRight size={17}/></article><article onClick={()=>setView('payment-settings')}><CreditCard size={22}/><div><strong>Payment methods</strong><span>Configure QRIS, GoPay, Card</span></div><ArrowRight size={17}/></article><article onClick={()=>setView('articles')}><FileText size={22}/><div><strong>Article CMS</strong><span>Published content updates landing page</span></div><ArrowRight size={17}/></article><article onClick={()=>setView('orders')}><ReceiptText size={22}/><div><strong>Orders & Revenue</strong><span>{orderAnalytics.summary.qty||0} order · {formatRupiah(orderAnalytics.summary.nominal||0)}</span></div><ArrowRight size={17}/></article><article onClick={()=>setView('cs-dashboard')}><MessageSquareText size={22}/><div><strong>Customer Service</strong><span>{metrics.incoming} inbound · {metrics.replies} replies</span></div><ArrowRight size={17}/></article><article onClick={()=>setView('audit-log')}><ShieldCheck size={22}/><div><strong>Audit Trail</strong><span>Role, account, approval, and settings history</span></div><ArrowRight size={17}/></article></div><div className="dashboard-grid admin"><section className="panel"><div className="panel-head"><div><h3>Latest database tasks</h3><p>Generated by paid orders</p></div><button className="text-btn" onClick={()=>setView('tasks')}>View all</button></div>{tasks.slice(0,6).map(task=><div className="approval-row" key={task.id}><div className="client-avatar"><ClipboardList size={15}/></div><div><strong>{task.title}</strong><span>{task.order_no||'Internal'} · {task.status}</span></div><button onClick={()=>setView('tasks')}>Open</button></div>)}{!tasks.length&&<div className="panel-empty">Belum ada task.</div>}</section><section className="panel"><div className="panel-head"><div><h3>Pending template approvals</h3><p>Submitted by Web Designer</p></div></div>{pendingTemplates.slice(0,5).map(template=><div className="approval-row" key={template.id}><div className="client-avatar"><Palette size={15}/></div><div><strong>{template.name}</strong><span>{formatRupiah(template.price||0)} · {template.category}</span></div><button onClick={()=>setView('tasks')}>Review</button></div>)}{!pendingTemplates.length&&<div className="panel-empty">Tidak ada template pending.</div>}</section></div>{showCreate&&<AccountCreateModal roles={roles} onClose={()=>setShowCreate(false)} onCreate={async payload=>{if(await createAccount(payload.name,payload.username,payload.password,payload.role,payload.email))setShowCreate(false)}} existingUsernames={accounts.map(item=>item.username)}/>}</div>}

function OrdersAnalyticsPage({data,onRefresh}:{data:OrderAnalytics;onRefresh:()=>Promise<void>}){
  return <div className="page orders-page"><div className="page-heading"><div><div className="eyebrow">COMMERCE ANALYTICS</div><h1>Template Checkout & Revenue</h1><p>Qty, nominal, customer, payment, serta assignment berasal langsung dari tabel orders.</p></div><div className="heading-actions"><button className="secondary-btn" onClick={()=>void onRefresh()}><Repeat2 size={16}/>Refresh</button><button className="secondary-btn" onClick={()=>void api.exportOrdersCsv()}><Download size={16}/>CSV</button><button className="primary-btn" onClick={()=>void api.exportOrdersExcel()}><FileText size={16}/>Excel</button></div></div><div className="stats-grid"><Stat icon={ShoppingCart} label="Checkout Qty" value={String(data.summary.qty||0)} note="Seluruh order yang tercatat"/><Stat icon={ReceiptText} label="Paid Nominal" value={formatRupiah(data.summary.nominal||0)} note="Akumulasi payment Paid"/><Stat icon={Users} label="Unique Customers" value={String(data.summary.customers||0)} note="Berdasarkan email customer"/><Stat icon={CheckCircle2} label="Paid Orders" value={String(data.rows.filter(row=>row.payment_status==='Paid').length)} note="Siap onboarding"/></div><div className="panel orders-table"><div className="panel-head"><div><h3>Order database</h3><p>{data.rows.length} row tersedia untuk download.</p></div></div>{data.rows.length?<div className="table-scroll"><table><thead><tr><th>Order</th><th>Customer</th><th>Template</th><th>Nominal</th><th>Payment</th><th>Assignment</th><th>Date</th></tr></thead><tbody>{data.rows.map((row,index)=><tr key={`${row.order_no}-${index}`}><td><strong>{row.order_no}</strong><span>{row.order_status}</span></td><td><strong>{row.customer_name}</strong><span>{row.email}<br/>{row.phone}</span></td><td>{row.template_name}</td><td>{formatRupiah(Number(row.amount)||0)}</td><td><span className={`status ${String(row.payment_status).toLowerCase()}`}>{row.payment_status}</span><small>{row.payment_method||'—'}</small></td><td><strong>CS: {row.cs_name||'—'}</strong><span>Editor: {row.editor_name||'—'}</span></td><td>{new Date(row.created_at).toLocaleString('id-ID')}</td></tr>)}</tbody></table></div>:<div className="empty-state"><ReceiptText size={34}/><h2>Belum ada checkout</h2><p>Data akan muncul setelah customer membuat order.</p></div>}</div></div>
}

function CustomerServiceDashboard({ metrics, conversations, setView }: { metrics:{incoming:number;replies:number;active:number;resolved:number}; conversations:any[]; setView:(view:View)=>void }) {
  const latest=conversations.slice(0,6)
  return <div className="page"><div className="page-heading"><div><div className="eyebrow">CUSTOMER SERVICE DATABASE</div><h1>Support operations dashboard</h1><p>Metrik dihitung langsung dari tabel conversations dan messages.</p></div><div className="heading-actions"><button className="primary-btn" onClick={()=>setView('customer-service')}><MessageSquareText size={16}/>Open inbox</button><button className="secondary-btn" onClick={()=>setView('tasks')}><ClipboardList size={16}/>Open tasks</button></div></div><div className="cs-metric-grid"><button onClick={()=>setView('customer-service')}><MessageCircle size={20}/><span>Incoming chats</span><strong>{metrics.incoming}</strong><small>Pesan customer masuk</small></button><button onClick={()=>setView('customer-service')}><Send size={20}/><span>Replies sent</span><strong>{metrics.replies}</strong><small>Balasan tersimpan di database</small></button><button onClick={()=>setView('customer-service')}><Users size={20}/><span>Active conversations</span><strong>{metrics.active}</strong><small>Open atau Pending</small></button><button onClick={()=>setView('customer-service')}><CheckCircle2 size={20}/><span>Resolved</span><strong>{metrics.resolved}</strong><small>Percakapan selesai</small></button></div><div className="panel"><div className="panel-head"><div><h3>Recent inbound orders</h3><p>Percakapan dibuat otomatis setelah pembayaran diterima.</p></div></div>{latest.length?<div className="support-activity-list">{latest.map(conv=><article key={conv.id}><div className="activity-icon user"><ShoppingCart size={14}/></div><div><strong>{conv.customer_name}</strong><span>{conv.customer_email} · {conv.channel} · {conv.status}</span></div><small>{new Date(conv.updated_at).toLocaleString('id-ID')}</small></article>)}</div>:<div className="panel-empty"><MessageCircle size={24}/><strong>Belum ada inbound conversation</strong><span>Conversation akan dibuat saat order dibayar.</span></div>}</div></div>
}


function CustomerServiceDatabase({conversations,users,onRefresh,onReply,onOutbound,onStatus,onRead}:{conversations:any[];users:any[];onRefresh:()=>Promise<void>;onReply:(id:string,text:string)=>Promise<void>;onOutbound:(userId:string,text:string)=>Promise<void>;onStatus:(id:string,status:string)=>Promise<void>;onRead:(id:string)=>Promise<void>}) {
  const [selectedId,setSelectedId]=useState(conversations[0]?.id||'')
  const [reply,setReply]=useState('')
  const [query,setQuery]=useState('')
  const [filter,setFilter]=useState<'All'|'Needs Reply'|'Unread'|'Open'|'Pending'|'Resolved'>('All')
  const [newMessageOpen,setNewMessageOpen]=useState(false)
  const [targetUserId,setTargetUserId]=useState(users[0]?.id||'')
  const [outboundText,setOutboundText]=useState('')
  const filtered=conversations.filter(conv=>{
    const text=`${conv.customer_name||''} ${conv.customer_email||''} ${conv.customer_phone||''} ${conv.order?.order_no||''} ${conv.order?.template_name||''}`.toLowerCase()
    const queryOk=text.includes(query.trim().toLowerCase())
    const filterOk=filter==='All'?true:filter==='Needs Reply'?Boolean(conv.needsReply):filter==='Unread'?Number(conv.unreadCount)>0:conv.status===filter
    return queryOk&&filterOk
  })
  const selected=conversations.find(item=>item.id===selectedId)||filtered[0]||conversations[0]
  useEffect(()=>{if(!selectedId&&conversations[0])setSelectedId(conversations[0].id)},[conversations,selectedId])
  useEffect(()=>{if(!targetUserId&&users[0])setTargetUserId(users[0].id)},[users,targetUserId])
  useEffect(()=>{if(selected?.id&&Number(selected.unreadCount)>0)void onRead(selected.id)},[selected?.id])
  const slaText=(conv:any)=>{if(!conv.needsReply||!conv.slaDueAt)return '';const ms=new Date(conv.slaDueAt).getTime()-Date.now();if(ms<=0)return `SLA overdue ${Math.abs(Math.ceil(ms/60000))}m`;return `Reply due ${Math.ceil(ms/60000)}m`}
  return <div className="page cs-page"><div className="page-heading"><div><div className="eyebrow">SUPPORT INBOX</div><h1>Customer Service</h1><p>Inbound dari website, Customer workspace, dan order onboarding berada pada satu queue dengan status, unread state, dan konteks order.</p></div><div className="heading-actions"><button className="primary-btn" onClick={()=>setNewMessageOpen(true)}><Send size={16}/>New Message</button><button className="secondary-btn" onClick={()=>void onRefresh()}><Repeat2 size={16}/>Refresh</button></div></div><div className="cs-filter-bar">{(['All','Needs Reply','Unread','Open','Pending','Resolved'] as const).map(item=><button key={item} className={filter===item?'active':''} onClick={()=>setFilter(item)}>{item}{item==='Needs Reply'&&<span>{conversations.filter(c=>c.needsReply).length}</span>}{item==='Unread'&&<span>{conversations.filter(c=>Number(c.unreadCount)>0).length}</span>}</button>)}</div><div className="cs-layout"><aside className="conversation-list"><div className="conversation-search"><Search size={16}/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Cari customer, email, phone, order..."/></div>{filtered.map(conv=><button key={conv.id} className={`conversation ${selected?.id===conv.id?'active':''} ${Number(conv.unreadCount)>0?'unread':''}`} onClick={()=>setSelectedId(conv.id)}><div className="avatar">{String(conv.customer_name||'CU').slice(0,2).toUpperCase()}</div><div><strong>{conv.customer_name}{Number(conv.unreadCount)>0&&<i className="unread-dot"/>}</strong><span>{conv.order?.order_no||conv.customer_email||conv.channel}</span>{conv.needsReply&&<em className={`sla-chip ${new Date(conv.slaDueAt).getTime()<Date.now()?'overdue':''}`}>{slaText(conv)}</em>}</div><small>{conv.status}</small></button>)}{!filtered.length&&<div className="panel-empty"><Search size={20}/><strong>Tidak ada conversation</strong><span>Ubah filter atau kata pencarian.</span></div>}</aside><section className="cs-chat">{selected?<><header><div><strong>{selected.customer_name}</strong><span>{selected.customer_email} · {selected.customer_phone||'No phone'} · {selected.channel}</span></div><select className={`conversation-status-select status-${String(selected.status).toLowerCase()}`} value={selected.status} onChange={event=>void onStatus(selected.id,event.target.value)}><option>Open</option><option>Pending</option><option>Resolved</option></select></header>{selected.needsReply&&<div className={`conversation-sla-banner ${new Date(selected.slaDueAt).getTime()<Date.now()?'overdue':''}`}><TimerReset size={15}/><span>{slaText(selected)} · default staging target 15 menit</span></div>}<div className="cs-messages">{(selected.messages||[]).map((message:any)=><div key={message.id} className={`cs-message ${message.sender_type==='support'?'support':message.sender_type==='system'?'system':'user'}`}><p>{message.body}</p><span>{new Date(message.created_at).toLocaleString('id-ID')}</span></div>)}</div><form onSubmit={async event=>{event.preventDefault();if(!reply.trim())return;const value=reply;setReply('');try{await onReply(selected.id,value)}catch{setReply(value)}}}><textarea value={reply} onChange={event=>setReply(event.target.value)} placeholder="Balas customer..."/><div><span>Balasan tersimpan pada conversation dan notifikasi email dikirim sesuai konfigurasi.</span><button className="primary-btn" type="submit"><Send size={15}/>Send reply</button></div></form></>:<div className="empty-state"><MessageSquareText size={34}/><h2>Pilih conversation</h2></div>}</section><aside className="customer-profile">{selected&&<><div className="large-avatar">{String(selected.customer_name).slice(0,2).toUpperCase()}</div><h3>{selected.customer_name}</h3><p>{selected.customer_email}</p><hr/><label>Phone<strong>{selected.customer_phone||'—'}</strong></label><label>Channel<strong>{selected.channel}</strong></label><label>Conversation<strong>{selected.status}</strong></label>{selected.order&&<><hr/><h4>Order context</h4><label>Order<strong>{selected.order.order_no}</strong></label><label>Template<strong>{selected.order.template_name||'—'}</strong></label><label>Payment<strong>{selected.order.payment_status} · {formatRupiah(selected.order.amount||0)}</strong></label><label>Web Designer<strong>{selected.order.editor_name||'Unassigned'}</strong></label><label>Assigned CS<strong>{selected.order.cs_name||'Unassigned'}</strong></label>{selected.tasks?.length>0&&<div className="profile-task-list">{selected.tasks.map((task:any)=><span key={task.id}><ClipboardList size={12}/>{task.title}<b>{task.status}</b></span>)}</div>}</>}<hr/><label>Created<strong>{new Date(selected.created_at).toLocaleString('id-ID')}</strong></label></>}</aside></div>{newMessageOpen&&<div className="dialog-overlay"><div className="template-create-dialog"><header><div><span>OUTBOUND MESSAGE</span><h2>Kirim pesan kepada Customer</h2></div><button onClick={()=>setNewMessageOpen(false)}><X size={18}/></button></header><label>Customer<select value={targetUserId} onChange={event=>setTargetUserId(event.target.value)}>{users.map(user=><option key={user.id} value={user.id}>{user.name} · {user.email}</option>)}</select></label><label>Message<textarea value={outboundText} onChange={event=>setOutboundText(event.target.value)} placeholder="Tulis informasi project, reminder, atau onboarding..."/></label><footer><button className="secondary-btn" onClick={()=>setNewMessageOpen(false)}>Cancel</button><button className="primary-btn" disabled={!targetUserId||!outboundText.trim()} onClick={async()=>{await onOutbound(targetUserId,outboundText.trim());setOutboundText('');setNewMessageOpen(false)}}><Send size={15}/>Send Message</button></footer></div></div>}</div>
}

function MyOrdersPage({orders,setView}:{orders:any[];setView:(view:View)=>void}){
  if(!orders.length)return <div className="page"><div className="page-heading"><div><div className="eyebrow">MY PROJECT</div><h1>Orders & project journey</h1><p>Riwayat pembelian, receipt, assignment, dan progress onboarding Anda akan tampil di sini.</p></div></div><div className="empty-state"><PackageCheck size={34}/><h2>Belum ada order</h2><p>Pesan template dari landing page untuk memulai project wedding website.</p><button className="primary-btn" onClick={()=>setView('landing')}>Explore templates</button></div></div>
  return <div className="page my-orders-page"><div className="page-heading"><div><div className="eyebrow">MY PROJECT</div><h1>Orders & project journey</h1><p>Pantau pembayaran, tim yang ditugaskan, task onboarding, dan receipt dalam satu halaman.</p></div></div><div className="project-order-grid">{orders.map(order=><article key={order.id} className="project-order-card"><header><div><span>{order.order_no}</span><h2>{order.template_name}</h2></div><span className={`status ${String(order.payment_status).toLowerCase()}`}>{order.payment_status}</span></header><div className="project-order-summary"><div><small>Total</small><strong>{formatRupiah(order.amount)}</strong></div><div><small>Project status</small><strong>{order.order_status}</strong></div><div><small>Customer Service</small><strong>{order.cs_name||'Assignment in progress'}</strong></div><div><small>Web Designer</small><strong>{order.editor_name||'Assignment in progress'}</strong></div></div><div className="project-timeline">{(order.tasks||[]).map((task:any,index:number)=><div key={task.id} className={['Done','Approved'].includes(task.status)?'done':''}><i>{['Done','Approved'].includes(task.status)?<Check size={12}/>:index+1}</i><span><strong>{task.title}</strong><small>{task.status} · {task.priority}</small></span></div>)}</div><footer>{order.receiptUrl&&<a href={assetUrl(order.receiptUrl)} target="_blank" rel="noreferrer"><ReceiptText size={15}/>Download receipt</a>}{order.conversation&&<button onClick={()=>setView('help')}><MessageCircle size={15}/>Contact support</button>}</footer></article>)}</div></div>
}

function AuditLogPage({logs,onRefresh}:{logs:any[];onRefresh:()=>Promise<void>}){
  const [query,setQuery]=useState('');const filtered=logs.filter(log=>`${log.action} ${log.entity_type} ${log.actor_name||''} ${JSON.stringify(log.details||{})}`.toLowerCase().includes(query.toLowerCase()))
  return <div className="page"><div className="page-heading"><div><div className="eyebrow">GOVERNANCE</div><h1>Audit Trail</h1><p>Riwayat perubahan akses dan tindakan operasional berisiko tinggi.</p></div><button className="secondary-btn" onClick={()=>void onRefresh()}><Repeat2 size={16}/>Refresh</button></div><div className="panel audit-panel"><div className="panel-head"><div><h3>Recent platform events</h3><p>{filtered.length} event</p></div><div className="search-field compact"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search action, actor, entity"/></div></div><table><thead><tr><th>Time</th><th>Actor</th><th>Action</th><th>Entity</th><th>Details</th></tr></thead><tbody>{filtered.map(log=><tr key={log.id}><td>{new Date(log.created_at).toLocaleString('id-ID')}</td><td>{log.actor_name||'System'}<small>{log.actor_email||''}</small></td><td><strong>{log.action}</strong></td><td>{log.entity_type} · {log.entity_id||'—'}</td><td><code>{JSON.stringify(log.details||{})}</code></td></tr>)}</tbody></table></div></div>
}

function SoundLibrary({ catalog, addSound, deleteSound }: { catalog: SoundCatalogItem[]; addSound: (name: string, category: string, description: string, file: File) => Promise<boolean>; deleteSound: (id: string) => void }) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Romantic')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [adding, setAdding] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const submit = async () => {
    if (!name.trim() || !file) return
    setAdding(true)
    const success = await addSound(name.trim(), category, description.trim() || 'Custom sound uploaded by Administrator.', file)
    setAdding(false)
    if (success) { setName(''); setDescription(''); setFile(null); if (fileRef.current) fileRef.current.value = '' }
  }
  return <div className="page sound-library-page"><div className="page-heading"><div><div className="eyebrow">MEDIA LIBRARY</div><h1>Sound Catalog</h1><p>Administrator dapat menambahkan backsound global yang tersedia di Feature Sound milik Customer dan Web Designer.</p></div><span className="online-badge"><Music2 size={14} /> {catalog.length} sound tersedia</span></div><div className="sound-library-layout"><section className="panel sound-upload-panel"><div className="panel-head"><div><h3>Add catalog sound</h3><p>Audio, MP3, M4A, WAV, OGG, AAC, atau MP4 maksimal 15 MB.</p></div></div><label>Sound name<input value={name} onChange={event => setName(event.target.value)} placeholder="Contoh: Nusantara Acoustic" /></label><label>Category<select value={category} onChange={event => setCategory(event.target.value)}><option>Romantic</option><option>Elegant</option><option>Cinematic</option><option>Fairytale</option><option>Traditional</option><option>Modern</option></select></label><label>Description<textarea value={description} onChange={event => setDescription(event.target.value)} placeholder="Deskripsi singkat suasana sound." /></label><input ref={fileRef} type="file" accept="audio/*,video/mp4,.mp3,.m4a,.wav,.ogg,.aac,.mp4" onChange={event => setFile(event.target.files?.[0] || null)} /><button className="primary-btn full" disabled={!name.trim() || !file || adding} onClick={() => void submit()}><Upload size={16} /> {adding ? 'Uploading...' : 'Add to Sound Catalog'}</button></section><section className="sound-catalog-grid">{catalog.map(item => <article className="sound-catalog-card" key={item.id}><div className="sound-cover"><Disc3 size={32} /><span>{item.category}</span></div><div><div className="sound-card-heading"><h3>{item.name}</h3>{item.builtIn && <span>Built-in</span>}</div><p>{item.description}</p><small>{item.fileName || item.preset} · {item.createdAt}</small><div className="sound-card-actions"><CatalogSoundPreview item={item} />{!item.builtIn && <button className="danger" onClick={() => deleteSound(item.id)}><Trash2 size={14} /> Delete</button>}</div></div></article>)}</section></div></div>
}

function CatalogSoundPreview({ item }: { item: SoundCatalogItem }) {
  const [playing, setPlaying] = useState(false)
  const playerRef = useRef<{ stop: () => void } | null>(null)
  const toggle = () => {
    if (playing) { playerRef.current?.stop(); playerRef.current = null; setPlaying(false); return }
    playerRef.current = createSoundPlayback({ ...makeFeature('sound'), soundPreset: item.preset, mediaUrl: item.mediaUrl, body: item.name }, true)
    setPlaying(true)
  }
  useEffect(() => () => playerRef.current?.stop(), [])
  return <button onClick={toggle}>{playing ? <Pause size={14} /> : <Play size={14} />} {playing ? 'Stop' : 'Preview'}</button>
}

function AccountCreateModal({ onClose, onCreate, existingUsernames, roles = [] }: { onClose: () => void; onCreate: (payload: { name: string; username: string; password: string; role: Role; email: string }) => void | Promise<void>; existingUsernames: string[]; roles?:RoleItem[] }) {
  const [name,setName]=useState('');const[email,setEmail]=useState('');const[username,setUsername]=useState('');const[password,setPassword]=useState('');const[showPassword,setShowPassword]=useState(false);const[role,setRole]=useState<string>(roles.find(item=>item.name==='User')?.name||'User');const taken=existingUsernames.map(item=>item.toLowerCase()).includes(username.toLowerCase());const availableRoles=roles.length?roles.map(item=>item.name):['User','Editor','Admin','Customer Service']
  return <div className="dialog-overlay"><div className="template-create-dialog"><header><div><span>ACCOUNT MANAGEMENT</span><h2>Create login account</h2></div><button onClick={onClose}><X size={18}/></button></header><label>Name<input value={name} onChange={e=>setName(e.target.value)}/></label><label>Email<input value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Username<input value={username} onChange={e=>setUsername(e.target.value)}/></label><label>Password<div className="password-field"><input type={showPassword?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)}/><button type="button" onClick={()=>setShowPassword(value=>!value)}>{showPassword?<EyeOff size={16}/>:<Eye size={16}/>}</button></div></label><label>Role<select value={role} onChange={e=>setRole(e.target.value)}>{availableRoles.map(item=><option key={item} value={item}>{displayRole(item)}</option>)}</select></label>{taken&&<p className="muted" style={{color:'#a75d56'}}>Username sudah dipakai.</p>}<footer><button className="secondary-btn" onClick={onClose}>Cancel</button><button className="primary-btn" disabled={!name.trim()||!email.trim()||!username.trim()||password.length<8||taken} onClick={()=>void onCreate({name:name.trim(),username:username.trim(),password,role:role as Role,email:email.trim()||`${username.trim()}@ikrarku.id`})}><UserPlus size={16}/>Create Account</button></footer></div></div>
}

function ArticleReaderPage({ article, onBack, publicMode = false }: { article: ArticleItem; onBack: () => void; publicMode?: boolean }) {
  return <div className={`article-reader-page wide ${publicMode ? 'public' : ''}`}><header><button onClick={onBack}><ArrowLeft size={16} /> Back</button>{publicMode ? <Brand /> : <span>IKRARKU ARTICLE</span>}<div>{article.category}</div></header><main><section className="reader-hero-wide" style={{backgroundImage:article.coverUrl?`linear-gradient(90deg,rgba(4,22,17,.90),rgba(4,22,17,.28)),url(${article.coverUrl})`:undefined}}><div><span>{article.category}</span><h1>{article.title}</h1><p>{article.excerpt}</p><small>{article.date} · {article.author}</small></div></section><div className="reader-body-wide"><article><div className="reader-page-content" dangerouslySetInnerHTML={{ __html: article.content }} /><footer>{article.tags.map(tag => <span key={tag}>#{tag}</span>)}</footer></article><aside><Brand/><strong>Continue your wedding journey.</strong><p>Explore template, planning guide, dan wedding website yang dikelola dalam satu platform.</p></aside></div></main></div>
}

function AccountSettingsModal({ account, onClose, onSave }: { account: AuthAccount; onClose: () => void; onSave: (patch: Partial<AuthAccount>) => void }) {
  const [firstName, setFirstName] = useState(account.firstName || account.name.split(' ')[0] || '')
  const [lastName, setLastName] = useState(account.lastName || account.name.split(' ').slice(1).join(' '))
  const [email, setEmail] = useState(account.email)
  const [password, setPassword] = useState('')
  const [currentPassword,setCurrentPassword]=useState('')
  const [showPassword,setShowPassword]=useState(false);const[showCurrent,setShowCurrent]=useState(false)
  const sensitive=email.trim().toLowerCase()!==account.email.toLowerCase()||Boolean(password)
  return <div className="dialog-overlay"><div className="template-create-dialog account-settings-dialog"><header><div><span>ACCOUNT SETTINGS</span><h2>Profile & Security</h2></div><button onClick={onClose}><X size={18} /></button></header><div className="two-inputs"><label>First Name<input value={firstName} onChange={event => setFirstName(event.target.value)} /></label><label>Last Name<input value={lastName} onChange={event => setLastName(event.target.value)} /></label></div><label>Email<input type="email" value={email} onChange={event => setEmail(event.target.value)} /></label><label>New Password<div className="password-field"><input type={showPassword?'text':'password'} value={password} onChange={event => setPassword(event.target.value)} placeholder="Kosongkan jika tidak diubah"/><button type="button" aria-label={showPassword?'Hide new password':'Show new password'} onClick={()=>setShowPassword(value=>!value)}>{showPassword?<EyeOff size={16}/>:<Eye size={16}/>}</button></div></label>{sensitive&&<label>Current Password<div className="password-field"><input type={showCurrent?'text':'password'} value={currentPassword} onChange={event=>setCurrentPassword(event.target.value)} placeholder="Diperlukan untuk perubahan sensitif"/><button type="button" aria-label={showCurrent?'Hide current password':'Show current password'} onClick={()=>setShowCurrent(v=>!v)}>{showCurrent?<EyeOff size={16}/>:<Eye size={16}/>}</button></div></label>}<div className="info-box"><ShieldCheck size={17} /><p>Untuk keamanan, perubahan email atau password memerlukan password Anda saat ini.</p></div><footer><button className="secondary-btn" onClick={onClose}>Cancel</button><button className="primary-btn" disabled={sensitive&&!currentPassword} onClick={() => onSave({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim(), password, currentPassword })}><Save size={16} /> Save Settings</button></footer></div></div>
}

function LeaveEditorModal({ onCancel, onSave, onDiscard }: { onCancel: () => void; onSave: () => void; onDiscard: () => void }) {
  return <div className="dialog-overlay"><div className="confirm-dialog"><div className="dialog-icon"><Save size={22} /></div><h2>Simpan perubahan?</h2><p>Anda memiliki perubahan pada canvas. Simpan sebelum kembali ke halaman sebelumnya?</p><div><button className="secondary-btn" onClick={onCancel}>Batal</button><button className="secondary-btn" onClick={onDiscard}>Discard</button><button className="primary-btn" onClick={onSave}><Save size={15} /> Save & Leave</button></div></div></div>
}

function createAudioPreset(feature: Feature, loop = false) {
  const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioContextClass) return { stop: () => undefined }
  const context = new AudioContextClass()
  const presets: Record<string, number[]> = {
    'romantic-piano': [261.63, 329.63, 392, 523.25, 392, 329.63],
    'garden-strings': [220, 293.66, 349.23, 440, 349.23, 293.66],
    'cinematic-bloom': [196, 246.94, 293.66, 392, 293.66, 246.94],
    'storybook-chimes': [329.63, 392, 523.25, 659.25, 523.25, 392]
  }
  const notes = presets[feature.soundPreset || 'romantic-piano'] || presets['romantic-piano']
  let stopped = false
  const playSequence = async () => {
    if (stopped) return
    if (context.state === 'suspended') await context.resume()
    notes.forEach((frequency, index) => {
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.type = feature.soundPreset === 'garden-strings' ? 'triangle' : 'sine'
      oscillator.frequency.setValueAtTime(frequency, context.currentTime + index * .34)
      gain.gain.setValueAtTime(.0001, context.currentTime + index * .34)
      gain.gain.exponentialRampToValueAtTime(.11, context.currentTime + index * .34 + .04)
      gain.gain.exponentialRampToValueAtTime(.0001, context.currentTime + index * .34 + .58)
      oscillator.connect(gain); gain.connect(context.destination)
      oscillator.start(context.currentTime + index * .34); oscillator.stop(context.currentTime + index * .34 + .62)
    })
  }
  void playSequence()
  const timer = loop ? window.setInterval(() => void playSequence(), 3200) : undefined
  return { stop: () => { stopped = true; if (timer) window.clearInterval(timer); void context.close() } }
}

function createSoundPlayback(feature: Feature, loop = true) {
  if (feature.mediaUrl) {
    const audio = new Audio(feature.mediaUrl)
    audio.loop = loop
    audio.volume = .72
    void audio.play().catch(() => undefined)
    return { stop: () => { audio.pause(); audio.currentTime = 0 } }
  }
  return createAudioPreset(feature, loop)
}

function SoundFeature({ feature }: { feature: Feature }) {
  const playerRef = useRef<{ stop: () => void } | null>(null)
  const [playing, setPlaying] = useState(false)
  const toggle = () => {
    if (playing) { playerRef.current?.stop(); playerRef.current = null; setPlaying(false); return }
    playerRef.current = createSoundPlayback(feature, true)
    setPlaying(true)
  }
  useEffect(() => () => playerRef.current?.stop(), [])
  return <div className="sound-feature"><div className="sound-feature-top"><Disc3 size={30} className={playing ? 'spinning' : ''} /><div><strong>{feature.title}</strong><span>{feature.mediaName || feature.body || 'Wedding backsound'}</span></div></div><div className="sound-badges"><span>{feature.mediaUrl ? 'Uploaded file' : feature.soundPreset || 'romantic-piano'}</span>{feature.autoplay && <span>Autoplay enabled</span>}</div><button type="button" onClick={toggle}>{playing ? <VolumeX size={16} /> : <Volume2 size={16} />} {playing ? 'Stop preview' : 'Play sound preview'}</button></div>
}

function FixedSoundPlayer({ feature }: { feature: Feature }) {
  const playerRef = useRef<{ stop: () => void } | null>(null)
  const [playing, setPlaying] = useState(false)
  const toggle = () => {
    if (playing) { playerRef.current?.stop(); playerRef.current = null; setPlaying(false); return }
    playerRef.current = createSoundPlayback(feature, true)
    setPlaying(true)
  }
  useEffect(() => () => playerRef.current?.stop(), [])
  return <button type="button" className={`fixed-sound-disc sound-pos-${feature.objectAlign||'left'} ${playing ? 'playing' : ''}`} onClick={toggle} title={playing ? 'Stop backsound' : `Play ${feature.body}`}><Disc3 size={23} /><span>{playing ? 'Sound on' : feature.title || feature.body}</span></button>
}

function FeatureIcon({ type }: { type: FeatureType }) {
  const map: Record<FeatureType, typeof Type> = { text: Type, form: FormInput, image: ImageIcon, video: Video, gallery: ImageIcon, event: CalendarDays, greetings: MessageCircle, quote: Sparkles, gift: Crown, 'invitation-cover': MailOpen, countdown: TimerReset, location: MapPin, sound: PlayCircle }
  const Icon = map[type]
  return <Icon size={14} />
}

function ConfirmModal({ title, description, confirmLabel, onCancel, onConfirm }: { title: string; description: string; confirmLabel: string; onCancel: () => void; onConfirm: () => void }) {
  return <div className="dialog-overlay"><div className="confirm-dialog"><div className="dialog-icon danger"><Trash2 size={22} /></div><h2>{title}</h2><p>{description}</p><div><button className="secondary-btn" onClick={onCancel}>Batal</button><button className="danger-btn" onClick={onConfirm}><Trash2 size={15} /> {confirmLabel}</button></div></div></div>
}

function TemplateCreatorModal({ onClose, onCreate }: { onClose: () => void; onCreate: (name: string, category: string, accent: string, price:number, description:string) => void }) {
  const [name, setName] = useState('New Signature Theme')
  const [category, setCategory] = useState('Elegant')
  const [accent, setAccent] = useState('#125946')
  const [price,setPrice]=useState(499000)
  const [description,setDescription]=useState('Template wedding website dengan visual storytelling, motion, RSVP, gallery, dan onboarding project.')
  return <div className="dialog-overlay"><div className="template-create-dialog"><header><div><span>WEB DESIGNER TEMPLATE SUBMISSION</span><h2>Create a reusable template</h2></div><button onClick={onClose}><X size={18} /></button></header><p>Web Designer dapat menentukan harga dan deskripsi. Template berstatus Pending sampai disetujui Administrator.</p><label>Template name<input value={name} onChange={event => setName(event.target.value)} /></label><label>Category<select value={category} onChange={event => setCategory(event.target.value)}><option>Elegant</option><option>Editorial</option><option>Cinematic</option><option>Fairytale</option><option>Traditional</option><option>Modern</option></select></label><label>Description<textarea value={description} onChange={event=>setDescription(event.target.value)}/></label><div className="two-cols"><label>Harga (IDR)<input type="number" min="0" step="50000" value={price} onChange={event=>setPrice(Number(event.target.value))}/></label><label>Accent color<input type="color" value={accent} onChange={event => setAccent(event.target.value)} /></label></div><div className="template-create-preview" style={{ '--template-accent': accent } as React.CSSProperties}><small>{category.toUpperCase()}</small><strong>Amara & Arjuna</strong><span>{name}</span><em>{formatRupiah(price)}</em></div><footer><button className="secondary-btn" onClick={onClose}>Cancel</button><button className="primary-btn" disabled={!name.trim()} onClick={() => onCreate(name.trim(), category, accent, price, description)}><Palette size={16} /> Create & Edit Canvas</button></footer></div></div>
}

function LoadingLogo({ compact = false }: { compact?: boolean }) {
  return <div className={`loading-logo ${compact ? 'compact' : ''}`}><div className="loading-rings"><i /><i /><Heart size={compact ? 16 : 24} /></div><strong>ikrarku</strong><span>Sites</span></div>
}

function LoadingScreen() {
  return <div className="app-loading"><LoadingLogo /><p>Menyiapkan cerita terbaik Anda...</p><div className="loading-line"><i /></div></div>
}

function Toast({ message }: { message: string }) {
  return <div className="toast"><Check size={16} /> {message}</div>
}

export default App
