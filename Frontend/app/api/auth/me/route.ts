import { NextRequest } from 'next/server';
import { verifyAdminToken, jsonResponse, corsOptions } from '@/lib/db';

export async function OPTIONS() {
  return corsOptions();
}

export async function GET(req: NextRequest) {
  const decoded = verifyAdminToken(req.headers.get('authorization'));
  if (!decoded) {
    return jsonResponse({ success: false, message: 'Unauthorized' }, 401);
  }

  return jsonResponse({
    success: true,
    data: decoded,
  });
}
