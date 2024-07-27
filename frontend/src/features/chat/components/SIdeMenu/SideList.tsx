import { List, Typography } from "@mui/material";
import { yellow } from "@mui/material/colors";
import React from "react";
import { ISideListProps } from "./types";

export const SideMenuList: React.FC<ISideListProps> = ({
  listTitle,
  length,
  children,
}) => {
  return (
    <List
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        padding: 0,
      }}
    >
      <Typography
        sx={{
          padding: "5px 0 5px 10px",
          borderBottom: "1px solid black",
          backgroundColor: yellow[400],
        }}
      >
        {listTitle} ({length})
      </Typography>
      {children}
    </List>
  );
};
