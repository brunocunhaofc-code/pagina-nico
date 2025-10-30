
import React, { useState, useEffect } from 'react';
import type { Product } from '../types';
import { supabase } from '../lib/supabaseClient';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { CloseIcon, DeleteIcon } from './ui/Icons';

interface ProductFormProps {
    product?: Product | null;
    brands: string[];
    onSave: (product: Omit<Product, 'id' | 'created_at'> | Product) => Promise<any>;
    onCancel: () => void;
    isSaving: boolean;
}

const emptyProduct: Omit<Product, 'id' | 'created_at'> = {
    name: '',
    brand: '',
    description: '',
    price: 0,
    images: [],
    isBestSeller: false,
    isMale: false,
    isFemale: false,
};

export const ProductForm: React.FC<ProductFormProps> = ({ product, brands, onSave, onCancel, isSaving }) => {
    const [formData, setFormData] = useState(product ? { ...product } : { ...emptyProduct });
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        setFormData(product ? { ...product } : { ...emptyProduct });
    }, [product]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (type === 'number') {
            setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
        }
        else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        const uploadedImageUrls: string[] = [];

        for (const file of files) {
            const fileName = `${Date.now()}-${file.name}`;
            const { data, error } = await supabase.storage
                .from('product-images')
                .upload(fileName, file);

            if (error) {
                console.error('Error uploading image:', error);
                continue;
            }
            if (data) {
                const { data: { publicUrl } } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(data.path);
                if (publicUrl) {
                    uploadedImageUrls.push(publicUrl);
                }
            }
        }

        setFormData(prev => ({ ...prev, images: [...prev.images, ...uploadedImageUrls] }));
        setIsUploading(false);
    };

    const handleImageDelete = (imageUrl: string) => {
        setFormData(prev => ({ ...prev, images: prev.images.filter(img => img !== imageUrl) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-gray-900 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 animate-fade-in-down"
             >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">{product ? 'Editar Producto' : 'Nuevo Producto'}</h2>
                    <button onClick={onCancel} className="text-gray-400 hover:text-white">
                        <CloseIcon />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input label="Nombre del Producto" name="name" value={formData.name} onChange={handleChange} required />
                    <div>
                        <label htmlFor="brand" className="block text-sm font-medium text-gray-300 mb-1">Marca</label>
                        <select
                            id="brand"
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                            required
                            className="w-full bg-gray-700 border border-gray-600 text-white rounded-md p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200"
                        >
                            <option value="">Seleccione una marca</option>
                            {brands.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Descripción</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            required
                            className="w-full bg-gray-700 border border-gray-600 text-white rounded-md p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition duration-200"
                        />
                    </div>
                    <Input label="Precio (UYU)" name="price" type="number" value={formData.price} onChange={handleChange} required />
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Imágenes</label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-4">
                            {formData.images.map(img => (
                                <div key={img} className="relative group">
                                    <img src={img} alt="preview" className="w-full h-24 object-cover rounded-md" />
                                    <button
                                        type="button"
                                        onClick={() => handleImageDelete(img)}
                                        className="absolute top-1 right-1 bg-red-600/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <DeleteIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <Input type="file" multiple onChange={handleImageUpload} disabled={isUploading} />
                        {isUploading && <p className="text-sm text-gray-400 mt-2">Subiendo imágenes...</p>}
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="flex items-center">
                            <input type="checkbox" id="isBestSeller" name="isBestSeller" checked={formData.isBestSeller} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                            <label htmlFor="isBestSeller" className="ml-2 block text-sm text-gray-300">Más Vendido</label>
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" id="isMale" name="isMale" checked={formData.isMale} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                            <label htmlFor="isMale" className="ml-2 block text-sm text-gray-300">Masculino</label>
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" id="isFemale" name="isFemale" checked={formData.isFemale} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                            <label htmlFor="isFemale" className="ml-2 block text-sm text-gray-300">Femenino</label>
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-4 pt-4">
                        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>Cancelar</Button>
                        <Button type="submit" disabled={isSaving || isUploading}>
                            {isSaving ? 'Guardando...' : 'Guardar Producto'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
