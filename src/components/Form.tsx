"use client";
import { notificationService } from "@/services/notification.service";
import { NotificationType } from "@/types/notification";
import { PlusIcon } from "@radix-ui/react-icons";
import {
  Flex,
  Text,
  Select,
  Dialog,
  Button,
  TextField,
  Spinner,
} from "@radix-ui/themes";
import { Fragment, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z, ZodError } from "zod";

interface INotificationForm {
  releaseNumber?: number;
  personName?: string;
  update?: string;
}

const notificationFormSchema = z.object({
  releaseNumber: z.number().optional(),
  personName: z.string().optional(),
  update: z.string().optional(),
}).refine((data) => {
  return (data.releaseNumber != undefined && data.update != undefined && data.update.length > 0) || data.personName != undefined;
}, {
  message: "Either releaseNumber and update should not be empty for PLATFORM_UPDATE, or personName for other types",
  path: ["releaseNumber", "update", "personName"],
});

export const CreateNotificationButton = ({open, setOpen, fetchNotifications}: {open: boolean, setOpen: (open: boolean) => void, fetchNotifications: () => void}) => {
  const {
    reset: reset,
    handleSubmit: handleSubmit,
    setValue: setValue,
    formState: { errors },
    setError: setError,
  } = useForm<INotificationForm>();

  const [type, setType] = useState<NotificationType>(
    NotificationType.PLATFORM_UPDATE,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const onSubmitPlatform: SubmitHandler<INotificationForm> = async (
    data,
  ) => {
    try {
      const validatedData = notificationFormSchema.parse(data);
      await createNotification(validatedData);
    } catch (error) {
      if (error instanceof ZodError) {
        const errorObject = JSON.parse(error.message);
        setError("root", { message: errorObject[0].message });
      } else {
        setError("root", { message: "An unknown error occurred" });
      }
    }
  };

  const resetForms = () => {
    reset();
    setType(NotificationType.PLATFORM_UPDATE);
  }

  const createNotification = async (data: INotificationForm) => {
    setLoading(true);
    await notificationService.create({ ...data, type });
    setLoading(false);
    setOpen(false);
    fetchNotifications();
    resetForms();
  }
  

  return (
    <Dialog.Root open={open}>
      <Dialog.Trigger>
        <Button onClick={() => setOpen(true)}>
          <PlusIcon />
        </Button>
      </Dialog.Trigger>
      <Dialog.Content maxWidth="450px">
        <Dialog.Title>Create new notification</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Create a new notification to send to users.
        </Dialog.Description>

        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Type
            </Text>
            <Select.Root
              defaultValue={NotificationType.PLATFORM_UPDATE}
              onValueChange={(value) => setType(value as NotificationType)}
            >
              <Select.Trigger />
              <Select.Content>
                <Select.Group>
                  <Select.Label>Notification type</Select.Label>
                  {Object.values(NotificationType).map((type) => (
                    <Fragment key={`key-${type}`}>
                      <Select.Item key={type} value={type}>
                        {type}
                      </Select.Item>
                    </Fragment>
                  ))}
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </label>
          {type === NotificationType.PLATFORM_UPDATE && (
            <>
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Release number
                </Text>
                <TextField.Root
                  type="number"
                  onChange={(e) =>
                    setValue("releaseNumber", Number(e.target.value))
                  }slot=""
                  placeholder="Enter release number"
                />
                {errors.releaseNumber && (
                  <Text color="red">Release number is required</Text>
                )}
              </label>
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Update
                </Text>
                <TextField.Root
                  onChange={(e) => setValue("update", e.target.value)}
                  placeholder="Enter update"
                />
                {errors.update && (
                  <Text color="red">Update is required</Text>
                )}
              </label>
            </>
          )}
          {type !== NotificationType.PLATFORM_UPDATE && (
            <>
              <label>
                <Text as="div" size="2" mb="1" weight="bold">
                  Your name
                </Text>
                <TextField.Root
                  onChange={(e) => setValue("personName", e.target.value)}
                  placeholder="Enter your name"
                />
                {errors.personName && (
                  <Text color="red">Your name is required</Text>
                )}
              </label>
              {/* Uncomment to let people choose an avatar */}
              {/* <label>
                <Text>Avatar link</Text>
                <TextField.Root
                  onChange={(e) => setValueOthers("avatarLink", e.target.value)}
                  defaultValue={defaultValuesOthers.avatarLink || ""}
                  placeholder="Enter avatar link"
                />
              </label> */}
            </>
          )}
          {errors.root && (
            <Text color="red">{errors.root.message}</Text>
          )}
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray" onClick={() => {setOpen(false); resetForms()}}>
              Cancel
            </Button>
          </Dialog.Close>
          <Button
            onClick={handleSubmit(onSubmitPlatform)}
            disabled={loading}
          >
            {loading ? <Spinner /> : "Create"}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};
