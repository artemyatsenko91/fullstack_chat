import { IMessagesType } from "../MessageList/types";

export interface ISideListProps {
  listTitle: string;
  length: number;
  children: React.ReactNode;
}

export interface IChatUsersType {
  socketId: string;
  userName: string;
  _id?: string;
}

export interface IRoomsResponse {
  host: {
    socketId: string;
    userName: string;
    _id: string;
  };
  messages: IMessagesType[];
  roomName: string;
  users: [];
}
