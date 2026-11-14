import {
  SiteSettings,
  MenuCategory,
  MenuItem,
  MenuAddOn,
  Branch,
  Offer,
  GalleryItem,
  Enquiry,
  AuditLog,
  AdminUser,
  TableReservation,
} from '../types';
import {
  INITIAL_SETTINGS,
  INITIAL_CATEGORIES,
  INITIAL_MENU_ITEMS,
  INITIAL_BRANCHES,
  INITIAL_OFFERS,
  INITIAL_GALLERY,
} from '../data/initialData';
import * as api from './api';

const STORAGE_KEYS = {
  SETTINGS: 'pillaiyarappa_settings_v2',
  CATEGORIES: 'pillaiyarappa_categories_v2',
  MENU_ITEMS: 'pillaiyarappa_menu_items_v2',
  ADDONS: 'pillaiyarappa_addons_v2',
  BRANCHES: 'pillaiyarappa_branches_v2',
  OFFERS: 'pillaiyarappa_offers_v2',
  GALLERY: 'pillaiyarappa_gallery_v2',
  ENQUIRIES: 'pillaiyarappa_enquiries_v2',
  AUDIT_LOGS: 'pillaiyarappa_audit_logs_v2',
  ADMIN_SESSION: 'pillaiyarappa_admin_session_v2',
  RESERVATIONS: 'pillaiyarappa_reservations_v2',
};

const DEFAULT_ADDONS: MenuAddOn[] = [
  {
    id: 'addon-butter',
    name: 'Amul Butter',
    price: 20,
    priceType: 'fixed',
    isAvailable: true,
    applicableCategories: ['all'],
    sortOrder: 1,
  },
  {
    id: 'addon-ghee',
    name: 'Pure Desi Ghee Topping',
    price: 30,
    priceType: 'fixed',
    isAvailable: true,
    applicableCategories: ['all'],
    sortOrder: 2,
  },
  {
    id: 'addon-gunpowder',
    name: 'Gunpowder (Podi) with Pure Ghee',
    price: 35,
    priceType: 'fixed',
    isAvailable: true,
    applicableCategories: ['all'],
    sortOrder: 3,
  },
  {
    id: 'addon-extra-sambar',
    name: 'Extra Sambar (Large Bowl)',
    price: 40,
    priceType: 'fixed',
    isAvailable: true,
    applicableCategories: ['all'],
    sortOrder: 4,
  },
  {
    id: 'addon-extra-chutney',
    name: 'Extra Coconut & Tomato Chutney',
    price: 30,
    priceType: 'fixed',
    isAvailable: true,
    applicableCategories: ['all'],
    sortOrder: 5,
  },
];

type Listener = () => void;
const listeners = new Set<Listener>();

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error('[Store] Listener error:', e);
    }
  });
}

export function subscribeToStore(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// LocalStorage helpers with safe fallbacks
function getStored<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.warn(`Error reading localStorage key ${key}:`, e);
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifyListeners();
  } catch (e) {
    console.warn(`Error writing to localStorage key ${key}:`, e);
  }
}

