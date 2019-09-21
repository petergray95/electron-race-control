import { createSelector } from 'reselect'

const getSessionConfig = (state, props) => {
  const session = state.sessions.byId[props.sessionId];
  
  return {
    sessionId: session.sessionId,
    name: session.name,
    sessionType: session.sessionType,
    color: session.color
  }
}

export const makeGetSessionConfigState = () => createSelector(
  getSessionConfig,
  (sessionConfig) => ( sessionConfig )
)
