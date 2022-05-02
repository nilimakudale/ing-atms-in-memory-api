import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../users/user.entity';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: InMemoryDBService<User>;
  let jwtService: JwtService;
  let loggerService : Logger;

  const testUser = {
    email: 'nilima@gmail.com',
    password: 'n1l1ma',
    name: 'test'
  };

  const JWTServiceProvider = {
    provide: JwtService,
    useFactory: () => ({
      signAsync: jest.fn(() => { }),
    })
  }

  const UsersServiceProvider = {
    provide: InMemoryDBService,
    useFactory: () => ({
      query: jest.fn((email) => {
        if (email === testUser.email)
          return [testUser];
        else return [];
      }),
      create: jest.fn(() => { return { testUser } }),
    })
  }

  const loggerServiceProvider = {
    provide: Logger,
    useFactory: () => ({
      log: jest.fn(() => { }),
      error: jest.fn(() => { }),
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtService,
        AuthService,
        InMemoryDBService,
        Logger,
        JWTServiceProvider,
        UsersServiceProvider,
        loggerServiceProvider
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<InMemoryDBService<User>>(InMemoryDBService);
    jwtService = module.get<JwtService>(JwtService);

  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should validate user', async () => {
    const data =await authService.validateUser(testUser.email, testUser.password);
    expect(userService.query).toHaveBeenCalled();
    jest.spyOn(userService, 'query').mockReturnValueOnce([{id:'1',...testUser}])
    expect(data).toBeDefined();
  });

  it('should validate user test with invalid user', async () => {
    const data = await authService.validateUser('bchdb', testUser.password);
    expect(data).toEqual(null);
  });

  it("should generate token(login)", async () => {
    const data = await authService.login({ username: testUser.email, password: testUser.password });
    expect(authService.validateUser(testUser.email, testUser.password)).toBeDefined();
    jest.spyOn(userService, 'query').mockReturnValueOnce([{id:'1',...testUser}])
    // expect(await authService.login({ username: testUser.email, password: testUser.password }))
    // .rejects.toThrowError(UnauthorizedException);
  })


  it("create new user and generate token(signup)", async () => {
    const data = await authService.create(testUser);
    expect(data).toBeDefined();
  })

});
