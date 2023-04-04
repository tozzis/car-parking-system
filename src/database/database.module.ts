import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import config from 'src/config';

const options: TypeOrmModuleOptions = {
  type: 'postgres',
  host: config.database.host,
  port: Number(config.database.port),
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  entities: [join(__dirname, '/../**/**.entity{.ts,.js}')],
  synchronize: true,
};

@Module({
  imports: [TypeOrmModule.forRoot(options)],
  controllers: [],
  providers: [],
})
export class DatabaseModule {}
