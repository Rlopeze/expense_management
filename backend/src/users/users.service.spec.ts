import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

describe('UsersService', () => {
  let service: UsersService;

  const userArray: User[] = [];

  const mockRepository = {
    findOne: jest.fn(({ where }) => {
      if (where.email) {
        return userArray.find((u) => u.email === where.email) || null;
      }
      if (where.id) {
        return userArray.find((u) => u.id === where.id) || null;
      }
      return null;
    }),
    create: jest.fn((dto) => ({
      ...dto,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    save: jest.fn((user) => {
      userArray.push(user);
      return user;
    }),
  };

  beforeEach(async () => {
    userArray.length = 0;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      const result = await service.create(createUserDto);

      expect(result).toHaveProperty('id');
      expect(typeof result.id).toBe('string');
      expect(result.email).toBe(createUserDto.email);
      expect(result.firstName).toBe(createUserDto.firstName);
      expect(result.lastName).toBe(createUserDto.lastName);
      expect(result).not.toHaveProperty('password');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
    });

    it('should throw ConflictException when user with same email already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      // Create first user
      await service.create(createUserDto);

      // Try to create second user with same email
      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should hash the password before storing', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = await service.create(createUserDto);

      expect(result).not.toHaveProperty('password');

      // Verify password was hashed by trying to find user and validate
      const user = await service.findByEmail(createUserDto.email);
      expect(user).toBeDefined();
      expect(user?.password).not.toBe(createUserDto.password);
    });
  });

  describe('findByEmail', () => {
    it('should return user when email exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      await service.create(createUserDto);
      const foundUser = await service.findByEmail('test@example.com');

      expect(foundUser).toBeDefined();
      expect(foundUser?.email).toBe('test@example.com');
    });

    it('should return null when email does not exist', async () => {
      const foundUser = await service.findByEmail('nonexistent@example.com');
      expect(foundUser).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return user when id exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const createdUser = await service.create(createUserDto);
      const foundUser = await service.findById(createdUser.id);

      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe(createdUser.id);
    });

    it('should return null when id does not exist', async () => {
      const foundUser = await service.findById(uuidv4());
      expect(foundUser).toBeNull();
    });
  });

  describe('validateUser', () => {
    it('should return user when credentials are valid', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      await service.create(createUserDto);
      const validatedUser = await service.validateUser(
        'test@example.com',
        'password123',
      );

      expect(validatedUser).toBeDefined();
      expect(validatedUser?.email).toBe('test@example.com');
    });

    it('should return null when email does not exist', async () => {
      const validatedUser = await service.validateUser(
        'nonexistent@example.com',
        'password123',
      );
      expect(validatedUser).toBeNull();
    });

    it('should return null when password is incorrect', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      await service.create(createUserDto);
      const validatedUser = await service.validateUser(
        'test@example.com',
        'wrongpassword',
      );

      expect(validatedUser).toBeNull();
    });
  });
});
