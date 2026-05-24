# 요구사항

아래의 조건을 모두 적용하여, 커서 룰을 준수하고 요구사항을 모두 구현할 것.  
작업이 끝나면 해당 rules 적용 결과를 체크리스트로 반환할 것.

# 컴포넌트 경로

`src/components/common/FileUpload`

# 설계 원칙 (중요)

- 디자인 시스템 기반 UI를 기본으로 제공한다.
- 모범 사례를 기준으로 UI/UX 컴포넌트 설계 해야 한다.

# 핵심 요구사항 (variant 시스템)

파일 선택 및 관리를 위한 공통 컴포넌트를 구현한다.
이 컴포넌트는 업로드(API 호출)를 수행하지 않는다.

파일 업로드는 상위 컴포넌트에서 처리하며, 파일 선택 및 상태 관리만 담당한다.

## 주요 기능

- 클릭 또는 Drag & Drop으로 파일을 선택할 수 있어야 한다.
- 싱글 컴포넌트(FileUpload), 멀티 컴포넌트(MultFileUpload) 각각 만들어야 한다.

### FileUpload : "파일 1개를 선택하는 인풋 필드" 느낌

- 선택전
  ┌──────────────────────────────────────────┐
  │ [📎 파일 선택] 파일을 선택하세요 … │
  └──────────────────────────────────────────┘
  - 1행 높이의 컴팩트한 입력 필드처럼 보임
  - 왼쪽에 [파일 선택] 버튼(primary variant), 오른쪽에 안내 텍스트
  - 드래그앤드롭도 지원 (전체 영역이 드롭 대상)

- 선택후
  ┌──────────────────────────────────────────┐
  │ 📄 document.pdf 1.2 MB [×] │
  └──────────────────────────────────────────┘
  - dropzone 자리에 파일 카드 1장이 인라인으로 표시
  - 파일 이름 + 크기 + 삭제 버튼만 있는 미니멀 카드
  - 다른 파일로 교체하려면 카드 영역 클릭 or 다시 드래그

### MultFileUpload : "여러 파일을 쌓는 영역" 느낌

┌──────────────────────────────────────────┐
│ ⬆ 파일 업로드 │  
 │ 클릭하거나 파일을 끌어다 놓으세요 │
│ 여러 파일을 선택할 수 있습니다 │
└──────────────────────────────────────────┘  
 📄 file1.pdf 1.2 MB [×]  
 📄 file2.docx 456 KB [×]  
 📄 file3.png 3.4 MB [×]

- 선택전
  - 파일을 추가해도 드롭존은 사라지지 않음 (계속 파일 추가 가능)
  - 드롭존 하단 우측에 총 파일 수 배지 표시
  - 파일 리스트는 드롭존 아래에 누적 표시
- 선택후
  - 파일을 추가해도 드롭존은 사라지지 않음 (계속 파일 추가 가능)
  - 드롭존 하단 우측에 총 파일 수 배지 표시
  - 파일 리스트는 드롭존 아래에 누적 표시

# 상태 관리

파일을 상태를 내부적으로 관리할 수 있어야 한다.

## FileUpload

| 시나리오       | 현재 상태  |
| -------------- | ---------- |
| 기존 파일 유지 | 'existing' |
| 기존 파일 삭제 | 'deleted'  |
| 기존 파일 변경 | 'replace'  |

## MultiFileUpload

| 시나리오       | 현재 상태  |
| -------------- | ---------- |
| 기존 파일 유지 | 'existing' |
| 기존 파일 삭제 | 'deleted'  |
| 새 파일 추가   | 'added'    |

# 필드 UI (라벨·에러)

- **label**: string — 있으면 `<label htmlFor={inputId}>`로 렌더링.
- **error**: string — 있으면 input 하단에 `<span role="alert">`로 에러 메시지 표시, input에 에러 스타일 및 `aria-invalid`, `aria-describedby` 연결.
- **required**: boolean — `true`이면 라벨 옆에 ` *` 표시.

# React Hook Form (RHF) 연동

- **비제어**: `value`를 넘기지 않으면 비제어로 동작. `{...register('name')}`와 호환.
- **사용 패턴**: `{...register('fieldName', { required: '메시지' })}` 스프레드 후 `error={errors.fieldName?.message}` 전달.
- **onChange**: 네이티브 `onChange` 지원으로 RHF `register()`와 호환. 추가로 `onValueChange?: (value: string) => void` 제공(간단 setState 패턴용).

# 완료 시 산출물

작업 종료 후 공통 컴포넌트 룰(common-component-rule.mdc) 적용 결과를 체크리스트로 반환할 것.

---

## Design Token Reference

- **아이콘**: `icons.attachment`, `icons.document`, `icons.close`, `iconSizes.sm` — `src/styles/icons.ts`
- **타이포**: `textCombinations.label` (라벨), `textCombinations.bodySm` (파일명·에러), `textCombinations.bodyXs` (파일 크기)
- **색상**: CSS Module 내 `var(--border)` (드롭존 테두리), `var(--primary)` (파일 선택 버튼), `var(--destructive)` (에러 상태), `var(--accent)` (드래그 오버 하이라이트)
- **스페이싱**: CSS Module 내 `var(--spacing-sm)` (드롭존 패딩), `var(--spacing-xs)` (아이콘-텍스트 gap), `var(--radius)` (드롭존 반경)
- 참고: `docs/design/components.md`, `docs/design/color.md`
