import { createFileRoute } from "@tanstack/react-router";
import RequiredSubscriptionProvider from "../provider/required-subscription-provider";
import { Button, Card, useOverlayState } from "@heroui/react";
import { $api } from "../api/openapi-client";
import { useContext } from "react";
import { ApiContext } from "../context/api-context";
import SectionHeader from "../components/section-header";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import LoadingScreen from "../components/loading-screen";
import ErrorScreen from "../components/error-screen";
import EmptySVG from "../components/svg/EmptySVG";
import AddContactModal from "../components/contact/add-contact-modal";
import ContactComponent from "../components/contact/contact-component";

export const Route = createFileRoute("/contacts")({
  component: RouteComponent,
});

function Contacts() {
  const { t } = useTranslation();
  const { apiUrl, apiSecret } = useContext(ApiContext);

  if (!apiUrl || !apiSecret) throw new Error("Missing api data");

  const addContactModalState = useOverlayState();

  const { data, isLoading, isError } = $api.useQuery("get", "/api/contacts", {
    baseUrl: apiUrl,
    headers: {
      "x-api-key": apiSecret,
    },
  });

  return (
    <>
      <AddContactModal state={addContactModalState}></AddContactModal>

      <div className="flex flex-1 flex-col items-center">
        <div className="flex flex-1 flex-col max-w-screen-md w-full">
          <div className="flex justify-between items-center z-10 py-[1rem] px-[1rem]">
            <SectionHeader icon="users">{t("contacts")}</SectionHeader>

            <Button
              isIconOnly
              variant="outline"
              className="size-[3rem] bg-surface"
              onPress={() => addContactModalState.open()}
            >
              <Plus className="size-[2rem]"></Plus>
            </Button>
          </div>

          {isLoading ? (
            <LoadingScreen></LoadingScreen>
          ) : isError ? (
            <ErrorScreen></ErrorScreen>
          ) : data && data.length ? (
            <div className="flex flex-col flex-1 mt-[0.5rem] gap-[1rem] px-[1rem] pb-[5rem]">
              {data.map((contact) => (
                <ContactComponent
                  key={contact.id}
                  contact={contact}
                ></ContactComponent>
              ))}
            </div>
          ) : (
            <div className="flex flex-1 justify-center items-center px-[1rem]">
              <Card className="max-w-md w-full">
                <Card.Content className="text-center items-center flex-col gap-[1rem] px-[0.5rem]">
                  <EmptySVG className="h-[10rem]" />
                  <div className="flex text-[18pt] font-bold">
                    {t("emptyList")}
                  </div>
                </Card.Content>

                <Card.Footer className="justify-center py-[0.5rem]">
                  <Button
                    variant="primary"
                    onPress={() => addContactModalState.open()}
                  >
                    <Plus></Plus>
                    {t("addContact")}
                  </Button>
                </Card.Footer>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function RouteComponent() {
  return (
    <RequiredSubscriptionProvider>
      <Contacts></Contacts>
    </RequiredSubscriptionProvider>
  );
}
