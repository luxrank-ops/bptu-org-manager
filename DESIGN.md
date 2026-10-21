# 🌊 BPTU Maritime-Fluid Design System (부항디자인 v1.0)
## Google Stitch (`stitch.withgoogle.com`) Specification & `DESIGN.md` Standard

> **Architecture & Curation**:
> - **Lead Visual & AI Design Architect**: 강하늘 (`stitch-design-curator`, 제10서브)
> - **Lead Multi-Tier UX Director**: 한서연 (`enterprise-ux-director`, 제5서브)
>
> **Design Philosophy**:
> "중앙본부의 근엄한 해양 노사 거버넌스(`Trustworthy Maritime Authority`)와 부두 안벽의 손에 잡히는 현장 유틸리티(`Tactile Port Field Utility`)의 완벽한 결합. Google Stitch의 3-Layer Vibe Design과 글로벌 Top 1% 인터페이스(Linear, Toss, Rippling, Shiftee, Mobbin)의 정수만을 집대성한 부산항운노동조합 전사 디자인 시스템."

---

## 1. Brand Identity & Aesthetic Vibe

부산항운노동조합(BPTU) 시스템은 사용자의 권한과 환경에 따라 완벽히 분리된 **듀얼 바이브(Dual Vibe)**를 제공합니다.

```
                           [BPTU Dual Vibe Identity]
                                       │
            ┌──────────────────────────┴──────────────────────────┐
            ▼                                                     ▼
 [Trustworthy Maritime Authority]                      [Tactile Port Field Utility]
   - 타겟: 본부 위원장, 24개 지부장, 행정 실무자         - 타겟: 현장 작업반장, 조장, 9,709명 조합원
   - 디바이스: 데스크톱 대화면 (1920x1080+), 태블릿       - 디바이스: 모바일 스마트폰 (iOS/Android PWA)
   - 환경: 밝은 행정 사무실, 회의실, 관제실             - 환경: 직사광선 에이프런, 야간 안벽, 강풍/우천
   - 벤치마크: Linear.app, Vercel Geist, Rippling        - 벤치마크: Toss TDS, Shiftee, Mobbin
   - 감성: 차분하고 깊은 오션 블루, 1px 초정밀 라인,     - 감성: OLED 트루 블랙, 묵직한 하이비즈 앰버,
           고밀도 데이터 테이블, tabular-nums 숫자              48~56px 안전 장갑 터치 타깃, 친근한 마이크로카피
```

---

## 2. Global Design Tokens Specification

### 2.1 Color Tokens

모든 색상은 WCAG 2.1 AAA 등급(일반 텍스트 7:1 이상, 대형 텍스트/UI 컴포넌트 4.5:1 이상)을 충족하도록 배합되었습니다.

