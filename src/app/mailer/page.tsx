'use client';

import { useState, useRef } from 'react';

const INITIAL_FORM = {
  customerName: '',
  customerEmail: '',
  customMessage:
    'Thank you for choosing Saju Muse. Your personalized Four Pillars reading has been carefully prepared based on your birth details.\n\nPlease find your detailed report attached to this email. Take your time reading through it — there are deep insights about your life path, relationships, and career waiting for you.',
  pdfDownloadLink: '',
};

export default function MailerPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<
    'idle' | 'sending' | 'success' | 'error' | 'confirming'
  >('idle');
  const [resultMessage, setResultMessage] = useState('');
  const [previewHTML, setPreviewHTML] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const handlePreview = async () => {
    setPreviewLoading(true);
    try {
      const res = await fetch('/api/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.NEXT_PUBLIC_API_SECRET ? { 'x-api-key': process.env.NEXT_PUBLIC_API_SECRET } : {}),
        },
        body: JSON.stringify({ ...form, birthDate: '', readingType: '', orderId: '', reviewLink: '' }),
      });
      const data = await res.json();
      setPreviewHTML(data.html);
      setShowPreview(true);
    } catch {
      setResultMessage('미리보기 실패. 다시 시도해주세요.');
      setStatus('error');
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleSendClick = () => {
    if (!form.customerEmail || !form.customerName) {
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
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      // API가 기대하는 필드 기본값
      formData.append('birthDate', '');
      formData.append('readingType', '');
      formData.append('orderId', '');
      formData.append('reviewLink', '');
      files.forEach((file) => {
        formData.append('files', file);
      });

      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          ...(process.env.NEXT_PUBLIC_API_SECRET ? { 'x-api-key': process.env.NEXT_PUBLIC_API_SECRET } : {}),
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setResultMessage(`${form.customerEmail}로 발송 완료!`);
        setTimeout(() => {
          setForm(INITIAL_FORM);
          setFiles([]);
          setStatus('idle');
          setResultMessage('');
        }, 4000);
      } else {
        setStatus('error');
        setResultMessage(data.error || '이메일 발송 실패.');
      }
    } catch {
      setStatus('error');
      setResultMessage('네트워크 오류. 인터넷 연결을 확인해주세요.');
    }
  };

  const totalFileSize = files.reduce((acc, f) => acc + f.size, 0);

  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background-color: #0d0d1a;
          color: #e0ddd5;
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
        }

        .page {
          max-width: 860px;
          margin: 0 auto;
          padding: 48px 24px 80px;
        }

        .header {
          text-align: center;
          margin-bottom: 48px;
        }

        .header-brand {
          font-size: 11px;
          letter-spacing: 5px;
          color: #c9a96e;
          text-transform: uppercase;
          font-family: 'Cormorant Garamond', serif;
          margin-bottom: 8px;
        }

        .header-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          font-weight: 400;
          color: #ffffff;
          letter-spacing: 1px;
        }

        .header-sub {
          font-size: 13px;
          color: #6b6b80;
          margin-top: 8px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }

        .form-full {
          grid-column: 1 / -1;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field label {
          font-size: 11px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #8888a0;
          font-weight: 500;
        }

        .field input,
        .field select,
        .field textarea {
          background: #151528;
          border: 1px solid #2a2a45;
          border-radius: 6px;
          padding: 12px 16px;
          color: #e0ddd5;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .field input:focus,
        .field select:focus,
        .field textarea:focus {
          border-color: #c9a96e;
          box-shadow: 0 0 0 2px rgba(201, 169, 110, 0.12);
        }

        .field input::placeholder,
        .field textarea::placeholder {
          color: #4a4a60;
        }

        .field textarea {
          resize: vertical;
          min-height: 140px;
          line-height: 1.7;
        }

        .field select {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238888a0' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 36px;
        }

        .upload-zone {
          border: 2px dashed #2a2a45;
          border-radius: 8px;
          padding: 28px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          background: #111122;
        }

        .upload-zone:hover {
          border-color: #c9a96e;
          background: #151530;
        }

        .upload-icon {
          font-size: 28px;
          margin-bottom: 8px;
        }

        .upload-text {
          font-size: 13px;
          color: #8888a0;
        }

        .upload-hint {
          font-size: 11px;
          color: #555570;
          margin-top: 4px;
        }

        .file-list {
          margin-top: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .file-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #151528;
          border: 1px solid #2a2a45;
          border-radius: 6px;
          padding: 10px 16px;
        }

        .file-info {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .file-icon {
          font-size: 18px;
          flex-shrink: 0;
        }

        .file-name {
          font-size: 13px;
          color: #c9a96e;
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .file-size {
          font-size: 12px;
          color: #6b6b80;
          flex-shrink: 0;
        }

        .file-remove {
          background: none;
          border: none;
          color: #6b6b80;
          cursor: pointer;
          font-size: 16px;
          padding: 2px 6px;
          border-radius: 4px;
          transition: color 0.2s, background 0.2s;
          flex-shrink: 0;
        }

        .file-remove:hover {
          color: #dc5050;
          background: rgba(220, 80, 80, 0.1);
        }

        .file-total {
          font-size: 12px;
          color: #6b6b80;
          text-align: right;
          margin-top: 8px;
        }

        .file-warning {
          color: #dc5050;
        }

        .actions {
          display: flex;
          gap: 12px;
          margin-top: 32px;
        }

        .btn {
          padding: 14px 32px;
          border: none;
          border-radius: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary {
          background: linear-gradient(135deg, #c9a96e 0%, #a8884e 100%);
          color: #0d0d1a;
          flex: 1;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(201, 169, 110, 0.25);
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .btn-secondary {
          background: transparent;
          color: #8888a0;
          border: 1px solid #2a2a45;
        }

        .btn-secondary:hover {
          border-color: #8888a0;
          color: #e0ddd5;
        }

        .btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .status-bar {
          margin-top: 20px;
          padding: 14px 20px;
          border-radius: 6px;
          font-size: 14px;
          text-align: center;
        }

        .status-success {
          background: rgba(80, 200, 120, 0.1);
          color: #50c878;
          border: 1px solid rgba(80, 200, 120, 0.2);
        }

        .status-error {
          background: rgba(220, 80, 80, 0.1);
          color: #dc5050;
          border: 1px solid rgba(220, 80, 80, 0.2);
        }

        .status-sending {
          background: rgba(201, 169, 110, 0.1);
          color: #c9a96e;
          border: 1px solid rgba(201, 169, 110, 0.2);
        }

        .confirm-bar {
          margin-top: 20px;
          padding: 16px 20px;
          border-radius: 6px;
          background: rgba(201, 169, 110, 0.08);
          border: 1px solid rgba(201, 169, 110, 0.2);
        }

        .confirm-text {
          font-size: 14px;
          color: #e0ddd5;
          margin-bottom: 12px;
          line-height: 1.6;
        }

        .confirm-details {
          font-size: 13px;
          color: #8888a0;
          margin-bottom: 14px;
          line-height: 1.5;
        }

        .confirm-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }

        .btn-confirm {
          padding: 8px 24px;
          border: none;
          border-radius: 4px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          background: linear-gradient(135deg, #c9a96e 0%, #a8884e 100%);
          color: #0d0d1a;
        }

        .btn-cancel {
          padding: 8px 24px;
          border: 1px solid #2a2a45;
          border-radius: 4px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          background: transparent;
          color: #8888a0;
        }

        .btn-cancel:hover {
          border-color: #8888a0;
          color: #e0ddd5;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 24px;
        }

        .modal {
          background: #ffffff;
          border-radius: 8px;
          width: 100%;
          max-width: 680px;
          max-height: 85vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 1px solid #eee;
          position: sticky;
          top: 0;
          background: #fff;
          z-index: 1;
        }

        .modal-header span {
          font-size: 14px;
          font-weight: 600;
          color: #333;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #999;
          padding: 4px 8px;
        }

        .section-divider {
          height: 1px;
          background: #2a2a45;
          margin: 32px 0 28px;
        }

        .section-label {
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #6b6b80;
          margin-bottom: 16px;
        }

        @media (max-width: 600px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          .actions {
            flex-direction: column;
          }
          .header-title {
            font-size: 26px;
          }
          .confirm-actions {
            flex-direction: column-reverse;
          }
        }
      `}</style>

      <div className="page">
        <div className="header">
          <div className="header-brand">사주뮤즈</div>
          <h1 className="header-title">이메일 발송</h1>
          <p className="header-sub">
            고객에게 사주 리딩 리포트를 발송합니다
          </p>
        </div>

        <div className="section-label">고객 정보</div>
        <div className="form-grid">
          <div className="field">
            <label>고객 이름 *</label>
            <input
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              placeholder="예: Sarah Kim"
            />
          </div>
          <div className="field">
            <label>고객 이메일 *</label>
            <input
              name="customerEmail"
              type="email"
              value={form.customerEmail}
              onChange={handleChange}
              placeholder="customer@email.com"
            />
          </div>
        </div>

        <div className="section-divider" />

        <div className="section-label">이메일 메시지</div>
        <div className="form-grid">
          <div className="field form-full">
            <label>메시지 내용 *</label>
            <textarea
              name="customMessage"
              value={form.customMessage}
              onChange={handleChange}
              placeholder="고객에게 보낼 메시지를 작성하세요..."
            />
          </div>
        </div>

        <div className="section-divider" />

        <div className="section-label">첨부파일</div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.zip"
          multiple
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <div
          className="upload-zone"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="upload-icon">+</div>
          <div className="upload-text">
            클릭하여 파일 추가
          </div>
          <div className="upload-hint">
            PDF, DOC, 이미지, ZIP (최대 25MB)
          </div>
        </div>

        {files.length > 0 && (
          <div className="file-list">
            {files.map((file, index) => (
              <div key={`${file.name}-${index}`} className="file-item">
                <div className="file-info">
                  <span className="file-icon">
                    {file.name.endsWith('.pdf')
                      ? 'PDF'
                      : file.name.match(/\.(jpg|jpeg|png|gif)$/i)
                        ? 'IMG'
                        : 'FILE'}
                  </span>
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">{formatFileSize(file.size)}</span>
                </div>
                <button
                  className="file-remove"
                  onClick={() => removeFile(index)}
                  title="파일 삭제"
                >
                  x
                </button>
              </div>
            ))}
            <div className={`file-total ${totalFileSize > 25 * 1024 * 1024 ? 'file-warning' : ''}`}>
              {files.length}개 파일 · {formatFileSize(totalFileSize)}
              {totalFileSize > 25 * 1024 * 1024 && ' — 25MB 제한 초과'}
            </div>
          </div>
        )}

        <div className="form-grid" style={{ marginTop: 16 }}>
          <div className="field form-full">
            <label>PDF 다운로드 링크 (선택, 이메일 본문에 표시)</label>
            <input
              name="pdfDownloadLink"
              value={form.pdfDownloadLink}
              onChange={handleChange}
              placeholder="https://drive.google.com/... 또는 비워두기"
            />
          </div>
        </div>

        <div className="actions">
          <button
            className="btn btn-secondary"
            onClick={handlePreview}
            disabled={previewLoading}
          >
            {previewLoading ? '로딩중...' : '미리보기'}
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSendClick}
            disabled={status === 'sending' || status === 'confirming'}
          >
            {status === 'sending' ? '발송중...' : '이메일 발송'}
          </button>
        </div>

        {status === 'confirming' && (
          <div className="confirm-bar">
            <div className="confirm-text">
              <strong>{form.customerEmail}</strong>로 이메일을 발송할까요?
            </div>
            <div className="confirm-details">
              받는 사람: {form.customerName} ({form.customerEmail})
              {files.length > 0 && <><br />첨부파일: {files.length}개 ({formatFileSize(totalFileSize)})</>}
            </div>
            <div className="confirm-actions">
              <button
                className="btn-cancel"
                onClick={() => setStatus('idle')}
              >
                취소
              </button>
              <button
                className="btn-confirm"
                onClick={handleConfirmSend}
              >
                확인 후 발송
              </button>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="status-bar status-success">{resultMessage}</div>
        )}
        {status === 'error' && (
          <div className="status-bar status-error">{resultMessage}</div>
        )}
        {status === 'sending' && (
          <div className="status-bar status-sending">이메일 발송중...</div>
        )}

        {showPreview && (
          <div className="modal-overlay" onClick={() => setShowPreview(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <span>이메일 미리보기</span>
                <button
                  className="modal-close"
                  onClick={() => setShowPreview(false)}
                >
                  x
                </button>
              </div>
              <div dangerouslySetInnerHTML={{ __html: previewHTML }} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
