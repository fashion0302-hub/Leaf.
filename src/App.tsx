import { ExternalNoticeModal } from './components/ExternalNoticeModal';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { EditModeDock, QuickEditModal } from './components/QuickEditModal';
import { LeafProvider } from './context/LeafContext';
import { Link, RouterProvider, useRouter } from './lib/router';
import { AboutPage, PolicyPage } from './pages/AboutAndPoliciesPage';
import { AdminStudioPage } from './pages/AdminStudioPage';
import { ArchiveDetailPage, ArchivePage } from './pages/ArchivePage';
import {
  CircleDetailPage,
  CirclePage,
  CircleWritePage,
} from './pages/CirclePage';
import {
  ExperienceDetailPage,
  ExperiencePage,
} from './pages/ExperiencePage';
import { HomePage } from './pages/HomePage';
import { JournalDetailPage, JournalPage } from './pages/JournalPage';
import { MindsetDetailPage, MindsetPage } from './pages/MindsetPage';
import { LoginPage, MyLeafPage } from './pages/MyLeafPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ShopPage } from './pages/ShopPage';

function PageView() {
  const { pathname } = useRouter();
  const normalized = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');

  if (normalized === '/') return <HomePage />;

  if (normalized === '/shop') return <ShopPage />;
  if (normalized.startsWith('/shop/')) {
    const slug = decodeURIComponent(normalized.slice('/shop/'.length));
    return <ProductDetailPage slug={slug} />;
  }

  if (normalized === '/archive') return <ArchivePage />;
  if (normalized.startsWith('/archive/')) {
    const piece = decodeURIComponent(normalized.slice('/archive/'.length));
    return <ArchiveDetailPage piece={piece} />;
  }

  if (normalized === '/journal') return <JournalPage />;
  if (normalized === '/journal/mindset') return <MindsetPage />;
  if (normalized.startsWith('/journal/mindset/')) {
    const slug = decodeURIComponent(
      normalized.slice('/journal/mindset/'.length)
    );
    return <MindsetDetailPage slug={slug} />;
  }
  if (normalized.startsWith('/journal/')) {
    const slug = decodeURIComponent(normalized.slice('/journal/'.length));
    return <JournalDetailPage slug={slug} />;
  }

  if (normalized === '/circle') return <CirclePage />;
  if (normalized === '/circle/write') return <CircleWritePage />;
  if (normalized.startsWith('/circle/')) {
    const id = decodeURIComponent(normalized.slice('/circle/'.length));
    return <CircleDetailPage id={id} />;
  }

  if (normalized === '/experience') return <ExperiencePage />;
  if (normalized.startsWith('/experience/')) {
    const slug = decodeURIComponent(normalized.slice('/experience/'.length));
    return <ExperienceDetailPage slug={slug} />;
  }

  if (normalized === '/my') return <MyLeafPage initialTab="interests" />;
  if (normalized === '/my/interests') return <MyLeafPage initialTab="interests" />;
  if (normalized === '/my/posts') return <MyLeafPage initialTab="posts" />;
  if (normalized === '/my/settings') return <MyLeafPage initialTab="settings" />;
  if (normalized === '/login') return <LoginPage />;

  if (normalized === '/admin') return <AdminStudioPage />;

  if (normalized === '/about') return <AboutPage />;
  if (normalized === '/privacy') return <PolicyPage type="privacy" />;
  if (normalized === '/terms') return <PolicyPage type="terms" />;
  if (normalized === '/community-guidelines') {
    return <PolicyPage type="community-guidelines" />;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <p className="text-xs font-medium tracking-[0.2em] text-[#545745]">404</p>
      <h1 className="font-serif-kr mt-2 text-3xl font-medium text-[#353832]">
        페이지를 찾을 수 없습니다.
      </h1>
      <p className="mt-3 text-sm text-[#656860]">
        요청하신 주소가 없거나 이동되었습니다.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex min-h-[44px] items-center rounded-lg bg-[#26364C] px-5 py-2.5 text-sm font-medium text-[#F5F1E9]"
      >
        Leaf. 홈으로 이동
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <LeafProvider>
        <div className="flex min-h-screen flex-col bg-[#F5F1E9] text-[#353832]">
          <Header />
          <main className="flex-1">
            <PageView />
          </main>
          <Footer />
          <EditModeDock />
          <QuickEditModal />
          <ExternalNoticeModal />
        </div>
      </LeafProvider>
    </RouterProvider>
  );
}
