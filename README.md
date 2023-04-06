# Parking Systems

The Parking System is a REST API that allows users to manage parking lots and park their cars. The Parking System is built using [Node.js](https://nodejs.org/), [NestJS](https://github.com/nestjs/nest), and TypeScript, and is backed by a PostgreSQL database.

## Installation

```bash
$ npm install
```

## Configuration

The following environment variables need to be set to run the application:

- `PORT`: The port that the server listens to.
- `DATABASE_HOST`: The host of the database.
- `DATABASE_PORT`: The port of the database.
- `DATABASE_NAME`: The name of the database.
- `DATABASE_USER`: The username to connect to the database.
- `DATABASE_PASSWORD`: The password to connect to the database.

To run the application locally with default values, create a .env file at the root of the project with the following content:

```
PORT=3000
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=postgres
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Swagger API Documentation

This project comes with Swagger UI, which is an interactive API documentation tool that allows you to explore.

To access the Swagger UI, follow these steps:

- Start the server by running `npm start`
- Open a web browser and go to `http://localhost:<PORT>/api/docs`

## Project Structure

```
├── src                         # The actual source for the app goes here
|   ├── shared                  # Shared modules, config, constants, etc
|       ├── config              # Config values
|       ├── constants           # Constant values
|   ├── database                # Database configuration
|       ├── entities            # TypeORM entities
|       ├── database.module.ts  # Database module
|   ├── modules                 # Modules of the application
|       ├── parking-lot         # This module manages the parking lot system
|       ├── system              # This module manages system health checks
|   ├── app.module.ts           # Main app module
|   └── main.ts
├── .editorconfig               # Editor configuration file
├── .gitignore                  # Folder and files ignored by git
├── .nvmrc                      # Node Version Manager
├── .prettierrc                 # Role for prettierrc
├── package-lock.json           # Contains exact versions of NPM dependencies in package.json
├── package.json                # NPM dependencies
├── tsconfig.json               # Config settings for compiling server code written in TypeScript
```
