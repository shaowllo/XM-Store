"use client";

import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { generatePriceHistory } from "@/lib/price-history";

interface PriceChartProps {
  productId: string;
  currentPrice: number;
  productName: string;
}

const RANGES = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
] as const;

export function PriceChart({ productId, currentPrice, productName }: PriceChartProps) {
  const [range, setRange] = useState<number>(30);

  const data = useMemo(
    () => generatePriceHistory(currentPrice, range),
    [currentPrice, range, productId]
  );

  const minPrice = Math.min(...data.map((d) => d.price));
  const maxPrice = Math.max(...data.map((d) => d.price));
  const avgPrice = Math.round((data.reduce((s, d) => s + d.price, 0) / data.length) * 100) / 100;
  const priceChange = data.length > 1
    ? Math.round((data[data.length - 1].price - data[0].price) * 100) / 100
    : 0;

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border bg-card p-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <TrendingUp className="h-3.5 w-3.5" />
            Price History
          </div>
          <h3 className="text-lg font-semibold">{productName}</h3>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">${currentPrice.toLocaleString()}</p>
          {priceChange !== 0 && (
            <p className={`text-xs ${priceChange > 0 ? "text-green-600" : "text-red-500"}`}>
              {priceChange > 0 ? "+" : ""}{priceChange} ({range}d)
            </p>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl bg-muted/50 p-3 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Low</p>
          <p className="text-sm font-semibold mt-0.5">{formatCurrency(minPrice)}</p>
        </div>
        <div className="rounded-xl bg-muted/50 p-3 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Average</p>
          <p className="text-sm font-semibold mt-0.5">{formatCurrency(avgPrice)}</p>
        </div>
        <div className="rounded-xl bg-muted/50 p-3 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">High</p>
          <p className="text-sm font-semibold mt-0.5">{formatCurrency(maxPrice)}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-48 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id={`gradient-${productId}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(42,65%,55%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(42,65%,55%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(225,15%,16%)" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: "hsl(36,15%,55%)" }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 10, fill: "hsl(36,15%,55%)" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v}`}
              domain={["auto", "auto"]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(225,20%,9%)",
                border: "1px solid hsl(225,15%,16%)",
                borderRadius: "12px",
                fontSize: "12px",
              }}
              formatter={(value: any) => [`$${value?.toLocaleString?.() ?? value}`, "Price"]}
              labelStyle={{ color: "hsl(36,30%,92%)" }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="hsl(42,65%,55%)"
              strokeWidth={2}
              fill={`url(#gradient-${productId})`}
              dot={false}
              activeDot={{ r: 4, fill: "hsl(42,65%,55%)" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Range selector */}
      <div className="flex justify-center gap-2 mt-4">
        {RANGES.map((r) => (
          <button
            key={r.days}
            onClick={() => setRange(r.days)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              range === r.days
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
