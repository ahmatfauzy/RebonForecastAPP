import { createFileRoute } from '@tanstack/react-router';
import type { HealthResponse } from '@projectforecast/contracts';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((response) => response.json() as Promise<HealthResponse>)
      .then(setHealth)
      .catch(() => setHealth(null));
  }, []);

  return (
    <main className="page">
      <section className="card">
        <span className="eyebrow">PROJECTFORECAST</span>
        <h1>Workspace siap.</h1>
        <p>React SPA dan FastAPI berjalan dalam satu monorepo Bun.</p>
        <div className="status" role="status">
          <span className={`dot ${health ? 'online' : ''}`} />
          API {health?.status ?? 'belum terhubung'}
        </div>
      </section>
    </main>
  );
}
