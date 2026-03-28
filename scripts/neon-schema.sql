-- Neon DB 스키마 — Neon 콘솔 SQL Editor에서 실행

-- 1. 사주 차트 fingerprint
CREATE TABLE saju_charts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chart_hash  VARCHAR(64) UNIQUE NOT NULL,
  day_master  VARCHAR(4) NOT NULL,
  strength    VARCHAR(10) NOT NULL,
  yongsin_el  VARCHAR(4) NOT NULL,
  gender      VARCHAR(2) NOT NULL,
  pillar_json JSONB NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 번역 캐시
CREATE TABLE translations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chart_id      UUID NOT NULL REFERENCES saju_charts(id),
  part_key      VARCHAR(30) NOT NULL,
  tier          VARCHAR(10) NOT NULL,
  text          TEXT NOT NULL,
  quality       VARCHAR(10) DEFAULT 'pending',
  has_errors    BOOLEAN DEFAULT FALSE,
  error_notes   TEXT,
  model_version VARCHAR(40),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(chart_id, part_key, tier)
);

-- 인덱스
CREATE INDEX idx_saju_charts_hash ON saju_charts(chart_hash);
CREATE INDEX idx_translations_chart_part ON translations(chart_id, part_key, tier);
