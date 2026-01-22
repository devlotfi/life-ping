import { ScrollView } from "react-native";
import { useContext } from "react";
import { SettingsContext } from "../context/settings-context";
import { $api } from "../api/openapi-client";
import NameCard from "../components/informations/name-card";
import LoadingView from "../components/loading-view";
import ErrorView from "../components/error-view";
import EmailsCard from "../components/informations/emails-card";
import MissingSettings from "../components/missing-settings";

function InformationFetch({
  apiKey,
  baseUrl,
}: {
  apiKey: string;
  baseUrl: string;
}) {
  const { data: dataName, isLoading: isLoadingName } = $api.useQuery(
    "get",
    "/api/name",
    {
      baseUrl,
      headers: {
        "x-api-key": apiKey,
      },
    },
  );
  const { data: dataEmails, isLoading: isLoadingEmails } = $api.useQuery(
    "get",
    "/api/emails",
    {
      baseUrl,
      headers: {
        "x-api-key": apiKey,
      },
    },
  );

  if (isLoadingName || isLoadingEmails) return <LoadingView></LoadingView>;

  if (
    dataEmails === null ||
    dataEmails === undefined ||
    dataName === null ||
    dataName === undefined
  )
    return <ErrorView></ErrorView>;

  return (
    <ScrollView
      style={{ paddingHorizontal: 12, paddingVertical: 40 }}
      contentContainerStyle={{ gap: 20, paddingBottom: 100 }}
    >
      <NameCard
        name={dataName.name}
        apiKey={apiKey}
        baseUrl={baseUrl}
      ></NameCard>
      <EmailsCard
        emails={dataEmails}
        apiKey={apiKey}
        baseUrl={baseUrl}
      ></EmailsCard>
    </ScrollView>
  );
}

export default function InformationScreen() {
  const { apiKey, baseUrl } = useContext(SettingsContext);
  if (!apiKey || !baseUrl) return <MissingSettings></MissingSettings>;
  return (
    <InformationFetch apiKey={apiKey} baseUrl={baseUrl}></InformationFetch>
  );
}
