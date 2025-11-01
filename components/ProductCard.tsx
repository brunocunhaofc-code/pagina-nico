import React from 'react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onProductSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onProductSelect }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-UY', { style: 'currency', currency: 'UYU' }).format(price);
  };
  
  const imageUrl = product.images && product.images.length > 0 ? product.images[0] : null;

  return (
    <div 
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 cursor-pointer group"
      onClick={() => onProductSelect(product)}
    >
      <div className="relative aspect-square">
        {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover" 
            />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-700">
            <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          </div>
        )}
        {product.isBestSeller && (
            <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded">
                MÁS VENDIDO
            </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-400">{product.brand}</p>
        <h3 className="text-lg font-semibold truncate">{product.name}</h3>
        <p className="text-xl font-bold text-teal-400 mt-2">{formatPrice(product.price)}</p>
      </div>
    </div>
  );
};