import { Ticket } from 'src/database/entities/ticket.entity';
import { ParkingLot } from 'src/database/entities/parking-lot.entity';
import { CarSize } from 'src/shared/constants/car-size.enum';

export interface IParkingLotService {
  createParkingLot(capacity: number): Promise<ParkingLotStatusResponse>;
  updateParkingLot(
    slotNumbers: number[],
    isAvailable: boolean,
    size: CarSize,
  ): Promise<ParkingLot[]>;
  parkCar(plateNumber: string, carSize: CarSize): Promise<Ticket>;
  leaveParkingLotByTicketId(ticketId: number): Promise<LeaveParkingResponse>;
  getParkingLotStatus(): Promise<ParkingLotStatusResponse>;
  getPlateNumberListByCarSize(carSize: CarSize): Promise<string[]>;
  getAllocatedLotsByCarSize(carSize: CarSize): Promise<number[]>;
}

export interface CarSizeStatus {
  small?: number;
  medium?: number;
  large?: number;
}

export interface ParkingLotStatusResponse {
  totalSlots: number;
  occupiedSlots: number;
  availableSlots: number;
  availableCarSizes: CarSizeStatus;
}

export interface LeaveParkingResponse {
  pointTime: number;
  description: string;
}
