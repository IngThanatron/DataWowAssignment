import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

// ─── Service Mock ────────────────────────────────────────────────────────────
const usersServiceMock = {
  findAll: jest.fn(),
  create: jest.fn(),
};

// ─── Shared Fixtures ─────────────────────────────────────────────────────────
const mockUser = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  createdAt: new Date(),
};

// ─── Test Suite ───────────────────────────────────────────────────────────────
describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersServiceMock }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ── GET /users ─────────────────────────────────────────────────────────────
  describe('findAll', () => {
    it('should return all users', async () => {
      usersServiceMock.findAll.mockResolvedValue([mockUser]);

      const result = await controller.findAll();

      expect(result).toEqual([mockUser]);
      expect(usersServiceMock.findAll).toHaveBeenCalledTimes(1);
    });
  });

  // ── POST /users ────────────────────────────────────────────────────────────
  describe('create', () => {
    it('should create and return a user', async () => {
      const dto = { name: 'Alice', email: 'alice@example.com' };
      usersServiceMock.create.mockResolvedValue(mockUser);

      const result = await controller.create(dto);

      expect(result).toEqual(mockUser);
      expect(usersServiceMock.create).toHaveBeenCalledWith(dto);
    });
  });
});
