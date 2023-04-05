import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { SystemModule } from './modules/system/system.module';
import { ParkingLotModule } from './modules/parking-lot/parking-lot.module';

@Module({
  imports: [DatabaseModule, SystemModule, ParkingLotModule],
})
export class AppModule {}
