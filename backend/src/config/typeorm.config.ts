import { DataSource } from 'typeorm';
import { User } from '../users/user.entity';
import { SantanderMovement } from '../santander/entities/santander-movement.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'nestjs_auth',
  entities: [User, SantanderMovement],
  migrations: ['src/migrations/*.ts'],
  synchronize: false, // Always false for migrations
  logging: true,
});
