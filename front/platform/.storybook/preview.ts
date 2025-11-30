import type { Preview } from '@storybook/react'
import React from 'react'

// 글로벌 CSS (TailwindCSS + 디자인 토큰)
import '../src/index.css'

const preview: Preview = {
  parameters: {
    // Controls 설정
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      sort: 'alpha',
    },

    // Actions (자동 이벤트 핸들러 감지)
    actions: {
      argTypesRegex: '^on[A-Z].*',
    },

    // Backgrounds
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: 'oklch(0.98 0 0)' },
        { name: 'dark', value: 'oklch(0.145 0 0)' },
        { name: 'gray', value: 'oklch(0.95 0.005 240)' },
      ],
    },

    // Layout
    layout: 'centered',

    // Viewport (반응형 테스트)
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '667px' },
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1440px', height: '900px' },
        },
      },
    },

    // 접근성 (WCAG AA 기준)
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'label', enabled: true },
        ],
      },
    },
  },

  // 글로벌 데코레이터
  // Pretendard 폰트는 index.css에서 이미 글로벌로 적용되므로 데코레이터 제거
  // decorators: [
  //   (Story) => (
  //     <div
  //       style={{
  //         fontFamily:
  //           "'Pretendard Variable', -apple-system, sans-serif",
  //         WebkitFontSmoothing: 'antialiased',
  //         MozOsxFontSmoothing: 'grayscale',
  //       }}
  //     >
  //       <Story />
  //     </div>
  //   ),
  // ],

  // 자동 문서 생성
  tags: ['autodocs'],
}

export default preview
