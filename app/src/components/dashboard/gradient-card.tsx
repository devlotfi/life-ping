import { PropsWithChildren } from "react";
import { useTheme } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

export function GradientCard({ children }: PropsWithChildren) {
  const theme = useTheme();

  return (
    <LinearGradient
      colors={[theme.colors.surface, theme.colors.background]}
      style={{
        padding: 5,
        borderRadius: 17,
      }}
    >
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surface]}
        style={{
          paddingHorizontal: 10,
          paddingVertical: 7,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        {children}
      </LinearGradient>
    </LinearGradient>
  );
}
