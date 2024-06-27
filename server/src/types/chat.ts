export interface IChat {
    _id: string;
    users: string[];
    messages: string[];
    isGroupChat: boolean;
    chatName?: string;
    groupAdmin?: string;
    groupAvatar?: string;
}
