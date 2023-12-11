import { Figtree } from 'next/font/google';
import './globals.css';
import React from 'react';
import DesktopLayout from '@/components/DesktopLayout';
import { DrawerProvider } from '@/context/DrawerContext';
import { AuthProvider } from '@/context/AuthContext';
import { CustomerProvider } from '@/context/CustomerContext';

const inter = Figtree({
  weights: [400, 500, 600, 700, 900],
  styles: ['normal', 'italic'],
  subsets: ['latin'],
});

export const metadata = {
  title: 'Klian - Espace client',
  description: "L'espace client de Klian",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{metadata.title}</title>
      </head>
      <body className={`${inter.className} overflow-hidden`}>
        <AuthProvider>
          <CustomerProvider>
            <DrawerProvider>
              {children}
            </DrawerProvider>
          </CustomerProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
