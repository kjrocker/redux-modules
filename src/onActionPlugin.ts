import { ModulePlugin } from './createModuleStore';
import { Store, Middleware } from '../node_modules/redux';

const createMiddleware = (onAction: any): Middleware => (store) => (next) => (action) => {
  onAction({ store, action });
  return next(action);
};

const onActionPlugin: ModulePlugin = (mod) => {
  if (mod.onAction && typeof mod.onAction === 'function') {
    const myMiddleware = [...(mod.middleware || []), createMiddleware(mod.onAction)];
    return { ...mod, middleware: myMiddleware };
  }
  return mod;
};

export default onActionPlugin;
