import { Product, Business } from '../types';

interface ProductCardProps {
  product: Product;
  parentBusiness: Business;
  onClick: () => void;
}

export function ProductCard({ product, parentBusiness, onClick }: ProductCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden border border-gray-100 dark:border-gray-700"
    >
      <div className="flex gap-4 p-4">
        {product.image && (
          <div className="flex-shrink-0 w-24 h-24">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg truncate">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {parentBusiness.name}
              </p>
            </div>
            <div className="flex-shrink-0">
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                ${product.price.toFixed(2)}
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
}
