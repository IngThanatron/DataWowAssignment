import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // 1. Initialize the raw DB pool with your environment URL
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });

    // 2. Wrap the pool in the Prisma Adapter
    const adapter = new PrismaPg(pool);

    // 3. Pass ONLY the adapter to the PrismaClient constructor
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
