// @flow
import { connect } from 'react-redux';
import { getSessionIds } from '../../../../shared/reducers/sessions';
import BaseWidget from '../../components/widgets/BaseWidget';

function mapStateToProps(state, props) {
  return {
    onClose: props.onClose,
    sessionId: getSessionIds(state)[0]
  };
}

export default connect(mapStateToProps)(BaseWidget);
