// ─── 워크북 전용 조견표 및 프로필 데이터 ───

import { HEAVENLY_STEMS, EARTHLY_BRANCHES } from './appendixTables';

// ─── 연주 조견표 (60갑자 순환) ───

/** 연도로부터 천간 인덱스 산출: (year - 4) % 10 */
export function getYearStemIndex(year: number): number {
  return ((year - 4) % 10 + 10) % 10;
}

/** 연도로부터 지지 인덱스 산출: (year - 4) % 12 */
export function getYearBranchIndex(year: number): number {
  return ((year - 4) % 12 + 12) % 12;
}

export interface YearPillarEntry {
  year: number;
  stem: string;       // e.g. "Gap (甲)"
  branch: string;     // e.g. "Ja (子) Rat"
  element: string;    // stem element
  polarity: string;   // Yang/Yin
}

export function getYearPillar(year: number): YearPillarEntry {
  const si = getYearStemIndex(year);
  const bi = getYearBranchIndex(year);
  const stem = HEAVENLY_STEMS[si];
  const branch = EARTHLY_BRANCHES[bi];
  return {
    year,
    stem: `${stem.romanization} (${stem.hanja})`,
    branch: `${branch.romanization} (${branch.hanja}) ${branch.animal}`,
    element: stem.element,
    polarity: stem.polarity,
  };
}

/** 워크북용 연주 조견표 (1960~2026) */
export const YEAR_PILLAR_TABLE: YearPillarEntry[] =
  Array.from({ length: 67 }, (_, i) => getYearPillar(1960 + i));

// ─── 월주 결정표 ───
// 월지는 고정: 인(1월/Tiger)~축(12월/Ox)
// 월간은 연간에 따라 5가지 패턴

/** 연간 → 월간 시작 인덱스 (정월 인월의 천간) */
export const MONTH_STEM_START: Record<string, number> = {
  'Gap':    2,  // 丙 Byeong
  'Gi':     2,  // 丙 (same cycle)
  'Eul':    4,  // 戊 Mu
  'Gyeong': 4,  // 戊 (same cycle)
  'Byeong': 6,  // 庚 Gyeong
  'Sin':    6,  // 庚 (same cycle)
  'Jeong':  8,  // 壬 Im
  'Im':     8,  // 壬 (same cycle)
  'Mu':     0,  // 甲 Gap
  'Gye':    0,  // 甲 (same cycle)
};

/** 월 지지 (1월=인~12월=축) */
export const MONTH_BRANCHES = [
  { month: 1,  branch: 'In (寅) Tiger',    approxDates: 'Feb 4 – Mar 5' },
  { month: 2,  branch: 'Myo (卯) Rabbit',  approxDates: 'Mar 6 – Apr 4' },
  { month: 3,  branch: 'Jin (辰) Dragon',  approxDates: 'Apr 5 – May 5' },
  { month: 4,  branch: 'Sa (巳) Snake',    approxDates: 'May 6 – Jun 5' },
  { month: 5,  branch: 'O (午) Horse',     approxDates: 'Jun 6 – Jul 6' },
  { month: 6,  branch: 'Mi (未) Goat',     approxDates: 'Jul 7 – Aug 7' },
  { month: 7,  branch: 'Sin (申) Monkey',  approxDates: 'Aug 8 – Sep 7' },
  { month: 8,  branch: 'Yu (酉) Rooster',  approxDates: 'Sep 8 – Oct 7' },
  { month: 9,  branch: 'Sul (戌) Dog',     approxDates: 'Oct 8 – Nov 6' },
  { month: 10, branch: 'Hae (亥) Pig',     approxDates: 'Nov 7 – Dec 6' },
  { month: 11, branch: 'Ja (子) Rat',      approxDates: 'Dec 7 – Jan 5' },
  { month: 12, branch: 'Chuk (丑) Ox',     approxDates: 'Jan 6 – Feb 3' },
];

// ─── 시주 결정표 ───
// 시지는 시간대로 고정 (자시 23:00~01:00 → 해시 21:00~23:00)
// 시간은 일간에 따라 5가지 패턴

