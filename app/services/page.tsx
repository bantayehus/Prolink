


// 'use client';
// import { useState, useEffect } from 'react';
// import {
//   RefreshCw, Download, Search, CheckCircle, XCircle,
//   MapPin, User, Clock, Briefcase, ChevronLeft, ChevronRight
// } from 'lucide-react';
// import { apiClient } from '@/lib/api';
// import { exportToCSV } from '@/lib/exportUtils';
// import { useRouter } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import toast, { Toaster } from 'react-hot-toast';

// interface Service {
//   id: number;
//   title: string;
//   category: string;
//   description: string;
//   price: number;
//   experience: string;
//   providerName: string;
//   address: string;
//   serviceActive: boolean;
//   rating?: number;
// }

// const ITEMS_PER_PAGE = 10; // You can change this

// export default function ServicesPage() {
//   const [services, setServices] = useState<Service[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedService, setSelectedService] = useState<Service | null>(null);
//   const [actionLoading, setActionLoading] = useState(false);
//   const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
//   const [search, setSearch] = useState('');
  
//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1);

//   const router = useRouter();

//   // Initial load + token check
//   useEffect(() => {
//     const token = apiClient.getToken();
//     if (!token) {
//       router.push('/login');
//       return;
//     }
//     fetchServices();
//   }, [router]);

//   const fetchServices = async () => {
//     setLoading(true);
//     try {
//       const data = await apiClient.getAllservices();
//       const list: Service[] = Array.isArray(data) ? data : [];
//       setServices(list);
//       setCurrentPage(1); // Reset to first page on refresh
//     } catch (error: any) {
//       if (error.message?.includes('401') || error.message?.includes('token')) {
//         apiClient.clearToken();
//         router.push('/login');
//       } else {
//         toast.error('Failed to load services');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Approve or Reject Service
//   const handleServiceAction = async (serviceId: number, approved: boolean) => {
//     setActionLoading(true);
//     const actionText = approved ? 'approved' : 'rejected';

//     try {
//       await apiClient.updateServiceStatus(serviceId, approved);
//       toast.success(`Service ${actionText} successfully!`);
//       await fetchServices();
//       setSelectedService(null);
//     } catch (error: any) {
//       toast.error(`Failed to ${actionText} service. Please try again.`);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleExport = () => {
//     exportToCSV(
//       filtered.map(s => ({
//         'ID': s.id,
//         'Title': s.title,
//         'Category': s.category,
//         'Provider': s.providerName,
//         'Price': s.price,
//         'Experience': s.experience,
//         'Address': s.address,
//         'Status': s.serviceActive ? 'Active' : 'Inactive',
//       })),
//       'services'
//     );
//     toast.success('Services exported successfully');
//   };

//   // Stats
//   const stats = {
//     total: services.length,
//     active: services.filter(s => s.serviceActive).length,
//     inactive: services.filter(s => !s.serviceActive).length,
//   };

//   // Filtered & Searched Data
//   const filtered = services.filter(s => {
//     const matchesFilter =
//       filter === 'all' ? true :
//       filter === 'active' ? s.serviceActive : !s.serviceActive;

//     const matchesSearch =
//       s.title?.toLowerCase().includes(search.toLowerCase()) ||
//       s.providerName?.toLowerCase().includes(search.toLowerCase()) ||
//       s.category?.toLowerCase().includes(search.toLowerCase()) ||
//       s.address?.toLowerCase().includes(search.toLowerCase());

//     return matchesFilter && matchesSearch;
//   });

//   // Pagination Logic
//   const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const paginatedServices = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

//   const goToPage = (page: number) => {
//     setCurrentPage(Math.max(1, Math.min(page, totalPages)));
//   };

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <Toaster position="top-right" />

//       {/* Header - unchanged */}
//       <div className="bg-white border-b border-slate-200 px-8 py-6">
//         <div className="flex flex-wrap justify-between items-center gap-4">
//           <div>
//             <h1 className="text-3xl font-bold text-slate-900">Services Management</h1>
//             <p className="text-slate-500 mt-1 text-sm">
//               {services.length} total services
//             </p>
//           </div>
//           <div className="flex gap-3">
//             <button onClick={fetchServices} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
//               <RefreshCw size={15} /> Refresh
//             </button>
//             <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium transition shadow-sm shadow-teal-500/30">
//               <Download size={15} /> Export CSV
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="p-8 space-y-6">
//         {/* Stat Cards - unchanged */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           {[
//             { label: 'Total Services', value: stats.total, icon: Briefcase, color: 'text-slate-700', bg: 'bg-slate-100' },
//             { label: 'Active Services', value: stats.active, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
//             { label: 'Inactive Services', value: stats.inactive, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
//           ].map((s, i) => (
//             <div key={i} className={`bg-white rounded-2xl border p-5 flex items-center justify-between shadow-sm`}>
//               <div>
//                 <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{s.label}</p>
//                 <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
//               </div>
//               <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center`}>
//                 <s.icon size={24} className={s.color} />
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Filters + Search - unchanged */}
//         <div className="flex flex-wrap gap-3 items-center justify-between">
//           <div className="flex gap-2">
//             {(['all', 'active', 'inactive'] as const).map(f => (
//               <button
//                 key={f}
//                 onClick={() => { setFilter(f); setCurrentPage(1); }}
//                 className={`px-5 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
//                   filter === f ? 'bg-teal-600 text-white shadow' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
//                 }`}
//               >
//                 {f === 'all' ? 'All Services' : f}
//                 {f !== 'all' && <span className="ml-1.5 text-xs opacity-70">({f === 'active' ? stats.active : stats.inactive})</span>}
//               </button>
//             ))}
//           </div>

