import stateDiff from './stateDiff';
import warning from './warning';
import wrapActionCreators from './wrapActionCreators';
import { debounceWrapper, isFunc } from './utils';

const getCurrentPage = () => {
  const pageStack = getCurrentPages();
  if (pageStack.length) {
    return pageStack[pageStack.length - 1];
  }
  return warning('page异常！');
};

const onShowCallback = function onShowCallback() {
  const { onShowUpdate } = this;
  if (isFunc(onShowUpdate)) {
    onShowUpdate();
    this.onShowUpdate = null;
  }
};

const defaultMapStateToProps = state => ({}); // eslint-disable-line no-unused-vars
const defaultMapDispatchToProps = dispatch => ({
  dispatch,
});

const connect = (
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
  extraOptions,
) => {
  const shouldSubscribe = Boolean(mapStateToProps);
  const mapState = mapStateToProps || defaultMapStateToProps;
  const app = getApp();

  let mapDispatch;
  if (isFunc(mapDispatchToProps)) {
    mapDispatch = mapDispatchToProps;
  } else if (!mapDispatchToProps) {
    mapDispatch = defaultMapDispatchToProps;
  } else {
    mapDispatch = wrapActionCreators(mapDispatchToProps);
  }

  const wrapWithConnect = (pageConfig) => {
    const handleChange = function (options = {}) {
      if (!this.unsubscribe) {
        return;
      }

      const {
        __state,
        store: {
          getState,
        },
      } = this;
      const state = getState();
      let mappedState = mapState(state, options);

      if (typeof extraOptions === 'object') {
        options = Object.assign({}, options || {}, extraOptions);
      }

      if (isFunc(mergeProps)) {
        mappedState = Object.assign(
          mappedState,
          mergeProps(mappedState, this, options) || {},
        );
      }

      const patch = stateDiff(mappedState, __state);

      if (!patch) {
        return;
      }

      this.__state = mappedState;
      debounceWrapper(this, patch, state, options);
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
        // onLoad需要即时从state获取信息，故不做延时优化
        handleChange.call(this, Object.assign({}, options, { force: true }));
      }
      if (isFunc(_onLoad)) {
        _onLoad.call(this, options);
      }
    };

    const onUnload = function () {
      if (isFunc(this.unsubscribe)) {
        this.unsubscribe();
      }
      // should no long receive state changes after .onUnload()
      this.unsubscribe = null;
      if (isFunc(_onUnload)) {
        _onUnload.call(this);
      }
    };

    const onShowWrapper = function (onshow) {
      return function onShow(...args) {
        onShowCallback.call(this);
        if (isFunc(onshow)) {
          onshow.apply(this, args);
        }
      };
    };

    const config = Object.assign({}, pageConfig, mapDispatch(app.store.dispatch), {
      onLoad,
      onUnload,
      onShow: onShowWrapper(_onShow),
    });
    return config;
  };

  return wrapWithConnect;
};

connect.onShowCallback = onShowCallback;
export default connect;
