"use client"



export default function Component() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* KPI Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="border border-[#434343] text-white rounded-md">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">3,256</p>
                  <p className="text-sm text-gray-500">Total Users</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="border border-[#434343] text-white rounded-md">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold ">394</p>
                  <p className="text-sm text-gray-500">Available Staff</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="border border-[#434343] text-white rounded-md">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold ">$2,536</p>
                  <p className="text-sm text-gray-500">Avg Treat. Costs</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="border border-[#434343] text-white rounded-md">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold ">38</p>
                  <p className="text-sm text-gray-500">Available Services</p>
                </div>
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 text-pink-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bar Chart */}
          <div className="border border-[#434343] text-white rounded-md p-4 lg:col-span-2">
            <div className="pb-4">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold ">Bast Services in Trending</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Show</span>
                  <div defaultValue="months">
                    <div className="w-24 h-8">
                      
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="h-64 flex items-end justify-between gap-4 px-4">
                {[
                  { month: "Oct 2019", inpatients: 180, outpatients: 120 },
                  { month: "Nov 2019", inpatients: 220, outpatients: 160 },
                  { month: "Dec 2019", inpatients: 280, outpatients: 200 },
                  { month: "Jan 2020", inpatients: 200, outpatients: 140 },
                  { month: "Feb 2020", inpatients: 240, outpatients: 180 },
                  { month: "Mar 2020", inpatients: 260, outpatients: 190 },
                ].map((data, index) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <div className="flex items-end gap-1">
                      <div
                        className="w-6 bg-teal-400 rounded-t"
                        style={{ height: `${(data.outpatients / 300) * 200}px` }}
                      />
                      <div
                        className="w-6 bg-purple-600 rounded-t"
                        style={{ height: `${(data.inpatients / 300) * 200}px` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 origin-left">{data.month}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-600 rounded-full" />
                  <span className="text-sm text-gray-600">Customer Bast Reviews </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-teal-400 rounded-full" />
                  <span className="text-sm text-gray-600">Customer Nagitive Reviews</span>
                </div>
              </div>
            </div>
          </div>

          {/* Donut Chart */}
          <div className="border border-[#434343] text-white rounded-md p-4">
            <div className="pb-4">
              <div className="text-lg font-semibold ">User by Gender</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="3"
                    strokeDasharray="60, 100"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#7c3aed"
                    strokeWidth="3"
                    strokeDasharray="40, 100"
                    strokeDashoffset="-60"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full" />
                  <span className="text-sm text-gray-600">Female</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-600 rounded-full" />
                  <span className="text-sm text-gray-600">Male</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Time Admitted Chart */}
          <div className="border border-[#434343] text-white rounded-md p-4">
            <div className="pb-4">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold ">Time Management</div>
                <span className="text-sm text-gray-500">Today</span>
              </div>
            </div>
            <div>
              <div className="h-32 relative">
                <svg className="w-full h-full" viewBox="0 0 300 120">
                  <path
                    d="M 20 100 Q 50 80 80 90 T 140 70 T 200 75 T 260 70"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="2"
                  />
                  <circle cx="140" cy="70" r="3" fill="#f97316" />
                </svg>
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                  <div  className=" text-white">
                    112
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>07 am</span>
                <span>08 am</span>
                <span>09 am</span>
                <span>10 am</span>
                <span>11 am</span>
                <span>12 pm</span>
              </div>
            </div>
          </div>

          {/* Patients by Division */}
          <div className="border border-[#434343] text-white rounded-md p-4">
            <div className="pb-4">
              <div className="text-lg font-semibold ">Bast Services</div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-600">Hair Cut</span>
                </div>
                <span className="font-semibold ">247</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm text-gray-600">Manicure</span>
                </div>
                <span className="font-semibold ">164</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 text-teal-600" />
                  </div>
                  <span className="text-sm text-gray-600">Head Massage</span>
                </div>
                <span className="font-semibold ">86</span>
              </div>
            </div>
          </div>

          {/* Monthly Patients Card */}
          <div className="bg-gradient-to-br from-[#155dfc] to-[#3c79fd] rounded-md text-white lg:col-span-2">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-3xl font-bold mb-1">3,240</p>
                  <p className="text-purple-200 text-sm">Customer this month</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold mb-1">232</p>
                </div>
              </div>
              <div className="mt-6 h-16">
                <svg className="w-full h-full" viewBox="0 0 300 60">
                  <path
                    d="M 20 40 Q 50 30 80 35 T 140 25 T 200 30 T 260 25"
                    fill="none"
                    stroke="rgba(255,255,255,0.8)"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <div className="flex justify-between text-xs text-purple-200 mt-2">
                <span>14</span>
                <span>15</span>
                <span>16</span>
                <span>17</span>
                <span>18</span>
                <span>19</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
