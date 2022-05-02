import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { ForbiddenException, Logger, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../users/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('Auth Controller', () => {
  let controller: AuthController;
  let authService: AuthService;
  let userService: InMemoryDBService<User>;
  let loggerService : Logger;

  const testUser = {
    email: 'nilima@gmail.com',
    password: 'n1l1ma',
    name: 'test'
  };

  beforeEach(async () => {
    const userServiceProvider = {
      provide: InMemoryDBService,
      useFactory: () => ({
        query: jest.fn((email) => {
          if (email === testUser.email)
            return [testUser];
          else return [];
        }),
      })
    }

    const authServiceProvider = {
      provide: AuthService,
      useFactory: () => ({
        login: jest.fn(() => { }),
        create: jest.fn(() => { }),
        signUp: jest.fn(() => { }),
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
      providers: [
        AuthService,
        InMemoryDBService,
        Logger,
        authServiceProvider,
        userServiceProvider,
        loggerServiceProvider
      ],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    userService = module.get<InMemoryDBService<User>>(InMemoryDBService);
    loggerService = module.get<Logger>(Logger);
  });

  it("calling login method", () => {
    let loginReq = { username: testUser.email, password: testUser.password };
    expect(controller.login(loginReq)).not.toEqual(null);
    expect(authService.login).toHaveBeenCalled();
  })

  it("calling signup method", () => {
    expect(controller.signUp(testUser)).not.toEqual(null);
    expect(userService.query).toHaveBeenCalled();
  })

 
  it("calling signup method  with existing user", () => {
    expect(controller.signUp(testUser)).not.toEqual(null);
    expect(userService.query).toHaveBeenCalled();
    expect(controller.signUp(testUser))
    .rejects.toThrowError(ForbiddenException);
  })

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
