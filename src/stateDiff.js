import { isEqual } from './utils';

const hasOwn = Object.prototype.hasOwnProperty;

const stateDiff = (nextState, state) => {
  if (nextState === state) {
    return null;
  }

  const patch = {};

  const keys = Object.keys(nextState);
  const length = keys.length;
  let hasChanged = false;
  for (let i = 0; i < length; ++i) {
    const key = keys[i];
    const val = nextState[key];
    // 更改diff算法原来比较object只通过恒等判断的逻辑
		// 为了只是简单的JSON.stringify序列化就能简单判断是否相等，需排除state的属性为Set, WeakSet, Map, WeakMap, Symbol类型
		// 但这并不能排除state的属性的属性含有这五种类型，因此禁止store中（特别是某一state的属性的属性中）含有这五种类型！！！

    // if (!hasOwn.call(state, key) || val !== state[key]) {
    if (!hasOwn.call(state, key) || !isEqual(val, state[key])) {
      patch[key] = val;
      hasChanged = true;
    }
  }

  if (!hasChanged) {
    return null;
  }

  return patch;
};

export default stateDiff;
