import { Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { ISnackProps } from "./types";

export const Snack: React.FC<ISnackProps> = ({ text, isOpen }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isOpen) setOpen(true);
  }, [isOpen, text]);

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  return (
    <Snackbar
      open={open}
      autoHideDuration={2000}
      onClose={handleClose}
      message={text}
    />
  );
};
