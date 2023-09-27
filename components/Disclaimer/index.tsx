/* eslint-disable @typescript-eslint/no-empty-function */
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function Disclaimer({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (v: boolean) => void }) {
  function closeModal() {
    setIsOpen(false);
  }

  const handleAgreeWithDisclaimer = () => {
    localStorage.setItem('x-morphex-bonds-disclaimer-accepted', JSON.stringify({ isDisclaimerShown: true }));

    closeModal();
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => {}}>
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
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-[#334155]">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                    By using this interface, I agree to the following:
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="mb-2 text-sm text-gray-500  dark:text-[#cecece]">
                      - I am not a person or entity that resides in, am a citizen of, or is incorporated in, or have a
                      registered office in the United States of America or any "Prohibited Localities": Myanmar (Burma),
                      Cote D'Ivoire (Ivory Coast), Cuba, Crimea and Sevastopol, Democratic Republic of Congo, Iran,
                      Iraq, Libya, Mali, Nicaragua, Democratic People’s Republic of Korea (North Korea), Somalia, Sudan,
                      Syria, Yemen, Zimbabwe or any other state, country or region that is included in any sanctions
                      designations published by international organizations as well as any governmental authorities of
                      any jurisdiction.{' '}
                    </p>
                    <p className="mb-2 text-sm text-gray-500 dark:text-[#cecece]">
                      - I will not in the future access this interface while located within the United States or any
                      Prohibited Localities, as defined above.{' '}
                    </p>
                    <p className="mb-2 text-sm text-gray-500 dark:text-[#cecece]">
                      - I am not using, and will not in the future use, a VPN to mask my physical location from a
                      restricted territory.{' '}
                    </p>
                    <p className="mb-2 text-sm text-gray-500 dark:text-[#cecece]">
                      - I am lawfully permitted to access this interface under the laws of the jurisdiction on which I
                      reside and am located.{' '}
                    </p>
                    <p className="mb-2 text-sm text-gray-500 dark:text-[#cecece]">
                      - I understand and agree to assume all the risks associated with my access and use of the
                      interface, and waive any liability, claims, causes of action, or damages arising from the usage of
                      this interface.
                    </p>
                    <p className="mb-2 text-sm text-gray-500 dark:text-[#cecece]">
                      {' '}
                      - By using this interface, I represent and warrant that I understand that there are inherent risks
                      associated with virtual currency, and the underlying technologies including, without limitation,
                      cryptography and blockchains, and I agree that Morphex is not responsible for any potential losses
                      or damages associated with these risks.
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-[#0029FF] px-4 py-2 text-sm font-medium text-white hover:bg-[#2f51fb] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={handleAgreeWithDisclaimer}
                    >
                      Confirm and proceed
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
