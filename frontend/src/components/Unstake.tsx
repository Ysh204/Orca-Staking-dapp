import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import {
    useWriteContract,
    useWaitForTransactionReceipt,
    useAccount,
    useChainId,
} from 'wagmi';
import { parseEther } from 'viem';
import StakingABI from '../abis/StakingContract.json';
import { STAKING_CONTRACT_ADDRESS } from '../constants';

export function Unstake() {
    const [amount, setAmount] = useState('');
    const [error, setError] = useState<string | null>(null);

    const { isConnected } = useAccount();
    const chainId = useChainId();

    const {
        writeContract,
        data: hash,
        isPending,
        error: writeError,
    } = useWriteContract();

    const {
        isLoading: isConfirming,
        isSuccess,
    } = useWaitForTransactionReceipt({
        hash,
    });

    useEffect(() => {
        if (isSuccess) {
            setAmount('');
        }
    }, [isSuccess]);

    useEffect(() => {
        if (writeError) {
            setError(writeError.message);
        }
    }, [writeError]);

    const handleUnstake = (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!isConnected) {
            setError('Please connect your wallet.');
            return;
        }

        if (!amount || Number(amount) <= 0) {
            setError('Enter a valid amount greater than 0.');
            return;
        }

        try {
            const parsedAmount = parseEther(amount);

            writeContract({
                address: STAKING_CONTRACT_ADDRESS,
                abi: StakingABI,
                functionName: 'unstake',
                args: [parsedAmount],
            });
        } catch (err) {
            setError('Invalid amount format.');
        }
    };

    // Explorer URL by network
    const getExplorerUrl = () => {
        switch (chainId) {
            case 1:
                return 'https://etherscan.io';
            case 11155111:
                return 'https://sepolia.etherscan.io';
            case 5:
                return 'https://goerli.etherscan.io';
            default:
                return 'https://etherscan.io';
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
                Unstake ETH
            </h2>

            <form onSubmit={handleUnstake} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount (ETH)
                    </label>
                    <input
                        type="number"
                        step="0.000000000000000001"
                        min="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="0.0"
                        required
                    />
                </div>

                {/* Error */}
                {error && (
                    <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                        {error}
                    </div>
                )}

                {/* Success */}
                {isSuccess && (
                    <div className="text-green-600 text-sm bg-green-50 p-2 rounded">
                        Successfully unstaked!
                    </div>
                )}

                <button
                    type="submit"
                    disabled={!isConnected || isPending || isConfirming}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending
                        ? 'Waiting for Wallet...'
                        : isConfirming
                            ? 'Waiting for Confirmation...'
                            : 'Unstake'}
                </button>

                {/* Transaction Link */}
                {hash && (
                    <div className="mt-2 text-xs text-gray-500">
                        Tx:{' '}
                        <a
                            href={`${getExplorerUrl()}/tx/${hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline break-all"
                        >
                            {hash}
                        </a>
                    </div>
                )}
            </form>
        </div>
    );
}
