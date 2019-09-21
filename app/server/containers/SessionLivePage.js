import { connect } from 'react-redux';
import SessionLive from '../components/SessionLive';
import { makeGetSessionConfigState } from '../../../shared/selectors/sessions';
import { makeGetLapsState } from '../../../shared/selectors/laps';

const makeMapStateToProps = () => {
  const getLapsState = makeGetLapsState();
  const getSessionConfigState = makeGetSessionConfigState();
  const mapStateToProps = (state, props) => ({
    laps: getLapsState(state, props),
    session: getSessionConfigState(state, props)
  })
  return mapStateToProps
}

export default connect(makeMapStateToProps)(SessionLive)
