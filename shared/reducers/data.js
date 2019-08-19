// @flow
import { UPDATE_DATA } from '../actions/data';
import type { Action } from './types';

export default function data(state: object = {}, action: Action) {
  switch (action.type) {
    case UPDATE_DATA:
      return action.payload;
    default:
      return state;
  }
}
