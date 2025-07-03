import { Controller, Post, Get, Body, Request } from '@nestjs/common';
import { SantanderService } from './santander.service';
import { TransactionRequestDto, MovementResponseDto } from './dto';

interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
  };
}

@Controller('santander')
export class SantanderController {
  constructor(private readonly santanderService: SantanderService) {}

  @Post('transactions')
  async getTransactions(
    @Body() requestDto: TransactionRequestDto & { accessToken?: string },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Request() req: RequestWithUser,
  ): Promise<MovementResponseDto> {
    // Extract accessToken from request body if provided
    const { accessToken, ...transactionRequest } = requestDto;

    const userId = '1';

    return this.santanderService.getTransactions(transactionRequest, userId);
  }
}
