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
    migrator: string;
    pills: string;
    mpx: string;
  };
}

export const networkDetails: INetworkDetails = {
  8453: {
    rpcUrl: 'https://rpc.ankr.com/base',
    chainProviders: new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/base'),
    blockExplorerURL: 'https://basescan.org/',
    blockExplorerName: 'BaseScan',
    prefix: 'base',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/base/info/logo.png',
    vestingFactory: CONTRACTS.VESTING_FACTORY_FANTOM,
    migrator: CONTRACTS.MIGRATOR_FANTOM,
    pills: CONTRACTS.PILLS_ADDRESS,
    mpx: CONTRACTS.MPX_ADDRESS,
  },
};
