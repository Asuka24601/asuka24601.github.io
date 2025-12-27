import babel from "vite-plugin-babel";
import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite';
import { reactRouter } from '@react-router/dev/vite';
import devtoolsJson from "vite-plugin-devtools-json";
// import dynamicImport from 'vite-plugin-dynamic-import'
import Inspect from 'vite-plugin-inspect'
import { mdToRoutePlugin } from './plugins/vite-plugin-md-to-route'

// https://vite.dev/config/
export default defineConfig({
  server: {
    cors: true,
  },
  // 解决虚拟模块的警告
  optimizeDeps: {
    exclude: ['virtual:md-content/*']
  },
  build: {
    ssr:false,
  },
  plugins: [
    reactRouter(),
    Inspect(),
    // dynamicImport(),
    // react(),
    tailwindcss(),
    devtoolsJson(),
    babel({
      babelConfig: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
    mdToRoutePlugin({
      contentDir: './contents',
      outputDir: './app/contents',
      routePrefix: '/blog', // 可选：为所有生成路由添加前缀
      // 可选：是否在开发时使用虚拟模块（默认：true）
      devVirtualModule: true,
      // 可选：自定义 Markdown 转换选项
      markdownOptions: {
        remarkPlugins: [],
        rehypePlugins: []
      }
    }),
  ],
});
