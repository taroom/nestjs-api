import { Injectable, NestMiddleware } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    // butuh prisma untuk check token
    constructor(private prismaService: PrismaService) { }

    async use(req: any, res: any, next: (error?: Error | any) => void) {
        const tokenizer = req.headers['authorization'] as string;
        if (tokenizer) {
            const user = await this.prismaService.user.findFirst({
                where: {
                    token: tokenizer
                }
            });

            if (user) {
                req.user = user;
            }
        }
        next();
    }

}