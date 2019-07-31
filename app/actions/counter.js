// @flow
// need to be concious of the use of GetState and ability to get state inside an action
// import type { GetState, Dispatch } from '../reducers/types';

export const NEW_MESSAGE = 'NEW_MESSAGE';

export function newMessage(message) {
  return {
    type: NEW_MESSAGE,
    message
  };
}