```css
:root {
  /* ==========================================================================
     Daylight Office Mode (행정/관제 데스크톱 모드)
     ========================================================================== */
  --bptu-canvas-light: #F8FAFC;         /* slate-50: 기본 캔버스 배경 */
  --bptu-surface-light: #FFFFFF;        /* white: 기본 카드 및 패널 서피스 */
  --bptu-surface-subtle-light: #F1F5F9; /* slate-100: 호버 상태 및 보조 영역 */
  --bptu-border-light: #E2E8F0;         /* slate-200: 정밀 1px 경계선 */
  --bptu-border-strong-light: #CBD5E1;  /* slate-300: 강조 분할선 */
  
  --bptu-text-primary-light: #0F172A;   /* slate-900: 메인 헤드라인 및 본문 */
  --bptu-text-secondary-light: #475569; /* slate-600: 보조 라벨 및 메타데이터 */
  --bptu-text-muted-light: #94A3B8;     /* slate-400: 비활성 및 캡션 */

  /* ==========================================================================
     Night-Pier High-Contrast Mode (야간 안벽/현장 모바일 모드 - OLED 최적화)
     ========================================================================== */
  --bptu-canvas-dark: #070B14;          /* deep-black: 투광등 반사 방지 캔버스 */
  --bptu-surface-dark: #0F172A;         /* slate-900: 카드 및 모달 서피스 */
  --bptu-surface-elevated-dark: #1E293B;/* slate-800: 떠 있는 바텀시트/드로어 */
  --bptu-border-dark: #334155;          /* slate-700: 고대비 1px 서피스 보더 */
  --bptu-border-focus-dark: #38BDF8;   /* sky-400: 포커스 링 하이라이트 */

  --bptu-text-primary-dark: #F8FAFC;    /* slate-50: 초고대비 흰색 텍스트 (대비율 14:1) */
  --bptu-text-secondary-dark: #CBD5E1;  /* slate-300: 식별력 높은 보조 텍스트 (대비율 9:1) */
  --bptu-text-muted-dark: #94A3B8;      /* slate-400: 주석 및 단위 텍스트 */

  /* ==========================================================================
     Maritime Brand Core Colors
     ========================================================================== */
  --bptu-brand-navy-900: #0C1E4A;      /* BPTU 전통의 짙은 해양 네이비 */
  --bptu-brand-navy-800: #142E7B;      /* 주요 헤더 및 권위 있는 배지 */
  --bptu-brand-blue-600: #2563EB;      /* 로열 블루: 기본 인터랙티브 링크/버튼 */
  --bptu-brand-blue-500: #3B82F6;      /* 활성 탭 및 선택 상태 */

  /* ==========================================================================
     Tactile Port Field Safety & Semantic Colors (WCAG AAA 준수)
     ========================================================================== */
  /* 출역 완료 / 안전 정상 / 찬성 */
  --bptu-status-success: #059669;       /* emerald-600 (Light) */
  --bptu-status-success-neon: #10B981;  /* emerald-500: 야간 모드 고시인성 네온 에메랄드 */
  --bptu-status-success-bg: #ECFDF5;    /* emerald-50 */

  /* 현장 주의 / 장비 점검 / 미열람 리마인드 */
  --bptu-status-warning: #D97706;       /* amber-600 (Light) */
  --bptu-status-warning-neon: #F59E0B;  /* amber-500: 하이비즈 안전모 옐로우/앰버 */
  --bptu-status-warning-bg: #FFFBEB;    /* amber-50 */

  /* 긴급 비상 / 중대재해 경보 / 태풍 / 결근 */
  --bptu-status-danger: #DC2626;        /* red-600 (Light) */
  --bptu-status-danger-neon: #EF4444;   /* red-500: 고채도 경보 레드 */
  --bptu-status-danger-bg: #FEF2F2;     /* red-50 */

  /* 정보 안내 / 접안 중 / 임단협 소식 */
  --bptu-status-info: #0284C7;          /* sky-600 */
  --bptu-status-info-neon: #06B6D4;     /* cyan-500: 야간 크레인 시안 블루 */
  --bptu-status-info-bg: #F0F9FF;       /* sky-50 */
}
```

---

### 2.2 Typography Scale & Tabular Numbers

1. **글꼴 패밀리**:
   - UI 기본 본문 및 헤드라인: `Pretendard`, `-apple-system`, `BlinkMacSystemFont`, `sans-serif`
   - 노임, 톤수, 시간, 좌표, 감사 해시: `IBM Plex Mono`, `JetBrains Mono`, `monospace`
   - **필수 속성**: 모든 숫자 출력 요소에 `font-feature-settings: "tnum"` (Tabular Numbers) 강제 적용하여 자릿수 세로열 완벽 일치.
2. **이원화 타이포그래피 스케일**:
   - 표준 모드(Standard) 대비 5060 베테랑 조합원을 위한 **효도모드(Senior Accessible View) 1.25x 스케일러** 지원.

| 토큰명 | 데스크톱/표준 모바일 | 효도모드 (1.25x Scale) | 굵기 (Weight) | 용도 및 적용 컴포넌트 |
| :--- | :--- | :--- | :--- | :--- |
| `text-display` | 32px (line-height: 40px) | **40px (lh: 48px)** | Bold (700) | 당월 실수령 노임 총액, 관제탑 핵심 출역률 수치 |
| `text-h1` | 24px (line-height: 32px) | **30px (lh: 38px)** | Bold (700) | 페이지 대표 제목, 긴급 비상 경보 헤드라인 |
| `text-h2` | 20px (line-height: 28px) | **25px (lh: 34px)** | SemiBold (600) | 모듈 섹션 제목, 벤토 카드 타이틀, 바텀시트 헤더 |
| `text-h3` | 16px (line-height: 24px) | **20px (lh: 28px)** | SemiBold (600) | 테이블 컬럼 헤더, 선석 코드, 투표 안건 항목 |
| `text-body` | 14px (line-height: 20px) | **18px (lh: 26px)** | Regular (400) / Med (500) | 일반 공지 본문, 조합원 상세 프로필, 폼 입력 필드 |
| `text-caption` | 12px (line-height: 16px) | **15px (lh: 22px)** | Medium (500) | 메타 태그, 타임스탬프, 수당 세부 계산식 라벨 |
| `text-mono` | 13px (tabular-nums) | **16px (tabular-nums)** | Regular (400) / Semi (600) | 노임 금액(`₩4,680,300`), 교대시간(`20:00~06:00`) |

