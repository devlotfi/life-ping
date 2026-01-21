import { PropsWithChildren, useState, useEffect } from "react";
import { Keyboard } from "react-native";
import { KeyboardContext } from "../context/keyboard-context";

export function KeyboardProvider({ children }: PropsWithChildren) {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState<boolean>(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsKeyboardVisible(true);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <KeyboardContext.Provider
      value={{
        isKeyboardVisible,
      }}
    >
      {children}
    </KeyboardContext.Provider>
  );
}
