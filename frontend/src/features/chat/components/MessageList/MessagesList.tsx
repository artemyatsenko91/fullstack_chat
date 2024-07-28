import { Stack } from "@mui/material";
import { useEffect, useState } from "react";

import { useAppContext } from "../../../../context/appContext";
import { IMessagesType, IUserStatusMessagesType } from "./types";
import { Message } from "./Message/Message";
import { getChatRoomByName } from "../../api/chatApi";
import { Snack } from "../../../../shared/components/SnackBar/SnackBar";

export const MessagesList = () => {
  const [messages, setMessages] = useState<IMessagesType[]>([]);
  const [userStatusMessage, setUserStatusMessage] = useState<string>("");
  const context = useAppContext();

  useEffect(() => {
    const getRoomByChatName = async () => {
      const response = await getChatRoomByName(context?.activeChat!);

      setMessages(response.messages);
    };

    getRoomByChatName();
  }, [context, context?.activeChat]);

  useEffect(() => {
    const handleNewMessage = (message: IMessagesType) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    const handleUserStatusMessage = (message: IUserStatusMessagesType) => {
      if (message.userName)
        setUserStatusMessage(`${message.userName} ${message.status}`);
    };

    context?.socket?.on("chatMessageNew", handleNewMessage);
    context?.socket?.on("userStatus", handleUserStatusMessage);

    return () => {
      context?.socket?.off("chatMessageNew", handleNewMessage);
      context?.socket?.off("userStatus", handleUserStatusMessage);
    };
  }, [context?.socket]);

  return (
    <>
      <Stack sx={{ flex: "1 1 auto", gap: "5px" }}>
        {messages
          ? messages.map((item, index) => (
              <Message
                key={index}
                message={item}
                isAuthor={context?.user.userName === item.author}
              />
            ))
          : null}
      </Stack>
      <Snack isOpen={Boolean(userStatusMessage)} text={userStatusMessage} />
    </>
  );
};
