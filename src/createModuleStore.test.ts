import createModuleStore from './createModuleStore';

describe('createModuleStore', () => {
  it('combines reducers', () => {
    const store = createModuleStore({})([
      { name: 'First', reducers: { key1: (state = {}) => state } },
      { name: 'Second', reducers: { key2: (state = {}) => state } }
    ]);
    expect(store.getState()).toEqual({ key1: {}, key2: {} });
  });
});
