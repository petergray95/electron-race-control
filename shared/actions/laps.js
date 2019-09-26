// @flow
// need to be concious of the use of GetState and ability to get state inside an action
// import type { GetState, Dispatch } from '../reducers/types';
export const ADD_LAP = 'ADD_LAP';
export const REMOVE_LAP = 'REMOVE_LAP';

export function addLap(sessionId, lapId, lap) {
  return {
    type: ADD_LAP,
    payload: { sessionId, lapId, lap }
  };
}
