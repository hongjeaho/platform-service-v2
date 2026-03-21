# 요구사항

아래의 조건을 모두 적용하여, 커서 룰을 준수하고 요구사항을 모두 구현할 것.
작업이 끝나면 해당 rules 적용 결과를 체크리스트로 반환할 것.

# 컴포넌트 경로

`src/components/common/AttachmentGroup`

# 설계 원칙 (중요)

- 디자인 시스템 기반 UI를 기본으로 제공한다.
- 모범 사례를 기준으로 UI/UX 컴포넌트 설계 해야 한다.
- 한 화면에 10개 이상의 첨부파일 필드가 혼재하는 상황을 기본 사용 시나리오로 설계한다.
- 공간 효율과 상태 가독성을 최우선으로 한다.

# 핵심 요구사항

10개 이상의 첨부파일 필드(싱글+멀티 혼재)를 한 화면에서 효율적으로 제공하기 위한 통합 첨부파일 섹션 컴포넌트를 구현한다.
이 컴포넌트는 업로드(API 호출)를 수행하지 않는다.

파일 업로드는 상위 컴포넌트에서 처리하며, `AttachmentGroup`과 `AttachmentRow`는 파일 선택 및 상태 관리만 담당한다.

## 컴포넌트 구성

두 개의 컴포넌트로 구성한다. 기존 `FileUpload` / `MultiFileUpload`는 변경하면 안된다.

---

### AttachmentGroup — 섹션 컨테이너

`AttachmentRow` 들을 테이블 형태의 섹션으로 묶어주는 순수 레이아웃 컴포넌트다.

```
┌─ 첨부서류 ──────────────────────────────────────────────────┐
│ [AttachmentRow]                                             │
│ [AttachmentRow]                                             │
│ [AttachmentRow]                                             │
└─────────────────────────────────────────────────────────────┘
```

- `label` prop이 있으면 섹션 헤더(`<h3>`)로 렌더링
- `disabled` prop이 있으면 React Context로 모든 자식 `AttachmentRow`에 전파
- `children`으로 `AttachmentRow`를 받는다

---

### AttachmentRow — 행 단위 파일 업로드

3컬럼 그리드 레이아웃의 단일 행으로, 싱글/멀티 파일 선택 기능을 모두 제공한다.

#### 레이아웃 구조

```
grid-template-columns: 160px 120px 1fr

│ 라벨(160px)   │ 버튼(120px)      │ 상태(1fr)               │
```

#### 전체 화면 예시

```
┌─ 첨부서류 ──────────────────────────────────────────────────┐
│ 라벨           │ 버튼             │ 상태                    │
├────────────────┼──────────────────┼─────────────────────────┤
│ 주민등록증 *   │ [📎 파일 선택]   │ 파일을 선택하세요        │
│ 사업자등록증   │ [✏️ 교체]        │ 📄 사업자.pdf  1.2MB [×]│
│ 관련 서류      │ [📂 파일 추가]   │ 📂 3개 첨부됨       [▲] │  ← 기본 펼침
│                │                  │   📄 계약서.pdf 1.2MB[×]│
│                │                  │   📄 첨부1.docx 456KB[×]│
│                │                  │   📄 첨부2.png  3.4MB[×]│
│ 재무제표       │ [📂 파일 추가]   │ 파일을 선택하세요        │
│ 인감증명서 *   │ [📎 파일 선택]   │ 파일을 선택하세요        │
│                │                  │ ⚠ 파일을 선택해 주세요. │
└─────────────────────────────────────────────────────────────┘
```

#### 버튼 라벨·아이콘 규칙

싱글과 멀티는 버튼 아이콘으로 시각적으로 구분한다. 버튼 텍스트는 개행되지 않아야 한다(`white-space: nowrap`).

| 조건                           | 아이콘        | 버튼 텍스트 | 스타일              |
| ------------------------------ | ------------- | ----------- | ------------------- |
| `multiple=false`, 파일 미선택  | 📎 Paperclip  | `파일 선택` | primary             |
| `multiple=false`, 파일 선택됨  | ✏️ Pencil     | `교체`      | secondary (outline) |
| `multiple=true`, 모든 상태     | 📂 FolderOpen | `파일 추가` | primary             |
| `multiple=true`, maxFiles 도달 | 📂 FolderOpen | `파일 추가` | disabled            |

#### 상태 영역 렌더링 규칙

| 조건                                | 렌더링                               |
| ----------------------------------- | ------------------------------------ |
| `multiple=false`, 파일 미선택       | `"파일을 선택하세요"` (muted 텍스트) |
| `multiple=false`, 파일 선택됨       | `📄 파일명  크기  [×]`               |
| `multiple=true`, 파일 미선택        | `"파일을 선택하세요"` (muted 텍스트) |
| `multiple=true`, 파일 선택됨 (펼침) | `📂 N개 첨부됨  [▲]` + 파일 목록     |
| `multiple=true`, 파일 선택됨 (접힘) | `📂 N개 첨부됨  [▼]`                 |

- 멀티 행의 파일 목록은 기본 **펼침** 상태 (파일 추가 즉시 목록이 보여야 함)
- `[▲]` 토글 버튼 클릭 시 접힘, `[▼]` 클릭 시 펼침
- 파일 목록은 상태 열 안에 위치하여 라벨·버튼 열과 정렬 유지
- 각 파일 행: `📄 파일명  크기  [×]`

#### 주요 기능

- 클릭 또는 Drag & Drop으로 파일을 선택할 수 있어야 한다
- `multiple=false` : 단일 파일 선택 (파일 선택 시 교체)
- `multiple=true` : 복수 파일 누적 선택 (`maxFiles` 도달 시 추가 불가)
- 각 파일은 개별적으로 삭제할 수 있어야 한다
- Drag & Drop은 각 행의 상태 영역이 드롭 대상이 된다

# 필드 UI (라벨·에러)

- **label**: string — `<label htmlFor={inputId}>`로 렌더링 (라벨 열에 표시).
- **error**: string — 있으면 상태 열 하단에 `<span role="alert">`로 에러 메시지 표시, input에 에러 스타일 및 `aria-invalid`, `aria-describedby` 연결.
- **required**: boolean — `true`이면 라벨 옆에 ` *` 표시.

# React Hook Form (RHF) 연동

- **비제어**: `value`를 넘기지 않으면 비제어로 동작. `{...register('name')}`와 호환.
- **사용 패턴**: `{...register('fieldName', { required: '메시지' })}` 스프레드 후 `error={errors.fieldName?.message}` 전달.
- **onChange**: 네이티브 `onChange` 지원으로 RHF `register()`와 호환. 추가로 `onFilesChange?: (files: File[]) => void` 제공(간단 setState 패턴용).

```tsx
// 사용 예시
<AttachmentGroup label='첨부서류'>
  <AttachmentRow
    label='주민등록증'
    required
    {...register('idCard', { required: '주민등록증을 첨부해 주세요.' })}
    error={errors.idCard?.message}
  />
  <AttachmentRow
    label='관련 서류'
    multiple
    maxFiles={5}
    accept='.pdf,.docx'
    {...register('documents')}
    error={errors.documents?.message}
  />
</AttachmentGroup>
```

# 완료 시 산출물

작업 종료 후 공통 컴포넌트 룰(common-component-rule.mdc) 적용 결과를 체크리스트로 반환할 것.
