import React, { useState } from 'react';
import BigNumber from 'bignumber.js';
import { InputAmountWithMaxButton, SubmitButton } from '../Form';
import { useBalance, useAccount, useContract } from 'wagmi';
import { useApproveToken, useCheckTokenApproval } from '~/queries/useTokenApproval';
import useSwapToken from '~/queries/useSwapToken';
import { checkApproval } from '../Form/utils';
import { TokenABI } from '~/lib/abis/token';
import { Contract } from 'ethers';
import { MIGRATOR_FANTOM, PILLS } from '~/lib/contracts';
import { useDialogState } from 'ariakit';
import { BeatLoader } from 'react-spinners';
import { TransactionDialog } from '../Dialog';
import toast from 'react-hot-toast';

export default function BondingSection() {
  return (
    <section className="-mt-2 w-full">
      <div className="section-header flex w-full flex-wrap items-center justify-between">
        <h1 className="font-exo">Bonding</h1>
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
  // const [isApproved, setIsApproved] = useState(false);

  const ftmAddress = PILLS; // 0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83
  const tokenContract = useContract({
    addressOrName: ftmAddress,
    contractInterface: TokenABI,
  }) as Contract;
  const [{ data: accountData }] = useAccount();
  const [{ data: balance }] = useBalance({
    addressOrName: accountData?.address,
    token: ftmAddress,
  });

  const ftmBalance = Number(balance?.formatted).toFixed(2);
  const transactionDialog = useDialogState();

  const { mutate, isLoading, data: transaction } = useSwapToken();
  const { mutate: checkTokenApproval, data: isApproved, isLoading: checkingApproval } = useCheckTokenApproval();
  const { mutate: approveToken, isLoading: approvingToken, error: approvalError } = useApproveToken();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFtmAmount(e.target.value);

    checkApproval({
      tokenDetails: {
        decimals: 18,
        tokenContract: tokenContract,
        spenderAddress: MIGRATOR_FANTOM,
      },
      userAddress: accountData?.address,
      approvedForAmount: ftmAmount,
      checkTokenApproval,
    });
  }

  const fillMaxAmountOnClick = () => {
    if (balance?.formatted) {
      setFtmAmount(balance?.formatted);

      checkApproval({
        tokenDetails: {
          decimals: 18,
          tokenContract: tokenContract,
          spenderAddress: MIGRATOR_FANTOM,
        },
        userAddress: accountData?.address,
        approvedForAmount: ftmAmount,
        checkTokenApproval,
      });
    }
  };

  const handleSubmit = () => {
    const amount = ftmAmount;

    if (amount) {
      const formattedAmt = new BigNumber(amount).multipliedBy(10 ** 18);

      if (isApproved) {
        mutate(
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
            onSettled: () => {
              checkApproval({
                tokenDetails: {
                  decimals: 18,
                  tokenContract: tokenContract,
                  spenderAddress: MIGRATOR_FANTOM,
                },
                userAddress: accountData?.address,
                approvedForAmount: amount,
                checkTokenApproval,
              });
            },
          }
        );
      }
    }
    if (approvalError) {
      toast.error('Failed to approve token');
    }
  };

  const disableApprove = approvingToken || checkingApproval;

  // const {
  //   checkingApproval,
  //   approvingToken,
  //   approvalError,
  //   confirmingDeposit,
  //   tokenOptions,
  //   handleTokenChange,
  //   handleInputChange,
  //   handleSubmit,
  //   isApproved,
  //   depositTransaction,
  //   selectedToken,
  //   inputAmount,
  //   fillMaxAmountOnClick,
  // } = useDepositForm({ userAddress, tokens, transactionDialog, componentDialog: dialog });

  // const disableApprove = checkingApproval || approvingToken;

  // const handleApprove = () => {
  //   setIsApproved(!isApproved);
  // };

  return (
    <div className="flex flex-col rounded-lg bg-[#fffffe] p-4 shadow-xl dark:bg-[#334155]">
      <h3 className="text-lg">Bond wFTM</h3>
      <p className="mt-2 mb-4 text-[#b5b5b5] dark:text-[#b5bac1]">Balance: {ftmBalance}</p>
      <InputAmountWithMaxButton
        // handleInputChange={(e) => setFtmAmount(e.target.value)}
        handleInputChange={handleChange}
        inputAmount={ftmAmount}
        id="ftm-id"
        selectedToken={null}
        fillMaxAmountOnClick={fillMaxAmountOnClick}
      />
      {isApproved ? (
        <SubmitButton disabled={isLoading} onClick={handleSubmit} className="mt-4">
          {isLoading ? <BeatLoader size={6} color="white" /> : 'Swap'}
        </SubmitButton>
      ) : (
        <SubmitButton disabled={disableApprove} onClick={handleSubmit} className="mt-4">
          {disableApprove ? <BeatLoader size={6} color="white" /> : 'Approve'}
        </SubmitButton>
      )}

      {transaction && <TransactionDialog dialog={transactionDialog} transactionHash={transaction.hash || ''} />}
      {/* <SubmitButton className="mt-4" onClick={handleApprove}>
        {isApproved ? 'Swap' : 'Approve'}
      </SubmitButton> */}
    </div>
  );
};

const UsdcCard = () => {
  const [usdcAmount, setUsdcAmount] = useState('');
  const [isApproved, setIsApproved] = useState(false);

  const [{ data: accountData }] = useAccount();
  const [{ data: balance }] = useBalance({
    addressOrName: accountData?.address,
    token: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
    formatUnits: 'mwei',
  });

  const usdcBalance = Number(balance?.formatted).toFixed(2);

  const handleFillMaxAmount = () => {};

  const handleApprove = () => {
    setIsApproved(!isApproved);
  };

  return (
    <div className="flex flex-col rounded-lg bg-[#fffffe] p-4 shadow-xl dark:bg-[#334155]">
      <h3 className="text-lg">Bond USDC</h3>
      <p className="mt-2 mb-4 text-[#b5b5b5] dark:text-[#b5bac1]">Balance: {usdcBalance}</p>
      <InputAmountWithMaxButton
        handleInputChange={(e) => setUsdcAmount(e.target.value)}
        inputAmount={usdcAmount}
        id="usdc-id"
        selectedToken={null}
        fillMaxAmountOnClick={handleFillMaxAmount}
      />
      <SubmitButton className="mt-4" onClick={handleApprove}>
        {isApproved ? 'Swap' : 'Approve'}
      </SubmitButton>
    </div>
  );
};
