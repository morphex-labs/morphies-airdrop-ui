import { SubmitButton } from '../Form';
import { useAccount, useContractRead } from 'wagmi';
import useSwapToken from '~/queries/useSwapToken';
import { BONDER_USDC } from '~/lib/contracts';
import { useDialogState } from 'ariakit';

import MoreInfo from '../MoreInfo';
import React, { useState } from 'react';
import { TransactionDialog } from '../Dialog';
import { bonderABI } from '~/lib/abis/bonder';

export default function BondingSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="-mt-2 w-full">
      <MoreInfo isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="section-header flex w-full flex-wrap items-center justify-between">
        <h1 className="font-exo flex items-center">
          Claim
          <button
            className="ml-4 cursor-pointer rounded-lg bg-[#0029FF] px-2 py-1 text-sm font-normal text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            More Info
          </button>
        </h1>
      </div>
      <div className="flex items-center justify-center">
        <UsdcCard />
      </div>
    </section>
  );
}

const UsdcCard = () => {
  const [{ data: accountData }] = useAccount();
  const userAddress = accountData?.address;
  const transactionDialog = useDialogState();

  const { mutate: swapToken, data: transaction } = useSwapToken();
  const [{ data: claimedData }] = useContractRead(
    {
      addressOrName: BONDER_USDC,
      contractInterface: bonderABI,
    },
    'claimedAddresses',
    {
      args: userAddress,
    }
  );
  console.log('claimedData', claimedData);

  const handleSubmit = async () => {
    swapToken(
      {
        contractAddress: BONDER_USDC,
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
      <h3 className="text-lg">Claim your oBMX</h3>
      <SubmitButton disabled={true} className="mt-4 bg-[#0029FF]" onClick={handleSubmit}>
        {userAddress ? 'Claim' : 'Already Claimed'}
      </SubmitButton>

      {transaction && <TransactionDialog dialog={transactionDialog} transactionHash={transaction.hash || ''} />}
    </div>
  );
};
