import { createRootRoute, Link, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: Outlet,
  notFoundComponent: () => (
    <main className="page">
      <section className="card">
        <span className="eyebrow">404</span>
        <h1>Halaman tidak ditemukan.</h1>
        <p>Alamat yang dibuka tidak tersedia.</p>
        <Link to="/">Kembali ke beranda</Link>
      </section>
    </main>
  ),
  errorComponent: ({ reset }) => (
    <main className="page">
      <section className="card">
        <span className="eyebrow">TERJADI KESALAHAN</span>
        <h1>Halaman gagal dimuat.</h1>
        <p>Silakan muat ulang halaman ini atau kembali ke beranda.</p>
        <div className="actions">
          <button type="button" onClick={reset}>Coba lagi</button>
          <Link to="/">Kembali ke beranda</Link>
        </div>
      </section>
    </main>
  ),
});
