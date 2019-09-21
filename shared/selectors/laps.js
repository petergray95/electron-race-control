import { createSelector } from 'reselect'

const getLaps = (state, props) => {
  const lapIds = state.sessions.byId[props.sessionId].laps
  return lapIds.map(lapId => state.laps.byId[lapId])
}

export const makeGetLapsState = () => createSelector(
  getLaps,
  (laps) => ( laps )
)
