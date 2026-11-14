import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  ARCHIVE_ENTRIES,
  EXPERIENCE_PROGRAMS,
  INITIAL_ABOUT,
  INITIAL_CIRCLE_COMMENTS,
  INITIAL_CIRCLE_POSTS,
  INITIAL_HERO,
  JOURNAL_POSTS,
  MINDSET_POSTS,
  PRODUCTS,
} from '../data/mockData';
import type {
  AboutContent,
  ArchiveEntry,
  CircleCategory,
  CircleComment,
  CirclePost,
  DemoUser,
  ExperienceProgram,
  HeroContent,
  JournalPost,
  MindsetPost,
  Product,
  ReorderInterest,
  SiteContentBundle,
} from '../types/leaf';

const STORAGE_KEY = 'leaf_site_content_v1';

export type QuickEditTarget =
  | { type: 'hero' }
  | { type: 'about' }
  | { type: 'product'; id: string }
  | { type: 'archive'; pieceNumber: string }
  | { type: 'journal'; id: string }
  | { type: 'mindset'; id: string }
  | { type: 'experience'; id: string }
  | { type: 'circle'; id: string }
  | null;

interface ExternalNotice {
  title: string;
  provider: string;
  description: string;
  actionLabel: string;
}

function getDefaultBundle(): SiteContentBundle {
  return {
    hero: INITIAL_HERO,
    about: INITIAL_ABOUT,
    products: PRODUCTS,
    archiveEntries: ARCHIVE_ENTRIES,
    journalPosts: JOURNAL_POSTS,
    mindsetPosts: MINDSET_POSTS,
    experiencePrograms: EXPERIENCE_PROGRAMS,
    circlePosts: INITIAL_CIRCLE_POSTS,
  };
}

function loadStoredBundle(): SiteContentBundle {
  const fallback = getDefaultBundle();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<SiteContentBundle>;
    return {
      hero: parsed.hero ?? fallback.hero,
      about: parsed.about ?? fallback.about,
      products: Array.isArray(parsed.products) ? parsed.products : fallback.products,
      archiveEntries: Array.isArray(parsed.archiveEntries)
        ? parsed.archiveEntries
        : fallback.archiveEntries,
      journalPosts: Array.isArray(parsed.journalPosts)
        ? parsed.journalPosts
        : fallback.journalPosts,
      mindsetPosts: Array.isArray(parsed.mindsetPosts)
        ? parsed.mindsetPosts
        : fallback.mindsetPosts,
      experiencePrograms: Array.isArray(parsed.experiencePrograms)
        ? parsed.experiencePrograms
        : fallback.experiencePrograms,
      circlePosts: Array.isArray(parsed.circlePosts)
        ? parsed.circlePosts
        : fallback.circlePosts,
    };
  } catch {
    return fallback;
  }
}

interface LeafContextValue {
  // Auth / Demo User
  user: DemoUser | null;
  loginDemoUser: (providerLabel?: string, nickname?: string) => void;
  logoutDemoUser: () => void;
  updateNickname: (nickname: string) => void;
  returnToAfterLogin: string | null;
  setReturnToAfterLogin: (path: string | null) => void;

  // Editable Site Content
  hero: HeroContent;
  about: AboutContent;
  products: Product[];
  archiveEntries: ArchiveEntry[];
  journalPosts: JournalPost[];
  mindsetPosts: MindsetPost[];
  experiencePrograms: ExperienceProgram[];
  circlePosts: CirclePost[];
  circleComments: CircleComment[];
  storageWarning: string | null;
  clearStorageWarning: () => void;

  // Edit Mode & Quick Edit Modal
  isEditMode: boolean;
  setIsEditMode: (val: boolean) => void;
  quickEditTarget: QuickEditTarget;
  setQuickEditTarget: (target: QuickEditTarget) => void;

  // Content Mutations
  updateHero: (next: HeroContent) => void;
  updateAbout: (next: AboutContent) => void;
  updateProduct: (id: string, next: Product) => void;
  addProduct: (next: Product) => void;
  updateArchiveEntry: (pieceNumber: string, next: ArchiveEntry) => void;
  updateJournalPost: (id: string, next: JournalPost) => void;
  addJournalPost: (next: JournalPost) => void;
  updateMindsetPost: (id: string, next: MindsetPost) => void;
  addMindsetPost: (next: MindsetPost) => void;
  updateExperienceProgram: (id: string, next: ExperienceProgram) => void;
  updateCirclePost: (id: string, next: CirclePost) => void;
  resetAllContent: () => void;
  exportContentJson: () => string;
  importContentJson: (raw: string) => { ok: boolean; error?: string };

