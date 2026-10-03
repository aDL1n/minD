import { Group, IconButton, Input } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { FaAngleDoubleRight } from 'react-icons/fa';
import { sendMessage } from '@/features/chat/api/messages';
import { useChatColors } from '@/features/chat/hooks/use-chat-colors';
import { toaster } from '@/lib/notifications';

export function MessageComposer() {
    const colors = useChatColors();
    const inputRef = useRef<HTMLInputElement>(null);
    const sendingRef = useRef(false);
    const [sending, setSending] = useState(false);
    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const input = inputRef.current;
        if (!input?.value.trim() || sendingRef.current) return;
        const payload = input.value;
        sendingRef.current = true;
        setSending(true);
        try {
            await sendMessage({ payload });
            if (input.value === payload) input.value = '';
        } catch {
            toaster.create({ description: 'Не удалось отправить сообщение. Попробуйте ещё раз.', type: 'error' });
        } finally {
            sendingRef.current = false;
            setSending(false);
        }
    };
    return (
        <form onSubmit={onSubmit} style={{ width: '55%' }}>
            <Group width="100%" justifyContent="center" paddingY="1rem">
                <Input ref={inputRef} aria-label="Сообщение" boxShadow={`2px 2px 0px 0px ${colors.shadow}`}
                    variant="outline" backgroundColor={colors.surface} borderRadius="0"
                    borderStyle="solid" borderColor={colors.border} borderWidth="2px" color={colors.text} fontSize="md" />
                <IconButton type="submit" aria-label="Отправить сообщение" loading={sending}
                    boxShadow={`2px 2px 0px 0px ${colors.shadow}`} borderRadius="0" width="40px"
                    borderStyle="solid" borderColor={colors.border} borderWidth="2px"
                    color={colors.icon} backgroundColor={colors.button}>
                    <FaAngleDoubleRight />
                </IconButton>
            </Group>
        </form>
    );
}
