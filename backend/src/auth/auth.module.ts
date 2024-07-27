import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { User, UserSchema } from "src/user/models/user.model";
import { UserModule } from "src/user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    imports: [
        forwardRef(() => UserModule),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get("secret"),
                signOptions: { expiresIn: configService.get("jwt_time") },
            }),
        }),
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
        ]),
    ],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
