import { apiClient } from '@/lib/api-client';
import type { Message, SendMessageInput } from '@/features/chat/types/message';

export async function getMessages(limit: number, signal?: AbortSignal): Promise<Message[]> {
    const response = await apiClient.get<Message[]>('/message/get', { params: { limit }, signal });
    return response.data;
}

export async function getPreviousMessages(beforeId: number, limit: number, signal?: AbortSignal): Promise<Message[]> {
    const response = await apiClient.get<Message[]>('/message/get/previous', {
        // The backend cursor is inclusive; exclude the oldest displayed message.
        params: { beforeId: beforeId - 1, limit },
        signal,
    });
    return response.data;
}

export async function sendMessage(message: SendMessageInput): Promise<void> {
    await apiClient.post('/message/send', message);
}
