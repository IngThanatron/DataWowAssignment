import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

// ─── Prisma Mock ────────────────────────────────────────────────────────────
const prismaMock = {
  user: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

// ─── Shared Fixtures ────────────────────────────────────────────────────────
const mockUser = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  createdAt: new Date(),
};

// ─── Test Suite ─────────────────────────────────────────────────────────────
describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  // ── findAll ────────────────────────────────────────────────────────────────
  describe('findAll', () => {
    it('should return all users', async () => {
      prismaMock.user.findMany.mockResolvedValue([mockUser]);

      const result = await service.findAll();

      expect(result).toEqual([mockUser]);
      expect(prismaMock.user.findMany).toHaveBeenCalled();
    });

    it('should return an empty array when there are no users', async () => {
      prismaMock.user.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  // ── create ─────────────────────────────────────────────────────────────────
  describe('create', () => {
    const dto = { name: 'Alice', email: 'alice@example.com' };

    it('should create and return a new user', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null); // email not taken
      prismaMock.user.create.mockResolvedValue(mockUser);

      const result = await service.create(dto);

      expect(result).toEqual(mockUser);
      expect(prismaMock.user.create).toHaveBeenCalledWith({ data: dto });
    });

    it('should throw ConflictException when email is already taken', async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUser); // email exists

      await expect(service.create(dto)).rejects.toThrow(
        new ConflictException('Email already exists'),
      );
      expect(prismaMock.user.create).not.toHaveBeenCalled();
    });
  });
});
