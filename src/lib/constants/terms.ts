import type { ShinsalSentiment } from '@/lib/types/saju';

// ─── 3-Layer 용어: 차트/테이블용 축약 영문 ───

export const TEN_GOD_EN: Record<string, string> = {
  '비견': 'Self & Indep.',
  '겁재': 'Competition',
  '식신': 'Creative Expr.',
  '상관': 'Bold Innov.',
  '편재': 'Unexp. Fortune',
  '정재': 'Steady Prosp.',
  '편관': 'Pressure',
  '정관': 'Honor & Resp.',
  '편인': 'Unconv. Wisdom',
  '정인': 'Knowledge',
  '일간(나)': 'Day Master',
};

export const TWELVE_STAGE_EN: Record<string, string> = {
  '장생': 'Birth', '목욕': 'Bathing', '관대': 'Crowning',
  '건록': 'Prosperity', '제왕': 'Emperor', '쇠': 'Decline',
  '병': 'Illness', '사': 'Death', '묘': 'Tomb',
  '절': 'Extinction', '태': 'Conception', '양': 'Nurturing',
};

// ─── 신살 sentiment 매핑 (docs/SAJU_TERMS.md 기반) ───

const POSITIVE_SHINSALS = new Set([
  '천을귀인', '천덕귀인', '월덕귀인', '문창귀인', '복성귀인',
  '천복귀인', '태극귀인', '천주귀인', '학당귀인', '문곡귀인',
  '관귀학관', '금여', '암록', '협록', '건록', '명예살', '천문성',
]);

const NEUTRAL_SHINSALS = new Set([
  '도화살', '역마살', '화개살', '홍염살', '장성살',
  '양인살', '반안살', '괴강살', '공망',
]);

const CAUTION_SHINSALS = new Set([
  '백호살', '현침살', '망신살', '겁살', '재살',
  '천살', '지살', '년살', '월살', '육해살',
  '원진살', '낙정관살', '비인살', '음착살', '고란살',
]);

export function getShinsalSentiment(name: string): ShinsalSentiment {
  // 부분 매치 지원: "원진(日)" → "원진살"
  const clean = name.replace(/\(.*?\)/g, '').trim();
  if (POSITIVE_SHINSALS.has(clean)) return 'positive';
  if (NEUTRAL_SHINSALS.has(clean)) return 'neutral';
  if (CAUTION_SHINSALS.has(clean)) return 'caution';
  // 12신살 이름도 체크
  if (clean.endsWith('살') && CAUTION_SHINSALS.has(clean)) return 'caution';
  return 'neutral';
}

// ─── 신살 3-Layer 영문명 ───

export const SHINSAL_EN: Record<string, string> = {
  '천을귀인': 'Guardian Angel', '천덕귀인': 'Heavenly Blessing',
  '월덕귀인': 'Monthly Blessing', '문창귀인': 'Academic Excellence',
  '복성귀인': 'Fortune Star', '천복귀인': 'Heavenly Fortune',
  '태극귀인': 'Grand Destiny', '천주귀인': 'Pillar of Support',
  '학당귀인': 'Scholar Star', '문곡귀인': 'Artistic Talent',
  '관귀학관': 'Career & Knowledge', '금여': 'Golden Carriage',
  '암록': 'Hidden Prosperity', '협록': 'Side Prosperity',
  '건록': 'Self-Made Success', '명예살': 'Reputation & Honor',
  '천문성': 'Spiritual Insight',
  '도화살': 'Charm & Attraction', '역마살': 'Travel & Change',
  '화개살': 'Inner Wisdom', '홍염살': 'Magnetic Charm',
  '장성살': 'Leadership', '양인살': 'Warrior Spirit',
  '반안살': 'Social Status', '괴강살': 'Intense Power',
  '공망': 'Void Period',
  '백호살': 'Unexpected Disruption', '현침살': 'Precision & Tension',
  '망신살': 'Reputation Risk', '겁살': 'Sudden Setback',
  '재살': 'Conflict Alert', '천살': 'External Pressure',
  '지살': 'Foundation Shake', '년살': 'Yearly Caution',
  '월살': 'Monthly Caution', '육해살': 'Hidden Friction',
  '원진살': 'Distant Tension', '낙정관살': 'Falling Fortune',
  '비인살': 'Sharp Edge', '음착살': 'Misjudgment',
  '고란살': 'Solitude',
};

// ─── 12신살 영문명 ───

export const TWELVE_SHINSAL_EN: Record<string, string> = {
  '겁살': 'Robbery', '재살': 'Disaster', '천살': 'Heavenly',
  '지살': 'Earthly', '년살': 'Yearly', '월살': 'Monthly',
  '망신살': 'Reputation', '장성살': 'General', '반안살': 'Half Saddle',
  '역마살': 'Traveling', '육해살': 'Six Harm', '화개살': 'Canopy',
};
