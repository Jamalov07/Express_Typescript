import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;
  image: string;
  @IsNotEmpty()
  @IsString()
  description: string;
  @IsNotEmpty()
  @IsMongoId()
  owner: string;
}

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  title: string;
  image: string;
  @IsOptional()
  @IsString()
  description: string;
  @IsOptional()
  @IsMongoId()
  owner: string;
}
