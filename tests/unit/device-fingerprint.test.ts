/**
 * Unit tests — Device Fingerprint & Bot Detection
 */

import { analyzeRequest, type RequestSignals } from '../../src/lib/payment/device-fingerprint.js';

const humanSignals: RequestSignals = {
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0',
  acceptLanguage: 'en-US,en;q=0.9',
  acceptEncoding: 'gzip, deflate, br',
  xForwardedFor: '203.0.113.5',
  referer: 'https://softwarewala.net',
  requestsInLastMinute: 2,
  timeBetweenRequestsMs: 3500,
};

describe('Bot Detection Fingerprinting', () => {
  it('identifies a human browser request as not a bot', () => {
    const result = analyzeRequest(humanSignals);
    expect(result.isLikelyBot).toBe(false);
    expect(result.signals).toHaveLength(0);
  });

  it('flags missing user-agent as bot', () => {
    const result = analyzeRequest({ ...humanSignals, userAgent: '' });
    expect(result.isLikelyBot).toBe(true);
    expect(result.signals).toContain('MISSING_USER_AGENT');
  });

  it('flags known bot user-agents', () => {
    const bots = [
      'python-requests/2.28.0',
      'curl/7.88.0',
      'Googlebot/2.1',
      'axios/1.4.0',
      'Go-http-client/1.1',
    ];
    for (const ua of bots) {
      const result = analyzeRequest({ ...humanSignals, userAgent: ua });
      expect(result.isLikelyBot).toBe(true);
    }
  });

  it('flags missing Accept-Language header', () => {
    const result = analyzeRequest({ ...humanSignals, acceptLanguage: undefined });
    expect(result.signals).toContain('MISSING_ACCEPT_LANGUAGE');
  });

  it('flags high request rate (> 30/min)', () => {
    const result = analyzeRequest({ ...humanSignals, requestsInLastMinute: 50 });
    expect(result.isLikelyBot).toBe(true);
    expect(result.signals).toContain('HIGH_REQUEST_RATE');
  });

  it('flags inhuman click speed (< 200ms between requests)', () => {
    const result = analyzeRequest({ ...humanSignals, timeBetweenRequestsMs: 50 });
    expect(result.isLikelyBot).toBe(true);
    expect(result.signals).toContain('INHUMAN_SPEED');
  });

  it('generates a consistent fingerprint for same signals', () => {
    const r1 = analyzeRequest(humanSignals);
    const r2 = analyzeRequest(humanSignals);
    expect(r1.fingerprint).toBe(r2.fingerprint);
  });

  it('generates different fingerprints for different IPs', () => {
    const r1 = analyzeRequest({ ...humanSignals, xForwardedFor: '1.1.1.1' });
    const r2 = analyzeRequest({ ...humanSignals, xForwardedFor: '2.2.2.2' });
    expect(r1.fingerprint).not.toBe(r2.fingerprint);
  });

  it('blocks automated attack: bot UA + inhuman speed', () => {
    const result = analyzeRequest({
      userAgent: 'python-requests/2.28.0',
      requestsInLastMinute: 100,
      timeBetweenRequestsMs: 10,
    });
    expect(result.isLikelyBot).toBe(true);
    expect(result.signals.length).toBeGreaterThan(1);
  });
});
