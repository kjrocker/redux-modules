import {
  AnyAction,
  applyMiddleware,
  combineReducers,
  compose,
  createStore,
  Middleware,
  Reducer,
  ReducersMapObject,
  Store,
  StoreEnhancer
  } from 'redux';

export interface ModulePlugin {
  (m: ReduxModule): ReduxModule;
}

export interface CreateModuleStoreConfig {
  plugins?: Array<ModulePlugin>;
  middleware?: Array<Middleware>;
  enhancers?: Array<StoreEnhancer>;
  compose?: Function;
}

export interface ReduxModule {
  name: string;
  reducers: ReducersMapObject;
  middleware?: Middleware[];
  enhancers?: StoreEnhancer[];
  [index: string]: any;
}

const combineModuleReducers = (acc: Record<string, Reducer>, mod: ReduxModule) => ({ ...acc, ...mod.reducers });
const combineModuleInitialState = (acc: Record<string, any>, mod: ReduxModule) => ({
  ...acc,
  ...(mod.initialState || {})
});

const combineModuleMiddleware = (acc: Middleware[], mod: ReduxModule) => acc.concat(mod.middleware || []);
const combineModuleEnhancers = (acc: StoreEnhancer[], mod: ReduxModule) => acc.concat(mod.enhancers || []);

export type CreateModuleStore = (config?: CreateModuleStoreConfig) => (modules: ReduxModule[]) => Store<{}, AnyAction>;

const createModuleStore: CreateModuleStore = (config = {}) => {
  const applyPlugins = config.plugins ? compose<ReduxModule>(...config.plugins) : (x: ReduxModule) => x;
  const defaultMiddleware = config.middleware ? config.middleware : [];
  const defaultEnhancers = config.enhancers ? config.enhancers : [];
  const composeFn = config.compose ? config.compose : compose;
  return (modules: ReduxModule[]) => {
    const newModules = modules.map(applyPlugins);
    const allReducers = newModules.reduce(combineModuleReducers, {});
    const allMiddleware = newModules.reduce(combineModuleMiddleware, defaultMiddleware);
    const allEnhancers = newModules.reduce(combineModuleEnhancers, defaultEnhancers);
    const allInitialState = newModules.reduce(combineModuleInitialState, {});
    return createStore(
      combineReducers(allReducers),
      allInitialState,
      composeFn(applyMiddleware(...allMiddleware), ...allEnhancers)
    );
  };
};

export default createModuleStore;
