import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'

import { DatePicker } from './DatePicker'
import { DateRangePicker } from './DateRangePicker'
import type { DateRangeValue } from './DatePicker.types'

const dateMeta = {
  title: 'Components/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DatePicker>

export default dateMeta
type DateStory = StoryObj<typeof dateMeta>

/**
 * 기본 DatePicker
 */
export const Default: DateStory = {
  args: {
    placeholder: '날짜 선택',
    label: '날짜',
    name: 'date-default',
  },
}

/**
 * 라벨이 없는 DatePicker
 */
export const WithoutLabel: DateStory = {
  args: {
    placeholder: '날짜 선택',
    name: 'date-no-label',
  },
}

/**
 * 필수 필드 표시
 */
export const Required: DateStory = {
  args: {
    placeholder: '날짜 선택',
    label: '필수 날짜',
    required: true,
    name: 'date-required',
  },
}

/**
 * 값이 선택된 상태
 */
export const WithValue: DateStory = {
  args: {
    placeholder: '날짜 선택',
    label: '날짜',
    value: new Date(2024, 0, 15),
    name: 'date-value',
  },
}

/**
 * 날짜 범위 제한
 */
export const WithDateRange: DateStory = {
  args: {
    placeholder: '날짜 선택',
    label: '날짜',
    minDate: new Date(2024, 0, 1),
    maxDate: new Date(2024, 11, 31),
    name: 'date-range',
  },
}

/**
 * 비활성화 상태
 */
export const Disabled: DateStory = {
  args: {
    placeholder: '날짜 선택',
    label: '비활성화된 날짜',
    disabled: true,
    name: 'date-disabled',
  },
}

/**
 * 에러 상태
 */
export const WithError: DateStory = {
  args: {
    placeholder: '날짜 선택',
    label: '날짜',
    error: '유효한 날짜를 선택해주세요',
    name: 'date-error',
  },
}

/**
 * 대화형 DatePicker (상태 관리)
 */
export const Interactive: DateStory = {
  render: (args) => {
    const [date, setDate] = useState<Date | undefined>()

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <DatePicker {...args} value={date} onChange={setDate} />
        {date && <p>선택된 날짜: {date.toLocaleDateString('ko-KR')}</p>}
      </div>
    )
  },
  args: {
    placeholder: '날짜 선택',
    label: '날짜',
    name: 'date-interactive',
  },
}

/**
 * DateRangePicker - 기본
 */
export const RangePickerDefault: StoryObj = {
  component: DateRangePicker,
  args: {
    placeholder: '날짜 범위 선택',
    label: '날짜 범위',
    name: 'date-range-default',
  },
}

/**
 * DateRangePicker - 필수 필드
 */
export const RangePickerRequired: StoryObj = {
  component: DateRangePicker,
  args: {
    placeholder: '날짜 범위 선택',
    label: '필수 날짜 범위',
    required: true,
    name: 'date-range-required',
  },
}

/**
 * DateRangePicker - 값이 선택된 상태
 */
export const RangePickerWithValue: StoryObj = {
  component: DateRangePicker,
  args: {
    placeholder: '날짜 범위 선택',
    label: '날짜 범위',
    value: {
      from: new Date(2024, 0, 1),
      to: new Date(2024, 0, 31),
    },
    name: 'date-range-value',
  },
}

/**
 * DateRangePicker - 비활성화
 */
export const RangePickerDisabled: StoryObj = {
  component: DateRangePicker,
  args: {
    placeholder: '날짜 범위 선택',
    label: '비활성화된 날짜 범위',
    disabled: true,
    name: 'date-range-disabled',
  },
}

/**
 * DateRangePicker - 에러
 */
export const RangePickerWithError: StoryObj = {
  component: DateRangePicker,
  args: {
    placeholder: '날짜 범위 선택',
    label: '날짜 범위',
    error: '유효한 날짜 범위를 선택해주세요',
    name: 'date-range-error',
  },
}

/**
 * DateRangePicker - 대화형 (상태 관리)
 */
export const RangePickerInteractive: StoryObj = {
  component: DateRangePicker,
  render: (args) => {
    const [range, setRange] = useState<DateRangeValue | undefined>()

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <DateRangePicker {...args} value={range} onChange={setRange} />
        {(range?.from || range?.to) && (
          <p>
            선택된 범위: {range?.from?.toLocaleDateString('ko-KR')} ~{' '}
            {range?.to?.toLocaleDateString('ko-KR')}
          </p>
        )}
      </div>
    )
  },
  args: {
    placeholder: '날짜 범위 선택',
    label: '날짜 범위',
    name: 'date-range-interactive',
  },
}

/**
 * DateRangePicker - 날짜 범위 제한
 */
export const RangePickerWithDateRange: StoryObj = {
  component: DateRangePicker,
  args: {
    placeholder: '날짜 범위 선택',
    label: '날짜 범위',
    minDate: new Date(2024, 0, 1),
    maxDate: new Date(2024, 11, 31),
    name: 'date-range-limits',
  },
}
