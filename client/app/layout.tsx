import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React from 'react';
import { Providers } from './providers';
import { Navbar } from '@/components/navbar';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BlogCraft - Modern Blogging Platform',
  description: 'Share your stories with BlogCraft - a modern blogging platform featuring dynamic content blocks, responsive design, and powerful editing tools.',
  openGraph: {
    title: 'BlogCraft - Modern Blogging Platform',
    description: 'Share your stories with BlogCraft - a modern blogging platform featuring dynamic content blocks, responsive design, and powerful editing tools.',
    type: 'website',
    siteName: 'BlogCraft',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BlogCraft - Modern Blogging Platform',
    description: 'Share your stories with BlogCraft - a modern blogging platform featuring dynamic content blocks, responsive design, and powerful editing tools.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <Navbar />
            <main>{children}</main>
            
            {/* Footer */}
            <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 py-12 mt-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="col-span-2">
                    <h3 className="text-xl font-bold text-white mb-4">BlogCraft</h3>
                    <p className="text-slate-400 mb-4">
                      A modern blogging platform with dynamic content blocks, perfect for developers and content creators.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-4">Platform</h4>
                    <ul className="space-y-2 text-slate-400">
                      <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                      <li><a href="/create" className="hover:text-white transition-colors">Create Post</a></li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-4">Connect</h4>
                    <div className="flex space-x-4">
                      <a href="#" className="text-slate-400 hover:text-white transition-colors">
                        GitHub
                      </a>
                      <a href="#" className="text-slate-400 hover:text-white transition-colors">
                        Twitter
                      </a>
                    </div>
                  </div>
                </div>
                <div className="border-t border-slate-800 dark:border-slate-700 mt-8 pt-8 text-center text-slate-400">
                  <p>&copy; 2024 BlogCraft. Built with Next.js, Express, and TypeScript.</p>
                </div>
              </div>
            </footer>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}