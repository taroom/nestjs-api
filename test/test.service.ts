import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/prisma.service";
import * as bcrypt from 'bcrypt';

@Injectable()
export class TestService {
    constructor(
        private prismaService: PrismaService
    ) { }

    // persiapan untuk delete user
    async deleteUser() {
        await this.prismaService.user.deleteMany({
            where: {
                username: 'taroom'
            }
        })
    }

    async createUser() {
        await this.prismaService.user.create({
            data: {
                username: 'taroom',
                name: 'Agus Sutarom',
                password: await bcrypt.hash('taroom', 10),
                token: 'token'
            }
        })
    }
} 