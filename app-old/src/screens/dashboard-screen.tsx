import { Pressable, RefreshControl, ScrollView, View } from "react-native";
import Text from "../components/text";
import { ActivityIndicator, useTheme } from "react-native-paper";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUserClock } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { GradientCard } from "../components/dashboard/gradient-card";
import CircleButton from "../components/dashboard/circle-button";
import React, { useContext } from "react";
import MissingSettings from "../components/missing-settings";
import { SettingsContext } from "../context/settings-context";
import { $api } from "../api/openapi-client";
import LoadingView from "../components/loading-view";
import ErrorView from "../components/error-view";
import Counter from "../components/dashboard/counter";
import { useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";

function DashboardFetch({
  apiKey,
  baseUrl,
}: {
  apiKey: string;
  baseUrl: string;
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const queryClient = useQueryClient();

  const {
    data: dataPing,
    isLoading: isLoadingPing,
    refetch: refetchPing,
  } = $api.useQuery("get", "/api/ping", {
    baseUrl,
    headers: {
      "x-api-key": apiKey,
    },
  });

  const { mutate: mutatePing, isPending: isPendingPing } = $api.useMutation(
    "post",
    "/api/ping",
    {
      onSuccess() {
        queryClient.resetQueries({
          exact: false,
          queryKey: ["get", "/api/ping"],
        });
        Toast.show({
          type: "success",
          props: {
            icon: faUserClock,
            text: t("timerUpdated"),
          },
        });
      },
      onError() {
        Toast.show({
          type: "error",
          props: {
            icon: faUserClock,
            text: t("requestError"),
          },
        });
      },
    },
  );

  if (isLoadingPing) return <LoadingView></LoadingView>;

  if (dataPing === null || dataPing === undefined)
    return <ErrorView></ErrorView>;

  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: 12,
        paddingVertical: 40,
        flex: 1,
      }}
      refreshControl={
        <RefreshControl
          colors={[theme.colors.primary]}
          refreshing={isLoadingPing}
          onRefresh={() => {
            refetchPing();
          }}
        />
      }
    >
      {dataPing.lastPing ? (
        <Counter lastPing={Number.parseInt(dataPing.lastPing)}></Counter>
      ) : null}

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Pressable
          onPress={() => {
            mutatePing({
              baseUrl,
              headers: {
                "x-api-key": apiKey,
              },
            });
          }}
        >
          <CircleButton>
            {isPendingPing ? (
              <ActivityIndicator animating size="large"></ActivityIndicator>
            ) : (
              <>
                <FontAwesomeIcon
                  icon={faUserClock}
                  size={35}
                  color={theme.colors.primary}
                  style={{ opacity: 0.8 }}
                ></FontAwesomeIcon>
                <Text style={{ fontSize: 22, fontWeight: "bold" }}>Ping</Text>
              </>
            )}
          </CircleButton>
        </Pressable>
      </View>
    </ScrollView>
  );
}

export default function DashboardScreen() {
  const { apiKey, baseUrl } = useContext(SettingsContext);
  if (!apiKey || !baseUrl) return <MissingSettings></MissingSettings>;
  return <DashboardFetch apiKey={apiKey} baseUrl={baseUrl}></DashboardFetch>;
}
