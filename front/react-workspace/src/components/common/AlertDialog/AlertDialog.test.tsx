import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Button } from '../Button'
import {
  AlertDialogContent,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './AlertDialog'
import { SimpleAlertDialog } from './SimpleAlertDialog'

describe('AlertDialog', () => {
  describe('Primitive', () => {
    it('Trigger asChild는 자식 요소를 그대로 사용해 button 중첩을 만들지 않습니다', () => {
      const { container } = render(
        <AlertDialogRoot>
          <AlertDialogTrigger asChild>
            <Button>열기</Button>
          </AlertDialogTrigger>
          <AlertDialogPortal>
            <AlertDialogContent>
              <AlertDialogTitle>제목</AlertDialogTitle>
            </AlertDialogContent>
          </AlertDialogPortal>
        </AlertDialogRoot>,
      )

      const buttonElements = container.querySelectorAll('button')
      expect(buttonElements).toHaveLength(1)
    })

    it('Trigger asChild + disabled이면 클릭해도 열리지 않습니다', async () => {
      render(
        <AlertDialogRoot>
          <AlertDialogTrigger asChild disabled>
            <Button>열기</Button>
          </AlertDialogTrigger>
          <AlertDialogPortal>
            <AlertDialogContent>
              <AlertDialogTitle>제목</AlertDialogTitle>
            </AlertDialogContent>
          </AlertDialogPortal>
        </AlertDialogRoot>,
      )

      fireEvent.click(screen.getByRole('button', { name: '열기' }))

      await waitFor(() => {
        expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
      })
    })
  })

  describe('SimpleAlertDialog', () => {
    it('alertdialog 역할로 렌더링됩니다', async () => {
      render(
        <SimpleAlertDialog
          open
          onOpenChange={() => undefined}
          title='제목'
          description='설명'
          onConfirm={() => undefined}
        />,
      )

      expect(await screen.findByRole('alertdialog')).toBeInTheDocument()
      expect(screen.getByText('제목')).toBeInTheDocument()
      expect(screen.getByText('설명')).toBeInTheDocument()
    })

    it('확인 클릭 시 onConfirm을 호출하고, 완료 후 닫힘을 요청합니다', async () => {
      const onOpenChange = vi.fn()
      const onConfirm = vi.fn()

      render(
        <SimpleAlertDialog
          open
          onOpenChange={onOpenChange}
          title='제목'
          description='설명'
          onConfirm={onConfirm}
          confirmLabel='확인'
          cancelLabel='취소'
        />,
      )

      fireEvent.click(screen.getByRole('button', { name: '확인' }))

      await waitFor(() => {
        expect(onConfirm).toHaveBeenCalledTimes(1)
      })

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false)
      })
    })

    it('취소 클릭 시 닫힘을 요청하고 onCancel을 호출합니다', async () => {
      const onOpenChange = vi.fn()
      const onCancel = vi.fn()

      render(
        <SimpleAlertDialog
          open
          onOpenChange={onOpenChange}
          title='제목'
          description='설명'
          onConfirm={() => undefined}
          onCancel={onCancel}
          confirmLabel='확인'
          cancelLabel='취소'
        />,
      )

      fireEvent.click(screen.getByRole('button', { name: '취소' }))

      await waitFor(() => {
        expect(onCancel).toHaveBeenCalledTimes(1)
      })

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false)
      })
    })
  })
})
