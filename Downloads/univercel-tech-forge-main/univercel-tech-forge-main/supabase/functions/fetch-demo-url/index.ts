import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching demo URL:', url);

    // Detect source from URL
    const detectSource = (url: string): string => {
      const lowerUrl = url.toLowerCase();
      if (lowerUrl.includes('codecanyon')) return 'Codecanyon';
      if (lowerUrl.includes('envato')) return 'Envato';
      if (lowerUrl.includes('themeforest')) return 'ThemeForest';
      if (lowerUrl.includes('github')) return 'GitHub';
      if (lowerUrl.includes('demo.')) return 'Demo Site';
      if (lowerUrl.includes('preview.')) return 'Preview Site';
      return 'Custom';
    };

    // Detect demo type from URL
    const detectDemoType = (url: string): string => {
      const lowerUrl = url.toLowerCase();
      if (lowerUrl.includes('admin')) return 'Admin Panel';
      if (lowerUrl.includes('dashboard')) return 'Dashboard';
      if (lowerUrl.includes('backend')) return 'Backend';
      if (lowerUrl.includes('user') || lowerUrl.includes('frontend')) return 'Frontend';
      if (lowerUrl.includes('api')) return 'API';
      return 'Full Stack';
    };

    // Detect category from URL
    const detectCategory = (url: string): string => {
      const lowerUrl = url.toLowerCase();
      if (lowerUrl.includes('school') || lowerUrl.includes('education') || lowerUrl.includes('lms')) return 'Education';
      if (lowerUrl.includes('hospital') || lowerUrl.includes('clinic') || lowerUrl.includes('medical')) return 'Healthcare';
      if (lowerUrl.includes('erp') || lowerUrl.includes('enterprise')) return 'ERP';
      if (lowerUrl.includes('ecommerce') || lowerUrl.includes('shop') || lowerUrl.includes('store')) return 'E-Commerce';
      if (lowerUrl.includes('pos') || lowerUrl.includes('billing') || lowerUrl.includes('invoice')) return 'POS/Billing';
      if (lowerUrl.includes('crm') || lowerUrl.includes('customer')) return 'CRM';
      if (lowerUrl.includes('hrm') || lowerUrl.includes('payroll') || lowerUrl.includes('employee')) return 'HRM';
      if (lowerUrl.includes('hotel') || lowerUrl.includes('booking') || lowerUrl.includes('reservation')) return 'Hotel/Booking';
      if (lowerUrl.includes('restaurant') || lowerUrl.includes('food')) return 'Restaurant';
      if (lowerUrl.includes('real') || lowerUrl.includes('property')) return 'Real Estate';
      return 'General';
    };

    // Try to fetch page and extract metadata
    let title = '';
    let description = '';
    
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });
      
      if (response.ok) {
        const html = await response.text();
        
        // Extract title
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (titleMatch) {
          title = titleMatch[1].trim();
        }
        
        // Extract meta description
        const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
        if (descMatch) {
          description = descMatch[1].trim();
        }
        
        // Try og:title if no title
        if (!title) {
          const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
          if (ogTitleMatch) {
            title = ogTitleMatch[1].trim();
          }
        }
        
        // Try og:description
        if (!description) {
          const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
          if (ogDescMatch) {
            description = ogDescMatch[1].trim();
          }
        }
      }
    } catch (fetchError) {
      console.log('Could not fetch page content:', fetchError);
    }

    // Generate demo name from URL if no title
    if (!title) {
      const urlObj = new URL(url);
      title = urlObj.hostname.replace('www.', '').split('.')[0];
      title = title.charAt(0).toUpperCase() + title.slice(1) + ' Demo';
    }

    const result = {
      success: true,
      data: {
        url,
        title,
        description: description || 'Demo application',
        source: detectSource(url),
        demoType: detectDemoType(url),
        category: detectCategory(url),
        fetchedAt: new Date().toISOString(),
      }
    };

    console.log('Fetch result:', result);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching demo URL:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch demo details';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
