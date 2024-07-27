import { useContext, useState, createContext, useMemo, useEffect } from "react";
import { Socket } from "socket.io-client";
import { IContextData } from "./types";

export const AppContext = createContext<IContextData | null>(null);

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [user, setUser] = useState<{
    userName?: string;
    socketId?: string;
  }>({});

  useEffect(() => {
    if (socket) {
      setUser({ ...user, socketId: socket.id });
    }
  }, [socket]);

  const value = useMemo(
    () => ({
      socket,
      setSocket,
      setActiveChat,
      activeChat,
      user,
      setUser,
    }),
    [socket, setSocket, activeChat, setActiveChat, user]
  );
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
