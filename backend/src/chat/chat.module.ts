import { Module } from "@nestjs/common";
import { ChatService } from "./chat.service";

import { MongooseModule } from "@nestjs/mongoose";
import { ChatEventProvider } from "src/chat/chat-events.provider";
import { UsersModule } from "src/chat-user/chat-users.module";
import { ChatController } from "./chat.controller";
import { ChatGateway } from "./chat.gateway";
import { Room, RoomModelSchema } from "./models/room-model";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "src/user/user.module";

@Module({
    imports: [
        UsersModule,
        MongooseModule.forFeature([
            {
                name: Room.name,
                schema: RoomModelSchema,
            },
        ]),
        UsersModule,
        JwtModule,
        UserModule
    ],
    providers: [ChatService, ChatGateway, ChatEventProvider],
    exports: [ChatService],
    controllers: [ChatController],
})
export class ChatModule {}
