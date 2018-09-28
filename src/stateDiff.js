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
    // if (!hasOwn.call(state, key) || val !== state[key]) {
    if (!hasOwn.call(state, key) ||
      !(val === state[key] || JSON.stringify(val) === JSON.stringify(state[key]))) {
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
