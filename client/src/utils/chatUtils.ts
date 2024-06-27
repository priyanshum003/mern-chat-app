import { Chat } from '../types/chat';
import { User } from '../types/auth';

export const getChatName = (chat: Chat, currentUser: User ): string => {
    if (chat.isGroupChat) {
        return chat.chatName!;
    } else {
        const otherUser = chat.users.find(user => user._id !== currentUser?._id);
        return otherUser ? otherUser.name : 'Unknown User';
    }
};

export const getChatDescription = (chat: Chat, currentUser: User | null): string => {
    if (chat.isGroupChat) {
        return `${chat.users.length} members`;
    } else {
        const otherUser = chat.users.find(user => user._id !== currentUser?._id);
        return otherUser ? otherUser.email : '';
    }
};
