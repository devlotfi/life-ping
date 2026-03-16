import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";
import { MD3Colors, MD3Theme } from "react-native-paper/lib/typescript/types";

export const lightTheme = {
  ...MD3LightTheme,
  roundness: 2,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#33C89E",
    secondary: "#AD3BEF",
    background: "#EBF0F6",
    onBackground: "#3B5360",
    surface: "#FFFFFF",
    outline: "#bdc9d4ff",
    errorContainer: "#DD2525",
  } as MD3Colors,
} as MD3Theme;

export const darkTheme = {
  ...MD3DarkTheme,
  roundness: 2,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#33C89E",
    secondary: "#AD3BEF",
    background: "#1B283A",
    onBackground: "#DAE6F4",
    surface: "#203147",
    outline: "#435680",
    errorContainer: "#DD2525",
  } as MD3Colors,
} as MD3Theme;
