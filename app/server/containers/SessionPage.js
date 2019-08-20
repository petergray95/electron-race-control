import { connect } from 'react-redux';
import Session from '../components/Session';
import { getSession } from '../../../shared/reducers/sessions';
import { getCursorMeta } from '../../../shared/reducers/cursor';

function mapStateToProps(state, props) {
  return {
    session: getSession(state, props.sessionId),
    sessionCursorMeta: getCursorMeta(state, props.sessionId)
  };
}

export default connect(mapStateToProps)(Session);
