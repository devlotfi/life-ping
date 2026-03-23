import { Avatar, Button, cn } from "@heroui/react";
import { ChevronsLeft, Download, User } from "lucide-react";
import { useContext } from "react";
import { AppContext } from "../context/app-context";
import { PWAContext } from "../context/pwa-context";
import LogoSVG from "./svg/LogoSVG";
import { ApiContext } from "../context/api-context";
import { $api } from "../api/openapi-client";

export default function Navbar() {
  const { sidebarOpen, setSidebarOpen } = useContext(AppContext);
  const { beforeInstallPromptEvent } = useContext(PWAContext);
  const { apiUrl, apiSecret } = useContext(ApiContext);

  if (!apiUrl || !apiSecret) throw new Error("Missing api data");

  const { data } = $api.useQuery("get", "/api/name", {
    baseUrl: apiUrl,
    headers: {
      "x-api-key": apiSecret,
    },
  });

  return (
    <div className="flex flex-1 justify-between items-center min-h-[4rem] px-[0.7rem] bg-surface">
      <div className="flex items-center gap-[1rem]">
        <Button
          isIconOnly
          variant="outline"
          className="hidden lg:flex"
          size="lg"
          onPress={() => setSidebarOpen(!sidebarOpen)}
        >
          <ChevronsLeft
            className={cn(
              "size-[1.5rem] duration-300",
              !sidebarOpen && "rotate-180",
            )}
          />
        </Button>

        <div
          className={cn(
            "flex items-center gap-[1rem] duration-300 transition-opacity",
            sidebarOpen && "lg:opacity-0",
          )}
        >
          <LogoSVG className="h-[2.3rem] ml-[0.5rem]" />
          <div className="flex font-bold text-[14pt] md:text-[16pt] whitespace-nowrap">
            Life Ping
          </div>
        </div>
      </div>

      <div className="flex gap-[1rem]">
        {data ? (
          <div className="hidden md:flex items-center gap-[0.5rem]">
            <div className="flex">{data.name}</div>
            <Avatar>
              <Avatar.Fallback className="bg-background">
                <User />
              </Avatar.Fallback>
            </Avatar>
          </div>
        ) : null}

        {beforeInstallPromptEvent ? (
          <Button
            isIconOnly
            variant="outline"
            className="size-[2.5rem] text-foreground bg-[color-mix(in_srgb,var(--surface),transparent_60%)]"
            onPress={() => beforeInstallPromptEvent.prompt()}
          >
            <Download className="size-[1.4rem]"></Download>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
