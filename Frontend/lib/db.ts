import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';
import { Product, AgeOption, Collection, BusinessSettings } from '../types';

const STORE_PATH = path.join(process.cwd(), 'data', 'store.json');
const JWT_SECRET = process.env.JWT_SECRET || 'kiddy-closet-secret-key-2026';

interface StoreData {
  products: Record<string, Product>;
  ages: Record<string, AgeOption>;
  collections: Record<string, Collection>;
  settings: Record<string, BusinessSettings>;
  admins: Record<string, any>;
}

export function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  };
}

export function jsonResponse(data: any, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: corsHeaders(),
  });
}

export function corsOptions() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

export function readStore(): StoreData {
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

export function writeStore(data: StoreData) {
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

// Slugify helper
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// Auth helpers
export async function authenticateAdmin(email: string, pass: string) {
  const store = readStore();
  const admins = Object.entries(store.admins || {}).map(([id, a]) => ({ id, ...a }));
  const admin = admins.find((a) => a.email.toLowerCase() === email.toLowerCase());
  if (!admin) return null;

  const valid = await bcrypt.compare(pass, admin.password);
  if (!valid) return null;

  const token = jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role, name: admin.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    token,
    admin: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    },
  };
}

export function verifyAdminToken(authHeader: string | null) {
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
