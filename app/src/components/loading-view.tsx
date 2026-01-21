import { View } from "react-native";
import { ActivityIndicator, useTheme } from "react-native-paper";

export default function LoadingView() {
  const theme = useTheme();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.surface,
      }}
    >
      <ActivityIndicator animating size="large"></ActivityIndicator>
    </View>
  );
}
