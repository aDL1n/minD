import { useColorModeValue } from '@/hooks/use-color-mode';

const light = {
    background: '#F1F0E8', border: '#5b6568ff', shadow: 'rgba(137, 168, 178, 0.45)',
    surface: 'rgb(229, 225, 218)', text: '#3b4b50ff', button: 'rgba(137, 168, 178, 0.5)', icon: '#5f5b59ff',
};
const dark: typeof light = {
    background: '#1c1917', border: '#4a413b', shadow: 'rgba(17, 16, 14, 0.99)',
    surface: 'rgba(80, 75, 70, 0.4)', text: '#e6dfd6', button: 'rgba(22, 15, 6, 0.76)', icon: '#e6dfd6',
};

export function useChatColors() {
    return useColorModeValue(light, dark);
}
