import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { DatePicker } from './DatePicker'

const meta = {
  title: 'Components/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    placeholder: '날짜를 선택하세요',
  },
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 기본 DatePicker - 날짜 선택 기능
 */
export const Default: Story = {
  render: () => {
    const [date, setDate] = useState<Date | null>(null)
    return (
      <div style={{ width: '300px' }}>
        <DatePicker value={date} onChange={setDate} />
      </div>
    )
  },
}

/**
 * 라벨이 있는 DatePicker
 */
export const WithLabel: Story = {
  render: () => {
    const [date, setDate] = useState<Date | null>(null)
    return (
      <div style={{ width: '300px' }}>
        <DatePicker
          label='신청일'
          value={date}
          onChange={setDate}
          placeholder='신청일을 선택하세요'
        />
      </div>
    )
  },
}

/**
 * 필수 입력 DatePicker
 */
export const Required: Story = {
  render: () => {
    const [date, setDate] = useState<Date | null>(null)
    return (
      <div style={{ width: '300px' }}>
        <DatePicker
          label='심의일'
          required
          value={date}
          onChange={setDate}
          placeholder='심의일을 선택하세요'
        />
      </div>
    )
  },
}

/**
 * 에러 상태 DatePicker
 */
export const WithError: Story = {
  render: () => {
    const [date, setDate] = useState<Date | null>(null)
    return (
      <div style={{ width: '300px' }}>
        <DatePicker label='신청일' value={date} onChange={setDate} error='날짜를 선택해주세요' />
      </div>
    )
  },
}

/**
 * 비활성화된 DatePicker
 */
export const Disabled: Story = {
  render: () => {
    const [date, setDate] = useState<Date | null>(new Date())
    return (
      <div style={{ width: '300px' }}>
        <DatePicker label='신청일' value={date} onChange={setDate} disabled />
      </div>
    )
  },
}

/**
 * 날짜가 선택된 DatePicker
 */
export const WithValue: Story = {
  render: () => {
    const [date, setDate] = useState<Date | null>(new Date(2024, 0, 15))
    return (
      <div style={{ width: '300px' }}>
        <DatePicker label='신청일' value={date} onChange={setDate} />
      </div>
    )
  },
}

/**
 * 최소/최대 날짜 제한 DatePicker
 */
export const WithMinMaxDate: Story = {
  render: () => {
    const [date, setDate] = useState<Date | null>(null)
    const today = new Date()
    const minDate = new Date(today)
    minDate.setMonth(today.getMonth() - 1)
    const maxDate = new Date(today)
    maxDate.setMonth(today.getMonth() + 1)

    return (
      <div style={{ width: '300px' }}>
        <DatePicker
          label='신청일'
          value={date}
          onChange={setDate}
          minDate={minDate}
          maxDate={maxDate}
          placeholder='지난 달부터 다음 달까지 선택 가능'
        />
      </div>
    )
  },
}

/**
 * React Hook Form 연동 예제
 */
export const WithReactHookForm: Story = {
  render: () => {
    interface FormData {
      applicationDate: Date | null
      reviewDate: Date | null
    }

    const {
      register,
      handleSubmit,
      setValue,
      watch,
      formState: { errors },
    } = useForm<FormData>({
      defaultValues: {
        applicationDate: null,
        reviewDate: null,
      },
    })

    const applicationDate = watch('applicationDate')
    const reviewDate = watch('reviewDate')

    const onSubmit = (data: FormData) => {
      alert(
        `신청일: ${data.applicationDate?.toLocaleDateString()}\n심의일: ${data.reviewDate?.toLocaleDateString()}`,
      )
    }

    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <DatePicker
          {...register('applicationDate', { required: '신청일을 선택해주세요' })}
          label='신청일'
          required
          value={applicationDate}
          onChange={date => setValue('applicationDate', date)}
          error={errors.applicationDate?.message}
        />
        <DatePicker
          {...register('reviewDate', { required: '심의일을 선택해주세요' })}
          label='심의일'
          required
          value={reviewDate}
          onChange={date => setValue('reviewDate', date)}
          error={errors.reviewDate?.message}
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
      </form>
    )
  },
}

/**
 * 여러 DatePicker 비교
 */
export const MultipleDatePickers: Story = {
  render: () => {
    const [date1, setDate1] = useState<Date | null>(null)
    const [date2, setDate2] = useState<Date | null>(null)
    const [date3, setDate3] = useState<Date | null>(null)

    return (
      <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <DatePicker
          label='시작일'
          value={date1}
          onChange={setDate1}
          placeholder='시작일을 선택하세요'
        />
        <DatePicker
          label='종료일'
          value={date2}
          onChange={setDate2}
          placeholder='종료일을 선택하세요'
        />
        <DatePicker
          label='심의일'
          value={date3}
          onChange={setDate3}
          placeholder='심의일을 선택하세요'
        />
      </div>
    )
  },
}

/**
 * 다양한 상태 비교
 */
export const AllStates: Story = {
  render: () => {
    const [date1, setDate1] = useState<Date | null>(null)
    const [date2, setDate2] = useState<Date | null>(new Date())
    const [date3, setDate3] = useState<Date | null>(null)

    return (
      <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <DatePicker label='기본 상태' value={date1} onChange={setDate1} />
        <DatePicker label='날짜 선택됨' value={date2} onChange={setDate2} />
        <DatePicker
          label='에러 상태'
          value={date3}
          onChange={setDate3}
          error='날짜를 선택해주세요'
        />
        <DatePicker label='비활성화' value={date2} onChange={setDate2} disabled />
      </div>
    )
  },
}

/**
 * 실제 사용 예제 - 토지보상 신청서
 */
export const RealWorldExample: Story = {
  render: () => {
    const [applicationDate, setApplicationDate] = useState<Date | null>(null)
    const [reviewDate, setReviewDate] = useState<Date | null>(null)
    const [decisionDate, setDecisionDate] = useState<Date | null>(null)

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
          토지보상 심의 신청서
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <DatePicker
            label='신청일'
            required
            value={applicationDate}
            onChange={setApplicationDate}
            placeholder='신청일을 선택하세요'
          />
          <DatePicker
            label='심의일'
            required
            value={reviewDate}
            onChange={setReviewDate}
            placeholder='심의일을 선택하세요'
          />
          <DatePicker
            label='결정일'
            value={decisionDate}
            onChange={setDecisionDate}
            placeholder='결정일을 선택하세요 (선택사항)'
          />
        </div>
      </div>
    )
  },
}
