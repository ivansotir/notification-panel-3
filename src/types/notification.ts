export enum NotificationType {
  PLATFORM_UPDATE = "Platform Update",
  COMMENT_TAG = "Comment Tag",
  ACCESS_GRANTED = "Access Granted",
  JOIN_WORKSPACE = "Join Workspace",
}
  
export interface INotification {
  id: string;
  type: NotificationType;
  avatarLink?: string;
  read: boolean;
  personName?: string;
  releaseNumber?: number;
  update?: string;
  createdAt: string;
}

export interface INotificationCreateData {
  type: NotificationType;
  avatarLink?: string;
  personName?: string;
  releaseNumber?: number;
  update?: string;
}