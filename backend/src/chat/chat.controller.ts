import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { CreateRoomDTO } from "./dto/create-room.dto";
import { UsersService } from "src/chat-user/chat-users.service";
import { JoinRoomDTO } from "./dto/join-room.dto";

@Controller("chat")
export class ChatController {
    constructor(
        private readonly chatService: ChatService,
        private readonly userService: UsersService,
    ) {}

    @Get("/rooms")
    public async getAllRooms() {
        return await this.chatService.getAllRooms();
    }

    @Get("/user-rooms")
    public async getAllUserRooms(@Query("userName") userName: string) {
        return await this.chatService.getAllUserRooms(userName);
    }

    @Post("/create-room")
    public async createRoom(@Body() data: CreateRoomDTO) {
        const user = await this.userService.getUser({
            userName: data.userName,
        });
        return await this.chatService.createRoom(data.roomName, user);
    }

    @Post("/room")
    public async getRoomByRoomName(@Body() data: { roomName: string }) {
        return this.chatService.findRoom({
            roomName: data.roomName,
        });
    }

    @Post("/join-room")
    public async joinUserToRoom(@Body() data: JoinRoomDTO) {
        const user = await this.userService.getUser({
            userName: data.userName,
        });
        return await this.chatService.joinUserToRoom(data.roomName, user);
    }

    @Post("/leave-room")
    public async deleteUserFromRoom(@Body() data: CreateRoomDTO) {
        const user = await this.userService.getUser({
            userName: data.userName,
        });
        return await this.chatService.deleteUserFromRoom(data.roomName, user);
    }
}
