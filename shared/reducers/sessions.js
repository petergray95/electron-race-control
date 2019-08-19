// @flow
import { ADD_SESSION, REMOVE_SESSION } from '../actions/sessions';
import type { Action } from './types';

export default function sessions(state: object = {}, action: Action) {
  switch (action.type) {
    case ADD_SESSION: {
      const { id, name } = action.payload;
      return { ...state, [id]: { id, name } };
    }
    case REMOVE_SESSION: {
      const { id } = action.payload;
      const { [id]: sessionToRemove, ...rest } = state;
      return rest;
    }
    default:
      return state;
  }
}
