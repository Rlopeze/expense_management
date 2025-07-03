import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SantanderService } from './santander.service';
import { SantanderController } from './santander.controller';
import { SantanderScraperService } from './santander-scraper.service';
import { SantanderScraperController } from './santander-scraper.controller';
import { User } from '../users/user.entity';
import { SantanderMovement } from './entities/santander-movement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, SantanderMovement])],
  providers: [SantanderService, SantanderScraperService],
  controllers: [SantanderController, SantanderScraperController],
  exports: [SantanderService, SantanderScraperService],
})
export class SantanderModule {}
