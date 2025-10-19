export { ApiClientProvider } from './context';
export { useApi } from './hooks';

import { RestClient } from './rest';

import BacktestRoutes from "./routes/BacktestRoutes";
import FinanceRoutes from "./routes/FinanceRoutes";

export class ApiClient {
  public rest: RestClient

  public backtest = new BacktestRoutes(this)
  public finance = new FinanceRoutes(this)

  constructor() {
    this.rest = new RestClient()
  }
}

export { RestClient };
