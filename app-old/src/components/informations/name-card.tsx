import Text from "../text";
import { Button, Card, useTheme } from "react-native-paper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as yup from "yup";
import ValidatedTextInput from "../validated-text-input";
import Toast from "react-native-toast-message";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTranslation } from "react-i18next";
import { OptionalNullable } from "../../types/optional-nullable";
import { $api } from "../../api/openapi-client";

export default function NameCard({
  name,
  apiKey,
  baseUrl,
}: {
  name: OptionalNullable<string>;
  apiKey: string;
  baseUrl: string;
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const queryClient = useQueryClient();

  const { mutate, isPending } = $api.useMutation("post", "/api/name", {
    onSuccess() {
      queryClient.resetQueries({
        exact: false,
        queryKey: ["get", "/api/name"],
      });
      Toast.show({
        type: "success",
        props: {
          icon: faSave,
          text: t("nameSaved"),
        },
      });
    },
    onError() {
      Toast.show({
        type: "error",
        props: {
          icon: faSave,
          text: t("requestError"),
        },
      });
    },
  });

  const formik = useFormik({
    initialValues: {
      name: name || "",
    },
    validationSchema: yup.object({
      name: yup.string().required(),
    }),
    onSubmit(values) {
      mutate({
        body: {
          name: values.name,
        },
        baseUrl,
        headers: {
          "x-api-key": apiKey,
        },
      });
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
        <Text style={{ fontSize: 23, fontWeight: "bold" }}>{t("name")}</Text>
        <Text style={{ fontSize: 16, fontWeight: "medium", opacity: 0.7 }}>
          {t("nameDescription")}
        </Text>
        <ValidatedTextInput
          name="name"
          formik={formik}
          mode="outlined"
          outlineStyle={{
            borderRadius: 10,
          }}
          autoCapitalize="none"
          label={t("name")}
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
