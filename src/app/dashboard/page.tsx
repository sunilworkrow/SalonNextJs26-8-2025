// src/app/dashboard/page.tsx
"use client"

import React from "react"
import Chart from "@/app/components/Chart"
import ChartBarHorizontal from "../components/BarChart"

export default function DashboardPage() {
  return (
    <div className="p-6">
      {/* <h1 className="text-2xl font-bold">Dashboard Home</h1>
      <p className="text-sm text-gray-400 mb-4">Welcome to your dashboard</p> */}
      <Chart></Chart>
      {/* <ChartBarHorizontal /> */}
    </div>
  )
}
