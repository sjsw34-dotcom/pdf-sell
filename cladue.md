# CLAUDE.md — Saju PDF Generator (사주 분석 PDF 생성기)

## 프로젝트 개요
사주명리학 분석 JSON(약 1300줄)을 기반으로 영문 프리미엄 PDF(30~150페이지)를 자동 생성하는 웹앱.
브랜드: sajumuse.com (운명테라피 영문 서비스)

**핵심 흐름**: JSON 입력 → 티어 선택 → 커버/테마 설정 → 추가 요청사항 입력(선택) → Claude API 번역+분석 → React-PDF 렌더링 → PDF 다운로드

---

## 기술 스택
- **프레임워크**: Next.js 14+ (App Router, `src/app/`)
- **언어**: TypeScript strict mode (any 금지)
- **PDF 생성**: @react-pdf/renderer (Puppeteer/Playwright 절대 사용 금지 — Vercel 호환 불가)
- **웹 UI 스타일**: Tailwind CSS
- **번역 API**: Anthropic Claude API (claude-sonnet-4-20250514), 섹션별 병렬 호출
- **상태관리**: zustand
- **배포**: Vercel (Pro plan)
- **폰트**: Noto Sans KR (한자용), Playfair Display + Inter (영문)

---

## 상품 티어 (4종)

| 티어 | 코드 | 사용 섹션 | PDF Parts | 페이지 | 예상 생성시간 |
|------|------|----------|-----------|--------|-------------|
| Basic ($19~29) | `basic` | info, pillar, yongsin, yinyang | Part 1 종합분석 | ~30p | 30초~1분 |
| Love ($39~59) | `love` | info, pillar, yongsin, yinyang, shinsal, nyunun | Ch.1~3 + Part 1~6 | ~60p | 1~3분 |
| Full ($49~79) | `full` | + shinsal, hyungchung, daeun | Part 1~8 | ~80-100p | 1~3분 |
| Premium ($99~149) | `premium` | + nyunun, wolun, wolun2 | Part 1~10 | ~150p | 2~4분 |

JSON 입력은 1개 — 티어 선택에 따라 코드가 필요한 섹션만 필터링해서 처리.

### Love 티어 상세 구성
```
- 표지 (커버 이미지 + 이름)
- 인트로 (Ch.1~3): 사주 기본구조, 일간 성향, 오행/십신 연애 해석
- Part 1~2: 연애 DNA, 첫인상, 강점, 연애 스타일
- Part 3: 운명의 짝 (일주/오행 매칭, 피해야 할 유형)
- Part 4: 연애운 좋은 시기 + 장소 제안 (nyunun 데이터 활용)
- Part 5: Adult Only (스킨십 스타일, 깊은 교감)
- Part 6: 행운 아이템(색상, 숫자, 장소) + 전략 팁
- 마무리
```
Love 티어 특수 규칙:
- 테마 강제: 파스텔 핑크 계열 (`love` 전용 테마)
- 사주 용어를 현대적 연애 언어로 풀어서 설명
- 구체적 액션 플랜 포함 (시기, 장소, 상황별 멘트 예시)
- "OOO님의 연애 DNA를 한 단어로 표현한다면?" 같은 Call-out Box 활용
- 1페이지 1주제 원칙, 텍스트 ↔ 비주얼 페이지 교차 배치

---

## JSON 입력 데이터 구조

사용자가 업로드하는 JSON 파일은 다음 9개 탭으로 구성:

| 탭 키 | 설명 | Basic | Love | Full | Premium |
|-------|------|-------|------|------|---------|
| `info` | 성별, 이름, 생년월일, 경도/썸머타임 보정 | ✅ | ✅ | ✅ | ✅ |
| `pillar` | 사주팔자 (시/일/월/년주) — 천간, 지지, 십성, 12운성, 지장간 | ✅ | ✅ | ✅ | ✅ |
| `yongsin` | 용신/희신/기신/구신/한신 | ✅ | ✅ | ✅ | ✅ |
| `yinyang` | 음양 비율, 오행 개수, 십신 분포 | ✅ | ✅ | ✅ | ✅ |
| `shinsal` | 공망, 천을귀인, 12신살, 세부 신살, 귀문관살, 원진살 | ❌ | ✅ | ✅ | ✅ |
| `hyungchung` | 천간합/충/병존, 지지삼합/방합/육합/충 등 | ❌ | ❌ | ✅ | ✅ |
| `daeun` | 대운 10개 (9세~99세) | ❌ | ❌ | ✅ | ✅ |
| `nyunun` | 년운 (2025~2035) | ❌ | ✅ | ❌ | ✅ |
| `wolun` / `wolun2` | 월운 (2026년, 2027년 각 12개월) | ❌ | ❌ | ❌ | ✅ |

