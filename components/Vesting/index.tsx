import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import { FC, useState } from 'react';
import { useDialogState } from 'ariakit';
import { BeatLoader } from 'react-spinners';
import { useAccount, useContractWrite } from 'wagmi';

import Fallback from '../Fallback';
import { SubmitButton } from '../Form';
import type { IVesting } from '../../types';
import { TransactionDialog } from '../Dialog';
import { MPX_ADDRESS } from '../../lib/contracts';
import useGetVestingInfo from '../../queries/useGetVestingInfo';
import { vestingContractReadableABI } from '../../lib/abis/vestingContractReadable';

interface ISecondsByDuration {
  [key: string]: number;
}

const secondsByDuration: ISecondsByDuration = {
  hour: 60 * 60,
  day: 24 * 60 * 60,
  week: 7 * 24 * 60 * 60,
  biweek: 2 * 7 * 24 * 60 * 60,
  month: 30 * 24 * 60 * 60,
  year: 365 * 24 * 60 * 60,
};

export default function VestingSection() {
  const { data, isLoading, error } = useGetVestingInfo();

  const handleClaimAll = () => {
    console.log('object');
  };

  return (
    <section className="-mt-2 w-full">
      <div className="section-header flex w-full flex-wrap items-center justify-between">
        <h1 className="font-exo flex items-center">
          MPX Vesting
          <button
            className="ml-4 cursor-pointer rounded-lg bg-[#0029FF] px-2 py-1 text-sm font-normal text-white"
            onClick={handleClaimAll}
          >
            Claim All
          </button>
        </h1>
      </div>

      {isLoading || error || !data || data.length < 1 ? (
        <Fallback isLoading={isLoading} isError={error ? true : false} noData={true} showLoader={true} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {data
            .filter((d: IVesting) => d.token === MPX_ADDRESS)
            .map((d: IVesting) => (
              <VestingItem key={d.contract} data={d} />
            ))}
        </div>
      )}
    </section>
  );
}

const VestingItem: FC<{ data: IVesting }> = ({
  data: { contract, totalClaimed, totalLocked, unclaimed, endTime, startTime, cliffLength },
}) => {
  const [{ data: accountData }] = useAccount();
  const beneficiaryInput = accountData?.address;

  const amountToClaim = ethers.utils.parseUnits(unclaimed, 18);
  const transactionDialog = useDialogState();
  const [transactionHash, setTransactionHash] = useState<string>('');

  const [{ loading }, claim] = useContractWrite(
    {
      addressOrName: contract,
      contractInterface: vestingContractReadableABI,
    },
    'claim'
  );
  function handleConfirm() {
    claim({ args: [beneficiaryInput, amountToClaim] }).then((data) => {
      if (data.error) {
        console.log(data.error);
        toast.error('Failed to claim MPX');
      } else {
        const toastid = toast.loading('Claiming MPX');
        setTransactionHash(data.data.hash);
        transactionDialog.show();
        data.data.wait().then((receipt) => {
          toast.dismiss(toastid);
          receipt.status === 1 ? toast.success('Successfully claimed MPX') : toast.error('Failed to claim MPX');
        });
      }
    });
  }

  const totalVesting = ethers.utils.commify(Number(totalLocked).toFixed(2));
  const claimed = ethers.utils.commify(Number(totalClaimed).toFixed(2));
  const withdrawable = Number(unclaimed).toFixed(2);
  const vestingEndTime = new Date(Number(endTime) * 1000).toLocaleDateString('en-GB');

  function getStatus() {
    if (Date.now() / 1e3 < Number(startTime) + Number(cliffLength)) {
      const tilStart = ((Number(startTime) + Number(cliffLength) - Date.now() / 1e3) / 86400).toFixed(2);
      return `Vesting starts in ${tilStart} days`;
    } else if (totalClaimed === totalLocked) {
      return `Vesting ended`;
    } else {
      const amtPerMonth: string = (
        (Number(totalLocked) / (Number(endTime) - Number(startTime))) *
        secondsByDuration['month']
      ).toFixed(2);
      return `Vesting ${amtPerMonth} / month`;
    }
  }

  return (
    <div className="flex flex-col rounded-lg bg-[#fffffe] p-4 shadow-xl dark:bg-[#334155]">
      <div className="mb-4 flex w-full flex-row justify-between">
        <h4 className="text-md">Total Amount:</h4>
        <p className="text-[#4f4f4f] dark:text-[#b5bac1]">{totalVesting}</p>
      </div>
      <div className="mb-2 flex w-full flex-row justify-between">
        <h4 className="text-md">Status:</h4>
        <p className="text-sm text-[#4f4f4f] dark:text-[#b5bac1]">{getStatus()}</p>
      </div>
      <div className="mb-2 flex w-full flex-row justify-between">
        <h4 className="text-md">Claimed:</h4>
        <p className="text-sm text-[#4f4f4f] dark:text-[#b5bac1]">{claimed}</p>
      </div>
      <div className="mb-2 flex w-full flex-row justify-between">
        <h4 className="text-md">Withdrawable:</h4>
        <p className="text-sm text-[#4f4f4f] dark:text-[#b5bac1]">{withdrawable}</p>
      </div>
      <div className="mb-2 flex w-full flex-row justify-between">
        <h4 className="text-md">End Date:</h4>
        <p className="text-sm text-[#4f4f4f] dark:text-[#b5bac1]">{vestingEndTime}</p>
      </div>

      <SubmitButton className="mt-4" onClick={handleConfirm}>
        {loading ? <BeatLoader size={6} color="white" /> : 'Claim'}
      </SubmitButton>
      <TransactionDialog transactionHash={transactionHash} dialog={transactionDialog} />

      <div className="mt-2 flex justify-center">
        <a className="text-sm" href={`https://ftmscan.com/address/${contract}`} target="_blank" rel="noreferrer">
          Contract
        </a>
      </div>
    </div>
  );
};
