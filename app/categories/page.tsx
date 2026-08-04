
// 'use client';
// import { useState, useEffect, useRef } from 'react';
// import {
//   Plus, Edit2, Trash2, Search, RefreshCw, ImageIcon, Layers, Download, Upload, X, CheckCircle
// } from 'lucide-react';
// import { apiClient } from '@/lib/api';
// import { exportToCSV } from '@/lib/exportUtils';
// import { useRouter } from 'next/navigation';
// import toast, { Toaster } from 'react-hot-toast';

// interface Category {
//   id: number;
//   name: string;
//   description: string;
//   imagePath: string | null;
// }

// function CategoryImage({ name }: { name: string }) {
//   const [src, setSrc] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     apiClient.getCategoryImage(name).then(url => {
//       setSrc(url);
//       setLoading(false);
//     });
//   }, [name]);

//   if (loading) return <div className="w-full h-full bg-slate-100 animate-pulse" />;
//   return src ? <img src={src} alt={name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-100 flex items-center justify-center"><ImageIcon size={32} className="text-slate-300" /></div>;
// }

// const EMPTY_FORM = { name: '', description: '' };

// export default function CategoriesPage() {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState('');

//   // Add/Edit Modal
//   const [showModal, setShowModal] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editingCategory, setEditingCategory] = useState<Category | null>(null);
//   const [form, setForm] = useState(EMPTY_FORM);
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [submitting, setSubmitting] = useState(false);

//   // Delete Confirmation Modal
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [categoryToDelete, setCategoryToDelete] = useState<{ id: number; name: string } | null>(null);

//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const router = useRouter();

//   useEffect(() => {
//     const token = apiClient.getToken();
//     if (!token) return router.push('/login');
//     fetchCategories();
//   }, [router]);

//   const fetchCategories = async () => {
//     setLoading(true);
//     try {
//       const data = await apiClient.getCategories();
//       setCategories(Array.isArray(data) ? data : []);
//     } catch (error: any) {
//       toast.error('Failed to load categories');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openAddModal = () => {
//     setIsEditing(false);
//     setEditingCategory(null);
//     setForm(EMPTY_FORM);
//     setImageFile(null);
//     setImagePreview(null);
//     setShowModal(true);
//   };

//   const openEditModal = (cat: Category) => {
//     setIsEditing(true);
//     setEditingCategory(cat);
//     setForm({ name: cat.name, description: cat.description });
//     setImageFile(null);
//     setImagePreview(null);
//     setShowModal(true);
//   };
//   // Add this function inside your CategoriesPage component
// const handleExport = () => {
//   exportToCSV(
//     categories.map(c => ({
//       'ID': c.id,
//       'Name': c.name,
//       'Description': c.description,
//     })),
//     'categories'
//   );
//   toast.success('Categories exported successfully!');
// };
    
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setImageFile(file);
//     if (imagePreview) URL.revokeObjectURL(imagePreview);
//     setImagePreview(URL.createObjectURL(file));
//   };

//   const handleSubmit = async () => {
//     if (!form.name.trim() || !form.description.trim()) {
//       toast.error('Name and description are required');
//       return;
//     }

//     setSubmitting(true);
//     try {
//       if (isEditing && editingCategory) {
//         await apiClient.updateCategory(editingCategory.id, form.name.trim(), form.description.trim(), imageFile || undefined);
//         toast.success('Category updated successfully');
//       } else {
//         if (!imageFile) return toast.error('Please upload an image');
//         await apiClient.addCategory(form.name.trim(), form.description.trim(), imageFile);
//         toast.success('Category added successfully');
//       }
//       closeModal();
//       fetchCategories();
//     } catch (error: any) {
//       toast.error(error.message || 'Operation failed');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const openDeleteModal = (id: number, name: string) => {
//     setCategoryToDelete({ id, name });
//     setShowDeleteModal(true);
//   };

