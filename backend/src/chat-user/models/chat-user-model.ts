import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
export class ChatUser {
    _id: Types.ObjectId;

    @Prop({ type: String })
    socketId: string;

    @Prop({ type: String })
    userName: string;
}

export type UsersDocument = ChatUser & Document;

export const UserModelSchema = SchemaFactory.createForClass(ChatUser);
UserModelSchema.set("collection", "chat_users");
