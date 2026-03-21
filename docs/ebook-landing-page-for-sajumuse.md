# sajumuse.com/ebook 홍보 페이지 설계

## 페이지 URL: sajumuse.com/ebook

---

## 페이지 구조 (위에서 아래로)

### 섹션 1: 히어로

"The Astrology System Behind K-pop, K-drama, and Korean Culture"

Finally in English. Written by a certified Korean Saju master
with 15+ years of experience and 138+ verified readings.

Learn to read the same birth chart system that Korean celebrities,
business leaders, and millions of Koreans trust for life's biggest decisions.

[Get the Full Guide - $99]
[Preview Free Chapter]

---

### 섹션 2: K-pop/K-Culture 사례 (후킹 핵심)

제목: "What Korean Birth Charts Reveal About the World's Biggest Stars"

설명: "We analyzed the Saju charts of some of K-pop's most iconic figures.
No names - just their birth data and what the Four Pillars reveal.
See if you can guess who they are."

#### 사례 카드 형식 (각 카드마다):

Mystery Chart #1

Born: December 1995 | Male
Day Master: Yang Fire
Element Balance: Fire dominant

"Triple Fire energy in his chart makes him a natural-born performer.
His Grand Fortune shifted at 25 - exactly when the world couldn't
stop watching him."

Key trait: Explosive charisma that can't be taught - it's written
in his birth chart.

-> Learn what Fire energy means in Chapter 5 of the book

#### 사례 후보 (마스터님이 실제 차트 분석 후 선별)

주의사항:
- 실명 절대 사용 금지
- 생년월 + 성별만 표기 (일/시 미표기)
- "A globally known idol born in..." 형식
- 팬이 알아볼 수 있을 정도의 힌트만
- 부정적 해석 금지 (건강 문제, 이혼 등 언급 안 함)
- 긍정적/흥미로운 해석 위주

카드 3-5개 구성 제안:

| # | 힌트 | 일간 예상 | 후킹 포인트 |
|---|------|---------|-----------|
| 1 | 90년대 중반생 남자, 글로벌 솔로 아이돌 | 양화/양목 | 무대 위 카리스마의 비밀 |
| 2 | 90년대 후반생 여자, 4인조 걸그룹 | 음수/음금 | 차가운 외모 뒤의 따뜻한 오행 |
| 3 | 80년대생 남자 배우, 한류 톱스타 | 양토/양금 | 대운이 바뀌면서 세계적 스타가 된 타이밍 |
| 4 | 2000년대생 아이돌, 4세대 대표 | 양수/음목 | Z세대 에너지가 차트에 그대로 |
| 5 | 90년대생 남자 그룹, 전설적 리더 | 양금/음화 | 리더십이 사주에 새겨진 사람 |

---

### 섹션 3: 책 소개 + 목차 미리보기

"What's Inside"

Part 1: Foundations - What is Saju and how does it work?
Part 2: Five Elements - The forces that shape your personality
Part 3: Ten Gods - The hidden relationships in your chart
Part 4: Life Stages - Your energy cycle from birth to rebirth
Part 5: Fortune Cycles - When your luck peaks (and dips)
Part 6: Real Readings - Complete chart analyses with case studies
Part 7: Advanced - Special formations and modern applications

300+ pages | 28 chapters | 6 real chart case studies
Written by a certified Korean Saju master (not AI-generated)

---

### 섹션 4: 저자 소개 (신뢰 구축)

"Meet the Author"

Master Kim has practiced Korean Saju for over 15 years,
holding Level 1 certifications in both Myeongri Psychology
Counseling and Family Psychology Counseling from Korea's
Education and Certification Authority.

With 138+ verified client reviews and hundreds of personal
consultations, he brings the depth of traditional Korean
wisdom to English-speaking readers for the first time.

[당근마켓 리뷰 캡처 2-3개]

---

### 섹션 5: 가격 및 구매

Full Edition - $99 one-time
- All 28 chapters (300+ pages)
- 6 real chart case studies
- Five Element worksheet (PDF)
- Ten Gods quick reference card
- Free mini Saju reading coupon

[Get Full Edition - $99]

Already read the Kindle edition?
[Upgrade for $67]

---

Bundle: Book + Personal Reading - $119 one-time (Save $9)
- Everything in Full Edition
- Your personal 60+ page Saju report by the author himself

[Get Bundle - $119]

---

### 섹션 6: FAQ

Q: Is this the same system used in K-dramas?
A: Yes! When you see characters visiting a fortune teller
in Korean dramas, they're usually getting a Saju reading.

Q: Do I need to know Korean?
A: Not at all. Everything is explained in English with our
3-Layer terminology system (English + Classical + Korean).

Q: What's the difference between the Kindle and Full Edition?
A: The Kindle edition ($32) covers foundations, Five Elements,
and Ten Gods (Part 1-3). The Full Edition adds Fortune
Cycles, real case studies, compatibility readings, and
advanced topics (Part 4-7) plus bonus materials.

Q: Is this AI-generated?
A: No. This book is written by a certified Korean Saju master
with 15+ years of hands-on experience. Every interpretation
and case study comes from real expertise, not algorithms.

Q: Can I learn to read my own chart with this book?
A: Absolutely. By the end of the book, you'll be able to
interpret any Four Pillars chart. Or if you'd prefer an
expert reading, we offer personalized reports at
sajumuse.com/order.

---

### 섹션 7: 최하단 CTA

"Your birth chart has been waiting for you to read it."

[Get the Full Guide - $99]

Not sure yet? Try a free mini reading first
[Get Free Reading]

---

## 기술 구현 노트 (Claude Code용)

### 새 페이지 생성
- 파일: /app/ebook/page.tsx (또는 기존 라우팅 구조에 맞게)
- 기존 sajumuse.com 디자인 시스템/컴포넌트 재사용
- 반응형 (모바일 우선)

### K-pop 사례 카드
- 컴포넌트화 (재사용 가능하게)
- 데이터는 JSON 또는 상수로 관리 (나중에 추가/수정 쉽게)
- 각 카드에 해당 챕터 링크 연결 (미리보기 챕터가 있을 경우)

### 결제 버튼
- 기존 Toss/PayPal 결제 방식 그대로
- $99 / $67 / $119 세 가지 상품 등록
- $67 업그레이드: Amazon 주문번호 입력 필드 추가

### 네비게이션
- 기존 헤더에 "Ebook" 메뉴 추가 (Home | About | Blog | Ebook)
- 메인 페이지 가격 섹션에도 전자책 언급 추가

### SEO
- Title: "The Complete Guide to Korean Saju - Learn Four Pillars of Destiny"
- Meta: "Learn Korean astrology from a certified Saju master. 300+ page guide with real chart analyses. Available as ebook."
- Keywords: Korean astrology book, Saju guide, Four Pillars book, learn Saju, Korean fortune telling guide
