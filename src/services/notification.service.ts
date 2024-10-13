import { INotificationCreateData } from "@/types/notification";
import axios from "axios";



export class NotificationService {
    public async create(data: INotificationCreateData) {
        const response = await axios.post("/api/notification", data);
        return response.data;
    }
    public async getAll() {
        const response = await axios.get("/api/notification");
        return response.data;
    }
    public async read(id: string) {
        const response = await axios.put(`/api/notification/read/`, {id});
        return response.data;
    }
    public async voice() {
        const response = await axios.get("/api/notification/voice", {responseType: 'arraybuffer'});
        return response.data;
    }
}

export const notificationService = new NotificationService();

