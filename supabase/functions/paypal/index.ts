import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID');
const PAYPAL_SECRET_KEY = Deno.env.get('PAYPAL_SECRET_KEY');
const PAYPAL_API_URL = 'https://api-m.sandbox.paypal.com'; // Use 'https://api-m.paypal.com' for production

async function getAccessToken(): Promise<string> {
  console.log('Getting PayPal access token...');
  
  const auth = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET_KEY}`);
  
  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Failed to get access token:', error);
    throw new Error('Failed to authenticate with PayPal');
  }

  const data = await response.json();
  console.log('Access token obtained successfully');
  return data.access_token;
}

async function createOrder(accessToken: string, amount: string, currency: string, description: string) {
  console.log(`Creating PayPal order: ${amount} ${currency}`);
  
  const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
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
  });

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
  
  const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

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
  
  const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${orderId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

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

  try {
    const { action, orderId, amount, currency = 'USD', description = 'Payment' } = await req.json();
    
    console.log(`PayPal action requested: ${action}`);

    if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET_KEY) {
      console.error('PayPal credentials not configured');
      throw new Error('PayPal credentials not configured');
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

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('PayPal function error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
