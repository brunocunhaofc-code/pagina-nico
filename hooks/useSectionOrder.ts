import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

const SETTINGS_ROW_ID = 1;
const DEFAULT_SECTIONS = ['Más Vendidos', 'Catálogo Masculino', 'Catálogo Femenino', 'Nike', 'Adidas', 'Puma', 'New Balance', 'Jordan', 'Converse'];


export const useSectionOrder = () => {
  const [sectionOrder, setSectionOrder] = useState<string[]>(DEFAULT_SECTIONS);
  const [loading, setLoading] = useState(true);

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
        .from('settings')
        .select('section_order')
        .eq('id', SETTINGS_ROW_ID)
        .single();
    
    if (error || !data?.section_order) {
        console.error("Failed to load section order from Supabase, using default.", error);
        setSectionOrder(DEFAULT_SECTIONS);
    } else {
        setSectionOrder(data.section_order as string[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);


  const updateOrder = useCallback(async (newOrder: string[]) => {
    setSectionOrder(newOrder); // Optimistic update
    const { error } = await supabase
        .from('settings')
        .update({ section_order: newOrder })
        .eq('id', SETTINGS_ROW_ID);

    if (error) {
        console.error("Failed to save section order to Supabase", error);
        // Optionally revert optimistic update
        fetchOrder();
    }
  }, [fetchOrder]);

  return { sectionOrder, setSectionOrder: updateOrder, loading };
};
