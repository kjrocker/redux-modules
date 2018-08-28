import sinon, { SinonSpy } from 'sinon';
import createModuleStore from '../createModuleStore';
import loggerPlugin from './loggerPlugin';

const createLoggerStore = createModuleStore({ plugins: [loggerPlugin] });

describe('loggerPlugin', () => {
  it('logs the things', () => {
    sinon.spy(console, 'log');
    createLoggerStore([{ name: 'Wat', reducers: { key: (state = {}) => state } }]);
    expect((console.log as SinonSpy).calledWith('Adding Wat Module')).toBeTruthy();
    (console.log as SinonSpy).restore();
  });
});
