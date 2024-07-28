import {
  Divider,
  ListItem,
  ListItemButton,
  ListItemText,
  styled,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../../context/appContext";
import { getChatRooms, getChatUsers } from "../../api/chatApi";
import { SideMenuList } from "./SideList";
import { IChatUsersType, IRoomsResponse } from "./types";

const StyledAside = styled("aside")(() => ({
  borderRight: "2px solid blue",
  minHeight: "100%",
}));

export const SideMenu = () => {
  const [chatUsers, setChatUsers] = useState<IChatUsersType[]>([]);
  const [rooms, setRooms] = useState<IRoomsResponse[]>([]);

  const context = useAppContext();
  context?.socket?.on("userStatus", async () => {
    const chatUsers = await getChatUsers();
    setChatUsers(chatUsers);
  });

  useEffect(() => {
    const gerRooms = async () => {
      const rooms = await getChatRooms();
      setRooms(rooms);
      context?.setActiveChat(rooms[0].roomName);
    };
    gerRooms();
  }, [context?.socket, context]);

  return (
    <StyledAside>
      <SideMenuList length={chatUsers.length} listTitle="Connected users">
        {chatUsers.map((item, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start" disablePadding>
              <ListItemButton
                sx={{
                  padding: "0 10px",
                  "&:hover": {
                    backgroundColor: (theme) => theme.palette.grey[300],
                  },
                }}
                onClick={() => {
                  context?.setActiveChat(item.userName);
                }}
              >
                <ListItemText
                  primary={item.userName}
                  secondary={
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    ></Typography>
                  }
                  sx={{ padding: "0" }}
                />
              </ListItemButton>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </SideMenuList>
      <SideMenuList length={rooms.length} listTitle="Rooms">
        {rooms.map((item, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start" disablePadding>
              <ListItemButton
                sx={{
                  padding: "0 10px",
                  "&:hover": {
                    backgroundColor: (theme) => theme.palette.grey[300],
                  },
                }}
                onClick={() => {
                  context?.setActiveChat(item.roomName);
                }}
              >
                <ListItemText
                  primary={item.roomName}
                  secondary={
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    ></Typography>
                  }
                  sx={{ padding: "0" }}
                />
              </ListItemButton>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </SideMenuList>
    </StyledAside>
  );
};
