// 'use client';
// import { useState, useEffect } from 'react';
// import {
//   Phone, MapPin, Briefcase, Star, Mail, Shield,
//   ShieldCheck, ShieldX, User, FileText, Hash,
//   Download, RefreshCw, Search, Users, Clock, XCircle,
//   ChevronLeft, ChevronRight
// } from 'lucide-react';
// import { apiClient } from '@/lib/api';
// import { exportToCSV } from '@/lib/exportUtils';
// import { useRouter } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import toast, { Toaster } from 'react-hot-toast';

// interface Provider {
//   id: number;
//   fullName: string;
//   phone: string;
//   address: string;
//   email: string;
//   gender: string;
//   joinedDate: string | null;
//   profession: string;
//   bio: string;
//   tinNumber: string | null;
//   nationalIdPath: string | null;
//   rating: number;
//   verified: boolean;
// }

// const ITEMS_PER_PAGE = 8; // You can adjust this

// export default function ProvidersPage() {
//   const [providers, setProviders] = useState<Provider[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
//   const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
//   const [actionLoading, setActionLoading] = useState(false);
//   const [filter, setFilter] = useState<'all' | 'verified' | 'pending'>('all');
//   const [search, setSearch] = useState('');
  
//   // Pagination State
//   const [currentPage, setCurrentPage] = useState(1);

//   // National ID image state
//   const [nationalIdSrc, setNationalIdSrc] = useState<string | null>(null);
//   const [imageLoading, setImageLoading] = useState(false);

//   const router = useRouter();

//   useEffect(() => {
//     const token = apiClient.getToken();
//     if (!token) { router.push('/login'); return; }
//     fetchProviders();
//   }, [router]);

//   // Fetch national ID image when modal opens
//   useEffect(() => {
//     if (nationalIdSrc) URL.revokeObjectURL(nationalIdSrc);
//     setNationalIdSrc(null);
//     if (!selectedProvider?.phone) return;

//     setImageLoading(true);
//     apiClient.getProviderImage(selectedProvider.phone).then((src) => {
//       setNationalIdSrc(src);
//       setImageLoading(false);
//     });

//     return () => { if (nationalIdSrc) URL.revokeObjectURL(nationalIdSrc); };
//   }, [selectedProvider]);

//   const fetchProviders = async () => {
//     setLoading(true);
//     try {
//       const data = await apiClient.getProviders();
//       const list: Provider[] = Array.isArray(data) ? data : data.services || data.data || [];
//       setProviders(list);
//       setCurrentPage(1); // Reset to first page
//     } catch (error: any) {
//       if (error.message.includes('401') || error.message.includes('token')) {
//         apiClient.clearToken();
//         router.push('/login');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerify = async (phone: string, verified: boolean) => {
//     setActionLoading(true);
//     const verificationPromise = apiClient.verifyProvider(phone, verified);
  
//     toast.promise(verificationPromise, {
//       loading: verified ? 'Approving provider...' : 'Rejecting provider...',
//       success: () => {
//         setSelectedProvider(null);
//         fetchProviders();
//         return `Provider ${verified ? 'approved' : 'rejected'} successfully`;
//       },
//       error: (err) => err.message || 'Failed to update provider status',
//     });
  
