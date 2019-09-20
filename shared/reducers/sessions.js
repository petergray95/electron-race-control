// @flow
import { combineReducers } from 'redux';
import { ADD_SESSION } from '../actions/sessions';
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
    default:
      return state;
  }
}

function addSessionId(state, action: Action) {
  const { payload } = action;
  const { sessionId } = payload;

  return state.concat(sessionId);
}

function allSessions(state = [], action: Action) {
  switch (action.type) {
    case ADD_SESSION:
      return addSessionId(state, action);
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
