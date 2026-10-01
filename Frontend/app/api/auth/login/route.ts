import { NextRequest } from 'next/server';
import { authenticateAdmin, jsonResponse, corsOptions } from '@/lib/db';

export async function OPTIONS() {
  return corsOptions();
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return jsonResponse({ success: false, message: 'Email and password required' }, 400);
    }

    const authResult = await authenticateAdmin(email, password);
    if (!authResult) {
      return jsonResponse({ success: false, message: 'Invalid admin credentials' }, 401);
    }

    return jsonResponse({
      success: true,
      message: 'Login successful',
      data: authResult,
    });
  } catch (error: any) {
    return jsonResponse({ success: false, message: error.message || 'Server error' }, 500);
  }
}
