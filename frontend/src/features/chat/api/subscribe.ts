import { env } from '@/config/env';
import type { Message } from '@/features/chat/types/message';

export function subscribeToMessages(onMessage: (message: Message) => void) {
    const source = new EventSource(`${env.apiUrl}/subscribe`);
    source.onmessage = event => onMessage(JSON.parse(event.data) as Message);
    // Leave reconnection to EventSource; only close when the subscriber unmounts.
    return () => source.close();
}
