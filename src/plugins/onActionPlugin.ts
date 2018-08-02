import { ModulePlugin } from '../createModuleStore';
import { Store, Middleware } from 'redux';

export const createMiddlewareFromOnAction = (onAction: any): Middleware => (store) => (next) => (action) => {
  onAction({ store, action });
  return next(action);
};

const onActionPlugin: ModulePlugin = (mod) => {
  if (mod.onAction && typeof mod.onAction === 'function') {
    const myMiddleware = [...(mod.middleware || []), createMiddlewareFromOnAction(mod.onAction)];
    return { ...mod, middleware: myMiddleware };
  }
  return mod;
};

export default onActionPlugin;
