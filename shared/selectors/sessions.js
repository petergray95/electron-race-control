import { createSelector } from 'reselect'

const getSession = (state, props) => state.sessions.byId[props.sessionId]

export const makeGetSessionState = () => createSelector(
  getSession,
  (session) => ( session )
)
