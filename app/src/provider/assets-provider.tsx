import { PropsWithChildren } from "react";
import { AssetsContext } from "../context/assets-context";
import { useAssets } from "expo-asset";
import { useFonts } from "expo-font";
import LoadingView from "../components/loading-view";
import ErrorView from "../components/error-view";

export default function AssetsProvider({ children }: PropsWithChildren) {
  const [fontsLoaded, fontLoadingError] = useFonts({
    Rubik: require("../assets/Rubik.ttf"),
  });

  const [assets, assetsLoadingError] = useAssets([
    require("../assets/logo.png"),
    require("../assets/flags/ar.png"),
    require("../assets/flags/en.png"),
    require("../assets/flags/fr.png"),
  ]);

  if (!fontsLoaded || !assets || assetsLoadingError || fontLoadingError) {
    return <LoadingView></LoadingView>;
  }
  if (assetsLoadingError || fontLoadingError) {
    return <ErrorView></ErrorView>;
  }

  return (
    <AssetsContext.Provider
      value={{
        assets: {
          logo: assets[0],
          ar: assets[1],
          en: assets[2],
          fr: assets[3],
        },
      }}
    >
      {children}
    </AssetsContext.Provider>
  );
}
