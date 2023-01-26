import * as React from 'react';
import Fallback, { FallbackContainer } from '~/components/Fallback';
import useGetVestingInfo from '~/queries/useGetVestingInfo';
import type { IVesting } from '~/types';
import { useTranslations } from 'next-intl';
import { useDialogState } from 'ariakit';
import VestingTable from './Table';
import ClaimVesting from './Table/ClaimVestingStream';

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
        <VestingTable {...{ data, claimDialog, claimValues }} />
      )}

      <React.Suspense fallback={null}>
        {claimValues.current && (
          <ClaimVesting claimValues={claimValues as React.MutableRefObject<IVesting>} claimDialog={claimDialog} />
        )}
      </React.Suspense>
    </section>
  );
}

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
