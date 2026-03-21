---
name: saju-ebook-writer
description: 한국 사주명리학(四柱命理學) 영문 전자책 집필 스킬. 사주 JSON 차트 데이터와 목차를 기반으로 챕터별 영문 원고를 생성한다. 3-Layer 용어 시스템(자연스러운 영어 / 고전 번역 / 한자+로마자)을 적용하고, 샘플 차트를 활용한 실전 해석 사례를 포함한다. 다음 상황에서 반드시 이 스킬을 사용할 것 — 사주 전자책 작성, 사주 교재 집필, Saju ebook writing, Four Pillars ebook, 사주 챕터 작성, 전자책 원고 생성, saju textbook chapter, ebook chapter draft, 사주 영문 교재. 사주 전자책이나 영문 사주 교재 관련 요청이면 무조건 참조.
---

# Saju Ebook Writer Skill

## 프로젝트 개요
- **책 제목 (풀버전):** The Complete Guide to Korean Saju: Master the Four Pillars of Destiny
- **책 제목 (KDP 입문버전):** Korean Saju Decoded: Your First Step into the Four Pillars of Destiny
- **저자 필명:** Ksaju Kim — Certified Korean Saju Counselor, 15+ Years
- **언어:** English (3-Layer 용어 시스템 적용)
- **분량:** 풀버전 200~300 pages (28 chapters, 7 parts) / KDP 입문버전 ~150 pages (Part 1~3)
- **가격:** 풀버전 $99 (sajumuse.com) / 입문버전 $32 (Amazon KDP)
- **판매 채널:** sajumuse.com (메인) + Amazon KDP (입문버전) + Fiverr (기존 계정 연동)
- **퍼널:** KDP $32 → sajumuse.com 풀버전 $99 → 개인 리포트 $29~55 → 번들 $119

## 2단 판매 구조
- **KDP 입문버전 ($32):** Part 1~3 (Chapter 1~15), 기초+오행+십신
- **sajumuse.com 풀버전 ($99):** 전체 28챕터 + 보너스 (워크시트, 퀵 레퍼런스 카드, 미니 리딩 쿠폰)
- **KDP→풀버전 업그레이드 ($67):** 차액만 결제
- **번들 ($119):** 풀버전 + Premium Report ($9 할인)
- KDP 입문버전 마지막에 풀버전/개인 리포트 CTA 삽입 (LUNA 모델 차용)

## 작업 흐름

### 챕터 작성 요청 시
1. `docs/book-toc.md` 읽기 — 해당 챕터의 목차와 위치 확인
2. `docs/terminology-3layer.md` 읽기 — 용어 규칙 확인
3. `docs/writing-rules.md` 읽기 — 문체/구성 규칙 확인
4. 필요한 샘플 차트 로드 — `docs/sample-charts/` 에서 해당 챕터에 맞는 차트 선택
5. 챕터 원고 작성 (영문)
6. PDF 생성 (기존 pdf_sell 기반 PDF 엔진 활용)

### 챕터 구성 공통 템플릿
모든 챕터는 다음 구조를 따른다:

# Chapter [N]: [Title]

[도입부 - 독자의 호기심을 끄는 질문 또는 상황 제시]

## [섹션 1: 개념 설명]
(이론, 원리, 배경 지식)

## [섹션 2: 차트에서 읽는 법]
(실전 적용 - 어디를 보고, 어떻게 판단하는가)

## [섹션 3: 해석 사례]
(샘플 차트를 사용한 실제 해석 예시)
-> "Let's look at Chart B (a 31-year-old woman born in 1996)..."

## Key Takeaways
- 핵심 포인트 3~5개 요약

## Try It Yourself
(독자가 자기 차트에 적용해보는 실습 과제)

---
Want to see these principles applied to YOUR birth chart?
-> Get your personalized reading at sajumuse.com

## 샘플 차트

차트 데이터는 `docs/sample-charts/` 디렉토리에 JSON 파일로 저장되어 있다.
차트는 추가 가능하며, 다양한 일간을 커버할수록 좋다.

### 기본 차트 6개 + 궁합 1쌍