---

## 디렉토리 구조
```
src/
├── app/
│   ├── page.tsx                    # 메인 (티어선택+JSON입력+생성)
│   ├── api/
│   │   ├── translate/route.ts      # Claude API 번역+분석
│   │   └── generate-pdf/route.ts   # PDF 생성
│   └── preview/page.tsx            # 미리보기
├── components/
│   ├── ui/                         # 웹 UI (Tailwind)
│   │   ├── FileUploader.tsx        # JSON 입력 (붙여넣기+파일 드롭)
│   │   ├── ImageUploader.tsx       # 커버 이미지 업로드 → base64 변환
│   │   ├── ThemeSelector.tsx       # 테마 선택 (Love 티어는 자동 고정)
│   │   ├── TierSelector.tsx        # 상품 티어 선택 (4종)
│   │   ├── AdditionalRequest.tsx   # 추가 요청사항 textarea
│   │   └── ProgressBar.tsx         # 생성 진행률 (파트별 상태 표시)
│   └── pdf/                        # PDF 전용 (@react-pdf/renderer)
│       ├── PdfDocument.tsx         # 최상위 Document (티어별 분기)
│       ├── CoverPage.tsx           # 표지 (커버 이미지 base64 삽입)
│       ├── IntroPage.tsx           # 인사말+목차
│       ├── SajuChart.tsx           # 사주원국표
│       ├── YongsinChart.tsx        # 용신 차트
│       ├── YinyangChart.tsx        # 음양오행 분포
│       ├── ShinsalTable.tsx        # 신살 테이블
│       ├── PartHeader.tsx          # PART 구분 페이지
│       ├── ChapterPage.tsx         # 챕터 본문 (긴 텍스트 자동 페이지 분할)
│       ├── CalloutBox.tsx          # 강조 박스 (Love 티어 등에서 활용)
│       ├── DaeunTimeline.tsx       # 대운 타임라인
│       ├── NyununCard.tsx          # 년운 카드
│       ├── WolunCard.tsx           # 월운 카드
│       ├── EndingPage.tsx          # 마무리
│       └── styles/
│           ├── pdfStyles.ts        # PDF 공통 스타일
│           └── themes.ts           # 테마 컬러 (love 테마 포함)
├── lib/
│   ├── types/                      # 타입 정의 (saju.ts, theme.ts, tier.ts, pdf.ts)
│   ├── translate/                  # 번역 로직 (병렬호출, 프롬프트)
│   ├── analysis/                   # 분석 텍스트 생성 (Claude API)
│   ├── pdf/                        # PDF 조립 로직
│   ├── utils/                      # 유틸리티
│   │   ├── parseJson.ts            # JSON 파싱 + 검증
│   │   ├── extractInfo.ts          # JSON에서 이름, 성별, 생년월일 추출
│   │   └── filterByTier.ts         # 티어별 필요 섹션 필터링
│   └── constants/                  # 상수 (티어 정의, PDF 설정, 오행 컬러)
├── store/
│   └── useGeneratorStore.ts        # zustand 전역 상태
└── fonts/                          # 로컬 폰트 파일
```

---

## 웹 UI 플로우