//           <div className="relative">
//             <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
//             <input
//               type="text"
//               placeholder="Search services, providers..."
//               value={search}
//               onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
//               className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500 bg-white w-80"
//             />
//           </div>
//         </div>

//         {/* Table */}
//         {loading ? (
//           <div className="flex flex-col items-center justify-center py-32 gap-4">
//             <div className="animate-spin w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full" />
//             <p className="text-slate-400">Loading services...</p>
//           </div>
//         ) : filtered.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-32 gap-3">
//             <Briefcase size={48} className="text-slate-300" />
//             <p className="text-slate-400 font-medium">No services found</p>
//           </div>
//         ) : (
//           <>
//             <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
//               <table className="w-full text-sm">
//                 <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs tracking-wide">
//                   <tr>
//                     <th className="px-6 py-4 text-left">Service Title</th>
//                     <th className="px-6 py-4 text-left">Category</th>
//                     <th className="px-6 py-4 text-left">Provider</th>
//                     <th className="px-6 py-4 text-left">Price</th>
//                     <th className="px-6 py-4 text-left">Experience</th>
//                     <th className="px-6 py-4 text-left">Address</th>
//                     <th className="px-6 py-4 text-left">Status</th>
//                     <th className="px-6 py-4 text-center">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                   {paginatedServices.map((service) => (
//                     <tr key={service.id} className="hover:bg-slate-50 transition-colors">
//                       <td className="px-6 py-4 font-medium text-slate-900">{service.title}</td>
//                       <td className="px-6 py-4 text-slate-600">{service.category}</td>
//                       <td className="px-6 py-4 text-slate-700">{service.providerName}</td>
//                       <td className="px-6 py-4 font-semibold text-emerald-600">
//                         {service.price.toLocaleString()} ETB
//                       </td>
//                       <td className="px-6 py-4 text-slate-600">{service.experience}</td>
//                       <td className="px-6 py-4 text-slate-500">{service.address}</td>
//                       <td className="px-6 py-4">
//                         <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${
//                           service.serviceActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
//                         }`}>
//                           {service.serviceActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
//                           {service.serviceActive ? 'Active' : 'Inactive'}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 text-center">
//                         <button
//                           onClick={() => setSelectedService(service)}
//                           className="px-4 py-1.5 text-xs font-medium rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
//                         >
//                           View Details
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="flex flex-col sm:flex-row items-center justify-between mt-6 px-2">
//                 <p className="text-sm text-slate-500 mb-4 sm:mb-0">
//                   Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)} of {filtered.length} services
//                 </p>

//                 <div className="flex items-center gap-2">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => goToPage(currentPage - 1)}
//                     disabled={currentPage === 1}
//                   >
//                     <ChevronLeft size={16} />
//                   </Button>

//                   {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
//                     <Button
//                       key={page}
//                       variant={currentPage === page ? "default" : "outline"}
//                       size="sm"
//                       onClick={() => goToPage(page)}
//                       className={currentPage === page ? "bg-teal-600 hover:bg-teal-700" : ""}
//                     >
//                       {page}
//                     </Button>
//                   ))}

//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => goToPage(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                   >
//                     <ChevronRight size={16} />
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>




//       {/* Service Detail Modal */}
//       {selectedService && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
//             {/* Header */}
//             <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white px-8 py-6">
//               <h2 className="text-2xl font-bold">{selectedService.title}</h2>
//               <p className="text-slate-300 mt-1">{selectedService.category}</p>
//             </div>

//             {/* Body */}
//             <div className="p-8 space-y-8 overflow-y-auto">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Provider</p>
//                   <p className="font-semibold text-lg">{selectedService.providerName}</p>
//                 </div>
//                 <div>
//                   <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Price</p>
//                   <p className="text-3xl font-bold text-emerald-600">
//                     {selectedService.price.toLocaleString()} ETB
//                   </p>
//                 </div>
//               </div>

