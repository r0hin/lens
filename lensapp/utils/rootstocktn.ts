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
    default: {http: ['https://rpc.testnet.rootstock.io/jj9L9SfWFinW5YZknxsFuPak8fMyTo-T']},
    public: {http: ['https://rpc.testnet.rootstock.io/jj9L9SfWFinW5YZknxsFuPak8fMyTo-T']},
  },
  blockExplorers: {
    default: {
      name: 'RSK Explorer',
      url: 'https://explorer.testnet.rootstock.io',
    },
  },
});