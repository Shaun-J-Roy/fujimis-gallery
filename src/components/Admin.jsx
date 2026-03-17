import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, CheckCircle2, Loader2, Trash2 } from 'lucide-react';
import { supabase } from '../supabase';

const Admin = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [dragActive, setDragActive] = useState(false);
  
  // Library State
  const [libraryFiles, setLibraryFiles] = useState([]);
  const [loadingLibrary, setLoadingLibrary] = useState(true);
  
  const inputRef = useRef(null);

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) window.URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Fetch existing photos on mount
  useEffect(() => {
     fetchLibrary();
  }, []);

  const fetchLibrary = async () => {
     setLoadingLibrary(true);
     if (!import.meta.env.VITE_SUPABASE_URL) return;

     const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false });

     if (!error && data) {
        setLibraryFiles(data);
     }
     setLoadingLibrary(false);
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  const processFile = (selectedFile) => {
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setPreviewUrl(window.URL.createObjectURL(selectedFile));
    } else {
      showToast("Please select a valid image file.", "error");
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title) return;

    try {
      setUploading(true);

      if (!import.meta.env.VITE_SUPABASE_URL) {
         showToast("Configure Supabase credentials in .env first.", "error");
         setUploading(false);
         return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `photos/${fileName}`;

      // 1. Upload file to Supabase Storage bucket
      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(filePath);

      // 3. Insert into Supabase database
      const { data: newDoc, error: dbError } = await supabase
        .from('photos')
        .insert([{
            title,
            description,
            url: publicUrl
        }])
        .select();

      if (dbError) throw dbError;

      showToast("Photo uploaded successfully to your archive!");
      
      // Update library locally instead of re-fetching
      if (newDoc && newDoc[0]) {
         setLibraryFiles(prev => [newDoc[0], ...prev]);
      }

      // Reset form
      setFile(null);
      setPreviewUrl(null);
      setTitle('');
      setDescription('');

    } catch (err) {
      console.error(err);
      showToast(err.message || "An error occurred during upload.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (photo, e) => {
     e.stopPropagation();
     
     if (!window.confirm(`Are you sure you want to delete "${photo.title}"?`)) return;

     try {
       // Extract filepath from public URL
       // Format is typically: https://[project].supabase.co/storage/v1/object/public/portfolio-images/photos/[filename]
       const urlParts = photo.url.split('/portfolio-images/');
       if (urlParts.length !== 2) throw new Error("Could not parse file path from URL.");
       
       const filePath = urlParts[1];

       // 1. Delete from database
       const { error: dbError } = await supabase
         .from('photos')
         .delete()
         .eq('id', photo.id);

       if (dbError) throw dbError;

       // 2. Delete from storage bucket
       const { error: storageError } = await supabase.storage
         .from('portfolio-images')
         .remove([filePath]);

       if (storageError) console.warn("Deleted from DB, but failed to delete from storage:", storageError);

       // 3. Remove from UI
       setLibraryFiles(prev => prev.filter(p => p.id !== photo.id));
       showToast("Photo removed from archive.");

     } catch (err) {
        console.error("Delete failed", err);
        showToast(err.message || "Failed to delete photo.", "error");
     }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white p-6 md:p-12 lg:p-24 selection:bg-white/20 pb-40">
      
      {/* Toast Notification */}
      <div className={`fixed bottom-8 right-8 z-50 transition-all duration-500 transform ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'}`}>
        <div className={`px-6 py-4 rounded-xl liquid-glass border flex items-center gap-3 shadow-2xl ${toast.type === 'error' ? 'border-red-500/30 text-red-100' : 'border-white/10 text-white'}`}>
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          <span className="text-sm font-medium tracking-wide">{toast.message}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-16">
        
        {/* LEFT COLUMN: UPLOAD FORM */}
        <div className="w-full xl:w-1/2 max-w-2xl">
          <div className="mb-12">
            <h1 className="text-3xl md:text-5xl font-medium tracking-tight mb-4">Archive Management</h1>
            <p className="text-white/50 text-base md:text-lg font-light">Upload new physical or digital captures to your public portfolio.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Enhanced Drag & Drop Zone */}
            <div 
              className={`relative rounded-3xl p-1 transition-all duration-300 ${dragActive ? 'bg-white/20 scale-[1.02]' : 'bg-white/5'} ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
              
              <div className={`relative h-64 md:h-[400px] rounded-[1.4rem] border border-dashed border-white/20 overflow-hidden flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors group`}>
                 {previewUrl ? (
                   <>
                     <img src={previewUrl} alt="Preview" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white bg-black/50 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md">Click to change image</span>
                     </div>
                   </>
                 ) : (
                   <div className="flex flex-col items-center text-center px-6">
                      <div className="w-16 h-16 rounded-full liquid-glass mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <UploadCloud className="w-6 h-6 text-white/70" />
                      </div>
                      <p className="text-xl md:text-2xl font-medium mb-2">Drag image here</p>
                      <p className="text-sm text-white/40">or click to browse from device</p>
                   </div>
                 )}
                 <div 
                   className="absolute inset-0 z-10"
                   onClick={() => inputRef.current?.click()}
                 />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="Title defining the capture"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/30 focus:bg-white/10 transition-all text-lg"
                  required
                  disabled={uploading}
                />
              </div>
              
              <div>
                <textarea
                  placeholder="Context or technical details (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/30 focus:bg-white/10 transition-all resize-none text-base"
                  disabled={uploading}
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={!file || !title || uploading}
                className={`bg-white text-black px-10 py-5 rounded-full font-medium tracking-wide flex items-center gap-3 transition-all ${(!file || !title || uploading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/90 hover:scale-105 active:scale-95'}`}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-5 h-5" />
                    Publish Photo
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: LIBRARY PANEL */}
        <div className="w-full xl:w-1/2 max-w-2xl xl:pl-16 xl:border-l border-white/10">
          <div className="mb-8 flex justify-between items-end">
             <h2 className="text-2xl md:text-3xl font-medium tracking-tight">Recent Archives</h2>
             <span className="text-white/40 text-sm font-medium">{libraryFiles.length} Photos</span>
          </div>

          {loadingLibrary ? (
             <div className="w-full h-64 flex flex-col items-center justify-center text-white/40 gap-4 border border-white/5 border-dashed rounded-3xl">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-sm">Loading library...</span>
             </div>
          ) : libraryFiles.length === 0 ? (
             <div className="w-full h-64 flex items-center justify-center text-white/40 border border-white/5 border-dashed rounded-3xl text-sm">
                No photos archived yet.
             </div>
          ) : (
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 auto-rows-max h-[800px] overflow-y-auto pr-2 pb-12 custom-scrollbar">
                {libraryFiles.map((photo) => (
                   <div key={photo.id} className="relative aspect-square rounded-2xl overflow-hidden group bg-white/5 border border-white/5">
                      <img 
                        src={photo.url} 
                        alt={photo.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4">
                         <span className="text-white text-xs font-medium truncate w-full text-center">{photo.title}</span>
                         <button 
                           onClick={(e) => handleDelete(photo, e)}
                           className="w-10 h-10 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors"
                           title="Delete Photo"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                   </div>
                ))}
             </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default Admin;
