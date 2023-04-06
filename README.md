# Parking System

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

```bash
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

## Docker Compose
Access the application at http://localhost:3000.
```bash
# start the services
$ docker-compose up

# stop the services
$ docker-compose down
```

## Swagger API Documentation

This project comes with Swagger UI, which is an interactive API documentation tool that allows you to explore.

To access the Swagger UI, follow these steps:

- Start the server by running `npm start`
- Open a web browser and go to `http://localhost:<PORT>/api/docs`

## Entities
#### `ParkingLot`
The parking-lot entity represents a parking slot in the parking lot. It has the following properties:
    
- `id`: a primary key identifier for the parking slot.
- `slotNumber`: the number of the parking slot, which should be unique.
- `isOccupied`: a flag indicating whether the slot is currently occupied by a vehicle or not.
- `isAvailable`: a flag indicating whether the slot is available for parking or not.
- `size`: the size of the parking slot, which can be one of the values defined in the `CarSize` enum.
- `createdAt`: the date and time when the parking slot was created.
- `updatedAt`: the date and time when the parking slot was last updated.


#### `Car`
The car entity represents car info in a parking lot. It has the following properties:

- `id`: a primary key identifier of the car.
- `plateNumber`: the license plate number of the car.
- `size`: the size of the car (small, medium, large).
- `createdAt`: the date and time when the car was created.
- `updatedAt`: the date and time when the parking slot was last updated.

#### `Ticket`
The ticket entity represents a record of a car's parking session in a specific parking lot. It has the following properties:

- `id`: a primary key identifier of the ticket.
- `entryTime`: the date and time the car entered the parking lot and the parking session started.
- `exitTime`: the date and time the car exited the parking lot and the parking session ended (nullable, as the car might still be parked).
- `isClosed`: a boolean flag indicating whether the parking session has ended or not.
- `car`: a many-to-one relationship with the `Car` entity, representing the car that is parked.
- `parkingLot`: a many-to-one relationship with the `ParkingLot` entity, representing the parking lot where the car is parked.
- `createdAt`: the date and time when the ticket was created.
- `updatedAt`: the date and time when the ticket was last updated.

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
├── Dockerfile                  # Docker image configuration
├── docker-compose.yml          # Docker Compose configuration
├── .dockerignore               # Folder and files ignored by docker
├── .gitignore                  # Folder and files ignored by git
├── .editorconfig               # Editor configuration file
├── .nvmrc                      # Node Version Manager
├── .prettierrc                 # Role for prettierrc
├── package-lock.json           # Contains exact versions of NPM dependencies in package.json
├── package.json                # NPM dependencies
├── tsconfig.json               # Config settings for compiling server code written in TypeScript
├── README.md                   # Project README
```
