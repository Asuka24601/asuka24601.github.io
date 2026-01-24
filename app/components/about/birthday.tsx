import { useEffect, useState } from 'react'
import AnimatedNumber from './animatedNumber'

export default function Birthday({
    birthday,
    className,
}: {
    birthday: string | undefined
    className?: string
}) {
    const year = new Date().getFullYear()
    // 从年初到今天所度过的秒数
    const sec =
        new Date().getTime() / 1000 - new Date(year, 0, 1).getTime() / 1000
    // 当前年龄
    const age = -1.3e10 + year
    const [past, setPast] = useState(sec)

    const handleAction = () => {
        setPast((pre) => pre + 1)
    }

    useEffect(() => {
        // 每1s执行一次
        const timer = setInterval(() => {
            handleAction()
        }, 1000)
        return () => {
            clearInterval(timer)
        }
    }, [])

    if (!birthday) return null

    return (
        <>
            <div className={`${className ? ` ${className}` : ''}`}>
                <div className="stats border-base-content/10 w-full rounded-none border border-dashed">
                    <div className="stat place-items-center">
                        <div className="stat-title">当前年龄(随心情波动)</div>
                        <div className={`stat-value text-warning`}>
                            {age}
                            <span className="text-base-content/50 text-sm">
                                + (
                                <AnimatedNumber value={past} toFixed={0} /> /
                                31536000)
                            </span>
                        </div>
                        <div className="stat-desc">
                            忽略公元纪年：{birthday}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
