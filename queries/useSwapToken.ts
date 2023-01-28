import { ethers, Signer } from 'ethers';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import type { ITransactionError, ITransactionSuccess } from '~/types';
import { useSigner } from 'wagmi';
import { bonderABI } from '~/lib/abis/bonder';

interface IUseSwapToken {
  contractAddress: string;
  amountToDeposit: string;
}

interface ISwapToken extends IUseSwapToken {
  signer?: Signer;
}

const swap = async ({ signer, contractAddress, amountToDeposit }: ISwapToken) => {
  try {
    if (!signer) {
      throw new Error("Couldn't get signer");
    } else {
      const contract = new ethers.Contract(contractAddress, bonderABI, signer);
      return await contract.bond(amountToDeposit);
    }
  } catch (error: any) {
    throw new Error(error.message || (error?.reason ?? "Couldn't bond token"));
  }
};

export default function useSwapToken() {
  const [{ data: signer }] = useSigner();
  const queryClient = useQueryClient();

  return useMutation<ITransactionSuccess, ITransactionError, IUseSwapToken, unknown>(
    ({ contractAddress, amountToDeposit }: IUseSwapToken) => swap({ signer, contractAddress, amountToDeposit }),
    {
      onError: () => {
        toast.error("Couldn't bond token. Check if your input fits within the bonding caps.");
      },
      onSuccess: (data) => {
        const toastId = toast.loading('Confirming bond');
        data.wait().then((res) => {
          toast.dismiss(toastId);

          queryClient.invalidateQueries();

          if (res.status === 1) {
            toast.success('Bond success!');
          } else {
            toast.error('Bond failed!');
          }
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries();
      },
    }
  );
}
