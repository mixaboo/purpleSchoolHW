import { IsEmail, IsEnum, IsPhoneNumber, IsString } from 'class-validator';
import { Roles } from '../../domain/enums/user.enum';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsPhoneNumber()
  @IsString()
  phone: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsEnum(Roles)
  role: Roles;
}
