import { type HooksOptions, type OutputOptions } from 'orval'

export const commonOutputConfig: OutputOptions = {
  mode: 'tags-split',
  target: '../src/api/generated/hooks',
  schemas: '../src/api/generated/model',
  client: 'react-query',
  httpClient: 'axios',
  clean: true,
  mock: false,
  allParamsOptional: true,
  urlEncodeParameters: true,
  // 성능 최적화 설정
  override: {
    mutator: {
      path: '../src/api/request.ts',
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
