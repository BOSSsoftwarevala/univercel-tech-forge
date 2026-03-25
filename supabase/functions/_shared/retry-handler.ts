// Retry Handler for External API Calls
// Implements exponential backoff and circuit breaker patterns

interface RetryConfig {
  maxRetries: number;
  baseDelay: number; // ms
  maxDelay: number; // ms
  timeout: number; // ms
  retryableStatuses: number[];
}

const DEFAULT_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 30000,
  timeout: 30000,
  retryableStatuses: [408, 429, 500, 502, 503, 504],
};

// Circuit breaker state
interface CircuitState {
  failures: number;
  lastFailure: number;
  state: 'closed' | 'open' | 'half-open';
}

const circuitBreakers = new Map<string, CircuitState>();
const CIRCUIT_THRESHOLD = 5; // failures before opening
const CIRCUIT_RESET_TIME = 60000; // 1 minute

// Calculate exponential backoff delay with jitter
function getBackoffDelay(attempt: number, config: RetryConfig): number {
  const delay = Math.min(config.baseDelay * Math.pow(2, attempt), config.maxDelay);
  // Add jitter (±25%)
  const jitter = delay * 0.25 * (Math.random() * 2 - 1);
  return Math.round(delay + jitter);
}

// Check circuit breaker state
function checkCircuit(endpoint: string): boolean {
  const circuit = circuitBreakers.get(endpoint);
  if (!circuit) return true; // No circuit = closed

  const now = Date.now();

  if (circuit.state === 'open') {
    // Check if reset time has passed
    if (now - circuit.lastFailure > CIRCUIT_RESET_TIME) {
      circuit.state = 'half-open';
      circuitBreakers.set(endpoint, circuit);
      return true; // Allow one request through
    }
    return false; // Still open
  }

  return true; // Closed or half-open
}

// Record circuit breaker result
function recordCircuitResult(endpoint: string, success: boolean): void {
  let circuit = circuitBreakers.get(endpoint);
  
  if (!circuit) {
    circuit = { failures: 0, lastFailure: 0, state: 'closed' };
  }

  if (success) {
    // Reset on success
    circuit.failures = 0;
    circuit.state = 'closed';
  } else {
    // Record failure
    circuit.failures++;
    circuit.lastFailure = Date.now();
    
    if (circuit.failures >= CIRCUIT_THRESHOLD) {
      circuit.state = 'open';
      console.warn(`[Circuit Breaker] Opening circuit for: ${endpoint}`);
    }
  }

  circuitBreakers.set(endpoint, circuit);
}

// Fetch with timeout
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Main retry function
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  config: Partial<RetryConfig> = {}
): Promise<Response> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const endpointKey = new URL(url).hostname;

  // Check circuit breaker
  if (!checkCircuit(endpointKey)) {
    throw new Error(`Circuit breaker open for: ${endpointKey}`);
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= finalConfig.maxRetries; attempt++) {
    try {
      console.log(`[Retry Handler] Attempt ${attempt + 1} for: ${url}`);
      
      const response = await fetchWithTimeout(url, options, finalConfig.timeout);

      // Check if response status is retryable
      if (finalConfig.retryableStatuses.includes(response.status) && attempt < finalConfig.maxRetries) {
        console.warn(`[Retry Handler] Retryable status ${response.status}, will retry`);
        const delay = getBackoffDelay(attempt, finalConfig);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // Success - record and return
      recordCircuitResult(endpointKey, response.ok);
      return response;

    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`[Retry Handler] Attempt ${attempt + 1} failed:`, lastError.message);

      // Check if error is retryable
      const isTimeout = lastError.name === 'AbortError' || lastError.message.includes('timeout');
      const isNetworkError = lastError.message.includes('fetch') || lastError.message.includes('network');

      if ((isTimeout || isNetworkError) && attempt < finalConfig.maxRetries) {
        const delay = getBackoffDelay(attempt, finalConfig);
        console.log(`[Retry Handler] Waiting ${delay}ms before retry`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // Record failure
      recordCircuitResult(endpointKey, false);
    }
  }

  // All retries exhausted
  throw lastError || new Error('Request failed after all retries');
}

// Webhook-specific retry with signature verification
export async function sendWebhookWithRetry(
  url: string,
  payload: unknown,
  secret?: string,
  config: Partial<RetryConfig> = {}
): Promise<{ success: boolean; statusCode?: number; error?: string }> {
  const body = JSON.stringify(payload);
  const timestamp = Date.now().toString();

  // Generate signature if secret provided (HMAC-SHA256)
  let signature = '';
  if (secret) {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const signatureBuffer = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(`${timestamp}.${body}`)
    );
    signature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  try {
    const response = await fetchWithRetry(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Timestamp': timestamp,
        ...(signature ? { 'X-Webhook-Signature': `sha256=${signature}` } : {}),
      },
      body,
    }, config);

    return {
      success: response.ok,
      statusCode: response.status,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Webhook delivery failed',
    };
  }
}
