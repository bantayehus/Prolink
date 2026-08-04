// 'use client';
// import { useState, useEffect, useCallback } from 'react';
// import { Download, Search, RefreshCw, Loader2, ChevronLeft, ChevronRight, Users, UserCheck, UserX } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { MetricCard } from '@/components/ui/metric-card';
// import { apiClient } from '@/lib/api';

// const ITEMS_PER_PAGE = 10; // Adjust as needed

// export default function CustomersPage() {
//   const [customers, setCustomers] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);

//   const fetchCustomers = useCallback(async () => {
//     setLoading(true);
//     try {
//       const data = await apiClient.getCustomers();
//       setCustomers(Array.isArray(data) ? data : []);
//       setCurrentPage(1); // Reset to first page on refresh
//     } catch (error) {
//       console.error("Error fetching customers:", error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchCustomers();
//   }, [fetchCustomers]);

//   // CSV Export Function
//   const handleExport = () => {
//     const headers = ["Full Name", "Email", "Phone", "Address", "Gender", "Status"];
//     const rows = customers.map(c => [c.fullName, c.email, c.phone, c.address, c.gender, c.status]);
//     const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    
//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'customers_list.csv';
//     a.click();
//   };

//   const filteredCustomers = customers.filter((c) =>
//     c.fullName?.toLowerCase().includes(search.toLowerCase()) ||
//     c.email?.toLowerCase().includes(search.toLowerCase())
//   );

//   // Pagination Logic
//   const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

//   const goToPage = (page: number) => {
//     setCurrentPage(Math.max(1, Math.min(page, totalPages)));
//   };

//   if (loading) return (
//     <div className="h-screen flex items-center justify-center">
//       <Loader2 className="animate-spin" size={32} />
//     </div>
//   );

//   return (
//     <div className="p-8 bg-slate-50 min-h-screen space-y-6">
//       <div className="bg-white border-b border-slate-200 px-8 py-6">
//         <div className="flex flex-wrap justify-between items-center gap-4">
//           <div>
//             <h1 className="text-3xl font-bold text-slate-900">Customer Management</h1>
//             <p className="text-slate-500 mt-1 text-sm">
//               {customers.length} total customers
//             </p>
//           </div>
//           <div className="flex gap-3">
//             <button
//               onClick={fetchCustomers}
//               className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
//             >
//               <RefreshCw size={15} /> Refresh
//             </button>
//             <button
//               onClick={handleExport}
//               className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium transition shadow-sm shadow-teal-500/30"
//             >
//               <Download size={15} /> Export CSV
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Metric Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <MetricCard label="Total Customers" value={customers.length} bgColor="bg-indigo-700 / bg-blue-700" icon={Users} />
//         <MetricCard label="Active" value={customers.filter(c => c.status === 'Active').length} bgColor="bg-green-300" icon={UserCheck} />
//         <MetricCard label="Inactive" value={customers.filter(c => c.status !== 'Active').length} bgColor="bg-red-300" icon={UserX} />
//       </div>

//       {/* Search */}
//       <div className="relative">
//         <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
//         <input
//           type="text"
//           placeholder="Search customer..."
//           value={search}
//           onChange={(e) => { 
//             setSearch(e.target.value); 
//             setCurrentPage(1); // Reset to first page on search
//           }}
//           className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500 bg-white w-64"
//         />
//       </div>

//       {/* Data Table */}
//       <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
//         <table className="w-full text-sm">
//           <thead className="bg-slate-50">
//             <tr>
//               {['Name', 'Email', 'Phone', 'Address', 'Gender', 'Status'].map(h => (
//                 <th key={h} className="px-6 py-4 text-left text-slate-400 font-medium uppercase text-[10px]">{h}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-slate-50">
//             {paginatedCustomers.map((c, i) => (
//               <tr key={i} className="hover:bg-slate-50">
//                 <td className="px-6 py-4 font-semibold">{c.fullName}</td>
//                 <td className="px-6 py-4 text-slate-600">{c.email}</td>
//                 <td className="px-6 py-4 text-slate-600">{c.phone}</td>
//                 <td className="px-6 py-4 text-slate-600">{c.address}</td>
//                 <td className="px-6 py-4 text-slate-600">{c.gender}</td>
//                 <td className="px-6 py-4">
//                   <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${c.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
//                     {c.status}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t bg-slate-50">
//             <p className="text-sm text-slate-500 mb-3 sm:mb-0">
//               Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredCustomers.length)} of {filteredCustomers.length} customers
//             </p>

