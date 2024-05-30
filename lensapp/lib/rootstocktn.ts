import {defineChain} from 'viem';

export const rootstockTestnet = defineChain({
  id: 31,
  name: 'Rootstock Testnet',
  network: 'rootstock',
  nativeCurrency: {
    decimals: 18,
    name: 'Rootstock Bitcoin',
    symbol: 'tRBTC',
  },
  rpcUrls: {
    default: {http: ['https://public-node.testnet.rsk.co']},
    public: {http: ['https://public-node.testnet.rsk.co']},
  },
  blockExplorers: {
    default: {
      name: 'RSK Explorer',
      url: 'https://explorer.testnet.rootstock.io',
    },
  },
});
