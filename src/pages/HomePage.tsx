import { useState } from 'react';
import { ArrowRight, Check, Copy } from 'lucide-react';
import { useLeaf } from '../context/LeafContext';
import { Link } from '../lib/router';
import { EditorialImage } from '../components/EditorialImage';
import { EditTriggerButton } from '../components/EditTriggerButton';
import {
  CIRCLE_CATEGORY_LABEL,
  JOURNAL_KIND_LABEL,
  MINDSET_KIND_LABEL,
  PRODUCT_CATEGORY_LABEL,
  PRODUCTION_STATUS_LABEL,
  PROGRAM_MODE_LABEL,
  PROGRAM_STATUS_LABEL,
  SELLING_STATUS_LABEL,
  formatKrw,
} from '../components/StatusLabels';

export function HomePage() {
  const {
    hero,
    about,
    products,
    journalPosts,
    circlePosts,
    mindsetPosts,
    experiencePrograms,
  } = useLeaf();
  const [copiedQuestion, setCopiedQuestion] = useState(false);

  const openProducts = products.filter((p) =>
    p.rounds.some((r) => r.sellingStatus === 'OPEN')
  );
  const featuredProducts = openProducts.length > 0 ? openProducts : products.slice(0, 2);
  const featuredMaking = journalPosts[0];
  const secondaryJournals = journalPosts.slice(1, 3);
  const approvedCircle = circlePosts
    .filter((p) => p.status === 'APPROVED')
    .slice(0, 3);
  const latestMindset = mindsetPosts[0];
  const upcomingExperiences = experiencePrograms
    .filter((e) => e.status === 'OPEN' || e.status === 'UPCOMING')
    .slice(0, 2);

  const primaryOpenProduct = openProducts[0] ?? products[0];

  const handleCopyMindset = async () => {
    if (!latestMindset) return;
    const textToCopy = `${latestMindset.title}\n\n${latestMindset.questions
      .map((q, idx) => `${idx + 1}. ${q}`)
      .join('\n')}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedQuestion(true);
      setTimeout(() => setCopiedQuestion(false), 2000);
    } catch {
      setCopiedQuestion(true);
      setTimeout(() => setCopiedQuestion(false), 2000);
    }
  };

  return (
    <div className="bg-[#F5F1E9]">
      {/* 1. Hero Section */}
      <section className="border-b border-[#353832]/10">
        <div className="mx-auto grid max-w-6xl items-stretch gap-8 px-4 py-8 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-14">
          <div className="flex flex-col justify-center space-y-6 lg:col-span-5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium tracking-[0.2em] text-[#545745]">
                {hero.overline}
              </p>
              <EditTriggerButton target={{ type: 'hero' }} label="히어로 사진·글 수정" />
            </div>
            <h1 className="font-serif-kr text-3xl leading-[1.3] font-medium tracking-tight text-[#353832] text-balance sm:text-4xl lg:text-[2.75rem]">
              {hero.headline}
            </h1>
            <p className="max-w-md text-base leading-relaxed text-[#656860]">
              {hero.subcopy}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {primaryOpenProduct && (
                <Link
                  to={`/shop/${primaryOpenProduct.slug}`}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#26364C] px-6 py-3 text-sm font-medium text-[#F5F1E9] whitespace-nowrap transition-colors duration-150 hover:bg-[#1e2b3d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#26364C]"
                >
                  <span>{hero.primaryCtaLabel}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              )}
              <Link
                to="/about"
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-[#353832]/20 bg-[#FFFFFF]/70 px-5 py-3 text-sm font-medium text-[#353832] whitespace-nowrap transition-colors duration-150 hover:border-[#26364C] hover:text-[#26364C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#26364C]"
              >
                {hero.secondaryCtaLabel}
              </Link>
            </div>
          </div>

          <div className="relative lg:col-span-7">
            <div className="h-full overflow-hidden rounded-xl border border-[#353832]/10 bg-[#FFFFFF]">
              <EditorialImage
                src={hero.desktopImage}
                alt={hero.alt}
                aspectClass="aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[460px]"
                priority
              />
            </div>
            <EditTriggerButton
              target={{ type: 'hero' }}
              label="히어로 사진 변경"
              className="absolute right-3 bottom-3"
            />
          </div>
        </div>
      </section>

      {/* 2. Current Piece */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col justify-between gap-4 border-b border-[#353832]/12 pb-6 sm:flex-row sm:items-end">
          <div className="space-y-1.5">
            <p className="text-xs font-medium tracking-[0.16em] text-[#545745]">
              CURRENT PIECE
            </p>
            <h2 className="font-serif-kr text-2xl font-medium text-[#353832] sm:text-3xl">
              지금 소개하는 선주문 옷
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex min-h-[40px] items-center gap-1.5 text-sm font-medium text-[#26364C] hover:underline"
          >
            <span>전체 제품 보기</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {featuredProducts.map((product) => {
            const activeRound = product.rounds[0];
            return (
              <article
                key={product.id}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-[#353832]/10 bg-[#FFFFFF] transition-transform duration-200 hover:-translate-y-0.5"
              >
                <EditTriggerButton
                  target={{ type: 'product', id: product.id }}
                  className="absolute top-3 right-3 z-10"
                />
                <Link to={`/shop/${product.slug}`} className="block">
                  <EditorialImage
                    src={product.images[0]?.src || ''}
                    alt={product.images[0]?.alt || product.name}
                    aspectClass="aspect-[4/3]"
                  />
                </Link>
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#656860]">
                      <span>{PRODUCT_CATEGORY_LABEL[product.category]}</span>
                      {product.pieceNumber && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-medium text-[#26364C]">
                            {product.pieceNumber}
                          </span>
                        </>
                      )}
                      {activeRound && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{SELLING_STATUS_LABEL[activeRound.sellingStatus]}</span>
                        </>
                      )}
                    </div>

                    <h3 className="text-xl font-semibold text-[#353832]">
                      <Link
                        to={`/shop/${product.slug}`}
                        className="hover:text-[#26364C]"
                      >
                        {product.name}
                      </Link>
                    </h3>
                    <p className="text-sm leading-relaxed text-[#656860]">
                      {product.summary}
                    </p>
                  </div>

                  {activeRound && (
                    <div className="mt-6 flex items-center justify-between border-t border-[#353832]/10 pt-4">
                      <div className="space-y-0.5">
                        <p className="text-base font-semibold tabular-nums text-[#353832]">
                          {formatKrw(activeRound.price)}
                        </p>
                        <p className="text-xs text-[#656860]">
                          {activeRound.title} · {PRODUCTION_STATUS_LABEL[activeRound.productionStatus]}
                        </p>
                      </div>
                      <Link
                        to={`/shop/${product.slug}`}
                        className="inline-flex min-h-[40px] items-center gap-1 rounded-md border border-[#26364C]/25 px-4 py-2 text-xs font-medium text-[#26364C] transition-colors hover:bg-[#26364C] hover:text-[#F5F1E9]"
                      >
                        <span>자세히 보기</span>
                      </Link>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 3. Making Journal */}
      {featuredMaking && (
        <section className="border-y border-[#353832]/10 bg-[#E4DACB]/35">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="flex flex-col justify-between gap-4 border-b border-[#353832]/12 pb-6 sm:flex-row sm:items-end">
              <div className="space-y-1.5">
                <p className="text-xs font-medium tracking-[0.16em] text-[#545745]">
                  MAKING JOURNAL
                </p>
                <h2 className="font-serif-kr text-2xl font-medium text-[#353832] sm:text-3xl">
                  옷이 지어지는 과정과 사람들의 이야기
                </h2>
              </div>
              <Link
                to="/journal"
                className="inline-flex min-h-[40px] items-center gap-1.5 text-sm font-medium text-[#26364C] hover:underline"
              >
                <span>저널 전체 읽기</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-12">
              <article className="relative overflow-hidden rounded-xl border border-[#353832]/10 bg-[#FFFFFF] lg:col-span-7">
                <EditTriggerButton
                  target={{ type: 'journal', id: featuredMaking.id }}
                  className="absolute top-3 right-3 z-10"
                />
                <Link to={`/journal/${featuredMaking.slug}`} className="block">
                  <EditorialImage
                    src={featuredMaking.coverImage}
                    alt={featuredMaking.coverAlt}
                    aspectClass="aspect-[16/10]"
                  />
                </Link>
                <div className="space-y-3 p-6 sm:p-8">
                  <div className="flex items-center gap-2 text-xs text-[#656860]">
                    <span>{JOURNAL_KIND_LABEL[featuredMaking.kind]}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{featuredMaking.publishedAt}</span>
                    <span aria-hidden="true">·</span>
                    <span>{featuredMaking.readTime}</span>
                  </div>
                  <h3 className="font-serif-kr text-xl leading-snug font-medium text-[#353832] sm:text-2xl">
                    <Link
                      to={`/journal/${featuredMaking.slug}`}
                      className="hover:text-[#26364C]"
                    >
                      {featuredMaking.title}
                    </Link>
                  </h3>
                  <p className="text-sm leading-relaxed text-[#656860]">
                    {featuredMaking.excerpt}
                  </p>
                </div>
              </article>

              <div className="flex flex-col justify-between gap-6 lg:col-span-5">
                {secondaryJournals.map((post) => (
                  <article
                    key={post.id}
                    className="relative flex flex-1 flex-col justify-between rounded-xl border border-[#353832]/10 bg-[#FFFFFF] p-6"
                  >
                    <EditTriggerButton
                      target={{ type: 'journal', id: post.id }}
                      className="absolute top-3 right-3 z-10"
                    />
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-xs text-[#656860]">
                        <span>{JOURNAL_KIND_LABEL[post.kind]}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{post.publishedAt}</span>
                        <span aria-hidden="true">·</span>
                        <span>{post.readTime}</span>
                      </div>
                      <h3 className="font-serif-kr text-lg leading-snug font-medium text-[#353832]">
                        <Link
                          to={`/journal/${post.slug}`}
                          className="hover:text-[#26364C]"
                        >
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-sm leading-relaxed text-[#656860]">
                        {post.excerpt}
                      </p>
                    </div>
                    <div className="pt-4">
                      <Link
                        to={`/journal/${post.slug}`}
                        className="text-xs font-medium text-[#26364C] hover:underline"
                      >
                        글 전문 읽기 →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. From Our Circle */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col justify-between gap-4 border-b border-[#353832]/12 pb-6 sm:flex-row sm:items-end">
          <div className="space-y-1.5">
            <p className="text-xs font-medium tracking-[0.16em] text-[#545745]">
              FROM OUR CIRCLE
            </p>
            <h2 className="font-serif-kr text-2xl font-medium text-[#353832] sm:text-3xl">
              함께 나누는 옷과 삶의 기록
            </h2>
          </div>
          <Link
            to="/circle"
            className="inline-flex min-h-[40px] items-center gap-1.5 text-sm font-medium text-[#26364C] hover:underline"
          >
            <span>CIRCLE 둘러보기</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {approvedCircle.map((post) => (
            <article
              key={post.id}
              className="relative flex flex-col justify-between rounded-xl border border-[#353832]/10 bg-[#FFFFFF] p-6"
            >
              <EditTriggerButton
                target={{ type: 'circle', id: post.id }}
                className="absolute top-3 right-3 z-10"
              />
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-[#656860]">
                  <span>{CIRCLE_CATEGORY_LABEL[post.category]}</span>
                  <span aria-hidden="true">·</span>
                  <span>{post.authorNickname}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{post.createdAt}</span>
                </div>
                <h3 className="text-base leading-snug font-semibold text-[#353832]">
                  <Link to={`/circle/${post.id}`} className="hover:text-[#26364C]">
                    {post.title}
                  </Link>
                </h3>
                <p className="line-clamp-3 text-sm leading-relaxed text-[#656860]">
                  {post.body}
                </p>
              </div>
              <div className="mt-5 border-t border-[#353832]/10 pt-3">
                <Link
                  to={`/circle/${post.id}`}
                  className="text-xs font-medium text-[#26364C] hover:underline"
                >
                  이야기 읽기 →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 5. A Moment to Reflect (MINDSET) */}
      {latestMindset && (
        <section className="relative border-y border-[#353832]/10 bg-[#FFFFFF]">
          <EditTriggerButton
            target={{ type: 'mindset', id: latestMindset.id }}
            label="질문 수정"
            className="absolute top-4 right-4 z-10"
          />
          <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 lg:px-8 lg:py-20">
            <p className="text-xs font-medium tracking-[0.2em] text-[#545745]">
              A MOMENT TO REFLECT · {MINDSET_KIND_LABEL[latestMindset.kind]}
            </p>
            <h2 className="font-serif-kr mt-4 text-2xl leading-relaxed font-medium text-[#353832] text-balance sm:text-3xl">
              “{latestMindset.title}”
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#656860]">
              {latestMindset.summary} 개인적인 생각은 사이트에 저장하지 않습니다.
              질문을 복사해 나만의 노트나 일기에 천천히 적어 보세요.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleCopyMindset}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#26364C] px-5 py-2.5 text-sm font-medium text-[#F5F1E9] transition-colors hover:bg-[#1e2b3d]"
              >
                {copiedQuestion ? (
                  <>
                    <Check className="h-4 w-4" aria-hidden="true" />
                    <span>질문이 복사되었습니다</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" aria-hidden="true" />
                    <span>질문 복사하기</span>
                  </>
                )}
              </button>
              <Link
                to="/journal/mindset"
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-[#353832]/20 px-5 py-2.5 text-sm font-medium text-[#353832] transition-colors hover:border-[#26364C] hover:text-[#26364C]"
              >
                MINDSET 전체 보기
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 6. Experience */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col justify-between gap-4 border-b border-[#353832]/12 pb-6 sm:flex-row sm:items-end">
          <div className="space-y-1.5">
            <p className="text-xs font-medium tracking-[0.16em] text-[#545745]">
              EXPERIENCE
            </p>
            <h2 className="font-serif-kr text-2xl font-medium text-[#353832] sm:text-3xl">
              온·오프라인 프로그램
            </h2>
          </div>
          <Link
            to="/experience"
            className="inline-flex min-h-[40px] items-center gap-1.5 text-sm font-medium text-[#26364C] hover:underline"
          >
            <span>프로그램 모두 보기</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {upcomingExperiences.map((program) => (
            <article
              key={program.id}
              className="relative flex flex-col overflow-hidden rounded-xl border border-[#353832]/10 bg-[#FFFFFF]"
            >
              <EditTriggerButton
                target={{ type: 'experience', id: program.id }}
                className="absolute top-3 right-3 z-10"
              />
              <Link to={`/experience/${program.slug}`} className="block">
                <EditorialImage
                  src={program.image}
                  alt={program.imageAlt}
                  aspectClass="aspect-[16/10]"
                />
              </Link>
              <div className="flex flex-1 flex-col justify-between p-6">
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#656860]">
                    <span>{PROGRAM_MODE_LABEL[program.mode]}</span>
                    <span aria-hidden="true">·</span>
                    <span>{PROGRAM_STATUS_LABEL[program.status]}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{program.scheduleKst}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-[#353832]">
                    <Link
                      to={`/experience/${program.slug}`}
                      className="hover:text-[#26364C]"
                    >
                      {program.title}
                    </Link>
                  </h3>
                  <p className="text-sm leading-relaxed text-[#656860]">
                    {program.summary}
                  </p>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-[#353832]/10 pt-4">
                  <span className="text-xs text-[#656860]">{program.locationText}</span>
                  <Link
                    to={`/experience/${program.slug}`}
                    className="shrink-0 text-xs font-medium text-[#26364C] hover:underline"
                  >
                    상세 안내 →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 7. About Leaf. Summary */}
      <section className="relative border-t border-[#353832]/10 bg-[#26364C] text-[#F5F1E9]">
        <EditTriggerButton
          target={{ type: 'about' }}
          label="브랜드 문구 수정"
          className="absolute top-4 right-4 z-10"
        />
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="space-y-4 lg:col-span-5">
              <p className="text-xs font-medium tracking-[0.2em] text-[#E4DACB]">
                ABOUT LEAF.
              </p>
              <h2 className="font-serif-kr text-2xl leading-snug font-medium text-balance sm:text-3xl">
                {about.homeClosingHeadline}
              </h2>
              <Link
                to="/about"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[#F5F1E9]/30 px-5 py-2.5 text-sm font-medium text-[#F5F1E9] transition-colors hover:bg-[#F5F1E9] hover:text-[#26364C]"
              >
                <span>브랜드 철학 자세히 보기</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7">
              {about.values.map((val) => (
                <div
                  key={val.code}
                  className="rounded-xl border border-[#F5F1E9]/15 bg-[#FFFFFF]/5 p-5"
                >
                  <p className="text-xs font-semibold tracking-widest text-[#E4DACB]">
                    {val.code}
                  </p>
                  <h3 className="mt-2 text-base font-medium text-[#F5F1E9]">
                    {val.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#E4DACB]/85">
                    {val.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
