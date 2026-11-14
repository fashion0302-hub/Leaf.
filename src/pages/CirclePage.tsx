import React, { useState } from 'react';
import { ArrowLeft, Flag, PenSquare, Trash2 } from 'lucide-react';
import type { CircleCategory } from '../types/leaf';
import { useLeaf } from '../context/LeafContext';
import { Link, useRouter } from '../lib/router';
import { EditorialImage } from '../components/EditorialImage';
import { EditTriggerButton } from '../components/EditTriggerButton';
import { CIRCLE_CATEGORY_LABEL } from '../components/StatusLabels';

const CATEGORY_TABS: { value: 'ALL' | CircleCategory; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'MY_WARDROBE', label: '내 옷장' },
  { value: 'CARE_REPAIR', label: '관리와 수선' },
  { value: 'REFLECTION', label: '일상과 성찰' },
  { value: 'LEAF_ASKS', label: 'Leaf.의 질문' },
];

export function CirclePage() {
  const { circlePosts, circleComments, user, setReturnToAfterLogin } = useLeaf();
  const { navigate } = useRouter();
  const [category, setCategory] = useState<'ALL' | CircleCategory>('ALL');

  // Public feed only shows APPROVED posts (never PENDING posts!)
  const approvedPosts = circlePosts.filter((p) => p.status === 'APPROVED');
  const filtered =
    category === 'ALL'
      ? approvedPosts
      : approvedPosts.filter((p) => p.category === category);

  const handleWriteClick = () => {
    if (!user) {
      setReturnToAfterLogin('/circle/write');
      navigate('/login');
      return;
    }
    navigate('/circle/write');
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="flex flex-col justify-between gap-6 border-b border-[#353832]/12 pb-8 md:flex-row md:items-end">
        <div className="space-y-2">
          <p className="text-xs font-medium tracking-[0.2em] text-[#545745]">
            CIRCLE
          </p>
          <h1 className="font-serif-kr text-3xl font-medium text-[#353832] sm:text-4xl">
            함께 입고 돌보며 나누는 이야기
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-[#656860]">
            Leaf. 제품을 구매하지 않았더라도 누구나 글을 읽을 수 있습니다. 오래 입은 옷, 수선 경험, 일상의 짧은 생각을 나누어 보세요.
          </p>
        </div>

        <button
          type="button"
          onClick={handleWriteClick}
          className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-lg bg-[#26364C] px-5 py-2.5 text-sm font-medium text-[#F5F1E9] transition-colors hover:bg-[#1e2b3d]"
        >
          <PenSquare className="h-4 w-4" aria-hidden="true" />
          <span>이야기 남기기 (시연)</span>
        </button>
      </div>

      {/* Category Filter */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1.5">
          {CATEGORY_TABS.map((tab) => {
            const active = category === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setCategory(tab.value)}
                className={`min-h-[38px] rounded-md border px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                  active
                    ? 'border-[#26364C] bg-[#26364C] text-[#F5F1E9]'
                    : 'border-[#353832]/15 bg-[#FFFFFF]/70 text-[#656860] hover:text-[#353832]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        <Link
          to="/community-guidelines"
          className="text-xs text-[#656860] underline hover:text-[#353832]"
        >
          커뮤니티 운영 규칙 보기
        </Link>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {filtered.map((post) => {
          const commentCount = circleComments.filter(
            (c) => c.postId === post.id
          ).length;
          return (
            <article
              key={post.id}
              className="relative flex flex-col overflow-hidden rounded-xl border border-[#353832]/10 bg-[#FFFFFF]"
            >
              <EditTriggerButton
                target={{ type: 'circle', id: post.id }}
                className="absolute top-3 right-3 z-10"
              />
              {post.image && (
                <Link to={`/circle/${post.id}`} className="block">
                  <EditorialImage
                    src={post.image}
                    alt={post.imageAlt || post.title}
                    aspectClass="aspect-[16/9]"
                  />
                </Link>
              )}
              <div className="flex flex-1 flex-col justify-between p-6">
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#656860]">
                    <span className="font-medium text-[#545745]">
                      {CIRCLE_CATEGORY_LABEL[post.category]}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {post.authorType === 'BRAND'
                        ? 'Leaf. 공식 질문'
                        : post.authorNickname}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{post.createdAt}</span>
                  </div>
                  <h2 className="text-lg font-semibold text-[#353832]">
                    <Link to={`/circle/${post.id}`} className="hover:text-[#26364C]">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="line-clamp-3 text-sm leading-relaxed text-[#656860]">
                    {post.body}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-[#353832]/10 pt-3 text-xs">
                  <span className="tabular-nums text-[#656860]">
                    댓글 {commentCount}개
                  </span>
                  <Link
                    to={`/circle/${post.id}`}
                    className="font-medium text-[#26364C] hover:underline"
                  >
                    전체 읽기 →
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export function CircleDetailPage({ id }: { id: string }) {
  const {
    products,
    circlePosts,
    circleComments,
    user,
    setReturnToAfterLogin,
    addDemoComment,
    deleteDemoComment,
    deleteDemoCirclePost,
    reportedIds,
    reportDemoTarget,
  } = useLeaf();
  const { navigate } = useRouter();
  const [commentText, setCommentText] = useState('');

  const post = circlePosts.find((p) => p.id === id);

  // Enforce PRD privacy: PENDING post is visible only to its author
  const canView =
    post && (post.status === 'APPROVED' || (user && post.authorId === user.id));

  if (!post || !canView) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-serif-kr text-2xl font-medium text-[#353832]">
          게시글을 열람할 수 없습니다.
        </h1>
        <p className="mt-2 text-sm text-[#656860]">
          삭제되었거나 승인 대기 중인 글입니다.
        </p>
        <Link
          to="/circle"
          className="mt-6 inline-flex min-h-[44px] items-center rounded-lg bg-[#26364C] px-5 py-2.5 text-sm font-medium text-[#F5F1E9]"
        >
          CIRCLE로 돌아가기
        </Link>
      </div>
    );
  }

  const comments = circleComments.filter((c) => c.postId === post.id);
  const relatedProduct = post.relatedProductSlug
    ? products.find((p) => p.slug === post.relatedProductSlug)
    : undefined;
  const isOwner = Boolean(user && user.id === post.authorId);
  const isPostReported = reportedIds.includes(post.id);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setReturnToAfterLogin(`/circle/${post.id}`);
      navigate('/login');
      return;
    }
    if (!commentText.trim()) return;
    addDemoComment(post.id, commentText);
    setCommentText('');
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/circle"
          className="inline-flex min-h-[40px] items-center gap-1.5 text-sm text-[#656860] hover:text-[#353832]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>CIRCLE 목록으로</span>
        </Link>
        <EditTriggerButton target={{ type: 'circle', id: post.id }} />
      </div>

      {post.status === 'PENDING' && (
        <div className="mt-6 rounded-xl border border-[#26364C]/25 bg-[#E4DACB]/60 p-4 text-xs leading-relaxed text-[#26364C]">
          <p className="font-semibold">관리자 승인 대기 중 (작성자 본인만 열람)</p>
          <p className="mt-1">
            시연 환경에서 작성하신 글은 공개 피드에는 노출되지 않으며, MY LEAF.와 이 화면에서만 확인할 수 있습니다.
          </p>
        </div>
      )}

      <article className="mt-6 rounded-xl border border-[#353832]/10 bg-[#FFFFFF] p-6 sm:p-8">
        <header className="space-y-3 border-b border-[#353832]/10 pb-5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#656860]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-[#545745]">
                {CIRCLE_CATEGORY_LABEL[post.category]}
              </span>
              <span aria-hidden="true">·</span>
              <span>{post.authorNickname}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{post.createdAt}</span>
            </div>

            <div className="flex items-center gap-2">
              {isOwner && (
                <button
                  type="button"
                  onClick={() => {
                    deleteDemoCirclePost(post.id);
                    navigate('/circle');
                  }}
                  className="inline-flex items-center gap-1 text-xs text-[#656860] hover:text-[#353832]"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>삭제</span>
                </button>
              )}
              {!isOwner && (
                <button
                  type="button"
                  onClick={() => reportDemoTarget(post.id)}
                  disabled={isPostReported}
                  className="inline-flex items-center gap-1 text-xs text-[#656860] hover:text-[#353832] disabled:opacity-60"
                >
                  <Flag className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{isPostReported ? '신고 접수됨(시연)' : '신고'}</span>
                </button>
              )}
            </div>
          </div>

          <h1 className="font-serif-kr text-2xl leading-snug font-medium text-[#353832] sm:text-3xl">
            {post.title}
          </h1>
        </header>

        {post.image && (
          <div className="mt-6 overflow-hidden rounded-lg">
            <EditorialImage
              src={post.image}
              alt={post.imageAlt || post.title}
              aspectClass="aspect-[16/10]"
            />
          </div>
        )}

        <div className="mt-6 whitespace-pre-line text-base leading-[1.85] text-[#353832]">
          {post.body}
        </div>

        {relatedProduct && (
          <div className="mt-8 rounded-lg bg-[#F5F1E9] p-4">
            <p className="text-xs text-[#656860]">언급된 Leaf. 제품</p>
            <div className="mt-1 flex items-center justify-between gap-4">
              <span className="text-sm font-semibold text-[#353832]">
                {relatedProduct.name}
              </span>
              <Link
                to={`/shop/${relatedProduct.slug}`}
                className="text-xs font-medium text-[#26364C] hover:underline"
              >
                제품 보기 →
              </Link>
            </div>
          </div>
        )}
      </article>

      {/* Comments Section */}
      <section className="mt-10 space-y-6">
        <h2 className="text-base font-semibold text-[#353832]">
          댓글 ({comments.length})
        </h2>

        <form onSubmit={handleCommentSubmit} className="space-y-3">
          {user ? (
            <>
              <label htmlFor="circle-comment" className="sr-only">
                댓글 내용
              </label>
              <textarea
                id="circle-comment"
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="서로의 취향과 경험을 존중하는 따뜻한 댓글을 남겨 주세요. (시연용 세션 저장)"
                className="w-full rounded-lg border border-[#353832]/20 bg-[#FFFFFF] p-3.5 text-sm text-[#353832] placeholder:text-[#656860]/70 focus:border-[#26364C] focus:outline-none"
              />
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-[#656860]">
                  현재 브라우저 세션에서만 유지되는 시연 댓글입니다.
                </p>
                <button
                  type="submit"
                  className="min-h-[40px] rounded-lg bg-[#26364C] px-4 py-2 text-xs font-medium text-[#F5F1E9]"
                >
                  댓글 남기기
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col justify-between gap-3 rounded-xl border border-[#353832]/12 bg-[#FFFFFF] p-5 sm:flex-row sm:items-center">
              <p className="text-sm text-[#656860]">
                댓글을 남기려면 시연용 간편 로그인이 필요합니다.
              </p>
              <button
                type="button"
                onClick={() => {
                  setReturnToAfterLogin(`/circle/${post.id}`);
                  navigate('/login');
                }}
                className="min-h-[40px] shrink-0 rounded-lg bg-[#26364C] px-4 py-2 text-xs font-medium text-[#F5F1E9]"
              >
                로그인하고 댓글 남기기
              </button>
            </div>
          )}
        </form>

        <div className="space-y-3">
          {comments.map((cmt) => {
            const cmtReported = reportedIds.includes(cmt.id);
            const isCmtOwner = Boolean(user && cmt.authorNickname === user.nickname);
            return (
              <div
                key={cmt.id}
                className="rounded-xl border border-[#353832]/10 bg-[#FFFFFF] p-4"
              >
                <div className="flex items-center justify-between gap-2 text-xs text-[#656860]">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#353832]">
                      {cmt.authorNickname}
                    </span>
                    {cmt.isBrandOfficial && (
                      <span className="font-medium text-[#26364C]">· 공식</span>
                    )}
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{cmt.createdAt}</span>
                  </div>
                  {isCmtOwner ? (
                    <button
                      type="button"
                      onClick={() => deleteDemoComment(cmt.id)}
                      className="text-xs text-[#656860] hover:text-[#353832]"
                    >
                      삭제
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => reportDemoTarget(cmt.id)}
                      disabled={cmtReported}
                      className="text-xs text-[#656860] hover:text-[#353832] disabled:opacity-60"
                    >
                      {cmtReported ? '신고됨(시연)' : '신고'}
                    </button>
                  )}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[#353832]">
                  {cmt.body}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export function CircleWritePage() {
  const { products, user, setReturnToAfterLogin, createDemoCirclePost } = useLeaf();
  const { navigate } = useRouter();
  const [category, setCategory] = useState<CircleCategory>('MY_WARDROBE');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [relatedProductSlug, setRelatedProductSlug] = useState('');

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="font-serif-kr text-2xl font-medium text-[#353832]">
          글을 작성하려면 시연용 간편 로그인이 필요합니다.
        </h1>
        <p className="mt-3 text-sm text-[#656860]">
          로그인 후 다시 이 글쓰기 화면으로 돌아옵니다.
        </p>
        <button
          type="button"
          onClick={() => {
            setReturnToAfterLogin('/circle/write');
            navigate('/login');
          }}
          className="mt-6 min-h-[44px] rounded-lg bg-[#26364C] px-5 py-2.5 text-sm font-medium text-[#F5F1E9]"
        >
          시연용 로그인으로 이동
        </button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    const created = createDemoCirclePost({
      category,
      title,
      body,
      relatedProductSlug: relatedProductSlug || undefined,
    });
    navigate(`/circle/${created.id}`);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <Link
        to="/circle"
        className="inline-flex min-h-[40px] items-center gap-1.5 text-sm text-[#656860] hover:text-[#353832]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        <span>CIRCLE로 돌아가기</span>
      </Link>

      <div className="mt-6 rounded-xl border border-[#353832]/12 bg-[#FFFFFF] p-6 sm:p-8">
        <h1 className="font-serif-kr text-2xl font-medium text-[#353832]">
          CIRCLE 이야기 남기기 (시연)
        </h1>
        <p className="mt-2 text-xs leading-relaxed text-[#656860]">
          작성된 글은 관리자 승인 대기(PENDING) 상태로 현재 브라우저 세션에만 임시 보관되며 서버 DB에 저장되지 않습니다. 사진 업로드 기능은 실제 스토리지 연동 후 활성화됩니다.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="write-category"
              className="block text-xs font-medium text-[#353832]"
            >
              카테고리
            </label>
            <select
              id="write-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as CircleCategory)}
              className="mt-1.5 min-h-[44px] w-full rounded-lg border border-[#353832]/20 bg-[#F5F1E9]/40 px-3 text-sm text-[#353832]"
            >
              <option value="MY_WARDROBE">내 옷장 (MY WARDROBE)</option>
              <option value="CARE_REPAIR">관리와 수선 (CARE &amp; REPAIR)</option>
              <option value="REFLECTION">일상과 성찰 (REFLECTION)</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="write-title"
              className="block text-xs font-medium text-[#353832]"
            >
              제목
            </label>
            <input
              id="write-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 3년째 가을마다 꺼내 입는 니트 관리 이야기"
              className="mt-1.5 min-h-[44px] w-full rounded-lg border border-[#353832]/20 bg-[#FFFFFF] px-3.5 text-sm text-[#353832] focus:border-[#26364C] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="write-body"
              className="block text-xs font-medium text-[#353832]"
            >
              본문
            </label>
            <textarea
              id="write-body"
              rows={6}
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="옷과 생활에 관한 이야기를 편하게 적어 주세요. 상업적 홍보나 중고 직거래 유도는 제한됩니다."
              className="mt-1.5 w-full rounded-lg border border-[#353832]/20 bg-[#FFFFFF] p-3.5 text-sm text-[#353832] focus:border-[#26364C] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="write-product"
              className="block text-xs font-medium text-[#353832]"
            >
              연결할 Leaf. 제품 (선택)
            </label>
            <select
              id="write-product"
              value={relatedProductSlug}
              onChange={(e) => setRelatedProductSlug(e.target.value)}
              className="mt-1.5 min-h-[44px] w-full rounded-lg border border-[#353832]/20 bg-[#F5F1E9]/40 px-3 text-sm text-[#353832]"
            >
              <option value="">연결 안 함 (타 브랜드/일상 이야기 포함)</option>
              {products.map((p) => (
                <option key={p.id} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-lg bg-[#F5F1E9] p-3.5 text-xs text-[#656860]">
            사진 첨부(최대 3장)는 실제 이미지 보안 스토리지 및 MIME/용량 검증 API 연결 후 제공될 예정입니다.
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Link
              to="/circle"
              className="inline-flex min-h-[44px] items-center rounded-lg border border-[#353832]/20 px-4 py-2 text-sm text-[#353832]"
            >
              취소
            </Link>
            <button
              type="submit"
              className="min-h-[44px] rounded-lg bg-[#26364C] px-6 py-2 text-sm font-medium text-[#F5F1E9]"
            >
              승인 대기 상태로 등록 시연
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
