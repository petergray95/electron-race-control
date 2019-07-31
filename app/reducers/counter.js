// @flow
import { INCREMENT_COUNTER } from '../actions/counter';
import type { Action } from './types';

export default function counter(state: object = {}, action: Action) {
  switch (action.type) {
    case INCREMENT_COUNTER:
      return action.message;
    default:
      return state;
  }
}
