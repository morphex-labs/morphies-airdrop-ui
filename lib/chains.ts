import { Chain } from 'wagmi';

// const defaultChains: Chain[] = allChains.filter(
//   (chain) =>
//     chain.name === 'Avalanche Fuji Testnet' ||
//     chain.name === 'Avalanche Mainnet' ||
//     chain.name === 'Polygon Mainnet' ||
//     chain.name === 'Mainnet' ||
//     chain.name === 'Optimism' ||
//     chain.name === 'Arbitrum One' ||
//     chain.name === 'Goerli'
// );

// const formattedChains = defaultChains.map((chain) => {
//   if (chain.name === 'Mainnet') {
//     return { ...chain, name: 'Ethereum' };
//   }

//   if (chain.name === 'Avalanche Mainnet') {
//     return { ...chain, name: 'Avalanche' };
//   }

//   if (chain.name === 'Polygon Mainnet') {
//     return { ...chain, name: 'Polygon' };
//   }

//   if (chain.name === 'Avalanche Fuji Testnet') {
//     return { ...chain, name: 'Fuji' };
//   }

//   return chain;
// });

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