export const HOUR_STEM_START: Record<string, number> = {
  'Gap':    0,  // 甲 Gap
  'Gi':     0,  // 甲
  'Eul':    2,  // 丙 Byeong
  'Gyeong': 2,  // 丙
  'Byeong': 4,  // 戊 Mu
  'Sin':    4,  // 戊
  'Jeong':  6,  // 庚 Gyeong
  'Im':     6,  // 庚
  'Mu':     8,  // 壬 Im
  'Gye':    8,  // 壬
};

export const HOUR_BRANCHES = [
  { branch: 'Ja (子) Rat',      timeRange: '23:00 – 00:59' },
  { branch: 'Chuk (丑) Ox',     timeRange: '01:00 – 02:59' },
  { branch: 'In (寅) Tiger',    timeRange: '03:00 – 04:59' },
  { branch: 'Myo (卯) Rabbit',  timeRange: '05:00 – 06:59' },
  { branch: 'Jin (辰) Dragon',  timeRange: '07:00 – 08:59' },
  { branch: 'Sa (巳) Snake',    timeRange: '09:00 – 10:59' },
  { branch: 'O (午) Horse',     timeRange: '11:00 – 12:59' },
  { branch: 'Mi (未) Goat',     timeRange: '13:00 – 14:59' },
  { branch: 'Sin (申) Monkey',  timeRange: '15:00 – 16:59' },
  { branch: 'Yu (酉) Rooster',  timeRange: '17:00 – 18:59' },
  { branch: 'Sul (戌) Dog',     timeRange: '19:00 – 20:59' },
  { branch: 'Hae (亥) Pig',     timeRange: '21:00 – 22:59' },
];

// ─── Day Master 10종 프로필 ───

export interface DayMasterProfile {
  stem: string;        // e.g. "Gap (甲)"
  element: string;     // e.g. "Yang Wood"
  nickname: string;    // e.g. "The Towering Tree"
  personality: string;
  strengths: string[];
  challenges: string[];
  careers: string[];
  metaphor: string;
}

