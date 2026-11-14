import { useState } from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import type { ProgramMode } from '../types/leaf';
import { useLeaf } from '../context/LeafContext';
import { Link } from '../lib/router';
import { EditorialImage } from '../components/EditorialImage';
import { EditTriggerButton } from '../components/EditTriggerButton';
import {
  PROGRAM_MODE_LABEL,
  PROGRAM_STATUS_LABEL,
  PROGRAM_TYPE_LABEL,
} from '../components/StatusLabels';

export function ExperiencePage() {
  const { experiencePrograms } = useLeaf();
  const [modeFilter, setModeFilter] = useState<'ALL' | ProgramMode>('ALL');
  const filtered =
    modeFilter === 'ALL'
      ? experiencePrograms
      : experiencePrograms.filter((p) => p.mode === modeFilter);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="flex flex-col justify-between gap-6 border-b border-[#353832]/12 pb-8 md:flex-row md:items-end">
        <div className="space-y-2">
          <p className="text-xs font-medium tracking-[0.2em] text-[#545745]">
            EXPERIENCE
          </p>
          <h1 className="font-serif-kr text-3xl font-medium text-[#353832] sm:text-4xl">
            온·오프라인 경험과 모임
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-[#656860]">
            아로마 셀프케어, 마인드셋 세션, 수선 모임을 통해 일상 속 쉼과 연결을 경험해 보세요. 실제 예약·결제는 외부 네이버 예약을 통해 진행되며, 모집 상태는 수동으로 관리됩니다.
          </p>
        </div>

        <div className="flex gap-1.5">
          {[
            { value: 'ALL' as const, label: '전체' },
            { value: 'OFFLINE' as const, label: '오프라인' },
            { value: 'ONLINE' as const, label: '온라인' },
          ].map((tab) => {
            const active = modeFilter === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setModeFilter(tab.value)}
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
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-3">
        {filtered.map((program) => (
          <article
            key={program.id}
            className="relative flex flex-col overflow-hidden rounded-xl border border-[#353832]/10 bg-[#FFFFFF]"
          >
            <EditTriggerButton
              target={{ type: 'experience', id: program.id }}
              className="absolute top-3 right-3 z-10"
            />
            <Link to={`/experience/${program.slug}`} className="block">
              <EditorialImage
                src={program.image}
                alt={program.imageAlt}
                aspectClass="aspect-[4/3]"
              />
            </Link>
            <div className="flex flex-1 flex-col justify-between p-6">
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#656860]">
                  <span>{PROGRAM_TYPE_LABEL[program.type]}</span>
                  <span aria-hidden="true">·</span>
                  <span>{PROGRAM_MODE_LABEL[program.mode]}</span>
                </div>
                <h2 className="text-lg leading-snug font-semibold text-[#353832]">
                  <Link
                    to={`/experience/${program.slug}`}
                    className="hover:text-[#26364C]"
                  >
                    {program.title}
                  </Link>
                </h2>
                <p className="text-xs font-medium text-[#26364C]">
                  {PROGRAM_STATUS_LABEL[program.status]}
                </p>
                <p className="text-sm leading-relaxed text-[#656860]">
                  {program.summary}
                </p>
              </div>

              <div className="mt-5 space-y-2 border-t border-[#353832]/10 pt-4 text-xs text-[#656860]">
                <p className="tabular-nums">{program.scheduleKst}</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-semibold text-[#353832]">
                    {program.priceText.split(' (')[0]}
                  </span>
                  <Link
                    to={`/experience/${program.slug}`}
                    className="font-medium text-[#26364C] hover:underline"
                  >
                    상세 안내 →
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function ExperienceDetailPage({ slug }: { slug: string }) {
  const { experiencePrograms, setExternalNotice } = useLeaf();
  const program = experiencePrograms.find((p) => p.slug === slug);

  if (!program) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-serif-kr text-2xl font-medium text-[#353832]">
          프로그램 정보를 찾을 수 없습니다.
        </h1>
        <Link
          to="/experience"
          className="mt-6 inline-flex min-h-[44px] items-center rounded-lg bg-[#26364C] px-5 py-2.5 text-sm font-medium text-[#F5F1E9]"
        >
          EXPERIENCE 목록으로
        </Link>
      </div>
    );
  }

  const canBook = program.status === 'OPEN';

  const handleBookingClick = () => {
    setExternalNotice({
      title: program.title,
      provider: program.bookingProvider,
      description: `'${program.title}'의 실제 좌석 확인, 예약 확정 및 결제는 외부 ${program.bookingProvider} 페이지에서 이루어집니다. 현재 시연 버전에서는 외부 예약 URL이 연결되어 있지 않으며, Leaf. 내부에서는 예약 확정을 저장하거나 추정하지 않습니다.`,
      actionLabel: '안내 확인',
    });
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/experience"
          className="inline-flex min-h-[40px] items-center gap-1.5 text-sm text-[#656860] hover:text-[#353832]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>EXPERIENCE 목록으로</span>
        </Link>
        <EditTriggerButton target={{ type: 'experience', id: program.id }} />
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <div className="overflow-hidden rounded-xl border border-[#353832]/10 bg-[#FFFFFF]">
            <EditorialImage
              src={program.image}
              alt={program.imageAlt}
              aspectClass="aspect-[4/3]"
              priority
            />
          </div>

          <div className="space-y-4">
            <h2 className="font-serif-kr text-xl font-medium text-[#353832]">
              프로그램 소개
            </h2>
            {program.description.map((para, idx) => (
              <p key={idx} className="text-sm leading-[1.85] text-[#353832]">
                {para}
              </p>
            ))}
          </div>

          <div className="rounded-xl bg-[#E4DACB]/40 p-5 text-xs leading-relaxed text-[#656860]">
            <p className="font-semibold text-[#353832]">취소 · 환불 및 예약 기준</p>
            <p className="mt-1.5">{program.refundPolicy}</p>
          </div>
        </div>

        <aside className="space-y-6 lg:col-span-5">
          <div className="rounded-xl border border-[#353832]/12 bg-[#FFFFFF] p-6">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#656860]">
              <span>{PROGRAM_TYPE_LABEL[program.type]}</span>
              <span aria-hidden="true">·</span>
              <span>{PROGRAM_MODE_LABEL[program.mode]}</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-[#26364C]">
                {PROGRAM_STATUS_LABEL[program.status]}
              </span>
            </div>
            <h1 className="font-serif-kr mt-2 text-2xl font-medium text-[#353832]">
              {program.title}
            </h1>

            <dl className="mt-6 divide-y divide-[#353832]/10 border-t border-[#353832]/10 text-xs">
              <div className="py-3">
                <dt className="text-[#656860]">일정 (KST)</dt>
                <dd className="mt-1 font-medium tabular-nums text-[#353832]">
                  {program.scheduleKst}
                </dd>
              </div>
              <div className="py-3">
                <dt className="text-[#656860]">장소 / 참여 방법</dt>
                <dd className="mt-1 text-[#353832]">{program.locationText}</dd>
              </div>
              <div className="py-3">
                <dt className="text-[#656860]">진행자</dt>
                <dd className="mt-1 text-[#353832]">{program.hostName}</dd>
              </div>
              <div className="py-3">
                <dt className="text-[#656860]">추천 대상</dt>
                <dd className="mt-1 text-[#353832]">{program.targetAudience}</dd>
              </div>
              <div className="py-3">
                <dt className="text-[#656860]">정원</dt>
                <dd className="mt-1 text-[#353832]">{program.capacityText}</dd>
              </div>
              <div className="py-3">
                <dt className="text-[#656860]">참가비</dt>
                <dd className="mt-1 font-semibold text-[#353832]">
                  {program.priceText}
                </dd>
              </div>
              <div className="py-3">
                <dt className="text-[#656860]">준비물</dt>
                <dd className="mt-1 text-[#353832]">{program.preparations}</dd>
              </div>
              <div className="py-3">
                <dt className="text-[#656860]">신청 마감</dt>
                <dd className="mt-1 text-[#353832]">{program.deadlineText}</dd>
              </div>
            </dl>

            <div className="mt-6">
              {canBook ? (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleBookingClick}
                    className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-[#26364C] px-5 py-3 text-sm font-medium text-[#F5F1E9] transition-colors hover:bg-[#1e2b3d]"
                  >
                    <span>네이버 예약에서 신청하기 (시연 안내)</span>
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <p className="text-xs text-[#656860]">
                    실제 예약·결제는 네이버 예약에서 진행되며 MY LEAF.에 예약 내역이 자동 표시되지 않습니다.
                  </p>
                </div>
              ) : (
                <div className="rounded-lg bg-[#F5F1E9] p-4 text-xs leading-relaxed text-[#656860]">
                  <p className="font-semibold text-[#353832]">
                    현재 예약 링크가 활성화되지 않은 상태입니다 ({PROGRAM_STATUS_LABEL[program.status]}).
                  </p>
                  <p className="mt-1">
                    {program.status === 'UPCOMING'
                      ? '모집이 열리면 검증된 네이버 예약 링크가 연결됩니다.'
                      : '정원이 마감되어 예약 접수가 종료되었습니다.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
