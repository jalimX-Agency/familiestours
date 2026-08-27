import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { createToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required' }, { status: 400 });
    }

    let user = await db.user.findUnique({ where: { email } });

    // Seed default admin if NO users exist
    if (!user) {
      const userCount = await db.user.count();
      if (userCount === 0) {
        if (email === 'admin@familiestours.com' && password === 'admin') {
          const hashedPassword = await bcrypt.hash(password, 10);
          user = await db.user.create({
            data: {
              email: 'admin@familiestours.com',
              name: 'Admin',
              password: hashedPassword,
              role: 'ADMIN'
            }
          });
        } else {
          return NextResponse.json({ success: false, error: 'Invalid credentials. Default is admin@familiestours.com / admin' }, { status: 401 });
        }
      } else {
        return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
      }
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await createToken({ id: user.id, email: user.email, role: user.role });

    const response = NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name } });
    
    response.cookies.set({
      name: 'admin_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
