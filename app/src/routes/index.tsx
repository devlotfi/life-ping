import { createFileRoute } from "@tanstack/react-router";
import RequiredSubscriptionProvider from "../provider/required-subscription-provider";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { ApiContext } from "../context/api-context";
import { $api } from "../api/openapi-client";
import { Spinner, toast } from "@heroui/react";
import { Check, ClockPlus, InfoIcon } from "lucide-react";
import ErrorScreen from "../components/error-screen";
import LoadingScreen from "../components/loading-screen";
import Counter from "../components/counter";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function Dashboard() {
  const { t } = useTranslation();
  const { apiUrl, apiSecret } = useContext(ApiContext);

  if (!apiUrl || !apiSecret) throw new Error("Missing api data");

  const { data, isLoading, refetch } = $api.useQuery("get", "/api/ping", {
    baseUrl: apiUrl,
    headers: {
      "x-api-key": apiSecret,
    },
  });

  const { mutate, isPending } = $api.useMutation("post", "/api/ping", {
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
      refetch();
    },
  });

  if (isLoading) return <LoadingScreen></LoadingScreen>;
  if (!data) return <ErrorScreen></ErrorScreen>;

  return (
    <div className="flex flex-col flex-1 p-[1rem]">
      {data.lastPing ? (
        <Counter lastPing={Number.parseInt(data.lastPing)}></Counter>
      ) : null}

      <div className="flex flex-1 flex-col justify-center items-center">
        <div
          className="flex flex-col rounded-full p-[1rem] border-[2px] border-accent border-dashed cursor-pointer group"
          onClick={() =>
            mutate({
              baseUrl: apiUrl,
              headers: {
                "x-api-key": apiSecret,
              },
            })
          }
        >
          <div className="flex flex-col rounded-full p-[1rem] bg-linear-to-t from-background to-surface duration-300 transition-transform group-hover:scale-90">
            <div className="flex flex-col gap-[0.5rem] justify-center items-center size-[10rem] rounded-full bg-linear-to-b from-background to-surface">
              {isPending ? (
                <Spinner size="lg" color="accent"></Spinner>
              ) : (
                <>
                  <ClockPlus className="text-accent size-[3rem]"></ClockPlus>
                  <div className="flex font-bold text-accent text-[15pt]">
                    Ping
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RouteComponent() {
  return (
    <RequiredSubscriptionProvider>
      <Dashboard></Dashboard>
    </RequiredSubscriptionProvider>
  );
}
