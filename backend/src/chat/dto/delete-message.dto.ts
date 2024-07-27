import { IsString } from "class-validator";

export class DeleteMessageDTO {
    @IsString()
    messageId: string;

    @IsString()
    roomName: string;
}
