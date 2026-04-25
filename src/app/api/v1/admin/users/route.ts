import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

import { SUBSCRIPTION_PLANS } from '@/config/plans';

export async function GET() {
  try {
    const session = await getSession();

    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const users = await prisma.user.findMany({
      include: {
        apiKeys: true
      },
      orderBy: {
        id: 'desc'
      }
    });

    const totalUsers = users.length;
    const totalRequests = users.reduce((acc, user) => acc + (user.apiKeys[0]?.usage || 0), 0);
    const estimatedRevenue = users.reduce((acc, user) => {
      const plan = SUBSCRIPTION_PLANS[user.plan] || SUBSCRIPTION_PLANS.FREE;
      return acc + plan.price;
    }, 0);

    return NextResponse.json({ 
      users,
      stats: {
        totalUsers,
        totalRequests,
        estimatedRevenue
      }
    });
  } catch (error) {
    console.error('Admin API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
