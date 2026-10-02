import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Home, Globe, Search, Settings } from 'lucide-react-native';

import type { RootStackParamList, MainTabParamList } from './src/navigation/types';
import HomeScreen from './src/screens/HomeScreen';
import GrammarScreen from './src/screens/GrammarScreen';
import KanjiDecksScreen from './src/screens/KanjiDecksScreen';
import KanjiFlashcardScreen from './src/screens/KanjiFlashcardScreen';
import ReadingScreen from './src/screens/ReadingScreen';
import OldVocabScreen from './src/screens/OldVocabScreen';
import KanjiGameScreen from './src/screens/KanjiGameScreen';
import JLPTWebViewScreen from './src/screens/JLPTWebViewScreen';
import AboutScreen from './src/screens/AboutScreen';
import WebsiteScreen from './src/screens/WebsiteScreen';
import BookStorageScreen from './src/screens/BookStorageScreen';
import SearchScreen from './src/screens/SearchScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { colors } from './src/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let icon;
          if (route.name === 'HomeTab') {
            icon = <Home size={size} color={color} />;
          } else if (route.name === 'WebsiteTab') {
            icon = <Globe size={size} color={color} />;
          } else if (route.name === 'SearchTab') {
            icon = <Search size={size} color={color} />;
          } else if (route.name === 'SettingsTab') {
            icon = <Settings size={size} color={color} />;
          }
          return icon;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerStyle: { backgroundColor: colors.card },
        headerTitleStyle: { fontWeight: '700', color: colors.text },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ title: 'Home', headerTitle: 'JLPT Burmese' }}
      />
      <Tab.Screen
        name="WebsiteTab"
        component={WebsiteScreen}
        options={{ title: 'Website', headerTitle: 'JLPTBurmese.com' }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchScreen}
        options={{ title: 'Search', headerTitle: 'Search' }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          initialRouteName="MainTabs"
          screenOptions={{
            headerStyle: { backgroundColor: colors.card },
            headerShadowVisible: true,
            headerTitleStyle: { fontWeight: '700', color: colors.text },
            contentStyle: { backgroundColor: colors.bg },
          }}
        >
          <Stack.Screen
            name="MainTabs"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Grammar" component={GrammarScreen} options={{ title: 'Grammar' }} />
          <Stack.Screen name="KanjiDecks" component={KanjiDecksScreen} options={{ title: 'Kanji decks' }} />
          <Stack.Screen
            name="KanjiFlashcard"
            component={KanjiFlashcardScreen}
            options={({ route }) => ({ title: (route.params as any).title })}
          />
          <Stack.Screen name="Reading" component={ReadingScreen} options={{ title: 'Reading' }} />
          <Stack.Screen name="OldVocab" component={OldVocabScreen} options={{ title: 'Old exam vocab' }} />
          <Stack.Screen name="KanjiGame" component={KanjiGameScreen} options={{ title: 'Kanji game' }} />
          <Stack.Screen name="BookStorage" component={BookStorageScreen} options={{ title: 'Free book' }} />
          <Stack.Screen name="JLPTWebView" component={JLPTWebViewScreen} options={{ title: 'JLPT Mock Exam' }} />
          <Stack.Screen name="About" component={AboutScreen} options={{ title: 'About' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
