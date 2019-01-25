import {
  VEDUX_CB,
  VEDUX_LAZY,
  VEDUX_OPTS,
  VEDUX_PATCH,
  VEDUX_DEBOUNCE,
} from './const';

const defaultDebounceConfig = {
  delay: 100,
};

export const isArray = Array.isArray;
export const hasOwn = (object = {}, key) => object.hasOwnProperty && object.hasOwnProperty(key);
export const isBool = bool => typeof bool === 'boolean' || bool instanceof Boolean;
export const isFunc = func => typeof func === 'function';
export const isEqual = (a, b) => {
	if (a === b) return true;
	if (typeof(a) === typeof(b) && a !== null && b !== null && a !== undefined && b !== undefined) {
		if ([Set, WeakSet, Map, WeakMap, Symbol].indexOf(a.constructor) === -1 && [Set, WeakSet, Map, WeakMap, Symbol].indexOf(b.constructor) === -1
			&& JSON.stringify(a) === JSON.stringify(b)) {
			return true;
		}
	}
	return false;
}

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
    return data => cbQ.forEach(cb => isFunc(cb) && cb(data));
  }
  return result;
};

const getVeduxCallback = (
  state = {},
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
  state = {},
  key = VEDUX_LAZY,
) => (
  hasOwn(state, key) && isBool(state[key])
    ? state[key] : true
);

const getVeduxProps = (
  state = {},
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

const debounce = (
  page,
  patch,
  callback,
  options = {},
) => {
  const {
    config,
  } = options;
  page[VEDUX_PATCH] = Object.assign(page[VEDUX_PATCH] || {}, patch);

  if (!page[VEDUX_DEBOUNCE]) {
    page[VEDUX_DEBOUNCE] = setTimeout(() => {
      page.setData(page[VEDUX_PATCH], callback);
      resetValue(page, VEDUX_PATCH, {});
      resetValue(page, VEDUX_DEBOUNCE);
    }, config.delay);
  }
};

export const debounceWrapper = (
  page = this,
  patch,
  state = {},
  config = defaultDebounceConfig,
) => {
  config = Object.assign({}, defaultDebounceConfig, config);
  const {
    callback,
    options,
    lazy,
  } = getVeduxProps(state);
  const useLazy = !config.force && lazy;
  if (useLazy) {
    debounce(page, patch, callback, {
      ...options,
      config,
    });
  } else {
    page.setData(patch, callback);
  }
};

export default {
  getVeduxProps,
  debounceWrapper,
};
