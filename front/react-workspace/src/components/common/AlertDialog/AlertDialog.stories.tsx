import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { Button } from '../Button'
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './AlertDialog'
import { SimpleAlertDialog } from './SimpleAlertDialog'

const meta: Meta<typeof SimpleAlertDialog> = {
  title: 'Common/AlertDialog',
  component: SimpleAlertDialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    title: { control: 'text', description: '다이얼로그 제목' },
    description: { control: 'text', description: '다이얼로그 설명' },
    confirmLabel: { control: 'text', description: '확인 버튼 텍스트' },
    cancelLabel: { control: 'text', description: '취소 버튼 텍스트' },
    confirmVariant: {
      control: 'select',
      options: ['primary', 'secondary', 'accent', 'destructive', 'outline', 'ghost', 'link'],
      description: '확인 버튼 variant',
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: '버튼 크기',
    },
    confirmDisabled: { control: 'boolean', description: '확인 버튼 비활성화' },
  },
}

export default meta
type Story = StoryObj<typeof SimpleAlertDialog>

export const PrimitiveComposition: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Primitive를 직접 조합하는 기본 예시입니다. 초기에는 닫힌 상태로 시작하며, 트리거 버튼으로 열고 취소/확인 버튼으로 닫습니다.',
      },
      source: {
        type: 'dynamic',
      },
    },
  },
  args: {
    title: '정말 삭제하시겠어요?',
    description: '삭제 후에는 복구할 수 없습니다.',
    confirmLabel: '삭제',
    cancelLabel: '취소',
    confirmVariant: 'destructive',
  },
  render: ({ title, description, confirmLabel, cancelLabel, confirmVariant }) => (
    <AlertDialogRoot>
      <AlertDialogTrigger asChild>
        <Button variant='secondary'>삭제 확인창 열기</Button>
      </AlertDialogTrigger>
      <AlertDialogPortal>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
          <div className='mt-5 flex justify-end gap-2'>
            <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
            <AlertDialogAction variant={confirmVariant} onClick={() => alert('삭제되었습니다.')}>
              {confirmLabel}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialogRoot>
  ),
}

export const SimpleDefault: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'SimpleAlertDialog 기본 사용 예시입니다. 외부 상태(open)를 제어하는 권장 패턴을 보여줍니다.',
      },
      source: {
        type: 'code',
        code: `
const [open, setOpen] = useState(false)

return (
  <>
    <Button variant='secondary' onClick={() => setOpen(true)}>
      확인창 열기
    </Button>
    <SimpleAlertDialog
      open={open}
      onOpenChange={setOpen}
      title='정말 삭제하시겠어요?'
      description='이 작업은 되돌릴 수 없습니다.'
      confirmLabel='삭제'
      cancelLabel='취소'
      confirmVariant='destructive'
      onConfirm={() =>  alert('삭제되었습니다.')}
    />
  </>
)
        `,
      },
    },
  },
  render: () => {
    const Story = () => {
      const [open, setOpen] = useState(false)

      return (
        <>
          <Button variant='secondary' onClick={() => setOpen(true)}>
            확인창 열기
          </Button>
          <SimpleAlertDialog
            open={open}
            onOpenChange={setOpen}
            title='정말 삭제하시겠어요?'
            description='이 작업은 되돌릴 수 없습니다.'
            confirmLabel='삭제'
            cancelLabel='취소'
            confirmVariant='destructive'
            onConfirm={() => alert('삭제되었습니다.')}
          />
        </>
      )
    }

    return <Story />
  },
}

export const SimpleAsyncConfirm: Story = {
  parameters: {
    docs: {
      description: {
        story:
          '확인 버튼에서 비동기 작업을 수행하는 예시입니다. 처리 중에는 확인 버튼이 비활성화되고, 완료되면 다이얼로그가 닫히며 상태 메시지가 갱신됩니다.',
      },
      source: {
        type: 'code',
        code: `
const [open, setOpen] = useState(false)
const [result, setResult] = useState<string | null>(null)

const handleConfirm = async () => {
  setResult('삭제 처리 중...')
  await new Promise((resolve) => setTimeout(resolve, 1200))
  setResult('삭제가 완료되었습니다.')
}

return (
  <div className='flex flex-col items-center gap-3'>
    <Button variant='secondary' onClick={() => setOpen(true)}>
      비동기 확인창 열기
    </Button>
    {result != null && <p className='text-sm text-muted-foreground'>{result}</p>}
    <SimpleAlertDialog
      open={open}
      onOpenChange={setOpen}
      title='정말 삭제하시겠어요?'
      description='서버 요청이 완료될 때까지 잠시 기다립니다.'
      confirmLabel='삭제'
      cancelLabel='취소'
      confirmVariant='destructive'
      onConfirm={handleConfirm}
    />
  </div>
)
        `,
      },
    },
  },
  render: () => {
    const Story = () => {
      const [open, setOpen] = useState(false)
      const [result, setResult] = useState<string | null>(null)

      const handleConfirm = async () => {
        setResult('삭제 처리 중...')
        await new Promise(resolve => setTimeout(resolve, 1200))
        setResult('삭제가 완료되었습니다.')
      }

      return (
        <div className='flex flex-col items-center gap-3'>
          <Button variant='secondary' onClick={() => setOpen(true)}>
            비동기 확인창 열기
          </Button>
          {result != null && <p className='text-sm text-muted-foreground'>{result}</p>}
          <SimpleAlertDialog
            open={open}
            onOpenChange={setOpen}
            title='정말 삭제하시겠어요?'
            description='서버 요청이 완료될 때까지 잠시 기다립니다.'
            confirmLabel='삭제'
            cancelLabel='취소'
            confirmVariant='destructive'
            onConfirm={handleConfirm}
          />
        </div>
      )
    }

    return <Story />
  },
}
