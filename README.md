# SSMIF Quant Dev Team Application: Trading Strategy Backtest Web App

A full-stack web application for backtesting trading strategies on historical stock data, built with Next.js, NestJS, and PostgreSQL.

This README.md file was partly written by GitHub Copilot.

## Components

- **Frontend** (`apps/frontend`): Next.js web application
- **Backend** (`apps/backend`): NestJS REST API with Prisma ORM
- **Database** (`apps/db`): PostgreSQL in Docker container
- **Ingester** (`apps/ingester`): Standalone CLI tool for data ingestion
- **Engine** (`packages/engine`): Core backtesting logic with strategy pattern
- **DTOs** (`packages/dtos`): Shared TypeScript types across frontend/backend

## Trading Strategy

### Simple Moving Average (SMA) Crossover

The implemented strategy uses two moving averages to generate buy/sell signals:

**Parameters:**
- `shortPeriod` (default: 20 days): Fast-moving average
- `longPeriod` (default: 50 days): Slow-moving average  
- `positionSize` (default: $10,000): Maximum dollars per trade

**Logic:**
1. **Golden Cross (BUY)**: When short SMA crosses above long SMA
2. **Death Cross (SELL)**: When short SMA crosses below long SMA

**Example:**
```
Day 45: SMA(20) = $150.20, SMA(50) = $148.50 → BUY signal
Day 80: SMA(20) = $145.30, SMA(50) = $146.80 → SELL signal
```

## Project Structure

```
challenge/
├── apps/
│   ├── backend/          # NestJS API server
│   │   ├── src/
│   │   │   ├── backtest/       # Backtest service & controller
│   │   │   ├── ingester/       # Data ingestion service
│   │   │   ├── finance/        # Price data queries
│   │   │   └── prisma.service.ts
│   │   └── prisma/
│   │       └── schema.prisma   # Database schema
│   │
│   ├── frontend/         # Next.js web interface
│   │   └── src/
│   │       ├── components/     # React components
│   │       ├── pages/          # Next.js pages
│   │       └── queries/        # API hooks
│   │
│   ├── ingester/         # Standalone CLI tool
│   │   └── src/
│   │       └── ingester.ts
│   │
│   └── db/               # PostgreSQL Docker setup
│       └── docker-compose.yml
│
├── packages/
│   ├── engine/           # Backtest engine
│   │   └── src/
│   │       ├── engine.ts       # Abstract base class
│   │       ├── strategies/     # Strategy implementations
│   │       └── types.ts        # Order, State types
│   │
│   └── dtos/             # Shared TypeScript types
│       └── src/
│           └── trades.ts
│
└── README.md
```

## Prerequisites

- **Node.js**: v18 or higher
- **Yarn**: v1.22.22 (package.json@packageManager)
- **Docker**: For PostgreSQL database

## Setup Instructions

### 1. Install Dependencies

```bash
yarn install
```

### 2. Start the Database

```bash
cd apps/db
yarn dev
```

**Database Credentials:**
- Host: `localhost`
- Port: `5432`
- Database: `challenge`
- Username: `postgres`
- Password: `ssmif-dev-challenge`

I intentionally configured the `yarn dev` command to run the database without the `-d` flag, so it runs in foreground mode and no hidden background processes.

### 3. Run Database Migrations

**While running the database**, in a new terminal:

```bash
cd apps/backend # or cd ../backend
yarn prisma:migrate
```

This creates the required tables (`symbols`, `prices`).

**After running the command above, please end the database process ran at step 2.**

### 4. Build Shared Packages

```bash
cd <project root>
yarn build
```

This prepares all packages and apps.

### 5. Start the Application

```bash
yarn start
```

This will start the database, backend, and frontend in separate processes.

Backend runs on `http://localhost:3001` and frontend on `http://localhost:3000`.

## Using the Ingester Script

The ingester can be run standalone to pre-populate the database:

```bash
cd apps/ingester
yarn ingest --symbol <TICKER> --start <YYYY-MM-DD> --end <YYYY-MM-DD>
yarn ingest --symbol AAPL --start 2020-01-01 --end 2024-12-31
```

### Data Source

The ingester fetches OHLCV (Open, High, Low, Close, Volume) data from Yahoo Finance API

## API Documentation

### Backend Endpoints

#### `POST /backtest/run`

Run a backtest with specified parameters.

**Request Body:**
```json
{
  "ticker": "AAPL",
  "range": {
    "start": "2023-01-01",
    "end": "2023-12-31"
  },
  "strategy": "sma-crossover",
  "initialCash": 100000,
  "parameters": {
    "shortPeriod": 20,
    "longPeriod": 50,
    "positionSize": 10000
  }
}
```

**Response:**
```json
{
  "ticker": "AAPL",
  "strategy": "sma-crossover",
  "parameters": { "shortPeriod": 20, "longPeriod": 50, "positionSize": 10000 },
  "range": { "start": "2023-01-01", "end": "2023-12-31" },
  "finalValue": 105234.56,
  "metrics": {
    "totalReturn": 0.0523,
    "annualizedReturn": 0.0543,
    "maxDrawdown": 0.1234,
    "winProbability": 0.6
  },
  "trades": [
    {
      "orderedDate": "2023-02-15T00:00:00.000Z",
      "type": "buy",
      "price": 150.25,
      "quantity": 66,
      "pnl": 458.34,
      "pnlPercent": 0.0462
    }
  ]
}
```

## 🔧 Technical Implementation

### Backtest Engine Architecture

The engine uses the Abstract Factory Pattern to define a base `BacktestEngine` class. Specific strategies (e.g., SMA Crossover) extend this class and implement the `sendSignal` method. Event Emitter pattern is used for side effects.

```typescript
abstract class BacktestEngine {
  protected state: StrategyState;
  public events: EventEmitter;
  
  // Abstract method - strategies implement this
  protected abstract sendSignal(prices, index, params): Order | null;
  
  // Template method - orchestrates backtest
  public run(prices, params): StrategyState {
    for (let i = 0; i < prices.length; i++) {
      const order = this.sendSignal(prices, i, params);
      if (order) {
        this.executeOrder(order);
        this.events.emit('order', order);
      }
    }
    return this.state;
  }
}
```

## Development Notes

### Code Generation

Part of the code in this project has been automatically generated from the suggestions of GitHub Copilot, particularly initial HTML structure before refactoring, boilerplate and type definitions.

### Environment Variables

I intentionally included `.env` files in the repository to simplify setup for graders. In production, these would be gitignored and managed securely.

### Monorepo Structure

I used Turborepo for managing multiple packages with shared dependencies

