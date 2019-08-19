// @flow
// need to be concious of the use of GetState and ability to get state inside an action
// import type { GetState, Dispatch } from '../reducers/types';

export const UPDATE_SESSIONS = 'UPDATE_SESSIONS';

export function updateSessions(sessions) {
  return {
    type: UPDATE_SESSIONS,
    payload: sessions
  };
}
