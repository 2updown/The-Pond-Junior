# The Pond

선생님과 학생을 잇는 학원 운영 도구. 모바일 우선(반응형) 웹앱이며, Next.js 14 App Router · TypeScript · Tailwind · shadcn/ui-style 컴포넌트 위에 만들어졌습니다.

## 스택

- Next.js 14 (App Router)
- TypeScript (strict)
- Tailwind CSS + tailwindcss-animate
- shadcn/ui-style 컴포넌트 (Radix 기반)
- lucide-react 아이콘
- Pretendard (CDN)

## 시작하기

```bash
npm install
npm run dev
```

http://localhost:3000 — `/` 진입 시 `/consultations`(상담 목록, 메인)로 자동 이동.

## 폴더 구조

```
app/
  layout.tsx              # 루트: ToastProvider + DrawerProvider
  page.tsx                # / → /consultations 리다이렉트
  globals.css             # 디자인 토큰 (CSS variables)

  (tabs)/                 # 주요 탭 그룹 (라우트 그룹화 용도, 하단 네비 없음)
    layout.tsx            # 단순 패스스루
    consultations/        # 상담 목록 (메인) — 빈상태 토글 + 토스트
    students/             # 학생 목록 — 검색 + PC 안내 모달
    todos/                # 할일 목록 — 진행률 바
    account/              # 계정 — 프로필 카드 + 메뉴 그룹

  (auth)/                 # 로그인 플로우 (네비/드로어 없음)
    login/                # 이메일 입력
    login/code/           # 6자리 OTP
    login/set-password/   # 새 비밀번호 + 강도 표시

  members/                # 회원관리 (교사 / 학생 / 출결 탭)
  classes/                # 반관리
  learning/               # 학습관리 (숙제 / 리포트 / 포인트 탭)
  archive/                # Archive (Voca / Sentence 탭)
  community/              # 커뮤니티 (일정 / 공지 탭)
  alimtalk/               # 학부모 알림톡 (설정 / 내역 / 충전 탭)
  erp/                    # 경영관리 / ERP (6 탭 - 매출/수강료/교재비/온라인/지출/통계)
  board/                  # 본사 공지사항
  support/                # 본사 고객센터 (내 문의 / FAQ)

  consultation/[id]/      # 상담 상세
  student/[id]/           # 학생 상세 (상담 이력 / 할일 / 메모 탭)
  todo/[id]/              # 할일 상세 (제출 현황)

  account/profile/        # 프로필 편집
  account/security/       # 비밀번호 변경
  account/notifications/  # 알림 설정

components/
  pond/
    drawer.tsx            # 2단 컬럼 슬라이드 드로어 (햄버거 → 열기) — 모든 네비게이션의 단일 진입점
    topbar.tsx            # 햄버거 / 뒤로 가변 토픽바
    app-shell.tsx         # 모바일 앱 셸 (max-w-480)
    segment.tsx           # 세그먼트 컨트롤
    chip.tsx              # 상태 칩 (예정/완료/취소/role/warning)
    avatar.tsx            # 학생/교사 이니셜 아바타
    empty-state.tsx       # 빈상태 (라이트블루 후광 + 브랜드 컬러 제목)
    info-box.tsx          # 회색 / 브랜드 톤 안내 박스
    pc-only-modal.tsx     # "PC에서 진행해주세요" 모달
    menu-config.ts        # 드로어 메뉴 트리 정의

  ui/                     # shadcn/ui-style 베이스 (Button, Card, Toast 등)

lib/
  mock-data/index.ts      # 모든 화면의 샘플 데이터
  utils.ts                # cn(), formatDate(), todayISO(), initials()

types/
  index.ts                # Consultation, Student, Teacher, ClassRoom, Todo 등 타입
```

## 사용자 흐름

1. `/login` → 이메일 입력 → 다음
2. `/login/code` → 메일로 받은 6자리 코드 입력
3. `/login/set-password` → 새 비밀번호 (8자 + 영문·숫자, 강도 4단계 표시)
4. 완료 → `/consultations?toast=password-changed` (메인 + "비밀번호가 변경되었습니다." 토스트)

이후 메인에서:
- 좌상단 햄버거(≡) → 슬라이드 드로어 (좌측: 카테고리, 우측: 서브메뉴, 상단: 검색)
- 모든 네비게이션은 드로어를 통해서만 이뤄짐 (하단 탭바는 사용하지 않음)
- 모바일에서 예약/등록/발행 시도 → "PC에서 진행해주세요" 모달

## 디자인 토큰

`app/globals.css`에 CSS variables로, `tailwind.config.ts`에 Tailwind 별칭으로 정의:

- `bg-page` #F6F7F9 · `bg-surface` #FFFFFF · `bg-muted` #EDEFF3
- `brand-50` #EAF2FF · `brand-500` #3E8BFF · `brand-600` #2F73E0
- `success` #22C55E · `danger` #EF4444 · `warning` #F59E0B
- 폰트: Pretendard (CDN)
- 그림자: `shadow-elev1` (카드) · `shadow-elev2` (활성 탭/토스트) · `shadow-elev3` (빈상태 후광)

## 디바이스 분기 원칙

모바일 = 조회/간단한 토글, PC = 작성/예약/등록/발행. 모바일에서 작성 액션을 시도하면 `<PcOnlyModal />`로 안내.

## 다음 단계 (Supabase 연동)

mock 데이터는 `lib/mock-data/index.ts`에 모여있고 plain import로 소비됩니다. Supabase로 전환할 때는 각 페이지의 import를 `lib/api/<entity>.ts`로 갈아끼우면 같은 shape을 받을 수 있도록 타입 분리해뒀어요.

## 백업

기존 HCIS Teacher Mode 코드는 `.backup-teacher-mode/`에 보관되어 있습니다 (필요 시 참고).
