import type { Meta, StoryObj } from '@storybook/react'

import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '.'

type Story = StoryObj<typeof Table>

const RenderTableDemo: Story['render'] = args => (
  <div className='w-[720px]'>
    <Table ariaLabel={args.ariaLabel} striped={args.striped} hoverable={args.hoverable}>
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

const meta: Meta<typeof Table> = {
  title: 'Common/Table',
  component: Table,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    ariaLabel: { control: 'text', description: '테이블 접근성 레이블' },
    striped: { control: 'boolean', description: '줄무늬(행 교차 배경)' },
    hoverable: { control: 'boolean', description: '행 hover 강조' },
  },
  render: RenderTableDemo,
}

export default meta

export const Default: Story = {
  args: { ariaLabel: '데모 테이블', striped: false, hoverable: true },
}

export const Striped: Story = {
  args: { ariaLabel: '데모 테이블', striped: true, hoverable: false },
}

export const HoverableOff: Story = {
  args: { ariaLabel: '데모 테이블', striped: false, hoverable: false },
}

export const StripedAndHoverable: Story = {
  args: { ariaLabel: '데모 테이블', striped: true, hoverable: true },
}

export const AlignVariants: Story = {
  args: { ariaLabel: '정렬 예시 테이블', striped: true, hoverable: true },
  render: args => (
    <div className='w-[720px]'>
      <Table ariaLabel={args.ariaLabel} striped={args.striped} hoverable={args.hoverable}>
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

export const SpanVariants: Story = {
  args: { ariaLabel: '병합 예시 테이블', striped: true, hoverable: true },
  render: args => (
    <div className='w-[720px]'>
      <Table ariaLabel={args.ariaLabel} striped={args.striped} hoverable={args.hoverable}>
        <TableHeader>
          <TableRow>
            <TableHead rowSpan={2} align='left'>
              그룹
            </TableHead>
            <TableHead>항목</TableHead>
            <TableHead align='right'>금액</TableHead>
          </TableRow>
          <TableRow>
            <TableHead>상세</TableHead>
            <TableHead align='right'>금액(상세)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell rowSpan={2} align='left'>
              과일
            </TableCell>
            <TableCell>딸기</TableCell>
            <TableCell align='right'>10,000</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2} align='left'>
              (rowSpan/colSpan 예시)
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
}