export const DAY_MASTER_PROFILES: DayMasterProfile[] = [
  {
    stem: 'Gap (甲)',
    element: 'Yang Wood',
    nickname: 'The Towering Tree',
    personality: 'You are ambitious, upright, and growth-oriented. Like a tall tree reaching for sunlight, you have a strong sense of direction and natural leadership. You prefer to stand your ground rather than bend.',
    strengths: ['Natural leader with clear vision', 'Strong moral compass and integrity', 'Resilient and determined under pressure'],
    challenges: ['Can be rigid and stubborn', 'Difficulty adapting to sudden change', 'May overlook details in pursuit of the big picture'],
    careers: ['CEO / Founder', 'Lawyer or judge', 'Architect or urban planner'],
    metaphor: 'A mighty oak — impressive and enduring, but needs deep roots and space to grow.',
  },
  {
    stem: 'Eul (乙)',
    element: 'Yin Wood',
    nickname: 'The Vine',
    personality: 'You are adaptable, gentle, and socially savvy. Like a vine that finds its way around any obstacle, you thrive through flexibility and connection. You excel at reading people and situations.',
    strengths: ['Highly adaptable and resourceful', 'Excellent social and networking skills', 'Creative problem-solver'],
    challenges: ['Can be indecisive or people-pleasing', 'May rely too much on others for support', 'Tendency to avoid direct confrontation'],
    careers: ['Diplomat or mediator', 'Designer or artist', 'Marketing strategist'],
    metaphor: 'A wisteria vine — beautiful, resilient, and always finding a way to climb higher.',
  },
  {
    stem: 'Byeong (丙)',
    element: 'Yang Fire',
    nickname: 'The Blazing Sun',
    personality: 'You are warm, charismatic, and radiant. Like the sun, you naturally draw people to you and light up any room. You are generous with your energy and optimistic by nature.',
    strengths: ['Charismatic and inspiring to others', 'Generous and warm-hearted', 'Bold and action-oriented'],
    challenges: ['Can burn out from giving too much', 'Impatient with slow progress', 'May dominate conversations or situations'],
    careers: ['Entertainer or public speaker', 'Entrepreneur', 'Teacher or motivational coach'],
    metaphor: 'The midday sun — brilliant and life-giving, but needs to learn when to let others shine.',
  },
  {
    stem: 'Jeong (丁)',
    element: 'Yin Fire',
    nickname: 'The Candle Flame',
    personality: 'You are perceptive, passionate, and quietly intense. Like a candle flame, your light is focused and intimate. You see what others miss and have a gift for deep, meaningful connection.',
    strengths: ['Highly perceptive and intuitive', 'Deep thinker with rich inner world', 'Passionate and dedicated once committed'],
    challenges: ['Prone to overthinking and worry', 'Can be moody or emotionally volatile', 'May struggle to let go of past hurts'],
    careers: ['Psychologist or counselor', 'Writer or filmmaker', 'Researcher or data analyst'],
    metaphor: 'A candle in a dark room — small but powerful, illuminating what matters most.',
  },
  {
    stem: 'Mu (戊)',
    element: 'Yang Earth',
    nickname: 'The Great Mountain',
    personality: 'You are stable, reliable, and trustworthy. Like a mountain, you provide shelter and support to everyone around you. You are patient, grounded, and rarely shaken.',
    strengths: ['Rock-solid reliability and trust', 'Patient and methodical', 'Natural mediator and stabilizer'],
    challenges: ['Can be overly cautious or slow to act', 'Resistant to change', 'May suppress emotions behind a calm exterior'],
    careers: ['Finance or banking', 'Real estate development', 'Government administrator'],
    metaphor: 'Mount Everest — unmovable, majestic, and a reference point for everyone around.',
  },
  {
    stem: 'Gi (己)',
    element: 'Yin Earth',
    nickname: 'The Garden Soil',
    personality: 'You are nurturing, detail-oriented, and quietly productive. Like rich garden soil, you help things grow around you. You are practical, humble, and deeply caring.',
    strengths: ['Nurturing and supportive of others', 'Excellent attention to detail', 'Practical and grounded decision-maker'],
    challenges: ['Can worry excessively about small things', 'May undervalue your own contributions', 'Tendency toward self-sacrifice'],
    careers: ['Healthcare or nursing', 'Educator', 'Chef or food industry'],
    metaphor: 'A garden bed in spring — modest in appearance, but everything blooms because of you.',
  },
  {
    stem: 'Gyeong (庚)',
    element: 'Yang Metal',
    nickname: 'The Sword',
    personality: 'You are decisive, disciplined, and fiercely principled. Like a forged sword, you are sharp, direct, and built for action. You value justice and are not afraid to cut through confusion.',
    strengths: ['Decisive and action-oriented', 'Strong sense of justice and fairness', 'Disciplined and competitive'],
    challenges: ['Can be blunt or insensitive', 'Difficulty showing vulnerability', 'May be overly rigid in beliefs'],
    careers: ['Military or law enforcement', 'Surgeon or engineer', 'Professional athlete or coach'],
    metaphor: 'A samurai sword — beautiful, lethal, and defined by its edge.',
  },
  {
    stem: 'Sin (辛)',
    element: 'Yin Metal',
    nickname: 'The Jewel',
    personality: 'You are refined, sensitive, and quality-driven. Like a polished gem, you have an eye for beauty and perfection. You are articulate, elegant, and hold yourself to high standards.',
    strengths: ['Refined aesthetic sense', 'Articulate and persuasive communicator', 'High standards drive excellence'],
    challenges: ['Can be perfectionistic and critical', 'Sensitive to rejection or criticism', 'May appear aloof or elitist'],
    careers: ['Jewelry or fashion designer', 'Editor or critic', 'Financial analyst'],
    metaphor: 'A diamond — formed under pressure, brilliant when polished, and always noticing flaws.',
  },
  {
    stem: 'Im (壬)',
    element: 'Yang Water',
    nickname: 'The Ocean',
    personality: 'You are expansive, intellectual, and freedom-loving. Like the ocean, you are vast in your thinking and refuse to be contained. You are a natural philosopher with a thirst for knowledge.',
    strengths: ['Broad-minded and philosophical', 'Excellent at seeing the big picture', 'Adventurous and open to new experiences'],
    challenges: ['Can be scattered or unfocused', 'Difficulty with routine and structure', 'May seem emotionally detached'],
    careers: ['Philosopher or academic', 'Travel or import/export', 'Tech visionary or strategist'],
    metaphor: 'The Pacific Ocean — vast, deep, and impossible to contain.',
  },
  {
    stem: 'Gye (癸)',
    element: 'Yin Water',
    nickname: 'The Rain',
    personality: 'You are intuitive, gentle, and quietly nourishing. Like gentle rain, you give life to everything you touch without demanding attention. You are emotionally intelligent and deeply empathetic.',
    strengths: ['Highly empathetic and emotionally intelligent', 'Quietly persistent and patient', 'Creative and imaginative'],
    challenges: ['Can be overly passive or hesitant', 'Tendency toward melancholy or worry', 'May absorb others emotions too easily'],
    careers: ['Therapist or social worker', 'Musician or poet', 'Spiritual guide or healer'],
    metaphor: 'Gentle rain — quiet, nourishing, and the reason the flowers bloom.',
  },
];

