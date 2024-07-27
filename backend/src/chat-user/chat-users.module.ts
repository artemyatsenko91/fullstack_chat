import { Module } from "@nestjs/common";
import { UsersService } from "./chat-users.service";
import { UsersController } from "./chat-users.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModelSchema, ChatUser } from "./models/chat-user-model";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ChatUser.name, schema: UserModelSchema },
        ]),
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
