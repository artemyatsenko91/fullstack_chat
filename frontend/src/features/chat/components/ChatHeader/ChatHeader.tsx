import { Box, Typography } from "@mui/material";
import { useAppContext } from "../../../../context/appContext";

export const ChatHeader = () => {
  const context = useAppContext();
  return (
    <Box sx={{ width: "100%", padding: "5px", borderBottom: "1px solid blue" }}>
      <Typography>{context?.activeChat}</Typography>
    </Box>
  );
};
