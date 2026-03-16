import { createContext } from "react";
import { OptionalNullable } from "../types/optional-nullable";

interface SettingsContextType {
  apiKey: OptionalNullable<string>;
  setApiKey: (value: string) => Promise<void>;
  baseUrl: OptionalNullable<string>;
  setBaseUrl: (value: string) => Promise<void>;
}

export const SettingsContextInitialValue: SettingsContextType = {
  apiKey: null,
  async setApiKey() {},
  baseUrl: null,
  async setBaseUrl() {},
};

export const SettingsContext = createContext(SettingsContextInitialValue);
