import { PropsWithChildren, useContext, useEffect, useState } from "react";
import { ApiContext } from "../context/api-context";
import { SettingsContext } from "../context/settings-context";
import { paths } from "../__generated__/schema";
import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import { OptionalNullable } from "../types/optional-nullable";

function initClient({
  apiKey,
  baseUrl,
}: {
  baseUrl: OptionalNullable<string>;
  apiKey: OptionalNullable<string>;
}) {
  if (!apiKey || !baseUrl) return null;

  const fetchClient = createFetchClient<paths>({
    baseUrl: baseUrl,
    headers: {
      "x-api-key": apiKey,
    },
  });
  const $api = createClient(fetchClient);
  return $api;
}

export default function ApiProvider({ children }: PropsWithChildren) {
  const { apiKey, baseUrl } = useContext(SettingsContext);
  const [$api, set$Api] = useState(initClient({ apiKey, baseUrl }));

  useEffect(() => {
    set$Api(initClient({ apiKey, baseUrl }));
  }, [apiKey, baseUrl]);

  return <ApiContext.Provider value={{ $api }}>{children}</ApiContext.Provider>;
}
