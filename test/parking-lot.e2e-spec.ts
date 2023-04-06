import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { CarSize } from 'src/shared/constants/car-size.enum';

describe('ParkingLotController (e2e)', () => {
  let app: INestApplication;
  const parkingLot = { capacity: 20 };

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('create and update parking lot', () => {
    it('POST /parking-lot should create a parking lot and return parking lot status', async () => {
      const response = await request(app.getHttpServer())
        .post('/parking-lot')
        .send(parkingLot)
        .expect(201);

      expect(response.body.totalSlots).toBeDefined();
      expect(response.body.totalSlots).toEqual(parkingLot.capacity);
    });

    it('PUT /parking-lot should update a parking lot and return the updated parking lot', async () => {
      const input = {
        slotNumbers: [1, 3, 5, 7, 9],
        isAvailable: true,
        carSize: CarSize.SMALL,
      };

      const response = await request(app.getHttpServer())
        .put('/parking-lot')
        .send(input)
        .expect(200);

      expect(response.body).toBeDefined();
    });
  });

  describe('check for errors in creating and updating the parking lot', () => {
    it('POST /parking-lot should create a parking lot and requested capacity is less than the car park', async () => {
      const input = { capacity: 10 };

      const response = await request(app.getHttpServer())
        .post('/parking-lot')
        .send(input)
        .expect(400);

      expect(response.body.message).toEqual(
        'There are more parking spaces than requested.',
      );
    });

    it('PUT /parking-lot should update a parking lot and parking lot not found', async () => {
      const input = {
        slotNumbers: [99],
        isAvailable: true,
        carSize: CarSize.LARGE,
      };

      const response = await request(app.getHttpServer())
        .put('/parking-lot')
        .send(input)
        .expect(404);

      expect(response.body.message).toEqual(
        `No parking lots ${input.slotNumbers.join(',')}`,
      );
    });
  });

  describe('park and leave the car in the parking lot', () => {
    let ticketId: number;

    const parkAPI = async (input) => {
      const response = await request(app.getHttpServer())
        .post('/parking-lot/park')
        .send(input)
        .expect(201);

      const ticketIdResponse = response.body.id;
      expect(ticketIdResponse).toBeDefined();

      return ticketIdResponse;
    };

    const leaveAPI = async (ticketId) => {
      const response = await request(app.getHttpServer())
        .post('/parking-lot/leave')
        .send({ ticketId })
        .expect(201);

      expect(response.body.pointTime).toBeDefined();
    };

    it('POST /parking-lot/park should park the car and return the ticket', async () => {
      const input = {
        plateNumber: 'TOP-9999',
        carSize: CarSize.MEDIUM,
      };

      ticketId = await parkAPI(input);
      expect(ticketId).toBeDefined();
    });

    it('POST /parking-lot/leave should leave slot', async () => {
      await leaveAPI(ticketId);
    });

    it('check logic park and leave', async () => {
      let ticketIds: number[] = [];
      const dataTest = [
        {
          plateNumber: 'TOP-1111',
          carSize: CarSize.MEDIUM,
        },
        {
          plateNumber: 'TOP-2222',
          carSize: CarSize.MEDIUM,
        },
        {
          plateNumber: 'TOP-3333',
          carSize: CarSize.MEDIUM,
        },
        {
          plateNumber: 'TOP-4444',
          carSize: CarSize.MEDIUM,
        },
      ];

      for (const data of dataTest) {
        ticketIds.push(await parkAPI(data));
      }
      await leaveAPI(ticketIds[1]);

      const parkResponse = await request(app.getHttpServer())
        .post('/parking-lot/park')
        .send({
          plateNumber: 'TOP-5555',
          carSize: CarSize.MEDIUM,
        })
        .expect(201);

      expect(parkResponse.body.id).toBeDefined();
      expect(parkResponse.body.parkingLot.slotNumber).toEqual(4);
    });
  });

  describe('check the status parking lot', () => {
    it('GET /parking-lot/status should return parking lot status', async () => {
      const response = await request(app.getHttpServer())
        .get('/parking-lot/status')
        .expect(200);

      expect(response.body.totalSlots).toBeDefined();
      expect(response.body.totalSlots).toEqual(parkingLot.capacity);
    });

    it('GET /parking-lot/registration-plate-numbers should return plate number list', async () => {
      const response = await request(app.getHttpServer())
        .get('/parking-lot/registration-plate-numbers')
        .expect(200);

      expect(response.body).toBeDefined();
    });

    it('GET /parking-lot/registration-allocated-slot-number should return allocated lot list', async () => {
      const response = await request(app.getHttpServer())
        .get('/parking-lot/registration-allocated-slot-number')
        .expect(200);

      expect(response.body).toBeDefined();
    });
  });
});
