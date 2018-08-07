import { ModulePlugin } from '../createModuleStore';
// import { StoreEnhancer, Reducer } from 'redux';

const initEnhancer = (callback: any) => (next: any) => (reducers: any, initialState: any, enhancer: any) => {
  const store = next(reducers, initialState, enhancer);
  callback({ store });
  return store;
};

const initPlugin: ModulePlugin = ({ init, enhancers, ...rest }) => {
  const newEnhancers =
    init && typeof init === 'function' ? (rest.enhancers || []).concat([initEnhancer(init) as any]) : enhancers;
  return { ...rest, enhancers: newEnhancers };
};

export default initPlugin;
