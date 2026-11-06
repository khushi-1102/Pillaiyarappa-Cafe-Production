import {
  MenuCategory,
  MenuItem,
  MenuAddOn,
  SiteSettings,
  Branch,
  Offer,
  Enquiry,
  AuditLog,
  AdminUser,
  TableReservation,
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL
  ? `${(import.meta.env.VITE_API_URL as string).replace(/\/+$/, '')}/api`
  : '/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!res.ok) {
      let errorMessage = `HTTP error ${res.status}`;
      try {
        const errorJson = await res.json();
        if (errorJson.error) errorMessage = errorJson.error;
      } catch (_) {}
      throw new Error(errorMessage);
    }

    return await res.json();
  } catch (err: any) {
    console.error(`[API Error] ${options?.method || 'GET'} ${url}:`, err);
    throw err;
  }
}

// --- PUBLIC API ---

export async function fetchPublicCategories(): Promise<MenuCategory[]> {
  const res = await request<{ success: boolean; data: MenuCategory[] }>('/menu/categories');
  return res.data;
}

export async function fetchPublicMenuItems(params?: {
  category?: string;
  search?: string;
  veg?: boolean;
}): Promise<MenuItem[]> {
  const query = new URLSearchParams();
  if (params?.category && params.category !== 'all') query.set('category', params.category);
  if (params?.search) query.set('search', params.search);
  if (params?.veg) query.set('veg', 'true');

  const qs = query.toString();
  const endpoint = `/menu/items${qs ? `?${qs}` : ''}`;
  const res = await request<{ success: boolean; data: MenuItem[] }>(endpoint);
  return res.data;
}

export async function fetchPublicAddons(category?: string): Promise<MenuAddOn[]> {
  const endpoint = category ? `/menu/addons?category=${encodeURIComponent(category)}` : '/menu/addons';
  const res = await request<{ success: boolean; data: MenuAddOn[] }>(endpoint);
  return res.data;
}

export async function fetchPublicSettings(): Promise<SiteSettings> {
  const res = await request<{ success: boolean; data: SiteSettings }>('/menu/settings');
  return res.data;
}

export async function fetchPublicBranches(): Promise<Branch[]> {
  const res = await request<{ success: boolean; data: Branch[] }>('/menu/branches');
  return res.data;
}

export async function fetchPublicOffers(): Promise<Offer[]> {
  const res = await request<{ success: boolean; data: Offer[] }>('/menu/offers');
  return res.data;
}

export async function submitPublicEnquiry(data: Partial<Enquiry>): Promise<Enquiry> {
  const res = await request<{ success: boolean; data: Enquiry }>('/admin/enquiries', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.data;
}

// --- ADMIN API ---

export async function adminLogin(
  email: string,
  pass: string
): Promise<{ success: boolean; user: AdminUser; token: string }> {
  return await request('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password: pass }),
  });
}

export async function adminFetchItems(category?: string): Promise<MenuItem[]> {
  const endpoint = category && category !== 'all' ? `/admin/menu/items?category=${category}` : '/admin/menu/items';
  const res = await request<{ success: boolean; data: MenuItem[] }>(endpoint);
  return res.data;
}

export async function adminCreateItem(item: Partial<MenuItem>): Promise<MenuItem> {
  const res = await request<{ success: boolean; data: MenuItem }>('/admin/menu/items', {
    method: 'POST',
    body: JSON.stringify(item),
  });
  return res.data;
}

