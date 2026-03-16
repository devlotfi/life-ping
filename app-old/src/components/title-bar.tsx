import { View } from "react-native";
import { useTheme } from "react-native-paper";
import { Image } from "expo-image";
import { useContext } from "react";
import { AssetsContext } from "../context/assets-context";
import Text from "./text";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TitleBar() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { assets } = useContext(AssetsContext);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.surface,
        paddingVertical: 16,
        paddingHorizontal: 12,
        paddingTop: 16 + insets.top,
        gap: 10,
      }}
    >
      <Image
        source={assets.logo}
        style={{ height: 35, width: 35 }}
        contentFit="contain"
      ></Image>

      <Text
        style={{
          fontSize: 20,
          color: theme.colors.onBackground,
          fontFamily: "Rubik",
          fontWeight: "bold",
        }}
      >
        Life Ping
      </Text>
    </View>
  );
}
