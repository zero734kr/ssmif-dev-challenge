import { BacktestRequestDto } from "@challenge/dtos";
import { ApiClient } from "../..";

export default class BacktestRoutes {
  private readonly client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client
  }

  async runBacktest({ ticker, strategy, initialCash, range, parameters }: BacktestRequestDto) {
    const res = await this.client.rest.post(
      `/backtests/${ticker}`,
      {
        json: {
          strategy,
          initialCash,
          range,
          parameters
        }
      }
    )

    if (!res.ok) {
      throw new Error(`Failed to run backtest: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  }
}
