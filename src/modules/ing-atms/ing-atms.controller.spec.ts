import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { Test, TestingModule } from '@nestjs/testing';
import { IngATM } from './ing-atm.entity';

import { IngATMsController } from './ing-atms.controller';

describe('IngATMs Controller', () => {
  let ingATMsController: IngATMsController;
  let spyService:  InMemoryDBService<IngATM>;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [IngATMsController],
    }).compile();

    ingATMsController = app.get<IngATMsController>(IngATMsController);
  })

  it("calling create method", () => {
    const dto : IngATM = {name:'',id:''};
    expect(ingATMsController.create(dto)).not.toEqual(null);
  })

  it("calling findAll method", () => {
    ingATMsController.findAll();
    expect(spyService.getAll).toHaveBeenCalled();
  })

  it("calling update method", () => {
    const dto : IngATM = {name:'',id:''};
    expect(ingATMsController.update(dto.id,dto)).not.toEqual(null);
    expect(spyService.update).toHaveBeenCalled();
    expect(spyService.update).toHaveBeenCalledWith(1,dto);
  })

  it("calling delete method", () => {
    ingATMsController.remove("1");
    expect(spyService.delete).toHaveBeenCalledWith("1");
  })

  it('should be defined', () => {
    expect(ingATMsController).toBeDefined();
  });
});
