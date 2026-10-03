import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { ThemeProvider } from 'next-themes';
import type { PropsWithChildren } from 'react';
import { Toaster } from '@/components/ui/toaster';

export function AppProvider({ children }: PropsWithChildren) {
    return (
        <ChakraProvider value={defaultSystem}>
            <ThemeProvider attribute="class" disableTransitionOnChange>
                <Toaster />
                {children}
            </ThemeProvider>
        </ChakraProvider>
    );
}
