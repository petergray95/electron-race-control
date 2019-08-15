import { getInitialStateRenderer } from 'electron-redux';
import { configureStore } from '../../shared/store/configureStore';

const initialState = getInitialStateRenderer();
const store = configureStore(initialState, 'renderer');

export default store;
