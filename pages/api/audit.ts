// Minimal audit endpoint. Replace DB call with your supabase/db client.
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const payload = req.body || {};
  try {
    // TODO: Replace this with your DB insert / supabase client
    // Example (supabase):
    // await supabase.from('audit_logs').insert([{ ...payload }]);
    console.debug('AUDIT:', payload);
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('audit error', err);
    res.status(500).json({ ok: false });
  }
}
