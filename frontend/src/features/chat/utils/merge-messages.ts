import type { Message } from '../types/message.ts';

export function mergeMessages(...pages: readonly Message[][]): Message[] {
    const byId = new Map(pages.flat().map(message => [message.id, message]));
    return [...byId.values()].sort((a, b) => a.id - b.id);
}
