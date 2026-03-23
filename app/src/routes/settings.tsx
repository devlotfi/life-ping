import {
  Alert,
  Button,
  Card,
  Label,
  ListBox,
  Select,
  Separator,
  toast,
} from "@heroui/react";
import { createFileRoute } from "@tanstack/react-router";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../context/theme-context";
import { ThemeOptions } from "../types/theme-options";
import {
  Check,
  Computer,
  Eye,
  EyeOff,
  InfoIcon,
  Moon,
  Sun,
} from "lucide-react";
import SectionHeader from "../components/section-header";
import { DynamicIcon } from "lucide-react/dynamic";
import ValidatedTextField from "../components/validated-text-field";
import { useFormik } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Constants } from "../constants";
import * as yup from "yup";
import { urlBase64ToUint8Array } from "../utils/urlbase64-to-uint8array";
import { $api, fetchClient } from "../api/openapi-client";
import { z } from "zod";
import { arrayBufferToBase64 } from "../utils/arraybuffer-to-base64";
import { ApiContext } from "../context/api-context";
import { SectionTitle } from "../components/section-title";
import { renderFlag } from "../utils/render-flag";

export const Route = createFileRoute("/settings")({
  component: RouteComponent,
});

function DisplaySettings() {
  const { themeOption, setTheme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();

  return (
    <Card>
      <Card.Content className="flex flex-col gap-[0.7rem]">
        <SectionTitle icon="monitor-cog">{t("display")}</SectionTitle>

        <Select
          value={themeOption}
          onChange={(value) => setTheme(value?.toString() as ThemeOptions)}
        >
          <Label>{t("theme")}</Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              <ListBox.Item
                key={ThemeOptions.SYSTEM}
                id={ThemeOptions.SYSTEM}
                textValue={t("system")}
              >
                <div className="flex gap-[1rem] items-center">
                  <div className="flex justify-center items-center h-[2rem] w-[2rem] bg-accent rounded-2xl">
                    <Computer className="text-accent-foreground"></Computer>
                  </div>
                  <div className="flex">{t("system")}</div>
                </div>
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item
                key={ThemeOptions.LIGHT}
                id={ThemeOptions.LIGHT}
                textValue={t("light")}
              >
                <div className="flex gap-[1rem] items-center">
                  <div className="flex justify-center items-center h-[2rem] w-[2rem] bg-accent rounded-2xl">
                    <Sun className="text-accent-foreground"></Sun>
                  </div>
                  <div className="flex">{t("light")}</div>
                </div>
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item
                key={ThemeOptions.DARK}
                id={ThemeOptions.DARK}
                textValue={t("dark")}
              >
                <div className="flex gap-[1rem] items-center">
                  <div className="flex justify-center items-center h-[2rem] w-[2rem] bg-accent rounded-2xl">
                    <Moon className="text-accent-foreground"></Moon>
                  </div>
                  <div className="flex">{t("dark")}</div>
                </div>
                <ListBox.ItemIndicator />
              </ListBox.Item>
            </ListBox>
          </Select.Popover>
        </Select>

        <Select
          value={i18n.language}
          onChange={(value) => i18n.changeLanguage(value?.toString())}
        >
          <Label>{t("language")}</Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              <ListBox.Item key={"ar"} id={"ar"} textValue={"العربية"}>
                <div className="flex gap-[1rem] items-center">
                  <div className="flex justify-center items-center h-[2rem] w-[2rem] rounded-lg">
                    {renderFlag("ar")}
                  </div>
                  <div className="flex">العربية</div>
                </div>
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item key={"fr"} id={"fr"} textValue={"Français"}>
                <div className="flex gap-[1rem] items-center">
                  <div className="flex justify-center items-center h-[2rem] w-[2rem] rounded-lg">
                    {renderFlag("fr")}
                  </div>
                  <div className="flex">Français</div>
                </div>
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item key={"en"} id={"en"} textValue={"English"}>
                <div className="flex gap-[1rem] items-center">
                  <div className="flex justify-center items-center h-[2rem] w-[2rem] rounded-lg">
                    {renderFlag("en")}
                  </div>
                  <div className="flex">English</div>
                </div>
                <ListBox.ItemIndicator />
              </ListBox.Item>
            </ListBox>
          </Select.Popover>
        </Select>
      </Card.Content>
    </Card>
  );
}

function ApiSettings() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { subscription, apiSecret, apiUrl, vapidPublicKeyBuffer } =
    useContext(ApiContext);

  const subscribeMutation = useMutation({
    mutationFn: async ({
      apiUrl,
      apiSecret,
      vapidPublicKey,
    }: {
      apiUrl: string;
      apiSecret: string;
      vapidPublicKey: string;
    }) => {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") throw new Error();

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });
      const subscriptionJson = sub.toJSON();

      try {
        const requestData = await z
          .object({
            endpoint: z.url(),
            expirationTime: z.number().nullable(),
            keys: z.object({
              p256dh: z.string(),
              auth: z.string(),
            }),
          })
          .safeParseAsync(subscriptionJson);
        if (!requestData.data) throw new Error();

        const { error } = await fetchClient.POST("/api/subscriptions/add", {
          baseUrl: apiUrl,
          headers: {
            "x-api-key": apiSecret,
          },
          body: requestData.data,
        });
        if (error) throw new Error();
      } catch {
        if (!sub) return;
        await sub.unsubscribe();
        throw new Error();
      }

      queryClient.resetQueries({
        queryKey: ["API"],
      });
    },
    onSuccess() {
      toast(t("actionSuccess"), {
        indicator: <Check />,
        variant: "success",
      });
    },
    onError(error) {
      console.error(error);
      toast(`${t("error")}`, {
        indicator: <InfoIcon />,
        variant: "danger",
      });
    },
  });

  const unsubscribeMutation = useMutation({
    mutationFn: async () => {
      if (!subscription) return;
      await subscription.unsubscribe();
      queryClient.resetQueries({
        queryKey: ["API"],
      });
    },
  });

  const testSubscribtionMutation = $api.useMutation(
    "post",
    "/api/subscriptions/test",
    {
      onError(error) {
        console.error(error);
        toast(`${t("error")}`, {
          indicator: <InfoIcon />,
          variant: "danger",
        });
      },
    },
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      apiUrl: apiUrl || "",
      apiSecret: apiSecret || "",
      vapidPublicKey:
        subscription && vapidPublicKeyBuffer
          ? arrayBufferToBase64(vapidPublicKeyBuffer)
          : "",
    },
    validationSchema: yup.object({
      apiUrl: yup.string().url().required(),
      apiSecret: yup.string().required(),
      vapidPublicKey: yup.string().required(),
    }),
    onSubmit(values) {
      localStorage.setItem(Constants.API_URL_STORAGE_KEY, values.apiUrl);
      localStorage.setItem(Constants.API_SECRET_STORAGE_KEY, values.apiSecret);
      console.log(values);
      subscribeMutation.mutate(values);
    },
  });

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Card className="mt-[2rem]">
      <Card.Content className="flex flex-col gap-[0.7rem]">
        <SectionTitle icon="bell-ring">{t("apiSubscription")}</SectionTitle>

        {subscription ? (
          <>
            <Alert status="success">
              <DynamicIcon
                name="bell-ring"
                className="text-success"
              ></DynamicIcon>
              <Alert.Content>
                <Alert.Title>{t("apiSubscribed")}</Alert.Title>
              </Alert.Content>
            </Alert>
            <Button
              fullWidth
              isPending={testSubscribtionMutation.isPending}
              onPress={() =>
                testSubscribtionMutation.mutate({
                  baseUrl: apiUrl!,
                  headers: {
                    "x-api-key": apiSecret,
                  },
                })
              }
            >
              {t("test")}
            </Button>
          </>
        ) : (
          <Alert status="danger">
            <DynamicIcon name="bell-off" className="text-danger"></DynamicIcon>
            <Alert.Content>
              <Alert.Title>{t("apiNotSubscribed")}</Alert.Title>
            </Alert.Content>
          </Alert>
        )}

        <Separator className="bg-border my-[1rem]"></Separator>

        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col gap-[0.5rem]"
        >
          <ValidatedTextField
            formik={formik}
            name="apiUrl"
            textFieldProps={{
              isRequired: true,
              isDisabled: subscription ? true : false,
            }}
            labelProps={{ children: t("apiUrl") }}
          ></ValidatedTextField>
          <ValidatedTextField
            formik={formik}
            name="apiSecret"
            labelProps={{ children: t("apiSecret") }}
            inputProps={{
              type: isVisible ? "text" : "password",
            }}
            textFieldProps={{
              isRequired: true,
              isDisabled: subscription ? true : false,
            }}
            suffix={
              <Button
                isIconOnly
                variant="ghost"
                size="sm"
                onPress={toggleVisibility}
              >
                {isVisible ? <EyeOff></EyeOff> : <Eye></Eye>}
              </Button>
            }
          ></ValidatedTextField>
          <ValidatedTextField
            formik={formik}
            name="vapidPublicKey"
            textFieldProps={{
              isRequired: true,
              isDisabled: subscription ? true : false,
            }}
            labelProps={{ children: t("vapidPublicKey") }}
          ></ValidatedTextField>

          {subscription ? (
            <Button
              fullWidth
              variant="outline"
              type="button"
              className="mt-[1rem] text-danger"
              isPending={unsubscribeMutation.isPending}
              onPress={() => unsubscribeMutation.mutate()}
            >
              {t("unsubscribe")}
            </Button>
          ) : (
            <Button
              fullWidth
              type="submit"
              isPending={subscribeMutation.isPending}
              className="mt-[1rem]"
            >
              {t("subscribe")}
            </Button>
          )}
        </form>
      </Card.Content>
    </Card>
  );
}

function RouteComponent() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 flex-col items-center p-[1rem]">
      <div className="flex flex-col w-full max-w-screen-sm pb-[5rem]">
        <SectionHeader icon="settings">{t("settings")}</SectionHeader>

        <DisplaySettings></DisplaySettings>
        <ApiSettings></ApiSettings>
      </div>
    </div>
  );
}
