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

  return (
    <div 
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 cursor-pointer group"
      onClick={() => onProductSelect(product)}
    >
      <div className="relative aspect-square">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-cover" 
        />
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
