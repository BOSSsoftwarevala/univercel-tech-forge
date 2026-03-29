import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ValidationResult {
  isValid: boolean;
  isDuplicate: boolean;
  isReachable: boolean;
  httpStatus?: number;
  responseTime?: number;
  normalizedUrl?: string;
  duplicateId?: string;
  duplicateTitle?: string;
  errorMessage?: string;
  title?: string;
  description?: string;
  source?: string;
  demoType?: string;
  category?: string;
}

// Normalize URL for duplicate detection
function normalizeUrl(url: string): string {
  let normalized = url.toLowerCase();
  // Remove protocol
  normalized = normalized.replace(/^https?:\/\//, '');
  // Remove www.
  normalized = normalized.replace(/^www\./, '');
  // Remove trailing slashes
  normalized = normalized.replace(/\/+$/, '');
  // Remove query params for core URL comparison
  normalized = normalized.replace(/\?.*$/, '');
  return normalized;
}

// Detect source from URL
function detectSource(url: string): string {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('codecanyon')) return 'Codecanyon';
  if (lowerUrl.includes('envato')) return 'Envato';
  if (lowerUrl.includes('themeforest')) return 'ThemeForest';
  if (lowerUrl.includes('github')) return 'GitHub';
  if (lowerUrl.includes('demo.')) return 'Demo Site';
  if (lowerUrl.includes('preview.')) return 'Preview Site';
  return 'Custom';
}

// Detect demo type from URL
function detectDemoType(url: string): string {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('admin')) return 'Admin Panel';
  if (lowerUrl.includes('dashboard')) return 'Dashboard';
  if (lowerUrl.includes('backend')) return 'Backend';
  if (lowerUrl.includes('user') || lowerUrl.includes('frontend')) return 'Frontend';
  if (lowerUrl.includes('api')) return 'API';
  return 'Full Stack';
}

// Detect category from URL
function detectCategory(url: string): string {
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
  if (lowerUrl.includes('inventory') || lowerUrl.includes('stock')) return 'Inventory';
  if (lowerUrl.includes('project') || lowerUrl.includes('task')) return 'Project Management';
  if (lowerUrl.includes('gym') || lowerUrl.includes('fitness')) return 'Fitness';
  if (lowerUrl.includes('event') || lowerUrl.includes('ticket')) return 'Events';
  if (lowerUrl.includes('loan') || lowerUrl.includes('lending') || lowerUrl.includes('finance')) return 'Finance';
  if (lowerUrl.includes('insurance')) return 'Insurance';
  if (lowerUrl.includes('manufacture') || lowerUrl.includes('factory')) return 'Manufacturing';
  if (lowerUrl.includes('car') || lowerUrl.includes('vehicle') || lowerUrl.includes('auto')) return 'Automotive';
  if (lowerUrl.includes('salon') || lowerUrl.includes('beauty') || lowerUrl.includes('spa')) return 'Beauty/Salon';
  if (lowerUrl.includes('library') || lowerUrl.includes('book')) return 'Library';
  if (lowerUrl.includes('subscription') || lowerUrl.includes('saas')) return 'Subscription';
  if (lowerUrl.includes('logistics') || lowerUrl.includes('shipping') || lowerUrl.includes('courier')) return 'Logistics';
  return 'General';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, skipReachabilityCheck } = await req.json();

    if (!url || typeof url !== 'string' || url.trim() === '') {
      return new Response(
        JSON.stringify({ 
          success: false, 
          validation: { 
            isValid: false, 
            isDuplicate: false, 
            isReachable: false,
            errorMessage: 'URL is required and cannot be blank' 
          } as ValidationResult 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        throw new Error('Invalid protocol');
      }
    } catch {
      return new Response(
        JSON.stringify({ 
          success: false, 
          validation: { 
            isValid: false, 
            isDuplicate: false, 
            isReachable: false,
            errorMessage: 'Invalid URL format. URL must start with http:// or https://' 
          } as ValidationResult 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const normalizedUrl = normalizeUrl(url);
    console.log('Validating URL:', url, '→ Normalized:', normalizedUrl);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check for duplicates
    const { data: existingDemo, error: dupeError } = await supabase
      .from('demos')
      .select('id, title, url, normalized_url')
      .eq('normalized_url', normalizedUrl)
      .maybeSingle();

    if (dupeError) {
      console.error('Duplicate check error:', dupeError);
    }

    if (existingDemo) {
      console.log('Duplicate found:', existingDemo.id);
      return new Response(
        JSON.stringify({ 
          success: false, 
          validation: { 
            isValid: false, 
            isDuplicate: true, 
            isReachable: false,
            duplicateId: existingDemo.id,
            duplicateTitle: existingDemo.title,
            normalizedUrl,
            errorMessage: `Duplicate URL detected. This URL already exists as "${existingDemo.title}"` 
          } as ValidationResult 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check reachability (unless skipped for bulk operations)
    let isReachable = true;
    let httpStatus: number | undefined;
    let responseTime: number | undefined;
    let title = '';
    let description = '';

    if (!skipReachabilityCheck) {
      const startTime = Date.now();
      try {
        const response = await fetch(url, {
          method: 'HEAD', // Use HEAD for faster check
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
          signal: AbortSignal.timeout(10000), // 10 second timeout
        });
        
        responseTime = Date.now() - startTime;
        httpStatus = response.status;
        isReachable = response.ok || response.status === 302 || response.status === 301;

        // If reachable, try to get metadata
        if (isReachable) {
          try {
            const fullResponse = await fetch(url, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              },
              signal: AbortSignal.timeout(15000),
            });
            
            if (fullResponse.ok) {
              const html = await fullResponse.text();
              
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
            }
          } catch (e) {
            console.log('Could not fetch full page for metadata:', e);
          }
        }
      } catch (fetchError) {
        responseTime = Date.now() - startTime;
        isReachable = false;
        console.log('URL unreachable:', fetchError);
      }
    }

    // Generate title from URL if not found
    if (!title) {
      const hostname = parsedUrl.hostname.replace(/^www\./, '');
      const pathname = parsedUrl.pathname.replace(/\//g, ' ').trim();
      title = pathname ? `${hostname} - ${pathname}` : hostname;
    }

    const validation: ValidationResult = {
      isValid: !existingDemo && (skipReachabilityCheck || isReachable),
      isDuplicate: false,
      isReachable,
      httpStatus,
      responseTime,
      normalizedUrl,
      title,
      description,
      source: detectSource(url),
      demoType: detectDemoType(url),
      category: detectCategory(url),
    };

    if (!isReachable && !skipReachabilityCheck) {
      validation.errorMessage = `URL is not reachable (HTTP ${httpStatus || 'timeout'})`;
    }

    return new Response(
      JSON.stringify({ success: true, validation }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Validation error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage,
        validation: { 
          isValid: false, 
          isDuplicate: false, 
          isReachable: false,
          errorMessage: 'Validation failed: ' + errorMessage 
        } as ValidationResult 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});