// ─── 2026 병오(丙午)년 일주별 운세 ───

export interface YearForecast {
  dayMaster: string;  // stem romanization
  element: string;
  overview: string;
  career: string;
  relationships: string;
  advice: string;
}

export const FORECAST_2026: YearForecast[] = [
  {
    dayMaster: 'Gap',
    element: 'Yang Wood',
    overview: '2026 is a Fire year, and Fire is the Output star for Wood. Expect a year of self-expression, creativity, and visibility. Your ideas want to come out.',
    career: 'Great year for launching projects, publishing, or performing. Your output is high, but watch for burnout. Pace your energy across the year.',
    relationships: 'You may feel more expressive and romantic. Fire energy warms your social life. Be generous but guard against giving too much.',
    advice: 'Channel your creative energy into tangible results. Finish what you start — the Fire Horse rewards action, not just ideas.',
  },
  {
    dayMaster: 'Eul',
    element: 'Yin Wood',
    overview: 'Fire is also your Output star. 2026 amplifies your charm and artistic talents. You shine in collaborative settings this year.',
    career: 'Ideal for creative industries, marketing, and partnerships. Your networking skills are supercharged. Use them to build lasting alliances.',
    relationships: 'Romance is lively and passionate. Existing relationships deepen through shared experiences. Single? You attract attention naturally.',
    advice: 'Stay grounded despite the excitement. Fire energy can make you scattered — choose one or two priorities and commit.',
  },
  {
    dayMaster: 'Byeong',
    element: 'Yang Fire',
    overview: '2026 mirrors your own energy — a Companion year. Expect solidarity, competition, and a sense of being surrounded by peers.',
    career: 'Strong teamwork energy but also more competition. Stand out by doubling down on what makes you unique. Avoid following the crowd.',
    relationships: 'You attract people like yourself — ambitious, warm, energetic. Great for finding your tribe, but watch for ego clashes.',
    advice: 'This is not the year to blend in. The Fire Horse amplifies everything — make sure it amplifies your best qualities.',
  },
  {
    dayMaster: 'Jeong',
    element: 'Yin Fire',
    overview: 'Another Companion year for you. 2026 brings intensity, passion, and a strong desire to connect with kindred spirits.',
    career: 'Collaborations thrive. Consider joint ventures or partnerships. Your insight is valued — speak up in meetings and strategy sessions.',
    relationships: 'Deep emotional connections are possible. Be vulnerable and authentic. The right people will recognize your light.',
    advice: 'Protect your energy. As Yin Fire, you burn brighter but also burn out faster. Schedule rest as seriously as you schedule work.',
  },
  {
    dayMaster: 'Mu',
    element: 'Yang Earth',
    overview: 'Fire produces Earth — 2026 is a Resource year for you. Expect support, learning opportunities, and a sense of being nurtured.',
    career: 'Excellent year for education, certifications, or mentorship. You absorb information easily. Invest in skills that compound over time.',
    relationships: 'You feel supported by those around you. Family bonds strengthen. A mentor or older figure may play a key role.',
    advice: 'Accept help gracefully. Your mountain nature wants to be self-sufficient, but 2026 rewards those who receive as well as give.',
  },
  {
    dayMaster: 'Gi',
    element: 'Yin Earth',
    overview: 'Fire is your Resource star too. 2026 is a year of growth through learning and receiving. Your garden is being watered.',
    career: 'Study, train, and prepare. This is a foundation-building year. What you learn now pays dividends for the next decade.',
    relationships: 'Nurturing relationships flourish. You feel emotionally supported. Express gratitude — it deepens every connection.',
    advice: 'Do not rush to produce results. 2026 is about planting seeds. Trust the process and tend your garden patiently.',
  },
  {
    dayMaster: 'Gyeong',
    element: 'Yang Metal',
    overview: 'Fire controls Metal — 2026 is an Authority year. Expect pressure, structure, and opportunities to prove yourself under fire.',
    career: 'Promotions and leadership roles are possible, but they come with responsibility. Rise to the challenge. Discipline is your superpower.',
    relationships: 'Authority figures play a larger role. A boss, parent, or institution may test you. Respond with integrity, not defiance.',
    advice: 'Embrace the pressure. The sword is forged in fire — 2026 is your forge. You will emerge sharper and stronger.',
  },
  {
    dayMaster: 'Sin',
    element: 'Yin Metal',
    overview: 'Fire also controls you — an Authority year. The heat is on, but it polishes you. 2026 refines your rough edges.',
    career: 'Quality over quantity. Deliver excellent work under scrutiny. Avoid shortcuts — they will be exposed. Your reputation is being shaped.',
    relationships: 'Expect some tension in close relationships. The fire tests your patience. Practice gentleness with yourself and others.',
    advice: 'See challenges as polishing, not punishment. Every diamond needs cutting. Let 2026 reveal your brightest facets.',
  },
  {
    dayMaster: 'Im',
    element: 'Yang Water',
    overview: 'Water controls Fire — 2026 is a Wealth year for you. Financial opportunities, ambition, and material expansion are in focus.',
    career: 'Strong year for business, investment, and career advancement. Your ability to see the big picture gives you an edge. Take calculated risks.',
    relationships: 'Wealth energy can strain relationships if you prioritize money over people. Balance ambition with presence.',
    advice: 'Do not let the ocean of opportunity drown you. Focus on one or two wealth-building moves rather than chasing everything.',
  },
  {
    dayMaster: 'Gye',
    element: 'Yin Water',
    overview: 'Fire is your Wealth star as well. 2026 brings material opportunities, but on a quieter, more personal scale.',
    career: 'Freelance, side projects, and passive income streams are favored. Your intuition guides you to the right opportunities.',
    relationships: 'Romance and finances can intertwine. Be clear about boundaries. A partner may play a role in your financial life.',
    advice: 'Follow your intuition but verify with data. The mountain stream knows where to flow — trust it, but keep your eyes open.',
  },
];

