import { useState } from 'react';
import { ArrowLeft, Check, Copy } from 'lucide-react';
import { useLeaf } from '../context/LeafContext';
import type { MindsetKind } from '../types/leaf';
import { Link } from '../lib/router';
import { JournalSubNav } from './JournalPage';
import { EditTriggerButton } from '../components/EditTriggerButton';
import { MINDSET_KIND_LABEL } from '../components/StatusLabels';

const MINDSET_FILTERS: { value: 'ALL' | MindsetKind; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'QUESTION', label: 'Question' },
  { value: 'NOTE', label: 'Note' },
  { value: 'SMALL_PRACTICE', label: 'Small Practice' },
];

export function MindsetPage() {
  const { mindsetPosts } = useLeaf();
  const [filter, setFilter] = useState<'ALL' | MindsetKind>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered =
    filter === 'ALL'
      ? mindsetPosts
      : mindsetPosts.filter((p) => p.kind === filter);

  const handleCopy = async (id: string, title: string, questions: string[]) => {
    const payload = `${title}\n\n${questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`;
    try {
      await navigator.clipboard.writeText(payload);
    } catch {
      // Clipboard fallback ignored cleanly in restricted sandbox
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <JournalSubNav activeTab="mindset" />

      <div className="border-b border-[#353832]/12 pb-8">
        <p className="text-xs font-medium tracking-[0.2em] text-[#545745]">
          MINDSET
        </p>
        <h1 className="font-serif-kr mt-2 text-3xl font-medium text-[#353832] sm:text-4xl">
          스스로를 알아가는 질문과 작은 실천
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#656860]">
          로그인 없이 누구나 읽을 수 있으며, 개인적인 성찰 답변을 사이트에 입력하거나 서버에 저장하지 않습니다. 마음에 닿는 질문은 복사해 나만의 노트에 적어 보세요.
        </p>

        <div className="mt-6 flex flex-wrap gap-1.5">
          {MINDSET_FILTERS.map((f) => {
            const active = filter === f.value;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
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

      <div className="mt-10 space-y-6">
        {filtered.map((item) => {
          const isCopied = copiedId === item.id;
          return (
            <article
              key={item.id}
              className="relative rounded-xl border border-[#353832]/10 bg-[#FFFFFF] p-6 sm:p-8"
            >
              <EditTriggerButton
                target={{ type: 'mindset', id: item.id }}
                label="질문 수정"
                className="absolute top-4 right-4 z-10"
              />
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#656860]">
                <span className="font-medium text-[#545745]">
                  {MINDSET_KIND_LABEL[item.kind]}
                </span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{item.publishedAt}</span>
              </div>

              <h2 className="font-serif-kr mt-3 text-xl font-medium text-[#353832] sm:text-2xl">
                <Link
                  to={`/journal/mindset/${item.slug}`}
                  className="hover:text-[#26364C]"
                >
                  {item.title}
                </Link>
              </h2>

              <p className="mt-2.5 text-sm leading-relaxed text-[#656860]">
                {item.summary}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-[#353832]/10 pt-4">
                <button
                  type="button"
                  onClick={() => handleCopy(item.id, item.title, item.questions)}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[#26364C]/25 bg-[#F5F1E9] px-4 py-2 text-xs font-medium text-[#26364C] transition-colors hover:bg-[#26364C] hover:text-[#F5F1E9]"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>질문 복사됨</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>질문 복사하기</span>
                    </>
                  )}
                </button>
                <Link
                  to={`/journal/mindset/${item.slug}`}
                  className="inline-flex min-h-[40px] items-center px-2 text-xs font-medium text-[#26364C] hover:underline"
                >
                  에세이와 실천 상세 읽기 →
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export function MindsetDetailPage({ slug }: { slug: string }) {
  const { mindsetPosts } = useLeaf();
  const item = mindsetPosts.find((p) => p.slug === slug);
  const [copied, setCopied] = useState(false);

  if (!item) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-serif-kr text-2xl font-medium text-[#353832]">
          마인드셋 글을 찾을 수 없습니다.
        </h1>
        <Link
          to="/journal/mindset"
          className="mt-6 inline-flex min-h-[44px] items-center rounded-lg bg-[#26364C] px-5 py-2.5 text-sm font-medium text-[#F5F1E9]"
        >
          MINDSET 목록으로
        </Link>
      </div>
    );
  }

  const handleCopy = async () => {
    const payload = `${item.title}\n\n${item.questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`;
    try {
      await navigator.clipboard.writeText(payload);
    } catch {
      // Ignore clipboard error in restricted context
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/journal/mindset"
          className="inline-flex min-h-[40px] items-center gap-1.5 text-sm text-[#656860] hover:text-[#353832]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>MINDSET 목록으로</span>
        </Link>
        <EditTriggerButton
          target={{ type: 'mindset', id: item.id }}
          label="질문 수정"
        />
      </div>

      <article className="mt-8 space-y-8">
        <header className="space-y-3 border-b border-[#353832]/12 pb-6">
          <div className="flex items-center gap-2 text-xs text-[#656860]">
            <span className="font-medium text-[#545745]">
              {MINDSET_KIND_LABEL[item.kind]}
            </span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{item.publishedAt}</span>
          </div>
          <h1 className="font-serif-kr text-2xl leading-snug font-medium text-[#353832] sm:text-3xl">
            {item.title}
          </h1>
          <p className="text-sm leading-relaxed text-[#656860]">
            {item.summary}
          </p>
        </header>

        <div className="space-y-5">
          {item.essay.map((para, i) => (
            <p key={i} className="text-base leading-[1.85] text-[#353832]">
              {para}
            </p>
          ))}
        </div>

        <section className="rounded-xl border border-[#353832]/12 bg-[#FFFFFF] p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-4 border-b border-[#353832]/10 pb-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-base font-semibold text-[#353832]">
                노트에 옮겨 적어 볼 질문
              </h2>
              <p className="mt-0.5 text-xs text-[#656860]">
                개인 답변은 사이트에 입력·저장되지 않습니다.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-lg bg-[#26364C] px-4 py-2 text-xs font-medium text-[#F5F1E9]"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>질문 복사됨</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>질문 전체 복사</span>
                </>
              )}
            </button>
          </div>

          <ol className="mt-5 space-y-3 text-sm leading-relaxed text-[#353832]">
            {item.questions.map((q, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="tabular-nums font-semibold text-[#26364C]">
                  0{idx + 1}.
                </span>
                <span>{q}</span>
              </li>
            ))}
          </ol>

          {item.practiceTip && (
            <div className="mt-6 rounded-lg bg-[#F5F1E9] p-4 text-xs leading-relaxed text-[#353832]">
              <p className="font-semibold text-[#545745]">작은 실천 제안</p>
              <p className="mt-1 text-[#656860]">{item.practiceTip}</p>
            </div>
          )}
        </section>

        <div className="flex flex-col justify-between gap-4 rounded-xl bg-[#E4DACB]/45 p-5 sm:flex-row sm:items-center">
          <p className="text-xs leading-relaxed text-[#656860]">
            혼자만의 성찰을 넘어 다른 분들과 경험을 나누고 싶다면 CIRCLE에서 새 글을 직접 작성해 공유할 수 있습니다. (자동 전송되지 않습니다.)
          </p>
          <Link
            to="/circle"
            className="inline-flex min-h-[40px] shrink-0 items-center justify-center rounded-lg border border-[#26364C]/30 bg-[#FFFFFF] px-4 py-2 text-xs font-medium text-[#26364C]"
          >
            CIRCLE 이동
          </Link>
        </div>
      </article>
    </div>
  );
}
