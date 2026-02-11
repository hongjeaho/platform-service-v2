/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { DateRangePicker } from './DateRangePicker.tsx'
import type { DateRange } from './DateRangePicker.types.ts'
import { FormDateRangePicker } from './FormDateRangePicker'

const meta = {
  title: 'UI/Form/DateRangePicker',
  component: DateRangePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    placeholder: '날짜 범위를 선택하세요',
  },
} satisfies Meta<typeof DateRangePicker>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 기본 DateRangePicker - 날짜 범위 선택 기능
 */
export const Default: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange>({ startDate: null, endDate: null })
    return (
      <div style={{ width: '400px' }}>
        <DateRangePicker value={range} onChange={setRange} />
      </div>
    )
  },
}

/**
 * 라벨이 있는 DateRangePicker
 */
export const WithLabel: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange>({ startDate: null, endDate: null })
    return (
      <div style={{ width: '400px' }}>
        <DateRangePicker
          label='기간'
          value={range}
          onChange={setRange}
          placeholder='기간을 선택하세요'
        />
      </div>
    )
  },
}

/**
 * 필수 입력 DateRangePicker
 */
export const Required: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange>({ startDate: null, endDate: null })
    return (
      <div style={{ width: '400px' }}>
        <DateRangePicker
          label='심의 기간'
          required
          value={range}
          onChange={setRange}
          placeholder='심의 기간을 선택하세요'
        />
      </div>
    )
  },
}

/**
 * 에러 상태 DateRangePicker
 */
export const WithError: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange>({ startDate: null, endDate: null })
    return (
      <div style={{ width: '400px' }}>
        <DateRangePicker
          label='기간'
          value={range}
          onChange={setRange}
          error='날짜 범위를 선택해주세요'
        />
      </div>
    )
  },
}

/**
 * 비활성화된 DateRangePicker
 */
export const Disabled: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange>({
      startDate: new Date(2024, 0, 1),
      endDate: new Date(2024, 0, 31),
    })
    return (
      <div style={{ width: '400px' }}>
        <DateRangePicker label='기간' value={range} onChange={setRange} disabled />
      </div>
    )
  },
}

/**
 * 날짜 범위가 선택된 DateRangePicker
 */
export const WithValue: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange>({
      startDate: new Date(2024, 0, 15),
      endDate: new Date(2024, 0, 20),
    })
    return (
      <div style={{ width: '400px' }}>
        <DateRangePicker label='기간' value={range} onChange={setRange} />
      </div>
    )
  },
}

/**
 * 최소/최대 날짜 제한 DateRangePicker
 */
export const WithMinMaxDate: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange>({ startDate: null, endDate: null })
    const today = new Date()
    const minDate = new Date(today)
    minDate.setMonth(today.getMonth() - 1)
    const maxDate = new Date(today)
    maxDate.setMonth(today.getMonth() + 1)

    return (
      <div style={{ width: '400px' }}>
        <DateRangePicker
          label='기간'
          value={range}
          onChange={setRange}
          minDate={minDate}
          maxDate={maxDate}
          placeholder='지난 달부터 다음 달까지 선택 가능'
        />
      </div>
    )
  },
}

// ===== FormDateRangePicker Stories =====

/**
 * FormDateRangePicker 기본 사용 예시
 */
export const FormDateRangePickerBasic: Story = {
  render: () => {
    const { control, handleSubmit, watch } = useForm<{
      reviewPeriod: DateRange
    }>({
      defaultValues: {
        reviewPeriod: { startDate: null, endDate: null },
      },
    })

    const onSubmit = (data: { reviewPeriod: DateRange }) => {
      alert(
        `심의 기간: ${data.reviewPeriod.startDate?.toLocaleDateString()} ~ ${data.reviewPeriod.endDate?.toLocaleDateString()}`,
      )
    }

    const reviewPeriod = watch('reviewPeriod')

    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ width: '500px', display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <FormDateRangePicker
          name='reviewPeriod'
          control={control}
          label='심의 기간'
          placeholder='기간을 선택하세요'
        />
        <button
          type='submit'
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
          }}
        >
          제출
        </button>
        {reviewPeriod.startDate && reviewPeriod.endDate && (
          <p style={{ fontSize: '0.875rem', color: '#666' }}>
            선택된 기간: {reviewPeriod.startDate.toLocaleDateString()} ~{' '}
            {reviewPeriod.endDate.toLocaleDateString()}
          </p>
        )}
      </form>
    )
  },
}

/**
 * FormDateRangePicker 유효성 검증 예시
 */
