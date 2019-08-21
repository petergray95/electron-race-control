// @flow
import _ from 'lodash';
import { UPDATE_DATA } from '../actions/data';
import type { Action } from './types';

export default function data(state: object = {}, action: Action) {
  switch (action.type) {
    case UPDATE_DATA: {
      const { sessionId, messages } = action.payload;
      return {
        ...state,
        [sessionId]: { ..._.get(state, [sessionId], {}), ...messages }
      };
    }
    default:
      return state;
  }
}
