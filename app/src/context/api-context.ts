import { createContext } from "react";
import { OpenapiQueryClient } from "openapi-react-query";
import { paths } from "../__generated__/schema";

interface ApiContextType {
  $api: OpenapiQueryClient<paths> | null;
}

export const ApiContextInitialValue: ApiContextType = {
  $api: null,
};

export const ApiContext = createContext(ApiContextInitialValue);
