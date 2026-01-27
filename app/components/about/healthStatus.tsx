import { useEffect, useMemo, useState } from 'react'
import AnimatedNumber from './animatedNumber'
import { useDiogramDataStore } from '../../lib/store'
import ElectrocarDiogram from '../chart/electrocardiogram'

interface Status {
    name: string
    discription: string
    value: string
}

export default function HealthStatus({
    status,
}: {
    status: Status[] | undefined
    className?: string
}) {
    const setDiogramValue = useDiogramDataStore((state) => state.setValue)

    const [values, setValues] = useState<{
        rate: number | null
        temp: number | null
    }>({ rate: null, temp: null })

    const [hp, setHp] = useState<number>(0)
    const [mp, setMp] = useState<number>(0)

    const config = useMemo(() => {
        if (!status || status.length !== 7) return null

        const parseRange = (str: string) => {
            const [min, max] = str.split('~').map(Number)
            return {
                valid: !isNaN(min) && !isNaN(max),
                min,
                max,
                original: str,
            }
        }

        const parseSlash = (str: string) => {
            const [cur, maxStr] = str.split('/')
            const max = Number(maxStr)
            return { valid: !isNaN(max), max, cur, maxStr }
        }

        return {
            rate: parseRange(status[3].value),
            temp: parseRange(status[4].value),
            hp: parseSlash(status[5].value),
            mp: parseSlash(status[6].value),
        }
    }, [status])

    useEffect(() => {
        if (!config) return

        let timer: ReturnType<typeof setTimeout>
        let isMounted = true

        const init = () => {
            if (!isMounted) return
            const { hp, mp } = config
            setHp(
                hp.valid
                    ? Number(hp.cur)
                    : Number((Math.random() * 100).toFixed(0))
            )
            setMp(
                mp.valid
                    ? Number(mp.cur)
                    : Number((Math.random() * 100).toFixed(0))
            )
        }

        const update = () => {
            if (!isMounted) return
            const { rate, temp } = config

            const spac = rate.max - rate.min
            const value = (Math.random() * spac + rate.min) % spac
            setDiogramValue(value)

            setValues({
                rate: rate.valid ? value : null,
                temp: temp.valid
                    ? Math.random() * (temp.max - temp.min) + temp.min
                    : null,
            })

            setHp((hp) => (hp === 0 ? 0 : Math.random() < 0.5 ? hp : hp - 1))
            setMp((mp) => (mp === 0 ? 0 : Math.random() < 0.5 ? mp : mp - 1))

            timer = setTimeout(update, Math.random() * 3000 + 2000)
        }

        init()
        update()
        return () => {
            isMounted = false
            clearTimeout(timer)
        }
    }, [config])

    if (!status || status.length < 7 || !config) return null

    return (
        <div className="flex flex-col gap-4">
            {/* Header: Status */}
            <div className="border-primary/30 flex items-end justify-between border-b-2 border-dashed pb-2">
                <div>
                    <div className="mb-1 text-[10px] font-bold tracking-widest text-white uppercase opacity-50 before:content-['\/\/_SYSTEM\_STATUS']"></div>
                    <div className="text-success text-2xl font-black tracking-widest uppercase">
                        {status[0].value}
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-[10px] font-bold tracking-widest text-white uppercase opacity-50">
                        {status[0].name}
                    </div>
                    <div className="text-xs text-green-400 opacity-70">
                        {status[0].discription}
                    </div>
                </div>
            </div>
            {/* Body Stats Grid */}
            <div className="text-base-100/80 grid grid-cols-2 gap-4">
                {/* Height */}
                <div className="border-base-content/10 bg-modalBox/50 border p-2">
                    <div className="mb-1 flex items-center justify-between">
                        <span className="text-[10px] uppercase opacity-50">
                            {status[1].name}
                        </span>
                        <span className="text-[10px] uppercase opacity-30 before:content-['M\_01']"></span>
                    </div>
                    <div className="text-lg font-bold">{status[1].value}</div>
                    <div className="mt-1 truncate text-[10px] opacity-60">
                        {status[1].discription}
                    </div>
                </div>
                {/* Weight */}
                <div className="border-base-content/10 bg-modalBox/50 border p-2">
                    <div className="mb-1 flex items-center justify-between">
                        <span className="text-[10px] uppercase opacity-50">
                            {status[2].name}
                        </span>
                        <span className="text-[10px] uppercase opacity-30 before:content-['M\_02']"></span>
                    </div>
                    <div className="text-lg font-bold">{status[2].value}</div>
                    <div className="mt-1 truncate text-[10px] opacity-60">
                        {status[2].discription}
                    </div>
                </div>
            </div>
            {/* ECG Monitor */}
            <div className="border-base-content/20 relative border-2 bg-black/40 p-1">
                <div className="absolute top-2 left-2 z-10 flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-red-500"></span>
                    <span className="text-[10px] font-bold tracking-widest text-red-500 uppercase">
                        {status[3].name}
                    </span>
                </div>
                <div className="h-32 w-full">
                    {values.rate !== null ? (
                        <ElectrocarDiogram
                            amplitude={150}
                            maxPoints={60}
                            className="h-full w-full opacity-80"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-xs text-white opacity-50">
                            NO SIGNAL
                        </div>
                    )}
                </div>
                {/* Overlay Grid Lines */}
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.05)_1px,transparent_1px)] bg-size-[20px_20px]"></div>

                <div className="absolute right-2 bottom-2 text-right">
                    <div className="text-3xl leading-none font-black text-red-500">
                        {values.rate !== null ? Math.round(values.rate) : '--'}
                    </div>
                    <div className="text-[10px] opacity-50">BPM</div>
                </div>
            </div>
            {/* Bottom Stats: Temp, HP, MP */}
            <div className="text-base-100/80 grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* Temp */}
                <div className="border-base-content/10 bg-modalBox/50 flex flex-col justify-between border p-2">
                    <div className="text-[10px] uppercase opacity-50">
                        {status[4].name}
                    </div>
                    <div className="text-xl font-bold text-orange-500">
                        {values.temp !== null ? (
                            <AnimatedNumber value={values.temp} toFixed={1} />
                        ) : (
                            status[4].value
                        )}
                        <span className="ml-1 text-sm after:content-['°C']"></span>
                    </div>
                </div>

                {/* HP */}
                <div
                    className="border-base-content/10 group bg-modalBox/50 flex cursor-pointer flex-col justify-between border p-2 transition-colors hover:bg-red-500/10"
                    onClick={() =>
                        setHp((hp) =>
                            hp + 10 > 999999999 ? 999999999 : hp + 10
                        )
                    }
                >
                    <div className="flex justify-between">
                        <div className="text-[10px] uppercase opacity-50">
                            {status[5].name}
                        </div>
                        <div className="text-[10px] font-bold text-red-500 uppercase before:content-['HP']"></div>
                    </div>
                    <div className="truncate text-lg font-bold text-red-500">
                        <AnimatedNumber value={hp} toFixed={0} />
                        <span className="text-xs opacity-70">
                            /{config.hp.maxStr || '???'}
                        </span>
                    </div>
                    <div className="bg-base-content/10 mt-1 h-1 w-full">
                        <div
                            className="h-full bg-red-500"
                            style={{
                                width: `max(${Math.min((hp / (config.hp.max || 100)) * 100, 100)}%, 1px)`,
                            }}
                        ></div>
                    </div>
                </div>

                {/* MP */}
                <div
                    className="border-base-content/10 group bg-modalBox/50 flex cursor-pointer flex-col justify-between border p-2 transition-colors hover:bg-blue-500/10"
                    onClick={() =>
                        setMp((mp) =>
                            mp + 10 > 999999999 ? 999999999 : mp + 10
                        )
                    }
                >
                    <div className="flex justify-between">
                        <div className="text-[10px] uppercase opacity-50">
                            {status[6].name}
                        </div>
                        <div className="text-[10px] font-bold text-blue-500 uppercase before:content-['MP']"></div>
                    </div>
                    <div className="truncate text-lg font-bold text-blue-500">
                        <AnimatedNumber value={mp} toFixed={0} />
                        <span className="text-xs opacity-70">
                            /{config.mp.maxStr || '???'}
                        </span>
                    </div>
                    <div className="bg-base-content/10 mt-1 h-1 w-full">
                        <div
                            className="h-full bg-blue-500"
                            style={{
                                width: `max(${Math.min((mp / (config.mp.max || 100)) * 100, 100)}%, 1px)`,
                            }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
