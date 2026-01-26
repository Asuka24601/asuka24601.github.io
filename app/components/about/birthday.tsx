import { useEffect, useState } from 'react'
import AnimatedNumber from './animatedNumber'
import TextJitter from '../effect/textJitter'

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
        <div className={`w-full font-mono text-sm ${className || ''}`}>
            <div className="border-terminal">
                <TextJitter className="bg-[#232433]">
                    {/* Header */}
                    <div className="border-primary/30 flex items-end justify-between border-b-2 border-dashed pb-2">
                        <div>
                            <div className="mb-1 text-[10px] font-bold tracking-widest text-white uppercase opacity-50 before:content-['\/\/_TEMPORAL\_STATUS']"></div>
                            <div className="text-warning text-xl font-black tracking-widest uppercase">
                                {age}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] font-bold tracking-widest text-white uppercase opacity-50 before:content-['ORIGIN']"></div>
                            <div className="text-warning text-xs opacity-70">
                                {birthday}
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="border-base-content/10 border bg-[#2d416f]/50 p-3">
                        <div className="mb-2 flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase opacity-70 before:content-['Current_Cycle_Offset']"></span>
                            <span className="font-mono text-[10px] opacity-50 before:content-['YEAR\_']">
                                {year}
                            </span>
                        </div>
                        <div className="text-warning flex items-baseline gap-2">
                            <span className="text-lg font-bold">
                                + <AnimatedNumber value={past} toFixed={0} />
                            </span>
                            <span className="text-xs opacity-60 before:content-['\/_31536000_s']"></span>
                        </div>
                        {/* Progress bar for the year */}
                        <div className="bg-base-content/10 mt-2 h-1.5 w-full">
                            <div
                                className="bg-warning h-full"
                                style={{
                                    width: `${Math.min((past / 31536000) * 100, 100)}%`,
                                }}
                            ></div>
                        </div>
                    </div>

                    <div className="mt-1">
                        <span className="text-[10px] text-white uppercase opacity-50 before:content-['>>_SYSTEM\_AGE\_CALCULATION\_MODE:_FLUCTUATING']"></span>
                    </div>
                </TextJitter>
            </div>
        </div>
    )
}