export const FormDateRangePickerValidation: Story = {
  render: () => {
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<{
      reviewPeriod: DateRange
      decisionPeriod: DateRange
    }>({
      defaultValues: {
        reviewPeriod: { startDate: null, endDate: null },
        decisionPeriod: { startDate: null, endDate: null },
      },
      mode: 'onChange',
    })

    const onSubmit = (data: { reviewPeriod: DateRange; decisionPeriod: DateRange }) => {
      alert(
        `심의 기간: ${data.reviewPeriod.startDate?.toLocaleDateString()} ~ ${data.reviewPeriod.endDate?.toLocaleDateString()}\n결정 기간: ${data.decisionPeriod.startDate?.toLocaleDateString()} ~ ${data.decisionPeriod.endDate?.toLocaleDateString()}`,
      )
    }

    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ width: '500px', display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <FormDateRangePicker
          name='reviewPeriod'
          control={control}
          label='심의 기간'
          required
          rules={{
            validate: value =>
              value.startDate && value.endDate ? true : '심의 기간을 선택해주세요',
          }}
          placeholder='심의 기간을 선택하세요'
        />
        <FormDateRangePicker
          name='decisionPeriod'
          control={control}
          label='결정 기간'
          required
          rules={{
            validate: value =>
              value.startDate && value.endDate ? true : '결정 기간을 선택해주세요',
          }}
          placeholder='결정 기간을 선택하세요'
        />
        <button
          type='submit'
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
          }}
        >
          제출
        </button>
        <div style={{ fontSize: '0.875rem', color: '#ef4444' }}>
          {errors.reviewPeriod && <p>• {errors.reviewPeriod.message}</p>}
          {errors.decisionPeriod && <p>• {errors.decisionPeriod.message}</p>}
        </div>
      </form>
    )
  },
}

/**
 * 날짜 순서 자동 보정 테스트
 * endDate를 먼저 선택해도 startDate < endDate가 되도록 자동 보정
 */
export const AutoCorrectDateOrder: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange>({ startDate: null, endDate: null })
    return (
      <div style={{ width: '400px' }}>
        <DateRangePicker
          label='기간 (endDate 먼저 선택해도 자동 보정)'
          value={range}
          onChange={setRange}
          placeholder='먼저 나중 날짜를 선택해보세요'
        />
        {range.startDate && range.endDate && (
          <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
            선택된 범위: {range.startDate.toLocaleDateString()} ~{' '}
            {range.endDate.toLocaleDateString()}
          </div>
        )}
      </div>
    )
  },
}

/**
 * 다양한 상태 비교
 */
export const AllStates: Story = {
  render: () => {
    const [range1, setRange1] = useState<DateRange>({ startDate: null, endDate: null })
    const [range2, setRange2] = useState<DateRange>({
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })
    const [range3, setRange3] = useState<DateRange>({ startDate: null, endDate: null })

    return (
      <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <DateRangePicker label='기본 상태' value={range1} onChange={setRange1} />
        <DateRangePicker label='날짜 범위 선택됨' value={range2} onChange={setRange2} />
        <DateRangePicker
          label='에러 상태'
          value={range3}
          onChange={setRange3}
          error='날짜 범위를 선택해주세요'
        />
        <DateRangePicker label='비활성화' value={range2} onChange={setRange2} disabled />
      </div>
    )
  },
}

/**
 * 실제 사용 예제 - 기간 검색
 */
export const RealWorldExample: Story = {
  render: () => {
    const [searchPeriod, setSearchPeriod] = useState<DateRange>({
      startDate: null,
      endDate: null,
    })
    const [reviewPeriod, setReviewPeriod] = useState<DateRange>({
      startDate: null,
      endDate: null,
    })

    return (
      <div
        style={{
          width: '500px',
          padding: '2rem',
          border: '1px solid #e5e7eb',
          borderRadius: '0.5rem',
        }}
      >
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '600' }}>
          토지보상 심의 기간 검색
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <DateRangePicker
            label='검색 기간'
            required
            value={searchPeriod}
            onChange={setSearchPeriod}
            placeholder='검색할 기간을 선택하세요'
          />
          <DateRangePicker
            label='심의 기간'
            value={reviewPeriod}
            onChange={setReviewPeriod}
            placeholder='심의 기간을 선택하세요 (선택사항)'
          />
          <button
            type='button'
            onClick={() => {
              if (searchPeriod.startDate && searchPeriod.endDate) {
                alert(
                  `검색 기간: ${searchPeriod.startDate.toLocaleDateString()} ~ ${searchPeriod.endDate.toLocaleDateString()}`,
                )
              }
            }}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
            }}
          >
            검색
          </button>
        </div>
      </div>
    )
  },
}

/**
 * hover 하이라이트 테스트
 * startDate 선택 후 마우스를 움직이면 임시 범위가 표시됩니다
 */
export const HoverHighlight: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange>({ startDate: null, endDate: null })
    return (
      <div style={{ width: '400px' }}>
        <DateRangePicker
          label='기간 (startDate 선택 후 hover로 범위 미리보기)'
          value={range}
          onChange={setRange}
          placeholder='시작 날짜를 선택한 후 마우스를 움직여보세요'
        />
      </div>
    )
  },
}
