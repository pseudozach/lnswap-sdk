import { Currency } from './currency';
import { getLiquidityProviderFee } from './helpers/FeeHelper';
import { AMMSwapPool } from './utils/ammPool';
import { getRoute } from './helpers/RouteHelper';
import { getYAmountFromXAmount } from './helpers/RateHelper';
import { runSpot, TxToBroadCast } from './helpers/SwapHelper';
import {
  fetchBalanceForAccount,
  findCurrencyByNativeAddress,
} from './utils/currencyUtils';
import { fetchLatestPrices } from './utils/currencyPrice';
import { assignConfig, AssignConfigParams } from './config';

export class AlexSDK {
  static configure(config: AssignConfigParams) {
    assignConfig(config);
  }

  getBalances(stxAddress: string): Promise<{ [currency in Currency]: bigint }> {
    return fetchBalanceForAccount(stxAddress);
  }

  getFeeRate(from: Currency, to: Currency): Promise<bigint> {
    return getLiquidityProviderFee(
      from,
      to,
      AMMSwapPool.ammTokens,
      AMMSwapPool.ammV1_1Tokens
    );
  }

  getRouter(from: Currency, to: Currency): Promise<Currency[]> {
    return getRoute(from, to, AMMSwapPool.ammTokens, AMMSwapPool.ammV1_1Tokens);
  }

  getAmountTo(
    from: Currency,
    fromAmount: bigint,
    to: Currency
  ): Promise<bigint> {
    return getYAmountFromXAmount(from, to, fromAmount, AMMSwapPool.ammTokens, AMMSwapPool.ammV1_1Tokens);
  }

  runSwap(
    stxAddress: string,
    currencyX: Currency,
    currencyY: Currency,
    fromAmount: bigint,
    minDy: bigint,
    router: Currency[]
  ): TxToBroadCast {
    return runSpot(
      stxAddress,
      currencyX,
      currencyY,
      fromAmount,
      minDy,
      router,
      AMMSwapPool.ammTokens,
      AMMSwapPool.ammV1_1Tokens
    );
  }

  getCurrencyFrom(address: string): Currency | undefined {
    return findCurrencyByNativeAddress(address);
  }

  getLatestPrices(): Promise<
    Partial<{
      [currency in Currency]: number;
    }>
  > {
    return fetchLatestPrices();
  }
}
