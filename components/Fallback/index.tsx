import * as React from 'react';
import { useNetworkProvider } from '~/hooks';
import { BeatLoader } from 'react-spinners';
import { useAccount } from 'wagmi';

interface FallbackProps {
  isLoading?: boolean;
  isError: boolean;
  noData: boolean;
  showLoader?: boolean;
  supressWalletConnection?: boolean;
}

const Fallback = ({ isLoading, isError, noData, supressWalletConnection, showLoader }: FallbackProps) => {
  const [{ data: basicAccountData }] = useAccount();

  const accountData = supressWalletConnection === true || basicAccountData !== undefined;

  const { unsupported } = useNetworkProvider();

  const errorMessage = "Couldn't load data";
  const emptyDataMessage = 'Bond for MPX to see your vesting contracts';
  const defaultMessage = !accountData
    ? 'Connect a wallet to see your vesting contracts'
    : unsupported
    ? 'Network not supported, please switch to Base Mainnet'
    : null;

  return (
    <FallbackContainer>
      {defaultMessage ||
        (isLoading ? (
          <>{showLoader && <FallbackContainerLoader />}</>
        ) : isError ? (
          <p>{errorMessage}</p>
        ) : noData ? (
          <p>{emptyDataMessage}</p>
        ) : null)}
    </FallbackContainer>
  );
};

export function FallbackContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[3.5rem] w-full items-center justify-center break-all rounded border border-dashed border-[#626262] px-3 text-xs font-semibold">
      {children}
    </div>
  );
}

export const FallbackContainerLoader = () => (
  <span className="relative top-[2px]">
    <BeatLoader size={6} />
  </span>
);

export default Fallback;
