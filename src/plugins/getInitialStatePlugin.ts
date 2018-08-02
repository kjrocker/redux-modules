import { ModulePlugin } from '../createModuleStore';
import { StoreEnhancer, Reducer } from 'redux';

const getInitialStatePlugin: ModulePlugin = ({ getInitialState, initialState = {}, ...rest }) => {
  const newInitialState =
    getInitialState && typeof getInitialState === 'function' ? { ...initialState, ...getInitialState() } : initialState;
  return { ...rest, initialState: newInitialState };
};

export default getInitialStatePlugin;