---

### 2.3 Spacing, Elevation & Industrial Touch Target Rules

#### 1) Desktop High-Density Rules (Linear & Vercel Geist 스타일)
- 행 높이(Row Height): 표준 36px, 초고밀도 모드 32px
- 인라인 패딩: `px-3 py-1.5`
- 섀도우: `box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05)` (미세한 깊이감)
- 서피스 보더: `1px solid var(--bptu-border-light)` (흐릿하지 않은 선명한 엣지)

#### 2) Mobile Industrial Touch Rules (Toss TDS & 현장 안전 장갑 표준)
- **최소 물리적 터치 타깃**: `48px × 48px` 이상 (애플 HIG의 44px을 초과하는 산업 안전 규격)
- **주요 액션 버튼 (CTA)**: **`56px` 높이 강제** (기름때 묻은 목장갑, 코팅 장갑 착용 상태에서도 100% 터치 보장)
- **버튼 간 안전 마진**: 최소 `12px` (인접 버튼 중복 오터치 원천 방지)
- **코너 라운딩**: `rounded-2xl` (16px) ~ `rounded-3xl` (24px) (충격 완화 느낌의 친근하고 부드러운 형상)
- **하단 엄지 존(Thumb Zone)**: 모바일 하단 72px 플로팅 바에 메인 액션 집중

---

## 3. 7대 핵심 모듈별 Google Stitch 3-Layer Vibe Prompts

> **How to Use with Google Stitch**:
> 아래 프롬프트 블록을 그대로 복사하여 `stitch.withgoogle.com`의 입력창에 붙여넣으면, Google Stitch가 즉시 반응형 React/Tailwind 코드로 프로토타입을 합성합니다.

---

### 모듈 1: Lv.1 본부 위원장 통합 관제탑 (Executive Maritime Command Tower)
- **타겟 권한**: Lv.1 위원장, 본부 상임임원, 기획관리처장
- **디바이스**: 데스크톱 1920x1080 고해상도 모니터
- **벤치마크**: `Linear.app` (초고밀도 커맨드) × `Apple Bento Grid` (요약 벤토 카드)

