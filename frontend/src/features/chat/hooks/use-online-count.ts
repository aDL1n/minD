import { useEffect, useState } from 'react';
import { getOnlineCount } from '@/features/chat/api/get-online-count';
import { toaster } from '@/lib/notifications';

export function useOnlineCount() {
    const [online, setOnline] = useState(0);
    useEffect(() => {
        const controller = new AbortController();
        let timer: ReturnType<typeof setTimeout>;
        let errorReported = false;
        const refresh = async () => {
            try {
                const count = await getOnlineCount(controller.signal);
                if (!controller.signal.aborted) setOnline(count);
                errorReported = false;
            } catch {
                if (!controller.signal.aborted && !errorReported) {
                    toaster.create({ description: 'Не удалось получить число пользователей онлайн.', type: 'error' });
                    errorReported = true;
                }
            } finally {
                if (!controller.signal.aborted) timer = setTimeout(() => void refresh(), 15_000);
            }
        };
        void refresh();
        return () => {
            controller.abort();
            clearTimeout(timer);
        };
    }, []);
    return online;
}
