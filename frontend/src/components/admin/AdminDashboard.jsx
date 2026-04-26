import React from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'
import Navbar from '../shared/Navbar'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Users, Briefcase, UserCheck, Clock } from 'lucide-react'

const STATUS_COLORS = {
    pending:      "#94a3b8",
    under_review: "#60a5fa",
    shortlisted:  "#fbbf24",
    hired:        "#22c55e",
    rejected:     "#f87171",
}

const STATUS_LABELS = {
    pending: "Applied", under_review: "Under Review",
    shortlisted: "Shortlisted", hired: "Hired", rejected: "Rejected",
}

const fetchStats = async () => {
    const res = await axios.get(`${APPLICATION_API_END_POINT}/stats`, { withCredentials: true })
    return res.data
}

const StatCard = ({ label, value, icon: Icon, color, bg }) => (
    <div className={`rounded-xl p-5 ${bg} shadow-sm border border-white/50`}>
        <div className='flex items-center justify-between'>
            <div>
                <p className='text-sm text-white/80 font-medium'>{label}</p>
                <p className='text-3xl font-bold text-white mt-1'>{value}</p>
            </div>
            <div className='w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center'>
                <Icon className='w-6 h-6 text-white' />
            </div>
        </div>
    </div>
)

const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
}

const AdminDashboard = () => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["appStats"],
        queryFn: fetchStats,
        refetchInterval: 60000, // auto-refresh every 60s
    })

    const totalApps   = data?.statusBreakdown?.reduce((s, i) => s + i.count, 0) ?? 0
    const hired       = data?.statusBreakdown?.find(s => s._id === "hired")?.count ?? 0
    const shortlisted = data?.statusBreakdown?.find(s => s._id === "shortlisted")?.count ?? 0
    const pending     = data?.statusBreakdown?.find(s => s._id === "pending")?.count ?? 0

    const pieData = (data?.statusBreakdown ?? []).map(s => ({
        name:  STATUS_LABELS[s._id] ?? s._id,
        value: s.count,
        fill:  STATUS_COLORS[s._id] ?? "#cbd5e1",
    }))

    const areaData = (data?.stats ?? []).map(s => ({ date: s._id, Applications: s.count }))

    if (isLoading) return (
        <div className='min-h-screen bg-gray-50'>
            <Navbar />
            <div className='max-w-6xl mx-auto px-4 py-8 animate-pulse space-y-6'>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                    {Array.from({ length: 4 }).map((_, i) => <div key={i} className='h-28 bg-gray-200 rounded-xl' />)}
                </div>
                <div className='grid grid-cols-3 gap-6'>
                    <div className='col-span-2 h-72 bg-gray-200 rounded-xl' />
                    <div className='h-72 bg-gray-200 rounded-xl' />
                </div>
            </div>
        </div>
    )

    if (isError) return (
        <div className='min-h-screen bg-gray-50'>
            <Navbar />
            <div className='flex flex-col items-center justify-center py-20 gap-3'>
                <p className='text-gray-500'>Failed to load dashboard data.</p>
                <button onClick={refetch} className='text-[#6A38C2] text-sm underline'>Try again</button>
            </div>
        </div>
    )

    return (
        <div className='min-h-screen bg-gray-50'>
            <Navbar />
            <div className='max-w-6xl mx-auto px-4 py-8'>
                <div className='flex items-center justify-between mb-6'>
                    <h1 className='text-2xl font-bold text-gray-900'>Recruiter Dashboard</h1>
                    <span className='text-xs text-gray-400'>Auto-refreshes every 60s</span>
                </div>

                {/* Stat Cards */}
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
                    <StatCard label="Total Applications" value={totalApps}   icon={Users}     bg="bg-[#6A38C2]" />
                    <StatCard label="Pending Review"     value={pending}     icon={Clock}     bg="bg-slate-500" />
                    <StatCard label="Shortlisted"        value={shortlisted} icon={Briefcase} bg="bg-yellow-500" />
                    <StatCard label="Hired"              value={hired}       icon={UserCheck} bg="bg-green-500" />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
                    {/* Area Chart */}
                    <div className='md:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-100'>
                        <h2 className='font-semibold text-gray-700 mb-4'>Applications Over Time</h2>
                        {areaData.length === 0
                            ? <p className='text-gray-400 text-sm text-center py-16'>No data yet</p>
                            : (
                                <ResponsiveContainer width="100%" height={220}>
                                    <AreaChart data={areaData}>
                                        <defs>
                                            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%"  stopColor="#6A38C2" stopOpacity={0.25} />
                                                <stop offset="95%" stopColor="#6A38C2" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                                        <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="Applications" stroke="#6A38C2" fill="url(#grad)" strokeWidth={2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )
                        }
                    </div>

                    {/* Pie Chart */}
                    <div className='bg-white rounded-xl p-5 shadow-sm border border-gray-100'>
                        <h2 className='font-semibold text-gray-700 mb-4'>Status Breakdown</h2>
                        {pieData.length === 0
                            ? <p className='text-gray-400 text-sm text-center py-16'>No data yet</p>
                            : (
                                <ResponsiveContainer width="100%" height={220}>
                                    <PieChart>
                                        <Pie data={pieData} cx="50%" cy="45%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                                            {pieData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                                        </Pie>
                                        <Tooltip />
                                        <Legend iconType="circle" iconSize={9} />
                                    </PieChart>
                                </ResponsiveContainer>
                            )
                        }
                    </div>
                </div>

                {/* Recent Activity */}
                <div className='bg-white rounded-xl p-5 shadow-sm border border-gray-100'>
                    <h2 className='font-semibold text-gray-700 mb-4'>Recent Activity</h2>
                    {(data?.recentActivity ?? []).length === 0
                        ? <p className='text-gray-400 text-sm text-center py-8'>No recent activity</p>
                        : (
                            <div className='space-y-3'>
                                {data.recentActivity.map((app, i) => (
                                    <div key={i} className='flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors'>
                                        <Avatar className='h-9 w-9 flex-shrink-0'>
                                            <AvatarImage src={app.applicant?.profile?.profilePhoto} />
                                            <AvatarFallback className='bg-purple-100 text-[#6A38C2] text-xs font-semibold'>
                                                {app.applicant?.fullname?.[0]?.toUpperCase() ?? "?"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className='flex-1 min-w-0'>
                                            <p className='text-sm font-medium text-gray-800 truncate'>
                                                <span className='text-[#6A38C2]'>{app.applicant?.fullname ?? "Someone"}</span>
                                                {" applied for "}
                                                <span className='font-semibold'>{app.job?.title ?? "a job"}</span>
                                            </p>
                                            <p className='text-xs text-gray-400'>{timeAgo(app.createdAt)}</p>
                                        </div>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0
                                            ${STATUS_COLORS[app.status] ? "" : "bg-gray-100 text-gray-600"}`}
                                            style={{ backgroundColor: STATUS_COLORS[app.status] + "22", color: STATUS_COLORS[app.status] }}>
                                            {STATUS_LABELS[app.status] ?? app.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard
