import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ReturnedUserDTO {
    @ApiProperty()
    @IsString()
    id: string;

    @ApiProperty()
    @IsString()
    userName: string;
}
