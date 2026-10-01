import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { verifyAdminToken, jsonResponse, corsOptions } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return corsOptions();
}

export async function POST(req: NextRequest) {
  try {
    const admin = verifyAdminToken(req.headers.get('authorization'));
    if (!admin) {
      return jsonResponse({ success: false, message: 'Unauthorized' }, 401);
    }

    const formData = await req.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return jsonResponse({ success: false, message: 'No image file provided' }, 400);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || '.jpg';
    const filename = `${uuidv4()}${ext}`;

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;

    return jsonResponse({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: publicUrl,
        storagePath: filePath,
        publicId: filename,
      },
    }, 201);
  } catch (error: any) {
    return jsonResponse({ success: false, message: error.message || 'Image upload failed' }, 500);
  }
}
