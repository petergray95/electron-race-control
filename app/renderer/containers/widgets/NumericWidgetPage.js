import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import NumericWidget from '../../components/widgets/NumericWidget';
import * as CursorActions from '../../../../shared/actions/cursor';
import {
  getPlayerIndex,
  getCursorValue
} from '../../../../shared/reducers/cursor';

function mapStateToProps(state, props) {
  const playerIndex = getPlayerIndex(state, props.sessionId);
  return {
    value: getCursorValue(state, props.sessionId, playerIndex, props.channel),
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
