import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(private prisma: PrismaService) {}

  // User: view all own reservations
  async findByUser(userId: number) {
    return this.prisma.reservation.findMany({
      where: { userId },
      include: { concert: true },
    });
  }

  // Admin: view all reservations
  async findAll() {
    return this.prisma.reservation.findMany({
      include: { concert: true, user: true },
    });
  }

  // User: reserve a seat
  async create(dto: CreateReservationDto) {
    const concert = await this.prisma.concert.findUnique({
      where: { id: dto.concertId },
      include: {
        _count: { select: { reservations: { where: { status: 'ACTIVE' } } } },
      },
    });

    if (!concert) {
      throw new NotFoundException('Concert not found');
    }

    // Check if seats are available
    if (concert._count.reservations >= concert.totalSeats) {
      throw new BadRequestException('Concert is fully booked');
    }

    // Check if user already has a reservation
    const existing = await this.prisma.reservation.findFirst({
      where: { userId: dto.userId, concertId: dto.concertId, status: 'ACTIVE' },
    });

    if (existing) {
      throw new BadRequestException(
        'You already have a reservation for this concert',
      );
    }

    return this.prisma.reservation.create({
      data: {
        userId: dto.userId,
        concertId: dto.concertId,
        status: 'ACTIVE',
      },
      include: { concert: true },
    });
  }

  // User: cancel a reservation
  async cancel(id: number) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    if (reservation.status === 'CANCELLED') {
      throw new BadRequestException('Reservation is already cancelled');
    }

    return this.prisma.reservation.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }
}
