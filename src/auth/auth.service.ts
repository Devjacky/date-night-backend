import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserModel } from '../users/models/user.model';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly logger: Logger,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  signup(createUserDto: CreateUserDto): Promise<UserModel> {
    const message = `AuthService.signup() createUserDto=${JSON.stringify(
      createUserDto,
    )}`;
    this.logger.log(message);
    return this.usersService.create(createUserDto);
  }

  async validateUser(username: string, password: string): Promise<any> {
    const message = `AuthService.validateUser() username=${username} pw=${password}`;
    this.logger.log(message);
    const user = await this.usersService.findByUsername(username);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) return user;
    }
    return null;
  }

  async login(user: UserModel): Promise<any> {
    const message = `AuthService.login() userObject=${JSON.stringify(user)}`;
    this.logger.log(message);
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async findOne(userId: string): Promise<UserModel> {
    const message = `AuthService.findOne() userId=${userId}`;
    this.logger.log(message);
    return this.usersService.findOne(userId);
  }
}
