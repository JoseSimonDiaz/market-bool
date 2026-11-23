import type { NextConfig } from 'next';

// Sin cacheComponents: es un sistema interno con sesión en cada página, todo se renderiza por pedido.
const nextConfig: NextConfig = {
  serverExternalPackages: ['@libsql/client'],
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

export default nextConfig;
