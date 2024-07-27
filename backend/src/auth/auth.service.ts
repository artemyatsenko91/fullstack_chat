import {
    Inject,
    Injectable,
    UnauthorizedException,
    forwardRef,
} from "@nestjs/common";
import * as crypto from "crypto";
import * as util from "util";
import { v4 as uuidv4 } from "uuid";

import { UserService } from "src/user/user.service";
import { UserDocument } from "src/user/models/user.model";
import { login_error } from "src/user/errors";

const pbkdf2Promise = util.promisify(crypto.pbkdf2);

@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
    ) {}

    public async hashPassword(password: string, salt: string): Promise<string> {
        const iterations = 50000;
        const keylen = 64;
        const digest = "sha512";

        // eslint-disable-next-line no-useless-catch
        try {
            const key = await pbkdf2Promise(
                password,
                salt,
                iterations,
                keylen,
                digest,
            );
            return key.toString("hex");
        } catch (err) {
            throw err;
        }
    }

    public generateRandomStr() {
        return uuidv4();
    }

    public async comparePassword(
        password: string,
        userDBPass: string,
        salt: string,
    ) {
        const hashedPassword = await this.hashPassword(password, salt);

        return hashedPassword === userDBPass;
    }

    public async validateUser(
        userName: string,
        password: string,
    ): Promise<UserDocument> {
        const existedUser = await this.userService.findUserByUserName(userName);

        if (!existedUser) throw new UnauthorizedException(login_error);

        const isPasswordMatch = await this.comparePassword(
            password,
            existedUser.password,
            existedUser.salt,
        );

        if (!isPasswordMatch) throw new UnauthorizedException(login_error);

        return existedUser;
    }
}
