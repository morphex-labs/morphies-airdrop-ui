import { SubmitButton } from '../Form';
import { useAccount, useConnect, useContractRead } from 'wagmi';
import useSwapToken from '~/queries/useSwapToken';
import { AIRDROP_CONTRACT } from '~/lib/contracts';
import { useDialogState } from 'ariakit';

import React from 'react';
import { TransactionDialog } from '../Dialog';
import { airdropperABI } from '~/lib/abis/airdropper';
import { ethers } from 'ethers';
import { useGetAirdropAmount } from '~/queries/useGetAirdropAmount';

export default function AirdropClaim() {
  const [{ data: connectedData }] = useConnect();
  const isConnected = connectedData?.connected;

  return (
    <section className="-mt-2 w-full">
      <div className="flex items-center justify-center">{isConnected && <ClaimCard />}</div>
    </section>
  );
}

const ClaimCard = () => {
  const [{ data: accountData }] = useAccount();
  const userAddress = accountData?.address || '';
  const transactionDialog = useDialogState();

  const { mutate: swapToken, data: transaction } = useSwapToken();
  const [{ data: claimedData }] = useContractRead(
    {
      addressOrName: AIRDROP_CONTRACT,
      contractInterface: airdropperABI,
    },
    'claimedAddresses',
    {
      args: userAddress,
      watch: true,
    }
  );
  const userAirdropAmount = useGetAirdropAmount(userAddress);
  const hasClaimed = claimedData ? claimedData : false;

  const handleSubmit = async () => {
    swapToken(
      {
        contractAddress: AIRDROP_CONTRACT,
      },
      {
        onSettled: () => {
          transactionDialog.toggle();
        },
      }
    );
  };

  return (
    <div className=" flex w-full max-w-[500px] flex-col rounded-lg bg-[#fffffe] p-4 shadow-xl dark:bg-[#334155]">
      {userAirdropAmount.data && (
        <p className="text-md">Your airdrop amount: {ethers.utils.formatUnits(userAirdropAmount.data)}</p>
      )}
      <SubmitButton disabled={hasClaimed !== false} className="mt-4 bg-[#0029FF]" onClick={handleSubmit}>
        {hasClaimed === false ? 'Claim' : 'Already Claimed'}
      </SubmitButton>

      {transaction && <TransactionDialog dialog={transactionDialog} transactionHash={transaction.hash || ''} />}
    </div>
  );
};
