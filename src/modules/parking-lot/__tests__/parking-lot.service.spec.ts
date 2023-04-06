import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  LeaveParkingResponse,
  ParkingLotStatusResponse,
} from '../parking-lot.interface';
import { ParkingLotService } from '../parking-lot.service';
import { Car } from 'src/database/entities/car.entity';
import { Ticket } from 'src/database/entities/ticket.entity';
import { ParkingLot } from 'src/database/entities/parking-lot.entity';
import { CarSize } from 'src/shared/constants/car-size.enum';
import { NotFoundException } from '@nestjs/common';

describe('ParkingLotService', () => {
  let service: ParkingLotService;
  let carRepository: Repository<Car>;
  let ticketRepository: Repository<Ticket>;
  let parkingLotRepository: Repository<ParkingLot>;

  const CAR_REPOSITORY_TOKEN = getRepositoryToken(Car);
  const TICKET_REPOSITORY_TOKEN = getRepositoryToken(Ticket);
  const PARKING_REPOSITORY_TOKEN = getRepositoryToken(ParkingLot);

  const mockRepository = {
    find: jest.fn(),
    save: jest.fn(),
    count: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockReturnThis(),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParkingLotService,
        {
          provide: CAR_REPOSITORY_TOKEN,
          useValue: mockRepository,
        },
        {
          provide: TICKET_REPOSITORY_TOKEN,
          useValue: mockRepository,
        },
        {
          provide: PARKING_REPOSITORY_TOKEN,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ParkingLotService>(ParkingLotService);
    carRepository = module.get<Repository<Car>>(CAR_REPOSITORY_TOKEN);
    ticketRepository = module.get<Repository<Ticket>>(TICKET_REPOSITORY_TOKEN);
    parkingLotRepository = module.get<Repository<ParkingLot>>(
      PARKING_REPOSITORY_TOKEN,
    );
  });

  describe('01-create_parking_lots', () => {
    const input = 5;

    it('should create a parking lot and return parking lot status', async () => {
      const expectedResponse: ParkingLotStatusResponse = {
        totalSlots: input,
        occupiedSlots: 0,
        availableSlots: input,
        availableCarSizes: {},
      };

      jest.spyOn(parkingLotRepository, 'count').mockResolvedValueOnce(0);
      jest.spyOn(parkingLotRepository, 'count').mockResolvedValueOnce(input);
      jest.spyOn(parkingLotRepository, 'count').mockResolvedValueOnce(input);

      const result = await service.createParkingLot(input);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('01-update_parking_lots', () => {
    const input = {
      slotNumbers: [1, 3],
      isAvailable: true,
      size: CarSize.SMALL,
    };

    it('should update a parking lot', async () => {
      let expectedResponse: ParkingLot[] = [];
      for (const number of input.slotNumbers) {
        const slot = new ParkingLot();
        slot.slotNumber = number;
        slot.isAvailable = input.isAvailable;
        slot.size = input.size;
        expectedResponse.push(slot);
      }

      let dataMock: ParkingLot[] = [];
      for (const number of input.slotNumbers) {
        const slot = new ParkingLot();
        slot.slotNumber = number;
        slot.isAvailable = false;
        slot.size = CarSize.MEDIUM;
        dataMock.push(slot);
      }

      jest.spyOn(parkingLotRepository, 'find').mockResolvedValueOnce(dataMock);

      const result = await service.updateParkingLot(
        input.slotNumbers,
        input.isAvailable,
        input.size,
      );
      expect(result).toEqual(expectedResponse);
    });

    it('should throw NotFoundException if parking lot not found', async () => {
      jest.spyOn(parkingLotRepository, 'find').mockResolvedValueOnce([]);

      await expect(
        service.updateParkingLot(
          input.slotNumbers,
          input.isAvailable,
          input.size,
        ),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('02-park_car', () => {
    const input = {
      plateNumber: 'TOP-1234',
      carSize: CarSize.MEDIUM,
    };

    const dateMock = new Date();
    const parkingLotMock = new ParkingLot();
    parkingLotMock.id = 1;
    parkingLotMock.slotNumber = 1;
    parkingLotMock.isOccupied = true;

    const carInput = new Car();
    carInput.plateNumber = input.plateNumber;
    carInput.size = input.carSize;

    let expectedResponse = new Ticket();
    expectedResponse.car = carInput;
    expectedResponse.parkingLot = parkingLotMock;
    expectedResponse.entryTime = dateMock;

    it('should park the car and return the ticket', async () => {
      jest.spyOn(global, 'Date').mockImplementationOnce(() => dateMock as any);
      jest.spyOn(carRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(parkingLotRepository, 'createQueryBuilder').mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(parkingLotMock),
      } as any);

      const result = await service.parkCar(input.plateNumber, input.carSize);
      expect(result).toEqual(expectedResponse);
    });

    it('should park the car and there is a car in the parking lot', async () => {
      let ticket = new Ticket();
      ticket.car = carInput;
      ticket.parkingLot = parkingLotMock;
      ticket.entryTime = dateMock;

      jest.spyOn(carRepository, 'findOne').mockResolvedValueOnce(carInput);
      jest.spyOn(ticketRepository, 'findOne').mockResolvedValueOnce(ticket);

      const result = await service.parkCar(input.plateNumber, input.carSize);
      expect(result).toEqual(expectedResponse);
    });

    it('should park the car and throw NotFoundException if the full parking lot', async () => {
      jest.spyOn(carRepository, 'findOne').mockResolvedValueOnce(carInput);
      jest.spyOn(ticketRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(parkingLotRepository, 'createQueryBuilder').mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(
        service.parkCar(input.plateNumber, input.carSize),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('03-leave_slot', () => {
    const input = 1;
    const entryTime = new Date('2022-04-04T10:00:00Z');
    const exitTime = new Date('2022-04-04T11:30:00Z');

    let ticketMock = new Ticket();
    ticketMock.id = 1;
    ticketMock.entryTime = entryTime;
    ticketMock.parkingLot = new ParkingLot();

    it('should leave slot', async () => {
      const expectedResponse: LeaveParkingResponse = {
        pointTime: 90,
        description: 'The parking slot has been successfully left',
      };

      jest.spyOn(global, 'Date').mockImplementationOnce(() => exitTime as any);
      jest.spyOn(ticketRepository, 'findOne').mockResolvedValueOnce(ticketMock);

      const result = await service.leaveParkingLotByTicketId(input);
      expect(result).toEqual(expectedResponse);
    });

    it('should leave slot and throw NotFoundException if ticket not found', async () => {
      jest.spyOn(ticketRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(
        service.leaveParkingLotByTicketId(input),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('04-get_status_of_parking_lot', () => {
    it('get parking lot status', async () => {
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

      jest.spyOn(parkingLotRepository, 'createQueryBuilder').mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue(
          Object.keys(expectedResponse.availableCarSizes).map((key) => {
            return {
              size: key,
              count: expectedResponse.availableCarSizes[key],
            };
          }),
        ),
      } as any);
      jest
        .spyOn(parkingLotRepository, 'count')
        .mockResolvedValueOnce(expectedResponse.totalSlots);
      jest
        .spyOn(parkingLotRepository, 'count')
        .mockResolvedValueOnce(expectedResponse.availableSlots);

      const result = await service.getParkingLotStatus();
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('05-get_registration_plate_number_list_by_car_size', () => {
    const input = CarSize.MEDIUM;

    it('get registration plate number by car size', async () => {
      const expectedResponse: string[] = ['TOP-123', 'ABC-123', 'XYZ-123'];

      const ticketMocks: Ticket[] = expectedResponse.map((value) => {
        const car = new Car();
        car.size = input;
        car.plateNumber = value;
        const ticket = new Ticket();
        ticket.car = car;

        return ticket;
      });

      jest.spyOn(ticketRepository, 'find').mockResolvedValueOnce(ticketMocks);

      const result = await service.getPlateNumberListByCarSize(input);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('06-get_allocated_slot_number_by_car_size', () => {
    const input = CarSize.MEDIUM;

    it('get registration allocated slot number by car size', async () => {
      const expectedResponse: number[] = [1, 3, 5];

      const parkingLotMocks: ParkingLot[] = expectedResponse.map((value) => {
        const parkingLot = new ParkingLot();
        parkingLot.slotNumber = value;

        return parkingLot;
      });

      jest
        .spyOn(parkingLotRepository, 'find')
        .mockResolvedValueOnce(parkingLotMocks);

      const result = await service.getAllocatedLotsByCarSize(input);
      expect(result).toEqual(expectedResponse);
    });
  });
});
