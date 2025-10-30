import React from 'react';
import { ProductCard } from './ProductCard';
import type { Product } from '../types';

interface ProductListProps {
    title: string;
    products: Product[];
    onProductSelect: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ title, products, onProductSelect }) => {
    if (!products || products.length === 0) {
        return null;
    }
    const sectionId = title.toLowerCase().replace(/ /g, '-').replace(/:/g, '');

    return (
        <section id={sectionId} className="mb-16">
            <h2 className="text-3xl font-bold mb-8 border-l-4 border-teal-400 pl-4">{title}</h2>
            <div className="grid grid-cols-2 gap-4 sm:gap-8">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} onProductSelect={onProductSelect} />
                ))}
            </div>
        </section>
    );
};