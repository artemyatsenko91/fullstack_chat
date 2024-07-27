import { Socket } from "socket.io-client";

export interface IContextData {
  socket: Socket | null;
  setSocket: React.Dispatch<React.SetStateAction<Socket | null>>;
  activeChat: string | null;
  setActiveChat: React.Dispatch<React.SetStateAction<string | null>>;
  user: {
    userName?: string;
    socketId?: string;
  };
  setUser: React.Dispatch<
    React.SetStateAction<{
      userName?: string;
      socketId?: string;
    }>
  >;
}
