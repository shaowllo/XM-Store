export interface ShipmentRequest {
  orderId: string;
  customerName: string;
  phone: string;
  address: {
    province: string;
    city: string;
    district: string;
    street: string;
    landmark?: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    weight?: number;
  }>;
}

export interface ShipmentResult {
  success: boolean;
  trackingNumber?: string;
  labelUrl?: string;
  error?: string;
}

export interface TrackingInfo {
  status: string;
  estimatedDelivery?: string;
  events: Array<{
    date: string;
    description: string;
    location?: string;
  }>;
}

export interface RateRequest {
  destination: {
    city: string;
    province: string;
  };
  items: Array<{ weight?: number }>;
}

export interface RateInfo {
  total: number;
  currency: string;
  estimatedDays: string;
}

export interface ShippingAdapter {
  createShipment(request: ShipmentRequest): Promise<ShipmentResult>;
  trackOrder(trackingNumber: string): Promise<TrackingInfo>;
  getRate(request: RateRequest): Promise<RateInfo>;
}
