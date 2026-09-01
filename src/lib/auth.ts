import { NextRequest, NextResponse } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'familiestours-super-secret-key-2026';
const key = new TextEncoder().encode(JWT_SECRET);

export async function createToken(payload: { id: string; email: string; role: string }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, key);
    return payload as { id: string; email: string; role: string };
  } catch (error) {
    return null;
  }
}

/**
 * Guards a mutating API route to admin-only callers.
 * Returns the verified token payload, or a 401 NextResponse to return as-is.
 */
export async function requireAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
  }

  return payload;
}
