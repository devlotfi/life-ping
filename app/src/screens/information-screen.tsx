import { ScrollView, View } from "react-native";
import ApiKeyCard from "../components/settings/api-key-card";
import LanguageCard from "../components/settings/language-card";
import BaseUrlCard from "../components/settings/base-url-card";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { SettingsContext } from "../context/settings-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import Text from "../components/text";
import { Card, useTheme } from "react-native-paper";

function MissingSettings() {
  const theme = useTheme();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Card
        mode="contained"
        style={{
          backgroundColor: theme.colors.surface,
          borderRadius: 20,
          maxWidth: 300,
        }}
      >
        <Card.Content style={{ alignItems: "center", gap: 10 }}>
          <FontAwesomeIcon
            icon={faInfoCircle}
            color={theme.colors.primary}
            size={50}
          ></FontAwesomeIcon>
          <Text style={{ fontSize: 23, fontWeight: "bold" }}>
            Missing settings
          </Text>
          <Text style={{ fontSize: 15, textAlign: "center" }}>
            You must provide the api key and the base url in the settings
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
}

function InformationData() {
  const { data, isLoading } = useQuery({
    queryKey: ["INFORMATION"],
    queryFn: async () => {
      const [apiKey, baseUrl] = await Promise.all([
        SecureStore.getItem(SecureStorageKeys.API_KEY),
        SecureStore.getItem(SecureStorageKeys.BASE_URL),
      ]);
      return {
        apiKey,
        baseUrl,
      };
    },
  });

  return (
    <ScrollView
      style={{ paddingHorizontal: 12, paddingVertical: 40 }}
      contentContainerStyle={{ gap: 20, paddingBottom: 100 }}
    >
      <ApiKeyCard></ApiKeyCard>
      <BaseUrlCard></BaseUrlCard>
      <LanguageCard></LanguageCard>
    </ScrollView>
  );
}

export default function InformationScreen() {
  const { apiKey, baseUrl } = useContext(SettingsContext);
  if (!apiKey || !baseUrl) return <MissingSettings></MissingSettings>;
  return <InformationData></InformationData>;
}
