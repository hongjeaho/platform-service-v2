당신은 **10년 이상의 경험을 가진 시니어 프론트엔드 아키텍트**이다. 
엔터프라이즈 규모의 React 프로젝트 아키텍처를 설계하고 초기 프로젝트 구조를 생성한다.

아래 내용을 검토하고 순서대로 작업을 진행 해야 한다.

---

## 1단계 — Vite 프로젝트 생성

현재 디렉토리에 바로 Vite 프로젝트를 생성해줘.

yarn create vite . --template react-ts

"." 을 쓰면 현재 디렉토리에 바로 생성됨.
덮어쓰기 확인 프롬프트가 뜨면 "Ignore files and continue" 선택.

생성 후 기본 의존성 설치:

yarn

---

## 2단계 — 추가 패키지 설치

yarn add react-router @tanstack/react-query @tanstack/react-query-devtools zustand axios
yarn add tailwindcss @tailwindcss/vite
yarn add -D babel-plugin-react-compiler@latest
yarn add -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
yarn add -D orval

> 참고:
> - React Router v7부터 react-router-dom은 deprecated. 모든 import는 "react-router" 단일 패키지에서.
> - React 19 사용 시 babel-plugin-react-compiler만 설치하면 되고, 추가 런타임 패키지는 불필요.

---

## 3단계 — 설정 파일 수정

### vite.config.ts 교체

React 19 Compiler를 적용한다.
공식 문서(react.dev/learn/react-compiler/installation) Vite 섹션에 따라
@vitejs/plugin-react의 babel 옵션에 babel-plugin-react-compiler를 추가한다.
컴파일러는 Babel 플러그인 파이프라인에서 반드시 첫 번째로 실행해야 한다.

import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
plugins: [
react({
babel: {
plugins: ["babel-plugin-react-compiler"], // React Compiler — 반드시 첫 번째
},
}),
tailwindcss(),
],
test: {
globals: true,
environment: "jsdom",
setupFiles: ["./src/test/setup.ts"],
css: true,
},
})

### tsconfig.app.json — compilerOptions에 추가

"types": ["vitest/globals", "@testing-library/jest-dom"]

### package.json scripts에 추가

"test": "vitest",
"test:ui": "vitest --ui",
"test:run": "vitest run",
"generate": "orval"

---

## 4단계 — 폴더 구조 생성

Vite가 만든 src/ 기본 파일은 유지하고, 아래 폴더와 파일들을 추가 생성해줘.

src/
├── api/
│   ├── client.ts
│   ├── services/
│   │   └── userService.ts
│   └── generated/               # Orval 자동 생성 폴더 (빈 폴더, .gitkeep)
├── app/
│   ├── router.tsx
│   ├── providers.tsx
│   └── queryClient.ts
├── components/
│   ├── common/
│   │   └── Button/
│   │       ├── Button.tsx
│   │       └── index.ts
│   └── layout/
│       └── Layout.tsx
├── features/
│   ├── home/
│   │   └── pages/
│   │       └── HomePage.tsx     ← 테스트 페이지 1
│   └── user/
│       ├── components/
│       ├── hooks/
│       │   └── useUsers.ts
│       ├── pages/
│       │   └── UserListPage.tsx ← 테스트 페이지 2
│       └── types/
│           └── user.type.ts
├── store/
│   └── authStore.ts
├── styles/
│   └── globals.css
└── test/
└── setup.ts

---

## 5단계 — 각 파일 구현

### src/styles/globals.css
@import "tailwindcss";

### src/test/setup.ts
import "@testing-library/jest-dom"

### src/app/queryClient.ts
- QueryClient 생성, staleTime 5분, retry 1

### src/app/providers.tsx
- QueryClientProvider + ReactQueryDevtools 래핑

---

### src/app/router.tsx

React Router v7 Data Mode로 작성한다.
(Data Mode = createBrowserRouter + RouterProvider 조합. Vite + TanStack Query를 직접 제어하는 구조에 적합.)

규칙:
- 라우트 객체에서 컴포넌트는 element가 아닌 Component prop 사용 (v7 Data Mode 권장)
- Layout Route는 path 없이 Component만 지정 — URL 세그먼트 추가 없이 레이아웃만 적용
- Lazy loading은 route.lazy 객체 방식 사용 (React.lazy 아님)
  페이지 파일에서 named export: export function Component() { ... }
  라우터에서: lazy: { Component: async () => (await import("...")).Component }
- HydrateFallback으로 lazy 로딩 중 fallback UI 처리

아래 구조로 router.tsx를 작성해줘:

import { createBrowserRouter } from "react-router"
import { Layout } from "../components/layout/Layout"

function PageLoader() {
return (
<div className="flex items-center justify-center min-h-screen">
<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
</div>
)
}

export const router = createBrowserRouter([
{
// path 없는 Layout Route — URL 변경 없이 Layout을 모든 자식에 적용
Component: Layout,
children: [
{
path: "/",
index: true,
HydrateFallback: PageLoader,
lazy: {
Component: async () =>
(await import("../features/home/pages/HomePage")).Component,
},
},
{
path: "users",
HydrateFallback: PageLoader,
lazy: {
Component: async () =>
(await import("../features/user/pages/UserListPage")).Component,
},
},
],
},
])

⚠️ 페이지 파일 export 방식:
- HomePage.tsx: export function Component() { ... }   ← named export
- UserListPage.tsx: export function Component() { ... }  ← named export

---