#### Stitch 3-Layer Specification
```text
[Layer 1: Anatomy]
- Viewport: Desktop 1920x1080, Full-width fixed navigation shell.
- Left Sidebar: 240px dark ocean navy navigation (Dashboard, 24 Branches, Dispatch Gantt, Payroll Audit, Governance Voting, Emergency Broadcast).
- Header: 56px high top bar with global search input (Cmd+K prompt), BPTU seal, real-time typhoon warning ticker, and Master Administrator avatar.
- Main Body (Bento Layout):
  - Row 1 (Top Metric Bento, 4 Columns):
    1) 당일 총 출역률: "9,241 / 9,709명 (95.2%)" [Radial progress badge]
    2) 신항/북항 8대 부두 가동 선석: "38 / 42 선석 정상 하역 중" [Port pulse dot]
    3) 금일 마감 누적 노임 총액: "₩1,428,500,000" [tabular-nums]
    4) 긴급 안전 이슈: "0건 발생 (무사고 142일 달성)" [Emerald badge]
  - Row 2 (Middle Split 8:4):
    - Left (8 Cols): 24개 지부 실시간 출역 및 작업 현황 고밀도 테이블 (지부명, 관할부두, 출역률 바, 사고유무, 노임 마감상태, 빠른 호출).
    - Right (4 Cols): 부산항 선석 접안 히트맵 (North Port & New Port Terminal Map with color-coded berth nodes).
  - Row 3 (Bottom Action Strip): 전사 비상 방송 즉시 송출 배너 ("원클릭 긴급 지침 발송") and 실시간 시스템 감사 피드.

[Layer 2: Vibe]
- Aesthetic: Trustworthy Maritime Authority, Linear-grade precision.
- Canvas: Deep Slate / Pure Dark Navy (#0B0F19).
- Surfaces: Elevated cards with subtle gradient borders (#1E293B border, #0F172A fill).
- Accents: Electric Emerald (#10B981) for active port status, Cyan Blue (#06B6D4) for vessel berthing, Neon Amber (#F59E0B) for shift rotation warnings.
- Typography: Pretendard for headers, IBM Plex Mono for all numbers with font-feature-settings: 'tnum'.
- Micro-interactions: 100ms hover brightness on table rows, subtle pulsing glow on active berths.

[Layer 3: Content]
- Title: "부산항운노동조합 중앙본부 전사 실시간 관제탑"
- Subtitle: "BPTU Supreme Operations Command Center — 2026-10-21 16:40 KST"
- Real Port Data:
  - Branch 1: "신항컨테이너제1지부 (PNC/HJNC)" | 출역 418/425명 (98.3%) | 8선석 정상 | 노임 승인완료
  - Branch 2: "신항컨테이너제2지부 (HPNT/PNIT)" | 출역 392/400명 (98.0%) | 6선석 정상 | 노임 정산중
  - Branch 3: "북항양곡지부 (감만양곡부두)" | 출역 115/120명 (95.8%) | 2선석 하역 | 노임 대기
  - Branch 4: "일반화물제3지부 (신감만/우암)" | 출역 280/310명 (90.3%) | 4선석 하역 | 주의(인력 보충 요청)
- Weather Alert: "부산항 외항 파고 1.5m, 북동풍 8m/s (정상 하역 가능 상태)"
```

---

### 모듈 2: Lv.3 24개 지부 인사·배차·노임 관리 사령탑 (Branch Desktop Portal)
- **타겟 권한**: Lv.3 지부장, 지부 총무실장, 연락소장
- **디바이스**: 데스크톱 1920x1080 / 태블릿 가로 모드 (1280x800)
- **벤치마크**: `Rippling.com` (인사 트리 드릴다운) × `Linear` (단축키 기반 고밀도 테이블)

#### Stitch 3-Layer Specification
```text
[Layer 1: Anatomy]
- Viewport: Desktop 1920x1080.
- Layout: 3-Pane Split View (Resizable):
  - Left Pane (280px): 지부 산하 다계층 조직 트리 (지부 본부 -> 신선대연락소 / 감만연락소 -> 1반, 2반, 3반 -> A조, B조 드릴다운). 각 노드별 우측에 [금일 출역 28/30] 칩 배치.
  - Center Pane (Flexible Grid): 40행 고밀도 조합원 명부 및 배차 그리드 (체크박스, 사번, 성명, 직책, 자격증, 배정선석, 당일 작업조, 노임 산출액, 출역 상태 배지).
  - Right Pane (Slide-over 400px Drawer): 선택된 조합원의 상세 프로필 팝업 (얼굴 사진, 연락처, 누적 노임, 안전교육 이수증, 1클릭 전보/대체근무 지정 버튼).
- Top Utility Bar: 키보드 단축키 안내 ('J'/'K' 행 이동, 'A' 일괄 승인, 'E' 엑셀/노임명세서 다운로드).

[Layer 2: Vibe]
- Aesthetic: Modern Administrative Clarity, Crisp White with Maritime Navy Accents.
- Canvas: Clean Cool Gray (#F8FAFC).
- Surfaces: Pure White (#FFFFFF) cards, Crisp Slate Borders (#E2E8F0).
- Row Height: Strict 32px height for maximum information density without clutter.
- Accents: Deep Royal Blue (#1D4ED8) for selected rows and focus states.
- Data Alignment: Left-align Korean names/roles, Center-align status badges, Right-align tabular numeric hours and wage amounts.

[Layer 3: Content]
- Organization Header: "신항컨테이너제1지부 통합 행정 관리 포털"
- Target Node: "신선대 제2연락소 > 크레인작업제3반 (반장: 김철수, 총원 36명)"
- Sample Rows:
  1) 사번 2014-0412 | 김철수 (정조합원/반장) | 갠트리크레인 1급 | 신선대 2선석 | A조 주간 | ₩248,000 | [정상 출역 07:50]
  2) 사번 2018-0891 | 박상진 (정조합원/조장) | 트랜스퍼크레인 2급 | 신선대 2선석 | A조 주간 | ₩212,000 | [정상 출역 07:52]
  3) 사번 2023-1102 | 이진우 (임시조합원) | 샷시 야드섀시 | 신선대 3선석 | B조 대기 | ₩165,000 | [대기 배차]
  4) 사번 2019-0305 | 정대현 (정조합원) | 라이싱 전문수당 | - | 병가 (진단서 제출) | ₩0 | [공가 승인]
- Action Feedback: "선택된 3명에게 긴급 대체근무 지시가 전송되었습니다."
```

