import '~/styles/globals.css';

import * as React from 'react';
import dynamic from 'next/dynamic';
import type { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import { ReactQueryDevtools } from 'react-query/devtools';
import { QueryClient, QueryClientProvider, Hydrate } from 'react-query';

import { WalletProvider } from '../components/Web3';

function App({ Component, pageProps }: AppProps) {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <ThemeProvider defaultTheme="light" attribute="class">
      <WalletProvider>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <Component {...pageProps} />
            <ReactQueryDevtools initialIsOpen={false} />
          </Hydrate>
        </QueryClientProvider>
      </WalletProvider>
    </ThemeProvider>
  );
}

export default dynamic(() => Promise.resolve(App), {
  ssr: false,
});
