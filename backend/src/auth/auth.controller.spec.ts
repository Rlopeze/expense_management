import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from '../users/dto/login.dto';
import { v4 as uuidv4 } from 'uuid';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      const expectedResponse = {
        access_token: 'jwt-token',
        user: {
          id: 1,
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
        },
      };

      mockAuthService.register.mockResolvedValue(expectedResponse);

      const result = await controller.register(createUserDto);

      expect(result).toEqual(expectedResponse);
      expect(authService.register).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const expectedResponse = {
        access_token: 'jwt-token',
        user: {
          id: 1,
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
        },
      };

      mockAuthService.login.mockResolvedValue(expectedResponse);

      const result = await controller.login(loginDto);

      expect(result).toEqual(expectedResponse);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('getProfile', () => {
    it('should return user profile', () => {
      const mockUser = {
        id: uuidv4(),
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
      };

      const mockRequest = {
        user: mockUser,
        headers: {},
        method: 'GET',
        url: '',
        query: {},
        params: {},
        body: {},
        cookies: {},
        signedCookies: {},
        get: jest.fn(),
        header: jest.fn(),
        accepts: jest.fn(),
        acceptsCharsets: jest.fn(),
        acceptsEncodings: jest.fn(),
        acceptsLanguages: jest.fn(),
        range: jest.fn(),
        ...({} as any),
      };

      const result = controller.getProfile(mockRequest);

      expect(result).toEqual(mockUser);
    });
  });
});
