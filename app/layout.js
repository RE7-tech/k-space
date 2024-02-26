import { Figtree } from 'next/font/google';
import './globals.css';
import React from 'react';
import { DrawerProvider } from '@/context/DrawerContext';
import { AuthProvider } from '@/context/AuthContext';
import { CustomerProvider } from '@/context/CustomerContext';
import { HighlightInit } from '@highlight-run/next/client';

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
    <>
      <HighlightInit
				projectId={'jgovwv6d'}
				serviceName="my-nextjs-frontend"
				tracingOrigins
				networkRecording={{
					enabled: true,
					recordHeadersAndBody: true,
					urlBlocklist: [],
				}}
			/>

      <html lang="fr">
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>{metadata.title}</title>
          <meta name="description" content={metadata.description} />
          <link rel="icon" href="/favicon.ico" sizes='any' />
          <link rel="apple-touch-icon" href="/apple-touch-icon-iphone-60x60.png" />
          <link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon-ipad-76x76.png" />
          <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-iphone-retina-120x120.png" />
          <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-ipad-retina-152x152.png" />

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
    </>
  );
}
