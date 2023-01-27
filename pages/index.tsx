import type { NextPage } from 'next';
import * as React from 'react';
import Layout from '~/components/Layout';
import VestingSection from '~/components/Vesting';
import BondingSection from '~/components/Bonding';

const Home: NextPage = () => {
  return (
    <div className="mx-auto my-0 w-full max-w-[1280px] px-4 sm:px-6">
      <Layout className="flex flex-col gap-12">
        <BondingSection />
        <VestingSection />
      </Layout>
    </div>
  );
};

export default Home;
