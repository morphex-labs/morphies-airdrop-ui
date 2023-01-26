import * as React from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { DisclosureState } from 'ariakit';
import { useTranslations } from 'next-intl';
import { MoonIcon, SunIcon } from '@heroicons/react/outline';
import { Account, WalletSelector } from '~/components/Web3';
import { Logo } from '~/components/Icons';
import { useTheme } from 'next-themes';
import { useIsMounted } from '~/hooks';

const Header = ({ walletDialog }: { walletDialog: DisclosureState }) => {
  const [{ data }] = useAccount();

  const t = useTranslations('Common');

  const { setTheme, resolvedTheme } = useTheme();

  const isMounted = useIsMounted();

  const isDark = resolvedTheme === 'dark';

  return (
    <header className="mt-2 flex content-center items-center justify-between gap-10 rounded-[30px] border-llama-teal-2 bg-[#fffffe] bg-opacity-5 py-2 px-6 text-base dark:border-lp-gray-7 dark:bg-[#334155] sm:px-6 lg:px-8">
      <Link href="/" passHref>
        <a className="text-[#0c00ff] dark:text-[#fff]">
          <span className="sr-only">Navigate to Home Page</span>
          <Logo />
        </a>
      </Link>

      <div className="flex flex-shrink-0 items-center justify-between gap-[0.625rem]">
        {data ? (
          <>
            <Account showAccountInfo={walletDialog.toggle} />
          </>
        ) : (
          <button className="nav-button-v2 hidden hover:opacity-80  md:block" onClick={walletDialog.toggle}>
            {t('connectWallet')}
          </button>
        )}

        <button
          className="nav-button-v2 w-10 cursor-pointer px-[11px]"
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
        >
          {isMounted && (
            <>
              <span className="sr-only">Switch Theme</span>
              {!isDark ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
            </>
          )}
        </button>
      </div>

      <WalletSelector dialog={walletDialog} />
    </header>
  );
};

export default Header;
