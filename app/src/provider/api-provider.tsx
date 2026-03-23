import type { PropsWithChildren } from "react";
import { ApiContext } from "../context/api-context";
import { useQuery } from "@tanstack/react-query";
import { Constants } from "../constants";
import LoadingScreen from "../components/loading-screen";
import ErrorScreen from "../components/error-screen";

export default function ApiProvider({ children }: PropsWithChildren) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["API"],
    queryFn: async () => {
      const permission = Notification.permission;
      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.getSubscription();
      const apiSecret = localStorage.getItem(Constants.API_SECRET_STORAGE_KEY);
      const apiUrl = localStorage.getItem(Constants.API_URL_STORAGE_KEY);
      const vapidPublicKeyBuffer = subscription
        ? subscription.getKey("p256dh")
        : null;

      return {
        permission,
        subscription,
        apiSecret,
        apiUrl,
        vapidPublicKeyBuffer,
      };
    },
  });

  if (isLoading) return <LoadingScreen></LoadingScreen>;
  if (isError || !data) return <ErrorScreen></ErrorScreen>;

  return (
    <ApiContext.Provider
      value={{
        permission: data.permission,
        subscription: data.subscription,
        apiSecret: data.apiSecret,
        apiUrl: data.apiUrl,
        vapidPublicKeyBuffer: data.vapidPublicKeyBuffer,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
}
