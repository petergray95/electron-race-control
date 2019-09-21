import { connect } from 'react-redux';
import SessionLive from '../components/SessionLive';
import { makeGetLapsState } from '../../../shared/selectors/laps';

const makeMapStateToProps = () => {
  const getLapsState = makeGetLapsState()
  return (state, props) => getLapsState(state, props)
}

export default connect(makeMapStateToProps)(SessionLive)
