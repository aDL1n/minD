import { Box, Button, ScrollArea } from '@chakra-ui/react';
import { Message } from '@/features/chat/components/message';
import { useChatHistory } from '@/features/chat/hooks/use-chat-history';
import { useChatColors } from '@/features/chat/hooks/use-chat-colors';

export function MessageList() {
    const { messages, loading, hasMore, loadHistory, viewportRef, onScroll } = useChatHistory();
    const colors = useChatColors();
    return (
        <Box overflowY="hidden" flex="1" width="100%">
            <ScrollArea.Root variant="hover" paddingTop="10px" height="100%">
                <ScrollArea.Viewport ref={viewportRef} style={{ overflowAnchor: 'none' }} onScroll={onScroll}>
                    <ScrollArea.Content width="100%" display="flex" flexDirection="column"
                        alignItems="flex-start" spaceY="32px" aria-label="История сообщений" aria-busy={loading}>
                        {hasMore && (
                            <Button variant="ghost" size="sm" borderRadius="0" borderStyle="solid"
                                borderColor={colors.border} borderWidth="2px" alignSelf="center"
                                backgroundColor={colors.surface} loading={loading} onClick={() => void loadHistory()}>
                                Загрузить ещё
                            </Button>
                        )}
                        {messages.map(message => (
                            <Box key={message.id} data-message-id={message.id}>
                                <Message message={message} />
                            </Box>
                        ))}
                    </ScrollArea.Content>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar borderRadius="0" backgroundColor={colors.surface} width="4px">
                    <ScrollArea.Thumb />
                </ScrollArea.Scrollbar>
                <ScrollArea.Corner />
            </ScrollArea.Root>
        </Box>
    );
}
