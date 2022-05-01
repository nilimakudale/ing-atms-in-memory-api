import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../users/user.entity';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('Auth Controller', () => {
  let controller: AuthController;
  let spyService: AuthService;
  let UsersService :  InMemoryDBService<User>

  beforeEach(async () => {
    const ApiServiceProvider = {
      provide: AuthService,
      useFactory: () => ({
        login: jest.fn(() => {}),
        create: jest.fn(() => {}),
      })
    }
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        ApiServiceProvider,
      ],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    spyService = module.get<AuthService>(AuthService);
  });

  it("calling login method", () => {
    let loginReq = {username:'',password:''};
    expect(controller.login(loginReq)).not.toEqual(null);
    expect(spyService.login).toHaveBeenCalled();
  })

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
