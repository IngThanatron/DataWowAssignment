import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  // Admin: get all reservations
  @Get()
  findAll() {
    return this.reservationsService.findAll();
  }

  // User: get own reservations
  @Get('my')
  findByUser(@Query('userId') userId: string) {
    return this.reservationsService.findByUser(Number(userId));
  }

  // User: reserve a seat
  @Post()
  create(@Body() dto: CreateReservationDto) {
    return this.reservationsService.create(dto);
  }

  // User: cancel a reservation
  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.reservationsService.cancel(Number(id));
  }
}
