// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import cursor from './cursor';
import data from './data';
import participants from './participants';
import sessions from './sessions';
import laps from './laps';

export default function createRootReducer(
  history: History,
  scope: string = 'main'
) {
  return combineReducers({
    ...(scope === 'renderer' && { router: connectRouter(history) }),
    cursor,
    data,
    sessions,
    laps,
    participants
  });
}
