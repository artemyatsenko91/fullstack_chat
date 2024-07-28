import { useEffect, useState } from "react";

import { Stack, Typography } from "@mui/material";
import "./style.css";
import { SideMenu } from "./features/chat/components/SIdeMenu/SideMenu";
import {  setSocketInstance } from "./utils/socket";
import { useAppContext } from "./context/appContext";
import { AuthSection } from "./features/auth";
import { ChatSection } from "./features/chat";

function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const context = useAppContext();

  useEffect(() => {
    if (!token) return undefined;
    const initializeSocket = () => {
      setSocketInstance(token, context?.setSocket);

      return () => {
        context?.socket?.disconnect();
      };
    };

    return initializeSocket();
  }, [token]);

  const handleDisconnect = () => {
    setToken("");
    localStorage.removeItem("token");
  };

  return (
    <div className="App">
      <main
        style={{ display: "flex", flex: "1 1 auto", flexDirection: "column" }}
      >
        <Typography
          variant="h1"
          sx={{ textAlign: "center", fontSize: "30px", paddingTop: "20px" }}
        >
          Chat Client
        </Typography>
        <AuthSection
          token={token}
          handleDisconnect={handleDisconnect}
          setToken={setToken}
        />
        {token ? (
          <Stack
            sx={{
              display: "grid",
              gridTemplateColumns: "0.5fr 2fr",
              flex: "1 1 auto",
            }}
          >
            <SideMenu />
            <ChatSection />
          </Stack>
        ) : null}
      </main>
    </div>
  );
}

export default App;
