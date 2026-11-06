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

export type ReservationStatus = 'pending' | 'confirmed' | 'declined' | 'completed' | 'cancelled' | 'no-show';

export interface TableReservation {
  id: string;
  branchId: string;
  branchSlug: string;
  name: string;
  phone: string;
  email?: string;
  guests: number;
  date: string;        // YYYY-MM-DD
  time: string;        // HH:mm
  specialRequests?: string;
  status: ReservationStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface DatabaseSchema {
  categories: MenuCategory[];
  menuItems: MenuItem[];
  addons: MenuAddOn[];
  settings: SiteSettings;
  branches: any[];
  offers: any[];
  gallery: any[];
  enquiries: any[];
  tableReservations: TableReservation[];
  auditLogs: any[];
  meta: {
    version: number;
    lastUpdated: string;
  };
}
