import type { AppTranslation } from "../types/app-translation";

export const EN: AppTranslation = {
  dashboard: "Dashboard",
  settings: "Settings",
  information: "Information",

  save: "Save",
  apiKey: "API key",
  apiKeyDescription:
    "The api key is used to authorize access to your cloudflare worker",
  baseUrl: "Base URL",
  baseUrlDescription: "The base URL to your cloudflare worker",
  language: "Language",

  apiKeySaved: "API key has been saved",
  baseUrlSaved: "Base URL has been saved",
  connectionError: "Connection error",
  permissionRequired: "Permission required",
  unknownError: "Unknown error",

  mustConnectInternetQnh: "You must be connected to the internet to fetch QNH",
  mustHaveApiKeyQnh: "You must have an API key for OpenWeatherMap",
};
