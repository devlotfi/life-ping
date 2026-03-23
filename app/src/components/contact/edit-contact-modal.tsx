import {
  Button,
  Form,
  Label,
  ListBox,
  Modal,
  Select,
  toast,
  type UseOverlayStateReturn,
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { InfoIcon, Pen } from "lucide-react";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { useFormik } from "formik";
import ValidatedTextField from "../validated-text-field";
import type { paths } from "../../__generated__/schema";
import { ApiContext } from "../../context/api-context";
import { $api } from "../../api/openapi-client";
import { renderFlag } from "../../utils/render-flag";

interface EditConnectionModalProps {
  state: UseOverlayStateReturn;
  contact: paths["/api/contacts"]["get"]["responses"]["200"]["content"]["application/json"][number];
}

export default function EditConnectionModal({
  state,
  contact,
}: EditConnectionModalProps) {
  const { t } = useTranslation();
  const { apiUrl, apiSecret } = useContext(ApiContext);
  const queryClient = useQueryClient();

  if (!apiUrl || !apiSecret) throw new Error("Missing api data");

  const { mutate, isPending } = $api.useMutation(
    "patch",
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

  const formik = useFormik({
    initialValues: {
      name: contact.name,
      email: contact.email || "",
      language: contact.language,
    },
    validationSchema: yup.object({
      name: yup.string().required(),
      email: yup.string().email().required(),
      language: yup.string().oneOf(["en", "fr", "ar"]).required(),
    }),
    onSubmit(values) {
      mutate({
        params: {
          path: {
            id: contact.id,
          },
        },
        body: {
          name: values.name,
          email: values.email,
          language: values.language,
        },
        baseUrl: apiUrl,
        headers: {
          "x-api-key": apiSecret,
        },
      });
    },
  });

  return (
    <Modal.Backdrop
      isOpen={state.isOpen}
      onOpenChange={state.setOpen}
      variant="blur"
    >
      <Modal.Container placement="center">
        <Modal.Dialog>
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
              <Pen className="size-5" />
            </Modal.Icon>
            <Modal.Heading>{t("editContact")}</Modal.Heading>
          </Modal.Header>
          <Modal.Body className="p-[0.1rem]">
            <Form
              onSubmit={formik.handleSubmit}
              className="flex flex-col gap-[0.5rem]"
            >
              <ValidatedTextField
                formik={formik}
                name="name"
                textFieldProps={{ isRequired: true }}
                labelProps={{ children: t("name") }}
              ></ValidatedTextField>
              <ValidatedTextField
                formik={formik}
                name="email"
                textFieldProps={{ isRequired: true, type: "email" }}
                labelProps={{ children: t("email") }}
              ></ValidatedTextField>
              <Select
                value={formik.values.language}
                onChange={(value) => formik.setFieldValue("language", value)}
              >
                <Label>{t("language")}</Label>
                <Select.Trigger className="py-[0.2rem]">
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    <ListBox.Item key={"ar"} id={"ar"} textValue={"العربية"}>
                      <div className="flex gap-[1rem] items-center">
                        <div className="flex justify-center items-center h-[2rem] w-[2rem] rounded-lg">
                          {renderFlag("ar")}
                        </div>
                        <div className="flex">العربية</div>
                      </div>
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item key={"fr"} id={"fr"} textValue={"Français"}>
                      <div className="flex gap-[1rem] items-center">
                        <div className="flex justify-center items-center h-[2rem] w-[2rem] rounded-lg">
                          {renderFlag("fr")}
                        </div>
                        <div className="flex">Français</div>
                      </div>
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item key={"en"} id={"en"} textValue={"English"}>
                      <div className="flex gap-[1rem] items-center">
                        <div className="flex justify-center items-center h-[2rem] w-[2rem] rounded-lg">
                          {renderFlag("en")}
                        </div>
                        <div className="flex">English</div>
                      </div>
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>

              <Button
                fullWidth
                isPending={isPending}
                type="submit"
                className="mt-[1rem]"
              >
                {t("edit")}
              </Button>
            </Form>
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
