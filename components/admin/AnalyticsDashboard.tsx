"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { 
  Users, 
  Eye, 
  MousePointer, 
  Clock, 
  TrendingUp,
  Calendar,
  RefreshCw
} from "lucide-react"

interface AnalyticsData {
  overview: {
    sessions: number
    users: number
    pageviews: number
    bounceRate: number
    avgSessionDuration: number
    newUsers: number
  }
  pageViews: Array<{
    date: string
    pageviews: number
  }>
  topPages: Array<{
    page: string
    pageviews: number
  }>
  sessionDuration: Array<{
    date: string
    duration: number
  }>
  devices: Array<{
    device: string
    sessions: number
  }>
  countries: Array<{
    country: string
    sessions: number
  }>
  dateRange: {
    startDate: string
    endDate: string
  }
}

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16']

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDays, setSelectedDays] = useState(7)

  const fetchAnalytics = async (days: number = 7) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/analytics?days=${days}`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch analytics data')
      }
      const analyticsData = await response.json()
      
      if (analyticsData.error) {
        throw new Error(analyticsData.error)
      }
      
      setData(analyticsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics(selectedDays)
  }, [selectedDays])

  const formatDate = (dateStr: string) => {
    // Handle GA4 date format (YYYYMMDD)
    if (dateStr.length === 8 && /^\d{8}$/.test(dateStr)) {
      const year = dateStr.substring(0, 4)
      const month = dateStr.substring(4, 6)
      const day = dateStr.substring(6, 8)
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
    
    // Handle other date formats
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) {
      return dateStr // Return original string if invalid
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}m ${remainingSeconds}s`
  }

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = formatDate(startDate)
    const end = formatDate(endDate)
    return `${start} - ${end}`
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
          <div className="flex gap-2">
            {[7, 30, 90].map((days) => (
              <Button
                key={days}
                variant={selectedDays === days ? "default" : "outline"}
                size="sm"
                className={selectedDays === days ? "bg-orange-500 hover:bg-orange-600" : "border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"}
                onClick={() => setSelectedDays(days)}
              >
                {days} days
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchAnalytics(selectedDays)}
              className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-700 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
          <Button
            variant="outline"
            onClick={() => fetchAnalytics(selectedDays)}
            className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6 text-center">
            <div className="text-red-400 mb-2">⚠️ Error loading analytics</div>
            <p className="text-gray-400">{error}</p>
            <p className="text-sm text-gray-500 mt-2">
              Make sure your Google Analytics credentials are properly configured in the environment variables.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
          <p className="text-gray-400">
            {formatDateRange(data.dateRange.startDate, data.dateRange.endDate)}
          </p>
        </div>
        <div className="flex gap-2">
          {[7, 30, 90].map((days) => (
            <Button
              key={days}
              variant={selectedDays === days ? "default" : "outline"}
              size="sm"
              className={selectedDays === days ? "bg-orange-500 hover:bg-orange-600" : "border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"}
              onClick={() => setSelectedDays(days)}
            >
              {days} days
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchAnalytics(selectedDays)}
            className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Page Views</p>
                <p className="text-2xl font-bold text-white">{formatNumber(data.overview.pageviews)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Sessions</p>
                <p className="text-2xl font-bold text-white">{formatNumber(data.overview.sessions)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Avg. Session</p>
                <p className="text-2xl font-bold text-white">{formatDuration(data.overview.avgSessionDuration)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Bounce Rate</p>
                <p className="text-2xl font-bold text-white">{data.overview.bounceRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Page Views Over Time */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-orange-500" />
              Page Views Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.pageViews}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9ca3af"
                  tickFormatter={formatDate}
                />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  labelFormatter={(value) => formatDate(value)}
                />
                <Line 
                  type="monotone" 
                  dataKey="pageviews" 
                  stroke="#f97316" 
                  strokeWidth={2}
                  dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Session Duration Over Time */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Clock className="h-5 w-5 mr-2 text-green-500" />
              Session Duration Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.sessionDuration}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9ca3af"
                  tickFormatter={formatDate}
                />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  labelFormatter={(value) => formatDate(value)}
                  formatter={(value) => [formatDuration(Number(value)), 'Duration']}
                />
                <Line 
                  type="monotone" 
                  dataKey="duration" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device Categories */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-500" />
              Device Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.devices}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ device, percent }) => `${device} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="sessions"
                >
                  {data.devices.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Countries */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="h-5 w-5 mr-2 text-purple-500" />
              Top Countries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.countries.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="country" 
                  stroke="#9ca3af"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="sessions" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Pages Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Most Viewed Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Page</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Page Views</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {data.topPages.map((page, index) => {
                  const totalPageViews = data.topPages.reduce((sum, p) => sum + p.pageviews, 0)
                  const percentage = ((page.pageviews / totalPageViews) * 100).toFixed(1)
                  
                  return (
                    <tr key={page.page} className="border-b border-gray-700 hover:bg-gray-750">
                      <td className="py-3 px-4 text-white font-medium">
                        <span className="font-mono text-sm">{page.page}</span>
                      </td>
                      <td className="py-3 px-4 text-white">{formatNumber(page.pageviews)}</td>
                      <td className="py-3 px-4 text-white">{percentage}%</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
