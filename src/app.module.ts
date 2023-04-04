import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { DatabaseModule } from './database/database.module';
import { SystemController } from './system/system.controller';

@Module({
  imports: [TerminusModule, DatabaseModule],
  controllers: [SystemController],
  providers: [],
})
export class AppModule {}
