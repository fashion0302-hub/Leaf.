import { useState } from 'react';
import { ArrowLeft, ExternalLink, Heart } from 'lucide-react';
import { useLeaf } from '../context/LeafContext';
import { Link, useRouter } from '../lib/router';
import { EditorialImage } from '../components/EditorialImage';
import { EditTriggerButton } from '../components/EditTriggerButton';
import {
  PRODUCT_CATEGORY_LABEL,
  PRODUCTION_STATUS_LABEL,
  SELLING_STATUS_LABEL,
  formatKrw,
} from '../components/StatusLabels';

export function ProductDetailPage({ slug }: { slug: string }) {
  const { navigate } = useRouter();
  const {
    products,
    user,
    setReturnToAfterLogin,
    reorderInterests,
    toggleReorderInterest,
    setExternalNotice,
    circlePosts,
  } = useLeaf();

  const product = products.find((p) => p.slug === slug);

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedRoundId, setSelectedRoundId] = useState(
    product?.rounds[0]?.id ?? ''
  );
  const [selectedVariantId, setSelectedVariantId] = useState(
    product?.variants[0]?.id ?? ''
  );
  const [interestMessage, setInterestMessage] = useState<string | null>(null);

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-serif-kr text-2xl font-medium text-[#353832]">
          요청하신 제품 페이지를 찾을 수 없습니다.
        </h1>
        <p className="mt-3 text-sm text-[#656860]">
          주소가 변경되었거나 존재하지 않는 상품입니다.
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-flex min-h-[44px] items-center rounded-lg bg-[#26364C] px-5 py-2.5 text-sm font-medium text-[#F5F1E9]"
        >
          SHOP으로 돌아가기
        </Link>
      </div>
    );
  }

  const activeRound =
    product.rounds.find((r) => r.id === selectedRoundId) ?? product.rounds[0];
  const activeVariant =
    product.variants.find((v) => v.id === selectedVariantId) ?? product.variants[0];
  const activeImage = product.images[selectedImageIdx] ?? product.images[0];

  const isInterested = Boolean(
    user &&
      activeVariant &&
      reorderInterests.some(
        (item) =>
          item.memberId === user.id && item.variantId === activeVariant.id
      )
  );

  const relatedCircle = circlePosts.filter(
    (p) => p.status === 'APPROVED' && p.relatedProductSlug === product.slug
  );

  const handleSmartStoreClick = () => {
    setExternalNotice({
      title: `${product.name} (${activeRound.title})`,
      provider: '네이버 스마트스토어',
      description: `선택하신 '${product.name}' (${activeRound.title}, ${formatKrw(activeRound.price)})의 실제 주문과 결제는 외부 네이버 스마트스토어로 이동하여 진행됩니다. 현재 시연 버전에서는 외부 스토어 URL이 아직 연결되어 있지 않습니다.`,
      actionLabel: '안내 확인',
    });
  };

  const handleReorderInterest = () => {
    if (!activeVariant) return;
    if (!user) {
      setReturnToAfterLogin(`/shop/${product.slug}`);
      navigate('/login');
      return;
    }
    const result = toggleReorderInterest({
      productSlug: product.slug,
      productName: product.name,
      variantId: activeVariant.id,
      color: activeVariant.color,
      size: activeVariant.size,
    });
    setInterestMessage(
      result === 'ADDED'
        ? `'${activeVariant.color} / ${activeVariant.size}' 재주문 희망이 시연 목록에 기록되었습니다. (1인 1옵션 중복 제한 적용)`
        : `'${activeVariant.color} / ${activeVariant.size}' 재주문 희망을 취소했습니다.`
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mb-8 flex items-center justify-between gap-4">
        <Link
          to="/shop"
          className="inline-flex min-h-[40px] items-center gap-1.5 text-sm text-[#656860] hover:text-[#353832]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>SHOP 목록으로</span>
        </Link>
        <EditTriggerButton target={{ type: 'product', id: product.id }} />
      </div>

      <div className="grid gap-10 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-7">
          <div className="overflow-hidden rounded-xl border border-[#353832]/10 bg-[#FFFFFF]">
            <EditorialImage
              src={activeImage?.src || ''}
              alt={activeImage?.alt || product.name}
              aspectClass="aspect-[4/3]"
              priority
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-3 gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIdx(idx)}
                  aria-label={`제품 이미지 ${idx + 1} 보기`}
                  className={`overflow-hidden rounded-lg border transition-opacity ${
                    selectedImageIdx === idx
                      ? 'border-[#26364C] ring-1 ring-[#26364C]'
                      : 'border-[#353832]/15 opacity-75 hover:opacity-100'
                  }`}
                >
                  <EditorialImage
                    src={img.src}
                    alt={img.alt}
                    aspectClass="aspect-[4/3]"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6 lg:col-span-5">
          <div className="space-y-2 border-b border-[#353832]/12 pb-5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#656860]">
              <span>{PRODUCT_CATEGORY_LABEL[product.category]}</span>
              {product.pieceNumber && (
                <>
                  <span aria-hidden="true">·</span>
                  <Link
                    to={`/archive/${product.pieceNumber}`}
                    className="font-semibold text-[#26364C] hover:underline"
                  >
                    {product.pieceNumber}
                  </Link>
                </>
              )}
            </div>
            <h1 className="font-serif-kr text-2xl font-medium text-[#353832] sm:text-3xl">
              {product.name}
            </h1>
            <p className="text-xs tracking-wide text-[#656860]">
              {product.englishSubtitle}
            </p>
            <p className="pt-2 text-sm leading-relaxed text-[#656860]">
              {product.summary}
            </p>
          </div>

          {product.rounds.length > 1 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-[#656860]">선주문 회차 선택</p>
              <div className="flex flex-wrap gap-2">
                {product.rounds.map((round) => {
                  const selected = round.id === activeRound.id;
                  return (
                    <button
                      key={round.id}
                      type="button"
                      onClick={() => setSelectedRoundId(round.id)}
                      className={`min-h-[40px] rounded-md border px-3.5 py-2 text-xs font-medium transition-colors ${
                        selected
                          ? 'border-[#26364C] bg-[#26364C] text-[#F5F1E9]'
                          : 'border-[#353832]/20 bg-[#FFFFFF] text-[#353832] hover:border-[#26364C]'
                      }`}
                    >
                      {round.title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeRound && (
            <div className="space-y-3 rounded-xl border border-[#353832]/12 bg-[#FFFFFF] p-5">
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <p className="text-xs text-[#656860]">{activeRound.title} 판매가</p>
                  <div className="mt-0.5 flex items-baseline gap-2">
                    <span className="text-2xl font-semibold tabular-nums text-[#353832]">
                      {formatKrw(activeRound.price)}
                    </span>
                    {activeRound.originalPrice && (
                      <span className="text-xs tabular-nums text-[#656860] line-through">
                        {formatKrw(activeRound.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <dl className="space-y-2 border-t border-[#353832]/10 pt-3 text-xs">
                <div className="flex justify-between gap-4">
                  <dt className="text-[#656860]">판매 접수 상태</dt>
                  <dd className="font-semibold text-[#26364C]">
                    {SELLING_STATUS_LABEL[activeRound.sellingStatus]}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#656860]">제작 진행 단계</dt>
                  <dd className="font-medium text-[#353832]">
                    {PRODUCTION_STATUS_LABEL[activeRound.productionStatus]}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#656860]">선주문 기간</dt>
                  <dd className="tabular-nums text-[#353832]">
                    {activeRound.opensAt} ~ {activeRound.closesAt}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#656860]">예상 출고일</dt>
                  <dd className="tabular-nums text-[#353832]">
                    {activeRound.expectedShipWindow}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#656860]">배송비 안내</dt>
                  <dd className="text-[#353832]">{activeRound.shippingFee}</dd>
                </div>
              </dl>
            </div>
          )}

          <div className="space-y-2.5">
            <p className="text-xs font-medium text-[#656860]">
              등록된 옵션 ({product.variants.length}종)
            </p>
            <div className="grid grid-cols-2 gap-2">
              {product.variants.map((variant) => {
                const selected = variant.id === activeVariant?.id;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => {
                      setSelectedVariantId(variant.id);
                      setInterestMessage(null);
                    }}
                    className={`min-h-[44px] rounded-lg border px-3 py-2 text-left text-xs transition-colors ${
                      selected
                        ? 'border-[#26364C] bg-[#E4DACB]/55 font-semibold text-[#26364C]'
                        : 'border-[#353832]/15 bg-[#FFFFFF] text-[#353832] hover:border-[#353832]/40'
                    }`}
                  >
                    <span className="block">{variant.color}</span>
                    <span className="block text-[11px] text-[#656860]">
                      {variant.size}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {activeRound && activeRound.sellingStatus === 'OPEN' ? (
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleSmartStoreClick}
                className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-[#26364C] px-6 py-3 text-sm font-medium text-[#F5F1E9] transition-colors hover:bg-[#1e2b3d]"
              >
                <span>스마트스토어에서 주문하기 (시연 안내)</span>
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </button>
              <p className="text-xs leading-relaxed text-[#656860]">
                {activeRound.storeNote} 실제 결제·주문·배송 조회는 네이버 스마트스토어에서 이루어집니다.
              </p>
            </div>
          ) : activeRound ? (
            <div className="space-y-3 rounded-xl border border-[#353832]/12 bg-[#E4DACB]/40 p-4">
              <p className="text-xs font-medium text-[#353832]">
                {activeRound.sellingStatus === 'COMING_SOON'
                  ? '아직 선주문이 열리지 않았습니다.'
                  : '이 회차의 선주문 접수가 마감되어 구매 버튼이 표시되지 않습니다.'}
              </p>
              <p className="text-xs leading-relaxed text-[#656860]">
                {activeRound.storeNote}
              </p>

              {activeRound.sellingStatus === 'CLOSED' &&
                product.allowReorderInterest &&
                activeVariant && (
                  <div className="space-y-2.5 border-t border-[#353832]/10 pt-3">
                    <button
                      type="button"
                      onClick={handleReorderInterest}
                      className={`flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                        isInterested
                          ? 'border-[#26364C] bg-[#26364C] text-[#F5F1E9]'
                          : 'border-[#26364C] bg-[#FFFFFF] text-[#26364C] hover:bg-[#26364C] hover:text-[#F5F1E9]'
                      }`}
                    >
                      <Heart
                        className={`h-4 w-4 ${isInterested ? 'fill-current' : ''}`}
                        aria-hidden="true"
                      />
                      <span>
                        {user
                          ? isInterested
                            ? `다시 만나고 싶어요 표시 완료 (눌러서 취소)`
                            : `선택한 옵션(${activeVariant.color} / ${activeVariant.size}) 다시 만나고 싶어요`
                          : '로그인하고 다시 만나고 싶어요 표시하기'}
                      </span>
                    </button>
                    <p className="text-xs text-[#656860]">
                      희망 표시는 주문·예약이 아니며 재생산을 보장하지 않습니다.
                    </p>
                    {interestMessage && (
                      <p className="rounded-md bg-[#FFFFFF] p-2.5 text-xs text-[#26364C]">
                        {interestMessage}
                      </p>
                    )}
                  </div>
                )}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-16 grid gap-12 border-t border-[#353832]/12 pt-12 lg:grid-cols-12">
        <div className="space-y-10 lg:col-span-6">
          <section className="space-y-3">
            <h2 className="font-serif-kr text-xl font-medium text-[#353832]">
              옷에 대한 설명
            </h2>
            <p className="text-sm leading-relaxed text-[#656860]">
              {product.description}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-kr text-xl font-medium text-[#353832]">
              소재 · 원산지 · 착용 정보
            </h2>
            <dl className="divide-y divide-[#353832]/10 border-y border-[#353832]/10 text-sm">
              <div className="py-3">
                <dt className="text-xs text-[#656860]">혼용률</dt>
                <dd className="mt-1 text-[#353832]">{product.material}</dd>
              </div>
              <div className="py-3">
                <dt className="text-xs text-[#656860]">원산지 및 제작처</dt>
                <dd className="mt-1 text-[#353832]">{product.origin}</dd>
              </div>
              <div className="py-3">
                <dt className="text-xs text-[#656860]">핏 및 착용 참고</dt>
                <dd className="mt-1 text-[#353832]">{product.fitInfo}</dd>
              </div>
            </dl>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-kr text-xl font-medium text-[#353832]">
              오래 입기 위한 관리 안내
            </h2>
            <ul className="space-y-2 text-sm leading-relaxed text-[#656860]">
              {product.careGuide.map((item, idx) => (
                <li key={idx} className="flex gap-2.5">
                  <span className="tabular-nums text-xs font-semibold text-[#26364C]">
                    0{idx + 1}.
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl bg-[#E4DACB]/40 p-5 text-xs leading-relaxed text-[#656860]">
            <p className="font-semibold text-[#353832]">교환 · 환불 및 문의 안내</p>
            <p className="mt-1.5">{product.policyNote}</p>
          </section>
        </div>

        <div className="space-y-10 lg:col-span-6">
          <section className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-medium tracking-[0.16em] text-[#545745]">
                MAKING UPDATES
              </p>
              <h2 className="font-serif-kr text-xl font-medium text-[#353832]">
                확인된 제작 진행 소식
              </h2>
              <p className="text-xs text-[#656860]">
                일반 배송 추적이 아닌, 공방·원단 단계의 실제 확인 날짜 기준 기록입니다.
              </p>
            </div>

            {product.productionUpdates.length === 0 ? (
              <div className="rounded-xl border border-[#353832]/10 bg-[#FFFFFF] p-5 text-xs text-[#656860]">
                아직 등록된 제작 진행 공지가 없습니다.
              </div>
            ) : (
              <div className="space-y-4">
                {product.productionUpdates.map((upd) => (
                  <div
                    key={upd.id}
                    className="rounded-xl border border-[#353832]/10 bg-[#FFFFFF] p-5"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#656860]">
                      <span className="font-medium text-[#26364C]">
                        {upd.roundTitle}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{upd.stage}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{upd.confirmedAt}</span>
                    </div>
                    <h3 className="mt-2 text-base font-semibold text-[#353832]">
                      {upd.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#656860]">
                      {upd.body}
                    </p>
                    {upd.image && (
                      <div className="mt-4 overflow-hidden rounded-lg">
                        <EditorialImage
                          src={upd.image}
                          alt={upd.title}
                          aspectClass="aspect-[16/9]"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-4 border-t border-[#353832]/12 pt-8">
            <h2 className="font-serif-kr text-xl font-medium text-[#353832]">
              이어서 읽을 이야기
            </h2>
            <div className="space-y-3">
              {product.pieceNumber && (
                <Link
                  to={`/archive/${product.pieceNumber}`}
                  className="block rounded-lg border border-[#353832]/10 bg-[#FFFFFF] p-4 transition-colors hover:border-[#26364C]"
                >
                  <p className="text-xs text-[#656860]">ARCHIVE</p>
                  <p className="mt-0.5 text-sm font-semibold text-[#353832]">
                    {product.pieceNumber} 제작 배경과 기획 의도 보기 →
                  </p>
                </Link>
              )}
              {product.relatedJournalSlug && (
                <Link
                  to={`/journal/${product.relatedJournalSlug}`}
                  className="block rounded-lg border border-[#353832]/10 bg-[#FFFFFF] p-4 transition-colors hover:border-[#26364C]"
                >
                  <p className="text-xs text-[#656860]">JOURNAL</p>
                  <p className="mt-0.5 text-sm font-semibold text-[#353832]">
                    이 옷의 제작과 소재 이야기를 담은 저널 읽기 →
                  </p>
                </Link>
              )}
              {relatedCircle.map((post) => (
                <Link
                  key={post.id}
                  to={`/circle/${post.id}`}
                  className="block rounded-lg border border-[#353832]/10 bg-[#FFFFFF] p-4 transition-colors hover:border-[#26364C]"
                >
                  <p className="text-xs text-[#656860]">
                    CIRCLE · {post.authorNickname}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-[#353832]">
                    {post.title} →
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