// Store API
export const appStore = {
  // Sync all data from persistent backend API
  async syncWithServer(): Promise<void> {
    try {
      const [categories, items, addons, settings, branches, offers] = await Promise.all([
        api.fetchPublicCategories().catch(() => null),
        api.fetchPublicMenuItems().catch(() => null),
        api.fetchPublicAddons().catch(() => null),
        api.fetchPublicSettings().catch(() => null),
        api.fetchPublicBranches().catch(() => null),
        api.fetchPublicOffers().catch(() => null),
      ]);

      if (categories && Array.isArray(categories)) {
        setStored(STORAGE_KEYS.CATEGORIES, categories);
      }
      if (items && Array.isArray(items)) {
        setStored(STORAGE_KEYS.MENU_ITEMS, items);
      }
      if (addons && Array.isArray(addons)) {
        setStored(STORAGE_KEYS.ADDONS, addons);
      }
      if (settings && settings.brandName) {
        setStored(STORAGE_KEYS.SETTINGS, settings);
      }
      if (branches && Array.isArray(branches)) {
        setStored(STORAGE_KEYS.BRANCHES, branches);
      }
      if (offers && Array.isArray(offers)) {
        setStored(STORAGE_KEYS.OFFERS, offers);
      }

      // Also sync audit logs and enquiries if admin is logged in
      if (this.getAdminSession()) {
        try {
          const [enquiries, logs] = await Promise.all([
            api.adminFetchEnquiries(),
            api.adminFetchAuditLogs(),
          ]);
          if (enquiries) setStored(STORAGE_KEYS.ENQUIRIES, enquiries);
          if (logs) setStored(STORAGE_KEYS.AUDIT_LOGS, logs);
        } catch (_) {}
      }

      notifyListeners();
    } catch (err) {
      console.warn('[Store] syncWithServer non-fatal error:', err);
    }
  },

  // Settings
  getSettings(): SiteSettings {
    const stored = getStored<SiteSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    const whatsapp =
      !stored.whatsappNumber || stored.whatsappNumber === '919899101195' || stored.whatsappNumber === '9899101195'
        ? '919953919033'
        : stored.whatsappNumber;

    const defaultText =
      stored.whatsappDefaultText && stored.whatsappDefaultText.trim().length > 0
        ? stored.whatsappDefaultText.trim()
        : INITIAL_SETTINGS.whatsappDefaultText;

    const instagram =
      !stored.instagramUrl || stored.instagramUrl === 'https://instagram.com'
        ? INITIAL_SETTINGS.instagramUrl
        : stored.instagramUrl;

    const email =
      !stored.contactEmail || stored.contactEmail === 'pillaiyarappa.gurugram@gmail.com'
        ? INITIAL_SETTINGS.contactEmail
        : stored.contactEmail;

    const swiggy =
      !stored.swiggyUrl || stored.swiggyUrl === 'https://www.swiggy.com/restaurants'
        ? INITIAL_SETTINGS.swiggyUrl
        : stored.swiggyUrl;

    const deliveryOfferText =
      !stored.deliveryOfferText ||
      stored.deliveryOfferText.toLowerCase().includes('across gurugram') ||
      stored.deliveryOfferText.includes('Free Home Delivery - Minimum Order') ||
      stored.deliveryOfferText.includes('Free Home Delivery (Min')
        ? INITIAL_SETTINGS.deliveryOfferText
        : stored.deliveryOfferText;

    return {
      ...INITIAL_SETTINGS,
      ...stored,
      whatsappNumber: whatsapp,
      whatsappDefaultText: defaultText,
      instagramUrl: instagram,
      contactEmail: email,
      swiggyUrl: swiggy,
      deliveryOfferText,
    };
  },
  async updateSettings(newSettings: Partial<SiteSettings>, actorName = 'Admin'): Promise<void> {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    setStored(STORAGE_KEYS.SETTINGS, updated);
    this.addAuditLog(actorName, 'UPDATE_SETTINGS', 'Updated site contact & delivery settings');

    // Async persist to server
    try {
      await api.adminUpdateSettings(newSettings);
    } catch (err) {
      console.error('[Store] Failed to persist settings to server:', err);
    }
  },

  // Categories
  getCategories(): MenuCategory[] {
    const stored = getStored<MenuCategory[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const list = Array.isArray(stored) && stored.length >= 10 ? stored : INITIAL_CATEGORIES;
    return list.map((cat) => {
      if (cat.id === 'cat-platter' && cat.image?.includes('1626777552726')) {
        return { ...cat, image: '/uploads/menu/menu-South_Indian_Breakfast_Thali-1792874072538-703231.png' };
      }
      return cat;
    });
  },
  async saveCategory(category: MenuCategory, actorName = 'Admin'): Promise<void> {
    const categories = this.getCategories();
    const index = categories.findIndex((c) => c.id === category.id);
    const isNew = index === -1;

    if (!isNew) {
      categories[index] = category;
      this.addAuditLog(actorName, 'UPDATE_CATEGORY', `Updated category: ${category.name}`);
    } else {
      categories.push(category);
      this.addAuditLog(actorName, 'CREATE_CATEGORY', `Created category: ${category.name}`);
    }
    setStored(STORAGE_KEYS.CATEGORIES, categories);

    // Async persist to server
    try {
      if (isNew) {
        await api.adminCreateCategory(category);
      } else {
        await api.adminUpdateCategory(category.id, category);
      }
    } catch (err) {
      console.error('[Store] Failed to persist category to server:', err);
    }
  },
  async deleteCategory(categoryId: string, actorName = 'Admin'): Promise<void> {
    const categories = this.getCategories().filter((c) => c.id !== categoryId);
    setStored(STORAGE_KEYS.CATEGORIES, categories);
    this.addAuditLog(actorName, 'DELETE_CATEGORY', `Deleted category ID ${categoryId}`);

    // Async persist to server
    try {
      await api.adminDeleteCategory(categoryId);
    } catch (err) {
      console.error('[Store] Failed to delete category on server:', err);
    }
  },
  async toggleCategoryActive(categoryId: string, actorName = 'Admin'): Promise<void> {
    const categories = this.getCategories();
    const cat = categories.find((c) => c.id === categoryId);
    if (cat) {
      cat.isActive = !cat.isActive;
      setStored(STORAGE_KEYS.CATEGORIES, categories);
      this.addAuditLog(
        actorName,
        'TOGGLE_CATEGORY',
        `Category "${cat.name}" visibility set to ${cat.isActive ? 'Active (Live)' : 'Hidden (Draft)'}`
      );

      // Async persist to server
      try {
        await api.adminUpdateCategory(categoryId, { isActive: cat.isActive });
      } catch (err) {
        console.error('[Store] Failed to persist category active status to server:', err);
      }
    }
  },

  // Menu Items
  getMenuItems(): MenuItem[] {
    const stored = getStored<MenuItem[]>(STORAGE_KEYS.MENU_ITEMS, INITIAL_MENU_ITEMS);
    const list = Array.isArray(stored) && stored.length > 0 ? stored : INITIAL_MENU_ITEMS;
    return list.map((item) => {
      let image = typeof item.image === 'string' ? item.image : '';
      if (item.id === 'item-vada-sambar-2pcs' || item.id === 'item-vada-sambar-1pc') {
        image = '/images/medu-vada.jpg';
      } else if (image.includes('1626777552726')) {
        if (item.id === 'item-dahi-vada-2pcs') image = '/uploads/menu/menu-Vibrant_Dahi_Vada_with_Pomegra-1792877232588-608262.png';
        else if (item.id === 'item-dal-vada-4pcs') image = '/uploads/menu/menu-Golden_South_Indian_Vada_Platt-1792877506889-94927.png';
        else if (item.id === 'item-platter-special') image = '/uploads/menu/menu-South_Indian_Breakfast_Thali-1792874072538-703231.png';
      }
      return {
        ...item,
        image,
      };
    });
  },
  async saveMenuItem(item: MenuItem, actorName = 'Admin'): Promise<void> {
    const items = this.getMenuItems();
    const index = items.findIndex((i) => i.id === item.id);
    const isNew = index === -1;

    if (!isNew) {
      items[index] = item;
      this.addAuditLog(actorName, 'UPDATE_MENU_ITEM', `Updated item: ${item.name} (₹${item.price})`);
    } else {
      items.push(item);
      this.addAuditLog(actorName, 'CREATE_MENU_ITEM', `Added item: ${item.name} (₹${item.price})`);
    }
    setStored(STORAGE_KEYS.MENU_ITEMS, items);

    // Async persist to server
    try {
      if (isNew) {
        const created = await api.adminCreateItem(item);
        if (created?.id && created.id !== item.id) {
          const fresh = this.getMenuItems().map((i) => (i.id === item.id ? created : i));
          setStored(STORAGE_KEYS.MENU_ITEMS, fresh);
        }
      } else {
        await api.adminUpdateItem(item.id, item);
      }
    } catch (err) {
      console.error('[Store] Failed to persist item to server:', err);
    }
  },
  async toggleItemAvailability(itemId: string, actorName = 'Admin'): Promise<void> {
    const items = this.getMenuItems();
    const item = items.find((i) => i.id === itemId);
    if (item) {
      item.isAvailable = !item.isAvailable;
      setStored(STORAGE_KEYS.MENU_ITEMS, items);
      this.addAuditLog(
        actorName,
        'TOGGLE_AVAILABILITY',
        `${item.name} set to ${item.isAvailable ? 'Available' : 'Sold Out'}`
      );

      // Async persist to server
      try {
        await api.adminToggleItemAvailability(itemId, item.isAvailable);
      } catch (err) {
        console.error('[Store] Failed to persist availability to server:', err);
      }
    }
  },
  async deleteMenuItem(itemId: string, actorName = 'Admin'): Promise<void> {
    const items = this.getMenuItems().filter((i) => i.id !== itemId);
    setStored(STORAGE_KEYS.MENU_ITEMS, items);
    this.addAuditLog(actorName, 'DELETE_MENU_ITEM', `Deleted menu item ID ${itemId}`);

    // Async persist to server
    try {
      await api.adminDeleteItem(itemId);
    } catch (err) {
      console.error('[Store] Failed to delete item on server:', err);
    }
  },

  // Add-ons
  getAddons(): MenuAddOn[] {
    return getStored<MenuAddOn[]>(STORAGE_KEYS.ADDONS, DEFAULT_ADDONS);
  },
  async saveAddon(addon: MenuAddOn, actorName = 'Admin'): Promise<void> {
    const addons = this.getAddons();
    const index = addons.findIndex((a) => a.id === addon.id);
    const isNew = index === -1;

    if (!isNew) {
      addons[index] = addon;
      this.addAuditLog(actorName, 'UPDATE_ADDON', `Updated add-on: ${addon.name} (₹${addon.price})`);
    } else {
      addons.push(addon);
      this.addAuditLog(actorName, 'CREATE_ADDON', `Created add-on: ${addon.name} (₹${addon.price})`);
    }
    setStored(STORAGE_KEYS.ADDONS, addons);

    try {
      if (isNew) {
        await api.adminCreateAddon(addon);
      } else {
        await api.adminUpdateAddon(addon.id, addon);
      }
    } catch (err) {
      console.error('[Store] Failed to persist addon to server:', err);
    }
  },
  async deleteAddon(addonId: string, actorName = 'Admin'): Promise<void> {
    const addons = this.getAddons().filter((a) => a.id !== addonId);
    setStored(STORAGE_KEYS.ADDONS, addons);
    this.addAuditLog(actorName, 'DELETE_ADDON', `Deleted add-on ID ${addonId}`);

    try {
      await api.adminDeleteAddon(addonId);
    } catch (err) {
      console.error('[Store] Failed to delete addon on server:', err);
    }
  },

  // Branches
  getBranches(): Branch[] {
    const branches = getStored<Branch[]>(STORAGE_KEYS.BRANCHES, INITIAL_BRANCHES);
    return branches.map((b) => {
      const initial = INITIAL_BRANCHES.find((ib) => ib.id === b.id || ib.slug === b.slug);
      const isSouthCity = b.id === 'branch-1' || b.slug === 'south-city-1';
      const isBranch2 = b.id === 'branch-2' || b.slug === 'sec-40-huda-market';
      return {
        ...b,
        image: isSouthCity && (!b.image || b.image.includes('unsplash'))
          ? (initial?.image || '/images/branch-1/branch1-storefront.jpg')
          : (isBranch2 && (!b.image || b.image.includes('unsplash')) ? (initial?.image || '/images/branch-2/branch2-storefront.jpg') : b.image),
        gallery: isSouthCity
          ? (b.gallery && b.gallery.length > 0 && !b.gallery[0].image.includes('unsplash') ? b.gallery : initial?.gallery)
          : (isBranch2
            ? (initial?.gallery || []).filter((item) => !item.image?.includes('onion-uttapam') && !item.image?.includes('rava-dosa') && item.id !== 'b2-img-rava-dosa')
            : b.gallery),
        openingHours: '10:00 AM – 10:00 PM (All 7 Days)',
        zomatoUrl: b.zomatoUrl || initial?.zomatoUrl || 'https://zomato.onelink.me/xqzv/gj35mxzd',
        swiggyUrl: isSouthCity ? (b.swiggyUrl || initial?.swiggyUrl) : undefined,
      };
    });
  },
  saveBranch(branch: Branch, actorName = 'Admin'): void {
    const branches = this.getBranches();
    const index = branches.findIndex((b) => b.id === branch.id);
    if (index >= 0) {
      branches[index] = branch;
      this.addAuditLog(actorName, 'UPDATE_BRANCH', `Updated branch: ${branch.name}`);
    } else {
      branches.push(branch);
      this.addAuditLog(actorName, 'CREATE_BRANCH', `Added branch: ${branch.name}`);
    }
    setStored(STORAGE_KEYS.BRANCHES, branches);
  },

  // Offers
  getOffers(): Offer[] {
    const raw = getStored<Offer[]>(STORAGE_KEYS.OFFERS, INITIAL_OFFERS);
    if (!Array.isArray(raw) || raw.length === 0) return INITIAL_OFFERS;
    return raw.map((offer) => {
      if (
        offer.id === 'offer-1' &&
        (offer.title === 'Free Home Delivery' ||
          offer.description?.includes('across Gurugram') ||
          offer.title.includes('across Gurugram'))
      ) {
        return INITIAL_OFFERS[0];
      }
      return offer;
    });
  },
  saveOffer(offer: Offer, actorName = 'Admin'): void {
    const offers = this.getOffers();
    const index = offers.findIndex((o) => o.id === offer.id);
    if (index >= 0) {
      offers[index] = offer;
    } else {
      offers.push(offer);
    }
    setStored(STORAGE_KEYS.OFFERS, offers);
    this.addAuditLog(actorName, 'UPDATE_OFFER', `Saved offer: ${offer.title}`);
  },

  // Gallery
  getGallery(): GalleryItem[] {
    const rawStored = getStored<GalleryItem[]>(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
    const stored = rawStored
      .filter(
        (item) =>
          item.id !== 'gal-b2-onion-uttapam' &&
          item.id !== 'gal-b2-rava-dosa' &&
          !item.image?.includes('onion-uttapam') &&
          !item.image?.includes('rava-dosa')
      )
      .map((item) => {
        if (item.id === 'gal-3') {
          return {
            ...item,
            image: '/images/medu-vada.jpg',
            alt: 'Crispy golden Medu Vada dipped in hot aromatic sambar with coconut chutney',
          };
        }
        return item;
      });
    // Ensure all fresh initial items (such as the real Branch 2 photos) are available
    const existingIds = new Set(stored.map((item) => item.id));
    const missingInitials = INITIAL_GALLERY.filter((item) => !existingIds.has(item.id));
    if (missingInitials.length > 0 || stored.length !== rawStored.length) {
      const merged = [...missingInitials, ...stored];
      setStored(STORAGE_KEYS.GALLERY, merged);
      return merged;
    }
    return stored;
  },
  addGalleryItem(item: GalleryItem, actorName = 'Admin'): void {
    const items = this.getGallery();
    items.unshift(item);
    setStored(STORAGE_KEYS.GALLERY, items);
    this.addAuditLog(actorName, 'ADD_GALLERY_IMAGE', `Added image: ${item.title}`);
  },
  deleteGalleryItem(id: string, actorName = 'Admin'): void {
    const items = this.getGallery().filter((i) => i.id !== id);
    setStored(STORAGE_KEYS.GALLERY, items);
    this.addAuditLog(actorName, 'DELETE_GALLERY_IMAGE', `Deleted gallery item ${id}`);
  },

  // Enquiries
  getEnquiries(): Enquiry[] {
    return getStored<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, []);
  },
  addEnquiry(enquiryData: Omit<Enquiry, 'id' | 'createdAt' | 'status'>): Enquiry {
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    const newEnquiry: Enquiry = {
      ...enquiryData,
      id: `enq-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      status: 'new',
      synced: isOnline,
    };
    const enquiries = this.getEnquiries();
    enquiries.unshift(newEnquiry);
    setStored(STORAGE_KEYS.ENQUIRIES, enquiries);
    this.addAuditLog('System', 'NEW_ENQUIRY', `Received enquiry from ${newEnquiry.name} (${newEnquiry.phone})`);

    // Async persist to server
    api.submitPublicEnquiry(newEnquiry).catch((err) => {
      console.warn('[Store] Failed to submit enquiry to server:', err);
    });

    return newEnquiry;
  },
  updateEnquiryStatus(id: string, status: Enquiry['status'], actorName = 'Admin'): void {
    const enquiries = this.getEnquiries();
    const item = enquiries.find((e) => e.id === id);
    if (item) {
      item.status = status;
      setStored(STORAGE_KEYS.ENQUIRIES, enquiries);
      this.addAuditLog(actorName, 'ENQUIRY_STATUS_CHANGE', `Enquiry ${id} status set to ${status}`);
      api.adminUpdateEnquiry(id, { status }).catch(() => {});
    }
  },
  updateEnquiryNotes(id: string, notes: string, actorName = 'Admin'): void {
    const enquiries = this.getEnquiries();
    const item = enquiries.find((e) => e.id === id);
    if (item) {
      item.adminNotes = notes;
      setStored(STORAGE_KEYS.ENQUIRIES, enquiries);
      this.addAuditLog(actorName, 'ENQUIRY_NOTE_UPDATED', `Updated note on enquiry ${id}`);
      api.adminUpdateEnquiry(id, { adminNotes: notes }).catch(() => {});
    }
  },
  deleteEnquiry(id: string, actorName = 'Admin'): void {
    const enquiries = this.getEnquiries().filter((e) => e.id !== id);
    setStored(STORAGE_KEYS.ENQUIRIES, enquiries);
    this.addAuditLog(actorName, 'DELETE_ENQUIRY', `Removed enquiry ${id}`);
  },

  syncOfflineEnquiries(): number {
    const enquiries = this.getEnquiries();
    let count = 0;
    enquiries.forEach((enq) => {
      if (!enq.synced) {
        enq.synced = true;
        count++;
        api.submitPublicEnquiry(enq).catch(() => {});
      }
    });
    if (count > 0) {
      setStored(STORAGE_KEYS.ENQUIRIES, enquiries);
      this.addAuditLog('SyncService', 'OFFLINE_SYNC', `Synced ${count} offline enquiries to server database`);
    }
    return count;
  },

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    return getStored<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, [
      {
        id: 'log-1',
        actor: 'System Bootstrap',
        action: 'BOOTSTRAP',
        details: 'Initial Pillaiyarappa store initialized with verified business details.',
        timestamp: new Date().toISOString(),
      },
    ]);
  },
  addAuditLog(actor: string, action: string, details: string): void {
    const logs = this.getAuditLogs();
    logs.unshift({
      id: `log-${Date.now()}-${Math.floor(Math.random() * 100)}`,
      actor,
      action,
      details,
      timestamp: new Date().toISOString(),
    });
    if (logs.length > 150) logs.pop();
    setStored(STORAGE_KEYS.AUDIT_LOGS, logs);
  },

  // Admin Session
  getAdminSession(): AdminUser | null {
    return getStored<AdminUser | null>(STORAGE_KEYS.ADMIN_SESSION, null);
  },
  setAdminSession(user: AdminUser | null): void {
    setStored(STORAGE_KEYS.ADMIN_SESSION, user);
    if (user) {
      this.addAuditLog(user.name, 'LOGIN', `Admin logged in (${user.email})`);
    } else {
      this.addAuditLog('Admin', 'LOGOUT', 'Admin session terminated');
    }
  },

  // Table Reservations
  getReservations(): TableReservation[] {
    return getStored<TableReservation[]>(STORAGE_KEYS.RESERVATIONS, []);
  },
  async submitReservation(data: Omit<TableReservation, 'id' | 'createdAt' | 'status'>): Promise<TableReservation> {
    const newRes: TableReservation = {
      ...data,
      id: `res-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    const reservations = this.getReservations();
    reservations.unshift(newRes);
    setStored(STORAGE_KEYS.RESERVATIONS, reservations);
    this.addAuditLog('System', 'NEW_RESERVATION', `Table reservation by ${newRes.name} (${newRes.phone}) for ${newRes.guests} guests on ${newRes.date}`);

    // Async persist to server
    try {
      const serverRes = await api.submitTableReservation(data);
      if (serverRes?.id) {
        const updated = this.getReservations().map((r) => (r.id === newRes.id ? serverRes : r));
        setStored(STORAGE_KEYS.RESERVATIONS, updated);
      }
    } catch (err) {
      console.error('[Store] Failed to submit reservation to server:', err);
    }

    return newRes;
  },
  async fetchReservationsFromServer(): Promise<TableReservation[]> {
    try {
      const reservations = await api.adminFetchReservations();
      if (reservations && Array.isArray(reservations)) {
        setStored(STORAGE_KEYS.RESERVATIONS, reservations);
      }
      return reservations;
    } catch (err) {
      console.warn('[Store] Failed to fetch reservations from server:', err);
      return this.getReservations();
    }
  },
  async updateReservationStatus(id: string, status: TableReservation['status'], adminNotes?: string, actorName = 'Admin'): Promise<void> {
    const reservations = this.getReservations();
    const res = reservations.find((r) => r.id === id);
    if (res) {
      res.status = status;
      if (adminNotes !== undefined) res.adminNotes = adminNotes;
      res.updatedAt = new Date().toISOString();
      setStored(STORAGE_KEYS.RESERVATIONS, reservations);
      this.addAuditLog(actorName, 'RESERVATION_STATUS_CHANGE', `Reservation ${id} status changed to ${status}`);

      try {
        await api.adminUpdateReservation(id, { status, adminNotes });
      } catch (err) {
        console.error('[Store] Failed to update reservation on server:', err);
      }
    }
  },
};

// Auto-trigger background server sync on startup in browser
if (typeof window !== 'undefined') {
  setTimeout(() => {
    appStore.syncWithServer();
  }, 100);
}
