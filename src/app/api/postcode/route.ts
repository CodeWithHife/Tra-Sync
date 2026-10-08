import { NextRequest, NextResponse } from 'next/server';
import { PostcodeResult } from '@/types';

// ─── Mock NIPOST postcode database ────────────────────────────────────────────
const MOCK_POSTCODES: Record<string, PostcodeResult> = {
  'LA-100001-0842': {
    postcode: 'LA-100001-0842',
    street: '14 Allen Avenue',
    lga: 'Ikeja',
    state: 'Lagos',
    lat: 6.5965,
    lng: 3.3421,
  },
  'LA-100002-0011': {
    postcode: 'LA-100002-0011',
    street: '5 Broad Street',
    lga: 'Lagos Island',
    state: 'Lagos',
    lat: 6.4543,
    lng: 3.3944,
  },
  'AB-401001-0100': {
    postcode: 'AB-401001-0100',
    street: '22 Wuse Zone 3',
    lga: 'Wuse',
    state: 'Abuja FCT',
    lat: 9.0579,
    lng: 7.4951,
  },
  'KN-700001-0231': {
    postcode: 'KN-700001-0231',
    street: '7 Bompai Road',
    lga: 'Nassarawa',
    state: 'Kano',
    lat: 12.0022,
    lng: 8.5920,
  },
  'RV-500001-0455': {
    postcode: 'RV-500001-0455',
    street: '3 Aba Road',
    lga: 'Port Harcourt',
    state: 'Rivers',
    lat: 4.8242,
    lng: 7.0336,
  },
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Missing query parameter: code' }, { status: 400 });
  }

  const normalizedCode = code.trim().toUpperCase();
  let result = MOCK_POSTCODES[normalizedCode];

  // Auto-resolve logic for the demo address
  if (!result && (code.trim().toLowerCase().includes('12 allen avenue') || code.trim().toLowerCase().includes('la-100001-0842'))) {
    result = {
      ...MOCK_POSTCODES['LA-100001-0842'],
      street: '12 Allen Avenue, Ikeja',
    };
  }

  if (!result) {
    return NextResponse.json(
      { error: `Location not found: ${code}. Try LA-100001-0842 or '12 Allen Avenue'` },
      { status: 404 }
    );
  }

  // Inject verified status for the new UI requirements
  const enrichedResult = { ...result, status: 'VERIFIED' };

  // Simulate slight network delay for realism
  await new Promise((resolve) => setTimeout(resolve, 400));

  return NextResponse.json(enrichedResult);
}
