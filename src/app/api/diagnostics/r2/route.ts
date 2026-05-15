import {NextResponse} from 'next/server';
import {getR2Diagnostics} from '@/lib/r2-diagnostics';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export function GET() {
  return NextResponse.json(getR2Diagnostics(), {
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
