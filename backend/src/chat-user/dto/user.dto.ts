import { IsString } from "class-validator";

export class UserDTO {
    @IsString()
    socketId: string;

    @IsString()
    userName: string;
}
