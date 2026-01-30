'use client';
import { useEffect } from 'react';

/*
  Dev-only click instrumentation. Logs the element under the cursor on click (capture-phase)
  and prints the DOM path. Import this component in _app for immediate diagnostic info.
*/
export default function ClickInstrument() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      try {
        const x = e.clientX, y = e.clientY;
        const el = document.elementFromPoint(x, y) as HTMLElement | null;
        console.debug('[CLICK INSTRUMENT]', { x, y, tag: el?.tagName, id: el?.id, classes: el?.className, role: el?.getAttribute?.('role') });
        const path = [];
        let cur = el;
        for (let i = 0; cur && i < 12; i++) {
          path.push(`${cur.tagName}${cur.id ? '#'+cur.id: ''}${cur.className ? '.'+cur.className.split(' ').slice(0,3).join('.') : ''}`);
          cur = cur.parentElement;
        }
        console.debug('[CLICK PATH]', path.join(' > '));
      } catch (err) {
        console.error('instrument error', err);
      }
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);
  return null;
}
