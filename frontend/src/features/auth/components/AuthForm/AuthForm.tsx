import { Button, Stack, TextField, Typography } from "@mui/material";
import { useForm } from "@tanstack/react-form";
import { AxiosError } from "axios";
import React, { useState } from "react";

import { useAppContext } from "../../../../context/appContext";
import { setSocketInstance } from "../../../../utils/socket";
import { login, registration } from "../../api/authApi";
import { IFormProps } from "./types";
import { Snack } from "../../../../shared/components/SnackBar/SnackBar";

export const AuthForm: React.FC<IFormProps> = ({ loginForm, setToken }) => {
  const [error, setError] = useState<any | null>(null);
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const context = useAppContext();

  const form = useForm({
    defaultValues: {
      userName: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      try {
        if (loginForm) {
          const { access_token } = await login(value);
          localStorage.setItem("token", access_token);
          setToken && setToken(access_token);
          setSocketInstance(access_token, context?.setSocket);
          context?.setUser({ ...context.user, userName: value.userName });
          setError("");
        } else {
          await registration(value);
          handleClick();
          setError("");
        }
      } catch (error) {
        console.log(error);
        if (error instanceof AxiosError) {
          setError(error.message);
        } else {
           setError((error as Error).message);
        }
      }
    },
  });
  console.log(error);
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
          {loginForm ? "Connect to chat" : "Sign up"}
        </Button>
        {error ? <Typography color="red">{error}</Typography> : null}
      </Stack>
      <Snack isOpen={open} text="Registration completed successfully" />
    </form>
  );
};
