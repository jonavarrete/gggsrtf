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
  const [itemsPerView, setItemsPerView] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentIndex(0);
  }, [businesses]);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const width = container.offsetWidth;

        let items = 1;
        if (width >= 1024) items = 3;
        else if (width >= 640) items = 2;

        setItemsPerView(items);
        setShowArrows(businesses.length > items);
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
    setCurrentIndex((prev) => {
      const nextIndex = prev + 1;
      return nextIndex <= maxIndex ? nextIndex : 0;
    });
  };

  const maxIndex = Math.max(0, businesses.length - itemsPerView);

  return (
    <div className="mb-6 sm:mb-8 pb-4">
      <h2 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 px-2 sm:px-0">{title}</h2>
      <div className="relative">
        {showArrows && (
          <>
            <button
              onClick={handlePrev}
              className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 p-2 rounded-full shadow-lg transition-all items-center justify-center"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            </button>
            <button
              onClick={handleNext}
              className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 p-2 rounded-full shadow-lg transition-all items-center justify-center"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            </button>
          </>
        )}

        <div ref={containerRef} className="overflow-hidden px-2 sm:px-10">
          <div
            className="flex transition-transform duration-300 ease-in-out gap-3 sm:gap-4"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            }}
          >
            {businesses.map((business) => (
              <div
                key={business.id}
                className="flex-shrink-0"
                style={{ width: `calc(${100 / itemsPerView}% - ${(itemsPerView - 1) * (itemsPerView === 1 ? 12 : 16) / itemsPerView}px)` }}
              >
                <BusinessCard business={business} onClick={() => onBusinessClick(business)} />
              </div>
            ))}
          </div>
        </div>

        {showArrows && (
          <div className="flex sm:hidden justify-center gap-2 mt-4">
            <button
              onClick={handlePrev}
              className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:shadow-lg transition-all"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-4 h-4 text-gray-700 dark:text-gray-200" />
            </button>
            <button
              onClick={handleNext}
              className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:shadow-lg transition-all"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-4 h-4 text-gray-700 dark:text-gray-200" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