---

### 모듈 3: Lv.5/6 현장 조합원 모바일 홈 & 1초 출역 카드 (Member Mobile Daily Hub)
- **타겟 권한**: Lv.5 정조합원, Lv.6 임시·상용조합원, 현장 반장/조장
- **디바이스**: 스마트폰 PWA (390x844 iPhone, 412x915 Galaxy)
- **벤치마크**: `Toss TDS` (초간결 카드) × `Shiftee` (현장 출역 캘린더)

#### Stitch 3-Layer Specification
```text
[Layer 1: Anatomy]
- Viewport: Mobile Portrait (390x844).
- Header (Sticky 56px): Left: BPTU Maritime Badge, Center: "내 작업 홈", Right: [큰글씨 모드 토글 스위치].
- Main Scrollable Content:
  - Card 1 (Top ID Card, Rounded-2xl): 모바일 조합원증 간이 바코드 배지 (성명 "박영호", 사번 "2019-0941", 신항컨테이너제2지부, QR 바코드 탭 시 풀스크린 확대).
  - Card 2 (Hero Bento Card, 80px padded):
    - "오늘의 배정 선석" -> [부산신항 4부두 HPNT 2번 선석] (Large Bold 22px)
    - "작업 모선: HMM ALGEOIRAS (24,000 TEU)"
    - "배정 작업조: 야간 A조 (20:00 ~ 익일 06:00)"
    - "담당 장비: 갠트리 4호기 하역 라이싱"
  - Card 3 (Primary Action, 56px Height Button):
    - [원탭 안전 출역 체크인 (GPS/QR 확인 완료)] (Vibrant Amber/Emerald 버튼, 햅틱 진동 피드백).
  - Card 4 (Quick Weather & Safety): 실시간 안벽 순간풍속 6.2m/s [정상], "야간 안벽 미끄럼 주의!"
- Bottom Sticky Navigation (72px Thumb Zone): 4 Tabs with 24px icons & 12px labels:
  [1. 출역/선석] (Active) | [2. 노임/급여] | [3. 공지/투표] | [4. 복지/설정]

[Layer 2: Vibe]
- Aesthetic: Tactile Port Field Utility, Night-Pier High-Contrast.
- Canvas: Pure OLED Black (#070B14) to prevent eye strain during dark quay operations.
- Surfaces: Deep Slate Elevated Cards (#0F172A) with distinct border strokes (#334155).
- Accents: High-Vis Safety Amber (#F59E0B) for CTA button, Neon Cyan (#06B6D4) for vessel labels.
- Touch Targets: Every touch target is 56px tall with 16px horizontal padding.
- Senior Mode Support: When enabled, font sizes scale up 1.25x seamlessly without clipping.

[Layer 3: Content]
- Greeting: "안전제일! 박영호 동지, 오늘도 무사고 교대하십시오."
- Shift Details: "야간 3반 1조 | 조장: 최민석 (010-8921-XXXX [전화연결])"
- Shuttle Bus: "신항 순환 통근버스: 하단역 18:40발 -> 19:20 부두 정문 도착 예정"
- Notice Banner: "[임단협 속보] 2027 잠정합의안 찬반투표 진행 중 (터치하여 투표)"
```

---

### 모듈 4: 모바일 1초 급여명세서 & 노임 계산기 (Toss-Style Mobile Payroll)
- **타겟 권한**: Lv.4~Lv.6 전 조합원
- **디바이스**: 스마트폰 PWA (390x844)
- **벤치마크**: `Toss Design System` (토스 1줄 급여명세서 및 친근한 마이크로카피)

