import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { dbStore } from '../db/store';

const router = Router();

// Configure Multer for Menu Photo Uploads
const resolveUploadsDir = () => {
  const candidates = [
    path.resolve(process.cwd(), 'client/public/uploads/menu'),
    path.resolve(process.cwd(), 'public/uploads/menu'),
    path.resolve(__dirname, '../../client/public/uploads/menu'),
    path.resolve(__dirname, '../uploads/menu'),
  ];
  for (const dir of candidates) {
    if (fs.existsSync(path.dirname(dir))) {
      return dir;
    }
  }
  return candidates[0];
};

const uploadsDir = resolveUploadsDir();
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const safeBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 30);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `menu-${safeBase}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WebP, etc.) are allowed!'));
    }
  },
});

// Simple admin authentication check
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@pillaiyarappa.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Pillaiyarappa@2026';

// POST /api/admin/login
router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body || {};
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    dbStore.addAuditLog('Admin', 'Login', `Admin user logged in: ${email}`);
    return res.json({
      success: true,
      user: {
        id: 'admin-1',
        name: 'Pillaiyarappa Management',
        email: ADMIN_EMAIL,
        role: 'owner',
      },
      token: 'admin-session-active',
    });
  }
  return res.status(401).json({ success: false, error: 'Invalid admin credentials' });
});

// --- PHOTO UPLOAD & MANAGEMENT (MULTER) ---

// POST /api/admin/menu/upload-image
router.post('/menu/upload-image', (req: Request, res: Response) => {
  upload.single('image')(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ success: false, error: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ success: false, error: err.message || 'Error uploading file' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image file was provided' });
    }

    const publicUrl = `/uploads/menu/${req.file.filename}`;
    dbStore.addAuditLog(
      'Admin',
      'Upload Menu Photo',
      `Uploaded photo: ${req.file.filename} (${(req.file.size / 1024).toFixed(1)} KB)`
    );

    return res.status(201).json({
      success: true,
      url: publicUrl,
      filename: req.file.filename,
      size: req.file.size,
    });
  });
});

// DELETE /api/admin/menu/delete-image
router.delete('/menu/delete-image', (req: Request, res: Response) => {
  try {
    const { url } = req.body || {};
    if (!url || typeof url !== 'string' || !url.startsWith('/uploads/menu/')) {
      return res.status(400).json({ success: false, error: 'Invalid file url' });
    }
    const filename = path.basename(url);
    const filePath = path.join(uploadsDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      dbStore.addAuditLog('Admin', 'Delete Menu Photo', `Deleted file from disk: ${filename}`);
    }
    return res.json({ success: true, message: 'Image deleted from disk successfully' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// --- MENU ITEMS CRUD ---

// GET /api/admin/menu/items
router.get('/menu/items', (req: Request, res: Response) => {
  try {
    const categoryId = req.query.category as string | undefined;
    const items = dbStore.getMenuItems({ categoryId });
    res.json({ success: true, count: items.length, data: items });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/admin/menu/items
router.post('/menu/items', (req: Request, res: Response) => {
  try {
    const { name, categoryId, price, description, isVeg, isBestseller, isAvailable, image, applicableAddonIds, priceType } = req.body || {};
    if (!name || !categoryId || price === undefined) {
      return res.status(400).json({ success: false, error: 'Name, categoryId, and price are required' });
    }

    const newItem = dbStore.createMenuItem({
      name,
      categoryId,
      price: Number(price),
      description: description || '',
      isVeg: isVeg !== undefined ? isVeg : true,
      isBestseller: Boolean(isBestseller),
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      image,
      applicableAddonIds: applicableAddonIds || ['addon-butter'],
      priceType: priceType || 'fixed',
      slug: '',
      sortOrder: 99,
    });

    res.status(201).json({ success: true, data: newItem });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/admin/menu/items/:id
router.patch('/menu/items/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = dbStore.updateMenuItem(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Menu item not found' });
    }
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/admin/menu/items/:id/toggle-available
router.patch('/menu/items/:id/toggle-available', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const explicitState = req.body?.isAvailable !== undefined ? Boolean(req.body.isAvailable) : undefined;
    const updated = dbStore.toggleMenuItemAvailability(id, explicitState);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Menu item not found' });
    }
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/admin/menu/items/:id
router.delete('/menu/items/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = dbStore.deleteMenuItem(id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Menu item not found' });
    }
    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- CATEGORIES CRUD ---

// GET /api/admin/menu/categories
router.get('/menu/categories', (_req: Request, res: Response) => {
  try {
    const categories = dbStore.getCategories();
    res.json({ success: true, data: categories });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/admin/menu/categories
router.post('/menu/categories', (req: Request, res: Response) => {
  try {
    const { name, description, image, isActive, sortOrder } = req.body || {};
    if (!name) {
      return res.status(400).json({ success: false, error: 'Category name is required' });
    }
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCat = dbStore.createCategory({
      name,
      slug,
      description: description || '',
      image: image || 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80',
      isActive: isActive !== undefined ? isActive : true,
      sortOrder: sortOrder || 99,
    });
    res.status(201).json({ success: true, data: newCat });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/admin/menu/categories/:id
router.patch('/menu/categories/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = dbStore.updateCategory(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/admin/menu/categories/:id
router.delete('/menu/categories/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = dbStore.deleteCategory(id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- ADDONS CRUD ---

// GET /api/admin/menu/addons
router.get('/menu/addons', (_req: Request, res: Response) => {
  try {
    const addons = dbStore.getAddons();
    res.json({ success: true, data: addons });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/admin/menu/addons
router.post('/menu/addons', (req: Request, res: Response) => {
  try {
    const { name, price, isAvailable, applicableCategories } = req.body || {};
    if (!name || price === undefined) {
      return res.status(400).json({ success: false, error: 'Name and price are required' });
    }
    const newAddon = dbStore.createAddon({
      name,
      price: Number(price),
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      applicableCategories: applicableCategories || ['all'],
      sortOrder: 99,
      priceType: 'fixed',
    });
    res.status(201).json({ success: true, data: newAddon });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/admin/menu/addons/:id
router.patch('/menu/addons/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = dbStore.updateAddon(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Addon not found' });
    }
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/admin/menu/addons/:id
router.delete('/menu/addons/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = dbStore.deleteAddon(id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Addon not found' });
    }
    res.json({ success: true, message: 'Addon deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- SETTINGS ---

// GET /api/admin/settings
router.get('/settings', (_req: Request, res: Response) => {
  try {
    const settings = dbStore.getSettings();
    res.json({ success: true, data: settings });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/admin/settings
router.patch('/settings', (req: Request, res: Response) => {
  try {
    const updated = dbStore.updateSettings(req.body);
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- ENQUIRIES & AUDIT LOGS ---

// GET /api/admin/enquiries
router.get('/enquiries', (_req: Request, res: Response) => {
  try {
    const enquiries = dbStore.getEnquiries();
    res.json({ success: true, data: enquiries });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/admin/enquiries (public catering enquiries)
router.post('/enquiries', (req: Request, res: Response) => {
  try {
    const { name, phone, message } = req.body || {};
    if (!name || !phone) {
      return res.status(400).json({ success: false, error: 'Name and phone are required' });
    }
    const created = dbStore.createEnquiry(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/admin/enquiries/:id
router.patch('/enquiries/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = dbStore.updateEnquiry(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Enquiry not found' });
    }
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/admin/audit-logs
router.get('/audit-logs', (_req: Request, res: Response) => {
  try {
    const logs = dbStore.getAuditLogs();
    res.json({ success: true, data: logs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- TABLE RESERVATIONS (Admin) ---

// GET /api/admin/reservations
router.get('/reservations', (req: Request, res: Response) => {
  try {
    const branchId = req.query.branch as string | undefined;
    const status = req.query.status as string | undefined;
    const date = req.query.date as string | undefined;
    const reservations = dbStore.getTableReservations({
      branchId,
      status: status as any,
      date,
    });
    res.json({ success: true, count: reservations.length, data: reservations });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/admin/reservations/:id
router.patch('/reservations/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = dbStore.updateTableReservation(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Reservation not found' });
    }
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/admin/reset
router.post('/reset', (_req: Request, res: Response) => {
  try {
    dbStore.resetDatabase();
    res.json({ success: true, message: 'Database reset to initial seed values' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
