import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConcertsModule } from './concerts/concerts.module';
import { ReservationsModule } from './reservations/reservations.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ConcertsModule, ReservationsModule, PrismaModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
