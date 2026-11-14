export type ProductCategory = 'ROBE' | 'TEE' | 'KNIT' | 'BOTTOMS';

export type SellingStatus = 'COMING_SOON' | 'OPEN' | 'CLOSED';

export type ProductionStatus =
  | 'PLANNING'
  | 'YARN_SOURCING'
  | 'KNITTING'
  | 'FINISHING'
  | 'SHIPPING'
  | 'COMPLETED';

export interface ProductVariant {
  id: string;
  color: string;
  size: string;
  active: boolean;
}

export interface PreorderRound {
  id: string;
  title: string;
  opensAt: string;
  closesAt: string;
  expectedShipWindow: string;
  price: number;
  originalPrice?: number;
  shippingFee: string;
  sellingStatus: SellingStatus;
  productionStatus: ProductionStatus;
  externalStoreUrl: string | null;
  storeNote: string;
}

export interface ProductionUpdate {
  id: string;
  roundTitle: string;
  stage: string;
  title: string;
  body: string;
  confirmedAt: string;
  image?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  englishSubtitle: string;
  category: ProductCategory;
  pieceNumber?: string;
  summary: string;
  description: string;
  material: string;
  origin: string;
  fitInfo: string;
  careGuide: string[];
  policyNote: string;
  images: { src: string; alt: string }[];
  variants: ProductVariant[];
  rounds: PreorderRound[];
  productionUpdates: ProductionUpdate[];
  allowReorderInterest: boolean;
  relatedJournalSlug?: string;
}

export interface ArchiveEntry {
  pieceNumber: string;
  title: string;
  season: string;
  intent: string;
  story: string;
  materialSummary: string;
  image: string;
  imageAlt: string;
  relatedProductSlug?: string;
}

export type JournalKind = 'BRAND' | 'MAKING' | 'PEOPLE';

export interface JournalPost {
  id: string;
  slug: string;
  kind: JournalKind;
  title: string;
  subtitle: string;
  publishedAt: string;
  readTime: string;
  coverImage: string;
  coverAlt: string;
  excerpt: string;
  paragraphs: string[];
  pullQuote?: string;
  relatedProductSlug?: string;
}

export type MindsetKind = 'QUESTION' | 'NOTE' | 'SMALL_PRACTICE';

export interface MindsetPost {
  id: string;
  slug: string;
  kind: MindsetKind;
  title: string;
  publishedAt: string;
  summary: string;
  essay: string[];
  questions: string[];
  practiceTip?: string;
}

export type CircleCategory = 'MY_WARDROBE' | 'CARE_REPAIR' | 'REFLECTION' | 'LEAF_ASKS';

export type CirclePostStatus = 'APPROVED' | 'PENDING' | 'CHANGES_REQUESTED';

export interface CircleComment {
  id: string;
  postId: string;
  authorNickname: string;
  isBrandOfficial?: boolean;
  body: string;
  createdAt: string;
}

export interface CirclePost {
  id: string;
  authorNickname: string;
  authorId: string;
  authorType: 'MEMBER' | 'BRAND';
  category: CircleCategory;
  title: string;
  body: string;
  status: CirclePostStatus;
  relatedProductSlug?: string;
  image?: string;
  imageAlt?: string;
  createdAt: string;
}

export type ProgramType = 'AROMA_SELF_CARE' | 'MINDSET_SESSION' | 'CIRCLE_GATHERING';
export type ProgramMode = 'ONLINE' | 'OFFLINE';
export type ProgramStatus = 'UPCOMING' | 'OPEN' | 'FULL' | 'CLOSED';

export interface ExperienceProgram {
  id: string;
  slug: string;
  type: ProgramType;
  mode: ProgramMode;
  status: ProgramStatus;
  title: string;
  summary: string;
  description: string[];
  targetAudience: string;
  scheduleKst: string;
  locationText: string;
  hostName: string;
  capacityText: string;
  priceText: string;
  preparations: string;
  deadlineText: string;
  refundPolicy: string;
  bookingProvider: string;
  externalBookingUrl: string | null;
  image: string;
  imageAlt: string;
}

export interface ReorderInterest {
  id: string;
  memberId: string;
  productSlug: string;
  productName: string;
  variantId: string;
  color: string;
  size: string;
  createdAt: string;
}

export interface DemoUser {
  id: string;
  nickname: string;
  providerLabel: string;
  joinedAt: string;
}

export interface HeroContent {
  overline: string;
  headline: string;
  subcopy: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  desktopImage: string;
  alt: string;
}

export interface AboutValueItem {
  code: string;
  title: string;
  body: string;
}

export interface AboutContent {
  headline: string;
  intro: string;
  homeClosingHeadline: string;
  values: AboutValueItem[];
}

export interface SiteContentBundle {
  hero: HeroContent;
  about: AboutContent;
  products: Product[];
  archiveEntries: ArchiveEntry[];
  journalPosts: JournalPost[];
  mindsetPosts: MindsetPost[];
  experiencePrograms: ExperienceProgram[];
  circlePosts: CirclePost[];
}
