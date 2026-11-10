import { createRootRoute, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: Outlet,
  notFoundComponent: () => (
    <main className="page">
      <section className="card">
        <span className="eyebrow">404</span>
        <h1>Halaman tidak ditemukan.</h1>
        <p>Alamat yang dibuka tidak tersedia.</p>
      </section>
    </main>
  ),
});
