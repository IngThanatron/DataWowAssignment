# Concert Ticket App

A full-stack concert ticket reservation system built with Next.js, NestJS, PostgreSQL, and Prisma.

**Author:** Thanatron

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Option A — Docker (recommended)](#option-a--docker-recommended)
  - [Option B — Local Development](#option-b--local-development)
- [Running Tests](#running-tests)
- [API Endpoints](#api-endpoints)

---

## Architecture Overview

```
concert-app/
├── frontend/       # Next.js 16 (App Router)
├── backend/        # NestJS 11
└── docker-compose.yml
```

### Backend — Module / Controller / Service pattern

NestJS organises code into three layers:

| Layer | Responsibility | Example |
|---|---|---|
| **Module** | Wires everything together | `ReservationsModule` |
| **Controller** | Handles HTTP routes, validates input | `POST /reservations` |
| **Service** | Contains business logic, talks to DB | checks seat availability, creates reservation |

Three modules are implemented: `concerts`, `reservations`, and `users`.

### Frontend — Next.js App Router

| Pattern | Used for |
|---|---|
| Server Components | Page-level layouts and structure |
| Client Components (`"use client"`) | Interactive UI — reserve button, forms, toasts |
| `fetch` via `lib/api.ts` | All calls to the NestJS backend |

### Database

PostgreSQL with Prisma ORM. Three models:

- **User** — `id, name, email, createdAt`
- **Concert** — `id, name, description, totalSeats, createdAt`
- **Reservation** — `id, userId, concertId, status (ACTIVE|CANCELLED), createdAt`

Key decisions:
- Available seats = `totalSeats - count(ACTIVE reservations)` — computed at query time, no stale counters
- Reservations are soft-cancelled (`status = CANCELLED`), never deleted — preserves history
- Unique constraint on `(userId, concertId)` enforces one reservation per user per concert at the DB level

---

## Tech Stack

| Layer | Library | Why |
|---|---|---|
| Frontend framework | Next.js 16 | File-based routing, App Router, SSR/RSC support |
| UI styling | Tailwind CSS | Utility-first, rapid responsive design |
| Toast notifications | react-hot-toast | Lightweight, zero-config toast library |
| Backend framework | NestJS 11 | Structured, interview-friendly Module/Controller/Service architecture |
| ORM | Prisma 7 | Type-safe DB client, easy migrations, great DX |
| Database | PostgreSQL 16 | Reliable relational DB with strong constraint support |
| Containerisation | Docker + Docker Compose | Consistent environment, single-command startup |
| Validation | class-validator + class-transformer | Declarative DTO validation in NestJS |
| Testing | Jest + ts-jest | Built into NestJS, simple mocking with `jest.fn()` |

---

## Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) — for Option A
- Node.js 22+ and npm — for Option B

---

### Option A — Docker (recommended)

The entire stack (frontend, backend, database) starts with one command. No local installs required beyond Docker.

```bash
git clone <repo-url>
cd concert-app

docker compose up --build
```

That's it. Docker will:
1. Start PostgreSQL and wait until it's healthy
2. Run Prisma migrations (creates all tables)
3. Seed the database with a demo user
4. Start the NestJS backend on port 3001
5. Build and start the Next.js frontend on port 3000

Open [http://localhost:3000](http://localhost:3000)

---

### Option B — Local Development

You still need Postgres running. The easiest way is to spin up just the DB via Docker:

```bash
docker compose up db -d
```

Or use any local Postgres instance — just update the `DATABASE_URL` below.

#### 1. Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
DATABASE_URL=postgresql://concert_user:concert_password@localhost:5432/concert_db
```

Run migrations and seed:

```bash
npx prisma migrate dev
npx prisma db seed
```

Start the dev server:

```bash
npm run start:dev
```

Backend runs at [http://localhost:3001](http://localhost:3001)

#### 2. Frontend

```bash
cd frontend
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Start the dev server:

```bash
npm run dev
```

Frontend runs at [http://localhost:3000](http://localhost:3000)

---

## Running Tests

Backend unit tests (Jest):

```bash
cd backend
npm test
```

Run with coverage report:

```bash
npm run test:cov
```

Tests cover the `ReservationsService` business logic:
- Reserve a seat successfully
- Throw when concert is fully booked
- Throw when user already has an active reservation
- Cancel a reservation successfully
- Re-activate a previously cancelled reservation

Prisma is mocked with `jest.fn()` — tests run without a real database.

---

## API Endpoints

### Concerts

| Method | Path | Description |
|---|---|---|
| `GET` | `/concerts` | List all concerts |
| `POST` | `/concerts` | Create a concert |
| `DELETE` | `/concerts/:id` | Delete a concert |

### Reservations

| Method | Path | Description |
|---|---|---|
| `GET` | `/reservations` | All reservations (admin) |
| `GET` | `/reservations/my?userId=1` | Reservations for a user |
| `POST` | `/reservations` | Reserve a seat |
| `PATCH` | `/reservations/:id/cancel` | Cancel a reservation |

### Users

| Method | Path | Description |
|---|---|---|
| `GET` | `/users` | List all users |
| `POST` | `/users` | Create a user |
