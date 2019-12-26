const { hot } = require("react-hot-loader/root")

// prefer default export if available
const preferDefault = m => m && m.default || m


exports.components = {
  "component---cache-dev-404-page-js": hot(preferDefault(require("/Users/ludejun/ludejun/vedux/docs/.docz/.cache/dev-404-page.js"))),
  "component---src-pages-404-js": hot(preferDefault(require("/Users/ludejun/ludejun/vedux/docs/.docz/src/pages/404.js"))),
  "component---doc-changlog-index-mdx": hot(preferDefault(require("/Users/ludejun/ludejun/vedux/docs/doc/changlog/index.mdx"))),
  "component---doc-joinup-index-mdx": hot(preferDefault(require("/Users/ludejun/ludejun/vedux/docs/doc/joinup/index.mdx"))),
  "component---doc-senior-index-mdx": hot(preferDefault(require("/Users/ludejun/ludejun/vedux/docs/doc/senior/index.mdx"))),
  "component---doc-introduction-index-mdx": hot(preferDefault(require("/Users/ludejun/ludejun/vedux/docs/doc/introduction/index.mdx"))),
  "component---doc-api-index-mdx": hot(preferDefault(require("/Users/ludejun/ludejun/vedux/docs/doc/api/index.mdx")))
}

