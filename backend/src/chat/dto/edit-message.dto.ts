import { IsString } from "class-validator";

export class EditChatMessageDTO {
    @IsString()
    newMessage: string;

    @IsString()
    messageId: string;

    @IsString()
    roomName: string;
}
