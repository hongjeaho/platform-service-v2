import { type HooksOptions, type OutputOptions } from 'orval'

export const commonOutputConfig: OutputOptions = {
  mode: 'tags-split',
  target: '../src/gen/hooks',
  schemas: '../src/gen/model',
  client: 'react-query',
  httpClient: 'axios',
  clean: true,
  prettier: true,
  mock: false,
  allParamsOptional: true,
  urlEncodeParameters: true,
  // 성능 최적화 설정
  biome: false, // prettier 사용 중이므로 비활성화
  override: {
    mutator: {
      path: '../src/utils/http/index.ts',
      name: 'request',
    },
    formData: {
      path: './orval.requestFormData.ts',
      name: 'customFormDataFn',
    },
    query: {
      useQuery: true,
      useMutation: true,
      queryOptions: {
        path: './custom.query.options.ts',
        name: 'customQueryOptionsFn',
      },
    },
  },
}

export const commonHooks: Partial<HooksOptions> = {
  afterAllFilesWrite: 'prettier --write',
}
