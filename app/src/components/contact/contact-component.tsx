import { Button, Card, useOverlayState } from "@heroui/react";
import DeleteContactModal from "./delete-contact-modal";
import EditConnectionModal from "./edit-contact-modal";
import { Pen, Trash } from "lucide-react";
import type { paths } from "../../__generated__/schema";
import DataRow from "../data-row";

interface ContactProps {
  contact: paths["/api/contacts"]["get"]["responses"]["200"]["content"]["application/json"][number];
}

export default function ContactComponent({ contact }: ContactProps) {
  const editState = useOverlayState();
  const deleteState = useOverlayState();

  return (
    <Card className="flex-row relative overflow-visible">
      <Card.Content>
        <DeleteContactModal
          state={deleteState}
          contact={contact}
        ></DeleteContactModal>
        <EditConnectionModal
          state={editState}
          contact={contact}
        ></EditConnectionModal>

        <div className="flex flex-col md:flex-row gap-[1rem]">
          <div className="flex flex-col flex-1">
            <div className="flex font-bold text-[15pt] break-all">
              {contact.name}
            </div>
            <DataRow name="E-mail" value={contact.email || ""}></DataRow>
          </div>

          <div className="flex md:flex-col gap-[0.3rem]">
            <Button
              isIconOnly
              variant="outline"
              onPress={() => editState.open()}
            >
              <Pen></Pen>
            </Button>
            <Button
              isIconOnly
              variant="outline"
              onPress={() => deleteState.open()}
            >
              <Trash></Trash>
            </Button>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}
