import { UserService } from '../../application/services/user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { USER_NOT_FOUND_ERROR } from '@app/auth/infrastructure/constants/auth.constants';

import { UpdateUserDto } from '../dto/update-user.dto';
import { JwtAuthGuard } from '@app/auth/infrastructure/guards/jwt.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../../domain/enums/role.enum';
import { User } from '../decorators/user-email.decorator';
import { RolesGuard } from '../../infrastracture/guards/roles.guard';

@Controller('user')
@UsePipes(new ValidationPipe())
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@User() user: any) {
    console.log('Request user:', user);
    return this.userService.findByEmail(user.email);
  }

  @Get(':id')
  async findById(@Param('id') userId: string) {
    return this.userService.findById(userId);
  }

  @Get()
  @Roles(Role.Admin)
  async findAll() {
    return this.userService.findAll();
  }

  @Patch()
  async patch(@User() user: { userId: string }, @Body() dto: UpdateUserDto) {
    return this.userService.patch(user.userId, dto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async delete(@Param('id') userId: string) {
    const deletedUser = await this.userService.delete(userId);
    if (!deletedUser) {
      throw new HttpException(USER_NOT_FOUND_ERROR, HttpStatus.NOT_FOUND);
    }
    return deletedUser;
  }
}
