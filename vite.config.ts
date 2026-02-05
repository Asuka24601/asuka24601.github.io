import babel from 'vite-plugin-babel'
import { defineConfig } from 'vite'
// import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'
import { reactRouter } from '@react-router/dev/vite'
import devtoolsJson from 'vite-plugin-devtools-json'
import Inspect from 'vite-plugin-inspect'
import { mdToRoutePlugin } from './plugins/vite-plugin-md-to-route'
import { mdRegistry } from './plugins/vite-plugin-md-registry'
import mdx from '@mdx-js/rollup'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
    server: {
        // cors: true,
    },
    ssr: {
        // 强制 Vite 处理这些包，将其转换为 ESM 兼容格式
    },
    optimizeDeps: {
        exclude: [
            'virtual:md-content/*',
            'virtual:md-registry',
            'virtual:svg-icons-register',
        ],
    },
    plugins: [
        tailwindcss(),
        mdx({
            providerImportSource: '@mdx-js/react',
        }),
        createSvgIconsPlugin({
            iconDirs: [path.resolve(process.cwd(), 'app/assets/icons')],
            symbolId: 'icon-[dir]-[name]',
            inject: 'body-last',
            customDomId: '__svg__icons__dom__',
        }),

        Inspect(),
        // react(),
        devtoolsJson(),
        babel({
            babelConfig: {
                plugins: ['babel-plugin-react-compiler'],
                presets: ['@babel/preset-react', '@babel/preset-typescript'],
            },
        }),
        mdRegistry({
            contentDir: 'contents',
            devVirtualModule: true,
        }),
        mdToRoutePlugin({
            contentDir: 'contents',
            outputDir: 'app/contents',
            routePrefix: '', // 可选：为所有生成路由添加前缀
            // 可选：是否在开发时使用虚拟模块（默认：true）
            devVirtualModule: true,
        }),
        reactRouter(),
    ],
})
