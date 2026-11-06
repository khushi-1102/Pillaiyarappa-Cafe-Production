import { Router, Request, Response } from 'express';
import { dbStore } from '../db/store';

const router = Router();

// GET /api/menu/categories
router.get('/categories', (_req: Request, res: Response) => {
  try {
    const categories = dbStore.getCategories().filter((c) => c.isActive);
    res.json({ success: true, data: categories });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to fetch categories' });
  }
});

// GET /api/menu/items
router.get('/items', (req: Request, res: Response) => {
  try {
    const categoryId = req.query.category as string | undefined;
    const search = (req.query.search as string || '').toLowerCase().trim();
    const vegOnly = req.query.veg === 'true';

    let items = dbStore.getMenuItems({ categoryId });

    if (vegOnly) {
      items = items.filter((i) => i.isVeg);
    }

    if (search) {
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(search) ||
          i.description.toLowerCase().includes(search)
      );
    }

    res.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to fetch menu items' });
  }
});

// GET /api/menu/addons
router.get('/addons', (req: Request, res: Response) => {
  try {
    const categoryId = req.query.category as string | undefined;
    const addons = dbStore.getAddons({ categoryId, isAvailable: true });
    res.json({ success: true, data: addons });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to fetch addons' });
  }
});

// GET /api/menu/settings
router.get('/settings', (_req: Request, res: Response) => {
  try {
    const settings = dbStore.getSettings();
    res.json({ success: true, data: settings });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to fetch settings' });
  }
});

// GET /api/menu/branches
router.get('/branches', (_req: Request, res: Response) => {
  try {
    const branches = dbStore.getBranches();
    res.json({ success: true, data: branches });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to fetch branches' });
  }
});

// GET /api/menu/offers
router.get('/offers', (_req: Request, res: Response) => {
  try {
    const offers = dbStore.getOffers();
    res.json({ success: true, data: offers });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to fetch offers' });
  }
});

// POST /api/menu/reservations (Public — submit a table reservation)
router.post('/reservations', (req: Request, res: Response) => {
  try {
    const { branchId, branchSlug, name, phone, email, guests, date, time, specialRequests } = req.body || {};
    if (!name || !phone || !date || !time || !guests) {
      return res.status(400).json({ success: false, error: 'Name, phone, date, time, and number of guests are required' });
    }
    const reservation = dbStore.createTableReservation({
      branchId: branchId || 'branch-2',
      branchSlug: branchSlug || 'sec-40-huda-market',
      name,
      phone,
      email,
      guests: Number(guests),
      date,
      time,
      specialRequests,
    });
    res.status(201).json({ success: true, data: reservation });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to submit reservation' });
  }
});

export default router;
