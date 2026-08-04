// 'use client';
// import { useState, useEffect } from 'react';
// import {
//   ShoppingCart, CheckCircle, Clock, XCircle,
//   Search, RefreshCw, Download, ChevronLeft, ChevronRight,
//   User, Briefcase, Phone, MapPin, Calendar, DollarSign, Hash, ArrowUpRight
// } from 'lucide-react';
// import { apiClient } from '@/lib/api';
// import { exportToCSV } from '@/lib/exportUtils';
// import { useRouter } from 'next/navigation';

// interface Order {
//   id: number;
//   serviceName: string | null;
//   professionalTitle: string | null;
//   price: number | null;
//   requestDate: string | null;
//   status: string;
//   customerId: number | null;
//   customerName: string | null;
//   customerAddress: string | null;
//   customerPhone: string | null;
//   providerId: number | null;
//   providerName: string | null;
//   providerAddress: string | null;
//   providerPhone: string | null;
// }

// type FilterStatus = 'all' | 'pending' | 'accepted' | 'completed' | 'rejected';

// const STATUS_STYLES: Record<string, string> = {
//   pending:   'bg-amber-100 text-amber-700 border border-amber-200',
//   accepted:  'bg-blue-100 text-blue-700 border border-blue-200',
//   completed: 'bg-green-100 text-green-700 border border-green-200',
//   rejected:  'bg-red-100 text-red-700 border border-red-200',
// };

// const STATUS_DOT: Record<string, string> = {
//   pending:   'bg-amber-500',
//   accepted:  'bg-blue-500',
//   completed: 'bg-green-500',
//   rejected:  'bg-red-500',
// };

// const ITEMS_PER_PAGE = 7; // Change as needed

// export default function OrdersPage() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState<FilterStatus>('all');
//   const [search, setSearch] = useState('');
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
//   // Pagination State
//   const [currentPage, setCurrentPage] = useState(1);

//   const router = useRouter();

//   useEffect(() => {
//     const token = apiClient.getToken();
//     if (!token) { router.push('/login'); return; }
//     fetchOrders();
//   }, [router]);

