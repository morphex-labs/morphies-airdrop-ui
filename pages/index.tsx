import type { NextPage } from 'next';
import Countdown, { CountdownRenderProps } from 'react-countdown';
import { useEffect, useState } from 'react';

import Layout from '../components/Layout';
import VestingSection from '../components/Vesting';
import BondingSection from '../components/Bonding';
import Disclaimer from '../components/Disclaimer';

const Home: NextPage = () => {
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const checkDisclaimerShown = () => {
    const isDisclaimerShown = localStorage.getItem('x-morphex-bonds-disclaimer-accepted');

    if (isDisclaimerShown) {
      setShowDisclaimer(false);
    } else {
      setShowDisclaimer(true);
    }
  };

  useEffect(() => {
    checkDisclaimerShown();
  }, []);

  const renderer = ({ days, hours, minutes }: CountdownRenderProps) => {
    return (
      <span className="text-xl">
        {days} days {hours} hours {minutes} minutes
      </span>
    );
  };

  return (
    <div className="mx-auto my-0 w-full max-w-[1280px] px-4 sm:px-6">
      <Layout className="flex flex-col gap-12">
        <Disclaimer isOpen={showDisclaimer} setIsOpen={setShowDisclaimer} />
        <div className="flex items-center justify-center">
          <p className="mr-2 text-xl">Ends in</p>
          <Countdown date={new Date('2023-02-05T12:00:00.000Z').getTime()} renderer={renderer} />
        </div>
        <BondingSection />
        <VestingSection />
      </Layout>
    </div>
  );
};

export default Home;
