import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { UIEvent } from 'react';
import { getMessages, getPreviousMessages } from '@/features/chat/api/messages';
import { subscribeToMessages } from '@/features/chat/api/subscribe';
import type { Message } from '@/features/chat/types/message';
import { mergeMessages } from '@/features/chat/utils/merge-messages';
import { toaster } from '@/lib/notifications';

const PAGE_SIZE = 20;
const SCROLL_THRESHOLD = 40;

export function useChatHistory() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const pending = useRef<AbortController | null>(null);
    const hasMoreRef = useRef(true);
    const oldestId = useRef<number | undefined>(undefined);
    const followLatest = useRef(true);
    const anchor = useRef<{ element: HTMLElement; top: number } | null>(null);
    const viewportRef = useRef<HTMLDivElement>(null);

    const loadHistory = useCallback(async () => {
        if (pending.current || !hasMoreRef.current) return;
        const controller = new AbortController();
        pending.current = controller;
        setLoading(true);
        const cursor = oldestId.current;
        try {
            const page = cursor === undefined
                ? await getMessages(PAGE_SIZE, controller.signal)
                : await getPreviousMessages(cursor, PAGE_SIZE, controller.signal);
            if (controller.signal.aborted) return;
            const first = viewportRef.current?.querySelector<HTMLElement>('[data-message-id]');
            if (cursor !== undefined && first) {
                anchor.current = { element: first, top: first.getBoundingClientRect().top };
            }
            if (page.length) oldestId.current = page[0].id;
            hasMoreRef.current = page.length === PAGE_SIZE;
            setHasMore(hasMoreRef.current);
            // Preserve live events received while the history request was pending.
            setMessages(previous => mergeMessages(page, previous));
        } catch {
            if (!controller.signal.aborted) {
                toaster.create({ description: 'Не удалось загрузить историю. Попробуйте ещё раз.', type: 'error' });
            }
        } finally {
            if (pending.current === controller) {
                pending.current = null;
                setLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        let active = true;
        const unsubscribe = subscribeToMessages(message => {
            if (active) setMessages(previous => mergeMessages(previous, [message]));
        });
        void loadHistory();
        return () => {
            active = false;
            unsubscribe();
            pending.current?.abort();
            pending.current = null;
        };
    }, [loadHistory]);

    useLayoutEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;
        if (anchor.current) {
            viewport.scrollTop += anchor.current.element.getBoundingClientRect().top - anchor.current.top;
            anchor.current = null;
        } else if (followLatest.current) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }, [messages]);

    const onScroll = (event: UIEvent<HTMLDivElement>) => {
        const viewport = event.currentTarget;
        followLatest.current = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight < SCROLL_THRESHOLD;
        if (viewport.scrollTop < SCROLL_THRESHOLD) void loadHistory();
    };
    return { messages, loading, hasMore, loadHistory, viewportRef, onScroll };
}
