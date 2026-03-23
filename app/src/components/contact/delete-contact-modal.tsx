import {
  Button,
  Modal,
  toast,
  type UseOverlayStateReturn,
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { InfoIcon, Trash } from "lucide-react";
import type { paths } from "../../__generated__/schema";
import { $api } from "../../api/openapi-client";
import { useContext } from "react";
import { ApiContext } from "../../context/api-context";

interface DeleteContactModalProps {
  state: UseOverlayStateReturn;
  contact: paths["/api/contacts"]["get"]["responses"]["200"]["content"]["application/json"][number];
}

export default function DeleteContactModal({
  state,
  contact,
}: DeleteContactModalProps) {
  const { t } = useTranslation();
  const { apiUrl, apiSecret } = useContext(ApiContext);
  const queryClient = useQueryClient();

  if (!apiUrl || !apiSecret) throw new Error("Missing api data");

  const { mutate, isPending } = $api.useMutation(
    "delete",
    "/api/contacts/{id}",
    {
      onError() {
        toast(t("error"), {
          indicator: <InfoIcon />,
          variant: "danger",
        });
      },
      onSuccess() {
        queryClient.resetQueries({
          queryKey: ["get", "/api/contacts"],
        });
        state.close();
      },
    },
  );

  return (
    <Modal.Backdrop
      variant="blur"
      isOpen={state.isOpen}
      onOpenChange={state.setOpen}
    >
      <Modal.Container placement="center">
        <Modal.Dialog className="sm:max-w-[360px]">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Icon className="bg-danger-soft text-danger-soft-foreground">
              <Trash className="size-5" />
            </Modal.Icon>
            <Modal.Heading>{t("deleteContact")}</Modal.Heading>
          </Modal.Header>
          <Modal.Body>
            <div className="flex">{t("deleteConfirmation")}</div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline" onPress={() => state.close()}>
              {t("cancel")}
            </Button>
            <Button
              variant="danger"
              isPending={isPending}
              onPress={() =>
                mutate({
                  params: {
                    path: {
                      id: contact.id,
                    },
                  },
                  baseUrl: apiUrl,
                  headers: {
                    "x-api-key": apiSecret,
                  },
                })
              }
            >
              {t("delete")}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
