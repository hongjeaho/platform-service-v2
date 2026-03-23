export const customFormDataFn = <Body extends Record<string, any>>(body: Body): FormData => {
  const formData = new FormData()

  if (!body || typeof body !== 'object') {
    return formData
  }

  Object.entries(body).forEach(([key, value]) => {
    // null 또는 undefined 값은 건너뛰기
    if (value === null || value === undefined) {
      return
    }

    if (value instanceof File) {
      formData.append(key, value)
    } else if (value instanceof Blob) {
      formData.append(key, value)
    } else if (Array.isArray(value)) {
      // 빈 배열은 건너뛰기
      if (value.length === 0) {
        return
      }

      const hasFileOrBlob = value.some(item => item instanceof File || item instanceof Blob)

      if (hasFileOrBlob) {
        // 파일/Blob이 포함된 배열: 각각 개별 추가
        value.forEach((item, index) => {
          if (item instanceof File || item instanceof Blob) {
            formData.append(key, item)
          } else if (item !== null && item !== undefined) {
            // 파일이 아닌 값들은 application/json Content-Type으로 JSON 변환
            const jsonBlob = new Blob([JSON.stringify(item)], { type: 'application/json' })
            formData.append(`${key}[${index}]`, jsonBlob)
          }
        })
      } else {
        // 일반 배열: application/json Content-Type으로 JSON 직렬화
        try {
          const jsonBlob = new Blob([JSON.stringify(value)], { type: 'application/json' })
          formData.append(key, jsonBlob)
        } catch (error) {
          console.warn(`Failed to serialize array for key "${key}":`, error)
          // 실패 시 각 요소를 개별적으로 추가
          value.forEach((item, index) => {
            if (item !== null && item !== undefined) {
              formData.append(`${key}[${index}]`, String(item))
            }
          })
        }
      }
    } else if (typeof value === 'object') {
      // 객체: application/json Content-Type으로 JSON 직렬화
      try {
        const jsonBlob = new Blob([JSON.stringify(value)], { type: 'application/json' })
        formData.append(key, jsonBlob)
      } catch (error) {
        console.warn(`Failed to serialize object for key "${key}":`, error)
        formData.append(key, String(value))
      }
    } else {
      // 원시 타입: 문자열로 변환
      formData.append(key, String(value))
    }
  })

  return formData
}
