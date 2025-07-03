import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SantanderService } from './santander.service';
import { TransactionRequestDto } from './dto/transaction-request.dto';
import { SantanderLoginDto } from './dto/santander-login.dto';
import { HttpException } from '@nestjs/common';
import { User } from '../users/user.entity';

describe('SantanderService', () => {
  let service: SantanderService;
  let mockUserRepository: any;

  beforeEach(async () => {
    mockUserRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SantanderService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<SantanderService>(SantanderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should throw an error when SANTANDER_CLIENT_ID is not set', async () => {
      const loginDto: SantanderLoginDto = {
        identifier: 'test-identifier',
        password: 'test-password',
      };

      // Mock process.env to not have the required client ID
      const originalEnv = process.env.SANTANDER_CLIENT_ID;
      delete process.env.SANTANDER_CLIENT_ID;

      try {
        await service.login(loginDto);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      } finally {
        // Restore original environment
        if (originalEnv) {
          process.env.SANTANDER_CLIENT_ID = originalEnv;
        }
      }
    });
  });

  describe('getTransactions', () => {
    it('should throw an error when no access token is provided and no password', async () => {
      const requestDto: TransactionRequestDto = {
        accountId: 'test-account-id',
      };

      // Mock process.env to not have the required token
      const originalEnv = process.env.SANTANDER_ACCESS_TOKEN;
      delete process.env.SANTANDER_ACCESS_TOKEN;

      try {
        await service.getTransactions(requestDto, 'user-id');
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      } finally {
        // Restore original environment
        if (originalEnv) {
          process.env.SANTANDER_ACCESS_TOKEN = originalEnv;
        }
      }
    });

    it('should throw an error when user identifier is not found', async () => {
      const requestDto: TransactionRequestDto = {
        accountId: 'test-account-id',
        password: 'test-password',
      };

      // Mock user repository to return null
      mockUserRepository.findOne.mockResolvedValue(null);

      try {
        await service.getTransactions(requestDto, 'user-id');
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toContain('User identifier not found');
      }
    });

    it('should throw an error when user has no identifier', async () => {
      const requestDto: TransactionRequestDto = {
        accountId: 'test-account-id',
        password: 'test-password',
      };

      // Mock user repository to return user without identifier
      mockUserRepository.findOne.mockResolvedValue({
        id: 'user-id',
        email: 'test@example.com',
        identifier: null,
      });

      try {
        await service.getTransactions(requestDto, 'user-id');
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toContain('User identifier not found');
      }
    });
  });
});
