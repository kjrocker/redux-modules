import createModuleStore from '../createModuleStore';
import onActionPlugin from './onActionPlugin';
import sinon, { SinonSpy } from 'sinon';
import loggerPlugin from './loggerPlugin';

const createLoggerStore = createModuleStore({ plugins: [loggerPlugin] });

describe('loggerPlugin', () => {
  it('logs the things', () => {
    sinon.spy(console, 'log');
    const store = createLoggerStore([{ name: 'Wat', reducers: {} }]);
    expect((console.log as SinonSpy).calledWith('Adding Wat Module')).toBeTruthy();
    (console.log as SinonSpy).restore();
  });
});
