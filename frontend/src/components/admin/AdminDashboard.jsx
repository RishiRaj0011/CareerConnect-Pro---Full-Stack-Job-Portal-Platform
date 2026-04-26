import React from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
} from 'recharts'
import Navbar from '../shared/Navbar'

const STATUS_COLORS_MAP = {
    pending:      "#94a3b8",
    under_review: "#60a5fa",
    shortlisted:  "#fbbf24",
    hired:        "#22c55e",
    rejected:     "#f87171",
};

const fetchStats = async () => {
    const res = await axios.get(`${APPLICATION_API_END_POINT}/stats`, { withCredentials: true });
    return res.data;
};

const StatCard = ({ label, value, color }) => (
    <div className={`rounded-xl p-5 text-white ${color} shadow-md`}>
        <p className='text-sm opacity-80'>{label}</p>
        <p className='text-3xl font-bold mt-1'>{value}</p>
    </div>
);

const AdminDashboard = () => {
    const { data, isLoading } = useQuery({ queryKey: ["appStats"], queryFn: fetchStats });

    const totalApps   = data?.statusBreakdown?.reduce((s, i) => s + i.count, 0) ?? 0;
    const hired       = data?.statusBreakdown?.find(s => s._id === "hired")?.count ?? 0;
    const shortlisted = data?.statusBreakdown?.find(s => s._id === "shortlisted")?.count ?? 0;
    const pending     = data?.statusBreakdown?.find(s => s._id === "pending")?.count ?? 0;

    const pieData = (data?.statusBreakdown ?? []).map(s => ({
        name:  s._id.replace("_", " "),
        value: s.count,
        fill:  STATUS_COLORS_MAP[s._id] ?? "#cbd5e1",
    }));

    const areaData = (data?.stats ?? []).map(s => ({ date: s._id, Applications: s.count }));

    if (isLoading) return (
        <div>
            <Navbar />
            <div className='max-w-6xl mx-auto my-10 animate-pulse'>
                <div className='grid grid-cols-4 gap-4 mb-8'>
                    {Array.from({ length: 4 }).map((_, i) => <div key={i} className='h-24 bg-gray-200 rounded-xl' />)}
                </div>
                <div className='h-64 bg-gray-200 rounded-xl' />
            </div>
        </div>
    );

    return (
        <div>
            <Navbar />
            <div className='max-w-6xl mx-auto my-10 px-4'>
                <h1 className='text-2xl font-bold mb-6'>Recruiter Dashboard</h1>

                {/* Stat Cards */}
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
                    <StatCard label="Total Applications" value={totalApps}   color="bg-[#6A38C2]" />
                    <StatCard label="Pending Review"     value={pending}     color="bg-slate-500" />
                    <StatCard label="Shortlisted"        value={shortlisted} color="bg-yellow-500" />
                    <StatCard label="Hired"              value={hired}       color="bg-green-500" />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {/* Area Chart */}
                    <div className='md:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-gray-100'>
                        <h2 className='font-semibold text-gray-700 mb-4'>Applications Over Time</h2>
                        <ResponsiveContainer width="100%" height={240}>
                            <AreaChart data={areaData}>
                                <defs>
                                    <linearGradient id="appGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%"  stopColor="#6A38C2" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6A38C2" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                                <Tooltip />
                                <Area type="monotone" dataKey="Applications" stroke="#6A38C2" fill="url(#appGrad)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Pie Chart */}
                    <div className='bg-white rounded-xl p-5 shadow-sm border border-gray-100'>
                        <h2 className='font-semibold text-gray-700 mb-4'>Status Breakdown</h2>
                        {pieData.length === 0
                            ? <p className='text-gray-400 text-sm text-center mt-10'>No data yet</p>
                            : (
                                <ResponsiveContainer width="100%" height={240}>
                                    <PieChart>
                                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                                            {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                                        </Pie>
                                        <Tooltip />
                                        <Legend iconType="circle" iconSize={10} />
                                    </PieChart>
                                </ResponsiveContainer>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard
