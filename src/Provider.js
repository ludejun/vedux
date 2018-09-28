import warning from './warning';

// const assign = require('../utils/object-assign');

const checkStoreShape = (store) => {
  const missingMethods = ['subscribe', 'dispatch', 'getState'].filter(m => !store.hasOwnProperty(m));

  if (missingMethods.length > 0) {
    warning(
      `Store似乎不是一个合法的Redux Store对象: 缺少这些方法: ${missingMethods.join(', ')}。`
    );
  }
};

const Provider = (store) => {
  checkStoreShape(store);

  const AppConfig = appConfig => Object.assign({}, appConfig, {
    store,
  });

  return AppConfig;
};

export default Provider;
