import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { Link, useRouter } from '../lib/router';
import { useLeaf } from '../context/LeafContext';

const DESKTOP_NAV = [
  { label: 'SHOP', path: '/shop' },
  { label: 'ARCHIVE', path: '/archive' },
  { label: 'JOURNAL', path: '/journal' },
  { label: 'CIRCLE', path: '/circle' },
  { label: 'EXPERIENCE', path: '/experience' },
];

const MOBILE_NAV = [
  { label: 'HOME', path: '/' },
  { label: 'SHOP', path: '/shop' },
  { label: 'ARCHIVE', path: '/archive' },
  { label: 'JOURNAL', path: '/journal' },
  { label: 'MINDSET', path: '/journal/mindset' },
  { label: 'CIRCLE', path: '/circle' },
  { label: 'EXPERIENCE', path: '/experience' },
  { label: 'MY LEAF.', path: '/my' },
];

export function Header() {
  const { pathname } = useRouter();
  const { user } = useLeaf();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    if (path === '/journal') {
      return pathname === '/journal' || pathname.startsWith('/journal/');
    }
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#353832]/10 bg-[#F5F1E9]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark */}
        <Link
          to="/"
          aria-label="Leaf. 홈으로 이동"
          className="flex shrink-0 items-center py-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#26364C]"
          onClick={() => setMobileOpen(false)}
        >
          <BrandLogo variant="wordmark" className="h-7 sm:h-8" decorative />
        </Link>

        {/* Zone 2: 5 concise single-line nav links */}
        <nav
          aria-label="주 메뉴"
          className="hidden items-center gap-7 md:flex"
        >
          {DESKTOP_NAV.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative py-1 text-sm tracking-wide whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#26364C] ${
                  active
                    ? 'font-semibold text-[#26364C]'
                    : 'font-medium text-[#656860] hover:text-[#353832]'
                }`}
              >
                {item.label}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute right-0 bottom-0 left-0 h-[1.5px] bg-[#26364C]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action (MY LEAF.) + Mobile menu toggle */}
        <div className="flex shrink-0 items-center gap-3">
          <Link
            to="/my"
            className="hidden min-h-[40px] items-center justify-center rounded-md border border-[#26364C]/20 bg-[#FFFFFF]/70 px-4 py-2 text-xs font-medium tracking-wide text-[#26364C] whitespace-nowrap shrink-0 transition-colors duration-150 hover:border-[#26364C] hover:bg-[#26364C] hover:text-[#F5F1E9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#26364C] md:inline-flex"
          >
            {user ? `MY LEAF. · ${user.nickname}` : 'MY LEAF.'}
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? '메뉴 닫기' : '메뉴 열기'}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-[#353832] transition-colors hover:bg-[#E4DACB]/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#26364C] md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <nav
          aria-label="모바일 전체 메뉴"
          className="border-t border-[#353832]/10 bg-[#F5F1E9] px-4 py-4 md:hidden"
        >
          <ul className="space-y-1">
            {MOBILE_NAV.map((item) => {
              const active =
                item.path === '/journal'
                  ? pathname === '/journal' ||
                    (pathname.startsWith('/journal/') &&
                      !pathname.startsWith('/journal/mindset'))
                  : isActive(item.path);
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex min-h-[44px] items-center justify-between rounded-md px-3 text-sm tracking-wide transition-colors ${
                      active
                        ? 'bg-[#E4DACB]/70 font-semibold text-[#26364C]'
                        : 'text-[#353832] hover:bg-[#E4DACB]/40'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.path === '/my' && user && (
                      <span className="text-xs text-[#656860]">{user.nickname}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
