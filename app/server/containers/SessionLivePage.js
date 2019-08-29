import { connect } from 'react-redux';
import SessionLive from '../components/SessionLive';
import { getCursorMeta } from '../../../shared/reducers/cursor';

function mapStateToProps(state, props) {
  return {
    sessionCursorMeta: getCursorMeta(state, props.session.sessionId)
  };
}

export default connect(mapStateToProps)(SessionLive);
