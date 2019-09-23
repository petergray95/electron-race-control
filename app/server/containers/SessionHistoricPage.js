import { connect } from 'react-redux';
import SessionHistoric from '../components/SessionHistoric';
import { makeGetSessionConfigState } from '../../../shared/selectors/sessions';

const makeMapStateToProps = () => {
  const getSessionConfigState = makeGetSessionConfigState();
  const mapStateToProps = (state, props) => ({
    session: getSessionConfigState(state, props)
  });
  return mapStateToProps;
};

export default connect(makeMapStateToProps)(SessionHistoric);
