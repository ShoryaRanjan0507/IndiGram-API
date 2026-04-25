import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { encrypt } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password, name, phone } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { 
        email, 
        name, 
        phone, 
        password: hashedPassword,
        apiKeys: {
          create: {
            key: `ig_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
          }
        }
      },
    });

    const session = await encrypt({ id: user.id, email: user.email, name: user.name, role: user.role, plan: user.plan });
    
    const cookieStore = await cookies();
    cookieStore.set('session', session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24
    });

    return NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name, plan: user.plan } });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
