// @flow
import { NEW_MESSAGE } from '../actions/counter';
import type { Action } from './types';

export default function counter(state: object = {}, action: Action) {
  switch (action.type) {
    case NEW_MESSAGE:
      return action.message;
    default:
      return state;
  }
}
