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
  250: {
    rpcUrl: 'https://rpc.ftm.tools/',
    chainProviders: new ethers.providers.JsonRpcProvider('https://rpc.ftm.tools/'),
    blockExplorerURL: 'https://ftmscan.com/',
    blockExplorerName: 'FTMScan',
    prefix: 'fantom',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/fantom/info/logo.png',
    vestingFactory: CONTRACTS.VESTING_FACTORY_FANTOM,
    migrator: CONTRACTS.MIGRATOR_FANTOM,
    pills: '',
    mpx: '',
  },
  4002: {
    rpcUrl: 'https://rpc.ankr.com/fantom_testnet',
    chainProviders: new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/fantom_testnet'),
    blockExplorerURL: 'https://testnet.ftmscan.com/',
    blockExplorerName: 'FTMScan',
    prefix: 'fantom',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/fantom/info/logo.png',
    vestingFactory: CONTRACTS.VESTING_FACTORY_FANTOM,
    migrator: CONTRACTS.MIGRATOR_FANTOM_TESTNET,
    pills: '0x960A8DFb58D443f5fffac146E5b9EdE87c2bB90A',
    mpx: '0x7a0B7eBBfc3b25Fd23182AfA43a95885B9aEca95',
  },
};
