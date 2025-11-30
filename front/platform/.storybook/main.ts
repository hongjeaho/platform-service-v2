import type { StorybookConfig } from '@storybook/react-vite'
import { mergeConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const config: StorybookConfig = {
  // 스토리 파일 위치
  stories: ['../src/**/*.stories.@(ts|tsx)'],

  // 애드온 (접근성 우선)
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y', // WCAG 준수 검사
    '@storybook/addon-interactions', // Interaction 테스트
  ],

  // React + Vite 프레임워크
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  // TypeScript 설정
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) => {
        // Private props 제외
        if (prop.name.startsWith('_')) return false
        // node_modules props 제외
        if (prop.parent) {
          return !prop.parent.fileName.includes('node_modules')
        }
        return true
      },
    },
  },

  // Vite 설정 커스터마이징
  async viteFinal(config) {
    return mergeConfig(config, {
      // TypeScript path aliases (@/*, @components/* 등)
      plugins: [tsconfigPaths()],

      // CSS Modules 설정 (프로젝트와 동일)
      css: {
        modules: {
          localsConvention: 'camelCase',
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },

      // 최적화
      optimizeDeps: {
        include: ['@storybook/react', 'react', 'react-dom', 'lucide-react'],
      },
    })
  },

  // 자동 문서 생성
  docs: {},

  // Static 파일 디렉토리
  staticDirs: ['../public'],
}

export default config
