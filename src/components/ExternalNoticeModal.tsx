import { X } from 'lucide-react';
import { useLeaf } from '../context/LeafContext';

export function ExternalNoticeModal() {
  const { externalNotice, setExternalNotice } = useLeaf();

  if (!externalNotice) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="external-notice-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#26364C]/40 p-4 backdrop-blur-[2px]"
      onClick={() => setExternalNotice(null)}
    >
      <div
        className="w-full max-w-md rounded-xl border border-[#353832]/15 bg-[#FFFFFF] p-6 shadow-xl sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium tracking-wider text-[#545745]">
              시연 환경 안내 · {externalNotice.provider}
            </p>
            <h2
              id="external-notice-title"
              className="text-lg font-semibold text-[#353832]"
            >
              {externalNotice.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setExternalNotice(null)}
            aria-label="안내 창 닫기"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-[#656860] hover:bg-[#E4DACB]/50 hover:text-[#353832]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-[#656860]">
          {externalNotice.description}
        </p>

        <div className="mt-4 rounded-lg bg-[#F5F1E9] p-3.5 text-xs leading-relaxed text-[#353832]">
          <p className="font-medium text-[#26364C]">출시 전 연동 예정 사항</p>
          <p className="mt-1 text-[#656860]">
            현재 버전은 화면과 이용 흐름 시연을 위한 단계입니다. 실제 결제, 주문 확정, 예약 확인은
            등록된 외부 플랫폼({externalNotice.provider})에서 진행되며 Leaf. 사이트가 임의로 결제를 추정하지 않습니다.
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => setExternalNotice(null)}
            className="min-h-[44px] rounded-lg bg-[#26364C] px-5 py-2.5 text-sm font-medium text-[#F5F1E9] transition-colors hover:bg-[#1e2b3d]"
          >
            {externalNotice.actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
