import { createConfig, http } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { getDefaultConfig } from 'connectkit'

const config = createConfig(
    getDefaultConfig({
        chains: [sepolia, mainnet],

        transports: {
            [sepolia.id]: http("https://eth-sepolia.g.alchemy.com/v2/zRUHNgrubdojlMn-uB6-b"),
            [mainnet.id]: http("https://rpc.ankr.com/eth"),
        },

        walletConnectProjectId: "3fcc6bba6f1de962d911bb5b5c3dba68",

        appName: "Orca Staking",
        appDescription: "Stake ETH and earn rewards securely on-chain",
        appUrl: "http://localhost:5173", // change in production
        appIcon: "https://yourdomain.com/logo.png",
    }),
)

export default config