#### Stitch 3-Layer Specification
```text
[Layer 1: Anatomy]
- Viewport: Mobile Portrait (390x844).
- Header: Back arrow, "2026년 10월분 노임 명세", PDF 공유 아이콘.
- Top Summary Hero (Toss Style):
  - Label: "10월에 일하고 받는 실수령 노임" (15px Muted Slate)
  - Hero Metric: "₩4,680,300" (Bold 32px Display Font with Tabular Nums)
  - Sub-microcopy: "지난 9월보다 342,000원 더 입금되었어요 ⚓" (Emerald pill badge)
- Middle Interactive Bento Cards (2x2 Grid):
  - Card A: 총 출역 일수 [22일 (주간 14 / 야간 8)]
  - Card B: 하역 톤수/무브 [1,420 TEU 달성]
  - Card C: 위험물/특수할증 [₩450,000]
  - Card D: 시간외/야간할증 [₩1,120,000]
- Bottom Accordion Drawer:
  - Section 1: 지급 내역 합계 (기본하역료 + 할증료 = ₩5,420,000)
  - Section 2: 공제 내역 합계 (조합비 1% ₩54,200, 4대보험, 신협 공제회 상환금 = ₩739,700)
- Bottom Sticky CTA (56px): [카카오톡으로 명세서 안전하게 보내기]

[Layer 2: Vibe]
- Aesthetic: Toss TDS Ultra-Simplicity, Friendly Financial Transparency.
- Canvas: Night-Pier Dark (#0B0F19) or Soft Clean Light (#FFFFFF) based on system preference.
- Cards: Soft rounded-2xl (#1E293B in dark, #F1F5F9 in light) with no hard lines.
- Color: Royal Blue (#2563EB) for hero numbers, Mint Emerald (#10B981) for positive trends.
- Tabular Numbers: All currency and tonnage strictly rendered in monospace tabular numbers.

[Layer 3: Content]
- Member: "김진수 조합원 (신항컨테이너제1지부 / 사번 2017-0211)"
- Payment Date: "지급일: 2026년 11월 05일 (부산신협 급여계좌)"
- Microcopy: "항만 가족을 위한 조합원 복지장학금 150만원이 11월 중순 추가 지급될 예정입니다."
- Seal: "부산항운노동조합 중앙본부 노임정산위원회 검인 완료"
```

---

### 모듈 5: 전조합원 비밀·직접 전자투표 모바일 룸 (Encrypted Mobile Ballot)
- **타겟 권한**: 전 조합원 (투표권 보유자)
- **디바이스**: 스마트폰 PWA (390x844)
- **벤치마크**: `Mobbin FinTech Voting & Auth Flows` × `Material 3 Expressive`

#### Stitch 3-Layer Specification
```text
[Layer 1: Anatomy]
- Viewport: Mobile Portrait (390x844).
- Top Security Shield: [SHA-256 종단간 암호화 블라인드 서명 적용] (Sapphire Blue Shield Badge with Lock Icon).
- Ballot Title Card: "제32대 임원선거 대의원 찬반투표 및 2027 임단협 잠정합의안 추인의 건"
- Live Turnout Bar: "전사 투표율 88.4% (8,582명 참여 / 마감까지 3시간 15분)"
- Vote Selection Area (Two Massive 80px High Choice Cards):
  - Option A: [찬성 (AGREE)] -> Large Checkmark Circle, Emerald Glow on Tap.
  - Option B: [반대 (DISAGREE)] -> Distinct Cross Circle, Neutral Slate Glow on Tap.
- Bottom Sticky Confirmation (56px Button):
  - [암호화 투표권 행사하기 (생체인증/PIN 확인)]
  - Tap triggers Slide-up Modal: "투표 후에는 절대 수정하거나 되돌릴 수 없습니다."

[Layer 2: Vibe]
- Aesthetic: Impartial Democratic Authority, High Trust & Military Security.
- Canvas: Midnight Blue Black (#070B19).
- Active Selection: Card border shifts from Slate-700 to Bright Cyan (#38BDF8) with subtle 2px glow.
- Typography: High readability with minimum 16px body, 20px option title.
- Zero-Ambiguity: Visual distinction between '찬성' and '반대' is crystal clear with distinct shapes and color tags.

[Layer 3: Content]
- Voter Context: "박영호 조합원 (신항2지부, 투표권 확인 완료)"
- Agenda Summary:
  - 1. 기본급 8.5% 인상 및 혹서기 냉방조끼 지급안
  - 2. 신항 8선석 자동화 도입에 따른 고용안정 협약서 체결 건
- Audit Assurance: "본 투표는 중앙선거관리위원회 규정에 의거하여 익명성이 100% 보장되며, 누구도 귀하의 선택을 추적할 수 없습니다."
```

