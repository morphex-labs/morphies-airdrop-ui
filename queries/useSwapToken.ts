import { ethers, Signer } from 'ethers';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import type { ITransactionError, ITransactionSuccess } from '~/types';
import { useSigner } from 'wagmi';
import { bonderABI } from '~/lib/abis/bonder';

interface IUseSwapToken {
  contractAddress: string;
}

interface ISwapToken extends IUseSwapToken {
  signer?: Signer;
}

const swap = async ({ signer, contractAddress }: ISwapToken) => {
  try {
    if (!signer) {
      throw new Error("Couldn't get signer");
    } else {
      const contract = new ethers.Contract(contractAddress, bonderABI, signer);
      return await contract.claim();
    }
  } catch (error: any) {
    throw new Error(error.message || (error?.reason ?? "Couldn't claim oBMX"));
  }
};

export default function useSwapToken() {
  const [{ data: signer }] = useSigner();
  const queryClient = useQueryClient();

  return useMutation<ITransactionSuccess, ITransactionError, IUseSwapToken, unknown>(
    ({ contractAddress }: IUseSwapToken) => swap({ signer, contractAddress }),
    {
      onError: () => {
        toast.error("Couldn't claim. Check if your address is correct or if you already claimed.");
      },
      onSuccess: (data) => {
        const toastId = toast.loading('Confirming claim');
        data.wait().then((res) => {
          toast.dismiss(toastId);

          queryClient.invalidateQueries();

          if (res.status === 1) {
            toast.success('Claimed!');
          } else {
            toast.error('Could not claim!');
          }
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries();
      },
    }
  );
}
