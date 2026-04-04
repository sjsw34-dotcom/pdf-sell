import { getSQL } from './neon';
import type { PillarData } from '@/lib/types/saju';

// ─── Chart Hash ───

export async function computeChartHash(pillar: PillarData, gender: string): Promise<string> {
  const raw = [
    pillar.yearPillar.heavenlyStem, pillar.yearPillar.earthlyBranch,
    pillar.monthPillar.heavenlyStem, pillar.monthPillar.earthlyBranch,
    pillar.dayPillar.heavenlyStem, pillar.dayPillar.earthlyBranch,
    pillar.hourPillar.heavenlyStem, pillar.hourPillar.earthlyBranch,
    gender,
  ].join('|');

  return sha256Hex(raw);
}

async function sha256Hex(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ─── Cache Lookup ───

interface CachedTranslation {
  id: string;
  text: string;
}

export async function findCachedTranslation(
  chartHash: string,
  partKey: string,
  tier: string,
): Promise<CachedTranslation | null> {
  try {
    const rows = await getSQL()`
      SELECT t.id, t.text
      FROM translations t
      JOIN saju_charts c ON c.id = t.chart_id
      WHERE c.chart_hash = ${chartHash}
        AND t.part_key = ${partKey}
        AND t.tier = ${tier}
        AND t.has_errors = FALSE
      LIMIT 1
    `;
    if (rows.length === 0) return null;
    return { id: rows[0].id as string, text: rows[0].text as string };
  } catch (err) {
    console.error('[db] findCachedTranslation error:', err);
    return null;
  }
}

// ─── Save Translation ───

interface ChartInput {
  chartHash: string;
  dayMaster: string;
  strength: string;
  yongsinEl: string;
  gender: string;
  pillarJson: unknown;
}

export async function saveTranslation(
  chart: ChartInput,
  partKey: string,
  tier: string,
  text: string,
  modelVersion: string,
): Promise<void> {
  try {
    const pillarJsonStr = JSON.stringify(chart.pillarJson);

    // upsert chart
    const chartRows = await getSQL()`
      INSERT INTO saju_charts (chart_hash, day_master, strength, yongsin_el, gender, pillar_json)
      VALUES (${chart.chartHash}, ${chart.dayMaster}, ${chart.strength}, ${chart.yongsinEl}, ${chart.gender}, ${pillarJsonStr}::jsonb)
      ON CONFLICT (chart_hash) DO UPDATE SET chart_hash = EXCLUDED.chart_hash
      RETURNING id
    `;
    const chartId = chartRows[0].id;

    // upsert translation
    await getSQL()`
      INSERT INTO translations (chart_id, part_key, tier, text, model_version)
      VALUES (${chartId}, ${partKey}, ${tier}, ${text}, ${modelVersion})
      ON CONFLICT (chart_id, part_key, tier)
      DO UPDATE SET text = EXCLUDED.text, model_version = EXCLUDED.model_version, created_at = NOW()
    `;
  } catch (err) {
    console.error('[db] saveTranslation error:', err);
  }
}

// ─── Quality Update ───

export async function updateQuality(
  translationId: string,
  quality: string,
  notes?: string,
): Promise<void> {
  const hasErrors = quality === 'bad';
  const errorNotes = notes ?? null;
  await getSQL()`
    UPDATE translations SET quality = ${quality}, has_errors = ${hasErrors}, error_notes = ${errorNotes} WHERE id = ${translationId}
  `;
}
