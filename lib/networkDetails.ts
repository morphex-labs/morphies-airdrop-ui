import { ethers } from 'ethers';

import * as CONTRACTS from './contracts';

interface INetworkDetails {
  [key: number]: {
    rpcUrl: string;
    chainProviders: ethers.providers.BaseProvider;
    blockExplorerURL: string;
    blockExplorerName: string;
    prefix: string;
    logoURI: string;
    vestingFactory: string;
  };
}

export const networkDetails: INetworkDetails = {
  250: {
    rpcUrl: 'https://rpc.ftm.tools/',
    chainProviders: new ethers.providers.JsonRpcProvider('https://rpc.ftm.tools/'),
    blockExplorerURL: 'https://ftmscan.com/',
    blockExplorerName: 'FTMScan',
    prefix: 'fantom',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/fantom/info/logo.png',
    vestingFactory: CONTRACTS.VESTING_FACTORY_FANTOM,
  },
  4002: {
    rpcUrl: 'https://rpc.ankr.com/fantom_testnet',
    chainProviders: new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/fantom_testnet'),
    blockExplorerURL: 'https://testnet.ftmscan.com/',
    blockExplorerName: 'FTMScan',
    prefix: 'fantom',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/fantom/info/logo.png',
    vestingFactory: CONTRACTS.VESTING_FACTORY_FANTOM,
  },
};
