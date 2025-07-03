import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from '../users/dto/login.dto';
import { User } from '../users/user.entity';
import { v4 as uuidv4 } from 'uuid';

describe('AuthService', () => {
  let service: AuthService;

  const mockUser: User = {
    id: uuidv4(),
    email: 'test@example.com',
    password: 'hashedPassword',
    firstName: 'John',
    lastName: 'Doe',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUsersService = {
    validateUser: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user when credentials are valid', async () => {
      mockUsersService.validateUser.mockResolvedValue(mockUser);

      const result = await service.validateUser('test@example.com', 'password');

      expect(result).toEqual(mockUser);
      expect(mockUsersService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password',
      );
    });

    it('should return null when credentials are invalid', async () => {
      mockUsersService.validateUser.mockResolvedValue(null);

      const result = await service.validateUser(
        'test@example.com',
        'wrongpassword',
      );

      expect(result).toBeNull();
      expect(mockUsersService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'wrongpassword',
      );
    });
  });

  describe('login', () => {
    it('should return access token and user data when login is successful', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };

      const expectedToken = 'jwt-token';
      const expectedResponse = {
        access_token: expectedToken,
        user: {
          id: mockUser.id,
          email: mockUser.email,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
        },
      };

      mockUsersService.validateUser.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue(expectedToken);

      const result = await service.login(loginDto);

      expect(result).toEqual(expectedResponse);
      expect(mockUsersService.validateUser).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.id,
      });
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      mockUsersService.validateUser.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockUsersService.validateUser).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
    });
  });

  describe('register', () => {
    it('should return access token and user data when registration is successful', async () => {
      const createUserDto: CreateUserDto = {
        email: 'new@example.com',
        password: 'password',
        firstName: 'Jane',
        lastName: 'Smith',
      };

      const createdUser = { ...mockUser, ...createUserDto };
      const expectedToken = 'jwt-token';
      const expectedResponse = {
        access_token: expectedToken,
        user: createdUser,
      };

      mockUsersService.create.mockResolvedValue(createdUser);
      mockJwtService.sign.mockReturnValue(expectedToken);

      const result = await service.register(createUserDto);

      expect(result).toEqual(expectedResponse);
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: createdUser.email,
        sub: createdUser.id,
      });
    });
  });
});
