import "./i18n";
import { StatusBar } from "expo-status-bar";
import { useContext, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { KeyboardAvoidingView, useColorScheme, View } from "react-native";
import { darkTheme, lightTheme } from "./types/themes";
import { BottomNavigation, PaperProvider, useTheme } from "react-native-paper";
import AssetsProvider from "./provider/assets-provider";
import { KeyboardProvider } from "./provider/keyboard-provider";
import * as SystemUI from "expo-system-ui";
import { CommonActions, NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BottomTabsParamList } from "./types/navigation-types";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faGauge, faGear, faUserPen } from "@fortawesome/free-solid-svg-icons";
import DashboardScreen from "./screens/dashboard-screen";
import SettingsScreen from "./screens/settings-screen";
import TitleBar from "./components/title-bar";
import { useTranslation } from "react-i18next";
import { KeyboardContext } from "./context/keyboard-context";
import Toast from "react-native-toast-message";
import { toastConfig } from "./toast-config";
import ContentGradient from "./layout/content-gradient";
import SettingsProvider from "./provider/settings-provider";
import InformationScreen from "./screens/information-screen";
import * as Notifications from "expo-notifications";
import NotificationsProvider from "./provider/notifications-provider";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: false,
  }),
});
/* Notifications.requestPermissionsAsync();

Notifications.scheduleNotificationAsync({
  content: {
    title: "Look at that notification",
    body: "I'm so proud of myself!",
  },
  trigger: {
    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    seconds: 120,
    repeats: true,
  },
}); */

const BottomTabs = createBottomTabNavigator<BottomTabsParamList>();

function BottomTabsComponent() {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <BottomTabs.Navigator
        screenOptions={{
          animation: "shift",
          sceneStyle: {
            backgroundColor: theme.colors.background,
          },
          header: () => {
            return <TitleBar></TitleBar>;
          },
        }}
        tabBar={({ navigation, state, descriptors, insets }) => (
          <BottomNavigation.Bar
            style={{
              backgroundColor: theme.colors.surface,
            }}
            activeIndicatorStyle={{
              backgroundColor: theme.colors.primary,
            }}
            navigationState={state}
            safeAreaInsets={insets}
            onTabPress={({ route, preventDefault }) => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (event.defaultPrevented) {
                preventDefault();
              } else {
                navigation.dispatch({
                  ...CommonActions.navigate(route.name, route.params),
                  target: state.key,
                });
              }
            }}
            renderIcon={({ route, focused }) => {
              const { options } = descriptors[route.key];
              if (options.tabBarIcon) {
                return options.tabBarIcon({
                  focused,
                  color: focused ? "#ffffff" : theme.colors.onBackground,
                  size: 22,
                });
              }

              return null;
            }}
            getLabelText={({ route }) => {
              const { options } = descriptors[route.key];
              return options.tabBarLabel as string;
            }}
          />
        )}
      >
        <BottomTabs.Screen
          name="Dashboard"
          component={DashboardScreen}
          layout={({ children }) => (
            <ContentGradient>{children}</ContentGradient>
          )}
          options={{
            tabBarLabel: t("dashboard"),
            tabBarIcon: ({ color, size }) => {
              return (
                <FontAwesomeIcon icon={faGauge} size={size} color={color} />
              );
            },
          }}
        />
        <BottomTabs.Screen
          name="Information"
          component={InformationScreen}
          layout={({ children }) => (
            <ContentGradient>{children}</ContentGradient>
          )}
          options={{
            tabBarLabel: t("information"),
            tabBarIcon: ({ color, size }) => {
              return (
                <FontAwesomeIcon icon={faUserPen} size={size} color={color} />
              );
            },
          }}
        />
        <BottomTabs.Screen
          name="Settings"
          component={SettingsScreen}
          layout={({ children }) => (
            <ContentGradient>{children}</ContentGradient>
          )}
          options={{
            tabBarLabel: t("settings"),
            tabBarIcon: ({ color, size }) => {
              return (
                <FontAwesomeIcon icon={faGear} size={size} color={color} />
              );
            },
          }}
        />
      </BottomTabs.Navigator>
    </View>
  );
}

function App() {
  const theme = useTheme();
  const { isKeyboardVisible } = useContext(KeyboardContext);

  useEffect(() => {
    (async () => {
      await SystemUI.setBackgroundColorAsync(theme.colors.background);
    })();
  }, [theme]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="height"
      enabled={isKeyboardVisible}
    >
      <NavigationContainer>
        <BottomTabsComponent></BottomTabsComponent>
      </NavigationContainer>
    </KeyboardAvoidingView>
  );
}

const queryClient = new QueryClient();

export default function Providers() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={colorScheme === "light" ? lightTheme : darkTheme}>
        <AssetsProvider>
          <KeyboardProvider>
            <SettingsProvider>
              <NotificationsProvider>
                <App></App>
                <StatusBar
                  translucent={true}
                  style={colorScheme === "light" ? "dark" : "light"}
                ></StatusBar>
              </NotificationsProvider>
            </SettingsProvider>
          </KeyboardProvider>
        </AssetsProvider>
        <Toast config={toastConfig}></Toast>
      </PaperProvider>
    </QueryClientProvider>
  );
}
