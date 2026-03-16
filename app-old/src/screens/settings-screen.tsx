import { ScrollView } from "react-native";
import ApiKeyCard from "../components/settings/api-key-card";
import LanguageCard from "../components/settings/language-card";
import BaseUrlCard from "../components/settings/base-url-card";

export default function SettingsScreen() {
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
