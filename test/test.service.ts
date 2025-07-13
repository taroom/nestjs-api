import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/prisma.service";
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { User } from "@prisma/client";

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

    async getUser(): Promise<User> {
        return this.prismaService.user.findUnique({
            where: {
                username: 'taroom'
            }
        });
    }

    async createUser() {
        await this.prismaService.user.create({
            data: {
                username: 'taroom',
                name: 'Agus Sutarom',
                password: await bcrypt.hash('taroom', 10),
                token: 'test'
                // token: uuid()
            }
        })
    }
} 