import { ModulePlugin } from '../createModuleStore';

export interface MessageBusProps {
  postMessage: (message: any) => void;
  onmessage: (ev: MessageEvent) => void;
}

export interface PersistReducerChannelMessageData {
  name: string;
  data: JSON;
}
export interface MessageBusConstrutable {
  new (name: string): MessageBusProps;
}

export interface PersistReducerPluginConfig {
  messageBus: MessageBusConstrutable;
  cacheService: { set: any; get: any };
}

const PERSIST_REDUCER_ACTION = 'xcel-react-core/PERSIST_REDUCER';
const persistReducerAction = (name, payload) => ({
  type: PERSIST_REDUCER_ACTION,
  name,
  payload
});

const excludedEvents = ['@@INIT', '@@redux'];

const persistReducer = (name, reducer, channel: MessageBusProps, cacheService) => {
  let debounceId;
  let current;
  return (state, action) => {
    state = reducer(state, action);
    if (excludedEvents.filter((key) => action.type.indexOf(key) !== -1).length === 0) {
      // allow all PERSIST REDUCER calls to fall here
      if (action.type === PERSIST_REDUCER_ACTION) {
        // only update when we match our name.
        if (action.name === name) {
          state = action.payload;
        }
      } else {
        // reduce chatter by number of events that fire.
        if (current !== state) {
          clearTimeout(debounceId);
          debounceId = setTimeout(() => {
            const message: PersistReducerChannelMessageData = { name, data: state };
            channel.postMessage(message);
          }, 100);
        }
      }
      if (current !== state) {
        current = state;
        // always storing
        cacheService.set(name, state);
      }
    }
    return state;
  };
};

const persistReducerPlugin = ({
  messageBus: MessageBus,
  cacheService: defaultCacheService
}: PersistReducerPluginConfig): ModulePlugin => (mod) => {
  // Early abort if we're not persisting anything
  if (!Boolean(mod.persistReducers && Array.isArray(mod.persistReducers))) return mod;

  const { cacheService = defaultCacheService, reducers } = mod;
  const persistReducerChannel = new MessageBus(PERSIST_REDUCER_ACTION + '/' + mod.name);
  // Creating the new persisted reducers
  const newReducers = Object.keys(mod.reducers)
    .filter((key) => mod.persistReducers.indexOf(key) !== -1)
    .reduce((moduleReducers, key) => {
      moduleReducers[key] = persistReducer(key, moduleReducers[key], persistReducerChannel, cacheService);
      return moduleReducers;
    }, mod.reducers);
  return mod;
};

export default persistReducerPlugin;
