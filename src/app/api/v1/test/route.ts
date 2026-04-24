import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, PlanTier } from '../../../../lib/rate-limit';

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key') || 'anonymous';
  const requestedTier = (req.headers.get('x-plan-tier') || 'FREE').toUpperCase();
  
  // Validate if requestedTier is a valid PlanTier
  const planTier = (['FREE', 'PREMIUM', 'PRO', 'UNLIMITED'].includes(requestedTier) 
    ? requestedTier 
    : 'FREE') as PlanTier;

  const { allowed, remaining } = await checkRateLimit(apiKey, planTier, false);

  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please upgrade your plan.' },
      { status: 429 }
    );
  }

  return NextResponse.json({
    message: 'Success! Welcome to IndiGram API.',
    plan: planTier,
    requestsRemaining: remaining
  });
}
