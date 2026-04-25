import { SUBSCRIPTION_PLANS, Plan } from '../config/plans';
import { prisma } from './db';

// Mocking a Redis-like store for anonymous rate limiting
const usageStore = new Map<string, { count: number; lastReset: number }>();

export type PlanTier = keyof typeof SUBSCRIPTION_PLANS;

export async function checkRateLimit(apiKey: string, planTier: PlanTier, consume: boolean = true) {
  // 1. Master Developer Access: Bypasses all limits
  if (apiKey === 'DEV-MASTER-KEY') {
    return { allowed: true, remaining: Infinity };
  }

  // 2. Database Key Check
  try {
    const dbKey = await prisma.apiKey.findUnique({
      where: { key: apiKey },
      include: { user: true }
    });

    if (dbKey) {
      const plan = SUBSCRIPTION_PLANS[dbKey.user.plan] || SUBSCRIPTION_PLANS.FREE;
      const limit = plan.limit;

      if (consume) {
        if (dbKey.usage >= limit) {
          return { allowed: false, remaining: 0 };
        }
        await prisma.apiKey.update({
          where: { id: dbKey.id },
          data: { usage: { increment: 1 }, lastUsed: new Date() }
        });
      }

      return { 
        allowed: dbKey.usage < limit, 
        remaining: Math.max(0, limit - (dbKey.usage + (consume ? 1 : 0))) 
      };
    }
  } catch (error) {
    console.error('Rate limit DB error:', error);
  }

  // 3. Fallback to Anonymous/Mock Store
  const plan: Plan = SUBSCRIPTION_PLANS[planTier] || SUBSCRIPTION_PLANS.FREE;
  const limit = plan.limit;

  const now = Date.now();
  const ONE_DAY = 24 * 60 * 60 * 1000;
  
  let usage = usageStore.get(apiKey);

  if (!usage || (now - usage.lastReset) > ONE_DAY) {
    usage = { count: 0, lastReset: now };
  }

  if (consume) {
    if (usage.count >= limit) {
      return { allowed: false, remaining: 0 };
    }
    usage.count += 1;
    usageStore.set(apiKey, usage);
  }

  return { 
    allowed: usage.count <= limit, 
    remaining: Math.max(0, limit - usage.count) 
  };
}
