import * as React from 'react';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import Fallback, { FallbackContainer } from '~/components/Fallback';
import useGetVestingInfo from '~/queries/useGetVestingInfo';
import type { IVesting } from '~/types';
import { useTranslations } from 'next-intl';
import { useDialogState } from 'ariakit';
import VestingTable from './Table';
import ClaimVesting from './Table/ClaimVestingStream';
import { SubmitButton } from '../Form';
import { useAccount, useContractWrite } from 'wagmi';
import { vestingContractReadableABI } from '~/lib/abis/vestingContractReadable';
import toast from 'react-hot-toast';
import { TransactionDialog } from '../Dialog';
import { BeatLoader } from 'react-spinners';

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

  const claimDialog = useDialogState();

  const claimValues = React.useRef<IVesting | null>(null);
  console.log('data', data);

  return (
    <section className="-mt-2 w-full">
      <div className="section-header flex w-full flex-wrap items-center justify-between">
        <h1 className="font-exo">MPX Vesting</h1>
      </div>

      {isLoading || error || !data || data.length < 1 ? (
        <Fallback
          isLoading={isLoading}
          isError={error ? true : false}
          noData={true}
          type={'vestingStreams'}
          showLoader={true}
        />
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {data.map((d: IVesting) => (
            <VestingItem key={d.contract} data={d} />
          ))}
        </div>
      )}

      <React.Suspense fallback={null}>
        {claimValues.current && (
          <ClaimVesting claimValues={claimValues as React.MutableRefObject<IVesting>} claimDialog={claimDialog} />
        )}
      </React.Suspense>
    </section>
  );
}

const VestingItem: React.FC<{ data: IVesting }> = ({
  data: { contract, totalClaimed, totalLocked, tokenDecimals, unclaimed, endTime, startTime, cliffLength },
}) => {
  const [{ data: accountData }] = useAccount();
  const beneficiaryInput = accountData?.address;

  const amountToClaim = new BigNumber(unclaimed).toFixed(0);
  const transactionDialog = useDialogState();
  const [transactionHash, setTransactionHash] = React.useState<string>('');

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

  const totalVesting = Number(ethers.utils.formatUnits(totalLocked, 18)).toFixed(2);
  const claimed = Number(ethers.utils.formatUnits(totalClaimed, 18)).toFixed(3);
  const withdrawable = Number(ethers.utils.formatUnits(unclaimed, 18)).toFixed(4);
  const vestingEndTime = new Date(Number(endTime) * 1000).toLocaleDateString('en-GB');

  function getStatus() {
    if (Date.now() / 1e3 < Number(startTime) + Number(cliffLength)) {
      const tilStart = ((Number(startTime) + Number(cliffLength) - Date.now() / 1e3) / 86400).toFixed(2);
      return `Vesting starts in ${tilStart} days`;
    } else if (totalClaimed === totalLocked) {
      return `Vesting ended`;
    } else {
      const amtPerMonth: string = (
        (Number(totalLocked) / 10 ** Number(tokenDecimals) / (Number(endTime) - Number(startTime))) *
        secondsByDuration['month']
      ).toFixed(3);
      return `Vesting ${amtPerMonth} / month`;
    }
  }

  return (
    <div className="flex flex-col rounded-lg bg-[#fffffe] p-4 shadow-xl dark:bg-[#334155]">
      <div className="mb-4 flex w-full flex-row justify-between">
        <h4 className="text-md">Total Amount:</h4>
        <p className="text-[#b5b5b5] dark:text-[#b5bac1]">{totalVesting}</p>
      </div>
      <div className="mb-2 flex w-full flex-row justify-between">
        <h4 className="text-md">Status:</h4>
        <p className="text-sm text-[#b5b5b5] dark:text-[#b5bac1]">{getStatus()}</p>
      </div>
      <div className="mb-2 flex w-full flex-row justify-between">
        <h4 className="text-md">Claimed:</h4>
        <p className="text-sm text-[#b5b5b5] dark:text-[#b5bac1]">{claimed}</p>
      </div>
      <div className="mb-2 flex w-full flex-row justify-between">
        <h4 className="text-md">Withdrawable:</h4>
        <p className="text-sm text-[#b5b5b5] dark:text-[#b5bac1]">{withdrawable}</p>
      </div>
      <div className="mb-2 flex w-full flex-row justify-between">
        <h4 className="text-md">End Date:</h4>
        <p className="text-sm text-[#b5b5b5] dark:text-[#b5bac1]">{vestingEndTime}</p>
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

interface IAltVestingSectionProps {
  isLoading: boolean;
  isError: boolean;
  data?: IVesting[] | null;
}

export function AltVestingSection({ isLoading, isError, data }: IAltVestingSectionProps) {
  const t = useTranslations('Streams');

  const claimDialog = useDialogState();
  const reasonDialog = useDialogState();

  const claimValues = React.useRef<IVesting | null>(null);

  return (
    <section className="w-full">
      <div className="section-header">
        <h1 className="font-exo">Streams</h1>
      </div>

      {isLoading || isError || !data || data.length < 1 ? (
        <FallbackContainer>
          {isLoading ? null : isError ? (
            <p>{t('error')}</p>
          ) : !data || data.length < 1 ? (
            <p>{t('noActiveStreams')}</p>
          ) : null}
        </FallbackContainer>
      ) : (
        <VestingTable {...{ data, claimDialog, reasonDialog, claimValues }} />
      )}

      <React.Suspense fallback={null}>
        {claimValues.current && (
          <ClaimVesting claimValues={claimValues as React.MutableRefObject<IVesting>} claimDialog={claimDialog} />
        )}
      </React.Suspense>
    </section>
  );
}
