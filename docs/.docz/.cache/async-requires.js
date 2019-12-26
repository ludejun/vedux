// prefer default export if available
const preferDefault = m => m && m.default || m

exports.components = {
  "component---cache-dev-404-page-js": () => import("./dev-404-page.js" /* webpackChunkName: "component---cache-dev-404-page-js" */),
  "component---src-pages-404-js": () => import("./../src/pages/404.js" /* webpackChunkName: "component---src-pages-404-js" */),
  "component---doc-changlog-index-mdx": () => import("./../../doc/changlog/index.mdx" /* webpackChunkName: "component---doc-changlog-index-mdx" */),
  "component---doc-joinup-index-mdx": () => import("./../../doc/joinup/index.mdx" /* webpackChunkName: "component---doc-joinup-index-mdx" */),
  "component---doc-senior-index-mdx": () => import("./../../doc/senior/index.mdx" /* webpackChunkName: "component---doc-senior-index-mdx" */),
  "component---doc-introduction-index-mdx": () => import("./../../doc/introduction/index.mdx" /* webpackChunkName: "component---doc-introduction-index-mdx" */),
  "component---doc-api-index-mdx": () => import("./../../doc/api/index.mdx" /* webpackChunkName: "component---doc-api-index-mdx" */)
}

