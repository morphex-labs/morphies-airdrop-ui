import * as React from 'react';
import { XMarkIcon as XIcon } from '@heroicons/react/24/solid';
import { DisclosureState } from 'ariakit';
import { Dialog, DialogDismiss, DialogHeading } from 'ariakit/dialog';
import classNames from 'classnames';
import { useChainExplorer } from '~/hooks';

interface FormDialogProps {
  dialog: DisclosureState;
  transactionHash: string;
  className?: string;
}

export const TransactionDialog = ({ dialog, className, transactionHash }: FormDialogProps) => {
  const { url, id } = useChainExplorer();

  return (
    <Dialog state={dialog} className={classNames('dialog', className)}>
      <header className="font-exo relative">
        <DialogDismiss className="ml-auto flex items-start justify-end">
          <span className="sr-only">Close</span>
          <XIcon className="h-6 w-6" />
        </DialogDismiss>
      </header>
      <div className="my-10 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="80"
          height="80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className=""
        >
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="16 12 12 8 8 12"></polyline>
          <line x1="12" y1="16" x2="12" y2="8"></line>
        </svg>
      </div>
      <h1 className="text-center">Transaction Submitted</h1>
      <a
        className="mt-1 mb-8 text-center text-sm text-green-500"
        href={url ? (id === 82 || id === 1088 ? `${url}tx/${transactionHash}` : `${url}/tx/${transactionHash}`) : '/'}
        target="_blank"
        rel="noopener noreferrer"
      >
        View on FTMScan
      </a>
      <button className="form-submit-button" onClick={dialog.toggle}>
        Close
      </button>
    </Dialog>
  );
};

interface ChartFormDialogProps {
  dialog: DisclosureState;
  title: string | React.ReactNode | null;
  children: React.ReactNode;
  className?: string;
}

export const FormDialog = ({ dialog, title, className, children }: ChartFormDialogProps) => {
  return (
    <Dialog state={dialog} className={classNames('dialog', className)}>
      <header className="font-exo relative flex items-center justify-between text-lg font-medium">
        <DialogHeading>{title}</DialogHeading>
        <DialogDismiss className="flex items-start justify-end">
          <span className="sr-only">Close</span>
          <XIcon className="h-6 w-6" />
        </DialogDismiss>
      </header>
      <div className="mt-4">{children}</div>
    </Dialog>
  );
};
