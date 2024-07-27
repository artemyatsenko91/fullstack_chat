import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { ChatUser } from "../../chat-user/models/chat-user-model";
import { Message } from "./messages-model";

@Schema()
export class Room {
    _id: Types.ObjectId;

    @Prop({ type: String, required: true })
    roomName: string;

    @Prop({ type: ChatUser })
    host: ChatUser;

    @Prop({ type: [ChatUser], default: [] })
    users: ChatUser[];

    @Prop({ type: Message, default: [] })
    messages: Message[];
}

export type RoomDocument = Room & Document;

export const RoomModelSchema = SchemaFactory.createForClass(Room);
RoomModelSchema.set("collection", "chat_rooms");
