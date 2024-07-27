import { Stack, Typography } from "@mui/material";
import { yellow } from "@mui/material/colors";
import axios from "axios";
import { useEffect, useState } from "react";

import { useAppContext } from "../../../../context/appContext";
import { IMessagesType } from "./types";
import { IRoomsResponse } from "../SIdeMenu/types";

type Message = IMessagesType;

export const MessagesList = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const context = useAppContext();

  useEffect(() => {
    const getRoomByName = async () => {
      const response = await axios.post<IRoomsResponse>(
        "http://localhost:5000/chat/room",
        {
          roomName: context?.activeChat,
        }
      );
      setMessages(response.data.messages);
    };

    getRoomByName();
  }, [context, context?.activeChat]);

  useEffect(() => {
    const handleNewMessage = (message: IMessagesType) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    const handleUserStatusMessage = (message: IMessagesType) => {};

    context?.socket?.on("chatMessageNew", handleNewMessage);
    context?.socket?.on("userStatus", handleUserStatusMessage);

    return () => {
      context?.socket?.off("chatMessageNew", handleNewMessage);
    };
  }, [context?.socket]);

  return (
    <Stack sx={{ flex: "1 1 auto", gap: "5px" }}>
      {messages
        ? messages.map((item, index) => (
            <MessageCard
              key={index}
              message={item}
              isAuthor={context?.user.userName === item.author}
            />
          ))
        : null}
    </Stack>
  );
};

const MessageCard = ({
  message,
  isAuthor,
}: {
  message: IMessagesType;
  isAuthor: boolean;
}) => (
  <Stack
    sx={{
      padding: "10px",
      backgroundColor: yellow[100],
      border: "1px solid lightblue",
      borderRadius: "10px",
      maxWidth: "280px",
      alignSelf: isAuthor ? "flex-end" : "auto",
    }}
  >
    <Typography variant="body2" sx={{ fontSize: "12px" }}>
      {message.author}
    </Typography>
    {message.message}
  </Stack>
);
