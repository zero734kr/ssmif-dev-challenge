import { BacktestRequestDto } from "@challenge/dtos";
import { ApiClient } from "../..";

export default class FinanceRoutes {
  private readonly client: ApiClient;

  constructor(client: ApiClient) {
    this.client = client
  }

  async getSymbols() {
    const res = await this.client.rest.get(
      `/finance/symbols`
    )

    if (!res.ok) {
      throw new Error(`Failed to fetch symbols: ${res.status} ${res.statusText}`);
    }
    
    return await res.json();
  }

  async getSymbolDetails(ticker: string) {
    const res = await this.client.rest.get(
      `/finance/symbols/${ticker}`
    )

    if (!res.ok) {
      throw new Error(`Failed to fetch symbol details: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  }

  async getSymbolPriceHistory(ticker: string, range?: { start?: string; end?: string }) {
    const res = await this.client.rest.get(
      `/finance/symbols/${ticker}/prices`,
      {
        params: range ? {
          start: range.start,
          end: range.end
        } : undefined
      }
    )

    if (!res.ok) {
      throw new Error(`Failed to fetch symbol price history: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  }
}
