import createModuleStore from '../createModuleStore';
import onActionPlugin from './onActionPlugin';
import sinon from 'sinon';

const createOnActionStore = createModuleStore({ plugins: [onActionPlugin] });
const simplestModule = { name: 'Test', reducers: { key: (state = {}) => state } };

describe('onActionPlugin', () => {
  it('calls the given function when action actually dispatched', () => {
    const onActionSpy = sinon.spy();
    const store = createOnActionStore([{ ...simplestModule, onAction: onActionSpy }]);
    store.dispatch({ type: 'wat' });
    expect(onActionSpy.callCount).toBe(1);
  });

  it('adds a new function to middleware', () => {
    const newModule = onActionPlugin({ ...simplestModule, onAction: () => undefined, middleware: [] });
    expect(newModule.middleware).toHaveLength(1);
  });

  it('doesnt explode when no other middleware provided', () => {
    const newModule = onActionPlugin({ ...simplestModule, onAction: () => undefined });
    expect(newModule.middleware).toHaveLength(1);
  });

  it('doesnt explode when nothing provided', () => {
    onActionPlugin(simplestModule);
  });
});
