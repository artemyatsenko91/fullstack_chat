import { Prop } from "@nestjs/mongoose";

export class Message {
    @Prop({ type: String })
    messageId: string;

    @Prop({ type: String })
    author: string;

    @Prop({ type: String })
    message: string;

    @Prop({ type: String })
    createdAt: string;
}