export async function adminUpdateItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem> {
  const res = await request<{ success: boolean; data: MenuItem }>(`/admin/menu/items/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
  return res.data;
}

export async function adminToggleItemAvailability(id: string, isAvailable?: boolean): Promise<MenuItem> {
  const res = await request<{ success: boolean; data: MenuItem }>(`/admin/menu/items/${id}/toggle-available`, {
    method: 'PATCH',
    body: isAvailable !== undefined ? JSON.stringify({ isAvailable }) : undefined,
  });
  return res.data;
}

export async function adminDeleteItem(id: string): Promise<boolean> {
  const res = await request<{ success: boolean; message: string }>(`/admin/menu/items/${id}`, {
    method: 'DELETE',
  });
  return res.success;
}

export async function adminFetchCategories(): Promise<MenuCategory[]> {
  const res = await request<{ success: boolean; data: MenuCategory[] }>('/admin/menu/categories');
  return res.data;
}

export async function adminCreateCategory(cat: Partial<MenuCategory>): Promise<MenuCategory> {
  const res = await request<{ success: boolean; data: MenuCategory }>('/admin/menu/categories', {
    method: 'POST',
    body: JSON.stringify(cat),
  });
  return res.data;
}

export async function adminUpdateCategory(id: string, updates: Partial<MenuCategory>): Promise<MenuCategory> {
  const res = await request<{ success: boolean; data: MenuCategory }>(`/admin/menu/categories/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
  return res.data;
}

export async function adminDeleteCategory(id: string): Promise<boolean> {
  const res = await request<{ success: boolean; message: string }>(`/admin/menu/categories/${id}`, {
    method: 'DELETE',
  });
  return res.success;
}

export async function adminFetchAddons(): Promise<MenuAddOn[]> {
  const res = await request<{ success: boolean; data: MenuAddOn[] }>('/admin/menu/addons');
  return res.data;
}

export async function adminCreateAddon(addon: Partial<MenuAddOn>): Promise<MenuAddOn> {
  const res = await request<{ success: boolean; data: MenuAddOn }>('/admin/menu/addons', {
    method: 'POST',
    body: JSON.stringify(addon),
  });
  return res.data;
}

export async function adminUpdateAddon(id: string, updates: Partial<MenuAddOn>): Promise<MenuAddOn> {
  const res = await request<{ success: boolean; data: MenuAddOn }>(`/admin/menu/addons/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
  return res.data;
}

export async function adminDeleteAddon(id: string): Promise<boolean> {
  const res = await request<{ success: boolean; message: string }>(`/admin/menu/addons/${id}`, {
    method: 'DELETE',
  });
  return res.success;
}

export async function adminFetchSettings(): Promise<SiteSettings> {
  const res = await request<{ success: boolean; data: SiteSettings }>('/admin/settings');
  return res.data;
}

export async function adminUpdateSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
  const res = await request<{ success: boolean; data: SiteSettings }>('/admin/settings', {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
  return res.data;
}

export async function adminFetchEnquiries(): Promise<Enquiry[]> {
  const res = await request<{ success: boolean; data: Enquiry[] }>('/admin/enquiries');
  return res.data;
}

export async function adminUpdateEnquiry(id: string, updates: any): Promise<Enquiry> {
  const res = await request<{ success: boolean; data: Enquiry }>(`/admin/enquiries/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
  return res.data;
}

export async function adminFetchAuditLogs(): Promise<AuditLog[]> {
  const res = await request<{ success: boolean; data: AuditLog[] }>('/admin/audit-logs');
  return res.data;
}

export async function adminResetDatabase(): Promise<boolean> {
  const res = await request<{ success: boolean; message: string }>('/admin/reset', {
    method: 'POST',
  });
  return res.success;
}

// --- TABLE RESERVATIONS ---

export async function submitTableReservation(data: Partial<TableReservation>): Promise<TableReservation> {
  const res = await request<{ success: boolean; data: TableReservation }>('/menu/reservations', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function adminFetchReservations(params?: {
  branch?: string;
  status?: string;
  date?: string;
}): Promise<TableReservation[]> {
  const query = new URLSearchParams();
  if (params?.branch) query.set('branch', params.branch);
  if (params?.status) query.set('status', params.status);
  if (params?.date) query.set('date', params.date);
  const qs = query.toString();
  const endpoint = `/admin/reservations${qs ? `?${qs}` : ''}`;
  const res = await request<{ success: boolean; data: TableReservation[] }>(endpoint);
  return res.data;
}

export async function adminUpdateReservation(id: string, updates: Partial<TableReservation>): Promise<TableReservation> {
  const res = await request<{ success: boolean; data: TableReservation }>(`/admin/reservations/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
  return res.data;
}

// --- PHOTO UPLOAD & MANAGEMENT API ---

export async function adminUploadMenuImage(file: File): Promise<{ success: boolean; url: string; filename: string }> {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch('/api/admin/menu/upload-image', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    let errorMessage = `Upload failed with status ${res.status}`;
    try {
      const errorJson = await res.json();
      if (errorJson.error) errorMessage = errorJson.error;
    } catch (_) {}
    throw new Error(errorMessage);
  }

  return await res.json();
}

export async function adminDeleteMenuImage(url: string): Promise<boolean> {
  try {
    const res = await request<{ success: boolean }>('/admin/menu/delete-image', {
      method: 'DELETE',
      body: JSON.stringify({ url }),
    });
    return res.success;
  } catch (err) {
    console.warn('[API] Could not delete image from disk:', err);
    return false;
  }
}

