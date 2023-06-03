import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  fullname: string;
  @IsNotEmpty()
  @IsString()
  username: string;
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  fullname: string;
  @IsOptional()
  @IsString()
  username: string;
  @IsOptional()
  @IsString()
  password: string;
}

