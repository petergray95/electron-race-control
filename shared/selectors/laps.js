import shallowEqual from 'fbjs/lib/shallowEqual';
import { createSelector } from 'reselect';
import { selectSession } from './sessions';

const getLapIds = (state, props) => selectSession(state, props).laps

const getLaps = state => state.laps.byId

export const makeGetLapsState = () => {
  let lastResult;

  return createSelector(
    getLapIds,
    getLaps,
    (lapIds, laps) => {
      const newResult = lapIds.map(lapId => laps[lapId]);

      if (shallowEqual(lastResult, newResult)) {
        return lastResult;
      }
      lastResult = newResult;
      return newResult;
    }
  );
};
