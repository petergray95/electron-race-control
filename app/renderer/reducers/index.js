// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import dash from './dash';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    dash
  });
}
