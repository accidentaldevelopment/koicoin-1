import {
  Action,
  ActionIdentity,
  ActionTypes,
  ApiResponse,
  Error,
} from '../store/types';
import { takeEvery } from './middleware';

export async function getTransactionForAddress<T extends ActionIdentity>(
  action: T
): Promise<Action> {
  const address = action.payload!.address;

  try {
    const response: Response = await fetch(
      `${process.env.NEXT_PUBLIC_COIN_API}/addresses/${address}`
    );
    const result: ApiResponse = await response.json();

    if (!response.ok) {
      throw new Error(result.error);
    }

    return {
      type: ActionTypes.receiveTransactionsForAddress,
      payload: result,
    };
  } catch (err: unknown) {
    const error = err as Error;
    return {
      type: ActionTypes.receiveError,
      payload: { error: error.message },
    };
  }
}

export async function sendCoins<T extends ActionIdentity>(
  action: T
): Promise<Action> {
  try {
    const response: Response = await fetch(
      `${process.env.NEXT_PUBLIC_COIN_API}/transactions`,
      {
        method: 'POST',
        body: JSON.stringify(action.payload),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    const result: ApiResponse = await response.json();

    if (!response.ok) {
      throw new Error(result.error);
    }

    return {
      type: ActionTypes.getTransactionsForAddress,
      payload: { address: action.payload!.fromAddress },
    };
  } catch (err: unknown) {
    const error = err as Error;
    return {
      type: ActionTypes.receiveError,
      payload: { error: error.message },
    };
  }
}

export function* ledgerMiddleware() {
  yield takeEvery(
    ActionTypes.getTransactionsForAddress,
    getTransactionForAddress
  );
  yield takeEvery(ActionTypes.sendCoins, sendCoins);
}