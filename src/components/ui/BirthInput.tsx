'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useGeneratorStore } from '@/store/useGeneratorStore';
import { parseSajuJson } from '@/lib/utils/parseJson';
import { extractInfo, type ExtractedInfo } from '@/lib/utils/extractInfo';
import { calculateSaju, type SajuInput } from '@/lib/saju/calculator';

// ─── 12지신 시간표 ───
const JIJIN_HOURS = [
  { label: '자시 子時 (23:30~01:30)', hour: 0, minute: 30 },
  { label: '축시 丑時 (01:30~03:30)', hour: 2, minute: 30 },
  { label: '인시 寅時 (03:30~05:30)', hour: 4, minute: 30 },
  { label: '묘시 卯時 (05:30~07:30)', hour: 6, minute: 30 },
  { label: '진시 辰時 (07:30~09:30)', hour: 8, minute: 30 },
  { label: '사시 巳時 (09:30~11:30)', hour: 10, minute: 30 },
  { label: '오시 午時 (11:30~13:30)', hour: 12, minute: 30 },
  { label: '미시 未時 (13:30~15:30)', hour: 14, minute: 30 },
  { label: '신시 申時 (15:30~17:30)', hour: 16, minute: 30 },
  { label: '유시 酉時 (17:30~19:30)', hour: 18, minute: 30 },
  { label: '술시 戌時 (19:30~21:30)', hour: 20, minute: 30 },
  { label: '해시 亥時 (21:30~23:30)', hour: 22, minute: 30 },
];

const selectClass =
  'bg-[#1A1A2E] border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:border-purple-500 focus:outline-none appearance-none cursor-pointer';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 130 }, (_, i) => currentYear - i);
const months = Array.from({ length: 12 }, (_, i) => i + 1);
const days = Array.from({ length: 31 }, (_, i) => i + 1);

interface ClientItem {
  id: string;
  name: string;
  gender: '남' | '여';
  birth_year: number;
  birth_month: number;
  birth_day: number;
  birth_hour: number;
  birth_minute: number;
  calendar_type: string;
  time_mode: string;
  time_idx: number;
}

