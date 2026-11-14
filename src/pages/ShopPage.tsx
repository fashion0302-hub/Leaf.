import { useState } from 'react';
import { useLeaf } from '../context/LeafContext';
import type { ProductCategory, SellingStatus } from '../types/leaf';
import { Link } from '../lib/router';
import { EditorialImage } from '../components/EditorialImage';
import { EditTriggerButton } from '../components/EditTriggerButton';
import {
  PRODUCT_CATEGORY_LABEL,
  PRODUCTION_STATUS_LABEL,
  SELLING_STATUS_LABEL,
  formatKrw,
} from '../components/StatusLabels';

const CATEGORY_TABS: { value: 'ALL' | ProductCategory; label: string }[] = [
  { value: 'ALL', label: 'ALL' },
  { value: 'ROBE', label: 'ROBE' },
  { value: 'TEE', label: 'TEE' },
  { value: 'KNIT', label: 'KNIT' },
  { value: 'BOTTOMS', label: 'BOTTOMS' },
];

const STATUS_FILTERS: { value: 'ALL' | SellingStatus; label: string }[] = [
  { value: 'ALL', label: '전체 상태' },
  { value: 'OPEN', label: '선주문 진행 중' },
  { value: 'COMING_SOON', label: '오픈 예정' },
  { value: 'CLOSED', label: '마감·제작 기록' },
];

export function ShopPage() {
  const { products } = useLeaf();
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | ProductCategory>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | SellingStatus>('ALL');

  const filtered = products.filter((product) => {
    const matchCategory =
      selectedCategory === 'ALL' || product.category === selectedCategory;
    const latestRound = product.rounds[0];
    const matchStatus =
      selectedStatus === 'ALL' ||
      (latestRound && latestRound.sellingStatus === selectedStatus);
    return matchCategory && matchStatus;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="border-b border-[#353832]/12 pb-8">
        <p className="text-xs font-medium tracking-[0.2em] text-[#545745]">SHOP</p>
        <h1 className="font-serif-kr mt-2 text-3xl font-medium text-[#353832] sm:text-4xl">
          충분히 알고 고르는 옷
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#656860]">
          Leaf.의 의류는 선주문 방식으로 필요한 만큼만 제작됩니다. 판매가 종료된 제품도 제작 과정과 관리 정보를 계속 확인할 수 있으며, 주문·결제는 연결된 네이버 스마트스토어에서 진행됩니다.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div
            role="tablist"
            aria-label="의류 카테고리 필터"
            className="flex flex-wrap items-center gap-1 rounded-lg bg-[#E4DACB]/50 p-1"
          >
            {CATEGORY_TABS.map((tab) => {
              const active = selectedCategory === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(tab.value)}
                  className={`min-h-[38px] rounded-md px-3.5 py-1.5 text-xs font-medium tracking-wide whitespace-nowrap transition-colors ${
                    active
                      ? 'bg-[#FFFFFF] text-[#26364C] shadow-xs'
                      : 'text-[#656860] hover:text-[#353832]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {STATUS_FILTERS.map((st) => {
              const active = selectedStatus === st.value;
              return (
                <button
                  key={st.value}
                  type="button"
                  onClick={() => setSelectedStatus(st.value)}
                  className={`min-h-[38px] rounded-md border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                    active
                      ? 'border-[#26364C] bg-[#26364C] text-[#F5F1E9]'
                      : 'border-[#353832]/15 bg-[#FFFFFF]/70 text-[#656860] hover:text-[#353832]'
                  }`}
                >
                  {st.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-12 rounded-xl border border-[#353832]/12 bg-[#FFFFFF] p-10 text-center">
          <p className="text-base font-medium text-[#353832]">
            선택한 조건에 맞는 제품이 현재 없습니다.
          </p>
          <p className="mt-2 text-sm text-[#656860]">
            카테고리나 판매 상태 필터를 초기화해 모든 제품을 살펴보세요.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('ALL');
              setSelectedStatus('ALL');
            }}
            className="mt-5 min-h-[44px] rounded-lg bg-[#26364C] px-5 py-2.5 text-sm font-medium text-[#F5F1E9]"
          >
            필터 초기화
          </button>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => {
            const latestRound = product.rounds[0];
            return (
              <article
                key={product.id}
                className="relative flex flex-col overflow-hidden rounded-xl border border-[#353832]/10 bg-[#FFFFFF] transition-transform duration-200 hover:-translate-y-0.5"
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

                <div className="flex flex-1 flex-col justify-between p-5">
                  <div className="space-y-2">
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
                    </div>

                    <h2 className="text-lg font-semibold text-[#353832]">
                      <Link
                        to={`/shop/${product.slug}`}
                        className="hover:text-[#26364C]"
                      >
                        {product.name}
                      </Link>
                    </h2>

                    {latestRound && (
                      <p className="text-xs font-medium text-[#545745]">
                        {SELLING_STATUS_LABEL[latestRound.sellingStatus]}
                      </p>
                    )}

                    <p className="line-clamp-2 text-sm leading-relaxed text-[#656860]">
                      {product.summary}
                    </p>
                  </div>

                  {latestRound && (
                    <div className="mt-5 flex items-center justify-between border-t border-[#353832]/10 pt-4">
                      <div>
                        <p className="text-sm font-semibold tabular-nums text-[#353832]">
                          {formatKrw(latestRound.price)}
                        </p>
                        <p className="text-xs text-[#656860]">
                          제작: {PRODUCTION_STATUS_LABEL[latestRound.productionStatus]}
                        </p>
                      </div>
                      <Link
                        to={`/shop/${product.slug}`}
                        className="text-xs font-medium text-[#26364C] hover:underline"
                      >
                        상세 보기 →
                      </Link>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
