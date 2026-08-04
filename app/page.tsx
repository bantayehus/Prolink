// 'use client';
// import { useState, useEffect, useCallback } from 'react';
// import { Star, LayoutDashboard, Loader2, RefreshCw, PieChart as PieIcon, BarChart3, Users } from 'lucide-react';
// import { apiClient } from '@/lib/api';
// import { PieChart, Pie, Cell, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
// import { useAuth } from "@/context/AuthContext"; // Import your authentication hook

// // Reusable decorated Metric Card
// const MetricCard = ({ label, value, colorClass, bgColor }: any) => (
//   <div className={`p-6 rounded-2xl border shadow-sm ${bgColor} transition-transform hover:scale-[1.02]`}>
//     <p className="text-[10px] font-bold tracking-widest text-white/80 uppercase">{label}</p>
//     <h3 className={`text-3xl font-extrabold mt-2 ${colorClass}`}>
//       {value?.toLocaleString()}
//     </h3>
//   </div>
// );

// export default function Dashboard() {
//   const [stats, setStats] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
  
//   // Access auth state from your AuthContext
//   const { isAuthenticated, loading: authLoading } = useAuth();

//   const fetchData = useCallback(async () => {
//     // Only attempt to fetch if the user is authenticated
//     if (!isAuthenticated) return;
    
//     setLoading(true);
//     try {
//       const data = await apiClient.getDashboard();
//       setStats(data);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, [isAuthenticated]);

//   // Trigger fetch only when auth state is fully loaded and confirmed
//   useEffect(() => {
//     if (!authLoading && isAuthenticated) {
//       fetchData();
//     }
//   }, [authLoading, isAuthenticated, fetchData]);

//   // Loading state: Show spinner if Auth is still checking OR if Data is still fetching
//   if (authLoading || (loading && isAuthenticated)) {
//     return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" size={32} /></div>;
//   }

//   // If not authenticated, the AuthProvider/Layout will handle the redirection
//   if (!isAuthenticated) return null;

//   // Pie Chart and Bar Chart data (using optional chaining for safety)
//   const pieData = [
//     { name: 'Completed', value: (stats?.totalOrders || 0) - (stats?.pendingRequests || 0), color: '#0d9488' },
//     { name: 'Pending', value: stats?.pendingRequests || 0, color: '#f97316' },
//   ];

//   const barData = (stats?.topProviders || []).map((p: any) => ({ name: p[0], orders: p[2] }));

//   return (
//     <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-slate-900">System Dashboard</h1>
//         <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 text-sm font-medium">
//           <RefreshCw size={16} /> Refresh
//         </button>
//       </div>
      
//       {/* Decorative Metric Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <MetricCard label="TOTAL PROVIDERS" value={stats?.totalProviders} colorClass="text-white" bgColor="bg-teal-600" />
//         <MetricCard label="ACTIVE CUSTOMERS" value={stats?.totalCustomers} colorClass="text-white" bgColor="bg-blue-900" />
//         <MetricCard label="TOTAL ORDERS" value={stats?.totalOrders} colorClass="text-white" bgColor="bg-emerald-600" />
//         <MetricCard label="PENDING REQUESTS" value={stats?.pendingRequests} colorClass="text-white" bgColor="bg-orange-500" />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Top Providers Table */}
//         <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
//           <h2 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
//             <Users size={18} className="text-teal-600" /> Top Providers
//           </h2>
//           <table className="w-full text-sm">
//             <thead className="text-slate-400 border-b border-slate-100">
//               <tr>
//                 <th className="pb-3 text-left">Provider</th>
//                 <th className="pb-3 text-left">Service/profession</th>
//                 <th className="pb-3 text-right">Orders</th>
//                 <th className="pb-3 text-right">Rating</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-50">
//               {stats?.topProviders.map((p: any, i: number) => (
//                 <tr key={i} className="hover:bg-slate-50">
//                   <td className="py-4 font-semibold text-slate-900">{p[0]}</td>
//                   <td className="py-4 text-slate-600">{p[1]}</td>
//                   <td className="py-4 text-right font-bold text-teal-600">{p[2]}</td>
//                   <td className="py-4 text-right flex items-center justify-end gap-1 text-amber-500">
//                     <Star size={14} fill="currentColor" /> {p[3]?.toFixed(1)}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Charts Container */}
//         <div className="grid grid-rows-2 gap-6">
//             <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center">
//                 <h2 className="font-bold mb-4 flex items-center gap-2"><PieIcon size={18} /> Order Status</h2>
//                 <ResponsiveContainer width="100%" height={150}>
//                     <PieChart>
//                     <Pie data={pieData} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
//                         {pieData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
//                     </Pie>
//                     <Tooltip />
//                     </PieChart>
//                 </ResponsiveContainer>
//             </div>
//             <div className="bg-white p-6 rounded-2xl border shadow-sm">
//                 <h2 className="font-bold mb-4 flex items-center gap-2"><BarChart3 size={18} /> Performance</h2>
//                 <ResponsiveContainer width="100%" height={150}>
//                     <BarChart data={barData}>
//                     <XAxis dataKey="name" fontSize={10} />
//                     <Tooltip />
//                     <Bar dataKey="orders" fill="#0d9488" radius={[4, 4, 0, 0]} />
//                     </BarChart>
//                 </ResponsiveContainer>
//             </div>
//         </div>
//       </div>
//     </div>
//   );
// }


