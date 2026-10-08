import { NextRequest, NextResponse } from 'next/server';
import { AnalyzeResult } from '@/types';

export async function POST(req: NextRequest) {
  let body: { image_data?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.image_data) {
    return NextResponse.json({ error: 'Missing field: image_data (base64 string)' }, { status: 400 });
  }

  // Validate it's a reasonable base64 string
  if (body.image_data.length < 100) {
    return NextResponse.json({ error: 'image_data appears too short to be valid' }, { status: 400 });
  }

  // Simulate AI processing time
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // Deterministic-ish mock based on image data length for demo variation
  const dataLen = body.image_data.length;
  const parsed = 10 + (dataLen % 10);
  const flagged = dataLen % 3 === 0 ? 2 : 1;
  const riskScores: AnalyzeResult['risk_score'][] = ['LOW', 'LOW', 'MEDIUM', 'LOW', 'HIGH'];
  const riskScore = riskScores[dataLen % riskScores.length];

  const result: AnalyzeResult = {
    status: 'analyzed',
    parsed_transactions: parsed,
    flagged_discrepancies: flagged,
    risk_score: riskScore,
  };

  return NextResponse.json(result);
}
