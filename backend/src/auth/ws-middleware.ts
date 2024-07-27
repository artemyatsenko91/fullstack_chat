import { Socket } from "socket.io";
import { WsJwtGuard } from "./ws-auth.guard";
import { UnauthorizedException } from "@nestjs/common";
import { INVALID_TOKEN_FORMAT, MISSING_TOKEN } from "src/data/messages";

type SocketIOMiddleware = {
    (client: Socket, next: (err?: Error) => void);
};
export const SocketAuthMiddleware = (): SocketIOMiddleware => {
    return (client, next) => {
        try {
            const authHeader = client.handshake.headers.authorization;

            if (!authHeader) {
                throw new UnauthorizedException(MISSING_TOKEN);
            }

            const payload = WsJwtGuard.validateToken(client);
            client["user"] = payload;
            next();
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                next(error);
            } else {
                next(new UnauthorizedException(INVALID_TOKEN_FORMAT));
            }
        }
    };
};
