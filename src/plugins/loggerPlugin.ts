import { ModulePlugin } from '../createModuleStore';

const loggerPlugin: ModulePlugin = (mod) => {
  console.log(`Adding ${mod.name} Module`);
  return mod;
};

export default loggerPlugin;
