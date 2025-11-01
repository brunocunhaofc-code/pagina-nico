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
    } else if (data) {
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
    if (data && data.length > 0) {
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
    if (data && data.length > 0) {
        const freshProduct = fromDatabase(data[0]);
        setProducts(prev =>
            prev.map(p => (p.id === freshProduct.id ? freshProduct : p))
        );
        return freshProduct;
    }
    return null;
  };

  const deleteProduct = async (productId: string) => {
    // 1. Get image URLs for the product. Don't use .single() to avoid crashing if not found.
    const { data: productArray, error: fetchError } = await supabase
      .from('products')
      .select('images')
      .eq('id', productId);

    if (fetchError) {
      const err = new Error(`Error de red o base de datos al buscar el producto. Error: ${fetchError.message}`);
      console.error(err.message);
      return { error: err };
    }

    // 2. Delete the product from the database. This is the most critical step.
    const { error: dbError } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    // If database deletion fails, stop and report the error.
    if (dbError) {
      const err = new Error(`Error al eliminar el producto de la base de datos. Verifique sus permisos (RLS). Error: ${dbError.message}`);
      console.error(err.message);
      return { error: err };
    }

    // 3. If DB deletion is successful, update the UI state immediately.
    setProducts(prev => prev.filter(p => p.id !== productId));

    // 4. As a secondary task, attempt to clean up images from storage.
    // Use the image data we fetched in step 1.
    const imagesToDelete = productArray?.[0]?.images;
    if (imagesToDelete && imagesToDelete.length > 0) {
      const filePaths = imagesToDelete.map(url => {
        try {
          return new URL(url).pathname.split('/product-images/').pop() || null;
        } catch (e) {
          console.warn('URL de imagen inválida, no se puede procesar para eliminación:', url);
          return null;
        }
      }).filter((p): p is string => p !== null);

      if (filePaths.length > 0) {
        const { error: storageError } = await supabase.storage
          .from('product-images')
          .remove(filePaths);

        if (storageError) {
          // This is not a critical error since the product is already deleted. Log it as a warning.
          console.warn(`Producto eliminado de la BD, pero falló la limpieza de imágenes: ${storageError.message}`);
        }
      }
    }

    // 5. Return success.
    return { error: null };
  };

  return { products, loading, addProduct, updateProduct, deleteProduct };
};