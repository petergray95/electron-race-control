// @flow
import { UPDATE_DATA } from '../actions/data';
import type { Action } from './types';

export default function data(state: object = {}, action: Action) {
  switch (action.type) {
    case UPDATE_DATA: {
      const { sessionId, values } = action.payload;
      return { ...state, [sessionId]: { sessionId, values } };
    }
    default:
      return state;
  }
}
