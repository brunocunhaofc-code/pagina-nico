import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

export const useBrands = () => {
    const [brands, setBrands] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBrands = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('brands')
            .select('name')
            .order('name', { ascending: true });
        
        if (error) {
            console.error("Error fetching brands:", error);
            setBrands([]);
        } else if (data) {
            setBrands(data.map(item => item.name));
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchBrands();

        const channel = supabase
            .channel('public:brands')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'brands' }, 
            () => {
                fetchBrands();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchBrands]);
    
    const addBrand = async (name: string) => {
        const { data, error } = await supabase
            .from('brands')
            .insert({ name })
            .select();
        if (error) {
            console.error('Error adding brand:', error);
            return { error };
        }
        return { data, error: null };
    };

    const deleteBrand = async (name: string) => {
        // First, check if any product is using this brand.
        const { data: products, error: checkError } = await supabase
            .from('products')
            .select('id')
            .eq('brand', name)
            .limit(1);

        if (checkError) {
            console.error('Error checking for products with brand:', checkError);
            return { error: checkError };
        }
        if (products && products.length > 0) {
            const err = new Error('No se puede eliminar la marca porque está siendo utilizada por uno o más productos.');
            console.error(err);
            return { error: err };
        }

        const { error } = await supabase
            .from('brands')
            .delete()
            .eq('name', name);
        if (error) {
            console.error('Error deleting brand:', error);
        }
        return { error };
    }

    return { brands, loading, addBrand, deleteBrand };
};