```
Step 1: 티어 선택
  [Basic] [Love] [Full] [Premium]
  → 선택 시 하단에 포함 내용 요약 표시

Step 2: JSON 입력
  [파일 드롭 / 붙여넣기]
  → 파싱 성공 시 이름, 성별, 생년월일 자동 표시
  → 파싱 실패 시 에러 메시지

Step 3: 커버 이미지 (선택)
  [이미지 업로드]
  → 미리보기 썸네일 표시
  → 미입력 시 기본 디자인 커버 사용

Step 4: 테마 선택
  [Classic] [Modern] [Minimal] [Elegant]
  → Love 티어 선택 시 자동으로 Love 테마 고정 (변경 불가)

Step 5: 추가 요청사항 (선택)
  [textarea — placeholder: "예: 재물운 부분에 부동산 투자 관련 조언을 추가해주세요"]
  → Claude API 프롬프트에 주입됨
  → 최대 500자

Step 6: 생성
  [🚀 Generate PDF]
  → 파트별 진행률 표시 (예: "Part 3/10 — Love & Marriage...")
  → 완료 시 [📥 Download PDF] 버튼 활성화
```

---

## 상세 문서 (참조)
긴 설명은 아래 별도 파일에 분리. **해당 파일 작업 시에만 참조할 것.**

| 파일 | 내용 | 참조 시점 |
|------|------|----------|
| `docs/SAJU_TERMS.md` | 3-Layer 용어 사전 (십성/운성/오행/신살 등) | PDF 컴포넌트, 번역 로직 작업 시 |
| `docs/PDF_STRUCTURE.md` | PDF 페이지 구성 + 스타일 가이드 (티어별) | PDF 컴포넌트 작업 시 |
| `docs/THEMES.md` | 테마 5종 컬러 코드 (classic/modern/minimal/elegant/love) | 테마 시스템 작업 시 |
| `docs/PROMPTS.md` | 번역/분석 프롬프트 + 병렬 호출 구조 + 추가 요청사항 주입 방법 | API 연동 작업 시 |
| `docs/UI_FLOW.md` | 웹 UI 스텝별 화면 구성 상세 | 프론트엔드 작업 시 |
| `docs/LOVE_TIER.md` | Love 티어 전용 구성, 톤앤매너, 콘텐츠 가이드 | Love 관련 작업 시 |

---

## 핵심 규칙

### 3-Layer 용어 시스템
사주 용어는 항상 3겹으로 표현 (상세: `docs/SAJU_TERMS.md`):
```
① natural   = 영어권 고객이 바로 이해 ("Creative Expression")
② classical = 전통 영문 번역 ("Eating God")
③ original  = 한자 + 로마자 ("食神 Sik-sin")
```
- 본문 첫 등장: "**Creative Expression** (Eating God / 食神 Sik-sin)"
- 본문 재등장: "Creative Expression" 만
- 차트/테이블: natural 축약 + original
- Love 티어: natural 위주, classical/original은 최소화 (감성적 톤 유지)

### React-PDF 컴포넌트 규칙
- `@react-pdf/renderer` 전용: View, Text, Image만 (div/span/html 태그 금지)
- CSS Flexbox만 (Grid 불가)
- `StyleSheet.create()` 사용 필수
- 테마는 prop으로 받아 동적 스타일 적용
- 이미지는 base64로 전달 (외부 URL 불안정)
- 긴 텍스트는 `<Text>` wrap 기능으로 자동 페이지 분할
- 한글 폰트는 반드시 .ttf 파일로 등록 (시스템 폰트 사용 불가)

### 커버 이미지 처리
- 사용자가 업로드한 이미지 → FileReader로 base64 변환 → zustand store 저장
- PDF CoverPage에서 base64 string을 `<Image src={base64} />`로 삽입
- 미업로드 시 테마별 기본 커버 디자인 적용

### 추가 요청사항 처리
- 프론트엔드: textarea → zustand store `additionalRequest` 필드
- API 호출 시: Claude system prompt 끝에 다음 형태로 주입:
  ```
  [Additional Client Request]
  The client has specifically requested the following emphasis or additions:
  "{추가 요청사항 텍스트}"
  Please incorporate this request naturally into the analysis where relevant.
  ```
- 빈 값이면 이 블록 자체를 생략

### 번역/분석 API
- 섹션별 병렬 호출 (Promise.allSettled, 최대 동시 5개)
- 실패 시 원본 한글 fallback
- 분석 텍스트: 챕터당 300~500 words
- 각 API Route maxDuration: 120초 (vercel.json에서 설정)
- 프롬프트 상세: `docs/PROMPTS.md`

