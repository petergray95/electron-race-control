// @flow
import _ from 'lodash';
import { ADD_LAP } from '../actions/laps';
import type { Action } from './types';

export default function sessions(state: object = {}, action: Action) {
  switch (action.type) {
    case ADD_LAP: {
      const { sessionId, lap } = action.payload;
      return { ...state, [sessionId]: [..._.get(state, [sessionId], []), lap] };
    }
    default:
      return state;
  }
}
