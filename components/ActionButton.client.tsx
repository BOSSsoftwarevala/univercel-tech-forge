'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  actionLabel?: string;
};

/**
 * ActionButton ensures every click triggers:
 * - local onClick (if provided)
 * - an audit POST to /api/audit (best-effort)
 * - client-side navigation (router.push) if href is provided
 *
 * Use this for critical public actions: Login, Join, Buy Now, Live Demo, Apply, Approve, etc.
 */
export default function ActionButton({ href, actionLabel, onClick, children, ...rest }: Props) {
  const router = useRouter();
  const handle = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      try { onClick(e); } catch (err) { console.error('onClick error', err); }
    }
    if (href && !e.defaultPrevented) {
      // best-effort audit
      fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: actionLabel || 'nav', href, path: location.pathname, ts: new Date().toISOString() }),
      }).catch(()=>{});
      // try client navigation
      try {
        router.push(href);
      } catch (err) {
        location.href = href;
      }
    }
  };

  return <button {...rest} onClick={handle}>{children}</button>;
}
