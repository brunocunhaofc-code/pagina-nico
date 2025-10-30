import { useState, useEffect, useCallback } from 'react';
import type { Product } from '../types';
import { supabase } from '../lib/supabaseClient';

// Helper to map database fields (snake_case) to app fields (camelCase)
const fromDatabase = (data: any): Product => ({
  id: data.id,
  name: data.name,
  brand: data.brand,
  description: data.description,
  price: data.price,
  images: data.images,
  isBestSeller: data.is_best_seller,
  isMale: data.is_male,
  isFemale: data.is_female,
  created_at: data.created_at,
});

// Helper to map app fields to database fields
const toDatabase = (product: Omit<Product, 'id' | 'created_at'>) => ({
  name: product.name,
  brand: product.brand,
  description: product.description,
  price: product.price,
  images: product.images,
  is_best_seller: product.isBestSeller,
  is_male: product.isMale,
  is_female: product.isFemale,
});


export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching products:", error);
    } else {
      setProducts(data.map(fromDatabase));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = async (product: Omit<Product, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('products')
      .insert([toDatabase(product)])
      .select();

    if (error) {
      console.error("Error adding product:", error);
      return null;
    }
    if (data) {
      const newProduct = fromDatabase(data[0]);
      setProducts(prev => [newProduct, ...prev]);
      return newProduct;
    }
    return null;
  };

  const updateProduct = async (updatedProduct: Product) => {
    if (!updatedProduct.id) return null;
    
    const productForDb = {
        ...toDatabase(updatedProduct),
        // Don't include these in the update payload
        id: undefined,
        created_at: undefined,
    }

    const { data, error } = await supabase
      .from('products')
      .update(productForDb)
      .eq('id', updatedProduct.id)
      .select();
      
    if (error) {
      console.error("Error updating product:", error);
      return null;
    }
    if (data) {
        const freshProduct = fromDatabase(data[0]);
        setProducts(prev =>
            prev.map(p => (p.id === freshProduct.id ? freshProduct : p))
        );
        return freshProduct;
    }
    return null;
  };

  const deleteProduct = async (productId: string) => {
     const productToDelete = products.find(p => p.id === productId);
     if (!productToDelete) return;

     // Delete images from storage first
     if (productToDelete.images && productToDelete.images.length > 0) {
        const filePaths = productToDelete.images.map(url => {
            const parts = url.split('/');
            return parts[parts.length -1];
        });
        const { error: storageError } = await supabase.storage
            .from('product-images')
            .remove(filePaths);

        if (storageError) {
            console.error('Error deleting images from storage:', storageError);
        }
     }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);
      
    if (error) {
      console.error("Error deleting product:", error);
    } else {
      setProducts(prev => prev.filter(p => p.id !== productId));
    }
  };

  return { products, loading, addProduct, updateProduct, deleteProduct };
};
