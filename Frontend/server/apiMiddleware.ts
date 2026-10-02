import express, { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { Product, AgeOption, Collection, BusinessSettings } from '../src/types';

const STORE_PATH = path.join(process.cwd(), 'data', 'store.json');
const JWT_SECRET = process.env.JWT_SECRET || 'kiddy-closet-secret-key-2026';

const DEFAULT_SETTINGS: BusinessSettings = {
  businessName: 'THE LITTLE PLACKET',
  tagline: 'LITTLE OUTFITS FOR BIG ADVENTURES',
  heroHeadlineLittle: 'The',
  heroHeadlineStyles: 'Little',
  heroHeadlineBigSmiles: 'Placket',
  heroSupportingText: 'Little outfits for big adventures.',
  heroImage: '/images/the-little-placket-banner.png',
  boysCardTitle: 'BOYS',
  boysCardSubtitle: 'Collection',
  boysCardDescription: 'Trendy outfits for every occasion',
  boysCardImage: '/images/products/boy-check-shirt.jpg',
  girlsCardTitle: 'GIRLS',
  girlsCardSubtitle: 'Collection',
  girlsCardDescription: 'Pretty outfits for every little star',
  girlsCardImage: '/images/products/girl-floral-bow-frock.jpg',
  quickCard1Title: 'NEW ARRIVALS',
  quickCard1Desc: 'Fresh 2026 Styles',
  quickCard2Title: 'BEST SELLERS',
  quickCard2Desc: 'Loved by Parents',
  quickCard3Title: 'OFFERS',
  quickCard3Desc: 'Special Boutique Bundles',
  whatsappNumber: '919876543210',
  email: 'hello@thelittleplacket.com',
  phone: '+91 98765 43210',
  instagramUrl: 'https://instagram.com/thelittleplacket',
  facebookUrl: 'https://facebook.com/thelittleplacket',
  address: 'Shop 14, Lilac Arcade, Blossom Street, Bandra West, Mumbai 400050',
  announcementText: '✨ Exclusive Catalogue Platform — Handcrafted Kids & Baby Outfits — Direct WhatsApp Assistance',
  footerContent: '© 2026 THE LITTLE PLACKET. Little Outfits for Big Adventures. All rights reserved.',
};

interface StoreData {
  products: Record<string, Product>;
  ages: Record<string, AgeOption>;
  collections: Record<string, Collection>;
  settings: Record<string, BusinessSettings>;
  admins: Record<string, any>;
}

function readStore(): StoreData {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading store.json:', err);
  }
  return {
    products: {},
    ages: {},
    collections: {},
    settings: {},
    admins: {},
  };
}

