'use client';
import { useState } from 'react';
import { X, Upload } from 'lucide-react';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: FormData) => Promise<void>;
}

export default function AddCategoryModal({ isOpen, onClose, onAdd }: AddCategoryModalProps) {
  const [formData, setFormData] = useState({ name: '', description: '', image: null as File | null });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    if (formData.image) data.append('image', formData.image);
    
    await onAdd(data);
    setLoading(false);
    onClose();
    setFormData({ name: '', description: '', image: null });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900">Add New Category</h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>
        <div className="space-y-4">
          <input required placeholder="Category Name" className="w-full p-3 border border-slate-200 rounded-xl" onChange={e => setFormData({...formData, name: e.target.value})} />
          <textarea required placeholder="Description" className="w-full p-3 border border-slate-200 rounded-xl" onChange={e => setFormData({...formData, description: e.target.value})} />
          <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-teal-500 hover:bg-teal-50">
            <Upload className="text-slate-400" />
            <span className="text-xs text-slate-400 mt-2">{formData.image ? formData.image.name : "Click to upload image"}</span>
            <input type="file" className="hidden" accept="image/*" onChange={e => setFormData({...formData, image: e.target.files?.[0] || null})} />
          </label>
        </div>
        <button disabled={loading} type="submit" className="w-full mt-6 bg-teal-600 text-white py-3 rounded-xl font-semibold hover:bg-teal-700 disabled:opacity-50">
          {loading ? 'Saving...' : 'Save Category'}
        </button>
      </form>
    </div>
  );
}