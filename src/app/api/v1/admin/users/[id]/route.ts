import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();

    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { plan, role } = await request.json();
    const userId = params.id;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { 
        ...(plan && { plan }),
        ...(role && { role })
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Update User API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
