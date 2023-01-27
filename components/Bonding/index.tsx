import React, { useState } from 'react';
import BigNumber from 'bignumber.js';
import { InputAmountWithMaxButton, SubmitButton } from '../Form';
import { useBalance, useAccount, useProvider } from 'wagmi';
import { useApproveToken, useCheckTokenApproval } from '~/queries/useTokenApproval';
import useSwapToken from '~/queries/useSwapToken';
import { createContractAndCheckApproval } from '../Form/utils';
import { MIGRATOR_FANTOM, USDC_ADDRESS, WFTM_ADDRESS } from '~/lib/contracts';
import { useDialogState } from 'ariakit';
import { BeatLoader } from 'react-spinners';
import { TransactionDialog } from '../Dialog';
import toast from 'react-hot-toast';

export default function BondingSection() {
  return (
    <section className="-mt-2 w-full">
      <div className="section-header flex w-full flex-wrap items-center justify-between">
        <h1 className="font-exo">Bond for MPX</h1>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <UsdcCard />
        <FtmCard />
      </div>
    </section>
  );
}

const FtmCard = () => {
  const [ftmAmount, setFtmAmount] = useState('');

  const ftmAddress = WFTM_ADDRESS; // WFTM

  const [{ data: accountData }] = useAccount();
  const provider = useProvider();
  const [{ data: balance }] = useBalance({
    addressOrName: accountData?.address,
    token: ftmAddress,
  });

  const ftmBalance = Number(balance?.formatted).toFixed(2);
  const transactionDialog = useDialogState();

  const { mutate: swapToken, isLoading, data: transaction } = useSwapToken();
  const { mutate: checkTokenApproval, data: isApproved, isLoading: checkingApproval } = useCheckTokenApproval();
  const { mutate: approveToken, isLoading: approvingToken, error: approvalError } = useApproveToken();

  const checkApprovalOnChange = (vestedToken: string, vestedAmount: string) => {
    if (accountData && provider && vestedToken !== '' && vestedAmount !== '') {
      createContractAndCheckApproval({
        userAddress: accountData.address,
        tokenAddress: vestedToken,
        provider,
        approvalFn: checkTokenApproval,
        approvedForAmount: vestedAmount,
        approveForAddress: MIGRATOR_FANTOM,
      });
    }
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFtmAmount(e.target.value);

    checkApprovalOnChange(ftmAddress, ftmAmount);
  }

  const fillMaxAmountOnClick = () => {
    if (balance?.formatted) {
      setFtmAmount(balance?.formatted);

      checkApprovalOnChange(ftmAddress, ftmAmount);
    }
  };

  const handleSubmit = async () => {
    if (ftmAmount) {
      const formattedAmt = new BigNumber(ftmAmount).multipliedBy(10 ** 18);

      if (isApproved) {
        swapToken(
          {
            amountToDeposit: formattedAmt.toFixed(0),
            contractAddress: MIGRATOR_FANTOM,
          },
          {
            onSettled: () => {
              transactionDialog.toggle();
            },
          }
        );
      } else {
        approveToken(
          {
            tokenAddress: ftmAddress,
            amountToApprove: formattedAmt.toFixed(0),
            spenderAddress: MIGRATOR_FANTOM,
          },
          {
            onSettled: async () => {
              if (approvalError) {
                toast.error('Failed to approve token');
              } else {
                if (accountData && provider) {
                  // check for token approval again
                  createContractAndCheckApproval({
                    userAddress: accountData?.address,
                    tokenAddress: ftmAddress,
                    provider,
                    approvalFn: checkTokenApproval,
                    approvedForAmount: ftmAmount,
                    approveForAddress: MIGRATOR_FANTOM,
                  });
                }
              }
            },
          }
        );
      }
    }
  };

  return (
    <div className="flex flex-col rounded-lg bg-[#fffffe] p-4 shadow-xl dark:bg-[#334155]">
      <h3 className="text-lg">Bond wFTM</h3>
      <p className="mt-2 mb-4 text-[#b5b5b5] dark:text-[#b5bac1]">Balance: {ftmBalance}</p>
      <InputAmountWithMaxButton
        handleInputChange={handleChange}
        inputAmount={ftmAmount}
        id="ftm-id"
        selectedToken={null}
        fillMaxAmountOnClick={fillMaxAmountOnClick}
      />
      <SubmitButton className="mt-4" onClick={handleSubmit}>
        {checkingApproval || approvingToken ? (
          <BeatLoader size={6} color="white" />
        ) : isApproved ? (
          'Swap'
        ) : (
          'Approve Token'
        )}
      </SubmitButton>

      {transaction && <TransactionDialog dialog={transactionDialog} transactionHash={transaction.hash || ''} />}
    </div>
  );
};