// ─── 오행 궁합 매트릭스 ───

export type CompatLevel = 'Harmonious' | 'Supportive' | 'Neutral' | 'Tense' | 'Challenging';

export interface CompatEntry {
  element1: string;
  element2: string;
  level: CompatLevel;
  description: string;
}

const ELEMENTS = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'] as const;

export const COMPAT_MATRIX: CompatEntry[] = [
  // Same element
  { element1: 'Wood', element2: 'Wood', level: 'Neutral', description: 'Familiar but competitive — you understand each other, sometimes too well.' },
  { element1: 'Fire', element2: 'Fire', level: 'Neutral', description: 'Passionate but intense — great energy, risk of burnout together.' },
  { element1: 'Earth', element2: 'Earth', level: 'Neutral', description: 'Stable but stagnant — comfort is high, growth may be slow.' },
  { element1: 'Metal', element2: 'Metal', level: 'Neutral', description: 'Disciplined but rigid — strong respect, potential power struggles.' },
  { element1: 'Water', element2: 'Water', level: 'Neutral', description: 'Deep but directionless — emotional depth, needs practical anchor.' },

  // Productive cycle (generates)
  { element1: 'Wood', element2: 'Fire', level: 'Supportive', description: 'Wood fuels Fire — you inspire and energize each other naturally.' },
  { element1: 'Fire', element2: 'Earth', level: 'Supportive', description: 'Fire creates Earth — warmth and stability, a nurturing bond.' },
  { element1: 'Earth', element2: 'Metal', level: 'Supportive', description: 'Earth bears Metal — solid foundation, trust builds naturally.' },
  { element1: 'Metal', element2: 'Water', level: 'Supportive', description: 'Metal collects Water — clarity and depth, intellectual bond.' },
  { element1: 'Water', element2: 'Wood', level: 'Supportive', description: 'Water nourishes Wood — growth and care, a natural partnership.' },

  // Reverse productive (is generated by)
  { element1: 'Fire', element2: 'Wood', level: 'Harmonious', description: 'Fire is nourished by Wood — you feel naturally supported.' },
  { element1: 'Earth', element2: 'Fire', level: 'Harmonious', description: 'Earth is nourished by Fire — warmth and creative energy flows in.' },
  { element1: 'Metal', element2: 'Earth', level: 'Harmonious', description: 'Metal is nourished by Earth — deep trust and steady support.' },
  { element1: 'Water', element2: 'Metal', level: 'Harmonious', description: 'Water is nourished by Metal — clarity and structure support flow.' },
  { element1: 'Wood', element2: 'Water', level: 'Harmonious', description: 'Wood is nourished by Water — growth, creativity, and care.' },

  // Controlling cycle
  { element1: 'Wood', element2: 'Earth', level: 'Tense', description: 'Wood controls Earth — you challenge and push each other.' },
  { element1: 'Earth', element2: 'Water', level: 'Tense', description: 'Earth controls Water — structure meets freedom, friction is common.' },
  { element1: 'Water', element2: 'Fire', level: 'Tense', description: 'Water controls Fire — logic clashes with passion.' },
  { element1: 'Fire', element2: 'Metal', level: 'Tense', description: 'Fire controls Metal — heat and pressure, potentially transformative.' },
  { element1: 'Metal', element2: 'Wood', level: 'Tense', description: 'Metal controls Wood — discipline meets growth, can feel restrictive.' },

  // Reverse controlling (is controlled by)
  { element1: 'Earth', element2: 'Wood', level: 'Challenging', description: 'Earth is controlled by Wood — you may feel pressured or constrained.' },
  { element1: 'Water', element2: 'Earth', level: 'Challenging', description: 'Water is controlled by Earth — freedom feels blocked.' },
  { element1: 'Fire', element2: 'Water', level: 'Challenging', description: 'Fire is controlled by Water — your passion meets resistance.' },
  { element1: 'Metal', element2: 'Fire', level: 'Challenging', description: 'Metal is controlled by Fire — intensity can overwhelm.' },
  { element1: 'Wood', element2: 'Metal', level: 'Challenging', description: 'Wood is controlled by Metal — you may feel pruned or limited.' },
];

