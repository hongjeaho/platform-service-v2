import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'

import { Button } from '../Button'
import type {
  AlertDialogActionProps,
  AlertDialogCancelProps,
  AlertDialogPortalProps,
  AlertDialogRootProps,
  AlertDialogTriggerProps,
} from './AlertDialog.type'
import { AlertDialogContent } from './AlertDialogContent'
import { AlertDialogDescription } from './AlertDialogDescription'
import { AlertDialogOverlay } from './AlertDialogOverlay'
import { AlertDialogTitle } from './AlertDialogTitle'

export function AlertDialogRoot(props: AlertDialogRootProps) {
  return <AlertDialogPrimitive.Root {...props} />
}

export function AlertDialogTrigger({
  ref,
  size = 'md',
  variant = 'secondary',
  disabled = false,
  children,
  asChild,
  ...rest
}: AlertDialogTriggerProps) {
  if (asChild)
    return (
      <AlertDialogPrimitive.Trigger asChild disabled={disabled} {...rest}>
        {children}
      </AlertDialogPrimitive.Trigger>
    )

  return (
    <AlertDialogPrimitive.Trigger asChild {...rest}>
      <Button ref={ref} size={size} variant={variant} disabled={disabled}>
        {children}
      </Button>
    </AlertDialogPrimitive.Trigger>
  )
}

export function AlertDialogPortal(props: AlertDialogPortalProps) {
  return <AlertDialogPrimitive.Portal {...props} />
}

export { AlertDialogContent, AlertDialogDescription, AlertDialogOverlay, AlertDialogTitle }

export function AlertDialogAction({
  size = 'md',
  variant = 'primary',
  disabled = false,
  children,
  asChild,
  ...rest
}: AlertDialogActionProps) {
  if (asChild)
    return (
      <AlertDialogPrimitive.Action asChild disabled={disabled} {...rest}>
        {children}
      </AlertDialogPrimitive.Action>
    )

  return (
    <AlertDialogPrimitive.Action asChild {...rest}>
      <Button size={size} variant={variant} disabled={disabled}>
        {children}
      </Button>
    </AlertDialogPrimitive.Action>
  )
}

export function AlertDialogCancel({
  size = 'md',
  variant = 'secondary',
  disabled = false,
  children,
  asChild,
  ...rest
}: AlertDialogCancelProps) {
  if (asChild)
    return (
      <AlertDialogPrimitive.Cancel asChild disabled={disabled} {...rest}>
        {children}
      </AlertDialogPrimitive.Cancel>
    )

  return (
    <AlertDialogPrimitive.Cancel asChild {...rest}>
      <Button size={size} variant={variant} disabled={disabled}>
        {children}
      </Button>
    </AlertDialogPrimitive.Cancel>
  )
}
