import "@/styles/globals.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { NuqsAdapter } from 'nuqs/adapters/next/pages';
import { OverlayProvider } from "overlay-kit";
import { useState } from "react";

import { ApiClientProvider } from "@challenge/api";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <ApiClientProvider>
      <QueryClientProvider client={queryClient}>
        <NuqsAdapter>
          <OverlayProvider>
            <Component {...pageProps} />
          </OverlayProvider>
        </NuqsAdapter>
      </QueryClientProvider>
    </ApiClientProvider>
  );
}
