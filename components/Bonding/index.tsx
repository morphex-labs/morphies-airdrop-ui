import React, { useState } from 'react';
import { InputAmountWithMaxButton, SubmitButton } from '../Form';

export default function BondingSection() {
  return (
    <section className="-mt-2 w-full">
      <div className="section-header flex w-full flex-wrap items-center justify-between">
        <h1 className="font-exo">Bonding</h1>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <UsdcCard />
        <FtmCard />
      </div>
    </section>
  );
}

const UsdcCard = () => {
  const [ftmAmount, setFtmAmount] = useState('');
  const [isApproved, setIsApproved] = useState(false);

  const handleFillMaxAmount = () => {};

  const handleApprove = () => {
    setIsApproved(!isApproved);
  };

  return (
    <div className="flex flex-col rounded-lg bg-[#fffffe] p-4 shadow-xl dark:bg-[#334155]">
      <h3 className="text-lg">Bond USDC</h3>
      <p className="mt-2 mb-4 text-[#b5b5b5] dark:text-[#b5bac1]">Balance: 42.32</p>
      <InputAmountWithMaxButton
        handleInputChange={(e) => setFtmAmount(e.target.value)}
        inputAmount={ftmAmount}
        id="usdc-id"
        selectedToken={null}
        fillMaxAmountOnClick={handleFillMaxAmount}
      />
      <SubmitButton className="mt-4" onClick={handleApprove}>
        {isApproved ? 'Swap' : 'Approve'}
      </SubmitButton>
    </div>
  );
};

const FtmCard = () => {
  const [usdcAmount, setUsdcAmount] = useState('');
  const [isApproved, setIsApproved] = useState(false);

  const handleFillMaxAmount = () => {};

  const handleApprove = () => {
    setIsApproved(!isApproved);
  };

  return (
    <div className="flex flex-col rounded-lg bg-[#fffffe] p-4 shadow-xl dark:bg-[#334155]">
      <h3 className="text-lg">Bond USDC</h3>
      <p className="mt-2 mb-4 text-[#b5b5b5] dark:text-[#b5bac1]">Balance: 42.32</p>
      <InputAmountWithMaxButton
        handleInputChange={(e) => setUsdcAmount(e.target.value)}
        inputAmount={usdcAmount}
        id="usdc-id"
        selectedToken={null}
        fillMaxAmountOnClick={handleFillMaxAmount}
      />
      <SubmitButton className="mt-4" onClick={handleApprove}>
        {isApproved ? 'Swap' : 'Approve'}
      </SubmitButton>
    </div>
  );
};