//               <div>
//                 <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">Description</p>
//                 <p className="text-slate-600 leading-relaxed bg-slate-50 p-5 rounded-2xl border">
//                   {selectedService.description}
//                 </p>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
//                 <div className="flex items-center gap-3">
//                   <Clock className="text-slate-400" />
//                   <div>
//                     <p className="text-slate-400 text-xs">Experience</p>
//                     <p className="font-medium">{selectedService.experience}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <MapPin className="text-slate-400" />
//                   <div>
//                     <p className="text-slate-400 text-xs">Location</p>
//                     <p className="font-medium">{selectedService.address}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <User className="text-slate-400" />
//                   <div>
//                     <p className="text-slate-400 text-xs">Status</p>
//                     <p className={`font-medium ${selectedService.serviceActive ? 'text-emerald-600' : 'text-red-600'}`}>
//                       {selectedService.serviceActive ? 'Active' : 'Inactive'}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Footer with Approve/Reject Buttons */}
//             <div className="px-8 py-5 border-t bg-slate-50 flex justify-between items-center">
//               <Button 
//                 variant="outline" 
//                 onClick={() => setSelectedService(null)}
//               >
//                 Close
//               </Button>

//               {!selectedService.serviceActive && (
//                 <div className="flex gap-3">
//                   <Button
//                     variant="destructive"
//                     onClick={() => handleServiceAction(selectedService.id, false)}
//                     disabled={actionLoading}
//                   >
//                     <XCircle className="mr-2" size={18} />
//                     Reject Service
//                   </Button>

//                   <Button
//                     onClick={() => handleServiceAction(selectedService.id, true)}
//                     disabled={actionLoading}
//                   >
//                     <CheckCircle className="mr-2" size={18} />
//                     Approve Service
//                   </Button>
//                 </div>
//               )}

//               {selectedService.serviceActive && (
//                 <div className="text-emerald-600 font-medium flex items-center gap-2">
//                   <CheckCircle size={20} />
//                   Service is Active
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

