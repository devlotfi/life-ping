import { createContext } from "react";

export interface AppAssets {
  logo: any;
  ar: any;
  en: any;
  fr: any;
  notifications: any;
}

interface AssetsContextType {
  assets: AppAssets;
}

const initialValue: AssetsContextType = {
  assets: {
    logo: null,
    ar: null,
    en: null,
    fr: null,
    notifications: null,
  },
};

export const AssetsContext = createContext(initialValue);
