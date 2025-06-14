import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '../../domain/enums/role.enum';

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

  @IsEnum(Role, {
    message: (value) =>
      `Role must be one of: ${Object.values(Role).join(', ')}. Got: ${value.value}`,
  })
  role: Role;
}
