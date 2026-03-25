import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { csvData, action } = await req.json();

    if (action === 'clear') {
      // Clear existing catalog
      const { error: deleteError } = await supabase
        .from('software_catalog')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (deleteError) throw deleteError;

      return new Response(
        JSON.stringify({ success: true, message: 'Catalog cleared' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!csvData || !Array.isArray(csvData)) {
      return new Response(
        JSON.stringify({ success: false, error: 'CSV data is required as an array' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Starting import of ${csvData.length} software entries...`);

    // Auto-detect category from name
    const detectCategory = (name: string): string => {
      const lowerName = name.toLowerCase();
      if (lowerName.includes('accounting') || lowerName.includes('finance') || lowerName.includes('invoice') || lowerName.includes('billing')) return 'Finance';
      if (lowerName.includes('hospital') || lowerName.includes('clinic') || lowerName.includes('medical') || lowerName.includes('dental') || lowerName.includes('pharmacy')) return 'Healthcare';
      if (lowerName.includes('school') || lowerName.includes('college') || lowerName.includes('university') || lowerName.includes('lms') || lowerName.includes('coaching') || lowerName.includes('student')) return 'Education';
      if (lowerName.includes('hotel') || lowerName.includes('resort') || lowerName.includes('booking') || lowerName.includes('travel')) return 'Hotel/Travel';
      if (lowerName.includes('restaurant') || lowerName.includes('food') || lowerName.includes('kitchen') || lowerName.includes('cafe')) return 'Restaurant';
      if (lowerName.includes('ecommerce') || lowerName.includes('e-commerce') || lowerName.includes('shop') || lowerName.includes('store') || lowerName.includes('cart')) return 'E-Commerce';
      if (lowerName.includes('pos') || lowerName.includes('point of sale')) return 'POS';
      if (lowerName.includes('crm') || lowerName.includes('customer')) return 'CRM';
      if (lowerName.includes('hrm') || lowerName.includes('payroll') || lowerName.includes('employee') || lowerName.includes('attendance') || lowerName.includes('leave')) return 'HRM';
      if (lowerName.includes('erp') || lowerName.includes('enterprise')) return 'ERP';
      if (lowerName.includes('real') || lowerName.includes('property')) return 'Real Estate';
      if (lowerName.includes('transport') || lowerName.includes('logistics') || lowerName.includes('fleet') || lowerName.includes('delivery') || lowerName.includes('courier')) return 'Logistics';
      if (lowerName.includes('inventory') || lowerName.includes('warehouse') || lowerName.includes('stock')) return 'Inventory';
      if (lowerName.includes('project') || lowerName.includes('task')) return 'Project Management';
      if (lowerName.includes('gym') || lowerName.includes('fitness')) return 'Fitness';
      if (lowerName.includes('event') || lowerName.includes('ticket')) return 'Events';
      if (lowerName.includes('loan') || lowerName.includes('microfinance')) return 'Lending';
      if (lowerName.includes('insurance')) return 'Insurance';
      if (lowerName.includes('mrp') || lowerName.includes('manufacturing')) return 'Manufacturing';
      if (lowerName.includes('cab') || lowerName.includes('taxi') || lowerName.includes('car') || lowerName.includes('vehicle') || lowerName.includes('garage') || lowerName.includes('auto')) return 'Automotive';
      if (lowerName.includes('salon') || lowerName.includes('spa') || lowerName.includes('beauty')) return 'Beauty/Salon';
      if (lowerName.includes('library')) return 'Library';
      if (lowerName.includes('membership') || lowerName.includes('subscription')) return 'Subscription';
      return 'General';
    };

    // Process in larger batches of 500 for speed
    const batchSize = 500;
    let imported = 0;
    let failed = 0;
    const errors: string[] = [];

    for (let i = 0; i < csvData.length; i += batchSize) {
      const batch = csvData.slice(i, i + batchSize);
      
      const records = batch.map((item: any) => ({
        name: String(item.name || '').trim(),
        base_price: parseFloat(item.base_price) || 0,
        type: String(item.type || 'SaaS').trim(),
        vendor: String(item.vendor || 'Software Vala').trim(),
        category: detectCategory(String(item.name || '')),
        is_demo_registered: false
      })).filter(r => r.name.length > 0);

      if (records.length === 0) continue;

      const { error } = await supabase
        .from('software_catalog')
        .insert(records);

      if (error) {
        console.error(`Batch ${Math.floor(i / batchSize) + 1} failed:`, error.message);
        errors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${error.message}`);
        failed += batch.length;
      } else {
        imported += records.length;
        console.log(`Batch ${Math.floor(i / batchSize) + 1} completed: ${imported} total imported`);
      }
    }

    console.log(`Import complete: ${imported} success, ${failed} failed`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        imported, 
        failed,
        total: csvData.length,
        errors: errors.length > 0 ? errors.slice(0, 5) : undefined,
        message: `Imported ${imported.toLocaleString()} of ${csvData.length.toLocaleString()} software entries`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Import error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Import failed';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
