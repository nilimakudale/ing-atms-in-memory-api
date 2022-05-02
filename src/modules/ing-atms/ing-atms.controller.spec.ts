import { Test, TestingModule } from '@nestjs/testing';
import { IngATMsController } from './ing-atms.controller';
import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { IngATM } from './ing-atm.entity';
import { Logger } from '@nestjs/common';

describe('IngATMs Controller', () => {
  let ingATMsController: IngATMsController;
  let ingATMsService: InMemoryDBService<IngATM>;

  beforeAll(async () => {
    const ingATMsServiceProvider = {
      provide: InMemoryDBService,
      useFactory: () => ({
        create: jest.fn(() => []),
        getAll: jest.fn(() => []),
        update: jest.fn(() => { }),
        delete: jest.fn(() => { })
      })
    }

    const loggerServiceProvider = {
      provide: Logger,
      useFactory: () => ({
        log: jest.fn(() => { }),
        error: jest.fn(() => { }),
      })
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngATMsController],
      providers: [InMemoryDBService, ingATMsServiceProvider, loggerServiceProvider]
    }).compile();

    ingATMsController = module.get<IngATMsController>(IngATMsController);
    ingATMsService = module.get<InMemoryDBService<IngATM>>(InMemoryDBService);
  })

  it("calling create method", () => {
    expect(ingATMsController.createATM({ name: 'test', id: '1' })).not.toEqual(null);
    jest.spyOn(ingATMsService, 'create').mockImplementation(() => {
      throw new Error();
    });
    expect(ingATMsController.createATM({ name: 'test', id: '1' })).rejects.toMatch('error');
  })

  it("calling findAll method", () => {
    ingATMsController.findAllATMs();
    expect(ingATMsService.getAll).toHaveBeenCalled();
    jest.spyOn(ingATMsService, 'getAll').mockImplementation(() => {
      throw new Error();
    });
    expect(ingATMsController.findAllATMs()).rejects.toMatch('error');
  })

  it("calling update method", () => {
    expect(ingATMsController.updateATM("1", { name: 'test', id: '1' })).not.toEqual(null);
    expect(ingATMsService.update).toHaveBeenCalled();
    expect(ingATMsService.update).toHaveBeenCalledWith({ name: 'test', id: '1' });
  })

  it("calling delete method", () => {
    ingATMsController.removeATM("1");
    expect(ingATMsService.delete).toHaveBeenCalledWith("1");
    jest.spyOn(ingATMsService, 'delete').mockImplementation(() => {
      throw new Error();
    });
    expect(ingATMsController.removeATM("1")).rejects.toMatch('error');
    
  })

  it('should be defined', () => {
    expect(ingATMsController).toBeDefined();
  });
});
