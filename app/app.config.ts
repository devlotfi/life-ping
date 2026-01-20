import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,

  name: "Life Ping",
  slug: "life-ping",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./icons/icon.png",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  splash: {
    image: "./icons/splash-icon-dark.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
    dark: {
      image: "./icons/splash-icon-light.png",
      backgroundColor: "#203147",
    },
  },
  ios: {
    supportsTablet: true,
    icon: {
      light: "./icons/light.png",
      dark: "./icons/dark.png",
      tinted: "./icons/tinted.png",
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./icons/adaptive-icon.png",
      backgroundColor: "#ffffff",
      monochromeImage: "./icons/adaptive-icon-monochrome.png",
    },
    package: "com.anonymous.lifeping",
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  plugins: [
    "expo-dev-client",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#ffffff",
        image: "./icons/splash-icon-dark.png",
        dark: {
          image: "./icons/splash-icon-light.png",
          backgroundColor: "#203147",
        },
        imageWidth: 200,
      },
    ],
    "expo-secure-store",
    "expo-font",
    "expo-asset",
    "expo-localization",
  ],
});
