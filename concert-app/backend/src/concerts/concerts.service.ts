import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConcertDto } from './dto/create-concert.dto';

@Injectable()
export class ConcertsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.concert.findMany({
      include: {
        _count: {
          select: { reservations: true },
        },
      },
    });
  }

  async create(dto: CreateConcertDto) {
    return this.prisma.concert.create({
      data: dto,
    });
  }

  async delete(id: number) {
    return this.prisma.concert.delete({
      where: { id },
    });
  }
}
