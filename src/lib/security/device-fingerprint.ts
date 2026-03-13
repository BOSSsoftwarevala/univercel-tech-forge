/**
 * Device Fingerprint & Bot Detection
 *
 * Generates a stable, privacy-respecting device fingerprint from browser
 * signals for bot detection and session binding.  No third-party library
 * dependencies — uses only Web APIs available in modern browsers.
 */

export interface DeviceFingerprint {
  /** SHA-256 fingerprint hash */
  hash: string;
  /** Raw signal components (for debugging — never log in production) */
  components: Record<string, string | number>;
}

/** Collect browser signals and compute a SHA-256 fingerprint. */
export async function generateDeviceFingerprint(): Promise<DeviceFingerprint> {
  const components = collectComponents();
  const raw = Object.values(components).join('|');
  const hash = await sha256(raw);
  return { hash, components };
}

function collectComponents(): Record<string, string | number> {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    languages: navigator.languages?.join(',') ?? '',
    platform: navigator.platform,
    hardwareConcurrency: navigator.hardwareConcurrency ?? 0,
    deviceMemory: (navigator as { deviceMemory?: number }).deviceMemory ?? 0,
    screenWidth: screen.width,
    screenHeight: screen.height,
    colorDepth: screen.colorDepth,
    pixelRatio: Math.round(devicePixelRatio * 100),
    timezoneOffset: new Date().getTimezoneOffset(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    canvas: getCanvasSignal(),
    webgl: getWebGLSignal(),
    touchPoints: navigator.maxTouchPoints ?? 0,
  };
}

function getCanvasSignal(): string {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext('2d');
    if (!ctx) return 'no-canvas';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.font = '14px Arial';
    ctx.fillText('FP🔒', 2, 15);
    ctx.fillStyle = 'rgba(102,204,0,0.7)';
    ctx.fillText('FP🔒', 4, 17);
    return canvas.toDataURL().slice(-40);
  } catch {
    return 'canvas-error';
  }
}

function getWebGLSignal(): string {
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl') ??
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);
    if (!gl) return 'no-webgl';
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    if (!ext) return 'no-ext';
    const vendor = gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) as string;
    const renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) as string;
    return `${vendor}~${renderer}`;
  } catch {
    return 'webgl-error';
  }
}

async function sha256(data: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(data));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Auto-flag suspicious signals that suggest bot / headless browser:
 *  - Missing language
 *  - navigator.webdriver present
 *  - Zero hardware concurrency
 *  - Unrealistic screen dimensions
 */
export function detectBotSignals(): { isBot: boolean; reasons: string[] } {
  const reasons: string[] = [];

  if (!navigator.language) reasons.push('no-language');
  if ((navigator as { webdriver?: boolean }).webdriver) reasons.push('webdriver-present');
  if ((navigator.hardwareConcurrency ?? 0) === 0) reasons.push('zero-hardware-concurrency');
  if (screen.width === 0 || screen.height === 0) reasons.push('zero-screen-dimensions');
  if (screen.colorDepth < 8) reasons.push('low-color-depth');

  return { isBot: reasons.length > 0, reasons };
}
