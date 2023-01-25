import { ethers } from 'ethers';

import * as CONTRACTS from './contracts';

interface INetworkDetails {
  [key: number]: {
    rpcUrl: string;
    subgraphEndpoint: string;
    chainProviders: ethers.providers.BaseProvider;
    llamapayFactoryAddress: string;
    disperseAddress: string;
    botAddress: string;
    blockExplorerURL: string;
    blockExplorerName: string;
    prefix: string;
    logoURI: string;
    tokenListId?: string;
    vestingFactory: string;
    vestingReason: string;
    paymentsContract?: string;
    paymentsGraphApi?: string;
    botSubgraph?: string;
    scheduledTransferFactory?: string;
    scheduledTransferSubgraph?: string;
  };
}

export const networkDetails: INetworkDetails = {
  250: {
    rpcUrl: 'https://rpc.ftm.tools/',
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-fantom',
    chainProviders: new ethers.providers.JsonRpcProvider('https://rpc.ftm.tools/'),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_FANTOM,
    disperseAddress: CONTRACTS.DISPERSE_DEFAULT,
    botAddress: CONTRACTS.BOT_FANTOM,
    blockExplorerURL: 'https://ftmscan.com/',
    blockExplorerName: 'FTMScan',
    prefix: 'fantom',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/fantom/info/logo.png',
    tokenListId: 'fantom',
    vestingFactory: CONTRACTS.VESTING_FACTORY_FANTOM,
    vestingReason: '0x0000000000000000000000000000000000000000',
    botSubgraph: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-bot-subgraph-fantom',
    paymentsContract: CONTRACTS.PAYMENTS_FANTOM,
    paymentsGraphApi: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/token-escrow-fantom',
  },
};
