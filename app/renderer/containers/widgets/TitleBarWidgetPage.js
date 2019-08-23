import { connect } from 'react-redux';

import TitleBarWidget from '../../components/widgets/TitleBarWidget';

function mapStateToProps(state, props) {
  return {
    ...props
  };
}

export default connect(mapStateToProps)(TitleBarWidget);
