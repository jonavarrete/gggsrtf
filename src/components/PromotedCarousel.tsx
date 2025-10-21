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
  const [showArrows, setShowArrows] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentIndex(0);
  }, [businesses]);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const totalWidth = businesses.length * (container.offsetWidth / 3);
        setShowArrows(totalWidth > container.offsetWidth);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [businesses]);

  if (businesses.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : businesses.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < businesses.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="mb-8 pb-4">
      <div className="relative">
        {showArrows && (
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

        <div ref={containerRef} className="overflow-visible px-10">
          <div
            className="flex transition-transform duration-300 ease-in-out gap-4"
            style={{ transform: `translateX(-${currentIndex * 33.333}%)` }}
          >
            {businesses.map((business) => (
              <div key={business.id} className="w-[calc(33.333%-1rem)] flex-shrink-0">
                <BusinessCard business={business} onClick={() => onBusinessClick(business)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
