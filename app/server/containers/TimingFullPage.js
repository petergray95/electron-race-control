import { connect } from 'react-redux';
import TimingFull from '../components/TimingFull';
import { makeGetLapsState } from '../../../shared/selectors/laps';
import { makeGetParticipantsState } from '../../../shared/selectors/participants';

const makeMapStateToProps = () => {
  const getLapsState = makeGetLapsState();
  const getParticipantsState = makeGetParticipantsState();
  const mapStateToProps = (state, props) => ({
    laps: getLapsState(state, props),
    participants: getParticipantsState(state, props)
  });
  return mapStateToProps;
};

export default connect(makeMapStateToProps)(TimingFull);
