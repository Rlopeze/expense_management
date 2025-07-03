import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from '../users/dto/login.dto';
import { User } from '../users/user.entity';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

interface RequestWithUser extends Request {
  user: User;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto) {
    const dtoInstance = plainToInstance(CreateUserDto, createUserDto);
    const errors = await validate(dtoInstance);
    if (Array.isArray(errors) && errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    // Manually validate the DTO
    const dtoInstance = plainToInstance(LoginDto, loginDto);
    const errors = await validate(dtoInstance);
    if (Array.isArray(errors) && errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: RequestWithUser) {
    const { password: _, ...userWithoutPassword } = req.user;
    return userWithoutPassword;
  }
}