//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => goToPage(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className="px-3 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
//               >
//                 <ChevronLeft size={18} />
//               </button>

//               {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
//                 <button
//                   key={page}
//                   onClick={() => goToPage(page)}
//                   className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
//                     currentPage === page 
//                       ? 'bg-teal-600 text-white' 
//                       : 'bg-white border border-slate-200 hover:bg-slate-50'
//                   }`}
//                 >
//                   {page}
//                 </button>
//               ))}

//               <button
//                 onClick={() => goToPage(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className="px-3 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
//               >
//                 <ChevronRight size={18} />
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  Download,
  Search,
  RefreshCw,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Users,
  UserCheck,
  UserX,
} from 'lucide-react';
import { apiClient } from '@/lib/api';

const ITEMS_PER_PAGE = 10;

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.getCustomers();
      setCustomers(Array.isArray(data) ? data : []);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleExport = () => {
    const headers = ['Full Name', 'Email', 'Phone', 'Address', 'Gender', 'Status'];
    const rows = customers.map((c) => [
      c.fullName,
      c.email,
      c.phone,
      c.address,
      c.gender,
      c.status,
    ]);
    const csvContent = [headers, ...rows].map((e) => e.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers_list.csv';
    a.click();
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCustomers = filteredCustomers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const activeCount = customers.filter((c) => c.status === 'Active').length;
  const inactiveCount = customers.length - activeCount;

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          <p className="text-slate-400 text-sm">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Page Header */}
      <div className="border-b border-slate-800 px-6 lg:px-8 py-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Customer Management</h1>
            <p className="text-slate-400 mt-1 text-sm">
              {customers.length} total customers
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchCustomers}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white rounded-xl text-sm font-medium transition"
            >
              <RefreshCw size={15} /> Refresh
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-indigo-500/20"
            >
              <Download size={15} /> Export CSV
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 lg:p-8 space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              label: 'Total Customers',
              value: customers.length,
              icon: Users,
              gradient: 'from-indigo-600 to-purple-600',
            },
            {
              label: 'Active',
              value: activeCount,
              icon: UserCheck,
              gradient: 'from-emerald-600 to-teal-600',
            },
            {
              label: 'Inactive',
              value: inactiveCount,
              icon: UserX,
              gradient: 'from-rose-600 to-red-600',
            },
          ].map((s, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-5"
            >
              <div className={`absolute inset-0 opacity-15 bg-gradient-to-br ${s.gradient}`} />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    {s.label}
                  </p>
                  <p className="text-3xl font-bold text-white mt-1">{s.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${s.gradient}`}>
                  <s.icon size={22} className="text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-xs">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            placeholder="Search customer..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-800/60 border-b border-slate-800 text-slate-400 uppercase text-xs tracking-wide">
                <tr>
                  {['Name', 'Email', 'Phone', 'Address', 'Gender', 'Status'].map((h) => (
                    <th key={h} className="px-6 py-4 text-left font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {paginatedCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center text-slate-500">
                      No customers found
                    </td>
                  </tr>
                ) : (
                  paginatedCustomers.map((c, i) => (
                    <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {c.fullName?.[0] ?? '?'}
                          </div>
                          <span className="font-semibold text-white">{c.fullName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-400">{c.email}</td>
                      <td className="px-6 py-4 text-slate-400 font-mono">{c.phone}</td>
                      <td className="px-6 py-4 text-slate-400">{c.address}</td>
                      <td className="px-6 py-4 text-slate-400 capitalize">{c.gender}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                            c.status === 'Active'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-slate-700/50 text-slate-400 border border-slate-600'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-slate-800">
              <p className="text-sm text-slate-400 mb-3 sm:mb-0">
                Showing {startIndex + 1} to{' '}
                {Math.min(startIndex + ITEMS_PER_PAGE, filteredCustomers.length)} of{' '}
                {filteredCustomers.length} customers
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-slate-700 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft size={18} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      currentPage === page
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-slate-700 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}