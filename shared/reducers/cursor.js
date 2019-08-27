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

const getPlayerIndex = (state, sessionId) =>
  _.get(
    state,
    ['cursor', sessionId, 'values', 'm_header', 'm_playerCarIndex'],
    null
  );

const getCursorValue = (state, sessionId, playerIndex, channel) =>
  _.get(
    state,
    ['cursor', sessionId, 'values', 'm_carTelemetryData', playerIndex, channel],
    null
  );

const getCursorTimestamp = (state, sessionId) =>
  _.get(state, ['cursor', sessionId, 'meta', 'timestamp'], 0);

const getCursorMeta = (state, sessionId) =>
  _.get(state, ['cursor', sessionId, 'meta'], {});

export { getPlayerIndex, getCursorValue, getCursorTimestamp, getCursorMeta };
