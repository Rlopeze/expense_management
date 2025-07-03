import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  SantanderScraperService,
  SantanderCredentials,
} from './santander-scraper.service';

@Controller('santander/scraper')
export class SantanderScraperController {
  constructor(private readonly scraperService: SantanderScraperService) {}

  @Post('extract-token')
  async extractToken(@Body() credentials: SantanderCredentials) {
    if (!credentials.username || !credentials.password) {
      throw new HttpException(
        'Username and password are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.scraperService.extractToken(credentials);

    if (!result.success) {
      throw new HttpException(
        result.error || 'Failed to extract token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      success: true,
      token: result.token,
      message: 'Token extracted successfully',
    };
  }
}
