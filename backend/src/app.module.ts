import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SantanderModule } from './santander/santander.module';
import { User } from './users/user.entity';
import { SantanderMovement } from './santander/entities/santander-movement.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'nestjs_auth',
      entities: [User, SantanderMovement],
      synchronize: process.env.NODE_ENV === 'development', // Only true in development
    }),
    AuthModule,
    UsersModule,
    SantanderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
