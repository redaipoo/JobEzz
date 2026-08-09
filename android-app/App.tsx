/**
 * JobEzz — App entry v3
 * Premium single-tab-bar navigation with deep navy identity.
 * No duplicate bottom navs — every screen now flows through this one navigator.
 */
import 'react-native-gesture-handler';
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, Text, I18nManager, ActivityIndicator } from 'react-native';

import { AppProvider, useAppStore } from './src/store';
import { ErrorBoundary } from './src/ErrorBoundary';
import { palette, sp } from './src/design';
import { BottomTabBar, ToastProvider } from './src/ui';import { setupNotificationHandler, requestNotificationPermission, getPushToken, onNotificationTap, notificationsAvailable } from './src/notifications';
import type { NavigationContainerRef } from '@react-navigation/native';
import { linking } from './src/navigation';
import { useAppFonts } from './src/fonts';
import { SplashScreen } from './src/screens/SplashScreen';
import type { RootStackParamList, MainTabParamList } from './src/types';

/* Screens */
import { Courses, CourseDetail } from './src/screens/academy';
import { ChatList, Chat, Notifs } from './src/screens/comms';
import { ProviderDashboard } from './src/screens/provider';
import { Home } from './src/screens/home';
import { Profile, Wallet, Settings } from './src/screens/account';
import {
  ServicesHome, TechnicianList, TechnicianProfile, Booking,
  ServiceRequest, ServiceMatch, ServiceTrack, ServiceRate,
} from './src/screens/services';
import { CourseLearn, CourseQuiz, Certificate, InstructorDashboard } from './src/screens/academy';
import { Reviews, Report, Checkout, Invoice } from './src/screens/trust';
import { ProviderIncoming, ProviderActive } from './src/screens/provider';
import { Admin } from './src/screens/admin';
import { Legal } from './src/screens/legal';
import {
  Jobs, JobDetail, JobApply, EmployerJobs, EmployerPost, EmployerApplicants,
  CompanyProfile, Applications, SavedJobs,
} from './src/screens/jobs';
import { Onboarding, RoleSelect, Auth, Otp } from './src/screens/onboarding';

/* ── Accessibility: cap the runaway text-zoom that breaks fixed layouts while
 * still letting users enlarge text. Native default lets fontSize reach ~3×;
 * 1.5× keeps every fixed card/row intact under TalkBack's large-font setting. ── */
(Text as any).defaultProps = {
  ...((Text as any).defaultProps || {}),
  maxFontSizeMultiplier: 1.5,
};

/* JobEzz is an Arabic-first product — always render right-to-left,
   regardless of the device locale. Must run before first render. */
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

/* ─────────────────────────────────────────────
 * Tab bar config — routed through shared BottomTabBar
 * ───────────────────────────────────────────── */

const TABS = [
  { name: 'Home', title: 'الرئيسية', icon: 'home' },
  { name: 'Jobs', title: 'وظائف', icon: 'jobs' },
  { name: 'Services', title: 'خدمات', icon: 'services' },
  { name: 'Courses', title: 'دورات', icon: 'courses' },
  { name: 'Profile', title: 'حسابي', icon: 'profile' },
];

function TabBar({ state, descriptors, navigation }: any) {
  return <BottomTabBar items={TABS} state={state} navigation={navigation} />;
}

/* Main Tab Navigator — uses the shared BottomTabBar */

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomTabBar items={TABS} state={props.state} navigation={props.navigation} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Jobs" component={Jobs} />
      <Tab.Screen name="Services" component={ServicesHome} />
      <Tab.Screen name="Courses" component={Courses} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

/* ─────────────────────────────────────────────
 * Root Stack Navigator — premium transitions
 * ───────────────────────────────────────────── */

