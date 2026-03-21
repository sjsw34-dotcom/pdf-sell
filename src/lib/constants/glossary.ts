// ─── 용어집 데이터 (docs/terminology-3layer.md 기반) ───

export interface GlossaryEntry {
  english: string;
  romanization: string;
  korean: string;
  category: 'basic' | 'elements' | 'ten-gods' | 'life-stages' | 'interactions' | 'mystical';
}

export const GLOSSARY: GlossaryEntry[] = [
  // ── 기본 구조 ──
  { english: 'Four Pillars', romanization: 'Saju', korean: '사주 四柱', category: 'basic' },
  { english: 'Heavenly Stems', romanization: 'Cheongan', korean: '천간 天干', category: 'basic' },
  { english: 'Earthly Branches', romanization: 'Jiji', korean: '지지 地支', category: 'basic' },
  { english: 'Day Master', romanization: 'Ilgan', korean: '일간 日干', category: 'basic' },
  { english: 'Year Pillar', romanization: 'Yeonju', korean: '연주 年柱', category: 'basic' },
  { english: 'Month Pillar', romanization: 'Wolju', korean: '월주 月柱', category: 'basic' },
  { english: 'Day Pillar', romanization: 'Ilju', korean: '일주 日柱', category: 'basic' },
  { english: 'Hour Pillar', romanization: 'Siju', korean: '시주 時柱', category: 'basic' },
  { english: 'Useful God', romanization: 'Yongsin', korean: '용신 用神', category: 'basic' },
  { english: 'Favorable God', romanization: 'Huisin', korean: '희신 喜神', category: 'basic' },
  { english: 'Unfavorable God', romanization: 'Gisin', korean: '기신 忌神', category: 'basic' },
  { english: 'Hostile God', romanization: 'Gusin', korean: '구신 仇神', category: 'basic' },
  { english: 'Idle God', romanization: 'Hansin', korean: '한신 閑神', category: 'basic' },
  { english: 'Hidden Stems', romanization: 'Jijangang', korean: '지장간 地藏干', category: 'basic' },
  { english: 'Grand Fortune', romanization: 'Daeun', korean: '대운 大運', category: 'basic' },
  { english: 'Annual Fortune', romanization: 'Nyeonun / Seun', korean: '년운 年運 / 세운 歲運', category: 'basic' },
  { english: 'Monthly Fortune', romanization: 'Wolun', korean: '월운 月運', category: 'basic' },
  { english: 'Sexagenary Cycle', romanization: 'Yukshipgapja', korean: '60갑자 六十甲子', category: 'basic' },

  // ── 오행 ──
  { english: 'Wood', romanization: 'Mok', korean: '목 木', category: 'elements' },
  { english: 'Fire', romanization: 'Hwa', korean: '화 火', category: 'elements' },
  { english: 'Earth', romanization: 'To', korean: '토 土', category: 'elements' },
  { english: 'Metal', romanization: 'Geum', korean: '금 金', category: 'elements' },
  { english: 'Water', romanization: 'Su', korean: '수 水', category: 'elements' },

  // ── 십신 ──
  { english: 'Friend', romanization: 'Bigyeon', korean: '비견 比肩', category: 'ten-gods' },
  { english: 'Rob Wealth', romanization: 'Geopjae', korean: '겁재 劫財', category: 'ten-gods' },
  { english: 'Eating God', romanization: 'Siksin', korean: '식신 食神', category: 'ten-gods' },
  { english: 'Hurting Officer', romanization: 'Sanggwan', korean: '상관 傷官', category: 'ten-gods' },
  { english: 'Indirect Wealth', romanization: 'Pyeonjae', korean: '편재 偏財', category: 'ten-gods' },
  { english: 'Direct Wealth', romanization: 'Jeongjae', korean: '정재 正財', category: 'ten-gods' },
  { english: 'Indirect Officer', romanization: 'Pyeongwan / Chilsal', korean: '편관 偏官 / 칠살 七殺', category: 'ten-gods' },
  { english: 'Direct Officer', romanization: 'Jeonggwan', korean: '정관 正官', category: 'ten-gods' },
  { english: 'Indirect Seal', romanization: 'Pyeonin', korean: '편인 偏印', category: 'ten-gods' },
  { english: 'Direct Seal', romanization: 'Jeongin', korean: '정인 正印', category: 'ten-gods' },

  // ── 12운성 ──
  { english: 'Birth', romanization: 'Jangsaeng', korean: '장생 長生', category: 'life-stages' },
  { english: 'Bathing', romanization: 'Mogyok', korean: '목욕 沐浴', category: 'life-stages' },
  { english: 'Crown', romanization: 'Gwandae', korean: '관대 冠帶', category: 'life-stages' },
  { english: 'Prime', romanization: 'Geollog', korean: '건록 建祿', category: 'life-stages' },
  { english: 'Peak', romanization: 'Jewang', korean: '제왕 帝旺', category: 'life-stages' },
  { english: 'Decline', romanization: 'Soe', korean: '쇠 衰', category: 'life-stages' },
  { english: 'Sickness', romanization: 'Byeong', korean: '병 病', category: 'life-stages' },
  { english: 'Death', romanization: 'Sa', korean: '사 死', category: 'life-stages' },
  { english: 'Tomb', romanization: 'Myo', korean: '묘 墓', category: 'life-stages' },
  { english: 'Extinction', romanization: 'Jeol', korean: '절 絶', category: 'life-stages' },
  { english: 'Conception', romanization: 'Tae', korean: '태 胎', category: 'life-stages' },
  { english: 'Nurture', romanization: 'Yang', korean: '양 養', category: 'life-stages' },

  // ── 상호작용 ──
  { english: 'Productive Cycle', romanization: 'Sangsaeng', korean: '상생 相生', category: 'interactions' },
  { english: 'Controlling Cycle', romanization: 'Sangguk', korean: '상극 相剋', category: 'interactions' },
  { english: 'Clash', romanization: 'Chung', korean: '충 沖', category: 'interactions' },
  { english: 'Harmony', romanization: 'Hap', korean: '합 合', category: 'interactions' },
  { english: 'Triple Harmony', romanization: 'Samhap', korean: '삼합 三合', category: 'interactions' },
  { english: 'Directional Harmony', romanization: 'Banghap', korean: '방합 方合', category: 'interactions' },
  { english: 'Six Harmony', romanization: 'Yukhap', korean: '육합 六合', category: 'interactions' },

  // ── 신살 ──
  { english: 'Nobleman Star', romanization: 'Cheoneuil Gwilin', korean: '천을귀인 天乙貴人', category: 'mystical' },
  { english: 'Peach Blossom', romanization: 'Dohwa', korean: '도화 桃花', category: 'mystical' },
  { english: 'Traveling Horse', romanization: 'Yeokma', korean: '역마 驛馬', category: 'mystical' },
  { english: 'Void/Empty', romanization: 'Gongmang', korean: '공망 空亡', category: 'mystical' },
];

export const GLOSSARY_CATEGORY_LABELS: Record<GlossaryEntry['category'], string> = {
  basic: 'Basic Structure',
  elements: 'Five Elements (五行)',
  'ten-gods': 'Ten Gods (十神)',
  'life-stages': 'Twelve Life Stages (十二運星)',
  interactions: 'Element Interactions',
  mystical: 'Mystical Stars (神殺)',
};
