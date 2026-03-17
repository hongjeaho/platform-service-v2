import type { Meta, StoryObj } from '@storybook/react'

import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '.'

const meta: Meta<typeof Table> = {
  title: 'Common/Table',
  component: Table,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    striped: { control: 'boolean', description: '줄무늬(행 교차 배경)' },
    hoverable: { control: 'boolean', description: '행 hover 강조' },
  },
}

export default meta
type Story = StoryObj<typeof Table>

function DemoTable(args: { striped?: boolean; hoverable?: boolean }) {
  return (
    <div className='w-[720px]'>
      <Table {...args} ariaLabel='데모 테이블'>
        <TableHeader>
          <TableRow>
            <TableHead align='left'>이름</TableHead>
            <TableHead>상태</TableHead>
            <TableHead align='right'>금액</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell align='left'>딸기</TableCell>
            <TableCell>접수</TableCell>
            <TableCell align='right'>10,000</TableCell>
          </TableRow>
          <TableRow>
            <TableCell align='left'>바나나</TableCell>
            <TableCell>검토중</TableCell>
            <TableCell align='right'>7,000</TableCell>
          </TableRow>
          <TableRow>
            <TableCell align='left'>수박</TableCell>
            <TableCell>완료</TableCell>
            <TableCell align='right'>25,000</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2} align='left'>
              합계
            </TableCell>
            <TableCell align='right'>42,000</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}

export const Default: Story = {
  args: { striped: false, hoverable: true },
  render: args => <DemoTable striped={args.striped} hoverable={args.hoverable} />,
}

export const Striped: Story = {
  args: { striped: true, hoverable: false },
  render: args => <DemoTable striped={args.striped} hoverable={args.hoverable} />,
}

export const HoverableOff: Story = {
  args: { striped: false, hoverable: false },
  render: args => <DemoTable striped={args.striped} hoverable={args.hoverable} />,
}

export const StripedAndHoverable: Story = {
  args: { striped: true, hoverable: true },
  render: args => <DemoTable striped={args.striped} hoverable={args.hoverable} />,
}

export const AlignVariants: Story = {
  render: () => (
    <div className='w-[720px]'>
      <Table ariaLabel='정렬 예시 테이블' striped hoverable>
        <TableHeader>
          <TableRow>
            <TableHead align='left'>Left</TableHead>
            <TableHead align='center'>Center</TableHead>
            <TableHead align='right'>Right</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell align='left'>A</TableCell>
            <TableCell align='center'>B</TableCell>
            <TableCell align='right'>C</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
}

