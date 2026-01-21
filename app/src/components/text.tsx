import { StyleSheet } from "react-native";
import { Text as RNPaperText, TextProps, useTheme } from "react-native-paper";

export default function Text({ style, children, ...props }: TextProps<any>) {
  const theme = useTheme();

  return (
    <RNPaperText
      style={{
        fontFamily: "Rubik",
        color: theme.colors.onBackground,
        ...StyleSheet.flatten(style),
      }}
      {...props}
    >
      {children}
    </RNPaperText>
  );
}
