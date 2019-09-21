import { connect } from 'react-redux';
import SessionHistoric from '../components/SessionHistoric';
import { makeGetSessionState } from '../../../shared/selectors/sessions';
import { makeGetLapsState } from '../../../shared/selectors/laps';

const makeMapStateToProps = () => {
  const getLapsState = makeGetLapsState();
  const getSessionState = makeGetSessionState();
  const mapStateToProps = (state, props) => ({
    laps: getLapsState(state, props),
    session: getSessionState(state, props)
  })
  return mapStateToProps
}

export default connect(makeMapStateToProps)(SessionHistoric)
