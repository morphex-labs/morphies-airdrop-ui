import * as React from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';

export function Nav() {
  const router = useRouter();

  const isVesting = router.pathname.includes('/vesting');

  return (
    <nav className="hidden min-w-[224px] flex-col gap-3 px-8 lg:flex">
      <Group name="Vesting" isOpen={isVesting}>
        <LinkItem name="Streams" href="/vesting" isActive={isVesting && router.pathname !== '/vesting/create'} />
        <Spacer />
        <LinkItem name="Create" href="/vesting/create" isActive={router.pathname === '/vesting/create'} />
      </Group>

      <span className="my-3 h-[1px] bg-llama-teal-2 dark:bg-lp-gray-7" />
    </nav>
  );
}

const Group = ({ name, isOpen, children }: { name: string; isOpen: boolean; children: React.ReactNode }) => {
  return (
    <details className="select-none" open={isOpen}>
      <summary className="cursor-pointer list-none font-semibold">{name}</summary>
      <ul className="my-3">{children}</ul>
    </details>
  );
};

const Spacer = () => {
  return (
    <li className="border-l border-llama-gray-300 px-2 dark:border-lp-gray-7">
      <div className="h-[0.5rem]"></div>
    </li>
  );
};

const LinkItem = ({ isActive, href, name }: { isActive: boolean; href: string; name: string }) => {
  return (
    <li
      className={classNames(
        'border-l border-llama-gray-300 px-2 dark:border-lp-gray-7',
        isActive && '!border-llama-green-500'
      )}
    >
      <Link href={href} passHref>
        <a
          className={classNames('text-sm font-medium', isActive && 'font-bold text-llama-green-500 dark:text-lp-white')}
        >
          {name}
        </a>
      </Link>
    </li>
  );
};
