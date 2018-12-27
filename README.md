# vedux

wxapp-redux 微信小程序和redux绑定库，类react-redux



### 简介

在[**wechat-weapp-redux**](https://github.com/charleyw/wechat-weapp-redux)的基础上改进，控制setdata次数与渲染次数，在页面的交互、加载、跳转时setdata次数减少50-80%，渲染时间减少约50%。

有如下功能特性：

- Redux store变化时禁止后台页面setdata，后台页面的setdata汇总到此页面onload时进行；
- 优化stateDiff算法；
- 过滤与当前页面无关的变更；
- 内部对action触发做节流处理，允许不节流，默认节流；
- 支持给action传入callback，在action触发后执行；
- connect的传参mapStateToData，支持传入options（即onLoad的options）；
- connect新增参数mergeProps（对mapStateToData的返回结果做进一步处理）；
- connect新增参数extraOptions（给mergeProps方法传参）；


### 使用方式

app.js

```js
import { Provider } from '@wmfe/vedux';
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
import { CONST } from '@wmfe/vedux';

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
import { connect } from '@wmfe/vedux';
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


## TODO
  - setdata节流：每次需要setdata的data并不立即执行，而是做100ms的节流，合并可能的多次setdata再重新渲染
  - setdata的callback吐出
  - 可以允许不节流。默认节流
  - 参考connect原方法的后面两个function，可以允许一个function做state的统一处理
  - ...
  - load(options) 在mapStateToData里的使用校验