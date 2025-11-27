/**
 * 아이콘 디자인 토큰
 * lucide-react 아이콘 매핑 및 사이즈 정의
 */

import {
  AlertCircle,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Filter,
  FolderOpen,
  Home,
  Info,
  MapPin,
  Menu,
  Paperclip,
  Pencil,
  Plus,
  Search,
  Trash2,
  Upload,
  Users,
  X,
  XCircle,
} from 'lucide-react'

/**
 * 아이콘 사이즈 체계
 * TailwindCSS 클래스 기반으로 정의됨
 */
export const iconSizes = {
  xs: 'h-3 w-3', // 12px - 인라인 텍스트
  sm: 'h-4 w-4', // 16px - 버튼 내부
  md: 'h-5 w-5', // 20px - 기본
  lg: 'h-6 w-6', // 24px - 큰 버튼, 헤더
  xl: 'h-8 w-8', // 32px - 히어로 섹션
} as const

/**
 * 아이콘 매핑 객체
 * 비즈니스 로직에 따른 아이콘 선택
 */
export const icons = {
  // 공통 액션
  add: Plus,
  edit: Pencil,
  delete: Trash2,
  search: Search,
  filter: Filter,

  // 파일 관련
  document: FileText,
  upload: Upload,
  download: Download,
  attachment: Paperclip,

  // 상태 표시
  success: CheckCircle,
  warning: AlertCircle,
  error: XCircle,
  info: Info,

  // 네비게이션
  next: ChevronRight,
  prev: ChevronLeft,
  menu: Menu,
  close: X,

  // 도메인 특화
  home: Home,
  users: Users,
  case: Briefcase,
  folder: FolderOpen,
  calendar: Calendar,
  time: Clock,
  location: MapPin,
  building: Building2,
} as const

/**
 * 아이콘 사이즈 + 색상 조합
 * 자주 사용되는 조합을 미리 정의
 */
export const iconVariants = {
  // 기본 사이즈별 스타일
  smPrimary: `${iconSizes.sm} text-primary`,
  mdPrimary: `${iconSizes.md} text-primary`,
  lgPrimary: `${iconSizes.lg} text-primary`,

  smSuccess: `${iconSizes.sm} text-success`,
  mdSuccess: `${iconSizes.md} text-success`,
  lgSuccess: `${iconSizes.lg} text-success`,

  smWarning: `${iconSizes.sm} text-warning`,
  mdWarning: `${iconSizes.md} text-warning`,
  lgWarning: `${iconSizes.lg} text-warning`,

  smError: `${iconSizes.sm} text-error`,
  mdError: `${iconSizes.md} text-error`,
  lgError: `${iconSizes.lg} text-error`,

  smMuted: `${iconSizes.sm} text-muted-foreground`,
  mdMuted: `${iconSizes.md} text-muted-foreground`,
  lgMuted: `${iconSizes.lg} text-muted-foreground`,
} as const

/**
 * 아이콘 타입 정의
 */
export type IconKey = keyof typeof icons
export type IconSize = keyof typeof iconSizes
export type IconVariant = keyof typeof iconVariants
