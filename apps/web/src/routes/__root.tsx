import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export const Route = createRootRoute({
  component: Outlet,
  notFoundComponent: () => (
    <main className="flex min-h-svh items-center justify-center bg-background p-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <Badge variant="outline" className="w-fit">404</Badge>
          <CardTitle>Halaman tidak ditemukan.</CardTitle>
          <CardDescription>Alamat yang dibuka tidak tersedia.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button asChild variant="outline">
            <Link to="/">Kembali ke beranda</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  ),
  errorComponent: ({ reset }) => (
    <main className="flex min-h-svh items-center justify-center bg-background p-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <Badge variant="destructive" className="w-fit">TERJADI KESALAHAN</Badge>
          <CardTitle>Halaman gagal dimuat.</CardTitle>
          <CardDescription>Silakan coba lagi atau kembali ke beranda.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button type="button" onClick={reset}>Coba lagi</Button>
          <Button asChild variant="outline">
            <Link to="/">Kembali ke beranda</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  ),
});
