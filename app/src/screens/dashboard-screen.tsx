import { StyleSheet, View, ViewProps } from "react-native";
import Text from "../components/text";
import { PropsWithChildren } from "react";
import { useTheme } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMountain, faUserClock } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

function GradientCard({ children }: PropsWithChildren) {
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

function CircleButton({ children, style, ...props }: ViewProps) {
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

export default function DashboardScreen() {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <View style={{ paddingHorizontal: 12, paddingVertical: 40, flex: 1 }}>
      <GradientCard>
        <Text>lol</Text>
        <Text>lol</Text>
      </GradientCard>

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <CircleButton>
          <FontAwesomeIcon
            icon={faUserClock}
            size={35}
            color={theme.colors.primary}
            style={{ opacity: 0.8 }}
          ></FontAwesomeIcon>
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>Ping</Text>
        </CircleButton>
      </View>
    </View>
  );
}
