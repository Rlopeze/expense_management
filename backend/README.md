<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# NestJS Authentication Backend

A complete authentication system built with NestJS, PostgreSQL, and JWT.

## Features

- User registration and login with JWT authentication
- Password hashing with bcrypt
- PostgreSQL database with UUID primary keys
- Comprehensive test coverage
- Docker support for easy deployment

## Quick Start with Docker

### Development Mode

```bash
# Start the application with hot reload
npm run docker:dev

# Or manually
docker-compose -f docker-compose.dev.yml up --build
```

### Production Mode

```bash
# Start the production application
npm run docker:prod

# Or manually
docker-compose up --build
```

### Stop Services

```bash
# Stop all services
npm run docker:down

# Stop and remove volumes (database data)
npm run docker:clean
```

## Manual Setup

### Prerequisites

- Node.js 18+
- PostgreSQL 15+

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=nestjs_auth
JWT_SECRET=your-secret-key
```

### Running the Application

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## API Endpoints

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get user profile (requires JWT)

## Testing

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Docker Commands

- `npm run docker:build` - Build the Docker image
- `npm run docker:run` - Run the container
- `npm run docker:dev` - Start development environment
- `npm run docker:prod` - Start production environment
- `npm run docker:down` - Stop all services
- `npm run docker:clean` - Stop and clean up volumes

## Database Migrations

This project uses TypeORM migrations for database schema management.

### Available Commands

- **Generate Migration**: `npm run migration:generate -- src/migrations/MigrationName`
  - Generates a migration based on entity changes
  - Example: `npm run migration:generate -- src/migrations/AddNewColumn`

- **Create Empty Migration**: `npm run migration:create -- src/migrations/MigrationName`
  - Creates an empty migration file for manual SQL
  - Example: `npm run migration:create -- src/migrations/CustomMigration`

- **Run Migrations**: `npm run migration:run`
  - Applies all pending migrations to the database

- **Revert Last Migration**: `npm run migration:revert`
  - Reverts the most recent migration

- **Schema Sync**: `npm run schema:sync`
  - Syncs the database schema with entities (development only)

- **Schema Drop**: `npm run schema:drop`
  - Drops all tables (⚠️ destructive)

### Migration Workflow

1. **Development**: Make changes to your entities
2. **Generate Migration**: `npm run migration:generate -- src/migrations/DescriptiveName`
3. **Review**: Check the generated migration file
4. **Run Migration**: `npm run migration:run`
5. **Test**: Verify your changes work correctly

### Important Notes

- Always review generated migrations before running them
- Never modify existing migration files that have been applied to production
- Use `synchronize: false` in production environments
- Back up your database before running migrations in production

## Installation

```bash
npm install
```

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## Docker

```bash
# Development
npm run docker:dev

# Production
npm run docker:prod

# Stop containers
npm run docker:down

# Clean up volumes
npm run docker:clean
```