'use client';
import { useState, useEffect } from 'react';
import {
  RefreshCw,
  Download,
  Search,
  CheckCircle,
  XCircle,
  MapPin,
  User,
  Clock,
  Briefcase,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { exportToCSV } from '@/lib/exportUtils';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import toast, { Toaster } from 'react-hot-toast';

interface Service {
  id: number;
  title: string;
  category: string;
  description: string;
  price: number;
  experience: string;
  providerName: string;
  address: string;
  serviceActive: boolean;
  rating?: number;
}

const ITEMS_PER_PAGE = 10;

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter();

  useEffect(() => {
    const token = apiClient.getToken();
    if (!token) {
      router.push('/login');
      return;
    }
    fetchServices();
  }, [router]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getAllservices();
      const list: Service[] = Array.isArray(data) ? data : [];
      setServices(list);
      setCurrentPage(1);
    } catch (error: any) {
      if (error.message?.includes('401') || error.message?.includes('token')) {
        apiClient.clearToken();
        router.push('/login');
      } else {
        toast.error('Failed to load services');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleServiceAction = async (serviceId: number, approved: boolean) => {
    setActionLoading(true);
    const actionText = approved ? 'approved' : 'rejected';

    try {
      await apiClient.updateServiceStatus(serviceId, approved);
      toast.success(`Service ${actionText} successfully!`);
      await fetchServices();
      setSelectedService(null);
    } catch (error: any) {
      toast.error(`Failed to ${actionText} service. Please try again.`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleExport = () => {
    exportToCSV(
      filtered.map((s) => ({
        ID: s.id,
        Title: s.title,
        Category: s.category,
        Provider: s.providerName,
        Price: s.price,
        Experience: s.experience,
        Address: s.address,
        Status: s.serviceActive ? 'Active' : 'Inactive',
      })),
      'services'
    );
    toast.success('Services exported successfully');
  };

  const stats = {
    total: services.length,
    active: services.filter((s) => s.serviceActive).length,
    inactive: services.filter((s) => !s.serviceActive).length,
  };

  const filtered = services.filter((s) => {
    const matchesFilter =
      filter === 'all' ? true : filter === 'active' ? s.serviceActive : !s.serviceActive;

    const matchesSearch =
      s.title?.toLowerCase().includes(search.toLowerCase()) ||
      s.providerName?.toLowerCase().includes(search.toLowerCase()) ||
      s.category?.toLowerCase().includes(search.toLowerCase()) ||
      s.address?.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedServices = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="border-b border-slate-800 px-6 lg:px-8 py-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Services Management</h1>
            <p className="text-slate-400 mt-1 text-sm">
              {services.length} total services
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchServices}
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
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              label: 'Total Services',
              value: stats.total,
              icon: Briefcase,
              gradient: 'from-indigo-600 to-purple-600',
            },
            {
              label: 'Active Services',
              value: stats.active,
              icon: CheckCircle,
              gradient: 'from-emerald-600 to-teal-600',
            },
            {
              label: 'Inactive Services',
              value: stats.inactive,
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
          <div className="flex gap-2">
            {(['all', 'active', 'inactive'] as const).map((f) => (
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
                {f === 'all' ? 'All Services' : f}
                {f !== 'all' && (
                  <span className="ml-1.5 text-xs opacity-70">
                    ({f === 'active' ? stats.active : stats.inactive})
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              placeholder="Search services, providers..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-80"
            />
          </div>
        </div>

        {/* Table / Loading / Empty */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full" />
            <p className="text-slate-400">Loading services...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <Briefcase size={48} className="text-slate-600" />
            <p className="text-slate-400 font-medium">No services found</p>
          </div>
        ) : (
          <>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-800/60 border-b border-slate-800 text-slate-400 uppercase text-xs tracking-wide">
                    <tr>
                      <th className="px-6 py-4 text-left font-medium">Service Title</th>
                      <th className="px-6 py-4 text-left font-medium">Category</th>
                      <th className="px-6 py-4 text-left font-medium">Provider</th>
                      <th className="px-6 py-4 text-left font-medium">Price</th>
                      <th className="px-6 py-4 text-left font-medium">Experience</th>
                      <th className="px-6 py-4 text-left font-medium">Address</th>
                      <th className="px-6 py-4 text-left font-medium">Status</th>
                      <th className="px-6 py-4 text-center font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {paginatedServices.map((service) => (
                      <tr key={service.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-white">{service.title}</td>
                        <td className="px-6 py-4 text-slate-400">{service.category}</td>
                        <td className="px-6 py-4 text-slate-300">{service.providerName}</td>
                        <td className="px-6 py-4 font-semibold text-emerald-400">
                          {service.price.toLocaleString()} ETB
                        </td>
                        <td className="px-6 py-4 text-slate-400">{service.experience}</td>
                        <td className="px-6 py-4 text-slate-400">{service.address}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                              service.serviceActive
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {service.serviceActive ? (
                              <CheckCircle size={12} />
                            ) : (
                              <XCircle size={12} />
                            )}
                            {service.serviceActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => setSelectedService(service)}
                            className="px-4 py-1.5 text-xs font-medium rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white transition"
                          >
                            View Details
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
                  {filtered.length} services
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

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-6">
              <h2 className="text-2xl font-bold">{selectedService.title}</h2>
              <p className="text-indigo-100 mt-1">{selectedService.category}</p>
            </div>

            {/* Body */}
            <div className="p-8 space-y-8 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">
                    Provider
                  </p>
                  <p className="font-semibold text-lg text-white">
                    {selectedService.providerName}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">
                    Price
                  </p>
                  <p className="text-3xl font-bold text-emerald-400">
                    {selectedService.price.toLocaleString()} ETB
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">
                  Description
                </p>
                <p className="text-slate-300 leading-relaxed bg-slate-800/50 p-5 rounded-2xl border border-slate-700">
                  {selectedService.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="flex items-center gap-3">
                  <Clock className="text-slate-500" size={18} />
                  <div>
                    <p className="text-slate-500 text-xs">Experience</p>
                    <p className="font-medium text-slate-200">
                      {selectedService.experience}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="text-slate-500" size={18} />
                  <div>
                    <p className="text-slate-500 text-xs">Location</p>
                    <p className="font-medium text-slate-200">{selectedService.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="text-slate-500" size={18} />
                  <div>
                    <p className="text-slate-500 text-xs">Status</p>
                    <p
                      className={`font-medium ${
                        selectedService.serviceActive
                          ? 'text-emerald-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {selectedService.serviceActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 border-t border-slate-800 bg-slate-900/80 flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() => setSelectedService(null)}
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Close
              </Button>

              {!selectedService.serviceActive && (
                <div className="flex gap-3">
                  <Button
                    variant="destructive"
                    onClick={() => handleServiceAction(selectedService.id, false)}
                    disabled={actionLoading}
                  >
                    <XCircle className="mr-2" size={18} />
                    Reject Service
                  </Button>

                  <Button
                    onClick={() => handleServiceAction(selectedService.id, true)}
                    disabled={actionLoading}
                    className="bg-emerald-600 hover:bg-emerald-500"
                  >
                    <CheckCircle className="mr-2" size={18} />
                    Approve Service
                  </Button>
                </div>
              )}

              {selectedService.serviceActive && (
                <div className="text-emerald-400 font-medium flex items-center gap-2">
                  <CheckCircle size={20} />
                  Service is Active
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}