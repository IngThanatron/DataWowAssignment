import { Test, TestingModule } from '@nestjs/testing';
import { ConcertsController } from './concerts.controller';
import { ConcertsService } from './concerts.service';

// ─── Service Mock ────────────────────────────────────────────────────────────
const concertsServiceMock = {
  findAll: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
};

// ─── Shared Fixtures ─────────────────────────────────────────────────────────
const mockConcert = {
  id: 1,
  name: 'Rock Night',
  description: 'A great concert',
  totalSeats: 100,
  createdAt: new Date(),
  _count: { reservations: 0 },
};

// ─── Test Suite ───────────────────────────────────────────────────────────────
describe('ConcertsController', () => {
  let controller: ConcertsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConcertsController],
      providers: [{ provide: ConcertsService, useValue: concertsServiceMock }],
    }).compile();

    controller = module.get<ConcertsController>(ConcertsController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ── GET /concerts ──────────────────────────────────────────────────────────
  describe('findAll', () => {
    it('should return all concerts', async () => {
      concertsServiceMock.findAll.mockResolvedValue([mockConcert]);

      const result = await controller.findAll();

      expect(result).toEqual([mockConcert]);
      expect(concertsServiceMock.findAll).toHaveBeenCalledTimes(1);
    });
  });

  // ── POST /concerts ─────────────────────────────────────────────────────────
  describe('create', () => {
    it('should create and return a concert', async () => {
      const dto = {
        name: 'Jazz Night',
        description: 'Smooth jazz',
        totalSeats: 50,
      };
      concertsServiceMock.create.mockResolvedValue({
        id: 2,
        ...dto,
        createdAt: new Date(),
      });

      const result = await controller.create(dto);

      expect(result).toMatchObject(dto);
      expect(concertsServiceMock.create).toHaveBeenCalledWith(dto);
    });
  });

  // ── DELETE /concerts/:id ───────────────────────────────────────────────────
  describe('delete', () => {
    it('should delete a concert by id and return the deleted concert', async () => {
      concertsServiceMock.delete.mockResolvedValue(mockConcert);

      const result = await controller.delete('1');

      expect(result).toEqual(mockConcert);
      // Controller converts string param to Number before passing to service
      expect(concertsServiceMock.delete).toHaveBeenCalledWith(1);
    });
  });
});