//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const data = await apiClient.getAllOrders();
//       const list: Order[] = Array.isArray(data) ? data : data.orders || data.data || [];
//       setOrders(list);
//       setCurrentPage(1); // Reset to first page
//     } catch (error: any) {
//       if (error.message.includes('401') || error.message.includes('token')) {
//         apiClient.clearToken();
//         router.push('/login');
//       } else {
//         setFeedback({ type: 'error', message: 'Failed to load orders' });
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filtered = orders.filter(o => {
//     const matchesFilter = filter === 'all' || o.status?.toLowerCase() === filter;
//     const matchesSearch =
//       o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
//       o.providerName?.toLowerCase().includes(search.toLowerCase()) ||
//       o.serviceName?.toLowerCase().includes(search.toLowerCase()) ||
//       String(o.id).includes(search);
//     return matchesFilter && matchesSearch;
//   });

//   // Stats
//   const stats = {
//     total:     orders.length,
//     completed: orders.filter(o => o.status?.toLowerCase() === 'completed').length,
//     accepted: orders.filter(o => o.status?.toLowerCase() === 'accepted').length,
//     pending:   orders.filter(o => o.status?.toLowerCase() === 'pending').length,
//     rejected:  orders.filter(o => o.status?.toLowerCase() === 'rejected').length,
//   };

//   const handleExport = () => {
//     const exportData = filtered.map(o => ({
//       'Order ID':         o.id,
//       'Service':          o.serviceName ?? '—',
//       'Professional Title': o.professionalTitle ?? '—',
//       'Price (ETB)':      o.price ?? '—',
//       'Date':             o.requestDate ? new Date(o.requestDate).toLocaleDateString() : '—',
//       'Status':           o.status,
//       'Customer Name':    o.customerName ?? '—',
//       'Customer Phone':   o.customerPhone ?? '—',
//       'Customer Address': o.customerAddress ?? '—',
//       'Provider Name':    o.providerName ?? '—',
//       'Provider Phone':   o.providerPhone ?? '—',
//       'Provider Address': o.providerAddress ?? '—',
//     }));
//     exportToCSV(exportData, 'orders');
//   };

//   // Pagination Logic
//   const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const paginatedOrders = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

//   const goToPage = (page: number) => {
//     setCurrentPage(Math.max(1, Math.min(page, totalPages)));
//   };

//   return (
//     <div className="min-h-screen bg-slate-50">

//       {/* Page Header - unchanged */}
//       <div className="bg-white border-b border-slate-200 px-8 py-6">
//         <div className="flex flex-wrap justify-between items-center gap-4">
//           <div>
//             <h1 className="text-3xl font-bold text-slate-900">Orders</h1>
//             <p className="text-slate-500 mt-1 text-sm">{orders.length} total orders across all providers</p>
//           </div>
//           <div className="flex gap-3">
//             <button onClick={fetchOrders} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
//               <RefreshCw size={15} /> Refresh
//             </button>
//             <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium transition shadow-sm shadow-teal-500/30">
//               <Download size={15} /> Export CSV
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="p-8 space-y-6">

//         {/* Feedback - unchanged */}
//         {feedback && (
//           <div className={`px-5 py-4 rounded-2xl text-sm font-medium ${
//             feedback.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
//           }`}>
//             {feedback.message}
//           </div>
//         )}

//         {/* Stat Cards - unchanged */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//           {[
//             { label: 'Total Orders',  value: stats.total,     icon: ShoppingCart, color: 'text-slate-700',  bg: 'bg-slate-100' },
//             { label: 'accepted',     value: stats.accepted, icon: CheckCircle,  color: 'text-green-600', bg: 'bg-green-50'  },
//             { label: 'Pending',       value: stats.pending,   icon: Clock,        color: 'text-amber-600', bg: 'bg-amber-50'  },
//             { label: 'Rejected',      value: stats.rejected,  icon: XCircle,      color: 'text-red-600',   bg: 'bg-red-50'    },
//           ].map((s, i) => (
//             <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center justify-between shadow-sm">
//               <div>
//                 <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{s.label}</p>
//                 <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
//               </div>
//               <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center`}>
//                 <s.icon size={22} className={s.color} />
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Filters + Search */}
//         <div className="flex flex-wrap gap-3 items-center justify-between">
//           <div className="flex gap-2 flex-wrap">
//             {(['all', 'pending', 'accepted', 'completed', 'rejected'] as FilterStatus[]).map(f => (
//               <button
//                 key={f}
//                 onClick={() => { setFilter(f); setCurrentPage(1); }}
//                 className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
//                   filter === f ? 'bg-teal-600 text-white shadow' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
//                 }`}
//               >
//                 {f}
//                 {f !== 'all' && (
//                   <span className="ml-1.5 text-xs opacity-70">
//                     ({orders.filter(o => o.status?.toLowerCase() === f).length})
//                   </span>
//                 )}
//               </button>
//             ))}
//           </div>

//           <div className="relative">
//             <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
//             <input
//               type="text"
//               placeholder="Search orders..."
//               value={search}
//               onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
//               className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500 bg-white w-64"
//             />
//           </div>
//         </div>

//         {/* Table */}
//         {loading ? (
//           <div className="flex flex-col items-center justify-center py-32 gap-4">
//             <div className="animate-spin w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full" />
//             <p className="text-slate-400">Loading orders...</p>
//           </div>
//         ) : filtered.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-32 gap-3">
//             <ShoppingCart size={40} className="text-slate-300" />
//             <p className="text-slate-400 font-medium">No orders found</p>
//           </div>
//         ) : (
//           <>
//             <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
//   <table className="w-full text-sm">
//     <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs tracking-wide">
//       <tr>
//         <th className="px-6 py-4 text-left">Order ID</th>
//         <th className="px-6 py-4 text-left">Service</th>
//         <th className="px-6 py-4 text-left">Customer</th>
//         <th className="px-6 py-4 text-left">Provider</th>
//         <th className="px-6 py-4 text-left">Date</th>
//         <th className="px-6 py-4 text-left">Price</th>
//         <th className="px-6 py-4 text-left">Status</th>
//         <th className="px-6 py-4 text-center">Details</th>
//       </tr>
//     </thead>
//     <tbody className="divide-y divide-slate-100">
//       {paginatedOrders.map((o, index) => (
//         <tr 
//           key={`${o.id}-${o.serviceName || 'unknown'}-${index}`} 
//           className="hover:bg-slate-50 transition-colors"
//         >
//           <td className="px-6 py-4">
//             <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg text-xs">
//               #{o.id}
//             </span>
//           </td>
//           <td className="px-6 py-4">
//             <p className="font-semibold text-slate-800">{o.serviceName ?? '—'}</p>
//             <p className="text-xs text-slate-400 mt-0.5">{o.professionalTitle ?? ''}</p>
//           </td>
//           <td className="px-6 py-4">
//             <div className="flex items-center gap-2.5">
//               <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
//                 {o.customerName?.[0] ?? '?'}
//               </div>
//               <div>
//                 <p className="font-medium text-slate-800">{o.customerName ?? '—'}</p>
//                 <p className="text-xs text-slate-400 font-mono">{o.customerPhone ?? ''}</p>
//               </div>
//             </div>
//           </td>
//           <td className="px-6 py-4">
//             <div className="flex items-center gap-2.5">
//               <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
//                 {o.providerName?.[0] ?? '?'}
//               </div>
//               <div>
//                 <p className="font-medium text-slate-800">{o.providerName ?? '—'}</p>
//                 <p className="text-xs text-slate-400 font-mono">{o.providerPhone ?? ''}</p>
//               </div>
//             </div>
//           </td>
//           <td className="px-6 py-4 text-slate-500 text-xs">
//             {o.requestDate
//               ? new Date(o.requestDate).toLocaleDateString('en-GB', {
//                   day: '2-digit', month: 'short', year: 'numeric'
//                 })
//               : '—'}
//           </td>
//           <td className="px-6 py-4 font-bold text-slate-800">
//             {o.price != null ? `${o.price.toLocaleString()} ETB` : '—'}
//           </td>
//           <td className="px-6 py-4">
//             <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${
//               STATUS_STYLES[o.status?.toLowerCase()] ?? 'bg-slate-100 text-slate-600'
//             }`}>
//               <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[o.status?.toLowerCase()] ?? 'bg-slate-400'}`} />
//               {o.status}
//             </span>
//           </td>
//           <td className="px-6 py-4 text-center">
//             <button
//               onClick={() => setSelectedOrder(o)}
//               className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
//             >
//               <ArrowUpRight size={13} /> View
//             </button>
//           </td>
//         </tr>
//       ))}
//     </tbody>
//   </table>
// </div>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="flex flex-col sm:flex-row items-center justify-between mt-6 px-2">
//                 <p className="text-sm text-slate-500 mb-4 sm:mb-0">
//                   Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)} of {filtered.length} orders
//                 </p>

//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={() => goToPage(currentPage - 1)}
//                     disabled={currentPage === 1}
//                     className="px-3 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
//                   >
//                     <ChevronLeft size={18} />
//                   </button>

//                   {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
//                     <button
//                       key={page}
//                       onClick={() => goToPage(page)}
//                       className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
//                         currentPage === page 
//                           ? 'bg-teal-600 text-white' 
//                           : 'bg-white border border-slate-200 hover:bg-slate-50'
//                       }`}
//                     >
//                       {page}
//                     </button>
//                   ))}

//                   <button
//                     onClick={() => goToPage(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                     className="px-3 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
//                   >
//                     <ChevronRight size={18} />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* Order Detail Modal */}
//       {selectedOrder && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

//             {/* Modal Header */}
//             <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white px-8 py-6 flex items-center justify-between flex-shrink-0">
//               <div>
//                 <p className="text-slate-400 text-xs mb-1">Order Details</p>
//                 <h2 className="text-xl font-bold font-mono">#{selectedOrder.id}</h2>
//               </div>
//               <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase ${
//                 STATUS_STYLES[selectedOrder.status?.toLowerCase()] ?? 'bg-slate-100 text-slate-600'
//               }`}>
//                 <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[selectedOrder.status?.toLowerCase()] ?? 'bg-slate-400'}`} />
//                 {selectedOrder.status}
//               </span>
//             </div>

//             {/* Modal Body */}
//             <div className="p-8 overflow-y-auto space-y-6">

//               {/* Service Info */}
//               <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-3">
//                 <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Service Info</p>
//                 <ModalRow icon={<Briefcase size={15} />} label="Service Name"       value={selectedOrder.serviceName ?? '—'} />
//                 <ModalRow icon={<Hash size={15} />}      label="Professional Title" value={selectedOrder.professionalTitle ?? '—'} />
//                 <ModalRow icon={<DollarSign size={15} />} label="Price"             value={selectedOrder.price != null ? `${selectedOrder.price.toLocaleString()} ETB` : '—'} />
//                 <ModalRow icon={<Calendar size={15} />}  label="Date"               value={selectedOrder.requestDate ? new Date(selectedOrder.requestDate).toLocaleString() : '—'} />
//               </div>

//               {/* Customer + Provider side by side */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//                 {/* Customer */}
//                 <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 space-y-3">
//                   <div className="flex items-center gap-2 mb-1">
//                     <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
//                       {selectedOrder.customerName?.[0] ?? '?'}
//                     </div>
//                     <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">Customer</p>
//                   </div>
//                   <ModalRow icon={<User size={15} />}    label="Name"    value={selectedOrder.customerName ?? '—'} />
//                   <ModalRow icon={<Phone size={15} />}   label="Phone"   value={selectedOrder.customerPhone ?? '—'} />
//                   <ModalRow icon={<MapPin size={15} />}  label="Address" value={selectedOrder.customerAddress ?? '—'} />
//                 </div>

//                 {/* Provider */}
//                 <div className="bg-teal-50 rounded-2xl p-5 border border-teal-100 space-y-3">
//                   <div className="flex items-center gap-2 mb-1">
//                     <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center text-white text-xs font-bold">
//                       {selectedOrder.providerName?.[0] ?? '?'}
//                     </div>
//                     <p className="text-xs font-semibold uppercase tracking-widest text-teal-600">Provider</p>
//                   </div>
//                   <ModalRow icon={<User size={15} />}    label="Name"    value={selectedOrder.providerName ?? '—'} />
//                   <ModalRow icon={<Phone size={15} />}   label="Phone"   value={selectedOrder.providerPhone ?? '—'} />
//                   <ModalRow icon={<MapPin size={15} />}  label="Address" value={selectedOrder.providerAddress ?? '—'} />
//                 </div>
//               </div>
//             </div>

//             {/* Modal Footer */}
//             <div className="px-8 py-5 border-t bg-slate-50 flex justify-between items-center flex-shrink-0">
//               <button
//                 onClick={() => setSelectedOrder(null)}
//                 className="px-5 py-2.5 text-sm border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-600 transition"
//               >
//                 Close
//               </button>
              
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// function ModalRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
//   return (
//     <div className="flex items-start gap-3">
//       <span className="text-slate-400 mt-0.5 flex-shrink-0">{icon}</span>
//       <div>
//         <p className="text-xs text-slate-400">{label}</p>
//         <p className="text-slate-700 font-medium text-sm">{value}</p>
//       </div>
//     </div>
//   );
// }

'use client';
import { useState, useEffect } from 'react';
import {
  ShoppingCart,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  RefreshCw,
  Download,
  ChevronLeft,
  ChevronRight,
  User,
  Briefcase,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Hash,
  ArrowUpRight,
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { exportToCSV } from '@/lib/exportUtils';
import { useRouter } from 'next/navigation';

interface Order {
  id: number;
  serviceName: string | null;
  professionalTitle: string | null;
  price: number | null;
  requestDate: string | null;
  status: string;
  customerId: number | null;
  customerName: string | null;
  customerAddress: string | null;
  customerPhone: string | null;
  providerId: number | null;
  providerName: string | null;
  providerAddress: string | null;
  providerPhone: string | null;
}

type FilterStatus = 'all' | 'pending' | 'accepted' | 'completed' | 'rejected';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  accepted: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
  completed: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  rejected: 'bg-rose-500/15 text-rose-400 border border-rose-500/30',
};

const STATUS_DOT: Record<string, string> = {
  pending: 'bg-amber-400',
  accepted: 'bg-blue-400',
  completed: 'bg-emerald-400',
  rejected: 'bg-rose-400',
};

const ITEMS_PER_PAGE = 7;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter();

  useEffect(() => {
    const token = apiClient.getToken();
    if (!token) {
      router.push('/login');
      return;
    }
    fetchOrders();
  }, [router]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getAllOrders();
      const list: Order[] = Array.isArray(data) ? data : data.orders || data.data || [];
      setOrders(list);
      setCurrentPage(1);
    } catch (error: any) {
      if (error.message.includes('401') || error.message.includes('token')) {
        apiClient.clearToken();
        router.push('/login');
      } else {
        setFeedback({ type: 'error', message: 'Failed to load orders' });
      }
    } finally {
      setLoading(false);
    }
  };

  const filtered = orders.filter((o) => {
    const matchesFilter = filter === 'all' || o.status?.toLowerCase() === filter;
    const matchesSearch =
      o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      o.providerName?.toLowerCase().includes(search.toLowerCase()) ||
      o.serviceName?.toLowerCase().includes(search.toLowerCase()) ||
      String(o.id).includes(search);
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: orders.length,
    completed: orders.filter((o) => o.status?.toLowerCase() === 'completed').length,
    accepted: orders.filter((o) => o.status?.toLowerCase() === 'accepted').length,
    pending: orders.filter((o) => o.status?.toLowerCase() === 'pending').length,
    rejected: orders.filter((o) => o.status?.toLowerCase() === 'rejected').length,
  };

  const handleExport = () => {
    const exportData = filtered.map((o) => ({
      'Order ID': o.id,
      Service: o.serviceName ?? '—',
      'Professional Title': o.professionalTitle ?? '—',
      'Price (ETB)': o.price ?? '—',
      Date: o.requestDate ? new Date(o.requestDate).toLocaleDateString() : '—',
      Status: o.status,
      'Customer Name': o.customerName ?? '—',
      'Customer Phone': o.customerPhone ?? '—',
      'Customer Address': o.customerAddress ?? '—',
      'Provider Name': o.providerName ?? '—',
      'Provider Phone': o.providerPhone ?? '—',
      'Provider Address': o.providerAddress ?? '—',
    }));
    exportToCSV(exportData, 'orders');
  };

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Page Header */}
      <div className="border-b border-slate-800 px-6 lg:px-8 py-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Orders</h1>
            <p className="text-slate-400 mt-1 text-sm">
              {orders.length} total orders across all providers
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchOrders}
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
        {/* Feedback */}
        {feedback && (
          <div
            className={`px-5 py-4 rounded-2xl text-sm font-medium ${
              feedback.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                : 'bg-red-500/10 border border-red-500/30 text-red-300'
            }`}
          >
            {feedback.message}
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              label: 'Total Orders',
              value: stats.total,
              icon: ShoppingCart,
              gradient: 'from-indigo-600 to-purple-600',
            },
            {
              label: 'Accepted',
              value: stats.accepted,
              icon: CheckCircle,
              gradient: 'from-blue-600 to-cyan-600',
            },
            {
              label: 'Pending',
              value: stats.pending,
              icon: Clock,
              gradient: 'from-amber-500 to-orange-600',
            },
            {
              label: 'Rejected',
              value: stats.rejected,
              icon: XCircle,
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

        {/* Filters + Search */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {(['all', 'pending', 'accepted', 'completed', 'rejected'] as FilterStatus[]).map(
              (f) => (
                <button
                  key={f}
                  onClick={() => {
                    setFilter(f);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                    filter === f
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                      : 'bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
                  }`}
                >
                  {f}
                  {f !== 'all' && (
                    <span className="ml-1.5 text-xs opacity-70">
                      ({orders.filter((o) => o.status?.toLowerCase() === f).length})
                    </span>
                  )}
                </button>
              )
            )}
          </div>

          <div className="relative">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
            />
          </div>
        </div>

        {/* Table / Loading / Empty */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full" />
            <p className="text-slate-400">Loading orders...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <ShoppingCart size={40} className="text-slate-600" />
            <p className="text-slate-400 font-medium">No orders found</p>
          </div>
        ) : (
          <>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-800/60 border-b border-slate-800 text-slate-400 uppercase text-xs tracking-wide">
                    <tr>
                      <th className="px-6 py-4 text-left font-medium">Order ID</th>
                      <th className="px-6 py-4 text-left font-medium">Service</th>
                      <th className="px-6 py-4 text-left font-medium">Customer</th>
                      <th className="px-6 py-4 text-left font-medium">Provider</th>
                      <th className="px-6 py-4 text-left font-medium">Date</th>
                      <th className="px-6 py-4 text-left font-medium">Price</th>
                      <th className="px-6 py-4 text-left font-medium">Status</th>
                      <th className="px-6 py-4 text-center font-medium">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {paginatedOrders.map((o, index) => (
                      <tr
                        key={`${o.id}-${o.serviceName || 'unknown'}-${index}`}
                        className="hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <span className="font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg text-xs border border-indigo-500/20">
                            #{o.id}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-white">{o.serviceName ?? '—'}</p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {o.professionalTitle ?? ''}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {o.customerName?.[0] ?? '?'}
                            </div>
                            <div>
                              <p className="font-medium text-slate-200">
                                {o.customerName ?? '—'}
                              </p>
                              <p className="text-xs text-slate-500 font-mono">
                                {o.customerPhone ?? ''}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {o.providerName?.[0] ?? '?'}
                            </div>
                            <div>
                              <p className="font-medium text-slate-200">
                                {o.providerName ?? '—'}
                              </p>
                              <p className="text-xs text-slate-500 font-mono">
                                {o.providerPhone ?? ''}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-400 text-xs">
                          {o.requestDate
                            ? new Date(o.requestDate).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })
                            : '—'}
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-200">
                          {o.price != null ? `${o.price.toLocaleString()} ETB` : '—'}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                              STATUS_STYLES[o.status?.toLowerCase()] ??
                              'bg-slate-700/50 text-slate-400 border border-slate-600'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                STATUS_DOT[o.status?.toLowerCase()] ?? 'bg-slate-400'
                              }`}
                            />
                            {o.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => setSelectedOrder(o)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white transition"
                          >
                            <ArrowUpRight size={13} /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-6 px-2">
                <p className="text-sm text-slate-400 mb-4 sm:mb-0">
                  Showing {startIndex + 1} to{' '}
                  {Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)} of{' '}
                  {filtered.length} orders
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
          </>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-6 flex items-center justify-between flex-shrink-0">
              <div>
                <p className="text-indigo-200 text-xs mb-1">Order Details</p>
                <h2 className="text-xl font-bold font-mono">#{selectedOrder.id}</h2>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase ${
                  STATUS_STYLES[selectedOrder.status?.toLowerCase()] ??
                  'bg-slate-700/50 text-slate-300 border border-slate-600'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    STATUS_DOT[selectedOrder.status?.toLowerCase()] ?? 'bg-slate-400'
                  }`}
                />
                {selectedOrder.status}
              </span>
            </div>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto space-y-6">
              {/* Service Info */}
              <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Service Info
                </p>
                <ModalRow
                  icon={<Briefcase size={15} />}
                  label="Service Name"
                  value={selectedOrder.serviceName ?? '—'}
                />
                <ModalRow
                  icon={<Hash size={15} />}
                  label="Professional Title"
                  value={selectedOrder.professionalTitle ?? '—'}
                />
                <ModalRow
                  icon={<DollarSign size={15} />}
                  label="Price"
                  value={
                    selectedOrder.price != null
                      ? `${selectedOrder.price.toLocaleString()} ETB`
                      : '—'
                  }
                />
                <ModalRow
                  icon={<Calendar size={15} />}
                  label="Date"
                  value={
                    selectedOrder.requestDate
                      ? new Date(selectedOrder.requestDate).toLocaleString()
                      : '—'
                  }
                />
              </div>

              {/* Customer + Provider */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer */}
                <div className="bg-blue-500/10 rounded-2xl p-5 border border-blue-500/20 space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                      {selectedOrder.customerName?.[0] ?? '?'}
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">
                      Customer
                    </p>
                  </div>
                  <ModalRow
                    icon={<User size={15} />}
                    label="Name"
                    value={selectedOrder.customerName ?? '—'}
                  />
                  <ModalRow
                    icon={<Phone size={15} />}
                    label="Phone"
                    value={selectedOrder.customerPhone ?? '—'}
                  />
                  <ModalRow
                    icon={<MapPin size={15} />}
                    label="Address"
                    value={selectedOrder.customerAddress ?? '—'}
                  />
                </div>

                {/* Provider */}
                <div className="bg-emerald-500/10 rounded-2xl p-5 border border-emerald-500/20 space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                      {selectedOrder.providerName?.[0] ?? '?'}
                    </div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                      Provider
                    </p>
                  </div>
                  <ModalRow
                    icon={<User size={15} />}
                    label="Name"
                    value={selectedOrder.providerName ?? '—'}
                  />
                  <ModalRow
                    icon={<Phone size={15} />}
                    label="Phone"
                    value={selectedOrder.providerPhone ?? '—'}
                  />
                  <ModalRow
                    icon={<MapPin size={15} />}
                    label="Address"
                    value={selectedOrder.providerAddress ?? '—'}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 border-t border-slate-800 bg-slate-900/80 flex justify-end flex-shrink-0">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 text-sm border border-slate-700 rounded-xl hover:bg-slate-800 text-slate-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ModalRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-slate-500 mt-0.5 flex-shrink-0">{icon}</span>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-slate-200 font-medium text-sm">{value}</p>
      </div>
    </div>
  );
}