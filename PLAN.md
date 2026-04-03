📋 Your 7-Day Concert Ticket App — Full Plan
Your stack: Next.js (frontend) · NestJS (backend) · PostgreSQL · Prisma · Tailwind CSS · Docker

🧠 Before You Code — Key Concepts to Understand
Since you're new to Next.js and NestJS, spend 30–60 min reading about these before touching code:

Next.js vs React: Next.js is React + file-based routing + server-side rendering. Think of it as React with superpowers. Your pages live in an app/ folder.
NestJS: A structured Node.js framework. Everything is organized into Modules → Controllers → Services. Controllers handle HTTP routes, Services contain business logic. Very interview-friendly architecture.
Prisma: Your database client. You define a schema in schema.prisma, run migrations, and get a fully typed DB client. Much nicer DX than TypeORM.

📅 Day-by-Day Schedule

Day 1 — Project Scaffolding & Docker Setup
Goal: Everything boots, nothing crashes.

Create the monorepo structure:

/concert-app
/frontend ← Next.js
/backend ← NestJS
docker-compose.yml

Scaffold Next.js frontend:

bash npx create-next-app@latest frontend --typescript --tailwind --app

Scaffold NestJS backend:

bash npm i -g @nestjs/cli
nest new backend

Write docker-compose.yml with a PostgreSQL service (port 5432). This is the only DB you need locally.
Connect Prisma to the DB:

bash cd backend
npm install prisma @prisma/client
npx prisma init

```
   Set `DATABASE_URL` in `.env` pointing to your Docker postgres.

**Interview tip:** Be ready to explain *why* Docker Compose — "consistent environment across machines, no local postgres install required."

---

#### **Day 2 — Database Schema + Migrations**
*Goal: Your data model is solid before writing any API.*

Design your Prisma schema with **3 models:**
```

User { id, name, email, createdAt }
Concert { id, name, description, totalSeats, createdAt }
Reservation { id, userId, concertId, status, createdAt }
Key decisions to think through (and explain in interviews):

totalSeats lives on Concert. Available seats = totalSeats - count(active reservations)
Reservation.status can be ACTIVE | CANCELLED — soft cancel, don't delete rows
Add a unique constraint on (userId, concertId) — enforces 1 seat per user per concert at the DB level

Run your first migration:
bashnpx prisma migrate dev --name init

Day 3 — NestJS Backend: Concerts & Reservations API
Goal: All CRUD endpoints working, testable via Postman/Thunder Client.
Modules to create:
bashnest g module concerts
nest g controller concerts
nest g service concerts

nest g module reservations
nest g controller reservations
nest g service reservations
Endpoints to build:
MethodPathWhoWhatPOST/concertsAdminCreate concertDELETE/concerts/:idAdminDelete concertGET/concertsUserList all concertsPOST/reservationsUserReserve a seatDELETE/reservations/:idUserCancel reservationGET/reservations/myUserOwn historyGET/reservationsAdminAll reservations
Critical business logic in ReservationsService:

Check if seats are still available before reserving
Check user doesn't already have an active reservation for that concert
This is where the bonus question about race conditions lives — mention database-level unique constraints + transactions

Install validation:
bashnpm install class-validator class-transformer
Use @IsString(), @IsNotEmpty() DTOs — this covers Task 4 (error handling).

Day 4 — Frontend: Pages & API Integration
Goal: Users can see and interact with concerts.
Pages to build in Next.js app/ directory:

/ — Landing page (concert list)
/concerts/[id] — Concert detail + reserve button
/my-reservations — User's reservation history
/admin — Admin dashboard (create/delete concerts, view all reservations)

Data fetching pattern in Next.js (important for interviews):

Use Server Components (async function Page()) for initial data loads — faster, SEO-friendly
Use Client Components ("use client") for interactive parts like the reserve button

API calls: Use fetch() or install axios for calling your NestJS backend.

Day 5 — Responsive Design (Figma → Tailwind)
Goal: Looks good on mobile, tablet, desktop.
Open the Figma link from the PDF and implement the designs. Key Tailwind responsive classes you'll use:

sm: md: lg: breakpoint prefixes
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 for concert cards
container mx-auto px-4 for page layout

The assignment specifically says "custom CSS and HTML should also be evident" — so write at least a few custom CSS classes alongside Tailwind, just to satisfy the requirement.

Day 6 — Unit Tests + Error Handling Polish
Goal: Tests pass, errors display nicely to users.
Backend tests (NestJS uses Jest by default):
Focus your tests on the ReservationsService — it has the most logic:

✅ Should reserve a seat successfully
✅ Should throw error when concert is full
✅ Should throw error when user already has reservation
✅ Should cancel reservation successfully

Mock Prisma using jest.mock() or the @golevelup/ts-jest helper.
Frontend error handling:

Catch API errors and show a toast or inline error message
Show "Sold out" badge on concerts with no seats left

Day 7 — Dockerfile, README, Cleanup & Bonus
Goal: Someone else can clone and run this.

Write Dockerfiles for both frontend and backend
Add them to docker-compose.yml so docker compose up starts everything
Write the README covering:

Setup instructions
Architecture overview (mention the Module/Controller/Service pattern)
Libraries used and why
How to run tests

Bonus answers (write these in README or a separate BONUS.md):

Scaling with heavy data: pagination, caching with Redis, CDN for static assets, database indexing
Race conditions on seat reservation: Database transactions + unique constraints, or optimistic locking. This is a great interview topic — prepare to discuss it verbally.
