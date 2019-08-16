// @flow
import { ADD_SESSION, REMOVE_SESSION } from '../actions/sessions';
import type { Action } from './types';
import DataSessionFactory from '../data';

export default function sessions(state: array = [], action: Action) {
  switch (action.type) {
    case ADD_SESSION: {
      const Session = DataSessionFactory(action.payload.model);
      return [...state, new Session(action.payload)];
    }
    case REMOVE_SESSION:
      return [];
    default:
      return state;
  }
}
