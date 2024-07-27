import { Button, Stack, TextField } from "@mui/material";
import { useForm } from "@tanstack/react-form";
import { useAppContext } from "../../../../context/appContext";

export const InputMessageForm = () => {
  const context = useAppContext();

  const form = useForm({
    defaultValues: {
      message: "",
    },
    onSubmit: async ({ value }) => {
      context?.socket?.emit("chatMessageNew", {
        message: value.message,
        roomName: "mainRoom",
      });
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
      <Stack
        direction="row"
        spacing={2}
        sx={{ borderTop: "1px solid blue", padding: "5px" }}
      >
        <form.Field
          name="message"
          children={(field) => (
            <TextField
              fullWidth
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        />
        <Button size="large" variant="contained" type="submit">
          Send
        </Button>
      </Stack>
    </form>
  );
};
