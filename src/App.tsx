import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  lazy,
  Suspense,
  Fragment,
  memo,
} from "react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  ArrowLeft,
  BarChart3,
  Bold,
  BookOpen,
  BadgeCheck,
  Radio,
  Wallet,
  Anchor,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  ChevronRight,
  CircleHelp,
  Clock3,
  Columns2,
  Columns3,
  Columns4,
  Copy,
  Crown,
  Eye,
  EyeOff,
  FileText,
  FormInput,
  Globe2,
  GripVertical,
  Heart,
  Image as ImageIcon,
  Italic,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  MessageSquareText,
  Monitor,
  MoveDown,
  MoveUp,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  Play,
  Plus,
  Repeat2,
  Save,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Lock,
  Star,
  Ban,
  RotateCcw,
  House,
  Gift,
  Camera,
  Clock,
  Move,
  Smartphone,
  Sparkles,
  Trash2,
  Type,
  Underline,
  Upload,
  Users,
  Video,
  WandSparkles,
  X,
  Zap,
  MapPin,
  Navigation,
  Map as MapIcon,
  MailOpen,
  UserPlus,
  Download,
  TimerReset,
  Film,
  Castle,
  ArrowRight,
  CheckCircle2,
  Layers3,
  UserCog,
  LayoutTemplate,
  MousePointer2,
  PlayCircle,
  UserCheck,
  List,
  Link2,
  Quote,
  Heading1,
  Heading2,
  Disc3,
  Volume2,
  VolumeX,
  ExternalLink,
  Music2,
  Pause,
  FileAudio,
  ShoppingCart,
  CreditCard,
  QrCode,
  WalletCards,
  ClipboardList,
  ReceiptText,
  CheckCircle,
  KeyRound,
  Headphones,
  CalendarPlus,
  UserRoundCog,
  PackageCheck,
  History as HistoryIcon,
  PenLine,
} from "lucide-react";
const ActivityChart = lazy(() => import("./components/ActivityChart"));
import "./App.css";
import LandingPageView, { JournalCard } from "./components/LandingPage";
import DesignerControls from "./components/DesignerControls";
import {
  designerStyle,
  type DesignerLayout,
} from "./components/designerLayout";
import "./components/Designer.css";
import { api, assetUrl, setApiToken } from "./api";

type Role = "User" | "Editor" | "Admin" | "Customer Service";
export type View =
  | "landing"
  | "login"
  | "signup"
  | "forgot-password"
  | "reset-password"
  | "verify-email"
  | "not-found"
  | "dashboard"
  | "templates"
  | "template-detail"
  | "checkout"
  | "payment-success"
  | "editor"
  | "articles"
  | "article-editor"
  | "settings"
  | "payment-settings"
  | "orders"
  | "my-orders"
  | "audit-log"
  | "admin"
  | "users"
  | "roles"
  | "tasks"
  | "help"
  | "customer-service"
  | "cs-dashboard"
  | "sound-library"
  | "commissions"
  | "journal"
  | "designs"
  | "invitee-management"
  | "rsvp-confirmation";
type PageKey = "pages" | "invitees" | "rsvp-page";
type InspectorTab = "content" | "style" | "advanced";
type Alignment = "left" | "center" | "right" | "justify";
type FeatureObjectAlign = "left" | "center" | "right" | "stretch";
type CoverIconName =
  | "mail"
  | "heart"
  | "sparkles"
  | "crown"
  | "calendar"
  | "none";
type CoverExitEffect =
  | "fade"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "zoom"
  | "curtain"
  | "split"
  | "dissolve";
type FeatureType =
  | "text"
  | "form"
  | "image"
  | "video"
  | "gallery"
  | "event"
  | "greetings"
  | "quote"
  | "gift"
  | "invitation-cover"
  | "countdown"
  | "location"
  | "sound"
  | "icon"
  | "love-story"
  | "credit"
  | "live-stream";
type ColumnCount = 1 | 2 | 3 | 4;
type BackgroundEffect =
  | "none"
  | "grayscale"
  | "sepia"
  | "darken"
  | "soft-blur"
  | "warm"
  | "cool"
  | "high-contrast";
type BackgroundMotion =
  | "none"
  | "zoom-in"
  | "zoom-out"
  | "pan-left"
  | "pan-right"
  | "ken-burns"
  | "float-soft";
type GalleryStyle = "grid" | "carousel" | "filmstrip";
type CanvasLayoutMode = "standard" | "split-fixed-left" | "split-fixed-right";
type Invitee = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
};
// QA TC-078..TC-088, TC-095: teks bebas tambahan yang dapat dipakai semua feature.
type ExtraText = {
  id: string;
  text: string;
  fontSize: number;
  align: Alignment;
  color: string;
  bold?: boolean;
  italic?: boolean;
  fontFamily?: string;
  spacing?: number;
  // QA TC-171 — teks tambahan tidak lagi selalu menempel di bawah section.
  // `free` membuatnya dapat digeser bebas; posX dalam persen lebar section,
  // posY dalam piksel dari atas section.
  free?: boolean;
  posX?: number;
  posY?: number;
};
type GiftAccount = {
  id: string;
  bank: string;
  accountNumber: string;
  accountName: string;
  note?: string;
  // Logo bank/e-wallet hasil upload (opsional). Tanpa ini nama bank tampil
  // sebagai label teks.
  logoUrl?: string;
  logoKey?: string;
};
type IconItem = {
  id: string;
  name: SocialIconName;
  label: string;
  url: string;
  // TC-238 — teks pendamping, mis. username "@dimasadttyaa". Kosong = label.
  text?: string;
};
type SocialIconName =
  | "instagram"
  | "facebook"
  | "youtube"
  | "threads"
  | "tiktok"
  | "twitter"
  | "whatsapp"
  | "link"
  | "heart"
  | "sparkles"
  | "crown"
  | "flower"
  | "ring"
  | "music"
  | "camera"
  | "star";
// TC-108 / TC-127: layer background tambahan di atas background utama.
type BackgroundLayer = {
  id: string;
  url?: string;
  key?: string;
  opacity: number;
  size: "cover" | "contain" | "auto";
  position: "center" | "top" | "bottom" | "left" | "right";
  repeat: "no-repeat" | "repeat" | "repeat-x" | "repeat-y";
  blend?: string;
  fixed?: boolean;
  offsetX?: number;
  offsetY?: number;
  scale?: number;
};
// TC-120: item cerita pada section Love Story.
type LoveStoryItem = {
  id: string;
  year: string;
  title: string;
  body: string;
  imageUrl?: string;
  imageKey?: string;
};
// TC-129: template layout untuk feature Image.
type ImageLayoutTemplate =
  | "single"
  | "side-left"
  | "side-right"
  | "stacked"
  | "overlap"
  | "banner"
  | "framed-caption";
// Efek yang berjalan terus-menerus (auto repeat) selama undangan dibuka.
type LoopEffect =
  | "none"
  | "fade"
  | "float"
  | "sway"
  | "pulse"
  | "shimmer"
  | "drift";
type DecorGlyph =
  | "leaf"
  | "branch"
  | "floral"
  | "rose"
  | "sparkle"
  | "ring"
  | "heart"
  | "butterfly"
  | "feather"
  | "arch";
type DecorCorner =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  // TC-210 — ornamen di tengah tiap sisi, bukan hanya di pojok.
  | "top-center"
  | "bottom-center"
  | "middle-left"
  | "middle-right";
// Ornamen yang ditempel di pojok section, mis. bunga yang bergoyang pelan.
type SectionDecoration = {
  id: string;
  glyph: DecorGlyph;
  imageUrl?: string; // ornamen dari file gambar milik Web Designer
  imageKey?: string;
  corner: DecorCorner;
  size: number;
  color: string;
  opacity: number;
  flip?: boolean;
  rotation?: number; // TC-186 — sudut putar ornamen (derajat)
  motion: LoopEffect;
  speed?: number;
  // TC-206 — geser halus dari titik tambatnya (px). Positif = kanan / bawah.
  offsetX?: number;
  offsetY?: number;
};
type ImageFrame =
  | "none"
  | "rounded"
  | "circle"
  | "arch"
  | "polaroid"
  | "leaf"
  | "diamond";
type GalleryLayoutTemplate =
  | "even"
  | "masonry"
  | "hero-left"
  | "hero-top"
  | "mosaic";
type SaveTheDateStyle = "classic" | "card" | "ribbon" | "minimal" | "circle";
type FormFieldKind =
  | "text"
  | "email"
  | "phone"
  | "number"
  | "select"
  | "textarea";
type FormFieldSpec = {
  id: string;
  label: string;
  kind: FormFieldKind;
  required?: boolean;
  options?: string[];
  width?: "full" | "half";
};

type Feature = DesignerLayout & {
  id: string;
  type: FeatureType;
  title: string;
  body: string;
  fontFamily: string;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  align: Alignment;
  lineHeight: number;
  textColor?: string; // kosong = ikut warna tema (revisi 21 Okt)
  backgroundColor: string;
  borderRadius: number;
  padding: number;
  margin: number;
  entranceEffect: string;
  transition: string;
  mediaUrl?: string;
  mediaKey?: string;
  mediaName?: string;
  galleryUrls?: string[];
  galleryKeys?: string[];
  galleryStyle?: GalleryStyle;
  galleryAutoplay?: boolean;
  galleryFullWidth?: boolean;
  galleryTransitionMs?: number;
  formFields?: string[];
  buttonLabel?: string;
  eventDate?: string;
  // TC-228 — skala box waktu Save The Date (%), supaya tidak terpotong saat
  // padding diperkecil atau canvas sempit.
  countdownScale?: number;
  // TC-236 — tombol Simpan Tanggal / Save to Calendar (Save The Date & Event).
  calendarButton?: boolean;
  calendarLabel?: string;
  calendarDurationHours?: number;
  mapUrl?: string;
  locationName?: string;
  locationAddress?: string;
  backgroundEffect?: BackgroundEffect;
  backgroundPosition?: "center" | "top" | "bottom" | "left" | "right";
  backgroundRepeat?: "no-repeat" | "repeat" | "repeat-x" | "repeat-y";
  backgroundSize?: "cover" | "contain" | "auto";
  overlayOpacity?: number;
  visualEffect?: string;
  effectIntensity?: number;
  soundPreset?: string;
  soundCatalogId?: string;
  autoplay?: boolean;
  backgroundGradientEnabled?: boolean;
  backgroundGradientFrom?: string;
  backgroundGradientTo?: string;
  backgroundGradientAngle?: number;
  backgroundMotion?: BackgroundMotion;
  eyebrowText?: string;
  guestLabelText?: string;
  guestNameText?: string;
  objectAlign?: FeatureObjectAlign;
  objectWidth?: number;
  locked?: boolean;
  coverIcon?: CoverIconName;
  coverIconSize?: number;
  coverIconPosition?: "top" | "left" | "right";
  coverButtonRadius?: number;
  /** TC-237 — "slide" = geser untuk membuka (fitur template premium/custom). */
  coverButtonMode?: "click" | "slide";
  coverButtonBorderWidth?: number;
  coverButtonBorderColor?: string;
  coverButtonBackground?: string;
  coverButtonTextColor?: string;
  coverButtonPaddingX?: number;
  coverButtonPaddingY?: number;
  coverVerticalAlign?: "top" | "center" | "bottom";
  coverExitEffect?: CoverExitEffect;
  coverExitDuration?: number;
  coverExitEasing?: "ease" | "ease-in" | "ease-out" | "ease-in-out" | "linear";
  // ---- QA remediation batch (Canvas Editor) ----
  extraTexts?: ExtraText[]; // TC-078/079/082/083/084/085/086/087/088/089/095
  showTitle?: boolean; // TC-080 header dapat dihapus
  showBody?: boolean; // TC-080 supporting text dapat dihapus
  bodyFontSize?: number; // TC-090 font size untuk teks non-header
  // TC-193 — eyebrow, label tamu, dan nama tamu pada Buka Undangan dulu
  // ukurannya terkunci di CSS; fontSize/bodyFontSize tidak menjangkaunya.
  eyebrowFontSize?: number;
  guestLabelFontSize?: number;
  guestNameFontSize?: number;
  // TC-198 — penempatan disc backsound di dalam area canvas.
  soundVerticalAlign?: "top" | "center" | "bottom";
  soundOffsetX?: number; // px dari sisi horizontal aktif
  soundOffsetY?: number; // px dari sisi vertikal aktif
  saveTheDateStyle?: SaveTheDateStyle; // TC-078
  locationNoteText?: string; // TC-079
  formSpecs?: FormFieldSpec[]; // TC-081
  formColumns?: 1 | 2; // TC-081
  imageFrame?: ImageFrame; // TC-082
  imageOffsetX?: number; // TC-082
  imageOffsetY?: number; // TC-082
  imageZoom?: number; // TC-082
  imageHeight?: number; // TC-082
  videoAutoplay?: boolean; // TC-083
  videoLoop?: boolean; // TC-083
  videoMuted?: boolean; // TC-083
  galleryLayoutTemplate?: GalleryLayoutTemplate; // TC-084
  greetingsLayout?: "split" | "column"; // TC-085
  // TC-232 — cara menampilkan SEMUA ucapan: daftar bergulir atau per halaman.
  greetingsDisplay?: "scroll" | "paged";
  greetingsPerPage?: number;
  eventMapUrl?: string; // TC-086
  eventButtonLabel?: string; // TC-086
  giftAccounts?: GiftAccount[]; // TC-088
  soundPersist?: boolean; // TC-089
  icons?: IconItem[]; // TC-095
  iconSize?: number; // TC-095
  iconColor?: string; // TC-095
  iconStyle?: "plain" | "circle" | "outline"; // TC-095
  iconTextPosition?: "below" | "right" | "none"; // TC-238
  iconTextSize?: number;
  animateOnScroll?: boolean; // TC-091
  freePosition?: boolean; // TC-103
  posX?: number; // TC-103 (persen dari lebar column)
  posY?: number; // TC-103 (px dari atas column)
  boxWidth?: number; // TC-103 (persen)
  boxHeight?: number; // TC-103 (px, 0 = auto)
  // ---- QA batch TC-107..TC-137 ----
  mobile?: Partial<Feature>; // TC-112 setting mobile terpisah dari desktop
  titleColor?: string; // TC-121/TC-122 warna per elemen teks
  bodyColor?: string;
  title2?: string; // TC-118 Heading 2
  body2?: string; // TC-118 Supporting Text 2
  showTitle2?: boolean;
  showBody2?: boolean;
  title2FontSize?: number;
  body2FontSize?: number;
  title2Color?: string;
  body2Color?: string;
  backgroundImageUrl?: string; // TC-117 background image per feature
  backgroundImageKey?: string;
  backgroundImageSize?: "cover" | "contain" | "auto";
  backgroundImagePosition?: "center" | "top" | "bottom" | "left" | "right";
  backgroundImageOpacity?: number;
  backgroundImageFixed?: boolean; // TC-107 background diam saat scroll
  fieldBackground?: string; // TC-125 custom kolom input
  fieldTextColor?: string;
  fieldBorderColor?: string;
  fieldRadius?: number;
  buttonBackground?: string; // TC-125 custom button submit
  buttonTextColor?: string;
  buttonRadius?: number;
  buttonBorderColor?: string;
  buttonBorderWidth?: number;
  cardBackground?: string; // TC-121/TC-122 warna kolom kartu
  cardTextColor?: string;
  cardBorderColor?: string;
  cardRadius?: number;
  // TC-212 — tampilan logo bank pada Wedding Gift.
  bankLogoSize?: number;
  bankLogoShape?: "pill" | "square" | "plain";
  bankLogoBackground?: string;
  bankLogoTextColor?: string;
  bankLogoAlign?: "flex-start" | "center" | "flex-end";
  bankLogoImageHeight?: number; // tinggi logo gambar (px)
  /** TC-240 — box alamat pengiriman kado (opsional). */
  giftAddressEnabled?: boolean;
  giftAddressName?: string;
  giftAddressText?: string;
  giftAddressPhone?: string;
  /** TC-241 — "compact" = header, teks, tombol Lihat Rekening. */
  giftDisplay?: "full" | "compact";
  giftRevealLabel?: string;
  mapButtonBackground?: string; // TC-124 button Buka Google Maps
  mapButtonTextColor?: string;
  mapButtonRadius?: number;
  mapButtonBorderColor?: string;
  mapButtonBorderWidth?: number;
  mapButtonShape?: "rounded" | "pill" | "square" | "outline";
  mapButtonLabel?: string;
  // QA 15 Okt — ikon tombol lokasi (Lokasi & Event) dulu terkunci MapPin.
  mapButtonIcon?: "map-pin" | "navigation" | "map" | "external" | "none";
  // TC-208 — ukuran tombol lokasi (teks + padding) dan ukuran ikonnya.
  mapButtonFontSize?: number;
  mapButtonIconSize?: number;
  // QA 15 Okt — ukuran teks kotak "Created by" pada Credit (dulu 8 px tetap).
  creditFontSize?: number;
  // TC-234 — Credit menempel di paling bawah undangan (tanpa ruang kosong).
  creditPinBottom?: boolean;
  /** TC-235 — Live Streaming: tautan siaran (YouTube/Instagram/Zoom/Meet/dll),
   *  jadwal, label tombol, dan opsi embed (khusus YouTube). */
  liveUrl?: string;
  liveSchedule?: string;
  liveButtonLabel?: string;
  liveEmbed?: boolean;
  // TC-231 — transparansi background fitur & kotak/kolom putih di dalamnya.
  backgroundOpacity?: number;
  boxOpacity?: number;
  // TC-233 — font heading & teks terpisah dari font utama.
  titleFontFamily?: string;
  bodyFontFamily?: string;
  // TC-213 — elemen musik & gaya teks credit.
  creditMusicColor?: string;
  creditMusicIcon?: "disc" | "note" | "none";
  creditMusicIconSize?: number;
  creditTextStyle?: "normal" | "italic" | "uppercase" | "bold";
  // QA 15 Okt — galeri selain grid memotong gambar (object-fit:cover) tanpa
  // cara memilih bagian yang tampil. `galleryOffsets` sejajar dengan
  // galleryUrls (persen, seperti imageOffsetX/Y pada fitur gambar), dan
  // `galleryFit: "contain"` menampilkan gambar utuh tanpa dipotong.
  galleryFit?: "cover" | "contain";
  // TC-229 — ruang foto: tinggi kotak otomatis mengikuti foto (tanpa ruang
  // kosong) atau tetap (px), dan jarak antar foto.
  galleryHeightMode?: "fixed" | "auto";
  galleryImageHeight?: number;
  galleryGap?: number;
  galleryOffsets?: { x: number; y: number }[];
  showLocationQr?: boolean; // TC-132
  showMapEmbed?: boolean; // Preview peta Google Maps langsung di section
  mapEmbedHeight?: number;
  imageLayoutTemplate?: ImageLayoutTemplate; // TC-129
  imageCaption?: string;
  imageSecondaryUrl?: string;
  imageSecondaryKey?: string;
  gallerySlideshow?: boolean; // TC-126 slideshow otomatis
  gallerySlideshowMs?: number;
  loveStoryItems?: LoveStoryItem[]; // TC-120
  loveStoryLayout?: "timeline" | "cards" | "zigzag";
  creditText?: string; // TC-123
  creditSongTitle?: string;
  creditLink?: string;
  coverButtonShape?:
    | "solid"
    | "rounded"
    | "pill"
    | "square"
    | "outline"
    | "ghost"
    | "underline"; // TC-141
  loopEffect?: LoopEffect; // Efek berulang pada feature
  loopSpeed?: number; // detik per siklus
  /** TC-239 — live motion per elemen di layer 2 (di atas background). */
  elementMotion?: Partial<Record<ElementMotionTarget, LoopEffect>>;
  elementMotionSpeed?: number;
};
type ElementMotionTarget = "image" | "box" | "title" | "body";

type AuthAccount = {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  username: string;
  password: string;
  currentPassword?: string;
  role: Role;
  email: string;
  permissions?: string[];
  settings?: Record<string, unknown>;
  emailVerified?: boolean;
  // QA TC-172: akun bisa dinonaktifkan sementara tanpa dihapus permanen.
  active?: boolean;
  linkedManagedUserId?: string;
};

type CanvasColumn = { id: string; features: Feature[] };
type BottomNavStyle =
  | "classic"
  | "floating-pill"
  | "center-raised"
  | "notch-dot"
  | "active-square"
  | "icon-only";
type BottomNavIcon =
  | "home"
  | "heart"
  | "calendar"
  | "clock"
  | "map"
  | "image"
  | "camera"
  | "message"
  | "gift"
  | "book"
  | "users"
  | "music"
  | "mail"
  | "live"
  | "sparkles";
type BottomNavItem = {
  id: string;
  /** Column tujuan. */
  columnId: string;
  /** Opsional: feature tertentu di dalam column (untuk column berisi banyak feature). */
  featureId?: string;
  label: string;
  icon: BottomNavIcon;
  /** Revisi 22 Okt — ikon hasil upload (menggantikan ikon bawaan). */
  iconUrl?: string;
  iconKey?: string;
};
const bottomNavKey = (item: { columnId: string; featureId?: string }) =>
  item.featureId || item.columnId;
const bottomNavSelector = (item: { columnId: string; featureId?: string }) =>
  item.featureId
    ? `[id="feature-${CSS.escape(item.featureId)}"]`
    : `[data-column-id="${CSS.escape(item.columnId)}"]`;
type BottomNavConfig = {
  enabled: boolean;
  style: BottomNavStyle;
  show: "mobile" | "all";
  items: BottomNavItem[];
  background?: string;
  color?: string;
  activeColor?: string;
};

type CanvasSection = {
  id: string;
  name: string;
  columns: CanvasColumn[];
  backgroundColor: string;
  backgroundUrl?: string;
  backgroundKey?: string;
  backgroundVideoUrl?: string; // TC-098 background bergerak (MP4/WebM)
  backgroundVideoKey?: string;
  // TC-194 — nama berkas ditampilkan sebagai konfirmasi upload berhasil.
  backgroundName?: string;
  backgroundVideoName?: string;
  // Rasio asli background (lebar/tinggi), direkam saat upload. Dipakai agar
  // canvas berisi desain utuh tidak terpotong `background-size:cover` ketika
  // lebarnya berbeda antara editor dan preview.
  backgroundAspect?: number;
  backgroundFollowAspect?: boolean;
  backgroundEffect: BackgroundEffect;
  backgroundPosition: "center" | "top" | "bottom" | "left" | "right";
  backgroundRepeat: "no-repeat" | "repeat" | "repeat-x" | "repeat-y";
  backgroundGradientEnabled?: boolean;
  backgroundGradientFrom?: string;
  backgroundGradientTo?: string;
  backgroundGradientAngle?: number;
  backgroundMotion?: BackgroundMotion;
  paddingX?: number;
  paddingY: number;
  minHeight: number;
  layoutMode: CanvasLayoutMode;
  invitees: Invitee[];
  templateInstanceId?: string;
  sourceTemplateId?: string;
  sourceTemplateName?: string;
  // ---- QA batch TC-107..TC-137 ----
  mobile?: Partial<CanvasSection>; // TC-112 setting mobile terpisah
  backgroundFixed?: boolean; // TC-107/TC-127 background utama diam saat scroll
  backgroundSize?: "cover" | "contain" | "auto";
  backgroundLayers?: BackgroundLayer[]; // TC-108 layered background
  columnWidths?: number[]; // TC-114 lebar kolom hasil drag grid line
  showGuides?: boolean; // TC-113 garis guide/margin
  backgroundGlobal?: boolean; // TC-146 satu background untuk semua canvas
  backgroundOpacity?: number; // TC-231
  backgroundImageOpacity?: number; // TC-231
  /** Tata letak desktop (disimpan di Canvas 1, berlaku untuk seluruh
   *  undangan). "column" = ala wevitation serein: di desktop isi undangan
   *  tampil dalam versi Mobile di kolom sempit, background Canvas 1 versi
   *  Desktop memenuhi layar di belakangnya. */
  desktopLayout?: "full" | "column";
  desktopColumnWidth?: number; // px, lebar kolom isi
  desktopColumnAlign?: "center" | "left" | "right";
  desktopBackdropUrl?: string; // background luar kolom (opsional)
  desktopBackdropKey?: string;
  desktopBackdropColor?: string;
  /** TC-242 — rasio 70/30: kolom isi 30%, sisi 70% berisi background polos,
   *  header & supporting text, slideshow otomatis, atau video. */
  desktopColumnRatio?: "fixed" | "70-30";
  desktopSideTitle?: string;
  desktopSideBody?: string;
  desktopSideTextColor?: string;
  desktopSideSlides?: { url: string; key?: string }[];
  desktopSideSlideSeconds?: number;
  desktopSideVideoUrl?: string;
  desktopSideVideoKey?: string;
  /** Revisi 21 Okt — bottom navigation bar undangan (disimpan di Canvas 1). */
  bottomNav?: BottomNavConfig;
  backgroundGlobalMode?: "image" | "color"; // sumber background global
  backgroundScrollType?: "section" | "parallax"; // cara background bergerak
  loopEffect?: LoopEffect; // Efek berulang pada seluruh section
  loopSpeed?: number;
  backgroundLoopEffect?: LoopEffect; // Efek berulang khusus layer background
  backgroundLoopSpeed?: number;
  decorations?: SectionDecoration[]; // Ornamen pojok
};

type Guest = {
  initials: string;
  name: string;
  status: "Hadir" | "Tidak hadir" | "Menunggu";
  pax: number;
  time: string;
  canvasId: string;
};
type Greeting = {
  id?: string;
  name: string;
  message: string;
  date: string;
  canvasId?: string;
};
type ChatMessage = {
  id: string;
  sender: "user" | "support";
  text: string;
  time: string;
  conversationId?: string;
  senderName?: string;
};
type ConversationStatus = "Open" | "Pending" | "Resolved";
export type ArticleItem = {
  id: string;
  title: string;
  slug: string;
  category: string;
  date: string;
  status: "Published" | "Draft";
  views: string;
  excerpt: string;
  content: string;
  author: string;
  tags: string[];
  coverUrl?: string;
};
/**
 * SEO — tanggal artikel.
 *
 * `article.date` adalah string ISO mentah dari server (published_at atau
 * created_at), dan dulu dirender apa adanya: "2026-09-26T07:46:39.108Z".
 */
function formatArticleDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

/**
 * SEO — meta tag per artikel.
 *
 * index.html hanya memuat meta statis untuk seluruh aplikasi, jadi setiap
 * artikel dibagikan dengan judul dan deskripsi yang sama. Helper ini menulis
 * ulang head saat artikel dibuka dan mengembalikannya saat ditutup.
 *
 * Catatan: ini hanya menolong crawler yang menjalankan JavaScript. Crawler
 * yang membaca HTML mentah dilayani oleh injeksi meta di sisi server
 * (server/index.mjs, rute /articles/:slug).
 */
const BASE_META = {
  description:
    "ikrarku Sites - buat wedding website dan undangan digital yang indah: pilih template, personalisasi tanpa coding, kelola RSVP, ucapan, dan pembayaran dalam satu platform.",
  ogTitle: "ikrarku Sites - Wedding Website & Undangan Digital",
  ogDescription:
    "Pilih template, personalisasi, dan bagikan wedding website Anda bersama ikrarku Sites.",
};

function upsertMeta(
  selector: string,
  attribute: "name" | "property",
  key: string,
  content: string | null,
) {
  let tag = document.head.querySelector<HTMLMetaElement>(selector);
  if (content === null) {
    if (tag?.dataset.articleMeta) tag.remove();
    return;
  }
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    tag.dataset.articleMeta = "true";
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function upsertLink(rel: string, href: string | null) {
  let tag = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (href === null) {
    if (tag?.dataset.articleMeta) tag.remove();
    return;
  }
  if (!tag) {
    tag = document.createElement("link");
    tag.rel = rel;
    tag.dataset.articleMeta = "true";
    document.head.appendChild(tag);
  }
  tag.href = href;
}

function applyArticleMeta(article: ArticleItem | null) {
  if (typeof document === "undefined") return;
  const origin = window.location.origin;
  if (!article) {
    upsertMeta('meta[name="description"]', "name", "description", BASE_META.description);
    upsertMeta('meta[property="og:title"]', "property", "og:title", BASE_META.ogTitle);
    upsertMeta(
      'meta[property="og:description"]',
      "property",
      "og:description",
      BASE_META.ogDescription,
    );
    upsertMeta('meta[property="og:type"]', "property", "og:type", "website");
    upsertMeta('meta[property="og:url"]', "property", "og:url", null);
    upsertMeta('meta[property="og:image"]', "property", "og:image", null);
    upsertMeta(
      'meta[property="article:published_time"]',
      "property",
      "article:published_time",
      null,
    );
    upsertMeta('meta[name="twitter:card"]', "name", "twitter:card", null);
    upsertLink("canonical", null);
    return;
  }
  // Harus sama persis dengan canonical & og:url dari server dan dengan isi
  // sitemap; alamat yang berbeda-beda membuat crawler melihat dua halaman
  // berbeda dengan isi yang sama.
  const url = `${origin}/articles/${encodeURIComponent(article.slug)}`;
  const summary = (article.excerpt || article.title).slice(0, 300);
  upsertMeta('meta[name="description"]', "name", "description", summary);
  upsertMeta('meta[property="og:title"]', "property", "og:title", article.title);
  upsertMeta('meta[property="og:description"]', "property", "og:description", summary);
  upsertMeta('meta[property="og:type"]', "property", "og:type", "article");
  upsertMeta('meta[property="og:url"]', "property", "og:url", url);
  upsertMeta(
    'meta[property="og:image"]',
    "property",
    "og:image",
    article.coverUrl ? new URL(article.coverUrl, origin).href : null,
  );
  upsertMeta(
    'meta[property="article:published_time"]',
    "property",
    "article:published_time",
    article.date,
  );
  upsertMeta(
    'meta[name="twitter:card"]',
    "name",
    "twitter:card",
    article.coverUrl ? "summary_large_image" : "summary",
  );
  upsertLink("canonical", url);
}

type SoundCatalogItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  builtIn: boolean;
  preset?: string;
  mediaKey?: string;
  mediaUrl?: string;
  fileName?: string;
  createdAt: string;
};

export type Template = {
  id: string;
  name: string;
  category: string;
  accent: string;
  bg: string;
  premium: boolean;
  // QA TC-151 — ditandai Administrator sebagai pilihan rekomendasi.
  recommended?: boolean;
  preset?: "classic" | "split" | "cinematic" | "storybook";
  preview?: string;
  createdBy?: string;
  description?: string;
  price?: number;
  currency?: string;
  status?: "Pending" | "Published" | "Approved" | "Rejected" | "Unpublished";
  sampleImage?: string;
  createdByName?: string;
  headerImage?: string;
  unpublishedAt?: string | null;
  pendingReview?: boolean;
  canvasSections?: CanvasSection[];
};

type PaymentMethod = {
  id: string;
  code: string;
  label: string;
  enabled: boolean;
  config: Record<string, unknown>;
};
type OrderResult = {
  guestToken?: string;
  id: string;
  orderNo: string;
  amount: number;
  currency: string;
  receiptUrl?: string;
  assignedCsId?: string;
  assignedEditorId?: string;
  status?: string;
  conversationId?: string;
};
type OrderAnalytics = {
  summary: { qty: number; nominal: number; customers: number };
  rows: Array<Record<string, any>>;
};
type TaskItem = {
  id: string;
  order_id?: string;
  order_no?: string;
  customer_user_id?: string;
  assigned_user_name?: string;
  customer_name?: string;
  email?: string;
  phone?: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assigned_user_id?: string;
  assigned_role_id?: string;
  task_type?: string;
  template_id?: string;
  template_name?: string;
  template_status?: string;
  requestor_id?: string;
  requestor_name?: string;
  requestor_email?: string;
  decision_note?: string;
  created_at: string;
  updated_at: string;
};
type RoleItem = {
  id: string;
  name: string;
  permissions: string[];
  isSystem: boolean;
  userCount?: number;
};

type ManagedUser = {
  id: string;
  name: string;
  email: string;
  siteTitle: string;
  slug: string;
  assignedTo: string;
  assignedEditorId?: string;
  status: "Assigned" | "Unassigned" | "Active";
  plan: "Free" | "Essential" | "Signature";
  canvasIds: string[];
};

const uid = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);

function displayRole(value: string) {
  return value === "User"
    ? "Customer"
    : value === "Editor"
      ? "Web Designer"
      : value === "Admin"
        ? "Administrator"
        : value;
}

function getBackgroundFilter(effect: BackgroundEffect = "none") {
  if (effect === "grayscale") return "grayscale(1)";
  if (effect === "sepia") return "sepia(.78)";
  if (effect === "darken") return "brightness(.55)";
  if (effect === "soft-blur") return "blur(2px) scale(1.02)";
  if (effect === "warm") return "sepia(.18) saturate(1.18) brightness(1.03)";
  if (effect === "cool")
    return "hue-rotate(168deg) saturate(.78) brightness(.98)";
  if (effect === "high-contrast") return "contrast(1.35) saturate(1.08)";
  return "none";
}

/** TC-233 — katalog font undangan. `google` = dimuat dari Google Fonts saat
 *  dipakai (tidak membebani halaman yang tidak memakainya). */
const FONT_OPTIONS: { name: string; group: string; google?: string }[] = [
  { name: "Playfair Display", group: "Serif elegan", google: "Playfair+Display:ital,wght@0,400;0,600;1,400" },
  { name: "Cormorant Garamond", group: "Serif elegan", google: "Cormorant+Garamond:ital,wght@0,400;0,600;1,400" },
  { name: "Cinzel", group: "Serif elegan", google: "Cinzel:wght@400;600" },
  { name: "Lora", group: "Serif elegan", google: "Lora:ital,wght@0,400;0,600;1,400" },
  { name: "Libre Baskerville", group: "Serif elegan", google: "Libre+Baskerville:ital,wght@0,400;1,400" },
  { name: "Great Vibes", group: "Script / kaligrafi", google: "Great+Vibes" },
  { name: "Parisienne", group: "Script / kaligrafi", google: "Parisienne" },
  { name: "Alex Brush", group: "Script / kaligrafi", google: "Alex+Brush" },
  { name: "Dancing Script", group: "Script / kaligrafi", google: "Dancing+Script:wght@400;600" },
  { name: "Allura", group: "Script / kaligrafi", google: "Allura" },
  { name: "DM Sans", group: "Sans modern", google: "DM+Sans:wght@400;500;700" },
  { name: "Montserrat", group: "Sans modern", google: "Montserrat:wght@400;500;700" },
  { name: "Poppins", group: "Sans modern", google: "Poppins:wght@400;500;600" },
  { name: "Josefin Sans", group: "Sans modern", google: "Josefin+Sans:wght@400;600" },
  { name: "Georgia", group: "Font sistem" },
  { name: "Times New Roman", group: "Font sistem" },
  { name: "Arial", group: "Font sistem" },
  { name: "Verdana", group: "Font sistem" },
  { name: "Courier New", group: "Font sistem" },
];
const loadedFonts = new Set<string>();
function ensureFont(name?: string) {
  if (!name || loadedFonts.has(name) || typeof document === "undefined") return;
  const option = FONT_OPTIONS.find((item) => item.name === name);
  loadedFonts.add(name);
  if (!option?.google) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${option.google}&display=swap`;
  document.head.appendChild(link);
}
/** Revisi 21 Okt — semua color picker: bisa "Tidak ada warna" dan Reset.
 *  - value kosong (undefined)  → mengikuti bawaan tema, swatch kotak-kotak.
 *  - noneValue (mis. "transparent") → benar-benar tanpa warna; hanya untuk
 *    warna isian/latar. Untuk warna teks, "tanpa warna" = ikut bawaan.
 *  Picker native selalu butuh nilai, jadi saat kosong ditampilkan `fallback`
 *  di bawah lapisan kotak-kotak dan nilainya tidak pernah disimpan. */
const isPaintColor = (value?: string) =>
  Boolean(value) && value !== "transparent" && value !== "none";
const toPickerHex = (value?: string) => {
  if (!value) return null;
  if (/^#[0-9a-f]{6}$/i.test(value)) return value;
  const short = value.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
  if (short) return `#${short[1]}${short[1]}${short[2]}${short[2]}${short[3]}${short[3]}`;
  const rgb = value.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (rgb)
    return (
      "#" +
      rgb
        .slice(1, 4)
        .map((part) => Number(part).toString(16).padStart(2, "0"))
        .join("")
    );
  return null;
};
function ColorInput({
  value,
  onChange,
  fallback = "#ffffff",
  noneValue,
  label,
}: {
  value?: string;
  onChange: (next: string | undefined) => void;
  fallback?: string;
  /** Nilai "tanpa warna" untuk warna isian (mis. "transparent"). */
  noneValue?: string;
  label?: string;
}) {
  const painted = isPaintColor(value);
  const hex = (painted && toPickerHex(value)) || fallback;
  const explicitNone = Boolean(noneValue) && value === noneValue;
  return (
    <span className={`color-input ${painted ? "" : "is-none"}`}>
      <span className="color-swatch">
        <input
          type="color"
          value={hex}
          aria-label={label || "Pilih warna"}
          onChange={(event) => onChange(event.target.value)}
        />
        {!painted && <i className="color-none-mark" aria-hidden />}
      </span>
      <span className="color-value">
        {painted
          ? (toPickerHex(value) || value || "").toUpperCase()
          : explicitNone
            ? "Tanpa warna"
            : "Tidak ada warna"}
      </span>
      {noneValue && !explicitNone && (
        <button
          type="button"
          className="color-action"
          title="Tanpa warna (transparan)"
          aria-label="Tanpa warna"
          onClick={() => onChange(noneValue)}
        >
          <Ban size={12} />
        </button>
      )}
      {(painted || explicitNone) && (
        <button
          type="button"
          className="color-action"
          title="Reset — kembali ke tidak ada warna"
          aria-label="Reset warna"
          onClick={() => onChange(undefined)}
        >
          <RotateCcw size={12} />
        </button>
      )}
    </span>
  );
}

function FontSelect({
  value,
  onChange,
  allowInherit = false,
}: {
  value?: string;
  onChange: (value: string) => void;
  allowInherit?: boolean;
}) {
  const groups = [...new Set(FONT_OPTIONS.map((item) => item.group))];
  // Nilai lama di luar katalog tetap bisa tampil dan dipilih ulang.
  const known = !value || FONT_OPTIONS.some((item) => item.name === value);
  return (
    <select
      value={value || ""}
      onChange={(event) => {
        ensureFont(event.target.value);
        onChange(event.target.value);
      }}
    >
      {allowInherit && <option value="">Ikuti font utama</option>}
      {!known && <option value={value}>{value}</option>}
      {groups.map((group) => (
        <optgroup key={group} label={group}>
          {FONT_OPTIONS.filter((item) => item.group === group).map((item) => (
            <option key={item.name} value={item.name} style={{ fontFamily: item.name }}>
              {item.name}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}

/** TC-231 — warna dengan alpha (hex/rgb/rgba). Warna lain dikembalikan apa
 *  adanya. `alpha` 0–1; undefined berarti tidak diubah. */
function withAlpha(color: string | undefined, alpha: number | undefined) {
  if (!color || alpha === undefined || alpha >= 1) return color;
  const hex = color.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const h = hex[1].length === 3 ? hex[1].replace(/./g, "$&$&") : hex[1];
    const n = parseInt(h, 16);
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
  }
  const rgb = color.match(/^rgba?\(([^)]+)\)$/i);
  if (rgb) {
    const [r, g, b, a = "1"] = rgb[1].split(",").map((part) => part.trim());
    return `rgba(${r},${g},${b},${Number(a) * alpha})`;
  }
  return color;
}

function getGradientBackground(
  enabled: boolean | undefined,
  from: string | undefined,
  to: string | undefined,
  angle: number | undefined,
  fallback: string,
) {
  return enabled
    ? `linear-gradient(${angle ?? 135}deg, ${from || fallback}, ${to || "#d7b66f"})`
    : fallback;
}

function getBackgroundMotionClass(motion?: BackgroundMotion) {
  return motion && motion !== "none" ? `bg-motion-${motion}` : "";
}

function CoverIconGlyph({
  name = "mail",
  size = 20,
}: {
  name?: CoverIconName;
  size?: number;
}) {
  if (name === "none") return null;
  const map: Record<Exclude<CoverIconName, "none">, typeof MailOpen> = {
    mail: MailOpen,
    heart: Heart,
    sparkles: Sparkles,
    crown: Crown,
    calendar: CalendarDays,
  };
  const Icon = map[name as Exclude<CoverIconName, "none">] || MailOpen;
  return <Icon size={size} />;
}

function getFeatureObjectStyle(feature: Feature): React.CSSProperties {
  const width = Math.max(20, Math.min(100, feature.objectWidth ?? 100));
  const align = feature.objectAlign || "stretch";
  if (align === "stretch" || width >= 100)
    return { width: "100%", alignSelf: "stretch" };
  if (align === "left") return { width: `${width}%`, alignSelf: "flex-start" };
  if (align === "right") return { width: `${width}%`, alignSelf: "flex-end" };
  return { width: `${width}%`, alignSelf: "center" };
}

function getCoverContentObjectStyle(feature: Feature): React.CSSProperties {
  const width = Math.max(20, Math.min(100, feature.objectWidth ?? 82));
  const align = feature.objectAlign || "center";
  if (align === "stretch" || width >= 100)
    return { width: "100%", maxWidth: "none", marginLeft: 0, marginRight: 0 };
  if (align === "left")
    return {
      width: `${width}%`,
      maxWidth: "none",
      marginLeft: 0,
      marginRight: "auto",
    };
  if (align === "right")
    return {
      width: `${width}%`,
      maxWidth: "none",
      marginLeft: "auto",
      marginRight: 0,
    };
  return {
    width: `${width}%`,
    maxWidth: "none",
    marginLeft: "auto",
    marginRight: "auto",
  };
}

function getCoverContentAlignment(
  align: Alignment,
): React.CSSProperties["alignItems"] {
  if (align === "left") return "flex-start";
  if (align === "right") return "flex-end";
  return "center";
}

function getCoverVerticalJustify(
  value?: Feature["coverVerticalAlign"],
): React.CSSProperties["justifyContent"] {
  if (value === "top") return "flex-start";
  if (value === "bottom") return "flex-end";
  return "center";
}

const defaultFeatureStyle = {
  fontFamily: "Playfair Display",
  fontSize: 34,
  bold: false,
  italic: false,
  underline: false,
  align: "center" as Alignment,
  lineHeight: 1.45,
  textColor: "#154f40",
  backgroundColor: "transparent",
  borderRadius: 12,
  padding: 12,
  margin: 8,
  entranceEffect: "fade-up",
  transition: "smooth",
  backgroundEffect: "none" as BackgroundEffect,
  backgroundPosition: "center" as const,
  backgroundRepeat: "no-repeat" as const,
  backgroundSize: "cover" as const,
  overlayOpacity: 45,
  visualEffect: "none",
  effectIntensity: 55,
  backgroundGradientEnabled: false,
  backgroundGradientFrom: "#154f40",
  backgroundGradientTo: "#d7b66f",
  backgroundGradientAngle: 135,
  backgroundMotion: "none" as BackgroundMotion,
  objectAlign: "stretch" as FeatureObjectAlign,
  objectWidth: 100,
  locked: false,
  coverIcon: "mail" as CoverIconName,
  coverIconSize: 20,
  coverIconPosition: "left" as const,
  coverButtonRadius: 12,
  coverButtonBorderWidth: 1,
  coverButtonBorderColor: "#ffffff",
  coverButtonBackground: "#102f27",
  coverButtonTextColor: "#ffffff",
  coverButtonPaddingX: 30,
  coverButtonPaddingY: 15,
  coverVerticalAlign: "center" as const,
  coverExitEffect: "fade" as CoverExitEffect,
  coverExitDuration: 700,
  coverExitEasing: "ease" as const,
};

// QA TC-112: pengaturan Desktop dan Mobile disimpan terpisah. Nilai dasar adalah
// Desktop; `mobile` hanya berisi field yang sengaja dioverride untuk mobile.
type DeviceMode = "desktop" | "mobile";
const DeviceContext = createContext<DeviceMode>("desktop");
function resolveFeature(feature: Feature, device: DeviceMode): Feature {
  if (device !== "mobile" || !feature.mobile) return feature;
  const override = { ...feature.mobile } as Partial<Feature>;
  delete (override as { mobile?: unknown }).mobile;
  return { ...feature, ...override };
}
function resolveSection(
  section: CanvasSection,
  device: DeviceMode,
): CanvasSection {
  if (device !== "mobile" || !section.mobile) return section;
  const override = { ...section.mobile } as Partial<CanvasSection>;
  delete (override as { mobile?: unknown }).mobile;
  delete (override as { columns?: unknown }).columns;
  delete (override as { id?: unknown }).id;
  return { ...section, ...override };
}
/** Pengaturan musik yang selalu berlaku untuk kedua device (lihat updateFeature). */
const SHARED_SOUND_KEYS = [
  "soundCatalogId",
  "soundPreset",
  "mediaKey",
  "mediaUrl",
  "mediaName",
  "autoplay",
  "soundPersist",
  "creditSongTitle",
] as const satisfies readonly (keyof Feature)[];

// Patch ditulis ke slot device yang sedang aktif agar Desktop tidak ikut berubah
// saat designer mengedit tampilan Mobile (dan sebaliknya).
function applyDevicePatch<T extends { mobile?: Partial<T> }>(
  target: T,
  patch: Partial<T>,
  device: DeviceMode,
): T {
  if (device !== "mobile") return { ...target, ...patch };
  const nextMobile = { ...(target.mobile || {}), ...patch } as Partial<T>;
  delete (nextMobile as { mobile?: unknown }).mobile;
  return { ...target, mobile: nextMobile } as T;
}

function makeFeature(
  type: FeatureType,
  title?: string,
  body?: string,
): Feature {
  const copy: Record<FeatureType, [string, string]> = {
    text: ["Aurelia & Reynard", "22 Juni 2026 · Yogyakarta"],
    form: ["Guest Form", "Silakan isi informasi berikut."],
    image: ["Our Moment", "Klik upload untuk menambahkan gambar."],
    video: ["Our Film", "Tambahkan video dari perangkat Anda."],
    gallery: ["Our Gallery", "Kumpulan momen terbaik kami."],
    event: ["Wedding Day", "Akad 09.00 · Resepsi 11.00"],
    greetings: [
      "Greetings from Our Guests",
      "Tinggalkan doa dan ucapan terbaik untuk kami.",
    ],
    quote: ["Favorite Quote", "Two souls, one beautiful journey."],
    gift: ["Wedding Gift", "Doa dan restu Anda adalah hadiah terindah."],
    "invitation-cover": [
      "Chyntia & Rian",
      "Dengan penuh kebahagiaan kami mengundang Anda",
    ],
    countdown: ["Save The Date", "20 Agustus 2026 · 09.00 WIB"],
    location: ["Lokasi Pernikahan", "Grand Ballroom Arunika, Semarang"],
    sound: ["Wedding Sound", "Romantic Piano"],
    icon: ["Follow Our Journey", "Sosial media & icon dekoratif"],
    "love-story": ["Our Love Story", "Perjalanan kami dari awal hingga hari ini"],
    credit: ["Terima kasih", "Undangan ini dibuat dengan penuh cinta"],
    "live-stream": [
      "Live Streaming",
      "Saksikan momen bahagia kami secara langsung dari mana saja",
    ],
  };
  const [defaultTitle, defaultBody] = copy[type];
  return {
    id: uid(type),
    type,
    title: title ?? defaultTitle,
    body: body ?? defaultBody,
    ...defaultFeatureStyle,
    fontSize:
      type === "invitation-cover"
        ? 64
        : type === "text"
          ? 46
          : type === "quote"
            ? 29
            : 30,
    italic: type === "quote",
    formFields:
      type === "form" ? ["Nama lengkap", "Email", "Pesan"] : undefined,
    galleryUrls: type === "gallery" ? [] : undefined,
    galleryKeys: type === "gallery" ? [] : undefined,
    galleryStyle: type === "gallery" ? "grid" : undefined,
    galleryAutoplay: type === "gallery" ? true : undefined,
    galleryFullWidth: type === "gallery" ? false : undefined,
    galleryTransitionMs: type === "gallery" ? 850 : undefined,
    textColor:
      // Revisi 21 Okt — warna teks bawaan tidak disimpan: picker tampil
      // "Tidak ada warna", render tetap memakai defaultFeatureStyle.textColor.
      type === "invitation-cover" ? "#ffffff" : undefined,
    objectAlign:
      type === "invitation-cover" ? "center" : defaultFeatureStyle.objectAlign,
    objectWidth:
      type === "invitation-cover" ? 82 : defaultFeatureStyle.objectWidth,
    buttonLabel: type === "invitation-cover" ? "Buka Undangan" : undefined,
    coverButtonShape: type === "invitation-cover" ? "rounded" : undefined, // TC-141
    overlayOpacity:
      type === "invitation-cover" ? 0 : defaultFeatureStyle.overlayOpacity,
    eventDate: type === "countdown" ? "2026-08-20T09:00" : undefined,
    mapUrl:
      type === "location"
        ? "https://maps.google.com/?q=-6.966667,110.416664"
        : undefined,
    locationName: type === "location" ? "Grand Ballroom Arunika" : undefined,
    locationAddress:
      type === "location" ? "Jl. Pemuda No. 123, Semarang" : undefined,
    soundPreset: type === "sound" ? "romantic-piano" : undefined,
    soundCatalogId: type === "sound" ? "sound-romantic-piano" : undefined,
    eyebrowText:
      type === "invitation-cover" ? "UNDANGAN PERNIKAHAN" : undefined,
    guestLabelText:
      type === "invitation-cover"
        ? "Kepada Yth. Bapak/Ibu/Saudara/i"
        : undefined,
    guestNameText: type === "invitation-cover" ? "Tamu Terhormat" : undefined,
    autoplay: type === "sound" ? false : undefined,
    // ---- QA remediation defaults ----
    showTitle: true,
    showBody: true,
    extraTexts: [],
    animateOnScroll: true,
    saveTheDateStyle: type === "countdown" ? "classic" : undefined,
    formSpecs:
      type === "form"
        ? [
            {
              id: uid("ff"),
              label: "Nama lengkap",
              kind: "text",
              required: true,
              width: "full",
            },
            {
              id: uid("ff"),
              label: "Email",
              kind: "email",
              required: false,
              width: "half",
            },
            {
              id: uid("ff"),
              label: "Jumlah tamu",
              kind: "number",
              required: false,
              width: "half",
            },
            {
              id: uid("ff"),
              label: "Pesan",
              kind: "textarea",
              required: false,
              width: "full",
            },
          ]
        : undefined,
    formColumns: type === "form" ? 2 : undefined,
    imageFrame: type === "image" ? "rounded" : undefined,
    imageOffsetX: type === "image" ? 50 : undefined,
    imageOffsetY: type === "image" ? 50 : undefined,
    imageZoom: type === "image" ? 100 : undefined,
    imageHeight: type === "image" ? 320 : undefined,
    videoAutoplay: type === "video" ? true : undefined,
    videoLoop: type === "video" ? true : undefined,
    videoMuted: type === "video" ? true : undefined,
    galleryLayoutTemplate: type === "gallery" ? "even" : undefined,
    greetingsLayout: type === "greetings" ? "column" : undefined,
    eventMapUrl: type === "event" ? "" : undefined,
    eventButtonLabel: type === "event" ? "Lihat Lokasi" : undefined,
    locationNoteText: type === "location" ? "" : undefined,
    giftAccounts:
      type === "gift"
        ? [
            {
              id: uid("gift"),
              bank: "BCA",
              accountNumber: "1234567890",
              accountName: "Aurelia Putri",
            },
          ]
        : undefined,
    soundPersist: type === "sound" ? true : undefined,
    icons:
      type === "icon"
        ? [
            {
              id: uid("ic"),
              name: "instagram",
              label: "Instagram",
              url: "https://instagram.com/",
            },
            {
              id: uid("ic"),
              name: "whatsapp",
              label: "WhatsApp",
              url: "https://wa.me/",
            },
          ]
        : undefined,
    iconSize: type === "icon" ? 26 : undefined,
    iconColor: type === "icon" ? "#154f40" : undefined,
    iconStyle: type === "icon" ? "circle" : undefined,
    // ---- QA batch TC-107..TC-137 ----
    showTitle2: false, // TC-118
    showBody2: false,
    title2: "Sub Heading",
    body2: "Tambahkan keterangan pendukung kedua di sini.",
    title2FontSize: 20,
    body2FontSize: 11,
    backgroundImageOpacity: 100, // TC-117
    backgroundImageSize: "cover",
    backgroundImagePosition: "center",
    backgroundImageFixed: false, // TC-107
    fieldRadius: 8, // TC-125
    buttonRadius: 8,
    buttonBorderWidth: 0,
    cardRadius: 12, // TC-121/TC-122
    mapButtonShape: type === "location" ? "rounded" : undefined, // TC-124
    mapButtonLabel: type === "location" ? "Buka Google Maps" : undefined,
    showLocationQr: type === "location" ? false : undefined, // TC-132
    showMapEmbed: type === "location" ? true : undefined,
    mapEmbedHeight: type === "location" ? 260 : undefined,
    imageLayoutTemplate: type === "image" ? "single" : undefined, // TC-129
    imageCaption: type === "image" ? "" : undefined,
    gallerySlideshow: type === "gallery" ? false : undefined, // TC-126
    gallerySlideshowMs: type === "gallery" ? 3500 : undefined,
    loveStoryLayout: type === "love-story" ? "timeline" : undefined, // TC-120
    loveStoryItems:
      type === "love-story"
        ? [
            {
              id: uid("ls"),
              year: "2019",
              title: "Pertama Bertemu",
              body: "Kami dipertemukan di sebuah acara kampus dan mulai saling mengenal.",
            },
            {
              id: uid("ls"),
              year: "2022",
              title: "Mulai Serius",
              body: "Perjalanan panjang membawa kami pada keputusan untuk melangkah bersama.",
            },
            {
              id: uid("ls"),
              year: "2026",
              title: "Melamar",
              body: "Dengan restu keluarga, kami memutuskan untuk menikah.",
            },
          ]
        : undefined,
    creditText: type === "credit" ? "Created by ikrarku" : undefined, // TC-123
    creditSongTitle: type === "credit" ? "" : undefined,
    creditLink: type === "credit" ? "https://ikrarku.id" : undefined,
    // Auto repeat sebagai default: begitu undangan tampil, efek terus berjalan.
    loopEffect: "fade",
    loopSpeed: 6,
  };
}

const defaultSections: CanvasSection[] = [
  {
    id: "canvas-hero",
    name: "Hero Canvas",
    backgroundColor: "#f7f2e8",
    backgroundEffect: "none",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundGradientEnabled: false,
    backgroundGradientFrom: "#fffdf8",
    backgroundGradientTo: "#d7b66f",
    backgroundGradientAngle: 135,
    backgroundMotion: "none",
    paddingX: 32,
    paddingY: 86,
    minHeight: 520,
    layoutMode: "standard",
    invitees: [],
    columns: [{ id: "hero-col-1", features: [makeFeature("text")] }],
  },
  {
    id: "canvas-story",
    name: "Story Canvas",
    backgroundColor: "#fffdf8",
    backgroundEffect: "none",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundGradientEnabled: false,
    backgroundGradientFrom: "#fffdf8",
    backgroundGradientTo: "#d7b66f",
    backgroundGradientAngle: 135,
    backgroundMotion: "none",
    paddingX: 32,
    paddingY: 68,
    minHeight: 360,
    layoutMode: "standard",
    invitees: [],
    columns: [
      {
        id: "story-col-1",
        features: [
          makeFeature(
            "quote",
            "Our Story",
            "Sebuah cerita yang bermula dari pertemuan sederhana.",
          ),
        ],
      },
      { id: "story-col-2", features: [makeFeature("image")] },
    ],
  },
  {
    id: "canvas-event",
    name: "Event Canvas",
    backgroundColor: "#f3eee4",
    backgroundEffect: "none",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundGradientEnabled: false,
    backgroundGradientFrom: "#fffdf8",
    backgroundGradientTo: "#d7b66f",
    backgroundGradientAngle: 135,
    backgroundMotion: "none",
    paddingX: 32,
    paddingY: 64,
    minHeight: 340,
    layoutMode: "standard",
    invitees: [],
    columns: [
      {
        id: "event-col-1",
        features: [
          makeFeature("event", "Akad Nikah", "09.00 WIB · Pendopo Arunika"),
        ],
      },
      {
        id: "event-col-2",
        features: [
          makeFeature("event", "Resepsi", "11.00 WIB · Pendopo Arunika"),
        ],
      },
    ],
  },
  {
    id: "canvas-gallery",
    name: "Gallery Canvas",
    backgroundColor: "#fffdf8",
    backgroundEffect: "none",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundGradientEnabled: false,
    backgroundGradientFrom: "#fffdf8",
    backgroundGradientTo: "#d7b66f",
    backgroundGradientAngle: 135,
    backgroundMotion: "none",
    paddingX: 32,
    paddingY: 64,
    minHeight: 420,
    layoutMode: "standard",
    invitees: [],
    columns: [{ id: "gallery-col-1", features: [makeFeature("gallery")] }],
  },
  {
    id: "canvas-guest",
    name: "Guest Interaction",
    backgroundColor: "#125946",
    backgroundEffect: "none",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundGradientEnabled: false,
    backgroundGradientFrom: "#fffdf8",
    backgroundGradientTo: "#d7b66f",
    backgroundGradientAngle: 135,
    backgroundMotion: "none",
    paddingX: 32,
    paddingY: 64,
    minHeight: 420,
    layoutMode: "standard",
    invitees: [],
    columns: [
      {
        id: "guest-col-1",
        features: [
          {
            ...makeFeature("form", "RSVP", "Konfirmasikan kehadiran Anda."),
            textColor: "#ffffff",
          },
        ],
      },
      {
        id: "guest-col-2",
        features: [{ ...makeFeature("greetings"), textColor: "#ffffff" }],
      },
    ],
  },
];

const templates: Template[] = [
  {
    id: "split-serenity",
    name: "Split Serenity",
    category: "Editorial",
    accent: "#f4eadc",
    bg: "#17241f",
    premium: false,
    preset: "split",
    preview: "/themes/split-reference.png",
  },
  {
    id: "cinematic-story",
    name: "Cinema Night",
    category: "Cinematic",
    accent: "#e11d2e",
    bg: "#090909",
    premium: true,
    preset: "cinematic",
  },
  {
    id: "storybook-magic",
    name: "Storybook Magic",
    category: "Fairytale",
    accent: "#d7b66f",
    bg: "#dceafa",
    premium: true,
    preset: "storybook",
  },
  {
    id: "emerald",
    name: "Emerald Vow",
    category: "Elegant",
    accent: "#0d5442",
    bg: "#f7f2e8",
    premium: false,
    preset: "classic",
  },
  {
    id: "serenity",
    name: "Serenity Bloom",
    category: "Romantic",
    accent: "#a56f78",
    bg: "#f8eff0",
    premium: false,
    preset: "classic",
  },
  {
    id: "nusantara",
    name: "Nusantara Grace",
    category: "Traditional",
    accent: "#704b31",
    bg: "#f4eadc",
    premium: true,
    preset: "classic",
  },
  {
    id: "midnight",
    name: "Midnight Promise",
    category: "Modern",
    accent: "#20283b",
    bg: "#e9ecf4",
    premium: true,
    preset: "classic",
  },
  {
    id: "olive",
    name: "Olive Garden",
    category: "Garden",
    accent: "#687359",
    bg: "#f1f2e9",
    premium: false,
    preset: "classic",
  },
  {
    id: "sakura",
    name: "Sakura Whisper",
    category: "Minimalist",
    accent: "#b98686",
    bg: "#fbf4f1",
    premium: true,
    preset: "classic",
  },
];

// Runtime content, accounts, customers, articles, and sound catalog are loaded from the API/database.

const widgetLibrary: {
  type: FeatureType;
  label: string;
  description: string;
  icon: typeof Type;
}[] = [
  {
    type: "invitation-cover",
    label: "Buka Undangan",
    description: "Kunci scroll sampai undangan dibuka",
    icon: MailOpen,
  },
  {
    type: "countdown",
    label: "Save The Date",
    description: "Countdown menuju hari pernikahan",
    icon: TimerReset,
  },
  {
    type: "location",
    label: "Location",
    description: "QR dan tautan Google Maps",
    icon: MapPin,
  },
  {
    type: "text",
    label: "Text",
    description: "Heading dan paragraph editable",
    icon: Type,
  },
  {
    type: "form",
    label: "Form",
    description: "Form no-code dengan field kustom",
    icon: FormInput,
  },
  {
    type: "image",
    label: "Image",
    description: "Upload file maksimal 1 MB",
    icon: ImageIcon,
  },
  {
    type: "video",
    label: "Video",
    description: "Upload video maksimal 5 MB",
    icon: Video,
  },
  {
    type: "gallery",
    label: "Gallery",
    description: "Grid, carousel, atau filmstrip",
    icon: ImageIcon,
  },
  {
    type: "greetings",
    label: "Greetings",
    description: "Komentar dan doa dari tamu",
    icon: MessageCircle,
  },
  {
    type: "event",
    label: "Event",
    description: "Detail akad dan resepsi",
    icon: CalendarDays,
  },
  {
    type: "quote",
    label: "Quote",
    description: "Kutipan atau pesan pasangan",
    icon: Sparkles,
  },
  {
    type: "gift",
    label: "Wedding Gift",
    description: "Informasi hadiah pernikahan",
    icon: Crown,
  },
  // QA TC-165: feature "Sound" di-takedown dari library. Judul lagu dan
  // pemutarnya kini menjadi bagian dari Credit / Watermark supaya tidak tampil
  // dua kali ketika keduanya diaktifkan bersamaan. Feature sound yang terlanjur
  // ada pada template lama tetap berjalan sebagai pemutar latar.
  {
    type: "love-story",
    label: "Love Story",
    description: "Timeline perjalanan pasangan dengan teks dan foto",
    icon: BookOpen,
  },
  {
    type: "credit",
    label: "Credit / Watermark",
    description: "Created by, judul lagu, dan backsound undangan",
    icon: BadgeCheck,
  },
  {
    type: "icon",
    label: "Icon & Sosial Media",
    description: "Instagram, Threads, FB, YouTube, dan icon dekoratif",
    icon: Heart,
  },
  {
    type: "live-stream",
    label: "Live Streaming",
    description: "Tautan/embed siaran langsung YouTube, IG, Zoom, Meet",
    icon: Radio,
  },
];

// QA TC-095: katalog icon yang dapat ditempatkan pada section manapun.
const socialIconCatalog: [SocialIconName, string][] = [
  ["instagram", "Instagram"],
  ["facebook", "Facebook"],
  ["youtube", "YouTube"],
  ["threads", "Threads"],
  ["tiktok", "TikTok"],
  ["twitter", "X / Twitter"],
  ["whatsapp", "WhatsApp"],
  ["link", "Website / Link"],
  ["heart", "Heart"],
  ["sparkles", "Sparkles"],
  ["crown", "Crown"],
  ["flower", "Flower"],
  ["ring", "Ring"],
  ["music", "Music"],
  ["camera", "Camera"],
  ["star", "Star"],
];

// QA TC-088: daftar bank & e-wallet untuk Wedding Gift.
const bankCatalog = [
  "BCA",
  "BNI",
  "BRI",
  "Mandiri",
  "BSI",
  "CIMB Niaga",
  "Permata",
  "Danamon",
  "BTN",
  "Jenius",
  "GoPay",
  "OVO",
  "DANA",
  "ShopeePay",
  "LinkAja",
  "QRIS",
];

const entranceEffects = [
  ["none", "None"],
  ["fade-up", "Fade Up"],
  ["fade-down", "Fade Down"],
  ["fade-left", "Fade Left"],
  ["fade-right", "Fade Right"],
  ["zoom-in", "Zoom In"],
  ["zoom-out", "Zoom Out"],
  ["flip-up", "Flip Up"],
  ["flip-left", "Flip Left"],
  ["rotate-in", "Rotate In"],
  ["bounce-in", "Bounce In"],
  ["blur-in", "Blur In"],
  ["scale-rise", "Scale Rise"],
  ["slide-spring", "Slide Spring"],
  ["swing-in", "Swing In"],
  ["fold-open", "Fold Open"],
  ["letter-reveal", "Letter Reveal"],
  ["mask-up", "Mask Up"],
  ["mask-center", "Mask Center"],
  ["glide-in", "Glide In"],
  ["float-in", "Float In"],
  ["pulse-in", "Pulse In"],
  ["cinematic-rise", "Cinematic Rise"],
  ["storybook-pop", "Storybook Pop"],
  ["soft-particles", "Soft Particles"],
  ["flower-petals", "Flower Petals"],
  ["heart-burst", "Heart Burst"],
  ["aurora-in", "Aurora In"],
  ["shimmer-in", "Shimmer In"],
  ["focus-in", "Focus In"],
];

const transitions = [
  ["smooth", "Smooth"],
  ["reveal-left", "Reveal Left"],
  ["reveal-right", "Reveal Right"],
  ["wipe-up", "Wipe Up"],
  ["wipe-down", "Wipe Down"],
  ["parallax", "Parallax"],
  ["zoom-softly", "Zoom Softly"],
  ["curtain", "Curtain"],
  ["curtain-center", "Curtain Center"],
  ["dissolve", "Dissolve"],
  ["slide-over", "Slide Over"],
  ["elastic", "Elastic"],
  ["crossfade", "Crossfade"],
  ["cinematic-cut", "Cinematic Cut"],
  ["page-turn", "Page Turn"],
  ["depth-shift", "Depth Shift"],
  ["blur-cross", "Blur Cross"],
  ["light-sweep", "Light Sweep"],
  ["morph", "Morph"],
  ["soft-stack", "Soft Stack"],
];

const visualEffects = [
  ["none", "None"],
  ["soft-glow", "Soft Glow"],
  ["floating-hearts", "Floating Hearts"],
  ["gold-sparkles", "Gold Sparkles"],
  ["flower-rain", "Flower Rain"],
  ["bokeh", "Bokeh Lights"],
  ["aurora", "Aurora"],
  ["film-grain", "Film Grain"],
  ["light-leak", "Light Leak"],
  ["confetti", "Celebration Confetti"],
  ["starfield", "Starfield"],
  ["water-ripple", "Water Ripple"],
];

const faqItems = [
  {
    category: "Web Designer",
    q: "Bagaimana menambahkan feature ke column?",
    a: "Buka Site Editor, pilih column pada canvas, lalu klik atau drag feature dari panel kanan ke column tersebut.",
  },
  {
    category: "Web Designer",
    q: "Bagaimana membuat layout 1 sampai 4 column?",
    a: "Klik Canvas pada Page Structure. Pada panel kanan pilih jumlah column. Feature dari column yang dihapus akan dipindahkan ke column terakhir yang tersisa.",
  },
  {
    category: "Media",
    q: "Berapa batas ukuran upload image?",
    a: "Feature Image maksimal 1 MB. Background dan setiap gambar Gallery maksimal 2 MB. Video maksimal 5 MB.",
  },
  {
    category: "Media",
    q: "Bagaimana membuat gallery carousel?",
    a: "Pilih feature Gallery, buka tab Style, lalu pilih Carousel. Aktifkan autoplay bila diperlukan.",
  },
  {
    category: "Publishing",
    q: "Bagaimana menyimpan dan mempublikasikan website?",
    a: "Klik Save & Publish pada pojok kanan atas. Status dan struktur Canvas akan tersimpan pada website aktif.",
  },
  {
    category: "RSVP",
    q: "Di mana saya melihat konfirmasi tamu?",
    a: "Buka Dashboard, lalu klik Lihat semua pada kartu RSVP terbaru untuk melihat seluruh respons.",
  },
  {
    category: "Account",
    q: "Apa perbedaan Customer, Web Designer, dan Administrator?",
    a: "Customer mengelola website. Web Designer membuat template dan membantu desain. Administrator mengelola platform, approval, assignment, dan Customer Service.",
  },
  {
    category: "Invitation",
    q: "Bagaimana mengimpor daftar undangan?",
    a: "Pilih Canvas, buka Content, lalu unggah CSV dengan kolom name,email,phone,city. Daftar undangan disimpan pada Canvas tersebut.",
  },
  {
    category: "Invitation",
    q: "Apa fungsi Buka Undangan?",
    a: "Feature Buka Undangan mengunci scroll viewer. Setelah tombol diklik, cover akan menghilang dan isi website dapat diakses.",
  },
  {
    category: "Layout",
    q: "Bagaimana membuat column kiri fixed dan kanan scroll?",
    a: "Pilih Canvas, lalu ubah Layout Mode menjadi Split: fixed left + scroll right. Layout otomatis menggunakan dua column.",
  },
  {
    category: "Support",
    q: "Bagaimana menghubungi Customer Service?",
    a: "Klik tombol Live Chat di pojok kanan bawah. Percakapan akan masuk ke dashboard Customer Service.",
  },
];

function sampleInvitees(): Invitee[] {
  return [
    {
      id: uid("invitee"),
      name: "Ardiani Safitri",
      email: "ardiani@example.com",
      phone: "081234567890",
      city: "Semarang",
    },
    {
      id: uid("invitee"),
      name: "Bima & Keluarga",
      email: "bima@example.com",
      phone: "081298765432",
      city: "Jakarta",
    },
  ];
}

function hydrateSections(raw: CanvasSection[]): CanvasSection[] {
  return raw.map((section) => ({
    ...section,
    layoutMode: section.layoutMode || "standard",
    backgroundGradientEnabled: section.backgroundGradientEnabled ?? false,
    backgroundGradientFrom:
      section.backgroundGradientFrom || section.backgroundColor || "#ffffff",
    backgroundGradientTo: section.backgroundGradientTo || "#d7b66f",
    backgroundGradientAngle: section.backgroundGradientAngle ?? 135,
    backgroundMotion: section.backgroundMotion || "none",
    paddingX: section.paddingX ?? 32,
    invitees: Array.isArray(section.invitees) ? section.invitees : [],
    columns: (section.columns || []).map((column) => ({
      ...column,
      features: (column.features || []).map((feature) => ({
        ...feature,
        buttonLabel:
          feature.buttonLabel ||
          (feature.type === "invitation-cover" ? "Buka Undangan" : undefined),
        eventDate:
          feature.eventDate ||
          (feature.type === "countdown" ? "2026-08-20T09:00" : undefined),
        mapUrl:
          feature.mapUrl ||
          (feature.type === "location"
            ? "https://maps.google.com/?q=-6.966667,110.416664"
            : undefined),
        backgroundEffect: feature.backgroundEffect || "none",
        backgroundPosition: feature.backgroundPosition || "center",
        backgroundRepeat: feature.backgroundRepeat || "no-repeat",
        backgroundSize: feature.backgroundSize || "cover",
        overlayOpacity:
          feature.type === "invitation-cover" &&
          !feature.mediaKey &&
          !feature.mediaUrl
            ? 0
            : (feature.overlayOpacity ?? 45),
        visualEffect: feature.visualEffect || "none",
        effectIntensity: feature.effectIntensity ?? 55,
        soundPreset:
          feature.soundPreset ||
          (feature.type === "sound" ? "romantic-piano" : undefined),
        soundCatalogId:
          feature.soundCatalogId ||
          (feature.type === "sound" ? "sound-romantic-piano" : undefined),
        // TC-199 — desain lama bisa tersimpan tanpa lineHeight/fontSize.
        // Tanpa backfill, `feature.lineHeight.toFixed(2)` di panel Style
        // melempar TypeError dan seluruh inspector berhenti dirender, yang
        // terbaca sebagai "slider tidak bisa digerakkan".
        lineHeight: feature.lineHeight ?? defaultFeatureStyle.lineHeight,
        fontSize: feature.fontSize ?? defaultFeatureStyle.fontSize,
        backgroundGradientEnabled: feature.backgroundGradientEnabled ?? false,
        backgroundGradientFrom: feature.backgroundGradientFrom || "#154f40",
        backgroundGradientTo: feature.backgroundGradientTo || "#d7b66f",
        backgroundGradientAngle: feature.backgroundGradientAngle ?? 135,
        backgroundMotion: feature.backgroundMotion || "none",
        textColor:
          feature.type === "invitation-cover" &&
          (!feature.textColor || feature.textColor.toLowerCase() === "#154f40")
            ? "#ffffff"
            : feature.textColor &&
                feature.textColor.toLowerCase() !==
                  defaultFeatureStyle.textColor.toLowerCase()
              ? feature.textColor
              : undefined,
        objectAlign:
          feature.objectAlign ||
          (feature.type === "invitation-cover" ? "center" : "stretch"),
        objectWidth:
          feature.objectWidth ??
          (feature.type === "invitation-cover" ? 82 : 100),
        coverIcon:
          feature.coverIcon ||
          (feature.type === "invitation-cover" ? "mail" : undefined),
        coverIconSize:
          feature.coverIconSize ??
          (feature.type === "invitation-cover" ? 20 : undefined),
        coverIconPosition:
          feature.coverIconPosition ||
          (feature.type === "invitation-cover" ? "left" : undefined),
        coverVerticalAlign:
          feature.coverVerticalAlign ||
          (feature.type === "invitation-cover" ? "center" : undefined),
        coverExitEffect:
          feature.coverExitEffect ||
          (feature.type === "invitation-cover" ? "fade" : undefined),
        coverExitDuration:
          feature.coverExitDuration ??
          (feature.type === "invitation-cover" ? 700 : undefined),
        coverExitEasing:
          feature.coverExitEasing ||
          (feature.type === "invitation-cover" ? "ease" : undefined),
        autoplay:
          feature.autoplay ?? (feature.type === "sound" ? false : undefined),
        galleryFullWidth:
          feature.galleryFullWidth ??
          (feature.type === "gallery" ? false : undefined),
        galleryTransitionMs:
          feature.galleryTransitionMs ??
          (feature.type === "gallery" ? 850 : undefined),
        eyebrowText:
          feature.eyebrowText ||
          (feature.type === "invitation-cover"
            ? "UNDANGAN PERNIKAHAN"
            : undefined),
        guestLabelText:
          feature.guestLabelText ||
          (feature.type === "invitation-cover"
            ? "Kepada Yth. Bapak/Ibu/Saudara/i"
            : undefined),
        guestNameText:
          feature.guestNameText ||
          (feature.type === "invitation-cover" ? "Tamu Terhormat" : undefined),
      })),
    })),
  }));
}

/**
 * Menyalin canvas sebuah template menjadi section baru dengan id sendiri.
 *
 * Setiap salinan ditandai `templateInstanceId`, `sourceTemplateId`, dan
 * `sourceTemplateName` — tanda inilah yang dipakai buildWebsiteDesignGroups()
 * untuk mengelompokkan section menjadi satu card Website Design, sehingga satu
 * order = satu card.
 */
/**
 * Membaca rasio lebar/tinggi asli sebuah file gambar atau video.
 *
 * Dipakai saat upload background agar tinggi canvas bisa mengikuti rasli asli
 * desain. Mengembalikan undefined bila dimensinya tidak terbaca.
 */
function readMediaAspect(file: File): Promise<number | undefined> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const done = (value?: number) => {
      URL.revokeObjectURL(url);
      resolve(value && Number.isFinite(value) && value > 0 ? value : undefined);
    };
    if (file.type.startsWith("video/")) {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () =>
        done(video.videoWidth / Math.max(1, video.videoHeight));
      video.onerror = () => done(undefined);
      video.src = url;
      return;
    }
    const image = new Image();
    image.onload = () => done(image.naturalWidth / Math.max(1, image.naturalHeight));
    image.onerror = () => done(undefined);
    image.src = url;
  });
}

function buildSectionsFromTemplate(template: Template): CanvasSection[] {
  const sourceSections = template.canvasSections?.length
    ? hydrateSections(template.canvasSections)
    : buildTemplateSections(template.id);
  const templateInstanceId = uid("template-instance");
  return sourceSections.map((section) => ({
    ...section,
    id: uid("canvas"),
    name: section.name,
    templateInstanceId,
    sourceTemplateId: template.id,
    sourceTemplateName: template.name,
    columns: section.columns.map((column) => ({
      ...column,
      id: uid("column"),
      features: column.features.map((feature) => ({
        ...feature,
        id: uid(feature.type),
      })),
    })),
  }));
}

function buildTemplateSections(templateId: string): CanvasSection[] {
  const standard = (
    id: string,
    name: string,
    backgroundColor: string,
    columns: CanvasColumn[],
    minHeight = 420,
  ): CanvasSection => ({
    id,
    name,
    columns,
    backgroundColor,
    backgroundEffect: "none",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundGradientEnabled: false,
    backgroundGradientFrom: backgroundColor,
    backgroundGradientTo: "#d7b66f",
    backgroundGradientAngle: 135,
    backgroundMotion: "none",
    paddingX: 32,
    paddingY: 72,
    minHeight,
    layoutMode: "standard",
    invitees: sampleInvitees(),
  });
  if (templateId === "split-serenity") {
    const cover = standard(
      "split-cover",
      "Opening Cover",
      "#10231d",
      [
        {
          id: "split-cover-col",
          features: [
            {
              ...makeFeature("invitation-cover"),
              title: "Chyntia & Rian",
              body: "Dengan penuh kebahagiaan kami mengundang Anda",
              textColor: "#ffffff",
              backgroundColor: "rgba(0,0,0,.28)",
            },
          ],
        },
      ],
      760,
    );
    const split = standard(
      "split-story",
      "Fixed Story Canvas",
      "#111b17",
      [
        {
          id: "split-left",
          features: [
            {
              ...makeFeature(
                "text",
                "Chyntia & Rian",
                "Ardiani Safitri · Semarang",
              ),
              textColor: "#ffffff",
              fontSize: 58,
            },
            {
              ...makeFeature("quote", "Undangan Pernikahan", "20 · 08 · 2026"),
              textColor: "#f2e8d9",
            },
          ],
        },
        {
          id: "split-right",
          features: [
            { ...makeFeature("countdown"), textColor: "#ffffff" },
            {
              ...makeFeature(
                "event",
                "Akad & Resepsi",
                "Kamis, 20 Agustus 2026 · 09.00 WIB",
              ),
              textColor: "#ffffff",
            },
            { ...makeFeature("location"), textColor: "#ffffff" },
            { ...makeFeature("gallery"), textColor: "#ffffff" },
            { ...makeFeature("greetings"), textColor: "#ffffff" },
          ],
        },
      ],
      760,
    );
    split.layoutMode = "split-fixed-left";
    split.paddingY = 0;
    return [cover, split];
  }
  if (templateId === "cinematic-story") {
    return [
      standard(
        "cinema-cover",
        "Premiere Cover",
        "#070707",
        [
          {
            id: "cinema-cover-col",
            features: [
              {
                ...makeFeature(
                  "invitation-cover",
                  "THE WEDDING PREMIERE",
                  "Aurelia & Reynard",
                ),
                textColor: "#ffffff",
                backgroundColor: "rgba(0,0,0,.58)",
                buttonLabel: "Play Our Story",
              },
            ],
          },
        ],
        760,
      ),
      standard(
        "cinema-hero",
        "Featured Story",
        "#0b0b0b",
        [
          {
            id: "cinema-hero-col",
            features: [
              {
                ...makeFeature(
                  "text",
                  "A Love Story",
                  "Now streaming: 22 June 2026",
                ),
                textColor: "#ffffff",
                fontSize: 62,
              },
              { ...makeFeature("countdown"), textColor: "#ffffff" },
            ],
          },
        ],
        620,
      ),
      standard(
        "cinema-scenes",
        "Episodes & Moments",
        "#111111",
        [
          {
            id: "cinema-scenes-1",
            features: [
              {
                ...makeFeature(
                  "gallery",
                  "Season of Us",
                  "Our favorite scenes.",
                ),
                textColor: "#ffffff",
                galleryStyle: "filmstrip",
              },
            ],
          },
          {
            id: "cinema-scenes-2",
            features: [
              { ...makeFeature("location"), textColor: "#ffffff" },
              { ...makeFeature("greetings"), textColor: "#ffffff" },
            ],
          },
        ],
        560,
      ),
    ];
  }
  if (templateId === "storybook-magic") {
    return [
      standard(
        "story-cover",
        "Magic Gate",
        "#dceafa",
        [
          {
            id: "story-cover-col",
            features: [
              {
                ...makeFeature(
                  "invitation-cover",
                  "Once Upon Our Promise",
                  "Aurelia & Reynard invite you to their enchanted day",
                ),
                textColor: "#213b5c",
                backgroundColor: "rgba(255,255,255,.72)",
                buttonLabel: "Enter Our Story",
              },
            ],
          },
        ],
        760,
      ),
      standard(
        "story-hero",
        "Storybook Chapter",
        "#f6f0df",
        [
          {
            id: "story-hero-1",
            features: [
              {
                ...makeFeature(
                  "quote",
                  "Chapter One",
                  "Two hearts found their way home.",
                ),
                textColor: "#294664",
              },
            ],
          },
          {
            id: "story-hero-2",
            features: [{ ...makeFeature("countdown"), textColor: "#294664" }],
          },
        ],
        540,
      ),
      standard(
        "story-details",
        "Royal Celebration",
        "#dceafa",
        [
          {
            id: "story-details-1",
            features: [
              {
                ...makeFeature(
                  "event",
                  "The Royal Ceremony",
                  "22 June 2026 · 09.00 WIB",
                ),
                textColor: "#294664",
              },
            ],
          },
          {
            id: "story-details-2",
            features: [{ ...makeFeature("location"), textColor: "#294664" }],
          },
        ],
        480,
      ),
      standard(
        "story-wishes",
        "Wishes & Memories",
        "#f9f4e9",
        [
          {
            id: "story-wishes-col",
            features: [
              {
                ...makeFeature("gallery"),
                textColor: "#294664",
                galleryStyle: "carousel",
              },
              { ...makeFeature("greetings"), textColor: "#294664" },
            ],
          },
        ],
        620,
      ),
    ];
  }
  return hydrateSections(
    defaultSections.map((section) => ({
      ...section,
      id: uid("canvas"),
      columns: section.columns.map((column) => ({
        ...column,
        id: uid("column"),
        features: column.features.map((feature) => ({
          ...feature,
          id: uid(feature.type),
        })),
      })),
    })),
  );
}

function normalizeCoverSections(raw: CanvasSection[]): CanvasSection[] {
  const hydrated = hydrateSections(raw);
  let found = false;
  const cleaned = hydrated.map((section) => ({
    ...section,
    columns: section.columns.map((column) => ({
      ...column,
      features: column.features.filter((feature) => {
        if (feature.type !== "invitation-cover") return true;
        if (found) return false;
        found = true;
        return true;
      }),
    })),
  }));
  const coverIndex = cleaned.findIndex((section) =>
    section.columns.some((column) =>
      column.features.some((feature) => feature.type === "invitation-cover"),
    ),
  );
  if (coverIndex > 0) cleaned.unshift(cleaned.splice(coverIndex, 1)[0]);
  return cleaned;
}

function _loadSections(): CanvasSection[] {
  try {
    const saved =
      localStorage.getItem("ikrarku-site-v6") ||
      localStorage.getItem("ikrarku-site-v5") ||
      localStorage.getItem("ikrara-site-v3");
    if (!saved)
      return normalizeCoverSections(buildTemplateSections("split-serenity"));
    const parsed = JSON.parse(saved) as { sections?: CanvasSection[] };
    return Array.isArray(parsed.sections)
      ? normalizeCoverSections(parsed.sections)
      : normalizeCoverSections(buildTemplateSections("split-serenity"));
  } catch {
    return normalizeCoverSections(buildTemplateSections("split-serenity"));
  }
}

function loadSession(): { view: View; role: Role; accountId: string } {
  try {
    const saved = JSON.parse(
      localStorage.getItem("ikrarku-session-v7") || "null",
    ) as { view?: View; role?: Role; accountId?: string } | null;
    // Membuka "/" berarti pengunjung ingin landing page, walau sesi tersimpan
    // menunjuk halaman workspace.
    const atRoot =
      typeof window !== "undefined" &&
      window.location.pathname.replace(/^\/+|\/+$/g, "") === "";
    if (saved?.view && saved?.role && saved?.accountId)
      return {
        view: atRoot ? "landing" : saved.view,
        role: saved.role,
        accountId: saved.accountId,
      };
  } catch {
    /* ignore invalid session */
  }
  return { view: "landing", role: "User", accountId: "acc-user-demo" };
}

function _loadConversationStatuses(): Record<string, ConversationStatus> {
  try {
    return JSON.parse(
      localStorage.getItem("ikrarku-conversation-status-v7") || "{}",
    ) as Record<string, ConversationStatus>;
  } catch {
    return {};
  }
}

function playNotificationTone() {
  const AudioContextClass =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioContextClass) return;
  const context = new AudioContextClass();
  const gain = context.createGain();
  const osc = context.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(880, context.currentTime);
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.12, context.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.35);
  osc.connect(gain);
  gain.connect(context.destination);
  osc.start();
  osc.stop(context.currentTime + 0.38);
}

/**
 * Ruas pertama alamat halaman artikel: `/articles/<slug>`.
 *
 * Daftar jurnalnya tetap `/jurnal` — keduanya sengaja berbeda, jadi jangan
 * disatukan. Nilai ini harus sama dengan ARTICLE_PATH_PREFIX pada
 * server/index.mjs, yang dipakai untuk canonical, og:url, sitemap, dan
 * pengalihan 301 dari alamat lama.
 */
const ARTICLE_PATH_SEGMENT = "articles";
const articleHref = (slug: string) =>
  `/${ARTICLE_PATH_SEGMENT}/${encodeURIComponent(slug)}`;

function App() {
  const initialSession = useMemo(
    () =>
      localStorage.getItem("ikrarku-api-token")
        ? loadSession()
        : { view: "landing" as View, role: "User" as Role, accountId: "" },
    [],
  );
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>(initialSession.view);
  const [role, setRole] = useState<Role>(initialSession.role);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [templateCatalog, setTemplateCatalog] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(
    templates[0],
  );
  const [sections, setSections] = useState<CanvasSection[]>([]);
  const [slug, setSlug] = useState("");
  const [siteTitle, setSiteTitle] = useState("");
  const [saved, setSaved] = useState(false);
  const [accounts, setAccounts] = useState<AuthAccount[]>([]);
  const [currentAccountId, setCurrentAccountId] = useState(
    initialSession.accountId,
  );
  const [previewOpen, setPreviewOpen] = useState(false);
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [greetings, setGreetings] = useState<Greeting[]>([]);
  const [toast, setToast] = useState("");
  const [lastAuthError, setLastAuthError] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [managedUsers, setManagedUsers] = useState<ManagedUser[]>([]);
  const [articleItems, setArticleItems] = useState<ArticleItem[]>([]);
  const [soundCatalog, setSoundCatalog] = useState<SoundCatalogItem[]>([]);
  const [articleEditorId, setArticleEditorId] = useState<string>("new");
  // SEO — artikel yang sedang dibuka disimpan di level atas supaya punya URL
  // sendiri (/articles/<slug>). Sebelumnya reader hidup di useState lokal
  // JournalPage/LandingPage, jadi membuka artikel tidak mengubah URL sama
  // sekali: tidak bisa di-share, tidak bisa di-bookmark, tidak bisa dirayapi.
  const [articleSlug, setArticleSlug] = useState<string | null>(null);
  const [activeManagedUserId, setActiveManagedUserId] = useState("");
  const [siteOwnerUserId, setSiteOwnerUserId] = useState("");
  // TC-245 — akun otomatis setelah bayar wajib membuat password baru.
  const [mustChangePassword, setMustChangePassword] = useState(false);
  // MoM A9 — siapa dari tim yang terakhir membantu mengedit website customer.
  const [teamEdit, setTeamEdit] = useState<{ name: string; at: string } | null>(
    null,
  );
  const [selectedDashboardCanvasId, setSelectedDashboardCanvasId] = useState(
    sections[0]?.id || "",
  );
  const [confirmCanvasDeleteIds, setConfirmCanvasDeleteIds] = useState<
    string[]
  >([]);
  const [templateCreatorOpen, setTemplateCreatorOpen] = useState(false);
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(false);
  const [chatWidgetOpen, setChatWidgetOpen] = useState(false);
  const [publicTemplates, setPublicTemplates] = useState<Template[]>([]);
  const [selectedPublicTemplate, setSelectedPublicTemplate] =
    useState<Template | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [checkoutOrder, setCheckoutOrder] = useState<OrderResult | null>(null);
  const [landingScrollTarget, setLandingScrollTarget] = useState<string | null>(
    null,
  );
  const [notFound, setNotFound] = useState(false);
  const funnelPrevViewRef = useRef<View>("landing");
  const [lastPaidOrder, setLastPaidOrder] = useState<OrderResult | null>(null);
  const [taskItems, setTaskItems] = useState<TaskItem[]>([]);
  const [roleItems, setRoleItems] = useState<RoleItem[]>([]);
  const [databaseOnline, setDatabaseOnline] = useState(false);
  const [csMetricData, setCsMetricData] = useState({
    incoming: 0,
    replies: 0,
    active: 0,
    resolved: 0,
  });
  const [serverConversations, setServerConversations] = useState<any[]>([]);
  const [publicSiteData, setPublicSiteData] = useState<any | null>(null);
  const [contactableUsers, setContactableUsers] = useState<any[]>([]);
  const [editorMode, setEditorMode] = useState<"site" | "template">("site");
  const [orderAnalytics, setOrderAnalytics] = useState<OrderAnalytics>({
    summary: { qty: 0, nominal: 0, customers: 0 },
    rows: [],
  });
  const [myOrders, setMyOrders] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [notificationMuted, setNotificationMuted] = useState<boolean>(
    () => localStorage.getItem("ikrarku-notification-muted") === "true",
  );
  const notificationBaseline = useRef<{
    tasks: number;
    messages: number;
  } | null>(null);
  const customerSupportBaseline = useRef<number | null>(null);

  useEffect(() => {
    let active = true;
    const bootstrap = async () => {
      // Capture the path BEFORE any await — the title/URL effect may rewrite the address bar to '/'
      // on first paint, which would otherwise erase the slug before we can detect an unknown route.
      const rawPath = window.location.pathname.replace(/^\/+|\/+$/g, "");
      // Alamat artikel punya DUA segmen. pathSlug di bawah hanya pernah
      // menangani satu segmen, sehingga "articles/judul-artikel" tidak cocok
      // dengan daftar reserved, jatuh ke lookup public site, lalu 404.
      const pathParts = rawPath.split("/").filter(Boolean);
      // Alamat artikel adalah /articles/<slug>; daftar jurnalnya tetap
      // /jurnal. "jurnal" masih diterima di sini supaya tautan lama yang
      // dibuka langsung tetap menampilkan artikelnya walau server (atau
      // reverse proxy) belum sempat mengalihkan.
      const deepArticleSlug =
        pathParts.length === 2 &&
        (pathParts[0] === ARTICLE_PATH_SEGMENT || pathParts[0] === "jurnal")
          ? decodeURIComponent(pathParts[1])
          : null;
      const pathSlug = deepArticleSlug ? "jurnal" : rawPath;
      const reserved = new Set([
        "jurnal",
        "desain",
        "workspace",
        "",
        "login",
        "signup",
        "forgot-password",
        "reset-password",
        "verify-email",
        "dashboard",
        "templates",
        "template-detail",
        "pesan-sekarang",
        "pembayaran-berhasil",
        "articles",
        "settings",
        "admin",
        "orders",
        "my-orders",
        "users",
        "roles",
        "tasks",
        "audit-log",
        "help",
        "cs-dashboard",
        "customer-service",
        "sound-library",
        "commissions",
        "workspace",
        "journal",
        "designs",
        "payment-settings",
        "editor",
      ]);
      try {
        const data = await api.publicBootstrap();
        if (!active) return;
        const mappedTemplates = (data.templates || []).map((item: any) => ({
          ...item,
          preview: item.preview ? assetUrl(item.preview) : undefined,
          sampleImage: item.sampleImage
            ? assetUrl(item.sampleImage)
            : undefined,
          headerImage: item.headerImage
            ? assetUrl(item.headerImage)
            : undefined,
        })) as Template[];
        setPublicTemplates(mappedTemplates);
        setTemplateCatalog(mappedTemplates);
        if (mappedTemplates[0]) setSelectedTemplate(mappedTemplates[0]);
        setArticleItems(
          (data.articles || []).map((item: ArticleItem) => ({
            ...item,
            coverUrl: item.coverUrl ? assetUrl(item.coverUrl) : undefined,
          })),
        );
        setPaymentMethods(data.paymentMethods || []);
        setDatabaseOnline(true);
        let slugNotFound = false;
        if (pathSlug === "verify-email") setView("verify-email");
        if (pathSlug === "reset-password") setView("reset-password");
        if (pathSlug === "jurnal") {
          setView("journal");
          if (deepArticleSlug) setArticleSlug(deepArticleSlug);
        }
        if (pathSlug === "desain") setView("designs");
        if (pathSlug === "workspace") setView("dashboard");
        // Root selalu landing page, walau sesi login masih aktif. Workspace
        // dibuka lewat /workspace atau nama akun pada navigasi.
        if (!pathSlug) setView("landing");
        if (pathSlug === "forgot-password") setView("forgot-password");
        if (pathSlug && !reserved.has(pathSlug)) {
          try {
            const publicSite = await api.publicSite(pathSlug);
            setPublicSiteData({
              ...publicSite,
              sections: hydrateSections(publicSite.sections || []),
            });
          } catch {
            setPublicSiteData(null);
            slugNotFound = true;
            setNotFound(true);
          }
        }
        const token = localStorage.getItem("ikrarku-api-token");
        if (token) {
          try {
            const me = await api.me();
            const user = me.user;
            setMustChangePassword(Boolean(user.mustChangePassword));
            const mappedRole = (
              user.role === "Customer Service" ? "Customer Service" : user.role
            ) as Role;
            const account: AuthAccount = {
              id: user.id,
              name: user.name,
              firstName: user.firstName,
              lastName: user.lastName,
              username: user.username,
              password: "",
              role: mappedRole,
              email: user.email,
              permissions: user.permissions || [],
              settings: user.settings || {},
              emailVerified: user.emailVerified,
            };
            setAccounts([account]);
            setCurrentAccountId(user.id);
            setRole(mappedRole);
            if (mappedRole === "User") {
              setSiteOwnerUserId(user.id);
              setActiveManagedUserId(user.id);
            }
            const savedSession = (() => {
              try {
                return JSON.parse(
                  localStorage.getItem("ikrarku-session-v7") || "null",
                ) as { view?: View; role?: Role; accountId?: string } | null;
              } catch {
                return null;
              }
            })();
            const fallbackView: View =
              mappedRole === "Admin"
                ? "admin"
                : mappedRole === "Customer Service"
                  ? "cs-dashboard"
                  : "dashboard";
            const protectedView =
              savedSession?.accountId === user.id &&
              savedSession.view &&
              !["landing", "login", "signup", "verify-email"].includes(
                savedSession.view,
              )
                ? savedSession.view
                : fallbackView;
            // Membuka root berarti pengunjung memang ingin landing page,
            // jadi view tersimpan tidak dipulihkan di sana.
            if (pathSlug)
              setView((previous) =>
                previous === "landing" ? protectedView : previous,
              );
          } catch {
            setApiToken("");
            localStorage.removeItem("ikrarku-session-v7");
            setView("landing");
          }
        }
        if (slugNotFound) setView("not-found");
      } catch (error) {
        console.error(error);
        setDatabaseOnline(false);
      } finally {
        if (active) setLoading(false);
      }
    };
    void bootstrap();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (view === "landing" || view === "login" || view === "signup") return;
    localStorage.setItem(
      "ikrarku-session-v7",
      JSON.stringify({ view, role, accountId: currentAccountId }),
    );
  }, [view, role, currentAccountId]);

  const currentAccount =
    accounts.find((account) => account.id === currentAccountId) || accounts[0];
  useEffect(() => {
    const stored = currentAccount?.settings?.notificationSoundMuted;
    if (typeof stored === "boolean") {
      setNotificationMuted(stored);
      localStorage.setItem("ikrarku-notification-muted", String(stored));
    }
  }, [currentAccountId, currentAccount?.settings]);
  const hasPermission = (permission: string) =>
    Boolean(
      currentAccount?.permissions?.includes("*") ||
        currentAccount?.permissions?.includes(permission),
    );
  const permissionKey = (currentAccount?.permissions || []).join("|");

  useEffect(() => {
    if (!currentAccountId) return;
    const protectedPermissions = permissionKey ? permissionKey.split("|") : [];
    const permitted = (permission: string) =>
      protectedPermissions.includes("*") ||
      protectedPermissions.includes(permission);
    const loadProtected = async () => {
      try {
        const [serverTemplates, serverArticles] = await Promise.all([
          api.templates(),
          api.articles(),
        ]);
        setTemplateCatalog(
          serverTemplates.map((item: any) => ({
            ...item,
            preview: item.preview ? assetUrl(item.preview) : undefined,
            sampleImage: item.sampleImage
              ? assetUrl(item.sampleImage)
              : undefined,
            headerImage: item.headerImage
              ? assetUrl(item.headerImage)
              : undefined,
          })),
        );
        setArticleItems(
          serverArticles.map((item: ArticleItem) => ({
            ...item,
            coverUrl: item.coverUrl ? assetUrl(item.coverUrl) : undefined,
          })),
        );
        if (permitted("tasks.view")) {
          try {
            setTaskItems(await api.tasks());
          } catch {
            setTaskItems([]);
          }
        }
        try {
          const sounds = await api.sounds();
          setSoundCatalog(
            sounds.map((item: any) => ({
              id: item.id,
              name: item.name,
              category: item.category,
              description: item.description,
              builtIn: false,
              mediaUrl: item.url ? assetUrl(item.url) : undefined,
              fileName: item.fileName,
              createdAt: item.createdAt,
            })),
          );
        } catch {
          setSoundCatalog([]);
        }
        if (permitted("dashboard.cs") || permitted("conversations.view")) {
          try {
            setCsMetricData(await api.csMetrics());
          } catch {
            setCsMetricData({
              incoming: 0,
              replies: 0,
              active: 0,
              resolved: 0,
            });
          }
          try {
            setServerConversations(await api.conversations());
          } catch {
            setServerConversations([]);
          }
        }
        if (permitted("conversations.outbound")) {
          try {
            setContactableUsers(await api.contactableUsers());
          } catch {
            setContactableUsers([]);
          }
        }
        if (permitted("orders.view")) {
          try {
            setOrderAnalytics(await api.orderAnalytics());
          } catch {
            setOrderAnalytics({
              summary: { qty: 0, nominal: 0, customers: 0 },
              rows: [],
            });
          }
        }
        if (permitted("dashboard.user")) {
          try {
            setMyOrders(await api.myOrders());
          } catch {
            setMyOrders([]);
          }
        }
        if (protectedPermissions.includes("*")) {
          try {
            setAuditLogs(await api.auditLogs());
          } catch {
            setAuditLogs([]);
          }
        }
        if (permitted("users.view")) {
          try {
            const clients = await api.clients();
            setManagedUsers(
              clients.map((user: any) => ({
                id: user.id,
                name: user.name,
                email: user.email,
                siteTitle: user.siteTitle || user.name,
                slug: user.slug || "",
                assignedTo: user.assignedTo || "",
                assignedEditorId: user.assignedEditorId || "",
                status: user.assignedTo ? "Assigned" : "Unassigned",
                plan: "Free",
                canvasIds: user.canvasIds || [],
              })),
            );
          } catch {
            setManagedUsers([]);
          }
        }
        if (
          permitted("users.manage") ||
          permitted("roles.manage") ||
          permitted("settings.payment")
        ) {
          if (permitted("settings.payment"))
            try {
              setPaymentMethods(await api.paymentMethods());
            } catch {
              /* permission state handled by UI */
            }
          if (permitted("roles.manage"))
            try {
              setRoleItems(await api.roles());
            } catch {
              setRoleItems([]);
            }
          if (permitted("users.manage"))
            try {
              const serverUsers = await api.users();
              setAccounts(
                serverUsers.map((user: any) => ({
                  id: user.id,
                  name: user.name,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  username: user.username,
                  password: "",
                  role: user.role as Role,
                  email: user.email,
                  permissions: user.permissions || [],
                  settings: user.settings || {},
                  emailVerified: user.emailVerified,
                  active: user.active !== false,
                })),
              );
            } catch {
              /* keep current account */
            }
        }
        if (permitted("dashboard.user"))
          try {
            const site = await api.site();
            setTeamEdit(site?.teamEdit || null);
            if (site) {
              setSiteOwnerUserId(currentAccountId);
              setActiveManagedUserId(currentAccountId);
              setSiteTitle(site.title || "");
              setSlug(site.slug || "");
              setSections(hydrateSections(site.sections || []));
              if (site.templateId) {
                const match = serverTemplates.find(
                  (item: any) => item.id === site.templateId,
                );
                if (match) setSelectedTemplate(match);
              }
            }
          } catch {
            /* user site may not exist yet */
          }
        if (permitted("dashboard.user")) {
          try {
            const interactions = await api.siteInteractions();
            setGuests(interactions.guests || []);
            setGreetings(interactions.greetings || []);
          } catch {
            setGuests([]);
            setGreetings([]);
          }
        }
        try {
          const ownConversation = await api.myConversation();
          if (ownConversation?.conversation) {
            setChatMessages(
              (ownConversation.messages || []).map((message: any) => ({
                id: message.id,
                sender: message.sender_type === "support" ? "support" : "user",
                text: message.body,
                time: message.created_at,
                conversationId: currentAccountId,
                senderName:
                  message.sender_type === "support"
                    ? "ikrarku Support"
                    : currentAccount?.name || "User",
              })),
            );
          }
        } catch {
          /* no customer conversation yet */
        }
      } catch (error) {
        console.error(error);
      }
    };
    void loadProtected();
  }, [currentAccountId, role, permissionKey]);

  useEffect(() => {
    if (
      !currentAccountId ||
      view === "landing" ||
      view === "login" ||
      view === "signup" ||
      view === "verify-email"
    )
      return;
    let stopped = false;
    const poll = async () => {
      try {
        let nextTasks = taskItems.length;
        let nextMessages = serverConversations.reduce(
          (total, conv) =>
            total +
            (conv.messages || []).filter(
              (message: any) => message.sender_type !== "support",
            ).length,
          0,
        );
        if (hasPermission("tasks.view")) {
          const fresh = await api.tasks();
          if (!stopped) {
            setTaskItems(fresh);
            nextTasks = fresh.filter(
              (task: any) =>
                !["Done", "Cancelled", "Approved", "Rejected"].includes(
                  task.status,
                ),
            ).length;
          }
        }
        if (hasPermission("conversations.view")) {
          const fresh = await api.conversations();
          if (!stopped) {
            setServerConversations(fresh);
            nextMessages = fresh.reduce(
              (total: number, conv: any) =>
                total +
                (conv.messages || []).filter(
                  (message: any) => message.sender_type !== "support",
                ).length,
              0,
            );
            try {
              setCsMetricData(await api.csMetrics());
            } catch {
              /* ignore */
            }
          }
        }
        const previous = notificationBaseline.current;
        if (
          previous &&
          (nextTasks > previous.tasks || nextMessages > previous.messages) &&
          !notificationMuted
        ) {
          playNotificationTone();
          flash(
            nextMessages > previous.messages
              ? "Pesan baru masuk ke Customer Service."
              : "Task baru masuk ke dashboard.",
          );
        }
        notificationBaseline.current = {
          tasks: nextTasks,
          messages: nextMessages,
        };
      } catch {
        /* polling remains silent while API is unavailable */
      }
    };
    void poll();
    const interval = window.setInterval(() => void poll(), 10000);
    return () => {
      stopped = true;
      window.clearInterval(interval);
    };
  }, [currentAccountId, view, notificationMuted, permissionKey]);

  const refreshMyChat = useCallback(
    async (notify = true) => {
      if (!currentAccountId) return;
      try {
        const own = await api.myConversation();
        if (!own?.conversation) return;
        const mapped = (own.messages || []).map((message: any) => ({
          id: message.id,
          sender: message.sender_type === "support" ? "support" : "user",
          text: message.body,
          time: message.created_at,
          conversationId: currentAccountId,
          senderName:
            message.sender_type === "support"
              ? "ikrarku Support"
              : currentAccount?.name || "User",
        }));
        setChatMessages((previousMessages) => {
          const otherThreads = previousMessages.filter(
            (message) =>
              (message.conversationId || currentAccountId) !== currentAccountId,
          );
          return [...otherThreads, ...mapped];
        });
        const supportCount = mapped.filter(
          (message: any) => message.sender === "support",
        ).length;
        const previousSupport = customerSupportBaseline.current;
        if (
          notify &&
          previousSupport !== null &&
          supportCount > previousSupport &&
          !notificationMuted
        ) {
          playNotificationTone();
          flash("Balasan baru dari ikrarku Support.");
        }
        customerSupportBaseline.current = supportCount;
      } catch {
        /* customer conversation optional */
      }
    },
    [currentAccountId, currentAccount, notificationMuted],
  );

  useEffect(() => {
    if (
      !currentAccountId ||
      view === "landing" ||
      view === "login" ||
      view === "signup" ||
      view === "verify-email"
    )
      return;
    let stopped = false;
    const tick = async () => {
      if (!stopped) await refreshMyChat();
    };
    void tick();
    const interval = window.setInterval(
      () => void tick(),
      chatWidgetOpen ? 2500 : 8000,
    );
    return () => {
      stopped = true;
      window.clearInterval(interval);
    };
  }, [currentAccountId, view, chatWidgetOpen, refreshMyChat]);

  // Guest (landing widget) chat: poll the public conversation so admin/CS replies appear without login.
  const refreshGuestChat = useCallback(async () => {
    const publicToken = localStorage.getItem("ikrarku-public-chat-token");
    if (!publicToken) return;
    try {
      const data = await api.publicConversation(publicToken);
      if (!data?.conversation) return;
      const mapped = (data.messages || []).map((message: any) => ({
        id: message.id,
        sender:
          message.sender_type === "support" || message.sender_type === "system"
            ? "support"
            : "user",
        text: message.body,
        time: new Date(message.created_at).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        conversationId: "guest",
        senderName:
          message.sender_type === "support"
            ? "ikrarku Support"
            : "Website Visitor",
      }));
      setChatMessages((previous) => {
        const others = previous.filter(
          (message) => (message.conversationId || "guest") !== "guest",
        );
        return [...others, ...mapped];
      });
    } catch {
      /* ignore */
    }
  }, []);
  useEffect(() => {
    if (localStorage.getItem("ikrarku-api-token")) return;
    let stopped = false;
    const tick = async () => {
      if (!stopped) await refreshGuestChat();
    };
    void tick();
    const interval = window.setInterval(
      () => void tick(),
      chatWidgetOpen ? 2500 : 9000,
    );
    return () => {
      stopped = true;
      window.clearInterval(interval);
    };
  }, [view, chatWidgetOpen, refreshGuestChat]);

  // Browser back button support for the public order funnel (template-detail / checkout / payment-success)
  useEffect(() => {
    const funnel = new Set<View>([
      "template-detail",
      "checkout",
      "payment-success",
      "login",
      "signup",
    ]);
    if (funnel.has(view) && !funnel.has(funnelPrevViewRef.current))
      window.history.pushState({ ikrarkuFunnel: true }, "");
    funnelPrevViewRef.current = view;
  }, [view]);
  useEffect(() => {
    const funnel = new Set<View>([
      "template-detail",
      "checkout",
      "payment-success",
      "login",
      "signup",
    ]);
    const onPop = () => {
      if (funnel.has(funnelPrevViewRef.current)) {
        const cur = funnelPrevViewRef.current;
        if (
          cur === "template-detail" ||
          cur === "checkout" ||
          cur === "payment-success"
        )
          setLandingScrollTarget("templates");
        setView("landing");
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // SEO — Back/Forward harus membuka & menutup artikel sesuai URL.
  useEffect(() => {
    const syncArticleFromUrl = () => {
      const parts = window.location.pathname
        .replace(/^\/+|\/+$/g, "")
        .split("/")
        .filter(Boolean);
      setArticleSlug(
        parts.length === 2 &&
          (parts[0] === ARTICLE_PATH_SEGMENT || parts[0] === "jurnal")
          ? decodeURIComponent(parts[1])
          : null,
      );
    };
    window.addEventListener("popstate", syncArticleFromUrl);
    return () => window.removeEventListener("popstate", syncArticleFromUrl);
  }, []);

  // Per-view browser tab title and address-bar path (TC-018 SEO / URL relevance)
  useEffect(() => {
    const titles: Partial<Record<View, string>> = {
      commissions: "Komisi & Share Fee - ikrarku Sites",
      journal: "Jurnal ikrarku - ikrarku Sites",
      designs: "Semua Desain Undangan - ikrarku Sites",
      landing: "ikrarku Sites - Wedding Website & Undangan Digital",
      login: "Masuk - ikrarku Sites",
      signup: "Daftar Akun - ikrarku Sites",
      "verify-email": "Verifikasi Email - ikrarku Sites",
      "forgot-password": "Lupa Password - ikrarku Sites",
      "reset-password": "Reset Password - ikrarku Sites",
      "not-found": "Halaman tidak ditemukan - ikrarku Sites",
      templates: "Templates - ikrarku Sites",
      "template-detail": "Detail Template - ikrarku Sites",
      checkout: "Pesan Sekarang - ikrarku Sites",
      "payment-success": "Pembayaran Berhasil - ikrarku Sites",
      articles: "ikrarku Journal - ikrarku Sites",
      dashboard: "Dashboard - ikrarku Sites",
      admin: "Administrator - ikrarku Sites",
      "cs-dashboard": "Customer Service - ikrarku Sites",
      "customer-service": "Support Inbox - ikrarku Sites",
    };
    // SEO — artikel yang sedang terbuka mengambil alih judul & meta tag.
    const openArticle = articleSlug
      ? articleItems.find((item) => item.slug === articleSlug)
      : undefined;
    if (openArticle) {
      document.title = `${openArticle.title} - Jurnal ikrarku`;
      applyArticleMeta(openArticle);
    } else {
      document.title = titles[view] || "ikrarku Sites";
      applyArticleMeta(null);
    }
    if (notFound || publicSiteData) return;
    const appPaths = new Set([
      "/login",
      "/signup",
      "/forgot-password",
      "/reset-password",
      "/verify-email",
      "/templates",
      "/pesan-sekarang",
      "/pembayaran-berhasil",
      "/articles",
      "/jurnal",
      "/desain",
      "/workspace",
    ]);
    // Halaman bertoken tidak boleh dibersihkan sebelum komponennya sempat
    // membaca query string.
    const tokenPaths = new Set(["/reset-password", "/verify-email"]);
    // Pathname artikel punya dua ruas (`/articles/<slug>`), sedangkan appPaths
    // hanya memuat ruas pertama. Tanpa pengenal ini URL artikel tidak pernah
    // dianggap "milik aplikasi" dan karena itu tidak pernah dibersihkan.
    const isArticlePathname = new RegExp(
      `^/(${ARTICLE_PATH_SEGMENT}|jurnal)/[^/]+/?$`,
    ).test(window.location.pathname);
    if (view === "landing") {
      // Artikel bisa dibuka langsung dari carousel landing. Tanpa cabang ini
      // URL-nya langsung dibersihkan kembali ke "/".
      if (articleSlug) {
        const articleUrl = articleHref(articleSlug);
        if (window.location.pathname !== articleUrl)
          try {
            // pushState, bukan replaceState: tombol Back browser harus
            // menutup artikel dan kembali ke landing, bukan keluar dari situs.
            window.history.pushState(window.history.state, "", articleUrl);
          } catch {
            /* ignore */
          }
        return;
      }
      if (
        (appPaths.has(window.location.pathname) || isArticlePathname) &&
        !(
          tokenPaths.has(window.location.pathname) &&
          initialSearchParams.get("token")
        )
      ) {
        try {
          window.history.replaceState(window.history.state, "", "/");
        } catch {
          /* ignore */
        }
      }
      return;
    }
    const paths: Partial<Record<View, string>> = {
      login: "/login",
      signup: "/signup",
      "verify-email": "/verify-email",
      "forgot-password": "/forgot-password",
      "reset-password": "/reset-password",
      templates: "/templates",
      "template-detail": "/templates",
      checkout: "/pesan-sekarang",
      "payment-success": "/pembayaran-berhasil",
      articles: "/articles",
      journal: "/jurnal",
      designs: "/desain",
    };
    const workspaceViews: View[] = [
      "dashboard",
      "orders",
      "my-orders",
      "users",
      "roles",
      "tasks",
      "audit-log",
      "help",
      "cs-dashboard",
      "customer-service",
      "sound-library",
      "commissions",
      "payment-settings",
      "settings",
      "editor",
    ];
    // Daftar jurnal tetap di /jurnal; artikel yang terbuka pindah ke
    // /articles/<slug>, jadi alamatnya berganti ruas pertama, bukan hanya
    // bertambah slug.
    const target = workspaceViews.includes(view)
      ? "/workspace"
      : articleSlug && view === "journal"
        ? articleHref(articleSlug)
        : paths[view];
    if (target && window.location.pathname !== target) {
      try {
        // Membuka artikel menambah entri history supaya tombol Back menutup
        // artikel, bukan melempar pengguna keluar dari situs. Perpindahan
        // antar view lain tetap replaceState seperti sebelumnya.
        const isArticleTarget = target.startsWith(`/${ARTICLE_PATH_SEGMENT}/`);
        (isArticleTarget
          ? window.history.pushState
          : window.history.replaceState
        ).call(
          window.history,
          window.history.state,
          "",
          target + window.location.search,
        );
      } catch {
        /* ignore */
      }
    }
  }, [view, notFound, publicSiteData, articleSlug, articleItems]);

  const editorSnapshotRef = useRef({
    view,
    siteTitle,
    sections,
  });
  useEffect(() => {
    editorSnapshotRef.current = { view, siteTitle, sections };
  }, [view, siteTitle, sections]);

  // QA TC-101: sesi otomatis berakhir setelah idle, walau browser ditutup tanpa logout.
  useEffect(() => {
    if (!currentAccountId) return;
    const IDLE_MS =
      Number(import.meta.env.VITE_SESSION_IDLE_MINUTES || 120) * 60_000;
    const KEY = "ikrarku-last-activity";
    const expire = () => {
      // TC-149: pekerjaan editor yang belum tersimpan diamankan dulu sebelum
      // sesi dibersihkan, supaya tidak hilang saat idle timeout.
      const snapshot = editorSnapshotRef.current;
      if (snapshot.view === "editor")
        backupEditorDraft(snapshot.siteTitle, snapshot.sections);
      localStorage.removeItem(KEY);
      setApiToken("");
      localStorage.removeItem("ikrarku-session-v7");
      setCurrentAccountId("");
      setAccounts([]);
      setRole("User");
      setView("login");
      setToast(
        "Sesi berakhir karena tidak ada aktivitas. Silakan login kembali.",
      );
    };
    const stamp = Number(localStorage.getItem(KEY) || 0);
    if (stamp && Date.now() - stamp > IDLE_MS) {
      expire();
      return;
    }
    const touch = () => localStorage.setItem(KEY, String(Date.now()));
    touch();
    const events = ["pointerdown", "keydown", "scroll", "visibilitychange"];
    events.forEach((name) =>
      window.addEventListener(name, touch, { passive: true }),
    );
    const timer = window.setInterval(() => {
      const last = Number(localStorage.getItem(KEY) || 0);
      if (last && Date.now() - last > IDLE_MS) expire();
    }, 30_000);
    return () => {
      events.forEach((name) => window.removeEventListener(name, touch));
      window.clearInterval(timer);
    };
  }, [currentAccountId]);

  const refreshPublicCatalog = useCallback(async () => {
    try {
      const data = await api.publicBootstrap();
      const mapped = (data.templates || []).map((item: any) => ({
        ...item,
        preview: item.preview ? assetUrl(item.preview) : undefined,
        sampleImage: item.sampleImage ? assetUrl(item.sampleImage) : undefined,
        headerImage: item.headerImage ? assetUrl(item.headerImage) : undefined,
      })) as Template[];
      setPublicTemplates(mapped);
    } catch {
      /* pertahankan katalog lama bila request gagal */
    }
  }, []);
  useEffect(() => {
    if (view !== "landing" && view !== "templates") return;
    void refreshPublicCatalog();
  }, [view, refreshPublicCatalog]);

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2300);
  };

  // ---- Manage Canvas: order customer sebagai sumber canvas (item 3 & 9) ----
  const canvasOrderOptions = useMemo(
    () => buildCanvasOrderOptions(taskItems),
    [taskItems],
  );
  const [canvasOrderBusy, setCanvasOrderBusy] = useState(false);
  // Menu Canvas Editor menampilkan pemilih order selama Web Designer belum
  // memilih customer dan belum ada canvas yang terbuka.
  const needsCanvasOrderPick =
    view === "editor" &&
    role === "Editor" &&
    !siteOwnerUserId &&
    !sections.length;
  const openCanvasOrder = async (
    option: CanvasOrderOption,
    openEditor = true,
  ) => {
    if (canvasOrderBusy) return;
    setCanvasOrderBusy(true);
    try {
      await manageUserCanvas(option.customerUserId, {
        seedTemplateId: option.templateId,
        openEditor,
      });
    } finally {
      setCanvasOrderBusy(false);
    }
  };

  const applyTemplate = (template: Template) => {
    setEditorMode("site");
    const nextSections = normalizeCoverSections(
      buildSectionsFromTemplate(template),
    );
    const firstNewId = nextSections[0]?.id || "";
    setSelectedTemplate(template);
    // Web Designer memakai Use template untuk merancang template, bukan website
    // ber-URL. Kolom slug hanya relevan untuk website customer.
    if (role === "Editor" && !siteOwnerUserId) setEditorMode("template");
    setSections(nextSections);
    // Judul ikut template yang baru dipakai; sebelumnya masih memakai nama
    // template lama sehingga kartu di Templates & Approval terlihat salah.
    setSiteTitle(template.name);
    setSelectedDashboardCanvasId(firstNewId);
    setGuests([]);
    sessionStorage.setItem("ikrarku-edit-canvas", firstNewId);
    setView("editor");
    flash(`Template ${template.name} dipakai sebagai design website.`);
  };

  // addBlankCanvasFromTemplates() dihapus. Tombol Add Canvas menambahkan satu
  // section kosong ke state tanpa pernah menyimpannya, sehingga setiap kali
  // ditekan lalu ditinggalkan, autosave membuat draft baru lagi. Penggantinya
  // adalah dropdown Manage Canvas yang memuat canvas dari order customer.

  const deleteCanvasFromTemplates = (sectionIds: string[]) => {
    setConfirmCanvasDeleteIds(sectionIds);
  };

  const performDeleteCanvas = () => {
    if (!confirmCanvasDeleteIds.length) return;
    const deleting = new Set(confirmCanvasDeleteIds);
    const nextSections = sections.filter(
      (section) => !deleting.has(section.id),
    );
    setSections(nextSections);
    setSelectedDashboardCanvasId((previous) =>
      deleting.has(previous) ? nextSections[0]?.id || "" : previous,
    );
    setConfirmCanvasDeleteIds([]);
    flash("Design berhasil dihapus dari website.");
  };

  const duplicateCanvasFromTemplates = (sectionIds: string[]) => {
    const sources = sections.filter((section) =>
      sectionIds.includes(section.id),
    );
    if (!sources.length) return;
    const nextInstanceId = uid("template-instance");
    const siteAlreadyHasCover = sections.some((section) =>
      section.columns.some((column) =>
        column.features.some((feature) => feature.type === "invitation-cover"),
      ),
    );
    const duplicates: CanvasSection[] = sources.map((source) => ({
      ...source,
      id: uid("canvas"),
      name: `${source.name} Copy`,
      templateInstanceId: nextInstanceId,
      columns: source.columns.map((column) => ({
        ...column,
        id: uid("column"),
        features: column.features
          .filter(
            (feature) =>
              !(siteAlreadyHasCover && feature.type === "invitation-cover"),
          )
          .map((feature) => ({ ...feature, id: uid(feature.type) })),
      })),
      invitees: source.invitees.map((item) => ({
        ...item,
        id: uid("invitee"),
      })),
    }));
    setSections((previous) =>
      normalizeCoverSections([...previous, ...duplicates]),
    );
    flash("Template design berhasil diduplikasi sebagai satu group baru.");
  };

  const editCanvasFromTemplates = (
    sectionId: string,
    designTemplate?: Template,
  ) => {
    // Simpan dalam mode template menulis ke `selectedTemplate`. Card yang
    // diklik sudah tahu template miliknya, jadi ikat dulu supaya tidak
    // menimpa template lain yang kebetulan sedang terpilih.
    if (designTemplate && designTemplate.id !== selectedTemplate.id)
      setSelectedTemplate(designTemplate);
    // Card "Template pada website" juga tampil ketika Web Designer sedang
    // mengerjakan template-nya sendiri — `websiteDesigns` dibentuk dari
    // `sections` yang sedang dimuat, apa pun sumbernya. Dulu mode dipaksa
    // "site", sehingga membuka template lewat card ini memunculkan kolom
    // slug dan meminta URL publik untuk sesuatu yang tidak punya URL.
    // Penanda yang benar adalah ada/tidaknya pemilik website, sama seperti
    // yang dipakai manageUserCanvas().
    setEditorMode(siteOwnerUserId ? "site" : "template");
    sessionStorage.setItem("ikrarku-edit-canvas", sectionId);
    setView("editor");
  };

  const login = async (username: string, password: string) => {
    try {
      const result = await api.login(username, password);
      setApiToken(result.token);
      localStorage.setItem("ikrarku-last-activity", String(Date.now()));
      const user = result.user;
      setMustChangePassword(Boolean(user.mustChangePassword));
      const mappedRole = user.role as Role;
      const account: AuthAccount = {
        id: user.id,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        password: "",
        role: mappedRole,
        email: user.email,
        permissions: user.permissions || [],
        settings: user.settings || {},
        emailVerified: user.emailVerified,
      };
      setAccounts([account]);
      setCurrentAccountId(user.id);
      setRole(mappedRole);
      if (mappedRole === "User") {
        setSiteOwnerUserId(user.id);
        setActiveManagedUserId(user.id);
      }
      const checkoutReturn =
        sessionStorage.getItem("ikrarku-checkout-return") === "true";
      const nextView: View =
        checkoutReturn && mappedRole === "User" && selectedPublicTemplate
          ? "checkout"
          : user.permissions?.includes("*")
            ? "admin"
            : user.permissions?.includes("dashboard.cs")
              ? "cs-dashboard"
              : "dashboard";
      if (nextView === "checkout")
        sessionStorage.removeItem("ikrarku-checkout-return");
      setView(nextView);
      localStorage.setItem(
        "ikrarku-session-v7",
        JSON.stringify({
          view: nextView,
          role: mappedRole,
          accountId: user.id,
        }),
      );
      flash(`Selamat datang, ${user.name}.`);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login gagal.";
      flash(message);
      setLastAuthError(message);
      return false;
    }
  };

  const signupAccount = async (
    name: string,
    username: string,
    password: string,
    passwordConfirm: string,
    email: string,
  ) => {
    try {
      const [firstName, ...restName] = name.trim().split(/\s+/);
      const result = await api.signup({
        firstName: firstName || "User",
        lastName: restName.join(" "),
        email,
        username,
        password,
        passwordConfirm,
      });
      flash("Registrasi berhasil. Silakan verifikasi email sebelum login.");
      return {
        ok: true,
        devVerificationUrl: result.devVerificationUrl as string | undefined,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Registrasi gagal.";
      flash(message);
      return { ok: false, error: message };
    }
  };

  // QA TC-102: Administrator memperbarui data diri dan mereset password akun lain.
  const updateManagedAccount = async (
    userId: string,
    payload: Record<string, unknown>,
  ) => {
    try {
      await api.updateUser(userId, payload);
      try {
        const serverUsers = await api.users();
        setAccounts(
          serverUsers.map((user: any) => ({
            id: user.id,
            name: user.name,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            password: "",
            role: user.role as Role,
            email: user.email,
            permissions: user.permissions || [],
            settings: user.settings || {},
            emailVerified: user.emailVerified,
            active: user.active !== false,
          })),
        );
      } catch {
        /* daftar akan refresh berikutnya */
      }
      flash(
        payload.password
          ? "Password user berhasil direset. Sesi lama otomatis dicabut."
          : payload.active === false
            ? "Akun dinonaktifkan. User tidak dapat login sampai diaktifkan lagi."
            : payload.active === true
              ? "Akun diaktifkan kembali."
              : "Data user berhasil diperbarui.",
      );
      return true;
    } catch (error) {
      flash(error instanceof Error ? error.message : "Gagal memperbarui akun.");
      return false;
    }
  };

  const createAccount = async (
    name: string,
    username: string,
    password: string,
    accountRole: Role,
    email: string,
  ) => {
    try {
      const [firstName, ...restName] = name.trim().split(/\s+/);
      const roles = roleItems.length ? roleItems : await api.roles();
      const roleMatch = roles.find((item) => item.name === accountRole);
      if (!roleMatch) throw new Error("Role belum tersedia di database.");
      await api.createUser({
        firstName: firstName || "User",
        lastName: restName.join(" "),
        email,
        username,
        password,
        roleId: roleMatch.id,
      });
      try {
        const serverUsers = await api.users();
        setAccounts(
          serverUsers.map((user: any) => ({
            id: user.id,
            name: user.name,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            password: "",
            role: user.role as Role,
            email: user.email,
            permissions: user.permissions || [],
            settings: user.settings || {},
            emailVerified: user.emailVerified,
          })),
        );
      } catch {
        /* list will refresh on next load */
      }
      flash("Akun berhasil dibuat oleh Admin dan dapat digunakan untuk login.");
      return true;
    } catch (error) {
      flash(error instanceof Error ? error.message : "Gagal membuat akun.");
      return false;
    }
  };

  const saveArticles = async (
    article: Omit<ArticleItem, "id" | "date" | "views">,
    existingId?: string,
  ) => {
    try {
      const payload = { ...article, coverUrl: article.coverUrl || null };
      const item = existingId
        ? await api.updateArticle(existingId, payload)
        : await api.createArticle(payload);
      setArticleItems((previous) =>
        existingId
          ? previous.map((value) => (value.id === existingId ? item : value))
          : [item, ...previous],
      );
      flash(
        article.status === "Published"
          ? "Article berhasil dipublikasikan."
          : "Article berhasil disimpan sebagai draft.",
      );
      setView("articles");
    } catch (error) {
      flash(
        error instanceof Error ? error.message : "Gagal menyimpan article.",
      );
    }
  };

  const openArticleEditor = (id = "new") => {
    setArticleEditorId(id);
    setView("article-editor");
  };

  // QA TC-173 — takedown/publish artikel langsung dari list, tanpa membuka editor.
  const toggleArticleStatus = async (article: ArticleItem, next: string) => {
    try {
      const updated = await api.updateArticle(article.id, { status: next });
      setArticleItems((previous) =>
        previous.map((item) =>
          item.id === article.id ? { ...item, ...updated } : item,
        ),
      );
      flash(
        next === "Published"
          ? `Artikel "${article.title}" dipublikasikan.`
          : `Artikel "${article.title}" ditarik dari publikasi.`,
      );
    } catch (error) {
      flash(
        error instanceof Error ? error.message : "Gagal mengubah status artikel.",
      );
    }
  };

  // QA TC-174 — hapus artikel permanen dari Articles CMS.
  const deleteArticle = async (article: ArticleItem) => {
    try {
      await api.deleteArticle(article.id);
      setArticleItems((previous) =>
        previous.filter((item) => item.id !== article.id),
      );
      flash(`Artikel "${article.title}" dihapus.`);
    } catch (error) {
      flash(
        error instanceof Error ? error.message : "Gagal menghapus artikel.",
      );
    }
  };

  const addSoundToCatalog = async (
    name: string,
    category: string,
    description: string,
    file: File,
  ) => {
    if (!file.type.startsWith("audio/") && !file.type.startsWith("video/")) {
      flash("Sound harus berupa audio atau MP4/video dengan audio.");
      return false;
    }
    if (file.size > 15 * 1024 * 1024) {
      flash("File sound maksimal 15 MB.");
      return false;
    }
    try {
      const form = new FormData();
      form.append("name", name);
      form.append("category", category);
      form.append("description", description);
      form.append("file", file);
      const saved = await api.uploadSound(form);
      const item: SoundCatalogItem = {
        id: saved.id,
        name: saved.name,
        category,
        description,
        builtIn: false,
        mediaUrl: assetUrl(saved.url),
        fileName: file.name,
        createdAt: new Intl.DateTimeFormat("id-ID", {
          dateStyle: "medium",
        }).format(new Date()),
      };
      setSoundCatalog((previous) => [item, ...previous]);
      flash("Sound berhasil ditambahkan ke database catalog.");
      return true;
    } catch (error) {
      flash(error instanceof Error ? error.message : "Gagal mengunggah sound.");
      return false;
    }
  };

  const deleteSoundFromCatalog = (id: string) => {
    const item = soundCatalog.find((sound) => sound.id === id);
    if (item?.builtIn) {
      flash("Built-in sound tidak dapat dihapus.");
      return;
    }
    void api
      .deleteSound(id)
      .then(() => {
        setSoundCatalog((previous) =>
          previous.filter((sound) => sound.id !== id),
        );
        flash("Sound dihapus dari database catalog.");
      })
      .catch((error) =>
        flash(
          error instanceof Error ? error.message : "Gagal menghapus sound.",
        ),
      );
  };

  const changeUserRole = async (userId: string, roleId: string) => {
    try {
      await api.setUserRole(userId, roleId);
      const serverUsers = await api.users();
      setAccounts(
        serverUsers.map((user: any) => ({
          id: user.id,
          name: user.name,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          password: "",
          role: user.role as Role,
          email: user.email,
          permissions: user.permissions || [],
        })),
      );
      flash("Role user berhasil diperbarui.");
    } catch (error) {
      flash(error instanceof Error ? error.message : "Gagal memperbarui role.");
    }
  };

  const deleteAccount = async (userId: string) => {
    try {
      await api.deleteUser(userId);
      setAccounts((previous) =>
        previous.filter((account) => account.id !== userId),
      );
      flash("Akun berhasil dihapus.");
    } catch (error) {
      flash(error instanceof Error ? error.message : "Gagal menghapus akun.");
    }
  };
  const assignClient = async (userId: string, editorId?: string) => {
    try {
      await api.assignClient(userId, editorId || currentAccountId);
      const clients = await api.clients();
      setManagedUsers(
        clients.map((item: any) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          siteTitle: item.siteTitle || item.name,
          slug: item.slug || "",
          assignedTo: item.assignedTo || "",
          assignedEditorId: item.assignedEditorId || "",
          status: item.assignedTo ? "Assigned" : "Unassigned",
          plan: "Free",
          canvasIds: item.canvasIds || [],
        })),
      );
      flash(
        editorId
          ? "Assignment Customer diperbarui."
          : "Customer berhasil di-assign ke Web Designer aktif.",
      );
    } catch (error) {
      flash(
        error instanceof Error ? error.message : "Gagal melakukan assignment.",
      );
    }
  };

  // notifyCustomerTaskStatus() dihapus. Notifikasi perubahan status dikirim
  // server pada PATCH /api/tasks/:id, sehingga berlaku untuk semua jalur
  // pengubahan status dan tidak mengirim dua pesan untuk satu perubahan.

  // Menu Canvas Editor selalu membuka ruang kerja Web Designer sendiri.
  // Konteks website customer hanya aktif lewat Manage Canvas.
  const resetEditorWorkspace = () => {
    if (!siteOwnerUserId && editorMode !== "site") return;
    setSiteOwnerUserId("");
    setActiveManagedUserId("");
    setEditorMode("template");
    setSections([]);
    setSiteTitle("");
    setSlug("");
  };

  /**
   * Membuka canvas milik seorang customer pada ruang kerja Web Designer.
   *
   * @param options.seedTemplateId Template yang dipesan customer. Dipakai hanya
   *   ketika website customer masih kosong: canvas template itu di-load sebagai
   *   titik awal supaya Web Designer tidak mulai dari canvas kosong.
   * @param options.openEditor  false untuk memuat canvas tanpa langsung pindah
   *   ke Canvas Editor — dipakai oleh dropdown Manage Canvas pada halaman
   *   Templates, supaya hasilnya muncul dulu sebagai card Website Design.
   */
  const manageUserCanvas = async (
    userId: string,
    options: { seedTemplateId?: string; openEditor?: boolean } = {},
  ) => {
    const { seedTemplateId, openEditor = true } = options;
    // Customer dari task bisa saja belum tercatat pada daftar assignment lokal,
    // jadi jangan berhenti diam-diam — ambil datanya langsung dari server.
    const user = managedUsers.find((item) => item.id === userId);
    try {
      if (user && !user.assignedEditorId && role === "Editor") {
        await api.assignClient(userId, currentAccountId);
      }
      const site = await api.clientSite(userId);
      if (!site && !user) {
        flash("Canvas customer ini belum tersedia atau bukan tanggung jawab Anda.");
        return;
      }
      setActiveManagedUserId(userId);
      setSiteOwnerUserId(userId);
      // Template yang dipesan customer: dipakai untuk judul dan sebagai sumber
      // canvas awal bila website-nya belum pernah diisi.
      const orderedTemplate = seedTemplateId
        ? templateCatalog.find((item) => item.id === seedTemplateId)
        : undefined;
      const existingSections = site?.sections || [];
      const seedSections =
        !existingSections.length && orderedTemplate?.canvasSections?.length
          ? buildSectionsFromTemplate(orderedTemplate)
          : [];
      const nextSections = existingSections.length
        ? existingSections
        : seedSections;
      setSiteTitle(
        site?.title ||
          user?.siteTitle ||
          user?.name ||
          orderedTemplate?.name ||
          "Website customer",
      );
      setSlug(
        site?.slug ||
          user?.slug ||
          (user?.email || "customer")
            .split("@")[0]
            .replace(/[^a-z0-9-]/gi, "-")
            .toLowerCase(),
      );
      setSections(hydrateSections(nextSections));
      const activeTemplate =
        (site?.templateId &&
          templateCatalog.find((item) => item.id === site.templateId)) ||
        orderedTemplate;
      if (activeTemplate) setSelectedTemplate(activeTemplate);
      // Canvas customer adalah website ber-URL, bukan template.
      setEditorMode("site");
      if (openEditor) setView("editor");
      const clients = await api.clients();
      setManagedUsers(
        clients.map((item: any) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          siteTitle: item.siteTitle || item.name,
          slug: item.slug || "",
          assignedTo: item.assignedTo || "",
          assignedEditorId: item.assignedEditorId || "",
          status: item.assignedTo ? "Assigned" : "Unassigned",
          plan: "Free",
          canvasIds: item.canvasIds || [],
        })),
      );
      const owner = user?.name || "customer";
      flash(
        seedSections.length
          ? `Canvas ${orderedTemplate?.name || "template"} dimuat sebagai titik awal untuk ${owner}. Tekan Save untuk menyimpannya.`
          : `Sekarang mengelola Canvas milik ${owner}.`,
      );
    } catch (error) {
      flash(
        error instanceof Error
          ? error.message
          : "Gagal membuka Canvas Customer.",
      );
    }
  };

  const createTemplate = async (
    name: string,
    category: string,
    accent: string,
    price: number,
    description: string,
  ) => {
    try {
      const template = (await api.createTemplate({
        name,
        category,
        accent,
        bg: "#f7f2e8",
        price,
        description,
        premium: price > 0,
        preset: "classic",
        canvasJson: [],
      })) as Template;
      const templateInstanceId = uid("template-instance");
      const firstCanvas: CanvasSection = {
        id: uid("canvas"),
        name: "Main Canvas",
        templateInstanceId,
        sourceTemplateId: template.id,
        sourceTemplateName: template.name,
        columns: [{ id: uid("column"), features: [] }],
        backgroundColor: "#fffdf8",
        backgroundEffect: "none",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundGradientEnabled: false,
        backgroundGradientFrom: "#fffdf8",
        backgroundGradientTo: accent,
        backgroundGradientAngle: 135,
        backgroundMotion: "none",
        paddingY: 60,
        minHeight: 560,
        layoutMode: "standard",
        invitees: [],
      };
      setTemplateCatalog((previous) => [template, ...previous]);
      if (template.status === "Published" || template.status === "Approved")
        setPublicTemplates((previous) => [
          template,
          ...previous.filter((item) => item.id !== template.id),
        ]);
      setSelectedTemplate(template);
      setEditorMode("template");
      setSiteTitle(name);
      setSections([firstCanvas]);
      setSelectedDashboardCanvasId(firstCanvas.id);
      sessionStorage.setItem("ikrarku-edit-canvas", firstCanvas.id);
      setTemplateCreatorOpen(false);
      setView("editor");
      if (
        (template.status === "Pending" || template.pendingReview) &&
        hasPermission("tasks.view")
      ) {
        try {
          setTaskItems(await api.tasks());
        } catch {
          /* approval remains stored server-side */
        }
      }
      flash(
        template.status === "Pending"
          ? `Template ${name} dibuat dan masuk ke Approval Administrator.`
          : `Template ${name} dibuat.`,
      );
    } catch (error) {
      flash(error instanceof Error ? error.message : "Gagal membuat template.");
    }
  };

  // QA TC-075 & TC-076: takedown / republish template yang sudah live.
  const takedownTemplate = async (templateId: string, reason: string) => {
    try {
      const updated = await api.takedownTemplate(templateId, reason);
      setTemplateCatalog((previous) =>
        previous.map((item) => (item.id === templateId ? updated : item)),
      );
      setPublicTemplates((previous) =>
        previous.filter((item) => item.id !== templateId),
      );
      // VN 6 — kartu kini langsung hilang dari tampilan bawaan; beri tahu
      // ke mana ia pindah supaya tidak dikira terhapus.
      flash(
        "Template ditarik dari publikasi dan tidak dapat dipesan customer. Lihat lagi lewat filter Takedown.",
      );
    } catch (error) {
      flash(
        error instanceof Error ? error.message : "Gagal melakukan takedown.",
      );
    }
  };
  const republishTemplate = async (templateId: string) => {
    try {
      const updated = await api.republishTemplate(templateId);
      setTemplateCatalog((previous) =>
        previous.map((item) => (item.id === templateId ? updated : item)),
      );
      if (updated.status === "Published")
        setPublicTemplates((previous) => [
          updated,
          ...previous.filter((item) => item.id !== templateId),
        ]);
      try {
        setTaskItems(await api.tasks());
      } catch {
        /* daftar task akan refresh berikutnya */
      }
      flash(
        updated.status === "Published"
          ? "Template kembali dipublish."
          : "Template diajukan ulang dan menunggu approval Administrator.",
      );
    } catch (error) {
      flash(
        error instanceof Error ? error.message : "Gagal republish template.",
      );
    }
  };
  // QA TC-106: kolom upload gambar untuk template.
  //
  // Sebelumnya satu upload menimpa sampleImage + headerImage + preview sekaligus,
  // jadi thumbnail kartu di /template selalu ikut gambar sample dan tidak bisa
  // dibedakan. Sekarang keduanya terpisah:
  //   - "Gambar sample"  -> sampleImage + headerImage (visual besar di halaman detail)
  //   - "Thumbnail"      -> preview (kartu di landing /template)
  const uploadTemplateImage = async (
    templateId: string,
    file: File,
    kind: "sample" | "thumbnail",
  ) => {
    const label = kind === "thumbnail" ? "Thumbnail" : "Gambar sample";
    if (!file.type.startsWith("image/")) {
      flash(`${label} harus berupa image.`);
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      flash(`${label} maksimal 2 MB.`);
      return;
    }
    try {
      const payload = new FormData();
      payload.append("file", file);
      payload.append(
        "category",
        kind === "thumbnail" ? "template-thumbnail" : "template-sample",
      );
      const saved = await api.uploadMedia(payload);
      const patch =
        kind === "thumbnail"
          ? { preview: saved.url }
          : { sampleImage: saved.url, headerImage: saved.url };
      const updated = await api.updateTemplate(templateId, patch);
      const mapped = {
        ...updated,
        preview: updated.preview ? assetUrl(updated.preview) : undefined,
        sampleImage: updated.sampleImage
          ? assetUrl(updated.sampleImage)
          : undefined,
        headerImage: updated.headerImage
          ? assetUrl(updated.headerImage)
          : undefined,
      };
      setTemplateCatalog((previous) =>
        previous.map((item) => (item.id === templateId ? mapped : item)),
      );
      setPublicTemplates((previous) =>
        previous.map((item) => (item.id === templateId ? mapped : item)),
      );
      flash(
        kind === "thumbnail"
          ? "Thumbnail tersimpan dan dipakai pada kartu template di halaman /template."
          : "Gambar sample tersimpan dan dipakai sebagai heading halaman detail template.",
      );
    } catch (error) {
      flash(
        error instanceof Error
          ? error.message
          : `Upload ${label.toLowerCase()} gagal.`,
      );
    }
  };
  const uploadTemplateSample = (templateId: string, file: File) =>
    uploadTemplateImage(templateId, file, "sample");
  const uploadTemplateThumbnail = (templateId: string, file: File) =>
    uploadTemplateImage(templateId, file, "thumbnail");
  // QA TC-151 — tandai/lepas tanda rekomendasi pada katalog publik.
  const setTemplatePrice = async (templateId: string, price: number) => {
    try {
      const updated = await api.setTemplatePrice(templateId, price);
      const patch = (item: Template) =>
        item.id === templateId
          ? { ...item, price: updated.price, premium: updated.premium }
          : item;
      setTemplateCatalog((previous) => previous.map(patch));
      setPublicTemplates((previous) => previous.map(patch));
      flash(`Harga diperbarui: ${formatRupiah(updated.price || 0)}.`);
    } catch (error) {
      flash(error instanceof Error ? error.message : "Gagal mengubah harga.");
      throw error;
    }
  };
  const toggleTemplateRecommended = async (
    templateId: string,
    next: boolean,
  ) => {
    try {
      const updated = await api.setTemplateRecommended(templateId, next);
      const patch = (item: Template) =>
        item.id === templateId ? { ...item, recommended: updated.recommended } : item;
      setTemplateCatalog((previous) => previous.map(patch));
      setPublicTemplates((previous) => previous.map(patch));
      flash(
        next
          ? "Template ditandai sebagai desain rekomendasi."
          : "Tanda rekomendasi dilepas.",
      );
    } catch (error) {
      flash(
        error instanceof Error
          ? error.message
          : "Gagal mengubah status rekomendasi.",
      );
    }
  };
  const openTemplateCanvas = (template: Template) => {
    setSelectedTemplate(template);
    setEditorMode("template");
    setSiteTitle(template.name);
    setSections(
      hydrateSections(
        template.canvasSections?.length
          ? template.canvasSections
          : [
              {
                id: uid("canvas"),
                name: "Main Canvas",
                columns: [{ id: uid("column"), features: [] }],
                backgroundColor: "#fffdf8",
                backgroundEffect: "none",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundGradientEnabled: false,
                backgroundGradientFrom: "#fffdf8",
                backgroundGradientTo: template.accent,
                backgroundGradientAngle: 135,
                backgroundMotion: "none",
                paddingY: 60,
                minHeight: 560,
                layoutMode: "standard",
                invitees: [],
              },
            ],
      ),
    );
    setView("editor");
  };

  const approveTemplate = async (
    templateId: string,
    status: "Approved" | "Rejected",
    feedback = "",
  ) => {
    try {
      const updated = await api.reviewTemplate(templateId, status, feedback);
      setTemplateCatalog((previous) =>
        previous.map((item) => (item.id === templateId ? updated : item)),
      );
      setTaskItems(await api.tasks());
      if (updated.status === "Published" || updated.status === "Approved")
        setPublicTemplates((previous) => [
          updated,
          ...previous.filter((item) => item.id !== templateId),
        ]);
      else
        setPublicTemplates((previous) =>
          previous.filter((item) => item.id !== templateId),
        );
      flash(
        `Template ${status === "Approved" ? "disetujui dan dipublish" : "ditolak"}. Email notifikasi telah masuk outbox.`,
      );
    } catch (error) {
      flash(
        error instanceof Error ? error.message : "Gagal memperbarui approval.",
      );
    }
  };

  const saveSite = async () => {
    const cleanSections = sections.map((section) => ({
      ...section,
      backgroundUrl: section.backgroundUrl,
      columns: section.columns.map((column) => ({
        ...column,
        features: column.features.map((feature) => ({ ...feature })),
      })),
    }));
    try {
      const payload = {
        title: siteTitle,
        slug,
        templateId:
          sections.find((section) => section.sourceTemplateId)
            ?.sourceTemplateId ||
          (sections.some((section) => !section.templateInstanceId)
            ? selectedTemplate.id
            : null),
        sections: cleanSections,
        status: "Published",
      };
      const result: any =
        siteOwnerUserId && siteOwnerUserId !== currentAccountId
          ? await api.saveClientSite(siteOwnerUserId, payload)
          : await api.saveSite(payload);
      setSaved(true);
      flash(
        `Website dipublikasikan: ${result.url || `${window.location.origin}/${slug}`}`,
      );
      window.setTimeout(() => setSaved(false), 1800);
      return true;
    } catch (error) {
      flash(
        error instanceof Error ? error.message : "Gagal menyimpan website.",
      );
      return false;
    }
  };

  const saveEditorContent = async () => {
    if (editorMode === "site") return saveSite();
    const cleanSections = sections.map((section) => ({
      ...section,
      columns: section.columns.map((column) => ({
        ...column,
        features: column.features.map((feature) => ({ ...feature })),
      })),
    }));
    try {
      const updated = (await api.updateTemplate(selectedTemplate.id, {
        canvasJson: cleanSections,
        name: siteTitle,
      })) as Template;
      setTemplateCatalog((previous) =>
        previous.map((item) =>
          item.id === updated.id
            ? { ...updated, canvasSections: cleanSections }
            : item,
        ),
      );
      setSelectedTemplate({ ...updated, canvasSections: cleanSections });
      setSaved(true);
      flash(
        updated.pendingReview || updated.status === "Pending"
          ? "Draft template disimpan. Approval tetap Pending."
          : "Template berhasil disimpan.",
      );
      window.setTimeout(() => setSaved(false), 1800);
      return true;
    } catch (error) {
      flash(
        error instanceof Error ? error.message : "Gagal menyimpan template.",
      );
      return false;
    }
  };

  // ---- Dashboard customer: List Undangan & RSVP (item 4) ----
  // Halaman List Undangan kini berdiri sendiri di luar Canvas Editor, jadi
  // perubahan daftar tamu disimpan langsung ke website customer.
  const [dashboardSavingInvitees, setDashboardSavingInvitees] = useState(false);
  const updateDashboardSection = (
    sectionId: string,
    patch: Partial<CanvasSection>,
  ) => {
    const nextSections = sections.map((section) =>
      section.id === sectionId ? { ...section, ...patch } : section,
    );
    setSections(nextSections);
    setDashboardSavingInvitees(true);
    void api
      .autosaveSite({
        title: siteTitle,
        slug,
        templateId:
          nextSections.find((section) => section.sourceTemplateId)
            ?.sourceTemplateId || selectedTemplate.id,
        sections: nextSections,
      })
      .catch(() =>
        flash(
          "Perubahan daftar undangan belum tersimpan ke server. Coba lagi sebentar.",
        ),
      )
      .finally(() => setDashboardSavingInvitees(false));
  };

  const openTemplateJourney = (template: Template) => {
    setSelectedPublicTemplate(template);
    setView("template-detail");
  };

  const beginCheckout = (template: Template) => {
    try {
      const draft = JSON.parse(
        sessionStorage.getItem("ikrarku-checkout-draft") || "{}",
      );
      if (draft.templateId && draft.templateId !== template.id)
        sessionStorage.removeItem("ikrarku-checkout-draft");
    } catch {
      sessionStorage.removeItem("ikrarku-checkout-draft");
    }
    setSelectedPublicTemplate(template);
    setCheckoutOrder(null);
    setView("checkout");
  };

  const createCheckoutOrder = async (
    customerName: string,
    email: string,
    phone: string,
  ) => {
    if (!selectedPublicTemplate) return null;
    try {
      const order = await api.createOrder({
        customerName,
        email,
        phone,
        templateId: selectedPublicTemplate.id,
      });
      setCheckoutOrder(order);
      return order;
    } catch (error) {
      flash(error instanceof Error ? error.message : "Gagal membuat order.");
      return null;
    }
  };

  const payCheckoutOrder = async (paymentMethod: string) => {
    if (!checkoutOrder) return false;
    try {
      const paid = await api.payOrder(
        checkoutOrder.id,
        paymentMethod,
        checkoutOrder.guestToken,
      );
      if (paid.paymentUrl) {
        window.location.href = paid.paymentUrl;
        return true;
      }
      const result = {
        ...checkoutOrder,
        ...paid,
        receiptUrl: paid.receiptUrl ? assetUrl(paid.receiptUrl) : undefined,
      };
      setLastPaidOrder(result);
      sessionStorage.removeItem("ikrarku-checkout-draft");
      setCheckoutOrder(null);
      setView("payment-success");
      return true;
    } catch (error) {
      flash(error instanceof Error ? error.message : "Pembayaran gagal.");
      return false;
    }
  };

  const addGreeting = (name: string, message: string) => {
    const canvasId = selectedDashboardCanvasId || sections[0]?.id || "";
    void api
      .addGreeting({ name, message, canvasId })
      .then((result) =>
        setGreetings((previous) => [
          {
            id: result.id,
            name,
            message,
            date: new Date().toISOString(),
            canvasId,
          },
          ...previous,
        ]),
      )
      .catch((error) =>
        flash(
          error instanceof Error ? error.message : "Gagal menyimpan greeting.",
        ),
      );
  };
  const addGuest = (
    name: string,
    status: Guest["status"],
    pax: number,
    canvasId = selectedDashboardCanvasId || sections[0]?.id || "",
  ) => {
    void api
      .addRsvp({ name, status, pax, canvasId })
      .then((result) =>
        setGuests((previous) => [
          {
            id: result.id,
            initials: name.slice(0, 2).toUpperCase(),
            name,
            status,
            pax,
            time: new Date().toISOString(),
            canvasId,
          },
          ...previous,
        ]),
      )
      .catch((error) =>
        flash(error instanceof Error ? error.message : "Gagal menyimpan RSVP."),
      );
  };
  const sendChat = async (
    sender: ChatMessage["sender"],
    text: string,
    conversationId = currentAccountId,
    senderName = currentAccount?.name || "Guest",
    forcePublic = false,
  ) => {
    if (!text.trim()) return;
    const optimistic = {
      id: uid("chat"),
      sender,
      text: text.trim(),
      time: "Baru saja",
      conversationId,
      senderName,
    } as ChatMessage;
    setChatMessages((previous) => [...previous, optimistic]);
    try {
      const token = forcePublic
        ? null
        : localStorage.getItem("ikrarku-api-token");
      const publicConversationToken =
        localStorage.getItem("ikrarku-public-chat-token") || "";
      const result = token
        ? await api.inboundMessage(text.trim(), "Web")
        : await api.publicChat({
            name: senderName,
            email:
              conversationId === "guest" ? "" : currentAccount?.email || "",
            body: text.trim(),
            channel: "Web",
            conversationToken: publicConversationToken,
          });
      if (!token && result.conversationToken)
        localStorage.setItem(
          "ikrarku-public-chat-token",
          result.conversationToken,
        );
      if (token) {
        try {
          const ownConversation = await api.myConversation();
          if (ownConversation?.conversation)
            setChatMessages(
              (ownConversation.messages || []).map((message: any) => ({
                id: message.id,
                sender: message.sender_type === "support" ? "support" : "user",
                text: message.body,
                time: message.created_at,
                conversationId: currentAccountId,
                senderName:
                  message.sender_type === "support"
                    ? "ikrarku Support"
                    : currentAccount?.name || "User",
              })),
            );
        } catch {
          /* optimistic message remains visible */
        }
      }
      // Keep the local conversation key stable so the message remains visible after it is persisted to the CS inbox.
      if (hasPermission("conversations.view")) {
        setServerConversations(await api.conversations());
        setCsMetricData(await api.csMetrics());
      }
    } catch (error) {
      flash(
        error instanceof Error
          ? error.message
          : "Pesan belum tersimpan ke inbound CS.",
      );
    }
  };

  const updateCurrentAccount = async (patch: Partial<AuthAccount>) => {
    try {
      const result = await api.updateMe({
        firstName: patch.firstName,
        lastName: patch.lastName,
        email: patch.email,
        password: patch.password || undefined,
        currentPassword: patch.currentPassword || undefined,
        settings: patch.settings,
      });
      const { user } = await api.me();
      setAccounts((previous) =>
        previous.map((account) =>
          account.id === currentAccountId
            ? {
                ...account,
                name: user.name,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                settings: user.settings,
                password: "",
                currentPassword: undefined,
              }
            : account,
        ),
      );
      flash(
        result.emailVerificationRequired
          ? "Pengaturan disimpan. Buka tautan verifikasi di email baru; email akun belum berubah."
          : "Pengaturan akun berhasil disimpan ke database.",
      );
    } catch (error) {
      flash(error instanceof Error ? error.message : "Gagal menyimpan akun.");
    }
  };

  const updateNotificationSetting = async (muted: boolean) => {
    setNotificationMuted(muted);
    localStorage.setItem("ikrarku-notification-muted", String(muted));
    try {
      await api.updateMe({ settings: { notificationSoundMuted: muted } });
      setAccounts((previous) =>
        previous.map((account) =>
          account.id === currentAccountId
            ? {
                ...account,
                settings: {
                  ...(account.settings || {}),
                  notificationSoundMuted: muted,
                },
              }
            : account,
        ),
      );
      flash(
        muted ? "Notifikasi suara dimute." : "Notifikasi suara diaktifkan.",
      );
    } catch (error) {
      flash(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan pengaturan notifikasi.",
      );
    }
  };

  const signOut = () => {
    void api.logout().catch(() => undefined);
    setApiToken("");
    localStorage.removeItem("ikrarku-session-v7");
    localStorage.removeItem("ikrarku-last-activity");
    localStorage.removeItem(EDITOR_BACKUP_KEY);
    setCurrentAccountId("");
    setAccounts([]);
    setRole("User");
    setManagedUsers([]);
    setTaskItems([]);
    setMyOrders([]);
    setServerConversations([]);
    setSiteOwnerUserId("");
    setActiveManagedUserId("");
    setLastAuthError("");
    setView("landing");
    setChatWidgetOpen(false);
  };

  if (loading) return <LoadingScreen />;

  if (notFound)
    return (
      <NotFoundPage
        onHome={() => {
          setNotFound(false);
          window.history.replaceState(window.history.state, "", "/");
          setView("landing");
        }}
      />
    );

  if (publicSiteData) return <PublicWeddingPage site={publicSiteData} />;

  if (view === "landing")
    return (
      <>
        <LandingPage
          setView={setView}
          articleSlug={articleSlug}
          onOpenArticle={setArticleSlug}
          articles={articleItems.filter(
            (article) => article.status === "Published",
          )}
          templates={publicTemplates}
          onTemplate={openTemplateJourney}
          databaseOnline={databaseOnline}
          accountName={currentAccountId ? currentAccount?.name : undefined}
          onOpenWorkspace={() => setView("dashboard")}
          scrollTarget={landingScrollTarget}
          onScrolled={() => setLandingScrollTarget(null)}
        />
        <ChatWidget
          messages={chatMessages.filter(
            (message) => (message.conversationId || "guest") === "guest",
          )}
          sendChat={(text) =>
            sendChat("user", text, "guest", "Website Visitor", true)
          }
          open={chatWidgetOpen}
          onOpenChange={setChatWidgetOpen}
        />
      </>
    );

  if (view === "template-detail" && selectedPublicTemplate)
    return (
      <TemplateJourneyPage
        template={selectedPublicTemplate}
        onBack={() => {
          setLandingScrollTarget("templates");
          setView("landing");
        }}
        onPreview={() => setSelectedTemplate(selectedPublicTemplate)}
        onOrder={() => beginCheckout(selectedPublicTemplate)}
      />
    );

  if (view === "checkout" && selectedPublicTemplate)
    return (
      <CheckoutPage
        template={selectedPublicTemplate}
        paymentMethods={paymentMethods.filter((method) => method.enabled)}
        order={checkoutOrder}
        onBack={() => setView("template-detail")}
        createOrder={createCheckoutOrder}
        payOrder={payCheckoutOrder}
        onSignIn={() => {
          sessionStorage.setItem("ikrarku-checkout-return", "true");
          setView("login");
        }}
        account={currentAccount}
      />
    );

  if (view === "payment-success" && lastPaidOrder)
    return (
      <PaymentSuccessPage
        order={lastPaidOrder}
        template={selectedPublicTemplate}
        onHome={() => setView("landing")}
      />
    );

  if (view === "login" || view === "signup")
    return (
      <Auth
        view={view}
        setView={setView}
        login={login}
        signupAccount={signupAccount}
        lastAuthError={lastAuthError}
      />
    );
  if (view === "designs")
    return (
      <AllDesignsPage
        templates={publicTemplates}
        setView={setView}
        onTemplate={openTemplateJourney}
        databaseOnline={databaseOnline}
      />
    );
  if (view === "journal")
    return (
      <JournalPage
        articles={articleItems.filter(
          (article) => article.status === "Published",
        )}
        articleSlug={articleSlug}
        onOpenArticle={setArticleSlug}
        setView={setView}
        databaseOnline={databaseOnline}
      />
    );
  if (view === "forgot-password")
    return <ForgotPasswordPage setView={setView} />;
  if (view === "reset-password") return <ResetPasswordPage setView={setView} />;
  if (view === "verify-email") return <VerifyEmailPage setView={setView} />;

  if (view === "not-found")
    return (
      <NotFoundPage
        onHome={() => {
          window.history.replaceState(window.history.state, "", "/");
          setView("landing");
        }}
      />
    );

  if (view === "editor" && !needsCanvasOrderPick) {
    return (
      <>
        <Editor
          managingCustomer={Boolean(siteOwnerUserId)}
          editorName={currentAccount?.name || displayRole(role)}
          onContactSupport={
            role === "User" ? () => setChatWidgetOpen(true) : undefined
          }
          sections={sections}
          setSections={setSections}
          slug={slug}
          setSlug={setSlug}
          siteTitle={siteTitle}
          setSiteTitle={setSiteTitle}
          selectedTemplate={selectedTemplate}
          saveSite={saveEditorContent}
          saved={saved}
          editorMode={editorMode}
          setView={setView}
          setPreviewOpen={setPreviewOpen}
          greetings={greetings}
          addGreeting={addGreeting}
          guests={guests}
          addGuest={addGuest}
          flash={flash}
          soundCatalog={soundCatalog}
          loadDraft={() =>
            editorMode === "template"
              ? api.templateDraft(selectedTemplate.id)
              : siteOwnerUserId && siteOwnerUserId !== currentAccountId
                ? api.clientDraft(siteOwnerUserId)
                : api.siteDraft()
          }
          discardDraft={() =>
            editorMode === "template"
              ? api.discardTemplateDraft(selectedTemplate.id)
              : siteOwnerUserId && siteOwnerUserId !== currentAccountId
                ? api.discardClientDraft(siteOwnerUserId)
                : api.discardSiteDraft()
          }
          autosaveContent={async (draft) => {
            const payload = {
              title: draft.siteTitle,
              slug: draft.slug,
              templateId:
                sections.find((section) => section.sourceTemplateId)
                  ?.sourceTemplateId ||
                (sections.some((section) => !section.templateInstanceId)
                  ? selectedTemplate.id
                  : null),
              sections: draft.sections,
            };
            if (editorMode === "template")
              await api.autosaveTemplate(selectedTemplate.id, draft.sections);
            else if (siteOwnerUserId && siteOwnerUserId !== currentAccountId)
              await api.autosaveClientSite(siteOwnerUserId, payload);
            else await api.autosaveSite(payload);
          }}
          loadRevisions={async () =>
            editorMode === "template"
              ? api.templateRevisions(selectedTemplate.id)
              : siteOwnerUserId && siteOwnerUserId !== currentAccountId
                ? api.clientSiteRevisions(siteOwnerUserId)
                : api.siteRevisions()
          }
        />
        {/* Canvas Editor sengaja tidak memuat tombol Live Chat yang melayang:
            ia menutupi panel Style/Advanced (TC-188). TC-223 — customer
            membuka chat lewat tombol Hubungi Support di editor; panelnya
            hanya dirender selama terbuka, jadi tidak ada tombol melayang. */}
        {role === "User" && chatWidgetOpen && (
          <ChatWidget
            messages={chatMessages.filter(
              (message) =>
                (message.conversationId || currentAccountId) ===
                currentAccountId,
            )}
            sendChat={(text) => sendChat("user", text)}
            open={chatWidgetOpen}
            onOpenChange={setChatWidgetOpen}
          />
        )}
        {previewOpen && (
          <PreviewModal
            sections={sections}
            template={selectedTemplate}
            greetings={greetings}
            addGreeting={addGreeting}
            guests={guests}
            addGuest={addGuest}
            onClose={() => setPreviewOpen(false)}
          />
        )}
        {mustChangePassword && currentAccountId && (
          <FirstPasswordDialog
            onDone={() => {
              setMustChangePassword(false);
              flash("Password baru tersimpan. Gunakan password ini untuk login berikutnya.");
            }}
          />
        )}
        {toast && <Toast message={toast} />}
      </>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar
        role={role}
        view={view}
        setView={setView}
        open={sidebarOpen}
        logout={signOut}
        currentAccount={currentAccount}
        onResetEditor={resetEditorWorkspace}
      />
      <main className={`main-content ${sidebarOpen ? "" : "collapsed"}`}>
        <Topbar
          role={role}
          toggleSidebar={() => setSidebarOpen((previous) => !previous)}
          sidebarOpen={sidebarOpen}
          currentAccount={currentAccount}
          onChat={() =>
            hasPermission("conversations.view")
              ? setView("customer-service")
              : setChatWidgetOpen(true)
          }
          onSettings={() => setAccountSettingsOpen(true)}
          onPaymentSettings={() => setView("payment-settings")}
          canPaymentSettings={hasPermission("settings.payment")}
          onLogout={signOut}
        />
        {view === "dashboard" &&
          !hasPermission("dashboard.editor") &&
          !hasPermission("dashboard.cs") && (
            <Dashboard
              setView={setView}
              slug={slug}
              siteTitle={siteTitle}
              guests={guests}
              sections={sections}
              orders={myOrders}
              selectedCanvasId={selectedDashboardCanvasId}
              setSelectedCanvasId={setSelectedDashboardCanvasId}
              setGuestsOpen={setGuestsOpen}
              setPreviewOpen={setPreviewOpen}
              teamEdit={teamEdit}
            />
          )}
        {view === "dashboard" && hasPermission("dashboard.editor") && (
          <EditorDashboard
            users={managedUsers}
            setView={setView}
            manageUserCanvas={manageUserCanvas}
            adminView={hasPermission("users.manage")}
            templateCount={templateCatalog.length}
            supportCount={serverConversations.length}
          />
        )}
        {view === "dashboard" && hasPermission("dashboard.cs") && (
          <CustomerServiceDashboard
            metrics={csMetricData}
            conversations={serverConversations}
            setView={setView}
          />
        )}
        {view === "cs-dashboard" && (
          <CustomerServiceDashboard
            metrics={csMetricData}
            conversations={serverConversations}
            setView={setView}
          />
        )}
        {view === "templates" && (
          <Templates
            role={role}
            siteTitle={siteTitle}
            activeUser={managedUsers.find(
              (user) => user.id === activeManagedUserId,
            )}
            selectedTemplate={selectedTemplate}
            templateCatalog={templateCatalog}
            sections={sections}
            applyTemplate={applyTemplate}
            deleteCanvas={deleteCanvasFromTemplates}
            duplicateCanvas={duplicateCanvasFromTemplates}
            editCanvas={editCanvasFromTemplates}
            editorMode={editorMode}
            openTemplateCreator={() => setTemplateCreatorOpen(true)}
            canCreate={hasPermission("templates.create")}
            managedTemplates={templateCatalog}
          managingCustomer={Boolean(siteOwnerUserId)}
            currentAccountId={currentAccountId}
            canApprove={hasPermission("templates.approve")}
            onTakedown={takedownTemplate}
            onRepublish={republishTemplate}
            onUploadSample={uploadTemplateSample}
            onUploadThumbnail={uploadTemplateThumbnail}
            onToggleRecommended={toggleTemplateRecommended}
            onSetPrice={
              hasPermission("templates.approve") ? setTemplatePrice : undefined
            }
            onEditTemplate={openTemplateCanvas}
            canvasOrders={canvasOrderOptions}
            canvasOrderBusy={canvasOrderBusy}
            customerOrders={myOrders}
            // Dari halaman Templates canvas dimuat tanpa pindah ke editor,
            // supaya hasilnya muncul dulu sebagai card Website Design.
            onOpenCanvasOrder={(option) => void openCanvasOrder(option, false)}
            publicTemplates={publicTemplates}
            onContactSupport={
              role === "User" ? () => setChatWidgetOpen(true) : undefined
            }
            onOpenTemplate={openTemplateJourney}
          />
        )}
        {needsCanvasOrderPick && (
          <CanvasEditorStartPage
            options={canvasOrderOptions}
            onOpen={(option) => void openCanvasOrder(option, true)}
            busy={canvasOrderBusy}
            onBrowseTemplates={() => setView("templates")}
          />
        )}
        {view === "users" && hasPermission("users.manage") && (
          <UserManagement
            role={role}
            accounts={accounts}
            roles={roleItems}
            createAccount={createAccount}
            changeUserRole={changeUserRole}
            deleteAccount={deleteAccount}
            currentAccountId={currentAccountId}
            clients={managedUsers}
            onAssign={assignClient}
            onManage={manageUserCanvas}
            onUpdateUser={updateManagedAccount}
          />
        )}
        {/* QA TC-168: halaman Client Assignment mandiri dihapus. Assign dan
            kelola canvas customer sekarang lewat Manage Canvas. */}
        {view === "articles" && (
          <Articles
            articles={articleItems}
            openEditor={openArticleEditor}
            canManage={hasPermission("articles.manage")}
            onToggleStatus={toggleArticleStatus}
            onDelete={deleteArticle}
          />
        )}
        {view === "article-editor" && (
          <ArticleEditorPage
            key={articleEditorId}
            article={
              articleEditorId === "new"
                ? undefined
                : articleItems.find((item) => item.id === articleEditorId)
            }
            role={role}
            onBack={() => setView("articles")}
            onSave={(article) =>
              saveArticles(
                article,
                articleEditorId === "new" ? undefined : articleEditorId,
              )
            }
          />
        )}
        {view === "settings" && (
          <SettingsPage
            slug={slug}
            setSlug={setSlug}
            flash={flash}
            notificationMuted={notificationMuted}
            onNotificationMuted={updateNotificationSetting}
          />
        )}
        {view === "my-orders" && (
          <MyOrdersPage orders={myOrders} setView={setView} />
        )}
        {view === "invitee-management" && (
          <div className="page">
            <div className="page-heading">
              <div>
                <div className="eyebrow">GUEST MANAGEMENT</div>
                <h1>List Undangan</h1>
                <p>
                  Kelola daftar tamu per Canvas, impor dari CSV, dan ekspor
                  kembali kapan saja. Perubahan tersimpan otomatis.
                </p>
              </div>
              {dashboardSavingInvitees && (
                <span className="autosave-indicator saving">Menyimpan...</span>
              )}
            </div>
            <InviteeManagementPage
              sections={sections}
              selectedSectionId={selectedDashboardCanvasId}
              selectSection={(section) =>
                setSelectedDashboardCanvasId(section.id)
              }
              updateSection={updateDashboardSection}
              flash={flash}
              slug={slug}
            />
          </div>
        )}
        {view === "rsvp-confirmation" && (
          <RsvpConfirmationPage
            guests={guests}
            sections={sections}
            siteTitle={siteTitle}
            flash={flash}
          />
        )}
        {view === "audit-log" && (
          <AuditLogPage
            logs={auditLogs}
            onRefresh={async () => setAuditLogs(await api.auditLogs())}
          />
        )}
        {view === "orders" && (
          <OrdersAnalyticsPage
            data={orderAnalytics}
            onRefresh={async () => {
              try {
                setOrderAnalytics(await api.orderAnalytics());
              } catch (error) {
                flash(
                  error instanceof Error
                    ? error.message
                    : "Gagal memuat order.",
                );
              }
            }}
          />
        )}
        {view === "payment-settings" && (
          <PaymentSettingsPage
            methods={paymentMethods}
            onChange={async (method) => {
              try {
                const updated = await api.updatePaymentMethod(
                  method.id,
                  method,
                );
                setPaymentMethods((previous) =>
                  previous.map((item) =>
                    item.id === updated.id ? updated : item,
                  ),
                );
                flash("Payment Method diperbarui.");
              } catch (error) {
                flash(
                  error instanceof Error
                    ? error.message
                    : "Gagal memperbarui Payment Method.",
                );
              }
            }}
          />
        )}
        {view === "tasks" && (
          <TasksPage
            tasks={taskItems}
            onRefresh={async () => {
              try {
                setTaskItems(await api.tasks());
                flash("Database task berhasil di-refresh.");
              } catch (error) {
                flash(
                  error instanceof Error ? error.message : "Gagal memuat task.",
                );
              }
            }}
            onUpdate={async (taskId, status) => {
              await api.updateTask(taskId, { status });
              setTaskItems((previous) =>
                previous.map((item) =>
                  item.id === taskId ? { ...item, status } : item,
                ),
              );
            }}
            onReview={approveTemplate}
            canApprove={hasPermission("templates.approve")}
            templates={templateCatalog}
            onManageCanvas={manageUserCanvas}
          />
        )}
        {view === "roles" && (
          <RolesPermissionsPage
            roles={roleItems}
            onRefresh={async () => setRoleItems(await api.roles())}
            onCreate={async (name, permissions) => {
              await api.createRole({ name, permissions });
              setRoleItems(await api.roles());
              flash("Role berhasil ditambahkan.");
            }}
            onUpdate={async (id, name, permissions) => {
              await api.updateRole(id, { name, permissions });
              setRoleItems(await api.roles());
              flash("Role diperbarui.");
            }}
            onDelete={async (id) => {
              await api.deleteRole(id);
              setRoleItems(await api.roles());
              flash("Role dihapus.");
            }}
          />
        )}
        {view === "admin" && (
          <AdminDashboard
            setView={setView}
            templates={templateCatalog}
            articles={articleItems}
            accounts={accounts}
            tasks={taskItems}
            metrics={csMetricData}
            roles={roleItems}
            createAccount={createAccount}
            orderAnalytics={orderAnalytics}
          />
        )}
        {view === "help" && <HelpCenter />}
        {view === "sound-library" && (
          <SoundLibrary
            catalog={soundCatalog}
            addSound={addSoundToCatalog}
            deleteSound={deleteSoundFromCatalog}
          />
        )}
        {view === "commissions" && (
        <CommissionWorkspace canApprove={hasPermission("users.manage")} />
      )}
      {view === "customer-service" && (
          <CustomerServiceDatabase
            conversations={serverConversations}
            users={contactableUsers}
            onRefresh={async () => {
              setServerConversations(await api.conversations());
              setCsMetricData(await api.csMetrics());
            }}
            onReply={async (conversationId, text, visibility = "public") => {
              await api.reply(conversationId, text, visibility);
              setServerConversations(await api.conversations());
              setCsMetricData(await api.csMetrics());
              // Catatan internal tidak pernah masuk ke chat customer, jadi
              // tidak perlu menyegarkan widget chat sendiri.
              if (visibility !== "internal") void refreshMyChat(false);
              if (visibility === "internal") flash("Catatan internal tersimpan.");
            }}
            onOutbound={async (userId, text) => {
              await api.outboundMessage({ userId, body: text, channel: "Web" });
              setServerConversations(await api.conversations());
              setCsMetricData(await api.csMetrics());
              void refreshMyChat(false);
              flash("Pesan dikirim ke Customer.");
            }}
            onStatus={async (conversationId, status) => {
              await api.updateConversation(conversationId, status);
              setServerConversations(await api.conversations());
              setCsMetricData(await api.csMetrics());
            }}
            onRead={async (conversationId) => {
              await api.markConversationRead(conversationId);
              setServerConversations((previous) =>
                previous.map((item) =>
                  item.id === conversationId
                    ? { ...item, unreadCount: 0 }
                    : item,
                ),
              );
            }}
          />
        )}
      </main>
      <ChatWidget
        messages={chatMessages.filter(
          (message) =>
            (message.conversationId || currentAccountId) === currentAccountId,
        )}
        sendChat={(text) => sendChat("user", text)}
        open={chatWidgetOpen}
        onOpenChange={setChatWidgetOpen}
      />
      {previewOpen && (
        <PreviewModal
          sections={sections}
          template={selectedTemplate}
          greetings={greetings}
          addGreeting={addGreeting}
          guests={guests}
          addGuest={addGuest}
          onClose={() => setPreviewOpen(false)}
        />
      )}
      {guestsOpen && (
        <GuestsModal
          guests={guests.filter(
            (guest) => guest.canvasId === selectedDashboardCanvasId,
          )}
          onClose={() => setGuestsOpen(false)}
        />
      )}
      {confirmCanvasDeleteIds.length > 0 && (
        <ConfirmModal
          title="Hapus Design dari Website?"
          description="Seluruh Canvas, Column, Feature, daftar undangan, dan struktur internal yang berada di dalam design ini akan dihapus dari website. Tindakan ini tidak dapat dibatalkan."
          confirmLabel="Hapus Design"
          onCancel={() => setConfirmCanvasDeleteIds([])}
          onConfirm={performDeleteCanvas}
        />
      )}
      {accountSettingsOpen && currentAccount && (
        <AccountSettingsModal
          account={currentAccount}
          onClose={() => setAccountSettingsOpen(false)}
          onSave={(patch) => {
            updateCurrentAccount(patch);
            setAccountSettingsOpen(false);
          }}
        />
      )}
      {templateCreatorOpen && (
        <TemplateCreatorModal
          onClose={() => setTemplateCreatorOpen(false)}
          onCreate={createTemplate}
          canSetPrice={hasPermission("*")}
        />
      )}
      {mustChangePassword && currentAccountId && (
        <FirstPasswordDialog
          onDone={() => {
            setMustChangePassword(false);
            flash("Password baru tersimpan. Gunakan password ini untuk login berikutnya.");
          }}
        />
      )}
      {toast && <Toast message={toast} />}
    </div>
  );
}

function PublicWeddingPage({ site }: { site: any }) {
  const publicDevice = useViewportDevice();
  const guestName = useMemo(() => {
    try {
      return (
        new URLSearchParams(window.location.search).get("to")?.trim() ||
        undefined
      );
    } catch {
      return undefined;
    }
  }, []);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [greetings, setGreetings] = useState<Greeting[]>([]);
  useEffect(() => {
    let alive = true;
    void api
      .publicGreetings(site.slug)
      .then((rows) => {
        if (alive) setGreetings(rows);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [site.slug]);
  const template: Template = {
    id: site.templateId || "public",
    name: site.template?.name || site.title,
    category: "Wedding",
    accent: site.template?.accent || "#125946",
    bg: site.template?.bg || "#fffdf8",
    premium: false,
    preset: site.template?.preset || "classic",
    status: "Published",
  };
  const addGuest = (
    name: string,
    status: Guest["status"],
    pax: number,
    canvasId = "",
  ) => {
    void api
      .publicRsvp(site.slug, { name, status, pax, canvasId })
      .then((result) =>
        setGuests((previous) => [
          {
            id: result.id,
            initials: name.slice(0, 2).toUpperCase(),
            name,
            status,
            pax,
            time: new Date().toISOString(),
            canvasId,
          },
          ...previous,
        ]),
      );
  };
  const addGreeting = (name: string, message: string) => {
    const canvasId = site.sections?.[0]?.id || "";
    void api
      .publicGreeting(site.slug, { name, message, canvasId })
      .then((result) =>
        setGreetings((previous) => [
          {
            id: result.id,
            name,
            message,
            date: new Date().toISOString(),
            canvasId,
          },
          ...previous,
        ]),
      );
  };
  return (
    <DeviceContext value={publicDevice}>
    <div className="public-site-route">
      <WeddingCanvas
        page="pages"
        sections={site.sections || []}
        selectedTemplate={template}
        greetings={greetings}
        addGreeting={addGreeting}
        guests={guests}
        addGuest={addGuest}
        guestName={guestName}
      />
    </div>
    </DeviceContext>
  );
}

// QA TC-112: pengunjung website publik otomatis mendapat setting sesuai lebar layar.
function useViewportDevice(): DeviceMode {
  const [device, setDevice] = useState<DeviceMode>(() =>
    typeof window !== "undefined" && window.innerWidth <= 768
      ? "mobile"
      : "desktop",
  );
  useEffect(() => {
    const query = window.matchMedia("(max-width: 768px)");
    const sync = () => setDevice(query.matches ? "mobile" : "desktop");
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  return device;
}

/**
 * Mengembalikan posisi scroll sebuah container preview ke paling atas setiap
 * kali preview dibuka atau mode device-nya berganti.
 *
 * Dua hal yang diperbaiki di sini:
 * 1. Container preview memakai `overflow:auto` dan dipakai ulang, sehingga
 *    scrollTop dari sesi preview sebelumnya ikut terbawa.
 * 2. Scroll anchoring browser: saat foto dan background di bagian atas undangan
 *    selesai dimuat, tingginya bertambah dan browser menggeser viewport supaya
 *    elemen yang terlihat tetap di tempatnya — efeknya preview seolah langsung
 *    berada di slide tengah. Karena itu reset diulang beberapa frame dan
 *    container diberi `overflow-anchor: none` lewat CSS.
 */
function useScrollResetOnOpen(
  ref: React.RefObject<HTMLElement | null>,
  open: boolean,
  ...deps: unknown[]
) {
  useLayoutEffect(() => {
    if (!open) return;
    const node = ref.current;
    if (!node) return;
    let cancelled = false;
    const toTop = () => {
      if (cancelled || !ref.current) return;
      ref.current.scrollTop = 0;
      ref.current.scrollLeft = 0;
    };
    toTop();
    const frame = window.requestAnimationFrame(() => {
      toTop();
      window.requestAnimationFrame(toTop);
    });
    // Media yang baru selesai dimuat masih bisa menggeser konten setelah frame
    // pertama; satu reset susulan menutup celah itu.
    const settle = window.setTimeout(toTop, 180);
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      window.clearTimeout(settle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, ...deps]);
}

// Halaman katalog desain lengkap. Landing hanya menampilkan 9 desain; sisanya
// dibuka di sini dengan filter kategori dan pencarian.
function AllDesignsPage({
  templates,
  setView,
  onTemplate,
  databaseOnline,
}: {
  templates: Template[];
  setView: (view: View) => void;
  onTemplate: (template: Template) => void;
  databaseOnline: boolean;
}) {
  const [category, setCategory] = useState("Semua");
  const [query, setQuery] = useState("");
  const categories = useMemo(
    () => ["Semua", ...new Set(templates.map((item) => item.category))],
    [templates],
  );
  const visible = useMemo(() => {
    const filtered = templates.filter(
      (item) =>
        (category === "Semua" || item.category === category) &&
        `${item.name} ${item.description || ""}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
    );
    // QA TC-151: desain rekomendasi selalu di urutan depan.
    return [
      ...filtered.filter((item) => item.recommended),
      ...filtered.filter((item) => !item.recommended),
    ];
  }, [templates, category, query]);
  // QA TC-150 (revisi): pagination bernomor, maksimal 12 desain per halaman.
  const PAGE_SIZE = 12;
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  useEffect(() => setPage(1), [category, query]);
  // Daftar bisa menyusut setelah filter; jaga halaman aktif tetap valid.
  useEffect(() => {
    setPage((previous) => Math.min(previous, pageCount));
  }, [pageCount]);
  const paged = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  return (
    <div className="journal-page">
      <header className="journal-topbar">
        <button className="secondary-btn" onClick={() => setView("landing")}>
          <ArrowLeft size={16} /> Kembali ke beranda
        </button>
        <Brand />
        <div className="journal-topbar-actions">
          {/* QA TC-152 (revisi): tombol Jurnal dihapus dari header halaman
              katalog desain. Menu Jurnal tetap tersedia di navbar landing. */}
          <button className="secondary-btn" onClick={() => setView("login")}>
            Masuk
          </button>
          <button className="primary-btn" onClick={() => setView("designs")}>
            Temukan desain <ArrowRight size={15} />
          </button>
        </div>
      </header>
      <main>
        <section className="journal-hero">
          <span className="eyebrow">KATALOG DESAIN</span>
          <h1>
            Temukan yang terasa
            <br />
            <em>seperti kalian.</em>
          </h1>
          <p>
            Semua desain undangan yang tersedia, lengkap dengan kategori dan
            harga.
          </p>
          {!databaseOnline && (
            <div className="journal-offline">
              Koneksi ke server sedang bermasalah. Katalog mungkin belum lengkap.
            </div>
          )}
        </section>
        <section className="journal-toolbar">
          <div className="journal-filter">
            {categories.map((item) => (
              <button
                key={item}
                className={category === item ? "is-active" : ""}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <label className="journal-search">
            <Search size={15} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari desain..."
            />
          </label>
        </section>
        <section className="ikr-template-grid design-catalog-grid">
          {paged.map((template) => (
            <article className="ikr-template" key={template.id}>
              <button
                className="ikr-template-preview"
                aria-label={`Lihat desain ${template.name}`}
                onClick={() => onTemplate(template)}
              >
                {template.preview || template.sampleImage ? (
                  <div
                    className="ikr-template-sample"
                    style={{
                      backgroundImage: `url(${template.preview || template.sampleImage})`,
                    }}
                    role="img"
                    aria-label={`Sample ${template.name}`}
                  />
                ) : template.canvasSections?.length ? (
                  <WebsiteTemplatePreview
                    template={template}
                    title={template.name}
                    sections={template.canvasSections}
                    bare
                  />
                ) : (
                  <div
                    className="ikr-template-fallback"
                    style={{ background: template.bg, color: template.accent }}
                  >
                    <small>{template.category}</small>
                    <span>
                      Our story,
                      <br />
                      <i>beautifully told.</i>
                    </span>
                  </div>
                )}
                <span className="ikr-preview-action">
                  Lihat desain <ArrowRight size={16} />
                </span>
                {template.recommended && (
                  <span className="ikr-template-badge">
                    <Star size={12} /> Recommended
                  </span>
                )}
              </button>
              <div className="ikr-template-info">
                <div>
                  <small>{template.category}</small>
                  <h3>{template.name}</h3>
                </div>
                <span>{formatRupiah(template.price || 0)}</span>
              </div>
            </article>
          ))}
          {!visible.length && (
            <div className="journal-empty">
              Belum ada desain yang cocok dengan pencarian Anda.
            </div>
          )}
        </section>
        {pageCount > 1 && (
          <nav
            className="catalog-pagination"
            aria-label="Navigasi halaman desain"
          >
            <button
              className="catalog-page-step"
              disabled={page === 1}
              aria-label="Halaman sebelumnya"
              onClick={() => setPage((previous) => Math.max(1, previous - 1))}
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map(
              (number) => (
                <button
                  key={number}
                  className={`catalog-page-number ${number === page ? "active" : ""}`}
                  aria-current={number === page ? "page" : undefined}
                  onClick={() => setPage(number)}
                >
                  {number}
                </button>
              ),
            )}
            <button
              className="catalog-page-step"
              disabled={page === pageCount}
              aria-label="Halaman berikutnya"
              onClick={() =>
                setPage((previous) => Math.min(pageCount, previous + 1))
              }
            >
              <ChevronRight size={16} />
            </button>
          </nav>
        )}
      </main>
      <footer className="journal-footer">
        <Brand />
        <span>Undangan digital. Cerita yang personal.</span>
      </footer>
    </div>
  );
}

// Halaman Jurnal ikrarku — daftar lengkap artikel publik dengan filter kategori.
// Layout kartunya dipakai bersama landing page supaya seragam.
function JournalPage({
  articles,
  setView,
  databaseOnline,
  articleSlug,
  onOpenArticle,
}: {
  articles: ArticleItem[];
  setView: (view: View) => void;
  databaseOnline: boolean;
  /** Slug artikel yang sedang dibuka. Dikendalikan dari level atas supaya
      membuka artikel mengubah URL menjadi /articles/<slug>. */
  articleSlug: string | null;
  onOpenArticle: (slug: string | null) => void;
}) {
  const article = articleSlug
    ? articles.find((item) => item.slug === articleSlug) || null
    : null;
  const [category, setCategory] = useState("Semua");
  const [query, setQuery] = useState("");
  const categories = useMemo(
    () => ["Semua", ...new Set(articles.map((item) => item.category))],
    [articles],
  );
  const visible = useMemo(
    () =>
      articles.filter(
        (item) =>
          (category === "Semua" || item.category === category) &&
          `${item.title} ${item.excerpt} ${item.tags?.join(" ") || ""}`
            .toLowerCase()
            .includes(query.trim().toLowerCase()),
      ),
    [articles, category, query],
  );
  if (article)
    return (
      <ArticleReaderPage
        article={article}
        onBack={() => onOpenArticle(null)}
        publicMode
      />
    );
  return (
    <div className="journal-page">
      <header className="journal-topbar">
        <button className="secondary-btn" onClick={() => setView("landing")}>
          <ArrowLeft size={16} /> Kembali ke beranda
        </button>
        <Brand />
        <div className="journal-topbar-actions">
          <button className="secondary-btn" onClick={() => setView("login")}>
            Masuk
          </button>
          <button className="primary-btn" onClick={() => setView("designs")}>
            Temukan desain <ArrowRight size={15} />
          </button>
        </div>
      </header>
      <main>
        <section className="journal-hero">
          <span className="eyebrow">JURNAL IKRARKU</span>
          <h1>
            Inspirasi untuk
            <br />
            <em>hari istimewa kalian.</em>
          </h1>
          <p>
            Panduan, ide, dan cerita seputar persiapan pernikahan dan undangan
            digital.
          </p>
          {!databaseOnline && (
            <div className="journal-offline">
              Koneksi ke server sedang bermasalah. Daftar artikel mungkin belum
              lengkap.
            </div>
          )}
        </section>
        <section className="journal-toolbar">
          <div className="journal-filter">
            {categories.map((item) => (
              <button
                key={item}
                className={category === item ? "is-active" : ""}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <label className="journal-search">
            <Search size={15} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari artikel..."
            />
          </label>
        </section>
        <section className="journal-grid">
          {visible.map((item) => (
            <JournalCard
              key={item.id}
              article={item}
              onOpen={(value) => onOpenArticle(value.slug)}
            />
          ))}
          {!visible.length && (
            <div className="journal-empty">
              Belum ada artikel yang cocok dengan pencarian Anda.
            </div>
          )}
        </section>
      </main>
      <footer className="journal-footer">
        <Brand />
        <span>Undangan digital. Cerita yang personal.</span>
      </footer>
    </div>
  );
}

function LandingPage(props: {
  setView: (view: View) => void;
  articles: ArticleItem[];
  templates: Template[];
  onTemplate: (template: Template) => void;
  databaseOnline: boolean;
  accountName?: string;
  onOpenWorkspace?: () => void;
  scrollTarget?: string | null;
  onScrolled?: () => void;
  articleSlug?: string | null;
  onOpenArticle?: (slug: string | null) => void;
}) {
  const { articleSlug = null, onOpenArticle } = props;
  const article = articleSlug
    ? props.articles.find((item) => item.slug === articleSlug) || null
    : null;
  if (article)
    return (
      <ArticleReaderPage
        article={article}
        onBack={() => onOpenArticle?.(null)}
        publicMode
      />
    );
  return (
    <LandingPageView
      {...props}
      onArticle={(item) => onOpenArticle?.(item.slug)}
      renderPreview={(template) => (
        <WebsiteTemplatePreview
          template={template}
          title={template.name}
          sections={template.canvasSections || []}
          bare
        />
      )}
    />
  );
}

function Auth({
  view,
  setView,
  login,
  signupAccount,
  lastAuthError = "",
}: {
  lastAuthError?: string;
  view: View;
  setView: (view: View) => void;
  login: (username: string, password: string) => Promise<boolean>;
  signupAccount: (
    name: string,
    username: string,
    password: string,
    passwordConfirm: string,
    email: string,
  ) => Promise<{ ok: boolean; devVerificationUrl?: string; error?: string }>;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [verificationUrl, setVerificationUrl] = useState("");
  const [authError, setAuthError] = useState("");
  const [signupSubmitted, setSignupSubmitted] = useState(false);
  const [resending, setResending] = useState(false);
  const checkoutReturn =
    typeof window !== "undefined" &&
    sessionStorage.getItem("ikrarku-checkout-return") === "true";
  const passwordMatch = password === passwordConfirm;
  const signupDisabled =
    view === "signup" &&
    (!name || !email || !username || password.length < 8 || !passwordMatch);
  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);
    setAuthError("");
    try {
      await runSubmit();
    } catch (error) {
      setAuthError(
        error instanceof Error
          ? error.message
          : "Terjadi gangguan saat memproses. Coba lagi.",
      );
    } finally {
      setSubmitting(false);
    }
  };
  const runSubmit = async () => {
    if (view === "signup") {
      if (signupDisabled) {
        setAuthError(
          "Lengkapi data dan pastikan password minimal 8 karakter serta cocok.",
        );
        return;
      }
      const result = await signupAccount(
        name,
        username,
        password,
        passwordConfirm,
        email,
      );
      if (result.ok) setSignupSubmitted(true);
      else setAuthError(result.error || "Registrasi gagal. Coba lagi.");
      if (result.devVerificationUrl)
        setVerificationUrl(result.devVerificationUrl);
    } else {
      if (!username || !password) {
        setAuthError("Username dan password wajib diisi.");
      } else {
        const ok = await login(username, password);
        if (!ok)
          setAuthError(
            lastAuthError ||
              "Username atau password salah. Periksa kembali lalu coba lagi.",
          );
      }
    }
  };
  const onFieldKeyDown = (event: {
    key: string;
    preventDefault: () => void;
  }) => {
    if (event.key === "Enter") {
      event.preventDefault();
      void submit();
    }
  };
  return (
    <div className="auth-page">
      <section className="auth-visual">
        <button className="auth-back" onClick={() => setView("landing")}>
          <ArrowLeft size={16} /> Kembali ke website
        </button>
        <Brand light />
        <div>
          <div className="eyebrow light">WEDDING WEBSITE WORKSPACE</div>
          <h1>
            Every promise deserves
            <br />a beautiful beginning.
          </h1>
          <p>
            Gunakan akun Anda untuk melanjutkan ke workspace ikrarku dan
            mengakses fitur sesuai peran Anda.
          </p>
        </div>
        <div className="auth-quote">“Rencanakan janji, rayakan cerita.”</div>
      </section>
      <section className="auth-form-wrap">
        <div className="auth-card">
          <div className="mobile-brand">
            <Brand />
          </div>
          <span className="auth-kicker">
            {view === "signup" ? "CREATE USER ACCOUNT" : "WELCOME BACK"}
          </span>
          <h2>
            {view === "signup" ? "Mulai cerita Anda" : "Masuk ke ikrarku"}
          </h2>
          <p>
            {view === "signup"
              ? "Email wajib diverifikasi sebelum akun dapat digunakan."
              : "Masukkan username atau email beserta password akun terdaftar."}
          </p>
          <form
            className="auth-fields"
            onSubmit={(event) => {
              event.preventDefault();
              if (!submitting) void submit();
            }}
          >
            {view === "signup" && (
              <>
                <label>
                  Full name
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    onKeyDown={onFieldKeyDown}
                  />
                </label>
                <label>
                  Email
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    type="email"
                    onKeyDown={onFieldKeyDown}
                  />
                </label>
              </>
            )}
            <label>
              Username atau email
              <input
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                  setAuthError("");
                }}
                onKeyDown={onFieldKeyDown}
              />
            </label>
            <label>
              Password
              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setAuthError("");
                  }}
                  onKeyDown={onFieldKeyDown}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {view === "signup" && (
                <small
                  className={`field-hint ${password && password.length < 8 ? "field-hint-warn" : ""}`}
                >
                  Minimal 8 karakter. Disarankan gabungan huruf besar, angka,
                  dan simbol.
                </small>
              )}
            </label>
            {view === "signup" && (
              <label>
                Repeat Password
                <div className="password-field">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={passwordConfirm}
                    onChange={(event) => setPasswordConfirm(event.target.value)}
                    onKeyDown={onFieldKeyDown}
                  />
                  <button
                    type="button"
                    aria-label={
                      showConfirm
                        ? "Hide repeated password"
                        : "Show repeated password"
                    }
                    onClick={() => setShowConfirm((value) => !value)}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {passwordConfirm && (
                  <small
                    className={passwordMatch ? "password-ok" : "password-error"}
                  >
                    {passwordMatch ? "Password sesuai" : "Password belum sama"}
                  </small>
                )}
              </label>
            )}
            {view === "login" && (
              <div className="login-hints">
                <button
                  type="button"
                  className="forgot-password-link"
                  onClick={() => setView("forgot-password")}
                >
                  <KeyRound size={13} /> Lupa password?
                </button>
                <span>
                  Akun tim dikelola oleh Administrator. Butuh bantuan akses?
                  Hubungi Administrator tim Anda.
                </span>
              </div>
            )}
            {signupSubmitted && (
              <div className="verification-dev-link">
                <CheckCircle2 size={18} />
                <div>
                  <strong>Registrasi berhasil.</strong>
                  <span>
                    Kami mengirim tautan verifikasi ke {email}. Buka email dan
                    klik tautannya untuk mengaktifkan akun sebelum login.
                  </span>
                  {verificationUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        window.history.pushState(
                          {},
                          "",
                          new URL(verificationUrl).pathname +
                            new URL(verificationUrl).search,
                        );
                        setView("verify-email");
                      }}
                    >
                      Buka tautan verifikasi
                    </button>
                  )}
                  <button
                    type="button"
                    className="resend-verify-btn"
                    disabled={resending}
                    onClick={async () => {
                      setResending(true);
                      try {
                        const result = await api.resendVerification(email);
                        if (result?.devVerificationUrl)
                          setVerificationUrl(result.devVerificationUrl);
                        setAuthError("");
                      } catch (error) {
                        setAuthError(
                          error instanceof Error
                            ? error.message
                            : "Gagal mengirim ulang email.",
                        );
                      }
                      setResending(false);
                    }}
                  >
                    {resending
                      ? "Mengirim ulang..."
                      : "Kirim ulang email verifikasi"}
                  </button>
                  {checkoutReturn && (
                    <button
                      type="button"
                      className="back-to-checkout-btn"
                      onClick={() => setView("checkout")}
                    >
                      <ArrowLeft size={13} /> Lanjutkan pemesanan
                    </button>
                  )}
                </div>
              </div>
            )}
            {authError && (
              <div className="auth-error" role="alert">
                <X size={16} />
                <span>{authError}</span>
              </div>
            )}
            <button
              type="submit"
              className="primary-btn full"
              disabled={submitting || signupDisabled}
            >
              {submitting
                ? "Processing..."
                : view === "signup"
                  ? "Register & Send Verification"
                  : "Sign in"}{" "}
              <ArrowRight size={16} />
            </button>
          </form>
          <div className="auth-switch">
            {view === "signup"
              ? "Sudah memiliki akun?"
              : "Belum memiliki akun?"}{" "}
            <button
              type="button"
              onClick={() => {
                setName("");
                setEmail("");
                setUsername("");
                setPassword("");
                setPasswordConfirm("");
                setAuthError("");
                setVerificationUrl("");
                setSignupSubmitted(false);
                setShowPassword(false);
                setShowConfirm(false);
                setView(view === "signup" ? "login" : "signup");
              }}
            >
              {view === "signup" ? "Sign in" : "Sign up"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function NotFoundPage({ onHome }: { onHome: () => void }) {
  return (
    <div className="notfound-page">
      <Brand />
      <div className="notfound-card">
        <span className="notfound-code">404</span>
        <h1>Halaman tidak ditemukan</h1>
        <p>
          Maaf, alamat yang Anda tuju tidak tersedia atau sudah dipindahkan.
          Periksa kembali tautannya atau kembali ke beranda.
        </p>
        <button className="primary-btn" onClick={onHome}>
          <ArrowLeft size={16} />
          Kembali ke beranda
        </button>
      </div>
    </div>
  );
}

function VerifyEmailPage({ setView }: { setView: (view: View) => void }) {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("Memverifikasi email Anda...");
  const [email, setEmail] = useState("");
  const [resending, setResending] = useState(false);
  useEffect(() => {
    const token = linkToken();
    if (!token) {
      setStatus("error");
      setMessage("Token verifikasi tidak ditemukan atau tautan tidak lengkap.");
      return;
    }
    void api
      .verifyEmail(token)
      .then(() => {
        setStatus("success");
        setMessage("Email berhasil diverifikasi. Akun Anda sudah aktif.");
      })
      .catch((error) => {
        setStatus("error");
        setMessage(
          error instanceof Error ? error.message : "Verifikasi gagal.",
        );
      });
  }, []);
  return (
    <div className="verification-page">
      <Brand />
      <div className={`verification-card ${status}`}>
        {status === "loading" ? (
          <Clock3 size={34} />
        ) : status === "success" ? (
          <CheckCircle2 size={34} />
        ) : (
          <X size={34} />
        )}
        <span>EMAIL VERIFICATION</span>
        <h1>
          {status === "success"
            ? "Akun berhasil diaktifkan"
            : status === "error"
              ? "Verifikasi tidak berhasil"
              : "Mohon tunggu"}
        </h1>
        <p>{message}</p>
        {status === "error" && (
          <div className="verification-resend">
            <label>
              Email akun
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="nama@email.com"
              />
            </label>
            <button
              className="secondary-btn"
              disabled={!email.includes("@") || resending}
              onClick={async () => {
                setResending(true);
                try {
                  const result = await api.resendVerification(email);
                  setMessage(
                    result.message ||
                      "Email verifikasi dikirim ulang. Periksa inbox Anda.",
                  );
                } catch (error) {
                  setMessage(
                    error instanceof Error
                      ? error.message
                      : "Gagal mengirim ulang email.",
                  );
                }
                setResending(false);
              }}
            >
              <MailOpen size={15} />
              {resending ? "Mengirim…" : "Kirim ulang verifikasi"}
            </button>
          </div>
        )}
        {status !== "loading" && (
          <button
            className="primary-btn"
            onClick={() => {
              window.history.pushState({}, "", "/login");
              setView("login");
            }}
          >
            Masuk ke ikrarku <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

function TemplateJourneyPage({
  template,
  onBack,
  onPreview,
  onOrder,
}: {
  template: Template;
  onBack: () => void;
  onPreview: () => void;
  onOrder: () => void;
}) {
  const [previewOpen, setPreviewOpen] = useState(false);
  // QA TC-136: mode preview (Desktop / Mobile) pada halaman detail template.
  const [journeyDevice, setJourneyDevice] = useState<DeviceMode>("desktop");
  const previewShellRef = useRef<HTMLDivElement | null>(null);
  const journeySections = useMemo(
    () => hydrateSections(template.canvasSections || []),
    [template.canvasSections],
  );
  // Preview harus selalu mulai dari section pembuka. Container-nya overflow:auto
  // dan posisi scroll-nya bertahan saat preview dibuka ulang atau mode device
  // diganti, sehingga preview sebelumnya terbuka di tengah undangan.
  useScrollResetOnOpen(previewShellRef, previewOpen, journeyDevice);
  const heroImage =
    template.headerImage || template.preview || template.sampleImage;
  return (
    <div className="journey-page">
      <header>
        <button onClick={onBack}>
          <ArrowLeft size={17} />
          Kembali
        </button>
        <Brand />
        <button className="journey-order" onClick={onOrder}>
          <ShoppingCart size={16} />
          Pesan Sekarang
        </button>
      </header>
      <main>
        <section
          className={`journey-visual preset-${template.preset || "classic"}`}
          style={
            heroImage
              ? {
                  backgroundImage: `linear-gradient(180deg,rgba(5,20,15,.1),rgba(5,20,15,.65)),url(${heroImage})`,
                }
              : { background: template.bg }
          }
        >
          <div>
            <span>{template.category}</span>
            <h1>{template.name}</h1>
            <p>A wedding website collection by ikrarku Sites.</p>
          </div>
        </section>
        <section className="journey-content">
          <div>
            <span className="eyebrow">TEMPLATE JOURNEY</span>
            <h2>A story designed to feel unmistakably yours.</h2>
            <p>
              {template.description ||
                "Template premium dengan storytelling, responsif, dan siap dikustomisasi melalui visual Canvas Editor."}
            </p>
            <div className="journey-features">
              <article>
                <LayoutTemplate size={20} />
                <strong>Responsive Canvas</strong>
                <span>Desktop dan mobile experience yang konsisten.</span>
              </article>
              <article>
                <WandSparkles size={20} />
                <strong>No-code customization</strong>
                <span>Text, image, motion, sound, RSVP, dan gallery.</span>
              </article>
              <article>
                <UserCheck size={20} />
                <strong>Managed onboarding</strong>
                <span>
                  Setelah pembayaran, order di-assign ke CS dan Web Designer.
                </span>
              </article>
            </div>
            <button
              className="secondary-btn"
              onClick={() => {
                setPreviewOpen(true);
                onPreview();
              }}
            >
              <Eye size={16} />
              Preview Template
            </button>
          </div>
          <aside>
            <small>
              ONE-TIME PACKAGE · {template.premium ? "PREMIUM" : "STANDARD"}
            </small>
            <strong>{formatRupiah(template.price || 0)}</strong>
            <span>Sudah termasuk onboarding dan project assignment.</span>
            <hr />
            <ul>
              <li>
                <Check size={14} />
                Template license
              </li>
              <li>
                <Check size={14} />
                Customer Service onboarding
              </li>
              <li>
                <Check size={14} />
                Web Designer assignment
              </li>
              <li>
                <Check size={14} />
                Email & PDF receipt
              </li>
              {template.premium && (
                <>
                  <li>
                    <Check size={14} />
                    Premium motion & sound library
                  </li>
                  <li>
                    <Check size={14} />
                    Priority onboarding
                  </li>
                </>
              )}
            </ul>
            <button onClick={onOrder}>
              <ShoppingCart size={17} />
              Pesan Sekarang
            </button>
          </aside>
        </section>
      </main>
      {previewOpen && (
        <div
          className={`journey-preview-overlay actual-template-preview device-${journeyDevice}`}
        >
          {/* QA TC-136: toggle mode Desktop / Mobile pada preview template. */}
          <div className="journey-preview-toolbar">
            <div className="journey-device-switch">
              <button
                className={journeyDevice === "desktop" ? "active" : ""}
                onClick={() => setJourneyDevice("desktop")}
              >
                <Monitor size={15} /> Desktop
              </button>
              <button
                className={journeyDevice === "mobile" ? "active" : ""}
                onClick={() => setJourneyDevice("mobile")}
              >
                <Smartphone size={15} /> Mobile
              </button>
            </div>
            <button
              className="journey-preview-close"
              aria-label="Tutup preview"
              onClick={() => setPreviewOpen(false)}
            >
              <X size={18} />
            </button>
          </div>
          {/* TC-216 menggantikan TC-137: mode Desktop selebar canvas desain
              (DESKTOP_DESIGN_WIDTH), dengan ruang kosong di layar lebar —
              bukan dibentangkan selebar layar. */}
          <DeviceContext value={journeyDevice}>
          <PreviewSurfaceContext value={true}>
          <div
            ref={previewShellRef}
            className={`actual-template-preview-shell device-${journeyDevice}`}
          >
            {template.canvasSections?.length ? (
              <FitDesktop device={journeyDevice} sections={journeySections}>
                <WeddingCanvas
                  page="pages"
                  sections={journeySections}
                  selectedTemplate={template}
                  greetings={[]}
                  addGreeting={() => undefined}
                  guests={[]}
                  addGuest={() => undefined}
                />
              </FitDesktop>
            ) : (
              <div
                className={`journey-preview-window preset-${template.preset || "classic"}`}
                style={
                  template.preview
                    ? {
                        backgroundImage: `linear-gradient(180deg,rgba(5,20,15,.08),rgba(5,20,15,.58)),url(${template.preview})`,
                      }
                    : { background: template.bg }
                }
              >
                <h2>{template.name}</h2>
                <p>Preview image template.</p>
              </div>
            )}
          </div>
          </PreviewSurfaceContext>
          </DeviceContext>
        </div>
      )}
    </div>
  );
}

function CheckoutPage({
  template,
  paymentMethods,
  order,
  onBack,
  createOrder,
  payOrder,
  onSignIn,
  account,
}: {
  template: Template;
  paymentMethods: PaymentMethod[];
  order: OrderResult | null;
  onBack: () => void;
  createOrder: (
    name: string,
    email: string,
    phone: string,
  ) => Promise<OrderResult | null>;
  payOrder: (method: string) => Promise<boolean>;
  onSignIn: () => void;
  account?: AuthAccount;
}) {
  const draft = useMemo(() => {
    try {
      return JSON.parse(
        sessionStorage.getItem("ikrarku-checkout-draft") || "{}",
      );
    } catch {
      return {};
    }
  }, []);
  const [name, setName] = useState(String(draft.name || ""));
  const [email, setEmail] = useState(String(draft.email || ""));
  const [phone, setPhone] = useState(String(draft.phone || ""));
  const [method, setMethod] = useState(paymentMethods[0]?.code || "");
  const [working, setWorking] = useState(false);
  useEffect(() => {
    sessionStorage.setItem(
      "ikrarku-checkout-draft",
      JSON.stringify({ templateId: template.id, name, email, phone }),
    );
  }, [template.id, name, email, phone]);
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validPhone = phone.replace(/\D/g, "").length >= 9;
  // QA TC-072: sistem mengenali status akun dari email pemesan lalu mengarahkan ke Sign In (auto-fill) atau Sign Up.
  const [accountStatus, setAccountStatus] = useState<
    "idle" | "checking" | "registered" | "new"
  >("idle");
  const [checkedEmail, setCheckedEmail] = useState("");
  useEffect(() => {
    if (account) {
      setName((previous) => (previous.trim() ? previous : account.name || ""));
      setEmail((previous) =>
        previous.trim() ? previous : account.email || "",
      );
      setAccountStatus("idle");
    }
  }, [account]);
  const runEmailCheck = async () => {
    if (account || !validEmail || checkedEmail === email) return;
    setAccountStatus("checking");
    setCheckedEmail(email);
    try {
      const result = await api.checkEmail(email);
      setAccountStatus(result.registered ? "registered" : "new");
    } catch {
      setAccountStatus("idle");
    }
  };
  return (
    <div className="checkout-page">
      <header>
        <button onClick={onBack}>
          <ArrowLeft size={17} />
          Template detail
        </button>
        <Brand />
        <span>Secure checkout</span>
      </header>
      <main>
        <section className="checkout-form">
          <span className="eyebrow">
            {order ? "STEP 2 OF 2" : "STEP 1 OF 2"}
          </span>
          <h1>{order ? "Pilih metode pembayaran" : "Data pemesan"}</h1>
          {!order ? (
            <>
              <p>
                Email digunakan untuk receipt dan nomor telepon digunakan CS
                untuk proses onboarding.
              </p>
              {account ? (
                <div className="checkout-account-banner signed-in">
                  <UserCheck size={17} />
                  <div>
                    <strong>Masuk sebagai {account.name}</strong>
                    <span>
                      Nama dan email diisi otomatis dari akun ikrarku Anda.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="checkout-auth-options">
                  <button onClick={onSignIn}>Sudah punya akun? Sign In</button>
                  <span className="checkout-no-account">
                    Belum punya akun? Tidak perlu daftar — akun dibuat otomatis
                    setelah pembayaran.
                  </span>
                </div>
              )}
              <label>
                Nama lengkap
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama pemesan"
                />
              </label>
              <label>
                Email receipt
                <input
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setAccountStatus("idle");
                  }}
                  onBlur={() => void runEmailCheck()}
                  type="email"
                  placeholder="nama@email.com"
                  disabled={Boolean(account)}
                />
                {email && !validEmail && (
                  <small className="password-error">
                    Format email belum valid.
                  </small>
                )}
              </label>
              {!account && accountStatus === "checking" && (
                <div className="checkout-account-banner checking">
                  <Repeat2 size={16} />
                  <span>Mengecek status akun...</span>
                </div>
              )}
              {!account && accountStatus === "registered" && (
                <div className="checkout-account-banner registered">
                  <UserCheck size={17} />
                  <div>
                    <strong>Email ini sudah punya akun ikrarku.</strong>
                    <span>
                      Sign in agar Nama dan Nomor WhatsApp terisi otomatis dari
                      data akun Anda.
                    </span>
                    <button type="button" onClick={onSignIn}>
                      Sign In sekarang
                    </button>
                  </div>
                </div>
              )}
              {!account && accountStatus === "new" && (
                <div className="checkout-account-banner new">
                  <UserPlus size={17} />
                  <div>
                    <strong>Email ini belum terdaftar — tidak perlu daftar.</strong>
                    <span>
                      Lanjutkan pembayaran. Setelah lunas, akun ikrarku dibuat
                      otomatis dan info login dikirim ke email ini. Saat login
                      pertama Anda akan diminta membuat password baru.
                    </span>
                  </div>
                </div>
              )}
              <label>
                Nomor WhatsApp
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                />
                {phone && !validPhone && (
                  <small className="password-error">
                    Nomor telepon minimal 9 digit.
                  </small>
                )}
              </label>
              <button
                className="primary-btn checkout-next"
                disabled={!name.trim() || !validEmail || !validPhone || working}
                onClick={async () => {
                  setWorking(true);
                  await createOrder(name, email, phone);
                  setWorking(false);
                }}
              >
                {working ? "Menyimpan order..." : "Lanjut ke Pembayaran"}
                <ArrowRight size={16} />
              </button>
            </>
          ) : (
            <>
              <p>
                Order <strong>{order.orderNo}</strong> sudah dibuat. Pilih kanal
                pembayaran.
              </p>
              <div className="payment-method-grid">
                {paymentMethods.map((item) => (
                  <button
                    key={item.id}
                    className={method === item.code ? "active" : ""}
                    onClick={() => setMethod(item.code)}
                  >
                    {item.code === "QRIS" ? (
                      <QrCode size={25} />
                    ) : item.code === "GOPAY" ? (
                      <WalletCards size={25} />
                    ) : (
                      <CreditCard size={25} />
                    )}
                    <strong>{item.label}</strong>
                    <span>{String(item.config?.instructions || "")}</span>
                  </button>
                ))}
              </div>
              <div className="local-payment-note">
                <ShieldCheck size={18} />
                <p>
                  <strong>Secure payment confirmation</strong>
                  <span>
                    Pastikan metode pembayaran yang dipilih sudah benar sebelum
                    melanjutkan.
                  </span>
                </p>
              </div>
              <button
                className="primary-btn checkout-next"
                disabled={!method || working}
                onClick={async () => {
                  setWorking(true);
                  await payOrder(method);
                  setWorking(false);
                }}
              >
                {working ? "Memproses pembayaran..." : "Lanjutkan Pembayaran"}
                <CheckCircle size={16} />
              </button>
            </>
          )}
        </section>
        <aside className="checkout-summary">
          <div
            className={`checkout-template preset-${template.preset || "classic"}`}
            style={
              template.preview
                ? {
                    backgroundImage: `linear-gradient(180deg,rgba(5,20,15,.05),rgba(5,20,15,.6)),url(${template.preview})`,
                  }
                : { background: template.bg }
            }
          >
            <span>{template.category}</span>
            <strong>{template.name}</strong>
          </div>
          <h3>Order summary</h3>
          <div>
            <span>Template package</span>
            <strong>{formatRupiah(template.price || 0)}</strong>
          </div>
          <div>
            <span>Onboarding CS</span>
            <strong>Included</strong>
          </div>
          <div>
            <span>Web Designer</span>
            <strong>Included</strong>
          </div>
          <hr />
          <div className="checkout-total">
            <span>Total</span>
            <strong>{formatRupiah(template.price || 0)}</strong>
          </div>
        </aside>
      </main>
    </div>
  );
}

function PaymentSuccessPage({
  order,
  template,
  onHome,
}: {
  order: OrderResult;
  template: Template | null;
  onHome: () => void;
}) {
  return (
    <div className="payment-success-page">
      <div className="success-rings">
        <CheckCircle size={46} />
      </div>
      <span>PAYMENT RECEIVED</span>
      <h1>Terima kasih. Project Anda sudah masuk ke tim kami.</h1>
      <p>
        Order <strong>{order.orderNo}</strong> telah dibayar. Satu Customer
        Service dan satu Web Designer sudah dialokasikan melalui workload
        assignment.
      </p>
      <div className="success-summary">
        <div>
          <small>Template</small>
          <strong>{template?.name || "Wedding Template"}</strong>
        </div>
        <div>
          <small>Total</small>
          <strong>{formatRupiah(order.amount)}</strong>
        </div>
        <div>
          <small>Status</small>
          <strong>Paid · Onboarding</strong>
        </div>
      </div>
      <div className="success-steps">
        <article>
          <span>1</span>
          <div>
            <strong>Email receipt & akun</strong>
            <p>
              Receipt PDF dikirim ke email pemesan. Bila email itu belum punya
              akun, info login akun ikrarku ikut dikirim — login pertama akan
              meminta Anda membuat password baru.
            </p>
          </div>
        </article>
        <article>
          <span>2</span>
          <div>
            <strong>CS follow-up</strong>
            <p>CS menghubungi via Email, Web, atau WhatsApp.</p>
          </div>
        </article>
        <article>
          <span>3</span>
          <div>
            <strong>Web production</strong>
            <p>Web Designer menerima task pembuatan website.</p>
          </div>
        </article>
      </div>
      <div className="success-actions">
        {order.receiptUrl && (
          <a href={order.receiptUrl} target="_blank" rel="noreferrer">
            <ReceiptText size={16} />
            Download PDF Receipt
          </a>
        )}
        <button onClick={onHome}>Kembali ke Landing Page</button>
      </div>
    </div>
  );
}

function PaymentSettingsPage({
  methods,
  onChange,
}: {
  methods: PaymentMethod[];
  onChange: (method: PaymentMethod) => void;
}) {
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">COMMERCE SETTINGS</div>
          <h1>Payment Methods</h1>
          <p>
            Aktifkan kanal pembayaran dan atur informasi merchant yang tampil
            saat checkout.
          </p>
        </div>
      </div>
      <div className="payment-settings-grid">
        {methods.map((method) => (
          <PaymentMethodCard
            key={method.id}
            method={method}
            onSave={onChange}
          />
        ))}
      </div>
    </div>
  );
}
function PaymentMethodCard({
  method,
  onSave,
}: {
  method: PaymentMethod;
  onSave: (method: PaymentMethod) => void;
}) {
  const [enabled, setEnabled] = useState(method.enabled);
  const [merchantName, setMerchantName] = useState(
    String(method.config?.merchantName || ""),
  );
  const [instructions, setInstructions] = useState(
    String(method.config?.instructions || ""),
  );
  return (
    <article className="payment-setting-card">
      <header>
        {method.code === "QRIS" ? (
          <QrCode />
        ) : method.code === "GOPAY" ? (
          <WalletCards />
        ) : (
          <CreditCard />
        )}
        <div>
          <strong>{method.label}</strong>
          <span>{method.code}</span>
        </div>
        <button
          className={`toggle ${enabled ? "on" : ""}`}
          onClick={() => setEnabled((v) => !v)}
        >
          <i />
        </button>
      </header>
      <label>
        Merchant name
        <input
          value={merchantName}
          onChange={(e) => setMerchantName(e.target.value)}
        />
      </label>
      <label>
        Checkout instructions
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
      </label>
      <button
        className="primary-btn"
        onClick={() =>
          onSave({
            ...method,
            enabled,
            config: { ...method.config, merchantName, instructions },
          })
        }
      >
        <Save size={15} />
        Save Method
      </button>
    </article>
  );
}

function TasksPage({
  tasks,
  onRefresh,
  onUpdate,
  onReview,
  canApprove,
  templates = [],
  onManageCanvas,
}: {
  tasks: TaskItem[];
  onRefresh: () => void;
  onUpdate: (id: string, status: string) => Promise<void>;
  onReview: (
    templateId: string,
    status: "Approved" | "Rejected",
    feedback?: string,
  ) => Promise<void>;
  canApprove: boolean;
  templates?: Template[];
  onManageCanvas?: (userId: string) => void;
}) {
  const [filter, setFilter] = useState("All");
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  // Preview approval sebelumnya hanya punya satu tampilan; reviewer tidak bisa
  // memeriksa versi mobile sebelum menyetujui template.
  const [previewDevice, setPreviewDevice] = useState<DeviceMode>("desktop");
  const previewStageRef = useRef<HTMLDivElement | null>(null);
  useScrollResetOnOpen(
    previewStageRef,
    Boolean(previewTemplate),
    previewTemplate?.id,
    previewDevice,
  );
  const [draftStatus, setDraftStatus] = useState<Record<string, string>>({});
  const [savingStatus, setSavingStatus] = useState("");
  const approvalTasks = tasks.filter((task) => task.task_type === "Approval");
  const regularTasks = tasks.filter((task) => task.task_type !== "Approval");
  const visible = regularTasks.filter(
    (task) => filter === "All" || task.status === filter,
  );
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">WORK MANAGEMENT</div>
          <h1>Tasks & Tickets</h1>
          <p>
            Ticket order, project, inbound follow-up, dan approval template
            tersimpan pada database.
          </p>
        </div>
        <button className="secondary-btn" onClick={onRefresh}>
          <Repeat2 size={16} />
          Refresh Database
        </button>
      </div>
      {canApprove && (
        <section className="approval-task-section">
          <div className="section-heading">
            <div>
              <span>ADMINISTRATOR APPROVAL</span>
              <h2>Template Approval</h2>
              <p>
                Setiap pengajuan Web Designer masuk ke antrean ini. Keputusan
                akan memperbarui status template dan mengirim email ke
                requestor.
              </p>
            </div>
            <strong>
              {approvalTasks.filter((task) => task.status === "Open").length}{" "}
              Pending
            </strong>
          </div>
          <div className="approval-task-grid">
            {approvalTasks.length ? (
              approvalTasks.map((task) => (
                <article
                  key={task.id}
                  className={`approval-task-card status-${task.status.toLowerCase()}`}
                >
                  <header>
                    <span>{task.template_status || task.status}</span>
                    <small>{task.requestor_name || "Template Creator"}</small>
                  </header>
                  <h3>{task.template_name || task.title}</h3>
                  <p>{task.description}</p>
                  <label>
                    Feedback untuk requestor
                    <textarea
                      value={feedback[task.id] || task.decision_note || ""}
                      onChange={(event) =>
                        setFeedback((previous) => ({
                          ...previous,
                          [task.id]: event.target.value,
                        }))
                      }
                      placeholder="Catatan approval atau alasan reject..."
                    />
                  </label>
                  <footer>
                    <button
                      className="preview-template-btn"
                      onClick={() => {
                        const found = templates.find(
                          (item) => item.id === task.template_id,
                        );
                        setPreviewTemplate(found || null);
                      }}
                      disabled={
                        !templates.some((item) => item.id === task.template_id)
                      }
                      title={
                        templates.some((item) => item.id === task.template_id)
                          ? "Lihat isi template"
                          : "Template tidak tersedia untuk preview"
                      }
                    >
                      <Eye size={15} />
                      Preview isi template
                    </button>
                    {task.status === "Open" ? (
                      <>
                        <button
                          className="approve"
                          onClick={() =>
                            void onReview(
                              task.template_id || "",
                              "Approved",
                              feedback[task.id] || "",
                            )
                          }
                        >
                          <Check size={15} />
                          Approved & Publish
                        </button>
                        <button
                          className="reject"
                          onClick={() =>
                            void onReview(
                              task.template_id || "",
                              "Rejected",
                              feedback[task.id] || "",
                            )
                          }
                        >
                          <X size={15} />
                          Reject
                        </button>
                      </>
                    ) : (
                      <span
                        className={`approval-decision ${task.status.toLowerCase()}`}
                      >
                        {task.status}
                      </span>
                    )}
                    <small>
                      {new Date(task.created_at).toLocaleString("id-ID")}
                    </small>
                  </footer>
                </article>
              ))
            ) : (
              <div className="empty-state">
                <CheckCircle size={32} />
                <h2>Tidak ada approval pending</h2>
              </div>
            )}
          </div>
        </section>
      )}
      <div className="task-filter">
        {["All", "Open", "In Progress", "Waiting Customer", "Done"].map(
          (item) => (
            <button
              className={filter === item ? "active" : ""}
              onClick={() => setFilter(item)}
              key={item}
            >
              {item}
            </button>
          ),
        )}
      </div>
      {visible.length ? (
        <div className="task-board">
          {visible.map((task) => (
            <article key={task.id}>
              <header>
                <span
                  className={`task-priority ${task.priority.toLowerCase()}`}
                >
                  {task.priority}
                </span>
                <small>
                  {task.order_no || task.task_type || "Internal task"}
                </small>
              </header>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <div className="task-customer">
                <strong>
                  {task.customer_name || task.requestor_name || "Platform"}
                </strong>
                <span>
                  {task.email || task.requestor_email || ""} {task.phone || ""}
                </span>
              </div>
              {task.assigned_user_name && (
                <div className="task-owner">
                  <UserCog size={13} /> Web Designer: {task.assigned_user_name}
                </div>
              )}
              {/* Preview template yang dibeli customer, langsung dari kartu task. */}
              {(() => {
                const taskTemplate = templates.find(
                  (item) =>
                    item.id === task.template_id ||
                    item.name === task.template_name,
                );
                if (!taskTemplate) return null;
                return (
                  <button
                    type="button"
                    className="task-template-preview"
                    onClick={() => setPreviewTemplate(taskTemplate)}
                  >
                    <Eye size={14} /> Preview template {taskTemplate.name}
                  </button>
                );
              })()}
              <footer className="task-footer">
                {/* Manage Canvas: Web Designer membuka canvas customer langsung
                    dari task yang ditugaskan kepadanya. */}
                {onManageCanvas && task.customer_user_id && (
                  <button
                    type="button"
                    className="task-manage-canvas"
                    onClick={() =>
                      onManageCanvas(task.customer_user_id as string)
                    }
                  >
                    <WandSparkles size={14} /> Manage Canvas
                  </button>
                )}
                <select
                  value={draftStatus[task.id] ?? task.status}
                  onChange={(event) =>
                    setDraftStatus((previous) => ({
                      ...previous,
                      [task.id]: event.target.value,
                    }))
                  }
                >
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Waiting Customer</option>
                  <option>Done</option>
                  <option>Cancelled</option>
                </select>
                {/* Status baru disimpan setelah ditekan Save, lalu customer
                    diberi tahu lewat Live Chat. */}
                {
                  <button
                    type="button"
                    className="task-save-status"
                    disabled={
                      savingStatus === task.id ||
                      (draftStatus[task.id] ?? task.status) === task.status
                    }
                    onClick={async () => {
                      const next = draftStatus[task.id] ?? task.status;
                      setSavingStatus(task.id);
                      // Notifikasi ke customer dikirim server pada
                      // PATCH /api/tasks/:id. Memanggilnya lagi dari sini
                      // membuat customer menerima dua pesan untuk satu
                      // perubahan status.
                      await onUpdate(task.id, next);
                      setSavingStatus("");
                      setDraftStatus((previous) => {
                        const copy = { ...previous };
                        delete copy[task.id];
                        return copy;
                      });
                    }}
                  >
                    <Save size={13} />
                    {savingStatus === task.id ? "Menyimpan..." : "Save Status"}
                  </button>
                }
                <small>
                  {new Date(task.created_at).toLocaleString("id-ID")}
                </small>
              </footer>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <ClipboardList size={34} />
          <h2>Belum ada task operasional</h2>
          <p>Task akan dibuat otomatis dari order atau workflow platform.</p>
        </div>
      )}
      {previewTemplate && (
        <div className="dialog-overlay template-quick-preview">
          <div className="template-preview-dialog wide">
            <header>
              <div>
                <span>REVIEW SEBELUM APPROVE</span>
                <h2>{previewTemplate.name}</h2>
                <small>
                  {previewTemplate.category} ·{" "}
                  {formatRupiah(previewTemplate.price || 0)} ·{" "}
                  {previewTemplate.status}
                </small>
              </div>
              <div className="preview-header-actions">
                <div className="journey-device-switch">
                  <button
                    className={previewDevice === "desktop" ? "active" : ""}
                    onClick={() => setPreviewDevice("desktop")}
                  >
                    <Monitor size={15} /> Desktop
                  </button>
                  <button
                    className={previewDevice === "mobile" ? "active" : ""}
                    onClick={() => setPreviewDevice("mobile")}
                  >
                    <Smartphone size={15} /> Mobile
                  </button>
                </div>
                <button
                  className="preview-close-btn"
                  aria-label="Tutup preview"
                  onClick={() => setPreviewTemplate(null)}
                >
                  <X size={18} />
                </button>
              </div>
            </header>
            <DeviceContext value={previewDevice}>
            <PreviewSurfaceContext value={true}>
            <div
              ref={previewStageRef}
              className={`template-dialog-actual-preview live device-${previewDevice}`}
            >
              <TemplateLivePreview template={previewTemplate} />
            </div>
            </PreviewSurfaceContext>
            </DeviceContext>
            <footer>
              <span className="preview-hint">
                <CircleHelp size={14} /> Periksa seluruh section, harga, dan
                konten sebelum mengambil keputusan.
              </span>
              <button
                className="secondary-btn"
                onClick={() => setPreviewTemplate(null)}
              >
                Tutup
              </button>
              <button
                className="approve"
                onClick={() => {
                  void onReview(
                    previewTemplate.id,
                    "Approved",
                    feedback[previewTemplate.id] || "",
                  );
                  setPreviewTemplate(null);
                }}
              >
                <Check size={15} />
                Approve & Publish
              </button>
              <button
                className="reject"
                onClick={() => {
                  void onReview(
                    previewTemplate.id,
                    "Rejected",
                    feedback[previewTemplate.id] || "",
                  );
                  setPreviewTemplate(null);
                }}
              >
                <X size={15} />
                Reject
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}

const permissionCatalog = [
  ["dashboard.user", "Customer Dashboard"],
  ["dashboard.editor", "Web Designer Dashboard"],
  ["dashboard.cs", "CS Dashboard"],
  ["templates.view", "View Templates"],
  ["templates.create", "Create Templates"],
  ["templates.edit", "Edit Templates"],
  ["canvas.manage", "Manage Canvas"],
  ["tasks.view", "View Tasks"],
  ["tasks.update", "Update Tasks"],
  ["articles.view", "View Articles"],
  ["articles.manage", "Manage Articles"],
  ["sounds.view", "View Sounds"],
  ["sounds.manage", "Manage Sounds"],
  ["settings.payment", "Payment Settings"],
  ["orders.view", "View Orders"],
  ["users.manage", "Manage Users"],
  ["roles.manage", "Manage Roles"],
  ["conversations.view", "View Conversations"],
  ["conversations.reply", "Reply Conversations"],
  ["conversations.outbound", "Message Users"],
  ["templates.approve", "Approve Templates"],
];
function RolesPermissionsPage({
  roles,
  onRefresh,
  onCreate,
  onUpdate,
  onDelete,
}: {
  roles: RoleItem[];
  onRefresh: () => Promise<void>;
  onCreate: (name: string, p: string[]) => Promise<void>;
  onUpdate: (id: string, name: string, p: string[]) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [selectedId, setSelectedId] = useState(roles[0]?.id || "");
  const [current, setCurrent] = useState<RoleItem | undefined>(
    roles.find((r) => r.id === selectedId),
  );
  const [newName, setNewName] = useState("");
  useEffect(
    () => setCurrent(roles.find((r) => r.id === selectedId)),
    [selectedId, roles],
  );
  return (
    <div className="page roles-page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">BACKEND ACCESS CONTROL</div>
          <h1>Roles & Permissions</h1>
          <p>
            Administrator dapat menambah, mengurangi, dan menentukan fitur yang
            dapat dilihat oleh setiap role.
          </p>
        </div>
        <button className="secondary-btn" onClick={() => void onRefresh()}>
          <Repeat2 size={16} />
          Refresh
        </button>
      </div>
      <div className="roles-layout">
        <aside>
          <h3>Available roles</h3>
          {roles.map((role) => (
            <button
              key={role.id}
              className={selectedId === role.id ? "active" : ""}
              onClick={() => setSelectedId(role.id)}
            >
              <KeyRound size={15} />
              <span>
                <strong>{displayRole(role.name)}</strong>
                <small>
                  {role.permissions.length} permissions · {role.userCount || 0}{" "}
                  accounts
                </small>
              </span>
              {role.isSystem && <ShieldCheck size={13} />}
            </button>
          ))}
          <div className="new-role">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New role name"
            />
            <button
              disabled={!newName.trim()}
              onClick={async () => {
                await onCreate(newName.trim(), []);
                setNewName("");
              }}
            >
              <Plus size={14} />
              Add Role
            </button>
          </div>
        </aside>
        <section>
          {current ? (
            <>
              <header>
                <div>
                  <span>ROLE CONFIGURATION</span>
                  <h2>{displayRole(current.name)}</h2>
                </div>
                {!current.isSystem && (
                  <button
                    className="danger-btn"
                    disabled={Boolean(current.userCount)}
                    title={
                      current.userCount
                        ? `Role masih digunakan ${current.userCount} akun`
                        : undefined
                    }
                    onClick={() => {
                      if (
                        window.confirm(
                          `Delete role ${displayRole(current.name)}? Tindakan ini tidak dapat dibatalkan.`,
                        )
                      )
                        void onDelete(current.id);
                    }}
                  >
                    <Trash2 size={14} />
                    {current.userCount
                      ? `Used by ${current.userCount} accounts`
                      : "Delete Role"}
                  </button>
                )}
              </header>
              <div className="permission-grid">
                {permissionCatalog.map(([key, label]) => {
                  const checked =
                    current.permissions.includes("*") ||
                    current.permissions.includes(key);
                  return (
                    <label key={key} className={checked ? "active" : ""}>
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={current.permissions.includes("*")}
                        onChange={(e) =>
                          setCurrent({
                            ...current,
                            permissions: e.target.checked
                              ? [...current.permissions, key]
                              : current.permissions.filter(
                                  (item) => item !== key,
                                ),
                          })
                        }
                      />
                      <span>
                        <strong>{label}</strong>
                        <small>{key}</small>
                      </span>
                    </label>
                  );
                })}
              </div>
              <button
                className="primary-btn"
                disabled={current.permissions.includes("*")}
                onClick={() =>
                  void onUpdate(current.id, current.name, current.permissions)
                }
              >
                <Save size={15} />
                Save Permissions
              </button>
            </>
          ) : (
            <div className="empty-state">
              <KeyRound size={32} />
              <h2>Pilih role</h2>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function Brand({ light = false }: { light?: boolean }) {
  return (
    <div className={`brand ${light ? "brand-light" : ""}`}>
      <img className="brand-logo" src="/brand/ikrarku-logo.png" alt="ikrarku" />
    </div>
  );
}

function Sidebar({
  role,
  view,
  setView,
  open,
  logout,
  currentAccount,
  onResetEditor,
}: {
  role: Role;
  view: View;
  setView: (view: View) => void;
  open: boolean;
  logout: () => void;
  currentAccount?: AuthAccount;
  onResetEditor?: () => void;
}) {
  const permissions = currentAccount?.permissions || [];
  const can = (permission: string) =>
    permissions.includes("*") || permissions.includes(permission);
  // VN 7 (15 Okt) — urutan mengikuti seberapa sering menu dipakai:
  //   1. Desain   : pekerjaan harian Web Designer (Templates & Approval naik
  //                 tepat di bawah dashboard), plus menu customer;
  //   2. Layanan  : CS & tiket;
  //   3. Admin    : konfigurasi yang hanya terlihat Administrator.
  // Setiap role hanya melihat menu yang izinnya ia punya, jadi urutan ini
  // tidak menambah atau mengurangi menu siapa pun.
  type MenuGroup = "design" | "service" | "admin" | "account";
  const isAdminConfig = can("users.manage");
  const menuCandidates: [
    View,
    typeof LayoutDashboard,
    string,
    string,
    MenuGroup,
  ][] = [
    // --- 1. Desain ---------------------------------------------------------
    ["admin", LayoutDashboard, "Platform Overview", "*", "design"],
    [
      "dashboard",
      LayoutDashboard,
      can("dashboard.editor") ? "Web Designer Dashboard" : "Wedding Dashboard",
      can("dashboard.editor") ? "dashboard.editor" : "dashboard.user",
      "design",
    ],
    [
      "templates",
      Palette,
      can("templates.create") ? "Templates & Approval" : "Templates & Canvas",
      "templates.view",
      "design",
    ],
    // QA TC-170 & TC-181: Canvas Editor bukan lagi menu mandiri untuk Admin
    // maupun Customer. Alurnya sekarang lewat Manage Canvas / Templates, jadi
    // menu ini hanya relevan bagi Web Designer yang mengerjakan order.
    ...(role === "Editor"
      ? ([
          ["editor", WandSparkles, "Canvas Editor", "canvas.manage", "design"],
        ] as [View, typeof LayoutDashboard, string, string, MenuGroup][])
      : []),
    ["sound-library", Music2, "Sound Library", "sounds.manage", "design"],
    // QA TC-175: dari sudut pandang customer istilahnya "order", bukan "project".
    ["my-orders", PackageCheck, "My Order", "dashboard.user", "design"],
    // Dashboard customer: Add Canvas diganti pengelolaan tamu dan RSVP.
    ["invitee-management", Users, "List Undangan", "dashboard.user", "design"],
    ["rsvp-confirmation", CheckCircle, "RSVP Confirmation", "dashboard.user", "design"],
    // Komisi milik Web Designer ada di kelompok kerjanya; versi Administrator
    // (pengaturan share fee) adalah konfigurasi, jadi turun ke bawah.
    [
      "commissions",
      Wallet,
      isAdminConfig ? "Komisi & Share Fee" : "Komisi Saya",
      isAdminConfig ? "users.manage" : "templates.create",
      isAdminConfig ? "admin" : "design",
    ],
    // --- 2. Layanan --------------------------------------------------------
    ["cs-dashboard", BarChart3, "CS Dashboard", "dashboard.cs", "service"],
    ["tasks", ClipboardList, "Tasks & Tickets", "tasks.view", "service"],
    [
      "customer-service",
      MessageSquareText,
      "Support Inbox",
      "conversations.view",
      "service",
    ],
    ["orders", ReceiptText, "Orders & Revenue", "orders.view", "service"],
    // --- 3. Admin ----------------------------------------------------------
    // QA TC-168: "Client Assignment" dilebur ke Manage Canvas — assign dan
    // kelola canvas customer kini satu alur. Menu ini tinggal "Users & Roles"
    // untuk Administrator.
    ["users", UserCog, "Users & Roles", "users.manage", "admin"],
    ["roles", KeyRound, "Roles & Permissions", "roles.manage", "admin"],
    // Articles CMS dikelola Administrator; Web Designer dan Customer tidak
    // perlu menu ini (QA TC-182) — artikel diakses dari landing page.
    ...(role === "Admin"
      ? ([
          ["articles", BookOpen, "Articles CMS", "articles.manage", "admin"],
        ] as [View, typeof LayoutDashboard, string, string, MenuGroup][])
      : []),
    ["payment-settings", CreditCard, "Payment Methods", "settings.payment", "admin"],
    ["audit-log", ShieldCheck, "Audit Trail", "*", "admin"],
    // --- Akun --------------------------------------------------------------
    ["help", CircleHelp, "Pusat Bantuan", "", "account"],
    ["settings", Settings, "Settings", "", "account"],
  ];
  const groupOrder: MenuGroup[] = ["design", "service", "admin", "account"];
  const groupLabel: Record<MenuGroup, string> = {
    design: "Desain",
    service: "Layanan",
    admin: "Administrasi",
    account: "",
  };
  const allowed = menuCandidates.filter(
    ([, , , permission]) => !permission || can(permission),
  );
  // Label kelompok hanya berguna bila menu terbagi lebih dari satu kelompok
  // kerja; customer yang hanya punya menu "Desain" tidak perlu melihatnya.
  const workGroups = new Set(
    allowed.map(([, , , , group]) => group).filter((group) => group !== "account"),
  );
  const showGroupLabels = workGroups.size > 1;
  const menus: [View, typeof LayoutDashboard, string, string | null][] =
    groupOrder.flatMap((group) =>
      allowed
        .filter(([, , , , itemGroup]) => itemGroup === group)
        .map(
          ([target, icon, label], index) =>
            [
              target,
              icon,
              label,
              showGroupLabels && index === 0 && groupLabel[group]
                ? groupLabel[group]
                : null,
            ] as [View, typeof LayoutDashboard, string, string | null],
        ),
    );
  return (
    <aside className={`sidebar ${open ? "" : "hidden"}`}>
      <Brand />
      <div className="workspace-pill">
        <div className="avatar-mini">
          {(currentAccount?.name || "IK").slice(0, 2).toUpperCase()}
        </div>
        <div>
          <strong>
            {currentAccount?.name ||
              (role === "User"
                ? "Customer Workspace"
                : role === "Editor"
                  ? "Web Designer Studio"
                  : role === "Customer Service"
                    ? "Support Desk"
                    : "Administrator Console")}
          </strong>
          <span>{currentAccount?.email || displayRole(role)}</span>
        </div>
      </div>
      <nav>
        {menus.map(([target, Icon, label, groupHeading]) => (
          <Fragment key={target}>
            {groupHeading && (
              <span className="sidebar-group-label">{groupHeading}</span>
            )}
            <button
              className={view === target ? "active" : ""}
              onClick={() => {
                if (target === "editor") onResetEditor?.();
                setView(target);
              }}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          </Fragment>
        ))}
      </nav>
      <div className="sidebar-bottom">
        {role === "User" && (
          <div className="upgrade-card">
            <Crown size={18} />
            <strong>ikrarku Signature</strong>
            <span>Buka template premium dan analytics lengkap.</span>
            <button>Explore plan</button>
          </div>
        )}
        <button className="support-link danger" onClick={logout}>
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </aside>
  );
}

function Topbar({
  role,
  toggleSidebar,
  sidebarOpen,
  currentAccount,
  onChat,
  onSettings,
  onPaymentSettings,
  onLogout,
  canPaymentSettings,
}: {
  role: Role;
  toggleSidebar: () => void;
  sidebarOpen: boolean;
  currentAccount?: AuthAccount;
  onChat: () => void;
  onSettings: () => void;
  onPaymentSettings: () => void;
  onLogout: () => void;
  canPaymentSettings: boolean;
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  return (
    <header className="topbar">
      <button
        className="icon-btn"
        onClick={toggleSidebar}
        title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        {sidebarOpen ? (
          <PanelLeftClose size={18} />
        ) : (
          <PanelLeftOpen size={18} />
        )}
      </button>
      <div className="topbar-right">
        <div className="status-dot" title="Akun yang sedang masuk">
          <span />
          {currentAccount?.email || displayRole(role)}
        </div>
        <button
          className="icon-btn topbar-chat"
          onClick={onChat}
          title="Open chat"
        >
          <MessageCircle size={17} />
        </button>
        <div className="profile-menu-wrap">
          <button
            className="profile-btn"
            onClick={() => setProfileOpen((v) => !v)}
          >
            <div className="avatar">
              {(currentAccount?.name || "IK").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <strong>{currentAccount?.name || "User"}</strong>
              <span>{displayRole(role)}</span>
            </div>
            {profileOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {profileOpen && (
            <div className="profile-dropdown">
              <button
                onClick={() => {
                  setProfileOpen(false);
                  onSettings();
                }}
              >
                <Settings size={16} />
                <span>
                  <strong>Account Settings</strong>
                  <small>Nama, email, dan password</small>
                </span>
              </button>
              {canPaymentSettings && (
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    onPaymentSettings();
                  }}
                >
                  <CreditCard size={16} />
                  <span>
                    <strong>Payment Methods</strong>
                    <small>QRIS, GoPay, Debit / Credit</small>
                  </span>
                </button>
              )}
              <button
                className="danger"
                onClick={() => {
                  setProfileOpen(false);
                  onLogout();
                }}
              >
                <LogOut size={16} />
                <span>
                  <strong>Sign Out</strong>
                  <small>Keluar dari akun ini</small>
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function Dashboard({
  setView,
  slug,
  siteTitle,
  guests,
  sections,
  orders,
  selectedCanvasId,
  setSelectedCanvasId,
  setGuestsOpen,
  setPreviewOpen,
  teamEdit = null,
}: {
  teamEdit?: { name: string; at: string } | null;
  setView: (view: View) => void;
  slug: string;
  siteTitle: string;
  guests: Guest[];
  sections: CanvasSection[];
  orders: any[];
  selectedCanvasId: string;
  setSelectedCanvasId: (id: string) => void;
  setGuestsOpen: (value: boolean) => void;
  setPreviewOpen: (value: boolean) => void;
}) {
  const selectedCanvas =
    sections.find((section) => section.id === selectedCanvasId) || sections[0];
  const canvasGuests = guests.filter(
    (guest) => guest.canvasId === selectedCanvas?.id,
  );
  const invited = selectedCanvas?.invitees.length || 0;
  const hadir = canvasGuests
    .filter((guest) => guest.status === "Hadir")
    .reduce((total, guest) => total + Math.max(guest.pax, 1), 0);
  const tidakHadir = canvasGuests.filter(
    (guest) => guest.status === "Tidak hadir",
  ).length;
  const menunggu = Math.max(
    0,
    invited -
      canvasGuests.filter((guest) => guest.status !== "Menunggu").length,
  );
  const responseCount = canvasGuests.length;
  const readinessChecks = [
    ["Website title", Boolean(siteTitle.trim())],
    ["Public URL", Boolean(slug.trim())],
    ["Canvas", sections.length > 0],
    [
      "Buka Undangan",
      sections.some((section) =>
        section.columns.some((column) =>
          column.features.some(
            (feature) => feature.type === "invitation-cover",
          ),
        ),
      ),
    ],
    [
      "Event detail",
      sections.some((section) =>
        section.columns.some((column) =>
          column.features.some((feature) => feature.type === "event"),
        ),
      ),
    ],
    [
      "Location",
      sections.some((section) =>
        section.columns.some((column) =>
          column.features.some((feature) => feature.type === "location"),
        ),
      ),
    ],
    ["Guest list", sections.some((section) => section.invitees.length > 0)],
  ] as [string, boolean][];
  const readinessDone = readinessChecks.filter(([, done]) => done).length;
  const readinessPercent = Math.round(
    (readinessDone / readinessChecks.length) * 100,
  );
  const activityData = Array.from({ length: 7 }, (_, offset) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - offset));
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    const confirmed = canvasGuests.filter((guest) => {
      const ts = new Date(guest.time);
      return !Number.isNaN(ts.getTime()) && ts >= date && ts < next;
    }).length;
    return {
      day: new Intl.DateTimeFormat("id-ID", { weekday: "short" }).format(date),
      confirmed,
    };
  });
  const copyLink = () =>
    void navigator.clipboard?.writeText(`${window.location.origin}/${slug}`);
  if (!selectedCanvas)
    return (
      <div className="page">
        <div className="empty-state">
          <Layers3 size={34} />
          <h2>Belum ada Canvas</h2>
          <p>
            Tambahkan Canvas dari menu Templates untuk mulai membangun website.
          </p>
        </div>
      </div>
    );
  return (
    <div className="page dashboard-page">
      {/* MoM A9 — customer tahu tim sedang membantu mengedit undangannya. */}
      {teamEdit && (
        <div className="team-edit-banner" role="status">
          <Users size={16} />
          <span>
            <strong>{teamEdit.name}</strong> sedang membantu mengedit undangan
            Anda · terakhir{" "}
            {new Date(teamEdit.at).toLocaleString("id-ID", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
            . Ada yang ingin diubah? Balas lewat chat.
          </span>
        </div>
      )}
      <div className="page-heading">
        <div>
          <div className="eyebrow">GOOD AFTERNOON</div>
          <h1>Wedding dashboard</h1>
          <p>Data di bawah mengikuti Canvas yang dipilih secara real-time.</p>
        </div>
        <div className="heading-actions">
          <label className="canvas-dashboard-select">
            <span>Active Canvas</span>
            <select
              value={selectedCanvas.id}
              onChange={(event) => setSelectedCanvasId(event.target.value)}
            >
              {sections.map((section) => (
                <option value={section.id} key={section.id}>
                  {section.name}
                </option>
              ))}
            </select>
          </label>
          <button
            className="primary-btn"
            onClick={() => {
              sessionStorage.setItem("ikrarku-edit-canvas", selectedCanvas.id);
              setView("editor");
            }}
          >
            <WandSparkles size={17} /> Edit Canvas
          </button>
        </div>
      </div>
      <div className="site-status-card">
        <CanvasThumbnail section={selectedCanvas} title={siteTitle} />
        <div className="site-status-info">
          <div className="published-badge">
            <span />
            Published
          </div>
          <h3>{siteTitle}</h3>
          <p>
            {selectedCanvas.name} · ikrarku.id/{slug} ·{" "}
            {selectedCanvas.columns.length} column ·{" "}
            {selectedCanvas.columns.reduce(
              (total, column) => total + column.features.length,
              0,
            )}{" "}
            features
          </p>
          <div className="inline-actions">
            <button onClick={() => setPreviewOpen(true)}>
              <Eye size={16} /> Preview
            </button>
            <button onClick={copyLink}>
              <Copy size={16} /> Copy link
            </button>
          </div>
        </div>
        <div className="site-progress">
          <span>Website readiness</span>
          <strong>{readinessPercent}%</strong>
          <div className="progress">
            <i style={{ width: `${readinessPercent}%` }} />
          </div>
          <small>
            {readinessDone}/{readinessChecks.length} setup penting selesai
          </small>
          <div className="readiness-mini-list">
            {readinessChecks.map(([label, done]) => (
              <span key={label} className={done ? "done" : ""}>
                {done ? <Check size={11} /> : <Clock3 size={11} />} {label}
              </span>
            ))}
          </div>
        </div>
      </div>
      {orders.length > 0 && (
        <button
          className="customer-project-banner"
          onClick={() => setView("my-orders")}
        >
          <PackageCheck size={20} />
          <div>
            <strong>Project & order Anda</strong>
            <span>
              {orders[0].order_no} · {orders[0].payment_status} ·{" "}
              {orders[0].order_status}
            </span>
          </div>
          <ArrowRight size={17} />
        </button>
      )}
      <div className="stats-grid">
        <Stat
          icon={Users}
          label="Tamu diundang"
          value={String(invited)}
          note="Berdasarkan list Canvas"
        />
        <Stat
          icon={Check}
          label="Hadir"
          value={String(hadir)}
          note={`${responseCount ? Math.round((hadir / Math.max(invited, 1)) * 100) : 0}% dari undangan`}
        />
        <Stat
          icon={Clock3}
          label="Menunggu"
          value={String(menunggu)}
          note="Belum memberikan respons"
        />
        <Stat
          icon={X}
          label="Tidak hadir"
          value={String(tidakHadir)}
          note="Respons declined"
        />
      </div>
      <div className="dashboard-grid">
        <div className="panel chart-panel">
          <div className="panel-head">
            <div>
              <h3>RSVP activity · {selectedCanvas.name}</h3>
              <p>Aktivitas respons pada Canvas terpilih</p>
            </div>
            <span className="data-live">
              <i /> Live data
            </span>
          </div>
          <div className="chart-wrap">
            <Suspense fallback={<div role="status">Memuat grafik...</div>}>
              <ActivityChart data={activityData} />
            </Suspense>
          </div>
        </div>
        <div className="panel recent-panel">
          <div className="panel-head">
            <div>
              <h3>RSVP terbaru</h3>
              <p>{canvasGuests.length} respons pada Canvas ini</p>
            </div>
            <button
              className="text-btn interactive-link"
              onClick={() => setGuestsOpen(true)}
            >
              Lihat semua
            </button>
          </div>
          {canvasGuests.slice(0, 4).map((guest, index) => (
            <GuestRow
              key={`${guest.name}-${index}`}
              guest={guest}
              index={index}
            />
          ))}
          {canvasGuests.length === 0 && (
            <div className="panel-empty">
              <Users size={24} />
              <strong>Belum ada respons</strong>
              <span>
                Respons RSVP akan muncul setelah tamu mengisi form pada Canvas
                ini.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EditorDashboard({
  users,
  setView,
  manageUserCanvas: _manageUserCanvas,
  templateCount,
  supportCount,
  adminView = false,
}: {
  users: ManagedUser[];
  setView: (view: View) => void;
  manageUserCanvas: (userId: string) => void;
  templateCount: number;
  supportCount: number;
  adminView?: boolean;
}) {
  const assigned = users.filter((user) => user.assignedTo);
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">WEB DESIGNER STUDIO</div>
          <h1>Creative operations dashboard</h1>
          <p>
            Kelola template dan canvas website customer dalam satu tempat.
          </p>
        </div>
        <div className="heading-actions">
          {/* QA TC-168: assign & kelola canvas customer kini satu alur, jadi
              tombol ini mengarah ke Manage Canvas, bukan Client Assignment. */}
          <button className="secondary-btn" onClick={() => setView("editor")}>
            <WandSparkles size={17} /> Manage Canvas
          </button>
          <button className="primary-btn" onClick={() => setView("templates")}>
            <LayoutTemplate size={17} /> Manage Templates
          </button>
        </div>
      </div>
      <div className="stats-grid">
        <Stat
          icon={Users}
          label="Customer dari order saya"
          value={String(assigned.length)}
          note="Ditugaskan otomatis dari template buatan Anda"
        />
        <Stat
          icon={Layers3}
          label="Managed Canvas"
          value={String(
            users.reduce(
              (total, user) => total + (user.canvasIds?.length || 0),
              0,
            ),
          )}
          note="Across assigned clients"
        />
        <Stat
          icon={Palette}
          label="Template library"
          value={String(templateCount)}
          note="Available for assignment"
        />
        <Stat
          icon={MessageCircle}
          label="Support inbox"
          value={String(supportCount)}
          note="Percakapan dari pengguna"
        />
      </div>
      <div className="editor-dashboard-grid">
        <section className="panel">
          <div className="panel-head">
            <div>
              <h3>Customer saya</h3>
              <p>Customer yang canvasnya dapat Anda kelola</p>
            </div>
            <button className="text-btn" onClick={() => setView("editor")}>
              Manage Canvas
            </button>
          </div>
          <div className="client-list">
            {users.map((user) => (
              <article key={user.id}>
                <div className="client-avatar">
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <strong>{user.name}</strong>
                  <span>
                    {user.email} · {user.plan}
                  </span>
                </div>
                {adminView && (
                  <span className="assignment-status assigned">
                    {user.assignedTo || "Belum di-assign"}
                  </span>
                )}
                <button
                  className="client-task-link"
                  onClick={() => setView("tasks")}
                >
                  Tasks &amp; Tickets <ArrowRight size={14} />
                </button>
              </article>
            ))}
          </div>
        </section>
        <section className="panel editor-quick-panel">
          <div className="panel-head">
            <div>
              <h3>Quick actions</h3>
              <p>Continue your design workflow</p>
            </div>
          </div>
          <button onClick={() => setView("templates")}>
            <Palette size={18} />
            <span>
              <strong>Create a template</strong>
              <small>Build a reusable theme from Canvas.</small>
            </span>
            <ArrowRight size={16} />
          </button>
          <button onClick={() => setView("editor")}>
            <UserCog size={18} />
            <span>
              <strong>Manage Canvas customer</strong>
              <small>Pilih order customer, canvasnya langsung termuat.</small>
            </span>
            <ArrowRight size={16} />
          </button>
          <button onClick={() => setView("customer-service")}>
            <MessageSquareText size={18} />
            <span>
              <strong>Open support inbox</strong>
              <small>Respond to customer conversations.</small>
            </span>
            <ArrowRight size={16} />
          </button>
        </section>
      </div>
    </div>
  );
}

function UserManagement({
  role,
  accounts,
  roles,
  createAccount,
  changeUserRole,
  deleteAccount,
  currentAccountId,
  clients,
  onAssign,
  onManage,
  onUpdateUser,
}: {
  role: Role;
  accounts: AuthAccount[];
  roles: RoleItem[];
  createAccount: (
    name: string,
    username: string,
    password: string,
    role: Role,
    email: string,
  ) => Promise<boolean>;
  changeUserRole: (userId: string, roleId: string) => Promise<void>;
  deleteAccount: (userId: string) => Promise<void>;
  currentAccountId?: string;
  clients: ManagedUser[];
  onAssign: (userId: string, editorId?: string) => Promise<void>;
  onManage: (userId: string) => void;
  onUpdateUser?: (
    userId: string,
    payload: Record<string, unknown>,
  ) => Promise<boolean>;
}) {
  const [query, setQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<AuthAccount | null>(null);
  const [editTarget, setEditTarget] = useState<AuthAccount | null>(null);
  const filtered = accounts.filter((account) =>
    `${account.name} ${account.email} ${account.username}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">ACCOUNT & ACCESS OPERATIONS</div>
          <h1>Users & Roles</h1>
          <p>
            {displayRole(role)} mengelola akun yang tersimpan pada tabel users
            dan roles.
          </p>
        </div>
        <button className="primary-btn" onClick={() => setShowCreate(true)}>
          <UserPlus size={16} />
          Add Account
        </button>
      </div>
      <div className="panel user-management">
        <div className="panel-head">
          <div>
            <h3>Account directory</h3>
            <p>{accounts.length} akun terdaftar</p>
          </div>
          <div className="search-field compact">
            <Search size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama, username, email"
            />
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Account</th>
              <th>Username</th>
              <th>Role</th>
              <th>Email</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((account) => (
              <tr key={account.id}>
                <td>
                  <div className="table-user">
                    <div>{account.name.slice(0, 2).toUpperCase()}</div>
                    <span>
                      <strong>{account.name}</strong>
                      <small>{account.id}</small>
                    </span>
                  </div>
                </td>
                <td>{account.username}</td>
                <td>
                  <select
                    value={
                      roles.find((item) => item.name === account.role)?.id || ""
                    }
                    onChange={(e) =>
                      void changeUserRole(account.id, e.target.value)
                    }
                  >
                    {roles.map((roleItem) => (
                      <option value={roleItem.id} key={roleItem.id}>
                        {displayRole(roleItem.name)}
                      </option>
                    ))}
                  </select>
                </td>
                <td>{account.email}</td>
                <td>
                  <div className="row-actions">
                    <button
                      className="row-edit"
                      title="Ubah data diri / reset password"
                      onClick={() => setEditTarget(account)}
                    >
                      <UserRoundCog size={15} />
                    </button>
                    {/* QA TC-172: nonaktifkan akun sementara (mis. user cuti
                        atau resign) tanpa menghapus datanya. */}
                    {account.id !== currentAccountId && onUpdateUser && (
                      <button
                        className={
                          account.active === false
                            ? "row-activate"
                            : "row-deactivate"
                        }
                        title={
                          account.active === false
                            ? "Aktifkan kembali akun"
                            : "Nonaktifkan akun (tanpa menghapus)"
                        }
                        onClick={() =>
                          void onUpdateUser(account.id, {
                            active: account.active === false,
                          })
                        }
                      >
                        {account.active === false ? (
                          <CheckCircle size={15} />
                        ) : (
                          <Ban size={15} />
                        )}
                      </button>
                    )}
                    {account.id !== currentAccountId && (
                      <button
                        className="row-delete"
                        title="Hapus akun"
                        onClick={() => setConfirmTarget(account)}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ClientManagement
        clients={clients}
        editors={accounts.filter(
          (account) => account.role === "Editor" || account.role === "Admin",
        )}
        onAssign={onAssign}
        onManage={onManage}
        adminMode
      />
      {showCreate && (
        <AccountCreateModal
          onClose={() => setShowCreate(false)}
          roles={roles}
          onCreate={async (payload) => {
            if (
              await createAccount(
                payload.name,
                payload.username,
                payload.password,
                payload.role,
                payload.email,
              )
            )
              setShowCreate(false);
          }}
          existingUsernames={accounts.map((item) => item.username)}
        />
      )}
      {confirmTarget && (
        <div className="dialog-overlay" onClick={() => setConfirmTarget(null)}>
          <div
            className="confirm-dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="confirm-icon">
              <Trash2 size={22} />
            </div>
            <h3>Hapus akun {confirmTarget.name}?</h3>
            <p>
              Akun beserta aksesnya akan dihapus permanen. Tindakan ini tidak
              dapat dibatalkan.
            </p>
            <div className="confirm-actions">
              <button
                className="secondary-btn"
                onClick={() => setConfirmTarget(null)}
              >
                Batal
              </button>
              <button
                className="danger-btn"
                onClick={() => {
                  const target = confirmTarget;
                  setConfirmTarget(null);
                  void deleteAccount(target.id);
                }}
              >
                <Trash2 size={15} />
                Hapus akun
              </button>
            </div>
          </div>
        </div>
      )}
      {editTarget && onUpdateUser && (
        <UserEditModal
          account={editTarget}
          onClose={() => setEditTarget(null)}
          onSave={async (payload) => {
            const ok = await onUpdateUser(editTarget.id, payload);
            if (ok) setEditTarget(null);
            return ok;
          }}
        />
      )}
    </div>
  );
}

function ClientManagement({
  clients,
  editors = [],
  onAssign,
  adminMode = false,
}: {
  clients: ManagedUser[];
  editors?: AuthAccount[];
  onAssign: (userId: string, editorId?: string) => Promise<void>;
  // Manage Canvas kini berada pada kartu task, bukan di daftar Client Assignment.
  onManage?: (userId: string) => void;
  adminMode?: boolean;
}) {
  const [query, setQuery] = useState("");
  const filtered = clients.filter((client) =>
    `${client.name} ${client.email}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <section
      className={`panel client-management-panel ${adminMode ? "embedded" : ""}`}
    >
      <div className="panel-head">
        <div>
          <h3>Client Assignment</h3>
          <p>
            {clients.filter((client) => client.assignedTo).length} assigned ·{" "}
            {clients.filter((client) => !client.assignedTo).length} unassigned
          </p>
        </div>
        <div className="search-field compact">
          <Search size={15} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari client..."
          />
        </div>
      </div>
      {filtered.length ? (
        <div className="client-assignment-list">
          {filtered.map((client) => (
            <article key={client.id}>
              <div className="client-avatar">
                {client.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="client-assignment-info">
                <strong>{client.name}</strong>
                <span>
                  {client.email} ·{" "}
                  {client.siteTitle || "Website belum diberi judul"}
                </span>
                <small>
                  {client.canvasIds.length} Canvas ·{" "}
                  {client.assignedTo || "Belum di-assign"}
                </small>
              </div>
              {adminMode ? (
                <select
                  value={client.assignedEditorId || ""}
                  onChange={(event) =>
                    void onAssign(client.id, event.target.value)
                  }
                >
                  <option value="">Unassigned</option>
                  {editors.map((editor) => (
                    <option key={editor.id} value={editor.id}>
                      {editor.name}
                    </option>
                  ))}
                </select>
              ) : !client.assignedTo ? (
                <span className="assignment-status">
                  Menunggu order — penugasan mengikuti pembuat template
                </span>
              ) : adminMode ? (
                <span className="assignment-status assigned">
                  {client.assignedTo}
                </span>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <div className="panel-empty">
          <Users size={24} />
          <strong>Belum ada Customer</strong>
          <span>Customer akan muncul di sini setelah akun dibuat.</span>
        </div>
      )}
    </section>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  note,
  onClick,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  note: string;
  onClick?: () => void;
}) {
  return (
    <div
      className={`stat-card ${onClick ? "clickable" : ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <div className="stat-icon">
        <Icon size={18} />
      </div>
      <div className="stat-body">
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{note}</small>
      </div>
    </div>
  );
}

function GuestRow({ guest, index }: { guest: Guest; index: number }) {
  return (
    <div className="guest-row">
      <div className={`guest-avatar g${index % 4}`}>{guest.initials}</div>
      <div>
        <strong>{guest.name}</strong>
        <span>{guest.pax ? `${guest.pax} tamu` : guest.status}</span>
      </div>
      <div
        className={`guest-status ${guest.status === "Hadir" ? "yes" : guest.status === "Tidak hadir" ? "no" : "wait"}`}
      >
        {guest.status}
      </div>
      <small>{guest.time}</small>
    </div>
  );
}

function resolveTemplateForSection(
  section: CanvasSection,
  templateCatalog: Template[],
  _selectedTemplate: Template,
) {
  if (section.sourceTemplateId)
    return templateCatalog.find(
      (template) => template.id === section.sourceTemplateId,
    );
  const byPrefix = templateCatalog.find((template) =>
    section.name.toLowerCase().startsWith(`${template.name.toLowerCase()} ·`),
  );
  if (byPrefix) return byPrefix;
  return undefined;
}

function buildWebsiteDesignGroups(
  sections: CanvasSection[],
  templateCatalog: Template[],
  selectedTemplate: Template,
  /** Template workspace: semua canvas yang dimuat milik satu template yang
   *  sama, jadi selalu satu card. Tanpa ini canvas yang ditambahkan lewat
   *  tombol + tidak membawa penanda grup apa pun dan pecah menjadi card
   *  "Custom Design" sendiri-sendiri. */
  singleGroup = false,
) {
  if (singleGroup)
    return sections.length
      ? [
          {
            id: `template-${selectedTemplate.id}`,
            template: selectedTemplate,
            name: selectedTemplate.name,
            sections,
          },
        ]
      : [];
  const groups = new Map<
    string,
    { id: string; template?: Template; name: string; sections: CanvasSection[] }
  >();
  const prefixMatches = sections
    .map((section) =>
      resolveTemplateForSection(section, templateCatalog, selectedTemplate),
    )
    .filter(Boolean) as Template[];
  const allLegacyUntagged =
    sections.length > 0 &&
    sections.every(
      (section) =>
        !section.templateInstanceId &&
        !section.sourceTemplateId &&
        !section.sourceTemplateName,
    );
  const singleLegacyTemplate =
    prefixMatches.length === 0 && allLegacyUntagged
      ? selectedTemplate
      : undefined;
  sections.forEach((section) => {
    const canUseLegacyFallback =
      !section.templateInstanceId &&
      !section.sourceTemplateId &&
      !section.sourceTemplateName;
    const template =
      resolveTemplateForSection(section, templateCatalog, selectedTemplate) ||
      (canUseLegacyFallback ? singleLegacyTemplate : undefined);
    const key =
      section.templateInstanceId ||
      (template ? `legacy-template-${template.id}` : `custom-${section.id}`);
    const name =
      section.sourceTemplateName || template?.name || "Custom Design";
    const current = groups.get(key);
    if (current) current.sections.push(section);
    else groups.set(key, { id: key, template, name, sections: [section] });
  });
  return Array.from(groups.values());
}

type WebsiteDesignGroup = {
  id: string;
  template?: Template;
  name: string;
  sections: CanvasSection[];
  orderNo?: string;
  orderStatus?: string;
  pending?: boolean;
};

/**
 * Daftar design pada dashboard customer dibangun dari ORDER, bukan dari isi
 * canvas yang kebetulan tersimpan.
 *
 * Sebelumnya customer yang memesan tiga template tetap hanya melihat satu card,
 * karena pengelompokan hanya membaca `sections` lokal. Sekarang setiap order
 * berbayar selalu punya satu card: kalau canvasnya sudah dikerjakan, section
 * miliknya ikut ditampilkan; kalau belum, card-nya tampil sebagai "sedang
 * disiapkan" supaya customer tahu pesanannya terdaftar.
 */
function buildCustomerDesignGroups(
  orders: any[],
  sections: CanvasSection[],
  templateCatalog: Template[],
): WebsiteDesignGroup[] {
  const paidOrders = orders.filter(
    (order) => order?.payment_status === "Paid" && order?.template_id,
  );
  if (!paidOrders.length) return [];
  const used = new Set<string>();
  const groups: WebsiteDesignGroup[] = paidOrders.map((order) => {
    const template = templateCatalog.find(
      (item) => item.id === order.template_id,
    );
    // Satu order memakai satu kelompok section; kelompok yang sudah terpakai
    // tidak diklaim lagi oleh order lain dengan template yang sama.
    const owned = sections.filter(
      (section) =>
        section.sourceTemplateId === order.template_id &&
        !used.has(section.templateInstanceId || section.id),
    );
    const instanceId = owned[0]?.templateInstanceId;
    const claimed = instanceId
      ? sections.filter((section) => section.templateInstanceId === instanceId)
      : owned.slice(0, 0);
    claimed.forEach((section) =>
      used.add(section.templateInstanceId || section.id),
    );
    return {
      id: `order-${order.id}`,
      template,
      name: order.template_name || template?.name || "Template",
      sections: claimed,
      orderNo: order.order_no,
      orderStatus:
        order.fulfillment_status === "Complete"
          ? "Selesai"
          : order.order_status || "Sedang dikerjakan",
      pending: claimed.length === 0,
    } satisfies WebsiteDesignGroup;
  });
  // Section yang tidak terkait order mana pun (design custom) tetap ditampilkan.
  const leftovers = sections.filter(
    (section) => !used.has(section.templateInstanceId || section.id),
  );
  if (leftovers.length)
    groups.push(
      ...buildWebsiteDesignGroups(
        leftovers,
        templateCatalog,
        templateCatalog[0] || ({} as Template),
      ),
    );
  return groups;
}

/**
 * Lebar `.preview-content` pada mode Mobile. Harus sama dengan nilai di
 * `.preview-full-stage.mobile .preview-content{width:390px}` pada App.css.
 */
const MOBILE_PREVIEW_WIDTH = 390;

/**
 * TC-216 — lebar desain Desktop. Sama dengan batas atas `.canvas-frame.desktop`
 * di App.css (`min(1050px, …)`), yaitu lebar terbesar yang pernah dilihat Web
 * Designer saat menata. Preview dari landing & Templates memakai lebar ini;
 * preview dari editor memakai lebar canvas yang sedang tampil.
 */
const DESKTOP_DESIGN_WIDTH = 1050;
/** Lebar area kerja Desktop terakhir di editor (untuk Preview yang dibuka
 *  dari mode Mobile, saat canvas Desktop tidak sedang terpasang). */
let lastDesktopCanvasWidth = 0;

const ThumbnailContext = createContext(false);
/**
 * QA TC-159 — menandai bahwa canvas sedang dirender di dalam kotak preview
 * (dialog approval, preview template, preview editor), bukan sebagai undangan
 * publik.
 *
 * Tombol backsound memakai `position: fixed`, sehingga di dalam preview ia
 * keluar dari kotaknya dan mengambang di atas seluruh layar — terlihat sebagai
 * icon musik yang nyangkut pada cover thumbnail. Di dalam preview tombolnya
 * ditempel pada kotak preview itu sendiri.
 */
const PreviewSurfaceContext = createContext(false);
/** TC-244 — skala preview Desktop. Desain tetap ditata pada lebar canvas
 *  editor, lalu diperbesar/diperkecil agar pas dengan lebar layar: tidak ada
 *  ruang abu-abu lebar di layar besar, dan tidak terpotong di layar kecil.
 *  Pengukuran tinggi viewport di dalamnya dibagi skala ini. */
const PreviewZoomContext = createContext(1);
function useFitZoom(
  ref: React.RefObject<HTMLElement | null>,
  designWidth: number,
  enabled: boolean,
  maxZoom = 4,
) {
  const [zoom, setZoom] = useState(1);
  useEffect(() => {
    const node = ref.current;
    if (!enabled || !node) {
      setZoom(1);
      return;
    }
    const measure = () => {
      const available = node.clientWidth;
      if (!available || !designWidth) return;
      // Selalu tepat selebar layar: diperkecil di layar sempit, diperbesar
      // di layar lebar — tidak ada ruang abu-abu di kiri-kanan.
      const next = Math.min(maxZoom, Math.max(0.35, available / designWidth));
      const rounded = Math.floor(next * 1000) / 1000;
      // Abaikan perubahan sangat kecil (< 0,5%): scrollbar yang muncul /
      // hilang mengubah lebar beberapa px, dan tanpa ambang ini skala bisa
      // bolak-balik terus ("zoom in-zoom out").
      setZoom((current) =>
        Math.abs(current - rounded) < 0.005 ? current : rounded,
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, designWidth, enabled, maxZoom]);
  return zoom;
}

/**
 * Section yang dipakai sebagai gambar pratinjau sebuah design.
 *
 * Urutannya mengikuti apa yang dilihat tamu lebih dulu:
 *   1. section yang memuat cover "Buka Undangan";
 *   2. section pertama yang benar-benar punya isi di mode publik — aturan
 *      yang sama dengan `hasVisibleFeatures` di WeddingCanvas, supaya yang
 *      dipilih tidak dibuang lagi saat dirender;
 *   3. sections[0] sebagai jalan terakhir.
 *
 * Bila Background global aktif dan section terpilih bukan Canvas 1,
 * backdrop Canvas 1 digabungkan lebih dulu: section dirender sendirian di
 * sini, jadi tanpa penggabungan itu ia kehilangan background-nya.
 */
function pickPreviewSection(
  sections: CanvasSection[],
): CanvasSection | undefined {
  if (!sections.length) return undefined;
  const hasCover = (section: CanvasSection) =>
    section.columns.some((column) =>
      column.features.some((feature) => feature.type === "invitation-cover"),
    );
  const hasVisibleContent = (section: CanvasSection) =>
    Boolean(
      section.backgroundUrl ||
        section.backgroundVideoUrl ||
        (section.backgroundLayers || []).some((layer) => layer.url) ||
        (section.decorations || []).length,
    ) ||
    section.columns.some((column) =>
      column.features.some(
        (feature) =>
          feature.type !== "invitation-cover" && feature.type !== "sound",
      ),
    );
  const chosen =
    sections.find(hasCover) || sections.find(hasVisibleContent) || sections[0];
  const globalSource = sections[0].backgroundGlobal ? sections[0] : null;
  return globalSource && chosen.id !== globalSource.id
    ? applyGlobalBackground(chosen, globalSource)
    : chosen;
}

/** QC #2 — "preview dari Templates & Approval terasa berat". Canvas penuh
 *  (puluhan canvas, ribuan node) dulu dirender ulang setiap kali induknya
 *  render: polling notifikasi/chat tiap 8–10 detik, mengetik feedback, dsb.,
 *  dan hydrateSections() membuat array baru setiap kali sehingga tidak ada
 *  yang bisa dilewati. Template yang dipratinjau disimpan di state saat
 *  tombol Preview diklik, jadi identitasnya stabil: memo cukup. */
const TemplateLivePreview = memo(function TemplateLivePreview({
  template,
}: {
  template: Template;
}) {
  const sections = useMemo(
    () => hydrateSections(template.canvasSections || []),
    [template.canvasSections],
  );
  const device = useContext(DeviceContext);
  return template.canvasSections?.length ? (
    <FitDesktop device={device} sections={sections}>
      <WeddingCanvas
        page="pages"
        sections={sections}
        selectedTemplate={template}
        greetings={[]}
        addGreeting={noop}
        guests={[]}
        addGuest={noop}
      />
    </FitDesktop>
  ) : (
    <WebsiteTemplatePreview
      template={template}
      title={template.name}
      sections={template.canvasSections || []}
    />
  );
});
const noop = () => undefined;

/** Revisi 24 Okt — sampul template yang belum punya gambar sample: sama
 *  dengan pratinjau saat Create Template (gradien warna aksen, kategori,
 *  nama, harga), bukan foto contoh bawaan. */
function TemplateCoverArt({
  template,
  compact = false,
}: {
  template: Pick<Template, "name" | "category" | "accent" | "price">;
  compact?: boolean;
}) {
  return (
    <div
      className={`template-cover-art ${compact ? "compact" : ""}`}
      style={{ "--template-accent": template.accent || "#125946" } as React.CSSProperties}
      role="img"
      aria-label={`Sampul ${template.name}`}
    >
      <small>{(template.category || "Wedding").toUpperCase()}</small>
      <strong>{template.name}</strong>
      <em>
        {template.price ? formatRupiah(template.price) : "Harga menyusul"}
      </em>
    </div>
  );
}

/** Revisi 24 Okt — preview Desktop template selebar layar (landing, Safe
 *  Preview, review Approve). Tata letak Kolom/70-30 responsif, jadi dirender
 *  apa adanya; desain penuh ditata pada DESKTOP_DESIGN_WIDTH lalu diskalakan
 *  pas lebar kotak preview sehingga tidak ada ruang kosong kiri-kanan. */
function FitDesktop({
  device,
  sections,
  children,
}: {
  device: DeviceMode;
  sections?: CanvasSection[];
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const column = usesDesktopColumn(sections || []);
  const enabled = device === "desktop" && !column;
  const zoom = useFitZoom(ref, DESKTOP_DESIGN_WIDTH, enabled, 4);
  return (
    <div ref={ref} className={`fit-desktop ${enabled ? "is-scaled" : "is-full"}`}>
      <PreviewZoomContext value={enabled ? zoom : 1}>
        <div
          className="fit-desktop-inner"
          style={
            enabled
              ? ({
                  width: DESKTOP_DESIGN_WIDTH,
                  zoom,
                  "--preview-zoom": zoom,
                } as React.CSSProperties)
              : undefined
          }
        >
          {children}
        </div>
      </PreviewZoomContext>
    </div>
  );
}

function WebsiteTemplatePreview({
  template,
  title,
  sections,
  bare = false,
}: {
  template?: Template;
  title: string;
  sections: CanvasSection[];
  /** Revisi 24 Okt — kartu publik (landing, katalog desain): tanpa bilah
   *  "Canvas 01 · actual saved preview" milik CMS, dan canvas memenuhi
   *  seluruh kartu (cover) alih-alih menyisakan area abu-abu. */
  bare?: boolean;
}) {
  const holder = useRef<HTMLDivElement>(null),
    [width, setWidth] = useState(320),
    [holderHeight, setHolderHeight] = useState(0);
  useEffect(() => {
    if (!holder.current) return;
    const observer = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width);
      setHolderHeight(entries[0].contentRect.height);
    });
    observer.observe(holder.current);
    return () => observer.disconnect();
  }, []);
  // Revisi QA: kotak preview dulu selalu setinggi `width * 1.25`, yaitu 1000px
  // ruang canvas, apa pun isinya. Cover memang dipaksa 1000px oleh
  // `.actual-render-content .invitation-cover-screen`, tapi canvas biasa hanya
  // ~560-700px — sisanya tampil sebagai area kosong dan card jadi terlalu
  // tinggi. Tinggi sekarang mengikuti tinggi asli yang dirender, dengan
  // `width * 1.25` sebagai batas atas supaya canvas yang sangat panjang tidak
  // membuat card memanjang tak terkendali.
  const content = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  useEffect(() => {
    if (!content.current) return;
    // contentRect adalah kotak layout sebelum transform, jadi nilainya berada
    // di ruang 800px dan perlu dikalikan skalanya.
    const observer = new ResizeObserver((entries) =>
      setContentHeight(entries[0].contentRect.height),
    );
    observer.observe(content.current);
    return () => observer.disconnect();
  }, []);
  const maxViewportHeight = width * 1.25;
  const viewportHeight = contentHeight
    ? Math.max(
        120,
        Math.min(Math.round((contentHeight * width) / 800), maxViewportHeight),
      )
    : maxViewportHeight;
  // QC 15 Okt — "Preview masih blank". Dulu yang dirender selalu sections[0].
  // Di mode publik WeddingCanvas membuang section yang tidak punya isi tampak
  // (hanya sound/credit, tanpa backdrop sendiri), sehingga kartu berisi
  // kotak krem kosong — warna latar viewport itu sendiri — padahal template
  // punya 14 canvas berisi. Sekarang yang dipilih adalah yang memang akan
  // dilihat tamu lebih dulu: cover bila ada, kalau tidak canvas pertama yang
  // punya isi. Hanya satu section yang dirender, jadi biayanya tidak naik.
  const section = pickPreviewSection(sections);
  const selected: Template = template || {
    id: "preview",
    name: title,
    category: "Wedding",
    accent: "#125946",
    bg: "#fff",
    premium: false,
    preset: "classic",
  };
  return (
    <div
      className={`actual-design-preview ${bare ? "is-bare" : ""}`}
      ref={holder}
    >
      {!bare && (
        <div className="template-browser">
          <span />
          <span />
          <span />
          <em>Canvas 01 · actual saved preview</em>
        </div>
      )}
      <div
        className="actual-render-viewport"
        style={{ height: bare ? "100%" : viewportHeight }}
      >
        <div
          className="actual-render-content"
          ref={content}
          inert
          style={{
            width: 800,
            // Mode bare: skala "cover" — penuhi lebar dan tinggi kartu,
            // dipusatkan horizontal bila canvas lebih pendek dari kartu.
            ...(bare && contentHeight && holderHeight
              ? (() => {
                  const scale = Math.max(
                    width / 800,
                    holderHeight / contentHeight,
                  );
                  return {
                    transform: `translateX(${(width - 800 * scale) / 2}px) scale(${scale})`,
                  };
                })()
              : { transform: `scale(${width / 800})` }),
            transformOrigin: "top left",
          }}
        >
          {section ? (
            <ThumbnailContext value={true}>
              <WeddingCanvas
                page="pages"
                sections={hydrateSections([section])}
                selectedTemplate={selected}
                greetings={[]}
                addGreeting={() => {}}
                guests={[]}
                addGuest={() => {}}
              />
            </ThumbnailContext>
          ) : (
            <div className="actual-preview-empty">Blank design</div>
          )}
        </div>
      </div>
      <span className="sr-only">{title} - Preview Canvas 01</span>
    </div>
  );
}

/* ------------------------------------------------------------------
   Manage Canvas — pemilih order customer (item 3 & 9)

   Menggantikan tombol "Add Canvas" yang dulu hanya menambah section kosong ke
   state tanpa pernah menyimpannya (setiap klik lalu ditinggalkan menghasilkan
   draft baru). Sekarang Web Designer memilih salah satu order yang menjadi
   task-nya; canvas customer itulah yang dimuat, lengkap dengan template yang
   dia pesan, sehingga pengerjaan tidak dimulai dari canvas kosong.
   ------------------------------------------------------------------ */
type CanvasOrderOption = {
  taskId: string;
  orderId: string;
  orderNo: string;
  customerUserId: string;
  customerName: string;
  customerEmail: string;
  templateId: string;
  templateName: string;
  status: string;
};

/**
 * Menyaring task menjadi daftar order yang canvas-nya bisa dibuka.
 * Task approval dan task tanpa order/customer tidak termasuk.
 */
function buildCanvasOrderOptions(tasks: TaskItem[]): CanvasOrderOption[] {
  const seen = new Set<string>();
  const options: CanvasOrderOption[] = [];
  tasks.forEach((task) => {
    if (task.task_type === "Approval") return;
    if (!task.order_id || !task.customer_user_id) return;
    if (task.status === "Cancelled") return;
    const key = `${task.order_id}-${task.customer_user_id}`;
    if (seen.has(key)) return;
    seen.add(key);
    options.push({
      taskId: task.id,
      orderId: task.order_id,
      orderNo: task.order_no || task.order_id,
      customerUserId: task.customer_user_id,
      customerName: task.customer_name || task.email || "Customer",
      customerEmail: task.email || "",
      templateId: task.template_id || "",
      templateName: task.template_name || "",
      status: task.status,
    });
  });
  return options;
}

function ManageCanvasPicker({
  options,
  onOpen,
  busy = false,
  compact = false,
}: {
  options: CanvasOrderOption[];
  onOpen: (option: CanvasOrderOption) => void;
  busy?: boolean;
  compact?: boolean;
}) {
  const [selected, setSelected] = useState("");
  // Pilihan yang tersimpan bisa hilang saat daftar task di-refresh.
  const current = options.find((item) => item.taskId === selected);
  useEffect(() => {
    if (selected && !options.some((item) => item.taskId === selected))
      setSelected("");
  }, [options, selected]);
  if (!options.length)
    return (
      <div className={`manage-canvas-picker empty ${compact ? "compact" : ""}`}>
        <Users size={compact ? 15 : 18} />
        <span>
          Belum ada order customer yang menjadi task Anda. Canvas akan muncul di
          sini begitu order masuk dan di-assign.
        </span>
      </div>
    );
  return (
    <div className={`manage-canvas-picker ${compact ? "compact" : ""}`}>
      <label>
        <span className="manage-canvas-legend">Manage Canvas</span>
        <select
          value={selected}
          onChange={(event) => setSelected(event.target.value)}
          disabled={busy}
        >
          <option value="">Pilih order customer...</option>
          {options.map((option) => (
            <option key={option.taskId} value={option.taskId}>
              {option.customerName} · {option.orderNo}
              {option.templateName ? ` · ${option.templateName}` : ""} —{" "}
              {option.status}
            </option>
          ))}
        </select>
      </label>
      <button
        className="primary-btn"
        disabled={!current || busy}
        onClick={() => current && onOpen(current)}
      >
        <WandSparkles size={15} />
        {busy ? "Memuat..." : "Buka Canvas"}
      </button>
    </div>
  );
}

/**
 * Halaman pembuka menu Canvas Editor untuk Web Designer.
 *
 * Menggantikan canvas kosong: Web Designer memilih order lebih dulu, lalu
 * canvas customer beserta template yang dipesannya langsung termuat.
 */
function CanvasEditorStartPage({
  options,
  onOpen,
  busy,
  onBrowseTemplates,
}: {
  options: CanvasOrderOption[];
  onOpen: (option: CanvasOrderOption) => void;
  busy: boolean;
  onBrowseTemplates: () => void;
}) {
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">CANVAS EDITOR</div>
          <h1>Pilih order yang akan dikerjakan</h1>
          <p>
            Canvas Editor memuat design dari order customer. Pilih salah satu
            order di bawah — template yang dipesan customer ikut termuat, jadi
            Anda tidak perlu menyusun ulang dari canvas kosong.
          </p>
        </div>
      </div>
      <ManageCanvasPicker options={options} onOpen={onOpen} busy={busy} />
      {options.length > 0 && (
        <div className="canvas-order-grid">
          {options.map((option) => (
            <article className="canvas-order-card" key={option.taskId}>
              <div className="canvas-order-head">
                <span className="canvas-order-no">{option.orderNo}</span>
                <em className={`canvas-order-status ${option.status.toLowerCase().replace(/\s+/g, "-")}`}>
                  {option.status}
                </em>
              </div>
              <h3>{option.customerName}</h3>
              {option.customerEmail && <small>{option.customerEmail}</small>}
              <p>
                {option.templateName
                  ? `Template dipesan: ${option.templateName}`
                  : "Template belum ditentukan pada order ini."}
              </p>
              <button
                className="primary-btn"
                disabled={busy}
                onClick={() => onOpen(option)}
              >
                <WandSparkles size={15} /> Buka Canvas
              </button>
            </article>
          ))}
        </div>
      )}
      <div className="canvas-order-footnote">
        <CircleHelp size={14} />
        <span>
          Mau merancang template baru, bukan website customer? Buka{" "}
          <button className="link-btn" onClick={onBrowseTemplates}>
            Templates &amp; Approval
          </button>{" "}
          lalu gunakan Create Template.
        </span>
      </div>
    </div>
  );
}

function Templates({
  role,
  siteTitle,
  activeUser: _activeUser,
  selectedTemplate,
  templateCatalog,
  sections,
  applyTemplate,
  deleteCanvas,
  duplicateCanvas,
  editCanvas,
  editorMode = "site",
  openTemplateCreator,
  canCreate,
  managedTemplates = [],
  managingCustomer = false,
  currentAccountId,
  canApprove = false,
  onTakedown,
  onRepublish,
  onUploadSample,
  onUploadThumbnail,
  onCaptureSample,
  onEditTemplate,
  onToggleRecommended,
  onSetPrice,
  canvasOrders = [],
  onOpenCanvasOrder,
  canvasOrderBusy = false,
  customerOrders = [],
  publicTemplates = [],
  onContactSupport,
  onOpenTemplate,
}: {
  role: Role;
  siteTitle: string;
  activeUser?: ManagedUser;
  selectedTemplate: Template;
  templateCatalog: Template[];
  sections: CanvasSection[];
  applyTemplate: (template: Template) => void;
  deleteCanvas: (sectionIds: string[]) => void;
  duplicateCanvas: (sectionIds: string[]) => void;
  editCanvas: (sectionId: string, template?: Template) => void;
  /** Di Template workspace seluruh canvas milik SATU template. */
  editorMode?: "site" | "template";
  openTemplateCreator: () => void;
  canCreate: boolean;
  managedTemplates?: Template[];
  managingCustomer?: boolean;
  currentAccountId?: string;
  canApprove?: boolean;
  onTakedown?: (templateId: string, reason: string) => Promise<void>;
  onRepublish?: (templateId: string) => Promise<void>;
  onUploadSample?: (templateId: string, file: File) => Promise<void>;
  onUploadThumbnail?: (templateId: string, file: File) => Promise<void>;
  onCaptureSample?: (templateId: string) => Promise<void>;
  onEditTemplate?: (template: Template) => void;
  onToggleRecommended?: (templateId: string, next: boolean) => Promise<void>;
  onSetPrice?: (templateId: string, price: number) => Promise<void>;
  canvasOrders?: CanvasOrderOption[];
  onOpenCanvasOrder?: (option: CanvasOrderOption) => void;
  canvasOrderBusy?: boolean;
  customerOrders?: any[];
  publicTemplates?: Template[];
  /** TC-223 — customer membuka chat support dari kartu templatenya. */
  onContactSupport?: () => void;
  /** TC-224 — buka halaman detail template (upselling). */
  onOpenTemplate?: (template: Template) => void;
}) {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [safePreviewDevice, setSafePreviewDevice] =
    useState<DeviceMode>("desktop");
  const safePreviewStageRef = useRef<HTMLDivElement | null>(null);
  useScrollResetOnOpen(
    safePreviewStageRef,
    Boolean(previewTemplate),
    previewTemplate?.id,
    safePreviewDevice,
  );
  const filtered = templateCatalog.filter(
    (template) =>
      (filter === "All" || template.category === filter) &&
      template.name.toLowerCase().includes(query.toLowerCase()),
  );
  // Customer melihat satu card per order; Web Designer tetap melihat
  // pengelompokan berdasarkan isi canvas yang sedang dibuka.
  const websiteDesigns: WebsiteDesignGroup[] =
    role === "User" && customerOrders.length
      ? buildCustomerDesignGroups(customerOrders, sections, templateCatalog)
      : buildWebsiteDesignGroups(
          sections,
          templateCatalog,
          selectedTemplate,
          editorMode === "template",
        );
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">DESIGN LIBRARY</div>
          <h1>Template & Canvas</h1>
          <p>
            {role === "User"
              ? "Pilih template dan kelola design website Anda."
              : "Kelola template website client tanpa menampilkan struktur internal sebagai kartu terpisah."}
          </p>
        </div>
        <div className="heading-actions">
          {/* Dropdown Manage Canvas menggantikan tombol Add Canvas: Web Designer
              memilih order yang menjadi task-nya, lalu canvasnya muncul sebagai
              card Website Design di bawah. */}
          {onOpenCanvasOrder && role === "Editor" && (
            <ManageCanvasPicker
              options={canvasOrders}
              onOpen={onOpenCanvasOrder}
              busy={canvasOrderBusy}
              compact
            />
          )}
          {canCreate && (
            <button className="secondary-btn" onClick={openTemplateCreator}>
              <Palette size={17} /> Create Template
            </button>
          )}
        </div>
      </div>
      {role === "Editor" && managingCustomer && (
        <p className="canvas-help-note workspace-hint">
          Anda sedang mengelola website milik customer. Pilih order lain pada
          dropdown <strong>Manage Canvas</strong> di atas untuk berpindah
          customer.
        </p>
      )}
      {/* Card Website Design dulu disembunyikan saat Web Designer mengelola
          customer. Sekarang justru di sinilah hasil pilihan Manage Canvas
          ditampilkan, jadi section ini selalu tampil. */}
      <section className="canvas-manager-section">
        <div className="section-heading">
          <div>
            <span>WEBSITE DESIGN</span>
            <h2>Template pada website</h2>
            <p>
              Satu card mewakili satu template/design yang digunakan. Canvas,
              Column, dan Feature tetap menjadi struktur internal dan hanya
              terlihat saat Edit.
            </p>
          </div>
        </div>
        <div className="website-canvas-grid">
          {websiteDesigns.length === 0 && (
            <div className="zero-canvas-state">
              <Layers3 size={34} />
              <span>WEBSITE EMPTY</span>
              <h3>Website ini belum memiliki design</h3>
              <p>
                {canCreate
                  ? "Buat desain baru lewat Create Template, atau pilih template dari library di bawah."
                  : "Pilih salah satu template dari library di bawah untuk memulai."}
              </p>
              {canCreate && (
                <button className="primary-btn" onClick={openTemplateCreator}>
                  <Palette size={16} /> Create Template
                </button>
              )}
            </div>
          )}
          {websiteDesigns.map((design, index) => {
            const ids = design.sections.map((section) => section.id);
            const totalFeatures = design.sections.reduce(
              (total, section) =>
                total +
                section.columns.reduce(
                  (sum, column) => sum + column.features.length,
                  0,
                ),
              0,
            );
            const totalInvitees = design.sections.reduce(
              (total, section) => total + section.invitees.length,
              0,
            );
            // Order yang canvasnya belum dikerjakan tetap tampil sebagai card,
            // supaya jumlah card selalu sama dengan jumlah order customer.
            if (design.pending)
              return (
                <article
                  className="website-canvas-card website-template-card pending-order"
                  key={design.id}
                >
                  <div className="website-canvas-cover pending">
                    <Clock3 size={26} />
                    <strong>Sedang disiapkan</strong>
                    <span>Web Designer sedang mengerjakan design Anda.</span>
                    <span className="canvas-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="website-canvas-meta">
                    <div>
                      <span className="published-dot">
                        {design.orderNo ? `${design.orderNo} · ` : ""}
                        {design.orderStatus}
                      </span>
                      <h3>{design.name}</h3>
                      <p>Canvas belum tersedia untuk diedit.</p>
                      <small>
                        Anda akan diberi tahu lewat live chat begitu design siap.
                      </small>
                    </div>
                  </div>
                </article>
              );
            return (
              <article
                className="website-canvas-card website-template-card"
                key={design.id}
              >
                <div className="website-canvas-cover">
                  <WebsiteTemplatePreview
                    template={design.template}
                    title={siteTitle}
                    sections={design.sections}
                  />
                  <span className="canvas-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="website-canvas-meta">
                  <div>
                    <span className="published-dot">
                      {design.template ? "Applied Template" : "Custom Design"} ·{" "}
                      {design.name}
                    </span>
                    <h3>{siteTitle}</h3>
                    <p>{design.sections.length} Canvas di dalam design</p>
                    <small>
                      {totalFeatures} feature · {totalInvitees} undangan
                    </small>
                  </div>
                  <div className="website-canvas-actions">
                    <button onClick={() => duplicateCanvas(ids)}>
                      <Copy size={15} /> Copy
                    </button>
                    <button
                      className="primary"
                      onClick={() =>
                        editCanvas(design.sections[0].id, design.template)
                      }
                    >
                      <WandSparkles size={15} /> Edit
                    </button>
                    <button
                      className="danger"
                      onClick={() => deleteCanvas(ids)}
                    >
                      <Trash2 size={15} /> Delete
                    </button>
                    {onContactSupport && (
                      <button onClick={onContactSupport}>
                        <Headphones size={15} /> Hubungi Support
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* TC-224 — upselling: tawarkan template lain di bawah Template &
          Canvas customer (yang belum dimiliki), urut rekomendasi dulu. */}
      {role === "User" && onOpenTemplate && (() => {
        const owned = new Set(
          customerOrders.map((order: any) => order.template_id),
        );
        const offers = publicTemplates
          .filter((template) => !owned.has(template.id))
          .sort(
            (a, b) =>
              Number(Boolean(b.recommended)) - Number(Boolean(a.recommended)),
          )
          .slice(0, 6);
        if (!offers.length) return null;
        return (
          <section className="upsell-catalog">
            <div className="section-heading">
              <div>
                <span>KATALOG</span>
                <h2>Lengkapi momen Anda dengan desain lain</h2>
                <p>
                  Untuk acara lain — lamaran, resepsi kedua, atau ulang tahun
                  pernikahan. Lihat detail dan pesan langsung dari sini.
                </p>
              </div>
            </div>
            <div className="upsell-grid">
              {offers.map((template) => (
                <article key={template.id} className="upsell-card">
                  <div
                    className="upsell-thumb"
                    style={
                      template.preview || template.sampleImage
                        ? {
                            backgroundImage: `url(${assetUrl(template.preview || template.sampleImage || "")})`,
                          }
                        : undefined
                    }
                  >
                    {!(template.preview || template.sampleImage) && (
                      <TemplateCoverArt template={template} compact />
                    )}
                    {template.recommended && (
                      <em>
                        <Star size={11} /> Rekomendasi
                      </em>
                    )}
                  </div>
                  <div className="upsell-meta">
                    <strong>{template.name}</strong>
                    <span>
                      {template.category} ·{" "}
                      {template.price ? formatRupiah(template.price) : "Gratis"}
                    </span>
                  </div>
                  <button
                    className="secondary-btn"
                    onClick={() => onOpenTemplate(template)}
                  >
                    Lihat & pesan <ArrowRight size={14} />
                  </button>
                </article>
              ))}
            </div>
          </section>
        );
      })()}
      {(canCreate || canApprove) && (
        <TemplateApprovalManager
          templates={managedTemplates}
          currentAccountId={currentAccountId}
          canApprove={canApprove}
          onTakedown={onTakedown}
          onRepublish={onRepublish}
          onUploadSample={onUploadSample}
          onUploadThumbnail={onUploadThumbnail}
          onCaptureSample={onCaptureSample}
          onEditTemplate={onEditTemplate}
          onToggleRecommended={onToggleRecommended}
          onSetPrice={onSetPrice}
        />
      )}
      {/* QA TC-177: customer tidak lagi browse seluruh katalog dari sini —
          yang mereka butuhkan hanya canvas dari ordernya sendiri. Toolbar
          pencarian/filter template hanya untuk staff. */}
      {role !== "User" && (
      <div className="template-toolbar">
        <div className="search-field">
          <Search size={17} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari template..."
          />
        </div>
        <div className="filter-tabs">
          {[
            "All",
            "Editorial",
            "Cinematic",
            "Fairytale",
            "Elegant",
            "Romantic",
            "Traditional",
            "Modern",
          ].map((item) => (
            <button
              key={item}
              className={filter === item ? "active" : ""}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      )}
      {role !== "User" && (
      <div className="template-grid">
        {filtered.map((template) => (
          <div
            className={`template-card preset-${template.preset || "classic"} ${selectedTemplate.id === template.id ? "selected" : ""}`}
            key={template.id}
          >
            <div
              className={`template-preview ${template.preview ? "" : "no-sample"}`}
              style={{
                background: template.preview
                  ? `linear-gradient(rgba(4,18,14,.18),rgba(4,18,14,.28)), url(${template.preview}) center/cover`
                  : `linear-gradient(145deg, ${template.accent || "#125946"}, #102d25)`,
              }}
            >
              <div className="template-browser">
                <span />
                <span />
                <span />
              </div>
              <div
                className="template-art"
                style={{
                  color:
                    template.preset === "cinematic" || !template.preview
                      ? "#fff"
                      : template.accent,
                }}
              >
                {template.preset === "cinematic" ? (
                  <Film size={27} />
                ) : template.preset === "storybook" ? (
                  <Castle size={27} />
                ) : template.preset === "split" ? (
                  <Columns2 size={27} />
                ) : null}
                <small>
                  {template.preset === "cinematic"
                    ? "A WEDDING ORIGINAL"
                    : template.preset === "storybook"
                      ? "ONCE UPON A PROMISE"
                      : "THE WEDDING OF"}
                </small>
                {/* QA TC-128: tampilkan nama template yang sedang dibuat,
                    bukan nama pasangan default bawaan. */}
                <strong>{template.name}</strong>
                <i />
                <em>12 · 12 · 2026</em>
              </div>
              {template.premium && (
                <div className="premium-chip">
                  <Crown size={12} /> Premium
                </div>
              )}
              {canApprove && (template.createdByName || template.createdBy) && (
                <div className="creator-chip">
                  Created by {template.createdByName || template.createdBy}
                </div>
              )}
              <div className="template-hover">
                <button onClick={() => applyTemplate(template)}>
                  <WandSparkles size={16} /> Use template
                </button>
                <button onClick={() => setPreviewTemplate(template)}>
                  <Eye size={16} />
                </button>
              </div>
            </div>
            <div className="template-meta database-template-meta">
              <div>
                <strong>{template.name}</strong>
                <span>
                  {template.category} · {formatRupiah(template.price || 0)}
                </span>
                <small
                  className={`approval-status ${(template.status || "Published").toLowerCase()}`}
                >
                  {template.status === "Published" ||
                  template.status === "Approved"
                    ? "Publish"
                    : template.status === "Rejected"
                      ? "Reject"
                      : template.status || "Publish"}
                </small>
              </div>
              <div className="template-db-actions">
                {template.status === "Pending" && (
                  <span className="review-task-hint">
                    <ClipboardList size={13} />
                    Review melalui Tasks
                  </span>
                )}
                {selectedTemplate.id === template.id && (
                  <div className="selected-check">
                    <Check size={15} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
      {previewTemplate && (
        <div className="dialog-overlay template-quick-preview">
          {/* Revisi 24 Okt — Safe Preview kini sama dengan Template Preview:
              preview penuh yang bisa di-scroll, dengan pilihan Desktop/Mobile,
              bukan cuplikan canvas pertama. */}
          <div className="template-preview-dialog wide">
            <header>
              <div>
                <span>TEMPLATE PREVIEW</span>
                <h2>{previewTemplate.name}</h2>
                <small>
                  {previewTemplate.category} ·{" "}
                  {formatRupiah(previewTemplate.price || 0)}
                </small>
              </div>
              <div className="preview-header-actions">
                <div className="journey-device-switch">
                  <button
                    className={safePreviewDevice === "desktop" ? "active" : ""}
                    onClick={() => setSafePreviewDevice("desktop")}
                  >
                    <Monitor size={15} /> Desktop
                  </button>
                  <button
                    className={safePreviewDevice === "mobile" ? "active" : ""}
                    onClick={() => setSafePreviewDevice("mobile")}
                  >
                    <Smartphone size={15} /> Mobile
                  </button>
                </div>
                <button
                  className="preview-close-btn"
                  aria-label="Tutup preview"
                  onClick={() => setPreviewTemplate(null)}
                >
                  <X size={18} />
                </button>
              </div>
            </header>
            <DeviceContext value={safePreviewDevice}>
            <PreviewSurfaceContext value={true}>
            <div
              ref={safePreviewStageRef}
              className={`template-dialog-actual-preview live device-${safePreviewDevice}`}
            >
              <TemplateLivePreview template={previewTemplate} />
            </div>
            </PreviewSurfaceContext>
            </DeviceContext>
            <footer>
              <button
                className="secondary-btn"
                onClick={() => setPreviewTemplate(null)}
              >
                Close
              </button>
              <button
                className="primary-btn"
                onClick={() => {
                  setPreviewTemplate(null);
                  applyTemplate(previewTemplate);
                }}
              >
                <WandSparkles size={15} />
                Use Template
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}

function CanvasThumbnail({
  section,
  title,
}: {
  section: CanvasSection;
  title?: string;
}) {
  const firstFeature = section.columns
    .flatMap((column) => column.features)
    .find(
      (feature) =>
        feature.type === "invitation-cover" ||
        feature.type === "text" ||
        feature.type === "quote",
    );
  const coverFeature = section.columns
    .flatMap((column) => column.features)
    .find((feature) => feature.type === "invitation-cover");
  const image = assetUrl(coverFeature?.mediaUrl || section.backgroundUrl);
  const filter = getBackgroundFilter(
    coverFeature?.backgroundEffect || section.backgroundEffect,
  );
  return (
    <div
      className={`canvas-manager-preview real-preview layout-${section.layoutMode}`}
      style={{
        background: getGradientBackground(
          section.backgroundGradientEnabled,
          section.backgroundGradientFrom,
          section.backgroundGradientTo,
          section.backgroundGradientAngle,
          section.backgroundColor,
        ),
      }}
    >
      <div
        className={`thumbnail-bg ${getBackgroundMotionClass(section.backgroundMotion)}`}
        style={{
          backgroundImage: image ? `url(${image})` : undefined,
          backgroundPosition:
            coverFeature?.backgroundPosition || section.backgroundPosition,
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          filter,
        }}
      />
      <div className={`thumbnail-columns count-${section.columns.length}`}>
        {section.columns.map((column, columnIndex) => (
          <div key={column.id} className="thumbnail-column">
            <small>COL {columnIndex + 1}</small>
            {column.features.slice(0, 3).map((feature) => (
              <div
                key={feature.id}
                className={`thumbnail-feature type-${feature.type}`}
              >
                {[
                  "text",
                  "quote",
                  "invitation-cover",
                  "event",
                  "countdown",
                  "location",
                ].includes(feature.type) ? (
                  <>
                    <strong>{feature.title.slice(0, 28)}</strong>
                    <span>{feature.body.slice(0, 36)}</span>
                  </>
                ) : feature.type === "image" || feature.type === "gallery" ? (
                  <ImageIcon size={16} />
                ) : (
                  <FeatureIcon type={feature.type} />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      {(title || firstFeature) && (
        <div className="thumbnail-title">{title || firstFeature?.title}</div>
      )}
    </div>
  );
}

type EditorProps = {
  sections: CanvasSection[];
  setSections: React.Dispatch<React.SetStateAction<CanvasSection[]>>;
  slug: string;
  setSlug: (slug: string) => void;
  siteTitle: string;
  setSiteTitle: (title: string) => void;
  selectedTemplate: Template;
  saveSite: () => Promise<boolean>;
  editorMode: "site" | "template";
  managingCustomer?: boolean;
  /** Nama akun yang sedang mengedit (MoM A3: tampilkan data orangnya,
   *  bukan label generik "workspace"). */
  editorName?: string;
  /** TC-223 — hanya untuk customer: buka chat support dari editor. */
  onContactSupport?: () => void;
  saved: boolean;
  setView: (view: View) => void;
  setPreviewOpen: (value: boolean) => void;
  greetings: Greeting[];
  addGreeting: (name: string, message: string) => void;
  guests: Guest[];
  addGuest: (
    name: string,
    status: Guest["status"],
    pax: number,
    canvasId?: string,
  ) => void;
  flash: (message: string) => void;
  soundCatalog: SoundCatalogItem[];
  loadDraft: () => Promise<any>;
  discardDraft: () => Promise<unknown>;
  autosaveContent: (draft: {
    sections: CanvasSection[];
    slug: string;
    siteTitle: string;
  }) => Promise<void>;
  loadRevisions: () => Promise<any[]>;
};

function Editor({
  sections,
  setSections: setSectionsRaw,
  slug,
  setSlug,
  siteTitle,
  setSiteTitle,
  selectedTemplate,
  saveSite,
  editorMode,
  managingCustomer = false,
  editorName = "",
  onContactSupport,
  saved,
  setView,
  setPreviewOpen,
  greetings,
  addGreeting,
  guests,
  addGuest,
  flash,
  soundCatalog,
  autosaveContent,
  loadRevisions,
  loadDraft,
  discardDraft,
}: EditorProps) {
  const [activePage, setActivePage] = useState<PageKey>("pages");
  const requestedCanvasId = sessionStorage.getItem("ikrarku-edit-canvas");
  const initialSection =
    sections.find((section) => section.id === requestedCanvasId) || sections[0];
  const [selectedSectionId, setSelectedSectionId] = useState(
    initialSection?.id || "",
  );
  const [selectedColumnId, setSelectedColumnId] = useState(
    initialSection?.columns[0]?.id || "",
  );
  const [selectedFeatureId, setSelectedFeatureId] = useState(
    initialSection?.columns[0]?.features[0]?.id || "",
  );
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>("content");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">(
    "desktop",
  );
  // Tata letak kolom (ala serein): di Desktop isi undangan adalah versi
  // Mobile, jadi apa yang terlihat dan diedit di mode Desktop pun Mobile.
  const desktopColumn = usesDesktopColumn(sections);
  const editDevice: DeviceMode =
    previewMode === "desktop" && desktopColumn ? "mobile" : previewMode;
  // Lebar kerja canvas ditampilkan pada chip mode supaya Web Designer tahu
  // persis pada lebar berapa desainnya sedang dilihat.
  const canvasFrameRef = useRef<HTMLDivElement | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(0);
  // Lebar saat Preview dibuka. Sejak TC-216 sama dengan area kerja editor
  // pada mode Desktop (dulu selebar jendela), dan 390 px pada mode Mobile.
  const [previewWidth, setPreviewWidth] = useState(0);
  useEffect(() => {
    const node = canvasFrameRef.current;
    if (!node) return;
    const read = () => {
      setCanvasWidth(Math.round(node.getBoundingClientRect().width));
      if (previewMode === "desktop")
        lastDesktopCanvasWidth = Math.round(node.getBoundingClientRect().width);
      // TC-216 — preview Desktop kini selebar area kerja ini, bukan selebar
      // jendela, jadi kedua angka di chip mode seharusnya sama.
      setPreviewWidth(
        previewMode === "mobile"
          ? MOBILE_PREVIEW_WIDTH
          : Math.round(node.getBoundingClientRect().width),
      );
    };
    read();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", read);
      return () => window.removeEventListener("resize", read);
    }
    const observer = new ResizeObserver(read);
    observer.observe(node);
    window.addEventListener("resize", read);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", read);
    };
  }, [previewMode]);
  const [animationNonce, setAnimationNonce] = useState(0);
  const [widgetQuery, setWidgetQuery] = useState("");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [recovery, setRecovery] = useState<any>(null);
  const readDraft = useEffectEvent(() => loadDraft());
  const reportDraftError = useEffectEvent(() =>
    flash("Draft recovery belum dapat dimuat. Coba buka ulang editor."),
  );
  const writeDraft = useEffectEvent(
    (draft: { sections: CanvasSection[]; slug: string; siteTitle: string }) =>
      autosaveContent(draft),
  );
  const pendingAutosave = useRef<Promise<void>>(Promise.resolve());
  // Penanda autosave yang masih berjalan. Dipakai supaya rantai promise tidak
  // pernah menahan tombol Save: kalau autosave terakhir menggantung, Save tetap
  // jalan dan memakai isi editor terbaru.
  const autosaveInFlight = useRef(false);
  useEffect(() => {
    let alive = true;
    void readDraft()
      .then((draft) => {
        if (alive && draft) setRecovery(draft);
      })
      .catch(() => reportDraftError());
    return () => {
      alive = false;
    };
  }, [editorMode, selectedTemplate.id]);
  const [leavePromptOpen, setLeavePromptOpen] = useState(false);
  const [autosaveState, setAutosaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [revisionOpen, setRevisionOpen] = useState(false);
  const [revisions, setRevisions] = useState<any[]>([]);
  const [revisionsLoading, setRevisionsLoading] = useState(false);
  const historyRef = useRef<CanvasSection[][]>([]);
  const lastHistoryAtRef = useRef(0);
  const futureRef = useRef<CanvasSection[][]>([]);
  // TC-219 — riwayat diambil dari state TERBARU, bukan dari `sections` milik
  // render saat handler dibuat. Handler yang tertangkap lebih awal (slider,
  // drag, upload async) atau dua commit beruntun sebelum render ulang dulu
  // menyimpan snapshot basi, sehingga undo melompat ke kondisi yang salah.
  const sectionsRef = useRef(sections);
  sectionsRef.current = sections;
  const savedBaselineRef = useRef<{
    sections: CanvasSection[];
    slug: string;
    siteTitle: string;
  }>({ sections: structuredClone(sections), slug, siteTitle });
  const captureSavedBaseline = () => {
    savedBaselineRef.current = {
      sections: structuredClone(sections),
      slug,
      siteTitle,
    };
  };
  const discardToSavedBaseline = () => {
    const baseline = savedBaselineRef.current;
    setSectionsRaw(structuredClone(baseline.sections));
    setSlug(baseline.slug);
    setSiteTitle(baseline.siteTitle);
    historyRef.current = [];
    futureRef.current = [];
    setDirty(false);
    setAutosaveState("idle");
  };
  // Batas undo. Dulu 40 lalu diturunkan ke 15 karena setiap event (puluhan
  // per detik saat menggeser slider) membuat satu structuredClone dan editor
  // freeze. Sejak clone digabung per gestur (HISTORY_COALESCE_MS) biayanya
  // per langkah, bukan per event, jadi TC-219 menaikkannya ke 30 dan
  // menampilkan jumlah langkah yang tersedia di tombol Undo.
  const HISTORY_LIMIT = 30;
  // Perubahan beruntun dalam jendela ini dianggap satu gestur (satu entri undo).
  const HISTORY_COALESCE_MS = 450;
  const commitSections = (
    updater: React.SetStateAction<CanvasSection[]>,
    record = true,
  ) => {
    if (record) {
      // Slider ornamen/layer, drag feature, dan resize column memicu puluhan
      // event per detik. Tanpa coalescing setiap event melakukan
      // structuredClone seluruh desain -> main thread tersendat dan editor
      // terasa "tiba-tiba berhenti berfungsi". Efek sampingnya dulu: satu
      // geseran slider menghabiskan ke-15 slot undo.
      const previous = sectionsRef.current;
      const next =
        typeof updater === "function" ? updater(previous) : updater;
      // Perubahan yang hasilnya sama persis tidak membuat entri undo.
      if (next === previous) return;
      const now = Date.now();
      if (
        now - lastHistoryAtRef.current > HISTORY_COALESCE_MS &&
        JSON.stringify(next) !== JSON.stringify(previous)
      ) {
        historyRef.current.push(structuredClone(previous));
        while (historyRef.current.length > HISTORY_LIMIT)
          historyRef.current.shift();
        futureRef.current = [];
      }
      lastHistoryAtRef.current = now;
      sectionsRef.current = next;
      setDirty(true);
      setSectionsRaw(next);
      return;
    }
    setDirty(true);
    setSectionsRaw(updater);
  };
  const undo = () => {
    const previous = historyRef.current.pop();
    if (!previous) return;
    futureRef.current.push(structuredClone(sectionsRef.current));
    sectionsRef.current = previous;
    setSectionsRaw(structuredClone(previous));
    // Edit berikutnya harus membuka entri undo baru, bukan menyatu dengan
    // gestur sebelum undo.
    lastHistoryAtRef.current = 0;
    setDirty(true);
  };
  const redo = () => {
    const next = futureRef.current.pop();
    if (!next) return;
    historyRef.current.push(structuredClone(sectionsRef.current));
    sectionsRef.current = next;
    setSectionsRaw(structuredClone(next));
    lastHistoryAtRef.current = 0;
    setDirty(true);
  };
  useEffect(() => {
    if (!dirty || saving || recovery) return;
    setAutosaveState("saving");
    const timer = window.setTimeout(() => {
      // Jaring pengaman lokal ditulis SEBELUM request ke server. Kalau tab
      // ditutup atau editor berhenti merespons di tengah autosave, pekerjaan
      // terakhir tetap bisa dipulihkan dari localStorage.
      backupEditorDraft(siteTitle, sections, {
        slug,
        templateId: selectedTemplate.id,
      });
      autosaveInFlight.current = true;
      pendingAutosave.current = pendingAutosave.current
        .catch(() => {})
        .then(() => writeDraft({ sections, slug, siteTitle }));
      void pendingAutosave.current
        .then(() => {
          setAutosaveState("saved");
          // Draft sudah aman di server, jaring pengaman lokal tidak diperlukan
          // lagi. Tanpa ini dialog pemulihan akan muncul setiap buka editor.
          try {
            window.localStorage.removeItem(EDITOR_BACKUP_KEY);
          } catch {
            /* penyimpanan lokal diblokir */
          }
        })
        .catch(() => setAutosaveState("error"))
        .finally(() => {
          autosaveInFlight.current = false;
        });
    }, 1400);
    return () => window.clearTimeout(timer);
  }, [
    sections,
    slug,
    siteTitle,
    dirty,
    saving,
    recovery,
    editorMode,
    selectedTemplate.id,
  ]);
  const saveAndMaybeLeave = async (leave = false) => {
    if (saving) return;
    setSaving(true);
    try {
      // Tunggu autosave yang sedang berjalan, tapi jangan selamanya. Request
      // autosave yang menggantung dulu membuat tombol Save ikut mati total
      // (editor "freeze"); sekarang Save tetap lanjut setelah 5 detik dan
      // memakai isi editor terbaru, yang memang lebih baru dari draft autosave.
      await Promise.race([
        pendingAutosave.current.catch(() => {}),
        new Promise<void>((resolve) => window.setTimeout(resolve, 5000)),
      ]);
      if (autosaveInFlight.current) {
        // Putus rantai supaya autosave lama yang masih menggantung tidak
        // menahan autosave berikutnya setelah Save selesai.
        pendingAutosave.current = Promise.resolve();
        autosaveInFlight.current = false;
      }
      if (await saveSite()) {
        captureSavedBaseline();
        setDirty(false);
        setAutosaveState("saved");
        historyRef.current = [];
        futureRef.current = [];
        window.localStorage.removeItem(EDITOR_BACKUP_KEY);
        setLeavePromptOpen(false);
        if (leave) setView(managingCustomer ? "tasks" : "templates");
      } else {
        // TC-149: simpan salinan lokal supaya pekerjaan tidak hilang saat
        // penyimpanan ke server gagal, termasuk ketika sesi sudah berakhir.
        // saveSite() sudah menampilkan pesan error asli dari server; jangan
        // ditimpa pesan generik agar penyebabnya terbaca.
        backupEditorDraft(siteTitle, sections, {
          slug,
          templateId: selectedTemplate.id,
        });
      }
    } finally {
      setSaving(false);
    }
  };
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (dirty) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      // Saat mengetik di field/teks yang bisa diedit, Ctrl+Z milik browser
      // (undo ketikan). Undo editor baru berlaku setelah fokus keluar.
      const active = document.activeElement as HTMLElement | null;
      if (
        active &&
        (active.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(active.tagName))
      )
        return;
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
      } else if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "y"
      ) {
        event.preventDefault();
        redo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [sections]);
  const openRevisionHistory = async () => {
    setRevisionOpen(true);
    setRevisionsLoading(true);
    try {
      setRevisions(await loadRevisions());
    } catch (error) {
      flash(
        error instanceof Error
          ? error.message
          : "Gagal memuat revision history.",
      );
    } finally {
      setRevisionsLoading(false);
    }
  };
  const restoreRevision = (revision: any) => {
    if (!Array.isArray(revision.sections)) return;
    commitSections(structuredClone(revision.sections));
    if (editorMode === "site") {
      if (typeof revision.slug === "string") setSlug(revision.slug);
      if (typeof revision.title === "string") setSiteTitle(revision.title);
    }
    setDirty(true);
    setRevisionOpen(false);
    flash(
      "Revision dipulihkan sebagai draft. Review lalu Save untuk menyimpan.",
    );
  };
  const imageInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);
  const galleryInput = useRef<HTMLInputElement>(null);
  const backgroundInput = useRef<HTMLInputElement>(null);
  const coverBackgroundInput = useRef<HTMLInputElement>(null);
  const soundInput = useRef<HTMLInputElement>(null);

  // TC-112 — panel inspector HARUS membaca nilai device yang sedang aktif.
  // Tulisan sudah device-aware lewat applyDevicePatch(), tapi selama panel
  // membaca objek mentah (= Desktop) setiap slider/toggle kembali ke angka
  // Desktop pada render berikutnya, dan read-modify-write (gallery, form
  // fields, decorations, background layers) menimpa override Mobile dengan
  // isi Desktop. Itulah yang terbaca sebagai "setting Mobile & Desktop
  // masih nyambung".
  const rawSelectedSection = useMemo(
    () => sections.find((section) => section.id === selectedSectionId),
    [sections, selectedSectionId],
  );
  const selectedSection = useMemo(
    () =>
      rawSelectedSection
        ? resolveSection(rawSelectedSection, editDevice)
        : undefined,
    [rawSelectedSection, editDevice],
  );
  const selectedColumn = useMemo(
    () =>
      selectedSection?.columns.find((column) => column.id === selectedColumnId),
    [selectedSection, selectedColumnId],
  );
  const selectedFeature = useMemo(() => {
    const raw =
      selectedColumn?.features.find(
        (feature) => feature.id === selectedFeatureId,
      ) ??
      sections
        .flatMap((section) => section.columns)
        .flatMap((column) => column.features)
        .find((feature) => feature.id === selectedFeatureId);
    return raw ? resolveFeature(raw, editDevice) : undefined;
  }, [sections, selectedColumn, selectedFeatureId, editDevice]);

  const selectSection = (section: CanvasSection) => {
    setSelectedSectionId(section.id);
    setSelectedColumnId(section.columns[0]?.id || "");
    setSelectedFeatureId("");
    setActivePage("pages");
  };

  const selectColumn = (sectionId: string, columnId: string) => {
    setSelectedSectionId(sectionId);
    setSelectedColumnId(columnId);
    setSelectedFeatureId("");
    setActivePage("pages");
  };

  const selectFeature = (
    sectionId: string,
    columnId: string,
    featureId: string,
  ) => {
    setSelectedSectionId(sectionId);
    setSelectedColumnId(columnId);
    setSelectedFeatureId(featureId);
    setActivePage("pages");
  };

  // QA TC-112: saat mode Mobile aktif, perubahan disimpan pada slot override
  // `mobile` sehingga tampilan Desktop tidak ikut berubah (dan sebaliknya).
  const updateSection = (sectionId: string, patch: Partial<CanvasSection>) => {
    setDirty(true);
    commitSections((previous) =>
      previous.map((section) =>
        section.id === sectionId
          ? applyDevicePatch(section, patch, editDevice)
          : section,
      ),
    );
  };
  // Ornamen pojok & layer background adalah KONTEN struktural, bukan setting
  // per device. Dua alasan jalur ini harus terpisah dari updateSection():
  //  1. Editor menulis seluruh array sekaligus. Lewat applyDevicePatch satu
  //     edit di mode Mobile menyalin array ke section.mobile dan sejak itu
  //     Desktop & Mobile bercabang permanen.
  //  2. Payload dihitung dari array yang tertangkap saat render. Kalau sebuah
  //     upload gambar selesai beberapa detik kemudian, array lama menimpa
  //     semua perubahan di sela-selanya (layer baru hilang, layer terhapus
  //     muncul lagi). Producer di bawah membaca state terbaru.
  const updateSectionLive = (
    sectionId: string,
    producePatch: (current: CanvasSection) => Partial<CanvasSection>,
  ) => {
    setDirty(true);
    // TC-214 — ornamen & layer dulu SELALU ditulis ke nilai dasar section,
    // sehingga merapikan ornamen di Mobile langsung merusak Desktop yang sudah
    // rapi. Kini keduanya mengikuti aturan yang sama dengan teks & background:
    // `produce` menerima tampilan device yang sedang diedit, dan hasilnya
    // masuk ke slot device itu. Edit pertama di Mobile menyalin daftarnya ke
    // section.mobile; sejak itu keduanya berdiri sendiri, dan "Reset Mobile"
    // menyamakannya kembali dengan Desktop.
    const device = editDevice;
    commitSections((previous) =>
      previous.map((section) =>
        section.id === sectionId
          ? applyDevicePatch(
              section,
              producePatch(resolveSection(section, device)),
              device,
            )
          : section,
      ),
    );
  };
  // Beberapa pengaturan bersifat struktural dan selalu ditulis ke nilai dasar.
  const updateSectionShared = (
    sectionId: string,
    patch: Partial<CanvasSection>,
  ) => {
    setDirty(true);
    commitSections((previous) =>
      previous.map((section) =>
        section.id === sectionId ? { ...section, ...patch } : section,
      ),
    );
  };
  const resetSectionMobile = (sectionId: string) => {
    setDirty(true);
    commitSections((previous) =>
      previous.map((section) =>
        section.id === sectionId ? { ...section, mobile: undefined } : section,
      ),
    );
  };
  const resetFeatureMobile = (featureId: string) => {
    setDirty(true);
    commitSections((previous) =>
      previous.map((section) => ({
        ...section,
        columns: section.columns.map((column) => ({
          ...column,
          features: column.features.map((feature) =>
            feature.id === featureId
              ? { ...feature, mobile: undefined }
              : feature,
          ),
        })),
      })),
    );
  };

  const updateFeature = (featureId: string, patch: Partial<Feature>) => {
    setDirty(true);
    commitSections((previous) =>
      previous.map((section) => ({
        ...section,
        columns: section.columns.map((column) => ({
          ...column,
          features: column.features.map((feature) => {
            if (feature.id !== featureId) return feature;
            // TC-214 — "Sembunyikan di Desktop/Mobile" menentukan di device
            // MANA fitur muncul, jadi nilainya harus dibaca kedua device.
            // Dulu ikut masuk slot device yang aktif: dicentang dari mode
            // Mobile, nilainya tersimpan di feature.mobile, padahal Desktop
            // membaca nilai dasar — toggle itu tidak pernah berefek.
            const { hideDesktop, hideMobile, ...rest } = patch;
            const shared: Partial<Feature> = {};
            if (hideDesktop !== undefined) shared.hideDesktop = hideDesktop;
            if (hideMobile !== undefined) shared.hideMobile = hideMobile;
            // Musik juga satu untuk seluruh undangan. Pemutar membaca nilai
            // dasar, jadi lagu yang dipilih dari mode Mobile dulu tersimpan
            // di slot Mobile dan tidak pernah terdengar.
            const perDevice: Partial<Feature> = { ...rest };
            if (feature.type === "sound" || feature.type === "credit")
              for (const key of SHARED_SOUND_KEYS)
                if (key in perDevice) {
                  (shared as Record<string, unknown>)[key] = perDevice[key];
                  delete perDevice[key];
                }
            const withShared = { ...feature, ...shared };
            return Object.keys(perDevice).length
              ? applyDevicePatch(withShared, perDevice, editDevice)
              : withShared;
          }),
        })),
      })),
    );
  };

  // QA TC-111: memindahkan column (beserta seluruh feature di dalamnya) ke canvas lain.
  const moveColumnToSection = (
    payload: string,
    targetSectionId: string,
    targetIndex?: number,
  ) => {
    const [fromSectionId, columnId] = payload.split("::");
    if (!fromSectionId || !columnId) return;
    if (fromSectionId === targetSectionId && targetIndex === undefined) return;
    setDirty(true);
    commitSections((previous) => {
      const source = previous.find((item) => item.id === fromSectionId);
      const moving = source?.columns.find((item) => item.id === columnId);
      if (!moving) return previous;
      if (source && source.id !== targetSectionId && source.columns.length <= 1)
        return previous;
      return previous.map((section) => {
        if (section.id === fromSectionId && section.id === targetSectionId) {
          const rest = section.columns.filter((item) => item.id !== columnId);
          const at = Math.min(
            Math.max(0, targetIndex ?? rest.length),
            rest.length,
          );
          const columns = [...rest];
          columns.splice(at, 0, moving);
          return { ...section, columns, columnWidths: undefined };
        }
        if (section.id === fromSectionId)
          return {
            ...section,
            columns: section.columns.filter((item) => item.id !== columnId),
            columnWidths: undefined,
          };
        if (section.id === targetSectionId) {
          const columns = [...section.columns];
          const at = Math.min(
            Math.max(0, targetIndex ?? columns.length),
            columns.length,
          );
          columns.splice(at, 0, moving);
          return { ...section, columns, columnWidths: undefined };
        }
        return section;
      });
    });
    setSelectedSectionId(targetSectionId);
    setSelectedColumnId(columnId);
    flash("Column dipindahkan ke canvas tujuan.");
  };

  // QA TC-143: menduplikasi canvas beserta seluruh column dan feature di dalamnya.
  const duplicateCanvas = (sectionId: string) => {
    const source = sections.find((item) => item.id === sectionId);
    if (!source) return;
    const copy: CanvasSection = {
      ...structuredClone(source),
      id: uid("canvas"),
      name: `${source.name} (salinan)`,
      backgroundGlobal: false,
      columns: source.columns.map((column) => ({
        ...structuredClone(column),
        id: uid("column"),
        features: column.features.map((feature) => ({
          ...structuredClone(feature),
          id: uid("feature"),
        })),
      })),
    };
    setDirty(true);
    commitSections((previous) => {
      const index = previous.findIndex((item) => item.id === sectionId);
      const next = [...previous];
      next.splice(index + 1, 0, copy);
      return next;
    });
    setSelectedSectionId(copy.id);
    flash(`Canvas "${source.name}" diduplikasi.`);
  };

  const addCanvas = () => {
    const anchor =
      sections.find((item) => item.id === selectedSectionId) ||
      sections[sections.length - 1];
    const section: CanvasSection = {
      id: uid("canvas"),
      name: "New Canvas",
      columns: [{ id: uid("column"), features: [] }],
      backgroundColor: "#fffdf8",
      backgroundEffect: "none",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundGradientEnabled: false,
      backgroundGradientFrom: "#fffdf8",
      backgroundGradientTo: "#d7b66f",
      backgroundGradientAngle: 135,
      backgroundMotion: "none",
      paddingX: 32,
      paddingY: 60,
      minHeight: 300,
      layoutMode: "standard",
      invitees: [],
      ...(editorMode === "site"
        ? {
            templateInstanceId:
              anchor?.templateInstanceId || uid("custom-design"),
            sourceTemplateId: anchor?.sourceTemplateId,
            sourceTemplateName:
              anchor?.sourceTemplateName ||
              (anchor ? "Custom Design" : undefined),
          }
        : {
            // Dulu kosong di Template workspace, sehingga canvas baru tidak
            // punya penanda grup dan muncul sebagai card "Custom Design"
            // terpisah pada "Template pada website" — satu card per canvas,
            // bukan satu card per template. buildSectionsFromTemplate()
            // selalu menulis ulang ketiga nilai ini saat template dipakai
            // customer, jadi penandaan di sini tidak ikut terbawa.
            templateInstanceId:
              anchor?.templateInstanceId || `template-${selectedTemplate.id}`,
            sourceTemplateId: anchor?.sourceTemplateId || selectedTemplate.id,
            sourceTemplateName:
              anchor?.sourceTemplateName || selectedTemplate.name,
          }),
    };
    commitSections((previous) => [...previous, section]);
    selectSection(section);
  };

  const deleteSection = (sectionId: string) => {
    const section = sections.find((item) => item.id === sectionId);
    if (
      !window.confirm(
        `Hapus Canvas "${section?.name || "ini"}" beserta seluruh Column dan Feature di dalamnya?`,
      )
    )
      return;
    const next = sections.filter((item) => item.id !== sectionId);
    setDirty(true);
    commitSections(next);
    if (next[0]) selectSection(next[0]);
    else {
      setSelectedSectionId("");
      setSelectedColumnId("");
      setSelectedFeatureId("");
    }
  };

  const deleteFeature = (featureId: string) => {
    setDirty(true);
    commitSections((previous) =>
      previous.map((section) => ({
        ...section,
        columns: section.columns.map((column) => ({
          ...column,
          features: column.features.filter(
            (feature) => feature.id !== featureId,
          ),
        })),
      })),
    );
    setSelectedFeatureId("");
  };

  const duplicateFeature = (featureId: string) => {
    let nextId = "";
    commitSections((previous) =>
      previous.map((section) => ({
        ...section,
        columns: section.columns.map((column) => {
          const index = column.features.findIndex(
            (item) => item.id === featureId,
          );
          if (index < 0) return column;
          const copy = structuredClone(column.features[index]);
          copy.id = uid("feature");
          nextId = copy.id;
          return {
            ...column,
            features: [
              ...column.features.slice(0, index + 1),
              copy,
              ...column.features.slice(index + 1),
            ],
          };
        }),
      })),
    );
    if (nextId) setSelectedFeatureId(nextId);
  };

  const setColumnCount = (sectionId: string, count: ColumnCount) => {
    setDirty(true);
    commitSections((previous) =>
      previous.map((section) => {
        if (section.id !== sectionId) return section;
        const existing = section.columns;
        if (count === existing.length) return section;
        if (count > existing.length) {
          const additions = Array.from(
            { length: count - existing.length },
            () => ({ id: uid("column"), features: [] as Feature[] }),
          );
          return { ...section, columns: [...existing, ...additions] };
        }
        const kept = existing.slice(0, count);
        const overflow = existing
          .slice(count)
          .flatMap((column) => column.features);
        const last = kept[count - 1];
        const merged = kept.map((column, index) =>
          index === count - 1
            ? { ...last, features: [...last.features, ...overflow] }
            : column,
        );
        return { ...section, columns: merged };
      }),
    );
    const current = sections.find((section) => section.id === sectionId);
    if (current?.columns[0]) setSelectedColumnId(current.columns[0].id);
  };

  const addFeature = (
    type: FeatureType,
    sectionId = selectedSectionId,
    columnId = selectedColumnId,
  ) => {
    const firstSection = sections[0];
    const requestedSection =
      sections.find((item) => item.id === sectionId) ?? firstSection;
    if (!requestedSection) return;
    if (
      type === "invitation-cover" &&
      sections.some((section) =>
        section.columns.some((column) =>
          column.features.some(
            (feature) => feature.type === "invitation-cover",
          ),
        ),
      )
    ) {
      flash(
        "Feature Buka Undangan hanya dapat digunakan satu kali pada Canvas paling awal.",
      );
      return;
    }
    const section =
      type === "invitation-cover" ? firstSection : requestedSection;
    const column =
      type === "invitation-cover"
        ? section.columns[0]
        : (section.columns.find((item) => item.id === columnId) ??
          section.columns[0]);
    if (!column) return;
    // TC-214 — fitur yang ditambahkan saat merapikan Mobile dulu langsung
    // muncul juga di Desktop yang sudah rapi. Struktur canvas tetap satu
    // (keputusan 15 Okt), tetapi fitur baru dari mode Mobile kini lahir
    // tersembunyi di Desktop. Bisa dimunculkan dari tab Style kapan saja.
    // Cover tidak ikut: tamu di semua device harus melewatinya.
    const addedFromMobile = previewMode === "mobile" && type !== "invitation-cover";
    const feature = addedFromMobile
      ? { ...makeFeature(type), hideDesktop: true }
      : makeFeature(type);
    setDirty(true);
    commitSections((previous) =>
      previous.map((item) =>
        item.id === section.id
          ? {
              ...item,
              columns: item.columns.map((itemColumn) =>
                itemColumn.id === column.id
                  ? {
                      ...itemColumn,
                      features:
                        type === "invitation-cover"
                          ? [feature, ...itemColumn.features]
                          : [...itemColumn.features, feature],
                    }
                  : itemColumn,
              ),
            }
          : item,
      ),
    );
    selectFeature(section.id, column.id, feature.id);
    if (type === "invitation-cover" && requestedSection.id !== firstSection.id)
      flash("Buka Undangan otomatis ditempatkan pada Canvas paling awal.");
    else if (addedFromMobile)
      flash(
        "Ditambahkan khusus Mobile — Desktop tidak berubah. Munculkan di Desktop lewat tab Style → Sembunyikan di desktop.",
      );
    setInspectorTab("content");
    window.setTimeout(
      () =>
        document
          .getElementById(`feature-${feature.id}`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" }),
      60,
    );
  };

  const moveFeature = (
    featureId: string,
    targetSectionId: string,
    targetColumnId: string,
    /** Revisi 24 Okt — sisipkan sebelum feature ini (drag di Page Structure). */
    beforeFeatureId?: string,
  ) => {
    if (beforeFeatureId === featureId) return;
    let moved: Feature | undefined;
    const without = sections.map((section) => ({
      ...section,
      columns: section.columns.map((column) => ({
        ...column,
        features: column.features.filter((feature) => {
          if (feature.id === featureId) {
            moved = feature;
            return false;
          }
          return true;
        }),
      })),
    }));
    if (!moved) return;
    if (
      moved.type === "invitation-cover" &&
      targetSectionId !== sections[0]?.id
    ) {
      flash("Buka Undangan wajib berada pada Canvas paling awal.");
      return;
    }
    setDirty(true);
    commitSections(
      without.map((section) =>
        section.id === targetSectionId
          ? {
              ...section,
              columns: section.columns.map((column) =>
                column.id === targetColumnId
                  ? {
                      ...column,
                      features: (() => {
                        const list = [...column.features];
                        const at = beforeFeatureId
                          ? list.findIndex((item) => item.id === beforeFeatureId)
                          : -1;
                        list.splice(at < 0 ? list.length : at, 0, moved as Feature);
                        return list;
                      })(),
                    }
                  : column,
              ),
            }
          : section,
      ),
    );
    selectFeature(targetSectionId, targetColumnId, featureId);
  };

  const onColumnDrop = (
    event: React.DragEvent,
    sectionId: string,
    columnId: string,
  ) => {
    event.preventDefault();
    const widgetType = event.dataTransfer.getData(
      "application/x-ikrarku-widget",
    ) as FeatureType;
    const featureId = event.dataTransfer.getData(
      "application/x-ikrarku-feature",
    );
    if (widgetType) addFeature(widgetType, sectionId, columnId);
    else if (featureId) {
      // Revisi 24 Okt — dijatuhkan di atas feature lain: sisipkan di atas
      // atau di bawahnya (menurut separuh tinggi blok), bukan selalu di akhir.
      const over = (event.target as HTMLElement | null)?.closest?.(
        '[id^="feature-"]',
      ) as HTMLElement | null;
      let beforeId: string | undefined;
      if (over) {
        const overId = over.id.slice("feature-".length);
        const rect = over.getBoundingClientRect();
        if (event.clientY < rect.top + rect.height / 2) beforeId = overId;
        else {
          const list =
            sections
              .find((section) => section.id === sectionId)
              ?.columns.find((column) => column.id === columnId)
              ?.features.filter((feature) => feature.id !== featureId) || [];
          const index = list.findIndex((feature) => feature.id === overId);
          beforeId = index >= 0 ? list[index + 1]?.id : undefined;
        }
      }
      moveFeature(featureId, sectionId, columnId, beforeId);
    }
  };

  const moveSection = (sectionId: string, direction: -1 | 1) => {
    const index = sections.findIndex((section) => section.id === sectionId);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= sections.length) return;
    setDirty(true);
    commitSections((previous) => {
      const copy = [...previous];
      [copy[index], copy[nextIndex]] = [copy[nextIndex], copy[index]];
      const coverIndex = copy.findIndex((section) =>
        section.columns.some((column) =>
          column.features.some(
            (feature) => feature.type === "invitation-cover",
          ),
        ),
      );
      if (coverIndex > 0) copy.unshift(copy.splice(coverIndex, 1)[0]);
      return copy;
    });
  };

  const reorderSectionByDrop = (draggedId: string, targetId: string) => {
    if (!draggedId || draggedId === targetId) return;
    setDirty(true);
    commitSections((previous) => {
      const copy = [...previous];
      const from = copy.findIndex((item) => item.id === draggedId);
      const to = copy.findIndex((item) => item.id === targetId);
      if (from < 0 || to < 0) return previous;
      const [moved] = copy.splice(from, 1);
      copy.splice(to, 0, moved);
      return normalizeCoverSections(copy);
    });
  };

  const uploadToServer = async (file: File, category: string) => {
    const form = new FormData();
    form.append("file", file);
    form.append("category", category);
    const saved = await api.uploadMedia(form);
    return {
      key: saved.id as string,
      url: assetUrl(saved.url),
      name: saved.name as string,
    };
  };

  const uploadSingleMedia = async (
    file: File | undefined,
    type: "image" | "video",
  ) => {
    if (!file || !selectedFeature) return;
    const limit = type === "image" ? 1024 * 1024 : 5 * 1024 * 1024;
    if (type === "image") file = await shrinkImageToLimit(file, limit);
    if (file.size > limit) {
      flash(
        `${type === "image" ? "Image" : "Video"} melebihi batas ${type === "image" ? "1 MB" : "5 MB"}.`,
      );
      return;
    }
    if (type === "image" && !file.type.startsWith("image/")) {
      flash("File harus berupa image.");
      return;
    }
    if (type === "video" && !file.type.startsWith("video/")) {
      flash("File harus berupa video.");
      return;
    }
    try {
      const saved = await uploadToServer(file, `canvas-${type}`);
      updateFeature(selectedFeature.id, {
        mediaKey: saved.key,
        mediaUrl: saved.url,
        mediaName: saved.name,
      });
      flash(
        `${type === "image" ? "Image" : "Video"} berhasil disimpan ke server.`,
      );
    } catch (error) {
      flash(error instanceof Error ? error.message : "Upload gagal.");
    }
  };

  // QA TC-117: background image tersedia untuk semua feature, bukan hanya
  // Buka Undangan. Feature lain menyimpannya pada backgroundImageUrl agar tidak
  // bentrok dengan media utama (foto, video, sound).
  const uploadFeatureBackground = async (file: File | undefined) => {
    if (!file || !selectedFeature) return;
    if (!file.type.startsWith("image/")) {
      flash("Background harus berupa image.");
      return;
    }
    file = await shrinkImageToLimit(file, 2 * 1024 * 1024);
    if (file.size > 2 * 1024 * 1024) {
      flash("Background image maksimal 2 MB.");
      return;
    }
    try {
      const saved = await uploadToServer(file, "feature-background");
      updateFeature(
        selectedFeature.id,
        selectedFeature.type === "invitation-cover"
          ? { mediaKey: saved.key, mediaUrl: saved.url, mediaName: saved.name }
          : { backgroundImageKey: saved.key, backgroundImageUrl: saved.url },
      );
      flash("Background image berhasil disimpan ke server.");
    } catch (error) {
      flash(error instanceof Error ? error.message : "Upload gagal.");
    }
  };

  const uploadSoundMedia = async (file: File | undefined) => {
    // Tombol Upload Sound tampil di Sound DAN Credit (TC-165), tetapi dulu
    // handler ini menolak Credit tanpa pesan — tombolnya mati diam-diam.
    if (
      !file ||
      !selectedFeature ||
      (selectedFeature.type !== "sound" && selectedFeature.type !== "credit")
    )
      return;
    const allowed =
      file.type.startsWith("audio/") ||
      file.type.startsWith("video/") ||
      /\.(mp3|m4a|wav|ogg|aac|mp4|webm)$/i.test(file.name);
    if (!allowed) {
      flash(
        "Gunakan file audio/video seperti MP3, M4A, WAV, OGG, AAC, MP4, atau WebM.",
      );
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      flash("File sound maksimal 15 MB.");
      return;
    }
    try {
      const saved = await uploadToServer(file, "canvas-sound");
      updateFeature(selectedFeature.id, {
        mediaKey: saved.key,
        mediaUrl: saved.url,
        mediaName: saved.name,
        soundPreset: "custom-upload",
        ...(selectedFeature.type === "credit"
          ? {
              creditSongTitle: saved.name.replace(/\.[a-z0-9]+$/i, ""),
            }
          : {}),
      });
      flash("Sound berhasil disimpan ke server.");
    } catch (error) {
      flash(error instanceof Error ? error.message : "Upload gagal.");
    }
  };

  const uploadGallery = async (files: FileList | null) => {
    if (!files || !selectedFeature) return;
    const prepared = await Promise.all(
      Array.from(files).map((file) => shrinkImageToLimit(file, 2 * 1024 * 1024)),
    );
    const validFiles = prepared.filter(
      (file) => file.type.startsWith("image/") && file.size <= 2 * 1024 * 1024,
    );
    if (validFiles.length !== files.length)
      flash(
        "Sebagian file dilewati. Gallery hanya menerima image maksimal 2 MB per file.",
      );
    try {
      const saved = await Promise.all(
        validFiles.map((file) => uploadToServer(file, "gallery")),
      );
      updateFeature(selectedFeature.id, {
        galleryKeys: [
          ...(selectedFeature.galleryKeys || []),
          ...saved.map((item) => item.key),
        ],
        galleryUrls: [
          ...(selectedFeature.galleryUrls || []),
          ...saved.map((item) => item.url),
        ],
      });
      flash(`${saved.length} image disimpan ke Gallery server.`);
    } catch (error) {
      flash(error instanceof Error ? error.message : "Upload gallery gagal.");
    }
  };

  // Revisi: gambar untuk layer background diunggah dari komputer.
  // Logo bank/e-wallet pada Wedding Gift — gambar kecil, dikompres bila perlu.
  const uploadGiftLogo = async (file: File | undefined) => {
    if (!file) return null;
    // SVG sengaja ditolak: berkas SVG bisa memuat skrip yang ikut berjalan
    // bila URL /uploads-nya dibuka langsung.
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      flash("Logo harus berupa gambar PNG, JPG, atau WebP.");
      return null;
    }
    file = await shrinkImageToLimit(file, 1024 * 1024);
    if (file.size > 1024 * 1024) {
      flash("Logo maksimal 1 MB.");
      return null;
    }
    try {
      const saved = await uploadToServer(file, "gift-logo");
      flash("Logo bank berhasil diunggah.");
      return { url: saved.url, key: saved.key };
    } catch (error) {
      flash(error instanceof Error ? error.message : "Upload logo gagal.");
      return null;
    }
  };
  // Revisi 22 Okt — ikon menu bottom navigation hasil upload.
  const uploadNavIcon = async (file: File | undefined) => {
    if (!file) return null;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      flash("Ikon harus berupa gambar PNG, JPG, atau WebP.");
      return null;
    }
    file = await shrinkImageToLimit(file, 512 * 1024);
    if (file.size > 512 * 1024) {
      flash("Ikon maksimal 512 KB.");
      return null;
    }
    try {
      const saved = await uploadToServer(file, "nav-icon");
      flash("Ikon menu berhasil diunggah.");
      return { url: saved.url, key: saved.key };
    } catch (error) {
      flash(error instanceof Error ? error.message : "Upload ikon gagal.");
      return null;
    }
  };
  const uploadLayerImage = async (file: File | undefined) => {
    if (!file) return null;
    if (!file.type.startsWith("image/")) {
      flash("Gambar layer harus berupa image.");
      return null;
    }
    file = await shrinkImageToLimit(file, 2 * 1024 * 1024);
    if (file.size > 2 * 1024 * 1024) {
      flash("Gambar layer maksimal 2 MB.");
      return null;
    }
    try {
      const saved = await uploadToServer(file, "background-layer");
      flash("Gambar layer berhasil diunggah.");
      return { url: saved.url, key: saved.key };
    } catch (error) {
      flash(error instanceof Error ? error.message : "Upload gagal.");
      return null;
    }
  };

  // QA TC-098: background menerima gambar statis, GIF, maupun video (gambar bergerak).
  const uploadBackground = async (file: File | undefined) => {
    if (!file || !selectedSection) return;
    const isVideo = file.type.startsWith("video/");
    if (!file.type.startsWith("image/") && !isVideo) {
      flash("Background harus berupa image, GIF, atau video (MP4/WebM).");
      return;
    }
    const limit = isVideo ? 10 * 1024 * 1024 : 4 * 1024 * 1024;
    if (!isVideo) file = await shrinkImageToLimit(file, limit);
    if (file.size > limit) {
      flash(
        isVideo
          ? "Background video maksimal 10 MB."
          : "Background image/GIF maksimal 4 MB.",
      );
      return;
    }
    try {
      const saved = await uploadToServer(file, "canvas-background");
      // Rasio asli direkam supaya tinggi canvas dapat mengikutinya dan desain
      // utuh tidak terpotong `background-size:cover` pada lebar yang berbeda.
      const aspect = await readMediaAspect(file).catch(() => undefined);
      // Canvas yang belum punya feature berarti backgroundnya memang dipakai
      // sebagai desain utuh, jadi defaultnya mengikuti rasio asli. Canvas yang
      // sudah berisi feature tidak diubah perilakunya.
      const backgroundIsTheDesign = !selectedSection.columns.some(
        (column) => column.features.length > 0,
      );
      const followAspect = Boolean(aspect) && backgroundIsTheDesign;
      if (isVideo)
        updateSection(selectedSection.id, {
          backgroundVideoKey: saved.key,
          backgroundVideoUrl: saved.url,
          backgroundVideoName: file.name,
          backgroundAspect: aspect,
          backgroundFollowAspect: followAspect,
        });
      else
        updateSection(selectedSection.id, {
          backgroundKey: saved.key,
          backgroundUrl: saved.url,
          backgroundName: file.name,
          backgroundAspect: aspect,
          backgroundFollowAspect: followAspect,
        });
      flash(
        isVideo
          ? "Background bergerak (video) berhasil disimpan."
          : "Background image berhasil disimpan ke server.",
      );
    } catch (error) {
      flash(error instanceof Error ? error.message : "Upload gagal.");
    }
  };

  // TC-149: tawarkan pemulihan bila ada salinan lokal dari sesi sebelumnya.
  const [localBackup, setLocalBackup] = useState<ReturnType<
    typeof readEditorBackup
  > | null>(null);
  const [savingBackup, setSavingBackup] = useState(false);
  useEffect(() => {
    setLocalBackup(readEditorBackup());
  }, []);

  const addFormField = () => {
    if (!selectedFeature) return;
    updateFeature(selectedFeature.id, {
      formFields: [
        ...(selectedFeature.formFields || []),
        `Field ${(selectedFeature.formFields?.length || 0) + 1}`,
      ],
    });
  };

  return (
    <>
      {localBackup && (
        <div className="dialog-overlay">
          <div className="revision-dialog">
            <h2>Ada salinan desain yang belum tersimpan</h2>
            <p>
              Terakhir Anda mengedit{" "}
              <strong>{localBackup.title || "desain ini"}</strong> pada{" "}
              {new Date(localBackup.savedAt).toLocaleString("id-ID")}, tetapi
              perubahannya belum sempat tersimpan ke server — bisa karena sesi
              berakhir atau koneksi terputus. Salinannya masih tersimpan di
              browser ini.
            </p>
            <p className="recovery-note">
              <strong>Simpan Perubahan Sebelumnya</strong> memuat salinan itu ke
              editor lalu mengirimnya ke server, sehingga menjadi versi terbaru.{" "}
              <strong>Buang Perubahan Sebelumnya</strong> menghapus salinan lokal
              dan tetap memakai versi terakhir yang ada di server.
            </p>
            <div className="recovery-actions">
            <button
              className="primary-btn"
              disabled={savingBackup}
              onClick={async () => {
                setSavingBackup(true);
                commitSections(hydrateSections(localBackup.sections || []));
                if (localBackup.title) setSiteTitle(localBackup.title);
                setLocalBackup(null);
                // Tombolnya menjanjikan "simpan", jadi kirim ke server sekarang.
                const saved = await saveSite();
                if (saved) {
                  captureSavedBaseline();
                  setDirty(false);
                  setAutosaveState("saved");
                  window.localStorage.removeItem(EDITOR_BACKUP_KEY);
                  flash("Perubahan sebelumnya tersimpan ke server.");
                } else {
                  setDirty(true);
                  flash(
                    "Perubahan dimuat ke editor, tetapi belum berhasil dikirim ke server. Coba tekan Save lagi.",
                  );
                }
                setSavingBackup(false);
              }}
            >
              {savingBackup ? "Menyimpan..." : "Simpan Perubahan Sebelumnya"}
            </button>
            <button
              className="secondary-btn"
              disabled={savingBackup}
              onClick={() => {
                window.localStorage.removeItem(EDITOR_BACKUP_KEY);
                setLocalBackup(null);
                flash("Salinan lokal dibuang. Memakai versi terakhir dari server.");
              }}
            >
              Buang Perubahan Sebelumnya
            </button>
            </div>
          </div>
        </div>
      )}
      {recovery && !localBackup && (
        <div className="dialog-overlay">
          <div className="revision-dialog">
            <h2>Pulihkan draft terakhir?</h2>
            <p>
              Draft otomatis tersimpan pada{" "}
              {new Date(recovery.updatedAt).toLocaleString("id-ID")}. Versi
              publik belum berubah.
            </p>
            <button
              className="primary-btn"
              onClick={() => {
                commitSections(hydrateSections(recovery.sections || []));
                if (editorMode === "site") {
                  setSlug(recovery.slug || slug);
                  setSiteTitle(recovery.title || siteTitle);
                }
                setRecovery(null);
              }}
            >
              Pulihkan draft
            </button>
            <button
              className="secondary-btn"
              onClick={() => {
                void discardDraft()
                  .then(() => setRecovery(null))
                  .catch(() => flash("Gagal menghapus draft. Coba lagi."));
              }}
            >
              Gunakan versi tersimpan
            </button>
          </div>
        </div>
      )}
      <div
        className="editor-shell"
        inert={saving || Boolean(recovery) || Boolean(localBackup)}
      >
        <header className="editor-topbar">
          <div className="editor-top-left">
            <button
              className="icon-btn"
              onClick={() => {
                if (dirty) setLeavePromptOpen(true);
                else setView(managingCustomer ? "tasks" : "templates");
              }}
            >
              <ArrowLeft size={19} />
            </button>
            <Brand />
            <div className="doc-name">
              <strong>{siteTitle}</strong>
              <span>
                <span className="green-dot" />{" "}
                {editorMode === "template"
                  ? "Template"
                  : managingCustomer
                    ? "Website customer"
                    : "Website"}
                {editorName ? ` · diedit oleh ${editorName}` : ""}
              </span>
            </div>
          </div>
          <div className="device-switch">
            <button
              className={previewMode === "desktop" ? "active" : ""}
              onClick={() => setPreviewMode("desktop")}
            >
              <Monitor size={17} />
            </button>
            <button
              className={previewMode === "mobile" ? "active" : ""}
              onClick={() => setPreviewMode("mobile")}
            >
              <Smartphone size={17} />
            </button>
          </div>
          <div className="editor-actions">
            {onContactSupport && (
              <button
                className="secondary-btn editor-support-btn"
                onClick={onContactSupport}
                title="Chat dengan Customer Service tanpa keluar dari editor"
              >
                <Headphones size={16} /> Hubungi Support
              </button>
            )}
            <div className="history-actions">
              <button
                className="icon-btn"
                title={`Undo (Ctrl/Cmd+Z) · ${historyRef.current.length} langkah tersedia, maksimal ${HISTORY_LIMIT}`}
                aria-label="Undo"
                disabled={!historyRef.current.length}
                onClick={undo}
              >
                <ChevronLeft size={17} />
                {historyRef.current.length > 0 && (
                  <span className="history-count">
                    {historyRef.current.length}
                  </span>
                )}
              </button>
              <button
                className="icon-btn"
                title={`Redo (Ctrl/Cmd+Y) · ${futureRef.current.length} langkah`}
                aria-label="Redo"
                disabled={!futureRef.current.length}
                onClick={redo}
              >
                <ChevronRight size={17} />
              </button>
            </div>
            <span className={`autosave-indicator ${autosaveState}`}>
              {autosaveState === "saving"
                ? "Saving draft…"
                : autosaveState === "saved"
                  ? "Autosaved"
                  : autosaveState === "error"
                    ? "Autosave failed"
                    : "Draft ready"}
            </span>
            <button
              className="secondary-btn"
              onClick={() => void openRevisionHistory()}
            >
              <HistoryIcon size={17} /> Revisions
            </button>
            <button
              className="secondary-btn"
              onClick={() => setPreviewOpen(true)}
            >
              <Eye size={17} /> Preview
            </button>
            <button
              className="primary-btn"
              disabled={saving}
              onClick={() => void saveAndMaybeLeave()}
            >
              {saved ? <Check size={17} /> : <Save size={17} />}{" "}
              {saved
                ? "Saved"
                : editorMode === "template"
                  ? "Save Template Draft"
                  : "Save & Publish"}
            </button>
          </div>
        </header>
        <div className="editor-body">
          <aside className="editor-left">
            {/* Konteks: saat mengelola canvas customer, tampilkan template yang
                sedang dipakai agar Web Designer tahu sedang mengedit apa. */}
            {managingCustomer && (
              <div
                className={`editing-context-card preset-${selectedTemplate.preset || "classic"}`}
              >
                <span>WEBSITE CUSTOMER</span>
                <strong>{siteTitle || "Website customer"}</strong>
                <small>
                  {selectedTemplate.name} · {selectedTemplate.category} ·{" "}
                  {sections.length} section
                </small>
              </div>
            )}
            <div className="editor-panel-title">
              <strong>Page Structure</strong>
              <button className="icon-btn small" onClick={addCanvas}>
                <Plus size={16} />
              </button>
            </div>
            <div className="structure-tree">
              {sections.map((section, sectionIndex) => (
                <div
                  className="tree-canvas"
                  key={section.id}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    // QA TC-111: canvas menerima drop column maupun reorder canvas.
                    const column = event.dataTransfer.getData(
                      "application/x-ikrarku-column",
                    );
                    if (column) {
                      moveColumnToSection(column, section.id);
                      return;
                    }
                    reorderSectionByDrop(
                      event.dataTransfer.getData(
                        "application/x-ikrarku-canvas",
                      ),
                      section.id,
                    );
                  }}
                >
                  <div
                    draggable
                    className={`tree-row canvas-node ${selectedSectionId === section.id && !selectedFeatureId ? "active" : ""}`}
                    onDragStart={(event) => {
                      event.dataTransfer.setData(
                        "application/x-ikrarku-canvas",
                        section.id,
                      );
                      event.dataTransfer.effectAllowed = "move";
                    }}
                    onClick={() => selectSection(section)}
                  >
                    <GripVertical size={14} />
                    <LayoutDashboard size={15} />
                    <span>{section.name}</span>
                    <div className="tree-actions">
                      <button
                        title="Move up"
                        onClick={(event) => {
                          event.stopPropagation();
                          moveSection(section.id, -1);
                        }}
                        disabled={sectionIndex === 0}
                      >
                        <MoveUp size={13} />
                      </button>
                      <button
                        title="Move down"
                        onClick={(event) => {
                          event.stopPropagation();
                          moveSection(section.id, 1);
                        }}
                        disabled={sectionIndex === sections.length - 1}
                      >
                        <MoveDown size={13} />
                      </button>
                      {/* QA TC-143: duplikasi canvas beserta isinya. */}
                      <button
                        title="Duplicate canvas"
                        onClick={(event) => {
                          event.stopPropagation();
                          duplicateCanvas(section.id);
                        }}
                      >
                        <Copy size={13} />
                      </button>
                      <button
                        title="Delete canvas"
                        onClick={(event) => {
                          event.stopPropagation();
                          deleteSection(section.id);
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                  {section.columns.map((column, columnIndex) => (
                    <div
                      className="tree-column"
                      key={column.id}
                      /* QA TC-111: column dapat di-drag ke canvas lain. */
                      onDragOver={(event) => {
                        const types = event.dataTransfer.types;
                        if (
                          types.includes("application/x-ikrarku-column") ||
                          types.includes("application/x-ikrarku-feature")
                        ) {
                          event.preventDefault();
                          event.stopPropagation();
                          event.currentTarget.classList.add("column-drop-ready");
                        }
                      }}
                      onDragLeave={(event) =>
                        event.currentTarget.classList.remove("column-drop-ready")
                      }
                      onDrop={(event) => {
                        event.currentTarget.classList.remove("column-drop-ready");
                        // Revisi 24 Okt — feature dari Page Structure dijatuhkan
                        // di area column (bukan di atas feature lain): taruh di
                        // paling bawah column itu.
                        const featureId = event.dataTransfer.getData(
                          "application/x-ikrarku-feature",
                        );
                        if (featureId) {
                          event.preventDefault();
                          event.stopPropagation();
                          moveFeature(featureId, section.id, column.id);
                          return;
                        }
                        const payload = event.dataTransfer.getData(
                          "application/x-ikrarku-column",
                        );
                        if (!payload) return;
                        event.preventDefault();
                        event.stopPropagation();
                        moveColumnToSection(payload, section.id, columnIndex);
                      }}
                    >
                      <button
                        className={`tree-row column-node ${selectedColumnId === column.id && !selectedFeatureId ? "active" : ""}`}
                        draggable
                        onDragStart={(event) => {
                          event.stopPropagation();
                          event.dataTransfer.setData(
                            "application/x-ikrarku-column",
                            `${section.id}::${column.id}`,
                          );
                          event.dataTransfer.effectAllowed = "move";
                        }}
                        onClick={() => selectColumn(section.id, column.id)}
                        title="Drag untuk memindahkan column ke canvas lain"
                      >
                        <GripVertical size={12} />
                        <span className="column-number">{columnIndex + 1}</span>
                        <span>Column {columnIndex + 1}</span>
                        <small>{column.features.length} features</small>
                      </button>
                      <div className="tree-features">
                        {column.features.map((feature) => (
                          <div
                            className={`tree-row feature-node ${selectedFeatureId === feature.id ? "active" : ""}`}
                            onClick={() =>
                              selectFeature(section.id, column.id, feature.id)
                            }
                            key={feature.id}
                            // Revisi 24 Okt — feature bisa di-drag di Page
                            // Structure: urutkan ulang dalam column, atau pindah
                            // ke column/canvas lain. Jatuhkan di atas feature
                            // lain = disisipkan sebelum feature itu.
                            draggable
                            title="Drag untuk mengubah urutan atau memindahkan feature"
                            onDragStart={(event) => {
                              event.stopPropagation();
                              event.dataTransfer.setData(
                                "application/x-ikrarku-feature",
                                feature.id,
                              );
                              event.dataTransfer.effectAllowed = "move";
                              event.currentTarget.classList.add("is-dragging");
                            }}
                            onDragEnd={(event) =>
                              event.currentTarget.classList.remove("is-dragging")
                            }
                            onDragOver={(event) => {
                              if (
                                !event.dataTransfer.types.includes(
                                  "application/x-ikrarku-feature",
                                )
                              )
                                return;
                              event.preventDefault();
                              event.stopPropagation();
                              event.currentTarget.classList.add("drop-before");
                            }}
                            onDragLeave={(event) =>
                              event.currentTarget.classList.remove("drop-before")
                            }
                            onDrop={(event) => {
                              event.currentTarget.classList.remove("drop-before");
                              const draggedId = event.dataTransfer.getData(
                                "application/x-ikrarku-feature",
                              );
                              if (!draggedId) return;
                              event.preventDefault();
                              event.stopPropagation();
                              moveFeature(
                                draggedId,
                                section.id,
                                column.id,
                                feature.id,
                              );
                            }}
                          >
                            <GripVertical size={11} className="tree-drag-grip" />
                            <FeatureIcon type={feature.type} />
                            <span>{feature.title || feature.type}</span>
                            <div className="tree-feature-actions">
                              <button
                                title="Duplicate feature"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  duplicateFeature(feature.id);
                                }}
                              >
                                <Copy size={12} />
                              </button>
                              <button
                                title="Delete feature"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  deleteFeature(feature.id);
                                }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <button className="add-section" onClick={addCanvas}>
              <Plus size={17} /> Tambah Section
            </button>
            {/* QA TC-142: perjelas bahwa canvas adalah bagian dari template yang
                sama, bukan template terpisah. */}
            <p className="canvas-help-note">
              Setiap Section adalah satu bagian dari template yang sama —
              misalnya Cover, Mempelai, Acara, Lokasi, RSVP. Seluruhnya tersimpan
              dan terpublish sebagai satu template utuh ketika Anda menekan Save.
            </p>
            {/* QA TC-146: pilihan mode background global atau per canvas. */}
            {sections[0] && (
              <div className="setting-row compact background-mode-switch">
                <div>
                  <ImageIcon size={16} />
                  <span>
                    {/* TC-197 — dulu "Background global": gambar Canvas 1
                        dilukis ulang di tiap canvas dan dicoba dikunci dengan
                        background-attachment:fixed, yang tidak bekerja di
                        preview maupun di Safari iOS. Kini benar-benar satu
                        lapisan diam di belakang seluruh undangan. */}
                    <strong>Background tetap</strong>
                    <small>
                      {sections[0].backgroundGlobal
                        ? "Aktif: background Canvas 1 diam di belakang seluruh undangan; isi setiap canvas bergulir di atasnya."
                        : "Mati: setiap canvas punya background sendiri dan ikut bergulir. Aktifkan untuk satu background diam di belakang seluruh undangan."}
                    </small>
                  </span>
                </div>
                <button
                  className={`toggle ${sections[0].backgroundGlobal ? "on" : ""}`}
                  aria-pressed={Boolean(sections[0].backgroundGlobal)}
                  aria-label="Background tetap"
                  onClick={() => {
                    const next = !sections[0].backgroundGlobal;
                    // Struktural: berlaku untuk semua canvas dan kedua device.
                    updateSectionShared(sections[0].id, {
                      backgroundGlobal: next,
                    });
                  }}
                >
                  <i />
                </button>
              </div>
            )}
            {sections[0] && (
              <DesktopLayoutPanel
                first={sections[0]}
                update={(patch) => updateSectionShared(sections[0].id, patch)}
                flash={flash}
                uploadToServer={uploadToServer}
              />
            )}
            {sections[0] && (
              <BottomNavPanel
                sections={sections}
                first={sections[0]}
                update={(patch) => updateSectionShared(sections[0].id, patch)}
                uploadIcon={uploadNavIcon}
              />
            )}
{onContactSupport && (
              <div className="support-help-card">
                <Headphones size={18} />
                <div>
                  <strong>Bingung mengatur undangan?</strong>
                  <span>Tim kami siap membantu langsung dari sini.</span>
                </div>
                <button onClick={onContactSupport}>Hubungi Support</button>
              </div>
            )}
            <div className="page-settings">
              <strong>Site Pages</strong>
              <button
                className={activePage === "pages" ? "active" : ""}
                onClick={() => setActivePage("pages")}
              >
                <FileText size={16} /> Pages <span>Home</span>
              </button>
              <button
                className={activePage === "invitees" ? "active" : ""}
                onClick={() => setActivePage("invitees")}
              >
                <Users size={16} /> List Undangan
              </button>
              <button
                className={activePage === "rsvp-page" ? "active" : ""}
                onClick={() => setActivePage("rsvp-page")}
              >
                <CheckCircle2 size={16} /> RSVP Confirmation
              </button>
            </div>
          </aside>
          <main className="canvas-workspace">
            <div className="workspace-toolbar">
              {editorMode === "site" ? (
                <div className="slug-field">
                  <Globe2 size={15} />
                  <span>ikrarku.id/</span>
                  <input
                    value={slug}
                    onChange={(event) => {
                      setDirty(true);
                      setSlug(event.target.value.replace(/[^a-z0-9-]/g, ""));
                    }}
                  />
                </div>
              ) : (
                <div className="template-mode-chip">
                  <Palette size={15} /> Template Design · URL tidak diperlukan ·{" "}
                  {previewMode === "mobile" ? "Mobile" : "Desktop"} · Area kerja{" "}
                  {canvasWidth ? `${canvasWidth} px` : "…"} · Preview{" "}
                  {previewWidth ? `${previewWidth} px` : "…"}
                </div>
              )}
              <span className="canvas-hint">
                <Sparkles size={14} /> Klik teks untuk edit langsung · Drag
                feature ke column
              </span>
            </div>
            {/* QA TC-112: canvas dirender memakai setting device yang dipilih. */}
            <DeviceContext value={previewMode}>
            <div ref={canvasFrameRef} className={`canvas-frame ${previewMode}`}>
              {activePage === "invitees" ? (
                <InviteeManagementPage
                  sections={sections}
                  selectedSectionId={selectedSectionId}
                  selectSection={selectSection}
                  updateSection={updateSection}
                  flash={flash}
                  slug={slug}
                />
              ) : (
                <WeddingCanvas
                  page={activePage}
                  sections={sections}
                  selectedTemplate={selectedTemplate}
                  greetings={greetings}
                  addGreeting={addGreeting}
                  guests={guests}
                  addGuest={addGuest}
                  editable
                  selectedSectionId={selectedSectionId}
                  selectedColumnId={selectedColumnId}
                  selectedFeatureId={selectedFeatureId}
                  selectSection={selectSection}
                  selectColumn={selectColumn}
                  selectFeature={selectFeature}
                  updateFeature={updateFeature}
                  onColumnDrop={onColumnDrop}
                  onCanvasDrop={reorderSectionByDrop}
                  animationNonce={animationNonce}
                  updateSectionLayout={updateSection}
                />
              )}
            </div>
            </DeviceContext>
          </main>
          <aside className="editor-right">
            <div className="inspector-tabs">
              <button
                className={inspectorTab === "content" ? "active" : ""}
                onClick={() => setInspectorTab("content")}
              >
                Content
              </button>
              <button
                className={inspectorTab === "style" ? "active" : ""}
                onClick={() => setInspectorTab("style")}
              >
                Style
              </button>
              <button
                className={inspectorTab === "advanced" ? "active" : ""}
                onClick={() => setInspectorTab("advanced")}
              >
                Advanced
              </button>
            </div>
            <div className="inspector-scroll">
              {/* QA TC-112: penanda bahwa perubahan hanya berlaku untuk mode aktif. */}
              {editDevice === "mobile" && (selectedFeature || selectedSection) && (
                <div className="device-scope-banner">
                  <Smartphone size={15} />
                  <div>
                    <strong>Mengedit tampilan Mobile</strong>
                    <span>
                      {previewMode === "desktop"
                        ? "Tata letak kolom aktif: di Desktop isi undangan memakai versi Mobile, jadi perubahan di sini mengubah Mobile."
                        : "Perubahan di sini hanya berlaku untuk Mobile. Tampilan Desktop tidak ikut berubah."}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      selectedFeature
                        ? resetFeatureMobile(selectedFeature.id)
                        : selectedSection &&
                          resetSectionMobile(selectedSection.id)
                    }
                  >
                    Samakan dengan Desktop
                  </button>
                </div>
              )}
              {onContactSupport && selectedSection && !selectedFeature && (
                <div className="support-help-card compact">
                  <Headphones size={16} />
                  <div>
                    <strong>Perlu bantuan mengatur canvas ini?</strong>
                  </div>
                  <button onClick={onContactSupport}>Hubungi Support</button>
                </div>
              )}
              {selectedFeature ? (
                <FeatureInspector
                  feature={selectedFeature}
                  tab={inspectorTab}
                  activeDevice={editDevice}
                  update={(patch) => updateFeature(selectedFeature.id, patch)}
                  addFormField={addFormField}
                  imageInput={imageInput}
                  videoInput={videoInput}
                  galleryInput={galleryInput}
                  coverBackgroundInput={coverBackgroundInput}
                  soundInput={soundInput}
                  uploadSingleMedia={uploadSingleMedia}
                  uploadFeatureBackground={uploadFeatureBackground}
                  uploadSoundMedia={uploadSoundMedia}
                  uploadGallery={uploadGallery}
                  uploadGiftLogo={uploadGiftLogo}
                  replay={() => setAnimationNonce((previous) => previous + 1)}
                  soundCatalog={soundCatalog}
                />
              ) : selectedSection ? (
                <SectionInspector
                  section={selectedSection}
                  tab={inspectorTab}
                  update={(patch) => updateSection(selectedSection.id, patch)}
                  updateShared={(patch) =>
                    updateSectionShared(selectedSection.id, patch)
                  }
                  updateLive={(produce) =>
                    updateSectionLive(selectedSection.id, produce)
                  }
                  uploadLayerImage={uploadLayerImage}
                  setColumnCount={(count) =>
                    setColumnCount(selectedSection.id, count)
                  }
                  backgroundInput={backgroundInput}
                  uploadBackground={uploadBackground}
                  backgroundGlobalOn={Boolean(sections[0]?.backgroundGlobal)}
                  isPrimaryCanvas={sections[0]?.id === selectedSection.id}
                />
              ) : (
                <div className="empty-inspector">
                  <Sparkles size={24} />
                  <strong>Pilih Canvas, Column, atau Feature</strong>
                  <p>Pengaturan yang relevan akan muncul di sini.</p>
                </div>
              )}
              {/* Revisi: Feature Library dan Website title hanya relevan saat
                  menambah konten, jadi hanya tampil di tab Content. */}
              {inspectorTab === "content" && (
                <>
              <div className="widget-library">
                <div className="library-head">
                  <strong>Feature Library</strong>
                  <span>Click atau drag ke Column</span>
                </div>
                <div className="feature-library-search">
                  <Search size={14} />
                  <input
                    value={widgetQuery}
                    onChange={(event) => setWidgetQuery(event.target.value)}
                    placeholder="Cari feature..."
                  />
                </div>
                <div className="widget-grid">
                  {widgetLibrary
                    .filter((widget) =>
                      `${widget.label} ${widget.description}`
                        .toLowerCase()
                        .includes(widgetQuery.toLowerCase()),
                    )
                    .map((widget) => (
                      <button
                        key={widget.type}
                        draggable
                        onDragStart={(event) => {
                          event.dataTransfer.setData(
                            "application/x-ikrarku-widget",
                            widget.type,
                          );
                          event.dataTransfer.effectAllowed = "copy";
                        }}
                        onClick={() => addFeature(widget.type)}
                        className="widget-card"
                      >
                        <widget.icon size={18} />
                        <strong>{widget.label}</strong>
                        <small>{widget.description}</small>
                        <GripVertical size={14} />
                      </button>
                    ))}
                </div>
              </div>
              <div className="site-identity">
                <label>
                  Website title
                  <input
                    value={siteTitle}
                    onChange={(event) => {
                      setDirty(true);
                      setSiteTitle(event.target.value);
                    }}
                  />
                </label>
              </div>
                </>
              )}
            </div>
          </aside>
        </div>
      </div>
      {revisionOpen && (
        <div className="dialog-overlay">
          <div className="revision-dialog">
            <header>
              <div>
                <span>REVISION HISTORY</span>
                <h2>Restore a previous version</h2>
              </div>
              <button
                className="icon-btn"
                onClick={() => setRevisionOpen(false)}
              >
                <X size={18} />
              </button>
            </header>
            <p>
              Revision tersimpan saat manual save. Restore akan memuat versi
              tersebut sebagai draft dan tidak menimpa data sampai Anda menekan
              Save.
            </p>
            <div className="revision-list">
              {revisionsLoading ? (
                <div className="panel-empty">
                  <Repeat2 size={20} />
                  <strong>Loading revisions…</strong>
                </div>
              ) : revisions.length ? (
                revisions.map((revision: any) => (
                  <button
                    key={revision.id}
                    onClick={() => restoreRevision(revision)}
                  >
                    <HistoryIcon size={16} />
                    <span>
                      <strong>{revision.reason || "Saved version"}</strong>
                      <small>
                        {new Date(revision.created_at).toLocaleString("id-ID")}{" "}
                        · {revision.actor_name || "System"}
                      </small>
                    </span>
                    <ArrowRight size={15} />
                  </button>
                ))
              ) : (
                <div className="panel-empty">
                  <HistoryIcon size={20} />
                  <strong>Belum ada revision</strong>
                  <span>
                    Revision pertama akan tersedia setelah manual save
                    berikutnya.
                  </span>
                </div>
              )}
            </div>
            <footer>
              <button
                className="secondary-btn"
                onClick={() => setRevisionOpen(false)}
              >
                Close
              </button>
            </footer>
          </div>
        </div>
      )}
      {leavePromptOpen && (
        <LeaveEditorModal
          onCancel={() => setLeavePromptOpen(false)}
          onDiscard={() => {
            void pendingAutosave.current
              .catch(() => {})
              .then(() => discardDraft())
              .catch((error) => {
                // Draft server gagal dibuang (mis. sesi sudah berakhir).
                // Keluar tetap harus bisa dilakukan — draft lokal dibersihkan
                // dan alasannya disampaikan apa adanya.
                flash(
                  isAuthError(error)
                    ? "Sesi Anda sudah berakhir. Perubahan dibuang secara lokal, silakan login kembali."
                    : "Draft di server gagal dibuang, perubahan dibuang secara lokal.",
                );
              })
              .then(() => {
                discardToSavedBaseline();
                setLeavePromptOpen(false);
                setView(managingCustomer ? "tasks" : "templates");
              });
          }}
          onSave={() => void saveAndMaybeLeave(true)}
        />
      )}{" "}
    </>
  );
}

function FeatureInspector({
  feature,
  tab,
  activeDevice = "desktop",
  update,
  addFormField,
  imageInput,
  videoInput,
  galleryInput,
  coverBackgroundInput,
  soundInput,
  uploadSingleMedia,
  uploadFeatureBackground,
  uploadSoundMedia,
  uploadGallery,
  uploadGiftLogo,
  replay,
  soundCatalog,
}: {
  feature: Feature;
  tab: InspectorTab;
  activeDevice?: DeviceMode;
  update: (patch: Partial<Feature>) => void;
  addFormField: () => void;
  imageInput: React.RefObject<HTMLInputElement | null>;
  videoInput: React.RefObject<HTMLInputElement | null>;
  galleryInput: React.RefObject<HTMLInputElement | null>;
  coverBackgroundInput: React.RefObject<HTMLInputElement | null>;
  soundInput: React.RefObject<HTMLInputElement | null>;
  uploadSingleMedia: (
    file: File | undefined,
    type: "image" | "video",
  ) => Promise<void>;
  uploadFeatureBackground: (file: File | undefined) => Promise<void>;
  uploadSoundMedia: (file: File | undefined) => Promise<void>;
  uploadGallery: (files: FileList | null) => Promise<void>;
  uploadGiftLogo?: (
    file: File | undefined,
  ) => Promise<{ url: string; key: string } | null>;
  replay: () => void;
  soundCatalog: SoundCatalogItem[];
}) {
  const textTypes: FeatureType[] = [
    "text",
    "quote",
    "event",
    "gift",
    "form",
    "greetings",
    "invitation-cover",
    "countdown",
    "location",
    "sound",
    "icon",
  ];
  // QA 15 Okt — fitur yang menampilkan judul & teks pendukung tetapi tidak
  // termasuk textTypes (yang juga mengatur editor di tab Content) dulu tidak
  // mendapat panel Typography, sehingga ukuran header & supporting text-nya
  // terkunci di bawaan. Dipisah dari textTypes supaya tab Content tidak
  // mendapat editor judul ganda (Credit & Love Story punya editornya sendiri).
  const typographyTypes: FeatureType[] = [
    ...textTypes,
    "image",
    "video",
    "gallery",
    "credit",
    "love-story",
    "live-stream",
  ];
  const objectAlign =
    feature.objectAlign ||
    (feature.type === "invitation-cover" ? "center" : "stretch");
  const featureWidth =
    feature.objectWidth ?? (feature.type === "invitation-cover" ? 82 : 100);
  const widthUnavailable =
    feature.type === "sound" ||
    (feature.type === "gallery" && feature.galleryFullWidth);
  const layoutLabel =
    feature.type === "invitation-cover"
      ? "Cover content position"
      : feature.type === "sound"
        ? "Player position"
        : "Feature alignment";
  const widthLabel =
    feature.type === "invitation-cover"
      ? "Cover content width"
      : "Feature width";
  const layoutHelp =
    feature.type === "invitation-cover"
      ? "Background Buka Undangan tetap full Canvas. Position dan width hanya mengatur blok konten (judul, tamu, body, tombol) agar Editor dan Preview konsisten."
      : feature.type === "sound"
        ? "Player backsound menempel di dalam area canvas. Atur sisi horizontal di sini, lalu sisi vertikal dan jaraknya pada Posisi Player di bawah."
        : feature.type === "gallery" && feature.galleryFullWidth
          ? "Full Width Gallery mengunci lebar ke viewport. Nonaktifkan Full Width untuk memakai Feature width dan alignment."
          : "Content alignment mengatur isi/text. Feature alignment mengatur posisi seluruh card/object di dalam Column.";
  const layoutControls = (
    <div className="feature-layout-controls">
      <div className="group-heading">
        <strong>Feature Layout</strong>
        <span>
          {feature.type === "invitation-cover"
            ? "Cover content block"
            : "Object alignment"}
        </span>
      </div>
      <label>
        {layoutLabel}
        <div className="toolbar-row alignment object-alignment">
          {(
            [
              ["left", AlignLeft],
              ["center", AlignCenter],
              ["right", AlignRight],
              ["stretch", AlignJustify],
            ] as [FeatureObjectAlign, typeof AlignLeft][]
          ).map(([value, Icon]) => (
            <button
              key={value}
              title={value}
              disabled={feature.type === "gallery" && feature.galleryFullWidth}
              className={objectAlign === value ? "active" : ""}
              onClick={() =>
                update({
                  objectAlign: value,
                  objectWidth:
                    value === "stretch" ? 100 : Math.min(featureWidth, 92),
                })
              }
            >
              <Icon size={16} />
            </button>
          ))}
        </div>
      </label>
      {/* TC-198 — disc backsound dulu hanya bisa digeser kiri/tengah/kanan dan
          selalu menempel 22px dari dasar layar. Sekarang sisi vertikal dan
          jaraknya bisa diatur, sehingga player bisa ditempatkan di dalam area
          canvas dan tidak menutupi desain. */}
      {feature.type === "sound" && (
        <div className="sound-position-editor">
          <div className="group-heading">
            <strong>Posisi Player</strong>
            <span>Di dalam canvas</span>
          </div>
          <label>
            Sisi vertikal
            <select
              value={feature.soundVerticalAlign || "bottom"}
              onChange={(event) =>
                update({
                  soundVerticalAlign: event.target
                    .value as Feature["soundVerticalAlign"],
                })
              }
            >
              <option value="top">Atas</option>
              <option value="center">Tengah</option>
              <option value="bottom">Bawah</option>
            </select>
          </label>
          <div className="two-inputs">
            <label className="range-field">
              <span className="range-head">
                Jarak horizontal<b>{feature.soundOffsetX ?? 22}px</b>
              </span>
              <input
                type="range"
                min="0"
                max="200"
                value={feature.soundOffsetX ?? 22}
                onChange={(event) =>
                  update({ soundOffsetX: Number(event.target.value) })
                }
              />
            </label>
            <label className="range-field">
              <span className="range-head">
                Jarak vertikal<b>{feature.soundOffsetY ?? 22}px</b>
              </span>
              <input
                type="range"
                min="0"
                max="400"
                value={feature.soundOffsetY ?? 22}
                onChange={(event) =>
                  update({ soundOffsetY: Number(event.target.value) })
                }
              />
            </label>
          </div>
        </div>
      )}
      {!widthUnavailable && (
        <label>
          {widthLabel} <span>{featureWidth}%</span>
          <input
            type="range"
            min="20"
            max="100"
            step="1"
            value={featureWidth}
            onChange={(event) =>
              update({
                objectWidth: Number(event.target.value),
                objectAlign:
                  Number(event.target.value) >= 100
                    ? "stretch"
                    : feature.objectAlign === "stretch"
                      ? "center"
                      : feature.objectAlign,
              })
            }
          />
        </label>
      )}
      <div className="layout-help">{layoutHelp}</div>
    </div>
  );

  if (tab === "content")
    return (
      <div className="inspector-group">
        <div className="selection-label">
          <FeatureIcon type={feature.type} />
          <div>
            <strong>{feature.title || feature.type}</strong>
            <span>Feature</span>
          </div>
        </div>
        {textTypes.includes(feature.type) && feature.type !== "location" && (
          <>
            <HeadingBodyEditor feature={feature} update={update} />
            <SecondaryTextEditor feature={feature} update={update} />
          </>
        )}
        {feature.type === "form" && (
          <FormFieldEditor
            feature={feature}
            update={update}
            addFormField={addFormField}
          />
        )}
        {feature.type === "image" && (
          <>
            <input
              ref={imageInput}
              hidden
              type="file"
              onClick={resetFileInput}
              accept="image/*"
              onChange={(event) =>
                void uploadSingleMedia(event.target.files?.[0], "image")
              }
            />
            <button
              className="upload-control"
              onClick={() => imageInput.current?.click()}
            >
              <Upload size={18} />
              <span>
                <strong>Upload Image</strong>
                <small>Maksimal 1 MB</small>
              </span>
            </button>
            {feature.mediaName && (
              <div className="media-file">
                <ImageIcon size={15} />
                <span>{feature.mediaName}</span>
                <Check size={14} />
              </div>
            )}
          </>
        )}
        {feature.type === "video" && (
          <>
            <input
              ref={videoInput}
              hidden
              type="file"
              onClick={resetFileInput}
              accept="video/*"
              onChange={(event) =>
                void uploadSingleMedia(event.target.files?.[0], "video")
              }
            />
            <button
              className="upload-control"
              onClick={() => videoInput.current?.click()}
            >
              <Video size={18} />
              <span>
                <strong>Upload Video</strong>
                <small>Maksimal 5 MB</small>
              </span>
            </button>
            {feature.mediaName && (
              <div className="media-file">
                <Video size={15} />
                <span>{feature.mediaName}</span>
                <Check size={14} />
              </div>
            )}
          </>
        )}
        {feature.type === "gallery" && (
          <>
            <input
              ref={galleryInput}
              hidden
              multiple
              type="file"
              onClick={resetFileInput}
              accept="image/*"
              onChange={(event) => void uploadGallery(event.target.files)}
            />
            <button
              className="upload-control"
              onClick={() => galleryInput.current?.click()}
            >
              <ImageIcon size={18} />
              <span>
                <strong>Upload Gallery Images</strong>
                <small>Maksimal 2 MB per image</small>
              </span>
            </button>
            <div className="gallery-counter">
              {feature.galleryUrls?.length || 0} image tersedia
            </div>
            {/* QA 15 Okt — layout selain grid memotong gambar. */}
            <div className="setting-row compact">
              <div>
                <ImageIcon size={16} />
                <span>
                  <strong>Tampilkan gambar utuh</strong>
                  <small>
                    Gambar tidak dipotong; sisa ruang dibiarkan kosong. Matikan
                    untuk memenuhi kotak lalu pilih bagian yang tampil per
                    gambar di bawah.
                  </small>
                </span>
              </div>
              <button
                className={`toggle ${feature.galleryFit === "contain" ? "on" : ""}`}
                aria-pressed={feature.galleryFit === "contain"}
                aria-label="Tampilkan gambar utuh"
                onClick={() =>
                  update({
                    galleryFit:
                      feature.galleryFit === "contain" ? "cover" : "contain",
                  })
                }
              >
                <i />
              </button>
            </div>
            {/* TC-229 — kotak foto mengikuti ukuran foto agar tidak ada ruang
                kosong besar, atau tinggi tetap yang bisa diatur. */}
            <label>
              Tinggi kotak foto
              <select
                value={feature.galleryHeightMode || "fixed"}
                onChange={(event) =>
                  update({
                    galleryHeightMode: event.target.value as "fixed" | "auto",
                  })
                }
              >
                <option value="fixed">Tetap (atur di bawah)</option>
                <option value="auto">Otomatis ikut ukuran foto (tanpa ruang kosong)</option>
              </select>
            </label>
            {feature.galleryHeightMode !== "auto" && (
              <label>
                Tinggi foto: {feature.galleryImageHeight || "bawaan"}
                {feature.galleryImageHeight ? "px" : ""}
                <input
                  type="range"
                  min={100}
                  max={720}
                  step={10}
                  value={feature.galleryImageHeight || 300}
                  onChange={(event) =>
                    update({ galleryImageHeight: Number(event.target.value) })
                  }
                />
              </label>
            )}
            <label>
              Jarak antar foto: {feature.galleryGap ?? 9}px
              <input
                type="range"
                min={0}
                max={40}
                value={feature.galleryGap ?? 9}
                onChange={(event) =>
                  update({ galleryGap: Number(event.target.value) })
                }
              />
            </label>
            <div className="gallery-media-manager">
              {(feature.galleryUrls || []).map((url, index) => {
                const offset = feature.galleryOffsets?.[index] || {
                  x: 50,
                  y: 50,
                };
                // Posisi per gambar sejajar dengan galleryUrls. Array diisi
                // sampai indeks ini supaya gambar sebelumnya tetap 50/50.
                const setOffset = (x: number, y: number) => {
                  const next = (feature.galleryUrls || []).map(
                    (_, itemIndex) =>
                      feature.galleryOffsets?.[itemIndex] || { x: 50, y: 50 },
                  );
                  next[index] = { x, y };
                  update({ galleryOffsets: next });
                };
                return (
                  <div key={`${url}-${index}`} className="gallery-media-entry">
                    <div className="gallery-media-item">
                      <img
                        src={assetUrl(url)}
                        alt={`Gallery ${index + 1}`}
                        style={{ objectPosition: `${offset.x}% ${offset.y}%` }}
                      />
                      <span>Image {index + 1}</span>
                      <button
                        title="Hapus gambar"
                        onClick={() =>
                          update({
                            galleryUrls: feature.galleryUrls?.filter(
                              (_, itemIndex) => itemIndex !== index,
                            ),
                            galleryKeys: feature.galleryKeys?.filter(
                              (_, itemIndex) => itemIndex !== index,
                            ),
                            // Posisi ikut dihapus, kalau tidak gambar
                            // sesudahnya mewarisi posisi gambar ini.
                            galleryOffsets: feature.galleryOffsets?.filter(
                              (_, itemIndex) => itemIndex !== index,
                            ),
                          })
                        }
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    {feature.galleryFit !== "contain" && (
                      <details className="gallery-focus">
                        <summary>
                          Atur bagian yang tampil · {offset.x}% / {offset.y}%
                        </summary>
                        <LayerOffsetPad
                          previewUrl={url}
                          size="cover"
                          repeat="no-repeat"
                          offsetX={offset.x}
                          offsetY={offset.y}
                          onChange={(x, y) => setOffset(x, y)}
                        />
                        <div className="two-inputs">
                          <label className="range-field">
                            <span className="range-head">
                              Geser X<b>{offset.x}%</b>
                            </span>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={offset.x}
                              onChange={(event) =>
                                setOffset(Number(event.target.value), offset.y)
                              }
                            />
                          </label>
                          <label className="range-field">
                            <span className="range-head">
                              Geser Y<b>{offset.y}%</b>
                            </span>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={offset.y}
                              onChange={(event) =>
                                setOffset(offset.x, Number(event.target.value))
                              }
                            />
                          </label>
                        </div>
                      </details>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
        {feature.type === "invitation-cover" && (
          <>
            <input
              ref={coverBackgroundInput}
              hidden
              type="file"
              onClick={resetFileInput}
              accept="image/*"
              onChange={(event) =>
                void uploadFeatureBackground(event.target.files?.[0])
              }
            />
            <button
              className="upload-control cover-upload"
              onClick={() => coverBackgroundInput.current?.click()}
            >
              <ImageIcon size={18} />
              <span>
                <strong>Upload Cover Background</strong>
                <small>Optional · background image default None</small>
              </span>
            </button>
            {feature.mediaUrl && (
              <div
                className="cover-bg-thumb"
                style={{ backgroundImage: `url(${assetUrl(feature.mediaUrl)})` }}
              >
                <button
                  onClick={() =>
                    update({
                      mediaUrl: undefined,
                      mediaKey: undefined,
                      mediaName: undefined,
                    })
                  }
                >
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            )}
            <label>
              Eyebrow / label
              <input
                value={feature.eyebrowText || ""}
                onChange={(event) =>
                  update({ eyebrowText: event.target.value })
                }
              />
            </label>
            <label>
              Recipient label
              <input
                value={feature.guestLabelText || ""}
                onChange={(event) =>
                  update({ guestLabelText: event.target.value })
                }
              />
            </label>
            <label>
              Default guest name
              <input
                value={feature.guestNameText || ""}
                onChange={(event) =>
                  update({ guestNameText: event.target.value })
                }
              />
            </label>
            <label>
              Button label
              <input
                value={feature.buttonLabel || ""}
                onChange={(event) =>
                  update({ buttonLabel: event.target.value })
                }
              />
            </label>
            {/* TC-193 — ukuran ketiga teks ini sebelumnya hanya bisa diubah
                lewat CSS. Heading & body memakai slider umum di tab Style. */}
            <div className="cover-size-editor">
              <div className="group-heading">
                <strong>Ukuran Teks</strong>
                <span>Eyebrow · Label · Nama</span>
              </div>
              {(
                [
                  ["eyebrowFontSize", "Eyebrow", 13, 6, 48],
                  ["guestLabelFontSize", "Recipient label", 18, 8, 56],
                  ["guestNameFontSize", "Guest name", 31, 10, 80],
                ] as const
              ).map(([field, label, fallback, min, max]) => (
                <label className="range-field" key={field}>
                  <span className="range-head">
                    {label}
                    <b>{feature[field] ?? fallback}px</b>
                  </span>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    value={feature[field] ?? fallback}
                    onChange={(event) =>
                      update({ [field]: Number(event.target.value) })
                    }
                  />
                </label>
              ))}
            </div>
            <div className="cover-icon-editor">
              <div className="group-heading">
                <strong>Opening Icon</strong>
                <span>Editable</span>
              </div>
              <label>
                Icon
                <select
                  value={feature.coverIcon || "mail"}
                  onChange={(event) =>
                    update({ coverIcon: event.target.value as CoverIconName })
                  }
                >
                  <option value="mail">Envelope</option>
                  <option value="heart">Heart</option>
                  <option value="sparkles">Sparkles</option>
                  <option value="crown">Crown</option>
                  <option value="calendar">Calendar</option>
                  <option value="none">No icon</option>
                </select>
              </label>
              <label>
                Icon position
                <select
                  value={feature.coverIconPosition || "left"}
                  onChange={(event) =>
                    update({
                      coverIconPosition: event.target
                        .value as Feature["coverIconPosition"],
                    })
                  }
                >
                  <option value="left">Left of label</option>
                  <option value="right">Right of label</option>
                  <option value="top">Above label</option>
                </select>
              </label>
              <label>
                Icon size <span>{feature.coverIconSize ?? 20}px</span>
                <input
                  type="range"
                  min="12"
                  max="56"
                  value={feature.coverIconSize ?? 20}
                  onChange={(event) =>
                    update({ coverIconSize: Number(event.target.value) })
                  }
                />
              </label>
            </div>
            <div className="info-box">
              <MailOpen size={17} />
              <p>
                Buka Undangan hanya berada pada Canvas pertama. Viewer tidak
                dapat scroll sebelum tombol dibuka.
              </p>
            </div>
          </>
        )}
        {feature.type === "countdown" && (
          <>
            <label>
              Tanggal & waktu acara
              <input
                type="datetime-local"
                value={feature.eventDate || ""}
                onChange={(event) => update({ eventDate: event.target.value })}
              />
            </label>
            <label>
              Ukuran box waktu: {feature.countdownScale ?? 100}%
              <input
                type="range"
                min={50}
                max={130}
                step={5}
                value={feature.countdownScale ?? 100}
                onChange={(event) =>
                  update({ countdownScale: Number(event.target.value) })
                }
              />
            </label>
            <CalendarButtonEditor feature={feature} update={update} />
          </>
        )}
        {feature.type === "location" && (
          <>
            <label>
              Nama lokasi
              <input
                value={feature.locationName || ""}
                onChange={(event) =>
                  update({
                    locationName: event.target.value,
                    title: event.target.value,
                  })
                }
              />
            </label>
            <label>
              Alamat
              <textarea
                value={feature.locationAddress || ""}
                onChange={(event) =>
                  update({
                    locationAddress: event.target.value,
                    body: event.target.value,
                  })
                }
              />
            </label>
            <label>
              Google Maps URL
              <input
                value={feature.mapUrl || ""}
                onChange={(event) => update({ mapUrl: event.target.value })}
                placeholder="https://maps.google.com/..."
              />
            </label>
          </>
        )}
        {/* QA TC-165: kontrol backsound dipakai bersama oleh feature sound
            lama dan Credit / Watermark yang kini menampungnya. */}
        {(feature.type === "sound" || feature.type === "credit") && (
          <>
            <label>
              Sound catalog
              <select
                value={feature.soundCatalogId || ""}
                onChange={(event) => {
                  const item = soundCatalog.find(
                    (sound) => sound.id === event.target.value,
                  );
                  if (!item) return;
                  update({
                    soundCatalogId: item.id,
                    soundPreset: item.preset,
                    mediaKey: item.mediaKey,
                    mediaUrl: item.mediaUrl,
                    mediaName: item.fileName,
                    // Pada Credit, title & body adalah ucapan terima kasih yang
                    // ditulis Web Designer; judul lagu punya tempatnya sendiri
                    // (creditSongTitle). Dulu keduanya ditimpa nama & deskripsi
                    // lagu setiap kali musik dipilih. Feature Sound lama memang
                    // menampilkan judul lagu di title/body, jadi tetap begitu.
                    ...(feature.type === "credit"
                      ? { creditSongTitle: item.name }
                      : { title: item.name, body: item.description }),
                  });
                }}
              >
                {soundCatalog.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} · {item.category}
                  </option>
                ))}
              </select>
            </label>
            <div className="sound-source-divider">
              <span>atau upload sound sendiri</span>
            </div>
            <input
              ref={soundInput}
              hidden
              type="file"
              onClick={resetFileInput}
              accept="audio/*,video/mp4,.mp3,.m4a,.wav,.ogg,.aac,.mp4"
              onChange={(event) =>
                void uploadSoundMedia(event.target.files?.[0])
              }
            />
            <button
              className="upload-control"
              onClick={() => soundInput.current?.click()}
            >
              <FileAudio size={18} />
              <span>
                <strong>Upload Sound</strong>
                <small>MP3, M4A, WAV, OGG, AAC, MP4 · maksimal 15 MB</small>
              </span>
            </button>
            {feature.mediaName && (
              <div className="media-file">
                <Music2 size={15} />
                <span>{feature.mediaName}</span>
                <button
                  onClick={() =>
                    update({
                      mediaKey: undefined,
                      mediaUrl: undefined,
                      mediaName: undefined,
                      soundCatalogId: "sound-romantic-piano",
                      soundPreset: "romantic-piano",
                      // Sama seperti pemilihan katalog: jangan sentuh ucapan
                      // pada Credit.
                      ...(feature.type === "credit"
                        ? { creditSongTitle: "Romantic Piano" }
                        : { body: "Romantic Piano" }),
                    })
                  }
                >
                  <Trash2 size={13} />
                </button>
              </div>
            )}
            <div className="setting-row compact">
              <div>
                <PlayCircle size={16} />
                <span>
                  <strong>Autoplay saat undangan dibuka</strong>
                  <small>
                    Musik langsung berjalan setelah tombol Buka Undangan
                    ditekan.
                  </small>
                </span>
              </div>
              <button
                className={`toggle ${feature.autoplay ? "on" : ""}`}
                onClick={() => update({ autoplay: !feature.autoplay })}
              >
                <i />
              </button>
            </div>
            <div className="setting-row compact">
              <div>
                <Volume2 size={16} />
                <span>
                  <strong>Tetap berjalan antar section</strong>
                  <small>Sound tidak dimatikan saat pengunjung scroll.</small>
                </span>
              </div>
              <button
                className={`toggle ${feature.soundPersist !== false ? "on" : ""}`}
                onClick={() =>
                  update({ soundPersist: !(feature.soundPersist !== false) })
                }
              >
                <i />
              </button>
            </div>
            <SoundCatalogPreview
              feature={feature}
              soundCatalog={soundCatalog}
            />
          </>
        )}
        {feature.type === "video" && (
          <div className="video-playback-group">
            <div className="group-heading">
              <strong>Playback</strong>
            </div>
            <div className="setting-row compact">
              <div>
                <PlayCircle size={16} />
                <span>
                  <strong>Autoplay</strong>
                  <small>Video langsung berjalan saat undangan dibuka.</small>
                </span>
              </div>
              <button
                className={`toggle ${feature.videoAutoplay !== false ? "on" : ""}`}
                onClick={() =>
                  update({ videoAutoplay: !(feature.videoAutoplay !== false) })
                }
              >
                <i />
              </button>
            </div>
            <div className="setting-row compact">
              <div>
                <Repeat2 size={16} />
                <span>
                  <strong>Loop</strong>
                  <small>Ulang otomatis setelah selesai.</small>
                </span>
              </div>
              <button
                className={`toggle ${feature.videoLoop !== false ? "on" : ""}`}
                onClick={() =>
                  update({ videoLoop: !(feature.videoLoop !== false) })
                }
              >
                <i />
              </button>
            </div>
            <div className="setting-row compact">
              <div>
                <VolumeX size={16} />
                <span>
                  <strong>Mute</strong>
                  <small>Wajib aktif agar autoplay diizinkan browser.</small>
                </span>
              </div>
              <button
                className={`toggle ${feature.videoMuted !== false ? "on" : ""}`}
                onClick={() =>
                  update({ videoMuted: !(feature.videoMuted !== false) })
                }
              >
                <i />
              </button>
            </div>
          </div>
        )}
        {feature.type === "countdown" && (
          <label>
            Style Save The Date
            <select
              value={feature.saveTheDateStyle || "classic"}
              onChange={(event) =>
                update({
                  saveTheDateStyle: event.target.value as SaveTheDateStyle,
                })
              }
            >
              <option value="classic">Classic</option>
              <option value="card">Elegant Card</option>
              <option value="ribbon">Ribbon</option>
              <option value="minimal">Minimal</option>
              <option value="circle">Circle Badge</option>
            </select>
          </label>
        )}
        {feature.type === "location" && (
          <label>
            Catatan tambahan / patokan arah
            <textarea
              value={feature.locationNoteText || ""}
              onChange={(event) =>
                update({ locationNoteText: event.target.value })
              }
              placeholder="Contoh: Masuk dari gerbang timur, parkir tersedia di basement."
            />
          </label>
        )}
        {feature.type === "event" && (
          <>
            <label>
              Link lokasi acara (Google Maps)
              <input
                value={feature.eventMapUrl || ""}
                onChange={(event) =>
                  update({ eventMapUrl: event.target.value })
                }
                placeholder="https://maps.google.com/..."
              />
            </label>
            <label>
              Tanggal & waktu acara (untuk Simpan Tanggal)
              <input
                type="datetime-local"
                value={feature.eventDate || ""}
                onChange={(event) => update({ eventDate: event.target.value })}
              />
            </label>
            <CalendarButtonEditor feature={feature} update={update} />
          </>
        )}
        {feature.type === "gift" && (
          <GiftAccountEditor
            feature={feature}
            update={update}
            uploadLogo={uploadGiftLogo}
          />
        )}
        {feature.type === "icon" && (
          <IconListEditor feature={feature} update={update} />
        )}
        {feature.type === "greetings" && (
          <>
          <label>
            Tampilan daftar ucapan
            <select
              value={feature.greetingsDisplay || "scroll"}
              onChange={(event) =>
                update({
                  greetingsDisplay: event.target.value as "scroll" | "paged",
                })
              }
            >
              <option value="scroll">Scroll ke bawah (semua ucapan)</option>
              <option value="paged">Nomor halaman</option>
            </select>
          </label>
          {feature.greetingsDisplay === "paged" && (
            <label>
              Ucapan per halaman: {feature.greetingsPerPage || 5}
              <input
                type="range"
                min={3}
                max={20}
                value={feature.greetingsPerPage || 5}
                onChange={(event) =>
                  update({ greetingsPerPage: Number(event.target.value) })
                }
              />
            </label>
          )}
          </>
        )}
        {feature.type === "greetings" && (
          <label>
            Layout Heading & Support Text
            <select
              value={feature.greetingsLayout || "split"}
              onChange={(event) =>
                update({
                  greetingsLayout: event.target.value as "split" | "column",
                })
              }
            >
              <option value="split">Split (form + list)</option>
              <option value="column">Column (heading di atas)</option>
            </select>
          </label>
        )}
        {feature.type === "love-story" && (
          <LoveStoryEditor feature={feature} update={update} />
        )}
        {feature.type === "credit" && (
          <CreditEditor feature={feature} update={update} />
        )}
        {feature.type === "live-stream" && (
          <LiveStreamEditor feature={feature} update={update} />
        )}
        {feature.type === "image" && (
          <ImageLayoutEditor feature={feature} update={update} />
        )}
        {feature.type === "gallery" && (
          <GallerySlideshowEditor feature={feature} update={update} />
        )}
        {feature.type === "location" && (
          <MapButtonEditor feature={feature} update={update} />
        )}
        {feature.type === "event" && (
          <MapButtonEditor feature={feature} update={update} variant="event" />
        )}
        <ExtraTextEditor feature={feature} update={update} />
      </div>
    );

  if (tab === "style")
    return (
      <div className="inspector-group">
        <div className="selection-label">
          <Palette size={17} />
          <div>
            <strong>Feature Style</strong>
            <span>{feature.type}</span>
          </div>
        </div>
        <div className="inspector-scope">
          <FeatureIcon type={feature.type} />
          <span>
            Mengatur <strong>{feature.title || feature.type}</strong>
            <small>
              Dipilih dari Content · feature {feature.type} pada Feature Library
            </small>
          </span>
        </div>
        {layoutControls}
        <BackgroundDesignControls
          value={feature}
          update={(patch) => update(patch)}
          hasImage={
            feature.type === "invitation-cover" && Boolean(feature.mediaUrl)
          }
          showImageOpacity={Boolean(feature.backgroundImageUrl)}
        />
        {/* TC-231 — kotak/kolom putih di dalam fitur (kartu rekening, ucapan,
            kolom form, kartu lokasi, Love Story, kotak waktu, Credit). */}
        {[
          "gift",
          "greetings",
          "form",
          "location",
          "love-story",
          "credit",
          "countdown",
          "event",
        ].includes(feature.type) && (
          <label className="range-field">
            <span className="range-head">
              Transparansi kotak/kolom putih
              <b>{feature.boxOpacity ?? "bawaan"}{feature.boxOpacity !== undefined ? "%" : ""}</b>
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={feature.boxOpacity ?? 82}
              onChange={(event) =>
                update({ boxOpacity: Number(event.target.value) })
              }
              onDoubleClick={() => update({ boxOpacity: undefined })}
            />
          </label>
        )}
        {typographyTypes.includes(feature.type) && (
          <>
            <label>
              Font utama
              <FontSelect
                value={feature.fontFamily}
                onChange={(fontFamily) => update({ fontFamily })}
              />
            </label>
            {/* TC-233 — style font header dan teks dipilih terpisah, di
                seluruh fitur. Kosong = ikut Font utama. */}
            <div className="two-inputs">
              <label>
                Font heading
                <FontSelect
                  value={feature.titleFontFamily}
                  onChange={(titleFontFamily) =>
                    update({ titleFontFamily: titleFontFamily || undefined })
                  }
                  allowInherit
                />
              </label>
              <label>
                Font teks
                <FontSelect
                  value={feature.bodyFontFamily}
                  onChange={(bodyFontFamily) =>
                    update({ bodyFontFamily: bodyFontFamily || undefined })
                  }
                  allowInherit
                />
              </label>
            </div>
            <div className="toolbar-row">
              <button
                className={feature.bold ? "active" : ""}
                onClick={() => update({ bold: !feature.bold })}
              >
                <Bold size={16} />
              </button>
              <button
                className={feature.italic ? "active" : ""}
                onClick={() => update({ italic: !feature.italic })}
              >
                <Italic size={16} />
              </button>
              <button
                className={feature.underline ? "active" : ""}
                onClick={() => update({ underline: !feature.underline })}
              >
                <Underline size={16} />
              </button>
            </div>
            <label>
              Content alignment
              <div className="toolbar-row alignment">
                {(
                  [
                    ["left", AlignLeft],
                    ["center", AlignCenter],
                    ["right", AlignRight],
                    ["justify", AlignJustify],
                  ] as [Alignment, typeof AlignLeft][]
                ).map(([value, Icon]) => (
                  <button
                    key={value}
                    className={feature.align === value ? "active" : ""}
                    onClick={() => update({ align: value })}
                  >
                    <Icon size={16} />
                  </button>
                ))}
              </div>
            </label>
            <label>
              Heading font size <span>{feature.fontSize}px</span>
              <input
                type="range"
                min="8"
                max="96"
                value={feature.fontSize}
                onChange={(event) =>
                  update({ fontSize: Number(event.target.value) })
                }
              />
            </label>
            <label>
              Supporting / body font size{" "}
              <span>{feature.bodyFontSize ?? 11}px</span>
              <input
                type="range"
                min="8"
                max="72"
                value={feature.bodyFontSize ?? 11}
                onChange={(event) =>
                  update({ bodyFontSize: Number(event.target.value) })
                }
              />
            </label>
            <label>
              Line spacing
              <span>{(feature.lineHeight ?? 1.45).toFixed(2)}</span>
              <input
                type="range"
                min="1"
                max="2.5"
                step="0.05"
                value={feature.lineHeight ?? 1.45}
                onChange={(event) =>
                  update({ lineHeight: Number(event.target.value) })
                }
              />
            </label>
            <div className="two-inputs">
              <label>
                Text color
                <ColorInput value={feature.textColor} fallback="#154f40" onChange={(next) => update({ textColor: next })} />
              </label>
              <label>
                Background
                <ColorInput
                  value={feature.backgroundColor}
                  onChange={(next) =>
                    update({ backgroundColor: next ?? "transparent" })
                  }
                />
              </label>
            </div>
          </>
        )}
        {feature.type === "invitation-cover" && (
          <div className="cover-style-group">
            <div className="group-heading">
              <strong>Opening Layout & Button</strong>
              <span>Canvas-like controls</span>
            </div>
            <label>
              Vertical position
              <select
                value={feature.coverVerticalAlign || "center"}
                onChange={(event) =>
                  update({
                    coverVerticalAlign: event.target
                      .value as Feature["coverVerticalAlign"],
                  })
                }
              >
                <option value="top">Top</option>
                <option value="center">Middle</option>
                <option value="bottom">Bottom</option>
              </select>
            </label>
            <label>
              Mode button
              <select
                value={feature.coverButtonMode || "click"}
                onChange={(event) =>
                  update({
                    coverButtonMode: event.target
                      .value as Feature["coverButtonMode"],
                  })
                }
              >
                <option value="click">Klik untuk membuka</option>
                <option value="slide">
                  Button slide — geser untuk membuka (Premium & Custom)
                </option>
              </select>
            </label>
            {feature.coverButtonMode === "slide" && (
              <small className="field-hint">
                Tamu menggeser tombol ke kanan untuk membuka undangan. Warna,
                radius, dan border mengikuti pengaturan button di bawah.
              </small>
            )}
            <label>
              Bentuk button
              <select
                value={feature.coverButtonShape || "rounded"}
                onChange={(event) =>
                  update({
                    coverButtonShape: event.target
                      .value as Feature["coverButtonShape"],
                  })
                }
              >
                <option value="solid">Solid</option>
                <option value="rounded">Rounded</option>
                <option value="pill">Pill</option>
                <option value="square">Kotak</option>
                <option value="outline">Outline</option>
                <option value="ghost">Ghost (tanpa border)</option>
                <option value="underline">Underline</option>
              </select>
            </label>
            <label>
              Button radius <span>{feature.coverButtonRadius ?? 12}px</span>
              <input
                type="range"
                min="0"
                max="999"
                value={feature.coverButtonRadius ?? 12}
                onChange={(event) =>
                  update({ coverButtonRadius: Number(event.target.value) })
                }
              />
            </label>
            <label>
              Border width <span>{feature.coverButtonBorderWidth ?? 1}px</span>
              <input
                type="range"
                min="0"
                max="8"
                value={feature.coverButtonBorderWidth ?? 1}
                onChange={(event) =>
                  update({ coverButtonBorderWidth: Number(event.target.value) })
                }
              />
            </label>
            <div className="two-inputs">
              <label>
                Border color
                <ColorInput value={feature.coverButtonBorderColor} fallback="#ffffff" noneValue="transparent" onChange={(next) => update({ coverButtonBorderColor: next })} />
              </label>
              <label>
                Button color
                <ColorInput value={feature.coverButtonBackground} fallback="#102f27" noneValue="transparent" onChange={(next) => update({ coverButtonBackground: next })} />
              </label>
            </div>
            <label>
              Button text
              <ColorInput value={feature.coverButtonTextColor} fallback="#ffffff" onChange={(next) => update({ coverButtonTextColor: next })} />
            </label>
            <label>
              Horizontal padding{" "}
              <span>{feature.coverButtonPaddingX ?? 30}px</span>
              <input
                type="range"
                min="8"
                max="64"
                value={feature.coverButtonPaddingX ?? 30}
                onChange={(event) =>
                  update({ coverButtonPaddingX: Number(event.target.value) })
                }
              />
            </label>
            <label>
              Vertical padding{" "}
              <span>{feature.coverButtonPaddingY ?? 15}px</span>
              <input
                type="range"
                min="6"
                max="30"
                value={feature.coverButtonPaddingY ?? 15}
                onChange={(event) =>
                  update({ coverButtonPaddingY: Number(event.target.value) })
                }
              />
            </label>
            <div className="group-heading">
              <strong>Cover Background Image</strong>
            </div>
            <label>
              Background effect
              <select
                value={feature.backgroundEffect || "none"}
                onChange={(event) =>
                  update({
                    backgroundEffect: event.target.value as BackgroundEffect,
                  })
                }
              >
                <option value="none">Original</option>
                <option value="grayscale">Black & White</option>
                <option value="sepia">Sepia</option>
                <option value="darken">Darken</option>
                <option value="soft-blur">Soft Blur</option>
                <option value="warm">Warm Tone</option>
                <option value="cool">Cool Tone</option>
                <option value="high-contrast">High Contrast</option>
              </select>
            </label>
            <label>
              Position
              <select
                value={feature.backgroundPosition || "center"}
                onChange={(event) =>
                  update({
                    backgroundPosition: event.target
                      .value as Feature["backgroundPosition"],
                  })
                }
              >
                <option value="center">Center</option>
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </label>
            <label>
              Size
              <select
                value={feature.backgroundSize || "cover"}
                onChange={(event) =>
                  update({
                    backgroundSize: event.target
                      .value as Feature["backgroundSize"],
                  })
                }
              >
                <option value="cover">Cover</option>
                <option value="contain">Contain</option>
                <option value="auto">Original size</option>
              </select>
            </label>
            <label>
              Repeat
              <select
                value={feature.backgroundRepeat || "no-repeat"}
                onChange={(event) =>
                  update({
                    backgroundRepeat: event.target
                      .value as Feature["backgroundRepeat"],
                  })
                }
              >
                <option value="no-repeat">No repeat</option>
                <option value="repeat">Repeat</option>
                <option value="repeat-x">Repeat horizontal</option>
                <option value="repeat-y">Repeat vertical</option>
              </select>
            </label>
            <label>
              Dark overlay <span>{feature.overlayOpacity ?? 45}%</span>
              <input
                type="range"
                min="0"
                max="90"
                value={feature.overlayOpacity ?? 45}
                onChange={(event) =>
                  update({ overlayOpacity: Number(event.target.value) })
                }
              />
            </label>
          </div>
        )}
        {feature.type === "gallery" && (
          <>
            <LayoutOptionPicker
              legend="Gallery layout"
              options={[
                { value: "grid", label: "Grid", hint: "Semua foto sekaligus" },
                { value: "carousel", label: "Carousel", hint: "Satu per satu, geser" },
                { value: "filmstrip", label: "Filmstrip", hint: "Gulir mendatar" },
              ]}
              value={feature.galleryStyle || "grid"}
              onSelect={(galleryStyle: GalleryStyle) => update({ galleryStyle })}
              glyph={(value) => <GalleryStyleGlyph style={value} />}
            />
            <div className="setting-row compact">
              <div>
                <Repeat2 size={16} />
                <span>
                  <strong>Autoplay carousel</strong>
                  <small>Berjalan otomatis pada live website.</small>
                </span>
              </div>
              <button
                className={`toggle ${feature.galleryAutoplay ? "on" : ""}`}
                onClick={() =>
                  update({ galleryAutoplay: !feature.galleryAutoplay })
                }
              >
                <i />
              </button>
            </div>
            <div className="setting-row compact">
              <div>
                <Monitor size={16} />
                <span>
                  <strong>Full width gallery</strong>
                  <small>Gunakan seluruh lebar viewport.</small>
                </span>
              </div>
              <button
                className={`toggle ${feature.galleryFullWidth ? "on" : ""}`}
                onClick={() =>
                  update({ galleryFullWidth: !feature.galleryFullWidth })
                }
              >
                <i />
              </button>
            </div>
            <label>
              Transition speed{" "}
              <span>{feature.galleryTransitionMs || 850}ms</span>
              <input
                type="range"
                min="300"
                max="1800"
                step="50"
                value={feature.galleryTransitionMs || 850}
                onChange={(event) =>
                  update({ galleryTransitionMs: Number(event.target.value) })
                }
              />
            </label>
          </>
        )}
        {feature.type === "image" && (
          <div className="image-style-group">
            <div className="group-heading">
              <strong>Bingkai & Posisi Gambar</strong>
            </div>
            <label>
              Bentuk bingkai
              <select
                value={feature.imageFrame || "none"}
                onChange={(event) =>
                  update({ imageFrame: event.target.value as ImageFrame })
                }
              >
                <option value="none">Tanpa bingkai</option>
                <option value="rounded">Rounded</option>
                <option value="circle">Circle</option>
                <option value="arch">Arch / Pintu</option>
                <option value="polaroid">Polaroid</option>
                <option value="leaf">Leaf</option>
                <option value="diamond">Diamond</option>
              </select>
            </label>
            <label>
              Geser horizontal <span>{feature.imageOffsetX ?? 50}%</span>
              <input
                type="range"
                min="0"
                max="100"
                value={feature.imageOffsetX ?? 50}
                onChange={(event) =>
                  update({ imageOffsetX: Number(event.target.value) })
                }
              />
            </label>
            <label>
              Geser vertikal <span>{feature.imageOffsetY ?? 50}%</span>
              <input
                type="range"
                min="0"
                max="100"
                value={feature.imageOffsetY ?? 50}
                onChange={(event) =>
                  update({ imageOffsetY: Number(event.target.value) })
                }
              />
            </label>
            <label>
              Zoom <span>{feature.imageZoom ?? 100}%</span>
              <input
                type="range"
                min="100"
                max="220"
                value={feature.imageZoom ?? 100}
                onChange={(event) =>
                  update({ imageZoom: Number(event.target.value) })
                }
              />
            </label>
            <label>
              Tinggi bingkai <span>{feature.imageHeight ?? 320}px</span>
              <input
                type="range"
                min="60"
                max="720"
                step="10"
                value={feature.imageHeight ?? 320}
                onChange={(event) =>
                  update({ imageHeight: Number(event.target.value) })
                }
              />
            </label>
          </div>
        )}
        {feature.type === "gallery" && (
          // TC-230 — Carousel & Filmstrip kini juga ada di pilihan Gallery
          // Layout Style (dulu hanya di panel lain, sehingga tidak ditemukan).
          <LayoutOptionPicker
            legend="Gallery Layout Style"
            options={[
              { value: "even", label: "Grid Standard", hint: "Kolom rata 2x2" },
              { value: "masonry", label: "Masonry View", hint: "Tinggi bervariasi" },
              { value: "hero-left", label: "Hero Kiri", hint: "Satu besar di kiri" },
              { value: "hero-top", label: "Hero Atas", hint: "Satu besar di atas" },
              { value: "mosaic", label: "Multi-Size", hint: "Mosaic campuran" },
              { value: "carousel", label: "Carousel", hint: "Satu per satu, geser" },
              { value: "filmstrip", label: "Filmstrip", hint: "Gulir mendatar" },
            ]}
            value={
              feature.galleryStyle === "carousel" ||
              feature.galleryStyle === "filmstrip"
                ? feature.galleryStyle
                : feature.galleryLayoutTemplate || "even"
            }
            onSelect={(value: string) =>
              value === "carousel" || value === "filmstrip"
                ? update({ galleryStyle: value })
                : update({
                    galleryStyle: "grid",
                    galleryLayoutTemplate: value as GalleryLayoutTemplate,
                  })
            }
            glyph={(value) =>
              value === "carousel" || value === "filmstrip" ? (
                <GalleryStyleGlyph style={value as GalleryStyle} />
              ) : (
                <GalleryLayoutGlyph layout={value as GalleryLayoutTemplate} />
              )
            }
          />
        )}
        <PerElementColorEditor feature={feature} update={update} />
        <FeatureBackgroundImageEditor
          feature={feature}
          update={update}
          uploadFeatureBackground={uploadFeatureBackground}
        />
        <FormStyleEditor feature={feature} update={update} />
        <FreePositionControls
          feature={feature}
          update={update}
          activeDevice={activeDevice}
        />
        <BoxStyle feature={feature} update={update} />
      </div>
    );

  return (
    <div className="inspector-group">
      <div className="selection-label">
        <Zap size={17} />
        <div>
          <strong>Animation Library</strong>
          <span>Advanced live preview</span>
        </div>
      </div>
      <div className="inspector-scope">
        <FeatureIcon type={feature.type} />
        <span>
          Mengatur <strong>{feature.title || feature.type}</strong>
          <small>
            Dipilih dari Content · feature {feature.type} pada Feature Library
          </small>
        </span>
      </div>
      {feature.type === "invitation-cover" && (
        <div className="opening-transition-controls">
          <div className="group-heading">
            <strong>Open Invitation Transition</strong>
            <span>Viewer interaction</span>
          </div>
          <label>
            Opening effect
            <select
              value={feature.coverExitEffect || "fade"}
              onChange={(event) =>
                update({
                  coverExitEffect: event.target.value as CoverExitEffect,
                })
              }
            >
              <option value="fade">Fade</option>
              <option value="slide-up">Slide Up</option>
              <option value="slide-down">Slide Down</option>
              <option value="slide-left">Slide Left</option>
              <option value="slide-right">Slide Right</option>
              <option value="zoom">Zoom Out</option>
              <option value="curtain">Curtain</option>
              <option value="split">Split Reveal</option>
              <option value="dissolve">Dissolve</option>
            </select>
          </label>
          <label>
            Duration <span>{feature.coverExitDuration ?? 700}ms</span>
            <input
              type="range"
              min="150"
              max="1800"
              step="50"
              value={feature.coverExitDuration ?? 700}
              onChange={(event) =>
                update({ coverExitDuration: Number(event.target.value) })
              }
            />
          </label>
          <label>
            Easing
            <select
              value={feature.coverExitEasing || "ease"}
              onChange={(event) =>
                update({
                  coverExitEasing: event.target
                    .value as Feature["coverExitEasing"],
                })
              }
            >
              <option value="ease">Ease</option>
              <option value="ease-in">Ease In</option>
              <option value="ease-out">Ease Out</option>
              <option value="ease-in-out">Ease In Out</option>
              <option value="linear">Linear</option>
            </select>
          </label>
          <div className="reduced-motion-note">
            <CircleHelp size={15} />
            <span>
              Jika device menggunakan Reduce Motion, transition otomatis
              disederhanakan.
            </span>
          </div>
        </div>
      )}
      <label>
        Entrance Effect
        <select
          value={feature.entranceEffect}
          onChange={(event) => {
            update({ entranceEffect: event.target.value });
            window.setTimeout(replay, 0);
          }}
        >
          {entranceEffects.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Transition
        <select
          value={feature.transition}
          onChange={(event) => {
            update({ transition: event.target.value });
            window.setTimeout(replay, 0);
          }}
        >
          {transitions.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Visual Effect
        <select
          value={feature.visualEffect || "none"}
          onChange={(event) => {
            update({ visualEffect: event.target.value });
            window.setTimeout(replay, 0);
          }}
        >
          {visualEffects.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Effect intensity <span>{feature.effectIntensity ?? 55}%</span>
        <input
          type="range"
          min="10"
          max="100"
          value={feature.effectIntensity ?? 55}
          onChange={(event) =>
            update({ effectIntensity: Number(event.target.value) })
          }
        />
      </label>
      <div className="animation-preview-card">
        <div
          className={`animation-preview-object fx-${feature.entranceEffect} trans-${feature.transition} effect-${feature.visualEffect || "none"}`}
          style={
            {
              "--effect-intensity": `${(feature.effectIntensity ?? 55) / 100}`,
            } as React.CSSProperties
          }
        >
          <Sparkles size={18} />
          <span>Live Motion Preview</span>
          <FeatureEffect effect={feature.visualEffect || "none"} />
        </div>
      </div>
        {/* QA TC-147 & TC-148: animasi dan looping tersedia pada panel Advanced
            untuk setiap feature, bukan hanya di tab Style. */}
      <ElementMotionControls feature={feature} update={update} />
      <LoopEffectControls
        title="Animasi Berulang (Looping)"
        hint="Menggerakkan elemen dan background feature ini terus-menerus selama undangan dibuka."
        loopEffect={feature.loopEffect}
        loopSpeed={feature.loopSpeed}
        onChange={update}
      />
      <div className="setting-row compact">
        <div>
          <MoveDown size={16} />
          <span>
            <strong>Animasi saat di-scroll</strong>
            <small>
              Entrance effect dijalankan setiap section masuk viewport, bukan
              hanya opening.
            </small>
          </span>
        </div>
        <button
          className={`toggle ${feature.animateOnScroll !== false ? "on" : ""}`}
          onClick={() =>
            update({ animateOnScroll: !(feature.animateOnScroll !== false) })
          }
        >
          <i />
        </button>
      </div>
      <button className="replay-btn" onClick={replay}>
        <Play size={15} /> Replay animation
      </button>
    </div>
  );
}

type BackgroundDesignState = {
  backgroundColor: string;
  // TC-231 — transparansi warna/gradient background dan gambar/video
  // background (0–100%; kosong = 100).
  backgroundOpacity?: number;
  backgroundImageOpacity?: number;
  backgroundGradientEnabled?: boolean;
  backgroundGradientFrom?: string;
  backgroundGradientTo?: string;
  backgroundGradientAngle?: number;
  backgroundEffect?: BackgroundEffect;
  backgroundPosition?: "center" | "top" | "bottom" | "left" | "right";
  backgroundRepeat?: "no-repeat" | "repeat" | "repeat-x" | "repeat-y";
  backgroundMotion?: BackgroundMotion;
};

function BackgroundDesignControls({
  value,
  update,
  hasImage,
  showImageOpacity,
}: {
  value: BackgroundDesignState;
  update: (patch: Partial<BackgroundDesignState>) => void;
  hasImage: boolean;
  /** Slider transparansi gambar; bawaan mengikuti hasImage. */
  showImageOpacity?: boolean;
}) {
  return (
    <div className="background-design-controls">
      <div className="group-heading">
        <strong>Background Design</strong>
        <span>{value.backgroundGradientEnabled ? "Gradient" : "Solid"}</span>
      </div>
      {/* TC-231 — transparansi: satu kontrol bersama untuk canvas & fitur. */}
      <label className="range-field">
        <span className="range-head">
          Transparansi warna background
          <b>{value.backgroundOpacity ?? 100}%</b>
        </span>
        <input
          type="range"
          min={0}
          max={100}
          value={value.backgroundOpacity ?? 100}
          onChange={(event) =>
            update({ backgroundOpacity: Number(event.target.value) })
          }
          onDoubleClick={() => update({ backgroundOpacity: undefined })}
        />
      </label>
      {(showImageOpacity ?? hasImage) && (
        <label className="range-field">
          <span className="range-head">
            Transparansi gambar/video background
            <b>{value.backgroundImageOpacity ?? 100}%</b>
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={value.backgroundImageOpacity ?? 100}
            onChange={(event) =>
              update({ backgroundImageOpacity: Number(event.target.value) })
            }
            onDoubleClick={() => update({ backgroundImageOpacity: undefined })}
          />
        </label>
      )}
      <div className="setting-row compact">
        <div>
          <Palette size={16} />
          <span>
            <strong>Enable gradient</strong>
            <small>Gunakan dua warna sebagai background.</small>
          </span>
        </div>
        <button
          className={`toggle ${value.backgroundGradientEnabled ? "on" : ""}`}
          onClick={() =>
            update({
              backgroundGradientEnabled: !value.backgroundGradientEnabled,
            })
          }
        >
          <i />
        </button>
      </div>
      {value.backgroundGradientEnabled ? (
        <>
          <div className="two-inputs">
            <label>
              From
              <ColorInput
                value={value.backgroundGradientFrom}
                fallback="#154f40"
                onChange={(next) => update({ backgroundGradientFrom: next })}
              />
            </label>
            <label>
              To
              <ColorInput value={value.backgroundGradientTo} fallback="#d7b66f" onChange={(next) => update({ backgroundGradientTo: next })} />
            </label>
          </div>
          <label>
            Gradient angle <span>{value.backgroundGradientAngle ?? 135}°</span>
            <input
              type="range"
              min="0"
              max="360"
              value={value.backgroundGradientAngle ?? 135}
              onChange={(event) =>
                update({ backgroundGradientAngle: Number(event.target.value) })
              }
            />
          </label>
          <div
            className="gradient-preview"
            style={{
              background: getGradientBackground(
                true,
                value.backgroundGradientFrom,
                value.backgroundGradientTo,
                value.backgroundGradientAngle,
                value.backgroundColor,
              ),
            }}
          />
        </>
      ) : (
        <label>
          Background color
          <ColorInput
            value={value.backgroundColor}
            onChange={(next) =>
              update({ backgroundColor: next ?? "transparent" })
            }
          />
        </label>
      )}
      {hasImage && (
        <div className="background-image-options">
          <div className="group-heading">
            <strong>Background Image</strong>
            <span>Interactive</span>
          </div>
          <label>
            Image effect
            <select
              value={value.backgroundEffect || "none"}
              onChange={(event) =>
                update({
                  backgroundEffect: event.target.value as BackgroundEffect,
                })
              }
            >
              <option value="none">Original</option>
              <option value="grayscale">Black & White</option>
              <option value="sepia">Sepia</option>
              <option value="darken">Darken</option>
              <option value="soft-blur">Soft Blur</option>
              <option value="warm">Warm Tone</option>
              <option value="cool">Cool Tone</option>
              <option value="high-contrast">High Contrast</option>
            </select>
          </label>
          <label>
            Image motion
            <select
              value={value.backgroundMotion || "none"}
              onChange={(event) =>
                update({
                  backgroundMotion: event.target.value as BackgroundMotion,
                })
              }
            >
              <option value="none">Static</option>
              <option value="zoom-in">Slow Zoom In</option>
              <option value="zoom-out">Slow Zoom Out</option>
              <option value="pan-left">Pan to Left</option>
              <option value="pan-right">Pan to Right</option>
              <option value="ken-burns">Ken Burns</option>
              <option value="float-soft">Soft Floating</option>
            </select>
          </label>
          <label>
            Position
            <select
              value={value.backgroundPosition || "center"}
              onChange={(event) =>
                update({
                  backgroundPosition: event.target
                    .value as BackgroundDesignState["backgroundPosition"],
                })
              }
            >
              <option value="center">Center</option>
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </label>
          <label>
            Repeat
            <select
              value={value.backgroundRepeat || "no-repeat"}
              onChange={(event) =>
                update({
                  backgroundRepeat: event.target
                    .value as BackgroundDesignState["backgroundRepeat"],
                })
              }
            >
              <option value="no-repeat">No repeat</option>
              <option value="repeat">Repeat both</option>
              <option value="repeat-x">Repeat horizontal</option>
              <option value="repeat-y">Repeat vertical</option>
            </select>
          </label>
        </div>
      )}
    </div>
  );
}

function BoxStyle({
  feature,
  update,
}: {
  feature: Feature;
  update: (patch: Partial<Feature>) => void;
}) {
  if (feature.type === "sound")
    return (
      <div className="layout-help">
        Sound memakai fixed player. Padding, margin, dan border radius Feature
        tidak ditampilkan karena tidak memengaruhi public player.
      </div>
    );
  if (feature.type === "invitation-cover")
    return (
      <div className="box-style">
        <label>
          Content padding <span>{feature.padding}px</span>
          <input
            type="range"
            min="0"
            max="80"
            value={feature.padding}
            onChange={(event) =>
              update({ padding: Number(event.target.value) })
            }
          />
        </label>
        <label>
          Vertical spacing <span>{feature.margin}px</span>
          <input
            type="range"
            min="0"
            max="80"
            value={feature.margin}
            onChange={(event) => update({ margin: Number(event.target.value) })}
          />
        </label>
        <div className="layout-help">
          Border radius tombol diatur melalui <strong>Button radius</strong>.
          Cover background tetap full Canvas.
        </div>
      </div>
    );
  return (
    <div className="box-style">
      <label>
        Border radius <span>{feature.borderRadius}px</span>
        <input
          type="range"
          min="0"
          max="80"
          value={feature.borderRadius}
          onChange={(event) =>
            update({ borderRadius: Number(event.target.value) })
          }
        />
      </label>
      <label>
        Padding <span>{feature.padding}px</span>
        <input
          type="range"
          min="0"
          max="80"
          value={feature.padding}
          onChange={(event) => update({ padding: Number(event.target.value) })}
        />
      </label>
      <label>
        Margin <span>{feature.margin}px</span>
        <input
          type="range"
          min="0"
          max="80"
          value={feature.margin}
          onChange={(event) => update({ margin: Number(event.target.value) })}
        />
      </label>
    </div>
  );
}

/**
 * Halaman RSVP Confirmation pada dashboard customer.
 *
 * Menggantikan Add Canvas di sisi customer: ringkasan kehadiran, daftar
 * konfirmasi per Canvas, dan ekspor CSV untuk katering/seating.
 */
function RsvpConfirmationPage({
  guests,
  sections,
  siteTitle,
  flash,
}: {
  guests: Guest[];
  sections: CanvasSection[];
  siteTitle: string;
  flash: (message: string) => void;
}) {
  const [canvasFilter, setCanvasFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const canvasName = (canvasId: string) =>
    sections.find((section) => section.id === canvasId)?.name || "Tanpa Canvas";
  const visible = guests.filter(
    (guest) =>
      (canvasFilter === "all" || guest.canvasId === canvasFilter) &&
      (statusFilter === "all" || guest.status === statusFilter),
  );
  const count = (status: Guest["status"]) =>
    guests.filter((guest) => guest.status === status).length;
  const totalPax = guests
    .filter((guest) => guest.status === "Hadir")
    .reduce((total, guest) => total + (guest.pax || 0), 0);
  const exportCsv = () => {
    if (!visible.length) {
      flash("Belum ada konfirmasi RSVP untuk diekspor.");
      return;
    }
    const escape = (value: string) => `"${String(value).replace(/"/g, '""')}"`;
    const rows = [
      "name,status,pax,canvas,waktu",
      ...visible.map((guest) =>
        [
          escape(guest.name),
          escape(guest.status),
          String(guest.pax ?? 0),
          escape(canvasName(guest.canvasId)),
          escape(guest.time || ""),
        ].join(","),
      ),
    ];
    const blob = new Blob([rows.join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `rsvp-${(siteTitle || "website").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    flash(`${visible.length} konfirmasi RSVP diekspor.`);
  };
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">RSVP CONFIRMATION</div>
          <h1>Konfirmasi kehadiran tamu</h1>
          <p>
            Rekap jawaban RSVP dari undangan Anda, lengkap dengan jumlah pax
            untuk kebutuhan katering dan seating.
          </p>
        </div>
        <button className="secondary-btn" onClick={exportCsv}>
          <Download size={16} /> Export CSV
        </button>
      </div>
      <section className="invitee-summary">
        <article>
          <CheckCircle size={20} />
          <strong>{count("Hadir")}</strong>
          <span>Hadir</span>
        </article>
        <article>
          <X size={20} />
          <strong>{count("Tidak hadir")}</strong>
          <span>Tidak hadir</span>
        </article>
        <article>
          <Clock3 size={20} />
          <strong>{count("Menunggu")}</strong>
          <span>Menunggu</span>
        </article>
        <article>
          <Users size={20} />
          <strong>{totalPax}</strong>
          <span>Total pax hadir</span>
        </article>
      </section>
      <div className="rsvp-filter-bar">
        <label>
          Canvas
          <select
            value={canvasFilter}
            onChange={(event) => setCanvasFilter(event.target.value)}
          >
            <option value="all">Semua Canvas</option>
            {sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="all">Semua status</option>
            <option value="Hadir">Hadir</option>
            <option value="Tidak hadir">Tidak hadir</option>
            <option value="Menunggu">Menunggu</option>
          </select>
        </label>
        <span className="rsvp-filter-count">{visible.length} konfirmasi</span>
      </div>
      {visible.length ? (
        <div className="rsvp-confirmation-list">
          {visible.map((guest, index) => (
            <GuestRow key={`${guest.name}-${index}`} guest={guest} index={index} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Users size={32} />
          <h2>Belum ada konfirmasi</h2>
          <p>
            Konfirmasi dari tamu akan muncul di sini begitu mereka mengisi form
            RSVP pada undangan Anda.
          </p>
        </div>
      )}
    </div>
  );
}

function InviteeManagementPage({
  sections,
  selectedSectionId,
  selectSection,
  updateSection,
  flash,
  slug = "",
}: {
  sections: CanvasSection[];
  selectedSectionId: string;
  selectSection: (section: CanvasSection) => void;
  updateSection: (sectionId: string, patch: Partial<CanvasSection>) => void;
  flash: (message: string) => void;
  slug?: string;
}) {
  const section =
    sections.find((item) => item.id === selectedSectionId) || sections[0];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const csvRef = useRef<HTMLInputElement>(null);
  if (!section)
    return (
      <div className="invitee-page empty-state">
        <Users size={34} />
        <h2>Belum ada Canvas</h2>
        <p>Buat Canvas terlebih dahulu untuk menambahkan daftar undangan.</p>
      </div>
    );
  const add = () => {
    if (!name.trim()) return;
    updateSection(section.id, {
      invitees: [
        ...section.invitees,
        {
          id: uid("invitee"),
          name: name.trim(),
          email: email.trim(),
          phone: "",
          city: "",
        },
      ],
    });
    setName("");
    setEmail("");
    flash("Undangan ditambahkan ke Canvas.");
  };
  const importCsv = async (file?: File) => {
    if (!file) return;
    const rows = (await file.text()).split(/\r?\n/).filter(Boolean);
    if (rows.length < 2) return;
    const headers = rows[0].split(",").map((item) => item.trim().toLowerCase());
    const at = (key: string) => headers.indexOf(key);
    if (at("name") < 0) {
      flash("CSV wajib memiliki header name,email,phone,city.");
      return;
    }
    const imported = rows
      .slice(1)
      .map((row) => {
        const values = row
          .split(",")
          .map((value) => value.trim().replace(/^"|"$/g, ""));
        return {
          id: uid("invitee"),
          name: values[at("name")] || "",
          email: at("email") >= 0 ? values[at("email")] || "" : "",
          phone: at("phone") >= 0 ? values[at("phone")] || "" : "",
          city: at("city") >= 0 ? values[at("city")] || "" : "",
        };
      })
      .filter((item) => item.name);
    updateSection(section.id, { invitees: [...section.invitees, ...imported] });
    flash(`${imported.length} undangan berhasil diimpor.`);
  };
  const saveCsv = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };
  const download = () =>
    saveCsv(
      "format-list-undangan.csv",
      "name,email,phone,city\nAdi Pratama,adi@example.com,08123456789,Jakarta",
    );
  // Ekspor daftar tamu yang sebenarnya — sebelumnya hanya tersedia unduhan
  // format kosong, jadi daftar yang sudah diisi tidak bisa dibawa keluar.
  const exportCsv = () => {
    if (!section.invitees.length) {
      flash("Belum ada undangan pada Canvas ini untuk diekspor.");
      return;
    }
    const escape = (value: string) => `"${String(value || "").replace(/"/g, '""')}"`;
    const rows = [
      "name,email,phone,city",
      ...section.invitees.map((invitee) =>
        [invitee.name, invitee.email, invitee.phone, invitee.city]
          .map(escape)
          .join(","),
      ),
    ];
    const safeName = (section.name || "canvas")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");
    saveCsv(`list-undangan-${safeName}.csv`, rows.join("\n"));
    flash(`${section.invitees.length} undangan diekspor.`);
  };
  return (
    <div className="invitee-page">
      <header>
        <div>
          <span>LIST UNDANGAN</span>
          <h2>Guest management per Canvas</h2>
          <p>
            Daftar ini digunakan untuk personalisasi Buka Undangan dan pelacakan
            RSVP.
          </p>
        </div>
        <label>
          Canvas
          <select
            value={section.id}
            onChange={(event) => {
              const next = sections.find(
                (item) => item.id === event.target.value,
              );
              if (next) selectSection(next);
            }}
          >
            {sections.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </header>
      <section className="invitee-summary">
        <article>
          <Users size={20} />
          <strong>{section.invitees.length}</strong>
          <span>Total undangan</span>
        </article>
        <article>
          <MailOpen size={20} />
          <strong>
            {section.invitees.filter((item) => item.email).length}
          </strong>
          <span>Memiliki email</span>
        </article>
        <article>
          <MapPin size={20} />
          <strong>
            {
              new Set(section.invitees.map((item) => item.city).filter(Boolean))
                .size
            }
          </strong>
          <span>Kota</span>
        </article>
      </section>
      <section className="invitee-editor-card">
        <div className="invitee-create-row">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Nama undangan"
          />
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email (opsional)"
          />
          <button onClick={add}>
            <UserPlus size={15} />
            Add
          </button>
        </div>
        <input
          ref={csvRef}
          hidden
          type="file"
          onClick={resetFileInput}
          accept=".csv,text/csv"
          onChange={(event) => void importCsv(event.target.files?.[0])}
        />
        <div className="csv-actions">
          <button onClick={() => csvRef.current?.click()}>
            <Upload size={14} />
            Import CSV
          </button>
          <button onClick={exportCsv}>
            <Download size={14} />
            Export CSV
          </button>
          <button onClick={download}>
            <FileText size={14} />
            Download Format
          </button>
        </div>
        <div className="invitee-link-note">
          <Link2 size={15} />
          <p>
            <strong>Setiap tamu memiliki link personal.</strong> Link dibentuk
            dari alamat website ditambah parameter <code>?to=</code> berisi nama
            tamu, sehingga nama pada Buka Undangan menyesuaikan penerima.
          </p>
        </div>
        <div className="invitee-table with-link">
          <div className="invitee-table-head">
            <span>Name</span>
            <span>Email</span>
            <span>Phone</span>
            <span>Link personal</span>
            <span />
          </div>
          {section.invitees.map((item) => {
            const personalLink = buildGuestLink(slug, item.name);
            return (
              <div key={item.id}>
                <strong>{item.name}</strong>
                <span>{item.email || "—"}</span>
                <span>{item.phone || "—"}</span>
                <div className="invitee-link-cell">
                  <input
                    readOnly
                    value={personalLink}
                    onFocus={(event) => event.currentTarget.select()}
                  />
                  <button
                    title="Salin link"
                    onClick={() => {
                      void navigator.clipboard?.writeText(personalLink);
                      flash(`Link undangan untuk ${item.name} disalin.`);
                    }}
                  >
                    <Copy size={13} />
                  </button>
                  <a
                    title="Kirim via WhatsApp"
                    href={`https://wa.me/${item.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Kepada Yth. ${item.name}, kami mengundang Anda. Buka undangan: ${personalLink}`)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Send size={13} />
                  </a>
                  <a
                    title="Buka link"
                    href={personalLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExternalLink size={13} />
                  </a>
                </div>
                <button
                  onClick={() =>
                    updateSection(section.id, {
                      invitees: section.invitees.filter(
                        (value) => value.id !== item.id,
                      ),
                    })
                  }
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
          {!section.invitees.length && (
            <div className="invitee-empty">
              Belum ada undangan pada Canvas ini.
            </div>
          )}
        </div>
        <div className="invitee-bulk-actions">
          <button
            onClick={() => {
              const lines = section.invitees
                .map(
                  (item) => `${item.name},${buildGuestLink(slug, item.name)}`,
                )
                .join("\n");
              const blob = new Blob([`name,link\n${lines}`], {
                type: "text/csv",
              });
              const link = document.createElement("a");
              link.href = URL.createObjectURL(blob);
              link.download = "link-undangan-personal.csv";
              link.click();
              URL.revokeObjectURL(link.href);
              flash("Semua link personal diekspor ke CSV.");
            }}
            disabled={!section.invitees.length}
          >
            <Download size={14} />
            Export semua link (CSV)
          </button>
          <button
            onClick={() => {
              void navigator.clipboard?.writeText(
                section.invitees
                  .map(
                    (item) =>
                      `${item.name}: ${buildGuestLink(slug, item.name)}`,
                  )
                  .join("\n"),
              );
              flash("Semua link personal disalin.");
            }}
            disabled={!section.invitees.length}
          >
            <Copy size={14} />
            Salin semua link
          </button>
        </div>
      </section>
    </div>
  );
}



// Ornamen dekoratif digambar sebagai SVG inline agar tidak bergantung pada aset
// eksternal dan bebas masalah lisensi.
function DecorGlyphIcon({ glyph }: { glyph: DecorGlyph }) {
  const base = {
    viewBox: "0 0 100 100",
    width: "100%",
    height: "100%",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (glyph) {
    case "branch":
      return (
        <svg {...base}>
          <path d="M6 94C22 76 38 56 52 32 60 18 68 10 82 6" />
          <path d="M52 32c-8-6-10-16-6-24M52 32c9-2 16 2 20 10M36 54c-9-5-12-15-9-24M36 54c9-1 15 4 18 12M20 74c-9-4-13-13-11-22M20 74c9 0 15 5 17 13" />
        </svg>
      );
    case "floral":
      return (
        <svg {...base}>
          <circle cx="50" cy="50" r="9" />
          <path d="M50 41c0-13 5-23 13-23s10 12 0 20M59 50c13 0 23 5 23 13s-12 10-20 0M50 59c0 13-5 23-13 23s-10-12 0-20M41 50c-13 0-23-5-23-13s12-10 20 0" />
        </svg>
      );
    case "rose":
      return (
        <svg {...base}>
          <path d="M50 26c12 0 21 9 21 21s-9 21-21 21-21-9-21-21" />
          <path d="M50 36c7 0 12 5 12 12s-5 11-12 11-11-5-11-11" />
          <path d="M50 45c3 0 5 2 5 4" />
          <path d="M50 68v20M50 78c-8 0-13-5-14-12M50 84c8-1 13-6 13-13" />
        </svg>
      );
    case "sparkle":
      return (
        <svg {...base}>
          <path d="M50 14l7 24 24 7-24 7-7 24-7-24-24-7 24-7z" />
          <path d="M78 66l3 9 9 3-9 3-3 9-3-9-9-3 9-3zM20 20l2 7 7 2-7 2-2 7-2-7-7-2 7-2z" />
        </svg>
      );
    case "ring":
      return (
        <svg {...base}>
          <circle cx="38" cy="62" r="22" />
          <circle cx="64" cy="62" r="22" />
          <path d="M52 22l8-12 8 12" />
        </svg>
      );
    case "heart":
      return (
        <svg {...base}>
          <path d="M50 84S16 62 16 40a17 17 0 0 1 34-7 17 17 0 0 1 34 7c0 22-34 44-34 44Z" />
        </svg>
      );
    case "butterfly":
      return (
        <svg {...base}>
          <path d="M50 30v42M50 34c-6-14-20-22-30-16S12 44 26 52c8 5 18 7 24 4M50 34c6-14 20-22 30-16s8 26-6 34c-8 5-18 7-24 4" />
          <path d="M50 26l-5-8M50 26l5-8" />
        </svg>
      );
    case "feather":
      return (
        <svg {...base}>
          <path d="M22 84C36 62 46 40 70 18c8 22 2 44-14 56-9 7-22 10-34 10Z" />
          <path d="M22 84 62 34" />
        </svg>
      );
    case "arch":
      return (
        <svg {...base}>
          <path d="M18 90V48a32 32 0 0 1 64 0v42" />
          <path d="M30 90V50a20 20 0 0 1 40 0v40" />
        </svg>
      );
    default:
      return (
        <svg {...base}>
          <path d="M50 88C50 58 62 34 88 20 84 54 70 76 50 88Z" />
          <path d="M50 88C50 58 38 34 12 20c4 34 18 56 38 68Z" />
          <path d="M50 88V44" />
        </svg>
      );
  }
}

const decorGlyphCatalog: [DecorGlyph, string][] = [
  ["leaf", "Daun"],
  ["branch", "Ranting"],
  ["floral", "Bunga"],
  ["rose", "Mawar"],
  ["sparkle", "Kilau"],
  ["ring", "Cincin"],
  ["heart", "Hati"],
  ["butterfly", "Kupu-kupu"],
  ["feather", "Bulu"],
  ["arch", "Arch"],
];
const loopEffectCatalog: [LoopEffect, string][] = [
  ["none", "Tidak ada"],
  ["fade", "Fade in-out"],
  ["float", "Mengambang"],
  ["sway", "Bergoyang"],
  ["pulse", "Berdenyut"],
  ["shimmer", "Berkilau"],
  ["drift", "Melayang"],
];

/** TC-239 — live motion untuk elemen layer 2: image, box/kolom putih,
 *  header, dan text masing-masing bisa diberi gerakan berulang sendiri. */
const elementMotionTargets: [ElementMotionTarget, string][] = [
  ["image", "Image"],
  ["box", "Box / kolom putih"],
  ["title", "Header"],
  ["body", "Text"],
];
function elementMotionClasses(feature: Feature) {
  const motion = feature.elementMotion || {};
  return elementMotionTargets
    .map(([target]) => motion[target])
    .some((value) => value && value !== "none")
    ? elementMotionTargets
        .filter(([target]) => motion[target] && motion[target] !== "none")
        .map(([target]) => `lm-${target}-${motion[target]}`)
        .join(" ")
    : "";
}
function ElementMotionControls({
  feature,
  update,
}: {
  feature: Feature;
  update: (patch: Partial<Feature>) => void;
}) {
  const motion = feature.elementMotion || {};
  const anyActive = Object.values(motion).some(
    (value) => value && value !== "none",
  );
  return (
    <div className="loop-effect-controls element-motion-controls">
      <div className="group-heading">
        <strong>Live Motion Elemen (Layer 2)</strong>
      </div>
      <div className="layout-help">
        Gerakkan elemen di atas background secara terpisah — gambar,
        kotak/kolom putih, header, atau teks — tanpa ikut menggerakkan
        background Layer 1.
      </div>
      {elementMotionTargets.map(([target, label]) => (
        <label key={target}>
          {label}
          <select
            value={motion[target] || "none"}
            onChange={(event) =>
              update({
                elementMotion: {
                  ...motion,
                  [target]: event.target.value as LoopEffect,
                },
              })
            }
          >
            {loopEffectCatalog.map(([value, text]) => (
              <option key={value} value={value}>
                {text}
              </option>
            ))}
          </select>
        </label>
      ))}
      {anyActive && (
        <label className="range-field">
          <span className="range-head">
            Durasi siklus<b>{feature.elementMotionSpeed || 6}s</b>
          </span>
          <input
            type="range"
            min="2"
            max="20"
            value={feature.elementMotionSpeed || 6}
            onChange={(event) =>
              update({ elementMotionSpeed: Number(event.target.value) })
            }
          />
          <span className="range-scale">
            <span>2s · paling cepat</span>
            <span>20s · paling lambat</span>
          </span>
        </label>
      )}
    </div>
  );
}

// Kontrol efek berulang pada feature.
function LoopEffectControls({
  loopEffect,
  loopSpeed,
  onChange,
  title,
  hint,
}: {
  loopEffect?: LoopEffect;
  loopSpeed?: number;
  onChange: (patch: { loopEffect?: LoopEffect; loopSpeed?: number }) => void;
  title: string;
  hint: string;
}) {
  const active = loopEffect || "none";
  return (
    <div className="loop-effect-controls">
      <div className="group-heading">
        <strong>{title}</strong>
      </div>
      <div className="layout-help">{hint}</div>
      <label>
        Efek
        <select
          value={active}
          onChange={(event) =>
            onChange({ loopEffect: event.target.value as LoopEffect })
          }
        >
          {loopEffectCatalog.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      {active !== "none" && (
        <label className="range-field">
          {/* Nilai besar = satu siklus lebih lama = gerakan lebih LAMBAT.
              Tanpa keterangan arah, slider digeser ke kanan karena dikira
              "lebih banyak", lalu pada 20s gerakannya nyaris tak terlihat
              dan efeknya dikira tidak berfungsi. */}
          <span className="range-head">
            Durasi siklus<b>{loopSpeed || 6}s</b>
          </span>
          <input
            type="range"
            min="2"
            max="20"
            value={loopSpeed || 6}
            onChange={(event) =>
              onChange({ loopSpeed: Number(event.target.value) })
            }
          />
          <span className="range-scale">
            <span>2s · paling cepat</span>
            <span>20s · paling lambat</span>
          </span>
        </label>
      )}
    </div>
  );
}

// Editor ornamen pojok pada section.
function SectionDecorationEditor({
  section,
  updateLive,
  uploadLayerImage,
}: {
  section: CanvasSection;
  updateLive: (
    produce: (current: CanvasSection) => Partial<CanvasSection>,
  ) => void;
  uploadLayerImage: (
    file: File | undefined,
  ) => Promise<{ url: string; key: string } | null>;
}) {
  const items = section.decorations || [];
  // `produce` menerima section terbaru, jadi callback yang selesai belakangan
  // (upload gambar) tidak lagi menimpa perubahan di sela-selanya.
  const commit = (
    produce: (current: SectionDecoration[]) => SectionDecoration[],
  ) => updateLive((current) => ({ decorations: produce(current.decorations || []) }));
  const patch = (id: string, next: Partial<SectionDecoration>) =>
    commit((current) =>
      current.map((item) => (item.id === id ? { ...item, ...next } : item)),
    );
  return (
    <div className="decoration-editor">
      <div className="group-heading">
        <strong>Ornamen</strong>
        <button
          onClick={() =>
            commit((current) => [
              ...current,
              {
                id: uid("decor"),
                glyph: "floral",
                corner: "top-right",
                size: 140,
                color: "#7d9e86",
                opacity: 70,
                motion: "sway",
                speed: 7,
              },
            ])
          }
        >
          <Plus size={14} /> Tambah ornamen
        </button>
      </div>
      <div className="layout-help">
        Ornamen ditempel di pojok atau di tengah sisi section dan bergerak
        terus-menerus. Posisinya tetap menempel ke titik tambat itu berapa pun
        ukurannya; gunakan <strong>Geser X/Y</strong> untuk menggesernya sedikit.
      </div>
      {items.map((item, index) => (
        <div className="extra-text-row" key={item.id}>
          <div className="form-spec-head">
            <span>Ornamen {index + 1}</span>
            <div className="decor-head-actions">
              {/* TC-209 — duplikat: gambar & seluruh pengaturannya ikut, jadi
                  Web Designer tidak perlu mengunggah ulang untuk pojok lain. */}
              <button
                title="Duplikat ornamen ini"
                aria-label={`Duplikat ornamen ${index + 1}`}
                onClick={() =>
                  commit((current) => {
                    const at = current.findIndex((value) => value.id === item.id);
                    const copy = { ...current[at], id: uid("decor") };
                    return [
                      ...current.slice(0, at + 1),
                      copy,
                      ...current.slice(at + 1),
                    ];
                  })
                }
              >
                <Copy size={12} />
              </button>
              <button
                title="Hapus ornamen ini"
                aria-label={`Hapus ornamen ${index + 1}`}
                onClick={() =>
                  commit((current) =>
                    current.filter((value) => value.id !== item.id),
                  )
                }
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
          <div className="decor-preview" style={{ color: item.color }}>
            {item.imageUrl ? (
              <img src={assetUrl(item.imageUrl)} alt="" />
            ) : (
              <DecorGlyphIcon glyph={item.glyph} />
            )}
          </div>
          {/* Ornamen bisa memakai gambar sendiri, bukan hanya bentuk bawaan. */}
          <LayerImageUpload
            // url dulu dikosongkan paksa, sehingga thumbnail di kontrol upload
            // tidak pernah muncul walau gambarnya sudah terunggah.
            layer={{ id: item.id, url: item.imageUrl || "" } as BackgroundLayer}
            uploadLayerImage={uploadLayerImage}
            onUploaded={(saved) =>
              patch(item.id, { imageUrl: saved.url, imageKey: saved.key })
            }
          />
          {item.imageUrl && (
            <button
              className="secondary-btn"
              onClick={() => patch(item.id, { imageUrl: "", imageKey: "" })}
            >
              Kembali ke bentuk bawaan
            </button>
          )}
          <div className="two-inputs">
            <label>
              Bentuk
              <select
                value={item.glyph}
                disabled={Boolean(item.imageUrl)}
                title={
                  item.imageUrl
                    ? "Ornamen memakai gambar sendiri. Hapus gambar untuk memilih bentuk bawaan."
                    : undefined
                }
                onChange={(event) =>
                  patch(item.id, { glyph: event.target.value as DecorGlyph })
                }
              >
                {decorGlyphCatalog.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Posisi
              <select
                value={item.corner}
                onChange={(event) =>
                  patch(item.id, {
                    corner: event.target.value as DecorCorner,
                    // Geseran lama mengacu ke titik tambat lama; dibawa ke
                    // titik tambat baru hasilnya terasa acak.
                    offsetX: 0,
                    offsetY: 0,
                  })
                }
              >
                <optgroup label="Pojok">
                  <option value="top-left">Kiri atas</option>
                  <option value="top-right">Kanan atas</option>
                  <option value="bottom-left">Kiri bawah</option>
                  <option value="bottom-right">Kanan bawah</option>
                </optgroup>
                <optgroup label="Tengah sisi">
                  <option value="top-center">Atas tengah</option>
                  <option value="bottom-center">Bawah tengah</option>
                  <option value="middle-left">Kiri tengah</option>
                  <option value="middle-right">Kanan tengah</option>
                </optgroup>
              </select>
            </label>
          </div>
          <div className="two-inputs">
            <label className="range-field">
              <span className="range-head">
                Ukuran<b>{item.size}px</b>
              </span>
              <input
                type="range"
                min="60"
                max="420"
                step="10"
                value={item.size}
                onChange={(event) =>
                  patch(item.id, { size: Number(event.target.value) })
                }
              />
            </label>
            <label className="range-field">
              <span className="range-head">
                Opacity<b>{item.opacity}%</b>
              </span>
              <input
                type="range"
                min="5"
                max="100"
                value={item.opacity}
                onChange={(event) =>
                  patch(item.id, { opacity: Number(event.target.value) })
                }
              />
            </label>
          </div>
          <div className="two-inputs">
            <label>
              Warna
              <ColorInput value={item.color} fallback="#ffffff" noneValue="transparent" onChange={(next) => patch(item.id, { color: next })} />
            </label>
            <label>
              Gerak
              <select
                value={item.motion}
                onChange={(event) =>
                  patch(item.id, { motion: event.target.value as LoopEffect })
                }
              >
                {loopEffectCatalog.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {/* TC-206 — ornamen tidak lagi terkunci di titik tambatnya. */}
          <div className="two-inputs">
            <label className="range-field">
              <span className="range-head">
                Geser X<b>{item.offsetX ?? 0}px</b>
              </span>
              <input
                type="range"
                min="-200"
                max="200"
                step="1"
                value={item.offsetX ?? 0}
                onChange={(event) =>
                  patch(item.id, { offsetX: Number(event.target.value) })
                }
                onDoubleClick={() => patch(item.id, { offsetX: 0 })}
              />
            </label>
            <label className="range-field">
              <span className="range-head">
                Geser Y<b>{item.offsetY ?? 0}px</b>
              </span>
              <input
                type="range"
                min="-200"
                max="200"
                step="1"
                value={item.offsetY ?? 0}
                onChange={(event) =>
                  patch(item.id, { offsetY: Number(event.target.value) })
                }
                onDoubleClick={() => patch(item.id, { offsetY: 0 })}
              />
            </label>
          </div>
          {/* TC-186 — ornamen dekoratif perlu bisa diputar mengikuti sudut
              layout, bukan hanya dicerminkan. */}
          <label className="range-field">
            <span className="range-head">
              Rotasi<b>{item.rotation ?? 0}&deg;</b>
            </span>
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={item.rotation ?? 0}
              onChange={(event) =>
                patch(item.id, { rotation: Number(event.target.value) })
              }
              onDoubleClick={() => patch(item.id, { rotation: 0 })}
            />
          </label>
          <label className="range-field">
            <span className="range-head">
              Durasi siklus<b>{item.speed || 7}s</b>
            </span>
            <input
              type="range"
              min="2"
              max="20"
              value={item.speed || 7}
              onChange={(event) =>
                patch(item.id, { speed: Number(event.target.value) })
              }
            />
          </label>
          <label className="checkbox-row">
            <span>Cermin horizontal</span>
            <input
              type="checkbox"
              checked={!!item.flip}
              onChange={(event) => patch(item.id, { flip: event.target.checked })}
            />
          </label>
        </div>
      ))}
      {!items.length && (
        <div className="layout-help">Belum ada ornamen pada section ini.</div>
      )}
    </div>
  );
}

// QA TC-146 — mode background global: seluruh canvas memakai background canvas
// pertama, sehingga Web Designer tidak perlu upload ulang tiap menambah canvas.
/**
 * TC-197 — section dalam mode Background tetap: background bersama dilukis
 * oleh FixedBackdrop, jadi section melepas latar & gambar utamanya. Layer dan
 * ornamen miliknya sendiri tetap, kecuali milik Canvas 1 — itu sudah menjadi
 * bagian backdrop dan tidak boleh tampil dua kali.
 */
function withoutSharedBackdrop(
  section: CanvasSection,
  isSource: boolean,
): CanvasSection {
  return {
    ...section,
    backgroundColor: "transparent",
    backgroundGradientEnabled: false,
    backgroundUrl: undefined,
    backgroundVideoUrl: undefined,
    backgroundFixed: false,
    backgroundLayers: isSource ? [] : section.backgroundLayers,
  };
}

/** Satu lapisan background diam untuk seluruh undangan (TC-197). */
function FixedBackdrop({
  source,
  viewportHeight,
}: {
  source: CanvasSection;
  viewportHeight: number;
}) {
  const filter = getBackgroundFilter(source.backgroundEffect);
  return (
    <div
      className="site-fixed-backdrop"
      aria-hidden
      style={
        {
          background: getGradientBackground(
            source.backgroundGradientEnabled,
            source.backgroundGradientFrom,
            source.backgroundGradientTo,
            source.backgroundGradientAngle,
            source.backgroundColor,
          ),
          ...(viewportHeight
            ? { "--site-viewport-h": `${viewportHeight}px` }
            : {}),
        } as React.CSSProperties
      }
    >
      <div
        className={`background-layer ${getBackgroundMotionClass(source.backgroundMotion)}`}
        style={{
          backgroundImage: source.backgroundUrl
            ? `url(${assetUrl(source.backgroundUrl)})`
            : undefined,
          backgroundPosition: source.backgroundPosition,
          backgroundRepeat: source.backgroundRepeat,
          backgroundSize:
            source.backgroundSize ||
            (source.backgroundRepeat === "no-repeat" ? "cover" : "auto"),
          filter,
        }}
      />
      {source.backgroundVideoUrl && (
        <video
          className="background-video-layer"
          src={assetUrl(source.backgroundVideoUrl)}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          style={{ filter }}
        />
      )}
      {(source.backgroundLayers || []).map((layer, layerIndex) => (
        <div
          key={layer.id}
          className="background-extra-layer"
          style={{
            backgroundImage: layer.url
              ? `url(${assetUrl(layer.url)})`
              : undefined,
            backgroundSize: layer.size,
            backgroundPosition: `${layer.offsetX ?? 50}% ${layer.offsetY ?? 50}%`,
            backgroundRepeat: layer.repeat,
            opacity: (layer.opacity ?? 100) / 100,
            mixBlendMode:
              (layer.blend as React.CSSProperties["mixBlendMode"]) || "normal",
            transform:
              layer.scale && layer.scale !== 100
                ? `scale(${layer.scale / 100})`
                : undefined,
            zIndex: Math.min(1 + layerIndex, 3),
          }}
        />
      ))}
    </div>
  );
}

function applyGlobalBackground(
  section: CanvasSection,
  source: CanvasSection | null,
): CanvasSection {
  if (!source || source.id === section.id) return section;
  return {
    ...section,
    backgroundColor: source.backgroundColor,
    backgroundUrl: source.backgroundUrl,
    backgroundKey: source.backgroundKey,
    backgroundVideoUrl: source.backgroundVideoUrl,
    backgroundVideoKey: source.backgroundVideoKey,
    backgroundEffect: source.backgroundEffect,
    backgroundPosition: source.backgroundPosition,
    backgroundRepeat: source.backgroundRepeat,
    backgroundSize: source.backgroundSize,
    backgroundGradientEnabled: source.backgroundGradientEnabled,
    backgroundGradientFrom: source.backgroundGradientFrom,
    backgroundGradientTo: source.backgroundGradientTo,
    backgroundGradientAngle: source.backgroundGradientAngle,
    backgroundMotion: source.backgroundMotion,
    // TC-197 — "Background Utama" per canvas berdiri DI ATAS background
    // global. Layer Canvas 1 digambar lebih dulu, lalu layer milik canvas ini
    // menumpuk di atasnya. Dulu layer canvas ini dibuang total, sehingga
    // layer yang ditambahkan di Canvas 2+ tersimpan tapi tidak pernah tampil.
    backgroundLayers: [
      ...(source.backgroundLayers || []),
      ...(section.backgroundLayers || []),
    ],
    // Layer milik canvas ini digabung dengan layer global (lihat
    // backgroundLayers di atas), jadi canvas ini memang boleh punya lapisan
    // sendiri — dan karenanya boleh punya animasinya sendiri. Dulu nilai
    // global SELALU menang: efek yang dipilih di Canvas 2+ tersimpan dan
    // tampil di panel Advanced, tetapi renderer membacanya dari Canvas 1
    // yang biasanya "Tidak ada", sehingga animasinya tidak pernah jalan dan
    // kontrolnya terlihat rusak. Nilai canvas ini menang bila diisi.
    backgroundLoopEffect:
      section.backgroundLoopEffect && section.backgroundLoopEffect !== "none"
        ? section.backgroundLoopEffect
        : source.backgroundLoopEffect,
    backgroundLoopSpeed:
      section.backgroundLoopEffect && section.backgroundLoopEffect !== "none"
        ? section.backgroundLoopSpeed
        : source.backgroundLoopSpeed,
    // Tipe scroll global: parallax mengunci background ke viewport,
    // "section" membuat tiap canvas menggulung bersama isinya.
    backgroundFixed: source.backgroundScrollType === "parallax",
  };
}

// QA TC-141 — preset bentuk button "Buka Undangan".
function coverButtonStyle(feature: Feature): React.CSSProperties {
  const shape = feature.coverButtonShape || "rounded";
  const background = feature.coverButtonBackground || "#102f27";
  const text = feature.coverButtonTextColor || "#fff";
  const border = feature.coverButtonBorderColor || "#fff";
  const padding = `${feature.coverButtonPaddingY ?? 15}px ${feature.coverButtonPaddingX ?? 30}px`;
  const radius: Record<string, number | string> = {
    solid: feature.coverButtonRadius ?? 12,
    rounded: feature.coverButtonRadius ?? 12,
    pill: 999,
    square: 0,
    outline: feature.coverButtonRadius ?? 12,
    ghost: feature.coverButtonRadius ?? 12,
    underline: 0,
  };
  const base: React.CSSProperties = {
    borderRadius: radius[shape],
    borderStyle: "solid",
    borderWidth: feature.coverButtonBorderWidth ?? 1,
    borderColor: border,
    background,
    color: text,
    padding,
  };
  if (shape === "outline")
    return {
      ...base,
      background: "transparent",
      color: feature.coverButtonTextColor || border,
      borderWidth: Math.max(1, feature.coverButtonBorderWidth ?? 1),
    };
  if (shape === "ghost")
    return {
      ...base,
      background: "transparent",
      borderWidth: 0,
      color: feature.coverButtonTextColor || border,
    };
  if (shape === "underline")
    return {
      ...base,
      background: "transparent",
      borderWidth: 0,
      borderBottomWidth: Math.max(1, feature.coverButtonBorderWidth ?? 2),
      borderBottomStyle: "solid",
      color: feature.coverButtonTextColor || border,
      padding: `${feature.coverButtonPaddingY ?? 10}px 2px`,
    };
  return base;
}

// QA TC-108 & TC-127 — layer background tambahan di atas background utama.
function LayerImageUpload({
  layer,
  onUploaded,
  uploadLayerImage,
}: {
  layer: BackgroundLayer;
  onUploaded: (saved: { url: string; key: string }) => void;
  uploadLayerImage: (
    file: File | undefined,
  ) => Promise<{ url: string; key: string } | null>;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  return (
    <div className="layer-upload">
      <input
        ref={input}
        hidden
        type="file"
        accept="image/*"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (!file) return;
          setBusy(true);
          const saved = await uploadLayerImage(file);
          setBusy(false);
          if (saved) onUploaded(saved);
        }}
      />
      <button
        className="upload-control"
        disabled={busy}
        onClick={() => input.current?.click()}
      >
        <Upload size={16} />
        <span>
          <strong>{busy ? "Mengunggah..." : "Upload gambar layer"}</strong>
          <small>Ambil dari komputer, maksimal 2 MB.</small>
        </span>
      </button>
      {layer.url && (
        <div className="layer-thumb">
          <img src={assetUrl(layer.url)} alt="Preview layer" />
        </div>
      )}
    </div>
  );
}

/**
 * Pad geser 2D untuk layer background.
 *
 * Menampilkan thumbnail layer dan sebuah titik yang bisa ditarik; posisi titik
 * dipetakan langsung ke background-position (offsetX / offsetY dalam persen),
 * jadi apa yang terlihat di pad sama dengan hasil di canvas.
 */
function LayerOffsetPad({
  previewUrl,
  size,
  repeat,
  offsetX,
  offsetY,
  onChange,
}: {
  previewUrl?: string;
  size?: string;
  repeat?: string;
  offsetX: number;
  offsetY: number;
  onChange: (offsetX: number, offsetY: number) => void;
}) {
  const padRef = useRef<HTMLDivElement>(null);
  const applyFromPointer = (clientX: number, clientY: number) => {
    const rect = padRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return;
    const clamp = (value: number) => Math.round(Math.min(100, Math.max(0, value)));
    onChange(
      clamp(((clientX - rect.left) / rect.width) * 100),
      clamp(((clientY - rect.top) / rect.height) * 100),
    );
  };
  const start = (event: React.PointerEvent) => {
    event.preventDefault();
    applyFromPointer(event.clientX, event.clientY);
    const move = (e: PointerEvent) => applyFromPointer(e.clientX, e.clientY);
    const end = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
  };
  return (
    <div className="layer-offset-pad-wrap">
      <span className="range-head">
        Geser bebas
        <b>
          {offsetX}% · {offsetY}%
        </b>
      </span>
      <div
        ref={padRef}
        className="layer-offset-pad"
        onPointerDown={start}
        onDoubleClick={() => onChange(50, 50)}
        role="application"
        aria-label="Geser posisi layer"
        style={
          previewUrl
            ? {
                backgroundImage: `url(${assetUrl(previewUrl)})`,
                backgroundSize: size || "cover",
                backgroundRepeat: repeat || "no-repeat",
                backgroundPosition: `${offsetX}% ${offsetY}%`,
              }
            : undefined
        }
      >
        <span
          className="layer-offset-dot"
          style={{ left: `${offsetX}%`, top: `${offsetY}%` }}
        />
      </div>
      <p className="layout-help">
        Tarik titik untuk menggeser layer. Klik dua kali untuk kembali ke
        tengah.
      </p>
    </div>
  );
}

function BackgroundLayerEditor({
  section,
  updateLive,
  uploadLayerImage,
  locked = false,
}: {
  section: CanvasSection;
  updateLive: (
    produce: (current: CanvasSection) => Partial<CanvasSection>,
  ) => void;
  uploadLayerImage: (
    file: File | undefined,
  ) => Promise<{ url: string; key: string } | null>;
  /** Background global aktif dan ini bukan Canvas 1. */
  locked?: boolean;
}) {
  const layers = section.backgroundLayers || [];
  const activeLoop =
    section.backgroundLoopEffect && section.backgroundLoopEffect !== "none"
      ? section.backgroundLoopEffect
      : null;
  const activeLoopLabel = activeLoop
    ? loopEffectCatalog.find(([value]) => value === activeLoop)?.[1] ||
      activeLoop
    : "";
  const loopMovesLayer = activeLoop
    ? ["float", "sway", "pulse", "drift"].includes(activeLoop)
    : false;
  const commit = (
    produce: (current: BackgroundLayer[]) => BackgroundLayer[],
  ) =>
    updateLive((current) => ({
      backgroundLayers: produce(current.backgroundLayers || []),
    }));
  const patch = (id: string, next: Partial<BackgroundLayer>) =>
    commit((current) =>
      current.map((item) => (item.id === id ? { ...item, ...next } : item)),
    );
  return (
    <div className="background-layer-editor">
      <div className="group-heading">
        <strong>Layer 2 dan seterusnya</strong>
        <button
          onClick={() =>
            commit((current) => [
              ...current,
              {
                id: uid("bglayer"),
                url: "",
                opacity: 100,
                size: "cover",
                position: "center",
                repeat: "no-repeat",
                fixed: false,
                offsetX: 50,
                offsetY: 50,
                scale: 100,
              },
            ])
          }
        >
          <Plus size={14} /> Tambah layer
        </button>
      </div>
      {/* TC-197 — layer di bawah ini adalah "Background Utama" milik canvas
          ini dan digambar DI ATAS background global Canvas 1. */}
      {locked && (
        <div className="layout-help is-locked">
          <strong>Layer milik canvas ini.</strong> Background tetap Canvas 1
          diam di belakang; layer yang Anda tambahkan di sini digambar di
          atasnya, hanya untuk canvas ini, dan ikut bergulir bersama isinya.
        </div>
      )}
      <div className="layout-help">
        <strong>Layer 1 (default)</strong> adalah background utama di atas.
        Layer di bawah ini digambar menumpuk di atasnya secara berurutan — Layer
        2, lalu Layer 3, dan seterusnya. Atur opacity dan blend mode agar layer
        menyatu dengan layer di bawahnya.
      </div>
      {/* Revisi QA: "Animasi Layer Background" di tab Advanced berlaku untuk
          Layer 1 dan SEMUA layer di bawah ini sekaligus. Tanpa keterangan ini
          tidak ada cara mengetahui layer mana yang dianimasikan. */}
      <div className={`layout-help ${activeLoop ? "" : "is-muted"}`}>
        {activeLoop ? (
          <>
            <strong>
              Animasi aktif: {activeLoopLabel} · {section.backgroundLoopSpeed || 6}
              s
            </strong>{" "}
            Berlaku untuk Layer 1 dan seluruh layer di bawah ini sekaligus.
            {loopMovesLayer && (
              <>
                {" "}
                Selama efek ini berjalan, <em>Layer diam saat scroll</em>{" "}
                diabaikan — sebuah layer tidak bisa bergerak dan terpaku di
                tempat pada waktu yang sama.
              </>
            )}
          </>
        ) : (
          <>
            <strong>Belum ada animasi layer.</strong> Atur di tab{" "}
            <em>Advanced → Animasi Layer Background</em>; efeknya berlaku untuk
            Layer 1 dan seluruh layer di bawah ini sekaligus.
          </>
        )}
      </div>
      {layers.map((layer, index) => (
        <div className="extra-text-row" key={layer.id}>
          <div className="form-spec-head">
            <span>Layer {index + 1}</span>
            <button
              onClick={() =>
                commit((current) =>
                  current.filter((item) => item.id !== layer.id),
                )
              }
            >
              <Trash2 size={12} />
            </button>
          </div>
          {/* Revisi: gambar layer dapat diunggah dari komputer, tidak hanya URL. */}
          <LayerImageUpload
            layer={layer}
            onUploaded={(saved) =>
              patch(layer.id, { url: saved.url, key: saved.key })
            }
            uploadLayerImage={uploadLayerImage}
          />
          <label>
            URL gambar layer
            <input
              value={layer.url || ""}
              onChange={(event) => patch(layer.id, { url: event.target.value })}
              placeholder="https://... atau /uploads/..."
            />
          </label>
          <div className="two-inputs">
            <label>
              Ukuran
              <select
                value={layer.size}
                onChange={(event) =>
                  patch(layer.id, {
                    size: event.target.value as BackgroundLayer["size"],
                  })
                }
              >
                <option value="cover">Cover</option>
                <option value="contain">Contain</option>
                <option value="auto">Auto</option>
              </select>
            </label>
            <label>
              Repeat
              <select
                value={layer.repeat}
                onChange={(event) =>
                  patch(layer.id, {
                    repeat: event.target.value as BackgroundLayer["repeat"],
                  })
                }
              >
                <option value="no-repeat">Tidak diulang</option>
                <option value="repeat">Ulang</option>
                <option value="repeat-x">Ulang horizontal</option>
                <option value="repeat-y">Ulang vertikal</option>
              </select>
            </label>
          </div>
          {/* Revisi QA: dua slider terpisah terasa kaku. Pad ini menggeser
              X dan Y sekaligus dengan satu tarikan, slider tetap ada untuk
              penyetelan presisi. */}
          <LayerOffsetPad
            previewUrl={layer.url}
            size={layer.size}
            repeat={layer.repeat}
            offsetX={layer.offsetX ?? 50}
            offsetY={layer.offsetY ?? 50}
            onChange={(offsetX, offsetY) =>
              patch(layer.id, { offsetX, offsetY })
            }
          />
          <div className="two-inputs">
            <label className="range-field">
              <span className="range-head">
                Geser X<b>{layer.offsetX ?? 50}%</b>
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={layer.offsetX ?? 50}
                onChange={(event) =>
                  patch(layer.id, { offsetX: Number(event.target.value) })
                }
              />
            </label>
            <label className="range-field">
              <span className="range-head">
                Geser Y<b>{layer.offsetY ?? 50}%</b>
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={layer.offsetY ?? 50}
                onChange={(event) =>
                  patch(layer.id, { offsetY: Number(event.target.value) })
                }
              />
            </label>
          </div>
          <div className="two-inputs">
            <label className="range-field">
              <span className="range-head">
                Opacity<b>{layer.opacity ?? 100}%</b>
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={layer.opacity ?? 100}
                onChange={(event) =>
                  patch(layer.id, { opacity: Number(event.target.value) })
                }
              />
            </label>
            <label className="range-field">
              <span className="range-head">
                Skala<b>{layer.scale ?? 100}%</b>
              </span>
              <input
                type="range"
                min="50"
                max="200"
                value={layer.scale ?? 100}
                onChange={(event) =>
                  patch(layer.id, { scale: Number(event.target.value) })
                }
              />
            </label>
          </div>
          <label>
            Blend mode
            <select
              value={layer.blend || "normal"}
              onChange={(event) => patch(layer.id, { blend: event.target.value })}
            >
              <option value="normal">Normal</option>
              <option value="multiply">Multiply</option>
              <option value="screen">Screen</option>
              <option value="overlay">Overlay</option>
              <option value="soft-light">Soft light</option>
            </select>
          </label>
          <div className="setting-row compact">
            <div>
              <Anchor size={14} />
              <span>
                <strong>Layer diam saat scroll</strong>
              </span>
            </div>
            <button
              className={`toggle ${layer.fixed ? "on" : ""}`}
              onClick={() => patch(layer.id, { fixed: !layer.fixed })}
            >
              <i />
            </button>
          </div>
          {layer.fixed && loopMovesLayer && (
            <div className="layout-help is-muted">
              Sedang diabaikan karena animasi <strong>{activeLoopLabel}</strong>{" "}
              aktif untuk layer.
            </div>
          )}
        </div>
      ))}
      {!layers.length && (
        <div className="layout-help">Belum ada layer tambahan.</div>
      )}
    </div>
  );
}

function SectionInspector({
  section,
  tab,
  update,
  updateShared,
  updateLive,
  uploadLayerImage,
  setColumnCount,
  backgroundInput,
  uploadBackground,
  backgroundGlobalOn = false,
  isPrimaryCanvas = true,
}: {
  section: CanvasSection;
  tab: InspectorTab;
  update: (patch: Partial<CanvasSection>) => void;
  // QA TC-112: nama canvas dan layout mode bersifat struktural, selalu ditulis
  // ke nilai dasar agar tidak berbeda antara Desktop dan Mobile.
  updateShared: (patch: Partial<CanvasSection>) => void;
  // Ornamen & layer: baca state terbaru, tulis ke nilai dasar.
  updateLive: (
    produce: (current: CanvasSection) => Partial<CanvasSection>,
  ) => void;
  uploadLayerImage: (
    file: File | undefined,
  ) => Promise<{ url: string; key: string } | null>;
  setColumnCount: (count: ColumnCount) => void;
  backgroundInput: React.RefObject<HTMLInputElement | null>;
  uploadBackground: (file: File | undefined) => Promise<void>;
  // Background global aktif: hanya Canvas 1 yang boleh punya background sendiri.
  backgroundGlobalOn?: boolean;
  isPrimaryCanvas?: boolean;
}) {
  const backgroundVideoInput = useRef<HTMLInputElement>(null);
  if (tab === "content")
    return (
      <div className="inspector-group">
        <div className="selection-label">
          <LayoutDashboard size={17} />
          <div>
            <strong>{section.name}</strong>
            <span>Canvas</span>
          </div>
        </div>
        <label>
          Canvas name
          <input
            value={section.name}
            onChange={(event) => updateShared({ name: event.target.value })}
          />
        </label>
        <label>
          Layout mode
          <select
            value={section.layoutMode}
            onChange={(event) => {
              const value = event.target.value as CanvasLayoutMode;
              // Layout mode adalah setting tampilan, bukan struktur: harus
              // tersimpan per device agar Mobile tidak menyeret Desktop.
              update({ layoutMode: value });
              if (value === "split-fixed-left" || value === "split-fixed-right")
                setColumnCount(2);
            }}
          >
            <option value="standard">Standard responsive</option>
            <option value="split-fixed-left">
              Split: fixed left + scroll right
            </option>
            <option value="split-fixed-right">
              Split: scroll left + fixed right
            </option>
          </select>
        </label>
        <label>
          Column layout
          <div className="column-picker">
            {([1, 2, 3, 4] as ColumnCount[]).map((count) => (
              <button
                key={count}
                className={section.columns.length === count ? "active" : ""}
                onClick={() => setColumnCount(count)}
              >
                {count === 1 ? (
                  <LayoutDashboard size={17} />
                ) : count === 2 ? (
                  <Columns2 size={17} />
                ) : count === 3 ? (
                  <Columns3 size={17} />
                ) : (
                  <Columns4 size={17} />
                )}
                <span>{count}</span>
              </button>
            ))}
          </div>
        </label>
        <div className="info-box">
          <Columns2 size={17} />
          <p>
            Struktur editor mengikuti{" "}
            <strong>Canvas → Column → Features</strong>. Mode Split mendukung{" "}
            <strong>Fixed Left</strong> maupun <strong>Fixed Right</strong>.
          </p>
        </div>
      </div>
    );
  const backgroundLocked = backgroundGlobalOn && !isPrimaryCanvas;
  if (tab === "style")
    return (
      <div className="inspector-group">
        <div className="selection-label">
          <Palette size={17} />
          <div>
            <strong>Canvas Background</strong>
            <span>Color, gradient, image motion</span>
          </div>
        </div>
        <BackgroundDesignControls
          value={section}
          update={(patch) => update(patch)}
          hasImage={Boolean(section.backgroundUrl || section.backgroundVideoUrl)}
        />
        {/* Background global aktif: canvas selain Canvas 1 mengikuti background
            Canvas 1, jadi kontrol upload-nya dikunci agar tidak menimbulkan
            background yang tidak pernah terpakai. */}
        {backgroundLocked ? (
          <div className="layout-help background-locked-note">
            <Anchor size={14} />
            <span>
              <strong>Background tetap sedang aktif.</strong> Canvas ini
              bergulir di atas background <strong>Canvas 1</strong> yang diam.
              Untuk mengubahnya, buka Canvas 1 — atau matikan Background tetap
              pada panel Page Structure bila setiap canvas ingin punya
              background sendiri. Layer dan ornamen di bawah tetap milik canvas
              ini dan ikut bergulir.
            </span>
          </div>
        ) : (
          <>
            <input
              ref={backgroundInput}
              hidden
              type="file"
              /* TC-243 — video Layer 1 kini punya tombol & picker sendiri. */
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                // TC-194 — tanpa reset, memilih berkas yang SAMA setelah
                // dihapus tidak memicu onChange sama sekali, sehingga upload
                // terlihat seperti tidak berfungsi.
                event.target.value = "";
                void uploadBackground(file);
              }}
            />
            {/* TC-243 — Layer 1 (default) kini jelas mendukung video: dua
                tombol terpisah, masing-masing dengan picker yang sesuai. */}
            <div className="group-heading layer-one-heading">
              <strong>Layer 1 (default)</strong>
              <small>Gambar atau video background utama</small>
            </div>
            <input
              ref={backgroundVideoInput}
              hidden
              type="file"
              accept="video/mp4,video/webm"
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                void uploadBackground(file);
              }}
            />
            <button
              className="upload-control"
              onClick={() => backgroundInput.current?.click()}
            >
              <Upload size={18} />
              <span>
                <strong>Upload Gambar Layer 1</strong>
                <small>Gambar/GIF maksimal 4 MB</small>
              </span>
            </button>
            <button
              className="upload-control layer-one-video"
              onClick={() => backgroundVideoInput.current?.click()}
            >
              <Video size={18} />
              <span>
                <strong>Upload Video Layer 1</strong>
                <small>MP4/WebM maksimal 10 MB · diputar otomatis, tanpa suara</small>
              </span>
            </button>
            {/* TC-194 — dulu tidak ada konfirmasi apa pun setelah upload, jadi
                Web Designer tidak tahu berhasil atau tidak. Thumbnail + nama
                berkas + tombol hapus kini berdampingan. Hapus juga membuang
                backgroundAspect: kalau tidak, canvas tetap terkunci pada rasio
                gambar yang sudah tidak ada. */}
            {section.backgroundUrl && (
              <div className="background-media-card">
                <span
                  className="background-media-thumb"
                  style={{
                    backgroundImage: `url(${assetUrl(section.backgroundUrl)})`,
                  }}
                />
                <div>
                  <strong>Background image terpasang</strong>
                  <small>{section.backgroundName || "Gambar tersimpan"}</small>
                </div>
                <button
                  className="clear-media"
                  title="Hapus background image"
                  onClick={() =>
                    update({
                      backgroundUrl: undefined,
                      backgroundKey: undefined,
                      backgroundName: undefined,
                      ...(section.backgroundVideoUrl
                        ? {}
                        : {
                            backgroundAspect: undefined,
                            backgroundFollowAspect: false,
                          }),
                    })
                  }
                >
                  <Trash2 size={14} /> Hapus
                </button>
              </div>
            )}
            {section.backgroundVideoUrl && (
              <div className="background-media-card">
                <video
                  className="background-media-thumb"
                  src={assetUrl(section.backgroundVideoUrl)}
                  muted
                  playsInline
                />
                <div>
                  <strong>Background video terpasang</strong>
                  <small>
                    {section.backgroundVideoName || "Video tersimpan"}
                  </small>
                </div>
                <button
                  className="clear-media"
                  title="Hapus background video"
                  onClick={() =>
                    update({
                      backgroundVideoUrl: undefined,
                      backgroundVideoKey: undefined,
                      backgroundVideoName: undefined,
                      ...(section.backgroundUrl
                        ? {}
                        : {
                            backgroundAspect: undefined,
                            backgroundFollowAspect: false,
                          }),
                    })
                  }
                >
                  <Trash2 size={14} /> Hapus
                </button>
              </div>
            )}
            {/* Desain utuh yang diunggah sebagai background sebelumnya terpotong
                atas-bawah, karena tinggi canvas tetap sementara lebarnya berbeda
                antara editor dan preview — `background-size:cover` lalu memangkas
                sisanya. Opsi ini membuat tinggi canvas mengikuti rasio asli
                gambar/video, sehingga seluruh desain selalu terlihat utuh. */}
            {section.backgroundAspect && (
              <div className="setting-row compact">
                <div>
                  <ImageIcon size={16} />
                  <span>
                    <strong>Tinggi mengikuti rasio background</strong>
                    <small>
                      Seluruh desain tampil utuh di lebar berapa pun. Matikan
                      untuk memakai Minimum height dan memotong dengan cover.
                    </small>
                  </span>
                </div>
                <button
                  className={`toggle ${section.backgroundFollowAspect ? "on" : ""}`}
                  onClick={() =>
                    update({
                      backgroundFollowAspect: !section.backgroundFollowAspect,
                    })
                  }
                >
                  <i />
                </button>
              </div>
            )}
          </>
        )}
        {/* QA TC-107 & TC-127: background utama dikunci agar tidak ikut scroll. */}
        <div className="setting-row compact">
          <div>
            <Anchor size={16} />
            <span>
              <strong>Background diam saat di-scroll</strong>
              <small>
                Background utama tetap di tempat, hanya teks dan layer di atasnya
                yang bergerak.
              </small>
            </span>
          </div>
          <button
            className={`toggle ${section.backgroundFixed ? "on" : ""}`}
            onClick={() => update({ backgroundFixed: !section.backgroundFixed })}
          >
            <i />
          </button>
        </div>
        <label>
          Ukuran background
          <select
            value={section.backgroundSize || "cover"}
            onChange={(event) =>
              update({
                backgroundSize: event.target
                  .value as CanvasSection["backgroundSize"],
              })
            }
          >
            <option value="cover">Cover</option>
            <option value="contain">Contain</option>
            <option value="auto">Auto</option>
          </select>
        </label>
        <SectionDecorationEditor
          section={section}
          updateLive={updateLive}
          uploadLayerImage={uploadLayerImage}
        />
        {/* QA TC-108: layer background tambahan di dalam background utama. */}
        <BackgroundLayerEditor
          section={section}
          updateLive={updateLive}
          uploadLayerImage={uploadLayerImage}
          locked={backgroundLocked}
        />
      </div>
    );
  return (
    <div className="inspector-group">
      <div className="selection-label">
        <Settings size={17} />
        <div>
          <strong>Canvas Advanced</strong>
          <span>Animasi, spacing, dan height</span>
        </div>
      </div>
      {/* QA TC-139: animasi khusus untuk layer background tumpang tindih,
          terpisah dari animasi isi section. */}
      <LoopEffectControls
        title="Animasi Layer Background"
        hint="Hanya lapisan background dan layer tumpang tindih yang bergerak; teks dan feature tetap diam."
        loopEffect={section.backgroundLoopEffect}
        loopSpeed={section.backgroundLoopSpeed}
        // TC-200 — patch dari LoopEffectControls hanya berisi SATU kunci.
        // Dulu keduanya selalu disalin, jadi saat slider digeser
        // backgroundLoopEffect ikut ditulis `undefined`; spread di
        // applyDevicePatch menimpa dengan undefined, efek kembali ke
        // "Tidak Ada", dan slider durasinya ikut hilang.
        onChange={(patch) =>
          update({
            ...(patch.loopEffect !== undefined
              ? { backgroundLoopEffect: patch.loopEffect }
              : {}),
            ...(patch.loopSpeed !== undefined
              ? { backgroundLoopSpeed: patch.loopSpeed }
              : {}),
          })
        }
      />
      <LoopEffectControls
        title="Animasi Seluruh Section"
        hint="Menggerakkan seluruh isi canvas ini, termasuk teks dan feature."
        loopEffect={section.loopEffect}
        loopSpeed={section.loopSpeed}
        onChange={update}
      />
      <label>
        Horizontal padding <span>{section.paddingX ?? 32}px</span>
        <input
          type="range"
          min="0"
          max="160"
          value={section.paddingX ?? 32}
          onChange={(event) => update({ paddingX: Number(event.target.value) })}
        />
      </label>
      <label>
        Vertical padding <span>{section.paddingY}px</span>
        <input
          type="range"
          min="0"
          max="180"
          value={section.paddingY}
          onChange={(event) => update({ paddingY: Number(event.target.value) })}
        />
      </label>
      {/* Saat tinggi mengikuti rasio background, tinggi canvas adalah fungsi
          murni dari lebarnya, jadi minHeight diabaikan oleh render. Slider ini
          dulu tetap tampil dan bisa digeser tanpa efek apa pun. */}
      {section.backgroundFollowAspect && section.backgroundAspect ? (
        <div className="layout-help">
          <strong>Tinggi mengikuti rasio background.</strong> Tinggi canvas
          dihitung otomatis dari lebar dan rasio gambar, jadi Minimum height
          tidak dipakai. Matikan opsi tersebut di atas untuk mengatur tinggi
          sendiri.
        </div>
      ) : (
        <label>
          Minimum height <span>{section.minHeight}px</span>
          <input
            type="range"
            min="180"
            max="1200"
            step="10"
            value={section.minHeight}
            onChange={(event) =>
              update({ minHeight: Number(event.target.value) })
            }
          />
        </label>
      )}
      <div className="danger-zone">
        <strong>Canvas structure</strong>
        <p>
          Canvas ini memiliki {section.columns.length} Column dan{" "}
          {section.columns.reduce(
            (total, column) => total + column.features.length,
            0,
          )}{" "}
          Feature.
        </p>
      </div>
    </div>
  );
}

type WeddingCanvasProps = Parameters<typeof WeddingCanvasBody>[0];

/** True bila undangan memakai tata letak kolom di desktop. */
function usesDesktopColumn(sections: CanvasSection[]) {
  return sections[0]?.desktopLayout === "column";
}
const DESKTOP_COLUMN_DEFAULT = 430;
/** Background di luar kolom: yang diunggah khusus untuk itu, atau — bila
 *  belum ada — background Canvas 1 versi Desktop. */
function desktopColumnBackdrop(first: CanvasSection): CanvasSection {
  if (first.desktopBackdropUrl || first.desktopBackdropColor)
    return {
      ...first,
      backgroundUrl: first.desktopBackdropUrl,
      backgroundVideoUrl: undefined,
      backgroundColor: first.desktopBackdropColor || "#0f1f1a",
      backgroundGradientEnabled: false,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundMotion: "none",
      backgroundEffect: "none",
      backgroundLayers: [],
    };
  return resolveSection(first, "desktop");
}

/** Tata letak desktop ala serein. Isi undangan dirender sebagai Mobile di
 *  kolom sempit — desainer tidak perlu menyusun ulang versi Desktop — dan
 *  background Canvas 1 versi Desktop diam memenuhi layar di belakangnya. */
function WeddingCanvas(props: WeddingCanvasProps) {
  const device = useContext(DeviceContext);
  const thumbnail = useContext(ThumbnailContext);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const previewZoom = useContext(PreviewZoomContext);
  const [viewportHeight, setViewportHeight] = useState(0);
  const column =
    device === "desktop" &&
    !thumbnail &&
    props.page !== "rsvp-page" &&
    usesDesktopColumn(props.sections);
  useEffect(() => {
    if (!column) return;
    const root = stageRef.current;
    if (!root) return;
    let scroller: HTMLElement | null = root.parentElement;
    while (scroller && scroller !== document.body) {
      const overflowY = getComputedStyle(scroller).overflowY;
      if (overflowY === "auto" || overflowY === "scroll") break;
      scroller = scroller.parentElement;
    }
    if (!scroller || scroller === document.body) return;
    const target = scroller;
    const observer = new ResizeObserver(() =>
      setViewportHeight(Math.round(target.clientHeight / previewZoom)),
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [column, previewZoom]);
  if (!column) return <WeddingCanvasBody {...props} />;
  const first = props.sections[0];
  const width = first.desktopColumnWidth || DESKTOP_COLUMN_DEFAULT;
  const ratio = first.desktopColumnRatio === "70-30";
  return (
    <div
      ref={stageRef}
      className={`desktop-column-stage align-${ratio && (first.desktopColumnAlign || "center") === "center" ? "right" : first.desktopColumnAlign || "center"}${ratio ? " ratio-7030" : ""}`}
      style={
        {
          "--desktop-column-w": ratio ? "max(360px, 30%)" : `${width}px`,
          ...(viewportHeight
            ? { "--site-viewport-h": `${viewportHeight}px` }
            : {}),
        } as React.CSSProperties
      }
    >
      <FixedBackdrop
        source={desktopColumnBackdrop(first)}
        viewportHeight={viewportHeight}
      />
      <DesktopSidePanel first={first} />
      <div className="desktop-column">
        <DeviceContext value="mobile">
          <WeddingCanvasBody {...props} />
        </DeviceContext>
      </div>
    </div>
  );
}

/** Revisi 21 Okt — bottom navigation bar. Menu dipilih per column; klik
 *  menggulir ke column itu, item aktif mengikuti posisi scroll. */
const BOTTOM_NAV_MAX = 5;
const bottomNavIcons: Record<BottomNavIcon, [typeof Heart, string]> = {
  home: [House, "Beranda"],
  heart: [Heart, "Hati"],
  calendar: [CalendarDays, "Kalender"],
  clock: [Clock, "Jam"],
  map: [MapPin, "Lokasi"],
  image: [ImageIcon, "Galeri"],
  camera: [Camera, "Kamera"],
  message: [MessageCircle, "Ucapan"],
  gift: [Gift, "Hadiah"],
  book: [BookOpen, "Cerita"],
  users: [Users, "Tamu"],
  music: [Music2, "Musik"],
  mail: [MailOpen, "Undangan"],
  live: [Radio, "Live"],
  sparkles: [Sparkles, "Lainnya"],
};
const bottomNavStyles: [BottomNavStyle, string][] = [
  ["classic", "Klasik (ikon + label)"],
  ["floating-pill", "Kapsul melayang"],
  ["center-raised", "Tombol tengah menonjol"],
  ["notch-dot", "Titik aktif"],
  ["active-square", "Kotak aktif"],
  ["icon-only", "Ikon saja"],
];
function guessNavIcon(column: CanvasColumn, index: number): BottomNavIcon {
  const type = column.features[0]?.type;
  const map: Partial<Record<FeatureType, BottomNavIcon>> = {
    "invitation-cover": "home",
    countdown: "clock",
    event: "calendar",
    location: "map",
    gallery: "image",
    image: "camera",
    video: "camera",
    greetings: "message",
    form: "users",
    gift: "gift",
    "love-story": "heart",
    quote: "book",
    credit: "music",
    "live-stream": "live",
  };
  return (type && map[type]) || (index === 0 ? "home" : "heart");
}
function navColumnLabel(section: CanvasSection, column: CanvasColumn) {
  const titled = column.features.find((feature) => feature.title?.trim());
  return (titled?.title || section.name || "Menu").replace(/\s+/g, " ").slice(0, 18);
}

function BottomNavBar({
  config,
  rootRef,
}: {
  config: BottomNavConfig;
  rootRef: React.RefObject<HTMLDivElement | null>;
}) {
  const items = useMemo(
    () => config.items.slice(0, BOTTOM_NAV_MAX),
    [config.items],
  );
  const [active, setActive] = useState(items[0]?.id || "");
  // Setelah menu diklik, item itu tetap aktif selama animasi scroll agar
  // tidak "melompat" ke target sesudahnya yang ikut melewati garis baca.
  const lockUntil = useRef(0);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      if (Date.now() < lockUntil.current) return;
      const line = window.innerHeight * 0.3;
      let current = items[0]?.id || "";
      for (const item of items) {
        const el = root.querySelector<HTMLElement>(bottomNavSelector(item));
        if (el && el.getBoundingClientRect().top <= line) current = item.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [rootRef, items]);
  if (!items.length) return null;
  const go = (item: BottomNavItem) => {
    lockUntil.current = Date.now() + 1200;
    setActive(item.id);
    rootRef.current
      ?.querySelector<HTMLElement>(bottomNavSelector(item))
      ?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
  };
  const middle = Math.floor(items.length / 2);
  return (
    <div className="bottom-nav-dock">
      <nav
        className={`bottom-nav style-${config.style}`}
        aria-label="Navigasi undangan"
        style={
          {
            ...(isPaintColor(config.background)
              ? { "--bn-bg": config.background }
              : {}),
            ...(isPaintColor(config.color) ? { "--bn-fg": config.color } : {}),
            ...(isPaintColor(config.activeColor)
              ? { "--bn-active": config.activeColor }
              : {}),
          } as React.CSSProperties
        }
      >
        {items.map((item, index) => {
          const [Icon] = bottomNavIcons[item.icon] || bottomNavIcons.heart;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`bottom-nav-item ${isActive ? "is-active" : ""} ${config.style === "center-raised" && index === middle ? "is-center" : ""}`}
              aria-current={isActive ? "true" : undefined}
              aria-label={item.label}
              onClick={(event) => {
                event.stopPropagation();
                go(item);
              }}
            >
              <span className="bottom-nav-icon">
                {item.iconUrl ? (
                  <img
                    className="bottom-nav-img"
                    src={assetUrl(item.iconUrl)}
                    alt=""
                  />
                ) : (
                  <Icon size={20} />
                )}
              </span>
              {config.style !== "icon-only" && (
                <span className="bottom-nav-label">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function BottomNavPanel({
  sections,
  first,
  update,
  uploadIcon,
}: {
  sections: CanvasSection[];
  first: CanvasSection;
  update: (patch: Partial<CanvasSection>) => void;
  uploadIcon?: (
    file: File | undefined,
  ) => Promise<{ url: string; key: string } | null>;
}) {
  const [uploadingIcon, setUploadingIcon] = useState("");
  const config: BottomNavConfig = first.bottomNav || {
    enabled: false,
    style: "floating-pill",
    show: "mobile",
    items: [],
  };
  const set = (patch: Partial<BottomNavConfig>) =>
    update({ bottomNav: { ...config, ...patch } });
  const columns = sections.flatMap((section, sectionIndex) =>
    section.columns.map((column, columnIndex) => ({
      section,
      column,
      sectionIndex,
      columnIndex,
    })),
  );
  // Target menu: column, atau feature di dalam column (template yang
  // menaruh banyak feature dalam satu column tetap bisa punya beberapa menu).
  // Urutan menu selalu mengikuti urutan di halaman.
  const targets = columns.flatMap((entry) => [
    { key: entry.column.id, columnId: entry.column.id, featureId: undefined as string | undefined },
    ...entry.column.features
      .filter((feature) => !isPinnedCredit(feature))
      .map((feature) => ({ key: feature.id, columnId: entry.column.id, featureId: feature.id as string | undefined })),
  ]);
  const order = new Map(targets.map((target, index) => [target.key, index]));
  const byOrder = (a: BottomNavItem, b: BottomNavItem) =>
    (order.get(bottomNavKey(a)) ?? 0) - (order.get(bottomNavKey(b)) ?? 0);
  const items = config.items
    .filter((item) => order.has(bottomNavKey(item)))
    .sort(byOrder);
  const toggle = (
    entry: (typeof columns)[number],
    feature: Feature | undefined,
    on: boolean,
  ) => {
    const key = feature?.id || entry.column.id;
    if (on) {
      if (items.length >= BOTTOM_NAV_MAX) return;
      const label = feature
        ? (feature.title || feature.type).replace(/\s+/g, " ").slice(0, 18)
        : navColumnLabel(entry.section, entry.column);
      set({
        items: [
          ...items,
          {
            id: uid("nav"),
            columnId: entry.column.id,
            ...(feature ? { featureId: feature.id } : {}),
            label,
            icon: feature
              ? guessNavIcon({ id: entry.column.id, features: [feature] }, 1)
              : guessNavIcon(entry.column, entry.sectionIndex),
          },
        ].sort(byOrder),
      });
    } else set({ items: items.filter((item) => bottomNavKey(item) !== key) });
  };
  const patchItem = (key: string, patch: Partial<BottomNavItem>) =>
    set({
      items: items.map((item) =>
        bottomNavKey(item) === key ? { ...item, ...patch } : item,
      ),
    });
  const itemEditor = (item: BottomNavItem) => (
    <div className="bottom-nav-item-edit">
      <input
        value={item.label}
        maxLength={18}
        aria-label="Label menu"
        onChange={(event) =>
          patchItem(bottomNavKey(item), { label: event.target.value })
        }
      />
      <select
        value={item.icon}
        aria-label="Ikon menu"
        onChange={(event) =>
          patchItem(bottomNavKey(item), {
            icon: event.target.value as BottomNavIcon,
          })
        }
      >
        {(Object.keys(bottomNavIcons) as BottomNavIcon[]).map((key) => (
          <option key={key} value={key}>
            {bottomNavIcons[key][1]}
          </option>
        ))}
      </select>
      {/* Revisi 22 Okt — ikon sendiri per menu (PNG/JPG/WebP). */}
      {uploadIcon && (
        <div className="bottom-nav-icon-upload">
          {item.iconUrl ? (
            <img src={assetUrl(item.iconUrl)} alt={`Ikon ${item.label}`} />
          ) : (
            <span className="bottom-nav-icon-preview">
              {(() => {
                const [Icon] = bottomNavIcons[item.icon] || bottomNavIcons.heart;
                return <Icon size={14} />;
              })()}
            </span>
          )}
          <label className="secondary-btn bottom-nav-icon-pick">
            <Upload size={12} />
            {uploadingIcon === bottomNavKey(item)
              ? "Mengunggah…"
              : item.iconUrl
                ? "Ganti ikon"
                : "Upload ikon"}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              hidden
              onChange={async (event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (!file) return;
                const key = bottomNavKey(item);
                setUploadingIcon(key);
                const saved = await uploadIcon(file);
                setUploadingIcon("");
                if (saved)
                  patchItem(key, { iconUrl: saved.url, iconKey: saved.key });
              }}
            />
          </label>
          {item.iconUrl && (
            <button
              type="button"
              className="text-button"
              onClick={() =>
                patchItem(bottomNavKey(item), {
                  iconUrl: undefined,
                  iconKey: undefined,
                })
              }
            >
              Pakai ikon bawaan
            </button>
          )}
        </div>
      )}
    </div>
  );
  return (
    <div className="desktop-layout-panel bottom-nav-panel">
      <div className="setting-row compact">
        <div>
          <Navigation size={16} />
          <span>
            <strong>Bottom navigation bar</strong>
            <small>Menu di bawah undangan untuk lompat ke column tertentu.</small>
          </span>
        </div>
        <button
          className={`toggle ${config.enabled ? "on" : ""}`}
          aria-pressed={config.enabled}
          aria-label="Aktifkan bottom navigation bar"
          onClick={() => set({ enabled: !config.enabled })}
        >
          <i />
        </button>
      </div>
      {config.enabled && (
        <>
          <div className="bottom-nav-style-grid" role="group" aria-label="Style bottom navigation">
            {bottomNavStyles.map(([value, labelText]) => (
              <button
                key={value}
                type="button"
                className={config.style === value ? "active" : ""}
                aria-pressed={config.style === value}
                onClick={() => set({ style: value })}
              >
                <span className={`bottom-nav-mini style-${value}`} aria-hidden>
                  {[0, 1, 2, 3].map((dot) => (
                    <i key={dot} className={dot === 1 ? "on" : ""} />
                  ))}
                </span>
                <small>{labelText}</small>
              </button>
            ))}
          </div>
          <label>
            Tampil di
            <select
              value={config.show}
              onChange={(event) =>
                set({ show: event.target.value as BottomNavConfig["show"] })
              }
            >
              <option value="mobile">Mobile saja</option>
              <option value="all">Mobile & Desktop</option>
            </select>
          </label>
          <div className="two-inputs">
            <label>
              Warna bar
              <ColorInput
                value={config.background}
                noneValue="transparent"
                onChange={(next) => set({ background: next })}
              />
            </label>
            <label>
              Warna ikon
              <ColorInput
                value={config.color}
                fallback="#6b7a74"
                onChange={(next) => set({ color: next })}
              />
            </label>
          </div>
          <label>
            Warna aktif
            <ColorInput
              value={config.activeColor}
              fallback="#125946"
              onChange={(next) => set({ activeColor: next })}
            />
          </label>
          <div className="bottom-nav-items">
            <strong>
              Menu per column / feature{" "}
              <small>
                {items.length}/{BOTTOM_NAV_MAX} dipilih
              </small>
            </strong>
            {columns.map((entry) => {
              const item = items.find(
                (candidate) =>
                  !candidate.featureId && candidate.columnId === entry.column.id,
              );
              const full = items.length >= BOTTOM_NAV_MAX;
              return (
                <div
                  key={entry.column.id}
                  className={`bottom-nav-row ${item ? "is-on" : ""}`}
                >
                  <label className="bottom-nav-check">
                    <input
                      type="checkbox"
                      checked={Boolean(item)}
                      disabled={!item && full}
                      onChange={(event) =>
                        toggle(entry, undefined, event.target.checked)
                      }
                    />
                    <span>
                      {entry.section.name || `Canvas ${entry.sectionIndex + 1}`}
                      {` · Column ${entry.columnIndex + 1}`}
                      <small>Lompat ke awal column</small>
                    </span>
                  </label>
                  {item && itemEditor(item)}
                  {entry.column.features.filter((feature) => !isPinnedCredit(feature)).length > 1 && (
                    <div className="bottom-nav-features">
                      {entry.column.features
                        .filter((feature) => !isPinnedCredit(feature))
                        .map((feature) => {
                          const featureItem = items.find(
                            (candidate) => candidate.featureId === feature.id,
                          );
                          return (
                            <div
                              key={feature.id}
                              className={`bottom-nav-feature ${featureItem ? "is-on" : ""}`}
                            >
                              <label className="bottom-nav-check">
                                <input
                                  type="checkbox"
                                  checked={Boolean(featureItem)}
                                  disabled={!featureItem && full}
                                  onChange={(event) =>
                                    toggle(entry, feature, event.target.checked)
                                  }
                                />
                                <span>
                                  {feature.title || feature.type}
                                  <small>{feature.type}</small>
                                </span>
                              </label>
                              {featureItem && itemEditor(featureItem)}
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              );
            })}
            {items.length >= BOTTOM_NAV_MAX && (
              <small className="field-hint">
                Maksimal {BOTTOM_NAV_MAX} menu agar tetap nyaman di layar ponsel.
              </small>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/** TC-242 — editor isi sisi visual: header, teks, slideshow, video. */
function DesktopSideEditor({
  first,
  update,
  flash,
  uploadToServer,
}: {
  first: CanvasSection;
  update: (patch: Partial<CanvasSection>) => void;
  flash: (message: string) => void;
  uploadToServer: (
    file: File,
    category: string,
  ) => Promise<{ key: string; url: string }>;
}) {
  const slideInput = useRef<HTMLInputElement | null>(null);
  const videoInput = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState("");
  const slides = first.desktopSideSlides || [];
  const addSlides = async (files: File[]) => {
    const next = [...slides];
    setBusy("slide");
    try {
      for (const raw of files) {
        if (!raw.type.startsWith("image/")) {
          flash(`${raw.name} bukan gambar.`);
          continue;
        }
        const file = await shrinkImageToLimit(raw, 4 * 1024 * 1024);
        if (file.size > 4 * 1024 * 1024) {
          flash(`${raw.name} lebih dari 4 MB.`);
          continue;
        }
        const saved = await uploadToServer(file, "canvas-background");
        next.push({ url: saved.url, key: saved.key });
      }
      // Revisi 21 Okt — sisi visual memakai gambar, jadi warna background
      // desktop dikosongkan (tidak ada warna yang dipilih).
      update({ desktopSideSlides: next, desktopBackdropColor: undefined });
    } catch (error) {
      flash(error instanceof Error ? error.message : "Upload gambar gagal.");
    } finally {
      setBusy("");
    }
  };
  const uploadVideo = async (file: File | undefined) => {
    if (!file) return;
    if (!/^video\/(mp4|webm)$/.test(file.type)) {
      flash("Video harus MP4 atau WebM.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      flash("Video maksimal 10 MB.");
      return;
    }
    setBusy("video");
    try {
      const saved = await uploadToServer(file, "canvas-background");
      update({
        desktopSideVideoUrl: saved.url,
        desktopSideVideoKey: saved.key,
        desktopBackdropColor: undefined,
      });
      flash("Video sisi desktop disimpan.");
    } catch (error) {
      flash(error instanceof Error ? error.message : "Upload video gagal.");
    } finally {
      setBusy("");
    }
  };
  return (
    <div className="desktop-side-editor">
      <strong>Isi sisi visual</strong>
      <label>
        Header
        <input
          value={first.desktopSideTitle || ""}
          placeholder="Aurelia & Reynard"
          onChange={(event) => update({ desktopSideTitle: event.target.value })}
        />
      </label>
      <label>
        Supporting text
        <textarea
          rows={2}
          value={first.desktopSideBody || ""}
          placeholder="We are getting married · 22.06.2026"
          onChange={(event) => update({ desktopSideBody: event.target.value })}
        />
      </label>
      <label>
        Warna teks
        <ColorInput value={first.desktopSideTextColor} fallback="#ffffff" onChange={(next) => update({ desktopSideTextColor: next })} />
      </label>
      <input
        ref={slideInput}
        hidden
        multiple
        type="file"
        accept="image/*"
        onChange={(event) => {
          const files = Array.from(event.target.files || []);
          event.target.value = "";
          if (files.length) void addSlides(files);
        }}
      />
      <button
        className="upload-control"
        disabled={busy === "slide"}
        onClick={() => slideInput.current?.click()}
      >
        <ImageIcon size={18} />
        <span>
          <strong>{busy === "slide" ? "Mengunggah…" : "Upload Our Image (slideshow)"}</strong>
          <small>Beberapa gambar berganti otomatis · maks 4 MB per gambar</small>
        </span>
      </button>
      {slides.length > 0 && (
        <>
          <div className="desktop-side-thumbs">
            {slides.map((slide, index) => (
              <span
                key={`${slide.url}-${index}`}
                style={{ backgroundImage: `url(${assetUrl(slide.url)})` }}
              >
                <button
                  title="Hapus gambar"
                  onClick={() =>
                    update({
                      desktopSideSlides: slides.filter((_, i) => i !== index),
                    })
                  }
                >
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
          <label>
            Ganti gambar tiap: {first.desktopSideSlideSeconds || 5} detik
            <input
              type="range"
              min={2}
              max={15}
              value={first.desktopSideSlideSeconds || 5}
              onChange={(event) =>
                update({ desktopSideSlideSeconds: Number(event.target.value) })
              }
            />
          </label>
        </>
      )}
      <input
        ref={videoInput}
        hidden
        type="file"
        accept="video/mp4,video/webm"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          void uploadVideo(file);
        }}
      />
      <button
        className="upload-control"
        disabled={busy === "video"}
        onClick={() => videoInput.current?.click()}
      >
        <Video size={18} />
        <span>
          <strong>
            {busy === "video"
              ? "Mengunggah…"
              : first.desktopSideVideoUrl
                ? "Ganti video"
                : "Upload video"}
          </strong>
          <small>MP4/WebM maks 10 MB · diputar otomatis tanpa suara, menggantikan slideshow</small>
        </span>
      </button>
      {first.desktopSideVideoUrl && (
        <button
          className="text-button"
          onClick={() =>
            update({ desktopSideVideoUrl: undefined, desktopSideVideoKey: undefined })
          }
        >
          Hapus video
        </button>
      )}
    </div>
  );
}

/** TC-242 — isi sisi lebar (70%) tata letak kolom desktop. */
function DesktopSidePanel({ first }: { first: CanvasSection }) {
  const slides = (first.desktopSideSlides || []).filter((item) => item.url);
  const [index, setIndex] = useState(0);
  const seconds = Math.max(2, first.desktopSideSlideSeconds || 5);
  useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(
      () => setIndex((value) => (value + 1) % slides.length),
      seconds * 1000,
    );
    return () => window.clearInterval(timer);
  }, [slides.length, seconds]);
  const hasText = Boolean(first.desktopSideTitle || first.desktopSideBody);
  if (!slides.length && !first.desktopSideVideoUrl && !hasText) return null;
  return (
    <div className="desktop-side-panel" aria-hidden={!hasText}>
      <div className="desktop-side-area">
        {first.desktopSideVideoUrl ? (
          <video
            className="desktop-side-media"
            src={assetUrl(first.desktopSideVideoUrl)}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          slides.map((slide, slideIndex) => (
            <div
              key={`${slide.url}-${slideIndex}`}
              className={`desktop-side-media desktop-side-slide ${slideIndex === index % slides.length ? "is-active" : ""}`}
              style={{ backgroundImage: `url(${assetUrl(slide.url)})` }}
            />
          ))
        )}
        {hasText && (
          <div
            className={`desktop-side-text ${slides.length || first.desktopSideVideoUrl ? "on-media" : ""}`}
            style={
              first.desktopSideTextColor
                ? { color: first.desktopSideTextColor }
                : undefined
            }
          >
            {first.desktopSideTitle && <h2>{first.desktopSideTitle}</h2>}
            {first.desktopSideBody && <p>{first.desktopSideBody}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

/** Pengaturan tata letak desktop di panel Page Structure. */
function DesktopLayoutPanel({
  first,
  update,
  flash,
  uploadToServer,
}: {
  first: CanvasSection;
  update: (patch: Partial<CanvasSection>) => void;
  flash: (message: string) => void;
  uploadToServer: (
    file: File,
    category: string,
  ) => Promise<{ key: string; url: string }>;
}) {
  const input = useRef<HTMLInputElement | null>(null);
  const column = first.desktopLayout === "column";
  const upload = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      flash("Background desktop harus berupa gambar.");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      flash("Background desktop maksimal 4 MB.");
      return;
    }
    try {
      const saved = await uploadToServer(file, "canvas-background");
      update({ desktopBackdropUrl: saved.url, desktopBackdropKey: saved.key });
      flash("Background desktop disimpan.");
    } catch (error) {
      flash(
        error instanceof Error ? error.message : "Upload background gagal.",
      );
    }
  };
  return (
    <div className="desktop-layout-panel">
      <div className="setting-row compact">
        <div>
          <Monitor size={16} />
          <span>
            <strong>Tata letak desktop</strong>
            <small>
              {column
                ? "Kolom: di desktop undangan tampil seperti di ponsel, di kolom sempit; background memenuhi layar di belakangnya."
                : "Penuh: desain Desktop memenuhi lebar layar."}
            </small>
          </span>
        </div>
      </div>
      <div className="segmented-control" role="group" aria-label="Tata letak desktop">
        <button
          className={!column ? "active" : ""}
          aria-pressed={!column}
          onClick={() => update({ desktopLayout: "full" })}
        >
          Penuh
        </button>
        <button
          className={column ? "active" : ""}
          aria-pressed={column}
          onClick={() => update({ desktopLayout: "column" })}
        >
          Kolom (ala serein)
        </button>
      </div>
      {column && (
        <div className="desktop-layout-options">
          <label>
            Rasio
            <select
              value={first.desktopColumnRatio || "fixed"}
              onChange={(event) =>
                update({
                  desktopColumnRatio: event.target
                    .value as CanvasSection["desktopColumnRatio"],
                  ...(event.target.value === "70-30" &&
                  (first.desktopColumnAlign || "center") === "center"
                    ? { desktopColumnAlign: "right" as const }
                    : {}),
                })
              }
            >
              <option value="fixed">Kolom lebar tetap (px)</option>
              <option value="70-30">70/30 — sisi 70% untuk visual</option>
            </select>
          </label>
          {first.desktopColumnRatio !== "70-30" && (
          <label>
            Lebar kolom: {first.desktopColumnWidth || DESKTOP_COLUMN_DEFAULT}px
            <input
              type="range"
              min={340}
              max={600}
              step={10}
              value={first.desktopColumnWidth || DESKTOP_COLUMN_DEFAULT}
              onChange={(event) =>
                update({ desktopColumnWidth: Number(event.target.value) })
              }
            />
          </label>
          )}
          <label>
            Posisi kolom
            <select
              value={
                first.desktopColumnRatio === "70-30" &&
                (first.desktopColumnAlign || "center") === "center"
                  ? "right"
                  : first.desktopColumnAlign || "center"
              }
              onChange={(event) =>
                update({
                  desktopColumnAlign: event.target
                    .value as CanvasSection["desktopColumnAlign"],
                })
              }
            >
              {/* Revisi 21 Okt — rasio 70/30 hanya kiri/kanan: posisi
                  tengah tidak menyisakan sisi 70% untuk visual. */}
              {first.desktopColumnRatio !== "70-30" && (
                <option value="center">Tengah</option>
              )}
              <option value="right">Kanan</option>
              <option value="left">Kiri</option>
            </select>
          </label>
          <label>
            Warna background desktop
            {/* Kosong = mengikuti background Canvas 1 versi Desktop. */}
            <ColorInput
              value={first.desktopBackdropColor}
              fallback="#0f1f1a"
              onChange={(next) => update({ desktopBackdropColor: next })}
            />
          </label>
          <input
            ref={input}
            hidden
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              void upload(file);
            }}
          />
          <button className="upload-control" onClick={() => input.current?.click()}>
            <Upload size={18} />
            <span>
              <strong>
                {first.desktopBackdropUrl
                  ? "Ganti background desktop"
                  : "Upload background desktop"}
              </strong>
              <small>
                Gambar lanskap untuk area di luar kolom. Tanpa ini dipakai
                background Canvas 1 versi Desktop.
              </small>
            </span>
          </button>
          {(first.desktopBackdropUrl || first.desktopBackdropColor) && (
            <button
              className="text-button"
              onClick={() =>
                update({
                  desktopBackdropUrl: undefined,
                  desktopBackdropKey: undefined,
                  desktopBackdropColor: undefined,
                })
              }
            >
              Pakai background Canvas 1
            </button>
          )}
          {first.desktopColumnRatio === "70-30" && (
          <DesktopSideEditor
            first={first}
            update={update}
            flash={flash}
            uploadToServer={uploadToServer}
          />
          )}
        </div>
      )}
    </div>
  );
}

function WeddingCanvasBody({
  page,
  sections,
  selectedTemplate,
  greetings,
  addGreeting,
  guests,
  addGuest,
  editable = false,
  selectedSectionId = "",
  selectedColumnId = "",
  selectedFeatureId = "",
  selectSection,
  selectColumn,
  selectFeature,
  updateFeature,
  onColumnDrop,
  onCanvasDrop,
  animationNonce = 0,
  guestName,
  updateSectionLayout,
}: {
  page: PageKey;
  sections: CanvasSection[];
  selectedTemplate: Template;
  greetings: Greeting[];
  addGreeting: (name: string, message: string) => void;
  guests: Guest[];
  addGuest: (
    name: string,
    status: Guest["status"],
    pax: number,
    canvasId?: string,
  ) => void;
  editable?: boolean;
  selectedSectionId?: string;
  selectedColumnId?: string;
  selectedFeatureId?: string;
  selectSection?: (section: CanvasSection) => void;
  selectColumn?: (sectionId: string, columnId: string) => void;
  selectFeature?: (
    sectionId: string,
    columnId: string,
    featureId: string,
  ) => void;
  updateFeature?: (featureId: string, patch: Partial<Feature>) => void;
  // QA TC-113/TC-114/TC-115: perubahan layout langsung dari canvas (drag guide,
  // grid line, dan border section).
  updateSectionLayout?: (
    sectionId: string,
    patch: Partial<CanvasSection>,
  ) => void;
  onColumnDrop?: (
    event: React.DragEvent,
    sectionId: string,
    columnId: string,
  ) => void;
  onCanvasDrop?: (draggedId: string, targetId: string) => void;
  animationNonce?: number;
  guestName?: string;
}) {
  const thumbnail = useContext(ThumbnailContext);
  const previewSurface = useContext(PreviewSurfaceContext);
  // background-attachment: fixed memakai ukuran viewport, bukan ukuran elemen.
  // Di thumbnail yang di-scale, efeknya gambar tampak sangat ter-zoom, jadi
  // penguncian background hanya diterapkan pada tampilan publik berukuran penuh.
  // previewSurface ikut dikecualikan: di dalam kotak preview (lebar ~1050 px)
  // background yang dikunci ke viewport akan dipotong oleh
  // .canvas-section{overflow:hidden}, dan potongannya makin besar seiring
  // lebar layar -> inilah "preview kepotong di layar > 1050 px".
  const allowFixedBackground = !thumbnail && !editable && !previewSurface;
  // QA TC-112: device aktif menentukan setting mana yang dipakai.
  const device = useContext(DeviceContext);

  // QA TC-146: canvas pertama menjadi sumber background bila mode global aktif.
  // Sumber dipakai dalam versi device yang aktif. Dulu mentah: di Mobile,
  // canvas lain tetap memakai background & layer Canvas 1 versi Desktop.
  const globalBackgroundSource = useMemo(
    () =>
      sections[0]?.backgroundGlobal
        ? resolveSection(sections[0], device)
        : null,
    [sections, device],
  );
  // TC-197 — Background tetap. Dulu dikerjakan dengan
  // background-attachment:fixed per section, yang (1) sengaja dimatikan di
  // editor & preview — tempat QA menguji — dan (2) tidak didukung Safari iOS
  // sama sekali, padahal undangan kebanyakan dibuka di ponsel. Kini satu
  // lapisan position:sticky, yang menempel pada kontainer gulir terdekat:
  // halaman, kotak preview, maupun area kerja editor. Thumbnail tetap memakai
  // cara lama karena isinya hanya satu section yang diperkecil.
  const fixedBackdrop = !thumbnail ? globalBackgroundSource : null;
  const [scrollViewportHeight, setScrollViewportHeight] = useState(0);
  const previewZoom = useContext(PreviewZoomContext);
  const coverEntry = useMemo(() => {
    for (const section of sections)
      for (const column of section.columns)
        for (const feature of column.features)
          if (feature.type === "invitation-cover") return { section, feature };
    return undefined;
  }, [sections]);
  const hasCover = Boolean(coverEntry);
  const coverFeatureId = coverEntry?.feature.id;
  const soundFeature = useMemo(
    () =>
      sections
        .flatMap((section) => section.columns)
        .flatMap((column) => column.features)
        .find(
          (feature) =>
            !thumbnail &&
            (feature.type === "sound" ||
              // QA TC-165: backsound kini dapat berasal dari Credit / Watermark.
              (feature.type === "credit" &&
                Boolean(feature.mediaUrl || feature.soundPreset))),
        ),
    [sections, thumbnail],
  );
  const [opened, setOpened] = useState(editable || !hasCover);
  const [opening, setOpening] = useState(false);
  useEffect(() => {
    setOpened(editable || !hasCover);
  }, [editable, hasCover, coverFeatureId]);

  // QA TC-089: audio disimpan pada ref WeddingCanvas agar tidak mati saat cover dibuka / pindah section.
  const soundRef = useRef<{ stop: () => void } | null>(null);
  const [soundPlaying, setSoundPlaying] = useState(false);
  const soundKey = soundFeature
    ? `${soundFeature.id}-${soundFeature.mediaUrl || soundFeature.soundPreset || ""}`
    : "";
  const startSound = useCallback(() => {
    if (!soundFeature || soundRef.current) return;
    soundRef.current = createSoundPlayback(soundFeature, true);
    setSoundPlaying(true);
  }, [soundFeature]);
  const stopSound = useCallback(() => {
    soundRef.current?.stop();
    soundRef.current = null;
    setSoundPlaying(false);
  }, []);
  useEffect(
    () => () => {
      soundRef.current?.stop();
      soundRef.current = null;
    },
    [],
  );
  useEffect(() => {
    stopSound();
  }, [soundKey, stopSound]);
  useEffect(() => {
    if (!editable && soundFeature?.autoplay && opened) startSound();
  }, [editable, soundFeature, opened, startSound]);
  useEffect(() => {
    if (editable || !soundFeature?.autoplay || hasCover) return;
    const handler = () => {
      startSound();
      window.removeEventListener("pointerdown", handler);
      window.removeEventListener("keydown", handler);
    };
    window.addEventListener("pointerdown", handler, { once: true });
    window.addEventListener("keydown", handler, { once: true });
    return () => {
      window.removeEventListener("pointerdown", handler);
      window.removeEventListener("keydown", handler);
    };
  }, [editable, soundFeature, hasCover, startSound]);
  // Di Canvas Editor disc backsound melayang di pojok kiri bawah dan menutupi
  // daftar section. Backsound tetap bisa diuji lewat Preview / Buka Undangan.
  const soundNode = soundFeature && !editable ? (
    <ControlledSoundPlayer
      feature={soundFeature}
      playing={soundPlaying}
      onToggle={() => (soundPlaying ? stopSound() : startSound())}
      contained={previewSurface}
    />
  ) : null;

  // QA TC-091: animasi berjalan saat scroll pada seluruh section, bukan hanya halaman opening.
  const revealRootRef = useRef<HTMLDivElement | null>(null);
  // Revisi 21 Okt — bottom navigation bar (konfigurasi di Canvas 1).
  const bottomNav = sections[0]?.bottomNav;
  const showBottomNav = Boolean(
    !thumbnail &&
      bottomNav?.enabled &&
      bottomNav.items.length &&
      (bottomNav.show === "all" || device === "mobile"),
  );
  useEffect(() => {
    if (editable || thumbnail || !opened) return;
    const root = revealRootRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const nodes = Array.from(
      root.querySelectorAll(".feature-block"),
    ) as HTMLElement[];
    const targets = nodes.filter(
      (node) =>
        !node.classList.contains("fx-none") &&
        !node.classList.contains("no-scroll-reveal"),
    );
    targets.forEach((node) => node.classList.add("await-reveal"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -6% 0px" },
    );
    targets.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [editable, thumbnail, opened, sections, animationNonce]);

  useEffect(() => {
    if (!fixedBackdrop) return;
    const root = revealRootRef.current;
    if (!root) return;
    // Tinggi backdrop harus sama dengan jendela gulirnya. Di halaman publik
    // itu 100vh; di kotak preview/editor tingginya lebih pendek, dan backdrop
    // setinggi layar akan terpotong di bagian bawah kotak.
    let scroller: HTMLElement | null = root.parentElement;
    while (scroller && scroller !== document.body) {
      const overflowY = getComputedStyle(scroller).overflowY;
      if (overflowY === "auto" || overflowY === "scroll") break;
      scroller = scroller.parentElement;
    }
    if (!scroller || scroller === document.body) {
      setScrollViewportHeight(0);
      return;
    }
    const target = scroller;
    const observer = new ResizeObserver(() =>
      setScrollViewportHeight(Math.round(target.clientHeight / previewZoom)),
    );
    observer.observe(target);
    return () => observer.disconnect();
    // `opened`: bila ada cover, root halaman baru terpasang setelah cover
    // dibuka, jadi pengukuran harus diulang saat itu.
  }, [fixedBackdrop, opened, previewZoom]);
  if (page === "rsvp-page")
    return <RsvpPage guests={guests} addGuest={addGuest} />;
  if (!editable && coverEntry && !opened) {
    // QA TC-094: nama tamu diambil dari link personal (?to=), fallback ke entri pertama.
    const invitee = guestName || coverEntry.section.invitees[0]?.name;
    return (
      <div
        className="wedding-site invitation-locked"
        style={{ "--accent": selectedTemplate.accent } as React.CSSProperties}
      >
        <InvitationCover
          section={coverEntry.section}
          feature={coverEntry.feature}
          inviteeName={invitee}
          opening={opening}
          onOpen={() => {
            setOpening(true);
            startSound();
            window.setTimeout(
              () => {
                setOpened(true);
                setOpening(false);
              },
              Math.max(150, coverEntry.feature.coverExitDuration ?? 700),
            );
          }}
        />
        {soundNode}
      </div>
    );
  }
  return (
    <div
      ref={revealRootRef}
      className={`wedding-site device-${device} ${thumbnail ? "is-thumbnail" : ""} ${fixedBackdrop ? "has-fixed-backdrop" : ""} ${showBottomNav ? "has-bottom-nav" : ""} theme-${selectedTemplate.preset || "classic"}`}
      style={{ "--accent": selectedTemplate.accent } as React.CSSProperties}
    >
      <nav>
        <Brand />
        <div>
          <a>Our Story</a>
          <a>Event</a>
          <a>Gallery</a>
          <a>RSVP</a>
        </div>
      </nav>
      {fixedBackdrop && (
        <FixedBackdrop
          source={fixedBackdrop}
          viewportHeight={scrollViewportHeight}
        />
      )}
      {sections.map((rawSection) => {
        // QA TC-112: nilai section mengikuti device aktif (Desktop / Mobile).
        // QA TC-146: bila mode background global aktif, seluruh canvas memakai
        // background canvas pertama sehingga tidak perlu upload berulang.
        // TC-197 — mode Background tetap: backdrop Canvas 1 dilukis SEKALI
        // sebagai lapisan sticky di belakang seluruh canvas (lihat
        // FixedBackdrop), jadi section tidak melukis ulang background itu.
        // Layer & ornamen milik section sendiri tetap ikut bergulir.
        const section = fixedBackdrop
          ? withoutSharedBackdrop(
              resolveSection(rawSection, device),
              rawSection.id === sections[0]?.id,
            )
          : applyGlobalBackground(
              resolveSection(rawSection, device),
              globalBackgroundSource,
            );
        const filter = getBackgroundFilter(section.backgroundEffect);
        // "Animasi Layer Background" berlaku untuk background utama DAN semua
        // layer tumpang tindih, sesuai keterangan kontrolnya.
        const backgroundLoop =
          section.backgroundLoopEffect && section.backgroundLoopEffect !== "none"
            ? section.backgroundLoopEffect
            : null;
        // Hanya efek yang menganimasikan transform yang mematahkan
        // background-attachment:fixed. Fade & shimmer aman.
        const backgroundLoopMovesLayer = backgroundLoop
          ? ["float", "sway", "pulse", "drift"].includes(backgroundLoop)
          : false;
        // Canvas yang isinya memang hanya visual — background image/video,
        // layer, atau ornamen — tetap harus tampil. Sebelumnya section tanpa
        // feature langsung dibuang, sehingga Web Designer yang mengunggah
        // desain utuh sebagai background melihat canvasnya hilang di Live
        // Preview dan di undangan publik.
        const hasOwnBackdrop = Boolean(
          section.backgroundUrl ||
            section.backgroundVideoUrl ||
            (section.backgroundLayers || []).some((layer) => layer.url) ||
            (section.decorations || []).length,
        );
        const hasContentFeatures = section.columns.some((column) =>
          column.features.some(
            (feature) =>
              feature.type !== "invitation-cover" &&
              feature.type !== "sound" &&
              (editable || !isPinnedCredit(feature)),
          ),
        );
        // TC-204 — section yang hanya berisi cover "Buka Undangan". Background
        // yang diunggah di sana milik layar cover, dan layar itu sudah tampil
        // sebelum undangan dibuka. Dulu aturan hasOwnBackdrop di bawah ikut
        // merendernya lagi setelah dibuka, sebagai slide berisi background
        // saja. Mengunggah di fitur cover tidak memicunya karena section-nya
        // tidak punya backdrop sendiri — itu sebabnya hanya satu jalur yang
        // bermasalah. Kedua jalur upload tetap tersedia.
        const isCoverOnly =
          !hasContentFeatures &&
          section.columns.some((column) =>
            column.features.some(
              (feature) => feature.type === "invitation-cover",
            ),
          );
        const hasVisibleFeatures =
          editable ||
          (hasOwnBackdrop && !isCoverOnly) ||
          hasContentFeatures;
        if (!hasVisibleFeatures) return null;
        return (
          <section
            key={section.id}
            className={`canvas-section loop-${section.loopEffect || "none"} layout-${section.layoutMode} ${editable && selectedSectionId === section.id ? "selected-canvas" : ""}`}
            onDragOver={(event) => {
              if (
                editable &&
                event.dataTransfer.types.includes(
                  "application/x-ikrarku-canvas",
                )
              )
                event.preventDefault();
            }}
            onDrop={(event) => {
              if (editable) {
                const dragged = event.dataTransfer.getData(
                  "application/x-ikrarku-canvas",
                );
                if (dragged) {
                  event.preventDefault();
                  onCanvasDrop?.(dragged, section.id);
                }
              }
            }}
            onClick={(event) => {
              if (editable && event.target === event.currentTarget)
                selectSection?.(section);
            }}
            style={
              {
                background: (() => {
                  // TC-231 — transparansi warna/gradient background canvas.
                  const alpha =
                    section.backgroundOpacity !== undefined
                      ? section.backgroundOpacity / 100
                      : undefined;
                  return getGradientBackground(
                    section.backgroundGradientEnabled,
                    withAlpha(section.backgroundGradientFrom, alpha),
                    withAlpha(section.backgroundGradientTo || "#d7b66f", alpha),
                    section.backgroundGradientAngle,
                    withAlpha(section.backgroundColor, alpha) ||
                      section.backgroundColor,
                  );
                })(),
                // Mengikuti rasio asli background supaya seluruh desain terlihat
                // di lebar berapa pun, bukan terpotong atas-bawah oleh `cover`.
                aspectRatio:
                  section.backgroundFollowAspect && section.backgroundAspect
                    ? String(section.backgroundAspect)
                    : undefined,
                minHeight:
                  section.backgroundFollowAspect && section.backgroundAspect
                    ? 0
                    : section.minHeight,
                paddingTop:
                  section.layoutMode !== "standard" ? 0 : section.paddingY,
                paddingBottom:
                  section.layoutMode !== "standard" ? 0 : section.paddingY,
                "--canvas-padding-x": `${section.paddingX ?? 32}px`,
              } as React.CSSProperties
            }
          >
            {/* QA TC-107 & TC-127: background utama dapat dikunci (fixed) sehingga
                hanya konten/layer di atasnya yang bergerak saat di-scroll. */}
            <div
              className={`background-layer ${getBackgroundMotionClass(section.backgroundMotion)} ${section.backgroundFixed && allowFixedBackground && !backgroundLoopMovesLayer ? "is-fixed" : ""} loop-${backgroundLoop || "none"}`}
              style={
                {
                  backgroundImage: section.backgroundUrl
                    ? `url(${assetUrl(section.backgroundUrl)})`
                    : undefined,
                  backgroundPosition: section.backgroundPosition,
                  backgroundRepeat: section.backgroundRepeat,
                  backgroundSize:
                    section.backgroundSize ||
                    (section.backgroundRepeat === "no-repeat"
                      ? "cover"
                      : "auto"),
                  // Lapisan yang bergerak tidak boleh `fixed`: transform yang
                  // dianimasikan menjadikan elemen containing block, sehingga
                  // background-attachment:fixed luruh dan gambarnya melompat.
                  backgroundAttachment:
                    section.backgroundFixed &&
                    allowFixedBackground &&
                    !backgroundLoopMovesLayer
                      ? "fixed"
                      : "scroll",
                  filter,
                  // TC-231 — transparansi gambar background canvas.
                  ...(section.backgroundImageOpacity !== undefined
                    ? { opacity: section.backgroundImageOpacity / 100 }
                    : {}),
                  // Slider "Durasi siklus" pada Animasi Layer Background dulu
                  // tidak pernah dipasang ke mana pun, jadi semua efek tetap
                  // memakai durasi bawaan CSS dan slider itu tak berefek.
                  ...(backgroundLoop
                    ? {
                        "--loop-speed": `${section.backgroundLoopSpeed || 6}s`,
                      }
                    : {}),
                } as React.CSSProperties
              }
            />
            {/* Ornamen pojok dengan gerak berulang. */}
            {(section.decorations || []).map((decoration) => (
              <span
                key={decoration.id}
                className={`section-decoration corner-${decoration.corner} loop-${decoration.motion || "sway"}`}
                style={
                  {
                    width: decoration.size,
                    // TC-205 — kotak gambar dulu selalu persegi, padahal
                    // gambarnya `object-fit: contain`. Gambar yang tidak
                    // persegi diletakkan di TENGAH kotak itu, menyisakan
                    // celah di pojok berapa pun ukurannya. Ornamen gambar kini
                    // mengikuti rasio gambarnya sendiri; bentuk bawaan (SVG)
                    // memang persegi dan tetap memakai tinggi yang sama.
                    height: decoration.imageUrl ? undefined : decoration.size,
                    color: decoration.color,
                    opacity: (decoration.opacity ?? 70) / 100,
                    // transform inline kalah dari keyframes .loop-* yang juga
                    // menganimasikan transform, jadi "Cermin horizontal" dan
                    // penyusutan di mobile tidak pernah terlihat. Nilainya
                    // dikirim sebagai custom property dan ikut dirangkai di
                    // dalam keyframes.
                    "--deco-flip": decoration.flip ? -1 : 1,
                    "--deco-rotate": `${decoration.rotation ?? 0}deg`,
                    "--deco-dx": `${decoration.offsetX ?? 0}px`,
                    "--deco-dy": `${decoration.offsetY ?? 0}px`,
                    "--loop-speed": `${decoration.speed || 7}s`,
                  } as React.CSSProperties
                }
                aria-hidden
              >
                {decoration.imageUrl ? (
                  <img
                    src={assetUrl(decoration.imageUrl)}
                    alt=""
                    loading="lazy"
                  />
                ) : (
                  <DecorGlyphIcon glyph={decoration.glyph} />
                )}
              </span>
            ))}
            {/* QA TC-108: layer background tambahan di atas background utama. */}
            {(section.backgroundLayers || []).map((layer, layerIndex) => (
              <div
                key={layer.id}
                // Revisi QA: kontrol "Animasi Layer Background" menjanjikan
                // "lapisan background DAN layer tumpang tindih yang bergerak",
                // tetapi kelas loop-* dulu hanya dipasang pada background
                // utama. Canvas yang backgroundnya kosong dan hanya memakai
                // layer karena itu tidak bergerak sama sekali, dan tidak ada
                // petunjuk layer mana yang dimaksud.
                className={`background-extra-layer ${layer.fixed && !backgroundLoopMovesLayer ? "is-fixed" : ""} loop-${backgroundLoop || "none"}`}
                style={
                  {
                    backgroundImage: layer.url
                      ? `url(${assetUrl(layer.url)})`
                      : undefined,
                    backgroundSize: layer.size,
                    backgroundPosition: `${layer.offsetX ?? 50}% ${layer.offsetY ?? 50}%`,
                    backgroundRepeat: layer.repeat,
                    backgroundAttachment:
                      layer.fixed &&
                      allowFixedBackground &&
                      !backgroundLoopMovesLayer
                        ? "fixed"
                        : "scroll",
                    opacity: (layer.opacity ?? 100) / 100,
                    mixBlendMode:
                      (layer.blend as React.CSSProperties["mixBlendMode"]) ||
                      "normal",
                    // scale(1) pun membuat elemen jadi containing block,
                    // sehingga background-attachment:fixed luruh jadi relatif
                    // elemen. Hanya pasang transform bila memang di-scale.
                    transform:
                      layer.scale && layer.scale !== 100
                        ? `scale(${layer.scale / 100})`
                        : undefined,
                    // Keyframes loop-* juga menganimasikan transform dan
                    // opacity, dan animasi mengalahkan inline style pada
                    // elemen yang sama. Skala & opacity dikirim sebagai
                    // custom property agar ikut dirangkai di dalam keyframes
                    // khusus layer, sehingga Skala 140% tetap 140% walau
                    // layernya sedang mengambang.
                    "--layer-scale": (layer.scale ?? 100) / 100,
                    "--layer-opacity": (layer.opacity ?? 100) / 100,
                    ...(backgroundLoop
                      ? {
                          "--loop-speed": `${section.backgroundLoopSpeed || 6}s`,
                        }
                      : {}),
                    // Dulu `1 + layerIndex`: Layer 2 menyamai z-index ornamen (2)
                    // lalu menutupinya, dan Layer 6 melewati z-index konten (5)
                    // sehingga menimpa seluruh teks. Urutan antar layer tetap
                    // terjaga oleh urutan DOM.
                    zIndex: Math.min(1 + layerIndex, 3),
                  } as React.CSSProperties
                }
              />
            ))}
            {section.backgroundVideoUrl && (
              <video
                className={`background-video-layer ${getBackgroundMotionClass(section.backgroundMotion)}`}
                src={assetUrl(section.backgroundVideoUrl)}
                autoPlay={!thumbnail}
                preload={thumbnail ? "none" : "metadata"}
                loop
                muted
                playsInline
                style={{
                  filter,
                  ...(section.backgroundImageOpacity !== undefined
                    ? { opacity: section.backgroundImageOpacity / 100 }
                    : {}),
                }}
              />
            )}
            {/* QA TC-113: garis guide / margin yang bisa di-drag. */}
            {editable && section.showGuides !== false && (
              <CanvasGuides
                section={section}
                onChange={(patch) => updateSectionLayout?.(section.id, patch)}
              />
            )}
            {/* QA TC-115: tinggi section diubah dengan menarik border bawah. */}
            {editable && (
              <div
                className="section-resize-handle"
                title="Tarik untuk mengubah tinggi section"
                onPointerDown={(event) =>
                  startSectionResize(event, section, (patch) =>
                    updateSectionLayout?.(section.id, patch),
                  )
                }
              />
            )}
            {editable && (
              <div
                className="canvas-drag-handle"
                draggable
                onDragStart={(event) => {
                  event.stopPropagation();
                  event.dataTransfer.setData(
                    "application/x-ikrarku-canvas",
                    section.id,
                  );
                  event.dataTransfer.effectAllowed = "move";
                }}
              >
                <GripVertical size={15} /> Drag Canvas
              </div>
            )}
            <div
              className={`canvas-columns columns-${section.columns.length}`}
              style={
                section.columnWidths &&
                section.columnWidths.length === section.columns.length
                  ? {
                      gridTemplateColumns: section.columnWidths
                        .map((value) => `${value}fr`)
                        .join(" "),
                    }
                  : undefined
              }
            >
              {section.columns.map((column, columnIndex) => (
                <div
                  key={column.id}
                  data-column-id={column.id}
                  className={`canvas-column ${editable && selectedColumnId === column.id ? "selected-column" : ""}`}
                  onClick={(event) => {
                    if (editable) {
                      event.stopPropagation();
                      selectColumn?.(section.id, column.id);
                    }
                  }}
                  onDragOver={(event) => {
                    if (editable) {
                      event.preventDefault();
                      event.currentTarget.classList.add("drop-ready");
                    }
                  }}
                  onDragLeave={(event) =>
                    event.currentTarget.classList.remove("drop-ready")
                  }
                  onDrop={(event) => {
                    event.currentTarget.classList.remove("drop-ready");
                    onColumnDrop?.(event, section.id, column.id);
                  }}
                >
                  <div className="column-label">
                    Column {columnIndex + 1}
                    {section.layoutMode === "split-fixed-left" &&
                    columnIndex === 0
                      ? " · Fixed"
                      : section.layoutMode === "split-fixed-left"
                        ? " · Scroll"
                        : section.layoutMode === "split-fixed-right" &&
                            columnIndex === 1
                          ? " · Fixed"
                          : section.layoutMode === "split-fixed-right"
                            ? " · Scroll"
                            : ""}
                  </div>
                  {column.features.filter(
                    (feature) =>
                      editable ||
                      (feature.type !== "invitation-cover" &&
                        feature.type !== "sound"),
                  ).length === 0 &&
                    editable && (
                      <div className="empty-column">
                        <Plus size={18} />
                        <span>Drag feature here</span>
                      </div>
                    )}
                  {column.features
                    .filter(
                      (feature) =>
                        !feature.freePosition ||
                        feature.positionScope !== "canvas",
                    )
                    .map(
                      (feature) =>
                        (editable ||
                          (feature.type !== "invitation-cover" &&
                            feature.type !== "sound" &&
                            !isPinnedCredit(feature))) && (
                          <FeatureBlock
                            key={`${feature.id}-${animationNonce}`}
                            feature={feature}
                            editable={editable}
                            selected={selectedFeatureId === feature.id}
                            onSelect={() =>
                              selectFeature?.(section.id, column.id, feature.id)
                            }
                            onUpdate={(patch) =>
                              updateFeature?.(feature.id, patch)
                            }
                            greetings={greetings}
                            addGreeting={addGreeting}
                            guests={guests}
                            addGuest={addGuest}
                            inviteeName={guestName || section.invitees[0]?.name}
                            canvasId={section.id}
                          />
                        ),
                    )}
                  {/* QA TC-114: tarik garis ini untuk mengubah lebar kolom. */}
                  {editable &&
                    columnIndex < section.columns.length - 1 && (
                      <ColumnGridHandle
                        section={section}
                        index={columnIndex}
                        onChange={(patch) =>
                          updateSectionLayout?.(section.id, patch)
                        }
                      />
                    )}
                </div>
              ))}
            </div>
            <div className="canvas-decoration-layer">
              {section.columns.flatMap((column) =>
                column.features
                  .filter(
                    (feature) =>
                      feature.freePosition &&
                      feature.positionScope === "canvas",
                  )
                  .map((feature) => (
                    <FeatureBlock
                      key={`${feature.id}-${animationNonce}`}
                      feature={feature}
                      editable={editable}
                      selected={selectedFeatureId === feature.id}
                      onSelect={() =>
                        selectFeature?.(section.id, column.id, feature.id)
                      }
                      onUpdate={(patch) => updateFeature?.(feature.id, patch)}
                      greetings={greetings}
                      addGreeting={addGreeting}
                      guests={guests}
                      addGuest={addGuest}
                      canvasId={section.id}
                    />
                  )),
              )}
            </div>
          </section>
        );
      })}
      {!editable &&
        (() => {
          const pinned = sections.flatMap((rawSection) =>
            resolveSection(rawSection, device).columns.flatMap((column) =>
              column.features
                .filter(isPinnedCredit)
                .map((feature) => ({ feature, canvasId: rawSection.id })),
            ),
          );
          if (!pinned.length) return null;
          return (
            <footer className="site-credit-footer">
              {pinned.map(({ feature, canvasId }) => (
                <FeatureBlock
                  key={`${feature.id}-${animationNonce}`}
                  feature={feature}
                  editable={false}
                  selected={false}
                  onSelect={() => {}}
                  onUpdate={() => {}}
                  greetings={greetings}
                  addGreeting={addGreeting}
                  guests={guests}
                  addGuest={addGuest}
                  canvasId={canvasId}
                />
              ))}
            </footer>
          );
        })()}
      {showBottomNav && bottomNav && (
        <BottomNavBar config={bottomNav} rootRef={revealRootRef} />
      )}
      {soundNode}
    </div>
  );
}

function InvitationCover({
  section,
  feature,
  inviteeName,
  onOpen,
  opening = false,
}: {
  section: CanvasSection;
  feature: Feature;
  inviteeName?: string;
  onOpen: () => void;
  opening?: boolean;
}) {
  const exitEffect = feature.coverExitEffect || "fade";
  return (
    <section
      className={`invitation-cover-screen columns-${section.columns.length} ${opening ? `opening cover-exit-${exitEffect}` : ""}`}
      style={
        {
          background: getGradientBackground(
            section.backgroundGradientEnabled,
            section.backgroundGradientFrom,
            section.backgroundGradientTo,
            section.backgroundGradientAngle,
            section.backgroundColor,
          ),
          "--cover-exit-duration": `${feature.coverExitDuration ?? 700}ms`,
          "--cover-exit-easing": feature.coverExitEasing || "ease",
        } as React.CSSProperties
      }
    >
      <div
        className={`invitation-section-bg ${getBackgroundMotionClass(section.backgroundMotion)}`}
        style={{
          backgroundImage: section.backgroundUrl
            ? `url(${assetUrl(section.backgroundUrl)})`
            : undefined,
          backgroundPosition: section.backgroundPosition,
          backgroundRepeat: section.backgroundRepeat,
          backgroundSize: "cover",
          filter: getBackgroundFilter(section.backgroundEffect),
        }}
      />
      <div
        className={`invitation-cover-grid columns-${section.columns.length}`}
      >
        {section.columns.map((column, columnIndex) => {
          const cover = column.features.find(
            (item) => item.type === "invitation-cover",
          );
          const companions = column.features.filter(
            (item) =>
              item.type !== "invitation-cover" &&
              item.type !== "sound" &&
              !(item.freePosition && item.positionScope === "canvas"),
          );
          const active = cover || (columnIndex === 0 ? feature : undefined);
          return (
            <div
              className="invitation-cover-column"
              key={column.id}
              style={
                active
                  ? {
                      background: getGradientBackground(
                        active.backgroundGradientEnabled,
                        active.backgroundGradientFrom,
                        active.backgroundGradientTo,
                        active.backgroundGradientAngle,
                        active.backgroundColor,
                      ),
                    }
                  : undefined
              }
            >
              {active && (
                <>
                  <div
                    className={`invitation-column-bg ${getBackgroundMotionClass(active.backgroundMotion)}`}
                    style={{
                      backgroundImage: active.mediaUrl
                        ? `url(${active.mediaUrl})`
                        : undefined,
                      backgroundPosition: active.backgroundPosition || "center",
                      backgroundRepeat: active.backgroundRepeat || "no-repeat",
                      backgroundSize: active.backgroundSize || "cover",
                      filter: getBackgroundFilter(active.backgroundEffect),
                    }}
                  />
                  <div
                    className="invitation-column-overlay"
                    style={{ opacity: (active.overlayOpacity ?? 45) / 100 }}
                  />
                  <div
                    className="cover-content"
                    style={{
                      ...getCoverContentObjectStyle(active),
                      fontFamily: active.fontFamily,
                      color: active.textColor,
                      textAlign: active.align,
                      alignItems: getCoverContentAlignment(active.align),
                      justifyContent: getCoverVerticalJustify(
                        active.coverVerticalAlign,
                      ),
                      padding: active.padding,
                      marginTop: active.margin,
                      marginBottom: active.margin,
                      lineHeight: active.lineHeight,
                      fontWeight: active.bold ? 700 : 400,
                      fontStyle: active.italic ? "italic" : "normal",
                      textDecoration: active.underline ? "underline" : "none",
                    }}
                  >
                    {/* Warna per Elemen: Heading mewarnai judul + eyebrow,
                        Supporting mewarnai label tamu, nama tamu, dan body.
                        Tanpa ini seluruh teks cover terkunci ke textColor. */}
                    <small
                      data-custom-color={active.titleColor ? "true" : undefined}
                      style={{
                        ...(active.titleColor
                          ? { color: active.titleColor }
                          : {}),
                        ...(active.eyebrowFontSize
                          ? { fontSize: active.eyebrowFontSize }
                          : {}),
                      }}
                    >
                      {active.eyebrowText || "UNDANGAN PERNIKAHAN"}
                    </small>
                    <h1
                      data-custom-color={active.titleColor ? "true" : undefined}
                      style={{
                        fontSize: Math.min(
                          active.fontSize,
                          section.columns.length > 1 ? 58 : 82,
                        ),
                        // TC-199 — .cover-content h1 mengunci line-height:1.05,
                        // sehingga slider Line spacing tidak berefek di cover.
                        lineHeight: active.lineHeight ?? undefined,
                        ...(active.titleColor
                          ? { color: active.titleColor }
                          : {}),
                      }}
                    >
                      {active.title}
                    </h1>
                    <p
                      data-custom-color={active.bodyColor ? "true" : undefined}
                      style={{
                        ...(active.bodyColor ? { color: active.bodyColor } : {}),
                        ...(active.guestLabelFontSize
                          ? { fontSize: active.guestLabelFontSize }
                          : {}),
                      }}
                    >
                      {active.guestLabelText ||
                        "Kepada Yth. Bapak/Ibu/Saudara/i"}
                    </p>
                    <strong
                      data-custom-color={active.bodyColor ? "true" : undefined}
                      style={{
                        ...(active.bodyColor ? { color: active.bodyColor } : {}),
                        ...(active.guestNameFontSize
                          ? { fontSize: active.guestNameFontSize }
                          : {}),
                      }}
                    >
                      {inviteeName || active.guestNameText || "Tamu Terhormat"}
                    </strong>
                    <span
                      data-custom-color={active.bodyColor ? "true" : undefined}
                      style={{
                        ...(active.bodyColor ? { color: active.bodyColor } : {}),
                        // WYSIWYG: editor memakai bodyFontSize lewat
                        // editableText(), live sebelumnya tidak sama sekali.
                        ...(active.bodyFontSize
                          ? { fontSize: active.bodyFontSize }
                          : {}),
                      }}
                    >
                      {active.body ||
                        "Dengan penuh kebahagiaan kami mengundang Anda"}
                    </span>
                    {/* TC-118 lanjutan — di editor cover dirender lewat
                        FeatureBlock, yang memasang blok Heading 2 /
                        Supporting Text 2. Di live & preview cover dirender
                        oleh komponen ini, dan dulu kedua teks itu tidak ada
                        sama sekali: terlihat saat mengedit, hilang saat
                        dipreview. */}
                    {(active.showTitle2 || active.showBody2) && (
                      <div className="secondary-text-stack cover-secondary">
                        {active.showTitle2 && (
                          <div
                            className="editable-title editable-title-2"
                            data-custom-color={
                              active.title2Color ? "true" : undefined
                            }
                            style={{
                              whiteSpace: "pre-wrap",
                              ...(active.title2FontSize
                                ? { fontSize: active.title2FontSize }
                                : {}),
                              ...(active.title2Color
                                ? { color: active.title2Color }
                                : {}),
                            }}
                          >
                            {active.title2}
                          </div>
                        )}
                        {active.showBody2 && (
                          <div
                            className="editable-body editable-body-2"
                            data-custom-color={
                              active.body2Color ? "true" : undefined
                            }
                            style={{
                              whiteSpace: "pre-wrap",
                              ...(active.body2FontSize
                                ? { fontSize: active.body2FontSize }
                                : {}),
                              ...(active.body2Color
                                ? { color: active.body2Color }
                                : {}),
                            }}
                          >
                            {active.body2}
                          </div>
                        )}
                      </div>
                    )}
                    {active.coverButtonMode === "slide" ? (
                      <SlideToOpen
                        label={active.buttonLabel || "Buka Undangan"}
                        style={coverButtonStyle(active)}
                        onOpen={onOpen}
                      />
                    ) : (
                    <button
                      className={`cover-open-button icon-${active.coverIconPosition || "left"}`}
                      onClick={onOpen}
                      style={coverButtonStyle(active)}
                    >
                      {active.coverIconPosition === "top" && (
                        <CoverIconGlyph
                          name={active.coverIcon}
                          size={active.coverIconSize}
                        />
                      )}{" "}
                      {active.coverIconPosition !== "top" &&
                        active.coverIconPosition !== "right" && (
                          <CoverIconGlyph
                            name={active.coverIcon}
                            size={active.coverIconSize}
                          />
                        )}
                      <span>{active.buttonLabel || "Buka Undangan"}</span>
                      {active.coverIconPosition === "right" && (
                        <CoverIconGlyph
                          name={active.coverIcon}
                          size={active.coverIconSize}
                        />
                      )}
                    </button>
                    )}
                    <em>
                      *Mohon maaf jika terdapat kesalahan dalam penulisan nama &
                      gelar
                    </em>
                  </div>
                </>
              )}
              {!active && (
                <div className="cover-companion">
                  <small>OUR WEDDING STORY</small>
                  {companions.map((item) => (
                    <div key={item.id}>
                      <FeatureIcon type={item.type} />
                      <strong>{item.title}</strong>
                      <p>{item.body}</p>
                    </div>
                  ))}
                </div>
              )}
              {active && companions.length > 0 && (
                <div className="cover-companion-floating">
                  {companions.slice(0, 2).map((item) => (
                    <div key={item.id}>
                      <FeatureIcon type={item.type} />
                      <span>{item.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div
        className="canvas-decoration-layer"
        aria-hidden="true"
        style={{ pointerEvents: "none" }}
      >
        {section.columns.flatMap((column) =>
          column.features
            .filter(
              (item) =>
                item.freePosition &&
                item.positionScope === "canvas" &&
                [
                  "image",
                  "icon",
                  "text",
                  "heading",
                  "spacer",
                  "divider",
                ].includes(item.type),
            )
            .map((item) => (
              <FeatureBlock
                key={item.id}
                feature={item}
                editable={false}
                selected={false}
                onSelect={() => {}}
                onUpdate={() => {}}
                greetings={[]}
                addGreeting={() => {}}
                guests={[]}
                addGuest={() => {}}
                canvasId={section.id}
              />
            )),
        )}
      </div>
      <div className="cover-orb one" />
      <div className="cover-orb two" />
    </section>
  );
}

function FeatureBlock({
  feature: rawFeature,
  editable,
  selected,
  onSelect,
  onUpdate,
  greetings,
  addGreeting,
  guests,
  addGuest,
  inviteeName,
  canvasId,
}: {
  feature: Feature;
  editable: boolean;
  selected: boolean;
  onSelect: () => void;
  onUpdate: (patch: Partial<Feature>) => void;
  greetings: Greeting[];
  addGreeting: (name: string, message: string) => void;
  guests: Guest[];
  addGuest: (
    name: string,
    status: Guest["status"],
    pax: number,
    canvasId?: string,
  ) => void;
  inviteeName?: string;
  canvasId: string;
}) {
  // QA TC-112: pada mode Mobile, nilai yang dipakai adalah override mobile.
  const device = useContext(DeviceContext);
  const feature = resolveFeature(rawFeature, device);
  // TC-233 — muat font Google yang dipakai fitur ini (sekali per halaman).
  useEffect(() => {
    ensureFont(feature.fontFamily);
    ensureFont(feature.titleFontFamily);
    ensureFont(feature.bodyFontFamily);
  }, [feature.fontFamily, feature.titleFontFamily, feature.bodyFontFamily]);
  const objectStyle: React.CSSProperties =
    feature.type === "invitation-cover"
      ? { width: "100%", alignSelf: "stretch" }
      : feature.freePosition
        ? designerStyle(feature)
        : getFeatureObjectStyle(feature);
  const style: React.CSSProperties = {
    ...objectStyle,
    fontFamily: feature.fontFamily,
    textAlign: feature.align,
    lineHeight: feature.lineHeight,
    color: feature.textColor || defaultFeatureStyle.textColor,
    background: (() => {
      const alpha =
        feature.backgroundOpacity !== undefined
          ? feature.backgroundOpacity / 100
          : undefined;
      return getGradientBackground(
        feature.backgroundGradientEnabled,
        withAlpha(feature.backgroundGradientFrom, alpha),
        withAlpha(feature.backgroundGradientTo || "#d7b66f", alpha),
        feature.backgroundGradientAngle,
        withAlpha(feature.backgroundColor, alpha) || feature.backgroundColor,
      );
    })(),
    ...(feature.boxOpacity !== undefined
      ? { "--box-alpha": feature.boxOpacity / 100 }
      : {}),
    ...(feature.titleFontFamily
      ? { "--title-font": `"${feature.titleFontFamily}"` }
      : {}),
    ...(feature.bodyFontFamily
      ? { "--body-font": `"${feature.bodyFontFamily}"` }
      : {}),
    borderRadius: feature.borderRadius,
    padding: feature.type === "invitation-cover" ? 0 : feature.padding,
    marginTop: feature.margin,
    marginBottom: feature.margin,
    fontWeight: feature.bold ? 700 : 400,
    fontStyle: feature.italic ? "italic" : "normal",
    textDecoration: feature.underline ? "underline" : "none",
    position: feature.freePosition ? "absolute" : "relative",
    ...designerStyle(feature),
    ...(feature.loopEffect && feature.loopEffect !== "none"
      ? ({ "--loop-speed": `${feature.loopSpeed || 6}s` } as React.CSSProperties)
      : {}),
    ...(feature.elementMotion
      ? ({
          "--lm-speed": `${feature.elementMotionSpeed || 6}s`,
        } as React.CSSProperties)
      : {}),
    overflow:
      feature.type === "gallery" && feature.galleryFullWidth
        ? "visible"
        : "hidden",
    // QA TC-117: background image per feature. TC-107: opsi tetap diam saat scroll.
    ...(feature.backgroundImageUrl &&
    feature.backgroundImageOpacity !== undefined &&
    feature.backgroundImageOpacity < 100
      ? {
          "--feature-bg-image": `url(${assetUrl(feature.backgroundImageUrl)})`,
          "--feature-bg-size": feature.backgroundImageSize || "cover",
          "--feature-bg-position": feature.backgroundImagePosition || "center",
          "--feature-bg-opacity": feature.backgroundImageOpacity / 100,
        }
      : feature.backgroundImageUrl
      ? {
          backgroundImage: `url(${assetUrl(feature.backgroundImageUrl)})`,
          backgroundSize: feature.backgroundImageSize || "cover",
          backgroundPosition: feature.backgroundImagePosition || "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: feature.backgroundImageFixed
            ? "fixed"
            : "scroll",
        }
      : {}),
    "--effect-intensity": `${(feature.effectIntensity ?? 55) / 100}`,
  } as unknown as React.CSSProperties;
  // QA TC-080 (header/supporting dapat dihapus + line break), TC-090 (font size
  // non-header), TC-118 (Heading 2 & Supporting Text 2), TC-121/TC-122 (warna per elemen).
  const editableText = (
    field: "title" | "body" | "title2" | "body2",
    className: string,
  ) => {
    if (field === "title" && feature.showTitle === false) return null;
    if (field === "body" && feature.showBody === false) return null;
    if (field === "title2" && !feature.showTitle2) return null;
    if (field === "body2" && !feature.showBody2) return null;
    const sizeMap: Record<typeof field, number | undefined> = {
      title: feature.fontSize,
      body: feature.bodyFontSize,
      title2: feature.title2FontSize,
      body2: feature.body2FontSize,
    };
    const colorMap: Record<typeof field, string | undefined> = {
      title: feature.titleColor,
      body: feature.bodyColor,
      title2: feature.title2Color,
      body2: feature.body2Color,
    };
    const style: React.CSSProperties = {
      whiteSpace: "pre-wrap",
      ...(sizeMap[field] ? { fontSize: sizeMap[field] } : {}),
      ...(colorMap[field] ? { color: colorMap[field] } : {}),
    };
    return (
      <div
        className={className}
        contentEditable={editable && !feature.locked}
        suppressContentEditableWarning
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            document.execCommand("insertLineBreak");
          }
        }}
        // QA 15 Okt — "undo sering gagal". Setiap blur dulu menyimpan, walau
        // teksnya tidak berubah, dan tiap simpanan membuat satu entri undo.
        // Klik masuk-keluar teks saja sudah mengisi riwayat (dibatasi 15)
        // dengan entri kosong: undo pertama "tidak melakukan apa-apa", dan
        // perubahan sungguhan terdorong keluar. Hanya simpan bila berubah.
        onBlur={(event) => {
          const next = (event.currentTarget as HTMLElement).innerText.replace(
            /\n$/,
            "",
          );
          if (next !== (feature[field] ?? "")) onUpdate({ [field]: next });
        }}
        style={style}
      >
        {feature[field]}
      </div>
    );
  };
  // Heading 2 / Supporting Text 2 dirender setelah blok teks utama tiap feature.
  const secondaryTexts =
    feature.showTitle2 || feature.showBody2 ? (
      <div className="secondary-text-stack">
        {editableText("title2", "editable-title editable-title-2")}
        {editableText("body2", "editable-body editable-body-2")}
      </div>
    ) : null;
  const canvasGuests = guests.filter((guest) => guest.canvasId === canvasId);
  return (
    <div
      id={`feature-${feature.id}`}
      draggable={editable && !feature.locked && !feature.freePosition}
      onDragStart={(event) => {
        event.dataTransfer.setData("application/x-ikrarku-feature", feature.id);
        event.dataTransfer.effectAllowed = "move";
      }}
      onClick={(event) => {
        if (editable) {
          event.stopPropagation();
          onSelect();
        }
      }}
      // Revisi QA: "Posisi bebas" dulu hanya bisa digeser lewat tab kecil
      // "move" di atas blok atau tombol arah di panel. Sekarang seluruh blok
      // bisa ditarik langsung di canvas. Teks, tombol, dan input tetap bisa
      // diklik karena drag hanya dimulai dari area non-interaktif dan baru
      // aktif setelah pointer bergerak melewati ambang 4 px.
      onPointerDown={(event) => {
        if (!editable || !feature.freePosition || feature.locked) return;
        if (event.button !== 0) return;
        const target = event.target as HTMLElement;
        if (
          target.closest(
            '[contenteditable="true"],input,textarea,select,button,a,.free-move-handle,.free-resize-handle,.feature-handle',
          )
        )
          return;
        startFreeMove(event, feature, onUpdate, 4);
      }}
      // TC-202 — saat blok diberi tinggi eksplisit lewat posisi bebas, isinya
      // (mis. .image-feature dengan height:320px inline) menahan blok sehingga
      // tidak bisa dikecilkan. Penanda ini membuat isi mengikuti blok.
      data-fixed-height={
        feature.freePosition && feature.boxHeight ? "true" : undefined
      }
      className={`feature-block feature-${feature.type} object-${feature.objectAlign || "stretch"} fx-${feature.entranceEffect} trans-${feature.transition} effect-${feature.visualEffect || "none"} ${feature.backgroundGradientEnabled ? "has-gradient" : ""} ${feature.freePosition ? "free-positioned" : ""} ${feature.hideDesktop ? "designer-hide-desktop" : ""} ${feature.hideMobile ? "designer-hide-mobile" : ""} ${feature.animateOnScroll === false ? "no-scroll-reveal" : ""} loop-${feature.loopEffect || "none"} ${selected ? "selected-feature" : ""} ${feature.backgroundImageUrl && feature.backgroundImageOpacity !== undefined && feature.backgroundImageOpacity < 100 ? "has-bg-fade" : ""} ${feature.titleFontFamily ? "has-title-font" : ""} ${feature.bodyFontFamily ? "has-body-font" : ""} ${elementMotionClasses(feature)}`}
      style={style}
    >
      <FeatureEffect effect={feature.visualEffect || "none"} />
      {editable && (
        <div className="feature-handle">
          <GripVertical size={13} /> {feature.type}
        </div>
      )}
      {feature.type === "text" && (
        <div className="text-feature">
          {editableText("title", "editable-title")}
          {editableText("body", "editable-body")}
        </div>
      )}
      {feature.type === "quote" && (
        <div className="quote-feature">
          <Sparkles size={20} />
          {editableText("title", "editable-title")}
          {editableText("body", "editable-body")}
        </div>
      )}
      {feature.type === "event" && (
        <div className="event-feature">
          <CalendarDays size={25} />
          {editableText("title", "editable-title")}
          {editableText("body", "editable-body")}
          {/* QA TC-119: button lokasi selalu tampil pada section Event. */}
          {(() => {
            const button = mapButtonStyle(feature);
            // Belum diatur: biarkan gaya CSS bawaan, supaya Event lama tidak
            // berubah tampilan setelah pembaruan ini.
            const style = button.customized ? button.style : undefined;
            const className = `event-map-button ${button.customized ? `shape-${button.shape}` : ""}`;
            return feature.eventMapUrl ? (
              <a
                className={className}
                style={style}
                href={feature.eventMapUrl}
                target="_blank"
                rel="noreferrer"
              >
                <MapButtonIcon feature={feature} size={feature.mapButtonIconSize || 14} />
                {feature.eventButtonLabel || "Lihat Lokasi"}
              </a>
            ) : (
              <span
                className={`${className} placeholder`}
                style={style}
                title="Isi Link lokasi acara pada panel Content"
              >
                <MapButtonIcon feature={feature} size={feature.mapButtonIconSize || 14} />
                {feature.eventButtonLabel || "Lihat Lokasi"}
              </span>
            );
          })()}
          <CalendarButtons feature={feature} />
        </div>
      )}
      {feature.type === "gift" && (
        <div className="event-feature">
          <Crown size={25} />
          {editableText("title", "editable-title")}
          {editableText("body", "editable-body")}
          <GiftReveal feature={feature} editable={editable} />
        </div>
      )}
      {feature.type === "invitation-cover" && (
        <div
          className="cover-feature-editor"
          style={{
            background: getGradientBackground(
              feature.backgroundGradientEnabled,
              feature.backgroundGradientFrom,
              feature.backgroundGradientTo,
              feature.backgroundGradientAngle,
              feature.backgroundColor,
            ),
            color: feature.textColor,
          }}
        >
          <div
            className={`cover-editor-bg ${getBackgroundMotionClass(feature.backgroundMotion)}`}
            style={{
              backgroundImage: feature.mediaUrl
                ? `url(${assetUrl(feature.mediaUrl)})`
                : undefined,
              backgroundPosition: feature.backgroundPosition || "center",
              backgroundRepeat: feature.backgroundRepeat || "no-repeat",
              backgroundSize: feature.backgroundSize || "cover",
              filter: getBackgroundFilter(feature.backgroundEffect),
            }}
          />
          <div
            className="cover-editor-overlay"
            style={{ opacity: (feature.overlayOpacity ?? 45) / 100 }}
          />
          <div
            className="cover-editor-content"
            style={{
              ...getCoverContentObjectStyle(feature),
              alignSelf:
                feature.objectAlign === "left"
                  ? "flex-start"
                  : feature.objectAlign === "right"
                    ? "flex-end"
                    : feature.objectAlign === "stretch"
                      ? "stretch"
                      : "center",
              color: feature.textColor,
              textAlign: feature.align,
              alignItems: getCoverContentAlignment(feature.align),
              justifyContent: getCoverVerticalJustify(
                feature.coverVerticalAlign,
              ),
              padding: feature.padding,
              lineHeight: feature.lineHeight,
              fontWeight: feature.bold ? 700 : 400,
              fontStyle: feature.italic ? "italic" : "normal",
              textDecoration: feature.underline ? "underline" : "none",
            }}
          >
            {/* Sama seperti InvitationCover: eyebrow ikut Heading, label &
                nama tamu ikut Supporting, agar editor sama dengan hasil live. */}
            <small
              contentEditable={editable}
              suppressContentEditableWarning
              style={{
                ...(feature.titleColor ? { color: feature.titleColor } : {}),
                ...(feature.eyebrowFontSize
                  ? { fontSize: feature.eyebrowFontSize }
                  : {}),
              }}
              onBlur={(event) => {
                const next = event.currentTarget.textContent || "";
                if (next !== (feature.eyebrowText || "UNDANGAN PERNIKAHAN"))
                  onUpdate({ eyebrowText: next });
              }}
            >
              {feature.eyebrowText || "UNDANGAN PERNIKAHAN"}
            </small>
            {editableText("title", "editable-title")}
            <p
              contentEditable={editable}
              suppressContentEditableWarning
              style={{
                ...(feature.bodyColor ? { color: feature.bodyColor } : {}),
                ...(feature.guestLabelFontSize
                  ? { fontSize: feature.guestLabelFontSize }
                  : {}),
              }}
              onBlur={(event) => {
                const next = event.currentTarget.textContent || "";
                if (
                  next !==
                  (feature.guestLabelText || "Kepada Yth. Bapak/Ibu/Saudara/i")
                )
                  onUpdate({ guestLabelText: next });
              }}
            >
              {feature.guestLabelText || "Kepada Yth. Bapak/Ibu/Saudara/i"}
            </p>
            <strong
              contentEditable={editable}
              suppressContentEditableWarning
              style={{
                ...(feature.bodyColor ? { color: feature.bodyColor } : {}),
                ...(feature.guestNameFontSize
                  ? { fontSize: feature.guestNameFontSize }
                  : {}),
              }}
              onBlur={(event) => {
                const next = event.currentTarget.textContent || "";
                if (
                  next !==
                  (inviteeName || feature.guestNameText || "Tamu Terhormat")
                )
                  onUpdate({ guestNameText: next });
              }}
            >
              {inviteeName || feature.guestNameText || "Tamu Terhormat"}
            </strong>
            {editableText("body", "editable-body")}
            <button
              type="button"
              className={`cover-open-button icon-${feature.coverIconPosition || "left"}${feature.coverButtonMode === "slide" ? " is-slide-preview" : ""}`}
              style={{
                borderRadius: feature.coverButtonRadius ?? 12,
                borderWidth: feature.coverButtonBorderWidth ?? 1,
                borderColor: feature.coverButtonBorderColor || "#fff",
                background: feature.coverButtonBackground || "#102f27",
                color: feature.coverButtonTextColor || "#fff",
                padding: `${feature.coverButtonPaddingY ?? 15}px ${feature.coverButtonPaddingX ?? 30}px`,
              }}
            >
              {feature.coverIconPosition === "top" && (
                <CoverIconGlyph
                  name={feature.coverIcon}
                  size={feature.coverIconSize}
                />
              )}{" "}
              {feature.coverIconPosition !== "top" &&
                feature.coverIconPosition !== "right" && (
                  <CoverIconGlyph
                    name={feature.coverIcon}
                    size={feature.coverIconSize}
                  />
                )}
              <span
                contentEditable={editable}
                suppressContentEditableWarning
                onBlur={(event) => {
                  const next = event.currentTarget.textContent || "";
                  if (next !== (feature.buttonLabel || "Buka Undangan"))
                    onUpdate({ buttonLabel: next });
                }}
              >
                {feature.buttonLabel || "Buka Undangan"}
              </span>
              {feature.coverIconPosition === "right" && (
                <CoverIconGlyph
                  name={feature.coverIcon}
                  size={feature.coverIconSize}
                />
              )}
            </button>
          </div>
        </div>
      )}
      {feature.type === "countdown" && (
        <div
          className={`save-the-date-wrap std-${feature.saveTheDateStyle || "classic"}`}
        >
          {editableText("title", "editable-title")}
          <CountdownFeature feature={feature} />
          {editableText("body", "editable-body")}
        </div>
      )}
      {feature.type === "location" && (
        <>
          <LocationFeature feature={feature} />
          {feature.locationNoteText && (
            <p className="location-extra-note">{feature.locationNoteText}</p>
          )}
        </>
      )}
      {feature.type === "image" && (
        <ImageLayoutFeature feature={feature} editableText={editableText} />
      )}
      {feature.type === "video" && <VideoFeature feature={feature} />}
      {feature.type === "gallery" && <GalleryFeature feature={feature} />}
      {feature.type === "form" && (
        <CanvasForm
          feature={feature}
          guests={canvasGuests}
          addGuest={(name, status, pax) =>
            addGuest(name, status, pax, canvasId)
          }
        />
      )}
      {feature.type === "greetings" && (
        <GreetingsWidget
          feature={feature}
          greetings={greetings}
          addGreeting={addGreeting}
          compact
        />
      )}
      {feature.type === "icon" && <IconFeature feature={feature} />}
      {/* QA TC-120: section Love Story. */}
      {feature.type === "love-story" && (
        <LoveStoryFeature
          feature={feature}
          editable={editable}
          onUpdate={onUpdate}
          editableText={editableText}
        />
      )}
      {/* QA TC-123: credit / watermark halaman penutup. */}
      {feature.type === "credit" && (
        <CreditFeature feature={feature} editableText={editableText} />
      )}
      {/* TC-235 — Live Streaming. */}
      {feature.type === "live-stream" && (
        <LiveStreamFeature feature={feature} editableText={editableText} />
      )}
      {feature.type === "sound" && editable && (
        <SoundFeature feature={feature} />
      )}
      {/* QA TC-118: Heading 2 & Supporting Text 2 tersedia di setiap feature. */}
      {secondaryTexts}
      <ExtraTextBlocks
        feature={feature}
        editable={editable}
        onUpdate={onUpdate}
      />
      {/* QA TC-116: resize box langsung dari sudut walau tidak memakai posisi bebas. */}
      {editable && !feature.freePosition && !feature.locked && selected && (
        <span
          className="box-resize-handle"
          title="Tarik untuk mengubah lebar & tinggi box"
          onPointerDown={(event) => startBoxResize(event, feature, onUpdate)}
        />
      )}
      {editable && feature.freePosition && !feature.locked && (
        <span
          className="free-resize-handle"
          onPointerDown={(event) => startFreeResize(event, feature, onUpdate)}
          title="Resize bebas"
        />
      )}
      {editable && feature.freePosition && !feature.locked && (
        <span
          className="free-move-handle"
          onPointerDown={(event) => startFreeMove(event, feature, onUpdate)}
          title="Geser bebas"
        >
          <MousePointer2 size={11} /> move
        </span>
      )}
    </div>
  );
}


// QA TC-120 — section Love Story: beberapa box teks + gambar dan background sendiri.
function LoveStoryFeature({
  feature,
  editable,
  onUpdate,
  editableText,
}: {
  feature: Feature;
  editable: boolean;
  onUpdate: (patch: Partial<Feature>) => void;
  editableText: (
    field: "title" | "body" | "title2" | "body2",
    className: string,
  ) => React.ReactNode;
}) {
  const items = feature.loveStoryItems || [];
  const patchItem = (id: string, next: Partial<LoveStoryItem>) =>
    onUpdate({
      loveStoryItems: items.map((item) =>
        item.id === id ? { ...item, ...next } : item,
      ),
    });
  return (
    <div className={`love-story-feature layout-${feature.loveStoryLayout || "timeline"}`}>
      {editableText("title", "editable-title")}
      {editableText("body", "editable-body")}
      <div className="love-story-track">
        {items.map((item) => (
          <article
            key={item.id}
            className="love-story-item"
            style={giftCardStyle(feature)}
          >
            {item.imageUrl && (
              <div className="love-story-image">
                <img
                  src={assetUrl(item.imageUrl)}
                  alt={item.title}
                  loading="lazy"
                />
              </div>
            )}
            <div className="love-story-copy">
              <span className="love-story-year">{item.year}</span>
              <strong
                contentEditable={editable && !feature.locked}
                suppressContentEditableWarning
                onBlur={(event) => {
                  const next = (event.currentTarget as HTMLElement).innerText.trim();
                  if (next !== (item.title ?? "")) patchItem(item.id, { title: next });
                }}
                style={{
                  fontSize: feature.fontSize ? feature.fontSize * 0.45 : undefined,
                  color: feature.titleColor || undefined,
                }}
              >
                {item.title}
              </strong>
              <p
                contentEditable={editable && !feature.locked}
                suppressContentEditableWarning
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    document.execCommand("insertLineBreak");
                  }
                }}
                onBlur={(event) => {
                  const next = (event.currentTarget as HTMLElement).innerText.replace(
                    /\n$/,
                    "",
                  );
                  if (next !== (item.body ?? "")) patchItem(item.id, { body: next });
                }}
                style={{
                  whiteSpace: "pre-wrap",
                  ...(feature.bodyFontSize ? { fontSize: feature.bodyFontSize } : {}),
                  ...(feature.bodyColor ? { color: feature.bodyColor } : {}),
                }}
              >
                {item.body}
              </p>
            </div>
          </article>
        ))}
        {!items.length && (
          <div className="media-placeholder">
            <BookOpen size={24} />
            <strong>Love Story</strong>
            <span>Tambahkan cerita melalui panel Content</span>
          </div>
        )}
      </div>
    </div>
  );
}

/** TC-237 — tombol "geser untuk membuka". Bisa digeser dengan sentuhan/mouse,
 *  atau ditekan Enter/Spasi untuk aksesibilitas. */
function SlideToOpen({
  label,
  style,
  onOpen,
}: {
  label: string;
  style?: React.CSSProperties;
  onOpen?: () => void;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const startRef = useRef<{ x: number; max: number } | null>(null);
  const [offset, setOffset] = useState(0);
  const [done, setDone] = useState(false);
  const finish = () => {
    setDone(true);
    window.setTimeout(() => onOpen?.(), 180);
  };
  const onDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (done) return;
    const track = trackRef.current;
    if (!track) return;
    const knob = event.currentTarget;
    startRef.current = {
      x: event.clientX - offset,
      max: Math.max(0, track.clientWidth - knob.offsetWidth - 8),
    };
    knob.setPointerCapture?.(event.pointerId);
  };
  const onMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const start = startRef.current;
    if (!start) return;
    setOffset(Math.min(start.max, Math.max(0, event.clientX - start.x)));
  };
  const onUp = () => {
    const start = startRef.current;
    startRef.current = null;
    if (!start) return;
    if (start.max > 0 && offset >= start.max * 0.85) {
      setOffset(start.max);
      finish();
    } else setOffset(0);
  };
  return (
    <div
      ref={trackRef}
      className={`cover-slide-track ${done ? "is-done" : ""}`}
      // Revisi 24 Okt — padding tombol klik (mis. 15px 30px) tidak dipakai
      // pada slider: dulu ditambahkan di luar lebar 320 px sehingga slider
      // melebar keluar kolom sempit (tata letak 70/30 / Mobile) dan terpotong.
      style={{ ...style, padding: undefined }}
    >
      <span className="cover-slide-label">{label}</span>
      <button
        type="button"
        className="cover-slide-knob"
        aria-label={`Geser untuk ${label.toLowerCase()}`}
        style={{ transform: `translateX(${offset}px)` }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            finish();
          }
        }}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

/** TC-235 — kenali platform siaran dan alamat embed YouTube. */
function liveStreamInfo(url = "") {
  const value = url.trim();
  let host = "";
  try {
    host = new URL(value).hostname.replace(/^www\./, "");
  } catch {
    host = "";
  }
  const yt =
    value.match(
      /(?:youtube\.com\/(?:watch\?v=|live\/|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/,
    )?.[1] || "";
  const platform = yt || host.endsWith("youtube.com") || host === "youtu.be"
    ? "YouTube"
    : host.endsWith("instagram.com")
      ? "Instagram"
      : host.endsWith("zoom.us")
        ? "Zoom"
        : host === "meet.google.com"
          ? "Google Meet"
          : host.endsWith("tiktok.com")
            ? "TikTok"
            : host.endsWith("facebook.com") || host === "fb.watch"
              ? "Facebook"
              : host
                ? "Link siaran"
                : "";
  const safe = /^https?:\/\//i.test(value) ? value : "";
  return {
    platform,
    href: safe,
    embed: yt ? `https://www.youtube.com/embed/${yt}` : "",
  };
}

function LiveStreamFeature({
  feature,
  editableText,
}: {
  feature: Feature;
  editableText: (
    field: "title" | "body" | "title2" | "body2",
    className: string,
  ) => React.ReactNode;
}) {
  const info = liveStreamInfo(feature.liveUrl);
  const when = feature.liveSchedule ? new Date(feature.liveSchedule) : null;
  const whenText =
    when && !Number.isNaN(when.getTime())
      ? when.toLocaleString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }) + " WIB"
      : "";
  return (
    <div className="live-stream-feature">
      <span className="live-badge">
        <Radio size={13} /> LIVE
      </span>
      {editableText("title", "editable-title")}
      {editableText("body", "editable-body")}
      {whenText && <p className="live-when">{whenText}</p>}
      {feature.liveEmbed !== false && info.embed ? (
        <div className="live-embed">
          <iframe
            src={info.embed}
            title={feature.title || "Live streaming"}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : null}
      {info.href ? (
        <a
          className="live-button"
          href={info.href}
          target="_blank"
          rel="noreferrer"
          style={giftCardStyle(feature)}
        >
          <PlayCircle size={16} />
          {feature.liveButtonLabel || "Tonton Live"}
          {info.platform && <small>{info.platform}</small>}
        </a>
      ) : (
        <p className="live-empty">Tautan siaran belum diisi.</p>
      )}
    </div>
  );
}

function LiveStreamEditor({
  feature,
  update,
}: {
  feature: Feature;
  update: (patch: Partial<Feature>) => void;
}) {
  const info = liveStreamInfo(feature.liveUrl);
  return (
    <div className="credit-editor live-stream-editor">
      <label>
        Tautan live streaming
        <input
          type="url"
          placeholder="https://youtube.com/live/… · instagram.com/… · zoom.us/j/…"
          value={feature.liveUrl || ""}
          onChange={(event) => update({ liveUrl: event.target.value })}
        />
      </label>
      {feature.liveUrl && (
        <small className="field-hint">
          {info.href
            ? `Terdeteksi: ${info.platform}${info.embed ? " · bisa di-embed" : ""}`
            : "Tautan harus diawali https://"}
        </small>
      )}
      <label>
        Jadwal siaran
        <input
          type="datetime-local"
          value={feature.liveSchedule || ""}
          onChange={(event) => update({ liveSchedule: event.target.value })}
        />
      </label>
      <label>
        Label tombol
        <input
          value={feature.liveButtonLabel || ""}
          placeholder="Tonton Live"
          onChange={(event) => update({ liveButtonLabel: event.target.value })}
        />
      </label>
      <div className="setting-row compact">
        <span>
          <strong>Tampilkan pemutar YouTube</strong>
          <small>Tautan YouTube diputar langsung di undangan.</small>
        </span>
        <button
          className={`toggle ${feature.liveEmbed !== false ? "on" : ""}`}
          aria-pressed={feature.liveEmbed !== false}
          aria-label="Tampilkan pemutar YouTube"
          onClick={() => update({ liveEmbed: feature.liveEmbed === false })}
        >
          <i />
        </button>
      </div>
    </div>
  );
}

// QA TC-123 — credit / watermark pada halaman penutup undangan.
/** TC-234 — Credit yang dipasang "paling bawah" dilepas dari canvas-nya dan
 *  dirender sekali di akhir undangan, tanpa padding/min-height canvas. */
const isPinnedCredit = (feature: Feature) =>
  feature.type === "credit" && feature.creditPinBottom !== false;

function CreditFeature({
  feature,
  editableText,
}: {
  feature: Feature;
  editableText: (
    field: "title" | "body" | "title2" | "body2",
    className: string,
  ) => React.ReactNode;
}) {
  // QA TC-165: pemutar backsound kini menyatu dengan watermark, bukan feature
  // Sound terpisah, sehingga judul lagu hanya muncul di satu tempat.
  const hasAudio = Boolean(feature.mediaUrl || feature.soundPreset);
  const playerRef = useRef<{ stop: () => void } | null>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => () => playerRef.current?.stop(), []);
  const toggleAudio = () => {
    if (playing) {
      playerRef.current?.stop();
      playerRef.current = null;
      setPlaying(false);
      return;
    }
    playerRef.current = createSoundPlayback(feature, true);
    setPlaying(true);
  };
  return (
    <div className="credit-feature">
      {editableText("title", "editable-title")}
      {editableText("body", "editable-body")}
      <div
        className="credit-meta"
        style={{
          ...giftCardStyle(feature),
          ...(feature.creditFontSize ? { fontSize: feature.creditFontSize } : {}),
        }}
      >
        {feature.creditSongTitle && (
          <span
            className="credit-song"
            style={
              feature.creditMusicColor
                ? { color: feature.creditMusicColor, opacity: 1 }
                : undefined
            }
          >
            {feature.creditMusicIcon === "none" ? null : feature.creditMusicIcon ===
              "note" ? (
              <Music2 size={feature.creditMusicIconSize || 14} />
            ) : (
              <Disc3
                size={feature.creditMusicIconSize || 14}
                className={playing ? "spinning" : ""}
              />
            )}{" "}
            {feature.creditSongTitle}
          </span>
        )}
        {hasAudio && (
          <button
            type="button"
            className="credit-audio-toggle"
            onClick={toggleAudio}
            title={playing ? "Hentikan backsound" : "Putar backsound"}
            style={
              {
                ...(feature.creditMusicColor
                  ? { color: feature.creditMusicColor }
                  : {}),
                ...(feature.creditMusicIconSize
                  ? {
                      width: feature.creditMusicIconSize + 12,
                      height: feature.creditMusicIconSize + 12,
                    }
                  : {}),
              } as React.CSSProperties
            }
          >
            {playing ? (
              <VolumeX size={feature.creditMusicIconSize || 14} />
            ) : (
              <Volume2 size={feature.creditMusicIconSize || 14} />
            )}
          </button>
        )}
        <span
          className={`credit-created text-${feature.creditTextStyle || "normal"}`}
        >
          {feature.creditLink ? (
            <a href={feature.creditLink} target="_blank" rel="noreferrer">
              {feature.creditText || "Created by ikrarku"}
            </a>
          ) : (
            feature.creditText || "Created by ikrarku"
          )}
        </span>
      </div>
    </div>
  );
}


// QA TC-116 — resize box teks/feature dengan click & drag dari sudut kanan bawah.
function startBoxResize(
  event: React.PointerEvent,
  feature: Feature,
  onUpdate: (patch: Partial<Feature>) => void,
) {
  event.preventDefault();
  event.stopPropagation();
  const block = (event.currentTarget as HTMLElement).closest(
    ".feature-block",
  ) as HTMLElement | null;
  const column = block?.closest(".canvas-column") as HTMLElement | null;
  if (!block || !column) return;
  const columnRect = column.getBoundingClientRect();
  const blockRect = block.getBoundingClientRect();
  const startX = event.clientX;
  const startY = event.clientY;
  const baseWidth =
    feature.objectWidth ??
    Math.round((blockRect.width / Math.max(1, columnRect.width)) * 100);
  const baseHeight = feature.imageHeight || feature.boxHeight || blockRect.height;
  const move = (moveEvent: PointerEvent) => {
    const widthRatio =
      ((moveEvent.clientX - startX) / Math.max(1, columnRect.width)) * 100;
    const patch: Partial<Feature> = {
      objectAlign: feature.objectAlign === "stretch" ? "center" : feature.objectAlign,
      objectWidth: Math.round(
        Math.min(100, Math.max(10, baseWidth + widthRatio)),
      ),
    };
    const nextHeight = Math.round(
      Math.max(40, baseHeight + (moveEvent.clientY - startY)),
    );
    if (feature.type === "image" || feature.type === "gallery")
      patch.imageHeight = nextHeight;
    else patch.boxHeight = nextHeight;
    onUpdate(patch);
  };
  const up = () => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
  };
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
}

// QA TC-113 — garis guide/margin yang dapat di-drag untuk mengubah padding X.
function CanvasGuides({
  section,
  onChange,
}: {
  section: CanvasSection;
  onChange: (patch: Partial<CanvasSection>) => void;
}) {
  const padding = section.paddingX ?? 32;
  const drag = (event: React.PointerEvent, side: "left" | "right") => {
    event.preventDefault();
    event.stopPropagation();
    const host = (event.currentTarget as HTMLElement).closest(
      ".canvas-section",
    ) as HTMLElement | null;
    if (!host) return;
    const startX = event.clientX;
    const base = padding;
    const move = (moveEvent: PointerEvent) => {
      const delta =
        side === "left" ? moveEvent.clientX - startX : startX - moveEvent.clientX;
      onChange({ paddingX: Math.round(Math.min(320, Math.max(0, base + delta))) });
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  return (
    <div className="canvas-guides" aria-hidden>
      <span
        className="canvas-guide left"
        style={{ left: padding }}
        onPointerDown={(event) => drag(event, "left")}
        title={`Margin kiri ${padding}px — tarik untuk mengubah`}
      />
      <span
        className="canvas-guide right"
        style={{ right: padding }}
        onPointerDown={(event) => drag(event, "right")}
        title={`Margin kanan ${padding}px — tarik untuk mengubah`}
      />
      <span className="canvas-guide-label" style={{ left: padding + 6 }}>
        {padding}px
      </span>
    </div>
  );
}

// QA TC-115 — ubah tinggi section dengan menarik border bawah.
function startSectionResize(
  event: React.PointerEvent,
  section: CanvasSection,
  onChange: (patch: Partial<CanvasSection>) => void,
) {
  event.preventDefault();
  event.stopPropagation();
  const host = (event.currentTarget as HTMLElement).closest(
    ".canvas-section",
  ) as HTMLElement | null;
  if (!host) return;
  const startY = event.clientY;
  const base = section.minHeight || host.getBoundingClientRect().height;
  const move = (moveEvent: PointerEvent) => {
    onChange({
      minHeight: Math.round(
        Math.min(2400, Math.max(160, base + (moveEvent.clientY - startY))),
      ),
    });
  };
  const up = () => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
  };
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
}

// QA TC-114 — ubah lebar kolom dengan menarik garis grid di antara dua kolom.
function ColumnGridHandle({
  section,
  index,
  onChange,
}: {
  section: CanvasSection;
  index: number;
  onChange: (patch: Partial<CanvasSection>) => void;
}) {
  const widths =
    section.columnWidths && section.columnWidths.length === section.columns.length
      ? [...section.columnWidths]
      : section.columns.map(() => 1);
  const drag = (event: React.PointerEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const grid = (event.currentTarget as HTMLElement).closest(
      ".canvas-columns",
    ) as HTMLElement | null;
    if (!grid) return;
    const rect = grid.getBoundingClientRect();
    const startX = event.clientX;
    const left = widths[index];
    const right = widths[index + 1];
    const pair = left + right;
    const move = (moveEvent: PointerEvent) => {
      const ratio = (moveEvent.clientX - startX) / Math.max(1, rect.width);
      const nextLeft = Math.min(
        pair - 0.2,
        Math.max(0.2, left + ratio * section.columns.length),
      );
      const next = [...widths];
      next[index] = Math.round(nextLeft * 100) / 100;
      next[index + 1] = Math.round((pair - nextLeft) * 100) / 100;
      onChange({ columnWidths: next });
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  return (
    <span
      className="column-grid-handle"
      onPointerDown={drag}
      title="Tarik untuk mengatur lebar kolom"
    />
  );
}

function FeatureEffect({ effect }: { effect: string }) {
  if (!effect || effect === "none") return null;
  const items = Array.from({ length: effect === "confetti" ? 18 : 10 });
  return (
    <div className={`feature-effect-layer ${effect}`} aria-hidden>
      {items.map((_, index) => (
        <i key={index} style={{ "--i": index } as React.CSSProperties} />
      ))}
    </div>
  );
}

function CountdownFeature({ feature }: { feature: Feature }) {
  const getTime = () => {
    const target = new Date(feature.eventDate || "2026-08-20T09:00").getTime();
    const distance = Math.max(0, target - Date.now());
    return {
      days: Math.floor(distance / 86400000),
      hours: Math.floor((distance / 3600000) % 24),
      minutes: Math.floor((distance / 60000) % 60),
      seconds: Math.floor((distance / 1000) % 60),
    };
  };
  const [time, setTime] = useState(getTime);
  useEffect(() => {
    const tick = () => {
      const target = new Date(
        feature.eventDate || "2026-08-20T09:00",
      ).getTime();
      const distance = Math.max(0, target - Date.now());
      setTime({
        days: Math.floor(distance / 86400000),
        hours: Math.floor((distance / 3600000) % 24),
        minutes: Math.floor((distance / 60000) % 60),
        seconds: Math.floor((distance / 1000) % 60),
      });
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [feature.eventDate]);
  return (
    <div
      className="countdown-feature"
      style={
        feature.countdownScale
          ? ({ "--cd-scale": feature.countdownScale / 100 } as React.CSSProperties)
          : undefined
      }
    >
      <small>SAVE THE DATE</small>
      {/* QA TC-110: heading & supporting text dirender sekali saja oleh
          FeatureBlock agar tidak dobel dan tetap bisa dihapus dari inspector. */}
      <div>
        {[
          ["Hari", time.days],
          ["Jam", time.hours],
          ["Menit", time.minutes],
          ["Detik", time.seconds],
        ].map(([label, value]) => (
          <span key={label}>
            <strong>{String(value).padStart(2, "0")}</strong>
            <em>{label}</em>
          </span>
        ))}
      </div>
      <CalendarButtons feature={feature} />
    </div>
  );
}

/** TC-236 — "Simpan Tanggal": Google Calendar (web/Android) dan berkas .ics
 *  (iPhone, Outlook, kalender lain). Tampil bila tanggal acara sudah diisi
 *  dan tidak dimatikan Web Designer. */
function CalendarButtons({ feature }: { feature: Feature }) {
  if (feature.calendarButton === false || !feature.eventDate) return null;
  const start = new Date(feature.eventDate);
  if (Number.isNaN(start.getTime())) return null;
  const hours = Math.max(0.5, feature.calendarDurationHours ?? 2);
  const end = new Date(start.getTime() + hours * 3600_000);
  // Waktu lokal penulis undangan (tanpa zona), dikunci ke WIB lewat ctz.
  const local = (date: Date) =>
    `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}T${String(date.getHours()).padStart(2, "0")}${String(date.getMinutes()).padStart(2, "0")}00`;
  const title =
    (feature.type === "countdown" ? feature.title2 : undefined) ||
    feature.title ||
    "Acara Pernikahan";
  const details = feature.body || "";
  const location = feature.eventMapUrl || feature.locationAddress || "";
  const google =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(title)}` +
    `&dates=${local(start)}/${local(end)}` +
    `&ctz=Asia/Jakarta` +
    `&details=${encodeURIComponent(details)}` +
    (location ? `&location=${encodeURIComponent(location)}` : "");
  const downloadIcs = () => {
    const escape = (value: string) =>
      value.replace(/\\/g, "\\\\").replace(/[,;]/g, "\\$&").replace(/\n/g, "\\n");
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//ikrarku//Undangan//ID",
      "BEGIN:VEVENT",
      `UID:${feature.id}@ikrarku.id`,
      `DTSTAMP:${local(new Date())}`,
      `DTSTART;TZID=Asia/Jakarta:${local(start)}`,
      `DTEND;TZID=Asia/Jakarta:${local(end)}`,
      `SUMMARY:${escape(title)}`,
      details ? `DESCRIPTION:${escape(details)}` : "",
      location ? `LOCATION:${escape(location)}` : "",
      "END:VEVENT",
      "END:VCALENDAR",
    ]
      .filter(Boolean)
      .join("\r\n");
    const url = URL.createObjectURL(
      new Blob([ics], { type: "text/calendar;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "simpan-tanggal.ics";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const button = mapButtonStyle(feature);
  return (
    <div className="calendar-buttons">
      <a
        className={`calendar-button ${button.customized ? `shape-${button.shape}` : ""}`}
        style={button.customized ? button.style : undefined}
        href={google}
        target="_blank"
        rel="noreferrer"
        onClick={(event) => event.stopPropagation()}
      >
        <CalendarPlus size={14} /> {feature.calendarLabel || "Simpan Tanggal"}
      </a>
      <button
        type="button"
        className="calendar-ics"
        onClick={(event) => {
          event.stopPropagation();
          downloadIcs();
        }}
        title="Untuk iPhone, Outlook, atau aplikasi kalender lain"
      >
        iPhone / Outlook (.ics)
      </button>
    </div>
  );
}

/** Pengaturan tombol Simpan Tanggal di panel Content. */
function CalendarButtonEditor({
  feature,
  update,
}: {
  feature: Feature;
  update: (patch: Partial<Feature>) => void;
}) {
  return (
    <div className="calendar-button-editor">
      <div className="setting-row compact">
        <span>
          <strong>Tombol Simpan Tanggal</strong>
          <small>Menambahkan acara ke kalender tamu (Google / iPhone / Outlook).</small>
        </span>
        <button
          className={`toggle ${feature.calendarButton !== false ? "on" : ""}`}
          aria-pressed={feature.calendarButton !== false}
          aria-label="Tombol Simpan Tanggal"
          onClick={() =>
            update({ calendarButton: feature.calendarButton === false })
          }
        >
          <i />
        </button>
      </div>
      {feature.calendarButton !== false && (
        <>
          <label>
            Label tombol
            <input
              value={feature.calendarLabel || ""}
              placeholder="Simpan Tanggal"
              onChange={(event) => update({ calendarLabel: event.target.value })}
            />
          </label>
          <label>
            Durasi acara: {feature.calendarDurationHours ?? 2} jam
            <input
              type="range"
              min={1}
              max={12}
              value={feature.calendarDurationHours ?? 2}
              onChange={(event) =>
                update({ calendarDurationHours: Number(event.target.value) })
              }
            />
          </label>
          {!feature.eventDate && (
            <small className="field-hint">
              Isi Tanggal & waktu acara agar tombol tampil.
            </small>
          )}
        </>
      )}
    </div>
  );
}

/**
 * Gaya tombol lokasi (QA TC-124). Dipakai fitur Lokasi DAN Event: tombol
 * "Lihat Lokasi" pada Event dulu tidak bisa diatur warna, bentuk, maupun
 * ikonnya (QA 15 Okt), padahal fitur Lokasi sudah bisa.
 *
 * `customized` false berarti Web Designer belum menyentuh pengaturan apa pun:
 * tombol Event lama tetap memakai gaya CSS bawaannya, tidak berubah tampilan.
 */
function mapButtonStyle(feature: Feature): {
  shape: NonNullable<Feature["mapButtonShape"]>;
  style: React.CSSProperties;
  customized: boolean;
} {
  const shape = feature.mapButtonShape || "rounded";
  const customized = Boolean(
    feature.mapButtonShape ||
      feature.mapButtonBackground ||
      feature.mapButtonTextColor ||
      feature.mapButtonRadius !== undefined ||
      feature.mapButtonBorderWidth !== undefined ||
      feature.mapButtonFontSize !== undefined,
  );
  const style: React.CSSProperties = {
    background:
      shape === "outline"
        ? "transparent"
        : feature.mapButtonBackground || "var(--accent, #125946)",
    color:
      shape === "outline"
        ? feature.mapButtonTextColor || feature.mapButtonBackground || "#125946"
        : feature.mapButtonTextColor || "#ffffff",
    borderRadius:
      shape === "pill" ? 999 : shape === "square" ? 0 : (feature.mapButtonRadius ?? 8),
    borderStyle: "solid",
    borderWidth:
      shape === "outline" ? (feature.mapButtonBorderWidth ?? 1) || 1 : (feature.mapButtonBorderWidth ?? 0),
    borderColor:
      feature.mapButtonBorderColor ||
      feature.mapButtonBackground ||
      "var(--accent, #125946)",
    ...(feature.mapButtonFontSize
      ? {
          fontSize: feature.mapButtonFontSize,
          padding: `${Math.round(feature.mapButtonFontSize * 0.75)}px ${Math.round(feature.mapButtonFontSize * 1.5)}px`,
        }
      : {}),
  };
  return { shape, style, customized };
}

function MapButtonIcon({ feature, size }: { feature: Feature; size: number }) {
  switch (feature.mapButtonIcon) {
    case "none":
      return null;
    case "navigation":
      return <Navigation size={size} />;
    case "map":
      return <MapIcon size={size} />;
    case "external":
      return <ExternalLink size={size} />;
    default:
      return <MapPin size={size} />;
  }
}

function LocationFeature({ feature }: { feature: Feature }) {
  const mapUrl = feature.mapUrl || "https://maps.google.com";
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=210x210&margin=8&data=${encodeURIComponent(mapUrl)}`;
  const { shape, style: buttonStyle } = mapButtonStyle(feature);
  // QA TC-132: QR diberi container sendiri agar tidak terpotong di mobile.
  // QR bersifat opsional karena fungsinya sama dengan tombol Buka Google Maps —
  // default-nya peta embed, QR dinyalakan hanya bila memang dibutuhkan.
  const showQr = feature.showLocationQr === true;
  const showEmbed = feature.showMapEmbed !== false;
  const embedSource = feature.mapUrl
    ? `https://www.google.com/maps?q=${encodeURIComponent(
        feature.locationAddress || feature.locationName || feature.mapUrl,
      )}&output=embed`
    : "";
  return (
    <div
      className={`location-feature ${showQr ? "" : "no-qr"} ${showEmbed ? "has-embed" : ""}`}
    >
      <div>
        <MapPin size={27} />
        <small>LOCATION</small>
        <h3>{feature.locationName || feature.title}</h3>
        <p>{feature.locationAddress || feature.body}</p>
        <a
          className={`location-map-button shape-${shape}`}
          style={buttonStyle}
          href={mapUrl}
          target="_blank"
          rel="noreferrer"
        >
          <MapButtonIcon feature={feature} size={feature.mapButtonIconSize || 15} />{" "}
          {feature.mapButtonLabel || "Buka Google Maps"}
        </a>
      </div>
      {showEmbed && (
        <div
          className="location-map-embed"
          style={{ height: feature.mapEmbedHeight || 260 }}
        >
          {embedSource ? (
            <iframe
              title={`Peta ${feature.locationName || feature.title}`}
              src={embedSource}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          ) : (
            <div className="media-placeholder">
              <MapPin size={22} />
              <strong>Preview peta</strong>
              <span>Isi Link Google Maps pada panel Content</span>
            </div>
          )}
        </div>
      )}
      {showQr && (
        <div className="location-qr">
          <div className="location-qr-frame">
            <img src={qrUrl} alt="QR Google Maps" loading="lazy" />
          </div>
          <span>Scan lokasi</span>
        </div>
      )}
    </div>
  );
}

/** Gaya satu gambar galeri: mode potong/utuh dan titik fokus per gambar. */
function galleryImageStyle(
  feature: Feature,
  index: number,
): React.CSSProperties {
  const offset = feature.galleryOffsets?.[index];
  return {
    objectFit: feature.galleryFit === "contain" ? "contain" : "cover",
    objectPosition: `${offset?.x ?? 50}% ${offset?.y ?? 50}%`,
  };
}

/** TC-229 — kelas & variabel CSS untuk tinggi/jarak foto galeri. */
function galleryBoxProps(feature: Feature, base: string) {
  const auto = feature.galleryHeightMode === "auto";
  const height = !auto && feature.galleryImageHeight;
  return {
    className: `${base} ${feature.galleryFullWidth ? "full-width" : ""} ${auto ? "h-auto" : ""} ${height ? "has-h" : ""}`,
    style: {
      ...(height ? { "--g-h": `${height}px` } : {}),
      ...(feature.galleryGap !== undefined
        ? { "--g-gap": `${feature.galleryGap}px` }
        : {}),
    } as React.CSSProperties,
  };
}

function GalleryFeature({ feature }: { feature: Feature }) {
  const [activeIndex, setActiveIndex] = useState(0);
  // Galeri bisa menyimpan path relatif dari upload lama; assetUrl membuat
  // keduanya (relatif maupun absolut) tetap tampil di preview dan di publik.
  const images = (feature.galleryUrls || []).map((url) => assetUrl(url));
  useEffect(() => {
    if (activeIndex >= images.length)
      setActiveIndex(Math.max(0, images.length - 1));
  }, [images.length, activeIndex]);
  useEffect(() => {
    if (
      feature.galleryStyle !== "carousel" ||
      !feature.galleryAutoplay ||
      images.length < 2
    )
      return;
    const timer = window.setInterval(
      () => setActiveIndex((previous) => (previous + 1) % images.length),
      Math.max(2600, (feature.galleryTransitionMs || 850) + 1400),
    );
    return () => window.clearInterval(timer);
  }, [
    feature.galleryAutoplay,
    feature.galleryStyle,
    feature.galleryTransitionMs,
    images.length,
  ]);
  if (!images.length)
    return (
      <div className="media-placeholder">
        <ImageIcon size={28} />
        <strong>Gallery Feature</strong>
        <span>Upload image maksimal 2 MB per file</span>
      </div>
    );
  if (feature.galleryStyle === "carousel")
    return (
      <div {...galleryBoxProps(feature, "gallery-carousel")}>
        <div
          className="gallery-carousel-track"
          style={{
            transform: `translateX(-${activeIndex * 100}%)`,
            transitionDuration: `${feature.galleryTransitionMs || 850}ms`,
          }}
        >
          {images.map((url, index) => (
            <div className="gallery-carousel-slide" key={`${url}-${index}`}>
              <img
                src={url}
                alt={`Gallery ${index + 1}`}
                style={galleryImageStyle(feature, index)}
              />
            </div>
          ))}
        </div>
        <button
          className="carousel-prev"
          onClick={(event) => {
            event.stopPropagation();
            setActiveIndex(
              (previous) => (previous - 1 + images.length) % images.length,
            );
          }}
        >
          <ChevronLeft size={18} />
        </button>
        <button
          className="carousel-next"
          onClick={(event) => {
            event.stopPropagation();
            setActiveIndex((previous) => (previous + 1) % images.length);
          }}
        >
          <ChevronRight size={18} />
        </button>
        <div className="carousel-dots">
          {images.map((_, index) => (
            <button
              key={index}
              className={activeIndex === index ? "active" : ""}
              onClick={(event) => {
                event.stopPropagation();
                setActiveIndex(index);
              }}
            />
          ))}
        </div>
      </div>
    );
  if (feature.galleryStyle === "filmstrip")
    return (
      <div {...galleryBoxProps(feature, "gallery-filmstrip")}>
        {images.map((url, index) => (
          <img
            src={url}
            alt={`Gallery ${index + 1}`}
            key={`${url}-${index}`}
            style={galleryImageStyle(feature, index)}
          />
        ))}
      </div>
    );
  // QA TC-126: slideshow otomatis sebagai variasi tampilan galeri.
  if (feature.gallerySlideshow)
    return (
      <GallerySlideshow feature={feature} images={images} />
    );
  return (
    <div
      {...galleryBoxProps(
        feature,
        `gallery-grid layout-${feature.galleryLayoutTemplate || "even"}`,
      )}
    >
      {images.map((url, index) => (
        <img
          src={url}
          alt={`Gallery ${index + 1}`}
          key={`${url}-${index}`}
          style={galleryImageStyle(feature, index)}
        />
      ))}
    </div>
  );
}

// QA TC-126 — slideshow otomatis dengan kontrol manual dan indikator.
function GallerySlideshow({
  feature,
  images,
}: {
  feature: Feature;
  images: string[];
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const delay = Math.max(1200, feature.gallerySlideshowMs || 3500);
  useEffect(() => {
    if (paused || images.length < 2) return;
    const timer = window.setInterval(
      () => setIndex((previous) => (previous + 1) % images.length),
      delay,
    );
    return () => window.clearInterval(timer);
  }, [paused, delay, images.length]);
  useEffect(() => {
    if (index >= images.length) setIndex(0);
  }, [images.length, index]);
  const step = (direction: 1 | -1) =>
    setIndex((previous) => (previous + direction + images.length) % images.length);
  return (
    <div
      className={`gallery-slideshow ${feature.galleryFullWidth ? "full-width" : ""}`}
      style={{ height: feature.imageHeight ? `${feature.imageHeight}px` : undefined }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {images.map((url, position) => (
        <img
          key={`${url}-${position}`}
          src={url}
          alt={`Gallery ${position + 1}`}
          className={position === index ? "active" : ""}
          style={{
            ...galleryImageStyle(feature, position),
            transitionDuration: `${feature.galleryTransitionMs || 850}ms`,
          }}
        />
      ))}
      {images.length > 1 && (
        <>
          <button
            type="button"
            className="slideshow-nav prev"
            onClick={(event) => {
              event.stopPropagation();
              step(-1);
            }}
            aria-label="Foto sebelumnya"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            className="slideshow-nav next"
            onClick={(event) => {
              event.stopPropagation();
              step(1);
            }}
            aria-label="Foto berikutnya"
          >
            <ChevronRight size={16} />
          </button>
          <div className="slideshow-dots">
            {images.map((url, position) => (
              <span
                key={`dot-${url}-${position}`}
                className={position === index ? "active" : ""}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// QA TC-129 — pilihan template layout untuk feature Image.
function ImageLayoutFeature({
  feature,
  editableText,
}: {
  feature: Feature;
  editableText: (
    field: "title" | "body" | "title2" | "body2",
    className: string,
  ) => React.ReactNode;
}) {
  const layout = feature.imageLayoutTemplate || "single";
  const frame = feature.imageFrame || "none";
  const media = (url?: string, extraClass = "") =>
    url ? (
      <img
        src={assetUrl(url)}
        alt={feature.title}
        loading="lazy"
        className={extraClass}
        style={{
          borderRadius:
            frame && frame !== "none" ? undefined : feature.borderRadius,
          objectPosition: `${feature.imageOffsetX ?? 50}% ${feature.imageOffsetY ?? 50}%`,
          transform: `scale(${(feature.imageZoom ?? 100) / 100})`,
        }}
      />
    ) : (
      <div className="media-placeholder">
        <ImageIcon size={26} />
        <strong>Image Feature</strong>
        <span>Upload melalui panel Content</span>
      </div>
    );
  const caption = feature.imageCaption ? (
    <figcaption className="image-caption" style={{ color: feature.bodyColor }}>
      {feature.imageCaption}
    </figcaption>
  ) : null;
  const copy = (
    <div className="image-layout-copy">
      {editableText("title", "editable-title")}
      {editableText("body", "editable-body")}
      {caption}
    </div>
  );
  const frameBox = (
    <div
      className={`image-feature frame-${frame}`}
      style={{
        height: feature.imageHeight ? `${feature.imageHeight}px` : undefined,
      }}
    >
      {media(feature.mediaUrl)}
    </div>
  );
  if (layout === "single")
    return (
      <figure className="image-layout single">
        {frameBox}
        {caption}
      </figure>
    );
  if (layout === "banner")
    return (
      <figure className="image-layout banner">
        <div
          className={`image-feature frame-${frame}`}
          style={{ height: feature.imageHeight ? `${feature.imageHeight}px` : 220 }}
        >
          {media(feature.mediaUrl)}
        </div>
        <div className="image-layout-overlay">{copy}</div>
      </figure>
    );
  if (layout === "framed-caption")
    return (
      <figure className="image-layout framed-caption">
        <div className="image-layout-frame" style={giftCardStyle(feature)}>
          {frameBox}
          {copy}
        </div>
      </figure>
    );
  if (layout === "stacked")
    return (
      <figure className="image-layout stacked">
        {frameBox}
        {feature.imageSecondaryUrl && (
          <div className={`image-feature frame-${frame}`}>
            {media(feature.imageSecondaryUrl)}
          </div>
        )}
        {copy}
      </figure>
    );
  if (layout === "overlap")
    return (
      <figure className="image-layout overlap">
        <div className={`image-feature frame-${frame} overlap-back`}>
          {media(feature.mediaUrl)}
        </div>
        {feature.imageSecondaryUrl && (
          <div className={`image-feature frame-${frame} overlap-front`}>
            {media(feature.imageSecondaryUrl)}
          </div>
        )}
        {copy}
      </figure>
    );
  return (
    <figure className={`image-layout ${layout}`}>
      {layout === "side-right" ? (
        <>
          {copy}
          {frameBox}
        </>
      ) : (
        <>
          {frameBox}
          {copy}
        </>
      )}
    </figure>
  );
}

// QA TC-081: Form mendukung penambahan kolom & baris (field) beserta tipe dan lebar kolom.
function CanvasForm({
  feature,
  guests,
  addGuest,
}: {
  feature: Feature;
  guests: Guest[];
  addGuest: (
    name: string,
    status: Guest["status"],
    pax: number,
    canvasId?: string,
  ) => void;
}) {
  const specs = resolveFormSpecs(feature);
  const [values, setValues] = useState<Record<string, string>>({});
  const nameKey =
    specs.find((item) => /nama|name/i.test(item.label))?.id ||
    specs[0]?.id ||
    "";
  const paxKey =
    specs.find((item) => /jumlah|pax|tamu/i.test(item.label))?.id || "";
  const set = (key: string, value: string) =>
    setValues((previous) => ({ ...previous, [key]: value }));
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const guestName = String(values[nameKey] || "").trim();
    if (!guestName) return;
    addGuest(guestName, "Hadir", Math.max(1, Number(values[paxKey] || 1) || 1));
    setValues({});
  };
  return (
    <form
      className={`canvas-form cols-${feature.formColumns || 1}`}
      style={{ textAlign: feature.align }}
      onSubmit={submit}
    >
      {feature.showTitle !== false && (
        <h3 style={{ fontSize: feature.fontSize, whiteSpace: "pre-wrap" }}>
          {feature.title}
        </h3>
      )}
      {feature.showBody !== false && (
        <p
          style={{
            whiteSpace: "pre-wrap",
            ...(feature.bodyFontSize ? { fontSize: feature.bodyFontSize } : {}),
          }}
        >
          {feature.body}
        </p>
      )}
      <div className="canvas-form-grid">
        {specs.map((spec) => (
          <label key={spec.id} className={`field-${spec.width || "full"}`}>
            {spec.label}
            {spec.required ? " *" : ""}
            {spec.kind === "textarea" ? (
              <textarea
                style={inputFieldStyle(feature)}
                value={values[spec.id] || ""}
                onChange={(event) => set(spec.id, event.target.value)}
                placeholder={spec.label}
              />
            ) : spec.kind === "select" ? (
              <select
                style={inputFieldStyle(feature)}
                value={values[spec.id] || ""}
                onChange={(event) => set(spec.id, event.target.value)}
              >
                <option value="">Pilih {spec.label}</option>
                {(spec.options || ["Hadir", "Tidak hadir"]).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={
                  spec.kind === "email"
                    ? "email"
                    : spec.kind === "number"
                      ? "number"
                      : spec.kind === "phone"
                        ? "tel"
                        : "text"
                }
                style={inputFieldStyle(feature)}
                value={values[spec.id] || ""}
                onChange={(event) => set(spec.id, event.target.value)}
                placeholder={spec.label}
              />
            )}
          </label>
        ))}
      </div>
      <button type="submit" style={submitButtonStyle(feature)}>
        {feature.buttonLabel || `Submit RSVP (${guests.length})`}
      </button>
    </form>
  );
}

function GreetingsWidget({
  feature,
  greetings,
  addGreeting,
  compact = false,
}: {
  feature?: Feature;
  greetings: Greeting[];
  addGreeting: (name: string, message: string) => void;
  compact?: boolean;
}) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const align = feature?.align || "left";
  // TC-232 — dulu daftar dipotong ke 3 (atau 8) ucapan terbaru, jadi setiap
  // ucapan baru "menimpa" yang tertua di layar walau di database tetap ada.
  // Kini semua ucapan tampil: digulir di dalam kotak, atau per halaman.
  const paged = feature?.greetingsDisplay === "paged";
  const perPage = Math.max(1, feature?.greetingsPerPage || 5);
  const pageCount = Math.max(1, Math.ceil(greetings.length / perPage));
  const [page, setPage] = useState(1);
  const currentPage = Math.min(page, pageCount);
  const visibleGreetings = paged
    ? greetings.slice((currentPage - 1) * perPage, currentPage * perPage)
    : greetings;
  const formatDate = (value: string) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
  };
  return (
    <div
      className={`greetings-widget ${compact ? "compact" : ""} layout-${feature?.greetingsLayout || "split"} ${feature?.backgroundGradientEnabled ? "gradient-active" : ""} align-${align}`}
      style={{ textAlign: align }}
    >
      {feature &&
        (feature.showTitle !== false || feature.showBody !== false) && (
          <div className="greetings-heading">
            {feature.showTitle !== false && (
              <strong
                style={{ fontSize: feature.fontSize, whiteSpace: "pre-wrap" }}
              >
                {feature.title}
              </strong>
            )}
            {feature.showBody !== false && (
              <span
                style={{
                  whiteSpace: "pre-wrap",
                  ...(feature.bodyFontSize
                    ? { fontSize: feature.bodyFontSize }
                    : {}),
                }}
              >
                {feature.body}
              </span>
            )}
          </div>
        )}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (name.trim() && message.trim()) {
            addGreeting(name.trim(), message.trim());
            setName("");
            setMessage("");
            setPage(1);
          }
        }}
      >
        <input
          style={feature ? inputFieldStyle(feature) : undefined}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Nama Anda"
        />
        <textarea
          style={feature ? inputFieldStyle(feature) : undefined}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Tuliskan ucapan dan doa..."
        />
        <button type="submit" style={feature ? submitButtonStyle(feature) : undefined}>
          <Send size={14} /> {feature?.buttonLabel || "Kirim ucapan"}
        </button>
      </form>
      {greetings.length > 0 && (
        <div className="greeting-count">{greetings.length} ucapan</div>
      )}
      <div className={`greeting-list ${paged ? "is-paged" : "is-scroll"}`}>
        {visibleGreetings.map((greeting, index) => (
          <article
            key={greeting.id || `${greeting.name}-${index}`}
            style={feature ? giftCardStyle(feature) : undefined}
          >
            <div className="greeting-avatar">{greeting.name.slice(0, 1)}</div>
            <div>
              <strong>{greeting.name}</strong>
              <p>{greeting.message}</p>
              <small>{formatDate(greeting.date)}</small>
            </div>
          </article>
        ))}
        {!greetings.length && (
          <div className="greeting-empty">
            <MessageCircle size={17} />
            <span>Belum ada ucapan. Jadilah yang pertama.</span>
          </div>
        )}
      </div>
      {paged && pageCount > 1 && (
        <nav className="greeting-pages" aria-label="Halaman ucapan">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setPage(currentPage - 1)}
            aria-label="Halaman sebelumnya"
          >
            ‹
          </button>
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
            <button
              type="button"
              key={n}
              className={n === currentPage ? "active" : ""}
              aria-current={n === currentPage ? "page" : undefined}
              onClick={() => setPage(n)}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            disabled={currentPage === pageCount}
            onClick={() => setPage(currentPage + 1)}
            aria-label="Halaman berikutnya"
          >
            ›
          </button>
        </nav>
      )}
    </div>
  );
}

function RsvpPage({
  guests,
  addGuest,
}: {
  guests: Guest[];
  addGuest: (
    name: string,
    status: Guest["status"],
    pax: number,
    canvasId?: string,
  ) => void;
}) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState<Guest["status"]>("Hadir");
  const [pax, setPax] = useState(1);
  return (
    <section className="system-page rsvp-system-page">
      <div className="system-page-heading">
        <Users size={25} />
        <small>RSVP CONFIRMATION</small>
        <h1>Konfirmasi Kehadiran</h1>
        <p>Bantu kami mempersiapkan hari istimewa dengan lebih baik.</p>
      </div>
      <div className="rsvp-layout">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (name.trim()) {
              addGuest(name.trim(), status, status === "Hadir" ? pax : 0);
              setName("");
            }
          }}
        >
          <label>
            Nama lengkap
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Nama tamu"
            />
          </label>
          <label>
            Konfirmasi
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as Guest["status"])
              }
            >
              <option>Hadir</option>
              <option>Tidak hadir</option>
              <option>Menunggu</option>
            </select>
          </label>
          <label>
            Jumlah tamu
            <input
              type="number"
              min="1"
              max="5"
              value={pax}
              disabled={status !== "Hadir"}
              onChange={(event) => setPax(Number(event.target.value))}
            />
          </label>
          <button type="submit">Kirim konfirmasi</button>
        </form>
        <div className="rsvp-summary">
          <strong>
            {guests.filter((guest) => guest.status === "Hadir").length}
          </strong>
          <span>Respons hadir terbaru</span>
          {guests.slice(0, 4).map((guest, index) => (
            <GuestRow
              key={`${guest.name}-${index}`}
              guest={guest}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function PreviewModal({
  sections,
  template,
  greetings,
  addGreeting,
  guests,
  addGuest,
  onClose,
}: {
  sections: CanvasSection[];
  template: Template;
  greetings: Greeting[];
  addGreeting: (name: string, message: string) => void;
  guests: Guest[];
  addGuest: (
    name: string,
    status: Guest["status"],
    pax: number,
    canvasId?: string,
  ) => void;
  onClose: () => void;
}) {
  const [page, setPage] = useState<PageKey>("pages");
  // TC-217 — Preview dibuka pada mode yang sedang diedit. Dulu selalu
  // Desktop, sehingga Web Designer yang mengedit Mobile melihat ornamen &
  // layer versi Desktop dan mengira preview tidak sesuai canvas.
  const [mode, setMode] = useState<"desktop" | "mobile">(() =>
    document.querySelector(".canvas-frame.mobile") ? "mobile" : "desktop",
  );
  const stageRef = useRef<HTMLDivElement | null>(null);
  // TC-216 — preview Desktop dulu selebar jendela (mis. 1530 px) sementara
  // desainnya ditata di area kerja editor (mis. 859 px). Posisi bebas, crop
  // background `cover`, dan tinggi section berpiksel bergeser semua, sehingga
  // hasilnya "kepotong & acak-acakan". Preview kini selebar canvas yang
  // terakhir dilihat Web Designer; sisa layar menjadi ruang kosong.
  const [designWidth] = useState(() => {
    const frame = document.querySelector(".canvas-frame.desktop");
    const measured = frame ? Math.round(frame.getBoundingClientRect().width) : 0;
    // Dibuka dari mode Mobile: pakai lebar Desktop terakhir yang terukur.
    return measured || lastDesktopCanvasWidth || DESKTOP_DESIGN_WIDTH;
  });
  // Preview selalu dibuka dari section pembuka, termasuk saat berpindah
  // tab Pages/RSVP atau mengganti mode Desktop/Mobile.
  useScrollResetOnOpen(stageRef, true, page, mode);
  // Revisi 21 Okt — preview Desktop memenuhi lebar layar laptop, tanpa
  // ruang abu-abu. Tata letak Kolom (70/30) memang responsif, jadi dirender
  // apa adanya selebar layar; desain penuh diskalakan agar posisi bebas,
  // crop background, dan tinggi section tetap sama dengan editor.
  const columnLayout = usesDesktopColumn(sections);
  const zoom = useFitZoom(
    stageRef,
    designWidth,
    mode === "desktop" && !columnLayout,
  );
  return (
    <div className="preview-overlay">
      <div className="preview-full">
        <header>
          <div>
            <strong>Live Preview</strong>
            <span>
              {mode === "desktop"
                ? columnLayout
                  ? "Desktop · selebar layar"
                  : `Selebar layar · desain ${designWidth} px diskalakan ${Math.round(zoom * 100)}%`
                : `Mobile · ${MOBILE_PREVIEW_WIDTH} px`}
            </span>
          </div>
          <div className="preview-page-tabs">
            <button
              className={page === "pages" ? "active" : ""}
              onClick={() => setPage("pages")}
            >
              Pages
            </button>
            <button
              className={page === "rsvp-page" ? "active" : ""}
              onClick={() => setPage("rsvp-page")}
            >
              RSVP
            </button>
          </div>
          <div className="preview-controls">
            <button
              className={mode === "desktop" ? "active" : ""}
              onClick={() => setMode("desktop")}
            >
              <Monitor size={17} />
            </button>
            <button
              className={mode === "mobile" ? "active" : ""}
              onClick={() => setMode("mobile")}
            >
              <Smartphone size={17} />
            </button>
            <button onClick={onClose}>
              <X size={19} />
            </button>
          </div>
        </header>
        <DeviceContext value={mode}>
        <PreviewSurfaceContext value={true}>
        <div
          ref={stageRef}
          className={`preview-full-stage ${mode}${mode === "desktop" && columnLayout ? " full-bleed" : ""}`}
          style={
            {
              "--design-width": `${designWidth}px`,
              "--preview-zoom": mode === "desktop" ? zoom : 1,
            } as React.CSSProperties
          }
        >
          <PreviewZoomContext value={mode === "desktop" ? zoom : 1}>
          <div className="preview-content">
            <WeddingCanvas
              page={page}
              sections={sections}
              selectedTemplate={template}
              greetings={greetings}
              addGreeting={addGreeting}
              guests={guests}
              addGuest={addGuest}
            />
          </div>
          </PreviewZoomContext>
        </div>
        </PreviewSurfaceContext>
        </DeviceContext>
      </div>
    </div>
  );
}

function GuestsModal({
  guests,
  onClose,
}: {
  guests: Guest[];
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const filtered = guests.filter((guest) =>
    `${guest.name} ${guest.status}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="modal-backdrop">
      <div className="guest-modal">
        <div className="modal-heading">
          <div>
            <div className="eyebrow">RSVP DATABASE</div>
            <h2>Semua konfirmasi tamu</h2>
            <p>{filtered.length} respons ditampilkan</p>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="search-field guest-search">
          <Search size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari nama atau status..."
          />
        </div>
        <div className="guest-modal-list">
          {filtered.map((guest, index) => (
            <GuestRow
              key={`${guest.name}-${index}`}
              guest={guest}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function HelpCenter() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const categories = [
    "Semua",
    ...Array.from(new Set(faqItems.map((item) => item.category))),
  ];
  const filtered = faqItems.filter(
    (item) =>
      (category === "Semua" || item.category === category) &&
      `${item.q} ${item.a}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="help-page">
      <section className="help-hero">
        <CircleHelp size={28} />
        <div className="eyebrow light">ikrarku HELP CENTER</div>
        <h1>Apa yang dapat kami bantu?</h1>
        <p>
          Cari panduan berdasarkan fitur, media, RSVP, publishing, atau akun.
        </p>
        <div className="help-search">
          <Search size={20} />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari fitur, contoh: column, gallery, background..."
          />
        </div>
      </section>
      <div className="help-content">
        <div className="faq-categories">
          {categories.map((item) => (
            <button
              key={item}
              className={category === item ? "active" : ""}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="faq-results">
          <div className="section-heading">
            <div>
              <span>SEARCH RESULTS</span>
              <h2>{filtered.length} artikel bantuan ditemukan</h2>
            </div>
          </div>
          {filtered.map((item) => (
            <details key={item.q}>
              <summary>
                <div>
                  <span>{item.category}</span>
                  <strong>{item.q}</strong>
                </div>
                <Plus size={17} />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
          {filtered.length === 0 && (
            <div className="faq-empty">
              <Search size={28} />
              <h3>Panduan tidak ditemukan</h3>
              <p>Coba gunakan kata kunci lain atau hubungi Live Chat.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ChatWidget({
  messages,
  sendChat,
  open,
  onOpenChange,
}: {
  messages: ChatMessage[];
  sendChat: (text: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [text, setText] = useState("");
  return (
    <div className={`chat-widget ${open ? "open" : ""}`}>
      {open && (
        <div className="chat-window">
          <header>
            <div className="chat-agent">
              <div className="agent-avatar">IK</div>
              <div>
                <strong>ikrarku Support</strong>
                <span>
                  <i /> Online · biasanya membalas cepat
                </span>
              </div>
            </div>
            <button onClick={() => onOpenChange(false)}>
              <X size={17} />
            </button>
          </header>
          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="chat-empty">
                <MessageCircle size={22} />
                <p>Mulai percakapan dengan Customer Service.</p>
              </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chat-message ${message.sender}`}
              >
                <p>{message.text}</p>
                <span>{message.time}</span>
              </div>
            ))}
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendChat(text);
              setText("");
            }}
          >
            <input
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Tulis pesan..."
            />
            <button type="submit">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
      <button className="chat-launcher" onClick={() => onOpenChange(!open)}>
        {open ? (
          <X size={22} />
        ) : (
          <>
            <MessageCircle size={22} />
            <span>Live Chat</span>
          </>
        )}
      </button>
    </div>
  );
}

function Articles({
  articles,
  openEditor,
  canManage,
  onToggleStatus,
  onDelete,
}: {
  articles: ArticleItem[];
  openEditor: (id?: string) => void;
  canManage: boolean;
  onToggleStatus?: (article: ArticleItem, next: string) => Promise<void>;
  onDelete?: (article: ArticleItem) => Promise<void>;
}) {
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(
    null,
  );
  // QA TC-174: hapus permanen selalu lewat konfirmasi.
  const [deleteTarget, setDeleteTarget] = useState<ArticleItem | null>(null);
  const [query, setQuery] = useState("");
  const sourceArticles = canManage
    ? articles
    : articles.filter((article) => article.status === "Published");
  const visibleArticles = sourceArticles.filter((article) =>
    `${article.title} ${article.category} ${article.excerpt} ${article.tags.join(" ")}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const featured = sourceArticles.find(
    (article) => article.status === "Published",
  );
  if (selectedArticle)
    return (
      <ArticleReaderPage
        article={selectedArticle}
        onBack={() => setSelectedArticle(null)}
      />
    );
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">CONTENT HUB</div>
          <h1>Berita & Articles</h1>
          <p>
            {canManage
              ? "Kelola article melalui halaman editor tersendiri dengan workflow draft dan publish."
              : "Inspirasi dan panduan terbaru dari ikrarku."}
          </p>
        </div>
        {canManage && (
          <button className="primary-btn" onClick={() => openEditor("new")}>
            <Plus size={17} /> New Article
          </button>
        )}
      </div>
      {featured && (
        <div
          className="article-feature"
          onClick={() => setSelectedArticle(featured)}
        >
          <div>
            <span>EDITOR'S PICK</span>
            <h2>{featured.title}</h2>
            <p>{featured.excerpt}</p>
            <button>
              Read article <ArrowRight size={16} />
            </button>
          </div>
          <div
            className="feature-art"
            style={{
              backgroundImage: featured.coverUrl
                ? `url(${featured.coverUrl})`
                : undefined,
            }}
          >
            <Heart size={72} />
          </div>
        </div>
      )}
      <div className="panel article-table">
        <div className="panel-head">
          <div>
            <h3>All articles</h3>
            <p>{visibleArticles.length} konten tersedia</p>
          </div>
          <div className="search-field compact">
            <Search size={16} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title, category, or tag"
            />
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Article</th>
              <th>Category</th>
              <th>Published</th>
              <th>Status</th>
              <th>Views</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {visibleArticles.map((article) => (
              <tr key={article.id}>
                <td>
                  <button
                    className="article-title-button"
                    onClick={() =>
                      canManage
                        ? openEditor(article.id)
                        : setSelectedArticle(article)
                    }
                  >
                    <strong>{article.title}</strong>
                    <span>{article.excerpt}</span>
                  </button>
                </td>
                <td>{article.category}</td>
                <td>{formatArticleDate(article.date)}</td>
                <td>
                  <span className={`status ${article.status.toLowerCase()}`}>
                    {article.status}
                  </span>
                </td>
                <td>{article.views}</td>
                <td>
                  <div className="row-actions">
                    <button
                      className="icon-btn small"
                      title={canManage ? "Edit artikel" : "Baca artikel"}
                      onClick={() =>
                        canManage
                          ? openEditor(article.id)
                          : setSelectedArticle(article)
                      }
                    >
                      {canManage ? (
                        <WandSparkles size={15} />
                      ) : (
                        <ExternalLink size={15} />
                      )}
                    </button>
                    {/* QA TC-173: tarik publish artikel tanpa menghapusnya. */}
                    {canManage && onToggleStatus && (
                      <button
                        className="icon-btn small"
                        title={
                          article.status === "Published"
                            ? "Takedown (tarik dari publikasi)"
                            : "Publish artikel"
                        }
                        onClick={() =>
                          void onToggleStatus(
                            article,
                            article.status === "Published"
                              ? "Draft"
                              : "Published",
                          )
                        }
                      >
                        {article.status === "Published" ? (
                          <EyeOff size={15} />
                        ) : (
                          <Eye size={15} />
                        )}
                      </button>
                    )}
                    {/* QA TC-174: hapus artikel permanen. */}
                    {canManage && onDelete && (
                      <button
                        className="row-delete"
                        title="Hapus artikel permanen"
                        onClick={() => setDeleteTarget(article)}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {deleteTarget && (
        <ConfirmModal
          title="Hapus artikel ini?"
          description={`"${deleteTarget.title}" akan dihapus permanen dan tidak bisa dikembalikan.`}
          confirmLabel="Hapus permanen"
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => {
            const target = deleteTarget;
            setDeleteTarget(null);
            void onDelete?.(target);
          }}
        />
      )}
    </div>
  );
}

function ArticleEditorPage({
  article,
  role,
  onBack,
  onSave,
}: {
  article?: ArticleItem;
  role: Role;
  onBack: () => void;
  onSave: (payload: Omit<ArticleItem, "id" | "date" | "views">) => void;
}) {
  const [title, setTitle] = useState(article?.title || "");
  const [slug, setSlug] = useState(article?.slug || "");
  const [category, setCategory] = useState(article?.category || "Planning");
  const [status, setStatus] = useState<"Published" | "Draft">(
    article?.status || "Draft",
  );
  const [excerpt, setExcerpt] = useState(article?.excerpt || "");
  const [tags, setTags] = useState(article?.tags.join(", ") || "");
  const [coverUrl, setCoverUrl] = useState<string | undefined>(
    article?.coverUrl,
  );
  const editorRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (editorRef.current)
      editorRef.current.innerHTML =
        article?.content ||
        "<h2>Mulai menulis artikel...</h2><p>Gunakan toolbar untuk menambahkan heading, format teks, list, quote, link, dan image.</p>";
  }, [article]);
  const command = (name: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(name, false, value);
  };
  const uploadArticleMedia = async (file: File, category: string) => {
    const form = new FormData();
    form.append("file", file);
    form.append("category", category);
    const saved = await api.uploadMedia(form);
    return assetUrl(saved.url);
  };
  const insertImage = async (file?: File) => {
    if (!file || !file.type.startsWith("image/") || file.size > 2 * 1024 * 1024)
      return;
    const url = await uploadArticleMedia(file, "article-inline");
    command("insertImage", url);
  };
  const uploadCover = async (file?: File) => {
    if (!file || !file.type.startsWith("image/") || file.size > 2 * 1024 * 1024)
      return;
    setCoverUrl(await uploadArticleMedia(file, "article-cover"));
  };
  const createLink = () => {
    const url = window.prompt("Masukkan URL tautan");
    if (url) command("createLink", url);
  };
  const save = (forcedStatus: "Published" | "Draft") => {
    const cleanSlug = (slug || title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    onSave({
      title: title.trim(),
      slug: cleanSlug,
      category,
      status: forcedStatus,
      excerpt: excerpt.trim(),
      content: editorRef.current?.innerHTML || "<p></p>",
      author: role === "Admin" ? "Platform Admin" : "ikrarku Editorial",
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      coverUrl,
    });
  };
  return (
    <div className="page article-editor-page">
      <div className="article-editor-page-top">
        <button className="secondary-btn" onClick={onBack}>
          <ArrowLeft size={16} /> Back to Articles
        </button>
        <div>
          <span>{article ? "EDIT ARTICLE" : "NEW ARTICLE"}</span>
          <strong>
            {article ? article.title : "WordPress-style publishing workspace"}
          </strong>
        </div>
        <div className="heading-actions">
          <button
            className="secondary-btn"
            disabled={!title.trim()}
            onClick={() => save("Draft")}
          >
            <Save size={16} /> Save Draft
          </button>
          <button
            className="primary-btn"
            disabled={!title.trim()}
            onClick={() => save("Published")}
          >
            <Globe2 size={16} /> Publish
          </button>
        </div>
      </div>
      <div className="article-editor-layout page-layout">
        <main>
          <input
            className="article-title-input"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              if (!slug)
                setSlug(
                  event.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                );
            }}
            placeholder="Add article title"
          />
          <div className="article-permalink">
            <span>ikrarku.id/articles/</span>
            <input
              value={slug}
              onChange={(event) =>
                setSlug(event.target.value.replace(/[^a-z0-9-]/g, ""))
              }
            />
          </div>
          <div className="rich-toolbar">
            <button onClick={() => command("formatBlock", "h1")}>
              <Heading1 size={16} />
            </button>
            <button onClick={() => command("formatBlock", "h2")}>
              <Heading2 size={16} />
            </button>
            <button onClick={() => command("bold")}>
              <Bold size={16} />
            </button>
            <button onClick={() => command("italic")}>
              <Italic size={16} />
            </button>
            <button onClick={() => command("underline")}>
              <Underline size={16} />
            </button>
            <button onClick={() => command("insertUnorderedList")}>
              <List size={16} />
            </button>
            <button onClick={() => command("formatBlock", "blockquote")}>
              <Quote size={16} />
            </button>
            <button onClick={createLink}>
              <Link2 size={16} />
            </button>
            <button onClick={() => imageRef.current?.click()}>
              <ImageIcon size={16} />
            </button>
            <button onClick={() => command("justifyLeft")}>
              <AlignLeft size={16} />
            </button>
            <button onClick={() => command("justifyCenter")}>
              <AlignCenter size={16} />
            </button>
            <button onClick={() => command("justifyRight")}>
              <AlignRight size={16} />
            </button>
          </div>
          <input
            ref={imageRef}
            hidden
            type="file"
            onClick={resetFileInput}
            accept="image/*"
            onChange={(event) => void insertImage(event.target.files?.[0])}
          />
          <div
            ref={editorRef}
            className="article-rich-editor"
            contentEditable
            suppressContentEditableWarning
          />
          <label>
            Excerpt
            <textarea
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              placeholder="Ringkasan untuk landing page dan daftar article."
            />
          </label>
        </main>
        <aside>
          <section>
            <h3>Publishing</h3>
            <label>
              Status
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as "Published" | "Draft")
                }
              >
                <option>Draft</option>
                <option>Published</option>
              </select>
            </label>
            <button
              className="primary-btn full"
              disabled={!title.trim()}
              onClick={() => save(status)}
            >
              {status === "Published" ? "Publish Article" : "Save Article"}
            </button>
          </section>
          <section>
            <h3>Category & Tags</h3>
            <label>
              Category
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option>Planning</option>
                <option>Inspiration</option>
                <option>Product Guide</option>
                <option>Venue</option>
                <option>Budgeting</option>
                <option>Wedding Trends</option>
              </select>
            </label>
            <label>
              Tags
              <input
                value={tags}
                onChange={(event) => setTags(event.target.value)}
                placeholder="planning, venue, tips"
              />
            </label>
          </section>
          <section>
            <h3>Featured Image</h3>
            <input
              ref={coverRef}
              hidden
              type="file"
              onClick={resetFileInput}
              accept="image/*"
              onChange={(event) => void uploadCover(event.target.files?.[0])}
            />
            <button
              className="upload-control"
              onClick={() => coverRef.current?.click()}
            >
              <Upload size={17} />
              <span>
                <strong>Upload cover</strong>
                <small>Max 1 MB</small>
              </span>
            </button>
            {coverUrl && (
              <div
                className="article-cover-preview"
                style={{ backgroundImage: `url(${coverUrl})` }}
              >
                <button onClick={() => setCoverUrl(undefined)}>
                  <Trash2 size={13} />
                </button>
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}

function SettingsPage({
  slug,
  setSlug,
  flash: _flash,
  notificationMuted,
  onNotificationMuted,
}: {
  slug: string;
  setSlug: (slug: string) => void;
  flash: (message: string) => void;
  notificationMuted: boolean;
  onNotificationMuted: (muted: boolean) => Promise<void>;
}) {
  const [tab, setTab] = useState<
    "general" | "notifications" | "domain" | "privacy"
  >("general");
  const tabs: [typeof tab, string][] = [
    ["general", "General"],
    ["notifications", "Notifications"],
    ["domain", "Domain"],
    ["privacy", "Privacy"],
  ];
  return (
    <div className="page narrow-page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">PREFERENCES</div>
          <h1>Website & Notification Settings</h1>
          <p>
            Kelola pengalaman workspace, domain publik, notifikasi, dan
            visibilitas website.
          </p>
        </div>
      </div>
      <div className="settings-layout">
        <div className="settings-nav">
          {tabs.map(([key, label]) => (
            <button
              key={key}
              className={tab === key ? "active" : ""}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="settings-card">
          {tab === "general" && (
            <>
              <h3>Workspace preferences</h3>
              <p>
                Gunakan menu ini untuk mengelola preferensi umum. Perubahan
                konten website tetap disimpan melalui Canvas Editor.
              </p>
              <div className="setting-row">
                <div>
                  <WandSparkles size={18} />
                  <span>
                    <strong>Visual website editor</strong>
                    <small>
                      Edit konten, layout, dan styling dari Canvas Editor.
                    </small>
                  </span>
                </div>
              </div>
              <details className="howto-panel">
                <summary>How it works — panduan singkat</summary>
                <ol>
                  <li>
                    Buka menu <strong>Templates &amp; Canvas</strong> di
                    sidebar.
                  </li>
                  <li>
                    Pilih template, lalu klik <strong>Canvas Editor</strong>{" "}
                    untuk mulai mengedit.
                  </li>
                  <li>
                    Klik elemen (teks, gambar, section) untuk mengubah isi,
                    warna, dan tata letak.
                  </li>
                  <li>
                    Gunakan tab <strong>Style</strong> di panel kanan untuk
                    gradient, background, dan animasi.
                  </li>
                  <li>
                    Klik <strong>Save &amp; Publish</strong>; atur URL publik di
                    tab <strong>Domain</strong>.
                  </li>
                </ol>
              </details>
            </>
          )}
          {tab === "notifications" && (
            <>
              <h3>Notification sound</h3>
              <p>
                Suara diputar saat task atau chat baru masuk. Visual
                notification tetap muncul saat suara dimute.
              </p>
              <div className="setting-row">
                <div>
                  {notificationMuted ? (
                    <VolumeX size={18} />
                  ) : (
                    <Volume2 size={18} />
                  )}
                  <span>
                    <strong>
                      {notificationMuted
                        ? "Notification sound muted"
                        : "Notification sound active"}
                    </strong>
                    <small>Preferensi disimpan ke akun Anda.</small>
                  </span>
                </div>
                <button
                  className={`toggle ${notificationMuted ? "" : "on"}`}
                  onClick={() => void onNotificationMuted(!notificationMuted)}
                >
                  <i />
                </button>
              </div>
              <button
                className="secondary-btn"
                onClick={() => playNotificationTone()}
              >
                <Play size={14} /> Test sound
              </button>
            </>
          )}
          {tab === "domain" && (
            <>
              <h3>Public website URL</h3>
              <p>
                Pilih URL yang mudah dibaca. Sistem akan memvalidasi duplikasi
                saat Save & Publish.
              </p>
              <div className="slug-field large">
                <span>{window.location.origin}/</span>
                <input
                  value={slug}
                  onChange={(event) =>
                    setSlug(
                      event.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, ""),
                    )
                  }
                />
                <button
                  onClick={() =>
                    void navigator.clipboard?.writeText(
                      `${window.location.origin}/${slug}`,
                    )
                  }
                >
                  <Copy size={16} />
                </button>
              </div>
              <div className="availability">
                <Check size={15} /> Availability diperiksa saat publish
              </div>
            </>
          )}
          {tab === "privacy" && (
            <>
              <h3>Website visibility</h3>
              <p>
                Website dengan status Published dapat dibuka oleh siapa pun yang
                mengetahui URL. Draft dan template editor tidak dipublikasikan
                sebagai URL customer.
              </p>
              <div className="setting-row">
                <div>
                  <ShieldCheck size={18} />
                  <span>
                    <strong>Public after publish</strong>
                    <small>
                      Pastikan data tamu dan konten yang ditampilkan memang
                      dimaksudkan untuk publik.
                    </small>
                  </span>
                </div>
                <span className="published-badge">
                  <i />
                  Controlled by publish status
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminDashboard({
  setView,
  templates,
  articles,
  accounts,
  tasks,
  metrics,
  roles,
  createAccount,
  orderAnalytics,
}: {
  setView: (view: View) => void;
  templates: Template[];
  articles: ArticleItem[];
  accounts: AuthAccount[];
  tasks: TaskItem[];
  metrics: {
    incoming: number;
    replies: number;
    active: number;
    resolved: number;
  };
  roles: RoleItem[];
  createAccount: (
    name: string,
    username: string,
    password: string,
    role: Role,
    email: string,
  ) => Promise<boolean>;
  orderAnalytics: OrderAnalytics;
}) {
  const [showCreate, setShowCreate] = useState(false);
  const pendingTemplates = templates.filter(
    (item) => item.status === "Pending" || item.pendingReview,
  );
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">ADMINISTRATOR CONSOLE</div>
          <h1>Platform operations overview</h1>
          <p>
            Pantau approval, revenue, content, support, dan operasional platform
            dari satu tempat.
          </p>
        </div>
        <div className="heading-actions">
          <button className="secondary-btn" onClick={() => setView("tasks")}>
            <ClipboardList size={16} />
            Tasks
          </button>
          <button className="secondary-btn" onClick={() => setView("roles")}>
            <KeyRound size={16} />
            Roles
          </button>
          <button className="primary-btn" onClick={() => setShowCreate(true)}>
            <UserPlus size={16} />
            Add Account
          </button>
        </div>
      </div>
      <div className="stats-grid">
        <Stat
          icon={Users}
          label="Accounts"
          value={String(accounts.length)}
          note={`${roles.length} roles configured`}
          onClick={() => setView("users")}
        />
        <Stat
          icon={Palette}
          label="Templates"
          value={String(templates.length)}
          note={`${pendingTemplates.length} pending approval`}
          onClick={() => setView("templates")}
        />
        <Stat
          icon={BookOpen}
          label="Articles"
          value={String(articles.length)}
          note={`${articles.filter((item) => item.status === "Published").length} published`}
          onClick={() => setView("articles")}
        />
        <Stat
          icon={ReceiptText}
          label="Paid Revenue"
          value={formatRupiah(orderAnalytics.summary.nominal || 0)}
          note={`${orderAnalytics.summary.qty || 0} checkout records`}
          onClick={() => setView("orders")}
        />
      </div>
      <div className="admin-action-grid">
        <article onClick={() => setView("tasks")}>
          <Palette size={22} />
          <div>
            <strong>Template approval</strong>
            <span>{pendingTemplates.length} submission waiting</span>
          </div>
          <ArrowRight size={17} />
        </article>
        <article onClick={() => setView("payment-settings")}>
          <CreditCard size={22} />
          <div>
            <strong>Payment methods</strong>
            <span>Configure QRIS, GoPay, Card</span>
          </div>
          <ArrowRight size={17} />
        </article>
        <article onClick={() => setView("articles")}>
          <FileText size={22} />
          <div>
            <strong>Article CMS</strong>
            <span>Published content updates landing page</span>
          </div>
          <ArrowRight size={17} />
        </article>
        <article onClick={() => setView("orders")}>
          <ReceiptText size={22} />
          <div>
            <strong>Orders & Revenue</strong>
            <span>
              {orderAnalytics.summary.qty || 0} order ·{" "}
              {formatRupiah(orderAnalytics.summary.nominal || 0)}
            </span>
          </div>
          <ArrowRight size={17} />
        </article>
        <article onClick={() => setView("cs-dashboard")}>
          <MessageSquareText size={22} />
          <div>
            <strong>Customer Service</strong>
            <span>
              {metrics.incoming} inbound · {metrics.replies} replies
            </span>
          </div>
          <ArrowRight size={17} />
        </article>
        <article onClick={() => setView("audit-log")}>
          <ShieldCheck size={22} />
          <div>
            <strong>Audit Trail</strong>
            <span>Role, account, approval, and settings history</span>
          </div>
          <ArrowRight size={17} />
        </article>
      </div>
      <div className="dashboard-grid admin">
        <section className="panel">
          <div className="panel-head">
            <div>
              <h3>Latest database tasks</h3>
              <p>
                Khusus task pembuatan website dari order customer. Approval
                template ada di kartu sebelah.
              </p>
            </div>
            <button className="text-btn" onClick={() => setView("tasks")}>
              View all
            </button>
          </div>
          {tasks
            .filter((task) => task.task_type !== "Approval")
            .slice(0, 6)
            .map((task) => (
              <div className="approval-row" key={task.id}>
                <div className="client-avatar">
                  <ClipboardList size={15} />
                </div>
                <div>
                  <strong>{task.title}</strong>
                  <span>
                    {task.order_no || "Internal"} · {task.status}
                  </span>
                </div>
                <button onClick={() => setView("tasks")}>Open</button>
              </div>
            ))}
          {!tasks.filter((task) => task.task_type !== "Approval").length && (
            <div className="panel-empty">
              Belum ada task pembuatan website dari order customer.
            </div>
          )}
        </section>
        <section className="panel">
          <div className="panel-head">
            <div>
              <h3>Pending template approvals</h3>
              <p>Submitted by Web Designer</p>
            </div>
          </div>
          {pendingTemplates.slice(0, 5).map((template) => (
            <div className="approval-row" key={template.id}>
              <div className="client-avatar">
                <Palette size={15} />
              </div>
              <div>
                <strong>{template.name}</strong>
                <span>
                  {formatRupiah(template.price || 0)} · {template.category}
                </span>
              </div>
              <button onClick={() => setView("tasks")}>Review</button>
            </div>
          ))}
          {!pendingTemplates.length && (
            <div className="panel-empty">Tidak ada template pending.</div>
          )}
        </section>
      </div>
      {showCreate && (
        <AccountCreateModal
          roles={roles}
          onClose={() => setShowCreate(false)}
          onCreate={async (payload) => {
            if (
              await createAccount(
                payload.name,
                payload.username,
                payload.password,
                payload.role,
                payload.email,
              )
            )
              setShowCreate(false);
          }}
          existingUsernames={accounts.map((item) => item.username)}
        />
      )}
    </div>
  );
}

function OrdersAnalyticsPage({
  data,
  onRefresh,
}: {
  data: OrderAnalytics;
  onRefresh: () => Promise<void>;
}) {
  const [retrying, setRetrying] = useState<string | null>(null);
  const [error, setError] = useState("");
  // MoM A6 — hasil "Buat akun customer": tautan buat-password untuk dikirim
  // ulang lewat WhatsApp bila perlu (sudah otomatis masuk chat & email).
  const [accountBusy, setAccountBusy] = useState<string | null>(null);
  const [accountResult, setAccountResult] = useState<
    Record<string, { setupUrl: string; existing: boolean }>
  >({});
  const createAccount = async (id: string) => {
    setAccountBusy(id);
    setError("");
    try {
      const result = await api.createOrderCustomerAccount(id);
      setAccountResult((previous) => ({
        ...previous,
        [id]: { setupUrl: result.setupUrl, existing: result.existing },
      }));
      await onRefresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal membuat akun customer.");
    } finally {
      setAccountBusy(null);
    }
  };
  const retry = async (id: string) => {
    setRetrying(id);
    setError("");
    try {
      await api.retryFulfillment(id);
      await onRefresh();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Proses order belum berhasil. Silakan coba lagi.",
      );
    } finally {
      setRetrying(null);
    }
  };
  return (
    <div className="page orders-page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">COMMERCE ANALYTICS</div>
          <h1>Template Checkout & Revenue</h1>
          <p>
            Qty, nominal, customer, payment, serta assignment berasal langsung
            dari tabel orders.
          </p>
        </div>
        <div className="heading-actions">
          <button className="secondary-btn" onClick={() => void onRefresh()}>
            <Repeat2 size={16} />
            Refresh
          </button>
          <button
            className="secondary-btn"
            onClick={() => void api.exportOrdersCsv()}
          >
            <Download size={16} />
            CSV
          </button>
          <button
            className="primary-btn"
            onClick={() => void api.exportOrdersExcel()}
          >
            <FileText size={16} />
            Excel
          </button>
        </div>
      </div>
      {error && <p role="alert">{error}</p>}
      <div className="stats-grid">
        <Stat
          icon={ShoppingCart}
          label="Checkout Qty"
          value={String(data.summary.qty || 0)}
          note="Seluruh order yang tercatat"
        />
        <Stat
          icon={ReceiptText}
          label="Paid Nominal"
          value={formatRupiah(data.summary.nominal || 0)}
          note="Akumulasi payment Paid"
        />
        <Stat
          icon={Users}
          label="Unique Customers"
          value={String(data.summary.customers || 0)}
          note="Berdasarkan email customer"
        />
        <Stat
          icon={CheckCircle2}
          label="Paid Orders"
          value={String(
            data.rows.filter((row) => row.payment_status === "Paid").length,
          )}
          note="Siap onboarding"
        />
      </div>
      <div className="panel orders-table">
        <div className="panel-head">
          <div>
            <h3>Order database</h3>
            <p>{data.rows.length} row tersedia untuk download.</p>
          </div>
        </div>
        {data.rows.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Template</th>
                  <th>Nominal</th>
                  <th>Payment</th>
                  <th>Assignment</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((row, index) => (
                  <tr key={`${row.order_no}-${index}`}>
                    <td>
                      <strong>{row.order_no}</strong>
                      <span>{row.order_status}</span>
                    </td>
                    <td>
                      <strong>{row.customer_name}</strong>
                      <span>
                        {row.email}
                        <br />
                        {row.phone}
                      </span>
                      {row.payment_status === "Paid" &&
                        !row.user_id &&
                        !accountResult[row.id] && (
                          <button
                            className="order-account-btn"
                            disabled={accountBusy !== null}
                            title="Buat akun dari data order, lalu kirim tautan buat password lewat chat & email"
                            onClick={() => void createAccount(row.id)}
                          >
                            {accountBusy === row.id
                              ? "Membuat akun…"
                              : "Buat akun customer"}
                          </button>
                        )}
                      {accountResult[row.id] && (
                        <small className="order-account-done">
                          {accountResult[row.id].existing
                            ? "Akun lama terhubung."
                            : "Akun dibuat."}{" "}
                          Tautan buat password terkirim ke chat & email.{" "}
                          <button
                            onClick={() =>
                              void navigator.clipboard?.writeText(
                                accountResult[row.id].setupUrl,
                              )
                            }
                          >
                            Salin tautan
                          </button>
                        </small>
                      )}
                    </td>
                    <td>{row.template_name}</td>
                    <td>{formatRupiah(Number(row.amount) || 0)}</td>
                    <td>
                      <span
                        className={`status ${String(row.payment_status).toLowerCase()}`}
                      >
                        {row.payment_status}
                      </span>
                      <small>{row.payment_method || "—"}</small>
                      {row.payment_status === "Paid" && (
                        <small>
                          Proses:{" "}
                          {row.fulfillment_status === "Complete"
                            ? "Selesai"
                            : row.fulfillment_status === "Failed"
                              ? "Perlu dicoba ulang"
                              : "Menunggu"}
                        </small>
                      )}
                      {row.payment_status === "Paid" &&
                        row.fulfillment_status !== "Complete" && (
                          <button
                            disabled={retrying !== null}
                            onClick={() => void retry(row.id)}
                          >
                            {retrying === row.id
                              ? "Memproses…"
                              : "Ulangi proses order"}
                          </button>
                        )}
                    </td>
                    <td>
                      <strong>CS: {row.cs_name || "—"}</strong>
                      <span>Editor: {row.editor_name || "—"}</span>
                    </td>
                    <td>{new Date(row.created_at).toLocaleString("id-ID")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <ReceiptText size={34} />
            <h2>Belum ada checkout</h2>
            <p>Data akan muncul setelah customer membuat order.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CustomerServiceDashboard({
  metrics,
  conversations,
  setView,
}: {
  metrics: {
    incoming: number;
    replies: number;
    active: number;
    resolved: number;
  };
  conversations: any[];
  setView: (view: View) => void;
}) {
  const latest = conversations.slice(0, 6);
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">CUSTOMER SERVICE DATABASE</div>
          <h1>Support operations dashboard</h1>
          <p>Metrik dihitung langsung dari tabel conversations dan messages.</p>
        </div>
        <div className="heading-actions">
          <button
            className="primary-btn"
            onClick={() => setView("customer-service")}
          >
            <MessageSquareText size={16} />
            Open inbox
          </button>
          <button className="secondary-btn" onClick={() => setView("tasks")}>
            <ClipboardList size={16} />
            Open tasks
          </button>
        </div>
      </div>
      <div className="cs-metric-grid">
        <button onClick={() => setView("customer-service")}>
          <MessageCircle size={20} />
          <span>Incoming chats</span>
          <strong>{metrics.incoming}</strong>
          <small>Pesan customer masuk</small>
        </button>
        <button onClick={() => setView("customer-service")}>
          <Send size={20} />
          <span>Replies sent</span>
          <strong>{metrics.replies}</strong>
          <small>Balasan tersimpan di database</small>
        </button>
        <button onClick={() => setView("customer-service")}>
          <Users size={20} />
          <span>Active conversations</span>
          <strong>{metrics.active}</strong>
          <small>Open atau Pending</small>
        </button>
        <button onClick={() => setView("customer-service")}>
          <CheckCircle2 size={20} />
          <span>Resolved</span>
          <strong>{metrics.resolved}</strong>
          <small>Percakapan selesai</small>
        </button>
      </div>
      <div className="panel">
        <div className="panel-head">
          <div>
            <h3>Recent inbound orders</h3>
            <p>Percakapan dibuat otomatis setelah pembayaran diterima.</p>
          </div>
        </div>
        {latest.length ? (
          <div className="support-activity-list">
            {latest.map((conv) => (
              <article key={conv.id}>
                <div className="activity-icon user">
                  <ShoppingCart size={14} />
                </div>
                <div>
                  <strong>{conv.customer_name}</strong>
                  <span>
                    {conv.customer_email} · {conv.channel} · {conv.status}
                  </span>
                </div>
                <small>
                  {new Date(conv.updated_at).toLocaleString("id-ID")}
                </small>
              </article>
            ))}
          </div>
        ) : (
          <div className="panel-empty">
            <MessageCircle size={24} />
            <strong>Belum ada inbound conversation</strong>
            <span>Conversation akan dibuat saat order dibayar.</span>
          </div>
        )}
      </div>
    </div>
  );
}

function CustomerServiceDatabase({
  conversations,
  users,
  onRefresh,
  onReply,
  onOutbound,
  onStatus,
  onRead,
}: {
  conversations: any[];
  users: any[];
  onRefresh: () => Promise<void>;
  onReply: (
    id: string,
    text: string,
    visibility?: "public" | "internal",
  ) => Promise<void>;
  onOutbound: (userId: string, text: string) => Promise<void>;
  onStatus: (id: string, status: string) => Promise<void>;
  onRead: (id: string) => Promise<void>;
}) {
  const [selectedId, setSelectedId] = useState(conversations[0]?.id || "");
  const [reply, setReply] = useState("");
  // Mode pengiriman: balasan ke customer, atau catatan internal antar staff.
  const [replyMode, setReplyMode] = useState<"public" | "internal">("public");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<
    "All" | "Needs Reply" | "Unread" | "Open" | "Pending" | "Resolved"
  >("All");
  const [newMessageOpen, setNewMessageOpen] = useState(false);
  const [targetUserId, setTargetUserId] = useState(users[0]?.id || "");
  const [outboundText, setOutboundText] = useState("");
  const filtered = conversations.filter((conv) => {
    const text =
      `${conv.customer_name || ""} ${conv.customer_email || ""} ${conv.customer_phone || ""} ${conv.order?.order_no || ""} ${conv.order?.template_name || ""}`.toLowerCase();
    const queryOk = text.includes(query.trim().toLowerCase());
    const filterOk =
      filter === "All"
        ? true
        : filter === "Needs Reply"
          ? Boolean(conv.needsReply)
          : filter === "Unread"
            ? Number(conv.unreadCount) > 0
            : conv.status === filter;
    return queryOk && filterOk;
  });
  const selected =
    conversations.find((item) => item.id === selectedId) ||
    filtered[0] ||
    conversations[0];
  useEffect(() => {
    if (!selectedId && conversations[0]) setSelectedId(conversations[0].id);
  }, [conversations, selectedId]);
  useEffect(() => {
    if (!targetUserId && users[0]) setTargetUserId(users[0].id);
  }, [users, targetUserId]);
  useEffect(() => {
    if (selected?.id && Number(selected.unreadCount) > 0)
      void onRead(selected.id);
  }, [selected?.id]);
  const slaText = (conv: any) => {
    if (!conv.needsReply || !conv.slaDueAt) return "";
    const ms = new Date(conv.slaDueAt).getTime() - Date.now();
    if (ms <= 0) return `SLA overdue ${Math.abs(Math.ceil(ms / 60000))}m`;
    return `Reply due ${Math.ceil(ms / 60000)}m`;
  };
  return (
    <div className="page cs-page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">SUPPORT INBOX</div>
          <h1>Customer Service</h1>
          <p>
            Inbound dari website, Customer workspace, dan order onboarding
            berada pada satu queue dengan status, unread state, dan konteks
            order.
          </p>
        </div>
        <div className="heading-actions">
          <button
            className="primary-btn"
            onClick={() => setNewMessageOpen(true)}
          >
            <Send size={16} />
            New Message
          </button>
          <button className="secondary-btn" onClick={() => void onRefresh()}>
            <Repeat2 size={16} />
            Refresh
          </button>
        </div>
      </div>
      <div className="cs-filter-bar">
        {(
          [
            "All",
            "Needs Reply",
            "Unread",
            "Open",
            "Pending",
            "Resolved",
          ] as const
        ).map((item) => (
          <button
            key={item}
            className={filter === item ? "active" : ""}
            onClick={() => setFilter(item)}
          >
            {item}
            {item === "Needs Reply" && (
              <span>{conversations.filter((c) => c.needsReply).length}</span>
            )}
            {item === "Unread" && (
              <span>
                {conversations.filter((c) => Number(c.unreadCount) > 0).length}
              </span>
            )}
            {item === "Open" && (
              <span>
                {conversations.filter((c) => c.status === "Open").length}
              </span>
            )}
            {item === "Pending" && (
              <span>
                {conversations.filter((c) => c.status === "Pending").length}
              </span>
            )}
            {item === "Resolved" && (
              <span>
                {conversations.filter((c) => c.status === "Resolved").length}
              </span>
            )}
            {item === "All" && <span>{conversations.length}</span>}
          </button>
        ))}
      </div>
      <div className="cs-layout">
        <aside className="conversation-list">
          <div className="conversation-search">
            <Search size={16} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari customer, email, phone, order..."
            />
          </div>
          {filtered.map((conv) => (
            <button
              key={conv.id}
              className={`conversation ${selected?.id === conv.id ? "active" : ""} ${Number(conv.unreadCount) > 0 ? "unread" : ""}`}
              onClick={() => setSelectedId(conv.id)}
            >
              <div className="avatar">
                {String(conv.customer_name || "CU")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div>
                <strong>
                  {conv.customer_name}
                  {Number(conv.unreadCount) > 0 && <i className="unread-dot" />}
                </strong>
                <span>
                  {conv.order?.order_no || conv.customer_email || conv.channel}
                </span>
                {conv.needsReply && (
                  <em
                    className={`sla-chip ${new Date(conv.slaDueAt).getTime() < Date.now() ? "overdue" : ""}`}
                  >
                    {slaText(conv)}
                  </em>
                )}
              </div>
              <small>{conv.status}</small>
            </button>
          ))}
          {!filtered.length && (
            <div className="panel-empty">
              <Search size={20} />
              <strong>Tidak ada conversation</strong>
              <span>Ubah filter atau kata pencarian.</span>
            </div>
          )}
        </aside>
        <section className="cs-chat">
          {selected ? (
            <>
              <header>
                <div>
                  <strong>{selected.customer_name}</strong>
                  <span>
                    {selected.customer_email} ·{" "}
                    {selected.customer_phone || "No phone"} · {selected.channel}
                  </span>
                </div>
                <select
                  className={`conversation-status-select status-${String(selected.status).toLowerCase()}`}
                  value={selected.status}
                  onChange={(event) =>
                    void onStatus(selected.id, event.target.value)
                  }
                >
                  <option>Open</option>
                  <option>Pending</option>
                  <option>Resolved</option>
                </select>
              </header>
              {selected.needsReply && (
                <div
                  className={`conversation-sla-banner ${new Date(selected.slaDueAt).getTime() < Date.now() ? "overdue" : ""}`}
                >
                  <TimerReset size={15} />
                  <span>
                    {slaText(selected)} · default staging target 15 menit
                  </span>
                </div>
              )}
              <div className="cs-messages">
                {(selected.messages || []).map((message: any) => (
                  <div
                    key={message.id}
                    className={`cs-message ${message.sender_type === "support" ? "support" : message.sender_type === "system" ? "system" : "user"} ${message.visibility === "internal" ? "internal-note" : ""}`}
                  >
                    {message.visibility === "internal" && (
                      <em className="internal-note-badge">
                        <Lock size={11} /> Catatan internal · tidak terlihat oleh
                        customer
                      </em>
                    )}
                    {/* TC-226 — nama pengirim pada setiap catatan/balasan staff. */}
                    {message.sender_type === "support" && (
                      <strong className="cs-message-sender">
                        {message.sender_name?.trim() || "Staff ikrarku"}
                        {message.sender_role && (
                          <small> · {message.sender_role}</small>
                        )}
                      </strong>
                    )}
                    <p>{message.body}</p>
                    <span>
                      {new Date(message.created_at).toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
              </div>
              <form
                className={replyMode === "internal" ? "internal-mode" : ""}
                onSubmit={async (event) => {
                  event.preventDefault();
                  if (!reply.trim()) return;
                  const value = reply;
                  setReply("");
                  try {
                    await onReply(selected.id, value, replyMode);
                  } catch {
                    setReply(value);
                  }
                }}
              >
                {/* Catatan internal untuk koordinasi Web Designer dengan CS pada
                    satu tiket, mirip internal comment di Jira. */}
                <div className="reply-mode-switch">
                  <button
                    type="button"
                    className={replyMode === "public" ? "active" : ""}
                    onClick={() => setReplyMode("public")}
                  >
                    <Send size={13} /> Balasan ke customer
                  </button>
                  <button
                    type="button"
                    className={replyMode === "internal" ? "active" : ""}
                    onClick={() => setReplyMode("internal")}
                  >
                    <Lock size={13} /> Catatan internal
                  </button>
                </div>
                <textarea
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                  placeholder={
                    replyMode === "internal"
                      ? "Catatan untuk tim (CS / Web Designer). Customer tidak melihat ini..."
                      : "Balas customer..."
                  }
                />
                <div>
                  <span>
                    {replyMode === "internal"
                      ? "Catatan ini hanya terlihat oleh staff. Tidak dikirim ke live chat maupun email customer."
                      : "Balasan tersimpan pada conversation dan notifikasi email dikirim sesuai konfigurasi."}
                  </span>
                  <button className="primary-btn" type="submit">
                    {replyMode === "internal" ? (
                      <Lock size={15} />
                    ) : (
                      <Send size={15} />
                    )}
                    {replyMode === "internal" ? "Simpan catatan" : "Send reply"}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="empty-state">
              <MessageSquareText size={34} />
              <h2>Pilih conversation</h2>
            </div>
          )}
        </section>
        <aside className="customer-profile">
          {selected && (
            <>
              <div className="large-avatar">
                {String(selected.customer_name).slice(0, 2).toUpperCase()}
              </div>
              <h3>{selected.customer_name}</h3>
              <p>{selected.customer_email}</p>
              <hr />
              <label>
                Phone<strong>{selected.customer_phone || "—"}</strong>
              </label>
              <label>
                Channel<strong>{selected.channel}</strong>
              </label>
              <label>
                Conversation<strong>{selected.status}</strong>
              </label>
              {selected.order && (
                <>
                  <hr />
                  <h4>Order context</h4>
                  <label>
                    Order<strong>{selected.order.order_no}</strong>
                  </label>
                  <label>
                    Template
                    <strong>{selected.order.template_name || "—"}</strong>
                  </label>
                  <label>
                    Payment
                    <strong>
                      {selected.order.payment_status} ·{" "}
                      {formatRupiah(selected.order.amount || 0)}
                    </strong>
                  </label>
                  <label>
                    Web Designer
                    <strong>
                      {selected.order.editor_name || "Unassigned"}
                    </strong>
                  </label>
                  <label>
                    Assigned CS
                    <strong>{selected.order.cs_name || "Unassigned"}</strong>
                  </label>
                  {selected.tasks?.length > 0 && (
                    <div className="profile-task-list">
                      {selected.tasks.map((task: any) => (
                        <span key={task.id}>
                          <ClipboardList size={12} />
                          {task.title}
                          <b>{task.status}</b>
                        </span>
                      ))}
                    </div>
                  )}
                </>
              )}
              <hr />
              <label>
                Created
                <strong>
                  {new Date(selected.created_at).toLocaleString("id-ID")}
                </strong>
              </label>
            </>
          )}
        </aside>
      </div>
      {newMessageOpen && (
        <div className="dialog-overlay">
          <div className="template-create-dialog">
            <header>
              <div>
                <span>OUTBOUND MESSAGE</span>
                <h2>Kirim pesan kepada Customer</h2>
              </div>
              <button onClick={() => setNewMessageOpen(false)}>
                <X size={18} />
              </button>
            </header>
            <label>
              Customer
              <select
                value={targetUserId}
                onChange={(event) => setTargetUserId(event.target.value)}
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} · {user.email}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Message
              <textarea
                value={outboundText}
                onChange={(event) => setOutboundText(event.target.value)}
                placeholder="Tulis informasi project, reminder, atau onboarding..."
              />
            </label>
            <footer>
              <button
                className="secondary-btn"
                onClick={() => setNewMessageOpen(false)}
              >
                Cancel
              </button>
              <button
                className="primary-btn"
                disabled={!targetUserId || !outboundText.trim()}
                onClick={async () => {
                  await onOutbound(targetUserId, outboundText.trim());
                  setOutboundText("");
                  setNewMessageOpen(false);
                }}
              >
                <Send size={15} />
                Send Message
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}

function MyOrdersPage({
  orders,
  setView,
}: {
  orders: any[];
  setView: (view: View) => void;
}) {
  if (!orders.length)
    return (
      <div className="page">
        <div className="page-heading">
          <div>
            <div className="eyebrow">MY ORDER</div>
            <h1>Order undangan Anda</h1>
            <p>
              Riwayat pembelian, receipt, assignment, dan progress onboarding
              Anda akan tampil di sini.
            </p>
          </div>
        </div>
        <div className="empty-state">
          <PackageCheck size={34} />
          <h2>Belum ada order</h2>
          <p>
            Pesan template dari landing page untuk memulai project wedding
            website.
          </p>
          <button className="primary-btn" onClick={() => setView("landing")}>
            Explore templates
          </button>
        </div>
      </div>
    );
  // QA TC-176: ringkasan di atas supaya customer langsung tahu posisi seluruh
  // ordernya tanpa harus membaca kartu satu per satu.
  const paidOrders = orders.filter((order) => order.payment_status === "Paid");
  const doneOrders = paidOrders.filter(
    (order) => order.fulfillment_status === "Complete",
  );
  const totalValue = paidOrders.reduce(
    (total, order) => total + (Number(order.amount) || 0),
    0,
  );
  const taskProgress = (order: any) => {
    const tasks = order.tasks || [];
    if (!tasks.length) return 0;
    const done = tasks.filter((task: any) =>
      ["Done", "Approved"].includes(task.status),
    ).length;
    return Math.round((done / tasks.length) * 100);
  };
  return (
    <div className="page my-orders-page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">MY ORDER</div>
          <h1>Order &amp; progress undangan Anda</h1>
          <p>
            Pantau pembayaran, tim yang mengerjakan, progress pengerjaan, dan
            receipt dalam satu halaman.
          </p>
        </div>
      </div>
      <section className="invitee-summary my-order-summary">
        <article>
          <PackageCheck size={20} />
          <strong>{orders.length}</strong>
          <span>Total order</span>
        </article>
        <article>
          <Clock3 size={20} />
          <strong>{paidOrders.length - doneOrders.length}</strong>
          <span>Sedang dikerjakan</span>
        </article>
        <article>
          <CheckCircle size={20} />
          <strong>{doneOrders.length}</strong>
          <span>Selesai</span>
        </article>
        <article>
          <ReceiptText size={20} />
          <strong>{formatRupiah(totalValue)}</strong>
          <span>Total dibayar</span>
        </article>
      </section>
      <div className="project-order-grid">
        {orders.map((order) => {
          const progress = taskProgress(order);
          const paid = order.payment_status === "Paid";
          return (
          <article key={order.id} className="project-order-card">
            <header>
              <div>
                <span>{order.order_no}</span>
                <h2>{order.template_name}</h2>
                <small className="project-order-date">
                  Dipesan {formatShortDate(order.created_at)}
                </small>
              </div>
              <span
                className={`status ${String(order.payment_status).toLowerCase()}`}
              >
                {paid ? "Lunas" : "Menunggu pembayaran"}
              </span>
            </header>
            {/* QA TC-176: progress pengerjaan ditampilkan sebagai bar, bukan
                hanya daftar task yang harus dibaca satu per satu. */}
            {paid && (order.tasks || []).length > 0 && (
              <div className="project-progress">
                <div className="project-progress-head">
                  <span>Progress pengerjaan</span>
                  <strong>{progress}%</strong>
                </div>
                <div className="project-progress-bar">
                  <i style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
            {/* TC-222 — billing sebagai daftar ke bawah (label kiri, nilai
                kanan), bukan kotak-kotak, supaya terbaca seperti tagihan. */}
            <dl className="billing-list">
              <div>
                <dt>No. order</dt>
                <dd>{order.order_no}</dd>
              </div>
              <div>
                <dt>Template</dt>
                <dd>{order.template_name}</dd>
              </div>
              <div>
                <dt>Tanggal pesan</dt>
                <dd>{formatShortDate(order.created_at)}</dd>
              </div>
              <div>
                <dt>Status pembayaran</dt>
                <dd>{paid ? "Lunas" : "Menunggu pembayaran"}</dd>
              </div>
              {order.payment_method && (
                <div>
                  <dt>Metode pembayaran</dt>
                  <dd>{order.payment_method}</dd>
                </div>
              )}
              {order.paid_at && (
                <div>
                  <dt>Tanggal bayar</dt>
                  <dd>{formatShortDate(order.paid_at)}</dd>
                </div>
              )}
              <div>
                <dt>Status project</dt>
                <dd>{order.order_status}</dd>
              </div>
              <div>
                <dt>Customer Service</dt>
                <dd>{order.cs_name || "Menunggu assignment"}</dd>
              </div>
              <div>
                <dt>Web Designer</dt>
                <dd>{order.editor_name || "Menunggu assignment"}</dd>
              </div>
              <div className="billing-total">
                <dt>Total</dt>
                <dd>{formatRupiah(order.amount)}</dd>
              </div>
            </dl>
            <div className="project-timeline">
              {(order.tasks || []).map((task: any, index: number) => (
                <div
                  key={task.id}
                  className={
                    ["Done", "Approved"].includes(task.status) ? "done" : ""
                  }
                >
                  <i>
                    {["Done", "Approved"].includes(task.status) ? (
                      <Check size={12} />
                    ) : (
                      index + 1
                    )}
                  </i>
                  <span>
                    <strong>{task.title}</strong>
                    <small>
                      {task.status} · {task.priority}
                    </small>
                  </span>
                </div>
              ))}
            </div>
            <footer>
              {order.receiptUrl && (
                <a
                  href={assetUrl(order.receiptUrl)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ReceiptText size={15} />
                  Download receipt
                </a>
              )}
              {order.conversation && (
                <button onClick={() => setView("help")}>
                  <MessageCircle size={15} />
                  Hubungi support
                </button>
              )}
            </footer>
          </article>
          );
        })}
      </div>
    </div>
  );
}

function AuditLogPage({
  logs,
  onRefresh,
}: {
  logs: any[];
  onRefresh: () => Promise<void>;
}) {
  const [query, setQuery] = useState("");
  const filtered = logs.filter((log) =>
    `${log.action} ${log.entity_type} ${log.actor_name || ""} ${JSON.stringify(log.details || {})}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">GOVERNANCE</div>
          <h1>Audit Trail</h1>
          <p>
            Riwayat perubahan akses dan tindakan operasional berisiko tinggi.
          </p>
        </div>
        <button className="secondary-btn" onClick={() => void onRefresh()}>
          <Repeat2 size={16} />
          Refresh
        </button>
      </div>
      <div className="panel audit-panel">
        <div className="panel-head">
          <div>
            <h3>Recent platform events</h3>
            <p>{filtered.length} event</p>
          </div>
          <div className="search-field compact">
            <Search size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search action, actor, entity"
            />
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Actor</th>
              <th>Action</th>
              <th>Entity</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log) => (
              <tr key={log.id}>
                <td>{new Date(log.created_at).toLocaleString("id-ID")}</td>
                <td>
                  {log.actor_name || "System"}
                  <small>{log.actor_email || ""}</small>
                </td>
                <td>
                  <strong>{log.action}</strong>
                </td>
                <td>
                  {log.entity_type} · {log.entity_id || "—"}
                </td>
                <td>
                  <code>{JSON.stringify(log.details || {})}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SoundLibrary({
  catalog,
  addSound,
  deleteSound,
}: {
  catalog: SoundCatalogItem[];
  addSound: (
    name: string,
    category: string,
    description: string,
    file: File,
  ) => Promise<boolean>;
  deleteSound: (id: string) => void;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Romantic");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [adding, setAdding] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const submit = async () => {
    if (!name.trim() || !file) return;
    setAdding(true);
    const success = await addSound(
      name.trim(),
      category,
      description.trim() || "Custom sound uploaded by Administrator.",
      file,
    );
    setAdding(false);
    if (success) {
      setName("");
      setDescription("");
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
    }
  };
  return (
    <div className="page sound-library-page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">MEDIA LIBRARY</div>
          <h1>Sound Catalog</h1>
          <p>
            Administrator dapat menambahkan backsound global yang tersedia di
            Feature Sound milik Customer dan Web Designer.
          </p>
        </div>
        <span className="online-badge">
          <Music2 size={14} /> {catalog.length} sound tersedia
        </span>
      </div>
      <div className="sound-library-layout">
        <section className="panel sound-upload-panel">
          <div className="panel-head">
            <div>
              <h3>Add catalog sound</h3>
              <p>Audio, MP3, M4A, WAV, OGG, AAC, atau MP4 maksimal 15 MB.</p>
            </div>
          </div>
          <label>
            Sound name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Contoh: Nusantara Acoustic"
            />
          </label>
          <label>
            Category
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option>Romantic</option>
              <option>Elegant</option>
              <option>Cinematic</option>
              <option>Fairytale</option>
              <option>Traditional</option>
              <option>Modern</option>
            </select>
          </label>
          <label>
            Description
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Deskripsi singkat suasana sound."
            />
          </label>
          <input
            ref={fileRef}
            type="file"
            onClick={resetFileInput}
            accept="audio/*,video/mp4,.mp3,.m4a,.wav,.ogg,.aac,.mp4"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
          />
          <button
            className="primary-btn full"
            disabled={!name.trim() || !file || adding}
            onClick={() => void submit()}
          >
            <Upload size={16} />{" "}
            {adding ? "Uploading..." : "Add to Sound Catalog"}
          </button>
        </section>
        <section className="sound-catalog-grid">
          {catalog.map((item) => (
            <article className="sound-catalog-card" key={item.id}>
              <div className="sound-cover">
                <Disc3 size={32} />
                <span>{item.category}</span>
              </div>
              <div>
                <div className="sound-card-heading">
                  <h3>{item.name}</h3>
                  {item.builtIn && <span>Built-in</span>}
                </div>
                <p>{item.description}</p>
                <small>
                  {item.fileName || item.preset} · {item.createdAt}
                </small>
                <div className="sound-card-actions">
                  <CatalogSoundPreview item={item} />
                  {!item.builtIn && (
                    <button
                      className="danger"
                      onClick={() => deleteSound(item.id)}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}

function CatalogSoundPreview({ item }: { item: SoundCatalogItem }) {
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef<{ stop: () => void } | null>(null);
  const toggle = () => {
    if (playing) {
      playerRef.current?.stop();
      playerRef.current = null;
      setPlaying(false);
      return;
    }
    playerRef.current = createSoundPlayback(
      {
        ...makeFeature("sound"),
        soundPreset: item.preset,
        mediaUrl: item.mediaUrl,
        body: item.name,
      },
      true,
    );
    setPlaying(true);
  };
  useEffect(() => () => playerRef.current?.stop(), []);
  return (
    <button onClick={toggle}>
      {playing ? <Pause size={14} /> : <Play size={14} />}{" "}
      {playing ? "Stop" : "Preview"}
    </button>
  );
}

function AccountCreateModal({
  onClose,
  onCreate,
  existingUsernames,
  roles = [],
}: {
  onClose: () => void;
  onCreate: (payload: {
    name: string;
    username: string;
    password: string;
    role: Role;
    email: string;
  }) => void | Promise<void>;
  existingUsernames: string[];
  roles?: RoleItem[];
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<string>(
    roles.find((item) => item.name === "User")?.name || "User",
  );
  const taken = existingUsernames
    .map((item) => item.toLowerCase())
    .includes(username.toLowerCase());
  const availableRoles = roles.length
    ? roles.map((item) => item.name)
    : ["User", "Editor", "Admin", "Customer Service"];
  return (
    <div className="dialog-overlay">
      <div className="template-create-dialog">
        <header>
          <div>
            <span>ACCOUNT MANAGEMENT</span>
            <h2>Create login account</h2>
          </div>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </header>
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Username
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          Password
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </label>
        <label>
          Role
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            {availableRoles.map((item) => (
              <option key={item} value={item}>
                {displayRole(item)}
              </option>
            ))}
          </select>
        </label>
        {taken && (
          <p className="muted" style={{ color: "#a75d56" }}>
            Username sudah dipakai.
          </p>
        )}
        <footer>
          <button className="secondary-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="primary-btn"
            disabled={
              !name.trim() ||
              !email.trim() ||
              !username.trim() ||
              password.length < 8 ||
              taken
            }
            onClick={() =>
              void onCreate({
                name: name.trim(),
                username: username.trim(),
                password,
                role: role as Role,
                email: email.trim() || `${username.trim()}@ikrarku.id`,
              })
            }
          >
            <UserPlus size={16} />
            Create Account
          </button>
        </footer>
      </div>
    </div>
  );
}

function ArticleReaderPage({
  article,
  onBack,
  publicMode = false,
}: {
  article: ArticleItem;
  onBack: () => void;
  publicMode?: boolean;
}) {
  return (
    <div className={`article-reader-page wide ${publicMode ? "public" : ""}`}>
      <header>
        <button onClick={onBack}>
          <ArrowLeft size={16} /> Back
        </button>
        {publicMode ? <Brand /> : <span>IKRARKU ARTICLE</span>}
        <div>{article.category}</div>
      </header>
      <main>
        <section
          className="reader-hero-wide"
          style={{
            backgroundImage: article.coverUrl
              ? `linear-gradient(90deg,rgba(4,22,17,.90),rgba(4,22,17,.28)),url(${article.coverUrl})`
              : undefined,
          }}
        >
          <div>
            <span>{article.category}</span>
            <h1>{article.title}</h1>
            <p>{article.excerpt}</p>
            <small>
              <time dateTime={article.date}>
                {formatArticleDate(article.date)}
              </time>{" "}
              · {article.author}
            </small>
          </div>
        </section>
        <div className="reader-body-wide">
          <article>
            <div
              className="reader-page-content"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
            <footer>
              {article.tags.map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
            </footer>
          </article>
          <aside>
            <Brand />
            <strong>Continue your wedding journey.</strong>
            <p>
              Explore template, planning guide, dan wedding website yang
              dikelola dalam satu platform.
            </p>
          </aside>
        </div>
      </main>
    </div>
  );
}

function AccountSettingsModal({
  account,
  onClose,
  onSave,
}: {
  account: AuthAccount;
  onClose: () => void;
  onSave: (patch: Partial<AuthAccount>) => void;
}) {
  const [firstName, setFirstName] = useState(
    account.firstName || account.name.split(" ")[0] || "",
  );
  const [lastName, setLastName] = useState(
    account.lastName || account.name.split(" ").slice(1).join(" "),
  );
  const [email, setEmail] = useState(account.email);
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const sensitive =
    email.trim().toLowerCase() !== account.email.toLowerCase() ||
    Boolean(password);
  return (
    <div className="dialog-overlay">
      <div className="template-create-dialog account-settings-dialog">
        <header>
          <div>
            <span>ACCOUNT SETTINGS</span>
            <h2>Profile & Security</h2>
          </div>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </header>
        <div className="two-inputs">
          <label>
            First Name
            <input
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </label>
          <label>
            Last Name
            <input
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </label>
        </div>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label>
          New Password
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Kosongkan jika tidak diubah"
            />
            <button
              type="button"
              aria-label={
                showPassword ? "Hide new password" : "Show new password"
              }
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </label>
        {sensitive && (
          <label>
            Current Password
            <div className="password-field">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                placeholder="Diperlukan untuk perubahan sensitif"
              />
              <button
                type="button"
                aria-label={
                  showCurrent
                    ? "Hide current password"
                    : "Show current password"
                }
                onClick={() => setShowCurrent((v) => !v)}
              >
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>
        )}
        <div className="info-box">
          <ShieldCheck size={17} />
          <p>
            Untuk keamanan, perubahan email atau password memerlukan password
            Anda saat ini.
          </p>
        </div>
        <footer>
          <button className="secondary-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="primary-btn"
            disabled={sensitive && !currentPassword}
            onClick={() =>
              onSave({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim(),
                password,
                currentPassword,
              })
            }
          >
            <Save size={16} /> Save Settings
          </button>
        </footer>
      </div>
    </div>
  );
}

function LeaveEditorModal({
  onCancel,
  onSave,
  onDiscard,
}: {
  onCancel: () => void;
  onSave: () => void;
  onDiscard: () => void;
}) {
  return (
    <div className="dialog-overlay">
      <div className="confirm-dialog">
        <div className="dialog-icon">
          <Save size={22} />
        </div>
        <h2>Simpan perubahan?</h2>
        <p>
          Anda memiliki perubahan pada canvas. Simpan sebelum kembali ke halaman
          sebelumnya?
        </p>
        <div>
          <button className="secondary-btn" onClick={onCancel}>
            Batal
          </button>
          <button className="secondary-btn" onClick={onDiscard}>
            Discard
          </button>
          <button className="primary-btn" onClick={onSave}>
            <Save size={15} /> Save & Leave
          </button>
        </div>
      </div>
    </div>
  );
}

function createAudioPreset(feature: Feature, loop = false) {
  const AudioContextClass =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioContextClass)
    return {
      stop: () => undefined,
      pause: () => undefined,
      resume: () => undefined,
    };
  const context = new AudioContextClass();
  const presets: Record<string, number[]> = {
    "romantic-piano": [261.63, 329.63, 392, 523.25, 392, 329.63],
    "garden-strings": [220, 293.66, 349.23, 440, 349.23, 293.66],
    "cinematic-bloom": [196, 246.94, 293.66, 392, 293.66, 246.94],
    "storybook-chimes": [329.63, 392, 523.25, 659.25, 523.25, 392],
  };
  const notes =
    presets[feature.soundPreset || "romantic-piano"] ||
    presets["romantic-piano"];
  let stopped = false;
  // Saat tab disembunyikan, interval di bawah tetap berdetak dan dulu memanggil
  // context.resume() — menghidupkan lagi suara yang baru saja dijeda.
  let paused = false;
  const playSequence = async () => {
    if (stopped || paused) return;
    if (context.state === "suspended") await context.resume();
    notes.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type =
        feature.soundPreset === "garden-strings" ? "triangle" : "sine";
      oscillator.frequency.setValueAtTime(
        frequency,
        context.currentTime + index * 0.34,
      );
      gain.gain.setValueAtTime(0.0001, context.currentTime + index * 0.34);
      gain.gain.exponentialRampToValueAtTime(
        0.11,
        context.currentTime + index * 0.34 + 0.04,
      );
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        context.currentTime + index * 0.34 + 0.58,
      );
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(context.currentTime + index * 0.34);
      oscillator.stop(context.currentTime + index * 0.34 + 0.62);
    });
  };
  void playSequence();
  const timer = loop
    ? window.setInterval(() => void playSequence(), 3200)
    : undefined;
  return {
    stop: () => {
      stopped = true;
      if (timer) window.clearInterval(timer);
      void context.close();
    },
    pause: () => {
      paused = true;
      if (context.state === "running") void context.suspend();
    },
    resume: () => {
      if (stopped) return;
      paused = false;
      void context.resume();
    },
  };
}

type SoundHandle = { stop: () => void; pause: () => void; resume: () => void };

/**
 * A4 (MoM 13 Okt) & QA — musik tetap berbunyi saat tamu pindah ke tab lain.
 *
 * Semua pemutaran (live, preview, preview landing, editor) lewat
 * createSoundPlayback, jadi aturannya dipasang sekali di sini: saat halaman
 * tersembunyi semua pemutar aktif dijeda, dan saat kembali hanya yang tadi
 * memang sedang berbunyi yang dilanjutkan. Musik yang dimatikan tamu tidak
 * ikut hidup lagi.
 */
const activeSounds = new Set<SoundHandle>();
const pausedByVisibility = new Set<SoundHandle>();
if (typeof document !== "undefined") {
  const pauseAll = () => {
    for (const sound of activeSounds) {
      sound.pause();
      pausedByVisibility.add(sound);
    }
  };
  const resumeAll = () => {
    for (const sound of pausedByVisibility)
      if (activeSounds.has(sound)) sound.resume();
    pausedByVisibility.clear();
  };
  document.addEventListener("visibilitychange", () =>
    document.hidden ? pauseAll() : resumeAll(),
  );
  // Safari iOS tidak selalu mengirim visibilitychange saat tab ditutup atau
  // aplikasi dipindah; pagehide menutup celah itu.
  window.addEventListener("pagehide", pauseAll);
  window.addEventListener("pageshow", resumeAll);
}

function createSoundPlayback(feature: Feature, loop = true) {
  let inner: SoundHandle;
  if (feature.mediaUrl) {
    const audio = new Audio(assetUrl(feature.mediaUrl));
    audio.loop = loop;
    audio.volume = 0.72;
    // Tab yang dibuka di latar belakang tidak boleh mulai bersuara.
    if (!(typeof document !== "undefined" && document.hidden))
      void audio.play().catch(() => undefined);
    inner = {
      stop: () => {
        audio.pause();
        audio.currentTime = 0;
      },
      pause: () => audio.pause(),
      resume: () => void audio.play().catch(() => undefined),
    };
  } else inner = createAudioPreset(feature, loop);
  const handle: SoundHandle = {
    stop: () => {
      activeSounds.delete(handle);
      pausedByVisibility.delete(handle);
      inner.stop();
    },
    pause: () => inner.pause(),
    resume: () => inner.resume(),
  };
  activeSounds.add(handle);
  if (typeof document !== "undefined" && document.hidden) {
    inner.pause();
    pausedByVisibility.add(handle);
  }
  return handle;
}

function SoundFeature({ feature }: { feature: Feature }) {
  const playerRef = useRef<{ stop: () => void } | null>(null);
  const [playing, setPlaying] = useState(false);
  const toggle = () => {
    if (playing) {
      playerRef.current?.stop();
      playerRef.current = null;
      setPlaying(false);
      return;
    }
    playerRef.current = createSoundPlayback(feature, true);
    setPlaying(true);
  };
  useEffect(() => () => playerRef.current?.stop(), []);
  // QA TC-165: kartu Sound yang besar dihapus. Judul lagu sekarang hanya tampil
  // pada Credit / Watermark, jadi feature sound pada template lama tinggal
  // menyisakan kontrol pemutar ringkas agar tidak ada tampilan ganda.
  return (
    <div className="sound-feature compact">
      <button type="button" onClick={toggle}>
        {playing ? <VolumeX size={16} /> : <Volume2 size={16} />}
        <Disc3 size={16} className={playing ? "spinning" : ""} />
        <span>{playing ? "Hentikan backsound" : "Putar backsound"}</span>
      </button>
    </div>
  );
}

function FeatureIcon({ type }: { type: FeatureType }) {
  const map: Record<FeatureType, typeof Type> = {
    text: Type,
    form: FormInput,
    image: ImageIcon,
    video: Video,
    gallery: ImageIcon,
    event: CalendarDays,
    greetings: MessageCircle,
    quote: Sparkles,
    gift: Crown,
    "invitation-cover": MailOpen,
    countdown: TimerReset,
    location: MapPin,
    sound: PlayCircle,
    icon: Heart,
    "love-story": BookOpen,
    credit: BadgeCheck,
    "live-stream": Radio,
  };
  const Icon = map[type];
  return <Icon size={14} />;
}

function ConfirmModal({
  title,
  description,
  confirmLabel,
  onCancel,
  onConfirm,
}: {
  title: string;
  description: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="dialog-overlay">
      <div className="confirm-dialog">
        <div className="dialog-icon danger">
          <Trash2 size={22} />
        </div>
        <h2>{title}</h2>
        <p>{description}</p>
        <div>
          <button className="secondary-btn" onClick={onCancel}>
            Batal
          </button>
          <button className="danger-btn" onClick={onConfirm}>
            <Trash2 size={15} /> {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function TemplateCreatorModal({
  onClose,
  onCreate,
  canSetPrice = false,
}: {
  canSetPrice?: boolean;
  onClose: () => void;
  onCreate: (
    name: string,
    category: string,
    accent: string,
    price: number,
    description: string,
  ) => void;
}) {
  const [name, setName] = useState("New Signature Theme");
  const [category, setCategory] = useState("Elegant");
  const [accent, setAccent] = useState("#125946");
  // MoM A7 — harga ditetapkan Administrator; pengajuan Web Designer tanpa harga.
  const [price, setPrice] = useState(canSetPrice ? 499000 : 0);
  const [description, setDescription] = useState(
    "Template wedding website dengan visual storytelling, motion, RSVP, gallery, dan onboarding project.",
  );
  return (
    <div className="dialog-overlay">
      <div className="template-create-dialog">
        <header>
          <div>
            <span>WEB DESIGNER TEMPLATE SUBMISSION</span>
            <h2>Create a reusable template</h2>
          </div>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </header>
        <p>
          {canSetPrice
            ? "Template buatan Administrator langsung publish dengan harga yang Anda tetapkan."
            : "Template berstatus Pending sampai disetujui Administrator. Harga ditetapkan Administrator saat review."}
        </p>
        <label>
          Template name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <label>
          Category
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option>Elegant</option>
            <option>Editorial</option>
            <option>Cinematic</option>
            <option>Fairytale</option>
            <option>Traditional</option>
            <option>Modern</option>
          </select>
        </label>
        <label>
          Description
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
        <div className="two-cols">
          {canSetPrice ? (
            <label>
              Harga (IDR)
              <input
                type="number"
                min="0"
                step="50000"
                value={price}
                onChange={(event) => setPrice(Number(event.target.value))}
              />
            </label>
          ) : (
            <label>
              Harga
              <input value="Ditetapkan Administrator" disabled readOnly />
            </label>
          )}
          <label>
            Accent color
            <ColorInput value={accent} fallback="#125946" onChange={(next) => setAccent(next ?? "#125946")} />
          </label>
        </div>
        <div
          className="template-create-preview"
          style={{ "--template-accent": accent } as React.CSSProperties}
        >
          <small>{category.toUpperCase()}</small>
          {/* QA TC-128: preview memakai nama template, tanpa nama default. */}
          <strong>{name || "Nama template"}</strong>
          <span>{description || "Deskripsi template"}</span>
          <em>{price ? formatRupiah(price) : "Harga menyusul"}</em>
        </div>
        <footer>
          <button className="secondary-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="primary-btn"
            disabled={!name.trim()}
            onClick={() =>
              onCreate(name.trim(), category, accent, price, description)
            }
          >
            <Palette size={16} /> Create & Edit Canvas
          </button>
        </footer>
      </div>
    </div>
  );
}

function LoadingLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`loading-logo ${compact ? "compact" : ""}`}>
      <img
        className="loading-brand-logo"
        src="/brand/ikrarku-logo.png"
        alt="ikrarku"
      />
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="app-loading">
      <LoadingLogo />
      <p>Menyiapkan cerita terbaik Anda...</p>
      <div className="loading-line">
        <i />
      </div>
    </div>
  );
}

/** TC-218 — foto ponsel umumnya 2–6 MB, jauh di atas batas upload gambar.
 *  Dulu ditolak; kini diperkecil otomatis di browser (sisi terpanjang
 *  maks 2000 px, JPEG/WebP) sampai di bawah batas. GIF tidak disentuh
 *  karena animasinya akan hilang. */
async function shrinkImageToLimit(file: File, maxBytes: number): Promise<File> {
  if (
    file.size <= maxBytes ||
    !file.type.startsWith("image/") ||
    file.type === "image/gif" ||
    file.type === "image/svg+xml"
  )
    return file;
  try {
    const bitmap = await createImageBitmap(file);
    const keepAlpha = file.type === "image/png" || file.type === "image/webp";
    const outType = keepAlpha ? "image/webp" : "image/jpeg";
    let side = 2000;
    for (let attempt = 0; attempt < 6; attempt++) {
      const scale = Math.min(1, side / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const quality = Math.max(0.55, 0.86 - attempt * 0.08);
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, outType, quality),
      );
      if (blob && blob.size <= maxBytes) {
        const name = file.name.replace(/\.[^.]+$/, "") + (keepAlpha ? ".webp" : ".jpg");
        return new File([blob], name, { type: outType });
      }
      side = Math.round(side * 0.8);
    }
  } catch {
    /* format tidak bisa dibaca browser: biarkan validasi lama menolak */
  }
  return file;
}

/** TC-218 — browser tidak memicu onChange bila berkas yang dipilih sama
 *  dengan pilihan sebelumnya. Setelah satu upload ditolak (mis. terlalu
 *  besar), memilih berkas itu lagi — atau versi yang sudah dikompres dengan
 *  nama sama — tidak melakukan apa pun tanpa pesan, sehingga upload terasa
 *  "tiba-tiba tidak bisa". Mengosongkan nilai input setiap kali dialog dibuka
 *  menjamin setiap pilihan diproses. */
function resetFileInput(event: React.MouseEvent<HTMLInputElement>) {
  event.currentTarget.value = "";
}

/** TC-245 — dialog yang tidak bisa ditutup sampai password baru dibuat. */
function FirstPasswordDialog({ onDone }: { onDone: () => void }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    setError("");
    if (password.length < 8) return setError("Password minimal 8 karakter.");
    if (password !== confirm) return setError("Konfirmasi password tidak sama.");
    setBusy(true);
    try {
      await api.firstPassword(password, confirm);
      onDone();
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Gagal menyimpan password.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div
      className="dialog-overlay first-password-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="first-password-title"
    >
      <form
        className="first-password-dialog"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <KeyRound size={26} />
        <h2 id="first-password-title">Buat password baru</h2>
        <p>
          Akun Anda dibuat otomatis setelah pembayaran dengan password
          sementara. Buat password baru sebelum melanjutkan.
        </p>
        <label>
          Password baru
          <input
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoFocus
          />
        </label>
        <label>
          Ulangi password baru
          <input
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
          />
        </label>
        <small>Minimal 8 karakter, berbeda dari password sementara.</small>
        {error && (
          <p className="password-error" role="alert">
            {error}
          </p>
        )}
        <button className="primary-btn" type="submit" disabled={busy}>
          {busy ? "Menyimpan..." : "Simpan password"}
        </button>
      </form>
    </div>
  );
}

function Toast({ message }: { message: string }) {
  return (
    <div className="toast">
      <Check size={16} /> {message}
    </div>
  );
}

/* =====================================================================
   QA REMEDIATION — komponen & helper baru (Canvas Editor)
   ===================================================================== */

// TC-081
function resolveFormSpecs(feature: Feature): FormFieldSpec[] {
  if (feature.formSpecs?.length) return feature.formSpecs;
  const legacy = feature.formFields || ["Nama lengkap", "Email", "Pesan"];
  return legacy.map((label, index) => ({
    id: `legacy-${index}`,
    label,
    kind: /email/i.test(label)
      ? "email"
      : /pesan|message|catatan/i.test(label)
        ? "textarea"
        : /jumlah|pax/i.test(label)
          ? "number"
          : "text",
    width: "full" as const,
  }));
}

// TC-103 — feature dapat digeser & di-resize bebas di dalam Column.
function startFreeMove(
  event: React.PointerEvent,
  feature: Feature,
  onUpdate: (patch: Partial<Feature>) => void,
  /** Jarak pointer (px) sebelum drag dianggap mulai. 0 = langsung. */
  threshold = 0,
) {
  if (feature.locked) return;
  if (!threshold) {
    event.preventDefault();
    event.stopPropagation();
  }
  const block = (event.currentTarget as HTMLElement).closest(
    ".feature-block",
  ) as HTMLElement | null;
  const parent = block?.parentElement;
  if (!block || !parent) return;
  // Dulu device ditebak dari lebar DOM lalu ditulis ke `mobileLayout`. Dua
  // akibatnya: (a) di mode Mobile patch berakhir di `mobile.mobileLayout`
  // (bersarang ganda, tidak pernah terbaca), dan (b) pada jendela Desktop yang
  // sempit drag diam-diam menulis ke nilai mobile. `feature` di sini sudah
  // di-resolve per device dan `onUpdate` sudah melewati applyDevicePatch,
  // jadi patch biasa otomatis mendarat di slot device yang benar.
  const rect = parent.getBoundingClientRect(),
    scale = rect.width / Math.max(1, parent.clientWidth);
  const startX = event.clientX,
    startY = event.clientY,
    baseX = feature.posX ?? 5,
    baseY = feature.posY ?? 12;
  let armed = threshold === 0;
  const move = (e: PointerEvent) => {
    if (!armed) {
      if (
        Math.abs(e.clientX - startX) < threshold &&
        Math.abs(e.clientY - startY) < threshold
      )
        return;
      armed = true;
      // Begitu drag benar-benar dimulai, cegah seleksi teks ikut tersapu.
      document.body.style.userSelect = "none";
    }
    const dx = ((e.clientX - startX) / Math.max(1, rect.width)) * 100,
      dy = (e.clientY - startY) / Math.max(0.01, scale);
    onUpdate({
      posX:
        Math.round(
          Math.max(
            -100,
            Math.min(100, baseX + dx * (feature.anchorX === "right" ? -1 : 1)),
          ) * 10,
        ) / 10,
      posY: Math.round(
        Math.max(-5000, baseY + dy * (feature.anchorY === "bottom" ? -1 : 1)),
      ),
    });
  };
  const end = () => {
    document.body.style.userSelect = "";
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", end);
    window.removeEventListener("pointercancel", end);
  };
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", end);
  window.addEventListener("pointercancel", end);
}
function startFreeResize(
  event: React.PointerEvent,
  feature: Feature,
  onUpdate: (patch: Partial<Feature>) => void,
) {
  event.preventDefault();
  event.stopPropagation();
  if (feature.locked) return;
  const block = (event.currentTarget as HTMLElement).closest(
    ".feature-block",
  ) as HTMLElement | null;
  const parent = block?.parentElement;
  if (!block || !parent) return;
  // Dulu device ditebak dari lebar DOM lalu ditulis ke `mobileLayout`. Dua
  // akibatnya: (a) di mode Mobile patch berakhir di `mobile.mobileLayout`
  // (bersarang ganda, tidak pernah terbaca), dan (b) pada jendela Desktop yang
  // sempit drag diam-diam menulis ke nilai mobile. `feature` di sini sudah
  // di-resolve per device dan `onUpdate` sudah melewati applyDevicePatch,
  // jadi patch biasa otomatis mendarat di slot device yang benar.
  const rect = parent.getBoundingClientRect(),
    scale = rect.width / Math.max(1, parent.clientWidth),
    startX = event.clientX,
    startY = event.clientY;
  const w = feature.boxWidth ?? 60,
    h = feature.boxHeight || block.offsetHeight;
  const move = (e: PointerEvent) =>
    onUpdate({
      boxWidth: Math.round(
        Math.min(
          100,
          Math.max(
            5,
            w + ((e.clientX - startX) / Math.max(1, rect.width)) * 100,
          ),
        ),
      ),
      boxHeight: Math.round(
        Math.max(30, h + (e.clientY - startY) / Math.max(0.01, scale)),
      ),
    });
  const end = () => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", end);
    window.removeEventListener("pointercancel", end);
  };
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", end);
  window.addEventListener("pointercancel", end);
}

// TC-078/079/082..089/095 — blok teks bebas yang bisa ditambahkan pada feature apa pun.
/**
 * QA TC-171 — teks tambahan dapat ditempatkan bebas di dalam section.
 *
 * Item dengan `free: true` dilepas dari aliran normal dan diposisikan terhadap
 * section; di editor ia dapat digeser langsung dengan pointer. Item tanpa
 * `free` tetap berperilaku seperti sebelumnya (menumpuk di bawah feature),
 * sehingga template yang sudah ada tidak berubah tampilannya.
 */
function startExtraTextMove(
  event: React.PointerEvent,
  item: ExtraText,
  onMove: (patch: { posX: number; posY: number }) => void,
) {
  event.preventDefault();
  event.stopPropagation();
  const node = event.currentTarget as HTMLElement;
  const section = node.closest(".canvas-section") as HTMLElement | null;
  if (!section) return;
  const rect = section.getBoundingClientRect();
  const startX = event.clientX;
  const startY = event.clientY;
  const baseX = item.posX ?? 50;
  const baseY = item.posY ?? 0;
  const move = (e: PointerEvent) => {
    const dx = ((e.clientX - startX) / Math.max(1, rect.width)) * 100;
    const dy = e.clientY - startY;
    onMove({
      posX: Math.round(Math.max(0, Math.min(100, baseX + dx)) * 10) / 10,
      posY: Math.round(Math.max(-2000, baseY + dy)),
    });
  };
  const up = () => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", up);
  };
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
}

function ExtraTextBlocks({
  feature,
  editable,
  onUpdate,
}: {
  feature: Feature;
  editable: boolean;
  onUpdate: (patch: Partial<Feature>) => void;
}) {
  const items = feature.extraTexts || [];
  if (!items.length) return null;
  const patchItem = (id: string, patch: Partial<ExtraText>) =>
    onUpdate({
      extraTexts: items.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    });
  const canEdit = editable && !feature.locked;
  const renderLine = (item: ExtraText) => (
    <div
      key={item.id}
      className={`extra-text-line ${item.free ? "is-free" : ""}`}
      contentEditable={canEdit}
      suppressContentEditableWarning
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          document.execCommand("insertLineBreak");
        }
      }}
      onBlur={(event) => {
        const next = (event.currentTarget as HTMLElement).innerText.replace(
          /\n$/,
          "",
        );
        if (next !== (item.text ?? "")) patchItem(item.id, { text: next });
      }}
      style={{
        fontSize: item.fontSize,
        textAlign: item.align,
        color: item.color,
        fontWeight: item.bold ? 700 : 400,
        fontStyle: item.italic ? "italic" : "normal",
        fontFamily: item.fontFamily || "inherit",
        marginTop: item.free ? undefined : (item.spacing ?? 8),
        whiteSpace: "pre-wrap",
        ...(item.free
          ? {
              position: "absolute" as const,
              left: `${item.posX ?? 50}%`,
              top: `${item.posY ?? 0}px`,
              transform: "translateX(-50%)",
              zIndex: 4,
            }
          : {}),
      }}
    >
      {canEdit && item.free && (
        <span
          className="extra-text-drag"
          title="Geser untuk memindahkan teks"
          onPointerDown={(event) =>
            startExtraTextMove(event, item, (patch) =>
              patchItem(item.id, patch),
            )
          }
          contentEditable={false}
        >
          <Move size={11} />
        </span>
      )}
      {item.text}
    </div>
  );
  const flowItems = items.filter((item) => !item.free);
  const freeItems = items.filter((item) => item.free);
  return (
    <>
      {flowItems.length > 0 && (
        <div className="extra-text-stack">{flowItems.map(renderLine)}</div>
      )}
      {freeItems.map(renderLine)}
    </>
  );
}

// Editor teks tambahan pada inspector.
function ExtraTextEditor({
  feature,
  update,
}: {
  feature: Feature;
  update: (patch: Partial<Feature>) => void;
}) {
  const items = feature.extraTexts || [];
  const add = () =>
    update({
      extraTexts: [
        ...items,
        {
          id: uid("xt"),
          text: "Teks baru",
          fontSize: 14,
          align: feature.align || "center",
          color: feature.textColor || "#154f40",
          spacing: 8,
        },
      ],
    });
  const patch = (id: string, next: Partial<ExtraText>) =>
    update({
      extraTexts: items.map((item) =>
        item.id === id ? { ...item, ...next } : item,
      ),
    });
  return (
    <div className="extra-text-editor">
      <div className="group-heading">
        <strong>Teks Tambahan</strong>
        <button onClick={add}>
          <Plus size={14} /> Tambah teks
        </button>
      </div>
      {!items.length && (
        <div className="layout-help">
          Belum ada teks tambahan. Klik <strong>Tambah teks</strong> untuk
          menambahkan baris teks bebas pada feature ini.
        </div>
      )}
      {items.map((item, index) => (
        <div className="extra-text-row" key={item.id}>
          <div className="extra-text-row-head">
            <span>Teks {index + 1}</span>
            <button
              onClick={() =>
                update({
                  extraTexts: items.filter((value) => value.id !== item.id),
                })
              }
            >
              <Trash2 size={13} />
            </button>
          </div>
          <textarea
            value={item.text}
            onChange={(event) => patch(item.id, { text: event.target.value })}
            placeholder="Tulis teks. Tekan Enter untuk baris baru."
          />
          {/* QA TC-171: teks tambahan tidak harus menempel di bawah section. */}
          <div className="setting-row compact">
            <div>
              <Move size={16} />
              <span>
                <strong>Posisi bebas</strong>
                <small>
                  Lepaskan teks dari urutan bawah, lalu geser langsung di canvas.
                </small>
              </span>
            </div>
            <button
              className={`toggle ${item.free ? "on" : ""}`}
              onClick={() =>
                patch(item.id, {
                  free: !item.free,
                  posX: item.posX ?? 50,
                  posY: item.posY ?? 0,
                })
              }
            >
              <i />
            </button>
          </div>
          {item.free && (
            <>
              <label>
                Posisi horizontal <span>{item.posX ?? 50}%</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.5"
                  value={item.posX ?? 50}
                  onChange={(event) =>
                    patch(item.id, { posX: Number(event.target.value) })
                  }
                />
              </label>
              <label>
                Posisi vertikal <span>{item.posY ?? 0}px</span>
                <input
                  type="range"
                  min="-200"
                  max="900"
                  step="2"
                  value={item.posY ?? 0}
                  onChange={(event) =>
                    patch(item.id, { posY: Number(event.target.value) })
                  }
                />
              </label>
            </>
          )}
          <div className="two-inputs">
            <label>
              Font size <span>{item.fontSize}px</span>
              <input
                type="range"
                min="8"
                max="72"
                value={item.fontSize}
                onChange={(event) =>
                  patch(item.id, { fontSize: Number(event.target.value) })
                }
              />
            </label>
            <label>
              Warna
              <ColorInput value={item.color} fallback="#ffffff" onChange={(next) => patch(item.id, { color: next })} />
            </label>
          </div>
          <div className="toolbar-row alignment">
            {(
              [
                ["left", AlignLeft],
                ["center", AlignCenter],
                ["right", AlignRight],
                ["justify", AlignJustify],
              ] as [Alignment, typeof AlignLeft][]
            ).map(([value, Icon]) => (
              <button
                key={value}
                className={item.align === value ? "active" : ""}
                onClick={() => patch(item.id, { align: value })}
              >
                <Icon size={15} />
              </button>
            ))}
            <button
              className={item.bold ? "active" : ""}
              onClick={() => patch(item.id, { bold: !item.bold })}
            >
              <Bold size={15} />
            </button>
            <button
              className={item.italic ? "active" : ""}
              onClick={() => patch(item.id, { italic: !item.italic })}
            >
              <Italic size={15} />
            </button>
          </div>
          <label>
            Jarak atas <span>{item.spacing ?? 8}px</span>
            <input
              type="range"
              min="0"
              max="60"
              value={item.spacing ?? 8}
              onChange={(event) =>
                patch(item.id, { spacing: Number(event.target.value) })
              }
            />
          </label>
        </div>
      ))}
    </div>
  );
}

// TC-083 — video autoplay, loop, dan mute.
// Video tidak lagi diputar sejak undangan dibuka. Playback baru dimulai ketika
// section video benar-benar masuk viewport, dan dijeda lagi saat keluar, supaya
// suara/video tidak berjalan di balik section lain dan tidak menghabiskan
// bandwidth tamu sebelum bagiannya dilihat.
const VIDEO_VISIBILITY_RATIO = 0.45;
function VideoFeature({ feature }: { feature: Feature }) {
  const thumbnail = useContext(ThumbnailContext);
  const ref = useRef<HTMLVideoElement | null>(null);
  // Sekali tamu menekan pause sendiri, observer berhenti ikut campur.
  const userPaused = useRef(false);
  const autoplay = feature.videoAutoplay !== false;
  useEffect(() => {
    const node = ref.current;
    if (!node || thumbnail) return;
    node.muted = feature.videoMuted !== false;
    if (!autoplay) return;
    userPaused.current = false;
    // Browser tanpa IntersectionObserver (atau saat dirender di luar dokumen)
    // tetap memakai perilaku lama supaya video tidak pernah "mati".
    if (typeof IntersectionObserver === "undefined") {
      void node.play().catch(() => undefined);
      return;
    }
    const onPause = () => {
      if (!node.ended && !node.seeking) userPaused.current = true;
    };
    const onPlay = () => {
      userPaused.current = false;
    };
    node.addEventListener("pause", onPause);
    node.addEventListener("play", onPlay);
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          if (!userPaused.current) void node.play().catch(() => undefined);
        } else if (!node.paused) {
          node.pause();
          // Jeda otomatis bukan jeda dari tamu.
          userPaused.current = false;
        }
      },
      { threshold: VIDEO_VISIBILITY_RATIO },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      node.removeEventListener("pause", onPause);
      node.removeEventListener("play", onPlay);
    };
  }, [autoplay, feature.videoMuted, feature.mediaUrl, thumbnail]);
  if (!feature.mediaUrl)
    return (
      <div className="video-feature">
        <div className="media-placeholder">
          <Video size={26} />
          <strong>Video Feature</strong>
          <span>Upload maksimal 5 MB</span>
        </div>
      </div>
    );
  return (
    <div className="video-feature">
      <video
        ref={ref}
        controls
        playsInline
        preload={thumbnail ? "none" : "metadata"}
        /* autoPlay sengaja tidak dipasang: pemutaran dikendalikan
           IntersectionObserver di atas supaya mulai saat section terlihat. */
        loop={feature.videoLoop !== false}
        muted={feature.videoMuted !== false}
        src={assetUrl(feature.mediaUrl)}
        style={{ borderRadius: feature.borderRadius }}
      />
    </div>
  );
}

// TC-088 — daftar rekening / e-wallet dengan nama bank.
// QA TC-121: warna kolom kartu dan teksnya dapat diatur sendiri agar teks putih
// tidak hilang di atas kolom putih transparan.
function giftCardStyle(feature: Feature): React.CSSProperties {
  return {
    background:
      withAlpha(
        feature.cardBackground,
        feature.boxOpacity !== undefined ? feature.boxOpacity / 100 : undefined,
      ) || "rgba(255,255,255,var(--box-alpha,.82))",
    color: feature.cardTextColor || "inherit",
    borderColor: feature.cardBorderColor || "rgba(22,77,62,.16)",
    borderRadius: feature.cardRadius ?? 12,
  };
}
// QA TC-125: kolom input dan button submit dapat disesuaikan dengan tema.
function inputFieldStyle(feature: Feature): React.CSSProperties {
  return {
    background: feature.fieldBackground || undefined,
    color: feature.fieldTextColor || undefined,
    borderColor: feature.fieldBorderColor || undefined,
    borderRadius: feature.fieldRadius ?? undefined,
  };
}
function submitButtonStyle(feature: Feature): React.CSSProperties {
  return {
    background: feature.buttonBackground || undefined,
    color: feature.buttonTextColor || undefined,
    borderRadius: feature.buttonRadius ?? undefined,
    borderStyle: feature.buttonBorderWidth ? "solid" : undefined,
    borderWidth: feature.buttonBorderWidth || undefined,
    borderColor: feature.buttonBorderColor || undefined,
  };
}
function bankLogoStyle(feature: Feature): React.CSSProperties {
  const shape = feature.bankLogoShape || "pill";
  return {
    ...(feature.bankLogoSize ? { fontSize: feature.bankLogoSize } : {}),
    ...(shape === "plain"
      ? { background: "transparent", padding: 0 }
      : feature.bankLogoBackground
        ? { background: feature.bankLogoBackground }
        : {}),
    ...(feature.bankLogoTextColor ? { color: feature.bankLogoTextColor } : {}),
    ...(shape === "square" ? { borderRadius: 4 } : {}),
    alignSelf: feature.bankLogoAlign || undefined,
  };
}
/** TC-241 — mode ringkas: hanya tombol "Lihat Rekening" yang membuka daftar
 *  rekening dan alamat kado. Di editor isi tetap terlihat agar bisa dirapikan. */
function GiftReveal({
  feature,
  editable,
}: {
  feature: Feature;
  editable?: boolean;
}) {
  const [open, setOpen] = useState(false);
  if (feature.giftDisplay !== "compact") return <GiftAccountsBlock feature={feature} />;
  const visible = open || Boolean(editable);
  return (
    <div className={`gift-reveal ${visible ? "is-open" : ""}`}>
      <button
        type="button"
        className="gift-reveal-button"
        style={submitButtonStyle(feature)}
        aria-expanded={visible}
        onClick={(event) => {
          event.stopPropagation();
          setOpen((value) => !value);
        }}
      >
        <Wallet size={14} />
        {open
          ? "Tutup"
          : feature.giftRevealLabel || "Lihat Rekening"}
      </button>
      {visible && <GiftAccountsBlock feature={feature} />}
    </div>
  );
}

/** TC-240 — box alamat pengiriman kado dengan tombol salin. */
function GiftAddressCard({ feature }: { feature: Feature }) {
  const [copied, setCopied] = useState(false);
  if (!feature.giftAddressEnabled || !feature.giftAddressText?.trim())
    return null;
  const full = [
    feature.giftAddressName,
    feature.giftAddressPhone,
    feature.giftAddressText,
  ]
    .filter(Boolean)
    .join("\n");
  return (
    <div
      className="gift-account-card gift-address-card"
      style={giftCardStyle(feature)}
    >
      <span className="gift-address-head">
        <MapPin size={15} /> Kirim Kado
      </span>
      {feature.giftAddressName && <strong>{feature.giftAddressName}</strong>}
      {feature.giftAddressPhone && <small>{feature.giftAddressPhone}</small>}
      <p className="gift-address-text">{feature.giftAddressText}</p>
      <button
        type="button"
        style={submitButtonStyle(feature)}
        onClick={(event) => {
          event.stopPropagation();
          void navigator.clipboard?.writeText(full);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1800);
        }}
      >
        {copied ? (
          <>
            <Check size={13} /> Tersalin
          </>
        ) : (
          <>
            <Copy size={13} /> Salin alamat
          </>
        )}
      </button>
    </div>
  );
}

function GiftAccountsBlock({ feature }: { feature: Feature }) {
  const accounts = feature.giftAccounts || [];
  const [copied, setCopied] = useState("");
  const hasAddress = Boolean(
    feature.giftAddressEnabled && feature.giftAddressText?.trim(),
  );
  if (!accounts.length && !hasAddress) return null;
  return (
    <div className="gift-account-list">
      {accounts.map((account) => (
        <div
          className="gift-account-card"
          key={account.id}
          style={giftCardStyle(feature)}
        >
          {account.logoUrl ? (
            <img
              className="bank-logo-img"
              src={assetUrl(account.logoUrl)}
              alt={account.bank}
              style={{
                height: feature.bankLogoImageHeight || 28,
                alignSelf: feature.bankLogoAlign || undefined,
              }}
            />
          ) : (
            <span
              className={`bank-logo bank-${account.bank.toLowerCase().replace(/[^a-z0-9]/g, "")} shape-${feature.bankLogoShape || "pill"}`}
              style={bankLogoStyle(feature)}
            >
              {account.bank}
            </span>
          )}
          <strong>{account.accountNumber}</strong>
          <small>a.n. {account.accountName}</small>
          {account.note && <em>{account.note}</em>}
          <button
            type="button"
            style={submitButtonStyle(feature)}
            onClick={(event) => {
              event.stopPropagation();
              void navigator.clipboard?.writeText(account.accountNumber);
              setCopied(account.id);
              window.setTimeout(() => setCopied(""), 1800);
            }}
          >
            {copied === account.id ? (
              <>
                <Check size={13} /> Tersalin
              </>
            ) : (
              <>
                <Copy size={13} /> Salin nomor
              </>
            )}
          </button>
        </div>
      ))}
      <GiftAddressCard feature={feature} />
    </div>
  );
}

// TC-095 — icon sosial media & dekoratif.
function SocialGlyph({
  name,
  size = 24,
}: {
  name: SocialIconName;
  size?: number;
}) {
  const stroke = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "instagram":
      return (
        <svg {...stroke}>
          <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
          <circle cx="12" cy="12" r="4.2" />
          <circle cx="17.4" cy="6.6" r="1" fill="currentColor" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...stroke}>
          <path d="M14.5 8.5h2.2V5.6h-2.4c-2.3 0-3.6 1.4-3.6 3.7v1.6H8.4v3h2.3V21h3.2v-7.1h2.4l.4-3h-2.8V9.6c0-.8.3-1.1 1.1-1.1Z" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...stroke}>
          <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
          <path d="M10.4 9.6 15.2 12l-4.8 2.4Z" fill="currentColor" />
        </svg>
      );
    case "threads":
      return (
        <svg {...stroke}>
          <path d="M16.6 11.8c-.3-3-2-4.4-4.5-4.4-2.9 0-4.7 2-4.7 5.1 0 3.2 1.9 5.1 4.8 5.1 2.4 0 4-1.2 4.4-3" />
          <path d="M9.9 13.2c0-1.1 1-1.8 2.5-1.8 2.2 0 3.6 1 3.6 2.9 0 1.6-1.1 2.6-2.6 2.6-1.2 0-2-.6-2-1.5" />
        </svg>
      );
    case "tiktok":
      return (
        <svg {...stroke}>
          <path d="M14.4 3.2v10.4a3.4 3.4 0 1 1-3.4-3.4" />
          <path d="M14.4 6.2c.8 1.5 2.2 2.4 4 2.5" />
        </svg>
      );
    case "twitter":
      return (
        <svg {...stroke}>
          <path d="M4 4l7.2 9.3L4.4 20h2.2l5.5-5.5L16.4 20H20l-7.5-9.7L19.4 4h-2.2l-5 5-3.8-5Z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg {...stroke}>
          <path d="M20 12a8 8 0 0 1-11.9 7L4 20l1.1-3.9A8 8 0 1 1 20 12Z" />
          <path
            d="M9.2 9.4c.3 2.6 2.7 5 5.3 5.3l1-1.4 1.7.8-.4 1.5c-2.8.6-6.6-2.6-7.6-6l1.4-.5.9 1.7Z"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      );
    case "link":
      return (
        <svg {...stroke}>
          <path d="M10.5 13.5a4 4 0 0 0 5.7 0l2.3-2.3a4 4 0 1 0-5.7-5.7l-1.2 1.2" />
          <path d="M13.5 10.5a4 4 0 0 0-5.7 0l-2.3 2.3a4 4 0 1 0 5.7 5.7l1.2-1.2" />
        </svg>
      );
    case "heart":
      return (
        <svg {...stroke}>
          <path d="M12 20s-7-4.4-7-9.2A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.8C19 15.6 12 20 12 20Z" />
        </svg>
      );
    case "sparkles":
      return (
        <svg {...stroke}>
          <path d="M12 3.5 13.6 9l5.4 1.6-5.4 1.7L12 18l-1.6-5.7L5 10.6 10.4 9Z" />
          <path d="M18.5 16.5l.6 2 2 .6-2 .6-.6 2-.6-2-2-.6 2-.6Z" />
        </svg>
      );
    case "crown":
      return (
        <svg {...stroke}>
          <path d="M4 17h16l-1.3-8-4 3L12 6.5 9.3 12l-4-3Z" />
        </svg>
      );
    case "flower":
      return (
        <svg {...stroke}>
          <circle cx="12" cy="12" r="2.4" />
          <path d="M12 9.6C12 7 13 5 14.6 5S17 7 15.6 9.4M12 14.4c0 2.6-1 4.6-2.6 4.6S7 17 8.4 14.6M9.6 12C7 12 5 11 5 9.4S7 7 9.4 8.4M14.4 12c2.6 0 4.6 1 4.6 2.6S17 17 14.6 15.6" />
        </svg>
      );
    case "ring":
      return (
        <svg {...stroke}>
          <circle cx="12" cy="14.5" r="5" />
          <path d="m9 8 3-4.5L15 8" />
        </svg>
      );
    case "music":
      return (
        <svg {...stroke}>
          <path d="M9 18V6l10-2v12" />
          <circle cx="6.5" cy="18" r="2.5" />
          <circle cx="16.5" cy="16" r="2.5" />
        </svg>
      );
    case "camera":
      return (
        <svg {...stroke}>
          <rect x="2.8" y="6.8" width="18.4" height="13" rx="3" />
          <circle cx="12" cy="13.3" r="3.6" />
          <path d="M8.6 6.8 10 4.4h4l1.4 2.4" />
        </svg>
      );
    default:
      return (
        <svg {...stroke}>
          <path d="m12 3.7 2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.1 5.9-.8Z" />
        </svg>
      );
  }
}
function IconFeature({ feature }: { feature: Feature }) {
  const icons = feature.icons || [];
  if (!icons.length)
    return (
      <div className="media-placeholder">
        <Heart size={24} />
        <strong>Icon Feature</strong>
        <span>Tambahkan icon melalui panel Content</span>
      </div>
    );
  return (
    <div
      className={`icon-feature style-${feature.iconStyle || "circle"} text-${feature.iconTextPosition || "below"}`}
      style={{
        justifyContent:
          feature.align === "left"
            ? "flex-start"
            : feature.align === "right"
              ? "flex-end"
              : "center",
        color: feature.iconColor || feature.textColor,
      }}
    >
      {icons.map((item) =>
        item.url ? (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            title={item.label}
            onClick={(event) => event.stopPropagation()}
          >
            <SocialGlyph name={item.name} size={feature.iconSize || 26} />
            {feature.iconTextPosition !== "none" && (
              <span
                className="icon-text"
                style={feature.iconTextSize ? { fontSize: feature.iconTextSize } : undefined}
              >
                {item.text || item.label}
              </span>
            )}
          </a>
        ) : (
          <span key={item.id} title={item.label}>
            <SocialGlyph name={item.name} size={feature.iconSize || 26} />
            {feature.iconTextPosition !== "none" && (
              <span
                className="icon-text"
                style={feature.iconTextSize ? { fontSize: feature.iconTextSize } : undefined}
              >
                {item.text || item.label}
              </span>
            )}
          </span>
        ),
      )}
    </div>
  );
}

// TC-089 — player backsound yang dikendalikan dari WeddingCanvas agar tidak mati saat pindah section.
function ControlledSoundPlayer({
  feature,
  playing,
  onToggle,
  contained = false,
}: {
  feature: Feature;
  playing: boolean;
  onToggle: () => void;
  contained?: boolean;
}) {
  return (
    <button
      type="button"
      className={`fixed-sound-disc sound-pos-${feature.objectAlign || "left"} sound-vpos-${feature.soundVerticalAlign || "bottom"} ${playing ? "playing" : ""} ${contained ? "is-contained" : ""}`}
      style={
        {
          "--sound-offset-x": `${feature.soundOffsetX ?? 22}px`,
          "--sound-offset-y": `${feature.soundOffsetY ?? 22}px`,
        } as React.CSSProperties
      }
      onClick={onToggle}
      title={
        playing ? "Matikan backsound" : `Putar ${feature.title || feature.body}`
      }
    >
      <Disc3 size={23} />
      <span>{playing ? "Sound on" : feature.title || feature.body}</span>
    </button>
  );
}

// TC-080 — heading & supporting text dapat dinonaktifkan/dihapus, mendukung baris baru.
function HeadingBodyEditor({
  feature,
  update,
}: {
  feature: Feature;
  update: (patch: Partial<Feature>) => void;
}) {
  return (
    <div className="heading-body-editor">
      <div className="group-heading">
        <strong>Heading & Supporting Text</strong>
        <span>Enter = baris baru</span>
      </div>
      <div className="setting-row compact">
        <div>
          <Heading1 size={16} />
          <span>
            <strong>Tampilkan Heading</strong>
            <small>Nonaktifkan untuk menghapus header dari canvas.</small>
          </span>
        </div>
        <button
          className={`toggle ${feature.showTitle !== false ? "on" : ""}`}
          onClick={() => update({ showTitle: !(feature.showTitle !== false) })}
        >
          <i />
        </button>
      </div>
      {feature.showTitle !== false && (
        <label>
          Heading
          <textarea
            rows={2}
            value={feature.title}
            onChange={(event) => update({ title: event.target.value })}
          />
        </label>
      )}
      <div className="setting-row compact">
        <div>
          <Heading2 size={16} />
          <span>
            <strong>Tampilkan Supporting Text</strong>
            <small>Nonaktifkan untuk menghapus supporting text.</small>
          </span>
        </div>
        <button
          className={`toggle ${feature.showBody !== false ? "on" : ""}`}
          onClick={() => update({ showBody: !(feature.showBody !== false) })}
        >
          <i />
        </button>
      </div>
      {feature.showBody !== false && (
        <label>
          Supporting text
          <textarea
            rows={3}
            value={feature.body}
            onChange={(event) => update({ body: event.target.value })}
          />
        </label>
      )}
    </div>
  );
}

// TC-081 — tambah/hapus kolom & baris pada Form.
function FormFieldEditor({
  feature,
  update,
  addFormField,
}: {
  feature: Feature;
  update: (patch: Partial<Feature>) => void;
  addFormField: () => void;
}) {
  const specs = resolveFormSpecs(feature);
  const commit = (next: FormFieldSpec[]) =>
    update({ formSpecs: next, formFields: next.map((item) => item.label) });
  const add = () => {
    commit([
      ...specs,
      {
        id: uid("ff"),
        label: `Field ${specs.length + 1}`,
        kind: "text",
        width: "full",
      },
    ]);
    void addFormField;
  };
  const patch = (id: string, next: Partial<FormFieldSpec>) =>
    commit(specs.map((item) => (item.id === id ? { ...item, ...next } : item)));
  const move = (index: number, direction: -1 | 1) => {
    const next = [...specs];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    commit(next);
  };
  return (
    <div className="form-field-editor">
      <div className="group-heading">
        <strong>Form fields</strong>
        <button onClick={add}>
          <Plus size={14} /> Tambah baris
        </button>
      </div>
      <label>
        Jumlah kolom
        <select
          value={feature.formColumns || 1}
          onChange={(event) =>
            update({ formColumns: Number(event.target.value) === 2 ? 2 : 1 })
          }
        >
          <option value={1}>1 kolom</option>
          <option value={2}>2 kolom</option>
        </select>
      </label>
      {specs.map((spec, index) => (
        <div className="form-spec-row" key={spec.id}>
          <div className="form-spec-head">
            <span>#{index + 1}</span>
            <div>
              <button
                title="Naik"
                onClick={() => move(index, -1)}
                disabled={index === 0}
              >
                <MoveUp size={12} />
              </button>
              <button
                title="Turun"
                onClick={() => move(index, 1)}
                disabled={index === specs.length - 1}
              >
                <MoveDown size={12} />
              </button>
              <button
                title="Hapus"
                onClick={() =>
                  commit(specs.filter((item) => item.id !== spec.id))
                }
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
          <input
            value={spec.label}
            onChange={(event) => patch(spec.id, { label: event.target.value })}
            placeholder="Label field"
          />
          <div className="two-inputs">
            <label>
              Tipe
              <select
                value={spec.kind}
                onChange={(event) =>
                  patch(spec.id, { kind: event.target.value as FormFieldKind })
                }
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="phone">Telepon</option>
                <option value="number">Angka</option>
                <option value="select">Pilihan</option>
                <option value="textarea">Paragraf</option>
              </select>
            </label>
            <label>
              Lebar
              <select
                value={spec.width || "full"}
                onChange={(event) =>
                  patch(spec.id, {
                    width: event.target.value as "full" | "half",
                  })
                }
              >
                <option value="full">Full</option>
                <option value="half">Setengah</option>
              </select>
            </label>
          </div>
          {spec.kind === "select" && (
            <input
              value={(spec.options || []).join(", ")}
              onChange={(event) =>
                patch(spec.id, {
                  options: event.target.value
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),
                })
              }
              placeholder="Opsi dipisah koma"
            />
          )}
          <div className="setting-row compact">
            <div>
              <CheckCircle2 size={14} />
              <span>
                <strong>Wajib diisi</strong>
              </span>
            </div>
            <button
              className={`toggle ${spec.required ? "on" : ""}`}
              onClick={() => patch(spec.id, { required: !spec.required })}
            >
              <i />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// TC-088 — pilihan bank/e-wallet untuk Wedding Gift.
function GiftAccountEditor({
  feature,
  update,
  uploadLogo,
}: {
  feature: Feature;
  update: (patch: Partial<Feature>) => void;
  uploadLogo?: (
    file: File | undefined,
  ) => Promise<{ url: string; key: string } | null>;
}) {
  const [uploadingLogo, setUploadingLogo] = useState("");
  const accounts = feature.giftAccounts || [];
  const commit = (next: GiftAccount[]) => update({ giftAccounts: next });
  const patch = (id: string, next: Partial<GiftAccount>) =>
    commit(
      accounts.map((item) => (item.id === id ? { ...item, ...next } : item)),
    );
  return (
    <div className="gift-account-editor">
      {/* TC-241 — tampilan ringkas dengan tombol Lihat Rekening. */}
      <div className="bank-logo-style">
        <strong>Tampilan Wedding Gift</strong>
        <label>
          Mode tampilan
          <select
            value={feature.giftDisplay || "full"}
            onChange={(event) =>
              update({
                giftDisplay: event.target.value as Feature["giftDisplay"],
              })
            }
          >
            <option value="full">Lengkap (rekening langsung tampil)</option>
            <option value="compact">
              Ringkas (header, teks, tombol Lihat Rekening)
            </option>
          </select>
        </label>
        {feature.giftDisplay === "compact" && (
          <label>
            Label tombol
            <input
              value={feature.giftRevealLabel || ""}
              placeholder="Lihat Rekening"
              onChange={(event) =>
                update({ giftRevealLabel: event.target.value })
              }
            />
          </label>
        )}
      </div>
      {/* TC-240 — box alamat pengiriman kado (opsional). */}
      <div className="bank-logo-style gift-address-editor">
        <div className="setting-row compact">
          <span>
            <strong>Box alamat pengiriman kado</strong>
            <small>Tampilkan alamat untuk tamu yang ingin mengirim kado fisik.</small>
          </span>
          <button
            className={`toggle ${feature.giftAddressEnabled ? "on" : ""}`}
            aria-pressed={Boolean(feature.giftAddressEnabled)}
            aria-label="Aktifkan box alamat pengiriman kado"
            onClick={() =>
              update({ giftAddressEnabled: !feature.giftAddressEnabled })
            }
          >
            <i />
          </button>
        </div>
        {feature.giftAddressEnabled && (
          <>
            <label>
              Nama penerima
              <input
                value={feature.giftAddressName || ""}
                placeholder="Nama penerima kado"
                onChange={(event) =>
                  update({ giftAddressName: event.target.value })
                }
              />
            </label>
            <label>
              No. telepon (opsional)
              <input
                value={feature.giftAddressPhone || ""}
                placeholder="08xx"
                onChange={(event) =>
                  update({ giftAddressPhone: event.target.value })
                }
              />
            </label>
            <label>
              Alamat lengkap
              <textarea
                rows={3}
                value={feature.giftAddressText || ""}
                placeholder="Jalan, nomor, kota, kode pos"
                onChange={(event) =>
                  update({ giftAddressText: event.target.value })
                }
              />
            </label>
          </>
        )}
      </div>
      {/* TC-212 — logo bank bisa disesuaikan dengan tema. */}
      <div className="bank-logo-style">
        <strong>Tampilan logo bank</strong>
        <label>
          Bentuk
          <select
            value={feature.bankLogoShape || "pill"}
            onChange={(event) =>
              update({
                bankLogoShape: event.target.value as Feature["bankLogoShape"],
              })
            }
          >
            <option value="pill">Kapsul</option>
            <option value="square">Kotak</option>
            <option value="plain">Teks saja (tanpa latar)</option>
          </select>
        </label>
        <label>
          Ukuran logo gambar: {feature.bankLogoImageHeight || 28}px
          <input
            type="range"
            min={16}
            max={96}
            value={feature.bankLogoImageHeight || 28}
            onChange={(event) =>
              update({ bankLogoImageHeight: Number(event.target.value) })
            }
          />
          <small className="field-hint">
            Untuk rekening yang memakai logo hasil upload.
          </small>
        </label>
        <label>
          Ukuran teks logo: {feature.bankLogoSize || 8}px
          <input
            type="range"
            min={6}
            max={24}
            value={feature.bankLogoSize || 8}
            onChange={(event) =>
              update({ bankLogoSize: Number(event.target.value) })
            }
          />
        </label>
        <label>
          Posisi
          <select
            value={feature.bankLogoAlign || "center"}
            onChange={(event) =>
              update({
                bankLogoAlign: event.target.value as Feature["bankLogoAlign"],
              })
            }
          >
            <option value="flex-start">Kiri</option>
            <option value="center">Tengah</option>
            <option value="flex-end">Kanan</option>
          </select>
        </label>
        <div className="two-cols">
          <label>
            Warna latar
            <ColorInput value={feature.bankLogoBackground} fallback="#123f33" noneValue="transparent" onChange={(next) => update({ bankLogoBackground: next })} />
          </label>
          <label>
            Warna teks
            <ColorInput value={feature.bankLogoTextColor} fallback="#ffffff" onChange={(next) => update({ bankLogoTextColor: next })} />
          </label>
        </div>
        <button
          className="text-button"
          onClick={() =>
            update({
              bankLogoSize: undefined,
              bankLogoShape: undefined,
              bankLogoBackground: undefined,
              bankLogoTextColor: undefined,
              bankLogoAlign: undefined,
              bankLogoImageHeight: undefined,
            })
          }
        >
          Kembalikan bawaan
        </button>
      </div>
      <div className="group-heading">
        <strong>Rekening / E-wallet</strong>
        <button
          onClick={() =>
            commit([
              ...accounts,
              {
                id: uid("gift"),
                bank: "BCA",
                accountNumber: "",
                accountName: "",
              },
            ])
          }
        >
          <Plus size={14} /> Tambah
        </button>
      </div>
      {!accounts.length && (
        <div className="layout-help">
          Belum ada tujuan transfer. Tambahkan minimal satu rekening atau
          e-wallet.
        </div>
      )}
      {accounts.map((account) => (
        <div className="gift-account-row" key={account.id}>
          <div className="form-spec-head">
            <span>{account.bank}</span>
            <button
              title="Hapus"
              onClick={() =>
                commit(accounts.filter((item) => item.id !== account.id))
              }
            >
              <Trash2 size={12} />
            </button>
          </div>
          <label>
            Bank / e-wallet
            <select
              value={account.bank}
              onChange={(event) =>
                patch(account.id, { bank: event.target.value })
              }
            >
              {bankCatalog.map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
          </label>
          {uploadLogo && (
            <div className="gift-logo-upload">
              <span>Logo {account.bank} (opsional)</span>
              {account.logoUrl && (
                <img src={assetUrl(account.logoUrl)} alt={`Logo ${account.bank}`} />
              )}
              <label className="secondary-btn gift-logo-pick">
                <Upload size={13} />{" "}
                {uploadingLogo === account.id
                  ? "Mengunggah…"
                  : account.logoUrl
                    ? "Ganti logo"
                    : "Upload logo"}
                <input
                  hidden
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onClick={resetFileInput}
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    setUploadingLogo(account.id);
                    const saved = await uploadLogo(file);
                    setUploadingLogo("");
                    if (saved)
                      patch(account.id, { logoUrl: saved.url, logoKey: saved.key });
                  }}
                />
              </label>
              {account.logoUrl && (
                <button
                  type="button"
                  className="text-button"
                  onClick={() =>
                    patch(account.id, { logoUrl: undefined, logoKey: undefined })
                  }
                >
                  Pakai label teks
                </button>
              )}
            </div>
          )}
          <label>
            Nomor rekening / nomor akun
            <input
              value={account.accountNumber}
              onChange={(event) =>
                patch(account.id, { accountNumber: event.target.value })
              }
              placeholder="1234567890"
            />
          </label>
          <label>
            Atas nama
            <input
              value={account.accountName}
              onChange={(event) =>
                patch(account.id, { accountName: event.target.value })
              }
              placeholder="Nama pemilik rekening"
            />
          </label>
          <label>
            Catatan (opsional)
            <input
              value={account.note || ""}
              onChange={(event) =>
                patch(account.id, { note: event.target.value })
              }
              placeholder="Contoh: untuk kado digital"
            />
          </label>
        </div>
      ))}
    </div>
  );
}

// TC-095 — daftar icon sosial media / dekoratif.
function IconListEditor({
  feature,
  update,
}: {
  feature: Feature;
  update: (patch: Partial<Feature>) => void;
}) {
  const icons = feature.icons || [];
  const commit = (next: IconItem[]) => update({ icons: next });
  const patch = (id: string, next: Partial<IconItem>) =>
    commit(icons.map((item) => (item.id === id ? { ...item, ...next } : item)));
  return (
    <div className="icon-list-editor">
      <div className="group-heading">
        <strong>Daftar Icon</strong>
        <button
          onClick={() =>
            commit([
              ...icons,
              { id: uid("ic"), name: "instagram", label: "Instagram", url: "" },
            ])
          }
        >
          <Plus size={14} /> Tambah icon
        </button>
      </div>
      <div className="two-inputs">
        <label>
          Ukuran <span>{feature.iconSize || 26}px</span>
          <input
            type="range"
            min="14"
            max="64"
            value={feature.iconSize || 26}
            onChange={(event) =>
              update({ iconSize: Number(event.target.value) })
            }
          />
        </label>
        <label>
          Warna
          <ColorInput value={feature.iconColor} fallback="#154f40" onChange={(next) => update({ iconColor: next })} />
        </label>
      </div>
      <label>
        Gaya
        <select
          value={feature.iconStyle || "circle"}
          onChange={(event) =>
            update({
              iconStyle: event.target.value as "plain" | "circle" | "outline",
            })
          }
        >
          <option value="plain">Polos</option>
          <option value="circle">Lingkaran solid</option>
          <option value="outline">Lingkaran outline</option>
        </select>
      </label>
      {/* TC-238 — teks pendamping icon (mis. username Instagram). */}
      <div className="two-inputs">
        <label>
          Posisi teks
          <select
            value={feature.iconTextPosition || "below"}
            onChange={(event) =>
              update({
                iconTextPosition: event.target.value as Feature["iconTextPosition"],
              })
            }
          >
            <option value="right">Di samping icon</option>
            <option value="below">Di bawah icon</option>
            <option value="none">Tanpa teks</option>
          </select>
        </label>
        <label>
          Ukuran teks: {feature.iconTextSize || 8}px
          <input
            type="range"
            min={7}
            max={24}
            value={feature.iconTextSize || 8}
            onChange={(event) =>
              update({ iconTextSize: Number(event.target.value) })
            }
          />
        </label>
      </div>
      {icons.map((item) => (
        <div className="icon-row" key={item.id}>
          <div className="form-spec-head">
            <span>
              <SocialGlyph name={item.name} size={15} /> {item.label}
            </span>
            <button
              title="Hapus"
              onClick={() =>
                commit(icons.filter((value) => value.id !== item.id))
              }
            >
              <Trash2 size={12} />
            </button>
          </div>
          <label>
            Icon
            <select
              value={item.name}
              onChange={(event) => {
                const name = event.target.value as SocialIconName;
                const label =
                  socialIconCatalog.find((entry) => entry[0] === name)?.[1] ||
                  name;
                patch(item.id, { name, label });
              }}
            >
              {socialIconCatalog.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Label
            <input
              value={item.label}
              onChange={(event) =>
                patch(item.id, { label: event.target.value })
              }
            />
          </label>
          <label>
            Teks pendamping (opsional)
            <input
              value={item.text || ""}
              onChange={(event) => patch(item.id, { text: event.target.value })}
              placeholder="mis. @dimasadttyaa"
            />
          </label>
          <label>
            Link (opsional)
            <input
              value={item.url}
              onChange={(event) => patch(item.id, { url: event.target.value })}
              placeholder="https://instagram.com/username"
            />
          </label>
        </div>
      ))}
    </div>
  );
}

// TC-089 — preview sound dari Sound Library Admin langsung di Canvas Editor.
function SoundCatalogPreview({
  feature,
  soundCatalog,
}: {
  feature: Feature;
  soundCatalog: SoundCatalogItem[];
}) {
  const playerRef = useRef<{ stop: () => void } | null>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => () => playerRef.current?.stop(), []);
  const active = soundCatalog.find(
    (item) => item.id === feature.soundCatalogId,
  );
  const source = feature.mediaUrl || active?.mediaUrl;
  const toggle = () => {
    if (playing) {
      playerRef.current?.stop();
      playerRef.current = null;
      setPlaying(false);
      return;
    }
    playerRef.current = createSoundPlayback(
      {
        ...feature,
        mediaUrl: source,
        soundPreset: feature.soundPreset || active?.preset,
      },
      true,
    );
    setPlaying(true);
  };
  return (
    <div className="sound-catalog-preview">
      <div className="group-heading">
        <strong>Preview sound aktif</strong>
        <span>{source ? "File terhubung" : "Preset internal"}</span>
      </div>
      <div className="sound-catalog-status">
        {source ? (
          <>
            <Check size={13} />{" "}
            {feature.mediaName ||
              active?.fileName ||
              active?.name ||
              "Sound library"}
          </>
        ) : (
          <>
            <CircleHelp size={13} /> Belum ada file. Pilih dari Sound Library
            atau upload sendiri.
          </>
        )}
      </div>
      <button type="button" className="secondary-btn" onClick={toggle}>
        {playing ? (
          <>
            <VolumeX size={15} /> Stop preview
          </>
        ) : (
          <>
            <Volume2 size={15} /> Play preview
          </>
        )}
      </button>
    </div>
  );
}

// TC-103 — kontrol drag & resize bebas.
function FreePositionControls({
  feature,
  update,
  activeDevice = "desktop",
}: {
  feature: Feature;
  update: (patch: Partial<Feature>) => void;
  activeDevice?: DeviceMode;
}) {
  return (
    <DesignerControls
      key={feature.id}
      feature={feature}
      update={update}
      activeDevice={activeDevice}
    />
  );
}


// QA TC-118 — Heading 2 & Supporting Text 2 untuk setiap feature.
function SecondaryTextEditor({
  feature,
  update,
}: {
  feature: Feature;
  update: (patch: Partial<Feature>) => void;
}) {
  return (
    <div className="heading-body-editor">
      <div className="group-heading">
        <strong>Heading 2 & Supporting Text 2</strong>
      </div>
      <div className="setting-row compact">
        <div>
          <Heading2 size={16} />
          <span>
            <strong>Tampilkan Heading 2</strong>
            <small>Sub-judul tambahan di bawah teks utama.</small>
          </span>
        </div>
        <button
          className={`toggle ${feature.showTitle2 ? "on" : ""}`}
          onClick={() => update({ showTitle2: !feature.showTitle2 })}
        >
          <i />
        </button>
      </div>
      {feature.showTitle2 && (
        <>
          <label>
            Heading 2
            <textarea
              rows={2}
              value={feature.title2 || ""}
              onChange={(event) => update({ title2: event.target.value })}
            />
          </label>
          <div className="two-inputs">
            <label>
              Ukuran <span>{feature.title2FontSize ?? 20}px</span>
              <input
                type="range"
                min="8"
                max="72"
                value={feature.title2FontSize ?? 20}
                onChange={(event) =>
                  update({ title2FontSize: Number(event.target.value) })
                }
              />
            </label>
            <label>
              Warna
              <ColorInput
                value={feature.title2Color}
                fallback="#154f40"
                onChange={(next) => update({ title2Color: next })}
              />
            </label>
          </div>
        </>
      )}
      <div className="setting-row compact">
        <div>
          <Type size={16} />
          <span>
            <strong>Tampilkan Supporting Text 2</strong>
            <small>Paragraf pendukung kedua.</small>
          </span>
        </div>
        <button
          className={`toggle ${feature.showBody2 ? "on" : ""}`}
          onClick={() => update({ showBody2: !feature.showBody2 })}
        >
          <i />
        </button>
      </div>
      {feature.showBody2 && (
        <>
          <label>
            Supporting Text 2
            <textarea
              rows={3}
              value={feature.body2 || ""}
              onChange={(event) => update({ body2: event.target.value })}
            />
          </label>
          <div className="two-inputs">
            <label>
              Ukuran <span>{feature.body2FontSize ?? 11}px</span>
              <input
                type="range"
                min="8"
                max="60"
                value={feature.body2FontSize ?? 11}
                onChange={(event) =>
                  update({ body2FontSize: Number(event.target.value) })
                }
              />
            </label>
            <label>
              Warna
              <ColorInput
                value={feature.body2Color}
                fallback="#154f40"
                onChange={(next) => update({ body2Color: next })}
              />
            </label>
          </div>
        </>
      )}
    </div>
  );
}

// QA TC-121 & TC-122 — warna tiap elemen teks dan kolom diatur terpisah.
function PerElementColorEditor({
  feature,
  update,
}: {
  feature: Feature;
  update: (patch: Partial<Feature>) => void;
}) {
  const swatch = (
    label: string,
    value: string | undefined,
    fallback: string | undefined,
    key: keyof Feature,
  ) => (
    <label>
      {label}
      <ColorInput
        value={value}
        fallback={fallback}
        noneValue={/background|Background/.test(String(key)) ? "transparent" : undefined}
        onChange={(next) => update({ [key]: next } as Partial<Feature>)}
      />
    </label>
  );
  // Pengaturan kolom/kartu hanya berpengaruh pada Gift, Greetings, dan Love
  // Story. Untuk feature lain kontrolnya tidak melakukan apa pun, jadi
  // disembunyikan agar panel Style tidak membingungkan.
  const usesCardStyling = ["gift", "greetings", "love-story"].includes(
    feature.type,
  );
  return (
    <div className="per-element-color-editor">
      <div className="group-heading">
        <strong>Warna per Elemen</strong>
      </div>
      <div className="layout-help">
        Kosongkan untuk mengikuti warna teks dasar feature. Mengubah salah satu
        elemen tidak memengaruhi elemen lain.
      </div>
      <div className="two-inputs">
        {swatch("Heading", feature.titleColor, feature.textColor, "titleColor")}
        {swatch("Supporting", feature.bodyColor, feature.textColor, "bodyColor")}
      </div>
      {usesCardStyling && (
        <>
      <div className="group-heading">
        <strong>Kolom / Kartu</strong>
      </div>
      <div className="two-inputs">
        {swatch("Latar kolom", feature.cardBackground, "#ffffff", "cardBackground")}
        {swatch("Teks kolom", feature.cardTextColor, feature.textColor, "cardTextColor")}
      </div>
      <div className="two-inputs">
        {swatch("Border kolom", feature.cardBorderColor, "#d8e2dd", "cardBorderColor")}
        <label>
          Sudut kolom <span>{feature.cardRadius ?? 12}px</span>
          <input
            type="range"
            min="0"
            max="40"
            value={feature.cardRadius ?? 12}
            onChange={(event) => update({ cardRadius: Number(event.target.value) })}
          />
        </label>
      </div>
        </>
      )}
    </div>
  );
}

// QA TC-125 — tampilan kolom input dan button submit.
function FormStyleEditor({
  feature,
  update,
}: {
  feature: Feature;
  update: (patch: Partial<Feature>) => void;
}) {
  if (!["form", "gift", "greetings"].includes(feature.type)) return null;
  return (
    <div className="form-style-editor">
      <div className="group-heading">
        <strong>Kolom Input & Button Submit</strong>
      </div>
      <div className="two-inputs">
        <label>
          Latar kolom
          <ColorInput value={feature.fieldBackground} fallback="#ffffff" noneValue="transparent" onChange={(next) => update({ fieldBackground: next })} />
        </label>
        <label>
          Teks kolom
          <ColorInput value={feature.fieldTextColor} fallback="#154f40" onChange={(next) => update({ fieldTextColor: next })} />
        </label>
      </div>
      <div className="two-inputs">
        <label>
          Border kolom
          <ColorInput value={feature.fieldBorderColor} fallback="#d8e2dd" noneValue="transparent" onChange={(next) => update({ fieldBorderColor: next })} />
        </label>
        <label>
          Sudut kolom <span>{feature.fieldRadius ?? 8}px</span>
          <input
            type="range"
            min="0"
            max="30"
            value={feature.fieldRadius ?? 8}
            onChange={(event) => update({ fieldRadius: Number(event.target.value) })}
          />
        </label>
      </div>
      <label>
        Label button
        <input
          value={feature.buttonLabel || ""}
          onChange={(event) => update({ buttonLabel: event.target.value })}
          placeholder="Kirim ucapan"
        />
      </label>
      <div className="two-inputs">
        <label>
          Latar button
          <ColorInput value={feature.buttonBackground} fallback="#125946" noneValue="transparent" onChange={(next) => update({ buttonBackground: next })} />
        </label>
        <label>
          Teks button
          <ColorInput value={feature.buttonTextColor} fallback="#ffffff" onChange={(next) => update({ buttonTextColor: next })} />
        </label>
      </div>
      <div className="two-inputs">
        <label>
          Sudut button <span>{feature.buttonRadius ?? 8}px</span>
          <input
            type="range"
            min="0"
            max="40"
            value={feature.buttonRadius ?? 8}
            onChange={(event) => update({ buttonRadius: Number(event.target.value) })}
          />
        </label>
        <label>
          Tebal border <span>{feature.buttonBorderWidth ?? 0}px</span>
          <input
            type="range"
            min="0"
            max="6"
            value={feature.buttonBorderWidth ?? 0}
            onChange={(event) =>
              update({ buttonBorderWidth: Number(event.target.value) })
            }
          />
        </label>
      </div>
      {Boolean(feature.buttonBorderWidth) && (
        <label>
          Warna border button
          <ColorInput value={feature.buttonBorderColor} fallback="#125946" noneValue="transparent" onChange={(next) => update({ buttonBorderColor: next })} />
        </label>
      )}
    </div>
  );
}

// QA TC-117 & TC-107 — background image per feature, dengan opsi diam saat scroll.
function FeatureBackgroundImageEditor({
  feature,
  update,
  uploadFeatureBackground,
}: {
  feature: Feature;
  update: (patch: Partial<Feature>) => void;
  uploadFeatureBackground: (file: File | undefined) => void | Promise<void>;
}) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <div className="feature-background-editor">
      <div className="group-heading">
        <strong>Background Image Feature</strong>
      </div>
      <input
        ref={input}
        hidden
        type="file"
        accept="image/*"
        onChange={(event) => {
          void uploadFeatureBackground(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
      <button className="upload-control" onClick={() => input.current?.click()}>
        <Upload size={18} />
        <span>
          <strong>Upload background image</strong>
          <small>Berlaku untuk feature ini saja, bukan seluruh section.</small>
        </span>
      </button>
      {feature.backgroundImageUrl && (
        <>
          <div className="media-file">
            <ImageIcon size={15} />
            <span>Background terpasang</span>
            <button
              className="clear-color"
              title="Hapus background image"
              onClick={() =>
                update({ backgroundImageUrl: undefined, backgroundImageKey: undefined })
              }
            >
              <X size={11} />
            </button>
          </div>
          <div className="two-inputs">
            <label>
              Ukuran
              <select
                value={feature.backgroundImageSize || "cover"}
                onChange={(event) =>
                  update({
                    backgroundImageSize: event.target
                      .value as Feature["backgroundImageSize"],
                  })
                }
              >
                <option value="cover">Cover</option>
                <option value="contain">Contain</option>
                <option value="auto">Auto</option>
              </select>
            </label>
            <label>
              Posisi
              <select
                value={feature.backgroundImagePosition || "center"}
                onChange={(event) =>
                  update({
                    backgroundImagePosition: event.target
                      .value as Feature["backgroundImagePosition"],
                  })
                }
              >
                <option value="center">Tengah</option>
                <option value="top">Atas</option>
                <option value="bottom">Bawah</option>
                <option value="left">Kiri</option>
                <option value="right">Kanan</option>
              </select>
            </label>
          </div>
          <div className="setting-row compact">
            <div>
              <Anchor size={16} />
              <span>
                <strong>Diam saat di-scroll</strong>
                <small>Background tidak ikut bergeser, hanya teks yang bergerak.</small>
              </span>
            </div>
            <button
              className={`toggle ${feature.backgroundImageFixed ? "on" : ""}`}
              onClick={() =>
                update({ backgroundImageFixed: !feature.backgroundImageFixed })
              }
            >
              <i />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// QA TC-129 — pilihan template layout untuk feature Image.
/* ------------------------------------------------------------------
   Pemilih layout berbasis ikon.

   Sebelumnya layout Image dan Gallery dipilih lewat <select> berisi nama
   ("Dua gambar saling tumpang", "Hero kiri + grid kanan"), sehingga Web
   Designer harus membayangkan hasilnya. Sekarang tiap opsi ditampilkan sebagai
   kartu dengan sketsa susunannya. Sketsa digambar inline sebagai SVG supaya
   ikut warna tema dan tidak menambah file aset.
   ------------------------------------------------------------------ */
type LayoutOption<T extends string> = {
  value: T;
  label: string;
  hint?: string;
};

function LayoutOptionPicker<T extends string>({
  legend,
  options,
  value,
  onSelect,
  glyph,
}: {
  legend: string;
  options: LayoutOption<T>[];
  value: T;
  onSelect: (value: T) => void;
  glyph: (value: T) => React.ReactNode;
}) {
  return (
    <div className="layout-option-picker" role="radiogroup" aria-label={legend}>
      <span className="layout-option-legend">{legend}</span>
      <div className="layout-option-grid">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={value === option.value}
            title={option.hint || option.label}
            className={`layout-option ${value === option.value ? "active" : ""}`}
            onClick={() => onSelect(option.value)}
          >
            <span className="layout-option-glyph">{glyph(option.value)}</span>
            <span className="layout-option-label">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Sketsa 48x36 untuk tiap susunan. `block` = area foto, `line` = baris teks.
function GlyphFrame({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 48 36" width="48" height="36" aria-hidden="true">
      {children}
    </svg>
  );
}
function GlyphBlock(props: React.SVGProps<SVGRectElement>) {
  return <rect rx="2" className="glyph-block" {...props} />;
}
function GlyphLines({
  x,
  y,
  width,
  rows = 4,
}: {
  x: number;
  y: number;
  width: number;
  rows?: number;
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <rect
          key={index}
          className="glyph-line"
          x={x}
          y={y + index * 5}
          width={index === rows - 1 ? width * 0.6 : width}
          height="2"
          rx="1"
        />
      ))}
    </>
  );
}

function ImageLayoutGlyph({ layout }: { layout: ImageLayoutTemplate }) {
  switch (layout) {
    case "side-left":
      return (
        <GlyphFrame>
          <GlyphBlock x="3" y="6" width="20" height="24" />
          <GlyphLines x={27} y={9} width={18} />
        </GlyphFrame>
      );
    case "side-right":
      return (
        <GlyphFrame>
          <GlyphLines x={3} y={9} width={18} />
          <GlyphBlock x="25" y="6" width="20" height="24" />
        </GlyphFrame>
      );
    case "stacked":
      return (
        <GlyphFrame>
          <GlyphBlock x="12" y="3" width="24" height="13" />
          <GlyphBlock x="12" y="20" width="24" height="13" />
        </GlyphFrame>
      );
    case "overlap":
      return (
        <GlyphFrame>
          <GlyphBlock x="6" y="4" width="24" height="18" />
          <GlyphBlock
            x="18"
            y="14"
            width="24"
            height="18"
            className="glyph-block glyph-block-overlap"
          />
        </GlyphFrame>
      );
    case "banner":
      return (
        <GlyphFrame>
          <GlyphBlock x="3" y="6" width="42" height="24" />
          <rect className="glyph-line on-block" x="13" y="15" width="22" height="3" rx="1.5" />
          <rect className="glyph-line on-block" x="18" y="21" width="12" height="2" rx="1" />
        </GlyphFrame>
      );
    case "framed-caption":
      return (
        <GlyphFrame>
          <rect
            className="glyph-frame"
            x="4"
            y="3"
            width="40"
            height="22"
            rx="2"
            fill="none"
          />
          <GlyphBlock x="8" y="7" width="32" height="14" />
          <GlyphLines x={12} y={29} width={24} rows={1} />
        </GlyphFrame>
      );
    case "single":
    default:
      return (
        <GlyphFrame>
          <GlyphBlock x="3" y="3" width="42" height="30" />
        </GlyphFrame>
      );
  }
}

function GalleryStyleGlyph({ style }: { style: GalleryStyle }) {
  switch (style) {
    case "carousel":
      return (
        <GlyphFrame>
          <GlyphBlock x="2" y="9" width="7" height="18" className="glyph-block glyph-block-overlap" />
          <GlyphBlock x="13" y="5" width="22" height="26" />
          <GlyphBlock x="39" y="9" width="7" height="18" className="glyph-block glyph-block-overlap" />
        </GlyphFrame>
      );
    case "filmstrip":
      return (
        <GlyphFrame>
          <GlyphBlock x="2" y="9" width="16" height="18" />
          <GlyphBlock x="21" y="9" width="16" height="18" />
          <GlyphBlock x="40" y="9" width="12" height="18" className="glyph-block glyph-block-overlap" />
        </GlyphFrame>
      );
    case "grid":
    default:
      return (
        <GlyphFrame>
          <GlyphBlock x="3" y="4" width="19" height="12" />
          <GlyphBlock x="26" y="4" width="19" height="12" />
          <GlyphBlock x="3" y="20" width="19" height="12" />
          <GlyphBlock x="26" y="20" width="19" height="12" />
        </GlyphFrame>
      );
  }
}

function GalleryLayoutGlyph({ layout }: { layout: GalleryLayoutTemplate }) {
  switch (layout) {
    case "masonry":
      return (
        <GlyphFrame>
          <GlyphBlock x="3" y="4" width="12" height="18" />
          <GlyphBlock x="3" y="25" width="12" height="7" />
          <GlyphBlock x="18" y="4" width="12" height="10" />
          <GlyphBlock x="18" y="17" width="12" height="15" />
          <GlyphBlock x="33" y="4" width="12" height="15" />
          <GlyphBlock x="33" y="22" width="12" height="10" />
        </GlyphFrame>
      );
    case "hero-left":
      return (
        <GlyphFrame>
          <GlyphBlock x="3" y="4" width="24" height="28" />
          <GlyphBlock x="30" y="4" width="15" height="13" />
          <GlyphBlock x="30" y="19" width="15" height="13" />
        </GlyphFrame>
      );
    case "hero-top":
      return (
        <GlyphFrame>
          <GlyphBlock x="3" y="3" width="42" height="16" />
          <GlyphBlock x="3" y="22" width="12" height="11" />
          <GlyphBlock x="18" y="22" width="12" height="11" />
          <GlyphBlock x="33" y="22" width="12" height="11" />
        </GlyphFrame>
      );
    case "mosaic":
      return (
        <GlyphFrame>
          <GlyphBlock x="3" y="4" width="18" height="28" />
          <GlyphBlock x="24" y="4" width="21" height="12" />
          <GlyphBlock x="24" y="19" width="10" height="13" />
          <GlyphBlock x="36" y="19" width="9" height="13" />
        </GlyphFrame>
      );
    case "even":
    default:
      return (
        <GlyphFrame>
          <GlyphBlock x="3" y="4" width="19" height="12" />
          <GlyphBlock x="26" y="4" width="19" height="12" />
          <GlyphBlock x="3" y="20" width="19" height="12" />
          <GlyphBlock x="26" y="20" width="19" height="12" />
        </GlyphFrame>
      );
  }
}

function ImageLayoutEditor({
  feature,
  update,
}: {
  feature: Feature;
  update: (patch: Partial<Feature>) => void;
}) {
  const layouts: LayoutOption<ImageLayoutTemplate>[] = [
    { value: "single", label: "Single", hint: "Gambar penuh" },
    { value: "side-left", label: "Gambar kiri", hint: "Gambar kiri + teks kanan" },
    { value: "side-right", label: "Teks kiri", hint: "Teks kiri + gambar kanan" },
    { value: "stacked", label: "Bertumpuk", hint: "Dua gambar bertumpuk" },
    { value: "overlap", label: "Tumpang tindih", hint: "Dua gambar saling tumpang" },
    { value: "banner", label: "Banner", hint: "Teks di atas gambar" },
    { value: "framed-caption", label: "Berbingkai", hint: "Gambar berbingkai + caption" },
  ];
  return (
    <div className="image-layout-editor">
      <div className="group-heading">
        <strong>Template Layout Image</strong>
      </div>
      <LayoutOptionPicker
        legend="Layout"
        options={layouts}
        value={feature.imageLayoutTemplate || "single"}
        onSelect={(imageLayoutTemplate) => update({ imageLayoutTemplate })}
        glyph={(value) => <ImageLayoutGlyph layout={value} />}
      />
      <label>
        Caption
        <input
          value={feature.imageCaption || ""}
          onChange={(event) => update({ imageCaption: event.target.value })}
          placeholder="Keterangan foto (opsional)"
        />
      </label>
      {["stacked", "overlap"].includes(feature.imageLayoutTemplate || "") && (
        <label>
          URL gambar kedua
          <input
            value={feature.imageSecondaryUrl || ""}
            onChange={(event) => update({ imageSecondaryUrl: event.target.value })}
            placeholder="Tempel URL atau upload lewat Gallery"
          />
        </label>
      )}
    </div>
  );
}

// QA TC-126 — slideshow otomatis pada Gallery.
function GallerySlideshowEditor({
  feature,
  update,
}: {
  feature: Feature;
  update: (patch: Partial<Feature>) => void;
}) {
  return (
    <div className="gallery-slideshow-editor">
      <div className="group-heading">
        <strong>Slideshow Otomatis</strong>
      </div>
      <div className="setting-row compact">
        <div>
          <PlayCircle size={16} />
          <span>
            <strong>Aktifkan slideshow</strong>
            <small>Foto berganti otomatis, berhenti saat kursor di atasnya.</small>
          </span>
        </div>
        <button
          className={`toggle ${feature.gallerySlideshow ? "on" : ""}`}
          onClick={() => update({ gallerySlideshow: !feature.gallerySlideshow })}
        >
          <i />
        </button>
      </div>
      {feature.gallerySlideshow && (
        <label>
          Jeda antar foto <span>{((feature.gallerySlideshowMs || 3500) / 1000).toFixed(1)}s</span>
          <input
            type="range"
            min="1500"
            max="10000"
            step="250"
            value={feature.gallerySlideshowMs || 3500}
            onChange={(event) =>
              update({ gallerySlideshowMs: Number(event.target.value) })
            }
          />
        </label>
      )}
    </div>
  );
}

// QA TC-124 & TC-132 — button Google Maps dan QR pada feature Lokasi.
function MapButtonEditor({
  feature,
  update,
  variant = "location",
}: {
  feature: Feature;
  update: (patch: Partial<Feature>) => void;
  /** "event": tombol "Lihat Lokasi" pada fitur Event — tanpa peta & QR. */
  variant?: "location" | "event";
}) {
  const isEvent = variant === "event";
  return (
    <div className="map-button-editor">
      <div className="group-heading">
        <strong>{isEvent ? "Tombol lokasi acara" : "Button Buka Google Maps"}</strong>
      </div>
      <label>
        Label button
        <input
          value={
            (isEvent ? feature.eventButtonLabel : feature.mapButtonLabel) || ""
          }
          onChange={(event) =>
            update(
              isEvent
                ? { eventButtonLabel: event.target.value }
                : { mapButtonLabel: event.target.value },
            )
          }
          placeholder={isEvent ? "Lihat Lokasi" : "Buka Google Maps"}
        />
      </label>
      <label>
        Ikon
        <select
          value={feature.mapButtonIcon || "map-pin"}
          onChange={(event) =>
            update({
              mapButtonIcon: event.target.value as Feature["mapButtonIcon"],
            })
          }
        >
          <option value="map-pin">Pin lokasi</option>
          <option value="navigation">Navigasi</option>
          <option value="map">Peta</option>
          <option value="external">Tautan keluar</option>
          <option value="none">Tanpa ikon</option>
        </select>
      </label>
      {/* TC-208 — ukuran tombol & ikon. */}
      <label>
        Ukuran tombol <span>{feature.mapButtonFontSize || "bawaan"}{feature.mapButtonFontSize ? "px" : ""}</span>
        <input
          type="range"
          min={8}
          max={24}
          value={feature.mapButtonFontSize || 12}
          onChange={(event) =>
            update({ mapButtonFontSize: Number(event.target.value) })
          }
        />
      </label>
      {feature.mapButtonIcon !== "none" && (
        <label>
          Ukuran ikon <span>{feature.mapButtonIconSize || 14}px</span>
          <input
            type="range"
            min={10}
            max={32}
            value={feature.mapButtonIconSize || 14}
            onChange={(event) =>
              update({ mapButtonIconSize: Number(event.target.value) })
            }
          />
        </label>
      )}
      <label>
        Bentuk
        <select
          value={feature.mapButtonShape || "rounded"}
          onChange={(event) =>
            update({
              mapButtonShape: event.target.value as Feature["mapButtonShape"],
            })
          }
        >
          <option value="rounded">Rounded</option>
          <option value="pill">Pill</option>
          <option value="square">Kotak</option>
          <option value="outline">Outline</option>
        </select>
      </label>
      <div className="two-inputs">
        <label>
          Warna latar
          <ColorInput value={feature.mapButtonBackground} fallback="#125946" noneValue="transparent" onChange={(next) => update({ mapButtonBackground: next })} />
        </label>
        <label>
          Warna teks
          <ColorInput value={feature.mapButtonTextColor} fallback="#ffffff" onChange={(next) => update({ mapButtonTextColor: next })} />
        </label>
      </div>
      <div className="two-inputs">
        <label>
          Sudut <span>{feature.mapButtonRadius ?? 8}px</span>
          <input
            type="range"
            min="0"
            max="40"
            value={feature.mapButtonRadius ?? 8}
            onChange={(event) =>
              update({ mapButtonRadius: Number(event.target.value) })
            }
          />
        </label>
        <label>
          Tebal border <span>{feature.mapButtonBorderWidth ?? 0}px</span>
          <input
            type="range"
            min="0"
            max="6"
            value={feature.mapButtonBorderWidth ?? 0}
            onChange={(event) =>
              update({ mapButtonBorderWidth: Number(event.target.value) })
            }
          />
        </label>
      </div>
      {/* Peta embed & QR khusus fitur Lokasi; Event hanya punya tombolnya. */}
      {!isEvent && (
      <>
      <div className="setting-row compact">
        <div>
          <MapPin size={16} />
          <span>
            <strong>Preview peta Google Maps</strong>
            <small>Menampilkan peta langsung di section, seperti pada website.</small>
          </span>
        </div>
        <button
          className={`toggle ${feature.showMapEmbed !== false ? "on" : ""}`}
          onClick={() =>
            update({ showMapEmbed: !(feature.showMapEmbed !== false) })
          }
        >
          <i />
        </button>
      </div>
      {feature.showMapEmbed !== false && (
        <label>
          Tinggi peta <span>{feature.mapEmbedHeight || 260}px</span>
          <input
            type="range"
            min="160"
            max="520"
            step="10"
            value={feature.mapEmbedHeight || 260}
            onChange={(event) =>
              update({ mapEmbedHeight: Number(event.target.value) })
            }
          />
        </label>
      )}
      <div className="setting-row compact">
        <div>
          <QrCode size={16} />
          <span>
            <strong>Tampilkan QR lokasi</strong>
            <small>
              Fungsinya sama dengan tombol di atas. Nyalakan hanya bila tamu
              perlu memindai dari perangkat lain.
            </small>
          </span>
        </div>
        <button
          className={`toggle ${feature.showLocationQr === true ? "on" : ""}`}
          onClick={() => update({ showLocationQr: !feature.showLocationQr })}
        >
          <i />
        </button>
      </div>
      </>
      )}
    </div>
  );
}

// QA TC-120 — editor cerita pada section Love Story.
function LoveStoryEditor({
  feature,
  update,
}: {
  feature: Feature;
  update: (patch: Partial<Feature>) => void;
}) {
  const items = feature.loveStoryItems || [];
  const commit = (next: LoveStoryItem[]) => update({ loveStoryItems: next });
  const patch = (id: string, next: Partial<LoveStoryItem>) =>
    commit(items.map((item) => (item.id === id ? { ...item, ...next } : item)));
  return (
    <div className="love-story-editor">
      <div className="group-heading">
        <strong>Cerita</strong>
        <button
          onClick={() =>
            commit([
              ...items,
              {
                id: uid("ls"),
                year: String(new Date().getFullYear()),
                title: "Momen Baru",
                body: "Tuliskan ceritanya di sini.",
              },
            ])
          }
        >
          <Plus size={14} /> Tambah cerita
        </button>
      </div>
      <label>
        Layout
        <select
          value={feature.loveStoryLayout || "timeline"}
          onChange={(event) =>
            update({
              loveStoryLayout: event.target
                .value as Feature["loveStoryLayout"],
            })
          }
        >
          <option value="timeline">Timeline vertikal</option>
          <option value="cards">Kartu sejajar</option>
          <option value="zigzag">Zigzag kiri-kanan</option>
        </select>
      </label>
      {items.map((item, index) => (
        <div className="extra-text-row" key={item.id}>
          <div className="form-spec-head">
            <span>#{index + 1}</span>
            <button onClick={() => commit(items.filter((value) => value.id !== item.id))}>
              <Trash2 size={12} />
            </button>
          </div>
          <div className="two-inputs">
            <label>
              Tahun
              <input
                value={item.year}
                onChange={(event) => patch(item.id, { year: event.target.value })}
              />
            </label>
            <label>
              Judul
              <input
                value={item.title}
                onChange={(event) => patch(item.id, { title: event.target.value })}
              />
            </label>
          </div>
          <textarea
            value={item.body}
            onChange={(event) => patch(item.id, { body: event.target.value })}
            placeholder="Ceritakan momennya"
          />
          <label>
            URL foto (opsional)
            <input
              value={item.imageUrl || ""}
              onChange={(event) => patch(item.id, { imageUrl: event.target.value })}
            />
          </label>
        </div>
      ))}
      {!items.length && (
        <div className="layout-help">
          Belum ada cerita. Klik <strong>Tambah cerita</strong> untuk memulai.
        </div>
      )}
    </div>
  );
}

// QA TC-123 — credit / watermark halaman penutup.
function CreditEditor({
  feature,
  update,
}: {
  feature: Feature;
  update: (patch: Partial<Feature>) => void;
}) {
  return (
    <div className="credit-editor">
      <div className="group-heading">
        <strong>Credit & Watermark</strong>
      </div>
      <label>
        Teks credit
        <input
          value={feature.creditText || ""}
          onChange={(event) => update({ creditText: event.target.value })}
          placeholder="Created by ikrarku"
        />
      </label>
      <label>
        Judul lagu yang dipakai
        <input
          value={feature.creditSongTitle || ""}
          onChange={(event) => update({ creditSongTitle: event.target.value })}
          placeholder="Contoh: Christina Perri - A Thousand Years"
        />
      </label>
      <label>
        Link credit (opsional)
        <input
          value={feature.creditLink || ""}
          onChange={(event) => update({ creditLink: event.target.value })}
          placeholder="https://ikrarku.id"
        />
      </label>
      {/* QA 15 Okt — kotak "Created by" dulu terkunci 8 px dan warnanya hanya
          bisa diatur lewat editor kartu Gift, yang tidak muncul di Credit. */}
      <label className="range-field">
        <span className="range-head">
          Ukuran teks credit<b>{feature.creditFontSize ?? 8}px</b>
        </span>
        <input
          type="range"
          min="7"
          max="20"
          value={feature.creditFontSize ?? 8}
          onChange={(event) =>
            update({ creditFontSize: Number(event.target.value) })
          }
        />
      </label>
      <div className="two-inputs">
        <label>
          Warna teks & ikon
          <ColorInput value={feature.cardTextColor} fallback="#154f40" onChange={(next) => update({ cardTextColor: next })} />
        </label>
        <label>
          Warna kotak
          <ColorInput
            value={feature.cardBackground}
            noneValue="transparent"
            onChange={(next) => update({ cardBackground: next })}
          />
        </label>
      </div>
      <label>
        Warna garis
        <ColorInput
          value={feature.cardBorderColor}
          fallback="#d5ddd9"
          noneValue="transparent"
          onChange={(next) => update({ cardBorderColor: next })}
        />
      </label>
      <div className="setting-row compact">
        <span>
          <strong>Tempel di paling bawah undangan</strong>
          <small>
            Di Preview & undangan, Credit tampil di akhir halaman tanpa ruang
            kosong di bawahnya, di canvas mana pun ia diletakkan.
          </small>
        </span>
        <button
          className={`toggle ${feature.creditPinBottom !== false ? "on" : ""}`}
          aria-pressed={feature.creditPinBottom !== false}
          aria-label="Tempel Credit di paling bawah"
          onClick={() =>
            update({ creditPinBottom: feature.creditPinBottom === false })
          }
        >
          <i />
        </button>
      </div>
      <label>
        Gaya teks credit
        <select
          value={feature.creditTextStyle || "normal"}
          onChange={(event) =>
            update({
              creditTextStyle: event.target.value as Feature["creditTextStyle"],
            })
          }
        >
          <option value="normal">Normal</option>
          <option value="italic">Miring</option>
          <option value="bold">Tebal</option>
          <option value="uppercase">Huruf kapital</option>
        </select>
      </label>
      {/* TC-213 — elemen musik ikut tema. */}
      <strong className="credit-subhead">Elemen musik</strong>
      <label>
        Ikon judul lagu
        <select
          value={feature.creditMusicIcon || "disc"}
          onChange={(event) =>
            update({
              creditMusicIcon: event.target.value as Feature["creditMusicIcon"],
            })
          }
        >
          <option value="disc">Piringan (berputar saat diputar)</option>
          <option value="note">Not musik</option>
          <option value="none">Tanpa ikon</option>
        </select>
      </label>
      <label>
        Ukuran ikon musik<b>{feature.creditMusicIconSize || 14}px</b>
        <input
          type="range"
          min={10}
          max={32}
          value={feature.creditMusicIconSize || 14}
          onChange={(event) =>
            update({ creditMusicIconSize: Number(event.target.value) })
          }
        />
      </label>
      <label>
        Warna elemen musik
        <ColorInput value={feature.creditMusicColor} fallback="#125946" onChange={(next) => update({ creditMusicColor: next })} />
      </label>
      <button
        className="secondary-btn"
        onClick={() =>
          update({
            creditFontSize: undefined,
            cardTextColor: undefined,
            cardBackground: undefined,
            cardBorderColor: undefined,
            creditMusicColor: undefined,
            creditMusicIcon: undefined,
            creditMusicIconSize: undefined,
            creditTextStyle: undefined,
          })
        }
      >
        Kembalikan gaya credit bawaan
      </button>
    </div>
  );
}

// QA TC-105 — permintaan tautan reset password dari halaman login.
function ForgotPasswordPage({ setView }: { setView: (view: View) => void }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [devUrl, setDevUrl] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const result = await api.forgotPassword(email.trim());
      setSent(true);
      if (result?.devResetUrl) setDevUrl(result.devResetUrl);
    } catch (issue) {
      setError(
        issue instanceof Error ? issue.message : "Gagal mengirim tautan reset.",
      );
    }
    setBusy(false);
  };
  return (
    <div className="auth-page simple-auth">
      <section className="auth-form-wrap">
        <div className="auth-card">
          <div className="mobile-brand">
            <Brand />
          </div>
          <span className="auth-kicker">ACCOUNT RECOVERY</span>
          <h2>Lupa password</h2>
          <p>
            Masukkan email akun ikrarku Anda. Kami akan mengirim tautan untuk
            membuat password baru. Tautan berlaku 1 jam.
          </p>
          <form className="auth-fields" onSubmit={submit}>
            <label>
              Email terdaftar
              <input
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError("");
                }}
                placeholder="nama@email.com"
              />
            </label>
            {error && (
              <div className="auth-error" role="alert">
                <X size={16} />
                <span>{error}</span>
              </div>
            )}
            {sent && (
              <div className="verification-dev-link">
                <CheckCircle2 size={18} />
                <div>
                  <strong>Tautan reset dikirim.</strong>
                  <span>
                    Jika email terdaftar, tautan reset password sudah dikirim ke{" "}
                    {email}. Cek inbox dan folder spam.
                  </span>
                  {devUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        window.history.pushState(
                          {},
                          "",
                          new URL(devUrl).pathname + new URL(devUrl).search,
                        );
                        setView("reset-password");
                      }}
                    >
                      Buka tautan reset
                    </button>
                  )}
                </div>
              </div>
            )}
            <button
              type="submit"
              className="primary-btn full"
              disabled={busy || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
            >
              {busy ? "Mengirim..." : "Kirim tautan reset"}{" "}
              <ArrowRight size={16} />
            </button>
          </form>
          <div className="auth-switch">
            Ingat password Anda?{" "}
            <button type="button" onClick={() => setView("login")}>
              Kembali ke Sign in
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// QA TC-105 — form password baru berdasarkan token dari email.
function ResetPasswordPage({ setView }: { setView: (view: View) => void }) {
  const token = linkToken();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const match = password === passwordConfirm;
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await api.resetPassword({ token, password, passwordConfirm });
      setDone(true);
    } catch (issue) {
      setError(
        issue instanceof Error ? issue.message : "Reset password gagal.",
      );
    }
    setBusy(false);
  };
  return (
    <div className="auth-page simple-auth">
      <section className="auth-form-wrap">
        <div className="auth-card">
          <div className="mobile-brand">
            <Brand />
          </div>
          <span className="auth-kicker">SET A NEW PASSWORD</span>
          <h2>Buat password baru</h2>
          {!token && (
            <div className="auth-error">
              <X size={16} />
              <span>
                Token reset tidak ditemukan pada tautan. Silakan minta tautan
                baru dari halaman Lupa Password.
              </span>
            </div>
          )}
          {done ? (
            <div className="verification-dev-link">
              <CheckCircle2 size={18} />
              <div>
                <strong>Password berhasil diubah.</strong>
                <span>Silakan login menggunakan password baru Anda.</span>
                <button
                  type="button"
                  onClick={() => {
                    window.history.replaceState({}, "", "/login");
                    setView("login");
                  }}
                >
                  Ke halaman Sign in
                </button>
              </div>
            </div>
          ) : (
            <form className="auth-fields" onSubmit={submit}>
              <label>
                Password baru
                <div className="password-field">
                  <input
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError("");
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShow((value) => !value)}
                  >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <small
                  className={`field-hint ${password && password.length < 8 ? "field-hint-warn" : ""}`}
                >
                  Minimal 8 karakter. Disarankan gabungan huruf besar, angka,
                  dan simbol.
                </small>
              </label>
              <label>
                Ulangi password baru
                <div className="password-field">
                  <input
                    type={show ? "text" : "password"}
                    value={passwordConfirm}
                    onChange={(event) => setPasswordConfirm(event.target.value)}
                  />
                </div>
                {passwordConfirm && (
                  <small className={match ? "password-ok" : "password-error"}>
                    {match ? "Password sesuai" : "Password belum sama"}
                  </small>
                )}
              </label>
              {error && (
                <div className="auth-error" role="alert">
                  <X size={16} />
                  <span>{error}</span>
                </div>
              )}
              <button
                type="submit"
                className="primary-btn full"
                disabled={busy || !token || password.length < 8 || !match}
              >
                {busy ? "Menyimpan..." : "Simpan password baru"}{" "}
                <ArrowRight size={16} />
              </button>
            </form>
          )}
          <div className="auth-switch">
            Butuh tautan baru?{" "}
            <button type="button" onClick={() => setView("forgot-password")}>
              Kirim ulang
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// QA TC-094 — membentuk link personal per nama tamu.
function buildGuestLink(slug: string, guestName: string) {
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://ikrarku.id";
  const path = slug ? `/${slug}` : "/";
  return `${origin}${path}?to=${encodeURIComponent(guestName)}`;
}

// QA TC-075, TC-076, TC-106 — visibilitas status, takedown/republish, dan upload gambar sample.


// Administrator mengatur share fee tiap Template Creator. Rate baru berlaku untuk
// komisi berikutnya; komisi yang sudah tercatat tidak ikut berubah.
function CommissionRatePanel() {
  const [data, setData] = useState<{
    defaultRate: number;
    creators: any[];
  } | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    try {
      const result = await api.commissionRates();
      setData(result);
      setDraft(
        Object.fromEntries(
          result.creators.map((creator: any) => [
            creator.id,
            creator.rate === null ? "" : String(Math.round(creator.rate * 100)),
          ]),
        ),
      );
      setError("");
    } catch (issue) {
      setError(
        issue instanceof Error ? issue.message : "Gagal memuat daftar creator.",
      );
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  const save = async (creator: any) => {
    const raw = (draft[creator.id] ?? "").trim();
    if (raw !== "") {
      const percent = Number(raw);
      if (!Number.isFinite(percent) || percent < 0 || percent > 100) {
        setError("Share fee harus antara 0 dan 100.");
        return;
      }
    }
    setBusy(creator.id);
    setError("");
    try {
      await api.setCommissionRate(creator.id, raw === "" ? null : Number(raw) / 100);
      setNote(
        `Share fee ${creator.name} diperbarui. Berlaku untuk order berikutnya.`,
      );
      await load();
      window.setTimeout(() => setNote(""), 3200);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Gagal menyimpan.");
    }
    setBusy("");
  };
  const creators = data?.creators || [];
  return (
    <section className="commission-rate-panel">
      <div className="section-heading">
        <div>
          <span>TEMPLATE CREATOR</span>
          <h2>Share fee per Web Designer</h2>
          <p>
            Default platform {Math.round((data?.defaultRate ?? 0.1) * 100)}%.
            Kosongkan kolom untuk mengikuti default. Perubahan berlaku pada order
            berikutnya, komisi yang sudah tercatat tidak berubah.
          </p>
        </div>
        <strong>{creators.length} creator</strong>
      </div>
      {error && (
        <div className="auth-error">
          <X size={16} />
          <span>{error}</span>
        </div>
      )}
      {note && (
        <div className="verification-dev-link">
          <CheckCircle2 size={17} />
          <div>
            <span>{note}</span>
          </div>
        </div>
      )}
      {!creators.length && !error && (
        <div className="panel-empty">Belum ada Web Designer terdaftar.</div>
      )}
      {creators.length > 0 && (
        <div className="commission-table">
          <div className="commission-row rate head">
            <span>Web Designer</span>
            <span>Template</span>
            <span>Total komisi</span>
            <span>Belum dibayar</span>
            <span>Share fee</span>
          </div>
          {creators.map((creator) => (
            <div className="commission-row rate" key={creator.id}>
              <div className="creator-cell">
                <strong>{creator.name}</strong>
                <small>
                  {creator.email} · {creator.role}
                  {creator.active ? "" : " · nonaktif"}
                </small>
              </div>
              <span>{creator.templateCount}</span>
              <span>{formatRupiah(creator.earned || 0)}</span>
              <span>{formatRupiah(creator.unpaid || 0)}</span>
              <span className="rate-cell">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={draft[creator.id] ?? ""}
                  placeholder={String(Math.round((data?.defaultRate ?? 0.1) * 100))}
                  onChange={(event) =>
                    setDraft((previous) => ({
                      ...previous,
                      [creator.id]: event.target.value,
                    }))
                  }
                />
                <em>%</em>
                <button
                  className="settle-btn"
                  disabled={busy === creator.id}
                  onClick={() => void save(creator)}
                >
                  {busy === creator.id ? "..." : "Simpan"}
                </button>
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// Komisi Template Creator — Web Designer melihat komisi template miliknya,
// Administrator melihat seluruh komisi dan dapat menandainya sudah dibayar.
// Komisi & Share Fee dipisah jadi menu sendiri agar tidak menumpuk di halaman
// Templates & Approval. Administrator mengatur share fee dan melihat seluruh
// riwayat; Web Designer hanya melihat catatan pembayaran miliknya.
function CommissionWorkspace({ canApprove }: { canApprove: boolean }) {
  return (
    <div className="page commission-page">
      <div className="page-heading">
        <div>
          <div className="eyebrow">TEMPLATE CREATOR</div>
          <h1>{canApprove ? "Komisi & Share Fee" : "Komisi Saya"}</h1>
          <p>
            {canApprove
              ? "Atur bagi hasil tiap Web Designer dan pantau pembayaran komisinya."
              : "Catatan komisi dari setiap order yang memakai template buatan Anda."}
          </p>
        </div>
      </div>
      {canApprove && <CommissionRatePanel />}
      <CommissionPanel canApprove={canApprove} limit={10} />
    </div>
  );
}

// Query string saat halaman pertama dibuka. Efek sinkronisasi URL sempat
// menulis ulang path ke "/" selagi bootstrap berjalan, dan itu ikut membuang
// `?token=...` dari tautan email. Nilainya dibekukan di sini, sebelum React
// render pertama, supaya token tetap terbaca.
const initialSearchParams =
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search)
    : new URLSearchParams();
function linkToken(name = "token") {
  return (
    new URLSearchParams(window.location.search).get(name) ||
    initialSearchParams.get(name) ||
    ""
  );
}

// Salinan lokal isi editor, dipakai sebagai jaring pengaman ketika penyimpanan
// ke server gagal (sesi berakhir, jaringan putus) supaya pekerjaan tidak hilang.
const EDITOR_BACKUP_KEY = "ikrarku-editor-backup";
function backupEditorDraft(
  title: string,
  sections: CanvasSection[],
  extra: { slug?: string; templateId?: string } = {},
) {
  try {
    window.localStorage.setItem(
      EDITOR_BACKUP_KEY,
      JSON.stringify({
        title,
        sections,
        slug: extra.slug || "",
        templateId: extra.templateId || "",
        savedAt: new Date().toISOString(),
      }),
    );
  } catch {
    /* penyimpanan lokal penuh atau diblokir */
  }
}
function readEditorBackup(): {
  title: string;
  sections: CanvasSection[];
  savedAt: string;
  slug?: string;
  templateId?: string;
} | null {
  try {
    const raw = window.localStorage.getItem(EDITOR_BACKUP_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.sections) ? parsed : null;
  } catch {
    return null;
  }
}

// Error dari middleware auth ketika token hilang atau sesi berakhir.
function isAuthError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || "");
  return /Authentication required|Session expired|Akun tidak aktif|tidak ada aktivitas/i.test(
    message,
  );
}

function formatShortDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function CommissionPanel({
  canApprove,
  limit = 10,
}: {
  canApprove: boolean;
  limit?: number;
}) {
  const [data, setData] = useState<{
    rate: number;
    total: number;
    unpaid: number;
    rows: any[];
  } | null>(null);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    try {
      setData(await api.commissions());
      setError("");
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Gagal memuat komisi.");
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  const settle = async (id: string) => {
    setBusy(id);
    try {
      await api.settleCommission(id);
      await load();
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Gagal memperbarui komisi.");
    }
    setBusy("");
  };
  const allRows = data?.rows || [];
  const [page, setPage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(allRows.length / limit));
  const safePage = Math.min(page, pageCount - 1);
  const rows = allRows.slice(safePage * limit, safePage * limit + limit);
  useEffect(() => {
    setPage(0);
  }, [allRows.length]);
  // Untuk Administrator, rate tunggal tidak bermakna karena tiap Web Designer
  // punya share fee sendiri. Yang berguna adalah sisa pendapatan platform.
  const grossOrders = allRows.reduce(
    (sum, row) => sum + Number(row.order_amount || 0),
    0,
  );
  const platformRevenue = grossOrders - (data?.total || 0);
  return (
    <section className="commission-panel">
      <div className="section-heading">
        <div>
          <span>TEMPLATE CREATOR</span>
          <h2>Riwayat pembayaran komisi</h2>
          <p>
            {canApprove
              ? `Seluruh order yang menghasilkan komisi, beserta penanda sudah atau belum dibayar. ${allRows.length} order tercatat.`
              : `Catatan komisi dari order yang memakai template buatan Anda. ${allRows.length} order tercatat.`}
          </p>
        </div>
        <button className="secondary-btn" onClick={() => void load()}>
          <Repeat2 size={15} /> Refresh
        </button>
      </div>
      <div className="commission-summary">
        {canApprove ? (
          <div>
            <span>Pendapatan platform</span>
            <strong>{formatRupiah(platformRevenue)}</strong>
          </div>
        ) : (
          <div>
            <span>Rate komisi saya</span>
            <strong>{Math.round((data?.rate ?? 0.1) * 100)}%</strong>
          </div>
        )}
        <div>
          <span>Total komisi</span>
          <strong>{formatRupiah(data?.total || 0)}</strong>
        </div>
        <div>
          <span>Belum dibayar</span>
          <strong>{formatRupiah(data?.unpaid || 0)}</strong>
        </div>
        <div>
          <span>Jumlah order</span>
          <strong>{rows.length}</strong>
        </div>
      </div>
      {error && (
        <div className="auth-error">
          <X size={16} />
          <span>{error}</span>
        </div>
      )}
      {!rows.length && !error && (
        <div className="panel-empty">
          Belum ada komisi. Komisi tercatat otomatis ketika order yang memakai
          template Anda lunas.
        </div>
      )}
      {rows.length > 0 && (
        <div className="commission-table">
          <div className={`commission-row ledger ${canApprove ? "with-creator" : ""} head`}>
            <span>Tanggal order</span>
            <span>Template</span>
            {canApprove && <span>Creator</span>}
            <span>Customer</span>
            <span>Nilai order</span>
            <span>Rate</span>
            <span>Komisi</span>
            <span>Status pembayaran</span>
          </div>
          {rows.map((row) => (
            <div
              className={`commission-row ledger ${canApprove ? "with-creator" : ""}`}
              key={row.id}
            >
              <span>{formatShortDate(row.order_paid_at || row.created_at)}</span>
              <strong>{row.template_name}</strong>
              {canApprove && <span>{row.creator_name || "—"}</span>}
              <span>{row.customer_name}</span>
              <span>{formatRupiah(row.order_amount || 0)}</span>
              <span>{Math.round(Number(row.rate || 0) * 100)}%</span>
              <strong className="commission-amount">
                {formatRupiah(row.amount || 0)}
              </strong>
              <span className="ledger-status">
                <em
                  className={`status-chip ${row.status === "Paid" ? "published" : "pending"}`}
                >
                  {row.status === "Paid" ? "Sudah dibayar" : "Belum dibayar"}
                </em>
                {row.status === "Paid" && row.settled_at && (
                  <small>{formatShortDate(row.settled_at)}</small>
                )}
                {canApprove && row.status !== "Paid" && (
                  <button
                    className="settle-btn"
                    disabled={busy === row.id}
                    onClick={() => void settle(row.id)}
                  >
                    {busy === row.id ? "..." : "Tandai dibayar"}
                  </button>
                )}
              </span>
            </div>
          ))}
          {pageCount > 1 && (
            <div className="commission-pagination">
              <button
                disabled={safePage === 0}
                onClick={() => setPage(safePage - 1)}
              >
                <ChevronLeft size={14} /> Sebelumnya
              </button>
              <span>
                Halaman {safePage + 1} dari {pageCount} · {allRows.length} order
              </span>
              <button
                disabled={safePage >= pageCount - 1}
                onClick={() => setPage(safePage + 1)}
              >
                Berikutnya <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function TemplatePriceControl({
  price,
  onSave,
}: {
  price: number;
  onSave: (price: number) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(String(price));
  const [busy, setBusy] = useState(false);
  if (!editing)
    return (
      <button
        className="template-price-edit"
        onClick={() => {
          setValue(String(price));
          setEditing(true);
        }}
      >
        <PenLine size={12} /> {price ? "Ubah harga" : "Tetapkan harga"}
      </button>
    );
  const save = async () => {
    setBusy(true);
    try {
      await onSave(Number(value) || 0);
      setEditing(false);
    } catch {
      /* pesan sudah ditampilkan */
    } finally {
      setBusy(false);
    }
  };
  return (
    <form
      className="template-price-form"
      onSubmit={(event) => {
        event.preventDefault();
        void save();
      }}
    >
      <input
        type="number"
        min={0}
        step={1000}
        autoFocus
        aria-label="Harga template (IDR)"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <button type="submit" disabled={busy}>
        Simpan
      </button>
      <button type="button" onClick={() => setEditing(false)}>
        Batal
      </button>
    </form>
  );
}

function TemplateApprovalManager({
  templates,
  currentAccountId,
  canApprove,
  onTakedown,
  onRepublish,
  onUploadSample,
  onUploadThumbnail,
  onCaptureSample,
  onEditTemplate,
  onToggleRecommended,
  onSetPrice,
}: {
  templates: Template[];
  currentAccountId?: string;
  canApprove: boolean;
  onTakedown?: (templateId: string, reason: string) => Promise<void>;
  onRepublish?: (templateId: string) => Promise<void>;
  onUploadSample?: (templateId: string, file: File) => Promise<void>;
  onUploadThumbnail?: (templateId: string, file: File) => Promise<void>;
  onCaptureSample?: (templateId: string) => Promise<void>;
  onEditTemplate?: (template: Template) => void;
  onToggleRecommended?: (templateId: string, next: boolean) => Promise<void>;
  onSetPrice?: (templateId: string, price: number) => Promise<void>;
}) {
  const [takedownTarget, setTakedownTarget] = useState<Template | null>(null);
  const [reason, setReason] = useState("");
  const [preview, setPreview] = useState<Template | null>(null);
  // QA TC-160 (revisi): dialog Preview pada Templates & Approval juga perlu
  // pilihan Desktop / Mobile, bukan hanya dialog review di Tasks & Tickets.
  const [previewDevice, setPreviewDevice] = useState<DeviceMode>("desktop");
  const previewStageRef = useRef<HTMLDivElement | null>(null);
  useScrollResetOnOpen(
    previewStageRef,
    Boolean(preview),
    preview?.id,
    previewDevice,
  );
  const [uploadTarget, setUploadTarget] = useState<string>("");
  // Satu input file dipakai bergantian; "kind" menentukan field mana yang ditulis.
  const [uploadKind, setUploadKind] = useState<"sample" | "thumbnail">("sample");
  const fileRef = useRef<HTMLInputElement>(null);
  const owned = canApprove
    ? templates
    : templates.filter((item) => item.createdBy === currentAccountId);
  const statusLabel = (status?: string) =>
    status === "Published" || status === "Approved"
      ? "Published"
      : status === "Unpublished"
        ? "Takedown"
        : status || "Draft";
  // VN 6 (15 Okt) — daftar dulu memuat semua template sekaligus, termasuk
  // yang sudah ditolak & di-takedown, sehingga halaman memanjang dan terasa
  // dobel dengan katalog di bawahnya. Bawaan kini hanya Published & Pending;
  // yang ditolak/di-takedown hilang dari tampilan bawaan tetapi tetap ada
  // sebagai riwayat lewat filter. Pembuat template melihat filter yang sama,
  // jadi ia tahu templatenya ditolak dan bisa mengajukan ulang dari sana.
  type FilterKey = "active" | "rejected" | "takedown" | "draft" | "all";
  const filters: [FilterKey, string, string[] | null][] = [
    ["active", "Published & Pending", ["Published", "Pending"]],
    ["rejected", "Ditolak", ["Rejected"]],
    ["takedown", "Takedown", ["Takedown"]],
    ["draft", "Draft", ["Draft"]],
    ["all", "Semua (riwayat)", null],
  ];
  const [filter, setFilter] = useState<FilterKey>("active");
  const countFor = (labels: string[] | null) =>
    labels
      ? owned.filter((item) => labels.includes(statusLabel(item.status))).length
      : owned.length;
  const activeLabels = filters.find(([key]) => key === filter)?.[2] ?? null;
  const visible = activeLabels
    ? owned.filter((item) => activeLabels.includes(statusLabel(item.status)))
    : owned;
  // 8 per halaman = dua baris empat kolom (VN 6).
  const PAGE_SIZE = 8;
  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const [page, setPage] = useState(0);
  const currentPage = Math.min(page, pageCount - 1);
  const pageItems = visible.slice(
    currentPage * PAGE_SIZE,
    currentPage * PAGE_SIZE + PAGE_SIZE,
  );
  return (
    <section className="template-approval-manager">
      <div className="section-heading">
        <div>
          <span>TEMPLATES & APPROVAL</span>
          <h2>Status template saya</h2>
          <p>
            {canApprove
              ? "Seluruh template pada platform beserta status approval, gambar sample, dan kontrol publikasi."
              : "Template yang Anda buat beserta status approval. Anda dapat mengedit ulang, mengganti gambar sample, atau menarik template dari publikasi."}
          </p>
        </div>
        <strong>{owned.length} template</strong>
      </div>
      <div className="template-status-filters" role="tablist" aria-label="Filter status template">
        {filters
          .filter(([key, , labels]) => key !== "draft" || countFor(labels) > 0)
          .map(([key, label, labels]) => (
            <button
              key={key}
              role="tab"
              aria-selected={filter === key}
              className={filter === key ? "active" : ""}
              onClick={() => {
                setFilter(key);
                setPage(0);
              }}
            >
              {label} <b>{countFor(labels)}</b>
            </button>
          ))}
      </div>
      <input
        ref={fileRef}
        hidden
        type="file"
        accept="image/*"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file && uploadTarget) {
            if (uploadKind === "thumbnail")
              void onUploadThumbnail?.(uploadTarget, file);
            else void onUploadSample?.(uploadTarget, file);
          }
          event.target.value = "";
        }}
      />
      {!visible.length && (
        <div className="empty-state">
          <Palette size={30} />
          {owned.length ? (
            <>
              <h2>Tidak ada template di filter ini</h2>
              <p>Pilih filter lain untuk melihat template yang ada.</p>
            </>
          ) : (
            <>
              <h2>Belum ada template</h2>
              <p>Buat template baru melalui tombol Create Template.</p>
            </>
          )}
        </div>
      )}
      <div className="template-status-grid">
        {pageItems.map((template) => (
          <article
            key={template.id}
            className={`template-status-card status-${statusLabel(template.status).toLowerCase()}`}
          >
            <div
              className="template-status-thumb"
              style={
                template.preview || template.sampleImage
                  ? {
                      backgroundImage: `url(${template.preview || template.sampleImage})`,
                    }
                  : undefined
              }
            >
              {!(template.preview || template.sampleImage) && (
                <>
                  <TemplateCoverArt template={template} />
                  <span className="thumb-empty">
                    <ImageIcon size={13} />
                    Belum ada gambar sample
                  </span>
                </>
              )}
            </div>
            <div className="template-status-meta">
              <div>
                <strong>{template.name}</strong>
                <span>
                  {template.category} ·{" "}
                  {template.price
                    ? formatRupiah(template.price)
                    : "Harga belum ditetapkan"}
                </span>
                {/* MoM A7 — harga ditetapkan & diubah cepat oleh Administrator. */}
                {onSetPrice && (
                  <TemplatePriceControl
                    price={template.price || 0}
                    onSave={(price) => onSetPrice(template.id, price)}
                  />
                )}
                {/* VN 6 — admin perlu tahu siapa yang mengajukan. Pembuat
                    sendiri tidak perlu diberi tahu namanya sendiri. */}
                {canApprove && (template.createdByName || template.createdBy) && (
                  <span className="template-status-creator">
                    Diajukan oleh{" "}
                    <b>{template.createdByName || template.createdBy}</b>
                  </span>
                )}
              </div>
              <em
                className={`status-chip ${statusLabel(template.status).toLowerCase()}`}
              >
                {statusLabel(template.status)}
              </em>
            </div>
            <div className="template-status-actions">
              <button onClick={() => setPreview(template)}>
                <Eye size={14} /> Preview
              </button>
              <button onClick={() => onEditTemplate?.(template)}>
                <WandSparkles size={14} /> Edit ulang
              </button>
              <button
                onClick={() => {
                  setUploadTarget(template.id);
                  setUploadKind("sample");
                  fileRef.current?.click();
                }}
                title="Visual besar pada heading halaman detail template. Rasio lanskap 16:9, rekomendasi 1920 x 1080 px, maksimal 2 MB."
              >
                <Upload size={14} /> Gambar sample
              </button>
              {/* Thumbnail kartu di halaman /template, terpisah dari gambar
                  sample supaya cover katalog bisa diatur sendiri. */}
              <button
                onClick={() => {
                  setUploadTarget(template.id);
                  setUploadKind("thumbnail");
                  fileRef.current?.click();
                }}
                title="Cover kartu template pada halaman /template. Rasio potret 4:5, rekomendasi 800 x 1000 px, maksimal 2 MB."
              >
                <ImageIcon size={14} /> Thumbnail
              </button>
              {/* QA TC-151: kurasi badge Recommended pada katalog publik.
                  Hanya untuk template yang sudah publish. */}
              {onToggleRecommended && canApprove && (
                <button
                  className={template.recommended ? "recommended-on" : ""}
                  title={
                    template.recommended
                      ? "Hapus dari daftar rekomendasi"
                      : "Tandai sebagai desain rekomendasi"
                  }
                  disabled={
                    !["Published", "Approved"].includes(template.status || "")
                  }
                  onClick={() =>
                    void onToggleRecommended(
                      template.id,
                      !template.recommended,
                    )
                  }
                >
                  <Star size={14} />
                  {template.recommended ? "Recommended" : "Jadikan rekomendasi"}
                </button>
              )}
              {/* QA TC-144: sample diambil langsung dari canvas Buka Undangan,
                  dirender pada rasio kartu landing agar tidak terpotong. */}
              {onCaptureSample && (
                <button
                  onClick={() => void onCaptureSample(template.id)}
                  title="Ambil otomatis dari canvas Buka Undangan"
                >
                  <Sparkles size={14} /> Ambil dari Canvas
                </button>
              )}
              {["Published", "Approved"].includes(template.status || "") ? (
                <button
                  className="danger"
                  onClick={() => {
                    setTakedownTarget(template);
                    setReason("");
                  }}
                >
                  <EyeOff size={14} /> Takedown
                </button>
              ) : (
                <button
                  className="primary"
                  onClick={() => void onRepublish?.(template.id)}
                >
                  <Upload size={14} />{" "}
                  {canApprove ? "Publish" : "Ajukan republish"}
                </button>
              )}
            </div>
            <small className="template-status-hint">
              {statusLabel(template.status) === "Takedown"
                ? "Template tidak tampil di landing page dan tidak dapat dipesan customer."
                : template.status === "Pending"
                  ? "Menunggu approval Administrator."
                  : template.status === "Rejected"
                    ? "Ditolak Administrator. Revisi lalu ajukan republish."
                    : "Live di landing page dan dapat dipesan customer."}
            </small>
            {/* QA TC-158 (revisi): keterangan ukuran ditempatkan di bawah
                template-status-hint sesuai permintaan QA. */}
            <p className="upload-size-hint">
              <ImageIcon size={12} />
              <span>
                <strong>Gambar sample</strong> lanskap 16:9 — 1920 x 1080 px ·{" "}
                <strong>Thumbnail</strong> potret 4:5 — 800 x 1000 px · JPG/PNG,
                maksimal 2 MB
              </span>
            </p>
          </article>
        ))}
      </div>
      {pageCount > 1 && (
        <nav className="template-status-pager" aria-label="Halaman template">
          <button
            disabled={currentPage === 0}
            onClick={() => setPage(currentPage - 1)}
            aria-label="Halaman sebelumnya"
          >
            <ChevronLeft size={15} />
          </button>
          {Array.from({ length: pageCount }, (_, index) => (
            <button
              key={index}
              className={index === currentPage ? "active" : ""}
              aria-current={index === currentPage ? "page" : undefined}
              onClick={() => setPage(index)}
            >
              {index + 1}
            </button>
          ))}
          <button
            disabled={currentPage === pageCount - 1}
            onClick={() => setPage(currentPage + 1)}
            aria-label="Halaman berikutnya"
          >
            <ChevronRight size={15} />
          </button>
          <span>
            {currentPage * PAGE_SIZE + 1}–
            {Math.min(visible.length, (currentPage + 1) * PAGE_SIZE)} dari{" "}
            {visible.length}
          </span>
        </nav>
      )}
      {takedownTarget && (
        <div className="dialog-overlay" onClick={() => setTakedownTarget(null)}>
          <div
            className="confirm-dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="confirm-icon">
              <EyeOff size={22} />
            </div>
            <h3>Takedown template {takedownTarget.name}?</h3>
            <p>
              Template akan ditarik dari landing page dan tidak dapat dipesan
              customer. Order yang sudah berjalan tidak terpengaruh.
            </p>
            <label className="takedown-reason">
              Alasan takedown (opsional)
              <textarea
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Contoh: revisi harga dan perbaikan section gallery."
              />
            </label>
            <div className="confirm-actions">
              <button
                className="secondary-btn"
                onClick={() => setTakedownTarget(null)}
              >
                Batal
              </button>
              <button
                className="danger-btn"
                onClick={() => {
                  const target = takedownTarget;
                  setTakedownTarget(null);
                  void onTakedown?.(target.id, reason);
                }}
              >
                <EyeOff size={15} /> Takedown
              </button>
            </div>
          </div>
        </div>
      )}
      {preview && (
        <div className="dialog-overlay template-quick-preview">
          <div className="template-preview-dialog wide">
            <header>
              <div>
                <span>TEMPLATE PREVIEW</span>
                <h2>{preview.name}</h2>
              </div>
              <div className="preview-header-actions">
                <div className="journey-device-switch">
                  <button
                    className={previewDevice === "desktop" ? "active" : ""}
                    onClick={() => setPreviewDevice("desktop")}
                  >
                    <Monitor size={15} /> Desktop
                  </button>
                  <button
                    className={previewDevice === "mobile" ? "active" : ""}
                    onClick={() => setPreviewDevice("mobile")}
                  >
                    <Smartphone size={15} /> Mobile
                  </button>
                </div>
                <button
                  className="preview-close-btn"
                  aria-label="Tutup preview"
                  onClick={() => setPreview(null)}
                >
                  <X size={18} />
                </button>
              </div>
            </header>
            <DeviceContext value={previewDevice}>
            <PreviewSurfaceContext value={true}>
            <div
              ref={previewStageRef}
              className={`template-dialog-actual-preview live device-${previewDevice}`}
            >
              <TemplateLivePreview template={preview} />
            </div>
            </PreviewSurfaceContext>
            </DeviceContext>
          </div>
        </div>
      )}
    </section>
  );
}

// QA TC-102 — modal Administrator untuk mengubah data diri & mereset password user lain.
function UserEditModal({
  account,
  onClose,
  onSave,
}: {
  account: AuthAccount;
  onClose: () => void;
  onSave: (payload: Record<string, unknown>) => Promise<boolean>;
}) {
  const [firstName, setFirstName] = useState(
    account.firstName || account.name.split(" ")[0] || "",
  );
  const [lastName, setLastName] = useState(
    account.lastName || account.name.split(" ").slice(1).join(" "),
  );
  const [email, setEmail] = useState(account.email);
  const [username, setUsername] = useState(account.username);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [emailVerified, setEmailVerified] = useState(
    account.emailVerified !== false,
  );
  const wantsPassword = password.length > 0;
  const match = password === passwordConfirm;
  const submit = async () => {
    if (busy) return;
    if (wantsPassword && (password.length < 8 || !match)) {
      setError("Password minimal 8 karakter dan harus sama pada kedua kolom.");
      return;
    }
    setBusy(true);
    setError("");
    await onSave({
      firstName,
      lastName,
      email,
      username,
      emailVerified,
      ...(wantsPassword ? { password } : {}),
    });
    setBusy(false);
  };
  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div
        className="account-edit-dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <header>
          <div>
            <span>MANAGE ACCOUNT</span>
            <h2>Ubah data {account.name}</h2>
          </div>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </header>
        <div className="two-cols">
          <label>
            Nama depan
            <input
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </label>
          <label>
            Nama belakang
            <input
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </label>
        </div>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label>
          Username
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>
        <label className="checkbox-row verify-row">
          <span>
            Email sudah terverifikasi
            <small>
              Akun yang belum terverifikasi tidak bisa login meski passwordnya
              benar.
            </small>
          </span>
          <input
            type="checkbox"
            checked={emailVerified}
            onChange={(event) => setEmailVerified(event.target.checked)}
          />
        </label>
        <div className="reset-password-block">
          <div className="group-heading">
            <strong>Reset password</strong>
            <span>Opsional</span>
          </div>
          <p>
            Isi hanya bila user lupa password. Semua sesi login user akan
            dicabut dan notifikasi dikirim ke emailnya.
          </p>
          <label>
            Password baru
            <div className="password-field">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError("");
                }}
                placeholder="Minimal 8 karakter"
              />
              <button type="button" onClick={() => setShow((value) => !value)}>
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>
          {wantsPassword && (
            <label>
              Ulangi password baru
              <div className="password-field">
                <input
                  type={show ? "text" : "password"}
                  value={passwordConfirm}
                  onChange={(event) => setPasswordConfirm(event.target.value)}
                />
              </div>
              {passwordConfirm && (
                <small className={match ? "password-ok" : "password-error"}>
                  {match ? "Password sesuai" : "Password belum sama"}
                </small>
              )}
            </label>
          )}
        </div>
        {error && (
          <div className="auth-error">
            <X size={16} />
            <span>{error}</span>
          </div>
        )}
        <footer>
          <button className="secondary-btn" onClick={onClose}>
            Batal
          </button>
          <button
            className="primary-btn"
            disabled={busy}
            onClick={() => void submit()}
          >
            <Save size={15} /> {busy ? "Menyimpan..." : "Simpan perubahan"}
          </button>
        </footer>
      </div>
    </div>
  );
}

export default App;
