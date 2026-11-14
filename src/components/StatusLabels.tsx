import type {
  CircleCategory,
  CirclePostStatus,
  JournalKind,
  MindsetKind,
  ProductCategory,
  ProductionStatus,
  ProgramMode,
  ProgramStatus,
  ProgramType,
  SellingStatus,
} from '../types/leaf';

export const PRODUCT_CATEGORY_LABEL: Record<ProductCategory, string> = {
  ROBE: 'Robe',
  TEE: 'Tee',
  KNIT: 'Knit',
  BOTTOMS: 'Bottoms',
};

export const SELLING_STATUS_LABEL: Record<SellingStatus, string> = {
  OPEN: 'PRE-ORDER OPEN · 선주문 진행 중',
  COMING_SOON: 'COMING SOON · 오픈 예정',
  CLOSED: 'PRE-ORDER CLOSED · 선주문 마감',
};

export const PRODUCTION_STATUS_LABEL: Record<ProductionStatus, string> = {
  PLANNING: '제작 준비',
  YARN_SOURCING: '원사 확인 및 편직 준비',
  KNITTING: '공방 제작 진행 중',
  FINISHING: '마감 및 검수 중',
  SHIPPING: '순차 출고 진행',
  COMPLETED: '출고 완료',
};

export const JOURNAL_KIND_LABEL: Record<JournalKind, string> = {
  BRAND: '브랜드 이야기',
  MAKING: '제작 기록',
  PEOPLE: '사람과의 대화',
};

export const MINDSET_KIND_LABEL: Record<MindsetKind, string> = {
  QUESTION: 'Question · 질문',
  NOTE: 'Note · 에세이',
  SMALL_PRACTICE: 'Small Practice · 작은 실천',
};

export const CIRCLE_CATEGORY_LABEL: Record<CircleCategory, string> = {
  MY_WARDROBE: '내 옷장',
  CARE_REPAIR: '관리와 수선',
  REFLECTION: '일상과 성찰',
  LEAF_ASKS: 'Leaf.의 질문',
};

export const CIRCLE_STATUS_LABEL: Record<CirclePostStatus, string> = {
  APPROVED: '공개 승인됨',
  PENDING: '승인 대기 중 (작성자 본인만 열람)',
  CHANGES_REQUESTED: '수정 요청됨',
};

export const PROGRAM_TYPE_LABEL: Record<ProgramType, string> = {
  AROMA_SELF_CARE: '아로마 셀프케어',
  MINDSET_SESSION: '마인드셋 세션',
  CIRCLE_GATHERING: '서클 소모임',
};

export const PROGRAM_MODE_LABEL: Record<ProgramMode, string> = {
  ONLINE: '온라인',
  OFFLINE: '오프라인',
};

export const PROGRAM_STATUS_LABEL: Record<ProgramStatus, string> = {
  OPEN: '모집 중 (수동 관리)',
  UPCOMING: '모집 예정',
  FULL: '정원 마감',
  CLOSED: '종료',
};

export function formatKrw(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`;
}
