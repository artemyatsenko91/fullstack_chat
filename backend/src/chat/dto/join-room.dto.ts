import { IsString } from "class-validator";

export class JoinRoomDTO {
    @IsString()
    userName: string;

    @IsString()
    roomName: string;
}
