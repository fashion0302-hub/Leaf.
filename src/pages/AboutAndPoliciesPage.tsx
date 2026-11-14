import { BrandLogo } from '../components/BrandLogo';
import { EditTriggerButton } from '../components/EditTriggerButton';
import { useLeaf } from '../context/LeafContext';
import { INTEGRATION_CHECKLIST } from '../data/mockData';
import { Link } from '../lib/router';

export function AboutPage() {
  const { about } = useLeaf();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <section className="relative border-b border-[#353832]/12 pb-12">
        <EditTriggerButton
          target={{ type: 'about' }}
          label="브랜드 소개 수정"
          className="absolute top-0 right-0"
        />
        <div className="flex items-center gap-4">
          <BrandLogo variant="wordmark" className="h-9" />
          <BrandLogo variant="symbol" className="h-9 opacity-80" decorative />
        </div>
        <h1 className="font-serif-kr mt-6 text-3xl leading-snug font-medium text-[#353832] sm:text-4xl">
          {about.headline}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#656860]">
          {about.intro}
        </p>
      </section>

      <section className="grid gap-6 border-b border-[#353832]/12 py-12 sm:grid-cols-2">
        {about.values.map((item) => (
          <div
            key={item.code}
            className="rounded-xl border border-[#353832]/10 bg-[#FFFFFF] p-6"
          >
            <p className="text-xs font-semibold tracking-[0.2em] text-[#545745]">
              {item.code}
            </p>
            <h2 className="mt-2 text-lg font-semibold text-[#353832]">
              {item.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#656860]">
              {item.body}
            </p>
          </div>
        ))}
      </section>

      {/* Integration Checklist Section per User Request */}
      <section id="integrations" className="pt-12">
        <div className="space-y-2">
          <p className="text-xs font-medium tracking-[0.2em] text-[#545745]">
            IMPLEMENTATION STATUS
          </p>
          <h2 className="font-serif-kr text-2xl font-medium text-[#353832]">
            실제 연동이 필요한 기능 목록 (출시 전 체크리스트)
          </h2>
          <p className="text-sm leading-relaxed text-[#656860]">
            현재 웹사이트는 1차 디자인과 전체 페이지 이동·이용 흐름을 확인하기 위한 시연용 데이터 버전입니다. 정식 오픈을 위해 아래 항목의 실제 연동이 필요합니다.
          </p>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-[#353832]/12 bg-[#FFFFFF]">
          <div className="divide-y divide-[#353832]/10">
            {INTEGRATION_CHECKLIST.map((row, idx) => (
              <div
                key={idx}
                className="grid gap-3 p-5 md:grid-cols-12 md:items-start"
              >
                <div className="md:col-span-4">
                  <p className="text-xs font-semibold text-[#545745]">
                    {row.priority}
                  </p>
                  <h3 className="mt-0.5 text-sm font-semibold text-[#353832]">
                    {row.area}
                  </h3>
                </div>
                <div className="md:col-span-4">
                  <p className="text-[11px] font-medium text-[#656860]">
                    현재 시연 구현 상태
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-[#353832]">
                    {row.currentDemo}
                  </p>
                </div>
                <div className="md:col-span-4">
                  <p className="text-[11px] font-medium text-[#26364C]">
                    출시 전 실제 연동 필요
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-[#656860]">
                    {row.requiredAction}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function PolicyPage({
  type,
}: {
  type: 'privacy' | 'terms' | 'community-guidelines';
}) {
  const content = {
    privacy: {
      kicker: 'PRIVACY POLICY (초안)',
      title: '개인정보 처리방침 안내',
      sections: [
        {
          heading: '1. 최소 정보 수집 원칙',
          body: 'Leaf.는 간편 로그인 고유 식별자, 공개 닉네임, 필수 약관 동의 이력 외에 불필요한 주소·생년월일·전화번호를 수집하지 않습니다. 실제 의류 배송 정보와 프로그램 예약 결제 정보는 각각 네이버 스마트스토어 및 네이버 예약에서 처리됩니다.',
        },
        {
          heading: '2. 자기성찰(MINDSET) 비저장 원칙',
          body: 'MINDSET 페이지의 질문은 열람 및 복사 기능만 제공하며, 사용자의 개인적인 성찰 답변을 입력받거나 서버 데이터베이스에 저장하지 않습니다.',
        },
        {
          heading: '3. 시연 버전 고지',
          body: '현재 시연 버전에서는 어떠한 개인정보도 외부 서버로 전송되거나 영구 저장되지 않으며, 정식 서비스 출시 전 법률 검토를 거쳐 확정본을 게시할 예정입니다.',
        },
      ],
    },
    terms: {
      kicker: 'TERMS OF SERVICE (초안)',
      title: '서비스 이용약관 안내',
      sections: [
        {
          heading: '1. 브랜드 플랫폼과 외부 거래의 구분',
          body: 'Leaf. 웹사이트는 브랜드 콘텐츠, 제작 기록, 커뮤니티, 프로그램 안내를 제공합니다. 초기 의류 선주문 결제 및 배송은 네이버 스마트스토어에서, 프로그램 예약 및 환불은 네이버 예약에서 해당 플랫폼 약관에 따라 진행됩니다.',
        },
        {
          heading: '2. 재주문 희망 표시의 성격',
          body: '마감된 제품에 대한 ‘다시 만나고 싶어요’ 표시는 향후 재생산 검토를 위한 참고 의견일 뿐이며, 실제 주문·예약·재입고를 보장하지 않습니다.',
        },
      ],
    },
    'community-guidelines': {
      kicker: 'COMMUNITY GUIDELINES',
      title: 'CIRCLE 커뮤니티 운영 규칙',
      sections: [
        {
          heading: '1. 취향과 속도에 대한 존중',
          body: '타인의 옷차림이나 소비 기준을 비난하거나 특정 생활 방식을 강요하지 않습니다. Leaf. 제품이 아닌 다른 브랜드의 옷이라도 관리·착용·수선 경험 맥락에서는 자유롭게 나눌 수 있습니다.',
        },
        {
          heading: '2. 제한되는 게시물',
          body: '상업적 광고, 제휴 홍보, 중고 직거래 유도, 타인의 개인정보 노출, 무단 도용 이미지, 괴롭힘 및 차별적 표현은 승인 반려 또는 숨김 처리될 수 있습니다.',
        },
        {
          heading: '3. 건강·심리 관련 유의사항',
          body: 'CIRCLE과 MINDSET은 일상적 성찰과 교류를 위한 공간이며 전문적인 의료·심리 상담이나 치료를 대신하지 않습니다. 다른 회원에게 의학적 진단이나 치료를 지시하는 행위는 금지됩니다.',
        },
      ],
    },
  }[type];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <p className="text-xs font-medium tracking-[0.2em] text-[#545745]">
        {content.kicker}
      </p>
      <h1 className="font-serif-kr mt-2 text-3xl font-medium text-[#353832]">
        {content.title}
      </h1>

      <div className="mt-8 space-y-6 rounded-xl border border-[#353832]/10 bg-[#FFFFFF] p-6 sm:p-8">
        {content.sections.map((sec, i) => (
          <section key={i} className="space-y-2">
            <h2 className="text-base font-semibold text-[#353832]">
              {sec.heading}
            </h2>
            <p className="text-sm leading-relaxed text-[#656860]">
              {sec.body}
            </p>
          </section>
        ))}
      </div>

      <div className="mt-8">
        <Link to="/" className="text-sm font-medium text-[#26364C] hover:underline">
          ← 홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
