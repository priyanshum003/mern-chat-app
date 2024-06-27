import mongoose, { Schema, Document } from 'mongoose';
import { IChat } from '../types/chat';

const ChatSchema: Schema = new Schema({
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  }],
  isGroupChat: {
    type: Boolean,
    default: false,
  },
  chatName: {
    type: String,
    required: function (this: IChat) { return this.isGroupChat; },
  },
  groupAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function (this: IChat) { return this.isGroupChat; },
  },
  groupAvatar: {
    type: String,
    default: function (this: IChat) { return this.isGroupChat ? 'https://png.pngtree.com/png-vector/20191009/ourmid/pngtree-group-icon-png-image_1796653.jpg' : null; },
  },
});

export default mongoose.model<IChat & Document>('Chat', ChatSchema);
