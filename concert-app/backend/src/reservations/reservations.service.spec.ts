import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { PrismaService } from '../prisma/prisma.service';

// ─── Prisma Mock ────────────────────────────────────────────────────────────
const prismaMock = {
  concert: {
    findUnique: jest.fn(),
  },
  reservation: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

// ─── Shared Fixtures ────────────────────────────────────────────────────────
const mockConcert = {
  id: 1,
  name: 'Rock Night',
  description: 'A great concert',
  totalSeats: 2,
  createdAt: new Date(),
  _count: { reservations: 0 }, // 0 active reservations by default
};

const mockReservation = {
  id: 1,
  userId: 10,
  concertId: 1,
  status: 'ACTIVE',
  createdAt: new Date(),
  concert: mockConcert,
};

// ─── Test Suite ─────────────────────────────────────────────────────────────
describe('ReservationsService', () => {
  let service: ReservationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);

    // Clear all mocks before each test so calls don't bleed across tests
    jest.clearAllMocks();
  });

  // ── findByUser ─────────────────────────────────────────────────────────────
  describe('findByUser', () => {
    it('should return reservations belonging to the user', async () => {
      prismaMock.reservation.findMany.mockResolvedValue([mockReservation]);

      const result = await service.findByUser(10);

      expect(result).toEqual([mockReservation]);
      expect(prismaMock.reservation.findMany).toHaveBeenCalledWith({
        where: { userId: 10 },
        include: { concert: true },
      });
    });

    it('should return an empty array when the user has no reservations', async () => {
      prismaMock.reservation.findMany.mockResolvedValue([]);

      const result = await service.findByUser(99);

      expect(result).toEqual([]);
    });
  });

  // ── findAll ────────────────────────────────────────────────────────────────
  describe('findAll', () => {
    it('should return all reservations with concert and user info', async () => {
      const allReservations = [
        { ...mockReservation, user: { id: 10, name: 'Alice' } },
      ];
      prismaMock.reservation.findMany.mockResolvedValue(allReservations);

      const result = await service.findAll();

      expect(result).toEqual(allReservations);
      expect(prismaMock.reservation.findMany).toHaveBeenCalledWith({
        include: { concert: true, user: true },
      });
    });
  });

  // ── create ─────────────────────────────────────────────────────────────────
  describe('create', () => {
    const dto = { userId: 10, concertId: 1 };

    it('should create a new reservation when seats are available', async () => {
      prismaMock.concert.findUnique.mockResolvedValue(mockConcert); // 0/2 seats taken
      prismaMock.reservation.findFirst.mockResolvedValue(null); // no existing reservation
      prismaMock.reservation.create.mockResolvedValue(mockReservation);

      const result = await service.create(dto);

      expect(result).toEqual(mockReservation);
      expect(prismaMock.reservation.create).toHaveBeenCalledWith({
        data: { userId: 10, concertId: 1, status: 'ACTIVE' },
        include: { concert: true },
      });
    });

    it('should throw NotFoundException when concert does not exist', async () => {
      prismaMock.concert.findUnique.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(
        new NotFoundException('Concert not found'),
      );
      expect(prismaMock.reservation.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when concert is fully booked', async () => {
      const fullConcert = {
        ...mockConcert,
        totalSeats: 2,
        _count: { reservations: 2 }, // all seats taken
      };
      prismaMock.concert.findUnique.mockResolvedValue(fullConcert);

      await expect(service.create(dto)).rejects.toThrow(
        new BadRequestException('Concert is fully booked'),
      );
      expect(prismaMock.reservation.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when user already has an ACTIVE reservation', async () => {
      prismaMock.concert.findUnique.mockResolvedValue(mockConcert);
      prismaMock.reservation.findFirst.mockResolvedValue(mockReservation); // status: ACTIVE

      await expect(service.create(dto)).rejects.toThrow(
        new BadRequestException(
          'You already have a reservation for this concert',
        ),
      );
      expect(prismaMock.reservation.create).not.toHaveBeenCalled();
    });

    it('should re-activate a CANCELLED reservation instead of creating a new one', async () => {
      const cancelledReservation = { ...mockReservation, status: 'CANCELLED' };
      const reactivated = { ...mockReservation, status: 'ACTIVE' };

      prismaMock.concert.findUnique.mockResolvedValue(mockConcert);
      prismaMock.reservation.findFirst.mockResolvedValue(cancelledReservation);
      prismaMock.reservation.update.mockResolvedValue(reactivated);

      const result = await service.create(dto);

      expect(result).toEqual(reactivated);
      expect(prismaMock.reservation.update).toHaveBeenCalledWith({
        where: { id: cancelledReservation.id },
        data: { status: 'ACTIVE' },
        include: { concert: true },
      });
      // Should NOT create a duplicate row
      expect(prismaMock.reservation.create).not.toHaveBeenCalled();
    });
  });

  // ── cancel ─────────────────────────────────────────────────────────────────
  describe('cancel', () => {
    it('should cancel an ACTIVE reservation successfully', async () => {
      const cancelled = { ...mockReservation, status: 'CANCELLED' };
      prismaMock.reservation.findUnique.mockResolvedValue(mockReservation);
      prismaMock.reservation.update.mockResolvedValue(cancelled);

      const result = await service.cancel(1);

      expect(result).toEqual(cancelled);
      expect(prismaMock.reservation.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { status: 'CANCELLED' },
      });
    });

    it('should throw NotFoundException when reservation does not exist', async () => {
      prismaMock.reservation.findUnique.mockResolvedValue(null);

      await expect(service.cancel(999)).rejects.toThrow(
        new NotFoundException('Reservation not found'),
      );
      expect(prismaMock.reservation.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when reservation is already CANCELLED', async () => {
      const alreadyCancelled = { ...mockReservation, status: 'CANCELLED' };
      prismaMock.reservation.findUnique.mockResolvedValue(alreadyCancelled);

      await expect(service.cancel(1)).rejects.toThrow(
        new BadRequestException('Reservation is already cancelled'),
      );
      expect(prismaMock.reservation.update).not.toHaveBeenCalled();
    });
  });
});
