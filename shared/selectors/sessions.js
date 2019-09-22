import { createSelector } from 'reselect'

export const selectSession = (state, props) => state.sessions.byId[props.sessionId]

const getSessionConfig = (session) => ({
  sessionId: session.sessionId,
  name: session.name,
  sessionType: session.sessionType,
  color: session.color
})

export const makeGetSessionConfigState = () => createSelector(
  selectSession,
  (session) => ( getSessionConfig(session) )
)
