import { connect } from 'react-redux';
import { getCursorTimestamp } from '../../../../shared/reducers/cursor';
import HeaderWidget from '../../components/widgets/HeaderWidget';

function mapStateToProps(state, props) {
  return {
    ...props,
    timestamp: getCursorTimestamp(state, props.sessionId),
  };
}

export default connect(mapStateToProps)(HeaderWidget);
