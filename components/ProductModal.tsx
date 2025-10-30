import React, { useState } from 'react';
import type { Product } from '../types';
import { BackArrowIcon } from './ui/Icons';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-UY', { style: 'currency', currency: 'UYU' }).format(price);
  };
  
  const whatsappMessage = `Hola, quiero comprar este modelo: ${product.name} (${product.brand})`;
  const whatsappUrl = `https://wa.me/59800000000?text=${encodeURIComponent(whatsappMessage)}`;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };
  
  const selectImage = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setCurrentImageIndex(index);
  }

  return (
    <div 
      className="fixed inset-0 bg-gray-900 z-50 overflow-y-auto animate-slide-in-from-right"
    >
      <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
        <div className="py-4 mb-4">
            <button onClick={onClose} className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 transition-colors font-semibold">
                <BackArrowIcon />
                Volver al catálogo
            </button>
        </div>

        <div 
          className="w-full flex flex-col md:flex-row overflow-hidden gap-8"
        >
          <div className="w-full md:w-1/2 relative">
            <div className="relative aspect-square">
              <img src={product.images[currentImageIndex]} alt={product.name} className="w-full h-full object-cover rounded-lg"/>
              {product.images.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors z-20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button onClick={nextImage} className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/20 p-2 rounded-full hover:bg-white/40 transition-colors z-20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                </>
              )}
            </div>
            <div className="mt-4 flex justify-center space-x-2">
                  {product.images.map((img, index) => (
                      <button key={index} onClick={(e) => selectImage(e, index)} className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${index === currentImageIndex ? 'border-teal-400' : 'border-transparent'}`}>
                          <img src={img} alt={`thumbnail ${index}`} className="w-full h-full object-cover" />
                      </button>
                  ))}
              </div>
          </div>

          <div className="w-full md:w-1/2 p-6 flex flex-col bg-gray-800/50 rounded-lg">
            <div className="flex-grow">
              <p className="text-md text-teal-400 font-semibold">{product.brand}</p>
              <h2 className="text-4xl font-bold my-2">{product.name}</h2>
              <p className="text-gray-300 mb-4 leading-relaxed">{product.description}</p>
              <p className="text-5xl font-extrabold my-6 bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-teal-400">{formatPrice(product.price)}</p>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full mt-4 flex items-center justify-center px-4 py-4 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition-colors duration-300 text-lg"
            >
              Comprar
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};