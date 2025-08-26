// src/app/components/BarChart.tsx
"use client"

import { TrendingUp } from "lucide-react"
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts"

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]

export default function ChartBarHorizontal() {
  return (
    <div className="p-4 bg-white rounded shadow w-full max-w-4xl mx-auto my-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Bar Chart - Horizontal</h2>
        <p className="text-sm text-gray-500">January - June 2024</p>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ReBarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, bottom: 10, left: 30, right: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis type="number" hide />
            <YAxis
              dataKey="month"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => String(value).slice(0, 3)} // ✅ Fixed here
            />
            <Tooltip />
            <Bar
              dataKey="desktop"
              fill="var(--color-desktop)"
              radius={[5, 5, 5, 5]}
            />
          </ReBarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-sm">
        <div className="flex items-center gap-2 font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-gray-500">Showing total visitors for the last 6 months</div>
      </div>
    </div>
  )
}
