import { apiClient } from '@/lib/api-client';

export async function getOnlineCount(signal?: AbortSignal): Promise<number> {
    const response = await apiClient.get<number>('/online', { signal });
    return response.data;
}
