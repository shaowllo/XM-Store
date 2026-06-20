/**
 * Generate simulated price history for a product.
 * Based on current price with random daily fluctuations.
 */

export interface PricePoint {
  date: string;
  price: number;
  label: string;
}

export function generatePriceHistory(
  currentPrice: number,
  days: number = 30
): PricePoint[] {
  const points: PricePoint[] = [];
  const now = new Date();

  // Start from a price that fluctuates around the current price
  let price = currentPrice * (0.85 + Math.random() * 0.2);
  const today = new Date(now);
  today.setDate(today.getDate() - days);

  for (let i = 0; i <= days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);

    // Random daily change: -3% to +3%
    const change = 1 + (Math.random() - 0.48) * 0.06;
    price = price * change;

    // Every 7 days, tend toward the current price (mean reversion)
    if (i % 7 === 0) {
      price = price + (currentPrice - price) * 0.1;
    }

    // Keep within reasonable range
    price = Math.max(currentPrice * 0.6, Math.min(currentPrice * 1.4, price));

    const label = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    points.push({
      date: date.toISOString().split("T")[0],
      price: Math.round(price * 100) / 100,
      label,
    });
  }

  return points;
}
