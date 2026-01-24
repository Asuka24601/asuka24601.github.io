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
    className,
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
        <>
            <div
                className={'flex flex-col' + (className ? ` ${className}` : '')}
            >
                <div className="stats border-base-content/10 rounded-none border border-dashed">
                    <div className="stat place-items-center">
                        <div className="stat-title">{status[0].name}</div>
                        <div className={`stat-value text-green-500`}>
                            {status[0].value}
                        </div>
                        <div className="stat-desc">{status[0].discription}</div>
                    </div>
                </div>
                <div className="stats border-base-content/10 rounded-none border border-dashed">
                    <div className="stat place-items-center">
                        <div className="stat-title">{status[1].name}</div>
                        <div className={`stat-value`}>{status[1].value}</div>
                        <div className="stat-desc">{status[1].discription}</div>
                    </div>
                    <div className="stat place-items-center">
                        <div className="stat-title">{status[2].name}</div>
                        <div className={`stat-value`}>{status[2].value}</div>
                        <div className="stat-desc">{status[2].discription}</div>
                    </div>
                </div>
                <div className="stats border-base-content/10 rounded-none border border-dashed">
                    <div className="stat place-items-center">
                        <div className="stat-title">{status[3].name}</div>
                        <div className={`stat-value my-4`}>
                            {values.rate !== null ? (
                                <ElectrocarDiogram
                                    amplitude={150}
                                    maxPoints={60}
                                    className="rounded-xl bg-[rgb(59,62,87)] py-3"
                                />
                            ) : (
                                status[3].value
                            )}
                        </div>
                        <div className="stat-desc">{status[3].discription}</div>
                    </div>
                </div>
                <div className="stats border-base-content/10 rounded-none border border-dashed">
                    <div className="stat place-items-center">
                        <div className="stat-title">{status[4].name}</div>
                        <div className={`stat-value text-orange-500`}>
                            {values.temp !== null ? (
                                <AnimatedNumber
                                    value={values.temp}
                                    toFixed={2}
                                />
                            ) : (
                                status[4].value
                            )}
                        </div>
                        <div className="stat-desc">{status[4].discription}</div>
                    </div>
                </div>
                <div className="stats border-base-content/10 rounded-none border border-dashed">
                    <div className="stat place-items-center">
                        <div className="stat-title">{status[5].name}</div>
                        <div className={`stat-value text-red-500`}>
                            <button
                                onClick={() => {
                                    setHp((hp) =>
                                        hp + 10 > 999999999
                                            ? 999999999
                                            : hp + 10
                                    )
                                }}
                                className="cursor-pointer"
                            >
                                <AnimatedNumber value={hp} toFixed={0} />
                            </button>

                            {config.hp.maxStr ? `/${config.hp.maxStr}` : ''}
                        </div>
                        <div className="stat-desc">{status[5].discription}</div>
                    </div>
                    <div className="stat place-items-center">
                        <div className="stat-title">{status[6].name}</div>
                        <div className={`stat-value text-blue-500`}>
                            <button
                                onClick={() => {
                                    setMp((mp) =>
                                        mp + 10 > 999999999
                                            ? 999999999
                                            : mp + 10
                                    )
                                }}
                                className="cursor-pointer"
                            >
                                <AnimatedNumber value={mp} toFixed={0} />
                            </button>

                            {config.mp.maxStr ? `/${config.mp.maxStr}` : ''}
                        </div>
                        <div className="stat-desc">{status[6].discription}</div>
                    </div>
                </div>
            </div>
        </>
    )
}
