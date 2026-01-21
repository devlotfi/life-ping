import { View } from "react-native";
import { ToastConfig } from "react-native-toast-message";
import Text from "./components/text";
import { useTheme } from "react-native-paper";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

interface ToastProps {
  icon: IconProp;
  text: string;
}

interface ToastBaseProps extends ToastProps {
  color: string;
}

function ToastBase({ icon, text, color }: ToastBaseProps) {
  const theme = useTheme();

  return (
    <View style={{ padding: 12, width: "100%" }}>
      <View
        style={{
          width: "100%",
          backgroundColor: theme.colors.surface,
          borderRadius: 15,
          elevation: 20,
          paddingHorizontal: 15,
          paddingVertical: 17,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 15,
          borderWidth: 2,
          borderColor: color,
        }}
      >
        {icon ? (
          <FontAwesomeIcon
            icon={icon}
            size={25}
            color={color}
          ></FontAwesomeIcon>
        ) : null}
        <Text style={{ fontSize: 15 }}>{text}</Text>
      </View>
    </View>
  );
}

function PrimaryToast({ icon, text }: ToastProps) {
  const theme = useTheme();
  return (
    <ToastBase icon={icon} text={text} color={theme.colors.primary}></ToastBase>
  );
}

function SuccessToast({ icon, text }: ToastProps) {
  return <ToastBase icon={icon} text={text} color="#39CE8E"></ToastBase>;
}

function ErrorToast({ icon, text }: ToastProps) {
  const theme = useTheme();
  return (
    <ToastBase
      icon={icon}
      text={text}
      color={theme.colors.errorContainer}
    ></ToastBase>
  );
}

export const toastConfig: ToastConfig = {
  primary: ({ props }) => <PrimaryToast {...props}></PrimaryToast>,
  success: ({ props }) => <SuccessToast {...props}></SuccessToast>,
  error: ({ props }) => <ErrorToast {...props}></ErrorToast>,
};
