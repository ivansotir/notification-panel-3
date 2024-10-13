import { notificationService } from "@/services/notification.service";
import { INotification, NotificationType } from "@/types/notification";
import { DashboardIcon } from "@radix-ui/react-icons";
import { Avatar, Flex, Text } from "@radix-ui/themes";
import { useRouter } from "next/navigation";

const colors = {
  [NotificationType.PLATFORM_UPDATE]: "bg-blue-100",
  [NotificationType.COMMENT_TAG]: "bg-green-100",
  [NotificationType.ACCESS_GRANTED]: "bg-purple-100",
  [NotificationType.JOIN_WORKSPACE]: "bg-orange-100",
};

const getNotificationMessage = (notification: INotification) => {
  switch (notification.type) {
    case NotificationType.PLATFORM_UPDATE:
      return notification.update;
    case NotificationType.COMMENT_TAG:
      return <Text><b>{notification.personName}</b> tagged you in a comment</Text>;
    case NotificationType.ACCESS_GRANTED:
      return <Text><b>{notification.personName}</b> has shared a chat with you</Text>;
    case NotificationType.JOIN_WORKSPACE:
      return <Text><b>{notification.personName}</b> has joined your workspace</Text>;
  }
};

export default function NotificationCard({
  notification,
  fetchNotifications,
}: {
  notification: INotification;
  fetchNotifications: () => void;
}) {
  const router = useRouter();
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    notificationService.read(notification.id);
    fetchNotifications();
    switch (notification.type) {
      case NotificationType.ACCESS_GRANTED:
        router.push(`/chats`);
        break;
      case NotificationType.JOIN_WORKSPACE:
        router.push(`/workspace`);
        break;
      case NotificationType.COMMENT_TAG:
        router.push(`/comments`);
        break;
      case NotificationType.PLATFORM_UPDATE:
        alert(notification.update);
        break;
    }
  };

  return (
    <Flex
      direction="column"
      className={`p-2 rounded-md border border-gray-200 cursor-pointer ${colors[notification.type]} hover:bg-gray-100`}
      onClick={handleClick}
    >
      <Flex direction="row" justify="between" align="center">
        <Flex direction="row" gap="2" align="center">
          {notification.type === NotificationType.PLATFORM_UPDATE && (
            <DashboardIcon />
          )}
          {notification.type !== NotificationType.PLATFORM_UPDATE && (
            <Avatar
              src={notification.avatarLink || ""}
              fallback={notification.personName?.charAt(0) || ""}
            />
          )}
          <Text className="font-semibold">{notification.type} {notification.type === NotificationType.PLATFORM_UPDATE && `#${notification.releaseNumber}`}</Text>
        </Flex>
        <Text>{notification.createdAt.split("T")[0]}</Text>
      </Flex>
      <Text>{getNotificationMessage(notification)}</Text>
    </Flex>
  );
}
