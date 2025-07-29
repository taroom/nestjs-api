import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import {
  LoginUserRequest,
  RegisterUserRequest,
  UpdateUserRequest,
  UserResponse,
} from 'src/model/user.model';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';
import { Logger } from 'winston';
import { v4 as uuid } from 'uuid';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async register(request: RegisterUserRequest): Promise<UserResponse> {
    // pendaftaran
    this.logger.info(
      `UserService.register() request data ${JSON.stringify(request)}`,
    );
    const registerRequest: RegisterUserRequest =
      this.validationService.validate(UserValidation.REGISTER, request);

    const totalUserWithSameUsername = await this.prismaService.user.count({
      where: {
        username: registerRequest.username,
      },
    });

    if (totalUserWithSameUsername != 0) {
      throw new HttpException(
        {
          errors: 'Validation error by prisma checking',
          details: [
            {
              path: ['username'],
              message: 'Username telah ada',
            },
          ],
        },
        400,
      );
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10); // 10 adalah kompleksitasnya

    const user = await this.prismaService.user.create({
      data: registerRequest,
    });

    return {
      username: user.username,
      name: user.name,
    };
  }

  async login(request: LoginUserRequest): Promise<UserResponse> {
    this.logger.info(
      `UserService.login() request data ${JSON.stringify(request)}`,
    );

    const loginRequest: LoginUserRequest = this.validationService.validate(
      UserValidation.LOGIN,
      request,
    );

    // cari user di database
    const user = await this.prismaService.user.findUnique({
      where: {
        username: loginRequest.username,
      },
    });

    if (!user) {
      throw new HttpException('Username or password is invalid', 401);
    }

    const isPasswordValid = await bcrypt.compare(
      loginRequest.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Username or password is invalid', 401);
    }

    //update token
    await this.prismaService.user.update({
      where: {
        username: loginRequest.username,
      },
      data: {
        token: uuid(),
      },
    });

    return {
      username: user.username,
      name: user.name,
      token: user.token, // token tidak boleh dikirimkan ke user, tapi di database ada, jadi harus diambil dari database bukan dari request
    };
  }

  async get(user: User): Promise<UserResponse> {
    return {
      username: user.username,
      name: user.name,
    };
  }

  async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
    this.logger.info(
      `UserService.update( ${JSON.stringify(user)} , ${JSON.stringify(request)} )`,
    );

    // jika pakai logger.info maka password akan kelihatan, saat production gunakan logger.debug aja

    const updateRequest: UpdateUserRequest = this.validationService.validate(
      UserValidation.UPDATE,
      request,
    );

    if (updateRequest.name) {
      user.name = updateRequest.name;
    }

    if (updateRequest.password) {
      user.password = await bcrypt.hash(updateRequest.password, 10);
    }

    try {
      const result = await this.prismaService.user.update({
        where: {
          username: user.username,
        },
        data: user,
      });

      this.logger.info(
        `result of update prisma UserService.update() to be ${JSON.stringify(result)}`,
      );

      return {
        username: result.username,
        name: result.name,
      };
    } catch (e) {
      this.logger.error(`Failed to update user: ${e.message}`, e);
      throw new HttpException('User not found or update failed', 404);
    }

    // this.logger.info(`user on UserService.update() tobe ${JSON.stringify(user)}`);
    // this.logger.info(`result of update prisma UserService.update() tobe ${JSON.stringify(result)}`);
  }

  async logout(user: User): Promise<UserResponse> {
    try {
      const result = await this.prismaService.user.update({
        where: {
          username: user.username,
        },
        data: {
          token: null,
        },
      });

      return {
        username: result.username,
        name: result.name,
      };
    } catch (e) {
      this.logger.error(`Failed to update user: ${e.message}`, e);
      throw new HttpException('User not found or update failed', 404);
    }
  }
}
