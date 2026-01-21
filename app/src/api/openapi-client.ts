import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import { paths } from "../__generated__/schema";

export const fetchClient = createFetchClient<paths>({
  baseUrl: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    "w-lol": "lol",
  },
});
export const $api = createClient(fetchClient);
