import React, { useRef, useState } from 'react';
import {
  Check,
  Download,
  Plus,
  RotateCcw,
  Trash2,
  Upload,
} from 'lucide-react';
import { useLeaf } from '../context/LeafContext';
import { ImageField } from '../components/ImageField';
import { Link } from '../lib/router';
import type {
  CirclePostStatus,
  JournalKind,
  MindsetKind,
  Product,
  ProductCategory,
  ProductionStatus,
  ProgramMode,
  ProgramStatus,
  SellingStatus,
} from '../types/leaf';

type StudioTab =
  | 'home'
  | 'shop'
  | 'archive'
  | 'journal'
  | 'mindset'
  | 'experience'
  | 'circle';

const STUDIO_TABS: { id: StudioTab; label: string }[] = [
  { id: 'home', label: '홈 · 브랜드' },
  { id: 'shop', label: 'SHOP 제품 · 사진' },
  { id: 'archive', label: 'ARCHIVE (Piece.)' },
  { id: 'journal', label: 'JOURNAL' },
  { id: 'mindset', label: 'MINDSET' },
  { id: 'experience', label: 'EXPERIENCE' },
  { id: 'circle', label: 'CIRCLE 관리' },
];

export function AdminStudioPage() {
  const {
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
    addProduct,
    updateArchiveEntry,
    updateJournalPost,
    addJournalPost,
    updateMindsetPost,
    addMindsetPost,
    updateExperienceProgram,
    updateCirclePost,
    deleteDemoCirclePost,
    resetAllContent,
    exportContentJson,
    importContentJson,
  } = useLeaf();

  const [tab, setTab] = useState<StudioTab>('home');
  const [selectedProductId, setSelectedProductId] = useState(
    products[0]?.id ?? ''
  );
  const [selectedArchivePiece, setSelectedArchivePiece] = useState(
    archiveEntries[0]?.pieceNumber ?? ''
  );
  const [selectedJournalId, setSelectedJournalId] = useState(
    journalPosts[0]?.id ?? ''
  );
  const [selectedMindsetId, setSelectedMindsetId] = useState(
    mindsetPosts[0]?.id ?? ''
  );
  const [selectedExpId, setSelectedExpId] = useState(
    experiencePrograms[0]?.id ?? ''
  );
  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const jsonInputRef = useRef<HTMLInputElement>(null);

  const flashNotice = (msg: string) => {
    setStatusNotice(msg);
    setTimeout(() => setStatusNotice(null), 3000);
  };

  const currentProduct =
    products.find((p) => p.id === selectedProductId) ?? products[0];
  const currentArchive =
    archiveEntries.find((a) => a.pieceNumber === selectedArchivePiece) ??
    archiveEntries[0];
  const currentJournal =
    journalPosts.find((j) => j.id === selectedJournalId) ?? journalPosts[0];
  const currentMindset =
    mindsetPosts.find((m) => m.id === selectedMindsetId) ?? mindsetPosts[0];
  const currentExp =
    experiencePrograms.find((e) => e.id === selectedExpId) ??
    experiencePrograms[0];

  const handleExportJson = () => {
    const dataStr = exportContentJson();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leaf-content-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    flashNotice('현재 사진 및 글 데이터를 JSON 파일로 내보냈습니다.');
  };

  const handleImportJson = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const res = importContentJson(text);
    if (res.ok) {
      flashNotice('백업 JSON 파일에서 사진과 글을 불러왔습니다.');
    } else {
      flashNotice(res.error || '파일을 불러오지 못했습니다.');
    }
    if (jsonInputRef.current) jsonInputRef.current.value = '';
  };

  const handleAddNewProduct = () => {
    const id = `prod-custom-${Date.now()}`;
    const newProd: Product = {
      id,
      slug: `new-piece-${Date.now().toString().slice(-4)}`,
      name: '새 선주문 제품',
      englishSubtitle: 'New Leaf Piece',
      category: 'KNIT',
      summary: '제품 한 줄 소개를 입력해 주세요.',
      description: '제품에 대한 상세 설명과 소재 이야기를 입력해 주세요.',
      material: '천연 소재 혼용률 입력',
      origin: '대한민국 서울',
      fitInfo: '여유 있는 핏',
      careGuide: ['미온수 단독 손세탁 또는 드라이클리닝 권장'],
      policyNote: '선주문 안내 및 교환/환불 기준을 입력해 주세요.',
      images: [
        {
          src: products[0]?.images[0]?.src || '',
          alt: '새 제품 이미지',
        },
      ],
      variants: [
        { id: `v-${Date.now()}-1`, color: '네추럴', size: 'S', active: true },
        { id: `v-${Date.now()}-2`, color: '네추럴', size: 'M', active: true },
      ],
      rounds: [
        {
          id: `r-${Date.now()}`,
          title: '1차 선주문 회차',
          opensAt: '2026.11.20 11:00 KST',
          closesAt: '2026.11.30 23:59 KST',
          expectedShipWindow: '2026.12.20 출고 예정',
          price: 180000,
          shippingFee: '무료배송',
          sellingStatus: 'COMING_SOON',
          productionStatus: 'PLANNING',
          externalStoreUrl: null,
          storeNote: '시연용 신규 제품입니다.',
        },
      ],
      productionUpdates: [],
      allowReorderInterest: false,
    };
    addProduct(newProd);
    setSelectedProductId(id);
    flashNotice('새 제품이 추가되었습니다. 사진과 글을 자유롭게 수정해 보세요.');
  };

  const handleAddNewJournal = () => {
    const id = `jour-custom-${Date.now()}`;
    addJournalPost({
      id,
      slug: `story-${Date.now().toString().slice(-4)}`,
      kind: 'BRAND',
      title: '새 저널 글 제목을 입력하세요',
      subtitle: '부제 또는 한 줄 설명',
      publishedAt: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
      readTime: '3분 읽기',
      coverImage: journalPosts[0]?.coverImage || '',
      coverAlt: '새 저널 커버 사진',
      excerpt: '목록에 노출되는 짧은 요약 문장입니다.',
      paragraphs: ['첫 번째 문단 내용을 입력해 주세요.', '두 번째 문단 내용을 입력해 주세요.'],
    });
    setSelectedJournalId(id);
    flashNotice('새 저널 글이 추가되었습니다.');
  };

  const handleAddNewMindset = () => {
    const id = `mind-custom-${Date.now()}`;
    addMindsetPost({
      id,
      slug: `mindset-${Date.now().toString().slice(-4)}`,
      kind: 'QUESTION',
      title: '새로운 자기성찰 질문을 입력하세요',
      publishedAt: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
      summary: '질문에 대한 짧은 소개 글입니다.',
      essay: ['함께 읽어볼 짧은 에세이 문단입니다.'],
      questions: ['노트에 적어볼 첫 번째 질문입니다.'],
    });
    setSelectedMindsetId(id);
    flashNotice('새 마인드셋 질문이 추가되었습니다.');
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="flex flex-col justify-between gap-6 border-b border-[#353832]/12 pb-8 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-medium tracking-[0.2em] text-[#545745]">
            LEAF. CONTENT &amp; PHOTO STUDIO
          </p>
          <h1 className="font-serif-kr mt-2 text-3xl font-medium text-[#353832]">
            사진 · 글 전체 편집 스튜디오
          </h1>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-[#656860]">
            이곳에서 수정한 사진과 글은 즉시 웹사이트 전체 화면에 반영되며 현재 브라우저에 자동 저장됩니다. 정식 서버 DB 연결 전 백업이 필요하면 JSON으로 내보낼 수 있습니다.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportJson}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[#353832]/20 bg-[#FFFFFF] px-3.5 py-2 text-xs font-medium text-[#353832] hover:border-[#26364C]"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            <span>JSON 백업</span>
          </button>
          <button
            type="button"
            onClick={() => jsonInputRef.current?.click()}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[#353832]/20 bg-[#FFFFFF] px-3.5 py-2 text-xs font-medium text-[#353832] hover:border-[#26364C]"
          >
            <Upload className="h-3.5 w-3.5" aria-hidden="true" />
            <span>JSON 불러오기</span>
          </button>
          <input
            ref={jsonInputRef}
            type="file"
            accept="application/json"
            onChange={handleImportJson}
            className="hidden"
          />

          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[#353832]/20 bg-[#FFFFFF] px-3.5 py-2 text-xs font-medium text-[#656860] hover:text-[#353832]"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>초기 데이터 복원</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 rounded-lg border border-[#9A3412]/30 bg-[#FFFFFF] px-3 py-1.5 text-xs">
              <span className="text-[#9A3412]">정말 초기화할까요?</span>
              <button
                type="button"
                onClick={() => {
                  resetAllContent();
                  setConfirmReset(false);
                  flashNotice('초기 시연용 사진과 글로 되돌렸습니다.');
                }}
                className="font-semibold text-[#9A3412] underline"
              >
                확인
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="text-[#656860]"
              >
                취소
              </button>
            </div>
          )}
        </div>
      </div>

      {statusNotice && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-[#26364C] px-4 py-3 text-xs font-medium text-[#F5F1E9]">
          <Check className="h-4 w-4" aria-hidden="true" />
          <span>{statusNotice}</span>
        </div>
      )}

      {/* Studio Navigation Tabs */}
      <div className="mt-6 flex flex-wrap gap-1.5 rounded-xl bg-[#E4DACB]/50 p-1.5">
        {STUDIO_TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`min-h-[40px] rounded-lg px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
                active
                  ? 'bg-[#FFFFFF] text-[#26364C] shadow-xs'
                  : 'text-[#656860] hover:text-[#353832]'
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* 1. HOME & ABOUT */}
      {tab === 'home' && (
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <section className="space-y-5 rounded-xl border border-[#353832]/10 bg-[#FFFFFF] p-6 lg:col-span-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#353832]">
                메인 히어로 사진 · 카피
              </h2>
              <Link
                to="/"
                className="text-xs font-medium text-[#26364C] hover:underline"
              >
                홈에서 확인 →
              </Link>
            </div>

            <ImageField
              label="히어로 메인 이미지"
              src={hero.desktopImage}
              alt={hero.alt}
              onChange={(src, alt) => updateHero({ ...hero, desktopImage: src, alt })}
            />

            <div>
              <label className="block text-xs font-medium text-[#353832]">
                상단 오버라인
              </label>
              <input
                type="text"
                value={hero.overline}
                onChange={(e) => updateHero({ ...hero, overline: e.target.value })}
                className="mt-1 min-h-[40px] w-full rounded-lg border border-[#353832]/20 px-3 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#353832]">
                메인 헤드라인
              </label>
              <input
                type="text"
                value={hero.headline}
                onChange={(e) => updateHero({ ...hero, headline: e.target.value })}
                className="mt-1 min-h-[40px] w-full rounded-lg border border-[#353832]/20 px-3 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#353832]">
                서브 카피
              </label>
              <textarea
                rows={3}
                value={hero.subcopy}
                onChange={(e) => updateHero({ ...hero, subcopy: e.target.value })}
                className="mt-1 w-full rounded-lg border border-[#353832]/20 p-3 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#353832]">
                  버튼 1 문구
                </label>
                <input
                  type="text"
                  value={hero.primaryCtaLabel}
                  onChange={(e) =>
                    updateHero({ ...hero, primaryCtaLabel: e.target.value })
                  }
                  className="mt-1 min-h-[40px] w-full rounded-lg border border-[#353832]/20 px-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#353832]">
                  버튼 2 문구
                </label>
                <input
                  type="text"
                  value={hero.secondaryCtaLabel}
                  onChange={(e) =>
                    updateHero({ ...hero, secondaryCtaLabel: e.target.value })
                  }
                  className="mt-1 min-h-[40px] w-full rounded-lg border border-[#353832]/20 px-3 text-sm"
                />
              </div>
            </div>
          </section>

          <section className="space-y-5 rounded-xl border border-[#353832]/10 bg-[#FFFFFF] p-6 lg:col-span-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#353832]">
                브랜드 소개 · 4가지 가치 (ABOUT)
              </h2>
              <Link
                to="/about"
                className="text-xs font-medium text-[#26364C] hover:underline"
              >
                ABOUT 확인 →
              </Link>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#353832]">
                홈 하단 브랜드 메시지
              </label>
              <input
                type="text"
                value={about.homeClosingHeadline}
                onChange={(e) =>
                  updateAbout({ ...about, homeClosingHeadline: e.target.value })
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
                value={about.headline}
                onChange={(e) =>
                  updateAbout({ ...about, headline: e.target.value })
                }
                className="mt-1 min-h-[40px] w-full rounded-lg border border-[#353832]/20 px-3 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#353832]">
                브랜드 소개글
              </label>
              <textarea
                rows={3}
                value={about.intro}
                onChange={(e) =>
                  updateAbout({ ...about, intro: e.target.value })
                }
                className="mt-1 w-full rounded-lg border border-[#353832]/20 p-3 text-sm"
              />
            </div>

            <div className="space-y-3 border-t border-[#353832]/10 pt-4">
              <p className="text-xs font-semibold text-[#545745]">
                핵심 가치 4개 문구
              </p>
              {about.values.map((val, idx) => (
                <div
                  key={val.code}
                  className="space-y-2 rounded-lg bg-[#F5F1E9]/60 p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-[#26364C]">
                      {val.code}
                    </span>
                    <input
                      type="text"
                      value={val.title}
                      onChange={(e) => {
                        const next = [...about.values];
                        next[idx] = { ...val, title: e.target.value };
                        updateAbout({ ...about, values: next });
                      }}
                      className="min-h-[34px] flex-1 rounded border border-[#353832]/20 bg-[#FFFFFF] px-2.5 text-xs font-medium"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={val.body}
                    onChange={(e) => {
                      const next = [...about.values];
                      next[idx] = { ...val, body: e.target.value };
                      updateAbout({ ...about, values: next });
                    }}
                    className="w-full rounded border border-[#353832]/20 bg-[#FFFFFF] p-2 text-xs"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* 2. SHOP PRODUCTS */}
      {tab === 'shop' && currentProduct && (
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <aside className="space-y-2 lg:col-span-4">
            <div className="flex items-center justify-between pb-2">
              <h2 className="text-sm font-semibold text-[#353832]">
                제품 목록 ({products.length})
              </h2>
              <button
                type="button"
                onClick={handleAddNewProduct}
                className="inline-flex min-h-[34px] items-center gap-1 rounded-md bg-[#26364C] px-3 py-1 text-xs font-medium text-[#F5F1E9]"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                <span>새 제품</span>
              </button>
            </div>
            {products.map((p) => {
              const selected = p.id === currentProduct.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedProductId(p.id)}
                  className={`w-full rounded-xl border p-4 text-left transition-colors ${
                    selected
                      ? 'border-[#26364C] bg-[#FFFFFF] shadow-xs'
                      : 'border-[#353832]/10 bg-[#FFFFFF]/60 hover:bg-[#FFFFFF]'
                  }`}
                >
                  <p className="text-[11px] text-[#656860]">
                    {p.category}
                    {p.pieceNumber ? ` · ${p.pieceNumber}` : ''}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-[#353832]">
                    {p.name}
                  </p>
                </button>
              );
            })}
          </aside>

          <section className="space-y-6 rounded-xl border border-[#353832]/10 bg-[#FFFFFF] p-6 lg:col-span-8">
            <div className="flex items-center justify-between border-b border-[#353832]/10 pb-4">
              <h2 className="text-base font-semibold text-[#353832]">
                {currentProduct.name} 편집
              </h2>
              <Link
                to={`/shop/${currentProduct.slug}`}
                className="text-xs font-medium text-[#26364C] hover:underline"
              >
                제품 페이지 보기 →
              </Link>
            </div>

            {/* Product Images */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-[#353832]">
                  제품 사진 ({currentProduct.images.length}장)
                </p>
                <button
                  type="button"
                  onClick={() =>
                    updateProduct(currentProduct.id, {
                      ...currentProduct,
                      images: [
                        ...currentProduct.images,
                        {
                          src: currentProduct.images[0]?.src || '',
                          alt: `${currentProduct.name} 추가 사진`,
                        },
                      ],
                    })
                  }
                  className="inline-flex min-h-[34px] items-center gap-1 rounded-md border border-[#353832]/20 px-3 py-1 text-xs font-medium text-[#353832]"
                >
                  <Plus className="h-3 w-3" aria-hidden="true" />
                  <span>사진 슬롯 추가</span>
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {currentProduct.images.map((img, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <ImageField
                      label={`사진 ${idx + 1}`}
                      src={img.src}
                      alt={img.alt}
                      aspectClass="aspect-[4/3]"
                      onChange={(src, alt) => {
                        const nextImgs = [...currentProduct.images];
                        nextImgs[idx] = { src, alt };
                        updateProduct(currentProduct.id, {
                          ...currentProduct,
                          images: nextImgs,
                        });
                      }}
                    />
                    {currentProduct.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const nextImgs = currentProduct.images.filter(
                            (_, i) => i !== idx
                          );
                          updateProduct(currentProduct.id, {
                            ...currentProduct,
                            images: nextImgs,
                          });
                        }}
                        className="inline-flex items-center gap-1 text-[11px] text-[#656860] hover:text-[#9A3412]"
                      >
                        <Trash2 className="h-3 w-3" aria-hidden="true" />
                        <span>이 사진 삭제</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Basic Fields */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-[#353832]">
                  제품명
                </label>
                <input
                  type="text"
                  value={currentProduct.name}
                  onChange={(e) =>
                    updateProduct(currentProduct.id, {
                      ...currentProduct,
                      name: e.target.value,
                    })
                  }
                  className="mt-1 min-h-[40px] w-full rounded-lg border border-[#353832]/20 px-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#353832]">
                  영문 부제
                </label>
                <input
                  type="text"
                  value={currentProduct.englishSubtitle}
                  onChange={(e) =>
                    updateProduct(currentProduct.id, {
                      ...currentProduct,
                      englishSubtitle: e.target.value,
                    })
                  }
                  className="mt-1 min-h-[40px] w-full rounded-lg border border-[#353832]/20 px-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#353832]">
                  카테고리
                </label>
                <select
                  value={currentProduct.category}
                  onChange={(e) =>
                    updateProduct(currentProduct.id, {
                      ...currentProduct,
                      category: e.target.value as ProductCategory,
                    })
                  }
                  className="mt-1 min-h-[40px] w-full rounded-lg border border-[#353832]/20 bg-[#FFFFFF] px-3 text-sm"
                >
                  <option value="ROBE">ROBE</option>
                  <option value="TEE">TEE</option>
                  <option value="KNIT">KNIT</option>
                  <option value="BOTTOMS">BOTTOMS</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#353832]">
                  Piece 번호 (선택, 비우면 미부여)
                </label>
                <input
                  type="text"
                  value={currentProduct.pieceNumber || ''}
                  placeholder="예: Piece.004"
                  onChange={(e) =>
                    updateProduct(currentProduct.id, {
                      ...currentProduct,
                      pieceNumber: e.target.value.trim() || undefined,
                    })
                  }
                  className="mt-1 min-h-[40px] w-full rounded-lg border border-[#353832]/20 px-3 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#353832]">
                한 줄 요약
              </label>
              <textarea
                rows={2}
                value={currentProduct.summary}
                onChange={(e) =>
                  updateProduct(currentProduct.id, {
                    ...currentProduct,
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
                value={currentProduct.description}
                onChange={(e) =>
                  updateProduct(currentProduct.id, {
                    ...currentProduct,
                    description: e.target.value,
                  })
                }
                className="mt-1 w-full rounded-lg border border-[#353832]/20 p-3 text-sm"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-[#353832]">
                  혼용률 / 소재
                </label>
                <input
                  type="text"
                  value={currentProduct.material}
                  onChange={(e) =>
                    updateProduct(currentProduct.id, {
                      ...currentProduct,
                      material: e.target.value,
                    })
                  }
                  className="mt-1 min-h-[40px] w-full rounded-lg border border-[#353832]/20 px-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#353832]">
                  원산지 · 제작처
                </label>
                <input
                  type="text"
                  value={currentProduct.origin}
                  onChange={(e) =>
                    updateProduct(currentProduct.id, {
                      ...currentProduct,
                      origin: e.target.value,
                    })
                  }
                  className="mt-1 min-h-[40px] w-full rounded-lg border border-[#353832]/20 px-3 text-sm"
                />
              </div>
            </div>

            {/* Latest Round Editor */}
            {currentProduct.rounds[0] && (
              <div className="space-y-4 rounded-xl bg-[#F5F1E9]/65 p-4">
                <p className="text-xs font-semibold text-[#26364C]">
                  대표 선주문 회차 ({currentProduct.rounds[0].title}) 설정
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="block text-[11px] font-medium text-[#656860]">
                      판매가 (원)
                    </label>
                    <input
                      type="number"
                      value={currentProduct.rounds[0].price}
                      onChange={(e) => {
                        const nextRounds = [...currentProduct.rounds];
                        nextRounds[0] = {
                          ...nextRounds[0],
                          price: Number(e.target.value) || 0,
                        };
                        updateProduct(currentProduct.id, {
                          ...currentProduct,
                          rounds: nextRounds,
                        });
                      }}
                      className="mt-1 min-h-[38px] w-full rounded border border-[#353832]/20 bg-[#FFFFFF] px-2.5 text-sm tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#656860]">
                      판매 접수 상태
                    </label>
                    <select
                      value={currentProduct.rounds[0].sellingStatus}
                      onChange={(e) => {
                        const nextRounds = [...currentProduct.rounds];
                        nextRounds[0] = {
                          ...nextRounds[0],
                          sellingStatus: e.target.value as SellingStatus,
                        };
                        updateProduct(currentProduct.id, {
                          ...currentProduct,
                          rounds: nextRounds,
                        });
                      }}
                      className="mt-1 min-h-[38px] w-full rounded border border-[#353832]/20 bg-[#FFFFFF] px-2.5 text-xs"
                    >
                      <option value="OPEN">OPEN (선주문 진행 중)</option>
                      <option value="COMING_SOON">COMING_SOON (오픈 예정)</option>
                      <option value="CLOSED">CLOSED (마감)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#656860]">
                      제작 진행 단계
                    </label>
                    <select
                      value={currentProduct.rounds[0].productionStatus}
                      onChange={(e) => {
                        const nextRounds = [...currentProduct.rounds];
                        nextRounds[0] = {
                          ...nextRounds[0],
                          productionStatus: e.target.value as ProductionStatus,
                        };
                        updateProduct(currentProduct.id, {
                          ...currentProduct,
                          rounds: nextRounds,
                        });
                      }}
                      className="mt-1 min-h-[38px] w-full rounded border border-[#353832]/20 bg-[#FFFFFF] px-2.5 text-xs"
                    >
                      <option value="PLANNING">제작 준비</option>
                      <option value="YARN_SOURCING">원사 확인 및 편직 준비</option>
                      <option value="KNITTING">공방 제작 진행 중</option>
                      <option value="FINISHING">마감 및 검수 중</option>
                      <option value="SHIPPING">순차 출고 진행</option>
                      <option value="COMPLETED">출고 완료</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      )}

      {/* 3. ARCHIVE */}
      {tab === 'archive' && currentArchive && (
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <aside className="space-y-2 lg:col-span-4">
            {archiveEntries.map((a) => (
              <button
                key={a.pieceNumber}
                type="button"
                onClick={() => setSelectedArchivePiece(a.pieceNumber)}
                className={`w-full rounded-xl border p-4 text-left ${
                  a.pieceNumber === currentArchive.pieceNumber
                    ? 'border-[#26364C] bg-[#FFFFFF]'
                    : 'border-[#353832]/10 bg-[#FFFFFF]/60'
                }`}
              >
                <p className="text-xs font-semibold text-[#26364C]">
                  {a.pieceNumber}
                </p>
                <p className="mt-0.5 text-sm font-medium text-[#353832]">
                  {a.title}
                </p>
              </button>
            ))}
          </aside>
          <section className="space-y-4 rounded-xl border border-[#353832]/10 bg-[#FFFFFF] p-6 lg:col-span-8">
            <ImageField
              label={`${currentArchive.pieceNumber} 사진`}
              src={currentArchive.image}
              alt={currentArchive.imageAlt}
              aspectClass="aspect-[4/3]"
              onChange={(src, alt) =>
                updateArchiveEntry(currentArchive.pieceNumber, {
                  ...currentArchive,
                  image: src,
                  imageAlt: alt,
                })
              }
            />
            <div>
              <label className="block text-xs font-medium text-[#353832]">
                제목
              </label>
              <input
                type="text"
                value={currentArchive.title}
                onChange={(e) =>
                  updateArchiveEntry(currentArchive.pieceNumber, {
                    ...currentArchive,
                    title: e.target.value,
                  })
                }
                className="mt-1 min-h-[40px] w-full rounded-lg border border-[#353832]/20 px-3 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#353832]">
                시즌 / 스터디 표기
              </label>
              <input
                type="text"
                value={currentArchive.season}
                onChange={(e) =>
                  updateArchiveEntry(currentArchive.pieceNumber, {
                    ...currentArchive,
                    season: e.target.value,
                  })
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
                value={currentArchive.intent}
                onChange={(e) =>
                  updateArchiveEntry(currentArchive.pieceNumber, {
                    ...currentArchive,
                    intent: e.target.value,
                  })
                }
                className="mt-1 min-h-[40px] w-full rounded-lg border border-[#353832]/20 px-3 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#353832]">
                제작 스토리 본문
              </label>
              <textarea
                rows={4}
                value={currentArchive.story}
                onChange={(e) =>
                  updateArchiveEntry(currentArchive.pieceNumber, {
                    ...currentArchive,
                    story: e.target.value,
                  })
                }
                className="mt-1 w-full rounded-lg border border-[#353832]/20 p-3 text-sm"
              />
            </div>
          </section>
        </div>
      )}

      {/* 4. JOURNAL */}
      {tab === 'journal' && currentJournal && (
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <aside className="space-y-2 lg:col-span-4">
            <div className="flex items-center justify-between pb-2">
              <h2 className="text-sm font-semibold text-[#353832]">
                저널 목록 ({journalPosts.length})
              </h2>
              <button
                type="button"
                onClick={handleAddNewJournal}
                className="inline-flex min-h-[34px] items-center gap-1 rounded-md bg-[#26364C] px-3 py-1 text-xs font-medium text-[#F5F1E9]"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                <span>새 글</span>
              </button>
            </div>
            {journalPosts.map((j) => (
              <button
                key={j.id}
                type="button"
                onClick={() => setSelectedJournalId(j.id)}
                className={`w-full rounded-xl border p-4 text-left ${
                  j.id === currentJournal.id
                    ? 'border-[#26364C] bg-[#FFFFFF]'
                    : 'border-[#353832]/10 bg-[#FFFFFF]/60'
                }`}
              >
                <p className="text-[11px] text-[#656860]">{j.publishedAt}</p>
                <p className="mt-0.5 line-clamp-2 text-sm font-medium text-[#353832]">
                  {j.title}
                </p>
              </button>
            ))}
          </aside>

          <section className="space-y-4 rounded-xl border border-[#353832]/10 bg-[#FFFFFF] p-6 lg:col-span-8">
            <ImageField
              label="저널 커버 사진"
              src={currentJournal.coverImage}
              alt={currentJournal.coverAlt}
              aspectClass="aspect-[16/10]"
              onChange={(src, alt) =>
                updateJournalPost(currentJournal.id, {
                  ...currentJournal,
                  coverImage: src,
                  coverAlt: alt,
                })
              }
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-[#353832]">
                  분류
                </label>
                <select
                  value={currentJournal.kind}
                  onChange={(e) =>
                    updateJournalPost(currentJournal.id, {
                      ...currentJournal,
                      kind: e.target.value as JournalKind,
                    })
                  }
                  className="mt-1 min-h-[40px] w-full rounded-lg border border-[#353832]/20 bg-[#FFFFFF] px-3 text-sm"
                >
                  <option value="MAKING">제작 기록</option>
                  <option value="BRAND">브랜드 이야기</option>
                  <option value="PEOPLE">사람과의 대화</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#353832]">
                  발행일
                </label>
                <input
                  type="text"
                  value={currentJournal.publishedAt}
                  onChange={(e) =>
                    updateJournalPost(currentJournal.id, {
                      ...currentJournal,
                      publishedAt: e.target.value,
                    })
                  }
                  className="mt-1 min-h-[40px] w-full rounded-lg border border-[#353832]/20 px-3 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#353832]">
                제목
              </label>
              <input
                type="text"
                value={currentJournal.title}
                onChange={(e) =>
                  updateJournalPost(currentJournal.id, {
                    ...currentJournal,
                    title: e.target.value,
                  })
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
                value={currentJournal.subtitle}
                onChange={(e) =>
                  updateJournalPost(currentJournal.id, {
                    ...currentJournal,
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
                value={currentJournal.excerpt}
                onChange={(e) =>
                  updateJournalPost(currentJournal.id, {
                    ...currentJournal,
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
                value={currentJournal.paragraphs.join('\n\n')}
                onChange={(e) =>
                  updateJournalPost(currentJournal.id, {
                    ...currentJournal,
                    paragraphs: e.target.value
                      .split(/\n{2,}/)
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                className="mt-1 w-full rounded-lg border border-[#353832]/20 p-3 text-sm leading-relaxed"
              />
            </div>
          </section>
        </div>
      )}

      {/* 5. MINDSET */}
      {tab === 'mindset' && currentMindset && (
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <aside className="space-y-2 lg:col-span-4">
            <div className="flex items-center justify-between pb-2">
              <h2 className="text-sm font-semibold text-[#353832]">
                마인드셋 목록 ({mindsetPosts.length})
              </h2>
              <button
                type="button"
                onClick={handleAddNewMindset}
                className="inline-flex min-h-[34px] items-center gap-1 rounded-md bg-[#26364C] px-3 py-1 text-xs font-medium text-[#F5F1E9]"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                <span>새 질문</span>
              </button>
            </div>
            {mindsetPosts.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMindsetId(m.id)}
                className={`w-full rounded-xl border p-4 text-left ${
                  m.id === currentMindset.id
                    ? 'border-[#26364C] bg-[#FFFFFF]'
                    : 'border-[#353832]/10 bg-[#FFFFFF]/60'
                }`}
              >
                <p className="text-[11px] text-[#656860]">{m.kind}</p>
                <p className="mt-0.5 line-clamp-2 text-sm font-medium text-[#353832]">
                  {m.title}
                </p>
              </button>
            ))}
          </aside>

          <section className="space-y-4 rounded-xl border border-[#353832]/10 bg-[#FFFFFF] p-6 lg:col-span-8">
            <div>
              <label className="block text-xs font-medium text-[#353832]">
                형식
              </label>
              <select
                value={currentMindset.kind}
                onChange={(e) =>
                  updateMindsetPost(currentMindset.id, {
                    ...currentMindset,
                    kind: e.target.value as MindsetKind,
                  })
                }
                className="mt-1 min-h-[40px] w-full rounded-lg border border-[#353832]/20 bg-[#FFFFFF] px-3 text-sm"
              >
                <option value="QUESTION">Question</option>
                <option value="NOTE">Note</option>
                <option value="SMALL_PRACTICE">Small Practice</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#353832]">
                질문 · 제목
              </label>
              <input
                type="text"
                value={currentMindset.title}
                onChange={(e) =>
                  updateMindsetPost(currentMindset.id, {
                    ...currentMindset,
                    title: e.target.value,
                  })
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
                value={currentMindset.summary}
                onChange={(e) =>
                  updateMindsetPost(currentMindset.id, {
                    ...currentMindset,
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
                value={currentMindset.essay.join('\n\n')}
                onChange={(e) =>
                  updateMindsetPost(currentMindset.id, {
                    ...currentMindset,
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
                복사 가능한 질문 목록 (줄바꿈으로 구분)
              </label>
              <textarea
                rows={4}
                value={currentMindset.questions.join('\n')}
                onChange={(e) =>
                  updateMindsetPost(currentMindset.id, {
                    ...currentMindset,
                    questions: e.target.value
                      .split('\n')
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                className="mt-1 w-full rounded-lg border border-[#353832]/20 p-3 text-sm"
              />
            </div>
          </section>
        </div>
      )}

      {/* 6. EXPERIENCE */}
      {tab === 'experience' && currentExp && (
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <aside className="space-y-2 lg:col-span-4">
            {experiencePrograms.map((exp) => (
              <button
                key={exp.id}
                type="button"
                onClick={() => setSelectedExpId(exp.id)}
                className={`w-full rounded-xl border p-4 text-left ${
                  exp.id === currentExp.id
                    ? 'border-[#26364C] bg-[#FFFFFF]'
                    : 'border-[#353832]/10 bg-[#FFFFFF]/60'
                }`}
              >
                <p className="text-[11px] text-[#656860]">
                  {exp.mode} · {exp.status}
                </p>
                <p className="mt-0.5 text-sm font-medium text-[#353832]">
                  {exp.title}
                </p>
              </button>
            ))}
          </aside>

          <section className="space-y-4 rounded-xl border border-[#353832]/10 bg-[#FFFFFF] p-6 lg:col-span-8">
            <ImageField
              label="프로그램 사진"
              src={currentExp.image}
              alt={currentExp.imageAlt}
              aspectClass="aspect-[4/3]"
              onChange={(src, alt) =>
                updateExperienceProgram(currentExp.id, {
                  ...currentExp,
                  image: src,
                  imageAlt: alt,
                })
              }
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-[#353832]">
                  진행 방식
                </label>
                <select
                  value={currentExp.mode}
                  onChange={(e) =>
                    updateExperienceProgram(currentExp.id, {
                      ...currentExp,
                      mode: e.target.value as ProgramMode,
                    })
                  }
                  className="mt-1 min-h-[40px] w-full rounded-lg border border-[#353832]/20 bg-[#FFFFFF] px-3 text-sm"
                >
                  <option value="OFFLINE">오프라인</option>
                  <option value="ONLINE">온라인</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#353832]">
                  모집 상태 (수동 관리)
                </label>
                <select
                  value={currentExp.status}
                  onChange={(e) =>
                    updateExperienceProgram(currentExp.id, {
                      ...currentExp,
                      status: e.target.value as ProgramStatus,
                    })
                  }
                  className="mt-1 min-h-[40px] w-full rounded-lg border border-[#353832]/20 bg-[#FFFFFF] px-3 text-sm"
                >
                  <option value="OPEN">OPEN (모집 중)</option>
                  <option value="UPCOMING">UPCOMING (모집 예정)</option>
                  <option value="FULL">FULL (정원 마감)</option>
                  <option value="CLOSED">CLOSED (종료)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#353832]">
                프로그램 제목
              </label>
              <input
                type="text"
                value={currentExp.title}
                onChange={(e) =>
                  updateExperienceProgram(currentExp.id, {
                    ...currentExp,
                    title: e.target.value,
                  })
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
                value={currentExp.summary}
                onChange={(e) =>
                  updateExperienceProgram(currentExp.id, {
                    ...currentExp,
                    summary: e.target.value,
                  })
                }
                className="mt-1 w-full rounded-lg border border-[#353832]/20 p-3 text-sm"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-[#353832]">
                  일정 (KST)
                </label>
                <input
                  type="text"
                  value={currentExp.scheduleKst}
                  onChange={(e) =>
                    updateExperienceProgram(currentExp.id, {
                      ...currentExp,
                      scheduleKst: e.target.value,
                    })
                  }
                  className="mt-1 min-h-[40px] w-full rounded-lg border border-[#353832]/20 px-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#353832]">
                  참가비
                </label>
                <input
                  type="text"
                  value={currentExp.priceText}
                  onChange={(e) =>
                    updateExperienceProgram(currentExp.id, {
                      ...currentExp,
                      priceText: e.target.value,
                    })
                  }
                  className="mt-1 min-h-[40px] w-full rounded-lg border border-[#353832]/20 px-3 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#353832]">
                장소 / 참여 방법
              </label>
              <input
                type="text"
                value={currentExp.locationText}
                onChange={(e) =>
                  updateExperienceProgram(currentExp.id, {
                    ...currentExp,
                    locationText: e.target.value,
                  })
                }
                className="mt-1 min-h-[40px] w-full rounded-lg border border-[#353832]/20 px-3 text-sm"
              />
            </div>
          </section>
        </div>
      )}

      {/* 7. CIRCLE MODERATION & EDIT */}
      {tab === 'circle' && (
        <div className="mt-8 space-y-4">
          {circlePosts.map((post) => (
            <div
              key={post.id}
              className="space-y-4 rounded-xl border border-[#353832]/10 bg-[#FFFFFF] p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-[#656860]">
                  <span className="font-semibold text-[#353832]">
                    {post.authorNickname}
                  </span>{' '}
                  · {post.createdAt}
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={post.status}
                    onChange={(e) =>
                      updateCirclePost(post.id, {
                        ...post,
                        status: e.target.value as CirclePostStatus,
                      })
                    }
                    className="min-h-[36px] rounded-md border border-[#353832]/20 bg-[#F5F1E9]/50 px-3 text-xs font-medium"
                  >
                    <option value="APPROVED">공개 승인 (APPROVED)</option>
                    <option value="PENDING">승인 대기 (PENDING)</option>
                    <option value="CHANGES_REQUESTED">수정 요청됨</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => deleteDemoCirclePost(post.id)}
                    className="inline-flex min-h-[36px] items-center gap-1 rounded-md border border-[#353832]/20 px-3 text-xs text-[#656860] hover:text-[#9A3412]"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>삭제</span>
                  </button>
                </div>
              </div>

              {post.image && (
                <ImageField
                  label="게시글 첨부 사진"
                  src={post.image}
                  alt={post.imageAlt || post.title}
                  aspectClass="aspect-[16/9]"
                  onChange={(src, alt) =>
                    updateCirclePost(post.id, {
                      ...post,
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
                  value={post.title}
                  onChange={(e) =>
                    updateCirclePost(post.id, {
                      ...post,
                      title: e.target.value,
                    })
                  }
                  className="mt-1 min-h-[38px] w-full rounded-lg border border-[#353832]/20 px-3 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#353832]">
                  본문
                </label>
                <textarea
                  rows={3}
                  value={post.body}
                  onChange={(e) =>
                    updateCirclePost(post.id, {
                      ...post,
                      body: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-[#353832]/20 p-3 text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