### src/api/client.ts
- axios.create, baseURL은 import.meta.env.VITE_API_BASE_URL ?? "https://jsonplaceholder.typicode.com"
- request interceptor: localStorage에서 token 꺼내 Authorization 헤더 추가
- response interceptor: 401이면 localStorage token 제거 후 /login 리다이렉트

### src/api/services/userService.ts
- userService.getAll(): GET /users → User[]
- userService.getById(id: number): GET /users/:id → User

### src/features/user/types/user.type.ts
jsonplaceholder /users 응답 타입:
- id, name, email, username, phone, website
- address: { street, city, zipcode }
- company: { name }

### src/features/user/hooks/useUsers.ts
- useQuery 기반 useUsers(), useUser(id: number) 훅
- queryKey는 userKeys 객체로 관리

### src/store/authStore.ts
- Zustand create로 user(id/name/email), isAuthenticated, login(user), logout() 구현

---

### src/components/layout/Layout.tsx

import { Outlet, NavLink } from "react-router"   ← "react-router" 단일 패키지에서 import

- 상단 고정 네비게이션: "/" (Home), "/users" (Users)
- NavLink로 active 스타일 적용 (Tailwind)
- Outlet으로 자식 라우트 렌더링

---

### src/components/common/Button/Button.tsx
- variant: "primary" | "secondary" | "danger"
- size: "sm" | "md" | "lg"
- loading prop (스피너 아이콘 표시)
- disabled 지원, Tailwind로 스타일링

---

### src/App.tsx 교체 (기존 내용 전부 삭제 후 교체)

import { RouterProvider } from "react-router"
import { Providers } from "./app/providers"
import { router } from "./app/router"
import "./styles/globals.css"

export default function App() {
return (
<Providers>
<RouterProvider router={router} />
</Providers>
)
}

### src/main.tsx
기존 index.css import 줄 제거 (globals.css를 App.tsx에서 import하므로)

---

## 6단계 — 테스트 페이지 구현

### 테스트 페이지 1 — HomePage ("/")

다음 기능을 포함한 시각적으로 완성도 있는 페이지로 만들어줘.

1. 기술 스택 배지 목록 — React 19, TypeScript, Vite, TanStack Query, Zustand, React Router v7, Tailwind, Vitest, React Compiler를 색상별 카드로 표시
2. Zustand 인증 상태 테스트 UI — "로그인 테스트" 버튼 클릭 시 모달이 뜨고 mock login() 호출, 상태 변화 실시간 반영
3. "/users" 이동 버튼 — Link 컴포넌트 사용 (from "react-router")
4. 아키텍처 흐름 다이어그램 — Component → Hook → Service → apiClient → API 흐름을 코드 블록 스타일로 표시

### 테스트 페이지 2 — UserListPage ("/users")

다음 기능을 포함하여 React Query 동작을 눈으로 확인할 수 있게 만들어줘.

1. TanStack Query 상태 배지 — isLoading, isFetching, isError 값을 실시간으로 화면에 표시
2. Skeleton 로딩 UI — isLoading 중에는 카드 형태 스켈레톤 애니메이션 표시
3. 유저 카드 목록 — jsonplaceholder에서 받아온 유저 표시 (이름, 이메일, 회사명)
4. "자세히" 토글 — 카드별로 전화, 주소 등 추가 정보 표시/숨김
5. 검색 필터 — 이름·이메일 실시간 검색
6. Refetch 버튼 — 수동으로 데이터를 다시 불러오는 버튼
7. 에러 상태 UI — isError일 때 에러 메시지와 재시도 버튼 표시

---

## 7단계 — Vitest 유닛 테스트 작성

아래 3개의 테스트 파일을 만들어줘.

### src/components/common/Button/Button.test.tsx
- 기본 렌더링 (버튼 텍스트 화면에 표시되는지 확인)
- loading=true 시 스피너 표시되고 버튼이 disabled 상태인지 확인
- onClick 호출 확인
- disabled prop 시 클릭해도 이벤트 발생 안 함 확인

### src/store/authStore.test.ts
- 초기 상태: user null, isAuthenticated false 확인
- login() 호출 후 user 세팅, isAuthenticated true 확인
- logout() 호출 후 초기 상태로 복구 확인
- 각 테스트 전 store 초기화 (beforeEach에서 useAuthStore.setState 사용)

### src/features/user/hooks/useUsers.test.ts
- vi.mock으로 userService.getAll 모킹 (MSW 없이)
- useUsers()가 로딩 후 데이터를 반환하는지 확인
- QueryClient를 직접 생성하여 wrapper로 주입

---

## 8단계 — 루트 설정 파일 추가

### orval.config.ts

import { defineConfig } from "orval"

export default defineConfig({
api: {
input: "./openapi/api.yaml",
output: {
target: "./src/api/generated",
client: "react-query",
override: {
mutator: {
path: "./src/api/client.ts",
name: "apiClient",
},
},
},
},
})

### .env.example

VITE_API_BASE_URL=https://jsonplaceholder.typicode.com

---

## 9단계 — 완료 검증

1. yarn build — TypeScript 컴파일 오류 없음
2. yarn test:run — 모든 유닛 테스트 통과
3. yarn dev — "/" 와 "/users" 라우트 정상 동작, 라우트 이동 시 lazy 로딩 확인
   React DevTools에서 컴포넌트 이름 옆에 "Memo ✨" 배지가 표시되면 React Compiler 정상 동작

에러가 있으면 스스로 계획을 작성 해서 위 3가지가 모두 통과하도록 완성해야 한다.