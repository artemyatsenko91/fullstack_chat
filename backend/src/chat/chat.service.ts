import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import * as EventEmitter from "events";
import { Model } from "mongoose";
import { v4 as uuid } from "uuid";

import {
    CHAT_MESSAGE_DELETE_EVENT,
    CHAT_MESSAGE_EDIT_EVENT,
    CHAT_MESSAGE_NEW_EVENT,
    CHAT_ROOM_USERS_STATUS_EVENT,
    CONNECTED_STATUS,
    CREATE_ROOM_EVENT,
    DISCONNECTED_STATUS,
} from "src/chat/constants/event-names";
import { ChatUser } from "src/chat-user/models/chat-user-model";
import { CreateChatMessageDTO } from "./dto/create-message.dto";
import { Room, RoomDocument } from "./models/room-model";
import { TEventData } from "./types/event-data-type";

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(Room.name)
        private readonly chatRoomModel: Model<RoomDocument>,
        @Inject("CHAT_EVENTS") private readonly chatEvents: EventEmitter,
    ) {}

    public async createRoom(roomName: string, user: ChatUser): Promise<Room> {
        const room = await this.chatRoomModel.create({
            roomName,
            host: user,
        });

        await room.save();

        this.chatEvents.emit(CREATE_ROOM_EVENT, { roomName, user });

        return room;
    }

    public async getAllRooms(): Promise<Room[]> {
        return await this.chatRoomModel.find();
    }

    public async getAllUserRooms(userName: string): Promise<Room[]> {
        return await this.chatRoomModel.find({
            users: { $elemMatch: { userName } },
        });
    }

    public async getRoomByName(roomName: string): Promise<Room> {
        return await this.chatRoomModel.findOne({ roomName });
    }

    public async getRoomById(roomId: string): Promise<Room | null> {
        return await this.chatRoomModel.findOne({ _id: roomId });
    }

    public async joinUserToRoom(
        roomName: string,
        user: ChatUser,
    ): Promise<void> {
        // await this.withTransaction(async (session) => {
        const room = await this.findRoom({ roomName });

        room.users.push(user);

        await this.chatRoomModel.findOneAndUpdate(
            {
                roomName,
            },
            { $set: { users: room.users } },
        );

        this.chatEvents.emit(
            CHAT_ROOM_USERS_STATUS_EVENT,
            this.returnEventObj(user, roomName, CONNECTED_STATUS),
        );
        // });
    }

    public async deleteUserFromRoom(
        roomName: string,
        user: ChatUser,
    ): Promise<void> {
        const room = await this.findRoom({ roomName });

        if (room) {
            const roomWithoutUser = room.users.filter(
                (roomUser) => roomUser.socketId !== user.socketId,
            );

            await this.chatRoomModel.findOneAndUpdate(
                {
                    roomName,
                },
                { $set: { users: roomWithoutUser } },
            );

            this.chatEvents.emit(
                CHAT_ROOM_USERS_STATUS_EVENT,
                this.returnEventObj(user, roomName, DISCONNECTED_STATUS),
            );
        }
    }

    private returnEventObj(
        user: ChatUser,
        roomName: string,
        status: string,
    ): TEventData {
        return {
            userName: user.userName,
            socketId: user.socketId,
            id: user._id,
            status,
            roomName,
        };
    }

    public async saveMessage(
        data: CreateChatMessageDTO,
        author: string,
    ): Promise<void> {
        // await this.withTransaction(async (session) => {
        const room = await this.findRoom({ roomName: data.roomName });
        const message = {
            messageId: uuid(),
            author: author,
            message: data.message,
            createdAt: this.getTime(),
        };

        room.messages.push(message);

        await this.chatRoomModel.updateOne(
            { roomName: data.roomName },
            { $set: { messages: room.messages } },
            // { session },
        );

        this.chatEvents.emit(CHAT_MESSAGE_NEW_EVENT, {
            ...message,
            roomName: data.roomName,
        });
        // });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async findRoom(roomParam: Record<string, any>): Promise<Room> {
        return await this.chatRoomModel.findOne(roomParam);
    }

    public async deleteMessage(roomName: string, messageId: string) {
        const room = await this.findRoom({ roomName });

        const filteredMessages = room.messages.filter(
            (roomMessage) => roomMessage.messageId !== messageId,
        );

        await this.chatRoomModel.findOneAndUpdate(
            { roomName },
            { $set: { messages: filteredMessages } },
        );

        this.chatEvents.emit(CHAT_MESSAGE_DELETE_EVENT, {
            roomName,
            messageId,
        });
    }

    public async editMessage(
        roomName: string,
        messageId: string,
        newMessage: string,
    ): Promise<void> {
        // await this.withTransaction(async (session) => {
        const room = await this.findRoom({ roomName });

        const filteredMessages = room.messages.map((roomMessage) => {
            if (roomMessage.messageId == messageId) {
                roomMessage.message = newMessage;
                return roomMessage;
            }
            return roomMessage;
        });

        await this.chatRoomModel.findOneAndUpdate(
            { roomName },
            { $set: { messages: filteredMessages } },
            // { session },
        );

        this.chatEvents.emit(CHAT_MESSAGE_EDIT_EVENT, {
            roomName: roomName,
            messageId: messageId,
            message: newMessage,
        });
        // });
    }

    public getTime(): string {
        return new Date().toLocaleString("ua", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
        });
    }
}
