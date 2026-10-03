import axios from "axios";
import { toaster } from "@/components/ui/toaster";

export interface ChatMessage {
    id?: number;
    message: string;
    timestamp?: number;
}

export class Api {
    private baseUrl = "http://localhost:8080/api";

    constructor() {
        this.getOnlineCount();
    }

    async getMessages(limit: number): Promise<ChatMessage[]> {
        const response = await axios.get<ChatMessage[]>(`${this.baseUrl}/message/get`, {
            params: { limit },
        });


        return response.data;
    }

    async sendMessage(message: ChatMessage): Promise<ChatMessage> {
        const response = await axios.post(
            `${this.baseUrl}/message/send`,
            JSON.stringify(message),
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    }

    subscribeToNewMessages(
        onMessage: (msg: ChatMessage) => void,
        onError?: (err: Event) => void
    ) {
        const eventSource = new EventSource(`${this.baseUrl}/message/subscribe`);
        eventSource.onmessage = (event) => {
            const message: ChatMessage = JSON.parse(event.data);
            console.log(message);
            onMessage(message);
        };

        eventSource.onopen = () => {
            console.log("Event connected")
        };

        eventSource.addEventListener("heartbeat", () => {
            console.log("Heartbeat received");
        });

        eventSource.onerror = (err) => {
            console.error("SSE error", err);
            if (onError) onError(err);
            eventSource.close();
        };
        return eventSource;
    }

    async fetchMessageHistory(limit: number, beforeId?: number): Promise<ChatMessage[]> {
        if (beforeId) {
            beforeId = beforeId - 1;

            const response = await axios.get(`${this.baseUrl}/message/get/prev`, {
                params: {
                   beforeId, limit
                }
            });

            return response.data;
        }

        return [];
    }

    async getOnlineCount(): Promise<number> {
        try {
            const response = await axios.get(`${this.baseUrl}/`);
            return response.data;
        } catch {
            toaster.create({
            description: "Не удалось подключится к серверу",
            type: "error",
            })
        }

        return 0;
    }
}
