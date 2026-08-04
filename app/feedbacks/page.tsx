'use client';
import { useState, useEffect } from 'react';
import { 
  RefreshCw, Download, Search, MessageSquare, 
  User, Phone, Calendar 
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { exportToCSV } from '@/lib/exportUtils';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

interface Feedback {
  id: number;
  phone: string;
  fullName: string;
  comment: string;
  createdAt: string;
}

export default function FeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const router = useRouter();

  useEffect(() => {
    const token = apiClient.getToken();
    if (!token) {
      router.push('/login');
      return;
    }
    fetchFeedbacks();
  }, [router]);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getFeedback();
      const list: Feedback[] = Array.isArray(data) ? data : [];
      setFeedbacks(list);
    } catch (error: any) {
      if (error.message?.includes('401')) {
        apiClient.clearToken();
        router.push('/login');
      } else {
        toast.error('Failed to load feedbacks');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    exportToCSV(
      feedbacks.map(f => ({
        'ID': f.id,
        'Full Name': f.fullName,
        'Phone': f.phone,
        'Comment': f.comment,
        'Date': new Date(f.createdAt).toLocaleString(),
      })),
      'customer_feedbacks'
    );
    toast.success('Feedbacks exported successfully');
  };

  const filtered = feedbacks.filter(f =>
    f.fullName.toLowerCase().includes(search.toLowerCase()) ||
    f.phone.includes(search) ||
    f.comment.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Customer Feedbacks</h1>
            <p className="text-slate-500 mt-1">{feedbacks.length} feedbacks received</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchFeedbacks}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              <RefreshCw size={15} /> Refresh
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              <Download size={15} /> Export CSV
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-6 relative max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, phone or comment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:border-teal-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="p-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="animate-spin w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full" />
            <p className="text-slate-400 mt-4">Loading feedbacks...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32">
            <MessageSquare size={48} className="mx-auto text-slate-300" />
            <p className="text-slate-400 mt-4">No feedbacks found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filtered.map((fb) => (
              <div
                key={fb.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{fb.fullName}</p>
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <Phone size={14} /> {fb.phone}
                      </p>
                    </div>
                  </div>

                  <div className="text-right text-xs text-slate-400">
                    <Calendar size={14} className="inline mr-1" />
                    {new Date(fb.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>

                <div className="mt-5 bg-slate-50 border border-slate-100 rounded-2xl p-5 text-slate-700 leading-relaxed">
                  "{fb.comment}"
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}