import axios from "axios";
import { toaster } from "@/components/ui/toaster";

export interface Message {
    id?: number;
    payload: string;
    timestamp?: number;
}

export class Api {
    private baseUrl = "/api/v1";

    async getMessages(limit: number): Promise<Message[]> {
        const response = await axios.get<Message[]>(`${this.baseUrl}/message/get`, {
            params: { limit },
        });


        return response.data;
    }

    async sendMessage(message: Message): Promise<void> {
        await axios.post(
            `${this.baseUrl}/message/send`,
            JSON.stringify(message),
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }

    subscribe(
        onMessage: (message: Message) => void,
        onError?: (error: Event) => void
    ) {
        const eventSource = new EventSource(`${this.baseUrl}/subscribe`);
        eventSource.onmessage = (event) => {
            const message: Message = JSON.parse(event.data);
            console.log(message);
            onMessage(message);
        };

        eventSource.onopen = () => {
            console.log("Event connected")
        };

        eventSource.addEventListener("heartbeat", () => {
            console.log("Heartbeat received");
        });

        eventSource.onerror = (error) => {
            console.error("SSE error", error);

            if (onError) onError(error);
            // EventSource reconnects automatically after a timeout or network error.
        };
        return eventSource;
    }

    async fetchMessageHistory(limit: number, beforeId?: number): Promise<Message[]> {
        if (beforeId) {
            beforeId = beforeId - 1;

            const response = await axios.get(`${this.baseUrl}/message/get/previous`, {
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
            const response = await axios.get(`${this.baseUrl}/online`);
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
