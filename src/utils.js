import CONST from './const';

const {
  VEDUX_CB,
  VEDUX_LAZY,
  VEDUX_OPTS,
  VEDUX_PATCH,
  VEDUX_THROTTLE,
} = CONST;
const defaultThrottleConfig = {
  delay: 100,
};

const isArray = Array.isArray;
const hasOwn = (object = {}, key) => object.hasOwnProperty && object.hasOwnProperty(key);
const isBool = bool => typeof bool === 'boolean' || bool instanceof Boolean;
const isFunc = func => typeof func === 'function';

const resetValue = (
  object,
  key,
  value = null,
) => {
  object[key] = value;
};

const veduxCallbackWrapper = (cbQ) => {
  let result = null;
  if (cbQ && cbQ.length) {
    return data => cbQ.forEach(cb => cb(data));
  }
  return result;
};

const getVeduxCallback = (
  state,
  key = VEDUX_CB,
) => {
  let result = null;
  if (hasOwn(state, key) && isFunc(state[key])) {
    result = state[key];
    resetValue(state, key);
  }
  return result;
};

const pushVeduxCallback = (
  callback,
  queue = [],
) => {
  if (isFunc(callback)) {
    queue.push(callback);
  }
  return queue;
};

const getVeduxLazy = (
  state,
  key = VEDUX_LAZY,
) => (
  hasOwn(state, key) && isBool(state[key])
    ? state[key] : true
);

const getVeduxProps = (
  state,
  optionKey = VEDUX_OPTS,
) => {
  const callbackQ = [];
  let veduxCallback;
  let lazy = true;
  let options;

  Object.keys(state).forEach((stateKey) => {
    const stateForKey = state[stateKey];
    options = stateForKey[optionKey] || options || {};
    const stateLazy = getVeduxLazy(options);
    const stateCallback = getVeduxCallback(stateForKey);

    if (isBool(stateLazy)) {
      lazy = stateLazy;
    }

    if (stateCallback) {
      pushVeduxCallback(
        stateCallback,
        callbackQ,
      );
    }
  });

  return {
    callback: veduxCallbackWrapper(callbackQ),
    options,
    lazy,
  }
};

const throttle = (
  page,
  patch,
  callback,
  options = {},
) => {
  const {
    connectCallback,
    config,
  } = options;
  page[VEDUX_PATCH] = patch;

  if (!page[VEDUX_THROTTLE]) {
    page[VEDUX_THROTTLE] = setTimeout(() => {
      connectCallback();
      page.setData(page[VEDUX_PATCH], callback);
      resetValue(page, VEDUX_PATCH);
      resetValue(page, VEDUX_THROTTLE);
      console.log('delay 100');
    }, config.delay);
  }
};

export const throttleWrapper = (
  page = this,
  patch,
  state,
  connectCallback,
  config = defaultThrottleConfig,
) => {
  const {
    callback,
    options,
    lazy,
  } = getVeduxProps(state);

  if (lazy) {
    return throttle(page, patch, callback, {
      ...options,
      connectCallback,
      config,
    });
  }
  connectCallback();
  page.setData(patch, callback);
};

export default {
  getVeduxProps,
  throttleWrapper,
};