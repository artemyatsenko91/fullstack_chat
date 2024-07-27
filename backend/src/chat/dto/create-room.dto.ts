import { IsString } from "class-validator";

export class CreateRoomDTO {
    @IsString()
    userName: string;

    @IsString()
    roomName: string;
}
