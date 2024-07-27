import { Button, Snackbar, Stack, TextField, Typography } from "@mui/material";
import { useForm } from "@tanstack/react-form";
import { AxiosError } from "axios";
import React, { useState } from "react";

import { useAppContext } from "../../../../context/appContext";
import { setSocketInstance } from "../../../../utils/socket";
import { Login, Register } from "../../api/authApi";
import { IFormProps } from "./types";

export const AuthForm: React.FC<IFormProps> = ({ login, setToken }) => {
  const [error, setError] = useState<any | null>(null);
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const context = useAppContext();

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const form = useForm({
    defaultValues: {
      userName: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      try {
        if (login) {
          const { access_token } = await Login(value);
          localStorage.setItem("token", access_token);
          setToken && setToken(access_token);
          setSocketInstance(access_token, context?.setSocket);
          context?.setUser({ ...context.user, userName: value.userName });
        } else {
          await Register(value);
          handleClick();
          setError("");
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          setError(error.response?.data.message);
        }
      }
    },
  });

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await form.handleSubmit();
        form.reset();
      }}
    >
      <Stack direction="row" spacing={2} sx={{ paddingTop: "20px" }}>
        <form.Field
          name="userName"
          children={(field) => (
            <TextField
              label={
                field.name.charAt(0).toLocaleUpperCase() + field.name.slice(1)
              }
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        />
        <form.Field
          name="password"
          children={(field) => (
            <TextField
              name={field.name}
              label={
                field.name.charAt(0).toLocaleUpperCase() + field.name.slice(1)
              }
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        />
        <Button variant="contained" type="submit">
          {login ? "Connect to chat" : "Sign up"}
        </Button>
        {error ? <Typography color="red">{error}</Typography> : null}
      </Stack>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        message="Registration completed successfully"
      />
    </form>
  );
};
