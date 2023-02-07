import { Menu } from '@headlessui/react';

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Dropdown() {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="hover:bg-[#4562f0 inline-flex w-full justify-center rounded-md  bg-[#0029FF] px-2 py-1 text-sm font-medium text-white shadow-sm">
        More
      </Menu.Button>
      <Menu.Items className="absolute z-10 mt-2 w-56 rounded-md bg-white shadow-lg dark:border dark:border-[#4b5e7a] dark:bg-[#334155]">
        <Menu.Item>
          {({ active }) => (
            <a
              className={classNames(
                active ? 'rounded-md bg-gray-100 text-gray-900 dark:bg-[#4b5e7a] dark:text-white' : 'text-gray-700',
                'block px-4 py-2 text-sm dark:bg-[#334155] dark:text-white'
              )}
              target="_blank"
              rel="noreferrer"
              href="https://migration.morphex.trade/"
            >
              Migration
            </a>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <a
              className={classNames(
                active ? 'rounded-md bg-gray-100 text-gray-900 dark:bg-[#4b5e7a] dark:text-white' : 'text-gray-700',
                'block px-4 py-2 text-sm dark:bg-[#334155] dark:text-white'
              )}
              target="_blank"
              rel="noreferrer"
              href="/litepaper.pdf"
            >
              Litepaper
            </a>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
}
