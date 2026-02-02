import { useMemo } from 'react'
import TAGS from '../contents/tags.json'
import CRTOverlay from '../components/effect/CRTOverlay'
import TextJitter from '../components/effect/textJitter'
import { Link } from 'react-router'

const total = TAGS.total

export default function Tags() {
    const tags = TAGS.tags

    const danmakuTags = useMemo(() => {
        return tags.map((tag, index) => {
            const weight = tag.count / total

            // 使用伪随机数生成器避免水合不匹配
            const r = (seed: number) => {
                const x = Math.sin(index + seed) * 10000
                return x - Math.floor(x)
            }

            return {
                top: Math.floor(r(1) * 90), // 0-90%
                duration: 15 + r(2) * 20, // 15-35s
                delay: r(3) * -35, // 负延迟让动画看起来是已经在进行中
                size: 1 + weight * 4, // 1-5rem
                color: `hsl(${Math.floor(r(5) * 360)}, ${50 + weight * 50}%, ${50 + weight * 40}%)`,
                opacity: 0.6 + r(6) * 0.4,
                ...tag,
            }
        })
    }, [tags])

    return (
        <>
            <div className="mx-auto min-h-screen w-full">
                <div className="border-terminal mx-auto grid min-h-[inherit] max-w-6xl overflow-hidden! border-none! p-4 lg:p-6">
                    <div className="min-h-full w-full pt-(--navbar-height) transition-transform duration-500">
                        <CRTOverlay />
                        <TextJitter className="border-primary! bg-modalBlack relative min-h-full overflow-hidden border-4 border-double">
                            <style>{`
                            @keyframes danmaku {
                                from { left: 100%; transform: translateX(0); }
                                to { left: 0; transform: translateX(-100%); }
                            }
                            .danmaku-tag:hover {
                                animation-play-state: paused !important;
                            }
                        `}</style>
                            {danmakuTags.map((tag) => (
                                <Link
                                    key={tag.name}
                                    to={`/tags/${tag.name}`}
                                    className="danmaku-tag absolute cursor-pointer font-mono font-bold whitespace-nowrap transition-all hover:z-50 hover:scale-125 hover:text-white hover:opacity-100"
                                    style={{
                                        top: `${tag.top}%`,
                                        fontSize: `${tag.size}rem`,
                                        color: tag.color,
                                        opacity: tag.opacity,
                                        animation: `danmaku ${tag.duration}s linear infinite`,
                                        animationDelay: `${tag.delay}s`,
                                        textShadow:
                                            '2px 2px 0px rgba(0,0,0,0.5)',
                                    }}
                                >
                                    {tag.name}
                                    <span className="text-base before:content-['_x_']">
                                        {tag.count}
                                    </span>
                                </Link>
                            ))}
                        </TextJitter>
                    </div>
                </div>
            </div>
        </>
    )
}
