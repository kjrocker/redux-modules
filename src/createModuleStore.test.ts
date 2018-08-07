import sinon, { SinonSpy } from 'sinon';
import createModuleStore from './createModuleStore';
import { loggerPlugin, getInitialStatePlugin } from './plugins';
import { Middleware, compose } from 'redux';

// Log the action types as they're fired
const basicThunk: Middleware = (_store) => (next) => (action) => {
  console.log(action.type);
  return next(action);
};

describe('createModuleStore', () => {
  it('combines reducers', () => {
    const store = createModuleStore({})([
      { name: 'First', reducers: { key1: (state = {}) => state } },
      { name: 'Second', reducers: { key2: (state = {}) => state } }
    ]);
    expect(store.getState()).toEqual({ key1: {}, key2: {} });
  });

  it('applies custom compose function', () => {
    const composeSpy = sinon.spy(compose);
    createModuleStore({ compose: composeSpy })([{ name: 'First', reducers: { key1: (state = '') => state } }]);
    expect(composeSpy.called).toBeTruthy();
  });

  it('applies default middleware', () => {
    sinon.spy(console, 'log');
    const store = createModuleStore({ middleware: [basicThunk] })([
      { name: 'First', reducers: { key1: (state = '') => state } }
    ]);
    store.dispatch({ type: 'WAT' });
    expect((console.log as SinonSpy).calledWith('WAT')).toBeTruthy();
    (console.log as SinonSpy).restore();
  });

  it('applies multiple plugins', () => {
    sinon.spy(console, 'log');
    const store = createModuleStore({ plugins: [loggerPlugin, getInitialStatePlugin] })([
      { name: 'First', reducers: { key1: (state = {}) => state }, getInitialState: () => ({ key1: 'test' }) },
      { name: 'Second', reducers: { key2: (state = {}) => state }, getInitialState: () => ({ key2: 'second test' }) }
    ]);
    expect(store.getState()).toEqual({ key1: 'test', key2: 'second test' });
    expect((console.log as SinonSpy).calledTwice).toBeTruthy();
    (console.log as SinonSpy).restore();
  });
});
