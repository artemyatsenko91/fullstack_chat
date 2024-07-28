import { Stack, Typography } from "@mui/material";
import { IMessageProps } from "./types";
import { yellow } from "@mui/material/colors";

export const Message: React.FC<IMessageProps> = ({ message, isAuthor }) => (
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
