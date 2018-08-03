export interface ReduxModuleInitProps {
  store?: any;
  modules?: any;
}
export interface ReduxModuleOnActionProps {
  store?: any;
  action?: any;
}
export interface PersistReducerChannelMessageData {
  name: string;
  data: JSON;
}
export interface MessageBusProps {
  postMessage: (message: any) => void;
  onmessage: (ev: MessageEvent) => void;
}
export interface MessageBusConstrutable {
  new (name: string): MessageBusProps;
}

const doNothing = (): object => {
  return {};
};
const LOCAL_STORAGE_KEY = 'xcel-react-core/PERSIST_REDUCER_PLUGIN';
const memoryCache: any = {};
class LocalStorageMessageBus implements MessageBusProps {
  onmessage: (ev: MessageEvent) => void = doNothing;
  constructor(public name: string) {
    window.addEventListener('storage', this.onStorage);
    this.name = name;
  }
  onStorage = (e: StorageEvent) => {
    if (e.key === LOCAL_STORAGE_KEY) {
      try {
        let json: PersistReducerChannelMessageData = JSON.parse(e.newValue as any);

        if (memoryCache[json.name] === undefined || e.newValue !== memoryCache[json.name]) {
          memoryCache[json.name] = e.newValue;
          const message: MessageEvent = {
            ...new MessageEvent(this.name),
            data: json
          };
          this.onmessage(message);
        }
      } catch (e) {
        console.warn(LOCAL_STORAGE_KEY, 'failed parsing json');
      }
    }
  };
  postMessage(message: any) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(message));
  }
}
export default LocalStorageMessageBus;