'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  Star,
  Loader2,
  RefreshCw,
  PieChart as PieIcon,
  BarChart3,
  Users,
  UserCheck,
  ShoppingCart,
  Clock,
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/context/AuthContext';

// Reusable Metric Card – dark theme version
const MetricCard = ({
  label,
  value,
  icon: Icon,
  gradient,
}: {
  label: string;
  value: number | undefined;
  icon: any;
  gradient: string;
}) => (
  <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
    <div className={`absolute inset-0 opacity-20 ${gradient}`} />
    <div className="relative flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          {label}
        </p>
        <h3 className="mt-2 text-3xl font-bold text-white">
          {value?.toLocaleString() ?? '—'}
        </h3>
      </div>
      <div className={`p-3 rounded-xl ${gradient} bg-opacity-20`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { isAuthenticated, loading: authLoading } = useAuth();

  const fetchData = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const data = await apiClient.getDashboard();
      setStats(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchData();
    }
  }, [authLoading, isAuthenticated, fetchData]);

  if (authLoading || (loading && isAuthenticated)) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          <p className="text-slate-400 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const pieData = [
    {
      name: 'Completed',
      value: (stats?.totalOrders || 0) - (stats?.pendingRequests || 0),
      color: '#6366f1', // indigo-500
    },
    {
      name: 'Pending',
      value: stats?.pendingRequests || 0,
      color: '#f97316', // orange-500
    },
  ];

  const barData = (stats?.topProviders || []).map((p: any) => ({
    name: p[0],
    orders: p[2],
  }));

  return (
    <div className="p-6 lg:p-8 space-y-8 bg-slate-950 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">System Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">
            Overview of providers, customers and orders
          </p>
        </div>
        <button
          onClick={fetchData}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white rounded-xl text-sm font-medium transition"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <MetricCard
          label="Total Providers"
          value={stats?.totalProviders}
          icon={UserCheck}
          gradient="bg-gradient-to-br from-indigo-600 to-purple-600"
        />
        <MetricCard
          label="Active Customers"
          value={stats?.totalCustomers}
          icon={Users}
          gradient="bg-gradient-to-br from-blue-600 to-cyan-600"
        />
        <MetricCard
          label="Total Orders"
          value={stats?.totalOrders}
          icon={ShoppingCart}
          gradient="bg-gradient-to-br from-emerald-600 to-teal-600"
        />
        <MetricCard
          label="Pending Requests"
          value={stats?.pendingRequests}
          icon={Clock}
          gradient="bg-gradient-to-br from-orange-500 to-amber-600"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Top Providers Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-800 flex items-center gap-2">
            <Users size={18} className="text-indigo-400" />
            <h2 className="font-semibold text-white">Top Providers</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800">
                  <th className="px-6 py-4 text-left font-medium">Provider</th>
                  <th className="px-6 py-4 text-left font-medium">Service / Profession</th>
                  <th className="px-6 py-4 text-right font-medium">Orders</th>
                  <th className="px-6 py-4 text-right font-medium">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {stats?.topProviders?.map((p: any, i: number) => (
                  <tr key={i} className="hover:bg-slate-800/50 transition">
                    <td className="px-6 py-4 font-medium text-white">{p[0]}</td>
                    <td className="px-6 py-4 text-slate-400">{p[1]}</td>
                    <td className="px-6 py-4 text-right font-semibold text-indigo-400">
                      {p[2]}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center gap-1 text-amber-400">
                        <Star size={14} fill="currentColor" />
                        {p[3]?.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts */}
        <div className="space-y-6">
          {/* Order Status Pie */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <PieIcon size={18} className="text-indigo-400" />
              <h2 className="font-semibold text-white">Order Status</h2>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '12px',
                    color: '#e2e8f0',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Performance Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 size={18} className="text-indigo-400" />
              <h2 className="font-semibold text-white">Performance</h2>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={barData}>
                <XAxis
                  dataKey="name"
                  fontSize={11}
                  tick={{ fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '12px',
                    color: '#e2e8f0',
                  }}
                />
                <Bar
                  dataKey="orders"
                  fill="#6366f1"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}