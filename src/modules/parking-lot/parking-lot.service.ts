import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Car } from 'src/database/entities/car.entity';
import { Ticket } from 'src/database/entities/ticket.entity';
import { ParkingLot } from 'src/database/entities/parking-lot.entity';
import { CarSize } from 'src/shared/constants/car-size.enum';
import {
  CarSizeStatus,
  IParkingLotService,
  LeaveParkingResponse,
  ParkingLotStatusResponse,
} from './parking-lot.interface';
import { calculateDateDifferenceInMinutes } from 'src/shared/utils';

@Injectable()
export class ParkingLotService implements IParkingLotService {
  constructor(
    @InjectRepository(Car)
    private carRepository: Repository<Car>,
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    @InjectRepository(ParkingLot)
    private parkingLotRepository: Repository<ParkingLot>,
  ) {}

  // 01-create_parking_lots
  async createParkingLot(capacity: number): Promise<ParkingLotStatusResponse> {
    const countLots = await this.parkingLotRepository.count();

    if (capacity < countLots) {
      throw new BadRequestException(
        'There are more parking spaces than requested.',
      );
    }

    const quantity = capacity - countLots;
    if (quantity > 0) {
      let parkingLots: ParkingLot[] = [];
      for (let i = 1; i <= quantity; i++) {
        const parkingLot = new ParkingLot();
        parkingLot.slotNumber = i + countLots;
        parkingLots.push(parkingLot);
      }

      await this.parkingLotRepository.save(parkingLots);
    }

    return this.getParkingLotStatus();
  }

  // 01-update_parking_lots
  async updateParkingLot(
    slotNumbers: number[],
    isAvailable: boolean,
    size: CarSize,
  ): Promise<ParkingLot[]> {
    const parkingLots = await this.parkingLotRepository.find({
      where: { slotNumber: In(slotNumbers) },
    });

    if (!parkingLots || parkingLots.length === 0) {
      throw new NotFoundException(`No parking lots ${slotNumbers.join(',')}`);
    }

    for (const slot of parkingLots) {
      slot.isAvailable = isAvailable;
      slot.size = size;
    }

    await this.parkingLotRepository.save(parkingLots);

    return parkingLots;
  }

  // 02-park_car
  async parkCar(plateNumber: string, carSize: CarSize): Promise<Ticket> {
    let car = await this.carRepository.findOne({ where: { plateNumber } });

    if (!car) {
      car = new Car();
      car.plateNumber = plateNumber;
      car.size = carSize;

      await this.carRepository.save(car);
    } else {
      const ticket = await this.ticketRepository.findOne({
        where: { car: { id: car.id }, isClosed: false },
        relations: ['parkingLot', 'car'],
      });

      if (ticket) return ticket;
    }

    const nearestAvailableSlot = await this.parkingLotRepository
      .createQueryBuilder('parkingLot')
      .where('parkingLot.size = :size', { size: car.size })
      .andWhere('parkingLot.isOccupied = false')
      .andWhere('parkingLot.isAvailable = true')
      .orderBy('ABS(parkingLot.slotNumber - 1)', 'ASC')
      .getOne();

    if (!nearestAvailableSlot) {
      throw new NotFoundException(
        `No available parking slot found for car size ${car.size}`,
      );
    }

    nearestAvailableSlot.isOccupied = true;
    const ticket = new Ticket();
    ticket.entryTime = new Date();
    ticket.parkingLot = nearestAvailableSlot;
    ticket.car = car;

    await Promise.all([
      this.ticketRepository.save(ticket),
      this.parkingLotRepository.save(nearestAvailableSlot),
    ]);

    return ticket;
  }

  // 03-leave_slot
  async leaveParkingLotByTicketId(
    ticketId: number,
  ): Promise<LeaveParkingResponse> {
    const ticket = await this.ticketRepository.findOne({
      where: { id: ticketId, isClosed: false },
      relations: ['parkingLot'],
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found or already closed');
    }

    ticket.isClosed = true;
    ticket.exitTime = new Date();
    ticket.parkingLot.isOccupied = false;

    await Promise.all([
      this.ticketRepository.save(ticket),
      this.parkingLotRepository.save(ticket.parkingLot),
    ]);

    return {
      pointTime: calculateDateDifferenceInMinutes(
        ticket.entryTime,
        ticket.exitTime,
      ),
      description: 'The parking slot has been successfully left',
    };
  }

  // 04-get_status_of_parking_lot
  async getParkingLotStatus(): Promise<ParkingLotStatusResponse> {
    const carSizeSlots = await this.parkingLotRepository
      .createQueryBuilder('parkingLot')
      .select('parkingLot.size, COUNT(*) as count')
      .where('parkingLot.isAvailable = true')
      .andWhere('parkingLot.isOccupied = false')
      .groupBy('parkingLot.size')
      .getRawMany();

    const availableCarSizes: CarSizeStatus = {};

    if (Array.isArray(carSizeSlots)) {
      carSizeSlots.forEach((item) => {
        availableCarSizes[item.size] = Number(item.count);
      });
    }

    const totalSlots = await this.parkingLotRepository.count({
      where: { isAvailable: true },
    });
    const availableSlots = await this.parkingLotRepository.count({
      where: { isOccupied: false, isAvailable: true },
    });
    const occupiedSlots = totalSlots - availableSlots;

    return {
      totalSlots,
      occupiedSlots,
      availableSlots,
      availableCarSizes,
    };
  }

  // 05-get_registration_plate_number_list_by_car_size
  async getPlateNumberListByCarSize(carSize: CarSize): Promise<string[]> {
    const tickets = await this.ticketRepository.find({
      relations: ['car'],
      where: {
        isClosed: false,
        car: { size: carSize },
      },
    });

    return tickets.map((ticket) => ticket.car.plateNumber);
  }

  // 06-get_allocated_slot_number_by_car_size
  async getAllocatedLotsByCarSize(carSize: CarSize): Promise<number[]> {
    const allocatedSlots = await this.parkingLotRepository.find({
      where: { size: carSize, isOccupied: true, isAvailable: true },
    });

    return allocatedSlots.map((parkingLot) => parkingLot.slotNumber);
  }
}
