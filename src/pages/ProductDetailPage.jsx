import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import axios from 'axios';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  
  useEffect(() => {
    if (product?.image && !selectedImage) {
      setSelectedImage(product.image);
    }
  }, [product]);

  const allImages = product ? [product.image, ...(product.images?.map(img => img.image) || [])].filter(Boolean) : [];
  
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/products/${slug}/`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ürün detayı çekilirken hata oluştu:", err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white">
        <svg className="w-12 h-12 animate-spin mb-4 text-[#ffb800]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <h2 className="text-xl font-medium tracking-widest text-[#ffb800]">YÜKLENİYOR...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white">
        <h1 className="text-4xl font-semibold mb-4">Ürün Bulunamadı</h1>
        <p className="text-white/60 mb-6">Aradığınız ürün mevcut değil veya kaldırılmış olabilir.</p>
        <button 
          onClick={() => navigate('/')} 
          className="px-6 py-2 bg-[#ffb800] text-black font-medium rounded hover:bg-[#e5a600] transition-colors"
        >
          Ana Sayfaya Dön
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-[100dvh] bg-[#0a0a0a] text-white flex flex-col md:flex-row overflow-hidden font-sans">
      
      {/* Sol Kısım: Ürün Görseli */}
      <div className="w-full h-[45vh] md:w-3/5 md:h-full relative bg-gradient-to-br from-[#0a0a0a] to-[#111111] border-b md:border-b-0 md:border-r border-white/10 shrink-0 flex items-center justify-center p-6 md:p-12">
        <div className="absolute top-6 left-6 z-10">
          <button 
            onClick={() => navigate('/urunlerimiz')}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium backdrop-blur-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Geri Dön
          </button>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full relative flex flex-col items-center justify-center gap-6"
        >
          {selectedImage ? (
            <div className="flex-1 w-full relative flex items-center justify-center min-h-0 group/gallery">
              
              {/* Sol Buton (Önceki) */}
              {allImages.length > 1 && (
                <button 
                  onClick={() => {
                    const idx = allImages.indexOf(selectedImage);
                    setSelectedImage(allImages[(idx - 1 + allImages.length) % allImages.length]);
                  }}
                  className="absolute left-2 md:left-6 p-2 md:p-3 bg-black/50 hover:bg-[#ffb800] text-white hover:text-black rounded-full backdrop-blur-sm transition-all opacity-0 group-hover/gallery:opacity-100 z-10"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              <img 
                src={selectedImage} 
                alt={product.title} 
                className="max-w-full max-h-full object-contain rounded-lg transition-all duration-300"
              />

              {/* Sağ Buton (Sonraki) */}
              {allImages.length > 1 && (
                <button 
                  onClick={() => {
                    const idx = allImages.indexOf(selectedImage);
                    setSelectedImage(allImages[(idx + 1) % allImages.length]);
                  }}
                  className="absolute right-2 md:right-6 p-2 md:p-3 bg-black/50 hover:bg-[#ffb800] text-white hover:text-black rounded-full backdrop-blur-sm transition-all opacity-0 group-hover/gallery:opacity-100 z-10"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}

            </div>
          ) : (
            <div className="flex-1 w-full flex flex-col items-center justify-center text-white/30">
              <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p>Görsel Bulunamadı</p>
            </div>
          )}

          {allImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 w-full justify-start md:justify-center px-4 custom-scrollbar shrink-0">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 shrink-0 rounded-md overflow-hidden border-2 transition-all ${selectedImage === img ? 'border-[#ffb800] scale-105' : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30'}`}
                >
                  <img src={img} alt={`thumbnail-${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Sağ Kısım: Ürün Bilgileri */}
      <div className="w-full h-[55vh] md:w-2/5 md:h-full p-6 md:p-10 overflow-y-auto flex flex-col justify-start md:justify-center">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-2xl md:text-4xl font-semibold text-white mb-4 tracking-wide drop-shadow-lg">
            {product.title}
          </h1>
          
          <div className="w-10 h-1 bg-[#ffb800] mb-4 rounded-full shadow-[0_0_10px_rgba(255, 184, 0,0.5)]"></div>
          
          <p className="text-white/70 text-sm md:text-base leading-relaxed mb-6">
            {product.description}
          </p>
          
          <button 
            onClick={() => window.open(`https://wa.me/905336547937?text=Merhaba,%20${encodeURIComponent(product.title)}%20ürünü%20hakkında%20bilgi%20almak%20istiyorum.`, '_blank')}
            className="mt-6 w-full py-3.5 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] font-semibold rounded-lg hover:bg-[#25D366] hover:text-black transition-all hover:shadow-[0_0_20px_rgba(37,211,102,0.3)] group relative overflow-hidden flex items-center justify-center gap-3"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              WhatsApp ile İletişim Kur
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#25D366]/20 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          </button>
        </motion.div>
      </div>
      
    </div>
  );
}
