import { useEffect, useState } from 'react';
import { getHealth } from '../lib/api';

export function HomePage() {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<'loading' | 'online' | 'error'>('loading');

  useEffect(() => {
    const controller = new AbortController();
    setState('loading');

    getHealth(controller.signal)
      .then(() => setState('online'))
      .catch(() => {
        if (!controller.signal.aborted) setState('error');
      });

    return () => controller.abort();
  }, [attempt]);

  return (
    <main className="page">
      <section className="card">
        <span className="eyebrow">PROJECTFORECAST</span>
        <h1>Workspace siap.</h1>
        <p>React SPA dan FastAPI berjalan dalam satu monorepo Bun.</p>
        {state === 'loading' && (
          <div className="status" role="status">
            <span className="dot" /> Memeriksa koneksi API…
          </div>
        )}
        {state === 'online' && (
          <div className="status" role="status">
            <span className="dot online" /> API aktif
          </div>
        )}
        {state === 'error' && (
          <div className="failure" role="alert">
            <p>API belum dapat dihubungi. Periksa koneksi lalu coba lagi.</p>
            <button type="button" onClick={() => setAttempt((value) => value + 1)}>
              Coba lagi
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
