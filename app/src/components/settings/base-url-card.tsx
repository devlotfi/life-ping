import Text from "../text";
import { Button, Card, useTheme } from "react-native-paper";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as yup from "yup";
import ValidatedTextInput from "../validated-text-input";
import Toast from "react-native-toast-message";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { SettingsContext } from "../../context/settings-context";

export default function BaseUrlCard() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { baseUrl, setBaseUrl } = useContext(SettingsContext);

  const { mutate, isPending } = useMutation({
    mutationFn: async (baseUrl: string) => {
      await setBaseUrl(baseUrl);
      Toast.show({
        type: "success",
        props: {
          icon: faSave,
          text: t("baseUrlSaved"),
        },
      });
    },
  });

  const formik = useFormik({
    initialValues: {
      baseUrl: baseUrl || "",
    },
    validationSchema: yup.object({
      baseUrl: yup.string().required(),
    }),
    onSubmit(values) {
      mutate(values.baseUrl);
    },
  });

  return (
    <Card
      mode="contained"
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: 20,
      }}
    >
      <Card.Content style={{ gap: 10 }}>
        <Text style={{ fontSize: 23, fontWeight: "bold" }}>{t("baseUrl")}</Text>
        <Text style={{ fontSize: 16, fontWeight: "medium", opacity: 0.7 }}>
          {t("baseUrlDescription")}
        </Text>
        <ValidatedTextInput
          name="baseUrl"
          formik={formik}
          mode="outlined"
          outlineStyle={{
            borderRadius: 10,
          }}
          secureTextEntry
          autoCapitalize="none"
          label={t("baseUrl")}
        ></ValidatedTextInput>
        <Button
          mode="contained"
          loading={isPending}
          contentStyle={{ paddingVertical: 5 }}
          icon={({ size, color }) => (
            <FontAwesomeIcon
              icon={faSave}
              size={size}
              color={color}
            ></FontAwesomeIcon>
          )}
          onPress={() => formik.handleSubmit()}
        >
          {t("save")}
        </Button>
      </Card.Content>
    </Card>
  );
}
