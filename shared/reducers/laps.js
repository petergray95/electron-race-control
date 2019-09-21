// @flow
import { combineReducers } from 'redux';
import { ADD_LAP } from '../actions/laps';
import type { Action } from './types';

function addLapEntry(state, action) {
  const { payload } = action;
  const { lapId, lapConfig } = payload;

  return {
    ...state,
    [lapId]: lapConfig
  };
}

function lapsById(state: object = {}, action: Action) {
  switch (action.type) {
    case ADD_LAP:
      return addLapEntry(state, action);
    default:
      return state;
  }
}

function addLapId(state, action: Action) {
  const { payload } = action;
  const { lapId } = payload;

  return state.concat(lapId);
}

function allLaps(state: object = [], action: Action) {
  switch (action.type) {
    case ADD_LAP:
      return addLapId(state, action);
    default:
      return state;
  }
}

export default combineReducers({
  byId: lapsById,
  allIds: allLaps
});
