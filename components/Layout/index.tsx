import * as React from 'react';
import Head from 'next/head';
import { useDialogState } from 'ariakit';
import Header from './Header';
import CustomToast from '~/components/CustomToast';
import classNames from 'classnames';

interface ILayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function Layout({ children, className, ...props }: ILayoutProps) {
  // const onboardDialog = useDialogState();
  const walletDialog = useDialogState();

  return (
    <>
      <Head>
        <title>Morphex Bonds</title>
        <meta name="description" content="Morphex Bonds" />
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
