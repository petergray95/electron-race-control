// @flow
// need to be concious of the use of GetState and ability to get state inside an action
// import type { GetState, Dispatch } from '../reducers/types';

export const ADD_SESSION = 'ADD_SESSION';
export const REMOVE_SESSION = 'REMOVE_SESSION';

export function addSession(config) {
  return {
    type: ADD_SESSION,
    payload: config
  };
}

export function removeSession(id) {
  return {
    type: REMOVE_SESSION,
    payload: { id }
  };
}
