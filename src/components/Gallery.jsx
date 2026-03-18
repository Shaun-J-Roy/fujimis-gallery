import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { X, Download, Loader2 } from 'lucide-react';

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!import.meta.env.VITE_SUPABASE_URL) return;

    const fetchPhotos = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setPhotos(data);
      }
      setLoading(false);
    };

    fetchPhotos();

    // Setup realtime subscription
    const channel = supabase
      .channel('public:photos')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'photos' }, (payload) => {
        setPhotos((current) => [payload.new, ...current]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDownload = async (photo) => {
    try {
      const response = await fetch(photo.url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      const fileExt = photo.url.split('.').pop() || 'jpg';
      link.download = `${photo.title || 'fujimi-gallery-photo'}.${fileExt}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed", err);
      window.open(photo.url, '_blank');
    }
  };

  const openLightbox = (photo, event) => {
    // Capture the exact bounding box of the clicked image
    const rect = event.currentTarget.getBoundingClientRect();
    setClickPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    });
    setSelectedPhoto(photo);

    // Slight delay to allow DOM to render before triggering the CSS transition state
    setTimeout(() => setIsModalOpen(true), 10);
  };

  const closeLightbox = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedPhoto(null), 400); // match transition duration
  };

  return (
    <>
      <section className="relative z-10 w-full min-h-screen px-4 sm:px-8 lg:px-12 py-32 overflow-hidden">

        {/* Gradual blur layer */}
        <div className="absolute inset-0 backdrop-blur-2xl bg-black/40 
  [mask-image:linear-gradient(to_bottom,transparent,black_30%,black)]" />

        <div className="relative max-w-[1400px] mx-auto">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-4xl lg:text-6xl font-medium tracking-tight text-white mb-2">Visual Archive</h2>
            <span className="text-white/50 text-sm tracking-widest uppercase mb-4">Curated Works</span>
          </div>

          {loading ? (
            <div className="w-full min-h-[50vh] flex flex-col items-center justify-center text-white/40 gap-6 animate-in fade-in duration-500">
              <Loader2 className="w-10 h-10 animate-spin text-white/20" />
              <span className="text-sm tracking-widest uppercase">Fetching Archives...</span>
            </div>
          ) : photos.length === 0 ? (
            <div className="w-full min-h-[50vh] flex flex-col items-center justify-center text-white/40 border border-white/5 border-dashed rounded-[2rem] animate-in fade-in duration-500">
              <span className="text-sm tracking-widest uppercase">No Archives Found.</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in duration-700">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative group rounded-2xl overflow-hidden bg-white/5 cursor-pointer aspect-[3/4]"
                  onClick={(e) => openLightbox(photo, e)}
                >
                  <img
                    src={photo.url}
                    alt={photo.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Liquid Glass Overlay on Hover */}
                  <div className="absolute inset-0 liquid-glass opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <h3 className="text-xl font-medium text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{photo.title}</h3>
                    <p className="text-sm text-white/70 mt-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                      {photo.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-xl transition-opacity duration-400 ease-in-out ${isModalOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={closeLightbox}
        >
          {/* Top Actions Bar */}
          <div className={`absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50 mix-blend-difference transition-opacity duration-300 delay-100 ${isModalOpen ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex flex-col">
              <span className="text-white font-medium text-xl">{selectedPhoto.title}</span>
              {selectedPhoto.description && (
                <span className="text-white/60 text-sm">{selectedPhoto.description}</span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // prevent modal close
                  handleDownload(selectedPhoto);
                }}
                className="w-12 h-12 rounded-full liquid-glass flex items-center justify-center hover:bg-white/20 transition-colors group"
              >
                <Download className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeLightbox();
                }}
                className="w-12 h-12 rounded-full liquid-glass-strong flex items-center justify-center hover:bg-white/20 transition-colors group"
              >
                <X className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
              </button>
            </div>
          </div>

          {/* Enlarged Image Container */}
          <div
            className="relative w-full max-w-7xl max-h-screen flex items-center justify-center p-12 transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              transformOrigin: `${clickPosition.x}px ${clickPosition.y}px`,
              transform: isModalOpen ? 'scale(1) translate(0px, 0px)' : 'scale(0.3)',
              opacity: isModalOpen ? 1 : 0
            }}
            onClick={(e) => e.stopPropagation()} // Click image shouldn't close modal
          >
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.title}
              className="max-w-full max-h-[85vh] object-contain rounded-md shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;
