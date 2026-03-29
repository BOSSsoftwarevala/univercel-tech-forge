// AI API SYSTEM ULTRA FIX — CLIENT API
// All client calls map to real server endpoints

import axios from 'axios';

export async function buyApiCredits(amount: number) {
  return axios.post('/api/ai/buy', { amount });
}

export async function validateApiKey(key: string) {
  return axios.post('/api/ai/validate-key', { key });
}

export async function createLicense(productId: string) {
  return axios.post('/api/ai/license', { productId });
}

export async function getWallet() {
  return axios.get('/api/ai/wallet');
}

export async function billUsage(amount: number) {
  return axios.post('/api/ai/bill', { amount });
}

export async function getUsageLogs() {
  return axios.get('/api/ai/usage');
}
