import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../users/user.entity';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: InMemoryDBService<User>;
  let jwtService: JwtService;

  const testUser = {
    email: 'nilima@gmail.com',
    password: 'n1l1ma',
    name: 'test'
  };

  const user = { id: '1', ...testUser }

  const JWTServiceProvider = {
    provide: JwtService,
    useFactory: () => ({
      signAsync: jest.fn(() => { }),
    })
  }

  const UsersServiceProvider = {
    provide: InMemoryDBService,
    useFactory: () => ({
      query: jest.fn(() => { }),
      // jest.fn((email) => {
      //   if (email === testUser.email)
      //     return [testUser];
      //   else return [];
      // }),
      create: jest.fn(() => { return user }),
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
    jest.spyOn(userService, 'query').mockReturnValueOnce([user])
    const data = await authService.validateUser(testUser.email, testUser.password);
    expect(userService.query).toHaveBeenCalled();
    expect(data).toBeDefined();
    jest.spyOn(userService, 'query').mockImplementation(() => {
      throw new Error();
    });
    expect(authService.validateUser(testUser.email, testUser.password)).rejects.toBeDefined();

  });

  it('should validate user test with invalid user', async () => {
    jest.spyOn(userService, 'query').mockImplementation(() => []);
    const data = await authService.validateUser('bchdb', testUser.password);
    expect(data).toEqual(null);
  });

  it("should generate token(login)", async () => {
    jest.spyOn(authService, 'validateUser').mockReturnValueOnce(Promise.resolve(user));
    jest.spyOn(userService, 'query').mockImplementation(() => [user]);
    const data = await authService.login({ username: testUser.email, password: testUser.password });
    expect(data).toBeDefined();
  })


  it("should throw 401 Unauthorized error when user is not valid in login service", async () => {
    jest.spyOn(userService, 'query').mockImplementation(() => null);
    jest.spyOn(authService, 'validateUser').mockReturnValueOnce(Promise.resolve(null));
    expect(authService.login({ username: testUser.email, password: testUser.password })).rejects.toThrow(UnauthorizedException);
  })

  it("should throw 500 error when error occurred", async () => {
    jest.spyOn(userService, 'query').mockImplementation(() => null);
    jest.spyOn(authService, 'validateUser').mockImplementation(() => { throw new InternalServerErrorException() });
    expect(authService.login({ username: testUser.email, password: testUser.password })).rejects.toThrow(InternalServerErrorException);
  })

  it("create new user and generate token(signup)", async () => {
    jest.spyOn(userService, 'create').mockImplementation(() => user);
    const data = await authService.create(testUser);
    expect(data).toBeDefined();
  })

  it("test catch error while creating new user", async () => {
    jest.spyOn(userService, 'create').mockImplementation(() => {
      throw new InternalServerErrorException('Internal server error');
    });
    await expect(authService.create(testUser)).rejects.toThrow(InternalServerErrorException);
  })

  afterEach(() => {
    jest.resetAllMocks();
  });

});
