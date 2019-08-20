import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import NumericWidget from '../../components/widgets/NumericWidget';
import * as CursorActions from '../../../../shared/actions/cursor';
import { getCursorValue } from '../../../../shared/reducers/cursor';

function mapStateToProps(state, props) {
  return {
    value: getCursorValue(state, props.sessionId, props.channel),
    channel: props.channel
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(CursorActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NumericWidget);
