import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from '@/componentes/ui/sonner';
import type { RUTAS } from '@/constantes/rutas';
import './globals.css';

const fuenteSans = Geist({ variable: '--font-sans', subsets: ['latin'] });
const fuenteMono = Geist_Mono({ variable: '--font-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: 'market-bool', template: '%s · market-bool' },
  description: 'Gestión comercial de la tienda de cartas Pokémon market-bool',
};

export default function LayoutRaiz({
  children,
}: LayoutProps<typeof RUTAS.inicio>) {
  return (
    <html
      lang="es"
      className={`${fuenteSans.variable} ${fuenteMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
