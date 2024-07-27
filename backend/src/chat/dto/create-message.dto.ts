import { IsString } from "class-validator";

export class CreateChatMessageDTO {
    @IsString()
    message: string;

    @IsString()
    roomName: string;
}
