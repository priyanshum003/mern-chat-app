import { Message } from '../types/chat';

export const truncateMessage = (message: string, maxLength: number): string => {
  if (message.length <= maxLength) return message;
  return message.slice(0, maxLength) + '...';
};

export const formatMessageTime = (createdAt: string): string => {
  const messageDate = new Date(createdAt);

  const formatter = new Intl.DateTimeFormat('default', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true // Use 12-hour format
  });

  return formatter.format(messageDate);
}

export const groupMessagesByDate = (messages: Message[]): { [key: string]: Message[] } => {
  return messages.reduce((groups, message) => {
    const date = new Date(message.createdAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as { [key: string]: Message[] });
};

export const formatSidebarDate = (date: string): string => {
  const messageDate = new Date(date);
  const today = new Date();

  // Check if the message date is today
  if (messageDate.toDateString() === today.toDateString()) {
    // If the date is today, return the time
    const timeFormatter = new Intl.DateTimeFormat('default', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true // Use 12-hour format
    });
    return timeFormatter.format(messageDate);
  } else {
    // Otherwise, return the date in 'Month day' format
    const dateFormatter = new Intl.DateTimeFormat('default', {
      month: 'short',
      day: 'numeric'
    });
    return dateFormatter.format(messageDate);
  }
}
