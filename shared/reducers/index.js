// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import dash from './dash';
import sessions from './sessions';

export default function createRootReducer(
  history: History,
  scope: string = 'main'
) {
  return combineReducers({
    ...(scope === 'renderer' && { router: connectRouter(history) }),
    dash,
    sessions
  });
}
