import { Box, Center, Container, Flex, For, Group, IconButton, Input, ScrollArea } from "@chakra-ui/react";
import { FaAngleDoubleRight } from "react-icons/fa";
import { useColorModeValue } from "@/components/ui/color-mode";
import { Api, type ChatMessage } from "@/api";
import { useCallback, useEffect, useRef, useState } from "react";
import Message from "@/components/app/Message";
import Header from "@/components/app/Header";

const App = () => {
  const api: Api = new Api();

  const background = useColorModeValue("#F1F0E8", "#1c1917")
  const border = useColorModeValue("#5b6568ff", "#4a413b")
  const shadow = useColorModeValue("rgba(137, 168, 178, 0.45)", "rgba(17, 16, 14, 0.99)")
  const inputBackground = useColorModeValue("rgb(229, 225, 218)", "rgba(80, 75, 70, 0.4)")
  const inputColor = useColorModeValue("#3b4b50ff", "#e6dfd6")
  const buttonBackground = useColorModeValue("rgba(137, 168, 178, 0.5)", "rgba(22, 15, 6, 0.76)")
  const iconColor = useColorModeValue("#5f5b59ff", "#e6dfd6");

  document.getElementById('root')!.style.backgroundColor = background;

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [hasMoreHistory, setHasMoreHistory] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const previousScrollHeightRef = useRef(0);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.getMessages(10).then((data: ChatMessage[]) => {
      setMessages(data);
    });

    const eventSource = api.subscribeToNewMessages((msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    return () => {
      eventSource.close();
    };

  }, []);

  useEffect(() => {
    if (!isLoadingHistory && previousScrollHeightRef.current > 0 && viewportRef.current) {
      const currentScrollHeight = viewportRef.current.scrollHeight;
      viewportRef.current.scrollTo({ top: currentScrollHeight - previousScrollHeightRef.current });
      previousScrollHeightRef.current = 0;
    }
  }, [messages, isLoadingHistory]);

  const fetchHistory = useCallback(async () => {
    if (isLoadingHistory || !hasMoreHistory) return;

    setIsLoadingHistory(true);

    const oldestMessageId = messages.length > 0 ? messages[0].id : undefined;

    if (oldestMessageId !== undefined) {
      const oldMessages = await api.fetchMessageHistory(10, oldestMessageId);

      if (oldMessages.length === 0) {
        setHasMoreHistory(false);
      } else {
        previousScrollHeightRef.current = viewportRef.current?.scrollHeight || 0;
        setMessages(prevMessages => [...oldMessages, ...prevMessages]);
      }
    } else {
      setHasMoreHistory(false);
    }

    setIsLoadingHistory(false);
  }, [isLoadingHistory, hasMoreHistory, messages]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = event.currentTarget;
    if (scrollTop === 0) {
      fetchHistory();
    }
  };

  const sendMessage = async () => {
    if (!inputRef.current?.value) return;
    const msg: ChatMessage = { message: inputRef.current.value };
    await api.sendMessage(msg);
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
            <Header />

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
                    <ScrollArea.Viewport ref={viewportRef} onScroll={handleScroll}
                    >
                      <ScrollArea.Content width="100%" display="flex" flexDirection="column" alignItems="flex-start" spaceY="32px">
                        {Array.isArray(messages) && messages.map((message, id) => (
                          <Message message={message} key={id} />
                        ))}
                        <div ref={messagesEndRef} />
                      </ScrollArea.Content>
                    </ScrollArea.Viewport>
                    <ScrollArea.Scrollbar borderRadius="0" backgroundColor={inputBackground} width="4px">
                      <ScrollArea.Thumb />
                    </ScrollArea.Scrollbar>
                    <ScrollArea.Corner />
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
                    <FaAngleDoubleRight />
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
