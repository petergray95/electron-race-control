// @flow
// need to be concious of the use of GetState and ability to get state inside an action
// import type { GetState, Dispatch } from '../reducers/types';

export const UPDATE_CURSOR = 'UPDATE_CURSOR';

export function updateCursor(cursor) {
  return {
    type: UPDATE_CURSOR,
    payload: cursor
  };
}
