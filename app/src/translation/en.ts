import type { AppTranslation } from "../types/app-translation";

export const EN: AppTranslation = {
  dashboard: "Dashboard",
  settings: "Settings",
  information: "Information",

  save: "Save",
  apiKey: "API key",
  apiKeyDescription:
    "The api key is used to authorize access to your cloudflare worker",
  apiKeySaved: "API key has been saved",
  baseUrl: "Base URL",
  baseUrlDescription: "The base URL to your cloudflare worker",
  baseUrlSaved: "Base URL has been saved",
  name: "Name",
  nameDescription:
    "The name that will be showed to the recipients in the e-mail",
  nameSaved: "Name saved",
  emails: "Emails",
  emailsDescription:
    "The emails the will recieve the alert in case of inactivity",
  emailsSaved: "Emails saved",
  language: "Language",
  email: "Email",
  emptyList: "The list is empty",
  unsavedChanges: "Unsaved changes",
  nextAlert: "Next alert",
  alertCountdown: "Alert Countdown",
  timerElapsed: "Timer elapsed",
  cancel: "Cancel",

  connectionError: "Connection error",
  permissionRequired: "Permission required",
  unknownError: "Unknown error",

  mustConnectInternetQnh: "You must be connected to the internet to fetch QNH",
  mustHaveApiKeyQnh: "You must have an API key for OpenWeatherMap",
};
