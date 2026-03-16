'use client';

import { useState, useRef } from 'react';

const DEFAULT_MESSAGE =
  'Thank you for choosing Saju Muse. Your personalized Four Pillars reading has been carefully prepared based on your birth details.\n\nPlease find your detailed report attached to this email. Take your time reading through it — there are deep insights about your life path, relationships, and career waiting for you.';

interface EmailSenderProps {
  pdfBlobUrl: string | null;
  clientName: string;
  tier: string;
}

export function EmailSender({ pdfBlobUrl, clientName, tier }: EmailSenderProps) {
  const [customerName, setCustomerName] = useState(clientName);
  const [customerEmail, setCustomerEmail] = useState('');
  const [customMessage, setCustomMessage] = useState(DEFAULT_MESSAGE);
  const [extraFiles, setExtraFiles] = useState<File[]>([]);
  const [pdfDownloadLink, setPdfDownloadLink] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error' | 'confirming'>('idle');
  const [resultMessage, setResultMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setExtraFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index: number) => {
    setExtraFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const handleSendClick = () => {
    if (!customerEmail || !customerName) {
      setStatus('error');
      setResultMessage('고객 이름과 이메일은 필수입니다.');
      return;
    }
    setStatus('confirming');
  };

  const handleConfirmSend = async () => {
    setStatus('sending');
    setResultMessage('');

    try {
      const formData = new FormData();
      formData.append('customerName', customerName);
      formData.append('customerEmail', customerEmail);
      formData.append('customMessage', customMessage);
      formData.append('pdfDownloadLink', pdfDownloadLink);
      formData.append('birthDate', '');
      formData.append('readingType', tier);
      formData.append('orderId', '');
      formData.append('reviewLink', '');

      // 생성된 PDF를 자동 첨부
      if (pdfBlobUrl) {
        const res = await fetch(pdfBlobUrl);
        const blob = await res.blob();
        const filename = `${customerName.replace(/\s+/g, '_')}_saju_${tier}.pdf`;
        formData.append('files', new File([blob], filename, { type: 'application/pdf' }));
      }

      // 추가 첨부파일
      extraFiles.forEach((file) => {
        formData.append('files', file);
      });

      const res = await fetch('/api/send-email', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setResultMessage(`${customerEmail}로 발송 완료!`);
      } else {
        setStatus('error');
        setResultMessage(data.error || '이메일 발송 실패.');
      }
    } catch {
      setStatus('error');
      setResultMessage('네트워크 오류. 인터넷 연결을 확인해주세요.');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-400 tracking-widest">이메일 발송</h3>

      {/* 고객 이름 + 이메일 */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">고객 이름 *</label>
          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="예: Sarah Kim"
            className="w-full bg-[#151528] border border-[#2a2a45] rounded-lg px-3 py-2.5 text-sm text-gray-200 outline-none focus:border-purple-500 transition"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">고객 이메일 *</label>
          <input
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            placeholder="customer@email.com"
            className="w-full bg-[#151528] border border-[#2a2a45] rounded-lg px-3 py-2.5 text-sm text-gray-200 outline-none focus:border-purple-500 transition"
          />
        </div>
      </div>

      {/* 메시지 */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">메시지 내용</label>
        <textarea
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          rows={5}
          className="w-full bg-[#151528] border border-[#2a2a45] rounded-lg px-3 py-2.5 text-sm text-gray-200 outline-none focus:border-purple-500 transition resize-vertical leading-relaxed"
        />
      </div>

      {/* PDF 자동 첨부 표시 */}
      {pdfBlobUrl && (
        <div className="flex items-center gap-2 text-xs text-green-400 bg-green-900/20 border border-green-800/30 rounded-lg px-3 py-2">
          <span>PDF</span>
          <span>생성된 PDF가 자동 첨부됩니다</span>
        </div>
      )}

      {/* 추가 첨부파일 */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.zip"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-xs text-gray-500 hover:text-gray-300 border border-dashed border-[#2a2a45] hover:border-purple-500 rounded-lg px-4 py-2 transition cursor-pointer"
        >
          + 추가 첨부파일
        </button>
        {extraFiles.length > 0 && (
          <div className="mt-2 space-y-1">
            {extraFiles.map((file, i) => (
              <div key={`${file.name}-${i}`} className="flex items-center justify-between bg-[#151528] border border-[#2a2a45] rounded-lg px-3 py-1.5 text-xs">
                <span className="text-gray-300 truncate">{file.name} <span className="text-gray-600">({formatFileSize(file.size)})</span></span>
                <button onClick={() => removeFile(i)} className="text-gray-600 hover:text-red-400 ml-2 cursor-pointer">x</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PDF 다운로드 링크 (선택) */}
      <div>
        <label className="block text-xs text-gray-500 mb-1">PDF 다운로드 링크 (선택, 이메일 본문에 표시)</label>
        <input
          value={pdfDownloadLink}
          onChange={(e) => setPdfDownloadLink(e.target.value)}
          placeholder="https://drive.google.com/... 또는 비워두기"
          className="w-full bg-[#151528] border border-[#2a2a45] rounded-lg px-3 py-2.5 text-sm text-gray-200 outline-none focus:border-purple-500 transition"
        />
      </div>

      {/* 발송 버튼 */}
      <button
        onClick={handleSendClick}
        disabled={status === 'sending' || status === 'confirming'}
        className="w-full py-3 rounded-xl font-bold text-white bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm cursor-pointer"
      >
        {status === 'sending' ? '발송중...' : '이메일 발송'}
      </button>

      {/* 확인 다이얼로그 */}
      {status === 'confirming' && (
        <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg p-4">
          <p className="text-sm text-gray-200 mb-2">
            <strong className="text-amber-400">{customerEmail}</strong>로 이메일을 발송할까요?
          </p>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setStatus('idle')} className="px-4 py-1.5 text-xs text-gray-400 border border-[#2a2a45] rounded-lg hover:text-gray-200 transition cursor-pointer">
              취소
            </button>
            <button onClick={handleConfirmSend} className="px-4 py-1.5 text-xs font-bold text-black bg-amber-500 rounded-lg hover:bg-amber-400 transition cursor-pointer">
              확인 후 발송
            </button>
          </div>
        </div>
      )}

      {/* 상태 메시지 */}
      {status === 'success' && (
        <div className="text-center text-sm text-green-400 bg-green-900/20 border border-green-800/30 rounded-lg py-3">{resultMessage}</div>
      )}
      {status === 'error' && (
        <div className="text-center text-sm text-red-400 bg-red-900/20 border border-red-800/30 rounded-lg py-3">{resultMessage}</div>
      )}
    </div>
  );
}
