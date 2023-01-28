import * as React from 'react';
import { networkDetails } from '~/lib/networkDetails';
import { chains } from '~/lib/chains';
import { Connector, Provider } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { ethers } from 'ethers';

const connectors = () => {
  return [
    new InjectedConnector({
      chains,
      options: { shimDisconnect: true },
    }),
    new WalletConnectConnector({
      options: {
        qrcode: true,
      },
    }),
  ];
};

// Set up providers
type ProviderConfig = { chainId?: number; connector?: Connector };

const provider = ({ chainId }: ProviderConfig) => {
  const chainDetails = chainId && networkDetails[chainId];
  return chainDetails ? chainDetails.chainProviders : new ethers.providers.JsonRpcProvider('https://rpc.ftm.tools/');
};

type Props = {
  children?: React.ReactNode;
};

export const WalletProvider = ({ children }: Props) => {
  const basicProvider = (
    <Provider autoConnect connectors={connectors} provider={provider}>
      {children}
    </Provider>
  );
  return basicProvider;
};
