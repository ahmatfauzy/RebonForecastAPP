import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { getHealth } from '@/lib/api';

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
    <main className="flex min-h-svh items-center justify-center bg-background p-6">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <Badge variant="outline">PROJECTFORECAST</Badge>
              <CardTitle className="text-2xl">Workspace siap.</CardTitle>
              <CardDescription>
                React SPA dan FastAPI berjalan dalam satu monorepo Bun.
              </CardDescription>
            </div>
            <Badge variant={state === 'error' ? 'destructive' : 'secondary'}>
              {state === 'loading' && 'Memeriksa API'}
              {state === 'online' && 'API aktif'}
              {state === 'error' && 'API offline'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <Separator />
          {state === 'loading' && (
            <div className="space-y-3" role="status">
              <span className="sr-only">Memeriksa koneksi API…</span>
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          )}
          {state === 'online' && (
            <p className="text-sm text-muted-foreground" role="status">
              API aktif dan siap menerima request.
            </p>
          )}
          {state === 'error' && (
            <Alert variant="destructive">
              <AlertTitle>Koneksi API gagal</AlertTitle>
              <AlertDescription className="space-y-3">
                <p>API belum dapat dihubungi. Periksa koneksi lalu coba lagi.</p>
                <Button type="button" onClick={() => setAttempt((value) => value + 1)}>
                  Coba lagi
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
