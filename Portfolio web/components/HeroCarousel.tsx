import React, { useState, useEffect } from 'react';
import { Banner } from '../types';

interface HeroCarouselProps {
  banners: Banner[];
  accentColor: string;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ banners, accentColor }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  if (banners.length === 0) return null;

  return (
    <div className="relative w-full bg-white overflow-hidden shadow-sm group">
      <div 
        className="relative h-[400px] md:h-[480px] w-full flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div key={index} className="min-w-full h-full flex flex-col md:flex-row relative">
            {/* Background for mobile / visual consistency */}
            <div className="absolute inset-0 bg-gray-50 md:hidden" />
            
            {/* Left Content (Text) - Order 2 on mobile, 1 on desktop */}
            <div className="relative flex-1 flex flex-col justify-center px-8 md:px-16 py-12 md:py-0 order-2 md:order-1 z-10">
               <div 
                 className="absolute inset-0 opacity-10 hidden md:block" 
                 style={{ backgroundColor: accentColor }} 
               />
               <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                 {banner.headline}
               </h2>
               <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-md">
                 {banner.subheadline}
               </p>
               <button 
                 className="w-fit px-8 py-3 rounded-full text-white font-semibold shadow-lg transform transition hover:scale-105 active:scale-95"
                 style={{ backgroundColor: accentColor }}
               >
                 Ver Ofertas
               </button>
            </div>

            {/* Right Content (Image) - Order 1 on mobile, 2 on desktop */}
            <div className="relative h-64 md:h-full flex-1 order-1 md:order-2 overflow-hidden">
               <img 
                 src={`https://picsum.photos/seed/banner_${banner.imageKeyword}_${index}/800/600`}
                 alt={banner.headline}
                 className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
               />
               {/* Overlay for mobile text readability if needed, though we separated text */}
               <div className="absolute inset-0 bg-gradient-to-t from-gray-50 to-transparent md:hidden"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-20"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-20"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentIndex === idx ? 'w-8' : 'bg-opacity-50'
            }`}
            style={{ 
              backgroundColor: currentIndex === idx ? accentColor : '#cbd5e1' 
            }}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};