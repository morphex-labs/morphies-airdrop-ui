import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import BigNumber from 'bignumber.js';
import React, { useState } from 'react';
import { useDialogState } from 'ariakit';
import { BeatLoader } from 'react-spinners';
import { useBalance, useAccount, useProvider, useContractRead } from 'wagmi';

import MoreInfo from '../MoreInfo';
import { TransactionDialog } from '../Dialog';
import { bonderABI } from '../../lib/abis/bonder';
import useSwapToken from '../../queries/useSwapToken';
import { createContractAndCheckApproval } from '../Form/utils';
import { InputAmountWithMaxButton, SubmitButton } from '../Form';
import { BONDER_WFTM, BONDER_USDC, USDC_ADDRESS, WFTM_ADDRESS, MPX_ADDRESS } from '../../lib/contracts';
import { useApproveToken, useCheckTokenApproval } from '../../queries/useTokenApproval';

export default function BondingSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="-mt-2 w-full">
      <MoreInfo isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="section-header flex w-full flex-wrap items-center justify-between">
        <h1 className="font-exo flex items-center">
          Bond for MPX
          <button
            className="ml-4 cursor-pointer rounded-lg bg-[#0029FF] px-2 py-1 text-sm font-normal text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            More Info
          </button>
        </h1>
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
  const [{ data: bonderMpxBalance }] = useBalance({
    addressOrName: BONDER_WFTM,
    token: MPX_ADDRESS,
  });
  const [{ data: minCap }] = useContractRead({ addressOrName: BONDER_WFTM, contractInterface: bonderABI }, 'minCap');
  const [{ data: maxCap }] = useContractRead({ addressOrName: BONDER_WFTM, contractInterface: bonderABI }, 'maxCap');
  const [{ data: ratio }] = useContractRead({ addressOrName: BONDER_WFTM, contractInterface: bonderABI }, 'ratio');
  const [{ data: contributions }] = useContractRead(
    {
      addressOrName: BONDER_WFTM,
      contractInterface: bonderABI,
    },
    'contributions',
    { args: [accountData?.address] }
  );

  const trueContributions = contributions ? Number(ethers.utils.formatUnits(contributions, 18)).toFixed(0) : '0';
  const trueMinCap = minCap ? Number(ethers.utils.formatUnits(minCap, 18)).toFixed(0) : '0';
  const trueMaxCap = maxCap ? Number(ethers.utils.formatUnits(maxCap, 18)).toFixed(0) : '0';
  const trueRatio = ((1 / Number(ratio)) * 1000).toFixed(4);

  const bonderMpxBalanceFormatted = bonderMpxBalance?.formatted ? Number(bonderMpxBalance?.formatted).toFixed(0) : '0';
  const bonderMpxBalanceWFTM = Number(bonderMpxBalanceFormatted) * Number(trueRatio);

  const ftmBalance = balance?.formatted ? Number(balance.formatted).toFixed(0) : '-';

  const transactionDialog = useDialogState();

  const { mutate: swapToken, data: transaction } = useSwapToken();
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
        approveForAddress: BONDER_WFTM,
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
      console.log('approve/swap amt', formattedAmt.toFixed(0));

      if (isApproved) {
        swapToken(
          {
            amountToDeposit: formattedAmt.toFixed(0),
            contractAddress: BONDER_WFTM,
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
            spenderAddress: BONDER_WFTM,
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
                    approveForAddress: BONDER_WFTM,
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
      <h3 className="text-lg">Bond wFTM (1 MPX = {trueRatio} wFTM)</h3>
      <p className="mt-2 mb-4 text-[#4f4f4f] dark:text-[#b5bac1]">
        Available: {bonderMpxBalanceFormatted} MPX or {bonderMpxBalanceWFTM} wFTM
      </p>
      <p className="mt-2 text-[#4f4f4f] dark:text-[#b5bac1]">Min amount: {trueMinCap} wFTM</p>
      <p className="mt-2 mb-4 text-[#4f4f4f] dark:text-[#b5bac1]">Max amount: {trueMaxCap} wFTM</p>
      <p className="mt-2 text-[#4f4f4f] dark:text-[#b5bac1]">Your previous contributions: {trueContributions} wFTM</p>
      <p className="mt-2 mb-4 text-[#4f4f4f] dark:text-[#b5bac1]">Your balance: {ftmBalance} wFTM</p>
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
  const [{ data: bonderMpxBalance }] = useBalance({
    addressOrName: BONDER_USDC,
    token: MPX_ADDRESS,
  });
  const [{ data: minCap }] = useContractRead({ addressOrName: BONDER_USDC, contractInterface: bonderABI }, 'minCap');
  const [{ data: maxCap }] = useContractRead({ addressOrName: BONDER_USDC, contractInterface: bonderABI }, 'maxCap');
  const [{ data: ratio }] = useContractRead({ addressOrName: BONDER_USDC, contractInterface: bonderABI }, 'ratio');
  const [{ data: contributions }] = useContractRead(
    {
      addressOrName: BONDER_USDC,
      contractInterface: bonderABI,
    },
    'contributions',
    { args: [accountData?.address] }
  );

  const trueContributions = contributions ? Number(ethers.utils.formatUnits(contributions, 6)).toFixed(0) : '0';
  const trueMinCap = minCap ? Number(ethers.utils.formatUnits(minCap, 6)).toFixed(0) : '0';
  const trueMaxCap = maxCap ? Number(ethers.utils.formatUnits(maxCap, 6)).toFixed(0) : '0';
  const trueRatio = ((1 / Number(ratio)) * 1000).toFixed(2);

  const bonderMpxBalanceFormatted = bonderMpxBalance?.formatted ? Number(bonderMpxBalance?.formatted).toFixed(0) : '0';
  const bonderMpxBalanceUSD = Number(bonderMpxBalanceFormatted) * Number(trueRatio);

  const usdcBalanceFormatted = usdcBalance?.formatted ? Number(usdcBalance?.formatted).toFixed(0) : '-';

  const transactionDialog = useDialogState();

  const { mutate: swapToken, data: transaction } = useSwapToken();
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
        approveForAddress: BONDER_USDC,
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
      const formattedAmt = new BigNumber(usdcAmount).multipliedBy(10 ** 6);
      console.log('approve/swap amt', formattedAmt.toFixed(0));

      if (isApproved) {
        swapToken(
          {
            amountToDeposit: formattedAmt.toFixed(0),
            contractAddress: BONDER_USDC,
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
            spenderAddress: BONDER_USDC,
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
                    approveForAddress: BONDER_USDC,
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
      <h3 className="text-lg">Bond USDC (1 MPX = {trueRatio} USDC)</h3>
      <p className="mt-2 mb-4 text-[#4f4f4f] dark:text-[#b5bac1]">
        Available: {bonderMpxBalanceFormatted} MPX or {bonderMpxBalanceUSD} USDC
      </p>
      <p className="mt-2 text-[#4f4f4f] dark:text-[#b5bac1]">Min amount: {trueMinCap} USDC</p>
      <p className="mt-2 mb-4 text-[#4f4f4f] dark:text-[#b5bac1]">Max amount: {trueMaxCap} USDC</p>
      <p className="mt-2 text-[#4f4f4f] dark:text-[#b5bac1]">Your previous contributions: {trueContributions} USDC</p>
      <p className="mt-2 mb-4 text-[#4f4f4f] dark:text-[#b5bac1]">Your balance: {usdcBalanceFormatted} USDC</p>
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
