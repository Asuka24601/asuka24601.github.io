import { useEffect, useState } from 'react'
import AnimatedNumber from './animatedNumber'

export default function Birthday({
    birthday,
    className,
}: {
    birthday: string | undefined
    className?: string
}) {
    const [age, setAge] = useState(-1.3e10)

    const handleAction = () => {
        const curr = Number((Math.random() * 2.6e10 - 1.3e10).toFixed(0))
        setAge(curr)
    }

    useEffect(() => {
        // 每3s执行一次
        const timer = setInterval(() => {
            handleAction()
        }, 3000)
        return () => {
            clearInterval(timer)
        }
    }, [])

    if (!birthday) return null

    return (
        <>
            <div className={`${className ? ` ${className}` : ''}`}>
                <div className="stats border-base-content/10 rounded-none border border-dashed">
                    <div className="stat place-items-center">
                        <div className="stat-title">当前年龄(随心情波动)</div>
                        <div className={`stat-value text-warning`}>
                            <AnimatedNumber value={age} toFixed={0} />
                        </div>
                        <div className="stat-desc">实际年龄：{birthday}</div>
                    </div>
                </div>
            </div>
        </>
    )
}
