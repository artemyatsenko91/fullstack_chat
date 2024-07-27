import { styled } from "@mui/system";
import { ChatHeader } from "../ChatHeader/ChatHeader";
import { InputMessageForm } from "../InputMessageForm/InputMessageForm";
import { MessagesList } from "../MessageList/MessagesList";

const StyledSection = styled("section")(() => ({
  display: "flex",
  flexDirection: "column",
}));

export const ChatSection = () => {
  return (
    <StyledSection>
      <ChatHeader />
      <MessagesList />
      <InputMessageForm />
    </StyledSection>
  );
};
