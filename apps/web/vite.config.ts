import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';

const repoRoot = fileURLToPath(new URL('../../', import.meta.url));

function getRequiredValue(value: string | undefined, name: string): string {
  const result = value?.trim();
  if (!result) throw new Error(`${name} must be set in the root .env file`);
  return result;
}

function getPort(value: string | undefined, name: string): number {
  const port = Number(getRequiredValue(value, name));
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`${name} must be an integer between 1 and 65535`);
  }
  return port;
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, repoRoot, '');
  const webHost = getRequiredValue(env.WEB_HOST, 'WEB_HOST');
  const apiHost = getRequiredValue(env.API_HOST, 'API_HOST');
  const apiPort = getPort(env.API_PORT, 'API_PORT');

  return {
    envDir: repoRoot,
    plugins: [
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
      }),
      react(),
    ],
    server: {
      host: webHost,
      port: getPort(env.WEB_PORT, 'WEB_PORT'),
      strictPort: true,
      proxy: {
        '/api': `http://${apiHost}:${apiPort}`,
      },
    },
    test: {
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
      restoreMocks: true,
    },
  };
});
