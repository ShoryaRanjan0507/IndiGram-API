import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, PlanTier } from '../../../../lib/rate-limit';
import { SAMPLE_VILLAGES } from '../../../../lib/data';

import { prisma } from '../../../../lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q') || '';

  // Rate limiting check
  const apiKey = req.headers.get('x-api-key') || 'anonymous';
  const planTier = (req.headers.get('x-plan-tier') || 'FREE').toUpperCase() as PlanTier;

  const { allowed, remaining } = await checkRateLimit(apiKey, planTier);

  if (!allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429 });
  }

  let results: any[] = [];
  let source = 'database';

  try {
    // Attempt to query the 600,000+ entries in PostgreSQL
    const villages = await prisma.village.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { district: { contains: query, mode: 'insensitive' } },
          { state: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 50,
    });

    // Enrich results with pincodes from the mapping table
    const enriched = [];
    for (const v of villages) {
      const mapping = await prisma.pincodeMapping.findFirst({
        where: {
          district: { contains: v.district, mode: 'insensitive' },
          officeName: { contains: v.name.split(' ')[0], mode: 'insensitive' }
        }
      });
      enriched.push({ ...v, pincode: mapping?.pincode || 'N/A' });
    }
    results = enriched;

  } catch (error: any) {
    // Fallback to sample data if DB is not yet connected
    console.log('Database Error:', error?.message || error);
    results = SAMPLE_VILLAGES.filter(v =>
      v.name.toLowerCase().includes(query.toLowerCase()) ||
      v.district.toLowerCase().includes(query.toLowerCase()) ||
      v.state.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 50);
    source = 'sample';
  }

  return NextResponse.json({
    count: results.length,
    results,
    requestsRemaining: remaining,
    source,
    note: source === 'database' ? "Results from 600k database" : "Results from sample dataset (DB not connected)"
  });
}
