import { io, Socket } from "socket.io-client";

export const setSocketInstance = (
  token: string,
  setSocket?: React.Dispatch<React.SetStateAction<Socket | null>>
) => {
  const socket = io("ws://localhost:5000", {
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  socket.on("connect", () => {
    if (setSocket) setSocket(socket);
  });
};