// ─── 용신 간이 판정표 ───

export interface UsefulGodEntry {
  dayMasterElement: string;
  season: string;
  strength: 'Strong' | 'Weak';
  usefulGod: string;
  explanation: string;
}

export const USEFUL_GOD_TABLE: UsefulGodEntry[] = [
  // Wood Day Masters
  { dayMasterElement: 'Wood', season: 'Spring (Feb–Apr)', strength: 'Strong', usefulGod: 'Metal', explanation: 'Wood is strong in spring. Metal prunes and shapes, giving you discipline and focus.' },
  { dayMasterElement: 'Wood', season: 'Summer (May–Jul)', strength: 'Weak', usefulGod: 'Water', explanation: 'Summer Fire drains Wood. Water nourishes you back — seek learning, rest, and support.' },
  { dayMasterElement: 'Wood', season: 'Autumn (Aug–Oct)', strength: 'Weak', usefulGod: 'Water', explanation: 'Autumn Metal attacks Wood. Water acts as a buffer and restores your energy.' },
  { dayMasterElement: 'Wood', season: 'Winter (Nov–Jan)', strength: 'Strong', usefulGod: 'Fire', explanation: 'Winter Water makes Wood too damp. Fire warms and activates your potential.' },

  // Fire Day Masters
  { dayMasterElement: 'Fire', season: 'Spring (Feb–Apr)', strength: 'Strong', usefulGod: 'Water', explanation: 'Spring Wood fuels Fire further. Water provides balance and clarity.' },
  { dayMasterElement: 'Fire', season: 'Summer (May–Jul)', strength: 'Strong', usefulGod: 'Water', explanation: 'Fire in summer is at peak. Water cools and channels your intensity productively.' },
  { dayMasterElement: 'Fire', season: 'Autumn (Aug–Oct)', strength: 'Weak', usefulGod: 'Wood', explanation: 'Autumn Metal drains Fire through production. Wood restores your fuel supply.' },
  { dayMasterElement: 'Fire', season: 'Winter (Nov–Jan)', strength: 'Weak', usefulGod: 'Wood', explanation: 'Winter Water attacks Fire directly. Wood acts as your shield and energy source.' },

  // Earth Day Masters
  { dayMasterElement: 'Earth', season: 'Spring (Feb–Apr)', strength: 'Weak', usefulGod: 'Fire', explanation: 'Spring Wood attacks Earth. Fire transforms Wood into ash that feeds you.' },
  { dayMasterElement: 'Earth', season: 'Summer (May–Jul)', strength: 'Strong', usefulGod: 'Wood', explanation: 'Summer Fire over-strengthens Earth. Wood provides challenge and stimulates growth.' },
  { dayMasterElement: 'Earth', season: 'Autumn (Aug–Oct)', strength: 'Weak', usefulGod: 'Fire', explanation: 'Autumn Metal drains Earth. Fire restores your energy and warmth.' },
  { dayMasterElement: 'Earth', season: 'Winter (Nov–Jan)', strength: 'Weak', usefulGod: 'Fire', explanation: 'Winter Water attacks Earth. Fire is your strongest ally for warmth and support.' },

  // Metal Day Masters
  { dayMasterElement: 'Metal', season: 'Spring (Feb–Apr)', strength: 'Weak', usefulGod: 'Earth', explanation: 'Spring Wood challenges Metal. Earth grounds and supports your foundation.' },
  { dayMasterElement: 'Metal', season: 'Summer (May–Jul)', strength: 'Weak', usefulGod: 'Earth', explanation: 'Summer Fire melts Metal. Earth buffers the heat and rebuilds your strength.' },
  { dayMasterElement: 'Metal', season: 'Autumn (Aug–Oct)', strength: 'Strong', usefulGod: 'Fire', explanation: 'Autumn is Metals peak. Fire provides the forge that shapes your raw power into precision.' },
  { dayMasterElement: 'Metal', season: 'Winter (Nov–Jan)', strength: 'Strong', usefulGod: 'Fire', explanation: 'Winter Water makes Metal cold. Fire warms and activates your sharpest qualities.' },

  // Water Day Masters
  { dayMasterElement: 'Water', season: 'Spring (Feb–Apr)', strength: 'Weak', usefulGod: 'Metal', explanation: 'Spring Wood drains Water. Metal replenishes your reserves and provides structure.' },
  { dayMasterElement: 'Water', season: 'Summer (May–Jul)', strength: 'Weak', usefulGod: 'Metal', explanation: 'Summer Fire evaporates Water. Metal is your lifeline — seek clarity and discipline.' },
  { dayMasterElement: 'Water', season: 'Autumn (Aug–Oct)', strength: 'Strong', usefulGod: 'Earth', explanation: 'Autumn Metal feeds Water. Earth provides direction and prevents you from overflowing.' },
  { dayMasterElement: 'Water', season: 'Winter (Nov–Jan)', strength: 'Strong', usefulGod: 'Earth', explanation: 'Winter is Waters peak. Earth dams and directs your immense energy toward goals.' },
];

/** 용신 원소별 생활 활용 가이드 */
export const USEFUL_GOD_LIFESTYLE: Record<string, { colors: string; directions: string; foods: string; sectors: string }> = {
  Wood:  { colors: 'Green, teal, emerald', directions: 'East', foods: 'Leafy greens, sour flavors, sprouts', sectors: 'Education, publishing, forestry, fashion' },
  Fire:  { colors: 'Red, orange, pink, purple', directions: 'South', foods: 'Bitter flavors, coffee, dark chocolate', sectors: 'Entertainment, media, energy, technology' },
  Earth: { colors: 'Yellow, brown, beige, ochre', directions: 'Center (stay local)', foods: 'Sweet flavors, root vegetables, grains', sectors: 'Real estate, agriculture, construction, mining' },
  Metal: { colors: 'White, silver, gold, gray', directions: 'West', foods: 'Spicy flavors, garlic, ginger', sectors: 'Finance, law, engineering, automotive' },
  Water: { colors: 'Black, navy, dark blue', directions: 'North', foods: 'Salty flavors, seafood, soups', sectors: 'Trade, logistics, travel, IT, philosophy' },
};
