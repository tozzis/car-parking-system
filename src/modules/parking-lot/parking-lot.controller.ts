import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { CarSize } from 'src/shared/constants/car-size.enum';
import { CreateParkingLotDto } from './dto/create-parking-lot.dto';
import { LeaveParkingDto } from './dto/leave-parking.dto';
import { ParkCarDto } from './dto/park-car.dto';
import { UpdateParkingLotDto } from './dto/update-parking-lot.dto';
import { ParkingLotService } from './parking-lot.service';

@Controller('parking-lot')
export class ParkingLotController {
  constructor(private readonly parkingLotService: ParkingLotService) {}

  // 01-create_parking_lots
  @Post()
  async createParkingLot(@Body() createParkingLotDto: CreateParkingLotDto) {
    const { capacity } = createParkingLotDto;
    return this.parkingLotService.createParkingLot(capacity);
  }

  // 01-update_parking_lots
  @Put()
  async updateParkingSlot(@Body() updateParkingLotDto: UpdateParkingLotDto) {
    const { slotNumbers, isAvailable, carSize } = updateParkingLotDto;
    return this.parkingLotService.updateParkingLot(
      slotNumbers,
      isAvailable,
      carSize,
    );
  }

  // 02-park_car
  @Post('park')
  async parkCar(@Body() parkCarDto: ParkCarDto) {
    const { plateNumber, carSize } = parkCarDto;
    return this.parkingLotService.parkCar(plateNumber, carSize);
  }

  // 03-leave_slot
  @Post('leave')
  async leaveSlot(@Body() leaveParkingDto: LeaveParkingDto) {
    const { ticketId } = leaveParkingDto;
    return this.parkingLotService.leaveParkingLotByTicketId(ticketId);
  }

  // 04-get_status_of_parking_lot
  @Get('status')
  async getParkingLotStatus() {
    return this.parkingLotService.getParkingLotStatus();
  }

  // 05-get_registration_plate_number_list_by_car_size
  @Get('registration-plate-numbers')
  async getRegistrationPlateNumberListByCarSize(
    @Query('carSize') carSize: CarSize,
  ) {
    return this.parkingLotService.getPlateNumberListByCarSize(carSize);
  }

  // 06-get_allocated_slot_number_by_car_size
  @Get('registration-allocated-slot-number')
  async getAllocatedLotsByCarSize(@Query('carSize') carSize: CarSize) {
    return this.parkingLotService.getAllocatedLotsByCarSize(carSize);
  }
}
