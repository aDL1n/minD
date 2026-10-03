import { Box, Center, Container, Flex } from '@chakra-ui/react';
import { ChatHeader } from '@/features/chat/components/chat-header';
import { MessageList } from '@/features/chat/components/message-list';
import { MessageComposer } from '@/features/chat/components/message-composer';
import { useChatColors } from '@/features/chat/hooks/use-chat-colors';
import { useOnlineCount } from '@/features/chat/hooks/use-online-count';

export function Chat() {
    const colors = useChatColors();
    const online = useOnlineCount();
    return (
        <Center backgroundColor={colors.background}>
            <Flex width="100vw" height="100vh">
                <Container display="flex" flexDirection="column" maxWidth="60%" height="100%">
                    <ChatHeader online={online} />
                    <Flex flex="1" height="100%" minHeight="0">
                        <Box width="calc(6rem + 2px)" borderRightColor={colors.border}
                            borderRightStyle="solid" borderRightWidth="2px"
                            backgroundImage={`repeating-linear-gradient(45deg, ${colors.surface}, ${colors.surface} 2px, transparent 1px, transparent 10px)`} />
                        <Container flex="1" display="flex" flexDirection="column"
                            backgroundImage={`radial-gradient(${colors.surface} 1px, transparent 1px)`}
                            backgroundSize="12px 12px" alignItems="center" width="100%" paddingInlineEnd="0">
                            <MessageList />
                            <MessageComposer />
                        </Container>
                    </Flex>
                </Container>
            </Flex>
        </Center>
    );
}