//     try {
//       await verificationPromise;
//     } catch (error) {
//       console.error("Verification error:", error);
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleExport = () => {
//     exportToCSV(filtered.map(p => ({
//       'ID':         p.id,
//       'Full Name':  p.fullName,
//       'Phone':      p.phone,
//       'Email':      p.email,
//       'Gender':     p.gender,
//       'Profession': p.profession,
//       'Address':    p.address,
//       'TIN Number': p.tinNumber ?? '—',
//       'Rating':     p.rating.toFixed(1),
//       'Status':     p.verified ? 'Verified' : 'Pending',
//     })), 'providers');
//   };

//   // Stats
//   const stats = {
//     total:    providers.length,
//     verified: providers.filter(p => p.verified).length,
//     pending:  providers.filter(p => !p.verified).length,
//   };

//   const filtered = providers.filter(p => {
//     const matchesFilter = filter === 'all' ? true : filter === 'verified' ? p.verified : !p.verified;
//     const matchesSearch =
//       p.fullName?.toLowerCase().includes(search.toLowerCase()) ||
//       p.phone?.includes(search) ||
//       p.email?.toLowerCase().includes(search.toLowerCase()) ||
//       p.profession?.toLowerCase().includes(search.toLowerCase());
//     return matchesFilter && matchesSearch;
//   });

//   // Pagination Logic
//   const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const paginatedProviders = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

//   const goToPage = (page: number) => {
//     setCurrentPage(Math.max(1, Math.min(page, totalPages)));
//   };

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <Toaster position="top-right" />

//       {/* Page Header */}
//       <div className="bg-white border-b border-slate-200 px-8 py-6">
//         <div className="flex flex-wrap justify-between items-center gap-4">
//           <div>
//             <h1 className="text-3xl font-bold text-slate-900">Providers Management</h1>
//             <p className="text-slate-500 mt-1 text-sm">
//               {providers.length} total ·{' '}
//               {stats.pending > 0 && (
//                 <span className="text-amber-600 font-medium">{stats.pending} pending review</span>
//               )}
//             </p>
//           </div>
//           <div className="flex gap-3">
//             <button onClick={fetchProviders} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
//               <RefreshCw size={15} /> Refresh
//             </button>
//             <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-medium transition shadow-sm shadow-teal-500/30">
//               <Download size={15} /> Export CSV
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="p-8 space-y-6">

//         {/* Feedback */}
//         {feedback && (
//           <div className={`px-5 py-4 rounded-2xl text-sm font-medium ${
//             feedback.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
//           }`}>
//             {feedback.message}
//           </div>
//         )}

//         {/* Stat Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           {[
//             { label: 'Total Providers', value: stats.total,    icon: Users,       color: 'text-slate-700',  bg: 'bg-slate-100',  border: 'border-slate-200' },
//             { label: 'Verified',        value: stats.verified, icon: ShieldCheck, color: 'text-green-600', bg: 'bg-green-50',   border: 'border-green-100' },
//             { label: 'Pending Review',  value: stats.pending,  icon: Clock,       color: 'text-amber-600', bg: 'bg-amber-50',   border: 'border-amber-100' },
//           ].map((s, i) => (
//             <div key={i} className={`bg-white rounded-2xl border ${s.border} p-5 flex items-center justify-between shadow-sm`}>
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
//           <div className="flex gap-2">
//             {(['all', 'pending', 'verified'] as const).map(f => (
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
//                     ({f === 'verified' ? stats.verified : stats.pending})
//                   </span>
//                 )}
//               </button>
//             ))}
//           </div>
//           <div className="relative">
//             <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
//             <input
//               type="text"
//               placeholder="Search providers..."
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
//             <p className="text-slate-400">Loading providers...</p>
//           </div>
//         ) : filtered.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-32 gap-3">
//             <Users size={40} className="text-slate-300" />
//             <p className="text-slate-400 font-medium">No providers found</p>
//             {search && (
//               <button onClick={() => setSearch('')} className="text-teal-600 text-sm hover:underline">
//                 Clear search
//               </button>
//             )}
//           </div>
//         ) : (
//           <>
//             <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
//               <table className="w-full text-sm">
//                 <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs tracking-wide">
//                   <tr>
//                     <th className="px-6 py-4 text-left">Name</th>
//                     <th className="px-6 py-4 text-left">Profession</th>
//                     <th className="px-6 py-4 text-left">Phone</th>
//                     <th className="px-6 py-4 text-left">Email</th>
//                     <th className="px-6 py-4 text-left">Address</th>
//                     <th className="px-6 py-4 text-left">TIN</th>
//                     <th className="px-6 py-4 text-left">Rating</th>
//                     <th className="px-6 py-4 text-left">Status</th>
//                     <th className="px-6 py-4 text-center">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                   {paginatedProviders.map((p) => (
//                     <tr key={p.id} className="hover:bg-slate-50 transition-colors">
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-3">
//                           <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
//                             {p.fullName?.[0] ?? '?'}
//                           </div>
//                           <div>
//                             <p className="font-semibold text-slate-900">{p.fullName}</p>
//                             <p className="text-slate-400 text-xs">{p.gender}</p>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 text-slate-600 capitalize">{p.profession}</td>
//                       <td className="px-6 py-4 text-slate-500 font-mono">{p.phone}</td>
//                       <td className="px-6 py-4 text-slate-500">{p.email}</td>
//                       <td className="px-6 py-4 text-slate-500">{p.address}</td>
//                       <td className="px-6 py-4 text-slate-500">{p.tinNumber ?? '—'}</td>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center gap-1">
//                           <Star size={14} className="text-amber-400 fill-amber-400" />
//                           <span className="font-semibold text-slate-700">{p.rating.toFixed(1)}</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${
//                           p.verified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
//                         }`}>
//                           {p.verified ? <ShieldCheck size={12} /> : <Shield size={12} />}
//                           {p.verified ? 'Verified' : 'Pending'}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 text-center">
//                         <button
//                           onClick={() => setSelectedProvider(p)}
//                           className="px-4 py-1.5 text-xs font-medium rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
//                         >
//                           View
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
//                   Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)} of {filtered.length} providers
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

//       {/* Detail Modal */}
//       {selectedProvider && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

//             {/* Modal Header */}
//             <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white px-8 py-6 flex items-center gap-5 flex-shrink-0">
//               <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-3xl font-bold shadow-lg">
//                 {selectedProvider.fullName?.[0]}
//               </div>
//               <div>
//                 <h2 className="text-xl font-bold">{selectedProvider.fullName}</h2>
//                 <p className="text-slate-300 capitalize">{selectedProvider.profession}</p>
//               </div>
//               <div className="ml-auto">
//                 <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase ${
//                   selectedProvider.verified
//                     ? 'bg-green-500/20 text-green-300 border border-green-500/30'
//                     : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
//                 }`}>
//                   {selectedProvider.verified ? <ShieldCheck size={13} /> : <Shield size={13} />}
//                   {selectedProvider.verified ? 'Verified' : 'Pending Review'}
//                 </span>
//               </div>
//             </div>

//             {/* Modal Body */}
//             <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto">

//               {/* Contact */}
//               <div className="space-y-4">
//                 <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Contact</p>
//                 <InfoRow icon={<Phone size={15} />}  label="Phone"   value={selectedProvider.phone} />
//                 <InfoRow icon={<Mail size={15} />}   label="Email"   value={selectedProvider.email} />
//                 <InfoRow icon={<MapPin size={15} />} label="Address" value={selectedProvider.address} />
//                 <InfoRow icon={<User size={15} />}   label="Gender"  value={selectedProvider.gender} />
//               </div>

//               {/* Professional */}
//               <div className="space-y-4">
//                 <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Professional</p>
//                 <InfoRow icon={<Briefcase size={15} />} label="Profession"  value={selectedProvider.profession} />
//                 <InfoRow icon={<Hash size={15} />}      label="TIN Number"  value={selectedProvider.tinNumber ?? 'Not provided'} />
//                 <div className="flex items-center gap-3">
//                   <Star size={15} className="text-amber-400 fill-amber-400 flex-shrink-0" />
//                   <div>
//                     <p className="text-xs text-slate-400">Rating</p>
//                     <p className="font-semibold text-slate-800 text-lg">
//                       {selectedProvider.rating.toFixed(1)}{' '}
//                       <span className="text-sm font-normal text-slate-400">/ 5.0</span>
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Bio */}
//               <div className="md:col-span-2">
//                 <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Bio</p>
//                 <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 rounded-xl p-4 border border-slate-100">
//                   {selectedProvider.bio || 'No bio provided.'}
//                 </p>
//               </div>

