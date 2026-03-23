import { createFileRoute } from "@tanstack/react-router";
import RequiredSubscriptionProvider from "../provider/required-subscription-provider";
import SectionHeader from "../components/section-header";
import { useTranslation } from "react-i18next";
import {
  Button,
  Card,
  Label,
  Skeleton,
  Spinner,
  Switch,
  toast,
} from "@heroui/react";
import { SectionTitle } from "../components/section-title";
import { $api } from "../api/openapi-client";
import { useContext } from "react";
import { ApiContext } from "../context/api-context";
import { useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as yup from "yup";
import ValidatedTextField from "../components/validated-text-field";
import { Check, InfoIcon } from "lucide-react";

export const Route = createFileRoute("/information")({
  component: RouteComponent,
});

function EnabledOption() {
  const { t } = useTranslation();
  const { apiUrl, apiSecret } = useContext(ApiContext);
  const queryClient = useQueryClient();

  if (!apiUrl || !apiSecret) throw new Error("Missing api data");

  const { data, isLoading } = $api.useQuery("get", "/api/enabled", {
    baseUrl: apiUrl,
    headers: {
      "x-api-key": apiSecret,
    },
  });

  const { mutate, isPending } = $api.useMutation("post", "/api/enabled", {
    onError() {
      toast(t("error"), {
        indicator: <InfoIcon />,
        variant: "danger",
      });
    },
    onSuccess() {
      toast(t("actionSuccess"), {
        indicator: <Check />,
        variant: "success",
      });
      queryClient.refetchQueries({
        queryKey: ["get", "/api/enabled"],
      });
    },
  });

  if (isLoading || !data)
    return (
      <Card>
        <Card.Content className="gap-[1rem]">
          <Skeleton className="h-3 w-1/2 rounded-lg" />
          <Skeleton className="h-3 rounded-lg" />
          <Skeleton className="h-3 rounded-lg" />
          <Skeleton className="h-3 rounded-lg" />
        </Card.Content>
      </Card>
    );

  return (
    <Card>
      <Card.Content className="flex flex-col gap-[0.7rem]">
        <SectionTitle icon="shield-check">{t("enabled")}</SectionTitle>
        <div className="flex">{t("enabledDescription")}</div>

        <Switch
          size="lg"
          isSelected={data.enabled}
          isDisabled={isPending}
          onChange={() =>
            mutate({
              body: {
                enabled: !data.enabled,
              },
              baseUrl: apiUrl,
              headers: {
                "x-api-key": apiSecret,
              },
            })
          }
        >
          {isPending ? (
            <Spinner color="accent"></Spinner>
          ) : (
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
          )}
          <Switch.Content>
            <Label className="text-sm">{t("enabled")}</Label>
          </Switch.Content>
        </Switch>
      </Card.Content>
    </Card>
  );
}

function NameOption() {
  const { t } = useTranslation();
  const { apiUrl, apiSecret } = useContext(ApiContext);
  const queryClient = useQueryClient();

  if (!apiUrl || !apiSecret) throw new Error("Missing api data");

  const { data, isLoading } = $api.useQuery("get", "/api/name", {
    baseUrl: apiUrl,
    headers: {
      "x-api-key": apiSecret,
    },
  });

  const { mutate, isPending } = $api.useMutation("post", "/api/name", {
    onError() {
      toast(t("error"), {
        indicator: <InfoIcon />,
        variant: "danger",
      });
    },
    onSuccess() {
      toast(t("actionSuccess"), {
        indicator: <Check />,
        variant: "success",
      });
      queryClient.refetchQueries({
        queryKey: ["get", "/api/enabled"],
      });
    },
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: data?.name || "",
    },
    validationSchema: yup.object({
      name: yup.string().required(),
    }),
    onSubmit(values) {
      mutate({
        body: {
          name: values.name,
        },
        baseUrl: apiUrl,
        headers: {
          "x-api-key": apiSecret,
        },
      });
    },
  });

  if (isLoading || !data)
    return (
      <Card className="mt-[2rem]">
        <Card.Content className="gap-[1rem]">
          <Skeleton className="h-3 w-1/2 rounded-lg" />
          <Skeleton className="h-3 rounded-lg" />
          <Skeleton className="h-3 rounded-lg" />
          <Skeleton className="h-3 rounded-lg" />
        </Card.Content>
      </Card>
    );

  return (
    <Card className="mt-[2rem]">
      <Card.Content className="flex flex-col gap-[0.7rem]">
        <SectionTitle icon="shield-user">{t("name")}</SectionTitle>
        <div className="flex">{t("nameDescription")}</div>

        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col gap-[1rem]"
        >
          <ValidatedTextField
            formik={formik}
            name="name"
            textFieldProps={{
              isRequired: true,
            }}
            labelProps={{ children: t("name") }}
          ></ValidatedTextField>
          <Button fullWidth type="submit" isPending={isPending}>
            {t("save")}
          </Button>
        </form>
      </Card.Content>
    </Card>
  );
}

function InformationDashboard() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 flex-col items-center p-[1rem]">
      <div className="flex flex-col w-full max-w-screen-sm pb-[5rem]">
        <SectionHeader icon="user-pen">{t("information")}</SectionHeader>

        <EnabledOption></EnabledOption>
        <NameOption></NameOption>
      </div>
    </div>
  );
}

function RouteComponent() {
  return (
    <RequiredSubscriptionProvider>
      <InformationDashboard></InformationDashboard>
    </RequiredSubscriptionProvider>
  );
}
