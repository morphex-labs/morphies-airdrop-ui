import Head from 'next/head';
import { ReactNode } from 'react';
import classNames from 'classnames';
import { useDialogState } from 'ariakit';

import Header from './Header';
import CustomToast from '../CustomToast';

interface ILayoutProps {
  children: ReactNode;
  className?: string;
}

export default function Layout({ children, className, ...props }: ILayoutProps) {
  // const onboardDialog = useDialogState();
  const walletDialog = useDialogState();

  return (
    <>
      <Head>
        <title>oBMX Airdrop</title>
        <meta name="description" content="oBMX Airdrop" />
      </Head>

      <Header walletDialog={walletDialog} />

      <div className="flex flex-1 py-9">
        <main className={classNames('mx-auto max-w-7xl flex-1', className)} {...props}>
          {children}
        </main>
      </div>

      <CustomToast />
    </>
  );
}
