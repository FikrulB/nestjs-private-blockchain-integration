<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

# Backend Application README

## Table of Contents
1. [Prerequisites & Requirements](#prerequisites--requirements)
2. [Setting Up Environment and Database URL](#setting-up-environment-and-database-url)
3. [Using Migrations with Prisma](#using-migrations-with-prisma)
4. [Node Package Installation](#node-package-installation)
5. [Run the App](#run-the-app)
6. [Build the App](#build-the-app)
7. [Deploy the App](#deploy-the-app)
8. [Swagger Information](#swagger-information)

## Prerequisites & Requirements

Before you begin, ensure you have met the following requirements:
- **Node.js** (>= 18.x) and **npm**
- **PostgreSQL** installed and running.
- **NestJS CLI** (`npm i -g @nestjs/cli`)

## Setting Up Environment and Database URL

1. Create a `.env` file in the root of your project directory:

    ```bash
    touch .env
    ```

2. Add the following environment variables to the `.env` file:

    ```plaintext
    DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
    ```
    Replace `USER`, `PASSWORD`, `HOST`, `PORT`, and `DATABASE` with your PostgreSQL credentials.

## Using Migrations with Prisma

1. Define your data model in the `prisma/schema.prisma` file.

2. Generate Prisma Client:

    ```bash
	npx prisma generate
    ```

3. Create a new migration:

    ```bash
    npm run migrate:create <migration_name>
    ```

    Replace `<migration_name>` with a descriptive name for your migration.

4. Deploy migration to database:
	```bash
	npm run migrate
	```

## Node Package Installation

1. Install the necessary packages:

    ```bash
    npm install
    ```

## Running the App

1. To run the app in development mode:

```bash
# development
$ npm run start

# watch mode realtime debugging development
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Build the App

1. To build the app for production:

    ```bash
    npm run build
    ```

## Deploy the App

1. After building the app, deploy the generated files from the `dist` folder to your server.
2. Ensure that the environment variables are set properly on the deployment server.

3. Start the application using a process manager like **PM2**:

    ```bash
    pm2 start dist/main.js
    ```

## Swagger Information

1. Swagger is used to describe your API and its endpoints.
2. In your main module, import Swagger and setup the options:

    ```typescript
    import { NestFactory } from '@nestjs/core';
    import { AppModule } from './app.module';
    import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

    async function bootstrap() {
      const app = await NestFactory.create(AppModule);

      const config = new DocumentBuilder()
        .setTitle('Your API')
        .setDescription('API description')
        .setVersion('1.0')
        .addTag('tag')
        .build();
      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('api', app, document);

      await app.listen(3000);
    }
    bootstrap();
    ```
3. Start your application and navigate to `http://localhost:3000/api` to view the Swagger documentation.

---

Follow these steps to set up and maintain your backend application using NestJS, PostgreSQL, Prisma, and Swagger efficiently.


## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
