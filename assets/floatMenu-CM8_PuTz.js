import{r as o,j as e}from"./chunk-JMJ3UQ3L-D8xUhVh8.js";import{S as n}from"./SvgIcon-Bgc42I2s.js";import{C as d}from"./CRTOverlay-CMIxyTdG.js";import{T as l}from"./textJitter-CutdUL0c.js";function p({children:t,className:a}){const r=o.useRef(null);return o.useEffect(()=>()=>{document.body.style.paddingRight="",document.body.style.overflowY=""},[]),t?e.jsx(e.Fragment,{children:e.jsxs("div",{className:`${a||"lg:hidden"} contents`,children:[e.jsx("div",{className:"sticky right-0 bottom-0 z-3 flex h-0 w-full -translate-x-8 -translate-y-36 flex-row justify-end",children:e.jsx("button",{className:"border-neutral text-primary bg-base-200 right-8 bottom-24 z-40 flex h-12 w-12 items-center justify-center border-2 border-double shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] transition-all hover:translate-y-1 hover:shadow-none",title:"OPEN_DIRECTORY",onClick:()=>{const s=window.innerWidth-document.documentElement.clientWidth;document.body.style.overflowY="hidden",s>0&&(document.body.style.paddingRight=`${s>30?0:s}px`),r.current?.showModal()},children:e.jsx(n,{name:"toc",size:24})})}),e.jsxs("dialog",{ref:r,onClose:()=>{document.body.style.paddingRight="",document.body.style.overflowY=""},className:"border-neutral bg-base-200 text-base-content backdrop:bg-base-100/50 fixed top-0 right-0 z-50 m-0 h-dvh max-h-dvh w-3/4 max-w-xs overflow-hidden border-l-4 border-double p-0 text-sm shadow-2xl outline-none backdrop:backdrop-blur-sm",onClick:s=>{s.target===r.current&&r.current.close()},children:[e.jsx("style",{children:`
                        /* 1. 基础状态（关闭/退出时） */
                        dialog {
                            opacity: 0;
                            transform: translateX(100%);
                            transition:
                                opacity 0.3s ease-in,
                                transform 0.3s ease-in,
                                overlay 0.3s allow-discrete,
                                display 0.3s allow-discrete;
                        }
                        /* 2. 打开状态 */
                        dialog[open] {
                            opacity: 1;
                            transform: translateX(0);
                            transition:
                                opacity 0.3s ease-out,
                                transform 0.3s ease-out,
                                overlay 0.3s allow-discrete,
                                display 0.3s allow-discrete;
                        }
                        /* 3. 入场起始状态 (@starting-style) */
                        @starting-style {
                            dialog[open] {
                                opacity: 0;
                                transform: translateX(100%);
                            }
                        }
                        /* 4. 背景遮罩动画 */
                        dialog::backdrop {
                            background-color: rgb(0 0 0 / 0);
                            backdrop-filter: blur(0);
                            transition:
                                display 0.3s allow-discrete,
                                overlay 0.3s allow-discrete,
                                background-color 0.3s,
                                backdrop-filter 0.3s;
                        }
                        dialog[open]::backdrop {
                            background-color: rgb(0 0 0 / 0.2);
                            backdrop-filter: blur(4px);
                        }
                        @starting-style {
                            dialog[open]::backdrop {
                                background-color: rgb(0 0 0 / 0);
                                backdrop-filter: blur(0);
                            }
                        }
                    `}),e.jsx(d,{}),e.jsxs(l,{className:"flex h-full flex-col",children:[e.jsxs("div",{className:"flex h-full flex-col overflow-y-auto p-4",children:[e.jsxs("div",{className:"border-neutral/30 mb-4 flex items-end justify-between border-b-2 border-dashed pb-2",children:[e.jsxs("div",{children:[e.jsx("div",{className:"text-base-content mb-1 text-[10px] font-bold tracking-widest uppercase opacity-50 before:content-['\\/\\/_DIRECTORY']"}),e.jsx("div",{className:"text-primary text-xl font-black tracking-widest uppercase after:content-['INDEX']"})]}),e.jsx("button",{className:"group hover:text-primary text-base-content/70 flex items-center gap-2 transition-colors",onClick:()=>r.current?.close(),children:e.jsx("span",{className:"text-[10px] font-bold uppercase after:content-['[_CLOSE_]']"})})]}),t]}),e.jsx("div",{className:"border-neutral/30 text-base-content/40 bg-base-200/20 mt-auto border-t border-dashed p-2 text-[10px] uppercase",children:e.jsx("span",{className:"animate-pulse after:content-['>>_WAITING\\_FOR\\_INPUT']"})})]})]})]})}):null}function m({className:t,style:a,children:r}){return e.jsx(e.Fragment,{children:e.jsx("div",{className:"relative max-w-60 overflow-hidden",children:e.jsx(l,{className:"border-none! p-0!",children:e.jsx("nav",{className:`text-[10px] lg:text-xs ${t||""}`,style:a,children:e.jsx("menu",{className:"flex flex-col border-l border-dashed border-white/10 pl-2 [&_a]:text-wrap [&_a]:break-all",children:r})})})})})}function u({level:t}){return e.jsx(e.Fragment,{children:e.jsx("span",{className:"text-base-content/30 shrink-0 select-none",children:t===1?e.jsx("span",{className:"mr-2 font-bold",children:">_"}):e.jsxs(e.Fragment,{children:[e.jsx("span",{style:{display:"inline-block",width:`${(t-2)*1.2}rem`}}),e.jsx("span",{className:"mr-2",children:"├─"})]})})})}export{m as F,p as S,u as T};
