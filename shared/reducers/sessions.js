// @flow
import { combineReducers } from 'redux';
import update from 'immutability-helper';
import {
  ADD_SESSION,
  UPDATE_SESSION,
  REMOVE_SESSION
} from '../actions/sessions';
import { ADD_LAP } from '../actions/laps';

import type { Action } from './types';

function addLap(state, action) {
  const { payload } = action;
  const { sessionId, lapId } = payload;

  const session = state[sessionId];

  return {
    ...state,
    [sessionId]: {
      ...session,
      laps: session.laps.concat(lapId)
    }
  };
}

function sessionsById(state = {}, action: Action) {
  switch (action.type) {
    case ADD_LAP:
      return addLap(state, action);
    case ADD_SESSION: {
      const { sessionId, sessionConfig } = action.payload;
      return { ...state, [sessionId]: { ...sessionConfig, laps: [] } };
    }
    case UPDATE_SESSION: {
      const { sessionId, sessionConfig } = action.payload;
      return update(state, { [sessionId]: { $merge: sessionConfig } });
    }
    case REMOVE_SESSION: {
      const { sessionId } = action.payload;
      const { [sessionId]: session, ...rest } = state;
      return rest;
    }
    default:
      return state;
  }
}

function addSessionId(state, action: Action) {
  const { payload } = action;
  const { sessionId } = payload;

  return state.concat(sessionId);
}

function removeSessionId(state, action: Action) {
  const { payload } = action;
  const { sessionId } = payload;

  return state.filter(id => id !== sessionId);
}

function allSessions(state = [], action: Action) {
  switch (action.type) {
    case ADD_SESSION:
      return addSessionId(state, action);
    case REMOVE_SESSION:
      return removeSessionId(state, action);
    default:
      return state;
  }
}

export default combineReducers({
  byId: sessionsById,
  allIds: allSessions
});

const getSessionIds = state => state.sessions.allIds;

const getSessions = state => state.sessions.byId;

const getSession = (state, sessionId) => state.sessions.byId[sessionId];

export { getSessionIds, getSession, getSessions };
