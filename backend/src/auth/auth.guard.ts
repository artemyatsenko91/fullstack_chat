import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";

import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly configService: ConfigService,
        private readonly JwtService: JwtService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        const decodedToken = Buffer.from(token, "base64").toString("utf-8");

        if (!decodedToken) {
            throw new UnauthorizedException();
        }

        try {
            const payload: JWTDecodedTypes = await this.JwtService.verifyAsync(
                token,
                {
                    secret: this.configService.get("secret"),
                },
            );

            request["user"] = payload;
            return true;
        } catch {
            throw new UnauthorizedException();
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(" ") ?? [];
        return type === "Bearer" ? token : undefined;
    }
}

export interface AuthenticatedRequest extends Request {
    user?: JWTDecodedTypes;
}

export interface JWTDecodedTypes {
    id: string;
    role: string;
    iat: number;
    exp: number;
}
