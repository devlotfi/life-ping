import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { PropsWithChildren, useContext, useEffect } from "react";
import LoadingView from "../components/loading-view";
import { View } from "react-native";
import TitleBar from "../components/title-bar";
import ContentGradient from "../layout/content-gradient";
import Text from "../components/text";
import { AssetsContext } from "../context/assets-context";
import { Image } from "expo-image";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Button, useTheme } from "react-native-paper";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

export default function NotificationsProvider({ children }: PropsWithChildren) {
  const { t } = useTranslation();
  const { assets } = useContext(AssetsContext);
  const theme = useTheme();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["NOTIFICATIONS"],
    queryFn: async () => {
      const [permission, scheduledNotifications] = await Promise.all([
        Notifications.getPermissionsAsync(),
        Notifications.getAllScheduledNotificationsAsync(),
      ]);

      return {
        permission,
        scheduledNotifications,
      };
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await Notifications.requestPermissionsAsync();
      queryClient.refetchQueries({
        queryKey: ["NOTIFICATIONS"],
      });
    },
  });

  useEffect(() => {
    if (
      data &&
      data.permission.granted &&
      data.scheduledNotifications.length < 1
    ) {
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Mark your presence",
          body: "Remember to reset the ping timer",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 12 * 60 * 60,
          repeats: true,
        },
      });
    }
  }, [data?.scheduledNotifications]);

  if (isLoading) return <LoadingView></LoadingView>;

  if (!data?.permission.granted)
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <TitleBar></TitleBar>
        <ContentGradient>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              gap: 20,
              paddingHorizontal: 20,
            }}
          >
            <Image
              source={assets.notifications}
              style={{ height: 200, width: 200 }}
              contentFit="contain"
            ></Image>
            <Text
              style={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}
            >
              {t("notifications1")}
            </Text>
            <Text style={{ textAlign: "center", fontSize: 17 }}>
              {t("notifications2")}
            </Text>
          </View>
        </ContentGradient>
        <View
          style={{
            padding: 20,
            height: 100,
            backgroundColor: theme.colors.surface,
            justifyContent: "center",
          }}
        >
          <Button
            mode="contained"
            loading={isPending}
            contentStyle={{ paddingVertical: 5, height: 50 }}
            icon={({ size, color }) => (
              <FontAwesomeIcon
                icon={faBell}
                size={size}
                color={color}
              ></FontAwesomeIcon>
            )}
            onPress={() => {
              mutate();
            }}
          >
            {t("allow")}
          </Button>
        </View>
      </View>
    );

  return children;
}
