// @flow
import { UPDATE_SESSIONS, ADD_DATA } from '../actions/sessions';
import type { Action } from './types';

export default function sessions(state: array = [], action: Action) {
  switch (action.type) {
    case UPDATE_SESSIONS:
      return action.payload;
    case ADD_DATA:
      return [];
    default:
      return state;
  }
}