//               {/* National ID Image */}
//               <div className="md:col-span-2">
//                 <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
//                   National ID
//                 </p>
//                 {imageLoading ? (
//                   <div className="h-48 flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-2xl gap-3">
//                     <div className="animate-spin w-7 h-7 border-4 border-teal-600 border-t-transparent rounded-full" />
//                     <p className="text-slate-400 text-sm">Loading ID image...</p>
//                   </div>
//                 ) : nationalIdSrc ? (
//                   <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
//                     <img
//                       src={nationalIdSrc}
//                       alt={`National ID - ${selectedProvider.fullName}`}
//                       className="w-full max-h-72 object-contain p-3"
//                     />
//                     <div className="px-4 py-2 border-t border-slate-100 flex items-center justify-between">
//                       <span className="text-xs text-slate-400 flex items-center gap-1.5">
//                         <FileText size={12} /> National ID Document
//                       </span>
//                       <button
//                         onClick={() => {
//                           if (!nationalIdSrc) return;
//                           const link = document.createElement('a');
//                           link.href = nationalIdSrc;
//                           link.download = `national-id-${selectedProvider.phone}.jpg`;
//                           link.click();
//                         }}
//                         className="text-xs text-teal-600 hover:text-teal-700 font-medium"
//                       >
//                         Download
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="h-48 flex flex-col items-center justify-center bg-slate-50 border border-dashed border-slate-300 rounded-2xl gap-2">
//                     <FileText size={28} className="text-slate-300" />
//                     <p className="text-slate-400 text-sm">No ID image found</p>
//                     <p className="text-slate-300 text-xs">File may not have been uploaded yet</p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Modal Footer */}
//             <div className="px-8 py-5 border-t bg-slate-50 flex justify-between items-center flex-shrink-0">
//               <div className="flex gap-3">
//                 <button
//                   onClick={() => { setSelectedProvider(null); setFeedback(null); }}
//                   className="px-5 py-2.5 text-sm border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-600 transition"
//                 >
//                   Close
//                 </button>
               
