'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/hooks/use-theme';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        defaultTheme="light"
        storageKey="blogcraft-theme"
      >
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}