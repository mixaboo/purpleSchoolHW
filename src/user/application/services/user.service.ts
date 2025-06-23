import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserModel } from '../../domain/models/user.model';
import { CreateUserDto } from '../../presentation/dto/create-user.dto';
import { genSalt, hash } from 'bcryptjs';
import { UpdateUserDto } from '../../presentation/dto/update-user.dto';
import { USER_NOT_FOUND_ERROR } from '@app/auth/infrastructure/constants/auth.constants';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<UserModel>,
  ) {}

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(userId: string): Promise<UserModel | null> {
    const foundUser = this.userModel.findOne({ userId }).exec();
    if (!foundUser) {
      throw new HttpException(USER_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
    }
    return foundUser;
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.userModel
        .find()
        .skip(skip)
        .limit(limit)
        .select('-passwordHash')
        .exec(),
      this.userModel.countDocuments(),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async create(dto: CreateUserDto): Promise<UserModel> {
    const salt = await genSalt(10);
    return this.userModel.create({
      name: dto.name,
      phone: dto.phone,
      email: dto.email,
      passwordHash: await hash(dto.password, salt),
      role: dto.role,
    });
  }

  async patch(userId: string, dto: UpdateUserDto): Promise<UserModel | null> {
    return await this.userModel
      .findByIdAndUpdate(new Types.ObjectId(userId), dto, { new: true })
      .exec();
  }

  async delete(userId: string): Promise<UserModel | null> {
    return await this.userModel
      .findByIdAndUpdate(
        new Types.ObjectId(userId),
        { deletedAt: new Date() },
        { new: true },
      )
      .exec();
  }
}
