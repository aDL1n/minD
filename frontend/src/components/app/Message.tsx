import { Box } from "@chakra-ui/react";
import { formatUnixTimestamp } from "@/util";
import type { ChatMessage } from "@/api";
import { useColorModeValue } from "@/components/ui/color-mode";
import type { FC } from "react";

interface MessageProps {
    message: ChatMessage
}

const Message: FC<MessageProps> = ({ message }) => {

    const messageBackground = useColorModeValue("rgb(229, 225, 218)", "#2a2623")
    const messageBorder = useColorModeValue("#5f5b59ff", "#4a413b")
    const messageText = useColorModeValue("#3b4b50ff", "#e6dfd6")
    const shadow = useColorModeValue("rgba(137, 168, 178, 0.45)", "rgba(17, 16, 14, 0.99)")

    return (
        <Box
            backgroundColor={messageBackground}
            border="solid 2px"
            borderColor={messageBorder}
            boxShadow={`3px 3px 0px 0px ${shadow}`}
            padding="12px"
            marginInlineEnd="10px"
            wordBreak="break-word"
            color={messageText}
            fontSize="l"
            width="auto"
        >
            {message.message}
            <Box
                color="gray.500"
                fontSize="0.7rem"
                display="flex"
                justifyContent="flex-end"
                width="100%"
            >
                {message.timestamp && formatUnixTimestamp(message.timestamp)}
            </Box>
        </Box>
    );
}

export default Message;