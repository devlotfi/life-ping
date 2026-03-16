import { PropsWithChildren } from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";

export default function PageLayout({ children }: PropsWithChildren) {
  const theme = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        borderRadius: 30,
        overflow: "hidden",
      }}
    >
      {children}
    </View>
  );
}
