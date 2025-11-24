import { IsEmail, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(3, 100)
  full_name: string;

  @IsEmail()
  @Length(5, 100)
  email: string;

  @IsNotEmpty()
  @Length(3, 255)
  password: string;

  @IsNotEmpty()
  @Length(3, 255)
  confirm_password: string;

  @IsOptional()
  image?: string;
}
