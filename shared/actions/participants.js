// @flow
// need to be concious of the use of GetState and ability to get state inside an action
// import type { GetState, Dispatch } from '../reducers/types';

export const ADD_PARTICIPANT = 'ADD_PARTICIPANT';
export const UPDATE_PARTICIPANT = 'UPDATE_PARTICIPANT';

export function addParticipant(sessionId, participantId, participant) {
  return {
    type: ADD_PARTICIPANT,
    payload: { sessionId, participantId, participant }
  };
}

export function updateParticipant(participantId, participant) {
  return {
    type: UPDATE_PARTICIPANT,
    payload: { participantId, participant }
  };
}
