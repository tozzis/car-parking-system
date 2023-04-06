import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Car } from 'src/database/entities/car.entity';
import { ParkingLot } from 'src/database/entities/parking-lot.entity';
import { Ticket } from 'src/database/entities/ticket.entity';
import { CarSize } from 'src/shared/constants/car-size.enum';
import { CreateParkingLotDto } from '../dto/create-parking-lot.dto';
import { LeaveParkingDto } from '../dto/leave-parking.dto';
import { ParkCarDto } from '../dto/park-car.dto';
import { UpdateParkingLotDto } from '../dto/update-parking-lot.dto';
import { ParkingLotController } from '../parking-lot.controller';
import {
  LeaveParkingResponse,
  ParkingLotStatusResponse,
} from '../parking-lot.interface';
import { ParkingLotService } from '../parking-lot.service';

describe('ParkingLotController', () => {
  let controller: ParkingLotController;
  let parkingLotService: ParkingLotService;

  const CAR_REPOSITORY_TOKEN = getRepositoryToken(Car);
  const TICKET_REPOSITORY_TOKEN = getRepositoryToken(Ticket);
  const PARKING_REPOSITORY_TOKEN = getRepositoryToken(ParkingLot);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParkingLotController],
      providers: [
        ParkingLotService,
        {
          provide: CAR_REPOSITORY_TOKEN,
          useValue: {},
        },
        {
          provide: TICKET_REPOSITORY_TOKEN,
          useValue: {},
        },
        {
          provide: PARKING_REPOSITORY_TOKEN,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ParkingLotController>(ParkingLotController);
    parkingLotService = module.get<ParkingLotService>(ParkingLotService);
  });

  describe('01-create_parking_lots', () => {
    const input: CreateParkingLotDto = {
      capacity: 5,
    };

    it('should return create a parking lot', async () => {
      const expectedResponse: ParkingLotStatusResponse = {
        totalSlots: input.capacity,
        occupiedSlots: 0,
        availableSlots: input.capacity,
        availableCarSizes: {},
      };

      jest
        .spyOn(parkingLotService, 'createParkingLot')
        .mockResolvedValueOnce(expectedResponse);

      const result = await controller.createParkingLot(input);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('01-update_parking_lots', () => {
    const input: UpdateParkingLotDto = {
      slotNumbers: [1, 3],
      isAvailable: true,
      carSize: CarSize.SMALL,
    };

    it('should return update a parking lot', async () => {
      let expectedResponse: ParkingLot[] = [];
      for (const number of input.slotNumbers) {
        const slot = new ParkingLot();
        slot.slotNumber = number;
        slot.isAvailable = input.isAvailable;
        slot.size = input.carSize;
        expectedResponse.push(slot);
      }

      jest
        .spyOn(parkingLotService, 'updateParkingLot')
        .mockResolvedValueOnce(expectedResponse);

      const result = await controller.updateParkingSlot(input);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('02-park_car', () => {
    const input: ParkCarDto = {
      plateNumber: 'TOP-1234',
      carSize: CarSize.MEDIUM,
    };

    it('should return the ticket', async () => {
      const carInput = new Car();
      carInput.plateNumber = input.plateNumber;
      carInput.size = input.carSize;

      let expectedResponse: Ticket = new Ticket();
      expectedResponse.car = carInput;

      jest
        .spyOn(parkingLotService, 'parkCar')
        .mockResolvedValueOnce(expectedResponse);

      const result = await controller.parkCar(input);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('03-leave_slot', () => {
    const input: LeaveParkingDto = {
      ticketId: 1,
    };

    it('should return leave slot', async () => {
      const expectedResponse: LeaveParkingResponse = {
        pointTime: 90,
        description: 'The parking slot has been successfully left',
      };

      jest
        .spyOn(parkingLotService, 'leaveParkingLotByTicketId')
        .mockResolvedValueOnce(expectedResponse);

      const result = await controller.leaveSlot(input);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('04-get_status_of_parking_lot', () => {
    it('should return parking lot status', async () => {
      const expectedResponse: ParkingLotStatusResponse = {
        totalSlots: 5,
        occupiedSlots: 0,
        availableSlots: 5,
        availableCarSizes: {
          small: 1,
          medium: 2,
          large: 2,
        },
      };

      jest
        .spyOn(parkingLotService, 'getParkingLotStatus')
        .mockResolvedValueOnce(expectedResponse);

      const result = await controller.getParkingLotStatus();
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('05-get_registration_plate_number_list_by_car_size', () => {
    const input: CarSize = CarSize.MEDIUM;

    it('should return registration plate number list', async () => {
      const expectedResponse: string[] = ['TOP-123', 'ABC-123', 'XYZ-123'];

      jest
        .spyOn(parkingLotService, 'getPlateNumberListByCarSize')
        .mockResolvedValueOnce(expectedResponse);

      const result = await controller.getRegistrationPlateNumberListByCarSize(
        input,
      );
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('06-get_allocated_slot_number_by_car_size', () => {
    const input = CarSize.MEDIUM;

    it('should return registration allocated slot number list', async () => {
      const expectedResponse: number[] = [1, 3, 5];

      jest
        .spyOn(parkingLotService, 'getAllocatedLotsByCarSize')
        .mockResolvedValueOnce(expectedResponse);

      const result = await controller.getAllocatedLotsByCarSize(input);
      expect(result).toEqual(expectedResponse);
    });
  });
});
