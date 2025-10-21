import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Business } from '../types';
import { BusinessCard } from './BusinessCard';

interface PromotedCarouselProps {
  businesses: Business[];
  title: string;
  onBusinessClick: (business: Business) => void;
}

export function PromotedCarousel({ businesses, title, onBusinessClick }: PromotedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentIndex(0);
  }, [businesses]);

  if (businesses.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : businesses.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < businesses.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold text-gray-800 mb-3">{title}</h2>
      <div className="relative">
        {businesses.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}

        <div ref={containerRef} className="overflow-hidden px-10">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {businesses.map((business) => (
              <div key={business.id} className="w-full flex-shrink-0 px-2">
                <BusinessCard business={business} onClick={() => onBusinessClick(business)} />
              </div>
            ))}
          </div>
        </div>

        {businesses.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {businesses.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-blue-600 w-6' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
