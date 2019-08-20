// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import cursor from './cursor';
import data from './data';
import sessions from './sessions';

export default function createRootReducer(
  history: History,
  scope: string = 'main'
) {
  return combineReducers({
    ...(scope === 'renderer' && { router: connectRouter(history) }),
    cursor,
    data,
    sessions
  });
}
