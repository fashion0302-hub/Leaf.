import { BrandLogo } from './BrandLogo';
import { Link } from '../lib/router';

export function Footer() {
  return (
    <footer className="border-t border-[#353832]/12 bg-[#E4DACB]/35 text-[#353832]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="space-y-4 md:col-span-5">
            <Link
              to="/"
              aria-label="Leaf. 홈으로 이동"
              className="inline-block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#26364C]"
            >
              <BrandLogo variant="wordmark" className="h-7" decorative />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-[#656860]">
              오래도록 나다운 선택. 충분히 알고 선택한 옷을 오래 입고 돌보며,
              자신의 취향과 삶의 속도를 돌아보는 브랜드 공간입니다.
            </p>
            <p className="text-xs text-[#656860]">
              현재 페이지는 1차 디자인 및 이용 흐름 시연용 버전이며, 실제 결제·회원가입·DB 저장 기능은 연결되어 있지 않습니다.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7">
            <div className="space-y-3">
              <p className="text-xs font-semibold tracking-widest text-[#26364C]">
                EXPLORE
              </p>
              <ul className="space-y-2 text-sm text-[#656860]">
                <li>
                  <Link to="/shop" className="hover:text-[#353832]">
                    SHOP
                  </Link>
                </li>
                <li>
                  <Link to="/archive" className="hover:text-[#353832]">
                    ARCHIVE
                  </Link>
                </li>
                <li>
                  <Link to="/journal" className="hover:text-[#353832]">
                    JOURNAL
                  </Link>
                </li>
                <li>
                  <Link to="/journal/mindset" className="hover:text-[#353832]">
                    MINDSET
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold tracking-widest text-[#26364C]">
                CONNECT
              </p>
              <ul className="space-y-2 text-sm text-[#656860]">
                <li>
                  <Link to="/circle" className="hover:text-[#353832]">
                    CIRCLE
                  </Link>
                </li>
                <li>
                  <Link to="/experience" className="hover:text-[#353832]">
                    EXPERIENCE
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-[#353832]">
                    ABOUT LEAF.
                  </Link>
                </li>
                <li>
                  <Link to="/my" className="hover:text-[#353832]">
                    MY LEAF.
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold tracking-widest text-[#26364C]">
                GUIDE &amp; POLICY
              </p>
              <ul className="space-y-2 text-sm text-[#656860]">
                <li>
                  <Link to="/admin" className="font-medium text-[#26364C] hover:underline">
                    사진 · 글 편집 스튜디오
                  </Link>
                </li>
                <li>
                  <Link to="/about#integrations" className="hover:text-[#353832]">
                    실제 연동 필요 목록
                  </Link>
                </li>
                <li>
                  <Link to="/community-guidelines" className="hover:text-[#353832]">
                    커뮤니티 운영 규칙
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-[#353832]">
                    이용약관 (초안)
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-[#353832]">
                    개인정보 처리방침 (초안)
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-[#353832]/10 pt-6 text-xs text-[#656860] sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <BrandLogo variant="symbol" className="h-5 opacity-75" decorative />
            <span>© 2026 Leaf. All rights reserved.</span>
          </div>
          <span>Clothing &amp; Life · Warm Human Journal</span>
        </div>
      </div>
    </footer>
  );
}
