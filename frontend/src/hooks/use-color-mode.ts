import { useTheme } from 'next-themes';

export function useColorMode() {
    const { resolvedTheme, forcedTheme, setTheme } = useTheme();
    const colorMode = (forcedTheme ?? resolvedTheme) === 'dark' ? 'dark' : 'light';

    return {
        colorMode,
        setColorMode: setTheme,
        toggleColorMode: () => setTheme(colorMode === 'dark' ? 'light' : 'dark'),
    };
}

export function useColorModeValue<T>(light: T, dark: T): T {
    return useColorMode().colorMode === 'dark' ? dark : light;
}
