import type {FC} from "react";
import {Box, ClientOnly, Heading, IconButton} from "@chakra-ui/react";
import {LuMoon, LuSun } from "react-icons/lu";
import { useColorMode, useColorModeValue } from "@/components/ui/color-mode";

const Header: FC = () => {
    const { toggleColorMode, colorMode } = useColorMode()

    const border = useColorModeValue("#5b6568ff", "#4a413b")
    const heading = useColorModeValue("#20353bff", "#e6dfd6")
    const headingBackground = useColorModeValue("rgb(229, 225, 218)", "rgba(80, 75, 70, 0.4)")
    const buttonBackground = useColorModeValue("rgb(229, 225, 218)", "#2a2623")

    return (
        <Box
            borderBottomColor={border}
            borderBottomStyle="solid"
            borderBottomWidth="2px"
            display="flex"
        >
            <Heading
                size="5xl"
                fontFamily="Jun"
                borderRightColor={border}
                borderRightStyle="solid"
                borderRightWidth="2px"
                width="calc(8rem + 2px)"
                textAlign="center"

                backgroundImage={`radial-gradient(${headingBackground} 1px, transparent 1px)`}
                backgroundSize="12px 12px"
                color={heading}
            >
                minD
            </Heading>
            <Box
                flex="1"
                backgroundImage={`
                    repeating-linear-gradient(
                      45deg,
                      ${headingBackground} 0,
                      ${headingBackground} 2px,
                      transparent 1px,
                      transparent 10px
                    )
                  `}
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
            >
                <ClientOnly>
                    <IconButton
                        onClick={toggleColorMode}
                        variant="outline"
                        size="sm"
                        borderRadius="0"
                        backgroundColor={buttonBackground}
                        borderColor={border}
                        borderWidth="2px"
                        marginInlineEnd="24px"
                    >
                        {colorMode === "light" ? <LuSun /> : <LuMoon />}
                    </IconButton>
                </ClientOnly>
            </Box>
        </Box>
    )
}

export default Header;