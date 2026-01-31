function injectHeartStyle() {
    if (document.getElementById('mouse-heart-style')) return
    const style = document.createElement('style')
    style.id = 'mouse-heart-style'
    style.innerHTML = `
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
    `
    document.head.appendChild(style)
}

export const createHeart = (): (() => void) => {
    injectHeartStyle()

    const hearts: HTMLDivElement[] = []
    const MAX_HEARTS = 15

    const handleClick = (e: MouseEvent) => {
        // e.stopPropagation()
        // e.preventDefault()
        const posX = e.clientX
        const posY = e.clientY

        requestAnimationFrame(() => {
            if (hearts.length >= MAX_HEARTS) {
                const oldHeart = hearts.shift()
                if (oldHeart) oldHeart.remove()
            }

            const heart = document.createElement('div')
            heart.className =
                'mouse-heart animate__heartBeat animate__animated animate__faster overflow-hidden'
            heart.style.top = `${posY - 9}px`
            heart.style.left = `${posX - 10}px`
            heart.style.filter = `hue-rotate(${Math.random() * 360}deg)`

            document.body.appendChild(heart)
            hearts.push(heart)

            heart.addEventListener(
                'animationend',
                () => {
                    heart.remove()
                    const index = hearts.indexOf(heart)
                    if (index > -1) {
                        hearts.splice(index, 1)
                    }
                },
                { once: true }
            )
        })
    }

    document.body.addEventListener('click', handleClick)

    // 返回清理函数
    return () => {
        document.body.removeEventListener('click', handleClick)
    }
}
