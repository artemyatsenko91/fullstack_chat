import { Controller, Get } from "@nestjs/common";
import { UsersService } from "./chat-users.service";

@Controller("chat")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get("/users")
    public async getAllUsers() {
        return await this.usersService.getAllUsers();
    }
}
