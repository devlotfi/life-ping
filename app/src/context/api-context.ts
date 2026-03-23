import { createContext } from "react";

interface ApiContext {
  permission: NotificationPermission;
  subscription: PushSubscription | null;
  apiSecret: string | null;
  apiUrl: string | null;
  vapidPublicKeyBuffer: ArrayBuffer | null;
}

export const ApiContextInitialValue: ApiContext = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  permission: {} as any,
  subscription: null,
  apiSecret: null,
  apiUrl: null,
  vapidPublicKeyBuffer: null,
};

export const ApiContext = createContext(ApiContextInitialValue);