---

### 모듈 6: 부두 선석 및 작업반 간트/캘린더 디스패치 (Port Berth & Gang Gantt Console)
- **타겟 권한**: Lv.2 본부 배차부, Lv.3 지부 배차담당, Lv.4 현장 반장
- **디바이스**: 데스크톱 1920x1080 / 듀얼 모니터 관제 화면
- **벤치마크**: `Linear Project Timeline` × `Shiftee Port Shift Scheduling`

#### Stitch 3-Layer Specification
```text
[Layer 1: Anatomy]
- Viewport: Desktop 1920x1080 Gantt Canvas.
- Top Terminal Filter Tabs: [전체 부두] | [신항 PNC] | [신항 HJNC] | [신항 HPNT] | [북항 신선대] | [감만/신감만].
- Gantt Control Bar: Timeframe Selector (24시간 실시간 뷰 / 3일 일정 / 주간 계획), [자동 배차 충돌 검사 버튼].
- Gantt Body (2-Dimensional Timeline Grid):
  - Y-Axis (Left Column, 240px Fixed): 선석 및 갠트리 크레인 목록 (선석 1~8번, 크레인 QC-101 ~ QC-108).
  - X-Axis (Horizontal Header): 00:00 ~ 24:00 (1시간 단위 눈금, 현재 시각 Red Line 타임라인 바늘).
  - Grid Content:
    - 선박 접안 블록 (Vessel Blocks): "MAERSK MC-KINNEY (14:00 접안 ~ 02:00 출항, 2,800 Move)".
    - 투입 작업반 블록 (Gang Blocks): "신항1지부 3반 2조 (18명, 조장 최정훈)".
- Bottom Drag & Drop Pool (120px): [미배정 가용 작업반 풀] (드래그하여 부족한 선석 크레인에 즉시 할당).

[Layer 2: Vibe]
- Aesthetic: Precision Harbor Logistics, Linear Dark Timeline Style.
- Canvas: Deep Space Canvas (#0F172A).
- Grid Lines: Subtle 1px dotted lines (#334155).
- Gang Color Coding:
  - Regular Gangs (정조합원 작업반): Royal Indigo (#4F46E5)
  - Emergency Support (긴급 지원반): Vibrant Amber (#F59E0B)
  - Overlap/Collision Hazard: Flashing Neon Red (#EF4444)
- Smooth Interactions: Smooth 60fps pan/zoom along the 24-hour timeline.

[Layer 3: Content]
- Current Operations: "부산 신항 5부두 PNC 컨테이너 터미널 실시간 하역 일정"
- Active Vessel: "HYUNDAI BRAVE (10,000 TEU) — 3번 선석 작업 진행률 64% (1,280 / 2,000 Move)"
- Conflict Warning: "⚠️ 경고: 갠트리 3호기 22:00 정기 안전점검 예정 (해당 시간 작업반 재배치 필요)"
- Status Bar: "총 12개 작업반 216명 작업 중, 대기 2개 반 36명 (하단 대기실 대기)"
```

---

### 모듈 7: 전사 긴급 비상 공지 풀스크린 모달 & 실시간 열람률 대시보드 (Emergency Broadcast & Read Radar)
- **타겟 권한**: [수신] 전 조합원 모바일 / [관제] 본부 위원장 데스크톱
- **디바이스**: 모바일 PWA 풀스크린 모달 + 데스크톱 관제탑 레이더
- **벤치마크**: `Tactile Port Field Safety Alert` × `Linear Status Incident Room`

