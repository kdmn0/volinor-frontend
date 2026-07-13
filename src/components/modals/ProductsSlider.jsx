import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ProductsSlider = () => {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/products/`)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error("Ürünler yüklenirken hata oluştu:", err);
      });
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (products.length === 0) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex, products.length]);

  if (products.length === 0) {
    return (
      <div className="relative w-full h-[600px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 opacity-50">
          <svg className="w-8 h-8 animate-spin text-[#ffb800]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm tracking-widest font-semibold uppercase text-white">YÜKLENİYOR...</span>
        </div>
      </div>
    );
  }

  const currentProduct = products[currentIndex];

  return (
    <div className="relative w-full min-h-[600px] h-[75vh] bg-transparent flex flex-col pt-8 md:pt-12 px-4 md:px-24 select-none border border-white/5 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent">
      
      {/* BACKGROUND DECORATIONS */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-2xl">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl opacity-5">
          <div className="w-full h-full border-[1px] border-white rounded-full"></div>
        </div>
      </div>

      {/* TOP HEADER */}
      <div className="relative z-20 flex justify-between items-start mb-8 md:mb-0 mt-4 md:mt-0">
        <div>
          <h1 className="text-3xl md:text-5xl font-display font-light tracking-[0.25em] md:tracking-[0.3em] uppercase drop-shadow-md">
            <span className="text-white">ÜRÜN</span><span className="text-[#ffb800]">LERİMİZ</span>
          </h1>
          <p className="text-white/40 text-[10px] md:text-xs tracking-[0.35em] mt-2 font-medium">
            GÜVENLİK | DAYANIKLILIK | TEKNOLOJİ
          </p>
        </div>
        {/* 3x3 dot grid icon */}
        <div className="hidden md:grid grid-cols-3 gap-1 opacity-80 mt-2">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 bg-[#ffb800] rounded-sm"></div>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col md:flex-row w-full h-full relative mt-4 md:mt-0">
        
        {/* LEFT SIDE: Text Content */}
        <div className="w-full md:w-1/3 h-full flex flex-col justify-center z-20 relative">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${currentIndex}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <h2 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 uppercase tracking-widest drop-shadow-lg">
                {currentProduct.title}
              </h2>
              
              <div className="w-12 h-0.5 bg-white/20 mb-6"></div>

              <p className="text-white/60 text-sm leading-relaxed mb-10 max-w-sm font-light">
                {currentProduct.description}
              </p>

              <button 
                className="bg-[#ffb800] text-black font-bold text-sm tracking-widest px-8 py-3 md:py-4 transition-transform hover:scale-105 active:scale-95 group relative flex items-center justify-center gap-3 w-max"
                style={{ clipPath: 'polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%)' }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/urunler/${currentProduct.slug}`);
                }}
              >
                DETAYLARI GÖRÜNTÜLE
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* CENTER/RIGHT SIDE: Image */}
        <div className="w-full md:w-2/3 h-[40vh] md:h-full md:absolute top-0 right-0 flex items-center justify-center z-10 pointer-events-none mt-8 md:mt-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={`img-${currentIndex}`}
              src={currentProduct.image}
              alt={currentProduct.title}
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="w-full h-full object-contain max-h-[500px] md:max-h-[600px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            />
          </AnimatePresence>
        </div>

      </div>

      {/* NAVIGATION ARROWS */}
      <button
        onClick={prevSlide}
        className="hidden md:flex absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 items-center justify-center text-white/50 hover:border-[#ffb800] hover:text-[#ffb800] transition-colors z-30 bg-black/20 backdrop-blur-sm"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="hidden md:flex absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-[#ffb800]/50 items-center justify-center text-[#ffb800] hover:border-[#ffb800] hover:bg-[#ffb800]/10 transition-colors z-30 bg-black/20 backdrop-blur-sm"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Mobile Navigation */}
      <div className="md:hidden absolute bottom-6 right-6 flex gap-3 z-30">
          <button
            onClick={prevSlide}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 border border-white/20 text-white/50 hover:border-[#ffb800] hover:text-[#ffb800] transition-all backdrop-blur-sm"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 border border-[#ffb800]/50 text-[#ffb800] hover:bg-[#ffb800]/10 transition-all backdrop-blur-sm"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

      {/* PAGINATION LINES */}
      <div className="absolute bottom-6 right-1/2 translate-x-1/2 md:bottom-10 md:right-16 md:translate-x-0 flex items-center gap-2 z-30">
        {products.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1 rounded-full transition-all duration-300 ${
              idx === currentIndex ? "w-8 bg-[#ffb800]" : "w-4 bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>

      {/* CORNER DECORATIONS (Desktop Only) */}
      <div className="hidden md:block absolute top-6 left-6 w-8 h-8 border-t-[1.5px] border-l-[1.5px] border-[#ffb800]/40 z-20 pointer-events-none" />
      <div className="hidden md:block absolute bottom-6 right-6 w-8 h-8 border-b-[1.5px] border-r-[1.5px] border-[#ffb800]/40 z-20 pointer-events-none" />
      
      {/* Right Side dashed line decor */}
      <div className="hidden md:flex absolute top-1/2 right-4 -translate-y-1/2 flex-col gap-3 opacity-30 pointer-events-none">
         <div className="w-1 h-1 bg-white"></div>
         <div className="w-1 h-1 bg-white"></div>
         <div className="w-1 h-1 bg-white"></div>
         <div className="w-1 h-6 bg-white mt-4"></div>
      </div>
      
    </div>
  );
};

export default ProductsSlider;
