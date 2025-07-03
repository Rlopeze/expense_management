import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user successfully', () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(createUserDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user.email).toBe(createUserDto.email);
          expect(res.body.user.firstName).toBe(createUserDto.firstName);
          expect(res.body.user.lastName).toBe(createUserDto.lastName);
          expect(res.body.user).not.toHaveProperty('password');
        });
    });

    it('should return 409 when user with same email already exists', async () => {
      const createUserDto = {
        email: 'duplicate@example.com',
        password: 'password123',
      };

      // First registration
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(createUserDto)
        .expect(201);

      // Second registration with same email
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(createUserDto)
        .expect(409);
    });

    it('should return 400 when email is invalid', () => {
      const createUserDto = {
        email: 'invalid-email',
        password: 'password123',
      };

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(createUserDto)
        .expect(400);
    });

    it('should return 400 when password is too short', () => {
      const createUserDto = {
        email: 'test@example.com',
        password: '123',
      };

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(createUserDto)
        .expect(400);
    });
  });

  describe('/auth/login (POST)', () => {
    beforeEach(async () => {
      // Create a user for login tests
      const createUserDto = {
        email: 'login@example.com',
        password: 'password123',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(createUserDto);
    });

    it('should login user successfully with valid credentials', () => {
      const loginDto = {
        email: 'login@example.com',
        password: 'password123',
      };

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('access_token');
          expect(res.body).toHaveProperty('user');
          expect(res.body.user.email).toBe(loginDto.email);
        });
    });

    it('should return 401 when credentials are invalid', () => {
      const loginDto = {
        email: 'login@example.com',
        password: 'wrongpassword',
      };

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(401);
    });

    it('should return 401 when user does not exist', () => {
      const loginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto)
        .expect(401);
    });
  });

  describe('/auth/profile (GET)', () => {
    let accessToken: string;

    beforeEach(async () => {
      // Create a user and get access token
      const createUserDto = {
        email: 'profile@example.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Smith',
      };

      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send(createUserDto);

      accessToken = registerResponse.body.access_token;
    });

    it('should return user profile when authenticated', () => {
      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('email');
          expect(res.body.email).toBe('profile@example.com');
          expect(res.body).not.toHaveProperty('password');
        });
    });

    it('should return 401 when no token is provided', () => {
      return request(app.getHttpServer()).get('/auth/profile').expect(401);
    });

    it('should return 401 when invalid token is provided', () => {
      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });
});
