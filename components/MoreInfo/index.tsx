import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';

export default function MoreInfo({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (v: boolean) => void }) {
  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-[#334155]">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                    More Info
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="mb-2 text-sm text-gray-500 dark:text-[#cecece]">
                      Through this interface, you're able to get in early on Morphex before launch by bonding USDC or
                      wFTM for MPX.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-[#cecece]">Minimum bond amount: XXX</p>
                    <p className="mb-2 text-sm text-gray-500 dark:text-[#cecece]">Maximum bond amount: XXX</p>
                    <p className="mb-2 text-sm text-gray-500 dark:text-[#cecece]">
                      First, input the amount of USDC or wFTM you'd like to bond for MPX.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-[#cecece]">Rates:</p>
                    <p className="text-sm text-gray-500 dark:text-[#cecece]">1 MPX = 0.1 USDC</p>
                    <p className="mb-2 text-sm text-gray-500 dark:text-[#cecece]">1 MPX = 0.22 wFTM</p>
                    <p className="mb-2 text-sm text-gray-500 dark:text-[#cecece]">
                      Once you've approved and confirmed, a unique vesting contract will be created just for you.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-[#cecece]">Vesting terms:</p>
                    <p className="text-sm text-gray-500 dark:text-[#cecece]">60 days initial cliff</p>
                    <p className="text-sm text-gray-500 dark:text-[#cecece]">
                      1-year linear vesting (beginning from the moment the cliff is over)
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-[#0029FF] px-4 py-2 text-sm font-medium text-white hover:bg-[#2f51fb] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
