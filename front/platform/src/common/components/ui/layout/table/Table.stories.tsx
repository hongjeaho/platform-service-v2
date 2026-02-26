import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { Button, Table, tableStyles } from '@/common/components/ui'
import { textCombinations } from '@/constants/design/typography'
import { cn } from '@/lib/utils'

const meta = {
  title: 'UI/Layout/Table',
  component: Table,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
섹션/카드 내 입력·조회용 테이블 레이아웃 컴포넌트입니다.

- \`header\`: thead 안에 들어갈 내용 (tr 또는 여러 tr)
- \`children\`: tbody 안에 들어갈 내용 (tr 목록)
- \`tableStyles\`: th/td 등에 적용할 공통 스타일 (import하여 사용)

입력 폼(동적 행 추가/삭제)과 조회(읽기 전용) 모두 같은 디자인으로 사용할 수 있습니다.
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 입력 예: 헤더에 추가 버튼, 각 행에 삭제 버튼
 */
function InputExample() {
  const [rows, setRows] = useState([
    { id: '1', date: '2023.10.23', text: '손실보상협의요청 제1차' },
  ])

  const handleAdd = () => {
    setRows(r => [...r, { id: String(Date.now()), date: '', text: '' }])
  }

  const handleRemove = (index: number) => {
    if (rows.length <= 1) return
    setRows(r => r.filter((_, i) => i !== index))
  }

  return (
    <div style={{ width: '560px' }}>
      <Table
        header={
          <tr>
            <th className={cn(tableStyles.th, 'w-[280px]', 'text-center')}>날짜</th>
            <th className={cn(tableStyles.th, 'text-center')}>내용</th>
            <th className={cn(tableStyles.th, tableStyles.thActions)}>
              <Button type='button' variant='secondary' size='sm' onClick={handleAdd}>
                추가
              </Button>
            </th>
          </tr>
        }
      >
        {rows.map((row, index) => (
          <tr key={row.id}>
            <td className={cn(tableStyles.td, 'text-center')}>
              <input
                type='text'
                className='w-full min-w-0 border border-border rounded px-2 py-1.5 text-sm'
                placeholder='예) 2023.10.23'
                value={row.date}
                onChange={e =>
                  setRows(r =>
                    r.map((item, i) => (i === index ? { ...item, date: e.target.value } : item)),
                  )
                }
              />
            </td>
            <td className={tableStyles.td}>
              <input
                type='text'
                className='w-full min-w-0 border border-border rounded px-2 py-1.5 text-sm'
                placeholder='내용 입력'
                value={row.text}
                onChange={e =>
                  setRows(r =>
                    r.map((item, i) => (i === index ? { ...item, text: e.target.value } : item)),
                  )
                }
              />
            </td>
            <td className={cn(tableStyles.td, tableStyles.tdActions)}>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => handleRemove(index)}
                disabled={rows.length <= 1}
                aria-label='행 삭제'
              >
                삭제
              </Button>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  )
}

export const InputWithAddRemove: Story = {
  args: {},
  render: () => <InputExample />,
  parameters: {
    docs: {
      description: {
        story: '동적 행 추가/삭제가 있는 입력 테이블 예시. 헤더에 추가 버튼, 각 행에 삭제 버튼.',
      },
    },
  },
}

const viewItems = [
  { date: '2023.10.23', text: '손실보상협의요청 제1차 (건설관리과 2003-001호)' },
  { date: '2023.11.01', text: '손실보상협의요청 제2차' },
]

/**
 * 조회 예: 읽기 전용, 빈 메시지 지원
 */
function ViewExample({ empty }: { empty?: boolean }) {
  const items = empty ? [] : viewItems

  return (
    <div style={{ width: '560px' }}>
      <Table
        header={
          <tr>
            <th className={cn(tableStyles.th, 'w-[280px]')}>날짜</th>
            <th className={tableStyles.th}>내용</th>
          </tr>
        }
      >
        {items.length > 0 ? (
          items.map((row, index) => (
            <tr key={`${row.date}-${index}`}>
              <td className={cn(tableStyles.td, textCombinations.body)}>{row.date}</td>
              <td className={cn(tableStyles.td, textCombinations.body)}>{row.text}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={2}
              className={cn(
                tableStyles.td,
                textCombinations.bodySm,
                'text-muted-foreground text-center',
              )}
            >
              표시할 협의 내역이 없습니다.
            </td>
          </tr>
        )}
      </Table>
    </div>
  )
}

export const ViewReadOnly: Story = {
  args: {},
  render: () => <ViewExample />,
  parameters: {
    docs: {
      description: {
        story: '조회용 읽기 전용 테이블. 추가/삭제 열 없음.',
      },
    },
  },
}

export const ViewEmpty: Story = {
  args: {},
  render: () => <ViewExample empty />,
  parameters: {
    docs: {
      description: {
        story: '데이터가 없을 때 빈 메시지 1행으로 표시.',
      },
    },
  },
}
