import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useLeaf } from '../context/LeafContext';
import type { JournalKind } from '../types/leaf';
import { Link } from '../lib/router';
import { EditorialImage } from '../components/EditorialImage';
import { EditTriggerButton } from '../components/EditTriggerButton';
import { JOURNAL_KIND_LABEL } from '../components/StatusLabels';

export function JournalSubNav({ activeTab }: { activeTab: 'journal' | 'mindset' }) {
  return (
    <div className="mb-8 flex items-center gap-6 border-b border-[#353832]/12">
      <Link
        to="/journal"
        className={`relative pb-3 text-sm font-medium tracking-wide whitespace-nowrap transition-colors ${
          activeTab === 'journal'
            ? 'text-[#26364C]'
            : 'text-[#656860] hover:text-[#353832]'
        }`}
      >
        JOURNAL · 브랜드와 제작 이야기
        {activeTab === 'journal' && (
          <span
            aria-hidden="true"
            className="absolute right-0 bottom-0 left-0 h-[2px] bg-[#26364C]"
          />
        )}
      </Link>
      <Link
        to="/journal/mindset"
        className={`relative pb-3 text-sm font-medium tracking-wide whitespace-nowrap transition-colors ${
          activeTab === 'mindset'
            ? 'text-[#26364C]'
            : 'text-[#656860] hover:text-[#353832]'
        }`}
      >
        MINDSET · 질문과 작은 실천
        {activeTab === 'mindset' && (
          <span
            aria-hidden="true"
            className="absolute right-0 bottom-0 left-0 h-[2px] bg-[#26364C]"
          />
        )}
      </Link>
    </div>
  );
}

const KIND_FILTERS: { value: 'ALL' | JournalKind; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'MAKING', label: '제작 기록' },
  { value: 'BRAND', label: '브랜드 이야기' },
  { value: 'PEOPLE', label: '사람과의 대화' },
];

export function JournalPage() {
  const { journalPosts } = useLeaf();
  const [kind, setKind] = useState<'ALL' | JournalKind>('ALL');
  const filtered =
    kind === 'ALL'
      ? journalPosts
      : journalPosts.filter((post) => post.kind === kind);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <JournalSubNav activeTab="journal" />

      <div className="flex flex-col justify-between gap-6 border-b border-[#353832]/12 pb-8 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-medium tracking-[0.2em] text-[#545745]">
            JOURNAL
          </p>
          <h1 className="font-serif-kr mt-2 text-3xl font-medium text-[#353832] sm:text-4xl">
            브랜드와 제작의 기록
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#656860]">
            옷을 만드는 현장의 기록, 원단과 공방의 이야기, 그리고 자신만의 속도로 살아가는 사람들의 대화를 모았습니다.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {KIND_FILTERS.map((f) => {
            const active = kind === f.value;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => setKind(f.value)}
                className={`min-h-[38px] rounded-md border px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                  active
                    ? 'border-[#26364C] bg-[#26364C] text-[#F5F1E9]'
                    : 'border-[#353832]/15 bg-[#FFFFFF]/70 text-[#656860] hover:text-[#353832]'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-3">
        {filtered.map((post) => (
          <article
            key={post.id}
            className="relative flex flex-col overflow-hidden rounded-xl border border-[#353832]/10 bg-[#FFFFFF]"
          >
            <EditTriggerButton
              target={{ type: 'journal', id: post.id }}
              className="absolute top-3 right-3 z-10"
            />
            <Link to={`/journal/${post.slug}`} className="block">
              <EditorialImage
                src={post.coverImage}
                alt={post.coverAlt}
                aspectClass="aspect-[4/3]"
              />
            </Link>
            <div className="flex flex-1 flex-col justify-between p-6">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-[#656860]">
                  <span>{JOURNAL_KIND_LABEL[post.kind]}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{post.publishedAt}</span>
                  <span aria-hidden="true">·</span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="font-serif-kr text-xl leading-snug font-medium text-[#353832]">
                  <Link
                    to={`/journal/${post.slug}`}
                    className="hover:text-[#26364C]"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="text-sm leading-relaxed text-[#656860]">
                  {post.excerpt}
                </p>
              </div>
              <div className="mt-5 border-t border-[#353832]/10 pt-3">
                <Link
                  to={`/journal/${post.slug}`}
                  className="text-xs font-medium text-[#26364C] hover:underline"
                >
                  글 전문 읽기 →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function JournalDetailPage({ slug }: { slug: string }) {
  const { journalPosts, products } = useLeaf();
  const post = journalPosts.find((p) => p.slug === slug);
  const relatedProduct = post?.relatedProductSlug
    ? products.find((p) => p.slug === post.relatedProductSlug)
    : undefined;

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-serif-kr text-2xl font-medium text-[#353832]">
          저널 글을 찾을 수 없습니다.
        </h1>
        <Link
          to="/journal"
          className="mt-6 inline-flex min-h-[44px] items-center rounded-lg bg-[#26364C] px-5 py-2.5 text-sm font-medium text-[#F5F1E9]"
        >
          JOURNAL로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/journal"
          className="inline-flex min-h-[40px] items-center gap-1.5 text-sm text-[#656860] hover:text-[#353832]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>JOURNAL 목록으로</span>
        </Link>
        <EditTriggerButton target={{ type: 'journal', id: post.id }} />
      </div>

      <article className="mt-8">
        <header className="space-y-3 border-b border-[#353832]/12 pb-6">
          <div className="flex items-center gap-2 text-xs text-[#656860]">
            <span>{JOURNAL_KIND_LABEL[post.kind]}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{post.publishedAt}</span>
            <span aria-hidden="true">·</span>
            <span>{post.readTime}</span>
          </div>
          <h1 className="font-serif-kr text-3xl leading-snug font-medium text-[#353832] text-balance sm:text-4xl">
            {post.title}
          </h1>
          <p className="text-base text-[#656860]">{post.subtitle}</p>
        </header>

        <div className="mt-8 overflow-hidden rounded-xl border border-[#353832]/10 bg-[#FFFFFF]">
          <EditorialImage
            src={post.coverImage}
            alt={post.coverAlt}
            aspectClass="aspect-[16/10]"
            priority
          />
        </div>

        <div className="mx-auto mt-10 max-w-2xl space-y-6">
          {post.paragraphs.map((para, idx) => (
            <p
              key={idx}
              className="text-base leading-[1.85] text-[#353832]"
            >
              {para}
            </p>
          ))}

          {post.pullQuote && (
            <blockquote className="my-8 border-y border-[#353832]/15 py-6 text-center font-serif-kr text-xl leading-relaxed text-[#26364C]">
              “{post.pullQuote}”
            </blockquote>
          )}

          {relatedProduct && (
            <div className="mt-10 rounded-xl border border-[#353832]/12 bg-[#FFFFFF] p-6">
              <p className="text-xs text-[#656860]">이 글과 연결된 옷</p>
              <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-lg font-semibold text-[#353832]">
                    {relatedProduct.name}
                  </h2>
                  <p className="text-xs text-[#656860]">
                    {relatedProduct.material}
                  </p>
                </div>
                <Link
                  to={`/shop/${relatedProduct.slug}`}
                  className="inline-flex min-h-[40px] shrink-0 items-center justify-center rounded-lg bg-[#26364C] px-4 py-2 text-xs font-medium text-[#F5F1E9]"
                >
                  제품 상세 보기
                </Link>
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
