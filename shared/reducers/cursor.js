// @flow
import _ from 'lodash';
import { UPDATE_CURSOR } from '../actions/cursor';
import type { Action } from './types';

export default function cursor(state: object = {}, action: Action) {
  switch (action.type) {
    case UPDATE_CURSOR: {
      const { sessionId, values, meta } = action.payload;
      return { ...state, [sessionId]: { sessionId, values, meta } };
    }
    default:
      return state;
  }
}

const getCursorValue = (state, sessionId, channel) =>
  _.get(state, ['cursor', sessionId, 'values', channel], '');

const getCursorMeta = (state, sessionId) =>
  _.get(state, ['cursor', sessionId, 'meta'], {});

export { getCursorValue, getCursorMeta };
