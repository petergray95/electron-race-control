// @flow
import { UPDATE_SESSIONS } from '../actions/sessions';
import type { Action } from './types';

export default function sessions(state: object = {}, action: Action) {
  switch (action.type) {
    case UPDATE_SESSIONS:
      return action.payload;
    default:
      return state;
  }
}
