import { Chain } from 'wagmi';

export const chains: Chain[] = [
  {
    id: 8453,
    name: 'Base',
    nativeCurrency: { name: 'Base', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://rpc.ankr.com/base'],
    blockExplorers: [
      {
        name: 'BaseScan',
        url: 'https://basescan.org/',
      },
    ],
  },
];
