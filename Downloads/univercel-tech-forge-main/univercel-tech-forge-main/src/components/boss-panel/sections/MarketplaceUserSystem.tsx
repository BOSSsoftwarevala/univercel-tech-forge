import React, { useCallback, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

type RawRow = Record<string, any>;

const PENDING_STATUSES = ['pending', 'awaiting_review', 'pending_approval'] as const;
type PendingStatus = typeof PENDING_STATUSES[number];

type PendingItem = {
  id: string; // composed "table:id"
  source: 'marketplace_orders' | 'licenses' | 'franchise_requests' | 'reseller_requests' | 'influencer_requests';
  originalId: string;
  typeLabel: string;
  name: string | null;
  user_id: string | null;
  date: string | null;
  status: string | null;
  raw: RawRow;
};

export default function MarketplaceUserSystem(): JSX.Element {
  const [processingIds, setProcessingIds] = useState<Record<string, boolean>>({});
  const queryClient = useQueryClient();

  // Centralized query using react-query
  const { data: approvals, isLoading, refetch } = useQuery({
    queryKey: ['boss-approvals'],
    queryFn: async () => {
      const [orders, licenses, franchise, reseller, influencer] = await Promise.all([
        supabase.from('marketplace_orders').select('*').in('status', PENDING_STATUSES as any),
        supabase.from('licenses').select('*').in('status', PENDING_STATUSES as any),
        supabase.from('franchise_requests').select('*').in('status', PENDING_STATUSES as any),
        supabase.from('reseller_requests').select('*').in('status', PENDING_STATUSES as any),
        supabase.from('influencer_requests').select('*').in('status', PENDING_STATUSES as any),
      ]);

      return {
        orders: orders.data || [],
        licenses: licenses.data || [],
        franchise: franchise.data || [],
        reseller: reseller.data || [],
        influencer: influencer.data || [],
      };
    },
  });

  const collected = useMemo<PendingItem[]>(() => {
    const rows: PendingItem[] = [];
    if (!approvals) return rows;

    const push = (arr: any[], source: PendingItem['source'], mapper: (r: any) => PendingItem) => {
      if (!Array.isArray(arr)) return;
      for (const r of arr) rows.push(mapper(r));
    };

    push(approvals.orders, 'marketplace_orders', (r: any) => ({
      id: `marketplace_orders:${r.id}`,
      source: 'marketplace_orders',
      originalId: r.id,
      typeLabel: 'Order',
      name: r.buyer_name ?? r.buyer_email ?? null,
      user_id: r.user_id ?? null,
      date: r.created_at ?? r.createdAt ?? null,
      status: r.status ?? null,
      raw: r,
    }));

    push(approvals.licenses, 'licenses', (r: any) => ({
      id: `licenses:${r.id}`,
      source: 'licenses',
      originalId: r.id,
      typeLabel: 'License',
      name: r.name ?? null,
      user_id: r.user_id ?? null,
      date: r.created_at ?? r.createdAt ?? null,
      status: r.status ?? null,
      raw: r,
    }));

    push(approvals.franchise, 'franchise_requests', (r: any) => ({
      id: `franchise_requests:${r.id}`,
      source: 'franchise_requests',
      originalId: r.id,
      typeLabel: 'Franchise Request',
      name: r.name ?? r.business_name ?? null,
      user_id: r.user_id ?? null,
      date: r.created_at ?? r.createdAt ?? null,
      status: r.status ?? null,
      raw: r,
    }));

    push(approvals.reseller, 'reseller_requests', (r: any) => ({
      id: `reseller_requests:${r.id}`,
      source: 'reseller_requests',
      originalId: r.id,
      typeLabel: 'Reseller Request',
      name: r.name ?? r.company ?? null,
      user_id: r.user_id ?? null,
      date: r.created_at ?? r.createdAt ?? null,
      status: r.status ?? null,
      raw: r,
    }));

    push(approvals.influencer, 'influencer_requests', (r: any) => ({
      id: `influencer_requests:${r.id}`,
      source: 'influencer_requests',
      originalId: r.id,
      typeLabel: 'Influencer Request',
      name: r.name ?? r.handle ?? null,
      user_id: r.user_id ?? null,
      date: r.created_at ?? r.createdAt ?? null,
      status: r.status ?? null,
      raw: r,
    }));

    // Sort by date desc
    rows.sort((a, b) => {
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return db - da;
    });

    return rows;
  }, [approvals]);

  const setProcessing = useCallback((id: string, v: boolean) => {
    setProcessingIds((prev) => ({ ...prev, [id]: v }));
  }, []);

  // Use Edge Function to perform approve/reject (avoids RLS issues). This does not change UI layout.
  const handleAction = useCallback(
    async (it: PendingItem, action: 'approve' | 'reject') => {
      const idKey = it.id;
      if (processingIds[idKey]) return;
      setProcessing(idKey, true);

      try {
        // Call Supabase Edge Function that performs the update using the service role key:
        // Endpoint (deployed in your Supabase project): /functions/v1/approve-reject-approval
        // Payload: { table: it.source, id: it.originalId, action: 'approve'|'reject' }
        const resp = await fetch('/functions/v1/approve-reject-approval', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            table: it.source,
            id: it.originalId,
            action,
          }),
        });

        let json: any = null;
        try {
          json = await resp.json();
        } catch {
          json = null;
        }

        if (!resp.ok) {
          console.error('[MarketplaceUserSystem] edge function update failed', { status: resp.status, body: json });
          alert(`Failed to ${action} item: ${json?.error || `status ${resp.status}`}`);
        } else {
          // success — refresh approvals
          await queryClient.invalidateQueries({ queryKey: ['boss-approvals'] });
          await refetch();
        }
      } catch (e) {
        console.error('[MarketplaceUserSystem] action error calling edge function:', e);
        alert(`Failed to ${action} item: ${String(e)}`);
      } finally {
        setProcessing(idKey, false);
      }
    },
    [processingIds, queryClient, refetch]
  );

  const empty = !isLoading && collected.length === 0;

  return (
    <section aria-labelledby="marketplace-approvals-heading">
      <h3 id="marketplace-approvals-heading">Pending Approvals</h3>

      {isLoading ? (
        <div>Loading approvals…</div>
      ) : empty ? (
        <div>No pending approvals</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Date</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {collected.map((it) => {
                const processing = !!processingIds[it.id];
                return (
                  <tr key={it.id} style={{ borderTop: '1px solid #eee' }}>
                    <td style={{ padding: '8px', verticalAlign: 'top' }}>{it.name ?? '—'}</td>
                    <td style={{ padding: '8px', verticalAlign: 'top' }}>{it.typeLabel}</td>
                    <td style={{ padding: '8px', verticalAlign: 'top' }}>
                      {it.date ? new Date(it.date).toLocaleString() : '—'}
                    </td>
                    <td style={{ padding: '8px', verticalAlign: 'top' }}>
                      <button
                        onClick={() => handleAction(it, 'approve')}
                        disabled={processing}
                        aria-label={`Approve ${it.typeLabel}`}
                        style={{
                          marginRight: 8,
                          padding: '6px 10px',
                          background: '#0066CC',
                          color: 'white',
                          border: 'none',
                          borderRadius: 4,
                          cursor: processing ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {processing ? 'Processing…' : 'Approve'}
                      </button>

                      <button
                        onClick={() => {
                          if (!confirm('Reject this item?')) return;
                          handleAction(it, 'reject');
                        }}
                        disabled={processing}
                        aria-label={`Reject ${it.typeLabel}`}
                        style={{
                          padding: '6px 10px',
                          background: '#E53E3E',
                          color: 'white',
                          border: 'none',
                          borderRadius: 4,
                          cursor: processing ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {processing ? 'Processing…' : 'Reject'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