const UsdcCard = () => {
  const [usdcAmount, setUsdcAmount] = useState('');

  const usdcAddress = USDC_ADDRESS;

  const [{ data: accountData }] = useAccount();
  const provider = useProvider();
  const [{ data: usdcBalance }] = useBalance({
    addressOrName: accountData?.address,
    token: usdcAddress,
    formatUnits: 'mwei',
  });

  const usdcBalanceFormatted = Number(usdcBalance?.formatted).toFixed(2);

  const transactionDialog = useDialogState();

  const { mutate: swapToken, isLoading, data: transaction } = useSwapToken();
  const { mutate: checkTokenApproval, data: isApproved, isLoading: checkingApproval } = useCheckTokenApproval();
  const { mutate: approveToken, isLoading: approvingToken, error: approvalError } = useApproveToken();

  const checkApprovalOnChange = (vestedToken: string, vestedAmount: string) => {
    if (accountData && provider && vestedToken !== '' && vestedAmount !== '') {
      createContractAndCheckApproval({
        userAddress: accountData.address,
        tokenAddress: vestedToken,
        provider,
        approvalFn: checkTokenApproval,
        approvedForAmount: vestedAmount,
        approveForAddress: MIGRATOR_FANTOM,
      });
    }
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUsdcAmount(e.target.value);

    checkApprovalOnChange(usdcAddress, usdcAmount);
  }

  const fillMaxAmountOnClick = () => {
    if (usdcBalance?.formatted) {
      setUsdcAmount(usdcBalance?.formatted);

      checkApprovalOnChange(usdcAddress, usdcAmount);
    }
  };

  const handleSubmit = async () => {
    if (usdcAmount) {
      const formattedAmt = new BigNumber(usdcAmount).multipliedBy(10 ** 18);

      if (isApproved) {
        swapToken(
          {
            amountToDeposit: formattedAmt.toFixed(0),
            contractAddress: MIGRATOR_FANTOM,
          },
          {
            onSettled: () => {
              transactionDialog.toggle();
            },
          }
        );
      } else {
        approveToken(
          {
            tokenAddress: usdcAddress,
            amountToApprove: formattedAmt.toFixed(0),
            spenderAddress: MIGRATOR_FANTOM,
          },
          {
            onSettled: async () => {
              if (approvalError) {
                toast.error('Failed to approve token');
              } else {
                if (accountData && provider) {
                  // check for token approval again
                  createContractAndCheckApproval({
                    userAddress: accountData?.address,
                    tokenAddress: usdcAddress,
                    provider,
                    approvalFn: checkTokenApproval,
                    approvedForAmount: usdcAmount,
                    approveForAddress: MIGRATOR_FANTOM,
                  });
                }
              }
            },
          }
        );
      }
    }
  };

  return (
    <div className="flex flex-col rounded-lg bg-[#fffffe] p-4 shadow-xl dark:bg-[#334155]">
      <h3 className="text-lg">Bond USDC</h3>
      <p className="mt-2 mb-4 text-[#b5b5b5] dark:text-[#b5bac1]">Balance: {usdcBalanceFormatted}</p>
      <InputAmountWithMaxButton
        handleInputChange={handleChange}
        inputAmount={usdcAmount}
        id="usdc-id"
        selectedToken={null}
        fillMaxAmountOnClick={fillMaxAmountOnClick}
      />
      <SubmitButton className="mt-4" onClick={handleSubmit}>
        {checkingApproval || approvingToken ? (
          <BeatLoader size={6} color="white" />
        ) : isApproved ? (
          'Swap'
        ) : (
          'Approve Token'
        )}
      </SubmitButton>

      {transaction && <TransactionDialog dialog={transactionDialog} transactionHash={transaction.hash || ''} />}
    </div>
  );
};
