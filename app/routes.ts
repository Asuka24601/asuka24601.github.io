import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  layout("layouts/base.tsx", [
    index("routes/home.tsx"),
    route("about","routes/about.tsx"),
    ...prefix("post",[
      index("routes/postIndex.tsx"),
      route(":title","routes/postContent.tsx"),
    ])
  ]),
  
] satisfies RouteConfig;