export function BirthInput() {
  const setSajuData = useGeneratorStore((s) => s.setSajuData);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 입력 상태
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'남' | '여'>('여');
  const [calendarType, setCalendarType] = useState<'solar' | 'lunar' | 'leapLunar'>('solar');
  const [year, setYear] = useState(1990);
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [timeIdx, setTimeIdx] = useState(0); // 12지신 인덱스
  const [timeMode, setTimeMode] = useState<'jijin' | 'exact'>('jijin');
  const [exactHour, setExactHour] = useState(12);
  const [exactMinute, setExactMinute] = useState(0);
  const [ampm, setAmpm] = useState<'오전' | '오후'>('오후');

  // 결과 상태
  const [rawJsonString, setRawJsonString] = useState('');
  const [info, setInfo] = useState<ExtractedInfo | null>(null);
  const [showJson, setShowJson] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [jsonView, setJsonView] = useState<'basic' | 'fortune' | 'monthly' | 'all'>('all');

  // 고객 저장 상태
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [saving, setSaving] = useState(false);

  // 고객 목록 로드
  const fetchClients = useCallback(async () => {
    try {
      const res = await fetch('/api/clients', {
        headers: {
          ...(process.env.NEXT_PUBLIC_API_SECRET ? { 'x-api-key': process.env.NEXT_PUBLIC_API_SECRET } : {}),
        },
      });
      if (res.ok) {
        const { clients: list } = await res.json();
        setClients(list ?? []);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  // 고객 선택 시 폼에 로드
  const handleSelectClient = useCallback(async (id: string) => {
    setSelectedClientId(id);
    if (!id) return;
    try {
      const res = await fetch(`/api/clients/${id}`, {
        headers: {
          ...(process.env.NEXT_PUBLIC_API_SECRET ? { 'x-api-key': process.env.NEXT_PUBLIC_API_SECRET } : {}),
        },
      });
      if (!res.ok) return;
      const { client: c } = await res.json();
      setName(c.name);
      setGender(c.gender);
      setCalendarType(c.calendar_type as 'solar' | 'lunar' | 'leapLunar');
      setYear(c.birth_year);
      setMonth(c.birth_month);
      setDay(c.birth_day);
      setTimeMode(c.time_mode as 'jijin' | 'exact');
      setTimeIdx(c.time_idx ?? 0);
      if (c.time_mode === 'exact') {
        const h24 = c.birth_hour;
        setAmpm(h24 < 12 ? '오전' : '오후');
        setExactHour(h24 % 12 || 12);
        setExactMinute(c.birth_minute);
      }
      // 결과 초기화 → 재생성 유도
      handleReset();
    } catch { /* ignore */ }
  }, []);

  // 고객 저장
  const handleSaveClient = useCallback(async () => {
    setSaving(true);
    try {
      let birthHour: number, birthMinute: number;
      if (timeMode === 'jijin') {
        birthHour = JIJIN_HOURS[timeIdx].hour;
        birthMinute = JIJIN_HOURS[timeIdx].minute;
      } else {
        let h = exactHour;
        if (ampm === '오전') { if (h === 12) h = 0; }
        else { if (h !== 12) h += 12; }
        birthHour = h;
        birthMinute = exactMinute;
      }

      const rawJson = rawJsonString ? JSON.parse(rawJsonString) : null;

      // 같은 이름이 이미 있으면 업데이트 (rawJson만)
      const existing = clients.find(c => c.name === (name.trim() || 'Valued Guest'));
      if (existing) {
        await fetch(`/api/clients/${existing.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(process.env.NEXT_PUBLIC_API_SECRET ? { 'x-api-key': process.env.NEXT_PUBLIC_API_SECRET } : {}),
          },
          body: JSON.stringify({ rawJson }),
        });
      } else {
        await fetch('/api/clients', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(process.env.NEXT_PUBLIC_API_SECRET ? { 'x-api-key': process.env.NEXT_PUBLIC_API_SECRET } : {}),
          },
          body: JSON.stringify({
            name: name.trim() || 'Valued Guest',
            gender, birthYear: year, birthMonth: month, birthDay: day,
            birthHour, birthMinute,
            calendarType, timeMode, timeIdx,
            rawJson,
          }),
        });
      }
      await fetchClients();
    } catch { setError('고객 저장 실패'); }
    finally { setSaving(false); }
  }, [name, gender, year, month, day, timeMode, timeIdx, exactHour, exactMinute, ampm, rawJsonString, clients, fetchClients]);

  // 고객 삭제
  const handleDeleteClient = useCallback(async () => {
    if (!selectedClientId || !confirm('이 고객을 삭제하시겠습니까?')) return;
    try {
      await fetch(`/api/clients/${selectedClientId}`, {
        method: 'DELETE',
        headers: {
          ...(process.env.NEXT_PUBLIC_API_SECRET ? { 'x-api-key': process.env.NEXT_PUBLIC_API_SECRET } : {}),
        },
      });
      setSelectedClientId('');
      await fetchClients();
      handleReset();
    } catch { /* ignore */ }
  }, [selectedClientId, fetchClients]);

  const handleCalculate = useCallback(() => {
    setError('');
    setLoading(true);

    try {
      let birthHour: number;
      let birthMinute: number;

      if (timeMode === 'jijin') {
        const jijin = JIJIN_HOURS[timeIdx];
        birthHour = jijin.hour;
        birthMinute = jijin.minute;
      } else {
        let h = exactHour;
        if (ampm === '오전') {
          if (h === 12) h = 0;
        } else {
          if (h !== 12) h += 12;
        }
        birthHour = h;
        birthMinute = exactMinute;
      }

      const input: SajuInput = {
        name: name.trim() || 'Valued Guest',
        gender,
        birthYear: year,
        birthMonth: month,
        birthDay: day,
        birthHour,
        birthMinute,
        isLunar: calendarType !== 'solar',
        isLeapMonth: calendarType === 'leapLunar',
      };

      const rawJson = calculateSaju(input);
      const jsonStr = JSON.stringify(rawJson, null, 2);
      setRawJsonString(jsonStr);

      const result = parseSajuJson(JSON.stringify(rawJson));
      if (!result.ok) {
        setError(`계산 오류: ${result.error}`);
        setLoading(false);
        return;
      }

      setSajuData(result.data);
      setInfo(extractInfo(result.data));
    } catch (e) {
      const message = e instanceof Error ? e.message : '알 수 없는 오류';
      setError(`계산 실패: ${message}`);
    } finally {
      setLoading(false);
    }
  }, [name, gender, calendarType, year, month, day, timeIdx, timeMode, exactHour, exactMinute, ampm, setSajuData]);

  const handleCopy = useCallback(async (section?: string) => {
    const text = section ? getJsonSectionText(section) : getJsonViewText();
    await navigator.clipboard.writeText(text);
    setCopied(section ?? jsonView);
    setTimeout(() => setCopied(null), 2000);
  }, [rawJsonString, jsonView]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([rawJsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(name.trim() || 'saju')}_saju.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [rawJsonString, name]);

  const handleReset = useCallback(() => {
    setSajuData(null);
    setInfo(null);
    setRawJsonString('');
    setShowJson(false);
    setError('');
  }, [setSajuData]);

  // 섹션 경계 찾기: JSON 키 기준으로 의미 있는 구간 분할
  function findSectionBoundaries() {
    if (!rawJsonString) return { basicEnd: 0, fortuneEnd: 0, total: 0 };
    const lines = rawJsonString.split('\n');
    const total = lines.length;

    // hyungchung 시작 = 기본 사주 끝 (info+pillar+yongsin+yinyang+shinsal)
    let basicEnd = 0;
    // wolun 시작 = 운세 흐름 끝 (hyungchung+daeun+nyunun)
    let fortuneEnd = 0;

    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      if (trimmed.startsWith('"hyungchung"')) basicEnd = i;
      if (trimmed.startsWith('"wolun"') && !trimmed.startsWith('"wolun2"')) fortuneEnd = i;
    }

    return { basicEnd, fortuneEnd, total };
  }

  // 섹션별 텍스트 추출
  function getJsonSectionText(section: string): string {
    if (!rawJsonString) return '';
    const lines = rawJsonString.split('\n');
    const { basicEnd, fortuneEnd } = findSectionBoundaries();

    if (section === 'basic') return lines.slice(0, basicEnd).join('\n') + '\n}';
    if (section === 'fortune') return '{\n' + lines.slice(basicEnd, fortuneEnd).join('\n') + '\n}';
    if (section === 'monthly') return '{\n' + lines.slice(fortuneEnd).join('\n');
    return rawJsonString;
  }

  // JSON 부분 보기
  function getJsonViewText(): string {
    if (!rawJsonString) return '';
    if (jsonView === 'all') return rawJsonString;
    return getJsonSectionText(jsonView);
  }

  const lineCount = rawJsonString ? rawJsonString.split('\n').length : 0;
  const boundaries = rawJsonString ? findSectionBoundaries() : { basicEnd: 0, fortuneEnd: 0, total: 0 };

  // 결과가 있을 때 = 결과 화면
  if (info && rawJsonString) {
    return (
      <div className="space-y-3">
        {/* 결과 요약 */}
        <div className="bg-[#1A1A2E] border border-green-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm text-green-400 font-medium">사주 계산 완료</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSaveClient}
                disabled={saving}
                className="px-3 py-1 text-xs rounded-md bg-green-800 text-green-300 hover:bg-green-700 transition disabled:opacity-40"
              >
                {saving ? '저장 중...' : '고객 저장'}
              </button>
              <button
                onClick={handleCalculate}
                className="px-3 py-1 text-xs rounded-md bg-blue-800 text-blue-300 hover:bg-blue-700 transition"
              >
                재생성
              </button>
              <button onClick={handleReset} className="text-xs text-gray-500 hover:text-red-400 transition">
                초기화
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-gray-500">이름</span>
              <p className="text-white font-medium">{info.name || '미입력'}</p>
            </div>
            <div>
              <span className="text-gray-500">성별</span>
              <p className="text-white font-medium">{info.gender === '남' ? '남성' : '여성'}</p>
            </div>
            <div>
              <span className="text-gray-500">생년월일</span>
              <p className="text-white font-medium">{info.birthDate}</p>
            </div>
            <div>
              <span className="text-gray-500">나이</span>
              <p className="text-white font-medium">만 {info.age}세</p>
            </div>
          </div>
        </div>

        {/* JSON 원본 데이터 뷰어 */}
        <div className="bg-[#1A1A2E] border border-gray-700 rounded-xl overflow-hidden">
          {/* 헤더 */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
            <button
              onClick={() => setShowJson(!showJson)}
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition"
            >
              <span className={`transition-transform ${showJson ? 'rotate-90' : ''}`}>&#9654;</span>
              <span>원본 데이터</span>
              <span className="text-xs text-gray-500">
                {name.trim() || 'Guest'} - {year}-{String(month).padStart(2, '0')}-{String(day).padStart(2, '0')}
                ({lineCount}줄)
              </span>
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => handleCopy()}
                className="px-3 py-1 text-xs rounded-md bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition"
              >
                {copied === jsonView ? '복사됨!' : '전체 복사'}
              </button>
              <button
                onClick={handleDownload}
                className="px-3 py-1 text-xs rounded-md bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition"
              >
                다운로드
              </button>
            </div>
          </div>

          {showJson && (
            <>
              {/* 섹션 선택 탭 + 개별 복사 버튼 */}
              <div className="px-4 py-2 border-b border-gray-800 space-y-2">
                <div className="flex gap-1 flex-wrap">
                  {([
                    { key: 'basic', label: `기본 사주 (1~${boundaries.basicEnd}줄)`, desc: 'info+pillar+yongsin+yinyang+shinsal' },
                    { key: 'fortune', label: `운세 흐름 (${boundaries.basicEnd + 1}~${boundaries.fortuneEnd}줄)`, desc: 'hyungchung+daeun+nyunun' },
                    { key: 'monthly', label: `월운 (${boundaries.fortuneEnd + 1}~${lineCount}줄)`, desc: 'wolun+wolun2' },
                    { key: 'all', label: `전체 (${lineCount}줄)`, desc: '' },
                  ] as const).map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setJsonView(key)}
                      className={`px-3 py-1 text-xs rounded-md transition ${
                        jsonView === key ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {/* 섹션별 빠른 복사 버튼 */}
                <div className="flex gap-1 flex-wrap">
                  {([
                    { key: 'basic', label: '기본 사주 복사' },
                    { key: 'fortune', label: '운세 흐름 복사' },
                    { key: 'monthly', label: '월운 복사' },
                  ] as const).map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => handleCopy(key)}
                      className="px-3 py-1 text-xs rounded-md bg-indigo-900/50 text-indigo-300 hover:bg-indigo-800 transition"
                    >
                      {copied === key ? '복사됨!' : label}
                    </button>
                  ))}
                </div>
              </div>

              {/* JSON 내용 */}
              <div className="max-h-80 overflow-auto">
                <pre className="px-4 py-3 text-xs text-gray-400 font-mono leading-relaxed whitespace-pre">
                  {getJsonViewText()}
                </pre>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // 입력 폼
  return (
    <div className="space-y-3">
      {/* 저장된 고객 선택 */}
      {clients.length > 0 && (
        <div>
          <label className="block text-xs text-gray-500 mb-1">저장된 고객</label>
          <div className="flex gap-2">
            <select
              value={selectedClientId}
              onChange={(e) => handleSelectClient(e.target.value)}
              className={`flex-1 ${selectClass}`}
            >
              <option value="">-- 고객 선택 --</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.birth_year}.{c.birth_month}.{c.birth_day} {c.gender === '남' ? '남' : '여'})
                </option>
              ))}
            </select>
            {selectedClientId && (
              <button
                onClick={handleDeleteClient}
                className="px-3 py-2 text-xs rounded-lg bg-red-900/50 text-red-400 hover:bg-red-800 transition"
              >
                삭제
              </button>
            )}
          </div>
        </div>
      )}

      {/* 이름 */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">이름</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Valued Guest"
          className="w-full bg-[#1A1A2E] border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 placeholder-gray-600 focus:border-purple-500 focus:outline-none"
        />
      </div>

      {/* 성별 */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">성별</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value as '남' | '여')}
          className={`w-full ${selectClass}`}
        >
          <option value="여">여성 (Female)</option>
          <option value="남">남성 (Male)</option>
        </select>
      </div>

      {/* 달력 유형: 양력 / 음력 / 윤달 */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">달력</label>
        <select
          value={calendarType}
          onChange={(e) => setCalendarType(e.target.value as 'solar' | 'lunar' | 'leapLunar')}
          className={`w-full ${selectClass}`}
        >
          <option value="solar">양력 (Solar)</option>
          <option value="lunar">음력 (Lunar)</option>
          <option value="leapLunar">음력 윤달 (Leap Month)</option>
        </select>
      </div>

      {/* 생년월일 — 년/월/일 스크롤 */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">
          생년월일 ({calendarType === 'solar' ? '양력' : '음력'})
        </label>
        <div className="grid grid-cols-3 gap-2">
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className={selectClass}
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}년</option>
            ))}
          </select>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className={selectClass}
          >
            {months.map((m) => (
              <option key={m} value={m}>{m}월</option>
            ))}
          </select>
          <select
            value={day}
            onChange={(e) => setDay(Number(e.target.value))}
            className={selectClass}
          >
            {days.map((d) => (
              <option key={d} value={d}>{d}일</option>
            ))}
          </select>
        </div>
      </div>

      {/* 태어난 시간 — 모드 선택 */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">태어난 시간</label>
        <div className="flex gap-1 mb-2">
          <button
            onClick={() => setTimeMode('jijin')}
            className={`px-3 py-1 text-xs rounded-md transition ${
              timeMode === 'jijin' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'
            }`}
          >
            12지신
          </button>
          <button
            onClick={() => setTimeMode('exact')}
            className={`px-3 py-1 text-xs rounded-md transition ${
              timeMode === 'exact' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'
            }`}
          >
            정확한 시간
          </button>
        </div>

        {timeMode === 'jijin' ? (
          <select
            value={timeIdx}
            onChange={(e) => setTimeIdx(Number(e.target.value))}
            className={`w-full ${selectClass}`}
          >
            {JIJIN_HOURS.map((j, i) => (
              <option key={i} value={i}>{j.label}</option>
            ))}
          </select>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            <select
              value={ampm}
              onChange={(e) => setAmpm(e.target.value as '오전' | '오후')}
              className={selectClass}
            >
              <option value="오전">오전 (AM)</option>
              <option value="오후">오후 (PM)</option>
            </select>
            <select
              value={exactHour}
              onChange={(e) => setExactHour(Number(e.target.value))}
              className={selectClass}
            >
              {Array.from({ length: 12 }, (_, i) => i === 0 ? 12 : i).map((h) => (
                <option key={h} value={h}>{h}시</option>
              ))}
            </select>
            <select
              value={exactMinute}
              onChange={(e) => setExactMinute(Number(e.target.value))}
              className={selectClass}
            >
              {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                <option key={m} value={m}>{String(m).padStart(2, '0')}분</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 계산 버튼 */}
      <button
        onClick={handleCalculate}
        disabled={loading}
        className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium rounded-lg disabled:opacity-40 hover:from-purple-500 hover:to-indigo-500 transition"
      >
        {loading ? '계산 중...' : '사주 계산 (Calculate)'}
      </button>

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
