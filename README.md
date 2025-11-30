# Blink - Real-time Dating Application

Blink is a modern, high-performance dating application built with React Native and Node.js. It features a sophisticated, weighted matchmaking algorithm powered by Redis Geospatial and a premium Glassmorphism UI design.

## 🚀 Tech Stack

### Mobile App (`/BlinkApp`)
- **Framework:** React Native (CLI)
- **Language:** TypeScript
- **Styling:** Custom Theme System (Glassmorphism, Neon Accents)
- **Navigation:** React Navigation
- **State/API:** Axios, Context API

### Backend API (`/api`)
- **Runtime:** Node.js
- **Framework:** Express
- **Real-time:** Socket.io
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Caching & Geo:** Redis (ioredis)
- **Containerization:** Docker & Docker Compose

## 🧠 Smart Matchmaking Algorithm

Blink uses a custom, high-performance matchmaking engine designed to scale to thousands of concurrent users.

- **Geospatial Indexing:** Uses Redis `GEOADD` and `GEORADIUS` for lightning-fast proximity searches.
- **Weighted Scoring:**
  - **Distance:** Closer users get higher scores.
  - **Age Compatibility:** Users with similar ages are prioritized.
  - **Wait Time:** Users waiting longer in the pool get a priority boost.
  - **History Penalty:** Recently matched users are penalized to ensure variety.
- **Performance:** Optimized with Redis Pipelining and Bulk DB Fetches to avoid N+1 query problems.

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- Docker Desktop
- Android Studio / Xcode (for mobile emulator)

### 1. Backend Setup (Docker)

The backend services (API, Postgres, Redis) are containerized for easy setup.

```bash
# Start services
docker-compose up -d --build

# The API will be available at http://localhost:3000
# Database migrations are applied automatically on startup.
```

### 2. Mobile App Setup

```bash
cd BlinkApp

# Install dependencies
npm install

# Start Metro Bundler
npm start

# Run on Android (in a separate terminal)
npm run android

# Run on iOS (macOS only)
npm run ios
```

## 🧪 Testing & Simulation

The project includes a stress-testing tool to simulate user traffic and verify the matchmaking logic.

```bash
cd tests

# Install test dependencies
npm install

# Run the Bot Runner (Simulates 100-2000 users)
npx ts-node bot_runner.ts
```

## 📂 Project Structure

```
blink/
├── api/                # Backend Source Code
│   ├── src/
│   │   ├── config/     # DB & Redis Config
│   │   ├── controllers/# API Controllers
│   │   ├── services/   # Business Logic (MatchService is here)
│   │   ├── sockets/    # Socket.io Handlers
│   │   └── prisma/     # Database Schema
├── BlinkApp/           # React Native App
│   ├── src/
│   │   ├── components/ # Reusable UI Components (GlassView, etc.)
│   │   ├── screens/    # App Screens
│   │   ├── context/    # Auth & App State
│   │   └── theme/      # Design System
├── tests/              # Test Scripts (Bot Runner)
└── docker-compose.yml  # Container Orchestration
```

## 🎨 Design System

Blink follows a "Neon/Dark" aesthetic with extensive use of Glassmorphism.
- **Colors:** Deep blacks, vibrant pinks/purples, and semi-transparent glass layers.
- **Components:** Custom `GlassView` and `StandardButton` ensure consistency.

---