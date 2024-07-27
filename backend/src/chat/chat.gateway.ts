import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import * as EventEmitter from "events";
import { Server, Socket } from "socket.io";

import { Inject, UnauthorizedException, UseGuards } from "@nestjs/common";
import { Types } from "mongoose";
import {
    AUTH_ERROR_EVENT,
    CHAT_MESSAGE_DELETE_EVENT,
    CHAT_MESSAGE_EDIT_EVENT,
    CHAT_MESSAGE_NEW_EVENT,
    CHAT_ROOM_USERS_STATUS_EVENT,
    CONNECTED_STATUS,
    CREATE_ROOM_EVENT,
    DISCONNECTING_EVENT,
} from "src/chat/constants/event-names";
import { ChatUser } from "src/chat-user/models/chat-user-model";
import { UsersService } from "src/chat-user/chat-users.service";
import { ChatService } from "./chat.service";
import { CreateChatMessageDTO } from "./dto/create-message.dto";
import { DeleteMessageDTO } from "./dto/delete-message.dto";
import { EditChatMessageDTO } from "./dto/edit-message.dto";
import { TEventData } from "./types/event-data-type";
import { TMessageData } from "./types/message-data-type";
import { WsJwtGuard } from "src/auth/ws-auth.guard";
import { SocketAuthMiddleware } from "src/auth/ws-middleware";
import { UserService } from "src/user/user.service";
import { USER_NOT_FOUND } from "src/data/messages";

@WebSocketGateway({
    cors: {
        origin: "*",
    },
})
export class ChatGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    private readonly mainRoom = "mainRoom";
    constructor(
        private readonly chatUsersService: UsersService,
        private readonly chatService: ChatService,
        private readonly userService: UserService,
        // private readonly configService: ConfigService,
        @Inject("CHAT_EVENTS") private readonly chatEvents: EventEmitter,
    ) {
        this.chatEvents.on(
            CHAT_ROOM_USERS_STATUS_EVENT,
            this.sendUserStatusToRoom.bind(this),
        );

        this.chatEvents.on(
            CHAT_MESSAGE_NEW_EVENT,
            this.sendMessageToRoom.bind(this),
        );

        this.chatEvents.on(CREATE_ROOM_EVENT, this.sendUserRooms.bind(this));

        this.chatEvents.on(
            CHAT_MESSAGE_DELETE_EVENT,
            this.deleteMessageFromRoom.bind(this),
        );

        this.chatEvents.on(
            CHAT_MESSAGE_EDIT_EVENT,
            this.editMessageInRoom.bind(this),
        );
    }

    @WebSocketServer() server: Server;
    @UseGuards(WsJwtGuard)
    @SubscribeMessage(CHAT_MESSAGE_NEW_EVENT)
    public async handleSendMessage(
        @MessageBody() data: CreateChatMessageDTO,
        @ConnectedSocket() socket: Socket,
    ): Promise<void> {
        const author = await this.chatUsersService.getUser({
            socketId: socket.id,
        });

        await this.chatService.saveMessage(data, author.userName);
    }

    @SubscribeMessage(CHAT_MESSAGE_DELETE_EVENT)
    public async handleDeleteMessage(
        @MessageBody() data: DeleteMessageDTO,
    ): Promise<void> {
        await this.chatService.deleteMessage(data.roomName, data.messageId);
    }

    @SubscribeMessage(CHAT_MESSAGE_EDIT_EVENT)
    public async handleEditMessage(
        @MessageBody() data: EditChatMessageDTO,
    ): Promise<void> {
        await this.chatService.editMessage(
            data.roomName,
            data.messageId,
            data.newMessage,
        );
    }

    public async afterInit(client: Socket) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        client.use(SocketAuthMiddleware() as any);

        const isInitializedRoom = await this.chatService.getRoomByName(
            this.mainRoom,
        );

        if (!isInitializedRoom) {
            await this.chatService.createRoom(this.mainRoom, {
                _id: Types.ObjectId.createFromTime(Date.now()),
                socketId: "ADMIN",
                userName: "ADMIN",
            });
        }
    }

    public async handleConnection(client: Socket) {
        const payloadUser = client["user"].userName;

        const isUserExist =
            await this.userService.findUserByUserName(payloadUser);

        if (!isUserExist) {
            client.emit(
                AUTH_ERROR_EVENT,
                new UnauthorizedException(USER_NOT_FOUND),
            );
            client.disconnect();
            return;
        }

        const user = await this.chatUsersService.addUser(
            client.id,
            payloadUser,
        );

        await this.chatService.joinUserToRoom(this.mainRoom, user);

        client.on(DISCONNECTING_EVENT, async () => {
            const clientRooms = Array.from(client.rooms);

            for await (const room of clientRooms.slice(1)) {
                await this.chatService.deleteUserFromRoom(room, user);
            }
        });
    }

    public async handleDisconnect(@ConnectedSocket() socket: Socket) {
        if (socket.id) await this.chatUsersService.removeUser(socket.id);
    }

    private async sendUserStatusToRoom(data: TEventData) {
        if (data.status === CONNECTED_STATUS) {
            const connectedUsersToCurrentRoom =
                await this.chatUsersService.getAllUsers();
            const socket = this.server.sockets.sockets.get(data.socketId);

            socket.join(data.roomName);

            this.server.to(data.roomName).emit(CHAT_ROOM_USERS_STATUS_EVENT, {
                connectedUsers: connectedUsersToCurrentRoom,
            });
        }

        this.server.to(data.roomName).emit(CHAT_ROOM_USERS_STATUS_EVENT, {
            userName: data.userName,
            id: data.id,
            status: data.status,
            roomName: data.roomName,
        });
    }

    private async sendMessageToRoom(data: TMessageData) {
        this.server.to(data.roomName).emit(CHAT_MESSAGE_NEW_EVENT, data);
    }

    private async deleteMessageFromRoom(data: DeleteMessageDTO) {
        this.server.to(data.roomName).emit(CHAT_MESSAGE_DELETE_EVENT, {
            roomName: data.roomName,
            messageId: data.messageId,
        });
    }

    private async sendUserRooms(data: { roomName: string; user: ChatUser }) {
        const userRooms = await this.chatService.getAllUserRooms(
            data.user.userName,
        );

        this.server.to(data.user.socketId).emit(CREATE_ROOM_EVENT, userRooms);
    }

    private async editMessageInRoom(data: EditChatMessageDTO) {
        this.server.to(data.roomName).emit(CHAT_MESSAGE_EDIT_EVENT, {
            roomName: data.roomName,
            messageId: data.messageId,
            message: data.newMessage,
        });
    }
}
