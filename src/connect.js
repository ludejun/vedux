import stateDiff from './stateDiff';
import warning from './warning';
import wrapActionCreators from './wrapActionCreators';
import { throttleWrapper } from './utils';

const getCurrentPage = () => {
  const pageStack = getCurrentPages();
  if (pageStack.length) {
    return pageStack[pageStack.length - 1];
  }
  return warning('page异常！');
};

const onShowCallback = function onShowCallback() {
  const { onShowUpdate } = this;
  if (typeof onShowUpdate === 'function') {
    onShowUpdate();
    this.onShowUpdate = null;
  }
};

const defaultMapStateToProps = state => ({}); // eslint-disable-line no-unused-vars
const defaultMapDispatchToProps = dispatch => ({
  dispatch,
});

const connect = (mapStateToProps, mapDispatchToProps) => {
  const shouldSubscribe = Boolean(mapStateToProps);
  const mapState = mapStateToProps || defaultMapStateToProps;
  const app = getApp();

  let mapDispatch;
  if (typeof mapDispatchToProps === 'function') {
    mapDispatch = mapDispatchToProps;
  } else if (!mapDispatchToProps) {
    mapDispatch = defaultMapDispatchToProps;
  } else {
    mapDispatch = wrapActionCreators(mapDispatchToProps);
  }

  const wrapWithConnect = (pageConfig) => {
    const handleChange = function (options) {
      if (!this.unsubscribe) {
        return;
      }

      const state = this.store.getState();
      const mappedState = mapState(state, options);
      const {
        __state,
      } = this;
      const patch = stateDiff(mappedState, __state);
      if (!patch) {
        return;
      }

      throttleWrapper(this, patch, state, () => {
        this.__state = mappedState;
      });
    };

    const {
      onLoad: _onLoad,
      onUnload: _onUnload,
      onShow: _onShow,
    } = pageConfig;

    const onLoad = function (options) {
      this.store = app.store;
      if (!this.store) {
        warning('Store对象不存在!');
      }
      if (shouldSubscribe) {
        this.__state = {};
        this.unsubscribe = this.store.subscribe(() => {
          if (this === getCurrentPage()) {
            handleChange.call(this, options);
          } else {
            this.onShowUpdate = handleChange.bind(this, options);
          }
        });
        handleChange.call(this, options);
      }
      if (typeof _onLoad === 'function') {
        _onLoad.call(this, options);
      }
    };

    const onUnload = function () {
      if (typeof this.unsubscribe === 'function') {
        this.unsubscribe();
      }
      // should no long receive state changes after .onUnload()
      this.unsubscribe = null;
      if (typeof _onUnload === 'function') {
        _onUnload.call(this);
      }
    };

    const onShow = function onShow() {
      onShowCallback.call(this);
      if (typeof _onShow === 'function') {
        _onShow.call(this);
      }
    };

    const config = Object.assign({}, pageConfig, mapDispatch(app.store.dispatch), {
      onLoad,
      onUnload,
      onShow,
    });

    // // 如果connect先于base.js继承，直接重写onShow
    // if (config.pageName && !('pageHidden' in config)) {
    //   config.onShow = onShow;
    // }
    return config;
  };

  return wrapWithConnect;
};

connect.onShowCallback = onShowCallback;
export default connect;
