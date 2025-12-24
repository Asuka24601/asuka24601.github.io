import {
  type RouteConfig,
  index,
  layout,
} from "@react-router/dev/routes";

export default [
  layout("layouts/base.tsx", [
    index("routes/home.tsx"),
  ]),
] satisfies RouteConfig;
