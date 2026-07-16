import type { Meta, StoryObj } from '@storybook/react'

import { textCombinations } from '@/styles'

/**
 * 디자인 토큰 문서 — CSS 변수(globals.css :root)를 직접 렌더한다(ADR-0007).
 * TS 사본이 아닌 실물을 보여주므로 이 문서는 구조적으로 drift할 수 없다.
 */
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
        <h2 className={`${textCombinations.h3} mb-4`}>핵심 색상 (CSS 변수)</h2>
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
              style={{ boxShadow: 'var(--shadow-base)' }}
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
        <h2 className={`${textCombinations.h3} mb-4`}>시맨틱 상태 색</h2>
        <div className='flex flex-wrap gap-3'>
          {['success', 'warning', 'error', 'info'].map(name => (
            <div
              key={name}
              className='px-4 py-2 rounded text-sm'
              style={{
                backgroundColor: `var(--${name})`,
                color: `var(--${name}-foreground)`,
              }}
            >
              --{name}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className={`${textCombinations.h3} mb-4`}>섀도우 (CSS 변수)</h2>
        <div className='flex flex-wrap gap-6'>
          {['--shadow-sm', '--shadow-base', '--shadow-md', '--shadow-lg', '--shadow-xl'].map(
            name => (
              <div
                key={name}
                className='w-32 h-16 rounded flex items-center justify-center text-xs font-mono'
                style={{ boxShadow: `var(${name})`, backgroundColor: 'var(--card)' }}
              >
                {name}
              </div>
            ),
          )}
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
      <h2 className={`${textCombinations.h3} mb-2`}>타입 스케일</h2>
      {(
        [
          { key: 'h1', label: 'H1 — 30px / 700' },
          { key: 'h2', label: 'H2 — 24px / 600' },
          { key: 'h3', label: 'H3 — 20px / 600' },
          { key: 'h4', label: 'H4 — 18px / 600' },
          { key: 'bodyLg', label: 'Body LG — 16px / 400' },
          { key: 'body', label: 'Body — 16px / 400' },
          { key: 'bodySm', label: 'Body SM — 14px / 400' },
          { key: 'bodyXs', label: 'Body XS — 12px / 400' },
          { key: 'label', label: 'Label — 14px / 500' },
          { key: 'labelSm', label: 'Label SM — 12px / 500' },
        ] as { key: keyof typeof textCombinations; label: string }[]
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
          <span className={textCombinations[key]}>{label}</span>
        </div>
      ))}
    </div>
  ),
}

// ============================================================================
// Spacing
// ============================================================================

/** 8px 시맨틱 스케일 — 문서용 예시 값(소스는 Tailwind 기본 스페이싱) */
const spacingExamples = [
  { name: 'space-1', value: '4px' },
  { name: 'space-2', value: '8px' },
  { name: 'space-3', value: '12px' },
  { name: 'space-4', value: '16px' },
  { name: 'space-6', value: '24px' },
  { name: 'space-8', value: '32px' },
  { name: 'space-12', value: '48px' },
  { name: 'space-16', value: '64px' },
] as const

export const Spacing: Story = {
  render: () => (
    <div className='p-8 flex flex-col gap-8'>
      <section>
        <h2 className={`${textCombinations.h3} mb-4`}>8px 시맨틱 스케일</h2>
        <div className='flex flex-col gap-3'>
          {spacingExamples.map(({ name, value }) => (
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
        <h2 className={`${textCombinations.h3} mb-4`}>보더 반경</h2>
        <div className='flex flex-wrap gap-6'>
          {[
            { label: '--radius-sm', value: 'var(--radius-sm)', desc: '8px — 배지, 태그' },
            { label: '--radius', value: 'var(--radius)', desc: '14px — 버튼, 입력' },
            { label: '--radius-md', value: 'var(--radius-md)', desc: '16px — 중형 카드' },
            { label: '--radius-lg', value: 'var(--radius-lg)', desc: '20px — 대형 카드, 모달' },
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