function writeStore(data: StoreData) {
  try {
    const dir = path.dirname(STORE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing store.json:', err);
  }
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

function verifyAdmin(authHeader?: string | null) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch (e) {
    return null;
  }
}

export function createApiMiddleware() {
  const app = express();

  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Multer storage for uploads
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname) || '.jpg';
      cb(null, `${uuidv4()}${ext}`);
    },
  });

  const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB Max File Limit
  });



  // 1. Auth routes
  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password required' });
      }

      const store = readStore();
      const admins = Object.entries(store.admins || {}).map(([id, a]) => ({ id, ...a }));
      const admin = admins.find((a) => a.email.toLowerCase() === email.toLowerCase());
      if (!admin) {
        return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
      }

      const valid = await bcrypt.compare(password, admin.password);
      if (!valid) {
        return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
      }

      const token = jwt.sign(
        { id: admin.id, email: admin.email, role: admin.role, name: admin.name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          admin: {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
          },
        },
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
  });

  app.get('/api/auth/me', (req: Request, res: Response) => {
    const admin = verifyAdmin(req.headers.authorization);
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    return res.json({ success: true, data: admin });
  });

  // 2. Admin Stats
  app.get('/api/products/admin/stats', (req: Request, res: Response) => {
    const admin = verifyAdmin(req.headers.authorization);
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const store = readStore();
    const products: Product[] = Object.entries(store.products || {}).map(([id, p]) => ({
      ...p,
      id: p.id || id,
    }));

    const totalProducts = products.length;
    const boysCount = products.filter((p) => p.category === 'boys').length;
    const girlsCount = products.filter((p) => p.category === 'girls').length;
    const featuredCount = products.filter((p) => p.featured).length;
    const availableCount = products.filter((p) => p.availability === 'available').length;

    const recentProducts = [...products]
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 5);

    return res.json({
      success: true,
      data: {
        stats: {
          total: totalProducts,
          totalProducts,
          boys: boysCount,
          boysCount,
          girls: girlsCount,
          girlsCount,
          featuredCount,
          availableCount,
        },
        recentProducts,
      },
    });
  });

  // Helper to format file size
  function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  // 3. Image upload with 10MB limit check
  app.post('/api/products/upload/image', (req: Request, res: Response) => {
    upload.single('image')(req, res, (err: any) => {
      const admin = verifyAdmin(req.headers.authorization);
      if (!admin) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'Image size exceeds maximum limit of 10 MB. Please choose a smaller photo.',
          });
        }
        return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
      } else if (err) {
        return res.status(500).json({ success: false, message: `Server error during upload: ${err.message}` });
      }

      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No image file provided' });
      }

      const fileSize = req.file.size || 0;
      const formattedSize = formatBytes(fileSize);
      const publicUrl = `/uploads/${req.file.filename}`;

      return res.status(201).json({
        success: true,
        message: 'Image uploaded and optimized successfully',
        data: {
          url: publicUrl,
          storagePath: req.file.path,
          publicId: req.file.filename,
          sizeBytes: fileSize,
          formattedSize,
        },
      });
    });
  });


  // 4. Products by ID
  app.get('/api/products/id/:id', (req: Request, res: Response) => {
    const id = req.params.id as string;
    const store = readStore();
    const product = store.products[id] || Object.values(store.products || {}).find((p) => p.id === id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    return res.json({ success: true, data: { ...product, id: product.id || id } });
  });

  // 5. Products CRUD
  app.get('/api/products', (req: Request, res: Response) => {
    try {
      const {
        category,
        collection,
        dressType,
        availability,
        ageGroup,
        size,
        color,
        priceRange,
        onlyAvailable,
        search,
        sortBy = 'featured',
      } = req.query as Record<string, string>;

      const store = readStore();
      let products: Product[] = Object.entries(store.products || {}).map(([id, p]) => ({
        ...p,
        id: p.id || id,
      }));

      if (category && category !== 'all') {
        products = products.filter((p) => p.category === category);
      }
      if (collection) {
        products = products.filter((p) => p.collection?.toLowerCase() === collection.toLowerCase());
      }
      if (dressType) {
        products = products.filter((p) => p.dressType?.toLowerCase() === dressType.toLowerCase());
      }
      if (onlyAvailable === 'true' || (availability && availability !== 'all')) {
        products = products.filter((p) => p.availability === 'available');
      }
      if (ageGroup) {
        products = products.filter((p) => p.ageGroup === ageGroup);
      }
      if (size) {
        products = products.filter((p) => p.sizes && p.sizes.includes(size));
      }
      if (color) {
        products = products.filter((p) => {
          if (!p.colors) return false;
          return p.colors.some((c) => {
            const cName = typeof c === 'string' ? c : c.name;
            return cName.toLowerCase() === color.toLowerCase();
          });
        });
      }
      if (priceRange) {
        products = products.filter((p) => {
          const pr = p.price || 0;
          if (priceRange === 'below-500') return pr < 500;
          if (priceRange === '500-750') return pr >= 500 && pr <= 750;
          if (priceRange === '750-1000') return pr > 750 && pr <= 1000;
          if (priceRange === '1000-plus') return pr > 1000;
          return true;
        });
      }
      if (search) {
        const q = search.toLowerCase().trim();
        products = products.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q) ||
            p.dressType?.toLowerCase().includes(q) ||
            p.collection?.toLowerCase().includes(q)
        );
      }

      products.sort((a, b) => {
        if (sortBy === 'price-asc' || sortBy === 'price_asc') {
          return (a.price || 0) - (b.price || 0);
        }
        if (sortBy === 'price-desc' || sortBy === 'price_desc') {
          return (b.price || 0) - (a.price || 0);
        }
        if (sortBy === 'a-z' || sortBy === 'title_asc') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'newest') {
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        }
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });

      return res.json({
        success: true,
        data: products,
        total: products.length,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
  });

  app.post('/api/products', (req: Request, res: Response) => {
    try {
      const admin = verifyAdmin(req.headers.authorization);
      if (!admin) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const body = req.body;
      const {
        name,
        category,
        description,
        dressType,
        collection,
        availability,
        images,
        price,
        startingPrice,
        ageGroup,
        availableAges,
        whatsappNumber,
      } = body;

      if (!name || !category) {
        return res.status(400).json({ success: false, message: 'Name and category are required' });
      }

      const store = readStore();
      let slug = slugify(name);
      const existingSlugs = Object.values(store.products || {}).map((p) => p.slug);
      if (existingSlugs.includes(slug)) {
        slug = `${slug}-${Date.now().toString().slice(-4)}`;
      }

      const newId = uuidv4().replace(/-/g, '').slice(0, 20);
      const now = new Date().toISOString();

      const newProduct: any = {
        id: newId,
        name: name.trim(),
        slug,
        category,
        description: description || '',
        dressType: dressType || '',
        collection: collection || '',
        price: Number(price) || 749,
        startingPrice: startingPrice || `₹${price || 749}`,
        ageGroup: ageGroup || (availableAges && availableAges.length > 0 ? availableAges[0] : '2-3yr'),
        availableAges: availableAges || [],
        whatsappNumber: whatsappNumber || '',
        availability: availability || 'available',
        images: images || [],
        createdAt: now,
        updatedAt: now,
      };

      // Ensure colors, featured, sizes are omitted
      delete newProduct.colors;
      delete newProduct.featured;
      delete newProduct.sizes;

      store.products[newId] = newProduct;
      writeStore(store);

      return res.status(201).json({ success: true, data: newProduct });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message || 'Server error' });
    }
  });

  app.get('/api/products/:slug', (req: Request, res: Response) => {
    const { slug } = req.params;
    const store = readStore();
    const products = Object.entries(store.products || {}).map(([id, p]) => ({ ...p, id: p.id || id }));
    const product = products.find((p) => p.slug === slug || p.id === slug);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    return res.json({ success: true, data: product });
  });

  app.put('/api/products/:id', (req: Request, res: Response) => {
    const admin = verifyAdmin(req.headers.authorization);
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const id = req.params.id as string;
    const store = readStore();
    const existing = store.products[id] || Object.values(store.products).find((p) => p.id === id);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const targetKey = store.products[id] ? id : Object.keys(store.products).find((k) => store.products[k].id === id) || id;
    let updatedSlug = existing.slug;
    if (req.body.name && req.body.name.trim() !== existing.name) {
      updatedSlug = slugify(req.body.name);
    }

    const updatedProduct: any = {
      ...existing,
      ...req.body,
      id: existing.id || id,
      slug: updatedSlug,
      updatedAt: new Date().toISOString(),
    };

    delete updatedProduct.colors;
    delete updatedProduct.featured;
    delete updatedProduct.sizes;

    store.products[targetKey] = updatedProduct;
    writeStore(store);


    return res.json({ success: true, data: updatedProduct });
  });

  app.delete('/api/products/:id', (req: Request, res: Response) => {
    const admin = verifyAdmin(req.headers.authorization);
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const id = req.params.id as string;
    const store = readStore();
    const targetKey = store.products[id] ? id : Object.keys(store.products).find((k) => store.products[k].id === id);

    if (!targetKey || !store.products[targetKey]) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    delete store.products[targetKey];
    writeStore(store);

    return res.json({ success: true, message: 'Product deleted' });
  });

  // 6. Ages CRUD
  app.get('/api/ages', (req: Request, res: Response) => {
    const activeOnly = req.query.active === 'true';
    const store = readStore();
    let ages: AgeOption[] = Object.entries(store.ages || {}).map(([id, a]) => ({
      ...a,
      id: a.id || id,
    }));

    if (activeOnly) {
      ages = ages.filter((a) => a.active);
    }
    ages.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    return res.json({ success: true, data: ages });
  });

  app.post('/api/ages', (req: Request, res: Response) => {
    const admin = verifyAdmin(req.headers.authorization);
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { label, minMonths, maxMonths, active, sortOrder } = req.body;
    if (!label) {
      return res.status(400).json({ success: false, message: 'Age label is required' });
    }

    const store = readStore();
    const newId = uuidv4().replace(/-/g, '').slice(0, 16);

    const newAge: AgeOption = {
      id: newId,
      label: label.trim(),
      minMonths: Number(minMonths) || 0,
      maxMonths: Number(maxMonths) || 12,
      active: active !== false,
      sortOrder: Number(sortOrder) || Object.keys(store.ages || {}).length,
    };

    store.ages[newId] = newAge;
    writeStore(store);

    return res.status(201).json({ success: true, data: newAge });
  });

  app.put('/api/ages/:id', (req: Request, res: Response) => {
    const admin = verifyAdmin(req.headers.authorization);
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const id = req.params.id as string;
    const store = readStore();
    const targetKey = store.ages[id] ? id : Object.keys(store.ages || {}).find((k) => store.ages[k].id === id);

    if (!targetKey || !store.ages[targetKey]) {
      return res.status(404).json({ success: false, message: 'Age bracket not found' });
    }

    const updated: AgeOption = {
      ...store.ages[targetKey],
      ...req.body,
      id: store.ages[targetKey].id || id,
    };

    store.ages[targetKey] = updated;
    writeStore(store);

    return res.json({ success: true, data: updated });
  });

  app.delete('/api/ages/:id', (req: Request, res: Response) => {
    const admin = verifyAdmin(req.headers.authorization);
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const id = req.params.id as string;
    const store = readStore();
    const targetKey = store.ages[id] ? id : Object.keys(store.ages || {}).find((k) => store.ages[k].id === id);

    if (!targetKey || !store.ages[targetKey]) {
      return res.status(404).json({ success: false, message: 'Age bracket not found' });
    }

    delete store.ages[targetKey];
    writeStore(store);

    return res.json({ success: true, message: 'Age bracket deleted' });
  });

  // 7. Collections CRUD
  app.get('/api/collections', (req: Request, res: Response) => {
    const activeOnly = req.query.active === 'true';
    const store = readStore();
    let collections: Collection[] = Object.entries(store.collections || {}).map(([id, c]) => ({
      ...c,
      id: c.id || id,
    }));

    if (activeOnly) {
      collections = collections.filter((c) => c.active);
    }
    return res.json({ success: true, data: collections });
  });

  app.post('/api/collections', (req: Request, res: Response) => {
    const admin = verifyAdmin(req.headers.authorization);
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { name, description, active } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Collection name is required' });
    }

    const store = readStore();
    const newId = uuidv4().replace(/-/g, '').slice(0, 16);
    const slug = slugify(name);

    const newCollection: Collection = {
      id: newId,
      name: name.trim(),
      slug,
      description: description || '',
      active: active !== false,
    };

    store.collections[newId] = newCollection;
    writeStore(store);

    return res.status(201).json({ success: true, data: newCollection });
  });

  app.put('/api/collections/:id', (req: Request, res: Response) => {
    const admin = verifyAdmin(req.headers.authorization);
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const id = req.params.id as string;
    const store = readStore();
    const targetKey = store.collections[id] ? id : Object.keys(store.collections || {}).find((k) => store.collections[k].id === id);

    if (!targetKey || !store.collections[targetKey]) {
      return res.status(404).json({ success: false, message: 'Collection not found' });
    }

    const existing = store.collections[targetKey];
    const updatedSlug = req.body.name ? slugify(req.body.name) : existing.slug;

    const updated: Collection = {
      ...existing,
      ...req.body,
      id: existing.id || id,
      slug: updatedSlug,
    };

    store.collections[targetKey] = updated;
    writeStore(store);

    return res.json({ success: true, data: updated });
  });

  app.delete('/api/collections/:id', (req: Request, res: Response) => {
    const admin = verifyAdmin(req.headers.authorization);
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const id = req.params.id as string;
    const store = readStore();
    const targetKey = store.collections[id] ? id : Object.keys(store.collections || {}).find((k) => store.collections[k].id === id);

    if (!targetKey || !store.collections[targetKey]) {
      return res.status(404).json({ success: false, message: 'Collection not found' });
    }

    delete store.collections[targetKey];
    writeStore(store);

    return res.json({ success: true, message: 'Collection deleted' });
  });

  // 8. Settings CRUD
  app.get('/api/settings', (req: Request, res: Response) => {
    const store = readStore();
    const settings = store.settings?.business || DEFAULT_SETTINGS;
    return res.json({ success: true, data: { ...DEFAULT_SETTINGS, ...settings } });
  });

  app.put('/api/settings', (req: Request, res: Response) => {
    const admin = verifyAdmin(req.headers.authorization);
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const store = readStore();
    const current = store.settings?.business || DEFAULT_SETTINGS;

    const updated: BusinessSettings = {
      ...current,
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    if (!store.settings) store.settings = {} as any;
    store.settings.business = updated;
    writeStore(store);

    return res.json({ success: true, data: updated });
  });

  return app;
}
