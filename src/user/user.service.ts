import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { User, Prisma } from '@prisma/client';
import * as argon2 from 'argon2';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => MailService))
    private mailService: MailService,
  ) {}

  async getOneUser(query: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ userName: query }, { email: query }],
      },
    });
    delete user.password;
    return user;
  }

  async getUserForAuth(query: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ userName: query }, { email: query }],
      },
    });

    return user;
  }

  async getManyUsers(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ userName: data.userName }, { email: data.email }],
      },
    });
    if (existingUser) {
      throw new HttpException(
        `User with email ${data.email} already exists`,
        409,
      );
    }
    const hashedPassword = await argon2.hash(data.password);
    const newUser = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        userName: data.userName,
      },
    });
    await this.mailService.sendWellcomeEmail(newUser);

    delete newUser.password;
    return newUser;
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async updatePassword(userId: number, newPassword: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const hashedPassword = await argon2.hash(newPassword);
    return this.prisma.user.update({
      data: {
        password: hashedPassword,
      },
      where: { id: userId },
    });
  }

  async deleteUser(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
