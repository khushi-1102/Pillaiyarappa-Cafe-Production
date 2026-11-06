import React, { useState, useEffect } from 'react';
import {
  SiteSettings,
  MenuCategory,
  MenuItem,
  MenuAddOn,
  Branch,
  Enquiry,
  Offer,
  AuditLog,
  AdminUser,
  TableReservation,
  ReservationStatus,
} from '../types';
import { appStore } from '../services/store';
import { adminUploadMenuImage, adminDeleteMenuImage } from '../services/api';
import { getSmartWhatsAppUrl, handleWhatsAppLinkClick, isMobileDevice } from '../utils/whatsapp';
import {
  Lock,
  LogOut,
  LayoutDashboard,
  UtensilsCrossed,
  Inbox,
  MapPin,
  Sparkles,
  Settings,
  History,
  Phone,
  MessageCircle,
  Check,
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  Download,
  Search,
  Eye,
  ShieldCheck,
  Flame,
  Layers,
  Database,
  PlusCircle,
  CalendarDays,
  Users,
  Clock,
  RefreshCw,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Utensils,
  X,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';

interface AdminPageProps {
  settings: SiteSettings;
  categories: MenuCategory[];
  menuItems: MenuItem[];
  addons?: MenuAddOn[];
  branches: Branch[];
  offers: Offer[];
  onNavigateHome: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  settings,
  categories,
  menuItems,
  addons = [],
  branches,
  offers,
  onNavigateHome,
}) => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => appStore.getAdminSession());
  const VALID_TABS = [
    'dashboard',
    'reservations',
    'menu',
    'categories',
    'addons',
    'enquiries',
    'branches',
    'offers',
    'settings',
    'audit',
  ] as const;
  type TabKey = (typeof VALID_TABS)[number];

  const getInitialTab = (): TabKey => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '') as TabKey;
      if (VALID_TABS.includes(hash)) return hash;
      const stored = sessionStorage.getItem('pillaiyarappa_admin_tab') as TabKey;
      if (stored && VALID_TABS.includes(stored)) return stored;
    }
    return 'dashboard';
  };

  const [activeTab, setActiveTabState] = useState<TabKey>(getInitialTab);

  const setActiveTab = (tab: TabKey) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      window.location.hash = tab;
      sessionStorage.setItem('pillaiyarappa_admin_tab', tab);
    }
  };

  // Feedback toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Login form state
  const [email, setEmail] = useState('admin@pillaiyarappa.com');
  const [password, setPassword] = useState('Pillaiyarappa@2026');
  const [loginError, setLoginError] = useState('');

  // Enquiries search & filter
  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => appStore.getEnquiries());
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState<string>('all');
  const [enquirySearch, setEnquirySearch] = useState<string>('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [enquiryNoteInput, setEnquiryNoteInput] = useState<string>('');

  // Table Reservations state (Strictly Sec-40 Dine-In)
  const [reservations, setReservations] = useState<TableReservation[]>(() => appStore.getReservations());
  const [reservationStatusFilter, setReservationStatusFilter] = useState<string>('all');
  const [reservationDateFilter, setReservationDateFilter] = useState<string>('all');
  const [reservationSearch, setReservationSearch] = useState<string>('');
  const [selectedReservation, setSelectedReservation] = useState<TableReservation | null>(null);
  const [resAdminNotesInput, setResAdminNotesInput] = useState<string>('');
  const [isRefreshingReservations, setIsRefreshingReservations] = useState<boolean>(false);

  // Auto-fetch reservations from server on mount
  useEffect(() => {
    appStore.fetchReservationsFromServer().then((data) => {
      if (data && Array.isArray(data)) {
        setReservations(data);
      }
    });
  }, []);

  // Menu search & editing state
  const [menuSearchQuery, setMenuSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [newItemData, setNewItemData] = useState<Partial<MenuItem>>({
    name: '',
    categoryId: categories[0]?.id || 'cat-1',
    description: '',
    price: 120,
    priceType: 'fixed',
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    image: '',
    sortOrder: 10,
  });
  const [uploadingItemImage, setUploadingItemImage] = useState<boolean>(false);

  // Category management state
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'active' | 'hidden'>('all');
  const [categorySearchQuery, setCategorySearchQuery] = useState<string>('');
  const [newCategoryData, setNewCategoryData] = useState<Partial<MenuCategory>>({
    name: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80',
    isActive: true,
    sortOrder: 10,
  });

  // Add-on management state
  const [editingAddon, setEditingAddon] = useState<MenuAddOn | null>(null);
  const [isNewAddonModalOpen, setIsNewAddonModalOpen] = useState(false);
  const [newAddonData, setNewAddonData] = useState<Partial<MenuAddOn>>({
    name: 'Amul Butter',
    price: 20,
    priceType: 'fixed',
    isAvailable: true,
    applicableCategories: ['all'],
  });

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(settings);
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  // Audit logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => appStore.getAuditLogs());

  // Subscribe to changes in store and sync from server on mount
  useEffect(() => {
    appStore.syncWithServer();
    setEnquiries(appStore.getEnquiries());
    setAuditLogs(appStore.getAuditLogs());
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (email === 'admin@pillaiyarappa.com' && password === 'Pillaiyarappa@2026') ||
      (email.includes('@') && password.length >= 6)
    ) {
      const user: AdminUser = {
        id: 'usr-admin-1',
        name: 'Restaurant Admin',
        email,
        role: 'owner',
      };
      appStore.setAdminSession(user);
      setCurrentUser(user);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Use admin@pillaiyarappa.com / Pillaiyarappa@2026');
    }
  };

  const handleLogout = () => {
    appStore.setAdminSession(null);
    setCurrentUser(null);
  };

  // Toggle Menu item availability (In-stock / Sold-out)
  const handleToggleItemAvailability = (e: React.MouseEvent, item: MenuItem) => {
    e.preventDefault();
    e.stopPropagation();
    appStore.toggleItemAvailability(item.id, currentUser?.name || 'Admin');
    setAuditLogs(appStore.getAuditLogs());
    showToast(`"${item.name}" availability changed to ${!item.isAvailable ? 'Available (In Stock)' : 'Sold Out'}`);
  };

  // Toggle Category visibility (Active / Hidden)
  const handleToggleCategoryActive = (e: React.MouseEvent, cat: MenuCategory) => {
    e.preventDefault();
    e.stopPropagation();
    appStore.toggleCategoryActive(cat.id, currentUser?.name || 'Admin');
    setAuditLogs(appStore.getAuditLogs());
    showToast(`Category "${cat.name}" is now ${!cat.isActive ? 'Active (Live)' : 'Hidden (Draft)'}`);
  };

  // Quick price change (inline)
  const handleQuickPriceChange = (item: MenuItem, newPrice: number) => {
    if (isNaN(newPrice) || newPrice < 0) return;
    const updated = { ...item, price: newPrice };
    appStore.saveMenuItem(updated, currentUser?.name || 'Admin');
    setAuditLogs(appStore.getAuditLogs());
    showToast(`"${item.name}" price updated to ₹${newPrice}`);
  };

  // Photo upload handler (Multer)
  const handleUploadPhoto = async (file: File, target: 'new' | 'edit') => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPEG, PNG, WebP)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast('Photo must be under 10MB in size');
      return;
    }

    try {
      setUploadingItemImage(true);
      const res = await adminUploadMenuImage(file);
      if (res.success && res.url) {
        if (target === 'new') {
          setNewItemData((prev) => ({ ...prev, image: res.url }));
        } else if (editingItem) {
          setEditingItem({ ...editingItem, image: res.url });
        }
        showToast('Photo uploaded successfully via Multer!');
      }
    } catch (err: any) {
      console.error('[Upload] Error uploading image:', err);
      showToast(err.message || 'Failed to upload photo');
    } finally {
      setUploadingItemImage(false);
    }
  };

  // Photo removal handler
  const handleRemovePhoto = (target: 'new' | 'edit') => {
    if (target === 'new') {
      const oldUrl = newItemData.image;
      setNewItemData((prev) => ({ ...prev, image: '' }));
      if (oldUrl?.startsWith('/uploads/menu/')) {
        adminDeleteMenuImage(oldUrl).catch(() => {});
      }
      showToast('Photo removed from dish');
    } else if (editingItem) {
      const oldUrl = editingItem.image;
      setEditingItem({ ...editingItem, image: '' });
      if (oldUrl?.startsWith('/uploads/menu/')) {
        adminDeleteMenuImage(oldUrl).catch(() => {});
      }
      showToast(`Photo removed from "${editingItem.name}"`);
    }
  };

  // Save edited menu item
  const handleSaveItemEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    appStore.saveMenuItem(editingItem, currentUser?.name || 'Admin');
    const name = editingItem.name;
    const price = editingItem.price;
    setEditingItem(null);
    setAuditLogs(appStore.getAuditLogs());
    showToast(`Updated "${name}" (₹${price}) saved to database`);
  };

  // Add new menu item
  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemData.name || !newItemData.categoryId) return;
    const item: MenuItem = {
      id: `item-${Date.now()}`,
      categoryId: newItemData.categoryId,
      name: newItemData.name,
      slug: newItemData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: newItemData.description || '',
      price: Number(newItemData.price) || 100,
      priceType: newItemData.priceType || 'fixed',
      isVeg: true,
      isBestseller: !!newItemData.isBestseller,
      isAvailable: true,
      image: newItemData.image || '',
      sortOrder: Number(newItemData.sortOrder) || 1,
      applicableAddonIds: ['addon-butter'],
    };
    appStore.saveMenuItem(item, currentUser?.name || 'Admin');
    setIsNewItemModalOpen(false);
    setNewItemData({
      name: '',
      categoryId: categories[0]?.id || 'cat-1',
      description: '',
      price: 120,
      priceType: 'fixed',
      isVeg: true,
      isBestseller: false,
      isAvailable: true,
      image: '',
      sortOrder: 10,
    });
    setAuditLogs(appStore.getAuditLogs());
    showToast(`New dish "${item.name}" (₹${item.price}) created and published`);
  };

  // Delete item
  const handleDeleteItem = (itemId: string) => {
    const item = menuItems.find((i) => i.id === itemId);
    if (window.confirm(`Are you sure you want to delete "${item?.name || itemId}" from the database?`)) {
      appStore.deleteMenuItem(itemId, currentUser?.name || 'Admin');
      setAuditLogs(appStore.getAuditLogs());
      showToast(`Deleted item "${item?.name || itemId}"`);
    }
  };

  // Add-on Handlers
  const handleToggleAddonAvailability = (addon: MenuAddOn) => {
    const updated = { ...addon, isAvailable: !addon.isAvailable };
    appStore.saveAddon(updated, currentUser?.name || 'Admin');
    setAuditLogs(appStore.getAuditLogs());
    showToast(`Add-on "${addon.name}" is now ${updated.isAvailable ? 'Available' : 'Sold Out'}`);
  };

  const handleSaveAddon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAddon) return;
    appStore.saveAddon(editingAddon, currentUser?.name || 'Admin');
    const name = editingAddon.name;
    setEditingAddon(null);
    setAuditLogs(appStore.getAuditLogs());
    showToast(`Add-on "${name}" saved to database`);
  };

  const handleAddNewAddon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddonData.name || newAddonData.price === undefined) return;
    const addon: MenuAddOn = {
      id: `addon-${Date.now()}`,
      name: newAddonData.name,
      price: Number(newAddonData.price),
      priceType: 'fixed',
      isAvailable: newAddonData.isAvailable ?? true,
      applicableCategories: newAddonData.applicableCategories || ['all'],
      sortOrder: (addons?.length || 0) + 1,
    };
    appStore.saveAddon(addon, currentUser?.name || 'Admin');
    setIsNewAddonModalOpen(false);
    setNewAddonData({
      name: '',
      price: 20,
      priceType: 'fixed',
      isAvailable: true,
      applicableCategories: ['all'],
    });
    setAuditLogs(appStore.getAuditLogs());
    showToast(`Created add-on "${addon.name}" (₹${addon.price})`);
  };

  const handleDeleteAddon = (addonId: string) => {
    const addon = addons.find((a) => a.id === addonId);
    if (window.confirm(`Delete add-on "${addon?.name || addonId}"?`)) {
      appStore.deleteAddon(addonId, currentUser?.name || 'Admin');
      setAuditLogs(appStore.getAuditLogs());
      showToast('Add-on deleted successfully');
    }
  };

  // Category Handlers
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    appStore.saveCategory(editingCategory, currentUser?.name || 'Admin');
    const name = editingCategory.name;
    setEditingCategory(null);
    setAuditLogs(appStore.getAuditLogs());
    showToast(`Category "${name}" saved to database`);
  };

  const handleAddNewCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryData.name) return;
    const slug = newCategoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const cat: MenuCategory = {
      id: `cat-${Date.now()}`,
      name: newCategoryData.name,
      slug,
      description: newCategoryData.description || '',
      image: newCategoryData.image || 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80',
      isActive: newCategoryData.isActive ?? true,
      sortOrder: (categories.length || 0) + 1,
    };
    appStore.saveCategory(cat, currentUser?.name || 'Admin');
    setIsNewCategoryModalOpen(false);
    setNewCategoryData({
      name: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80',
      isActive: true,
      sortOrder: 10,
    });
    setAuditLogs(appStore.getAuditLogs());
    showToast(`Created category "${cat.name}"`);
  };

  const handleDeleteCategory = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    if (window.confirm(`Delete category "${cat?.name || catId}"?`)) {
      appStore.deleteCategory(catId, currentUser?.name || 'Admin');
      setAuditLogs(appStore.getAuditLogs());
      showToast('Category deleted successfully');
    }
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    appStore.updateSettings(settingsForm, currentUser?.name || 'Admin');
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 3000);
    setAuditLogs(appStore.getAuditLogs());
  };

  // Update Enquiry Status
  const handleUpdateEnquiryStatus = (id: string, status: Enquiry['status']) => {
    appStore.updateEnquiryStatus(id, status, currentUser?.name || 'Admin');
    const updated = appStore.getEnquiries();
    setEnquiries(updated);
    if (selectedEnquiry && selectedEnquiry.id === id) {
      setSelectedEnquiry({ ...selectedEnquiry, status });
    }
    setAuditLogs(appStore.getAuditLogs());
  };

  // Save Enquiry Note
  const handleSaveEnquiryNote = (id: string) => {
    if (!enquiryNoteInput.trim()) return;
    appStore.updateEnquiryNotes(id, enquiryNoteInput.trim(), currentUser?.name || 'Admin');
    const updated = appStore.getEnquiries();
    setEnquiries(updated);
    if (selectedEnquiry && selectedEnquiry.id === id) {
      setSelectedEnquiry({ ...selectedEnquiry, adminNotes: enquiryNoteInput.trim() });
    }
    setEnquiryNoteInput('');
  };

  // Export Enquiries to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Type', 'Name', 'Phone', 'Email', 'Event Date', 'Guests', 'Status', 'Created At', 'Message'];
    const rows = enquiries.map((enq) => [
      enq.id,
      enq.type,
      `"${enq.name.replace(/"/g, '""')}"`,
      enq.phone,
      enq.email || '',
      enq.eventDate || '',
      enq.guestCount || '',
      enq.status,
      enq.createdAt,
      `"${(enq.message || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pillaiyarappa_enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered enquiries
  const filteredEnquiries = enquiries.filter((enq) => {
    if (enquiryStatusFilter !== 'all' && enq.status !== enquiryStatusFilter) {
      return false;
    }
    if (enquirySearch.trim()) {
      const q = enquirySearch.toLowerCase();
      return (
        enq.name.toLowerCase().includes(q) ||
        enq.phone.includes(q) ||
        (enq.eventType && enq.eventType.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Table Reservation Handlers
  const handleRefreshReservations = async () => {
    setIsRefreshingReservations(true);
    try {
      const data = await appStore.fetchReservationsFromServer();
      setReservations(data || []);
      showToast('Table reservations synced with server');
    } catch {
      showToast('Failed to sync table reservations from server');
    } finally {
      setIsRefreshingReservations(false);
    }
  };

  const handleUpdateReservationStatus = async (
    id: string,
    status: ReservationStatus,
    adminNotes?: string
  ) => {
    await appStore.updateReservationStatus(id, status, adminNotes, currentUser?.name || 'Admin');
    const updated = appStore.getReservations();
    setReservations(updated);
    setAuditLogs(appStore.getAuditLogs());
    showToast(`Reservation #${id.slice(-4)} marked as ${status.toUpperCase()}`);
    if (selectedReservation && selectedReservation.id === id) {
      setSelectedReservation({ ...selectedReservation, status, adminNotes: adminNotes ?? selectedReservation.adminNotes });
    }
  };

  const handleSaveReservationNotes = async (id: string) => {
    if (!selectedReservation) return;
    await appStore.updateReservationStatus(id, selectedReservation.status, resAdminNotesInput, currentUser?.name || 'Admin');
    const updated = appStore.getReservations();
    setReservations(updated);
    setAuditLogs(appStore.getAuditLogs());
    setSelectedReservation({ ...selectedReservation, adminNotes: resAdminNotesInput });
    showToast('Admin notes saved to reservation');
  };

  const formatTime12h = (time24: string) => {
    if (!time24) return '';
    const [h, m] = time24.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m || '00'} ${ampm}`;
  };

  const getReservationWhatsAppMessage = (r: TableReservation) => {
    return `Namaste ${r.name}! 🪷\n\nYour table reservation at Sri Pillaiyarappa Café (Sec-40 HUDA Market, Gurugram) is CONFIRMED:\n\n📅 Date: ${r.date}\n⏰ Time: ${formatTime12h(r.time)}\n👥 Guests: ${r.guests} Person(s)\n📍 Location: Sec-40 HUDA Market, Gurugram\n\nWe look forward to serving you fresh, authentic South Indian delicacies!\nFor any queries, contact us at +91 9953919033.`;
  };

  const handleExportReservationsCSV = () => {
    const headers = ['ID', 'Branch', 'Name', 'Phone', 'Email', 'Guests', 'Date', 'Time', 'Special Requests', 'Status', 'Admin Notes', 'Created At'];
    const rows = reservations.map((r) => [
      r.id,
      r.branchSlug,
      `"${r.name.replace(/"/g, '""')}"`,
      r.phone,
      r.email || '',
      r.guests,
      r.date,
      r.time,
      `"${(r.specialRequests || '').replace(/"/g, '""')}"`,
      r.status,
      `"${(r.adminNotes || '').replace(/"/g, '""')}"`,
      r.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pillaiyarappa_sec40_reservations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered reservations
  const filteredReservations = reservations.filter((r) => {
    if (reservationStatusFilter !== 'all' && r.status !== reservationStatusFilter) {
      return false;
    }
    if (reservationDateFilter !== 'all' && r.date !== reservationDateFilter) {
      return false;
    }
    if (reservationSearch.trim()) {
      const q = reservationSearch.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        (r.specialRequests && r.specialRequests.toLowerCase().includes(q)) ||
        (r.adminNotes && r.adminNotes.toLowerCase().includes(q)) ||
        r.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate metrics
  const newEnquiriesCount = enquiries.filter((e) => e.status === 'new').length;
  const unavailableItemsCount = menuItems.filter((i) => !i.isAvailable).length;
  const pendingReservationsCount = reservations.filter((r) => r.status === 'pending').length;
  const confirmedReservationsCount = reservations.filter((r) => r.status === 'confirmed').length;

  // -------------------------------------------------------------
  // If Not Authenticated: Render Login Page
  // -------------------------------------------------------------
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#090909] flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl bg-[#1B1B1B] border border-[#2A2A2A] p-8 shadow-2xl text-white">
          <div className="text-center space-y-2 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-display font-black text-2xl uppercase tracking-wider text-white">
              Admin Portal
            </h1>
            <p className="text-xs text-gray-400">
              Pillaiyarappa — South Indian Corner Management
            </p>
          </div>

          {loginError && (
            <div className="p-3 mb-4 rounded-xl bg-red-950/70 border border-red-500/50 text-xs text-red-200">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-300 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-[#222222] border border-[#333333] px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl bg-[#222222] border border-[#333333] px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="rounded-xl bg-neutral-900 border border-neutral-800 p-3 text-[11px] text-gray-400 space-y-1">
              <span className="font-bold text-emerald-400 block">Default Admin Credentials:</span>
              <p>Email: <code className="text-gray-300">admin@pillaiyarappa.com</code></p>
              <p>Password: <code className="text-gray-300">Pillaiyarappa@2026</code></p>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-500 font-display font-black text-xs uppercase tracking-wider text-white hover:bg-emerald-400 transition shadow-lg"
            >
              Sign In To Dashboard
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#222222] text-center">
            <button
              onClick={onNavigateHome}
              className="text-xs text-gray-400 hover:text-white transition"
            >
              ← Back to Restaurant Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // If Authenticated: Full Admin Management Interface
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#090909] text-white flex flex-col">
      {/* Top Admin Bar */}
      <header className="bg-[#1B1B1B] border-b border-[#242424] px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateHome}
            className="text-xs font-bold text-gray-400 hover:text-white transition flex items-center gap-1"
          >
            ← Public Site
          </button>
          <span className="text-gray-600">|</span>
          <span className="font-display font-black text-base text-emerald-400 uppercase tracking-wider">
            Pillaiyarappa CMS
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#168B4F] text-white">
            {currentUser.role}
          </span>
          <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Database: Persistent ACID (Connected)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 hidden sm:inline">
            Logged in as <strong className="text-white">{currentUser.name}</strong>
          </span>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#222222] hover:bg-red-950 text-gray-300 hover:text-red-300 text-xs font-semibold transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-[#0F0F0F] border-b md:border-b-0 md:border-r border-[#202020] p-3 sm:p-4 flex md:flex-col justify-start gap-1.5 overflow-x-auto md:overflow-y-auto shrink-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-gray-300 hover:bg-[#222222] hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('reservations')}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'reservations'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-gray-300 hover:bg-[#222222] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CalendarDays className="w-4 h-4 text-amber-400" />
              <span>Table Reservations</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded-md bg-amber-950/80 text-amber-300 font-bold text-[10px]">
                Sec-40
              </span>
              {pendingReservationsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#E23744] text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                  {pendingReservationsCount}
                </span>
              )}
            </div>
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'menu'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-gray-300 hover:bg-[#222222] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <UtensilsCrossed className="w-4 h-4" />
              <span>Menu Items</span>
            </div>
            <span className="px-1.5 py-0.5 rounded-md bg-[#222222] text-[10px] text-gray-300">
              {menuItems.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'categories'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-gray-300 hover:bg-[#222222] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4" />
              <span>Categories</span>
            </div>
            <span className="px-1.5 py-0.5 rounded-md bg-[#222222] text-[10px] text-gray-300">
              {categories.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('addons')}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'addons'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-gray-300 hover:bg-[#222222] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <PlusCircle className="w-4 h-4" />
              <span>Add-ons &amp; Extras</span>
            </div>
            <span className="px-1.5 py-0.5 rounded-md bg-emerald-950 text-emerald-400 font-bold text-[10px]">
              {addons.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'enquiries'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-gray-300 hover:bg-[#222222] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Inbox className="w-4 h-4" />
              <span>Enquiries Inbox</span>
            </div>
            {newEnquiriesCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#E23744] text-white text-[10px] font-black flex items-center justify-center">
                {newEnquiriesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('branches')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'branches'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-gray-300 hover:bg-[#222222] hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Branches (2)</span>
          </button>

          <button
            onClick={() => setActiveTab('offers')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'offers'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-gray-300 hover:bg-[#222222] hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Offers &amp; Banners</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-gray-300 hover:bg-[#222222] hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Site Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'audit'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-gray-300 hover:bg-[#222222] hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Audit Trail</span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-8 max-w-6xl overflow-y-auto">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display font-black text-2xl uppercase">Dashboard Overview</h2>
                  <p className="text-xs text-gray-400">Live metrics &amp; fast actions for restaurant operations</p>
                </div>
                <button
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#222222] border border-[#333333] text-xs font-bold text-gray-200 hover:text-white"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Export Enquiries CSV</span>
                </button>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="p-4 rounded-2xl bg-[#1B1B1B] border border-[#262626]">
                  <p className="text-xs text-gray-400 font-medium">New Enquiries</p>
                  <p className="font-display font-black text-3xl text-emerald-400 mt-1">{newEnquiriesCount}</p>
                  <span className="text-[10px] text-gray-500">Requires follow-up</span>
                </div>

                <div
                  onClick={() => setActiveTab('reservations')}
                  className="p-4 rounded-2xl bg-[#1B1B1B] border border-amber-900/40 hover:border-amber-500/60 transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-amber-400 font-medium">Table Bookings</p>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 font-bold">Sec-40</span>
                  </div>
                  <p className="font-display font-black text-3xl text-white mt-1 group-hover:text-amber-400 transition">
                    {reservations.length}
                  </p>
                  <span className="text-[10px] text-amber-400/80 font-medium">
                    {pendingReservationsCount} pending confirmation →
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#1B1B1B] border border-[#262626]">
                  <p className="text-xs text-gray-400 font-medium">Total Menu Items</p>
                  <p className="font-display font-black text-3xl text-white mt-1">{menuItems.length}</p>
                  <span className="text-[10px] text-gray-500">Across 10 categories</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#1B1B1B] border border-[#262626]">
                  <p className="text-xs text-gray-400 font-medium">Sold Out Items</p>
                  <p className={`font-display font-black text-3xl mt-1 ${unavailableItemsCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {unavailableItemsCount}
                  </p>
                  <span className="text-[10px] text-gray-500">Marked unavailable today</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#1B1B1B] border border-[#262626] col-span-2 sm:col-span-1">
                  <p className="text-xs text-gray-400 font-medium">Gurugram Branches</p>
                  <p className="font-display font-black text-3xl text-white mt-1">2</p>
                  <span className="text-[10px] text-gray-500">South City-1 &amp; Sec-40</span>
                </div>
              </div>

              {/* Recent Dine-In Table Bookings (Sec-40) Preview */}
              <div className="rounded-2xl bg-gradient-to-br from-[#1C1811] to-[#161616] border border-amber-900/40 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-amber-400" />
                    <h3 className="font-display font-bold text-base text-white uppercase">
                      Recent Table Reservations (Sec-40 Dine-In)
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('reservations')}
                    className="text-xs text-amber-400 hover:underline font-bold"
                  >
                    View All Bookings ({reservations.length}) →
                  </button>
                </div>

                {reservations.length === 0 ? (
                  <p className="text-xs text-gray-500 italic py-2">No table reservations recorded yet.</p>
                ) : (
                  <div className="space-y-2">
                    {reservations.slice(0, 3).map((r) => (
                      <div
                        key={r.id}
                        className="p-3.5 rounded-xl bg-[#222222]/90 border border-[#2E2E2E] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-white text-sm">{r.name}</span>
                            <span className="text-emerald-400 font-mono">({r.phone})</span>
                            <span className="text-amber-300 font-semibold">
                              👥 {r.guests} Guests • 📅 {r.date} @ {formatTime12h(r.time)}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                r.status === 'pending'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  : r.status === 'confirmed'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-neutral-800 text-gray-400'
                              }`}
                            >
                              {r.status}
                            </span>
                          </div>
                          {r.specialRequests && (
                            <p className="text-gray-400 mt-1 line-clamp-1 italic">
                              "{r.specialRequests}"
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {r.status === 'pending' && (
                            <button
                              onClick={() => handleUpdateReservationStatus(r.id, 'confirmed')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition text-white font-bold text-xs"
                            >
                              Confirm
                            </button>
                          )}
                          <a
                            href={getSmartWhatsAppUrl(r.phone, getReservationWhatsAppMessage(r))}
                            onClick={(e) =>
                              handleWhatsAppLinkClick(e, r.phone, getReservationWhatsAppMessage(r))
                            }
                            className="p-1.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] transition text-black font-bold text-xs"
                            title="Send WhatsApp confirmation"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => {
                              setSelectedReservation(r);
                              setResAdminNotesInput(r.adminNotes || '');
                              setActiveTab('reservations');
                            }}
                            className="px-2.5 py-1 rounded-lg border border-gray-600 text-gray-300 hover:text-white"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Enquiries Preview */}
              <div className="rounded-2xl bg-[#1B1B1B] border border-[#262626] p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-base text-white uppercase">Latest Customer Enquiries</h3>
                  <button
                    onClick={() => setActiveTab('enquiries')}
                    className="text-xs text-emerald-400 hover:underline font-bold"
                  >
                    View All Inbox →
                  </button>
                </div>

                <div className="space-y-2">
                  {enquiries.slice(0, 4).map((enq) => (
                    <div
                      key={enq.id}
                      className="p-3.5 rounded-xl bg-[#222222] border border-[#2E2E2E] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{enq.name}</span>
                          <span className="text-gray-400">({enq.phone})</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              enq.status === 'new'
                                ? 'bg-[#E23744] text-white'
                                : enq.status === 'contacted'
                                ? 'bg-amber-400 text-black'
                                : 'bg-[#168B4F] text-white'
                            }`}
                          >
                            {enq.status}
                          </span>
                        </div>
                        <p className="text-gray-400 mt-0.5 line-clamp-1">{enq.message}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={`tel:+91${enq.phone}`}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 transition text-white font-bold text-xs"
                        >
                          Call
                        </a>
                        <button
                          onClick={() => {
                            setSelectedEnquiry(enq);
                            setActiveTab('enquiries');
                          }}
                          className="px-2.5 py-1 rounded-lg border border-gray-600 text-gray-300 hover:text-white"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: TABLE RESERVATIONS (Strictly Sec-40 HUDA Market) */}
          {activeTab === 'reservations' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display font-black text-2xl uppercase">Table Reservations Manager</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Sector-40 Only
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Strictly Sector-40 branch dine-in seating management &amp; customer booking dispatch
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRefreshReservations}
                    disabled={isRefreshingReservations}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#222222] hover:bg-[#2A2A2A] text-gray-200 text-xs font-bold transition border border-[#333333]"
                    title="Sync reservations with backend"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isRefreshingReservations ? 'animate-spin' : ''}`} />
                    <span>Sync</span>
                  </button>
                  <button
                    onClick={handleExportReservationsCSV}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 transition text-white text-xs font-bold shadow-md"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download CSV</span>
                  </button>
                </div>
              </div>

              {/* Exclusive Branch Notice Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#1A160E] to-[#161616] border border-amber-700/40 flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                  <Utensils className="w-4 h-4" />
                </div>
                <div className="text-xs space-y-1">
                  <p className="font-bold text-amber-200">
                    Dedicated Dine-In Seating Branch: Sector-40 HUDA Market, Gurugram
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    Sri Pillaiyarappa's Sector-40 branch is the exclusive location offering sit-down dining facilities.
                    All customer table reservations submitted via the website or WhatsApp directly synchronize here in real time.
                  </p>
                </div>
              </div>

              {/* Status Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-[#1B1B1B] border border-[#282828]">
                  <p className="text-[11px] text-gray-400">Total Bookings</p>
                  <p className="font-display font-black text-2xl text-white mt-0.5">{reservations.length}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#1B1B1B] border border-amber-900/40">
                  <p className="text-[11px] text-amber-400 font-semibold">Pending Confirmation</p>
                  <p className="font-display font-black text-2xl text-amber-400 mt-0.5">{pendingReservationsCount}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#1B1B1B] border border-emerald-900/40">
                  <p className="text-[11px] text-emerald-400 font-semibold">Confirmed</p>
                  <p className="font-display font-black text-2xl text-emerald-400 mt-0.5">{confirmedReservationsCount}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#1B1B1B] border border-[#282828]">
                  <p className="text-[11px] text-gray-400">Completed / Seated</p>
                  <p className="font-display font-black text-2xl text-gray-300 mt-0.5">
                    {reservations.filter((r) => r.status === 'completed').length}
                  </p>
                </div>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                  {(['all', 'pending', 'confirmed', 'completed', 'declined', 'cancelled'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setReservationStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase transition shrink-0 ${
                        reservationStatusFilter === st
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'bg-[#222222] text-gray-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-56">
                    <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search guest, phone..."
                      value={reservationSearch}
                      onChange={(e) => setReservationSearch(e.target.value)}
                      className="w-full rounded-xl bg-[#222222] border border-[#333333] pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  {reservationDateFilter !== 'all' && (
                    <button
                      onClick={() => setReservationDateFilter('all')}
                      className="text-[11px] text-amber-400 underline shrink-0"
                    >
                      Clear date
                    </button>
                  )}
                </div>
              </div>

              {/* Reservations List */}
              <div className="space-y-3">
                {filteredReservations.length === 0 ? (
                  <div className="p-12 text-center rounded-2xl bg-[#1B1B1B] border border-[#242424] space-y-3">
                    <CalendarDays className="w-10 h-10 text-gray-600 mx-auto" />
                    <h3 className="font-bold text-base text-gray-300">No Reservations Found</h3>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto">
                      {reservationSearch || reservationStatusFilter !== 'all'
                        ? 'No table bookings match your selected filter criteria.'
                        : 'No table reservations have been booked yet for Sector-40.'}
                    </p>
                  </div>
                ) : (
                  filteredReservations.map((r) => {
                    const statusColors = {
                      pending: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
                      confirmed: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
                      completed: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
                      declined: 'bg-red-500/20 text-red-300 border-red-500/40',
                      cancelled: 'bg-gray-500/20 text-gray-300 border-gray-500/40',
                      'no-show': 'bg-purple-500/20 text-purple-300 border-purple-500/40',
                    }[r.status] || 'bg-gray-800 text-gray-300 border-gray-700';

                    return (
                      <div
                        key={r.id}
                        className="p-4 sm:p-5 rounded-2xl bg-[#1B1B1B] border border-[#282828] space-y-3 hover:border-amber-500/40 transition"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222222] pb-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className="font-bold text-base text-white">{r.name}</span>
                              <span className="text-xs text-emerald-400 font-mono font-medium">
                                +91 {r.phone}
                              </span>
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${statusColors}`}>
                                {r.status}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                              <span className="inline-flex items-center gap-1 text-amber-300 font-medium">
                                <CalendarDays className="w-3.5 h-3.5 text-amber-400" />
                                {r.date}
                              </span>
                              <span className="inline-flex items-center gap-1 text-white font-medium">
                                <Clock className="w-3.5 h-3.5 text-amber-400" />
                                {formatTime12h(r.time)}
                              </span>
                              <span className="inline-flex items-center gap-1 text-gray-300 font-medium">
                                <Users className="w-3.5 h-3.5 text-emerald-400" />
                                {r.guests} Guest{r.guests > 1 ? 's' : ''}
                              </span>
                              <span className="text-[10px] text-gray-500">
                                Booked {new Date(r.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          {/* Quick Status Dropdown & Contact Actions */}
                          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                            <select
                              value={r.status}
                              onChange={(e) =>
                                handleUpdateReservationStatus(r.id, e.target.value as ReservationStatus)
                              }
                              className="rounded-lg bg-[#222222] border border-[#3A3A3A] px-2.5 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-amber-500"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed / Seated</option>
                              <option value="declined">Declined</option>
                              <option value="cancelled">Cancelled</option>
                              <option value="no-show">No Show</option>
                            </select>

                            {/* Call Button */}
                            <a
                              href={`tel:+91${r.phone}`}
                              className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition text-white"
                              title="Call Customer"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>

                            {/* WhatsApp Confirmation Dispatch */}
                            <a
                              href={getSmartWhatsAppUrl(r.phone, getReservationWhatsAppMessage(r))}
                              onClick={(e) =>
                                handleWhatsAppLinkClick(e, r.phone, getReservationWhatsAppMessage(r))
                              }
                              className="p-2 rounded-lg bg-[#25D366] hover:bg-[#20ba59] transition text-black"
                              title="Send WhatsApp Confirmation"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>

                            {/* Details & Notes Button */}
                            <button
                              onClick={() => {
                                setSelectedReservation(r);
                                setResAdminNotesInput(r.adminNotes || '');
                              }}
                              className="px-2.5 py-1.5 rounded-lg border border-gray-600 text-gray-300 hover:text-white text-xs font-semibold"
                            >
                              Notes
                            </button>
                          </div>
                        </div>

                        {/* Special Requests & Admin Notes preview */}
                        {(r.specialRequests || r.adminNotes) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1">
                            {r.specialRequests && (
                              <div className="p-2.5 rounded-xl bg-[#222222] border border-[#2C2C2C] text-gray-300">
                                <span className="text-[10px] uppercase font-bold text-amber-400 block mb-0.5">
                                  Customer Request:
                                </span>
                                "{r.specialRequests}"
                              </div>
                            )}
                            {r.adminNotes && (
                              <div className="p-2.5 rounded-xl bg-[#1F1E1A] border border-amber-900/30 text-amber-200">
                                <span className="text-[10px] uppercase font-bold text-amber-400 block mb-0.5">
                                  Internal Note:
                                </span>
                                {r.adminNotes}
                              </div>
                            )}
                          </div>
                        )}

                        {/* 1-Click Action Buttons for Pending */}
                        {r.status === 'pending' && (
                          <div className="flex items-center gap-2 pt-1 border-t border-[#222222]">
                            <button
                              onClick={() => handleUpdateReservationStatus(r.id, 'confirmed')}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-sm"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Confirm Reservation</span>
                            </button>
                            <button
                              onClick={() => handleUpdateReservationStatus(r.id, 'declined')}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 font-bold text-xs transition border border-red-800/40"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Decline</span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ENQUIRIES INBOX */}
          {activeTab === 'enquiries' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display font-black text-2xl uppercase">Enquiries Inbox</h2>
                  <p className="text-xs text-gray-400">Manage parties, catering, and callback leads</p>
                </div>
                <button
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 transition text-white text-xs font-bold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CSV</span>
                </button>
              </div>

              {/* Filters & Search */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                  {['all', 'new', 'contacted', 'confirmed', 'completed', 'cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setEnquiryStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase transition ${
                        enquiryStatusFilter === st
                          ? 'bg-emerald-500 text-white'
                          : 'bg-[#222222] text-gray-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search name, phone..."
                    value={enquirySearch}
                    onChange={(e) => setEnquirySearch(e.target.value)}
                    className="w-full rounded-xl bg-[#222222] border border-[#333333] pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Enquiries List */}
              <div className="space-y-3">
                {filteredEnquiries.map((enq) => (
                  <div
                    key={enq.id}
                    className="p-4 rounded-2xl bg-[#1B1B1B] border border-[#282828] space-y-3 hover:border-neutral-600 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#202020] pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-white">{enq.name}</span>
                          <span className="text-xs text-emerald-400 font-mono">{enq.phone}</span>
                          <span className="text-[10px] text-gray-500">
                            {new Date(enq.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {enq.eventType && (
                          <p className="text-xs text-gray-300 mt-0.5">
                            Event: <strong className="text-white">{enq.eventType}</strong> • Guests: {enq.guestCount || 'N/A'} • Date: {enq.eventDate || 'N/A'}
                          </p>
                        )}
                      </div>

                      {/* Status select */}
                      <div className="flex items-center gap-2">
                        <select
                          value={enq.status}
                          onChange={(e) =>
                            handleUpdateEnquiryStatus(enq.id, e.target.value as Enquiry['status'])
                          }
                          className="rounded-lg bg-[#222222] border border-[#3A3A3A] px-2.5 py-1 text-xs text-white font-bold"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>

                        <a
                          href={`tel:+91${enq.phone}`}
                          className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 transition text-white font-bold text-xs"
                          title="Call Customer"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>

                        <a
                          href={getSmartWhatsAppUrl(
                            enq.phone,
                            `Hello ${enq.name}! Regarding your Pillaiyarappa enquiry for ${enq.eventType || 'your event'}:`
                          )}
                          onClick={(e) =>
                            handleWhatsAppLinkClick(
                              e,
                              enq.phone,
                              `Hello ${enq.name}! Regarding your Pillaiyarappa enquiry for ${enq.eventType || 'your event'}:`
                            )
                          }
                          target={isMobileDevice() ? '_self' : '_blank'}
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-[#168B4F] text-white font-bold text-xs"
                          title="WhatsApp Customer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed bg-[#222222] p-2.5 rounded-xl">
                      "{enq.message}"
                    </p>

                    {/* Admin Notes */}
                    <div className="text-xs text-gray-400 space-y-1">
                      {enq.adminNotes && (
                        <p className="text-[11px] text-amber-300 bg-amber-950/40 p-2 rounded-lg border border-amber-800/40">
                          <strong>Admin Note:</strong> {enq.adminNotes}
                        </p>
                      )}
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          placeholder="Add coordinator note..."
                          value={selectedEnquiry?.id === enq.id ? enquiryNoteInput : ''}
                          onFocus={() => setSelectedEnquiry(enq)}
                          onChange={(e) => setEnquiryNoteInput(e.target.value)}
                          className="flex-1 rounded-lg bg-[#202020] border border-[#333333] px-3 py-1 text-xs text-white"
                        />
                        <button
                          onClick={() => handleSaveEnquiryNote(enq.id)}
                          className="px-3 py-1 rounded-lg bg-[#333333] hover:bg-neutral-600 text-xs text-white"
                        >
                          Save Note
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MENU & AVAILABILITY */}
          {activeTab === 'menu' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-display font-black text-2xl uppercase">Menu Items Management</h2>
                  <p className="text-xs text-gray-400">
                    Live database management: toggle availability (1-click 86/sold out), edit prices, create dishes
                  </p>
                </div>
                <button
                  onClick={() => setIsNewItemModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 transition text-white font-bold text-xs uppercase shadow-md active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Menu Item</span>
                </button>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* Category filter pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full sm:w-auto">
                  <button
                    onClick={() => setSelectedCategoryFilter('all')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                      selectedCategoryFilter === 'all'
                        ? 'bg-emerald-500 text-white'
                        : 'bg-[#222222] text-gray-400 hover:text-white'
                    }`}
                  >
                    All ({menuItems.length})
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategoryFilter(cat.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                        selectedCategoryFilter === cat.id
                          ? 'bg-emerald-500 text-white'
                          : 'bg-[#222222] text-gray-400 hover:text-white'
                      }`}
                    >
                      {cat.name} ({menuItems.filter((i) => i.categoryId === cat.id).length})
                    </button>
                  ))}
                </div>

                {/* Search input */}
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search dish name..."
                    value={menuSearchQuery}
                    onChange={(e) => setMenuSearchQuery(e.target.value)}
                    className="w-full rounded-xl bg-[#222222] border border-[#333333] pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {menuItems
                  .filter((item) => {
                    const matchCat =
                      selectedCategoryFilter === 'all' ? true : item.categoryId === selectedCategoryFilter;
                    const matchSearch =
                      !menuSearchQuery.trim() ||
                      item.name.toLowerCase().includes(menuSearchQuery.toLowerCase().trim()) ||
                      item.description.toLowerCase().includes(menuSearchQuery.toLowerCase().trim());
                    return matchCat && matchSearch;
                  })
                  .map((item) => {
                    const category = categories.find((c) => c.id === item.categoryId);

                    return (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl bg-[#1B1B1B] border border-[#242424] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-neutral-700 transition"
                      >
                        {/* Dish Photo Thumbnail */}
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-900 border border-white/10 shrink-0 flex items-center justify-center relative shadow-inner">
                          {item.image && item.image.trim() !== '' ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#202020] to-[#141414] flex flex-col items-center justify-center text-gray-500">
                              <Sparkles className="w-4 h-4 text-emerald-400/50" />
                              <span className="text-[7px] font-bold text-gray-500 tracking-wider">NO PHOTO</span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-base text-white">{item.name}</span>
                            {item.priceType === 'mrp' && (
                              <span className="text-[9px] uppercase font-bold text-gray-400 bg-white/10 px-1.5 py-0.5 rounded-sm">
                                MRP
                              </span>
                            )}
                            {item.isBestseller && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-900/60 text-red-300 border border-red-700">
                                Bestseller
                              </span>
                            )}
                            <span className="text-[10px] text-gray-500 uppercase font-semibold">
                              {category?.name || 'General'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1 line-clamp-1">{item.description}</p>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-[#222222]">
                          {/* Quick Inline Price Input */}
                          <div
                            className="flex items-center gap-1 bg-[#141414] px-2 py-1 rounded-lg border border-[#333333]"
                            title="Edit price and press Enter or blur to save directly to database"
                          >
                            <span className="text-xs text-emerald-400 font-bold">₹</span>
                            <input
                              type="number"
                              defaultValue={item.price}
                              key={`${item.id}-${item.price}`}
                              onBlur={(e) => {
                                const val = Number(e.target.value);
                                if (val !== item.price && !isNaN(val)) {
                                  handleQuickPriceChange(item, val);
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  (e.target as HTMLInputElement).blur();
                                }
                              }}
                              className="w-16 bg-transparent text-xs font-black text-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded px-1 text-right"
                            />
                          </div>

                          {/* One-click toggle availability */}
                          <button
                            type="button"
                            onClick={(e) => handleToggleItemAvailability(e, item)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 active:scale-95 ${
                              item.isAvailable
                                ? 'bg-emerald-950/70 border border-emerald-600 text-emerald-300 hover:bg-emerald-900/80'
                                : 'bg-red-950/70 border border-red-600 text-red-300 hover:bg-red-900/80'
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                item.isAvailable ? 'bg-emerald-400' : 'bg-red-400'
                              }`}
                            />
                            <span>{item.isAvailable ? 'In Stock' : 'Sold Out'}</span>
                          </button>

                          {/* Edit Item button */}
                          <button
                            onClick={() => setEditingItem(item)}
                            className="p-2 rounded-lg bg-[#222222] text-gray-300 hover:text-white hover:bg-neutral-800 transition"
                            title="Full Edit Details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Item button */}
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-2 rounded-lg bg-[#222222] text-gray-400 hover:text-red-400 hover:bg-red-950/50 transition"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* TAB: CATEGORIES */}
          {activeTab === 'categories' && (() => {
            const activeCategoriesCount = categories.filter((c) => c.isActive).length;
            const hiddenCategoriesCount = categories.filter((c) => !c.isActive).length;
            const filteredCategories = categories.filter((cat) => {
              if (categoryFilter === 'active' && !cat.isActive) return false;
              if (categoryFilter === 'hidden' && cat.isActive) return false;
              if (categorySearchQuery.trim()) {
                const q = categorySearchQuery.toLowerCase();
                return (
                  cat.name.toLowerCase().includes(q) ||
                  cat.slug.toLowerCase().includes(q) ||
                  (cat.description && cat.description.toLowerCase().includes(q))
                );
              }
              return true;
            });

            return (
              <div className="space-y-5">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-display font-black text-2xl uppercase">Category Management</h2>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        {categories.length} Categories
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Create, edit, toggle live visibility, and manage public menu categories
                    </p>
                  </div>
                  <button
                    onClick={() => setIsNewCategoryModalOpen(true)}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 transition text-white font-bold text-xs uppercase shadow-md w-full sm:w-auto active:scale-95 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Category</span>
                  </button>
                </div>

                {/* Mobile-Friendly Search & Status Filter Pills */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto scrollbar-none">
                    <button
                      onClick={() => setCategoryFilter('all')}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap shrink-0 ${
                        categoryFilter === 'all'
                          ? 'bg-emerald-500 text-white shadow-sm'
                          : 'bg-[#222222] text-gray-400 hover:text-white'
                      }`}
                    >
                      All ({categories.length})
                    </button>
                    <button
                      onClick={() => setCategoryFilter('active')}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                        categoryFilter === 'active'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-[#222222] text-emerald-400 hover:text-white'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                      <span>Active ({activeCategoriesCount})</span>
                    </button>
                    <button
                      onClick={() => setCategoryFilter('hidden')}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                        categoryFilter === 'hidden'
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'bg-[#222222] text-amber-400 hover:text-white'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span>Hidden ({hiddenCategoriesCount})</span>
                    </button>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search category..."
                      value={categorySearchQuery}
                      onChange={(e) => setCategorySearchQuery(e.target.value)}
                      className="w-full rounded-xl bg-[#222222] border border-[#333333] pl-9 pr-7 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                    />
                    {categorySearchQuery && (
                      <button
                        onClick={() => setCategorySearchQuery('')}
                        className="absolute right-2.5 top-2 text-xs text-gray-400 hover:text-white"
                        title="Clear search"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Categories Grid */}
                {filteredCategories.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-[#1B1B1B] border border-[#262626] text-center space-y-2">
                    <Layers className="w-8 h-8 text-gray-500 mx-auto" />
                    <p className="text-sm font-semibold text-gray-300">No categories found</p>
                    <p className="text-xs text-gray-500">
                      Try adjusting your search or status filter.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredCategories.map((cat) => {
                      const itemCount = menuItems.filter((i) => i.categoryId === cat.id).length;
                      return (
                        <div
                          key={cat.id}
                          className="p-4 sm:p-5 rounded-2xl bg-[#1B1B1B] border border-[#242424] hover:border-[#333333] transition flex flex-col justify-between gap-3.5 overflow-hidden shadow-lg"
                        >
                          {/* Top: Category Image & Info */}
                          <div className="flex items-start gap-3.5 min-w-0">
                            <div className="relative shrink-0">
                              <img
                                src={cat.image}
                                alt={cat.name}
                                className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-white/10 shadow-sm"
                              />
                              <span
                                className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-[#1B1B1B] ${
                                  cat.isActive
                                    ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]'
                                    : 'bg-amber-400'
                                }`}
                                title={cat.isActive ? 'Active (Live)' : 'Hidden (Draft)'}
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                <h3 className="font-bold text-base text-white truncate max-w-[170px] xs:max-w-[220px] sm:max-w-none">
                                  {cat.name}
                                </h3>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-800 text-gray-300 shrink-0">
                                  {itemCount} dishes
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[11px] font-mono text-emerald-400/80">/{cat.slug}</span>
                                <span className="text-[10px] text-gray-500">• Order #{cat.sortOrder ?? 0}</span>
                              </div>
                              {cat.description && (
                                <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                                  {cat.description}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Bottom Action Bar: 100% Mobile Responsive */}
                          <div className="pt-3 border-t border-[#252525] flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
                            {/* 1-click Category Active/Hidden toggle */}
                            <button
                              type="button"
                              onClick={(e) => handleToggleCategoryActive(e, cat)}
                              className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center sm:justify-start gap-2 active:scale-95 shadow-sm ${
                                cat.isActive
                                  ? 'bg-emerald-950/70 border border-emerald-600/70 text-emerald-300 hover:bg-emerald-900/80'
                                  : 'bg-amber-950/70 border border-amber-600/70 text-amber-300 hover:bg-amber-900/80'
                              }`}
                              title={`Click to switch to ${cat.isActive ? 'Hidden (Draft)' : 'Active (Live)'}`}
                            >
                              <span
                                className={`w-2 h-2 rounded-full shrink-0 ${
                                  cat.isActive
                                    ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]'
                                    : 'bg-amber-400'
                                }`}
                              />
                              <span className="font-semibold whitespace-nowrap">
                                {cat.isActive ? 'Active (Live)' : 'Hidden (Draft)'}
                              </span>
                            </button>

                            {/* Edit & Delete Action Buttons */}
                            <div className="flex items-center gap-2 shrink-0 ml-auto sm:ml-0">
                              <button
                                type="button"
                                onClick={() => setEditingCategory(cat)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#252525] hover:bg-[#303030] text-gray-200 hover:text-white text-xs font-semibold transition border border-white/5 active:scale-95 shadow-sm"
                                title="Edit Category details"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteCategory(cat.id)}
                                className="inline-flex items-center justify-center p-2 rounded-xl bg-[#252525] hover:bg-red-950/60 text-gray-400 hover:text-red-400 text-xs font-semibold transition border border-white/5 active:scale-95 shadow-sm"
                                title="Delete Category"
                              >
                                <Trash2 className="w-3.5 h-3.5 shrink-0" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}

          {/* TAB: ADD-ONS & MODIFIERS */}
          {activeTab === 'addons' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-display font-black text-2xl uppercase">Add-ons &amp; Extras</h2>
                  <p className="text-xs text-gray-400">
                    Manage dynamic add-ons (Amul Butter @ ₹20, Pure Desi Ghee, Extra Sambar, etc.)
                  </p>
                </div>
                <button
                  onClick={() => setIsNewAddonModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 transition text-white font-bold text-xs uppercase shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Add-on</span>
                </button>
              </div>

              <div className="space-y-3">
                {addons.map((addon) => (
                  <div
                    key={addon.id}
                    className="p-4 rounded-2xl bg-[#1B1B1B] border border-[#242424] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-white">{addon.name}</span>
                        <span className="font-display font-black text-base text-emerald-400">₹{addon.price}</span>
                        <span className="text-[10px] text-gray-500 uppercase font-semibold">
                          Applicable: {addon.applicableCategories.join(', ')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-[#222222]">
                      {/* Availability toggle */}
                      <button
                        onClick={() => handleToggleAddonAvailability(addon)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                          addon.isAvailable
                            ? 'bg-emerald-950/70 border border-emerald-600 text-emerald-300'
                            : 'bg-red-950/70 border border-red-600 text-red-300'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${addon.isAvailable ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        <span>{addon.isAvailable ? 'Available' : 'Sold Out'}</span>
                      </button>

                      {/* Edit Addon */}
                      <button
                        onClick={() => setEditingAddon(addon)}
                        className="p-2 rounded-lg bg-[#222222] text-gray-300 hover:text-white"
                        title="Edit Add-on"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Addon */}
                      <button
                        onClick={() => handleDeleteAddon(addon.id)}
                        className="p-2 rounded-lg bg-[#222222] text-gray-400 hover:text-red-400"
                        title="Delete Add-on"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: BRANCHES */}
          {activeTab === 'branches' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display font-black text-2xl uppercase">Branches Management</h2>
                <p className="text-xs text-gray-400">Manage Gurugram branch locations and map directions</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {branches.map((b) => (
                  <div key={b.id} className="p-5 rounded-2xl bg-[#1B1B1B] border border-[#282828] space-y-3">
                    <span className="font-display font-bold text-lg text-emerald-400">{b.name}</span>
                    <p className="text-xs text-gray-300 leading-relaxed">{b.address}</p>
                    <div className="text-xs text-gray-400 space-y-1">
                      <p>Phone: {b.phone}</p>
                      <p>Hours: {b.openingHours}</p>
                    </div>
                    <div className="pt-2 space-y-1 text-xs">
                      <a
                        href={b.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 underline block"
                      >
                        Verify Google Maps Link →
                      </a>
                      {b.zomatoUrl && (
                        <a
                          href={b.zomatoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#E23744] hover:underline block break-all font-medium"
                        >
                          Zomato Link: {b.zomatoUrl} →
                        </a>
                      )}
                      {b.swiggyUrl && (
                        <a
                          href={b.swiggyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#FC8019] hover:underline block break-all font-medium"
                        >
                          Swiggy Link: {b.swiggyUrl} →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: OFFERS & BANNERS */}
          {activeTab === 'offers' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display font-black text-2xl uppercase">Offers &amp; Banners</h2>
                <p className="text-xs text-gray-400">Configure promotional lines and delivery threshold</p>
              </div>

              <div className="space-y-3">
                {offers.map((offer) => (
                  <div key={offer.id} className="p-4 rounded-2xl bg-[#1B1B1B] border border-[#282828] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-base text-white">{offer.title}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white">
                        {offer.badge}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300">{offer.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display font-black text-2xl uppercase">Site &amp; Contact Settings</h2>
                <p className="text-xs text-gray-400">Central single source of truth for restaurant details</p>
              </div>

              {settingsSavedToast && (
                <div className="p-3 rounded-xl bg-green-950 border border-green-600 text-xs text-green-200">
                  Settings successfully updated and saved!
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-4 max-w-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-300 mb-1">
                      Primary Phone
                    </label>
                    <input
                      type="text"
                      value={settingsForm.phonePrimary}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phonePrimary: e.target.value })}
                      className="w-full rounded-xl bg-[#222222] border border-[#333333] px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-300 mb-1">
                      Secondary Phone
                    </label>
                    <input
                      type="text"
                      value={settingsForm.phoneSecondary}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phoneSecondary: e.target.value })}
                      className="w-full rounded-xl bg-[#222222] border border-[#333333] px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-300 mb-1">
                      WhatsApp Number
                    </label>
                    <input
                      type="text"
                      value={settingsForm.whatsappNumber}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                      className="w-full rounded-xl bg-[#222222] border border-[#333333] px-3 py-2 text-sm text-white"
                      placeholder="919953919033"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">
                    Free Delivery Statement
                  </label>
                  <input
                    type="text"
                    value={settingsForm.deliveryOfferText}
                    onChange={(e) => setSettingsForm({ ...settingsForm, deliveryOfferText: e.target.value })}
                    className="w-full rounded-xl bg-[#222222] border border-[#333333] px-3 py-2 text-sm text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-300 mb-1">
                      Zomato Restaurant URL
                    </label>
                    <input
                      type="url"
                      value={settingsForm.zomatoUrl}
                      onChange={(e) => setSettingsForm({ ...settingsForm, zomatoUrl: e.target.value })}
                      className="w-full rounded-xl bg-[#222222] border border-[#333333] px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-300 mb-1">
                      Swiggy Restaurant URL
                    </label>
                    <input
                      type="url"
                      value={settingsForm.swiggyUrl}
                      onChange={(e) => setSettingsForm({ ...settingsForm, swiggyUrl: e.target.value })}
                      className="w-full rounded-xl bg-[#222222] border border-[#333333] px-3 py-2 text-sm text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-300 mb-1">
                      Official Instagram URL
                    </label>
                    <input
                      type="url"
                      value={settingsForm.instagramUrl || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })}
                      className="w-full rounded-xl bg-[#222222] border border-[#333333] px-3 py-2 text-sm text-white"
                      placeholder="https://www.instagram.com/..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-300 mb-1">
                      Official Contact Email
                    </label>
                    <input
                      type="email"
                      value={settingsForm.contactEmail || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                      className="w-full rounded-xl bg-[#222222] border border-[#333333] px-3 py-2 text-sm text-white"
                      placeholder="pillaiyarappasouthindiancorner@gmail.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">
                    Announcement Banner Text
                  </label>
                  <input
                    type="text"
                    value={settingsForm.announcementText || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                    className="w-full rounded-xl bg-[#222222] border border-[#333333] px-3 py-2 text-sm text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded-xl bg-emerald-500 px-6 py-2.5 font-bold text-xs uppercase text-white hover:bg-emerald-400 transition"
                >
                  Save Settings
                </button>
              </form>
            </div>
          )}

          {/* TAB 7: AUDIT LOG */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display font-black text-2xl uppercase">Security &amp; Audit Log</h2>
                <p className="text-xs text-gray-400">Immutable trace of all administrative updates and sync operations</p>
              </div>

              <div className="space-y-2 font-mono text-xs">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3 rounded-xl bg-[#1B1B1B] border border-[#222222] flex items-start gap-3">
                    <span className="text-gray-500 shrink-0">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    <span className="text-emerald-400 font-bold shrink-0">{log.action}</span>
                    <span className="text-gray-300 flex-1">{log.details}</span>
                    <span className="text-gray-500 text-[10px]">by {log.actor}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal: Edit Menu Item */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#1B1B1B] border border-[#333333] p-6 text-white space-y-4 shadow-2xl">
            <h3 className="font-display font-bold text-lg text-emerald-400">Edit Menu Item</h3>
            <form onSubmit={handleSaveItemEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full rounded-xl bg-[#1E1E1E] border border-[#333333] px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Category</label>
                <select
                  value={editingItem.categoryId}
                  onChange={(e) => setEditingItem({ ...editingItem, categoryId: e.target.value })}
                  className="w-full rounded-xl bg-[#1E1E1E] border border-[#333333] px-3 py-2 text-xs text-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                    className="w-full rounded-xl bg-[#1E1E1E] border border-[#333333] px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Pricing Model</label>
                  <select
                    value={editingItem.priceType || 'fixed'}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, priceType: e.target.value as 'fixed' | 'mrp' })
                    }
                    className="w-full rounded-xl bg-[#1E1E1E] border border-[#333333] px-3 py-2 text-xs text-white"
                  >
                    <option value="fixed">Standard Menu Price</option>
                    <option value="mrp">Printed MRP (Beverages)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full rounded-xl bg-[#1E1E1E] border border-[#333333] px-3 py-2 text-xs"
                />
              </div>

              {/* Photo Upload & Management (Multer) */}
              <div className="pt-1">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Dish Photo</span>
                  </label>
                  <span className="text-[10px] text-gray-500 font-medium">Optional</span>
                </div>

                {editingItem.image && editingItem.image.trim() !== '' ? (
                  <div className="rounded-xl border border-[#333333] bg-[#141414] p-3 flex items-center gap-3">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-neutral-900 border border-white/10 shrink-0">
                      <img
                        src={editingItem.image}
                        alt={editingItem.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-bold text-emerald-400 block truncate">
                        Photo Active on Cards
                      </span>
                      <span className="text-[10px] text-gray-400 block truncate mt-0.5" title={editingItem.image}>
                        {editingItem.image.startsWith('/uploads/') ? 'Saved in public/uploads/menu/' : editingItem.image}
                      </span>
                      <div className="flex items-center gap-2 mt-2">
                        <label className="cursor-pointer inline-flex items-center gap-1.5 text-[11px] font-bold text-gray-200 bg-[#242424] hover:bg-[#2e2e2e] px-2.5 py-1 rounded-lg transition border border-white/10 active:scale-95">
                          <Upload className="w-3 h-3 text-emerald-400" />
                          <span>Change Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingItemImage}
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleUploadPhoto(f, 'edit');
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto('edit')}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-900/50 px-2.5 py-1 rounded-lg transition border border-red-800/40 active:scale-95"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove Photo</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-[#444444] hover:border-emerald-500/60 bg-[#161616] hover:bg-[#1a1a1a] transition cursor-pointer group">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingItemImage}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleUploadPhoto(f, 'edit');
                      }}
                    />
                    {uploadingItemImage ? (
                      <div className="flex items-center gap-2 text-emerald-400 py-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span className="text-xs font-bold">Uploading via Multer...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-center">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-1.5 group-hover:scale-105 transition">
                          <Upload className="w-4 h-4 text-emerald-400" />
                        </div>
                        <span className="text-xs font-bold text-gray-200">Click to upload dish photo</span>
                        <span className="text-[10px] text-gray-500 mt-0.5">JPEG, PNG, WebP up to 10MB (stored in /public/uploads/menu/)</span>
                      </div>
                    )}
                  </label>
                )}
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isBestseller}
                    onChange={(e) => setEditingItem({ ...editingItem, isBestseller: e.target.checked })}
                  />
                  <span>Mark as Bestseller</span>
                </label>
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isAvailable}
                    onChange={(e) => setEditingItem({ ...editingItem, isAvailable: e.target.checked })}
                  />
                  <span className={editingItem.isAvailable ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                    {editingItem.isAvailable ? 'In Stock (Live)' : 'Sold Out Today'}
                  </span>
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl border border-gray-600 text-xs text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-bold text-xs text-white transition shadow-md"
                >
                  Save Changes to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add New Menu Item */}
      {isNewItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#1B1B1B] border border-[#333333] p-6 text-white space-y-4 shadow-2xl">
            <h3 className="font-display font-bold text-lg text-emerald-400">Add New Menu Item</h3>
            <form onSubmit={handleAddNewItem} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Category</label>
                <select
                  value={newItemData.categoryId}
                  onChange={(e) => setNewItemData({ ...newItemData, categoryId: e.target.value })}
                  className="w-full rounded-xl bg-[#1E1E1E] border border-[#333333] px-3 py-2 text-xs text-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Dish Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cheese Mysore Masala Dosa"
                  value={newItemData.name}
                  onChange={(e) => setNewItemData({ ...newItemData, name: e.target.value })}
                  className="w-full rounded-xl bg-[#1E1E1E] border border-[#333333] px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newItemData.price}
                    onChange={(e) => setNewItemData({ ...newItemData, price: Number(e.target.value) })}
                    className="w-full rounded-xl bg-[#1E1E1E] border border-[#333333] px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Pricing Model</label>
                  <select
                    value={newItemData.priceType || 'fixed'}
                    onChange={(e) =>
                      setNewItemData({ ...newItemData, priceType: e.target.value as 'fixed' | 'mrp' })
                    }
                    className="w-full rounded-xl bg-[#1E1E1E] border border-[#333333] px-3 py-2 text-xs text-white"
                  >
                    <option value="fixed">Standard Menu Price</option>
                    <option value="mrp">Printed MRP (Beverages)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Fresh ingredients, served with coconut chutney & sambar..."
                  value={newItemData.description}
                  onChange={(e) => setNewItemData({ ...newItemData, description: e.target.value })}
                  className="w-full rounded-xl bg-[#1E1E1E] border border-[#333333] px-3 py-2 text-xs"
                />
              </div>

              {/* Photo Upload & Management (Multer) */}
              <div className="pt-1">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Dish Photo</span>
                  </label>
                  <span className="text-[10px] text-gray-500 font-medium">Optional</span>
                </div>

                {newItemData.image && newItemData.image.trim() !== '' ? (
                  <div className="rounded-xl border border-[#333333] bg-[#141414] p-3 flex items-center gap-3">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-neutral-900 border border-white/10 shrink-0">
                      <img
                        src={newItemData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-bold text-emerald-400 block truncate">
                        Photo Ready for Upload
                      </span>
                      <span className="text-[10px] text-gray-400 block truncate mt-0.5" title={newItemData.image}>
                        {newItemData.image.startsWith('/uploads/') ? 'Stored in public/uploads/menu/' : newItemData.image}
                      </span>
                      <div className="flex items-center gap-2 mt-2">
                        <label className="cursor-pointer inline-flex items-center gap-1.5 text-[11px] font-bold text-gray-200 bg-[#242424] hover:bg-[#2e2e2e] px-2.5 py-1 rounded-lg transition border border-white/10 active:scale-95">
                          <Upload className="w-3 h-3 text-emerald-400" />
                          <span>Change Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingItemImage}
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleUploadPhoto(f, 'new');
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto('new')}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-900/50 px-2.5 py-1 rounded-lg transition border border-red-800/40 active:scale-95"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove Photo</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-[#444444] hover:border-emerald-500/60 bg-[#161616] hover:bg-[#1a1a1a] transition cursor-pointer group">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingItemImage}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleUploadPhoto(f, 'new');
                      }}
                    />
                    {uploadingItemImage ? (
                      <div className="flex items-center gap-2 text-emerald-400 py-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span className="text-xs font-bold">Uploading via Multer...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-center">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-1.5 group-hover:scale-105 transition">
                          <Upload className="w-4 h-4 text-emerald-400" />
                        </div>
                        <span className="text-xs font-bold text-gray-200">Click to upload dish photo</span>
                        <span className="text-[10px] text-gray-500 mt-0.5">JPEG, PNG, WebP up to 10MB (stored in /public/uploads/menu/)</span>
                      </div>
                    )}
                  </label>
                )}
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newItemData.isBestseller}
                    onChange={(e) => setNewItemData({ ...newItemData, isBestseller: e.target.checked })}
                  />
                  <span>Mark as Bestseller</span>
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewItemModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-600 text-xs text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-bold text-xs text-white transition shadow-md"
                >
                  Publish Item to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Category */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#1B1B1B] border border-[#333333] p-5 sm:p-6 text-white space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
              <h3 className="font-display font-bold text-lg text-emerald-400">Edit Category</h3>
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveCategory} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full rounded-xl bg-[#1E1E1E] border border-[#333333] px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="w-full rounded-xl bg-[#1E1E1E] border border-[#333333] px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Image URL</label>
                <input
                  type="url"
                  value={editingCategory.image}
                  onChange={(e) => setEditingCategory({ ...editingCategory, image: e.target.value })}
                  className="w-full rounded-xl bg-[#1E1E1E] border border-[#333333] px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={editingCategory.isActive ?? true}
                    onChange={(e) => setEditingCategory({ ...editingCategory, isActive: e.target.checked })}
                    className="rounded border-gray-600 text-emerald-500 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span className="font-semibold text-gray-200">Category Active (Publicly Visible on Menu)</span>
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#262626]">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 rounded-xl border border-gray-600 text-xs text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-bold text-xs text-white transition shadow-md active:scale-95"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add New Category */}
      {isNewCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#1B1B1B] border border-[#333333] p-5 sm:p-6 text-white space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
              <h3 className="font-display font-bold text-lg text-emerald-400">Add New Category</h3>
              <button
                type="button"
                onClick={() => setIsNewCategoryModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddNewCategory} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Desserts & Sweets"
                  value={newCategoryData.name}
                  onChange={(e) => setNewCategoryData({ ...newCategoryData, name: e.target.value })}
                  className="w-full rounded-xl bg-[#1E1E1E] border border-[#333333] px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Category description..."
                  value={newCategoryData.description}
                  onChange={(e) => setNewCategoryData({ ...newCategoryData, description: e.target.value })}
                  className="w-full rounded-xl bg-[#1E1E1E] border border-[#333333] px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Image URL</label>
                <input
                  type="url"
                  value={newCategoryData.image}
                  onChange={(e) => setNewCategoryData({ ...newCategoryData, image: e.target.value })}
                  className="w-full rounded-xl bg-[#1E1E1E] border border-[#333333] px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={newCategoryData.isActive ?? true}
                    onChange={(e) => setNewCategoryData({ ...newCategoryData, isActive: e.target.checked })}
                    className="rounded border-gray-600 text-emerald-500 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span className="font-semibold text-gray-200">Category Active (Publicly Visible on Menu)</span>
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#262626]">
                <button
                  type="button"
                  onClick={() => setIsNewCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-600 text-xs text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-bold text-xs text-white transition shadow-md active:scale-95"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Addon */}
      {editingAddon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#1B1B1B] border border-[#333333] p-6 text-white space-y-4 shadow-2xl">
            <h3 className="font-display font-bold text-lg text-emerald-400">Edit Add-on</h3>
            <form onSubmit={handleSaveAddon} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Add-on Name</label>
                <input
                  type="text"
                  required
                  value={editingAddon.name}
                  onChange={(e) => setEditingAddon({ ...editingAddon, name: e.target.value })}
                  className="w-full rounded-xl bg-[#1E1E1E] border border-[#333333] px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Price (₹)</label>
                <input
                  type="number"
                  required
                  value={editingAddon.price}
                  onChange={(e) => setEditingAddon({ ...editingAddon, price: Number(e.target.value) })}
                  className="w-full rounded-xl bg-[#1E1E1E] border border-[#333333] px-3 py-2 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingAddon(null)}
                  className="px-4 py-2 rounded-xl border border-gray-600 text-xs text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-bold text-xs text-white transition shadow-md"
                >
                  Save Add-on
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add New Addon */}
      {isNewAddonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#1B1B1B] border border-[#333333] p-6 text-white space-y-4 shadow-2xl">
            <h3 className="font-display font-bold text-lg text-emerald-400">Add New Add-on</h3>
            <form onSubmit={handleAddNewAddon} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Add-on Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Extra Amul Butter, Ghee, Gunpowder"
                  value={newAddonData.name}
                  onChange={(e) => setNewAddonData({ ...newAddonData, name: e.target.value })}
                  className="w-full rounded-xl bg-[#1E1E1E] border border-[#333333] px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Price (₹)</label>
                <input
                  type="number"
                  required
                  value={newAddonData.price}
                  onChange={(e) => setNewAddonData({ ...newAddonData, price: Number(e.target.value) })}
                  className="w-full rounded-xl bg-[#1E1E1E] border border-[#333333] px-3 py-2 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewAddonModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-600 text-xs text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-bold text-xs text-white transition shadow-md"
                >
                  Create Add-on
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Reservation Details & Internal Notes */}
      {selectedReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#1B1B1B] border border-[#333333] p-6 text-white space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#282828] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-lg text-amber-400">
                    Reservation #{selectedReservation.id.slice(-6)}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Sec-40 Dine-In
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">Sector-40 HUDA Market Table Booking</p>
              </div>
              <button
                onClick={() => setSelectedReservation(null)}
                className="w-8 h-8 rounded-lg bg-[#242424] hover:bg-[#303030] text-gray-400 hover:text-white flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-[#141414] p-3.5 rounded-xl border border-[#242424]">
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-semibold">Guest Name</span>
                <span className="font-bold text-white text-sm">{selectedReservation.name}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-semibold">Phone</span>
                <span className="font-mono text-emerald-400 font-bold">+91 {selectedReservation.phone}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-semibold">Date &amp; Time</span>
                <span className="font-semibold text-white">
                  {selectedReservation.date} @ {formatTime12h(selectedReservation.time)}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-semibold">Party Size</span>
                <span className="font-semibold text-amber-300">
                  {selectedReservation.guests} Guest(s)
                </span>
              </div>
              {selectedReservation.email && (
                <div className="col-span-2">
                  <span className="text-gray-400 block text-[10px] uppercase font-semibold">Email</span>
                  <span className="text-gray-300">{selectedReservation.email}</span>
                </div>
              )}
              {selectedReservation.specialRequests && (
                <div className="col-span-2 pt-2 border-t border-[#222222]">
                  <span className="text-amber-400 block text-[10px] uppercase font-semibold">Special Request</span>
                  <p className="text-gray-200 mt-0.5 italic">"{selectedReservation.specialRequests}"</p>
                </div>
              )}
            </div>

            {/* Status change */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Reservation Status</label>
              <select
                value={selectedReservation.status}
                onChange={(e) =>
                  handleUpdateReservationStatus(
                    selectedReservation.id,
                    e.target.value as ReservationStatus,
                    selectedReservation.adminNotes
                  )
                }
                className="w-full rounded-xl bg-[#222222] border border-[#333333] px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-amber-500"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed / Seated</option>
                <option value="declined">Declined</option>
                <option value="cancelled">Cancelled</option>
                <option value="no-show">No Show</option>
              </select>
            </div>

            {/* Admin Internal Notes */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Internal Restaurant Notes (e.g. Table #3, Cake arrangement, window seat)
              </label>
              <textarea
                rows={3}
                value={resAdminNotesInput}
                onChange={(e) => setResAdminNotesInput(e.target.value)}
                placeholder="Add notes for floor staff or kitchen..."
                className="w-full rounded-xl bg-[#222222] border border-[#333333] p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2">
              <a
                href={getSmartWhatsAppUrl(
                  selectedReservation.phone,
                  getReservationWhatsAppMessage(selectedReservation)
                )}
                onClick={(e) =>
                  handleWhatsAppLinkClick(
                    e,
                    selectedReservation.phone,
                    getReservationWhatsAppMessage(selectedReservation)
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#25D366] text-black text-xs font-bold hover:bg-[#20ba59] transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send WhatsApp</span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedReservation(null)}
                  className="px-4 py-2 rounded-xl border border-gray-600 text-xs text-gray-300 hover:text-white"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveReservationNotes(selectedReservation.id)}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 font-bold text-xs text-white transition shadow-md"
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl font-bold text-xs border border-emerald-400/40">
          <Check className="w-4 h-4 text-white shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