//               </div>

//               {!selectedProvider.verified && (
//                 <div className="flex gap-3">
//                  <Button onClick={() => handleVerify(selectedProvider.phone, true)}>Approve</Button>


//                 <Button onClick={() => handleVerify(selectedProvider.phone, false)}>Reject</Button>

                    
//                 </div>
//               )}

              
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
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
  Phone, MapPin, Briefcase, Star, Mail, Shield,
  ShieldCheck, User, FileText, Hash,
  Download, RefreshCw, Search, Users, Clock,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { exportToCSV } from '@/lib/exportUtils';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import toast, { Toaster } from 'react-hot-toast';

interface Provider {
  id: number;
  fullName: string;
  phone: string;
  address: string;
  email: string;
  gender: string;
  joinedDate: string | null;
  profession: string;
  bio: string;
  tinNumber: string | null;
  nationalIdPath: string | null;
  rating: number;
  verified: boolean;
}

const ITEMS_PER_PAGE = 8;

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'verified' | 'pending'>('all');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [nationalIdSrc, setNationalIdSrc] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = apiClient.getToken();
    if (!token) {
      router.push('/login');
      return;
    }
    fetchProviders();
  }, [router]);

  useEffect(() => {
    if (nationalIdSrc) URL.revokeObjectURL(nationalIdSrc);
    setNationalIdSrc(null);
    if (!selectedProvider?.phone) return;

    setImageLoading(true);
    apiClient.getProviderImage(selectedProvider.phone).then((src) => {
      setNationalIdSrc(src);
      setImageLoading(false);
    });

    return () => {
      if (nationalIdSrc) URL.revokeObjectURL(nationalIdSrc);
    };
  }, [selectedProvider]);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getProviders();
      const list: Provider[] = Array.isArray(data) ? data : data.services || data.data || [];
      setProviders(list);
      setCurrentPage(1);
    } catch (error: any) {
      if (error.message.includes('401') || error.message.includes('token')) {
        apiClient.clearToken();
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (phone: string, verified: boolean) => {
    setActionLoading(true);
    const verificationPromise = apiClient.verifyProvider(phone, verified);

    toast.promise(verificationPromise, {
      loading: verified ? 'Approving provider...' : 'Rejecting provider...',
      success: () => {
        setSelectedProvider(null);
        fetchProviders();
        return `Provider ${verified ? 'approved' : 'rejected'} successfully`;
      },
      error: (err) => err.message || 'Failed to update provider status',
    });

    try {
      await verificationPromise;
    } catch (error) {
      console.error('Verification error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleExport = () => {
    exportToCSV(
      filtered.map((p) => ({
        ID: p.id,
        'Full Name': p.fullName,
        Phone: p.phone,
        Email: p.email,
        Gender: p.gender,
        Profession: p.profession,
        Address: p.address,
        'TIN Number': p.tinNumber ?? '—',
        Rating: p.rating.toFixed(1),
        Status: p.verified ? 'Verified' : 'Pending',
      })),
      'providers'
    );
  };

  const stats = {
    total: providers.length,
    verified: providers.filter((p) => p.verified).length,
    pending: providers.filter((p) => !p.verified).length,
  };

  const filtered = providers.filter((p) => {
    const matchesFilter =
      filter === 'all' ? true : filter === 'verified' ? p.verified : !p.verified;
    const matchesSearch =
      p.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      p.phone?.includes(search) ||
      p.email?.toLowerCase().includes(search.toLowerCase()) ||
      p.profession?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProviders = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Toaster position="top-right" />

      {/* Page Header */}
      <div className="border-b border-slate-800 px-6 lg:px-8 py-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Providers Management</h1>
            <p className="text-slate-400 mt-1 text-sm">
              {providers.length} total
              {stats.pending > 0 && (
                <span className="text-amber-400 font-medium"> · {stats.pending} pending review</span>
              )}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchProviders}
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              label: 'Total Providers',
              value: stats.total,
              icon: Users,
              gradient: 'from-indigo-600 to-purple-600',
            },
            {
              label: 'Verified',
              value: stats.verified,
              icon: ShieldCheck,
              gradient: 'from-emerald-600 to-teal-600',
            },
            {
              label: 'Pending Review',
              value: stats.pending,
              icon: Clock,
              gradient: 'from-orange-500 to-amber-600',
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
            {(['all', 'pending', 'verified'] as const).map((f) => (
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
                    ({f === 'verified' ? stats.verified : stats.pending})
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              placeholder="Search providers..."
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
            <p className="text-slate-400">Loading providers...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <Users size={40} className="text-slate-600" />
            <p className="text-slate-400 font-medium">No providers found</p>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="text-indigo-400 text-sm hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Dark Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-800/60 border-b border-slate-800 text-slate-400 uppercase text-xs tracking-wide">
                    <tr>
                      <th className="px-6 py-4 text-left font-medium">Name</th>
                      <th className="px-6 py-4 text-left font-medium">Profession</th>
                      <th className="px-6 py-4 text-left font-medium">Phone</th>
                      <th className="px-6 py-4 text-left font-medium">Email</th>
                      <th className="px-6 py-4 text-left font-medium">Address</th>
                      <th className="px-6 py-4 text-left font-medium">TIN</th>
                      <th className="px-6 py-4 text-left font-medium">Rating</th>
                      <th className="px-6 py-4 text-left font-medium">Status</th>
                      <th className="px-6 py-4 text-center font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {paginatedProviders.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                              {p.fullName?.[0] ?? '?'}
                            </div>
                            <div>
                              <p className="font-semibold text-white">{p.fullName}</p>
                              <p className="text-slate-500 text-xs">{p.gender}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-300 capitalize">{p.profession}</td>
                        <td className="px-6 py-4 text-slate-400 font-mono">{p.phone}</td>
                        <td className="px-6 py-4 text-slate-400">{p.email}</td>
                        <td className="px-6 py-4 text-slate-400">{p.address}</td>
                        <td className="px-6 py-4 text-slate-400">{p.tinNumber ?? '—'}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <Star size={14} className="text-amber-400 fill-amber-400" />
                            <span className="font-semibold text-slate-200">
                              {p.rating.toFixed(1)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                              p.verified
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {p.verified ? <ShieldCheck size={12} /> : <Shield size={12} />}
                            {p.verified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => setSelectedProvider(p)}
                            className="px-4 py-1.5 text-xs font-medium rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white transition"
                          >
                            View
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
                  {filtered.length} providers
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

      {/* Detail Modal */}
      {selectedProvider && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-6 flex items-center gap-5 flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-bold">
                {selectedProvider.fullName?.[0]}
              </div>
              <div>
                <h2 className="text-xl font-bold">{selectedProvider.fullName}</h2>
                <p className="text-indigo-100 capitalize">{selectedProvider.profession}</p>
              </div>
              <div className="ml-auto">
                <span
                  className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase ${
                    selectedProvider.verified
                      ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30'
                      : 'bg-amber-500/20 text-amber-200 border border-amber-400/30'
                  }`}
                >
                  {selectedProvider.verified ? (
                    <ShieldCheck size={13} />
                  ) : (
                    <Shield size={13} />
                  )}
                  {selectedProvider.verified ? 'Verified' : 'Pending Review'}
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Contact
                </p>
                <InfoRow icon={<Phone size={15} />} label="Phone" value={selectedProvider.phone} />
                <InfoRow icon={<Mail size={15} />} label="Email" value={selectedProvider.email} />
                <InfoRow
                  icon={<MapPin size={15} />}
                  label="Address"
                  value={selectedProvider.address}
                />
                <InfoRow
                  icon={<User size={15} />}
                  label="Gender"
                  value={selectedProvider.gender}
                />
              </div>

              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Professional
                </p>
                <InfoRow
                  icon={<Briefcase size={15} />}
                  label="Profession"
                  value={selectedProvider.profession}
                />
                <InfoRow
                  icon={<Hash size={15} />}
                  label="TIN Number"
                  value={selectedProvider.tinNumber ?? 'Not provided'}
                />
                <div className="flex items-center gap-3">
                  <Star size={15} className="text-amber-400 fill-amber-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500">Rating</p>
                    <p className="font-semibold text-white text-lg">
                      {selectedProvider.rating.toFixed(1)}{' '}
                      <span className="text-sm font-normal text-slate-400">/ 5.0</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
                  Bio
                </p>
                <p className="text-slate-300 text-sm leading-relaxed bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  {selectedProvider.bio || 'No bio provided.'}
                </p>
              </div>

              <div className="md:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
                  National ID
                </p>
                {imageLoading ? (
                  <div className="h-48 flex flex-col items-center justify-center bg-slate-800/50 border border-slate-700 rounded-2xl gap-3">
                    <div className="animate-spin w-7 h-7 border-4 border-indigo-500 border-t-transparent rounded-full" />
                    <p className="text-slate-400 text-sm">Loading ID image...</p>
                  </div>
                ) : nationalIdSrc ? (
                  <div className="border border-slate-700 rounded-2xl overflow-hidden bg-slate-800/50">
                    <img
                      src={nationalIdSrc}
                      alt={`National ID - ${selectedProvider.fullName}`}
                      className="w-full max-h-72 object-contain p-3"
                    />
                    <div className="px-4 py-2 border-t border-slate-700 flex items-center justify-between">
                      <span className="text-xs text-slate-400 flex items-center gap-1.5">
                        <FileText size={12} /> National ID Document
                      </span>
                      <button
                        onClick={() => {
                          if (!nationalIdSrc) return;
                          const link = document.createElement('a');
                          link.href = nationalIdSrc;
                          link.download = `national-id-${selectedProvider.phone}.jpg`;
                          link.click();
                        }}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-48 flex flex-col items-center justify-center bg-slate-800/50 border border-dashed border-slate-600 rounded-2xl gap-2">
                    <FileText size={28} className="text-slate-600" />
                    <p className="text-slate-400 text-sm">No ID image found</p>
                    <p className="text-slate-500 text-xs">File may not have been uploaded yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 border-t border-slate-800 bg-slate-900/80 flex justify-between items-center flex-shrink-0">
              <button
                onClick={() => {
                  setSelectedProvider(null);
                  setFeedback(null);
                }}
                className="px-5 py-2.5 text-sm border border-slate-700 rounded-xl hover:bg-slate-800 text-slate-300 transition"
              >
                Close
              </button>

              {!selectedProvider.verified && (
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleVerify(selectedProvider.phone, true)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white"
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleVerify(selectedProvider.phone, false)}
                    variant="destructive"
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({
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