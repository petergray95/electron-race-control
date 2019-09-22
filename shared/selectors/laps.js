import { createSelector } from 'reselect';
import { selectSession } from './sessions';

const selectLapIds = (state, props) => selectSession(state, props).laps

const selectLaps = state => state.laps.byId

export const makeGetLapsState = () => createSelector(
  selectLapIds,
  selectLaps,
  ( lapIds) => ( lapIds.map(lapId => selectLaps[lapId]) )
)
