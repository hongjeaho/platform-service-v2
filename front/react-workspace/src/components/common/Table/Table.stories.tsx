import type { Meta, StoryObj } from '@storybook/react'

import { Table, TableCell, TableRow } from '.'

type Story = StoryObj<typeof Table>

/* 행정 데이터 예시 — 이미지 2 스타일 */
const AdminTableRender: Story['render'] = args => (
  <div className='w-[900px]'>
    <Table
      ariaLabel={args.ariaLabel}
      striped={args.striped}
      hoverable={args.hoverable}
      bordered={args.bordered}
    >
      <thead>
        <TableRow>
          <TableCell as='th' scope='col' align='left'>
            사건번호
          </TableCell>
          <TableCell as='th' scope='col' align='left'>
            수취인 성명
          </TableCell>
          <TableCell as='th' scope='col' align='left'>
            송달 종류
          </TableCell>
          <TableCell as='th' scope='col' align='left'>
            현재 상태
          </TableCell>
          <TableCell as='th' scope='col' align='left'>
            예정/완료일
          </TableCell>
          <TableCell as='th' scope='col' align='center'>
            관리
          </TableCell>
        </TableRow>
      </thead>
      <tbody>
        <TableRow>
          <TableCell align='left'>2024-수용-0081</TableCell>
          <TableCell align='left'>김철수</TableCell>
          <TableCell align='left'>공시송달</TableCell>
          <TableCell align='left'>송달중 (D-3)</TableCell>
          <TableCell align='left'>2024-11-20</TableCell>
          <TableCell align='center'>결과 업데이트</TableCell>
        </TableRow>
        <TableRow>
          <TableCell align='left'>2024-수용-0079</TableCell>
          <TableCell align='left'>이영희</TableCell>
          <TableCell align='left'>방문수령</TableCell>
          <TableCell align='left'>예약됨</TableCell>
          <TableCell align='left'>2024-11-15 14:00</TableCell>
          <TableCell align='center'>결과 업데이트</TableCell>
        </TableRow>
        <TableRow>
          <TableCell align='left'>2024-수용-0075</TableCell>
          <TableCell align='left'>(주)대한건설</TableCell>
          <TableCell align='left'>등기우편</TableCell>
          <TableCell align='left'>반송 (주소불명)</TableCell>
          <TableCell align='left'>2024-11-12</TableCell>
          <TableCell align='center'>재발송 처리</TableCell>
        </TableRow>
        <TableRow>
          <TableCell align='left'>2024-수용-0072</TableCell>
          <TableCell align='left'>박지민</TableCell>
          <TableCell align='left'>등기우편</TableCell>
          <TableCell align='left'>송달완료</TableCell>
          <TableCell align='left'>2024-11-10</TableCell>
          <TableCell align='center'>내역 보기</TableCell>
        </TableRow>
      </tbody>
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
    bordered: {
      control: 'boolean',
      description: '컬럼 구분선 — rowSpan/colSpan 병합 셀 테이블에 권장',
    },
  },
  render: AdminTableRender,
}

export default meta

export const Default: Story = {
  args: { ariaLabel: '업무 목록', striped: false, hoverable: true },
}

export const Striped: Story = {
  args: { ariaLabel: '업무 목록', striped: true, hoverable: false },
}

export const StripedAndHoverable: Story = {
  args: { ariaLabel: '업무 목록', striped: true, hoverable: true },
}

export const WithFooter: Story = {
  args: { ariaLabel: '금액 합계 테이블', striped: false, hoverable: true },
  render: args => (
    <div className='w-[640px]'>
      <Table ariaLabel={args.ariaLabel} striped={args.striped} hoverable={args.hoverable}>
        <thead>
          <TableRow>
            <TableCell as='th' scope='col' align='left'>
              항목
            </TableCell>
            <TableCell as='th' scope='col' align='left'>
              구분
            </TableCell>
            <TableCell as='th' scope='col' align='right'>
              금액
            </TableCell>
          </TableRow>
        </thead>
        <tbody>
          <TableRow>
            <TableCell align='left'>토지 보상금</TableCell>
            <TableCell align='left'>현금</TableCell>
            <TableCell align='right'>45,000,000</TableCell>
          </TableRow>
          <TableRow>
            <TableCell align='left'>이주 지원금</TableCell>
            <TableCell align='left'>현금</TableCell>
            <TableCell align='right'>5,000,000</TableCell>
          </TableRow>
          <TableRow>
            <TableCell align='left'>영업 손실 보상</TableCell>
            <TableCell align='left'>현금</TableCell>
            <TableCell align='right'>8,000,000</TableCell>
          </TableRow>
        </tbody>
        <tfoot>
          <TableRow>
            <TableCell colSpan={2} align='left'>
              합계
            </TableCell>
            <TableCell align='right'>58,000,000</TableCell>
          </TableRow>
        </tfoot>
      </Table>
    </div>
  ),
}

export const SpanVariants: Story = {
  args: { ariaLabel: '병합 셀 예시', striped: false, hoverable: true, bordered: true },
  render: args => (
    <div className='w-[640px]'>
      <Table
        ariaLabel={args.ariaLabel}
        striped={args.striped}
        hoverable={args.hoverable}
        bordered={args.bordered}
      >
        <thead>
          <TableRow>
            <TableCell as='th' rowSpan={2} scope='col' align='left'>
              구분
            </TableCell>
            <TableCell as='th' scope='col'>
              항목
            </TableCell>
            <TableCell as='th' scope='col' align='right'>
              금액
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell as='th' scope='col'>
              세부 항목
            </TableCell>
            <TableCell as='th' scope='col' align='right'>
              금액(원)
            </TableCell>
          </TableRow>
        </thead>
        <tbody>
          <TableRow>
            <TableCell rowSpan={2} align='left'>
              토지
            </TableCell>
            <TableCell>지목: 전</TableCell>
            <TableCell align='right'>30,000,000</TableCell>
          </TableRow>
          <TableRow groupEnd>
            <TableCell>지목: 답</TableCell>
            <TableCell align='right'>15,000,000</TableCell>
          </TableRow>
          <TableRow>
            <TableCell align='left' rowSpan={1}>
              건물
            </TableCell>
            <TableCell>단독주택</TableCell>
            <TableCell align='right'>20,000,000</TableCell>
          </TableRow>
        </tbody>
      </Table>
    </div>
  ),
}

export const AlignVariants: Story = {
  args: { ariaLabel: '정렬 예시', striped: true, hoverable: true },
  render: args => (
    <div className='w-[480px]'>
      <Table ariaLabel={args.ariaLabel} striped={args.striped} hoverable={args.hoverable}>
        <thead>
          <TableRow>
            <TableCell as='th' scope='col' align='left'>
              좌측 정렬
            </TableCell>
            <TableCell as='th' scope='col' align='center'>
              가운데 정렬
            </TableCell>
            <TableCell as='th' scope='col' align='right'>
              우측 정렬
            </TableCell>
          </TableRow>
        </thead>
        <tbody>
          <TableRow>
            <TableCell align='left'>항목 A</TableCell>
            <TableCell align='center'>완료</TableCell>
            <TableCell align='right'>1,200,000</TableCell>
          </TableRow>
          <TableRow>
            <TableCell align='left'>항목 B</TableCell>
            <TableCell align='center'>검토중</TableCell>
            <TableCell align='right'>850,000</TableCell>
          </TableRow>
        </tbody>
      </Table>
    </div>
  ),
}
