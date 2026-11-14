import React, { useRef, useState } from 'react';
import { ImagePlus, Link as LinkIcon } from 'lucide-react';
import { processUploadedImage } from '../lib/imageUpload';
import { EditorialImage } from './EditorialImage';

interface ImageFieldProps {
  label: string;
  src: string;
  alt: string;
  onChange: (nextSrc: string, nextAlt: string) => void;
  aspectClass?: string;
}

export function ImageField({
  label,
  src,
  alt,
  onChange,
  aspectClass = 'aspect-[16/10]',
}: ImageFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState(
    src.startsWith('data:') ? '' : src
  );
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      const dataUrl = await processUploadedImage(file);
      setUrlInput('');
      onChange(dataUrl, alt);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '사진 처리 중 오류가 발생했습니다.'
      );
    } finally {
      setBusy(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleApplyUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    setError(null);
    onChange(trimmed, alt);
  };

  return (
    <div className="space-y-3 rounded-xl border border-[#353832]/15 bg-[#F5F1E9]/50 p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-[#353832]">{label}</span>
        <button
          type="button"
          disabled={busy}
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex min-h-[36px] items-center gap-1.5 rounded-md bg-[#26364C] px-3 py-1.5 text-xs font-medium text-[#F5F1E9] transition-colors hover:bg-[#1e2b3d] disabled:opacity-60"
        >
          <ImagePlus className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{busy ? '처리 중...' : '기기에서 사진 선택'}</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="overflow-hidden rounded-lg border border-[#353832]/10 bg-[#FFFFFF]">
        <EditorialImage src={src} alt={alt} aspectClass={aspectClass} />
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="또는 이미지 URL(https://...) 직접 입력"
            className="min-h-[38px] flex-1 rounded-md border border-[#353832]/20 bg-[#FFFFFF] px-3 text-xs text-[#353832] focus:border-[#26364C] focus:outline-none"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="inline-flex min-h-[38px] shrink-0 items-center gap-1 rounded-md border border-[#353832]/20 bg-[#FFFFFF] px-3 text-xs font-medium text-[#353832] hover:border-[#26364C]"
          >
            <LinkIcon className="h-3 w-3" aria-hidden="true" />
            <span>URL 적용</span>
          </button>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-[#656860]">
            사진 설명(대체 텍스트)
          </label>
          <input
            type="text"
            value={alt}
            onChange={(e) => onChange(src, e.target.value)}
            className="mt-1 min-h-[36px] w-full rounded-md border border-[#353832]/20 bg-[#FFFFFF] px-3 text-xs text-[#353832] focus:border-[#26364C] focus:outline-none"
          />
        </div>
      </div>

      {error && <p className="text-xs text-[#9A3412]">{error}</p>}
    </div>
  );
}
