// @flow
import { NEW_MESSAGE } from '../actions/dash';
import type { Action } from './types';

export default function dash(state: object = {}, action: Action) {
  switch (action.type) {
    case NEW_MESSAGE:
      return action.message;
    default:
      return state;
  }
}
