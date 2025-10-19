import { AppModule } from "@challenge/backend/dist/app.module.js";
import { IngesterService } from "@challenge/backend/dist/ingester/ingester.service.js";
import { NestFactory } from "@nestjs/core";
import yargs from "yargs";

/**
 * Standalone script to ingest historical data for a given symbol and date range
 */
async function main() {
  const argv = await yargs(process.argv.slice(2))
    .option("symbol", {
      type: "string",
      demandOption: true,
      description: "The stock symbol to ingest data for",
    })
    .option("start", {
      type: "string",
      demandOption: true,
      description: "The start date for historical data (YYYY-MM-DD)",
    })
    .option("end", {
      type: "string",
      demandOption: true,
      description: "The end date for historical data (YYYY-MM-DD)",
    })
    .parseAsync();

  const { symbol, start, end } = argv;

  if (!symbol || !start || !end) {
    console.error("Symbol, start date, and end date are required.");
    process.exit(1);
  }

  /**
   * Create NestJS application context to access IngesterService
   */
  const app = await NestFactory.createApplicationContext(AppModule);
  const ingester = app.get(IngesterService);

  try {
    const count = await ingester.ingest(
      symbol,
      {
        start: new Date(start).toISOString(),
        end: new Date(end).toISOString()
      }
    );

    console.log(`Ingested ${count} records for ${symbol} from ${start} to ${end}`);
    process.exit(0);
  } catch (err) {
    console.error("Error during ingestion:", err);
    process.exit(1);
  } finally {
    // Close the NestJS application context
    await app.close();
  }
}

main()
