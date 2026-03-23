import "./i18n";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createHashHistory,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import NotFound from "./components/not-found";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toast } from "@heroui/react";
import PWAProvider from "./provider/pwa-provider";
import AppProvider from "./provider/app-provider";
import { ThemeProvider } from "./provider/theme-provider";
import ApiProvider from "./provider/api-provider";

const history = createHashHistory();

const router = createRouter({
  routeTree,
  history,
  defaultNotFoundComponent: NotFound,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <div className="flex flex-col md:flex-row min-h-dvh min-w-dvw max-h-dvh max-w-dvw overflow-hidden bg-surface">
        <QueryClientProvider client={queryClient}>
          <Toast.Provider placement="top"></Toast.Provider>
          <PWAProvider>
            <AppProvider>
              <ApiProvider>
                <RouterProvider router={router}></RouterProvider>
              </ApiProvider>
            </AppProvider>
          </PWAProvider>
        </QueryClientProvider>
      </div>
    </ThemeProvider>
  </StrictMode>,
);
