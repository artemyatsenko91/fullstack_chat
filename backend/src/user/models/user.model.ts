import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ collection: "registered_user" })
export class User {
    _id: Types.ObjectId;

    @Prop({ unique: true })
    userName: string;

    @Prop()
    password: string;

    @Prop({ type: String })
    salt: string;
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);
