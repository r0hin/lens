import React from 'react';

import '@walletconnect/react-native-compat'
import { WagmiConfig } from 'wagmi'
import { rootstock } from 'viem/chains'
import { createWeb3Modal, defaultWagmiConfig, Web3Modal } from '@web3modal/wagmi-react-native'
import {
  AnimatedTabBarNavigator,
  DotSize, // optional
  TabElementDisplayOptions, // optional
  TabButtonLayout, // optional
  IAppearanceOptions // optional
} from 'react-native-animated-nav-tab-bar'
import {Appearance} from 'react-native';
import { StatusBar } from 'react-native';
import { HomeScreen } from './screens/Home';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TestScreen } from './screens/Test';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from './screens/Login';
import { LoadingScreen } from './screens/LoadingScreen';
import Icon from "react-native-vector-icons/Feather"
import { SettingsScreen } from './screens/SettingsScreen';
import { CardsScreen } from './screens/CardsScreen';
import { VendorScreen } from './screens/VendorScreen';
import { OnboardScreen } from './screens/OnboardScreen';
import { AuthenticateScreen } from './screens/Authenticate';
const queryClient = new QueryClient()


function App(): React.JSX.Element {
  const chains = [rootstock]
  const metadata = {
    name: 'Project Lens',
    description: 'A better way to prove trust',
    url: 'https://projectlens.xyz',
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
    redirect: {
      native: 'projectlens://',
    }
  }

  const Stack = createStackNavigator();
  const projectId = '15db3eb2d5b1b8cd7ea8dc71d0459862';
  const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

  createWeb3Modal({
    projectId,
    chains,
    wagmiConfig,
    themeMode: "dark",
    themeVariables: {
      accent: "#5371FF",
    },
    enableAnalytics: true // Optional - defaults to your Cloud configuration
  });

  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}> 
        <StatusBar barStyle={'light-content'} />
        <NavigationContainer>
          
          <Stack.Navigator initialRouteName='Loading' screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Loading" component={LoadingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Main" component={TabsComponent} />
            <Stack.Screen name="Onboard" component={OnboardScreen} />
            <Stack.Screen name="Authenticate" component={AuthenticateScreen} />
            <Stack.Screen name="Vendor" component={VendorTabsComponent} />
          </Stack.Navigator>
        </NavigationContainer>
        <Web3Modal />
      </QueryClientProvider>
    </WagmiConfig>
  );
}

function VendorTabsComponent() {
  const Tabs = AnimatedTabBarNavigator();

  return (
    <Tabs.Navigator tabBarOptions={{
      activeTintColor: 'white',
      inactiveTintColor: 'grey',
      activeBackgroundColor: 'black',
      tabStyle: {
        backgroundColor: '#121315',
      }
    }} appearance={{
      whenInactiveShow: TabElementDisplayOptions.ICON_ONLY,
      whenActiveShow: TabElementDisplayOptions.ICON_ONLY,
      shadow: true,
      floating: true,
    }}>
      <Tabs.Screen name="Home" component={VendorScreen} options={{ tabBarIcon: ({ }) => ( <Icon name="home" size={17} color={"white"}/> ) }} />
      {/* <Tabs.Screen name="Cards" component={CardsScreen} options={{ tabBarIcon: ({ }) => ( <Icon name="credit-card" size={17} color={"white"}/> ) }} /> */}
      <Tabs.Screen name="Settings" component={SettingsScreen} options={{ tabBarIcon: ({ }) => ( <Icon name="user" size={17} color={"white"}/> ) }} />
    </Tabs.Navigator>
  );
}

function TabsComponent() {
  const Tabs = AnimatedTabBarNavigator();

  return (
    <Tabs.Navigator tabBarOptions={{
      activeTintColor: 'white',
      inactiveTintColor: 'grey',
      activeBackgroundColor: 'black',
      tabStyle: {
        backgroundColor: '#121315',
      }
    }} appearance={{
      whenInactiveShow: TabElementDisplayOptions.ICON_ONLY,
      whenActiveShow: TabElementDisplayOptions.ICON_ONLY,
      shadow: true,
      floating: true,
    }}>
      <Tabs.Screen name="Credit" component={HomeScreen} options={{ tabBarIcon: ({ }) => ( <Icon name="home" size={17} color={"white"}/> ) }} />
      {/* <Tabs.Screen name="Cards" component={CardsScreen} options={{ tabBarIcon: ({ }) => ( <Icon name="credit-card" size={17} color={"white"}/> ) }} /> */}
      <Tabs.Screen name="Settings" component={SettingsScreen} options={{ tabBarIcon: ({ }) => ( <Icon name="user" size={17} color={"white"}/> ) }} />
    </Tabs.Navigator>
  );
}

export default App;
