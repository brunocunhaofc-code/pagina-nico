import React from 'react';
import type { Product } from '../types';

interface HeroCarouselProps {
    products: Product[];
    onProductSelect: (product: Product) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ products, onProductSelect }) => {
    if (!products || products.length === 0) {
        return null;
    }

    const animationDuration = products.length * 6; // 6 segundos por tarjeta para un ritmo más pausado

    const productCard = (product: Product, index: number) => (
        <div 
            key={`${product.id}-${index}`}
            className="flex-shrink-0 w-64 sm:w-72 md:w-80 mx-4"
            aria-hidden={index >= products.length}
        >
            <div
                className="relative aspect-square rounded-xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 cursor-pointer bg-gray-800"
                onClick={() => onProductSelect(product)}
            >
                <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
                    <h3 className="text-2xl font-bold text-white shadow-black/50 [text-shadow:0_2px_4px_var(--tw-shadow-color)]">{product.name}</h3>
                    <p className="text-teal-400 font-semibold">{product.brand}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full overflow-hidden py-8 group mb-12">
            <div
                className="flex w-fit animate-scrolling group-hover:[animation-play-state:paused]"
                style={{ '--animation-duration': `${animationDuration}s` } as React.CSSProperties}
            >
                {/* Renderizar la lista de productos dos veces para el bucle infinito */}
                {[...products, ...products].map(productCard)}
            </div>
        </div>
    );
};