function injectHeartStyle() {
    if (document.getElementById('mouse-heart-style')) return
    const style = document.createElement('style')
    style.id = 'mouse-heart-style'
    style.innerHTML = `
    .mouse-heart {
        position: absolute;
        width: 18px;
        height: 18px;
        z-index: 99999;
        pointer-events: none;
        animation: mouse-heart-fade 0.5s forwards;
    }
    .mouse-heart::before,
    .mouse-heart::after {
        content: "";
        position: absolute;
        width: 9px;
        height: 12px;
        background: red;
        border-radius: 8px 8px 0 0;
        top: 0;
    }
    .mouse-heart::after {
        left: 3px;
        transform: rotate(-45deg);
    }
    .mouse-heart::before {
        left: 6px;
        transform: rotate(45deg);
    }
    @keyframes mouse-heart-fade {
        to { opacity: 0; transform: scale(1.5);}
    }
    `
    document.head.appendChild(style)
}

export const createHeart = (): (() => void) => {
    injectHeartStyle()

    const handleClick = (e: PointerEvent) => {
        e.stopPropagation()
        // e.preventDefault()
        const posX = e.pageX
        const posY = e.pageY
        const heart = document.createElement('div')
        heart.className = 'mouse-heart'
        heart.style.top = `${posY - 9}px`
        heart.style.left = `${posX - 9}px`

        document.body.appendChild(heart)

        setTimeout(() => {
            heart.remove()
        }, 500)
    }

    document.body.addEventListener('click', handleClick)

    // 返回清理函数
    return () => {
        document.body.removeEventListener('click', handleClick)
    }
}
