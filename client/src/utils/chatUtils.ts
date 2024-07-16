// utils/chatUtils.ts
import { Chat } from '../types/chat';
import { User } from '../types/auth';

export const getChatName = (chat: Chat, currentUser: User): string => {

    if (chat.isGroupChat) {
        return chat.chatName || 'Unnamed Group';
    } else {
        const otherUser = chat.users.find(user => user._id !== currentUser?._id);
        const returnName = otherUser ? otherUser.name : 'Unknown User';
        return returnName;
    }
};

export const getChatDescription = (chat: Chat, currentUser: User): string => {

    if (chat.isGroupChat) {
        return `${chat.users.length} members`;
    } else {
        const otherUser = chat.users.find(user => user._id !== currentUser?._id);
        const description = otherUser ? otherUser.email : 'No description available';
        return description;
    }
};

export const getChatAvatar = (chat: Chat, currentUser: User): string | undefined => {

    if (chat.isGroupChat) {
        return chat.groupAvatar;
    } else {
        const otherUser = chat.users.find(user => user._id !== currentUser?._id);
        const avatar = otherUser?.avatar;
        return avatar;
    }
};
