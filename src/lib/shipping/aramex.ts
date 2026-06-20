import type { ShippingAdapter, ShipmentRequest, ShipmentResult, TrackingInfo, RateRequest, RateInfo } from './adapter';

const ARAMEX_API_BASE = process.env.ARAMEX_API_BASE || 'https://api.aramex.com/shipping/v1';
const ARAMEX_ACCOUNT_NUMBER = process.env.ARAMEX_ACCOUNT_NUMBER || '';
const ARAMEX_USERNAME = process.env.ARAMEX_USERNAME || '';
const ARAMEX_PASSWORD = process.env.ARAMEX_PASSWORD || '';

export class AramexAdapter implements ShippingAdapter {
  private async request(endpoint: string, body: any) {
    const response = await fetch(`${ARAMEX_API_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(`${ARAMEX_USERNAME}:${ARAMEX_PASSWORD}`).toString('base64')}`,
      },
      body: JSON.stringify(body),
    });
    return response.json();
  }

  async createShipment(request: ShipmentRequest): Promise<ShipmentResult> {
    try {
      const payload = {
        ClientInfo: {
          UserName: ARAMEX_USERNAME,
          Password: ARAMEX_PASSWORD,
          AccountNumber: ARAMEX_ACCOUNT_NUMBER,
          Version: '1.0',
        },
        Shipments: [
          {
            Reference1: request.orderId,
            Reference2: '',
            Shipper: {
              Reference1: 'XM Store',
              Reference2: '',
              AccountNumber: ARAMEX_ACCOUNT_NUMBER,
              PartyAddress: {
                Line1: 'Warehouse Address',
                Line2: '',
                City: 'Dubai',
                CountryCode: 'AE',
              },
              Contact: {
                PersonName: 'XM Store',
                Phone: '+971500000000',
                Email: 'info@xmstore.com',
              },
            },
            Consignee: {
              Reference1: request.customerName,
              Reference2: '',
              PartyAddress: {
                Line1: request.address.street,
                Line2: request.address.landmark || request.address.district,
                City: request.address.city,
                CountryCode: 'AE',
              },
              Contact: {
                PersonName: request.customerName,
                Phone: request.phone,
                Email: '',
              },
            },
            Details: {
              Dimensions: {
                Weight: 1,
                Length: 10,
                Width: 10,
                Height: 10,
              },
              DescriptionOfGoods: request.items.map(i => i.name).join(', '),
              NumberOfPieces: request.items.reduce((sum, i) => sum + i.quantity, 0),
            },
          },
        ],
      };

      const result = await this.request('/shipments', payload);
      const shipment = result.Shipments?.[0];
      return {
        success: !!shipment?.ID,
        trackingNumber: shipment?.ID,
        labelUrl: shipment?.LabelUrl,
        error: result.HasErrors ? result.Notifications?.[0]?.Message : undefined,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async trackOrder(trackingNumber: string): Promise<TrackingInfo> {
    try {
      const result = await this.request('/track', {
        ClientInfo: {
          UserName: ARAMEX_USERNAME,
          Password: ARAMEX_PASSWORD,
          AccountNumber: ARAMEX_ACCOUNT_NUMBER,
          Version: '1.0',
        },
        Shipments: [{ ID: trackingNumber }],
      });

      const trackResult = result.TrackingResults?.[0];
      return {
        status: trackResult?.Value || 'Unknown',
        estimatedDelivery: trackResult?.ExpectedDeliveryDate,
        events: (trackResult?.TrackingEvents || []).map((event: any) => ({
          date: event.EventDate,
          description: event.EventDescription,
          location: event.EventLocation,
        })),
      };
    } catch {
      return { status: 'Unknown', events: [] };
    }
  }

  async getRate(request: RateRequest): Promise<RateInfo> {
    try {
      const payload = {
        ClientInfo: {
          UserName: ARAMEX_USERNAME,
          Password: ARAMEX_PASSWORD,
          AccountNumber: ARAMEX_ACCOUNT_NUMBER,
          Version: '1.0',
        },
        OriginAddress: {
          City: 'Dubai',
          CountryCode: 'AE',
        },
        DestinationAddress: {
          City: request.destination.city,
          CountryCode: 'AE',
        },
        ShipmentDetails: {
          Dimensions: {
            Weight: request.items.reduce((sum, item) => sum + (item.weight || 1), 0),
          },
        },
      };

      const result = await this.request('/rates', payload);
      return {
        total: result.TotalAmount || 15,
        currency: result.Currency || 'USD',
        estimatedDays: result.EstimatedTransitDays || '3-5 business days',
      };
    } catch {
      return { total: 15, currency: 'USD', estimatedDays: '3-5 business days' };
    }
  }
}

export const aramexAdapter = new AramexAdapter();
