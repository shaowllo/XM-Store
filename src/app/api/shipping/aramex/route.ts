import { NextRequest, NextResponse } from 'next/server';
import { aramexAdapter } from '@/lib/shipping/aramex';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'createShipment':
        return NextResponse.json(await aramexAdapter.createShipment(data));
      case 'trackOrder':
        return NextResponse.json(await aramexAdapter.trackOrder(data.trackingNumber));
      case 'getRate':
        return NextResponse.json(await aramexAdapter.getRate(data));
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
