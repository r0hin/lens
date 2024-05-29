import React from 'react';

import '@walletconnect/react-native-compat'
import { WagmiConfig } from 'wagmi'
import { mainnet, polygon, arbitrum } from 'viem/chains'
import { createWeb3Modal, defaultWagmiConfig, Web3Modal } from '@web3modal/wagmi-react-native'
import { AnimatedTabBarNavigator } from 'react-native-animated-nav-tab-bar'

import { StatusBar } from 'react-native';
import { HomeScreen } from './screens/Home';
import { NavigationContainer } from '@react-navigation/native';
import { TestScreen } from './screens/Test';

function App(): React.JSX.Element {
  const chains = [mainnet, polygon, arbitrum]
  const metadata = {
    name: 'Project Lens',
    description: 'A better way to prove trust',
    url: 'https://projectlens.xyz',
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
    redirect: {
      native: 'projectlens://',
    }
  }

  const Tabs = AnimatedTabBarNavigator();
  const projectId = '15db3eb2d5b1b8cd7ea8dc71d0459862'
  const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

  createWeb3Modal({
    projectId,
    chains,
    wagmiConfig,
    enableAnalytics: true // Optional - defaults to your Cloud configuration
  });

  return (
    <WagmiConfig config={wagmiConfig}>
      <StatusBar barStyle={'light-content'} />
      <NavigationContainer>

        <Tabs.Navigator appearance={{}}>
          <Tabs.Screen name="Home" component={HomeScreen} />
          <Tabs.Screen name="Settings" component={TestScreen} />
        </Tabs.Navigator>
      </NavigationContainer>
      <Web3Modal />
    </WagmiConfig>
  );
}

export default App;
