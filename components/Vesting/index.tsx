import * as React from 'react';
import Fallback, { FallbackContainer } from '~/components/Fallback';
import useGetVestingInfo from '~/queries/useGetVestingInfo';
import type { IVesting } from '~/types';
import { useTranslations } from 'next-intl';
import { useDialogState } from 'ariakit';
import VestingTable from './Table';
import ClaimVesting from './Table/ClaimVestingStream';
import { SubmitButton } from '../Form';

export default function VestingSection() {
  const { data, isLoading, error } = useGetVestingInfo();

  const claimDialog = useDialogState();

  const claimValues = React.useRef<IVesting | null>(null);

  return (
    <section className="-mt-2 w-full">
      <div className="section-header flex w-full flex-wrap items-center justify-between">
        <h1 className="font-exo">Vesting</h1>
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
  data: { contract, token, totalClaimed, totalLocked, tokenDecimals, tokenName, tokenSymbol, recipient },
}) => {
  const handleClaimTokens = () => {};

  return (
    <div className="flex flex-col rounded-lg bg-[#fffffe] p-4 shadow-xl dark:bg-[#334155]">
      <div className="mb-4 flex w-full flex-row justify-between">
        <h3>Total Vesting</h3>
        <p className="text-[#b5b5b5] dark:text-[#b5bac1]">1.00</p>
      </div>
      <div className="mb-2 flex w-full flex-row justify-between">
        <h4 className="text-sm">Claimed</h4>
        <p className="text-sm text-[#b5b5b5] dark:text-[#b5bac1]">0.0</p>
      </div>
      <div className="mb-2 flex w-full flex-row justify-between">
        <h4 className="text-sm">Withdrawable</h4>
        <p className="text-sm text-[#b5b5b5] dark:text-[#b5bac1]">0.000953</p>
      </div>
      <div className="mb-2 flex w-full flex-row justify-between">
        <h4 className="text-sm">Status</h4>
        <p className="text-sm text-[#b5b5b5] dark:text-[#b5bac1]">Vesting 4.2324/month</p>
      </div>

      <SubmitButton className="mt-4" onClick={handleClaimTokens}>
        Claim Tokens
      </SubmitButton>

      <div className="mt-2 flex justify-center">
        <a className="text-xs" href="">
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
