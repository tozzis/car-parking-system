import {
  HealthCheckResult,
  HealthCheckService,
  TerminusModule,
} from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { SystemController } from '../system.controller';

describe('SystemController', () => {
  let controller: SystemController;
  let health: HealthCheckService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TerminusModule],
      controllers: [SystemController],
    }).compile();

    controller = module.get<SystemController>(SystemController);
    health = module.get<HealthCheckService>(HealthCheckService);
  });

  describe('check', () => {
    it('should return health status', async () => {
      const result: HealthCheckResult = {
        status: 'ok',
        info: { database: { status: 'up' } },
        error: {},
        details: { database: { status: 'up' } },
      };
      jest.spyOn(health, 'check').mockImplementation(async () => result);

      expect(await controller.healthCheck()).toBe(result);
    });
  });
});
