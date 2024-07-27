import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import config from "src/config";
import { UsersModule } from "src/chat-user/chat-users.module";
import { ChatModule } from "src/chat/chat.module";
import { UserModule } from "src/user/user.module";
import { AuthModule } from "src/auth/auth.module";

const configModule = ConfigModule.forRoot({
    isGlobal: true,
    load: [config],
});

const mongoModule = MongooseModule.forRootAsync({
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
        uri: configService.get("MONGO_URL"),
    }),
});

@Module({
    imports: [mongoModule, configModule, UsersModule, ChatModule, UserModule, AuthModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
