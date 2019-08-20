// @flow
// need to be concious of the use of GetState and ability to get state inside an action
// import type { GetState, Dispatch } from '../reducers/types';

export const UPDATE_DATA = 'UPDATE_DATA';

export function updateData(message) {
  return {
    type: UPDATE_DATA,
    payload: message
  };
}
