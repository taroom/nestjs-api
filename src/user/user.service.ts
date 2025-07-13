import { HttpException, Inject, Injectable } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { PrismaService } from "src/common/prisma.service";
import { ValidationService } from "src/common/validation.service";
import { LoginUserRequest, RegisterUserRequest, UserResponse } from "src/model/user.model";
import { UserValidation } from "./user.validation";
import * as bcrypt from 'bcrypt';
import { Logger } from 'winston';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UserService {

    constructor(
        private validationService: ValidationService,
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
        private prismaService: PrismaService
    ) { }

    async register(request: RegisterUserRequest): Promise<UserResponse> {
        // pendaftaran
        this.logger.info(`UserService.register() request data ${JSON.stringify(request)}`);
        const registerRequest: RegisterUserRequest = this.validationService.validate(UserValidation.REGISTER, request);

        const totalUserWithSameUsername = await this.prismaService.user.count({
            where: {
                username: registerRequest.username
            }
        });

        if (totalUserWithSameUsername != 0) {
            throw new HttpException({
                errors: 'Validation error by prisma checking',
                details: [
                    {
                        path: ['username'],
                        message: 'Username telah ada'
                    }
                ]
            }, 400);
        }

        registerRequest.password = await bcrypt.hash(registerRequest.password, 10); // 10 adalah kompleksitasnya

        const user = await this.prismaService.user.create({
            data: registerRequest
        });

        return {
            username: user.username,
            name: user.name
        };


    }

    async login(request: LoginUserRequest): Promise<UserResponse> {
        this.logger.info(`UserService.login() request data ${JSON.stringify(request)}`);

        const loginRequest: LoginUserRequest = this.validationService.validate(UserValidation.LOGIN, request);

        // cari user di database
        let user = await this.prismaService.user.findUnique({
            where: {
                username: loginRequest.username
            }
        });

        if (!user) {
            throw new HttpException('Username or password is invalid', 401);
        }

        const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);

        if (!isPasswordValid) {
            throw new HttpException('Username or password is invalid', 401);
        }

        //update token
        await this.prismaService.user.update({
            where: {
                username: loginRequest.username
            },
            data: {
                token: uuid()
            }
        })

        return {
            username: user.username,
            name: user.name,
            token: user.token // token tidak boleh dikirimkan ke user, tapi di database ada, jadi harus diambil dari database bukan dari request
        };
    }
}