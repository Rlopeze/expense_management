import { IsString, IsOptional, IsDateString } from 'class-validator';

export class TransactionRequestDto {
  @IsString()
  accountId: string;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;

  @IsOptional()
  @IsString()
  transactionType?: string;

  @IsOptional()
  @IsString()
  password?: string; // User's Santander password for automatic login
}