  // Community & Reorder Actions
  createDemoCirclePost: (input: {
    category: CircleCategory;
    title: string;
    body: string;
    relatedProductSlug?: string;
  }) => CirclePost;
  deleteDemoCirclePost: (postId: string) => void;
  addDemoComment: (postId: string, body: string) => void;
  deleteDemoComment: (commentId: string) => void;
  reportedIds: string[];
  reportDemoTarget: (targetId: string) => void;
  reorderInterests: ReorderInterest[];
  toggleReorderInterest: (input: {
    productSlug: string;
    productName: string;
    variantId: string;
    color: string;
    size: string;
  }) => 'ADDED' | 'REMOVED';
  removeReorderInterest: (interestId: string) => void;
  externalNotice: ExternalNotice | null;
  setExternalNotice: (notice: ExternalNotice | null) => void;
}

const LeafContext = createContext<LeafContextValue | null>(null);

export function LeafProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContentBundle>(() => loadStoredBundle());
  const [storageWarning, setStorageWarning] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [quickEditTarget, setQuickEditTarget] = useState<QuickEditTarget>(null);

  const [user, setUser] = useState<DemoUser | null>(null);
  const [returnToAfterLogin, setReturnToAfterLogin] = useState<string | null>(null);
  const [circleComments, setCircleComments] = useState<CircleComment[]>(INITIAL_CIRCLE_COMMENTS);
  const [reportedIds, setReportedIds] = useState<string[]>([]);
  const [reorderInterests, setReorderInterests] = useState<ReorderInterest[]>([]);
  const [externalNotice, setExternalNotice] = useState<ExternalNotice | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
      setStorageWarning(null);
    } catch {
      setStorageWarning(
        '브라우저 저장 공간(localStorage) 한도에 가까워 일부 큰 사진이 자동 저장되지 않을 수 있습니다. 상단 JSON 내보내기로 백업해 주세요.'
      );
    }
  }, [content]);

  const updateHero = (next: HeroContent) =>
    setContent((prev) => ({ ...prev, hero: next }));

  const updateAbout = (next: AboutContent) =>
    setContent((prev) => ({ ...prev, about: next }));

  const updateProduct = (id: string, next: Product) =>
    setContent((prev) => ({
      ...prev,
      products: prev.products.map((p) => (p.id === id ? next : p)),
    }));

  const addProduct = (next: Product) =>
    setContent((prev) => ({ ...prev, products: [next, ...prev.products] }));

  const updateArchiveEntry = (pieceNumber: string, next: ArchiveEntry) =>
    setContent((prev) => ({
      ...prev,
      archiveEntries: prev.archiveEntries.map((a) =>
        a.pieceNumber === pieceNumber ? next : a
      ),
    }));

  const updateJournalPost = (id: string, next: JournalPost) =>
    setContent((prev) => ({
      ...prev,
      journalPosts: prev.journalPosts.map((j) => (j.id === id ? next : j)),
    }));

  const addJournalPost = (next: JournalPost) =>
    setContent((prev) => ({
      ...prev,
      journalPosts: [next, ...prev.journalPosts],
    }));

  const updateMindsetPost = (id: string, next: MindsetPost) =>
    setContent((prev) => ({
      ...prev,
      mindsetPosts: prev.mindsetPosts.map((m) => (m.id === id ? next : m)),
    }));

  const addMindsetPost = (next: MindsetPost) =>
    setContent((prev) => ({
      ...prev,
      mindsetPosts: [next, ...prev.mindsetPosts],
    }));

  const updateExperienceProgram = (id: string, next: ExperienceProgram) =>
    setContent((prev) => ({
      ...prev,
      experiencePrograms: prev.experiencePrograms.map((e) =>
        e.id === id ? next : e
      ),
    }));

  const updateCirclePost = (id: string, next: CirclePost) =>
    setContent((prev) => ({
      ...prev,
      circlePosts: prev.circlePosts.map((c) => (c.id === id ? next : c)),
    }));

  const resetAllContent = () => {
    const fresh = getDefaultBundle();
    setContent(fresh);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage error
    }
  };

  const exportContentJson = () => JSON.stringify(content, null, 2);

  const importContentJson = (raw: string): { ok: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(raw) as Partial<SiteContentBundle>;
      if (!parsed || typeof parsed !== 'object' || !parsed.hero || !parsed.products) {
        return { ok: false, error: '올바른 Leaf. 콘텐츠 JSON 형식이 아닙니다.' };
      }
      const fallback = getDefaultBundle();
      setContent({
        hero: parsed.hero ?? fallback.hero,
        about: parsed.about ?? fallback.about,
        products: parsed.products ?? fallback.products,
        archiveEntries: parsed.archiveEntries ?? fallback.archiveEntries,
        journalPosts: parsed.journalPosts ?? fallback.journalPosts,
        mindsetPosts: parsed.mindsetPosts ?? fallback.mindsetPosts,
        experiencePrograms: parsed.experiencePrograms ?? fallback.experiencePrograms,
        circlePosts: parsed.circlePosts ?? fallback.circlePosts,
      });
      return { ok: true };
    } catch {
      return { ok: false, error: 'JSON 구문을 해석할 수 없습니다.' };
    }
  };

  const loginDemoUser = (providerLabel = '시연용 간편 로그인', nickname = '다정한오전') => {
    setUser({
      id: 'demo-member-01',
      nickname: nickname.trim() || '다정한오전',
      providerLabel,
      joinedAt: '2026.11.14 (시연 세션)',
    });
  };

  const logoutDemoUser = () => {
    setUser(null);
  };

  const updateNickname = (nickname: string) => {
    const trimmed = nickname.trim();
    if (!trimmed || !user) return;
    setUser({ ...user, nickname: trimmed });
    setContent((prev) => ({
      ...prev,
      circlePosts: prev.circlePosts.map((post) =>
        post.authorId === user.id ? { ...post, authorNickname: trimmed } : post
      ),
    }));
  };

  const createDemoCirclePost = (input: {
    category: CircleCategory;
    title: string;
    body: string;
    relatedProductSlug?: string;
  }): CirclePost => {
    const newPost: CirclePost = {
      id: `circle-demo-${Date.now()}`,
      authorNickname: user?.nickname || '다정한오전',
      authorId: user?.id || 'demo-member-01',
      authorType: 'MEMBER',
      category: input.category,
      title: input.title.trim(),
      body: input.body.trim(),
      status: 'PENDING',
      relatedProductSlug: input.relatedProductSlug || undefined,
      createdAt: '방금 전 (시연)',
    };
    setContent((prev) => ({
      ...prev,
      circlePosts: [newPost, ...prev.circlePosts],
    }));
    return newPost;
  };

  const deleteDemoCirclePost = (postId: string) => {
    setContent((prev) => ({
      ...prev,
      circlePosts: prev.circlePosts.filter((p) => p.id !== postId),
    }));
  };

  const addDemoComment = (postId: string, body: string) => {
    if (!user || !body.trim()) return;
    const newComment: CircleComment = {
      id: `cmt-demo-${Date.now()}`,
      postId,
      authorNickname: user.nickname,
      body: body.trim(),
      createdAt: '방금 전 (시연)',
    };
    setCircleComments((prev) => [...prev, newComment]);
  };

  const deleteDemoComment = (commentId: string) => {
    setCircleComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  const reportDemoTarget = (targetId: string) => {
    setReportedIds((prev) => (prev.includes(targetId) ? prev : [...prev, targetId]));
  };

  const toggleReorderInterest = (input: {
    productSlug: string;
    productName: string;
    variantId: string;
    color: string;
    size: string;
  }): 'ADDED' | 'REMOVED' => {
    const memberId = user?.id || 'demo-member-01';
    const existing = reorderInterests.find(
      (item) => item.memberId === memberId && item.variantId === input.variantId
    );
    if (existing) {
      setReorderInterests((prev) => prev.filter((item) => item.id !== existing.id));
      return 'REMOVED';
    }
    const created: ReorderInterest = {
      id: `ri-${Date.now()}`,
      memberId,
      productSlug: input.productSlug,
      productName: input.productName,
      variantId: input.variantId,
      color: input.color,
      size: input.size,
      createdAt: '2026.11.14 (시연)',
    };
    setReorderInterests((prev) => [created, ...prev]);
    return 'ADDED';
  };

  const removeReorderInterest = (interestId: string) => {
    setReorderInterests((prev) => prev.filter((item) => item.id !== interestId));
  };

  return (
    <LeafContext.Provider
      value={{
        user,
        loginDemoUser,
        logoutDemoUser,
        updateNickname,
        returnToAfterLogin,
        setReturnToAfterLogin,
        hero: content.hero,
        about: content.about,
        products: content.products,
        archiveEntries: content.archiveEntries,
        journalPosts: content.journalPosts,
        mindsetPosts: content.mindsetPosts,
        experiencePrograms: content.experiencePrograms,
        circlePosts: content.circlePosts,
        circleComments,
        storageWarning,
        clearStorageWarning: () => setStorageWarning(null),
        isEditMode,
        setIsEditMode,
        quickEditTarget,
        setQuickEditTarget,
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
        resetAllContent,
        exportContentJson,
        importContentJson,
        createDemoCirclePost,
        deleteDemoCirclePost,
        addDemoComment,
        deleteDemoComment,
        reportedIds,
        reportDemoTarget,
        reorderInterests,
        toggleReorderInterest,
        removeReorderInterest,
        externalNotice,
        setExternalNotice,
      }}
    >
      {children}
    </LeafContext.Provider>
  );
}

export function useLeaf() {
  const ctx = useContext(LeafContext);
  if (!ctx) throw new Error('useLeaf must be used inside LeafProvider');
  return ctx;
}
