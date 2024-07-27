import {
    CanActivate,
    ExecutionContext,
    Injectable,
    // UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Socket } from "socket.io";

let jwtTService;
let confService;
@Injectable()
export class WsJwtGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {
        jwtTService = jwtService;
        confService = configService;
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const client: Socket = context.switchToWs().getClient();

        WsJwtGuard.validateToken(client);
        return true;
    }

    static validateToken(client: Socket) {
        const token = client.handshake.headers.authorization.split(" ")[1];

        const payload = jwtTService.verify(token, {
            secret: confService.get("SECRET"),
        });

        return payload;
    }
}
