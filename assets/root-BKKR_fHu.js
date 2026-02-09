import{_ as d}from"./preload-helper-BXl3LOEh.js";import{w as h,b as m,z as u,j as e,A as p,S as f,B as x,C as y,r as o,O as v}from"./chunk-JMJ3UQ3L-D8xUhVh8.js";import{P as g}from"./errorPage-21m-VrE0.js";import{a as E}from"./CRTOverlay-CMIxyTdG.js";import"./textJitter-CutdUL0c.js";function j(){if(document.getElementById("mouse-heart-style"))return;const t=document.createElement("style");t.id="mouse-heart-style",t.innerHTML=`
    .mouse-heart {
        position: fixed;
        width: 21px;
        height: 18px;
        z-index: 99999;
        pointer-events: none;
        will-change: transform;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 7 6'%3E%3Cpath fill='red' d='M1 0h2v1h-2zM4 0h2v1h-2zM0 1h7v2h-7zM1 3h5v1h-5zM2 4h3v1h-3zM3 5h1v1h-1z'/%3E%3C/svg%3E");
        background-size: contain;
        background-repeat: no-repeat;
        image-rendering: pixelated;
        user-select: none;
    }
    `,document.head.appendChild(t)}const k=()=>{j();const t=[],r=15,n=i=>{const c=i.clientX,l=i.clientY;requestAnimationFrame(()=>{if(t.length>=r){const a=t.shift();a&&a.remove()}const s=document.createElement("div");s.className="mouse-heart animate__heartBeat animate__animated animate__faster overflow-hidden",s.style.top=`${l-9}px`,s.style.left=`${c-10}px`,s.style.filter=`hue-rotate(${Math.random()*360}deg)`,document.body.appendChild(s),t.push(s),s.addEventListener("animationend",()=>{s.remove();const a=t.indexOf(s);a>-1&&t.splice(a,1)},{once:!0})})};return document.body.addEventListener("click",n),()=>{document.body.removeEventListener("click",n)}},w="/assets/animate.min-pVjtZevj.css",H="/assets/katex.min-DvXFAOB1.css",_="/assets/katex-he0-ZoVk.css",b="/assets/style-C2f0jqLM.css",S="/assets/fonts-CsUOyEe6.css",A=()=>[{rel:"icon",href:"/favicon.ico"},{rel:"stylesheet",href:w},{rel:"stylesheet",href:S},{rel:"stylesheet",href:H},{rel:"stylesheet",href:b},{rel:"stylesheet",href:_}],P=h(function(){const r=y();return o.useLayoutEffect(()=>{const n=sessionStorage.getItem("redirect");n&&(sessionStorage.removeItem("redirect"),r(n))},[r]),o.useEffect(()=>k(),[]),o.useEffect(()=>{d(()=>import("./virtual_svg-icons-register-auqqNQSQ.js"),[])},[]),e.jsx(e.Fragment,{children:e.jsx(v,{})})});function F({children:t}){return e.jsxs("html",{lang:"en",className:"scroll-smooth",suppressHydrationWarning:!0,children:[e.jsxs("head",{children:[e.jsx("meta",{charSet:"utf-8"}),e.jsx("meta",{name:"viewport",content:"width=device-width, initial-scale=1"}),e.jsx(p,{})]}),e.jsxs("body",{className:"bg-base-100 relative transition-colors duration-300",suppressHydrationWarning:!0,children:[e.jsx(E,{}),t,e.jsx(f,{}),e.jsx(x,{})]})]})}const O=m(function({error:r}){return e.jsx(g,{error:r})}),N=u(function(){return e.jsx("div",{children:e.jsx("span",{className:"loading loading-dots loading-xl absolute top-1/2 left-1/2 translate-1/2"})})});export{O as ErrorBoundary,N as HydrateFallback,F as Layout,P as default,A as links};
