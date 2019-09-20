// @flow
// need to be concious of the use of GetState and ability to get state inside an action
// import type { GetState, Dispatch } from '../reducers/types';

export const ADD_SESSION = 'ADD_SESSION';
export const UPDATE_SESSION = 'UPDATE_SESSION';
export const REMOVE_SESSION = 'REMOVE_SESSION';

export function addSession(sessionId, sessionConfig) {
  return {
    type: ADD_SESSION,
    payload: { sessionId, sessionConfig }
  };
}

export function updateSession(sessionId, sessionConfig) {
  return {
    type: UPDATE_SESSION,
    payload: { sessionId, sessionConfig }
  };
}

export function removeSession(sessionId) {
  return {
    type: REMOVE_SESSION,
    payload: { sessionId }
  };
}
