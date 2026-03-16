import Text from "../text";
import {
  Button,
  Card,
  Divider,
  IconButton,
  useTheme,
} from "react-native-paper";
import { useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as yup from "yup";
import ValidatedTextInput from "../validated-text-input";
import Toast from "react-native-toast-message";
import {
  faList,
  faPlus,
  faSave,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTranslation } from "react-i18next";
import { $api } from "../../api/openapi-client";
import { View } from "react-native";
import { useCallback, useState } from "react";

function EmailComponent({
  email,
  deleteEmail,
}: {
  email: string;
  deleteEmail: (email: string) => void;
}) {
  const theme = useTheme();

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        borderRadius: 10,
        paddingVertical: 3,
        paddingLeft: 15,
        paddingRight: 3,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Text style={{ flex: 1 }}>{email}</Text>
      <IconButton
        size={20}
        style={{ borderRadius: 1000 }}
        iconColor={theme.colors.errorContainer}
        icon={({ size, color }) => (
          <FontAwesomeIcon
            icon={faTrashAlt}
            size={size}
            color={color}
          ></FontAwesomeIcon>
        )}
        onPress={() => deleteEmail(email)}
      ></IconButton>
    </View>
  );
}

export default function EmailsCard({
  emails,
  apiKey,
  baseUrl,
}: {
  emails: string[];
  apiKey: string;
  baseUrl: string;
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const queryClient = useQueryClient();

  const [currentEmails, setCurrentEmails] = useState<string[]>(emails);

  const { mutate, isPending } = $api.useMutation("post", "/api/emails", {
    onSuccess() {
      queryClient.resetQueries({
        exact: false,
        queryKey: ["get", "/api/emails"],
      });
      Toast.show({
        type: "success",
        props: {
          icon: faSave,
          text: t("emailsSaved"),
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
      email: "",
    },
    validationSchema: yup.object({
      email: yup.string().email().required(),
    }),
    onSubmit(values) {
      if (!currentEmails.includes(values.email)) {
        setCurrentEmails([...currentEmails, values.email]);
      }
    },
  });

  const deleteEmail = useCallback((email: string) => {
    setCurrentEmails([...currentEmails].filter((item) => item !== email));
  }, []);

  const noChanges =
    currentEmails.length === emails.length &&
    currentEmails.every((val, index) => val === emails[index]);

  return (
    <Card
      mode="contained"
      style={{
        backgroundColor: theme.colors.surface,
        borderRadius: 20,
      }}
    >
      <Card.Content style={{ gap: 10 }}>
        <Text style={{ fontSize: 23, fontWeight: "bold" }}>{t("emails")}</Text>
        {!noChanges ? (
          <Text
            style={{
              fontSize: 18,
              color: theme.colors.primary,
            }}
          >
            ({t("unsavedChanges")})
          </Text>
        ) : null}
        <Text style={{ fontSize: 16, fontWeight: "medium", opacity: 0.7 }}>
          {t("emailsDescription")}
        </Text>
        <View
          style={{ alignItems: "flex-start", flexDirection: "row", gap: 5 }}
        >
          <View style={{ flex: 1 }}>
            <ValidatedTextInput
              name="email"
              formik={formik}
              mode="outlined"
              inputMode="email"
              outlineStyle={{
                borderRadius: 10,
              }}
              autoCapitalize="none"
              label={t("email")}
            ></ValidatedTextInput>
          </View>
          <IconButton
            mode="outlined"
            size={25}
            style={{ borderRadius: 10, marginTop: 10 }}
            icon={({ size, color }) => (
              <FontAwesomeIcon
                icon={faPlus}
                size={size}
                color={color}
              ></FontAwesomeIcon>
            )}
            onPress={() => formik.handleSubmit()}
          ></IconButton>
        </View>

        {!noChanges ? (
          <View
            style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}
          >
            <Button
              mode="contained"
              loading={isPending}
              contentStyle={{ paddingVertical: 5 }}
              style={{ flex: 1 }}
              icon={({ size, color }) => (
                <FontAwesomeIcon
                  icon={faSave}
                  size={size}
                  color={color}
                ></FontAwesomeIcon>
              )}
              onPress={() => {
                mutate({
                  body: currentEmails,
                  baseUrl,
                  headers: {
                    "x-api-key": apiKey,
                  },
                });
              }}
            >
              {t("save")}
            </Button>
            <Button
              mode="outlined"
              loading={isPending}
              contentStyle={{ paddingVertical: 5 }}
              textColor={theme.colors.errorContainer}
              onPress={() => {
                setCurrentEmails([...emails]);
              }}
            >
              {t("cancel")}
            </Button>
          </View>
        ) : null}

        <Divider style={{ backgroundColor: theme.colors.outline }}></Divider>

        {currentEmails.length ? (
          currentEmails.map((email) => (
            <EmailComponent
              key={email}
              email={email}
              deleteEmail={deleteEmail}
            ></EmailComponent>
          ))
        ) : (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 20,
            }}
          >
            <FontAwesomeIcon
              icon={faList}
              color={theme.colors.primary}
              size={40}
            ></FontAwesomeIcon>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {t("emptyList")}
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );
}
