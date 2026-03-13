import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Product, ProductStatus } from '@/components/product-manager/types/productTypes';

interface ActionState {
  loading: boolean;
  error: string | null;
}

export const useProductActions = () => {
  const [actionState, setActionState] = useState<ActionState>({ loading: false, error: null });

  // Log action to audit trail
  const logAction = useCallback(async (
    productId: string,
    productName: string,
    action: string,
    details?: Record<string, any>
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('product_action_logs').insert([{
        product_id: productId,
        product_name: productName,
        action,
        action_details: details,
      }]);
    } catch (error) {
      console.error('Failed to log action:', error);
    }
  }, []);

  // Create product
  const createProduct = useCallback(async (productData: Partial<Product>): Promise<any | null> => {
    setActionState({ loading: true, error: null });
    try {
      // Generate product code
      const productCode = `PRD-${Date.now().toString(36).toUpperCase()}`;
      
      const { data, error } = await supabase
        .from('products')
        .insert({
          product_code: productCode,
          product_name: productData.product_name,
          product_type: productData.product_type || 'software',
          description: productData.description,
          status: productData.status || 'draft',
          business_category_id: productData.main_category_id,
          subcategory_id: productData.sub_category_id,
          pricing_model: productData.pricing_model || 'one_time',
          lifetime_price: productData.base_price,
        })
        .select()
        .single();

      if (error) throw error;

      await logAction(data.product_id, data.product_name, 'product_created', productData);
      toast.success('Product created successfully');
      setActionState({ loading: false, error: null });
      return data;
    } catch (error: any) {
      setActionState({ loading: false, error: error.message });
      toast.error('Failed to create product: ' + error.message);
      return null;
    }
  }, [logAction]);

  // Update product
  const updateProduct = useCallback(async (productId: string, updates: Partial<Product>): Promise<boolean> => {
    setActionState({ loading: true, error: null });
    try {
      const { data: oldProduct } = await supabase
        .from('products')
        .select('*')
        .eq('product_id', productId)
        .single();

      const { error } = await supabase
        .from('products')
        .update({
          product_name: updates.product_name,
          product_type: updates.product_type,
          description: updates.description,
          business_category_id: updates.main_category_id,
          subcategory_id: updates.sub_category_id,
          pricing_model: updates.pricing_model,
          lifetime_price: updates.base_price,
        })
        .eq('product_id', productId);

      if (error) throw error;

      await logAction(productId, updates.product_name || oldProduct?.product_name, 'product_updated', {
        old_values: oldProduct,
        new_values: updates,
      });
      
      toast.success('Product updated successfully');
      setActionState({ loading: false, error: null });
      return true;
    } catch (error: any) {
      setActionState({ loading: false, error: error.message });
      toast.error('Failed to update product: ' + error.message);
      return false;
    }
  }, [logAction]);

  // Duplicate product
  const duplicateProduct = useCallback(async (productId: string): Promise<any | null> => {
    setActionState({ loading: true, error: null });
    try {
      const { data: original, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('product_id', productId)
        .single();

      if (fetchError) throw fetchError;

      const newCode = `PRD-${Date.now().toString(36).toUpperCase()}`;
      const { data: duplicate, error: insertError } = await supabase
        .from('products')
        .insert({
          ...original,
          product_id: undefined,
          product_code: newCode,
          product_name: `${original.product_name} (Copy)`,
          status: 'draft',
          created_at: undefined,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      await logAction(duplicate.product_id, duplicate.product_name, 'product_duplicated', {
        original_id: productId,
      });

      toast.success('Product duplicated');
      setActionState({ loading: false, error: null });
      return duplicate;
    } catch (error: any) {
      setActionState({ loading: false, error: error.message });
      toast.error('Failed to duplicate product: ' + error.message);
      return null;
    }
  }, [logAction]);

  // Park/Unpark product
  const parkProduct = useCallback(async (productId: string, productName: string, park: boolean): Promise<boolean> => {
    setActionState({ loading: true, error: null });
    try {
      const newStatus = park ? 'parked' : 'active';
      const { error } = await supabase
        .from('products')
        .update({ status: newStatus })
        .eq('product_id', productId);

      if (error) throw error;

      await logAction(productId, productName, park ? 'product_parked' : 'product_unparked');
      toast.success(`Product ${park ? 'parked' : 'unparked'}`);
      setActionState({ loading: false, error: null });
      return true;
    } catch (error: any) {
      setActionState({ loading: false, error: error.message });
      toast.error('Failed to update product status');
      return false;
    }
  }, [logAction]);

  // Disable product
  const disableProduct = useCallback(async (productId: string, productName: string): Promise<boolean> => {
    setActionState({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('products')
        .update({ status: 'inactive' })
        .eq('product_id', productId);

      if (error) throw error;

      await logAction(productId, productName, 'product_disabled');
      toast.success('Product disabled');
      setActionState({ loading: false, error: null });
      return true;
    } catch (error: any) {
      setActionState({ loading: false, error: error.message });
      toast.error('Failed to disable product');
      return false;
    }
  }, [logAction]);

  // Soft delete product
  const deleteProduct = useCallback(async (productId: string, productName: string): Promise<boolean> => {
    setActionState({ loading: true, error: null });
    try {
      // Soft delete - mark as deleted instead of removing
      const { error } = await supabase
        .from('products')
        .update({ status: 'inactive', deleted_at: new Date().toISOString() })
        .eq('product_id', productId);

      if (error) throw error;

      await logAction(productId, productName, 'product_deleted');
      toast.success('Product deleted (soft delete)');
      setActionState({ loading: false, error: null });
      return true;
    } catch (error: any) {
      setActionState({ loading: false, error: error.message });
      toast.error('Failed to delete product');
      return false;
    }
  }, [logAction]);

  // AI Auto-describe product
  const aiAutoDescribe = useCallback(async (productName: string, features: string[]): Promise<string | null> => {
    setActionState({ loading: true, error: null });
    try {
      // Simulate AI description generation
      await new Promise(resolve => setTimeout(resolve, 1000));
      const description = `${productName} is a comprehensive solution designed to ${features.slice(0, 3).join(', ')}. It offers enterprise-grade capabilities with robust security features and seamless integration options.`;
      
      toast.success('AI description generated');
      setActionState({ loading: false, error: null });
      return description;
    } catch (error: any) {
      setActionState({ loading: false, error: error.message });
      toast.error('Failed to generate description');
      return null;
    }
  }, []);

  // AI Feature suggestions
  const aiSuggestFeatures = useCallback(async (productType: string): Promise<string[]> => {
    setActionState({ loading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const featureSuggestions: Record<string, string[]> = {
        software: ['Cloud-based architecture', 'Real-time collaboration', 'API integration', 'Role-based access', 'Audit logging'],
        service: ['24/7 support', 'SLA guarantee', 'Dedicated account manager', 'Custom reporting', 'Training included'],
        digital: ['Instant delivery', 'Multi-format support', 'Download manager', 'Version updates', 'DRM protection'],
        physical: ['Express shipping', 'Warranty included', 'Return policy', 'Installation guide', 'Quality certified'],
      };
      
      toast.success('Feature suggestions ready');
      setActionState({ loading: false, error: null });
      return featureSuggestions[productType] || featureSuggestions.software;
    } catch (error: any) {
      setActionState({ loading: false, error: error.message });
      return [];
    }
  }, []);

  // AI Duplicate detection
  const aiDetectDuplicates = useCallback(async (productName: string): Promise<any[]> => {
    setActionState({ loading: true, error: null });
    try {
      const { data } = await supabase
        .from('products')
        .select('*')
        .ilike('product_name', `%${productName.split(' ')[0]}%`)
        .limit(5);

      setActionState({ loading: false, error: null });
      return data || [];
    } catch (error: any) {
      setActionState({ loading: false, error: error.message });
      return [];
    }
  }, []);

  // Bulk actions
  const bulkUpdateStatus = useCallback(async (productIds: string[], status: string): Promise<boolean> => {
    setActionState({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('products')
        .update({ status })
        .in('product_id', productIds);

      if (error) throw error;

      toast.success(`${productIds.length} products updated to ${status}`);
      setActionState({ loading: false, error: null });
      return true;
    } catch (error: any) {
      setActionState({ loading: false, error: error.message });
      toast.error('Bulk update failed');
      return false;
    }
  }, []);

  // Export products
  const exportProducts = useCallback(async (format: 'csv' | 'json'): Promise<string | null> => {
    setActionState({ loading: true, error: null });
    try {
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!data) throw new Error('No data to export');

      if (format === 'csv') {
        const headers = Object.keys(data[0] || {}).join(',');
        const rows = data.map(row => Object.values(row).join(','));
        const csv = [headers, ...rows].join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `products-${Date.now()}.csv`;
        a.click();
      } else {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `products-${Date.now()}.json`;
        a.click();
      }

      toast.success(`Products exported as ${format.toUpperCase()}`);
      setActionState({ loading: false, error: null });
      return 'success';
    } catch (error: any) {
      setActionState({ loading: false, error: error.message });
      toast.error('Export failed');
      return null;
    }
  }, []);

  return {
    actionState,
    createProduct,
    updateProduct,
    duplicateProduct,
    parkProduct,
    disableProduct,
    deleteProduct,
    aiAutoDescribe,
    aiSuggestFeatures,
    aiDetectDuplicates,
    bulkUpdateStatus,
    exportProducts,
    logAction,
  };
};
