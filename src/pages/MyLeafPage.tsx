import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';
import { useLeaf } from '../context/LeafContext';
import { Link, useRouter } from '../lib/router';
import {
  CIRCLE_CATEGORY_LABEL,
  CIRCLE_STATUS_LABEL,
} from '../components/StatusLabels';

export function LoginPage() {
  const {
    user,
    loginDemoUser,
    returnToAfterLogin,
    setReturnToAfterLogin,
  } = useLeaf();
  const { navigate } = useRouter();
  const [nickname, setNickname] = useState('다정한오전');

  const completeDemoLogin = (providerLabel: string) => {
    loginDemoUser(providerLabel, nickname);
    const dest = returnToAfterLogin || '/my';
    setReturnToAfterLogin(null);
    navigate(dest);
  };

  if (user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <BrandLogo variant="wordmark" className="mx-auto h-9" />
        <h1 className="font-serif-kr mt-6 text-2xl font-medium text-[#353832]">
          이미 시연 세션에 로그인되어 있습니다 ({user.nickname}).
        </h1>
        <Link
          to="/my"
          className="mt-6 inline-flex min-h-[44px] items-center rounded-lg bg-[#26364C] px-5 py-2.5 text-sm font-medium text-[#F5F1E9]"
        >
          MY LEAF.로 이동
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-14 sm:py-20">
      <div className="rounded-xl border border-[#353832]/12 bg-[#FFFFFF] p-6 sm:p-8">
        <div className="text-center">
          <BrandLogo variant="wordmark" className="mx-auto h-8" />
          <h1 className="font-serif-kr mt-5 text-2xl font-medium text-[#353832]">
            Leaf. 시연용 간편 로그인
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-[#656860]">
            둘러보기는 로그인 없이 가능하며, CIRCLE 참여 및 재주문 희망 표시를 체험할 때 시연 세션을 켤 수 있습니다.
          </p>
        </div>

        <div className="mt-6 rounded-lg bg-[#F5F1E9] p-3.5 text-xs leading-relaxed text-[#656860]">
          <p className="font-semibold text-[#26364C]">실제 OAuth 미연결 안내</p>
          <p className="mt-1">
            현재 화면은 카카오·네이버 OAuth 앱 심사 및 서버 DB 연동 전 시연용 로그인입니다. 입력한 닉네임은 현재 브라우저 세션에서만 유지됩니다.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="demo-nickname"
              className="block text-xs font-medium text-[#353832]"
            >
              시연용 닉네임 (최소 정보만 사용)
            </label>
            <input
              id="demo-nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={16}
              className="mt-1.5 min-h-[44px] w-full rounded-lg border border-[#353832]/20 bg-[#FFFFFF] px-3.5 text-sm text-[#353832] focus:border-[#26364C] focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={() => completeDemoLogin('시연용 카카오 간편 로그인 체험')}
            className="min-h-[46px] w-full rounded-lg bg-[#26364C] px-4 py-2.5 text-sm font-medium text-[#F5F1E9] transition-colors hover:bg-[#1e2b3d]"
          >
            시연 회원으로 시작하기 (카카오 연동 예정)
          </button>

          <button
            type="button"
            onClick={() => completeDemoLogin('시연용 네이버 간편 로그인 체험')}
            className="min-h-[46px] w-full rounded-lg border border-[#26364C]/30 bg-[#FFFFFF] px-4 py-2.5 text-sm font-medium text-[#26364C] transition-colors hover:bg-[#F5F1E9]"
          >
            시연 회원으로 시작하기 (네이버 연동 예정)
          </button>
        </div>

        {returnToAfterLogin && (
          <p className="mt-4 text-center text-xs text-[#656860]">
            로그인 완료 후 이전 페이지({returnToAfterLogin})로 자동 복귀합니다.
          </p>
        )}
      </div>
    </div>
  );
}

type MyTab = 'interests' | 'posts' | 'settings';

export function MyLeafPage({ initialTab = 'interests' }: { initialTab?: MyTab }) {
  const {
    user,
    logoutDemoUser,
    updateNickname,
    reorderInterests,
    removeReorderInterest,
    circlePosts,
    circleComments,
    deleteDemoCirclePost,
    setReturnToAfterLogin,
  } = useLeaf();
  const { navigate } = useRouter();
  const [activeTab, setActiveTab] = useState<MyTab>(initialTab);
  const [nicknameDraft, setNicknameDraft] = useState(user?.nickname || '');
  const [savedMsg, setSavedMsg] = useState(false);

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:py-24">
        <BrandLogo variant="symbol" className="mx-auto h-10 opacity-80" />
        <h1 className="font-serif-kr mt-5 text-2xl font-medium text-[#353832] sm:text-3xl">
          MY LEAF.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#656860]">
          재주문 희망 목록과 내가 작성한 CIRCLE 글·댓글 상태를 모아보는 개인 공간입니다. 시연용 간편 로그인 후 이용해 보세요.
        </p>
        <div className="mt-7 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setReturnToAfterLogin('/my');
              navigate('/login');
            }}
            className="min-h-[44px] rounded-lg bg-[#26364C] px-6 py-2.5 text-sm font-medium text-[#F5F1E9]"
          >
            시연용 간편 로그인
          </button>
        </div>
      </div>
    );
  }

  const myInterests = reorderInterests.filter((i) => i.memberId === user.id);
  const myPosts = circlePosts.filter((p) => p.authorId === user.id);
  const myComments = circleComments.filter(
    (c) => c.authorNickname === user.nickname
  );

  const handleNicknameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nicknameDraft.trim()) return;
    updateNickname(nicknameDraft);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="flex flex-col justify-between gap-6 border-b border-[#353832]/12 pb-8 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-medium tracking-[0.2em] text-[#545745]">
            MY LEAF.
          </p>
          <h1 className="font-serif-kr mt-2 text-3xl font-medium text-[#353832]">
            {user.nickname} 님의 공간
          </h1>
          <p className="mt-1.5 text-xs text-[#656860]">
            {user.providerLabel} · {user.joinedAt}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            logoutDemoUser();
            navigate('/');
          }}
          className="min-h-[40px] self-start rounded-lg border border-[#353832]/20 bg-[#FFFFFF] px-4 py-2 text-xs font-medium text-[#353832] hover:border-[#26364C]"
        >
          시연 로그아웃
        </button>
      </div>

      {/* Important PRD Notice: External Orders & Bookings NOT mixed here */}
      <div className="mt-6 rounded-xl border border-[#353832]/10 bg-[#E4DACB]/45 p-4 text-xs leading-relaxed text-[#656860]">
        <span className="font-semibold text-[#353832]">외부 주문 및 예약 조회 안내:</span>{' '}
        의류 선주문 결제·배송 내역은 <strong className="text-[#353832]">네이버 스마트스토어</strong>에서, 프로그램 예약 내역은 <strong className="text-[#353832]">네이버 예약</strong>에서 직접 확인하셔야 합니다. Leaf. MY LEAF.에서는 외부 결제·예약 기록을 임의로 추정하여 표시하지 않습니다.
      </div>

      {/* Tab Navigation */}
      <div className="mt-8 flex flex-wrap gap-2 border-b border-[#353832]/12 pb-4">
        {[
          {
            id: 'interests' as const,
            label: `재주문 희망 목록 (${myInterests.length})`,
          },
          {
            id: 'posts' as const,
            label: `내 글 · 댓글 (${myPosts.length + myComments.length})`,
          },
          { id: 'settings' as const, label: '계정 설정 (시연)' },
        ].map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`min-h-[40px] rounded-md px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
                active
                  ? 'bg-[#26364C] text-[#F5F1E9]'
                  : 'bg-[#FFFFFF] text-[#656860] hover:text-[#353832]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="mt-8">
        {activeTab === 'interests' && (
          <section className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-base font-semibold text-[#353832]">
                다시 만나고 싶어요 표시한 제품
              </h2>
              <p className="text-xs text-[#656860]">
                희망 표시는 주문·예약이 아니며 재생산을 보장하지 않습니다. 제품 상세 페이지에서 옵션별로 추가하거나 여기서 취소할 수 있습니다.
              </p>
            </div>

            {myInterests.length === 0 ? (
              <div className="rounded-xl border border-[#353832]/10 bg-[#FFFFFF] p-8 text-center">
                <p className="text-sm text-[#656860]">
                  아직 다시 만나고 싶어요 표시한 제품이 없습니다.
                </p>
                <Link
                  to="/shop/oatmeal-linen-wool-robe"
                  className="mt-4 inline-flex min-h-[40px] items-center rounded-lg border border-[#26364C] px-4 py-2 text-xs font-medium text-[#26364C]"
                >
                  마감 제품에서 재주문 희망 체험하기
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {myInterests.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between gap-4 rounded-xl border border-[#353832]/10 bg-[#FFFFFF] p-5 sm:flex-row sm:items-center"
                  >
                    <div>
                      <Link
                        to={`/shop/${item.productSlug}`}
                        className="text-base font-semibold text-[#353832] hover:text-[#26364C]"
                      >
                        {item.productName}
                      </Link>
                      <p className="mt-1 text-xs text-[#656860]">
                        선택 옵션: {item.color} / {item.size} · {item.createdAt}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeReorderInterest(item.id)}
                      className="inline-flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-lg border border-[#353832]/20 px-3.5 py-2 text-xs text-[#353832] hover:border-[#26364C]"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>희망 취소</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'posts' && (
          <section className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-[#353832]">
                  내가 작성한 CIRCLE 글 ({myPosts.length})
                </h2>
                <Link
                  to="/circle/write"
                  className="text-xs font-medium text-[#26364C] hover:underline"
                >
                  새 글 쓰기 →
                </Link>
              </div>

              {myPosts.length === 0 ? (
                <div className="rounded-xl border border-[#353832]/10 bg-[#FFFFFF] p-8 text-center">
                  <p className="text-sm text-[#656860]">
                    이번 시연 세션에서 작성한 CIRCLE 글이 없습니다.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {myPosts.map((post) => (
                    <div
                      key={post.id}
                      className="flex flex-col justify-between gap-4 rounded-xl border border-[#353832]/10 bg-[#FFFFFF] p-5 sm:flex-row sm:items-center"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#656860]">
                          <span>{CIRCLE_CATEGORY_LABEL[post.category]}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-semibold text-[#26364C]">
                            {CIRCLE_STATUS_LABEL[post.status]}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{post.createdAt}</span>
                        </div>
                        <Link
                          to={`/circle/${post.id}`}
                          className="block text-base font-semibold text-[#353832] hover:text-[#26364C]"
                        >
                          {post.title}
                        </Link>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteDemoCirclePost(post.id)}
                        className="inline-flex min-h-[38px] shrink-0 items-center gap-1 rounded-lg border border-[#353832]/20 px-3 py-1.5 text-xs text-[#656860] hover:text-[#353832]"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>삭제</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-base font-semibold text-[#353832]">
                내가 남긴 댓글 ({myComments.length})
              </h2>
              {myComments.length === 0 ? (
                <p className="text-sm text-[#656860]">
                  이번 시연 세션에서 남긴 댓글이 없습니다.
                </p>
              ) : (
                <div className="space-y-3">
                  {myComments.map((cmt) => (
                    <div
                      key={cmt.id}
                      className="rounded-xl border border-[#353832]/10 bg-[#FFFFFF] p-4"
                    >
                      <p className="text-xs text-[#656860]">{cmt.createdAt}</p>
                      <p className="mt-1 text-sm text-[#353832]">{cmt.body}</p>
                      <Link
                        to={`/circle/${cmt.postId}`}
                        className="mt-2 inline-block text-xs font-medium text-[#26364C] hover:underline"
                      >
                        원문 보기 →
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === 'settings' && (
          <section className="max-w-lg space-y-6 rounded-xl border border-[#353832]/10 bg-[#FFFFFF] p-6">
            <div>
              <h2 className="text-base font-semibold text-[#353832]">
                닉네임 관리 (시연)
              </h2>
              <p className="mt-1 text-xs text-[#656860]">
                Leaf.는 닉네임과 약관 동의 이력 등 최소 정보만 보관하며, 불필요한 주소·전화번호·생년월일을 수집하지 않습니다.
              </p>
            </div>

            <form onSubmit={handleNicknameSubmit} className="space-y-3">
              <label
                htmlFor="settings-nickname"
                className="block text-xs font-medium text-[#353832]"
              >
                공개 닉네임
              </label>
              <input
                id="settings-nickname"
                type="text"
                value={nicknameDraft}
                onChange={(e) => setNicknameDraft(e.target.value)}
                maxLength={16}
                className="min-h-[44px] w-full rounded-lg border border-[#353832]/20 bg-[#FFFFFF] px-3.5 text-sm text-[#353832]"
              />
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="min-h-[40px] rounded-lg bg-[#26364C] px-4 py-2 text-xs font-medium text-[#F5F1E9]"
                >
                  닉네임 변경 적용
                </button>
                {savedMsg && (
                  <span className="text-xs text-[#26364C]">
                    현재 세션에 반영되었습니다.
                  </span>
                )}
              </div>
            </form>

            <div className="border-t border-[#353832]/10 pt-5">
              <p className="text-xs font-semibold text-[#353832]">
                회원 탈퇴 및 데이터 삭제 정책
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[#656860]">
                실제 서비스 출시 시 회원 탈퇴 및 개인정보 삭제 요청 기능이 서버 API와 연결됩니다. 현재 시연 모드에서는 ‘시연 로그아웃’으로 세션을 종료할 수 있습니다.
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