### 코딩 컨벤션
- `any` 금지 → `unknown` + 타입 가드
- enum 대신 `as const` 객체
- 서버 컴포넌트 기본, 클라이언트는 `'use client'` 명시
- 에러: try-catch + 사용자 토스트 알림
- 커밋: `feat:` / `fix:` / `style:` / `refactor:` / `docs:` / `chore:`

---

## Vercel 배포 설정

### vercel.json
```json
{
  "functions": {
    "src/app/api/translate/route.ts": {
      "maxDuration": 120
    },
    "src/app/api/generate-pdf/route.ts": {
      "maxDuration": 120
    }
  }
}
```

### 타임아웃 회피 전략
- Premium 티어(150페이지)는 파트별 분할 호출로 처리
- 프론트에서 파트별 순차 호출 → 각 호출 120초 이내 완료
- PDF 렌더링은 모든 텍스트 수집 완료 후 1회 호출
- 생성 플로우:
  ```
  [프론트엔드 루프]
  for (part of tierParts) {
    POST /api/translate { tier, partNumber, json, additionalRequest }
    → 텍스트 수집
    → 진행률 업데이트
  }
  
  [모든 파트 완료 후]
  POST /api/generate-pdf { tier, allTexts, json, coverImageBase64, theme }
  → PDF blob 리턴 → 다운로드
  ```

---

## 개발 순서

### Phase 1 — 기본 구조
1. Next.js + TypeScript 세팅 (`src/app/` 구조)
2. 패키지 설치: `@react-pdf/renderer`, `@anthropic-ai/sdk`, `zustand`
3. 타입 정의 (`lib/types/`) + JSON 파싱/검증 (`lib/utils/`)
4. 티어 시스템 (`lib/constants/`) + 티어별 섹션 필터링 (`filterByTier.ts`)
5. 테마 시스템 5종 (`pdf/styles/themes.ts`)
6. `vercel.json` + `.env.local` 설정

### Phase 2 — PDF 렌더링 (하드코딩 텍스트로 테스트)
7. 폰트 등록 (Noto Sans KR, Playfair Display, Inter)
8. 공통 PDF 컴포넌트: CoverPage, PartHeader, ChapterPage, CalloutBox, EndingPage
9. 데이터 차트: SajuChart, YongsinChart, YinyangChart
10. 신살/형충 테이블: ShinsalTable
11. 운세 카드: DaeunTimeline, NyununCard, WolunCard
12. 티어별 PdfDocument 조립 (Basic → Love → Full → Premium 순서)
13. **샘플 JSON으로 PDF 출력 테스트 (이 시점에서 반드시 검증)**

### Phase 3 — Claude API 연동
14. Claude API 클라이언트 (`lib/translate/`)
15. 티어별 프롬프트 설계 (`docs/PROMPTS.md` 작성 포함)
16. 병렬 번역 + 분석 텍스트 생성
17. 3-Layer 용어 변환 적용
18. 추가 요청사항 프롬프트 주입 로직

### Phase 4 — 웹 UI
19. zustand store 세팅
20. 메인 페이지: TierSelector → FileUploader → ImageUploader → ThemeSelector → AdditionalRequest → Generate 버튼
21. ProgressBar (파트별 진행 상태)
22. 완료 후 다운로드 버튼

### Phase 5 — 최적화 + 배포
23. 에러 핸들링 강화 (파싱 실패, API 실패, PDF 실패 각각 처리)
24. Vercel 배포
25. 4종 티어 × 다양한 JSON으로 E2E 테스트
26. 타임아웃/메모리 이슈 확인 및 조정

---

## 환경변수
```env
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_SITE_URL=https://pdf.sajumuse.com
```

---

## 주의사항
- **Puppeteer/Playwright 절대 사용 금지** — Vercel serverless에서 불안정, @react-pdf/renderer만 사용
- Vercel API Route 타임아웃: Pro 기준 maxDuration 120초로 설정 → 파트별 분할 호출로 해결
- 한자 폰트 용량 큼 → 서브셋 권장 (Noto Sans KR)
- @react-pdf/renderer는 웹 CSS와 문법 다름 (Flexbox만, Grid 불가)
- 커버 이미지, 차트 이미지 모두 base64로 전달
- Love 티어는 테마 고정 (love 테마), 다른 티어는 사용자 선택