function RootStack({ initialRouteName = 'Onboarding' as any }: { initialRouteName?: any }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyle: { backgroundColor: palette.bg1 },
        cardShadowEnabled: true,
        cardOverlayEnabled: true,
      }}
      initialRouteName={initialRouteName}
    >
      {/* entry / auth */}
      <Stack.Screen name="Onboarding" component={Onboarding} options={{ animationEnabled: false }} />
      <Stack.Screen name="RoleSelect" component={RoleSelect} options={{ animationEnabled: false }} />
      <Stack.Screen name="Auth" component={Auth} options={{ animationEnabled: false }} />
      <Stack.Screen name="Otp" component={Otp} options={{ animationEnabled: false }} />

      {/* main tabs */}
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ animationEnabled: false }} />

      {/* services flow */}
      <Stack.Screen name="ServiceRequest" component={ServiceRequest} />
      <Stack.Screen name="ServiceMatch" component={ServiceMatch} />
      <Stack.Screen name="ServiceTrack" component={ServiceTrack} />
      <Stack.Screen name="ServiceRate" component={ServiceRate} />
      {/* premium services flow (v3) */}
      <Stack.Screen name="TechnicianList" component={TechnicianList} />
      <Stack.Screen name="TechnicianProfile" component={TechnicianProfile} />
      <Stack.Screen name="Booking" component={Booking} />

      {/* jobs */}
      <Stack.Screen name="JobDetail" component={JobDetail} />
      <Stack.Screen name="JobApply" component={JobApply} />
      <Stack.Screen name="EmployerJobs" component={EmployerJobs} />
      <Stack.Screen name="EmployerPost" component={EmployerPost} />
      <Stack.Screen name="EmployerApplicants" component={EmployerApplicants} />
      <Stack.Screen name="CompanyProfile" component={CompanyProfile} />
      <Stack.Screen name="Applications" component={Applications} />
      <Stack.Screen name="SavedJobs" component={SavedJobs} />

      {/* academy */}
      <Stack.Screen name="CourseDetail" component={CourseDetail} />
      <Stack.Screen name="CourseLearn" component={CourseLearn} />
      <Stack.Screen name="CourseQuiz" component={CourseQuiz} />
      <Stack.Screen name="Certificate" component={Certificate} />
      <Stack.Screen name="InstructorDashboard" component={InstructorDashboard} />

      {/* trust / payments */}
      <Stack.Screen name="Reviews" component={Reviews} />
      <Stack.Screen name="Report" component={Report} />
      <Stack.Screen name="Checkout" component={Checkout} />
      <Stack.Screen name="Invoice" component={Invoice} />

      {/* provider */}
      <Stack.Screen name="ProviderDashboard" component={ProviderDashboard} />
      <Stack.Screen name="ProviderIncoming" component={ProviderIncoming} />
      <Stack.Screen name="ProviderActive" component={ProviderActive} />

      {/* chat / notifs / account */}
      <Stack.Screen name="ChatList" component={ChatList} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="Notifs" component={Notifs} />
      <Stack.Screen name="Wallet" component={Wallet} />
      <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="Admin" component={Admin} />
          <Stack.Screen name="Legal" component={Legal} />
    </Stack.Navigator>
  );
}

/* ─────────────────────────────────────────────
 * Auth loading gate — brief dark screen while hydrateAuth resolves,
 * prevents a flash of the wrong route on cold start.
 * ───────────────────────────────────────────── */

function AuthLoadingScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: palette.bg1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color={palette.accent} size="large" />
      <Text style={{ color: palette.textMid, marginTop: 12, fontFamily: 'Tajawal_500Medium', fontSize: 14 }}>
        جارٍ تحميل حسابك...
      </Text>
    </View>
  );
}

/* ─────────────────────────────────────────────
 * Navigation theme (deep navy identity)
 * ───────────────────────────────────────────── */

function useNavTheme() {
  return useMemo(
    () => ({
      ...DarkTheme,
      colors: {
        ...DarkTheme.colors,
        primary: palette.accent,
        background: palette.bg1,
        card: palette.bg2,
        text: palette.text,
        border: palette.border,
        notification: palette.accent,
      },
    }),
    [],
  );
}

/* ─────────────────────────────────────────────
 * App Root
 * ───────────────────────────────────────────── */

function AppInner() {
  const navTheme = useNavTheme();
  const [splashDone, setSplashDone] = useState(false);
  const [fontsReady] = useAppFonts();
  const splashVisible = !splashDone && fontsReady;
  const navRef = useRef<NavigationContainerRef<RootStackParamList>>(null);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const authReady = useAppStore((s) => s.authReady);
  const hydrateAuth = useAppStore((s) => s.hydrateAuth);

  useEffect(() => {
    void hydrateAuth();
  }, [hydrateAuth]);

  // اجعل RootStack يبدأ عند Auth (محمي) إذا لم يسجّل الدخول بعد
  const initialRoute = useMemo(() => {
    if (!authReady) return null;            // مؤشر تحميل — لن نحدد بعد
    return isAuthenticated ? undefined : 'Auth';
  }, [authReady, isAuthenticated]);

  useEffect(() => {
    setupNotificationHandler();
    if (!notificationsAvailable()) return;
    const ask = setTimeout(() => {
      requestNotificationPermission().then((granted) => {
        if (granted) getPushToken(); /* scaffold — wire to backend when live */
      });
    }, 2000);
    const unsubNotif = onNotificationTap((data) => {
      const nav = navRef.current;
      if (!nav?.isReady()) return;
      const screen = data?.screen;
      if (screen === 'notifications') (nav as any).navigate('Notifs');
      else if (screen === 'job' && data?.id) (nav as any).navigate('JobDetail', { id: String(data.id) });
      else if (screen === 'chat' && data?.id) (nav as any).navigate('Chat', { id: String(data.id) });
    });
    return () => { clearTimeout(ask); unsubNotif(); };
  }, []);

  return (
    <SafeAreaProvider>
      {!fontsReady ? (
        <View style={{ flex: 1, backgroundColor: palette.bg1 }} />
      ) : (
        <>
          <NavigationContainer ref={navRef} theme={navTheme} linking={linking}>
            {initialRoute === null ? (
              <AuthLoadingScreen />
            ) : (
              <RootStack initialRouteName={initialRoute as any} />
            )}
            <StatusBar style="light" />
          </NavigationContainer>
          {splashVisible && <SplashScreen onDone={() => setSplashDone(true)} />}
        </>
      )}
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <AppProvider>
          <ToastProvider>
            <AppInner />
          </ToastProvider>
        </AppProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
