# eBook 생성 순서 (전체 마스터 리스트)

## 연계성 유지 규칙
- 매 세션 시작 시 `chapters/` 폴더의 기존 챕터 파일 확인 → 어디까지 완료됐는지 파악
- `docs/writing-rules.md`, `docs/terminology-3layer.md`, `docs/book-toc.md` 참조 → 문체/용어/구성 일관성 유지
- `sample/` 폴더의 차트 데이터 로드 → 해당 챕터에 맞는 차트 사용
- 각 챕터는 `chapters/chapter-NN-slug.md`로 저장

---

## Phase 0: 인프라 (완료)
- [x] DOCX 빌더 기본 구조 (`buildEbookDocx.ts`)
- [x] Copyright / Preface / About Author / Glossary / Appendix 페이지
- [x] 마크다운 테이블, 사주차트(`:::saju-chart`), 이미지(`![]()`), 케이스스터디(`:::case-study`) 파싱

---

## Phase 1: KDP Edition 챕터 작성 (Ch 1~15)

### Part 1: Foundations of Saju
- [x] `01` Chapter 1: What Is Saju?
- [x] `02` Chapter 2: The History of Four Pillars
- [x] `03` Chapter 3: The Four Pillars — Your Birth Chart Explained
- [x] `04` Chapter 4: The Day Master — The Core of Your Identity

### Part 2: The Five Elements
- [x] `05` Chapter 5: Understanding the Five Elements
- [x] `06` Chapter 6: Element Interactions
- [x] `07` Chapter 7: The Useful God (用神)
- [x] `08` Chapter 8: Element Balance and Your Life

### Part 3: The Ten Gods
- [x] `09` Chapter 9: Introduction to the Ten Gods
- [x] `10` Chapter 10: The Output Stars
- [x] `11` Chapter 11: The Wealth Stars
- [x] `12` Chapter 12: The Authority Stars
- [x] `13` Chapter 13: The Resource Stars
- [x] `14` Chapter 14: The Companion Stars
- [x] `15` Chapter 15: Ten Gods in Combination

---

## Phase 2: Full Edition 챕터 작성 (Ch 16~28)

### Part 4: The Twelve Life Stages
- [ ] `16` Chapter 16: The Cycle of Energy
- [ ] `17` Chapter 17: Each Stage Explained
- [ ] `18` Chapter 18: Life Stages in Practice

### Part 5: Fortune Cycles
- [ ] `19` Chapter 19: Grand Fortune (大運)
- [ ] `20` Chapter 20: Annual Fortune (年運)
- [ ] `21` Chapter 21: Monthly Fortune (月運)

### Part 6: Reading a Chart
- [ ] `22` Chapter 22: The Art of Saju Interpretation
- [ ] `23` Chapter 23: Love & Relationship Reading
- [ ] `24` Chapter 24: Career & Wealth Reading
- [ ] `25` Chapter 25: Health Reading
- [ ] `26` Chapter 26: Comprehensive Reading — Full Chart Analysis

### Part 7: Advanced Topics
- [ ] `27` Chapter 27: Special Formations (格局 & 神殺) ※ 윤달(Leap Month) 섹션 포함
- [ ] `28` Chapter 28: Saju in the Modern World

---

## Phase 3: 최종 조립 & 출간
- [ ] KDP DOCX 합본 빌드 (Ch 1~15 + What's Next CTA)
- [ ] Full DOCX 합본 빌드 (Ch 1~28)
- [ ] 최종 검수 & KDP 업로드
