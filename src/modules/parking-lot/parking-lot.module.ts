import { Module } from '@nestjs/common';
import { ParkingLotService } from './parking-lot.service';
import { ParkingLotController } from './parking-lot.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingLot } from 'src/database/entities/parking-lot.entity';
import { Ticket } from 'src/database/entities/ticket.entity';
import { Car } from 'src/database/entities/car.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ParkingLot, Ticket, Car])],
  providers: [ParkingLotService],
  controllers: [ParkingLotController]
})
export class ParkingLotModule {}
