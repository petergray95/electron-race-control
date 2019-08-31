// @flow
import {
  ADD_SESSION,
  UPDATE_SESSION,
  REMOVE_SESSION
} from '../actions/sessions';
import type { Action } from './types';

export default function sessions(state: object = {}, action: Action) {
  switch (action.type) {
    case ADD_SESSION: {
      const { sessionId, name, sessionType, color } = action.payload;
      return { ...state, [sessionId]: { sessionId, name, sessionType, color } };
    }
    case UPDATE_SESSION: {
      const { sessionId, name, sessionType, color } = action.payload;
      return { ...state, [sessionId]: { sessionId, name, sessionType, color } };
    }
    case REMOVE_SESSION: {
      const { sessionId } = action.payload;
      const { [sessionId]: sessionToRemove, ...rest } = state;
      return rest;
    }
    default:
      return state;
  }
}

const getSessionIds = state => Object.keys(state.sessions);

const getSessions = state => state.sessions;

const getSession = (state, sessionId) => state.sessions[sessionId];

export { getSessionIds, getSession, getSessions };
