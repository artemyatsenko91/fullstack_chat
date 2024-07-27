import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { LoginUserDTO } from "src/auth/dto/loginUser.dto";
import { CreateUserDTO } from "./dto/createUser.dto";
import { UserService } from "./user.service";
import { returnUserInfo } from "./user.helpers";

@ApiTags("users")
@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post("register")
    public async register(@Body() dto: CreateUserDTO) {
        const user = await this.userService.registerUser(dto);
        return returnUserInfo(user);
    }

    @HttpCode(HttpStatus.OK)
    @Post("login")
    public async login(
        @Body() dto: LoginUserDTO,
    ): Promise<{ access_token: string }> {
        return await this.userService.loginUser(dto);
    }
}
