import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PocketLegal - Your Rights Simplified',
  description: 'Your rights, simplified and actionable, right in your pocket.',
  keywords: ['legal rights', 'legal advice', 'tenant rights', 'employment rights', 'consumer rights'],
  authors: [{ name: 'PocketLegal Team' }],
  openGraph: {
    title: 'PocketLegal - Your Rights Simplified',
    description: 'Your rights, simplified and actionable, right in your pocket.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PocketLegal - Your Rights Simplified',
    description: 'Your rights, simplified and actionable, right in your pocket.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
