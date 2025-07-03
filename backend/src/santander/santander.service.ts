import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Movement,
  MovementResponseDto,
  SantanderApiResponse,
  RawMovement,
  TransactionRequestDto,
} from './dto';
import { User } from '../users/user.entity';
import { SantanderMovement } from './entities/santander-movement.entity';

@Injectable()
export class SantanderService {
  private readonly baseUrl = 'https://openbanking.santander.cl';
  private readonly endpoint =
    '/account_balances_transactions_and_withholdings_retail/v1/current-accounts/transactions';

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(SantanderMovement)
    private santanderMovementRepository: Repository<SantanderMovement>,
  ) {}

  async getTransactions(
    requestDto: TransactionRequestDto,

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    accessToken?: string,
  ): Promise<MovementResponseDto> {
    try {
      const token =
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJOUEIiLCJQUEMiLCJNUEUiLCJTU1QiLCJDaGluQ2hpbiIsImJpbmRpZF90cmFuc21pdF9hZG1pbiIsImJpbmRpZF9iaW9jYXRjaF9hZG1pbiIsIkRFRkFVTFQiLCJDTElFTlQiXSwiaXNzIjoiaHR0cDovL2Rzcy1pYW0tY2xpZW50IiwiZXhwIjoxNzUxMzI0MzkxLCJqdGkiOiJlVWdtMUU1UHQ5SFhLOU1OYWdoemZ1WUYyeHMiLCJjbGllbnRfaWQiOiI0ZTlhZjYyYy02NTYzLTQyY2QtYWFiNi0wZGQ3ZDUwYTkxMzEiLCJ1c2VybmFtZSI6IjRlOWFmNjJjLTY1NjMtNDJjZC1hYWI2LTBkZDdkNTBhOTEzMSJ9.JTeHmSD_IhlxYloN_CwJRtsycMZZoOqXDcRhq61mXRXepc0gDDHCI13ne5Dp0f6c7WlppyVmXKrmz8xR8pFA7VsIIW8IaiNMyqyAlIeQGOOTdTtD1WeH7eRj1_lkMPo-fMSUehKijOHDfi5br55zop3ODIdnSg_bYGY1t8t6-E6EEGdCmP8Z61Q_3YI8boQi3mKBgaDMVimCrS1LNXW1xxjI1kAJePKaIZ5my8hv9CDRLSClQUuNMA8LiIgZWZ4Kx-zchUR9E5fgw9dlTCxneUQw4SrhFfE4Kf5ljCGtcLFnp0ihSaF88c6UomMDXgrUUJKdnC9_xjkdsJC5RB4DEg';

      const url = `${this.baseUrl}${this.endpoint}`;

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'x-client-code': 'STD-PER-FPP',
        'x-organization-code': 'Santander',
        'x-santander-client-id':
          process.env.SANTANDER_CLIENT_ID || 'O2XRSU4kVspEGbLDDGfFC5BOTrGKh5Ts',
        'x-schema-id': 'GHOBP',
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'es-419,es;q=0.9',
        Origin: 'https://mibanco.santander.cl',
        Referer: 'https://mibanco.santander.cl/',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
      };

      // Remove password from request body before sending to API
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...requestBody } = requestDto;

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Santander API error response:', errorText);
        throw new HttpException(
          `Santander API error: ${response.status} ${response.statusText}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const data = (await response.json()) as SantanderApiResponse;
      if (!data.movements) {
        return { movements: [] };
      }

      const movements = data.movements.map(
        (movement: RawMovement): Movement => ({
          accountingDate: new Date(movement.accountingDate),
          transactionDate: new Date(movement.transactionDate),
          operationTime: movement.operationTime,
          newBalance: movement.newBalance,
          codeOperationMovement: movement.codeOperationMovement,
          movementAmount: movement.movementAmount,
          observation: movement.observation,
          expandedCode: movement.expandedCode,
          movementNumber: movement.movementNumber,
          chargePaymentFlag: movement.chargePaymentFlag,
        }),
      );

      // Save movements to database
      await this.saveMovements(movements);

      return { movements };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('Santander API error:', error);
      throw new HttpException(
        `Failed to fetch transactions from Santander: ${error instanceof Error ? error.message : 'Unknown error'}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async saveMovements(movements: Movement[]): Promise<void> {
    try {
      const movementEntities = movements.map((movement) => {
        const entity = new SantanderMovement();
        entity.accountingDate = movement.accountingDate;
        entity.transactionDate = movement.transactionDate;
        entity.operationTime = movement.operationTime;
        entity.newBalance = parseFloat(movement.newBalance);
        entity.codeOperationMovement = movement.codeOperationMovement;
        entity.movementAmount = parseFloat(movement.movementAmount);
        entity.observation = movement.observation;
        entity.expandedCode = movement.expandedCode;
        entity.movementNumber = movement.movementNumber;
        entity.chargePaymentFlag = movement.chargePaymentFlag;
        return entity;
      });

      // Simple insert since we removed the unique constraint
      await this.santanderMovementRepository
        .createQueryBuilder()
        .insert()
        .into(SantanderMovement)
        .values(movementEntities)
        .execute();

      console.log(`Saved ${movementEntities.length} movements to database`);
    } catch (error) {
      console.error('Error saving movements to database:', error);
      throw new HttpException(
        'Failed to save movements to database',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
