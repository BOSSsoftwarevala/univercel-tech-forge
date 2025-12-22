import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { fetchWithRetry } from "../_shared/retry-handler.ts";
import { checkRateLimit, rateLimitExceededResponse } from "../_shared/rate-limiter.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
};

const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID');
const PAYPAL_SECRET_KEY = Deno.env.get('PAYPAL_SECRET_KEY');
// Use environment variable for production switching
const PAYPAL_API_URL = Deno.env.get('PAYPAL_ENVIRONMENT') === 'production' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com';

// Retry configuration for PayPal API
const PAYPAL_RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  timeout: 30000,
  retryableStatuses: [408, 429, 500, 502, 503, 504],
};

// Get client IP
function getClientIP(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
         req.headers.get('cf-connecting-ip') || 'unknown';
}

// Token cache to reduce auth requests
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  // Check cache first
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    console.log('Using cached PayPal access token');
    return cachedToken.token;
  }

  console.log('Getting PayPal access token...');
  
  const auth = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET_KEY}`);
  
  const response = await fetchWithRetry(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  }, PAYPAL_RETRY_CONFIG);

  if (!response.ok) {
    const error = await response.text();
    console.error('Failed to get access token:', error);
    throw new Error('Failed to authenticate with PayPal');
  }

  const data = await response.json();
  
  // Cache token (expires in slightly less than actual expiry for safety)
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + ((data.expires_in || 3600) - 60) * 1000,
  };
  
  console.log('Access token obtained and cached successfully');
  return data.access_token;
}

async function createOrder(accessToken: string, amount: string, currency: string, description: string) {
  console.log(`Creating PayPal order: ${amount} ${currency}`);
  
  // Validate amount format
  if (!/^\d+(\.\d{1,2})?$/.test(amount) || parseFloat(amount) <= 0) {
    throw new Error('Invalid amount format');
  }
  
  const response = await fetchWithRetry(`${PAYPAL_API_URL}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': `order-${Date.now()}-${Math.random().toString(36).substring(7)}`, // Idempotency key
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: amount,
        },
        description: description,
      }],
    }),
  }, PAYPAL_RETRY_CONFIG);

  if (!response.ok) {
    const error = await response.text();
    console.error('Failed to create order:', error);
    throw new Error('Failed to create PayPal order');
  }

  const data = await response.json();
  console.log('Order created:', data.id);
  return data;
}

async function captureOrder(accessToken: string, orderId: string) {
  console.log(`Capturing PayPal order: ${orderId}`);
  
  // Validate order ID format
  if (!orderId || !/^[A-Z0-9]+$/.test(orderId)) {
    throw new Error('Invalid order ID format');
  }
  
  const response = await fetchWithRetry(`${PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': `capture-${orderId}-${Date.now()}`, // Idempotency key
    },
  }, PAYPAL_RETRY_CONFIG);

  if (!response.ok) {
    const error = await response.text();
    console.error('Failed to capture order:', error);
    throw new Error('Failed to capture PayPal order');
  }

  const data = await response.json();
  console.log('Order captured:', data.id, 'Status:', data.status);
  return data;
}

async function getOrderDetails(accessToken: string, orderId: string) {
  console.log(`Getting order details: ${orderId}`);
  
  // Validate order ID format
  if (!orderId || !/^[A-Z0-9]+$/.test(orderId)) {
    throw new Error('Invalid order ID format');
  }
  
  const response = await fetchWithRetry(`${PAYPAL_API_URL}/v2/checkout/orders/${orderId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  }, { ...PAYPAL_RETRY_CONFIG, maxRetries: 2 }); // Fewer retries for GET

  if (!response.ok) {
    const error = await response.text();
    console.error('Failed to get order details:', error);
    throw new Error('Failed to get PayPal order details');
  }

  const data = await response.json();
  return data;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Rate limiting
  const clientIP = getClientIP(req);
  const rateLimitResult = checkRateLimit(clientIP, 'paypal', 'payment');
  
  if (!rateLimitResult.allowed) {
    console.warn(`[PayPal] Rate limit exceeded for IP: ${clientIP}`);
    return rateLimitExceededResponse(rateLimitResult.resetIn);
  }

  try {
    const body = await req.text();
    if (!body) {
      return new Response(JSON.stringify({ status: 'ok', message: 'PayPal endpoint ready' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const { action, orderId, amount, currency = 'USD', description = 'Payment' } = JSON.parse(body);
    
    console.log(`[PayPal] Action: ${action} from IP: ${clientIP}`);

    if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET_KEY) {
      console.error('PayPal credentials not configured');
      throw new Error('PayPal credentials not configured');
    }

    // Validate action
    const validActions = ['create-order', 'capture-order', 'get-order'];
    if (!validActions.includes(action)) {
      throw new Error(`Invalid action: ${action}. Valid actions: ${validActions.join(', ')}`);
    }

    const accessToken = await getAccessToken();

    let result;

    switch (action) {
      case 'create-order':
        if (!amount) {
          throw new Error('Amount is required for creating an order');
        }
        result = await createOrder(accessToken, amount, currency, description);
        break;

      case 'capture-order':
        if (!orderId) {
          throw new Error('Order ID is required for capturing an order');
        }
        result = await captureOrder(accessToken, orderId);
        break;

      case 'get-order':
        if (!orderId) {
          throw new Error('Order ID is required for getting order details');
        }
        result = await getOrderDetails(accessToken, orderId);
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('[PayPal] Error:', errorMessage);
    
    // Determine appropriate status code
    let statusCode = 400;
    if (errorMessage.includes('credentials') || errorMessage.includes('authenticate')) {
      statusCode = 503; // Service unavailable
    } else if (errorMessage.includes('Circuit breaker')) {
      statusCode = 503;
    } else if (errorMessage.includes('Rate limit')) {
      statusCode = 429;
    }
    
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: statusCode,
      }
    );
  }
});
