import { Box, Button, Center, Container, Flex, Group, IconButton, Input, ScrollArea } from "@chakra-ui/react";
import { FaAngleDoubleRight } from "react-icons/fa";
import { useColorModeValue } from "@/components/ui/color-mode";
import { Api, type Message as ChatMessage } from "@/features/api";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { toaster } from "@/components/ui/toaster";
import Message from "@/components/app/Message";
import Header from "@/components/app/Header";

const api = new Api();
const PAGE_SIZE = 20;

const App = () => {

    const background = useColorModeValue("#F1F0E8", "#1c1917")
    const border = useColorModeValue("#5b6568ff", "#4a413b")
    const shadow = useColorModeValue("rgba(137, 168, 178, 0.45)", "rgba(17, 16, 14, 0.99)")
    const inputBackground = useColorModeValue("rgb(229, 225, 218)", "rgba(80, 75, 70, 0.4)")
    const inputColor = useColorModeValue("#3b4b50ff", "#e6dfd6")
    const buttonBackground = useColorModeValue("rgba(137, 168, 178, 0.5)", "rgba(22, 15, 6, 0.76)")
    const iconColor = useColorModeValue("#5f5b59ff", "#e6dfd6");

    document.getElementById('root')!.style.backgroundColor = background;

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const loadingRef = useRef(false);
    const hasMoreRef = useRef(true);
    const oldestIdRef = useRef<number | undefined>(undefined);
    const generationRef = useRef(0);
    const followLatestRef = useRef(true);
    const anchorRef = useRef<{ element: HTMLElement; top: number } | null>(null);
    const viewportRef = useRef<HTMLDivElement>(null);

    const inputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const loadHistory = useCallback(async () => {
        if (loadingRef.current || !hasMoreRef.current) return;
        loadingRef.current = true;
        setLoadingHistory(true);
        const generation = generationRef.current;
        const oldestId = oldestIdRef.current;
        try {
            const data = oldestId === undefined
                ? await api.getMessages(PAGE_SIZE)
                : await api.getPreviousMessages(oldestId, PAGE_SIZE);
            if (generation !== generationRef.current) return;

            const firstMessage = viewportRef.current?.querySelector<HTMLElement>('[data-message-id]');
            if (oldestId !== undefined && firstMessage) {
                anchorRef.current = { element: firstMessage, top: firstMessage.getBoundingClientRect().top };
            }
            if (data.length > 0) oldestIdRef.current = data[0].id;
            hasMoreRef.current = data.length === PAGE_SIZE;
            setHasMore(hasMoreRef.current);
            setMessages(previous => {
                const byId = new Map([...data, ...previous].map(message => [message.id, message]));
                return [...byId.values()].sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
            });
        } catch {
            if (generation === generationRef.current) {
                toaster.create({ description: "Не удалось загрузить историю. Попробуйте ещё раз.", type: "error" });
            }
        } finally {
            if (generation === generationRef.current) {
                loadingRef.current = false;
                setLoadingHistory(false);
            }
        }
    }, []);

    useEffect(() => {
        let active = true;
        void loadHistory();

        const eventSource = api.subscribe(
            (message) => {
                if (active) {
                    setMessages(previous => previous.some(item => item.id === message.id)
                        ? previous : [...previous, message]);
                }
            }
        );

        return () => {
            active = false;
            generationRef.current += 1;
            loadingRef.current = false;
            eventSource.close();
        };

    }, [loadHistory]);

    useLayoutEffect(() => {
        const viewport = viewportRef.current;
        const anchor = anchorRef.current;
        if (viewport && anchor) {
            viewport.scrollTop += anchor.element.getBoundingClientRect().top - anchor.top;
            anchorRef.current = null;
        } else if (viewport && followLatestRef.current) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async () => {
        if (!inputRef.current?.value) return;

        const message: ChatMessage = {payload: inputRef.current.value};
        await api.sendMessage(message);
        inputRef.current.value = "";
    };

    return (
        <>
            <Center>
                <Flex width="100vw" height="100vh">
                    <Container
                        display="flex"
                        flexDirection="column"
                        maxWidth="60%"
                        height="100%"
                    >
                        {/* Header */}
                        <Header/>

                        {/* Main */}
                        <Flex
                            flex="1"
                            height="100%"
                            minHeight="0"
                        >
                            <Box
                                width="calc(6rem + 2px)"
                                borderRightColor={border}
                                borderRightStyle="solid"
                                borderRightWidth="2px"
                                backgroundImage={`
                    repeating-linear-gradient(
                      45deg,
                      ${inputBackground} ,
                      ${inputBackground} 2px,
                      transparent 1px,
                      transparent 10px
                    )
                  `}
                            >
                            </Box>
                            <Container
                                flex="1"
                                display="flex"
                                flexDirection="column"
                                backgroundImage={`radial-gradient(${inputBackground} 1px, transparent 1px)`}
                                backgroundSize="12px 12px"
                                alignItems="center"
                                width="100%"
                                paddingInlineEnd="0"
                            >
                                <Box overflowY="hidden" flex="1" width="100%">
                                    <ScrollArea.Root variant="hover" paddingTop="10px">
                                        <ScrollArea.Viewport ref={viewportRef} style={{ overflowAnchor: 'none' }}
                                            onScroll={event => {
                                                const viewport = event.currentTarget;
                                                followLatestRef.current = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight < 40;
                                                if (viewport.scrollTop < 40) void loadHistory();
                                            }}>
                                            <ScrollArea.Content width="100%" display="flex" flexDirection="column"
                                                                alignItems="flex-start" spaceY="32px">
                                                {hasMore && (
                                                    <Button variant="ghost" size="sm" alignSelf="center"
                                                        loading={loadingHistory} onClick={() => void loadHistory()}>
                                                        Загрузить ещё
                                                    </Button>
                                                )}
                                                {messages.map(message => (
                                                    <Box key={message.id} data-message-id={message.id}>
                                                        <Message message={message}/>
                                                    </Box>
                                                ))}
                                                <div ref={messagesEndRef}/>
                                            </ScrollArea.Content>
                                        </ScrollArea.Viewport>
                                        <ScrollArea.Scrollbar borderRadius="0" backgroundColor={inputBackground}
                                                              width="4px">
                                            <ScrollArea.Thumb/>
                                        </ScrollArea.Scrollbar>
                                        <ScrollArea.Corner/>
                                    </ScrollArea.Root>
                                </Box>

                                <Group width="55%" justifyContent="center" paddingY="1rem">
                                    <Input
                                        ref={inputRef}
                                        boxShadow={`2px 2px 0px 0px ${shadow}`}
                                        variant="outline"
                                        backgroundColor={inputBackground}
                                        borderRadius="0px"
                                        borderStyle="solid"
                                        borderColor={border}
                                        borderWidth="2px"
                                        color={inputColor}
                                        fontSize="md"
                                    />
                                    <IconButton
                                        boxShadow={`2px 2px 0px 0px ${shadow}`}
                                        borderRadius="0"
                                        width="40px"
                                        borderStyle="solid"
                                        borderColor={border}
                                        borderWidth="2px"
                                        color={iconColor}
                                        backgroundColor={buttonBackground}
                                        onClick={() => {
                                            sendMessage()
                                        }}
                                    >
                                        <FaAngleDoubleRight/>
                                    </IconButton>
                                </Group>
                            </Container>
                        </Flex>
                    </Container>
                </Flex>
            </Center>
        </>
    );
};

export default App;
