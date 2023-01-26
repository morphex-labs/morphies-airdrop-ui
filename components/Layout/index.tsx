import * as React from 'react';
import Head from 'next/head';
import { useDialogState } from 'ariakit';
import { useAccount } from 'wagmi';
import Header from './Header';
import Hero from './Hero';
// import OnboardDialog from '~/components/Onboard';

import CustomToast from '~/components/CustomToast';
import classNames from 'classnames';

interface ILayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function Layout({ children, className, ...props }: ILayoutProps) {
  const [{ data }] = useAccount();

  // const onboardDialog = useDialogState();
  const walletDialog = useDialogState();

  return (
    <>
      <Head>
        <title>Morphex</title>
        <meta name="description" content="Morphex Bonds" />
      </Head>

      <Header walletDialog={walletDialog} />

      <div className="flex flex-1 py-9">
        <main className={classNames('mx-auto max-w-7xl flex-1', className)} {...props}>
          {children}
        </main>
      </div>

      {/* <OnboardDialog dialog={onboardDialog} /> */}

      <CustomToast />
    </>
  );
}
