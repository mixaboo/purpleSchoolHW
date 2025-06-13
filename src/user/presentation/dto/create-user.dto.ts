import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '../../domain/enums/user.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(UserRole, {
    message: (value) =>
      `Role must be one of: ${Object.values(UserRole).join(', ')}. Got: ${value.value}`,
  })
  role: UserRole;
}
