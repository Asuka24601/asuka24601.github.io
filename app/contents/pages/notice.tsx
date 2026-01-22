
// =============================================
// 源文件: contents\pages\notice.md
// 模块: pages\notice
// 生成时间: 2026-01-22T17:47:46.263Z
// =============================================
import { useOutletContext } from "react-router-dom";
import {useEffect} from "react"

// MDX组件
import {Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs} from "react/jsx-runtime";
import {useMDXComponents as _provideComponents} from "@mdx-js/react";
function _createMdxContent(props) {
  const _components = {
    h1: "h1",
    img: "img",
    p: "p",
    strong: "strong",
    ..._provideComponents(),
    ...props.components
  };
  return _jsxs(_Fragment, {
    children: [_jsx(_components.h1, {
      children: "Hello Everyone："
    }), "\n", _jsx(_components.p, {
      children: "为了更好地配合季节变化，我们计划于本周内对网站首页的背景图案进行微调。具体来说，将把当前的静态波纹图案替换为一种略带动态效果的渐变色彩，该效果在鼠标移动时会产生轻微的颜色波动。"
    }), "\n", _jsx(_components.p, {
      children: "此次调整仅涉及视觉呈现，不会影响网站的任何核心功能、加载速度或用户数据。您可能根本不会注意到这些变化，但我们认为有必要提前告知，以避免不必要的困惑。"
    }), "\n", _jsx(_components.p, {
      children: "如果您在浏览过程中遇到任何显示异常，建议尝试刷新页面或清除浏览器缓存。对于给您带来的任何不便（尽管可能性极低），我深表歉意。"
    }), "\n", _jsx(_components.p, {
      children: "感谢您一直以来的支持！我们将继续致力于为您提供无关紧要但偶尔令人愉悦的浏览体验。"
    }), "\n", _jsx(_components.p, {
      children: _jsx(_components.img, {
        src: "https://s2.loli.net/2024/02/19/XJGQ2dDpojvN1Vm.jpg",
        alt: "likelisi.jpg"
      })
    }), "\n", _jsxs(_components.p, {
      children: [_jsx(_components.strong, {
        children: "发布时间："
      }), " 2026年01月05日 15:47"]
    }), "\n", _jsxs(_components.p, {
      children: [_jsx(_components.strong, {
        children: "发布人："
      }), " Asuka24601"]
    })]
  });
}
export default function MDXContent(props = {}) {
    if (useOutletContext()) {
        const { handleFrontMatterAction,handleMetaAction,handleRenderedAction  } = useOutletContext()
        useEffect(() => {
            handleAction();
        }, []); // 这个effect只会在挂载时运行一次

        function handleAction() {
            handleFrontMatterAction(frontMatter)
            handleMetaAction(meta())
            handleRenderedAction(true)
        }
    }

        
  const {wrapper: MDXLayout} = {
    ..._provideComponents(),
    ...props.components
  };
  return MDXLayout ? _jsx(MDXLayout, {
    ...props,
    children: _jsx(_createMdxContent, {
      ...props
    })
  }) : _createMdxContent(props);
}


// Front Matter数据
export const frontMatter = {
  "title": "notice",
  "date": "2026-01-22"
}

// React Router v7 meta函数
export function meta() {
  return [
    { title: 'notice' },
    {
      name: "description",
      content: 'notice',
    },
    { property: 'og:title', content: 'notice' },
  { property: 'og:description', content: 'notice' },
  { property: 'article:published_time', content: '2026-01-22' },

  ];
}

