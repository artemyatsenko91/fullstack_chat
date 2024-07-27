import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";

import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { User, UserSchema } from "./models/user.model";
import { AuthModule } from "src/auth/auth.module";

@Module({
    imports: [
        JwtModule,
        forwardRef(() => AuthModule),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
