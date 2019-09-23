import { connect } from 'react-redux';
import LapsTable from '../components/LapsTable';
import { makeGetLapsState } from '../../../shared/selectors/laps';

const makeMapStateToProps = () => {
  const getLapsState = makeGetLapsState();
  const mapStateToProps = (state, props) => ({
    laps: getLapsState(state, props)
  });
  return mapStateToProps;
};

export default connect(makeMapStateToProps)(LapsTable);
