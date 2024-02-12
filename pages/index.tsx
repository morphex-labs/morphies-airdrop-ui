import type { NextPage } from 'next';
import Layout from '../components/Layout';
import AirdropClaim from '../components/Airdrop';

const Home: NextPage = () => {
  return (
    <div className="mx-auto my-0 w-full max-w-[1280px] px-4 sm:px-6">
      <Layout className="flex flex-col gap-12">
        <div className="mb -mb-8 flex items-center justify-center">
          <p className="mr-2 text-xl">Morphies: Claim oBMX</p>
        </div>
        <div className="mb -mb-8 flex items-center justify-center">
          <p className="text-m mr-2">Make sure you are connected to Base mainnet!</p>
        </div>
        <AirdropClaim />
      </Layout>
    </div>
  );
};

export default Home;
