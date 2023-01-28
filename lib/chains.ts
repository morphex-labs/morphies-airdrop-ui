import { Chain } from 'wagmi';

export const chains: Chain[] = [
  {
    id: 250,
    name: 'Fantom',
    nativeCurrency: { name: 'Fantom', symbol: 'FTM', decimals: 18 },
    rpcUrls: ['https://rpc.ftm.tools'],
    blockExplorers: [
      {
        name: 'FTMScan',
        url: 'https://ftmscan.com',
      },
    ],
  },
  {
    id: 4002,
    name: 'Fantom Testnet',
    nativeCurrency: { name: 'Fantom', symbol: 'FTM', decimals: 18 },
    rpcUrls: ['https://rpc.ankr.com/fantom_testnet'],
    blockExplorers: [
      {
        name: 'FTMScan',
        url: 'https://testnet.ftmscan.com/',
      },
    ],
  },
];
