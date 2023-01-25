import { getAddress } from 'ethers/lib/utils';
import * as React from 'react';
import { StreamAndHistoryQuery } from '~/services/generated/graphql';
import type { IStream, IStreamAndHistory } from '~/types';
import { createContract } from '~/utils/contract';
import { createERC20Contract } from '~/utils/tokenUtils';
import { Provider } from './useNetworkProvider';

export function useFormatStreamAndHistory({
  data,
  address,
  provider,
}: {
  data?: StreamAndHistoryQuery;
  address?: string;
  provider: Provider | null;
}): IStreamAndHistory {
  return React.useMemo(() => {
    if (provider && data && address) {
      const streams = data?.user?.streams ?? [];
      const history = data?.user?.historicalEvents ?? [];

      const formattedStreams = streams.map((s) => formatStream({ stream: s, address, provider }));

      const formattedHistory = history.map((h) => {
        const addressType: 'payer' | 'payee' =
          h.stream?.payer?.id?.toLowerCase() === address.toLowerCase() ? 'payer' : 'payee';

        const addressRelated =
          addressType === 'payer'
            ? h.stream?.payee?.id ?? null
            : h.stream?.payer?.id
            ? h.stream?.payer?.id
            : h.users[0]?.id ?? null;

        return {
          ...h,
          amountPerSec: h.stream?.amountPerSec ?? null,
          addressRelated,

          addressType,
        };
      });

      return {
        streams: formattedStreams.length > 0 ? formattedStreams : null,
        history: formattedHistory.length > 0 ? formattedHistory : null,
      };
    } else return { streams: null, history: null };
  }, [data, provider, address]);
}

export const formatStream = ({
  stream,
  provider,
  address,
}: {
  stream: any;
  provider: Provider;
  address: string;
}): IStream => {
  const streamType: 'outgoingStream' | 'incomingStream' =
    stream.payer.id?.toLowerCase() === address.toLowerCase() ? 'outgoingStream' : 'incomingStream';

  return {
    llamaContractAddress: stream.contract.address,
    amountPerSec: stream.amountPerSec,
    createdTimestamp: stream.createdTimestamp,
    payerAddress: stream.payer.id,
    payeeAddress: stream.payee.id,
    streamId: stream.streamId,
    streamType,
    token: stream.token,
    tokenName: stream.token.name,
    tokenSymbol: stream.token.symbol,
    tokenContract: createERC20Contract({ tokenAddress: getAddress(stream.token.address), provider }),
    llamaTokenContract: createContract(getAddress(stream.contract.address), provider),
    historicalEvents: stream.historicalEvents,
    paused: stream.paused,
    pausedAmount: stream.pausedAmount,
    lastPaused: stream.lastPaused,
    reason: stream.reason || null,
  };
};
