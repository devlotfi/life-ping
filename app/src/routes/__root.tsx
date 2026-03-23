import * as React from "react";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";
import BottomTabs from "../components/bottom-tabs";
import RouteLoading from "../components/route-loading";
import { AppContext } from "../context/app-context";

export const Route = createRootRouteWithContext()({
  component: RootComponent,
});

function RootComponent() {
  const { scrollRef } = React.useContext(AppContext);

  return (
    <React.Fragment>
      <RouteLoading></RouteLoading>

      <div className="flex flex-1">
        <Sidebar></Sidebar>
        <div className="flex flex-1 flex-col min-w-0">
          <Navbar></Navbar>
          <div
            ref={scrollRef}
            className="flex h-[calc(100dvh-4rem-5.5rem)] md:h-[calc(100dvh-4rem)] min-w-0 overflow-x-hidden overflow-y-auto bg-background border md:border-b-0 md:border-r-0 border-border rounded-4xl md:rounded-br-none"
            style={{
              scrollbarColor:
                "color-mix(in srgb, var(--accent), transparent 30%) color-mix(in srgb, var(--surface), transparent 80%)",
              scrollbarWidth: "thin",
            }}
          >
            <Outlet />
          </div>
          <BottomTabs></BottomTabs>
        </div>
      </div>
    </React.Fragment>
  );
}