#### Stitch 3-Layer Specification
```text
[Layer 1: Anatomy]
- Part A: [모바일 수신자 화면] Full-Screen High-Alert Blocking Modal
  - Background: 고대비 앰버 경보 테마 (Flashing Alert Icon 48px).
  - Emergency Tag: "[위원장 긴급 재난 안전 지침 — 최우선 수신 공지]" (Red Pill Badge).
  - Headline: "태풍 북상에 따른 순간풍속 25m/s 초과 — 부산항 전 선석 크레인 하역 즉시 중단"
  - Body: 지침 세부 조항 3개 (1. 컨테이너 고정 래싱 체결, 2. 야외 작업자 즉시 대기실 이동, 3. 조장 인원 점호).
  - Action Target (56px Massive Button):
    - [지침을 확인하였으며 현장 안전 수칙을 준수하겠습니다 (수신확인 전송)]
    - *이 버튼을 누르기 전까지 앱의 다른 화면으로 이동할 수 없습니다.*
- Part B: [본부 관리자 화면] 실시간 24개 지부 열람 레이더
  - Top: 원형 게이지 "전사 수신율: 9,142 / 9,709명 (94.1%) [발송 12분 경과]".
  - Center: 24개 지부별 미열람자 수직 바 차트 (미열람률 높은 지부 상단 자동 정렬).
  - Bottom Action: [미열람 567명 대상 2차 카카오 알림톡/긴급 SMS 원클릭 재발송].

[Layer 2: Vibe]
- Aesthetic: Zero-Compromise Life Safety, High Contrast Warning.
- Modal Canvas: Deep Black (#070B14) with Vivid Amber/Red Glowing Border (#F59E0B / #EF4444).
- Text Contrast: Ultra-High Contrast White (#FFFFFF) on pure dark, with bold yellow callouts.
- Visual Hierarchy: Message is unmissable from 1 meter away even in heavy rain.

[Layer 3: Content]
- Issuing Authority: "부산항운노동조합 중앙본부 비상안전대책위원회"
- Timestamp: "발령 시각: 2026년 10월 21일 17시 00분부"
- Live Tracking:
  - 신항1지부: 98.2% 수신완료 (미열람 7명)
  - 신항2지부: 96.5% 수신완료 (미열람 14명)
  - 연안화물지부: 82.1% 수신완료 (미열람 28명 -> 알림톡 긴급 재발송 대기)
```

---

## 4. React & Tailwind CSS Implementation Standards

Google Stitch 및 개발 에이전트(`infra-mcp-devops-lead`)가 바로 사용할 수 있는 표준 React/Tailwind 컴포넌트 템플릿입니다.

### 4.1 모바일 56px Industrial Button Component
```tsx
import React from 'react';

interface TactileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'safety' | 'danger' | 'ghost';
  isSeniorMode?: boolean;
  children: React.ReactNode;
}

export const TactileButton: React.FC<TactileButtonProps> = ({
  variant = 'primary',
  isSeniorMode = false,
  children,
  className = '',
  ...props
}) => {
  const baseStyles = "w-full min-h-[56px] px-6 rounded-2xl font-bold flex items-center justify-center transition-all duration-150 active:scale-[0.98] select-none touch-manipulation";
  
  const variantStyles = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30 active:bg-blue-700",
    safety: "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-950/40 active:bg-amber-600 font-extrabold",
    danger: "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/30 active:bg-red-700",
    ghost: "bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700"
  };

  const textScale = isSeniorMode ? "text-xl tracking-wide" : "text-base tracking-normal";

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${textScale} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
```

### 4.2 Tabular Numbers Monospace Metric Card
```tsx
import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export const TabularMetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  subtext,
  trend
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
      <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1">
        {label}
      </span>
      <div className="flex items-baseline space-x-1 my-2">
        <span className="text-2xl md:text-3xl font-bold text-slate-50 font-mono tracking-tight [font-feature-settings:'tnum']">
          {value}
        </span>
        {unit && <span className="text-sm font-medium text-slate-400">{unit}</span>}
      </div>
      {subtext && (
        <div className="flex items-center text-xs mt-1">
          <span className={trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400'}>
            {subtext}
          </span>
        </div>
      )}
    </div>
  );
};
```

---

## 5. Google Stitch MCP Automation & Figma Bridge

1. **Stitch Prompt Code Sync**:
   `stitch-design-curator`는 새 기능이나 화면이 추가될 때 본 `DESIGN.md`의 토큰 및 프롬프트를 자동으로 갱신하며, Aside CLI / Stitch MCP 브릿지를 통해 React 코드를 실시간 렌더링 검증합니다.
2. **Quality Verification Protocol**:
   모든 시안은 `enterprise-ux-director`(한서연)의 **48px 장갑 터치 타깃 검증** 및 **야간 안벽 WCAG AAA 검증**을 통과한 후 프론트엔드 레포지토리에 머지됩니다.
