# 요구사항

아래 조건을 모두 적용하고, 커서 룰(특히 `common-component-rule.mdc`)을 준수하여 구현할 것.  
작업 종료 후 **공통 컴포넌트 룰 적용 결과를 체크리스트**로 반환할 것.

# 목적

사용자 작업 흐름을 중단시키고 중요한 결정을 요구하는 **AlertDialog**.  
접근성(포커스 트랩, Esc·Tab 순환, ARIA `alertdialog` 등)은 **@radix-ui/react-alert-dialog** 기반으로 구현한다.

# 컴포넌트 경로

`src/components/common/AlertDialog`

# 핵심 요구사항

Overlay, Content, Title/Description만 별도 파일로 나누고, index.ts에서 배럴 export를 유지하세요. 그래도 API는 동일하게 얇게 유지 해야 한다.

## 1. Primitive — `AlertDialog.tsx`

Radix **compound component** 패턴을 유지한다. 아래 서브컴포넌트를 export한다.

- `AlertDialogRoot` (또는 네이밍 일관되게 `AlertDialog` 네임스페이스/객체로 묶어도 됨) — Radix `Root`
- `AlertDialogTrigger` — `Trigger`
- `AlertDialogPortal` — `Portal` (Portal·Overlay·Content를 조합할 때 **분리된 컴포넌트로 노출**)
- `AlertDialogOverlay` — `Overlay`
- `AlertDialogContent` — `Content`
- `AlertDialogTitle` — `Title`
- `AlertDialogDescription` — `Description`
- `AlertDialogAction` — `Action`
- `AlertDialogCancel` — `Cancel`

요구사항:

- 각 서브컴포넌트는 **단일 책임(SRP)**: Radix primitive에 스타일·필요한 기본 a11y 속성만 얹는 thin wrapper.
- **과도한 추상화 금지**. Radix 동작을 가리지 말 것 (`open`/`onOpenChange` 등은 Root에 그대로 전달 가능).
- **variant / size / disabled** (공통 룰 일관): Primitive 레벨에서는 Trigger·Action·Cancel 등 버튼류에 `size?: 'sm' | 'md' | 'lg'`, `variant`·`disabled`를 일관되게 지원할지 여부를 타입에 명시하고, 최소한 **SimpleAlertDialog**에서는 `size`·주요 버튼 `variant`(예: 확인 destructive)를 지원.

권장 사용 구조 예시:

```tsx
<AlertDialogRoot open={open} onOpenChange={setOpen}>
  <AlertDialogTrigger asChild>
    <Button>열기</Button>
  </AlertDialogTrigger>
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogContent>
      <AlertDialogTitle>제목</AlertDialogTitle>
      <AlertDialogDescription>설명</AlertDialogDescription>
      <AlertDialogCancel>취소</AlertDialogCancel>
      <AlertDialogAction>확인</AlertDialogAction>
    </AlertDialogContent>
  </AlertDialogPortal>
</AlertDialogRoot>
```

---

## 2. 편의용 Wrapper — `SimpleAlertDialog.tsx`

low-level 조합 없이 자주 쓰는 패턴을 한 컴포넌트로 제공한다.

**권장 props (구체화):**

- `open` : 제어 모드 열림 여부
- `onOpenChange` : `(open: boolean) => void`
- `title` : 필수. 제목 (Title)
- `description?` : 설명 (Description, 없으면 생략 가능하나 a11y상 본문이 짧을 때는 권장)
- `confirmLabel` : 확인 버튼 텍스트 @default `'확인'`
- `cancelLabel` : 취소 버튼 텍스트 @default `'취소'`
- `onConfirm` : 확인 클릭 시 (다이얼로그 닫기 전/후 동작은 문서화)
- `onCancel?` : 취소 시 (선택)
- `confirmDisabled?` | 확인 버튼 비활성화
- `size?` : 'sm' | 'md' | 'lg' (기본 : 'md')
- `confirmVariant?` : 확인 버튼 시각적 강조(예: destructive) — 디자인 토큰 기반

- 내부적으로는 위 Primitive들만 조합한다.
- **AlertDialogCancel**은 Radix 권장대로 사용하여 Esc/취소 시 포커스 복귀 등 동작을 유지한다.

---

## 3. Storybook — `AlertDialog.stories.tsx`

- `title`: `'Common/AlertDialog'`
- `tags: ['autodocs']`
- **Primitive 조합** 스토리 1개 이상, **SimpleAlertDialog** 스토리 1개 이상 (열기 트리거 + 확인/취소).
- `argTypes`로 주요 텍스트·variant 등 조절 가능하게.

---

## 4. 테스트 — `AlertDialog.test.tsx`

- 예: SimpleAlertDialog 열림 상태에서 **확인/취소** 역할 버튼 노출, **확인 클릭 시 `onConfirm` 호출**, **취소 클릭 시 닫힘/onCancel** 등 사용자 관점 동작.
- Radix 포커스 트랩 전체 검증은 선택; 최소한 다이얼로그가 `alertdialog` 역할로 인식되는지 등 핵심 a11y 한두 건 권장.

---

# 완료 시 산출물

작업 종료 후 공통 컴포넌트 룰(common-component-rule.mdc) 적용 결과를 체크리스트로 반환할 것.
