export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  priceType?: 'fixed' | 'mrp';
  isVeg: boolean;
  isBestseller: boolean;
  isAvailable: boolean;
  image?: string;
  sortOrder: number;
  applicableAddonIds?: string[];
}

export interface MenuAddOn {
  id: string;
  name: string;
  price: number;
  priceType?: 'fixed' | 'mrp';
  isAvailable: boolean;
  applicableCategories: string[];
  sortOrder: number;
}

export interface BranchGalleryItem {
  id: string;
  image: string;
  title: string;
  subtitle?: string;
  tag?: string;
  objectPosition?: string;
}

export interface Branch {
  id: string;
  slug: string;
  name: string;
  address: string;
  phone: string;
  secondaryPhone?: string;
  mapUrl: string;
  embedUrl?: string;
  image: string;
  gallery?: BranchGalleryItem[];
  openingHours?: string;
  isActive: boolean;
  sortOrder: number;
  zomatoUrl?: string;
  swiggyUrl?: string;
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  phonePrimary: string;
  phoneSecondary: string;
  whatsappNumber: string;
  whatsappDefaultText: string;
  deliveryOfferText: string;
  deliveryMinOrder: number;
  cateringLine: string;
  zomatoUrl: string;
  swiggyUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  contactEmail: string;
  seoTitle: string;
  seoDescription: string;
  announcementText?: string;
  announcementActive?: boolean;
}

export type EnquiryType = 'catering' | 'contact' | 'callback';
export type EnquiryStatus = 'new' | 'contacted' | 'confirmed' | 'completed' | 'cancelled' | 'spam';

export interface Enquiry {
  id: string;
  type: EnquiryType;
  name: string;
  phone: string;
  email?: string;
  eventType?: string;
  guestCount?: number;
  eventDate?: string;
  preferredBranch?: string;
  message: string;
  status: EnquiryStatus;
  adminNotes?: string;
  createdAt: string;
  synced?: boolean;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  badge?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  image: string;
  category: 'food' | 'restaurant';
  alt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'editor';
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  details: string;
  timestamp: string;
}

export type ReservationStatus = 'pending' | 'confirmed' | 'declined' | 'completed' | 'cancelled' | 'no-show';

export interface TableReservation {
  id: string;
  branchId: string;
  branchSlug: string;
  name: string;
  phone: string;
  email?: string;
  guests: number;
  date: string;
  time: string;
  specialRequests?: string;
  status: ReservationStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt?: string;
}
