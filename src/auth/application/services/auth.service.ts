import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserModel } from '@app/user/domain/models/user.model';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import {
  USER_ALREADY_EXISTS_ERROR,
  USER_NOT_FOUND_ERROR,
  WRONG_PASSWORD_ERROR,
} from '../../infrastructure/constants/auth.constants';
import { UserService } from '@app/user/application/services/user.service';
import { CreateUserDto } from '@app/user/presentation/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<UserModel>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(login: string, password: string) {
    const user = await this.validateUser(login, password);
    const payload = { email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(dto: CreateUserDto) {
    const existUser = await this.userService.findByEmail(dto.email);
    if (existUser) {
      throw new ConflictException(USER_ALREADY_EXISTS_ERROR);
    }
    return await this.userService.create(dto);
  }

  async validateUser(email: string, password: string): Promise<UserModel> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    }
    const isCorrectPassword = await compare(password, user.passwordHash);
    if (!isCorrectPassword) {
      throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
    }
    return user;
  }
}
