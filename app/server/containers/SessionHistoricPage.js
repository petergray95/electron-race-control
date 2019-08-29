import { connect } from 'react-redux';
import SessionHistoric from '../components/SessionHistoric';
import { getCursorMeta } from '../../../shared/reducers/cursor';

function mapStateToProps(state, props) {
  return {
    sessionCursorMeta: getCursorMeta(state, props.session.sessionId)
  };
}

export default connect(mapStateToProps)(SessionHistoric);
