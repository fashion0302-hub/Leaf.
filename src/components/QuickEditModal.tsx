import { useEffect, useState } from 'react';
import { Check, Pencil, SlidersHorizontal, X } from 'lucide-react';
import { useLeaf } from '../context/LeafContext';
import { Link } from '../lib/router';
import { ImageField } from './ImageField';
import type {
  AboutContent,
  ArchiveEntry,
  CirclePost,
  ExperienceProgram,
  HeroContent,
  JournalPost,
  MindsetPost,
  Product,
} from '../types/leaf';

export function EditModeDock() {
  const { isEditMode, setIsEditMode, storageWarning, clearStorageWarning } =
    useLeaf();

  return (
    <>
      {storageWarning && (
        <div className="fixed bottom-16 left-4 right-4 z-50 mx-auto flex max-w-xl items-center justify-between gap-3 rounded-lg border border-[#26364C]/25 bg-[#FFFFFF] px-4 py-3 text-xs text-[#353832] shadow-lg">
          <span>{storageWarning}</span>
          <button
            type="button"
            onClick={clearStorageWarning}
            className="shrink-0 font-semibold text-[#26364C]"
          >
            닫기
          </button>
        </div>
      )}

      <div className="fixed right-4 bottom-4 z-40 flex items-center gap-2">
        {isEditMode && (
          <Link
            to="/admin"
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[#353832]/20 bg-[#FFFFFF] px-3.5 py-2 text-xs font-medium text-[#26364C] shadow-md transition-colors hover:bg-[#F5F1E9]"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
            <span>전체 스튜디오</span>
          </Link>
        )}
        <button
          type="button"
          onClick={() => setIsEditMode(!isEditMode)}
          className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-medium shadow-md transition-colors ${
            isEditMode
              ? 'bg-[#26364C] text-[#F5F1E9]'
              : 'border border-[#353832]/20 bg-[#FFFFFF]/95 text-[#353832] hover:border-[#26364C] hover:text-[#26364C]'
          }`}
        >
          {isEditMode ? (
            <>
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              <span>편집 모드 켜짐 (완료)</span>
            </>
          ) : (
            <>
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
              <span>사진 · 글 편집</span>
            </>
          )}
        </button>
      </div>
    </>
  );
}

export function QuickEditModal() {
  const {
    quickEditTarget,
    setQuickEditTarget,
    hero,
    about,
    products,
    archiveEntries,
    journalPosts,
    mindsetPosts,
    experiencePrograms,
    circlePosts,
    updateHero,
    updateAbout,
    updateProduct,
    updateArchiveEntry,
    updateJournalPost,
    updateMindsetPost,
    updateExperienceProgram,
    updateCirclePost,
  } = useLeaf();

  const [heroDraft, setHeroDraft] = useState<HeroContent>(hero);
  const [aboutDraft, setAboutDraft] = useState<AboutContent>(about);
  const [productDraft, setProductDraft] = useState<Product | null>(null);
  const [archiveDraft, setArchiveDraft] = useState<ArchiveEntry | null>(null);
  const [journalDraft, setJournalDraft] = useState<JournalPost | null>(null);
  const [mindsetDraft, setMindsetDraft] = useState<MindsetPost | null>(null);
  const [expDraft, setExpDraft] = useState<ExperienceProgram | null>(null);
  const [circleDraft, setCircleDraft] = useState<CirclePost | null>(null);

  useEffect(() => {
    if (!quickEditTarget) return;
    if (quickEditTarget.type === 'hero') {
      setHeroDraft(hero);
    } else if (quickEditTarget.type === 'about') {
      setAboutDraft(about);
    } else if (quickEditTarget.type === 'product') {
      const found = products.find((p) => p.id === quickEditTarget.id) ?? null;
      setProductDraft(found ? structuredClone(found) : null);
    } else if (quickEditTarget.type === 'archive') {
      const found =
        archiveEntries.find(
          (a) => a.pieceNumber === quickEditTarget.pieceNumber
        ) ?? null;
      setArchiveDraft(found ? structuredClone(found) : null);
    } else if (quickEditTarget.type === 'journal') {
      const found =
        journalPosts.find((j) => j.id === quickEditTarget.id) ?? null;
      setJournalDraft(found ? structuredClone(found) : null);
    } else if (quickEditTarget.type === 'mindset') {
      const found =
        mindsetPosts.find((m) => m.id === quickEditTarget.id) ?? null;
      setMindsetDraft(found ? structuredClone(found) : null);
    } else if (quickEditTarget.type === 'experience') {
      const found =
        experiencePrograms.find((e) => e.id === quickEditTarget.id) ?? null;
      setExpDraft(found ? structuredClone(found) : null);
    } else if (quickEditTarget.type === 'circle') {
      const found =
        circlePosts.find((c) => c.id === quickEditTarget.id) ?? null;
      setCircleDraft(found ? structuredClone(found) : null);
    }
  }, [
    quickEditTarget,
    hero,
    about,
    products,
    archiveEntries,
    journalPosts,
    mindsetPosts,
    experiencePrograms,
    circlePosts,
  ]);

  if (!quickEditTarget) return null;

  const handleSave = () => {
    if (quickEditTarget.type === 'hero') {
      updateHero(heroDraft);
    } else if (quickEditTarget.type === 'about') {
      updateAbout(aboutDraft);
    } else if (quickEditTarget.type === 'product' && productDraft) {
      updateProduct(productDraft.id, productDraft);
    } else if (quickEditTarget.type === 'archive' && archiveDraft) {
      updateArchiveEntry(archiveDraft.pieceNumber, archiveDraft);
    } else if (quickEditTarget.type === 'journal' && journalDraft) {
      updateJournalPost(journalDraft.id, journalDraft);
    } else if (quickEditTarget.type === 'mindset' && mindsetDraft) {
      updateMindsetPost(mindsetDraft.id, mindsetDraft);
    } else if (quickEditTarget.type === 'experience' && expDraft) {
      updateExperienceProgram(expDraft.id, expDraft);
    } else if (quickEditTarget.type === 'circle' && circleDraft) {
      updateCirclePost(circleDraft.id, circleDraft);
    }
    setQuickEditTarget(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="사진 및 글 빠른 편집"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#26364C]/45 p-4 backdrop-blur-[2px]"
      onClick={() => setQuickEditTarget(null)}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-[#353832]/15 bg-[#FFFFFF] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#353832]/12 px-6 py-4">
          <div>
            <p className="text-[11px] font-medium tracking-wider text-[#545745]">
              QUICK STUDIO
            </p>
            <h2 className="text-base font-semibold text-[#353832]">
              사진 · 글 바로 수정하기
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setQuickEditTarget(null)}
            aria-label="편집 창 닫기"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-[#656860] hover:bg-[#E4DACB]/50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          {quickEditTarget.type === 'hero' && (
            <>
              <ImageField
                label="메인 히어로 사진"
                src={heroDraft.desktopImage}
                alt={heroDraft.alt}
                onChange={(src, alt) =>
                  setHeroDraft({ ...heroDraft, desktopImage: src, alt })
                }
              />
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-[#353832]">
                    상단 영문 오버라인
                  </label>
                  <input
                    type="text"
                    value={heroDraft.overline}
                    onChange={(e) =>
                      setHeroDraft({ ...heroDraft, overline: e.target.value })
                    }
                    className="mt-1 min-h-[40px] w-full rounded-lg border border-[#353832]/20 px-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#353832]">
                    메인 헤드라인
                  </label>
                  <input
                    type="text"
                    value={heroDraft.headline}
                    onChange={(e) =>
                      setHeroDraft({ ...heroDraft, headline: e.target.value })
                    }
                    className="mt-1 min-h-[40px] w-full rounded-lg border border-[#353832]/20 px-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#353832]">
                    서브 카피
                  </label>
                  <textarea
                    rows={3}
                    value={heroDraft.subcopy}
                    onChange={(e) =>
                      setHeroDraft({ ...heroDraft, subcopy: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-[#353832]/20 p-3 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#353832]">
                      주요 CTA 문구
                    </label>
                    <input
                      type="text"
                      value={heroDraft.primaryCtaLabel}
                      onChange={(e) =>
                        setHeroDraft({
                          ...heroDraft,
                          primaryCtaLabel: e.target.value,
                        })
                      }
                      className="mt-1 min-h-[40px] w-full rounded-lg border border-[#353832]/20 px-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#353832]">
                      보조 CTA 문구
                    </label>
                    <input
                      type="text"
                      value={heroDraft.secondaryCtaLabel}
                      onChange={(e) =>
                        setHeroDraft({
                          ...heroDraft,
                          secondaryCtaLabel: e.target.value,
                        })
                      }
                      className="mt-1 min-h-[40px] w-full rounded-lg border border-[#353832]/20 px-3 text-sm"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {quickEditTarget.type === 'about' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#353832]">
                  홈 하단 브랜드 메시지
                </label>
                <input
                  type="text"
                  value={aboutDraft.homeClosingHeadline}
                  onChange={(e) =>
                    setAboutDraft({
                      ...aboutDraft,
                      homeClosingHeadline: e.target.value,
                    })
                  }
                  className="mt-1 min-h-[40px] w-full rounded-lg border border-[#353832]/20 px-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#353832]">
                  ABOUT 페이지 제목
                </label>
                <input
                  type="text"
                  value={aboutDraft.headline}
                  onChange={(e) =>
                    setAboutDraft({ ...aboutDraft, headline: e.target.value })
                  }
                  className="mt-1 min-h-[40px] w-full rounded-lg border border-[#353832]/20 px-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#353832]">
                  브랜드 소개글
                </label>
                <textarea
                  rows={4}
                  value={aboutDraft.intro}
                  onChange={(e) =>
                    setAboutDraft({ ...aboutDraft, intro: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-[#353832]/20 p-3 text-sm"
                />
              </div>
            </div>
          )}

          {quickEditTarget.type === 'product' && productDraft && (
            <div className="space-y-4">
              {productDraft.images.map((img, idx) => (
                <ImageField
                  key={idx}
                  label={`제품 사진 ${idx + 1}`}
                  src={img.src}
                  alt={img.alt}
                  aspectClass="aspect-[4/3]"
                  onChange={(src, alt) => {
                    const nextImgs = [...productDraft.images];
                    nextImgs[idx] = { src, alt };
                    setProductDraft({ ...productDraft, images: nextImgs });
                  }}
                />
              ))}
              <div>
                <label className="block text-xs font-medium text-[#353832]">
                  제품명
                </label>
                <input
                  type="text"
                  value={productDraft.name}
                  onChange={(e) =>
                    setProductDraft({ ...productDraft, name: e.target.value })
                  }
                  className="mt-1 min-h-[40px] w-full rounded-lg border border-[#353832]/20 px-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#353832]">
                  한 줄 요약
                </label>
                <textarea
                  rows={2}
                  value={productDraft.summary}
                  onChange={(e) =>
                    setProductDraft({
                      ...productDraft,
                      summary: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-[#353832]/20 p-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#353832]">
                  상세 설명
                </label>
                <textarea
                  rows={4}
                  value={productDraft.description}
                  onChange={(e) =>
                    setProductDraft({
                      ...productDraft,
                      description: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-[#353832]/20 p-3 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#353832]">
                    대표 회차 가격 (원)
                  </label>
                  <input
                    type="number"
                    value={productDraft.rounds[0]?.price ?? 0}
                    onChange={(e) => {
                      const nextRounds = [...productDraft.rounds];
                      if (nextRounds[0]) {
                        nextRounds[0] = {
                          ...nextRounds[0],
                          price: Number(e.target.value) || 0,
                        };
                        setProductDraft({ ...productDraft, rounds: nextRounds });
                      }
                    }}
                    className="mt-1 min-h-[40px] w-full rounded-lg border border-[#353832]/20 px-3 text-sm tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#353832]">
                    혼용률 / 소재
                  </label>
                  <input
                    type="text"
                    value={productDraft.material}
                    onChange={(e) =>
                      setProductDraft({
                        ...productDraft,
                        material: e.target.value,
                      })
                    }
                    className="mt-1 min-h-[40px] w-full rounded-lg border border-[#353832]/20 px-3 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {quickEditTarget.type === 'archive' && archiveDraft && (
            <div className="space-y-4">
              <ImageField
                label={`${archiveDraft.pieceNumber} 사진`}
                src={archiveDraft.image}
                alt={archiveDraft.imageAlt}
                aspectClass="aspect-[4/3]"
                onChange={(src, alt) =>
                  setArchiveDraft({ ...archiveDraft, image: src, imageAlt: alt })
                }
              />
              <div>
                <label className="block text-xs font-medium text-[#353832]">
                  제목
                </label>
                <input
                  type="text"
                  value={archiveDraft.title}
                  onChange={(e) =>
                    setArchiveDraft({ ...archiveDraft, title: e.target.value })
                  }
                  className="mt-1 min-h-[40px] w-full rounded-lg border border-[#353832]/20 px-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#353832]">
                  기획 의도
                </label>
                <input
                  type="text"
                  value={archiveDraft.intent}
                  onChange={(e) =>
                    setArchiveDraft({ ...archiveDraft, intent: e.target.value })
                  }
                  className="mt-1 min-h-[40px] w-full rounded-lg border border-[#353832]/20 px-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#353832]">
                  제작 기록 본문
                </label>
                <textarea
                  rows={4}
                  value={archiveDraft.story}
                  onChange={(e) =>
                    setArchiveDraft({ ...archiveDraft, story: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-[#353832]/20 p-3 text-sm"
                />
              </div>
            </div>
          )}

          {quickEditTarget.type === 'journal' && journalDraft && (
            <div className="space-y-4">
              <ImageField
                label="저널 커버 사진"
                src={journalDraft.coverImage}
                alt={journalDraft.coverAlt}
                aspectClass="aspect-[16/10]"
                onChange={(src, alt) =>
                  setJournalDraft({
                    ...journalDraft,
                    coverImage: src,
                    coverAlt: alt,
                  })
                }
              />
              <div>
                <label className="block text-xs font-medium text-[#353832]">
                  글 제목
                </label>
                <input
                  type="text"
                  value={journalDraft.title}
                  onChange={(e) =>
                    setJournalDraft({ ...journalDraft, title: e.target.value })
                  }
                  className="mt-1 min-h-[40px] w-full rounded-lg border border-[#353832]/20 px-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#353832]">
                  부제
                </label>
                <input
                  type="text"
                  value={journalDraft.subtitle}
                  onChange={(e) =>
                    setJournalDraft({
                      ...journalDraft,
                      subtitle: e.target.value,
                    })
                  }
                  className="mt-1 min-h-[40px] w-full rounded-lg border border-[#353832]/20 px-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#353832]">
                  요약 발췌문
                </label>
                <textarea
                  rows={2}
                  value={journalDraft.excerpt}
                  onChange={(e) =>
                    setJournalDraft({
                      ...journalDraft,
                      excerpt: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-[#353832]/20 p-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#353832]">
                  본문 (빈 줄로 문단 구분)
                </label>
                <textarea
                  rows={7}
                  value={journalDraft.paragraphs.join('\n\n')}
                  onChange={(e) =>
                    setJournalDraft({
                      ...journalDraft,
                      paragraphs: e.target.value
                        .split(/\n{2,}/)
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-[#353832]/20 p-3 text-sm leading-relaxed"
                />
              </div>
            </div>
          )}

          {quickEditTarget.type === 'mindset' && mindsetDraft && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#353832]">
                  질문 · 글 제목
                </label>
                <input
                  type="text"
                  value={mindsetDraft.title}
                  onChange={(e) =>
                    setMindsetDraft({ ...mindsetDraft, title: e.target.value })
                  }
                  className="mt-1 min-h-[40px] w-full rounded-lg border border-[#353832]/20 px-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#353832]">
                  요약 설명
                </label>
                <textarea
                  rows={2}
                  value={mindsetDraft.summary}
                  onChange={(e) =>
                    setMindsetDraft({
                      ...mindsetDraft,
                      summary: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-[#353832]/20 p-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#353832]">
                  에세이 본문 (빈 줄로 문단 구분)
                </label>
                <textarea
                  rows={5}
                  value={mindsetDraft.essay.join('\n\n')}
                  onChange={(e) =>
                    setMindsetDraft({
                      ...mindsetDraft,
                      essay: e.target.value
                        .split(/\n{2,}/)
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-[#353832]/20 p-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#353832]">
                  질문 목록 (줄바꿈으로 구분)
                </label>
                <textarea
                  rows={4}
                  value={mindsetDraft.questions.join('\n')}
                  onChange={(e) =>
                    setMindsetDraft({
                      ...mindsetDraft,
                      questions: e.target.value
                        .split('\n')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-[#353832]/20 p-3 text-sm"
                />
              </div>
            </div>
          )}

          {quickEditTarget.type === 'experience' && expDraft && (
            <div className="space-y-4">
              <ImageField
                label="프로그램 대표 사진"
                src={expDraft.image}
                alt={expDraft.imageAlt}
                aspectClass="aspect-[4/3]"
                onChange={(src, alt) =>
                  setExpDraft({ ...expDraft, image: src, imageAlt: alt })
                }
              />
              <div>
                <label className="block text-xs font-medium text-[#353832]">
                  프로그램 제목
                </label>
                <input
                  type="text"
                  value={expDraft.title}
                  onChange={(e) =>
                    setExpDraft({ ...expDraft, title: e.target.value })
                  }
                  className="mt-1 min-h-[40px] w-full rounded-lg border border-[#353832]/20 px-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#353832]">
                  요약
                </label>
                <textarea
                  rows={2}
                  value={expDraft.summary}
                  onChange={(e) =>
                    setExpDraft({ ...expDraft, summary: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-[#353832]/20 p-3 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#353832]">
                    일정 (KST)
                  </label>
                  <input
                    type="text"
                    value={expDraft.scheduleKst}
                    onChange={(e) =>
                      setExpDraft({ ...expDraft, scheduleKst: e.target.value })
                    }
                    className="mt-1 min-h-[40px] w-full rounded-lg border border-[#353832]/20 px-3 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#353832]">
                    장소 / 방식
                  </label>
                  <input
                    type="text"
                    value={expDraft.locationText}
                    onChange={(e) =>
                      setExpDraft({
                        ...expDraft,
                        locationText: e.target.value,
                      })
                    }
                    className="mt-1 min-h-[40px] w-full rounded-lg border border-[#353832]/20 px-3 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {quickEditTarget.type === 'circle' && circleDraft && (
            <div className="space-y-4">
              {circleDraft.image && (
                <ImageField
                  label="게시글 첨부 사진"
                  src={circleDraft.image}
                  alt={circleDraft.imageAlt || circleDraft.title}
                  aspectClass="aspect-[16/9]"
                  onChange={(src, alt) =>
                    setCircleDraft({
                      ...circleDraft,
                      image: src,
                      imageAlt: alt,
                    })
                  }
                />
              )}
              <div>
                <label className="block text-xs font-medium text-[#353832]">
                  제목
                </label>
                <input
                  type="text"
                  value={circleDraft.title}
                  onChange={(e) =>
                    setCircleDraft({ ...circleDraft, title: e.target.value })
                  }
                  className="mt-1 min-h-[40px] w-full rounded-lg border border-[#353832]/20 px-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#353832]">
                  본문
                </label>
                <textarea
                  rows={5}
                  value={circleDraft.body}
                  onChange={(e) =>
                    setCircleDraft({ ...circleDraft, body: e.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-[#353832]/20 p-3 text-sm"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[#353832]/12 bg-[#F5F1E9]/60 px-6 py-4">
          <Link
            to="/admin"
            onClick={() => setQuickEditTarget(null)}
            className="text-xs font-medium text-[#26364C] hover:underline"
          >
            전체 스튜디오에서 더 자세히 편집 →
          </Link>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setQuickEditTarget(null)}
              className="min-h-[40px] rounded-lg border border-[#353832]/20 bg-[#FFFFFF] px-4 py-2 text-xs font-medium text-[#353832]"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="min-h-[40px] rounded-lg bg-[#26364C] px-5 py-2 text-xs font-medium text-[#F5F1E9]"
            >
              변경 사항 적용
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
