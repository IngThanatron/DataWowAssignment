import { Test, TestingModule } from '@nestjs/testing';
import { ConcertsService } from './concerts.service';
import { PrismaService } from '../prisma/prisma.service';

// ─── Prisma Mock ────────────────────────────────────────────────────────────
const prismaMock = {
  concert: {
    findMany: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
  reservation: {
    deleteMany: jest.fn(),
  },
};

// ─── Shared Fixtures ────────────────────────────────────────────────────────
const mockConcert = {
  id: 1,
  name: 'Rock Night',
  description: 'A great concert',
  totalSeats: 100,
  createdAt: new Date(),
  _count: { reservations: 0 },
};

// ─── Test Suite ─────────────────────────────────────────────────────────────
describe('ConcertsService', () => {
  let service: ConcertsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConcertsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<ConcertsService>(ConcertsService);
    jest.clearAllMocks();
  });

  // ── findAll ────────────────────────────────────────────────────────────────
  describe('findAll', () => {
    it('should return all concerts with reservation counts', async () => {
      prismaMock.concert.findMany.mockResolvedValue([mockConcert]);

      const result = await service.findAll();

      expect(result).toEqual([mockConcert]);
      expect(prismaMock.concert.findMany).toHaveBeenCalledWith({
        include: { _count: { select: { reservations: true } } },
      });
    });

    it('should return an empty array when there are no concerts', async () => {
      prismaMock.concert.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  // ── create ─────────────────────────────────────────────────────────────────
  describe('create', () => {
    const dto = {
      name: 'Jazz Night',
      description: 'Smooth jazz',
      totalSeats: 50,
    };

    it('should create and return a new concert', async () => {
      const created = { id: 2, ...dto, createdAt: new Date() };
      prismaMock.concert.create.mockResolvedValue(created);

      const result = await service.create(dto);

      expect(result).toEqual(created);
      expect(prismaMock.concert.create).toHaveBeenCalledWith({ data: dto });
    });
  });

  // ── delete ─────────────────────────────────────────────────────────────────
  describe('delete', () => {
    it('should delete all reservations for the concert first, then delete the concert', async () => {
      prismaMock.reservation.deleteMany.mockResolvedValue({ count: 3 });
      prismaMock.concert.delete.mockResolvedValue(mockConcert);

      const result = await service.delete(1);

      // Reservations must be cleaned up before the concert is deleted
      expect(prismaMock.reservation.deleteMany).toHaveBeenCalledWith({
        where: { concertId: 1 },
      });
      expect(prismaMock.concert.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockConcert);
    });

    it('should delete the concert even when it has no reservations', async () => {
      prismaMock.reservation.deleteMany.mockResolvedValue({ count: 0 });
      prismaMock.concert.delete.mockResolvedValue(mockConcert);

      const result = await service.delete(1);

      expect(result).toEqual(mockConcert);
    });
  });
});
