import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import { AuthForm } from "../AuthForm/AuthForm";
import { IAuthorizationProps } from "./types";
import { TabPanel } from "../TabPanel/TabPanel";

export const AuthSection: React.FC<IAuthorizationProps> = ({
  handleDisconnect,
  token,
  setToken,
}) => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderBottom: "2px solid black",
        padding: "10px",
      }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="basic tabs example"
      >
        <Tab label="Sign Up" {...a11yProps(0)} />
        <Tab label="Sign In" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <Typography>Sign Up</Typography>
        <AuthForm />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Typography>Sign In</Typography>
        <AuthForm login setToken={setToken} />
      </TabPanel>
      {token ? (
        <Button
          color="error"
          variant="outlined"
          onClick={handleDisconnect}
          sx={{ display: "flex", alignSelf: "self-end" }}
        >
          Disconnect
        </Button>
      ) : null}
    </Box>
  );
};