| 코드 | 파일 | 성별 | 출생년 | 나이 | 일간 | 용신 | 주요 특징 |
|------|------|------|--------|------|------|------|---------|
| A | chart-a-1960f.json | 여 | 1960 | 67 | 乙木 | 木 | 대운 후반, 강변약 |
| B | chart-b-1996f.json | 여 | 1996 | 31 | 乙木 | 木 | 극신약, 식상3 비겁0 |
| C | chart-c-1989f.json | 여 | 1989 | 38 | 癸水 | 水 | 木0 金0 극단 편중, 재성4 관성3 |
| D | chart-d-1975f.json | 여 | 1975 | 52 | 壬水 | 水 | 식상3 木 과다 |
| E | chart-e-1990m.json | 남 | 1990 | 37 | 戊土 | 火 | 陽8 陰0, 金4 水0 극단 편중 |
| F | chart-f-2001m.json | 남 | 2001 | 26 | 庚金 | 金 | 土0 인성0, 관성3 |
| 궁합 | B+F 조합 | - | - | - | 乙+庚 | - | 천간합(乙庚合金) |

### 추가 차트 (마스터가 추가 시)
- 파일명 규칙: chart-[코드]-[출생년][성별].json (예: chart-g-1985m.json)
- 아직 커버 안 된 일간: 甲(양목), 丙(양화), 丁(음화), 己(음토), 辛(신금)
- 특수 사례 (종격, 극단 편중, 대운 전환점 등) 추가 권장
- 모든 차트의 이름은 익명 처리 — 전자책에서는 Chart A~Z 코드로만 참조

### 차트 사용 가이드
- **기초 개념 설명 (Part 1~2):** Chart A 또는 B 사용 (乙木, 가장 직관적)
- **십신 해설 (Part 3):** 각 십신이 두드러진 차트 선택
  - 식상 과다: Chart B (식상3), Chart E (식신4)
  - 재성 과다: Chart C (재성4)
  - 관성 과다: Chart F (관성3)
  - 비겁 부재: Chart B, C (비겁0)
  - 인성 부재: Chart C, F (인성0)
- **12운성 (Part 4):** Chart D (다양한 운성 분포)
- **대운/년운 (Part 5):** Chart A (대운 10기간 풀세트, 인생 후반부 분석)
- **실전 해석 (Part 6):**
  - 애정운: Chart B + F 궁합
  - 직업운: Chart E (극단적 양 에너지)
  - 건강운: Chart C (오행 결핍 심각)
- **종합 해석 (Part 6 Case Studies):**
  - Case A: Chart F (26세 남성, 진로 탐색)
  - Case B: Chart B + F (궁합 분석)
  - Case C: Chart D (52세 여성, 인생 전환점)

## CTA 삽입 규칙

### KDP 입문버전 (Part 1~3)
- 각 챕터 끝 "Try It Yourself"에서 sajumuse.com 자연스럽게 언급
- Chapter 15 다음에 "What's Next?" 섹션 삽입 — 풀버전 + 개인 리포트 CTA
- Part 4~7 내용을 잠금 티저로 보여주기 (LUNA 모델)

### 풀버전 (전체)
- Part 1~5: 챕터 끝 "Try It Yourself"에서 자연스럽게 언급
- Part 6~7: 각 챕터 끝에 sajumuse.com/order CTA 삽입
- 마지막 챕터 후: "개인 리포트 받아보세요" 최종 CTA
- 과도한 홍보 금지 - 교육적 가치가 우선

## PDF 생성
- 기존 pdf_sell 프로젝트의 PDF 엔진을 복사하여 사용
- 한자(漢字), 한글, 영어 혼합 렌더링 — 기존 폰트/레이아웃 설정 활용
- 전자책 형태로 레이아웃 조정 (개인 리포트 형태 -> 교재 형태)
- KDP 요구사항: 6" x 9" 페이지, 300 DPI 이미지

## 출력 형식
- 각 챕터를 개별 markdown 파일로 출력
- 파일명: `chapter-[NN]-[slug].md` (예: `chapter-01-what-is-saju.md`)
- 최종 합본: 전체 markdown -> PDF 변환
- KDP 입문버전: Chapter 1~15 + "What's Next?" 섹션만 합본
- 풀버전: 전체 Chapter 1~28 + Appendix 합본
