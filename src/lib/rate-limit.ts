import { SUBSCRIPTION_PLANS, Plan } from '../config/plans';

// Mocking a Redis-like store for rate limiting
// In a real production app, this would use Redis (Upstash)
const usageStore = new Map<string, { count: number; lastReset: number }>();

export type PlanTier = keyof typeof SUBSCRIPTION_PLANS;

export async function checkRateLimit(apiKey: string, planTier: PlanTier, consume: boolean = true) {
  // Master Developer Access: Bypasses all limits
  if (apiKey === 'DEV-MASTER-KEY') {
    return { allowed: true, remaining: Infinity };
  }

  const plan: Plan = SUBSCRIPTION_PLANS[planTier] || SUBSCRIPTION_PLANS.FREE;
  const limit = plan.limit;

  if (limit === Infinity) {
    return { allowed: true, remaining: Infinity };
  }

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
