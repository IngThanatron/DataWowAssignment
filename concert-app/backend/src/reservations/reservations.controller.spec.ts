import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';

// ─── Service Mock ────────────────────────────────────────────────────────────
const reservationsServiceMock = {
  findAll: jest.fn(),
  findByUser: jest.fn(),
  create: jest.fn(),
  cancel: jest.fn(),
};

// ─── Shared Fixtures ─────────────────────────────────────────────────────────
const mockReservation = {
  id: 1,
  userId: 10,
  concertId: 1,
  status: 'ACTIVE',
  createdAt: new Date(),
  concert: { id: 1, name: 'Rock Night' },
};

// ─── Test Suite ───────────────────────────────────────────────────────────────
describe('ReservationsController', () => {
  let controller: ReservationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsController],
      providers: [
        { provide: ReservationsService, useValue: reservationsServiceMock },
      ],
    }).compile();

    controller = module.get<ReservationsController>(ReservationsController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ── GET /reservations ──────────────────────────────────────────────────────
  describe('findAll', () => {
    it('should return all reservations', async () => {
      reservationsServiceMock.findAll.mockResolvedValue([mockReservation]);

      const result = await controller.findAll();

      expect(result).toEqual([mockReservation]);
      expect(reservationsServiceMock.findAll).toHaveBeenCalledTimes(1);
    });
  });

  // ── GET /reservations/my?userId=10 ─────────────────────────────────────────
  describe('findByUser', () => {
    it('should return reservations for the given userId', async () => {
      reservationsServiceMock.findByUser.mockResolvedValue([mockReservation]);

      const result = await controller.findByUser('10');

      expect(result).toEqual([mockReservation]);
      // Controller converts string query param to Number before passing to service
      expect(reservationsServiceMock.findByUser).toHaveBeenCalledWith(10);
    });
  });

  // ── POST /reservations ─────────────────────────────────────────────────────
  describe('create', () => {
    it('should create and return a reservation', async () => {
      const dto = { userId: 10, concertId: 1 };
      reservationsServiceMock.create.mockResolvedValue(mockReservation);

      const result = await controller.create(dto);

      expect(result).toEqual(mockReservation);
      expect(reservationsServiceMock.create).toHaveBeenCalledWith(dto);
    });
  });

  // ── PATCH /reservations/:id/cancel ────────────────────────────────────────
  describe('cancel', () => {
    it('should cancel a reservation and return the updated record', async () => {
      const cancelled = { ...mockReservation, status: 'CANCELLED' };
      reservationsServiceMock.cancel.mockResolvedValue(cancelled);

      const result = await controller.cancel('1');

      expect(result).toEqual(cancelled);
      // Controller converts string param to Number before passing to service
      expect(reservationsServiceMock.cancel).toHaveBeenCalledWith(1);
    });
  });
});
