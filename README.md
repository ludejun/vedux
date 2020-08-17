# vedux

### 概述
- vedux是微信小程序和redux绑定库，类react-redux。
- 在[**wechat-weapp-redux**](https://github.com/charleyw/wechat-weapp-redux)的基础上改进，控制setdata次数与渲染次数，在页面的交互、加载、跳转时setdata次数减少50-80%，渲染时间减少约50%。
- 微信小程序 + vedux + redux + webpack 工程化脚手架参考 https://github.com/ludejun/wxapp-webpack

### 特性

有如下功能特性：

- Redux store变化时禁止后台页面setdata，后台页面的setdata汇总到此页面onload时进行；
- 优化stateDiff算法；
- 过滤与当前页面无关的变更；
- 内部对action触发做节流处理，允许不节流，默认节流；
- 支持给action传入callback，在action触发后执行；
- connect的传参mapStateToData，支持传入options（即onLoad的options）；
- connect新增参数mergeProps（对mapStateToData的返回结果做进一步处理）；
- connect新增参数extraOptions（给mergeProps方法传参）；

##### 有以下注意点：

- Store.getState()中某个状态的属性值禁止为Set, WeakSet, Map, WeakMap, Symbol类型。不然将分辨不出有state变化
- 每一个dispatch的action默认都为异步100ms执行，合理节流。当有某些操作后，有立即执行并且依赖前一个操作的，可以将此action变为同步执行，{lazy: false}，详见下方示例。
- store中存储的state值，应保持为基础类型或object，且state的值不应过大

### 快速接入

```shell
yarn add vedux
```

安装之后：

Step 1：创建store，纯粹redux API

store.js

```js
const {
  createStore,
  // applyMiddleware,
  // compose,
} = require('redux');
const reducer = require('./reducers'); // reducer聚合文件
const store = createStore(
  reducer,
);
module.exports = store;
```

Step 2：app上绑定store

app.js

```js
import { Provider } from 'vedux';
import store from './store';
const config = Provider(store)({
  onLaunch() {
    // TODO
  },
});
App(config);
```

Step 3：在页面上绑定store，比如首页，写法和redux类似

pages/index/index.js

```js
import { connect } from 'vedux';
import { fetchAPI } from '../../actions/home'; // 下面创建
const pageConfig = {
  data: {
    motto: 'Hello World!',
    userInfo: {},
  },
  onLoad() {
    // 异步触发1次，最终态Hello Vedux!
    this.fetchAPI({motto: 'Hello Vedux!'})
  },
};
const mapStateToData = ({user, home}) => {
  return {
    userInfo: user.userInfo,
    motto: home.motto,
  };
};
const mapDispatchToPage = dispatch => ({
  storeUserInfo: userInfo => {
    dispatch(storeUserInfo(userInfo));
  },
  fetchAPI: (payload) => {
    // action第二个参数是callback，当这次action引起data变更后触发
    dispatch(fetchAPI(payload, () => {
      // TODO
    }))
  },
});
Page(connect(
  mapStateToData,
  mapDispatchToPage,
)(pageConfig));
```

Step 4：创建redux数据流中的模版文件：action、reducer

actions/home.js
```js
export const types = {
  HOME_FETCH_API: 'HOME_FETCH_API',
};
export function fetchAPI(payload, cb, options) {
  return {
    type: types.HOME_FETCH_API,
    payload,
  };
}
```

reducers/home.js
```js
import { types } from '../actions/home';
const initialState = {
  motto: null,
};
export default function user(state = initialState, action = {}) {
  switch (action.type) {
    case types.HOME_FETCH_API:
      return {
        ...state,
        motto: action.payload.motto,
      };
    default:
      return state;
  }
}
```

#### 最后

这样redux数据流就跑下来了，可以通过绑定在app上的store来控制全局状态的页面更新，通过mapStateToData可以将变化之后的state打到页面的data中，并自动让页面刷新。dispatch导致的页面data变化默认不是同步的。当然也有些场景，比如登录后，dispatch必须为同步可以参考后续API文档或者高阶使用文档。

### API介绍

vedux的API整体上比较简单，具体使用示例详见高级使用。主要分为三部分：connect参数、reducer返回的state可以多加options、Provider：

1. connect

   | 参数              | 类型     | 是否必填 | 说明                                                         |
   | ----------------- | -------- | -------- | ------------------------------------------------------------ |
   | mapStateToData    | Function | 否       | 页面需要的store数据，似redux connect的mapStateToProps。函数可以两个参数，第一个为需要的state，第二个为onLoad的options，支持拿schema中的数据在此函数中做运算 |
   | mapDispatchToPage | Function | 否       | 绑定页面要用的action creator，同redux connect的mapDispatchToProps |
   | mergeProps        | Function | 否       | 对mapStateToData的返回结果做进一步处理的函数，似redux connect的mergeProps。函数可以三个参数，详见高级使用注释 |
   | extraOptions      | Object   | 否       | 给mergeProps方法传参                                         |

   

2. reducer

| 属性               | 类型     | 是否必填 | 说明                                                         |
| ------------------ | -------- | -------- | ------------------------------------------------------------ |
| [CONST.VEDUX_CB]   | Function | 否       | store变化后页面刷新后（setdata）的回调，不管是同步还是异步   |
| [CONST.VEDUX_OPTS] | Object   | 否       | 可以控制此次store变化导致的页面setdata是同步，还是debounce 100ms。如含有{lazy:false}则为同步 |

注：CONST为vedux库暴露出来的常量，demo见高级使用

3. Provider

| 参数  | 类型   | 是否必填 | 说明                                                         |
| ----- | ------ | -------- | ------------------------------------------------------------ |
| store | Object | 是       | 以全局store为参数，返回一个处理appConfig的函数（此函数以appConfig为参数），见快速使用的app.js |



### 高级使用

app.js

```js
import { Provider } from 'vedux';
import store from './store';

const config = Provider(store)({
  onLaunch() {
    // TODO
  },
});

App(config);

```

actions/home.js

```js
export const types = {
  HOME_FETCH_API: 'HOME_FETCH_API',
};

const fetch = (data, t = 0) => new Promise((resolve) => {
  setTimeout(resolve, t, data)
});

export function fetchAPI(payload, cb, options) {
  return dispatch => {
    return fetch(payload, 1500).then(
      data => {
        dispatch({
          type: types.HOME_FETCH_API,
          cb, // 示例：传递vedux回调函数
          options, // 示例：传递vedux可选配置
          payload,
        })
      },
    )
  };
}

```

reducers/home.js

```js
import { types } from '../actions/home';
import { CONST } from 'vedux';

const initialState = {
  motto: null,
};

export default function user(state = initialState, action = {}) {
  switch (action.type) {
    case types.HOME_FETCH_API:
      return {
        ...state,
        motto: action.payload.motto,
        // vedux回调函数【专用key】
        [CONST.VEDUX_CB]: action.cb,
        // vedux可选配置【专用key】
        [CONST.VEDUX_OPTS]: action.options,
      };

    default:
      return state;
  }
}

```

pages/index/index.js

```js
import { connect } from 'vedux';
import { fetchAPI } from '../../actions/home';

const pageConfig = {
  data: {
    motto: 'Hello World!',
    userInfo: {},
  },
  onLoad() {
    // 触发1次，最终态Hello Vedux7!
    this.fetchAPI({motto: 'Hello Vedux!'})
    this.fetchAPI({motto: 'Hello Vedux2!'})
    this.fetchAPI({motto: 'Hello Vedux3!'})
    this.fetchAPI({motto: 'Hello Vedux4!'})
    this.fetchAPI({motto: 'Hello Vedux5!'})
    this.fetchAPI({motto: 'Hello Vedux6!'})
    this.fetchAPI({motto: 'Hello Vedux7!'})
    // 触发7次，最终态Hello Vedux7!
    this.fetchAPI2({motto: 'Hello Vedux!'})
    this.fetchAPI2({motto: 'Hello Vedux2!'})
    this.fetchAPI2({motto: 'Hello Vedux3!'})
    this.fetchAPI2({motto: 'Hello Vedux4!'})
    this.fetchAPI2({motto: 'Hello Vedux5!'})
    this.fetchAPI2({motto: 'Hello Vedux6!'})
    this.fetchAPI2({motto: 'Hello Vedux7!'})
  },
};

const mapStateToData = ({user, home}, options) => {
  return {
    userInfo: user.userInfo,
    motto: home.motto,
  };
};

const mapDispatchToPage = dispatch => ({
  storeUserInfo: userInfo => {
    dispatch(storeUserInfo(userInfo));
  },
  fetchAPI: (payload) => {
    // action第二个参数是callback，当这次action引起data变更后触发
    dispatch(fetchAPI(payload, () => {
      // TODO
    }))
  },
  fetchAPI2: payload => {
    // action第二个参数是options，目前可以设置
    // lazy [boolean] 是否延时setData，默认true，即延时100ms
    dispatch(fetchAPI(payload, () => {
      // TODO
    }, {
      lazy: false,
    }));
  },
});

// 用于处理本次action触发变更的数据，用于最终做stateDiff
const mergeProps = (
  propsFromState, // 本次改动的数据
  page, // 当前页面
  ownProps, // onLoad的options以及extraOptions
) => {
  return {
    // 页面本身props
  };
};

const extraOptions = {
  // mergeProps需要的额外参数
};

Page(connect(
  mapStateToData,
  mapDispatchToPage,
  mergeProps,
  extraOptions,
)(pageConfig));

```



## store导致setdata后的回调

在某些场景，此次dispatch action后，需要在页面渲染后做一些回调，比如曝光埋点、页面渲染计时等。在上例中，fetchAPI的第二个参数会传给reducer的[CONST.VEDUX_CB]专用key，这就是setdata后的回调。



## 异步action，中间件使用

比如thunk使用，接入方式和react-redux一样

store.js

```js
const {
  createStore,
  applyMiddleware,
  // compose,
} = require('redux');
import thunk from 'redux-thunk';
const reducer = require('./reducers');
const store = createStore(
  reducer,
  applyMiddleware(thunk)
  //    createEnhancer({
  //        beforeDispatch: [],
  //        afterDispatch: [wmRequest.update],
  //    })
);
export default store;
```

action/home.js

```js
export const types = {
  HOME_FETCH_API: 'HOME_FETCH_API',
};
const fetch = (data, t = 0) =>
  new Promise(resolve => {
    setTimeout(resolve, t, data);
  });
export function fetchAPI(payload) {
  return dispatch => {
    return fetch(payload, 1500).then(data => {
      dispatch({
        type: types.HOME_FETCH_API,
        payload: data,
      });
    });
  };
}
```

