export interface IMessage {
    _id: string;
    sender: string;
    content: string;
    chatId: string;
    createdAt: Date;
}
