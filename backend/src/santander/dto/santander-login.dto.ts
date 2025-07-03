import { IsString, IsNotEmpty } from 'class-validator';

export class SantanderLoginDto {
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
