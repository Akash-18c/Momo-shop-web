import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiTrash2, FiLink, FiImage, FiX, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api, { bustCache } from '../../services/api';
import { useNotifs } from './AdminLayout';

export default function AdminGallery() {
  const { t, dark } = useNotifs();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState('file');
  const [caption, setCaption] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [urlPreview, setUrlPreview] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const fileInputRef = useRef();

  const fetchImages = () =>
    api.get('/gallery').then(r => setImages(r.data)).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { fetchImages(); }, []);

  const selectFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return toast.error('Please select an image file');
    // show preview immediately from original
    setFilePreview(URL.createObjectURL(file));
    // compress client-side before storing
    compressImage(file).then(compressed => setSelectedFile(compressed));
  };

  // Canvas-based client-side compression — shrinks to max 900px, JPEG 82%
  const compressImage = (file) => new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const MAX = 900;
      let { width, height } = img;
      if (width > MAX) { height = Math.round(height * MAX / width); width = MAX; }
      const canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      canvas.toBlob(blob => resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' })), 'image/jpeg', 0.82);
    };
    img.src = URL.createObjectURL(file);
  });

  const handleFileInput = (e) => selectFile(e.target.files[0]);
  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); selectFile(e.dataTransfer.files[0]); };
  const clearFile = () => { setSelectedFile(null); setFilePreview(''); if (fileInputRef.current) fileInputRef.current.value = ''; };
  const handleUrlChange = (e) => { setUrlInput(e.target.value); setUrlPreview(e.target.value); };

  const handleFileUpload = async () => {
    if (!selectedFile) return toast.error('Please select an image first');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', selectedFile);
      fd.append('caption', caption);
      await api.post('/gallery', fd);
      toast.success('Image uploaded!');
      bustCache('/gallery');
      setCaption(''); clearFile(); fetchImages();
    } catch (err) { toast.error(err.message || 'Upload failed'); }
    finally { setUploading(false); }
  };

  const handleUrlUpload = async () => {
    if (!urlInput.trim()) return toast.error('Please enter an image URL');
    setUploading(true);
    try {
      await api.post('/gallery/url', { imageUrl: urlInput.trim(), caption });
      toast.success('Image added!');
      bustCache('/gallery');
      setCaption(''); setUrlInput(''); setUrlPreview(''); fetchImages();
    } catch (err) { toast.error(err.message || 'Failed to add image'); }
    finally { setUploading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image?')) return;
    try { await api.delete(`/gallery/${id}`); toast.success('Deleted!'); bustCache('/gallery'); fetchImages(); }
    catch (err) { toast.error(err.message || 'Failed'); }
  };

  const inputStyle = {
    background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
    border: `1px solid ${t.border}`,
    color: t.text,
    borderRadius: '0.75rem',
    padding: '0.625rem 1rem',
    width: '100%',
    fontSize: '0.875rem',
    outline: 'none',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black" style={{ color: t.text, fontFamily: 'Poppins,sans-serif' }}>Gallery</h1>
        <p className="text-sm mt-0.5" style={{ color: t.textMuted }}>{images.length} images</p>
      </div>

      {/* Upload Card */}
      <div className="rounded-2xl p-6" style={{ background: t.card, border: `1px solid ${t.border}` }}>
        <h2 className="font-bold text-lg mb-4" style={{ color: t.text }}>Add New Image</h2>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl mb-5 w-fit"
          style={{ background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
          {[{ id: 'file', icon: FiImage, label: 'Upload File' }, { id: 'url', icon: FiLink, label: 'Image URL' }].map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => setTab(id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: tab === id ? t.bg : 'transparent',
                color: tab === id ? t.text : t.textMuted,
                boxShadow: tab === id ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              }}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === 'file' ? (
            <motion.div key="file" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="space-y-4">
              {!filePreview ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all"
                  style={{
                    borderColor: dragOver ? '#c9a84c' : t.border,
                    background: dragOver ? 'rgba(201,168,76,0.05)' : 'transparent',
                    transform: dragOver ? 'scale(1.01)' : 'scale(1)',
                  }}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: 'rgba(201,168,76,0.1)', color: '#c9a84c' }}>
                    <FiUpload size={26} />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold" style={{ color: t.text }}>
                      Drop image here or <span style={{ color: '#c9a84c' }}>browse</span>
                    </p>
                    <p className="text-sm mt-1" style={{ color: t.textMuted }}>PNG, JPG, WEBP up to 5MB</p>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden"
                  style={{ background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}>
                  <img src={filePreview} alt="preview" className="w-full max-h-64 object-contain" />
                  <button onClick={clearFile}
                    className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full hover:bg-black/80 transition-colors">
                    <FiX size={16} />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                    {selectedFile?.name}
                  </div>
                </div>
              )}
              <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="Caption (optional)" style={inputStyle} />
              <button onClick={handleFileUpload} disabled={uploading || !selectedFile}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm transition-all disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg,#c9a84c,#f0d060)', color: '#1a0e00' }}>
                <FiUpload size={16} />
                {uploading ? 'Uploading...' : 'Upload Image'}
              </button>
            </motion.div>
          ) : (
            <motion.div key="url" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: t.text }}>Image URL</label>
                <div className="relative">
                  <FiLink className="absolute left-4 top-1/2 -translate-y-1/2" size={16} style={{ color: t.textMuted }} />
                  <input value={urlInput} onChange={handleUrlChange} placeholder="https://example.com/image.jpg"
                    style={{ ...inputStyle, paddingLeft: '2.5rem' }} />
                  {urlInput && (
                    <button onClick={() => { setUrlInput(''); setUrlPreview(''); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                      style={{ color: t.textMuted }}>
                      <FiX size={16} />
                    </button>
                  )}
                </div>
              </div>

              <AnimatePresence>
                {urlPreview && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="rounded-2xl overflow-hidden"
                    style={{ border: `1px solid ${t.border}`, background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}>
                    <img src={urlPreview} alt="URL preview" className="w-full max-h-64 object-contain"
                      onError={() => setUrlPreview('')} />
                    <p className="text-xs px-3 py-2 truncate" style={{ color: t.textMuted }}>{urlPreview}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="Caption (optional)" style={inputStyle} />
              <button onClick={handleUrlUpload} disabled={uploading || !urlInput.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm transition-all disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg,#c9a84c,#f0d060)', color: '#1a0e00' }}>
                <FiPlus size={16} />
                {uploading ? 'Adding...' : 'Add Image'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Gallery Grid */}
      <div>
        <h2 className="font-bold mb-4" style={{ color: t.text }}>Gallery ({images.length})</h2>

        {loading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2.5">
            {Array(16).fill(0).map((_, i) => (
              <div key={i} className="rounded-xl animate-pulse" style={{ aspectRatio: '1', background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)' }} />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-16" style={{ color: t.textMuted }}>
            <FiImage size={48} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No images yet</p>
            <p className="text-sm mt-1">Upload your first image above</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2.5">
            {images.map((img, i) => (
              <motion.div key={img._id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.03 }}
                className="relative group rounded-xl overflow-hidden"
                style={{ aspectRatio: '1', background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
                <img src={img.imageUrl} alt={img.caption || 'Gallery'}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all flex items-center justify-center">
                  <button onClick={() => handleDelete(img._id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-lg">
                    <FiTrash2 size={12} />
                  </button>
                </div>
                {img.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-1.5 py-1 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-[9px] font-medium truncate">{img.caption}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
