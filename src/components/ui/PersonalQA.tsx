'use client';

import { useGeneratorStore } from '@/store/useGeneratorStore';

export function PersonalQA() {
  const personalQuestion = useGeneratorStore((s) => s.personalQuestion);
  const personalAnswer = useGeneratorStore((s) => s.personalAnswer);
  const setPersonalQuestion = useGeneratorStore((s) => s.setPersonalQuestion);
  const setPersonalAnswer = useGeneratorStore((s) => s.setPersonalAnswer);

  return (
    <section className="w-full">
      <h2 className="text-sm font-semibold text-gray-400 tracking-widest mb-3">
        6단계 — 개인 질문 답변 <span className="text-gray-600">(선택사항)</span>
      </h2>
      <p className="text-xs text-gray-500 mb-3">
        고객의 개인 질문과 답변을 입력하면 PDF 마지막에 별도 페이지로 포함됩니다.
      </p>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">고객 질문</label>
          <textarea
            value={personalQuestion}
            onChange={(e) => setPersonalQuestion(e.target.value)}
            placeholder="예: Will I get promoted this year?"
            rows={2}
            maxLength={500}
            className="w-full bg-[#1A1A2E] border border-gray-700 rounded-xl p-4 text-sm text-gray-300 placeholder-gray-600 focus:border-purple-500 focus:outline-none resize-none"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 mb-1 block">분석가 답변</label>
          <textarea
            value={personalAnswer}
            onChange={(e) => setPersonalAnswer(e.target.value)}
            placeholder="사주 분석에 기반한 맞춤 답변을 영어로 작성해 주세요..."
            rows={6}
            className="w-full bg-[#1A1A2E] border border-gray-700 rounded-xl p-4 text-sm text-gray-300 placeholder-gray-600 focus:border-purple-500 focus:outline-none resize-none"
          />
        </div>
      </div>
    </section>
  );
}
