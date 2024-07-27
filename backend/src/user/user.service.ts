import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./models/user.model";
import { Model } from "mongoose";
import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

import { AuthService } from "src/auth/auth.service";
import { exist_field } from "./errors";
import { CreateUserDTO } from "./dto/createUser.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        private readonly authService: AuthService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    public async findUserByUserName(
        userName: string,
    ): Promise<UserDocument | null> {
        return await this.userModel.findOne({ userName });
    }

    public static async findUserByUserName(
        userName: string,
    ): Promise<UserDocument | null> {
        return await UserService.findUserByUserName(userName);
    }

    public async registerUser(dto: CreateUserDTO): Promise<UserDocument> {
        const salt = this.authService.generateRandomStr();
        const userData = {
            ...dto,
            salt,
            password: await this.authService.hashPassword(dto.password, salt),
        };

        try {
            const createdUser = new this.userModel(userData);
            await createdUser.save();

            return createdUser;
        } catch (error) {
            if (error instanceof Error && "keyValue" in error) {
                const keyValue = error.keyValue;
                const field = Object.keys(keyValue)[0];
                throw new ConflictException(exist_field({ field }));
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    public async loginUser({
        userName,
        password,
    }: {
        userName: string;
        password: string;
    }): Promise<{ access_token: string }> {
        const existedUser = await this.authService.validateUser(
            userName,
            password,
        );
        const payload = {
            userName: existedUser.userName,
        };

        const secret = this.configService.get("SECRET");
        const jwt_time = this.configService.get("jwt_time");
        return {
            access_token: await this.jwtService.signAsync(payload, {
                secret: secret,
                expiresIn: jwt_time,
            }),
        };
    }

    public async getUser(userName: string): Promise<UserDocument | null> {
        const user = await this.findUserByUserName(userName);
        if (!user) return null;
        return user;
    }
}
