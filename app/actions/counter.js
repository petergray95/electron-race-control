// @flow
// need to be concious of the use of GetState and ability to get state inside an action
// import type { GetState, Dispatch } from '../reducers/types';

export const INCREMENT_COUNTER = 'INCREMENT_COUNTER';

export function increment(message) {
  return {
    type: INCREMENT_COUNTER,
    message
  };
}
