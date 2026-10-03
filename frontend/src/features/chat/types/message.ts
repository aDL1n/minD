export interface Message {
    id: number;
    payload: string;
    timestamp: number;
}

export type SendMessageInput = Pick<Message, 'payload'>;
