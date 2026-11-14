import { ArrowLeft } from 'lucide-react';
import { useLeaf } from '../context/LeafContext';
import { Link } from '../lib/router';
import { EditorialImage } from '../components/EditorialImage';
import { EditTriggerButton } from '../components/EditTriggerButton';

export function ArchivePage() {
  const { archiveEntries } = useLeaf();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="border-b border-[#353832]/12 pb-8">
        <p className="text-xs font-medium tracking-[0.2em] text-[#545745]">
          ARCHIVE
        </p>
        <h1 className="font-serif-kr mt-2 text-3xl font-medium text-[#353832] sm:text-4xl">
          Piece. 번호가 담긴 기획 기록
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#656860]">
          Leaf.의 모든 상품에 번호를 붙이지는 않습니다. 특별한 기획 의도와 제작 스터디가 담긴 옷에 한해 고유한 Piece. 번호를 부여하고, 판매 기간이 지나도 그 기록을 남깁니다.
        </p>
      </div>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        {archiveEntries.map((entry) => (
          <article
            key={entry.pieceNumber}
            className="relative flex flex-col overflow-hidden rounded-xl border border-[#353832]/10 bg-[#FFFFFF]"
          >
            <EditTriggerButton
              target={{ type: 'archive', pieceNumber: entry.pieceNumber }}
              className="absolute top-3 right-3 z-10"
            />
            <Link to={`/archive/${entry.pieceNumber}`} className="block">
              <EditorialImage
                src={entry.image}
                alt={entry.imageAlt}
                aspectClass="aspect-[4/3]"
              />
            </Link>
            <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-[#656860]">
                  <span className="font-editorial text-sm font-semibold text-[#26364C]">
                    {entry.pieceNumber}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{entry.season}</span>
                </div>
                <h2 className="font-editorial text-2xl font-medium text-[#353832]">
                  <Link
                    to={`/archive/${entry.pieceNumber}`}
                    className="hover:text-[#26364C]"
                  >
                    {entry.title}
                  </Link>
                </h2>
                <p className="text-sm font-medium text-[#353832]">
                  {entry.intent}
                </p>
                <p className="text-sm leading-relaxed text-[#656860]">
                  {entry.story}
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-[#353832]/10 pt-4 text-xs">
                <span className="text-[#656860]">{entry.materialSummary}</span>
                <Link
                  to={`/archive/${entry.pieceNumber}`}
                  className="shrink-0 font-medium text-[#26364C] hover:underline"
                >
                  아카이브 보기 →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function ArchiveDetailPage({ piece }: { piece: string }) {
  const { archiveEntries, products } = useLeaf();
  const entry = archiveEntries.find(
    (e) => e.pieceNumber.toLowerCase() === piece.toLowerCase()
  );
  const relatedProduct = entry?.relatedProductSlug
    ? products.find((p) => p.slug === entry.relatedProductSlug)
    : undefined;

  if (!entry) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-serif-kr text-2xl font-medium text-[#353832]">
          해당 Piece 기록을 찾을 수 없습니다.
        </h1>
        <Link
          to="/archive"
          className="mt-6 inline-flex min-h-[44px] items-center rounded-lg bg-[#26364C] px-5 py-2.5 text-sm font-medium text-[#F5F1E9]"
        >
          ARCHIVE로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/archive"
          className="inline-flex min-h-[40px] items-center gap-1.5 text-sm text-[#656860] hover:text-[#353832]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>ARCHIVE 목록으로</span>
        </Link>
        <EditTriggerButton
          target={{ type: 'archive', pieceNumber: entry.pieceNumber }}
        />
      </div>

      <article className="mt-8 space-y-8">
        <header className="space-y-3 border-b border-[#353832]/12 pb-6">
          <div className="flex items-center gap-2 text-xs text-[#656860]">
            <span className="font-editorial text-base font-semibold text-[#26364C]">
              {entry.pieceNumber}
            </span>
            <span aria-hidden="true">·</span>
            <span>{entry.season}</span>
          </div>
          <h1 className="font-editorial text-3xl font-medium text-[#353832] sm:text-4xl">
            {entry.title}
          </h1>
          <p className="text-base leading-relaxed text-[#656860]">
            {entry.intent}
          </p>
        </header>

        <div className="overflow-hidden rounded-xl border border-[#353832]/10 bg-[#FFFFFF]">
          <EditorialImage
            src={entry.image}
            alt={entry.imageAlt}
            aspectClass="aspect-[16/10]"
            priority
          />
        </div>

        <div className="grid gap-8 md:grid-cols-12">
          <div className="space-y-4 md:col-span-8">
            <h2 className="font-serif-kr text-xl font-medium text-[#353832]">
              디자인 의도와 제작 기록
            </h2>
            <p className="text-base leading-[1.8] text-[#353832]">
              {entry.story}
            </p>
          </div>
          <aside className="space-y-4 rounded-xl border border-[#353832]/10 bg-[#FFFFFF] p-5 md:col-span-4">
            <div>
              <p className="text-xs text-[#656860]">소재 요약</p>
              <p className="mt-1 text-sm font-medium text-[#353832]">
                {entry.materialSummary}
              </p>
            </div>
            {relatedProduct ? (
              <div className="border-t border-[#353832]/10 pt-4">
                <p className="text-xs text-[#656860]">연결된 제품 페이지</p>
                <p className="mt-1 text-sm font-semibold text-[#353832]">
                  {relatedProduct.name}
                </p>
                <Link
                  to={`/shop/${relatedProduct.slug}`}
                  className="mt-3 inline-flex min-h-[40px] w-full items-center justify-center rounded-lg bg-[#26364C] px-4 py-2 text-xs font-medium text-[#F5F1E9]"
                >
                  SHOP 상세 보기
                </Link>
              </div>
            ) : (
              <div className="border-t border-[#353832]/10 pt-4">
                <p className="text-xs leading-relaxed text-[#656860]">
                  이 Piece는 현재 판매 페이지 없이 아카이브 스터디 기록으로만 보존되어 있습니다.
                </p>
              </div>
            )}
          </aside>
        </div>
      </article>
    </div>
  );
}
