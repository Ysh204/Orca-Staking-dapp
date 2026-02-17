import { ConnectKitButton } from 'connectkit';
import { useAccount, useChainId } from 'wagmi';
import { Stake } from './components/Stake';
import { Unstake } from './components/Unstake';
import { Info } from './components/Info';
import { STAKING_CONTRACT_ADDRESS } from './constants';

function App() {
  const { isConnected } = useAccount();
  const chainId = useChainId();

  const getNetworkName = () => {
    switch (chainId) {
      case 1:
        return 'Ethereum Mainnet';
      case 11155111:
        return 'Sepolia';
      case 5:
        return 'Goerli';
      default:
        return 'Unknown Network';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col items-center px-4">

      {/* HEADER */}
      <header className="w-full max-w-6xl flex justify-between items-center py-6">
        <div>
          <h1 className="text-3xl font-extrabold text-blue-900">
            🐳 Orca Staking
          </h1>
          <p className="text-sm text-gray-500">
            Stake ETH • Earn Rewards • Secure Smart Contract
          </p>
        </div>
        <ConnectKitButton />
      </header>

      {/* MAIN CONTENT */}
      <main className="w-full max-w-4xl flex flex-col items-center gap-8 mt-6 mb-10">

        {!isConnected ? (
          <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Welcome to Orca Staking
            </h2>
            <p className="text-gray-600">
              Connect your wallet to start staking ETH and earning passive rewards securely on-chain.
            </p>
          </div>
        ) : (
          <>
            {/* Network Info */}
            <div className="text-sm text-gray-600 bg-white px-4 py-2 rounded-lg shadow">
              Connected to: <span className="font-semibold">{getNetworkName()}</span>
            </div>

            <Info />
            <Stake />
            <Unstake />
          </>
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-auto py-6 text-gray-500 text-sm text-center space-y-2">
        <p>
          Staking Contract:
        </p>

        <a
          href={`https://sepolia.etherscan.io/address/${STAKING_CONTRACT_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline break-all"
        >
          {STAKING_CONTRACT_ADDRESS}
        </a>

        <p className="text-xs text-gray-400 mt-2">
          © {new Date().getFullYear()} Orca Staking • Built with Wagmi & ConnectKit
        </p>
      </footer>
    </div>
  );
}

export default App;
