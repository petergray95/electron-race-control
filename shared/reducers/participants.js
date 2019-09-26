// @flow
import { combineReducers } from 'redux';
import update from 'immutability-helper';
import { ADD_PARTICIPANT, UPDATE_PARTICIPANT } from '../actions/participants';
import type { Action } from './types';

function addParticipantEntry(state, action) {
  const { payload } = action;
  const { participantId, participant } = payload;

  return {
    ...state,
    [participantId]: participant
  };
}

function updateParticipantEntry(state, action) {
  const { payload } = action;
  const { participantId, participant } = payload;
  return update(state, {
    [participantId]: { $merge: participant }
  });
}

function participantsById(state: object = {}, action: Action) {
  switch (action.type) {
    case ADD_PARTICIPANT:
      return addParticipantEntry(state, action);
    case UPDATE_PARTICIPANT:
      return updateParticipantEntry(state, action);
    default:
      return state;
  }
}

function addParticipantId(state, action: Action) {
  const { payload } = action;
  const { participantId } = payload;

  return state.concat(participantId);
}

function allParticipants(state: object = [], action: Action) {
  switch (action.type) {
    case ADD_PARTICIPANT:
      return addParticipantId(state, action);
    default:
      return state;
  }
}

export default combineReducers({
  byId: participantsById,
  allIds: allParticipants
});
