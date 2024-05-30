import React from 'react';

import '@walletconnect/react-native-compat';
import {WagmiConfig} from 'wagmi';
import {rootstock} from 'viem/chains';
import {rootstockTestnet} from './lib/rootstocktn';
import {
  createWeb3Modal,
  defaultWagmiConfig,
  Web3Modal,
} from '@web3modal/wagmi-react-native';
import {AnimatedTabBarNavigator} from 'react-native-animated-nav-tab-bar';
import {Appearance} from 'react-native';
import {StatusBar} from 'react-native';
import {HomeScreen} from './screens/Home';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {TestScreen} from './screens/Test';
import {createStackNavigator} from '@react-navigation/stack';
import {LoginScreen} from './screens/Login';
import {LoadingScreen} from './screens/LoadingScreen';

const queryClient = new QueryClient();

function App(): React.JSX.Element {
  const chains = [rootstockTestnet];
  const metadata = {
    name: 'Project Lens',
    description: 'A better way to prove trust',
    url: 'https://projectlens.xyz',
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
    redirect: {
      native: 'projectlens://',
    },
  };

  const Stack = createStackNavigator();
  const projectId = '15db3eb2d5b1b8cd7ea8dc71d0459862';
  const wagmiConfig = defaultWagmiConfig({chains, projectId, metadata});

  createWeb3Modal({
    projectId,
    chains,
    wagmiConfig,
    themeMode: 'dark',
    themeVariables: {
      accent: '#5371FF',
    },
    enableAnalytics: true, // Optional - defaults to your Cloud configuration
  });

  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <StatusBar barStyle={'light-content'} />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Loading"
            screenOptions={{headerShown: false}}>
            <Stack.Screen name="Loading" component={LoadingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Main" component={TabsComponent} />
          </Stack.Navigator>
        </NavigationContainer>
        <Web3Modal />
      </QueryClientProvider>
    </WagmiConfig>
  );
}

function TabsComponent() {
  const Tabs = AnimatedTabBarNavigator();

  return (
    <Tabs.Navigator appearance={{}}>
      <Tabs.Screen name="User" component={HomeScreen} />
      <Tabs.Screen name="Vendor" component={TestScreen} />
    </Tabs.Navigator>
  );
}

export default App;
