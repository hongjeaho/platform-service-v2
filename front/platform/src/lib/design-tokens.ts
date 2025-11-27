/**
 * 디자인 토큰 정의 파일
 * 아이콘 사이즈, 색상 매핑, 상수 값을 중앙에서 관리합니다.
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
 * 심의 진행 상황별 색상 매핑
 * 비즈니스 로직에 따른 상태별 색상 클래스
 */
export const statusColors = {
  접수: 'bg-info text-info-foreground',
  검토중: 'bg-warning text-warning-foreground',
  완료: 'bg-success text-success-foreground',
  반려: 'bg-error text-error-foreground',
  보류: 'bg-muted text-muted-foreground',
} as const

/**
 * 버튼 variant 색상 매핑
 */
export const buttonVariants = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  accent: 'bg-accent text-accent-foreground hover:bg-accent/90',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  outline: 'border border-border bg-background hover:bg-accent/10 hover:text-accent',
  ghost: 'hover:bg-accent/10 hover:text-foreground',
  link: 'underline-offset-4 hover:underline text-primary',
} as const

/**
 * 간격 시스템 상수
 * CSS 기본값: 4px 단위
 */
export const spacing = {
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '1rem', // 16px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
  '2xl': '3rem', // 48px
  '3xl': '4rem', // 64px
} as const

/**
 * 테두리 반경 상수
 */
export const borderRadius = {
  sm: 'calc(var(--radius) - 4px)',
  md: 'calc(var(--radius) - 2px)',
  lg: 'var(--radius)',
  xl: 'calc(var(--radius) + 4px)',
} as const

/**
 * 그림자 효과 매핑
 */
export const shadows = {
  sm: 'shadow-sm',
  md: 'shadow',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
} as const

/**
 * 트랜지션 속도 매핑
 */
export const transitions = {
  fast: 'transition-colors duration-150',
  base: 'transition-colors duration-200',
  slow: 'transition-colors duration-300',
} as const

/**
 * 아이콘 타입 (TypeScript용)
 */
export type IconKey = keyof typeof icons
export type IconSize = keyof typeof iconSizes
export type StatusType = keyof typeof statusColors
export type ButtonVariant = keyof typeof buttonVariants
