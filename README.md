## TODO LIST
  - DONE setdata节流：每次需要setdata的data并不立即执行，而是做100ms的节流，合并可能的多次setdata再重新渲染
  - DONE setdata的callback吐出
  - DONE 可以允许不节流。默认节流
  - 参考connect原方法的后面两个function，可以允许一个function做state的统一处理
  - ...
  - DONE load(options) 在mapStateToData里的使用校验