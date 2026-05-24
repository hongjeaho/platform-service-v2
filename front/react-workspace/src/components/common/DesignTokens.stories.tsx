import type { Meta, StoryObj } from '@storybook/react'

import {
  buttonVariants,
  shadowValues,
  spacingScaleV2,
  statusChipVariants,
  textCombinationsV2,
} from '@/styles'

const meta: Meta = {
  title: 'Design System/Tokens',
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj

// ============================================================================
// Color
// ============================================================================

export const Color: Story = {
  render: () => (
    <div className='p-8 flex flex-col gap-10'>
      <section>
        <h2 className={`${textCombinationsV2.headlineSm} mb-4`}>핵심 색상 (CSS 변수)</h2>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
          {[
            { label: '--primary', css: 'var(--primary)', text: 'var(--primary-foreground)' },
            { label: '--accent', css: 'var(--accent)', text: 'var(--accent-foreground)' },
            { label: '--background', css: 'var(--background)', text: 'var(--foreground)' },
            { label: '--card', css: 'var(--card)', text: 'var(--foreground)' },
            { label: '--muted', css: 'var(--muted)', text: 'var(--muted-foreground)' },
            { label: '--destructive', css: 'var(--destructive)', text: 'white' },
            { label: '--sidebar', css: 'var(--sidebar)', text: 'var(--sidebar-foreground)' },
            {
              label: '--surface-container-highest',
              css: 'var(--surface-container-highest)',
              text: 'var(--foreground)',
            },
          ].map(({ label, css, text }) => (
            <div
              key={label}
              className='flex flex-col overflow-hidden rounded'
              style={{ boxShadow: shadowValues.card }}
            >
              <div
                className='h-16 flex items-center justify-center text-xs font-mono px-2'
                style={{ backgroundColor: css, color: text }}
              >
                {label}
              </div>
              <div
                className='px-2 py-1 text-xs font-mono'
                style={{ backgroundColor: 'var(--card)', color: 'var(--muted-foreground)' }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className={`${textCombinationsV2.headlineSm} mb-4`}>버튼 Variants</h2>
        <div className='flex flex-wrap gap-3'>
          {(Object.keys(buttonVariants) as Array<keyof typeof buttonVariants>).map(variant => (
            <button
              key={variant}
              className={`px-4 py-2 rounded text-sm ${buttonVariants[variant]}`}
            >
              {variant}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className={`${textCombinationsV2.headlineSm} mb-4`}>상태 칩 (Status Chip)</h2>
        <div className='flex flex-wrap gap-3'>
          {(Object.keys(statusChipVariants) as Array<keyof typeof statusChipVariants>).map(
            status => (
              <span
                key={status}
                className={`px-3 py-1 text-sm ${statusChipVariants[status]}`}
                style={{ borderRadius: '9999px' }}
              >
                {status}
              </span>
            ),
          )}
        </div>
      </section>

      <section>
        <h2 className={`${textCombinationsV2.headlineSm} mb-4`}>섀도우</h2>
        <div className='flex flex-wrap gap-6'>
          {(Object.entries(shadowValues) as [string, string][]).map(([name, value]) => (
            <div
              key={name}
              className='w-32 h-16 rounded flex items-center justify-center text-xs font-mono'
              style={{ boxShadow: value, backgroundColor: 'var(--card)' }}
            >
              {name}
            </div>
          ))}
        </div>
      </section>
    </div>
  ),
}

// ============================================================================
// Typography
// ============================================================================

export const Typography: Story = {
  render: () => (
    <div className='p-8 flex flex-col gap-6'>
      <h2 className={`${textCombinationsV2.headlineSm} mb-2`}>타입 스케일 (8단계)</h2>
      {(
        [
          { key: 'displayLg', label: 'Display LG — 48px / 700' },
          { key: 'headlineLg', label: 'Headline LG — 32px / 700' },
          { key: 'headlineMd', label: 'Headline MD — 24px / 600' },
          { key: 'headlineSm', label: 'Headline SM — 20px / 600' },
          { key: 'bodyLg', label: 'Body LG — 18px / 400' },
          { key: 'bodyMd', label: 'Body MD — 16px / 400' },
          { key: 'bodySm', label: 'Body SM — 14px / 400' },
          { key: 'labelLg', label: 'Label LG — 14px / 600' },
          { key: 'labelMd', label: 'Label MD — 12px / 500' },
        ] as { key: keyof typeof textCombinationsV2; label: string }[]
      ).map(({ key, label }) => (
        <div
          key={key}
          className='flex items-baseline gap-4 border-b pb-3'
          style={{ borderColor: 'var(--border)' }}
        >
          <span
            className='w-48 shrink-0 text-xs font-mono'
            style={{ color: 'var(--muted-foreground)' }}
          >
            {key}
          </span>
          <span className={textCombinationsV2[key]}>{label}</span>
        </div>
      ))}
    </div>
  ),
}

// ============================================================================
// Spacing
// ============================================================================

export const Spacing: Story = {
  render: () => (
    <div className='p-8 flex flex-col gap-8'>
      <section>
        <h2 className={`${textCombinationsV2.headlineSm} mb-4`}>8px 시맨틱 스케일</h2>
        <div className='flex flex-col gap-3'>
          {(Object.entries(spacingScaleV2) as [string, string][]).map(([name, value]) => (
            <div key={name} className='flex items-center gap-4'>
              <span
                className='w-24 shrink-0 text-xs font-mono text-right'
                style={{ color: 'var(--muted-foreground)' }}
              >
                {name}
              </span>
              <div
                className='h-6 rounded'
                style={{
                  width: value,
                  minWidth: '4px',
                  backgroundColor: 'var(--primary)',
                  opacity: 0.7,
                }}
              />
              <span className='text-xs font-mono' style={{ color: 'var(--muted-foreground)' }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className={`${textCombinationsV2.headlineSm} mb-4`}>보더 반경</h2>
        <div className='flex flex-wrap gap-6'>
          {[
            { label: '--radius-sm', value: 'var(--radius-sm)', desc: '4px — 배지, 태그' },
            { label: '--radius', value: 'var(--radius)', desc: '8px — 버튼, 입력, 카드' },
            { label: '--radius-md', value: 'var(--radius-md)', desc: '12px — 중형 카드' },
            { label: '--radius-lg', value: 'var(--radius-lg)', desc: '16px — 대형 카드, 모달' },
            { label: '--radius-xl', value: 'var(--radius-xl)', desc: '24px — 페이지 컨테이너' },
            { label: '--radius-full', value: '9999px', desc: '9999px — 상태 칩, pill' },
          ].map(({ label, value, desc }) => (
            <div key={label} className='flex flex-col items-center gap-2'>
              <div
                className='w-16 h-16 border-2'
                style={{
                  borderRadius: value,
                  borderColor: 'var(--primary)',
                  backgroundColor: 'var(--surface-container-low)',
                }}
              />
              <span
                className='text-xs font-mono text-center'
                style={{ color: 'var(--foreground)' }}
              >
                {label}
              </span>
              <span className='text-xs text-center' style={{ color: 'var(--muted-foreground)' }}>
                {desc}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  ),
}
