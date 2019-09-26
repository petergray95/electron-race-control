import shallowEqual from 'fbjs/lib/shallowEqual';
import { createSelector } from 'reselect';
import { selectSession } from './sessions';

const getParticipantIds = (state, props) =>
  selectSession(state, props).participants;

const getParticipants = state => state.participants.byId;

export const selectParticipant = (state, props) =>
  state.participants.byId[props.participantId];

export const makeGetParticipantsState = () => {
  let lastResult;

  return createSelector(
    getParticipantIds,
    getParticipants,
    (participantIds, participants) => {
      const newResult = participantIds.map(
        participantId => participants[participantId]
      );

      if (shallowEqual(lastResult, newResult)) {
        return lastResult;
      }
      lastResult = newResult;
      return newResult;
    }
  );
};
