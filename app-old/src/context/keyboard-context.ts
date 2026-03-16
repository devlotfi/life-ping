import { createContext } from "react";

interface KeyboardContextType {
  isKeyboardVisible: boolean;
}

const initialValue: KeyboardContextType = {
  isKeyboardVisible: false,
};

export const KeyboardContext = createContext(initialValue);
