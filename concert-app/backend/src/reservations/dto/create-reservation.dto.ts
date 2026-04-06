import { IsInt, Min } from 'class-validator';

export class CreateReservationDto {
  @IsInt()
  @Min(1)
  userId: number;

  @IsInt()
  @Min(1)
  concertId: number;
}
