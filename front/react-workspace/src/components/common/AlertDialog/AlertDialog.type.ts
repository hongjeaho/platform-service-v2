import type * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react'

import type { ButtonVariant as DSButtonVariant } from '../Button'

/**
 * AlertDialog 버튼 크기 타입
 */
export type AlertDialogSize = 'sm' | 'md' | 'lg'

/**
 * AlertDialog Root Props
 */
export type AlertDialogRootProps = ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Root>

/**
 * AlertDialog Trigger Props
 *
 * 기본 렌더링에서는 내부적으로 `Button`을 사용합니다.
 * `asChild`를 사용하면 children을 그대로 렌더링합니다.
 */
export interface AlertDialogTriggerProps extends Omit<
  ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Trigger>,
  'className' | 'children'
> {
  /**
   * ref (React 19: 일반 prop으로 전달)
   */
  ref?: Ref<HTMLButtonElement>

  /**
   * Trigger 버튼 크기
   * @default 'md'
   */
  size?: AlertDialogSize

  /**
   * Trigger 버튼 variant
   * @default 'secondary'
   */
  variant?: DSButtonVariant

  /**
   * 비활성화 여부
   * @default false
   */
  disabled?: boolean

  children: ReactNode
}

/**
 * AlertDialog Portal Props
 */
export type AlertDialogPortalProps = ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Portal>

/**
 * AlertDialog Overlay Props
 */
export type AlertDialogOverlayProps = Omit<
  ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>,
  'className'
>

/**
 * AlertDialog Content Props
 */
export type AlertDialogContentProps = Omit<
  ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>,
  'className'
>

/**
 * AlertDialog Title Props
 */
export type AlertDialogTitleProps = Omit<
  ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>,
  'className'
>

/**
 * AlertDialog Description Props
 */
export type AlertDialogDescriptionProps = Omit<
  ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>,
  'className'
>

/**
 * AlertDialog Action Props
 *
 * 기본 렌더링에서는 내부적으로 `Button`을 사용합니다.
 * `asChild`를 사용하면 children을 그대로 렌더링합니다.
 */
export interface AlertDialogActionProps extends Omit<
  ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>,
  'className' | 'children'
> {
  /**
   * Action 버튼 크기
   * @default 'md'
   */
  size?: AlertDialogSize

  /**
   * Action 버튼 variant
   * @default 'primary'
   */
  variant?: DSButtonVariant

  /**
   * 비활성화 여부
   * @default false
   */
  disabled?: boolean

  children: ReactNode
}

/**
 * AlertDialog Cancel Props
 *
 * 기본 렌더링에서는 내부적으로 `Button`을 사용합니다.
 * `asChild`를 사용하면 children을 그대로 렌더링합니다.
 */
export interface AlertDialogCancelProps extends Omit<
  ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>,
  'className' | 'children'
> {
  /**
   * Cancel 버튼 크기
   * @default 'md'
   */
  size?: AlertDialogSize

  /**
   * Cancel 버튼 variant
   * @default 'secondary'
   */
  variant?: DSButtonVariant

  /**
   * 비활성화 여부
   * @default false
   */
  disabled?: boolean

  children: ReactNode
}

/**
 * SimpleAlertDialog Props
 */
export interface SimpleAlertDialogProps {
  /**
   * 제어 모드: 열림 여부
   */
  open: boolean

  /**
   * 제어 모드: 열림 상태 변경 핸들러
   */
  onOpenChange: (open: boolean) => void

  /**
   * 다이얼로그 제목 (필수)
   */
  title: string

  /**
   * 다이얼로그 설명
   */
  description?: string

  /**
   * 확인 버튼 텍스트
   * @default '확인'
   */
  confirmLabel?: string

  /**
   * 취소 버튼 텍스트
   * @default '취소'
   */
  cancelLabel?: string

  /**
   * 확인 클릭 시 호출
   *
   * @example
   * ```tsx
   * <SimpleAlertDialog onConfirm={() => doSomething()} />
   * ```
   */
  onConfirm: () => void | Promise<void>

  /**
   * 취소 클릭 시 호출
   */
  onCancel?: () => void

  /**
   * 확인 버튼 비활성화
   * @default false
   */
  confirmDisabled?: boolean

  /**
   * 버튼 크기
   * @default 'md'
   */
  size?: AlertDialogSize

  /**
   * 확인 버튼 variant
   * @default 'destructive'
   */
  confirmVariant?: DSButtonVariant
}
