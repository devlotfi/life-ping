import { PropsWithChildren, useCallback } from "react";
import { SettingsContext } from "../context/settings-context";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingView from "../components/loading-view";
import * as SecureStore from "expo-secure-store";
import { SecureStorageKeys } from "../types/secure-storage-keys";

export default function SettingsProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["SETTINGS"],
    queryFn: async () => {
      const [apiKey, baseUrl] = await Promise.all([
        SecureStore.getItem(SecureStorageKeys.API_KEY),
        SecureStore.getItem(SecureStorageKeys.BASE_URL),
      ]);
      return {
        apiKey,
        baseUrl,
      };
    },
  });

  const setApiKey = useCallback(async (value: string) => {
    await SecureStore.setItem(SecureStorageKeys.API_KEY, value);
    queryClient.resetQueries({
      queryKey: ["SETTINGS"],
    });
  }, []);
  const setBaseUrl = useCallback(async (value: string) => {
    await SecureStore.setItem(SecureStorageKeys.BASE_URL, value);
    queryClient.resetQueries({
      queryKey: ["SETTINGS"],
    });
  }, []);

  if (isLoading || !data) return <LoadingView></LoadingView>;

  return (
    <SettingsContext.Provider
      value={{
        apiKey: data.apiKey,
        setApiKey,
        baseUrl: data.baseUrl,
        setBaseUrl,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
