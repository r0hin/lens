import React from 'react';

import '@walletconnect/react-native-compat'
import { WagmiConfig } from 'wagmi'
import { mainnet, polygon, arbitrum } from 'viem/chains'
import { createWeb3Modal, defaultWagmiConfig, W3mButton, Web3Modal } from '@web3modal/wagmi-react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { Home } from "react-feather"
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AnimatedTabBar, {TabsConfig, BubbleTabBarItemConfig} from '@gorhom/animated-tabbar';

const tabs: TabsConfig<BubbleTabBarItemConfig> = {
  Home: {
    labelStyle: {
      color: '#5B37B7',
    },
    icon: {
      component: <Home />,
      activeColor: 'rgba(91,55,183,1)',
      inactiveColor: 'rgba(0,0,0,1)',
    },
    background: {
      activeColor: 'rgba(223,215,243,1)',
      inactiveColor: 'rgba(223,215,243,0)',
    },
  },
  Profile: {
    labelStyle: {
      color: '#1194AA',
    },
    icon: {
      component: <Home />,
      activeColor: 'rgba(17,148,170,1)',
      inactiveColor: 'rgba(0,0,0,1)',
    },
    background: {
      activeColor: 'rgba(207,235,239,1)',
      inactiveColor: 'rgba(207,235,239,0)',
    },
  },
};

const Tab = createBottomTabNavigator();

const projectId = '15db3eb2d5b1b8cd7ea8dc71d0459862'

// 2. Create config
const metadata = {
  name: 'Project Lens',
  description: 'A better way to prove trust',
  url: 'https://projectlens.xyz',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
  redirect: {
    native: 'projectlens://',
  }
}

const chains = [mainnet, polygon, arbitrum]

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

createWeb3Modal({
  projectId,
  chains,
  wagmiConfig,
  enableAnalytics: true // Optional - defaults to your Cloud configuration
})

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';

import {
  Colors,
  Header,
} from 'react-native/Libraries/NewAppScreen';
import { HomeScreen } from './screens/Home';

function App(): React.JSX.Element {
  const backgroundStyle = {
    backgroundColor: "#000000"
  };

  return (
    <WagmiConfig config={wagmiConfig}>
      <SafeAreaView style={backgroundStyle}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar barStyle={'light-content'} backgroundColor={backgroundStyle.backgroundColor} />
            <NavigationContainer>
              <Tab.Navigator
                tabBar={(props: any) => (
                  <AnimatedTabBar tabs={tabs} {...props} />
                )}
              >
                <Tab.Screen
                  name="Home"
                  component={HomeScreen}
                />
                <Tab.Screen
                  name="Profile"
                  component={HomeScreen}
                />
              </Tab.Navigator>
            </NavigationContainer>
          {/* <ScrollView contentInsetAdjustmentBehavior="automatic" style={backgroundStyle}>
              <W3mButton />
          </ScrollView> */}
        </GestureHandlerRootView>
      </SafeAreaView>
      <Web3Modal />
    </WagmiConfig>
  );
}

export default App;
