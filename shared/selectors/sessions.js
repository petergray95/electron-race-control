import shallowEqual from 'fbjs/lib/shallowEqual';
import { createSelector } from 'reselect';

export const selectSession = (state, props) =>
  state.sessions.byId[props.sessionId];

const getSessionConfig = session => ({
  sessionId: session.sessionId,
  name: session.name,
  sessionType: session.sessionType,
  color: session.color,
  isRunning: session.isRunning
});

export const makeGetSessionConfigState = () => {
  let lastResult;

  return createSelector(
    selectSession,
    session => {
      const newResult = getSessionConfig(session);

      if (shallowEqual(lastResult, newResult)) {
        return lastResult;
      }

      lastResult = newResult;
      return newResult;
    }
  );
};