//   const confirmDelete = async () => {
//     if (!categoryToDelete) return;
//     try {
//       await apiClient.deleteCategory(categoryToDelete.id);
//       toast.success('Category deleted permanently');
//       fetchCategories();
//     } catch (error: any) {
//       toast.error('Failed to delete category');
//     } finally {
//       setShowDeleteModal(false);
//       setCategoryToDelete(null);
//     }
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setTimeout(() => {
//       setIsEditing(false);
//       setEditingCategory(null);
//       setForm(EMPTY_FORM);
//       setImageFile(null);
//       if (imagePreview) URL.revokeObjectURL(imagePreview);
//       setImagePreview(null);
//     }, 200);
//   };

//   const filtered = categories.filter(c =>
//     c.name.toLowerCase().includes(search.toLowerCase()) ||
//     c.description.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <Toaster position="top-right" />

//       {/* Header */}
//       <div className="bg-white border-b border-slate-200 px-8 py-6">
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold text-slate-900">Categories</h1>
//             <p className="text-slate-500 mt-1">{categories.length} total categories</p>
//           </div>
//           <div className="flex gap-3">
//           <div className="flex gap-3">
//             <button
//               onClick={fetchCategories}
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

//             <button 
//     onClick={openAddModal}
//     className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition shadow-sm shadow-teal-500/30"
//   >
//     <Plus size={16} /> Add Category
//   </button>
//           </div>

  
// </div>
//         </div>

//         <div className="mt-5 relative max-w-md">
//           <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
//           <input type="text" placeholder="Search categories..." value={search} onChange={e => setSearch(e.target.value)}
//             className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:border-teal-500" />
//         </div>
//       </div>

//       <div className="p-8">
//         {/* Grid of Categories */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {filtered.map((cat) => (
//             <div key={cat.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all">
//               <div className="relative h-44">
//                 <CategoryImage name={cat.name} />
//               </div>
//               <div className="p-5">
//                 <h3 className="font-bold text-lg">{cat.name}</h3>
//                 <p className="text-sm text-slate-600 line-clamp-2 mt-1">{cat.description}</p>
//               </div>
//               <div className="px-5 pb-4 flex justify-between border-t pt-3">
//                 <button onClick={() => openEditModal(cat)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600">
//                   <Edit2 size={16} />
//                 </button>
//                 <button onClick={() => openDeleteModal(cat.id, cat.name)} className="p-2 hover:bg-red-50 rounded-lg text-red-600">
//                   <Trash2 size={16} />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Add / Edit Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden">
//             <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-8 py-6 text-white">
//               <h2 className="text-xl font-bold">{isEditing ? 'Edit Category' : 'Add New Category'}</h2>
//             </div>

//             <div className="p-8 space-y-6">
//               <div>
//                 <label className="block text-sm font-medium mb-2">Category Name *</label>
//                 <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
//                   className="w-full px-4 py-3 border rounded-xl focus:border-teal-500" />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-2">Description *</label>
//                 <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
//                   rows={4} className="w-full px-4 py-3 border rounded-xl focus:border-teal-500" />
//               </div>

//               {/* Image Section */}
//               <div>
//                 <label className="block text-sm font-medium mb-2">Category Image {isEditing ? '(Leave empty to keep current)' : '*'}</label>

//                 {/* Current Image (in Edit Mode) */}
//                 {isEditing && editingCategory && !imagePreview && (
//                   <div className="mb-4">
//                     <p className="text-xs text-slate-500 mb-2">Current Image</p>
//                     <div className="h-40 rounded-2xl overflow-hidden border">
//                       <CategoryImage name={editingCategory.name} />
//                     </div>
//                   </div>
//                 )}

//                 {/* Preview or Upload Area */}
//                 {imagePreview ? (
//                   <div className="relative rounded-2xl overflow-hidden border">
//                     <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
//                     <button onClick={() => { setImageFile(null); setImagePreview(null); }} className="absolute top-3 right-3 bg-red-500 text-white p-1 rounded-full">
//                       <X size={16} />
//                     </button>
//                   </div>
//                 ) : (
//                   <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-300 hover:border-teal-400 rounded-2xl p-10 text-center cursor-pointer">
//                     <Upload size={32} className="mx-auto text-slate-400" />
//                     <p className="mt-3 font-medium">Click to upload new image</p>
//                   </div>
//                 )}

//                 <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
//               </div>
//             </div>

//             <div className="px-8 py-5 border-t flex justify-end gap-3">
//               <button onClick={closeModal} className="px-6 py-2.5 border rounded-xl">Cancel</button>
//               <button onClick={handleSubmit} disabled={submitting} className="px-6 py-2.5 bg-teal-600 text-white rounded-xl">
//                 {submitting ? 'Saving...' : isEditing ? 'Update Category' : 'Add Category'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       {showDeleteModal && categoryToDelete && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-3xl max-w-md w-full p-8">
//             <h2 className="text-xl font-bold text-red-600">Delete Category?</h2>
//             <p className="mt-3 text-slate-600">
//               Are you sure you want to permanently delete <strong>"{categoryToDelete.name}"</strong>?<br />
//               This action cannot be undone.
//             </p>

//             <div className="flex gap-3 mt-8">
//               <button onClick={() => { setShowDeleteModal(false); setCategoryToDelete(null); }}
//                 className="flex-1 py-3 border border-slate-300 rounded-2xl">Cancel</button>
//               <button onClick={confirmDelete}
//                 className="flex-1 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700">Yes, Delete Permanently</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


'use client';
import { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  RefreshCw,
  ImageIcon,
  Download,
  Upload,
  X,
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { exportToCSV } from '@/lib/exportUtils';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

interface Category {
  id: number;
  name: string;
  description: string;
  imagePath: string | null;
}

function CategoryImage({ name }: { name: string }) {
  const [src, setSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getCategoryImage(name).then((url) => {
      setSrc(url);
      setLoading(false);
    });
  }, [name]);

  if (loading) {
    return <div className="w-full h-full bg-slate-800 animate-pulse" />;
  }

  return src ? (
    <img src={src} alt={name} className="w-full h-full object-cover" />
  ) : (
    <div className="w-full h-full bg-slate-800 flex items-center justify-center">
      <ImageIcon size={32} className="text-slate-600" />
    </div>
  );
}

const EMPTY_FORM = { name: '', description: '' };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Add/Edit Modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete Confirmation Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const token = apiClient.getToken();
    if (!token) return router.push('/login');
    fetchCategories();
  }, [router]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setIsEditing(false);
    setEditingCategory(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const openEditModal = (cat: Category) => {
    setIsEditing(true);
    setEditingCategory(cat);
    setForm({ name: cat.name, description: cat.description });
    setImageFile(null);
    setImagePreview(null);
    setShowModal(true);
  };

  const handleExport = () => {
    exportToCSV(
      categories.map((c) => ({
        ID: c.id,
        Name: c.name,
        Description: c.description,
      })),
      'categories'
    );
    toast.success('Categories exported successfully!');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.description.trim()) {
      toast.error('Name and description are required');
      return;
    }

    setSubmitting(true);
    try {
      if (isEditing && editingCategory) {
        await apiClient.updateCategory(
          editingCategory.id,
          form.name.trim(),
          form.description.trim(),
          imageFile || undefined
        );
        toast.success('Category updated successfully');
      } else {
        if (!imageFile) return toast.error('Please upload an image');
        await apiClient.addCategory(
          form.name.trim(),
          form.description.trim(),
          imageFile
        );
        toast.success('Category added successfully');
      }
      closeModal();
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteModal = (id: number, name: string) => {
    setCategoryToDelete({ id, name });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await apiClient.deleteCategory(categoryToDelete.id);
      toast.success('Category deleted permanently');
      fetchCategories();
    } catch (error: any) {
      toast.error('Failed to delete category');
    } finally {
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => {
      setIsEditing(false);
      setEditingCategory(null);
      setForm(EMPTY_FORM);
      setImageFile(null);
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }, 200);
  };

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="border-b border-slate-800 px-6 lg:px-8 py-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Categories</h1>
            <p className="text-slate-400 mt-1 text-sm">
              {categories.length} total categories
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchCategories}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white rounded-xl text-sm font-medium transition"
            >
              <RefreshCw size={15} /> Refresh
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white rounded-xl text-sm font-medium transition"
            >
              <Download size={15} /> Export CSV
            </button>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-indigo-500/20"
            >
              <Plus size={16} /> Add Category
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-5 relative max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="p-6 lg:p-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full" />
            <p className="text-slate-400">Loading categories...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <ImageIcon size={48} className="text-slate-600" />
            <p className="text-slate-400 font-medium">No categories found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((cat) => (
              <div
                key={cat.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all group"
              >
                <div className="relative h-44 bg-slate-800">
                  <CategoryImage name={cat.name} />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-white">{cat.name}</h3>
                  <p className="text-sm text-slate-400 line-clamp-2 mt-1">
                    {cat.description}
                  </p>
                </div>
                <div className="px-5 pb-4 flex justify-between border-t border-slate-800 pt-3">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-2 hover:bg-indigo-500/10 rounded-lg text-indigo-400 hover:text-indigo-300 transition"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => openDeleteModal(cat.id, cat.name)}
                    className="p-2 hover:bg-rose-500/10 rounded-lg text-rose-400 hover:text-rose-300 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white">
              <h2 className="text-xl font-bold">
                {isEditing ? 'Edit Category' : 'Add New Category'}
              </h2>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Image Section */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Category Image {isEditing ? '(Leave empty to keep current)' : '*'}
                </label>

                {/* Current Image (in Edit Mode) */}
                {isEditing && editingCategory && !imagePreview && (
                  <div className="mb-4">
                    <p className="text-xs text-slate-500 mb-2">Current Image</p>
                    <div className="h-40 rounded-2xl overflow-hidden border border-slate-700">
                      <CategoryImage name={editingCategory.name} />
                    </div>
                  </div>
                )}

                {/* Preview or Upload Area */}
                {imagePreview ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-700">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                    />
                    <button
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      className="absolute top-3 right-3 bg-rose-500 hover:bg-rose-400 text-white p-1.5 rounded-full transition"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl p-10 text-center cursor-pointer transition"
                  >
                    <Upload size={32} className="mx-auto text-slate-500" />
                    <p className="mt-3 font-medium text-slate-400">
                      Click to upload new image
                    </p>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <div className="px-8 py-5 border-t border-slate-800 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-6 py-2.5 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-medium transition disabled:opacity-60"
              >
                {submitting
                  ? 'Saving...'
                  : isEditing
                  ? 'Update Category'
                  : 'Add Category'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && categoryToDelete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-rose-400">Delete Category?</h2>
            <p className="mt-3 text-slate-400">
              Are you sure you want to permanently delete{' '}
              <strong className="text-white">"{categoryToDelete.name}"</strong>?
              <br />
              This action cannot be undone.
            </p>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setCategoryToDelete(null);
                }}
                className="flex-1 py-3 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl transition"
              >
                Yes, Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}