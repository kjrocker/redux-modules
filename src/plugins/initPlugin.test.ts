import sinon from 'sinon';
import createModuleStore from '../createModuleStore';
import initPlugin from './initPlugin';

const createInitStore = createModuleStore({ plugins: [initPlugin] });

describe('initPlugin', () => {
  it('calls the provided function', () => {
    const initSpy = sinon.spy();
    createInitStore([{ name: 'Test', reducers: { key: (state = {}) => state }, init: initSpy }]);
    expect(initSpy.callCount).toBe(1);
  });

  it('calls the provided function with the store', () => {
    const initSpy = sinon.spy();
    const store = createInitStore([{ name: 'Test', reducers: { key: (state = {}) => state }, init: initSpy }]);
    expect(initSpy.calledWith({ store })).toBe(true);
  });

  it('doesnt explode when init is missing', () => {
    createInitStore([{ name: 'Test', reducers: { key: (state = {}) => state } }]);
  });
});
