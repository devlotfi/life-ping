import { StyleSheet, View, ViewProps } from "react-native";
import { useTheme } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

export default function CircleButton({ children, style, ...props }: ViewProps) {
  const theme = useTheme();

  return (
    <View
      style={{
        padding: 10,
        borderColor: theme.colors.primary,
        borderWidth: 2,
        borderRadius: 1000,
        ...StyleSheet.flatten(style),
      }}
      {...props}
    >
      <LinearGradient
        colors={[theme.colors.surface, theme.colors.background]}
        style={{
          padding: 5,
          borderRadius: 1000,
        }}
      >
        <LinearGradient
          colors={[theme.colors.background, theme.colors.surface]}
          style={{
            height: 150,
            width: 150,
            padding: 10,
            borderRadius: 1000,
            justifyContent: "center",
            alignItems: "center",
            gap: 5,
          }}
        >
          {children}
        </LinearGradient>
      </LinearGradient>
    </View>
  );
}
