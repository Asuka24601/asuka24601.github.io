import { useEffect, useMemo, useState } from 'react'
import AnimatedNumber from './animatedNumber'

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
    const [values, setValues] = useState<{
        bp: number | null
        temp: number | null
        hp: number | null
        mp: number | null
    }>({ bp: null, temp: null, hp: null, mp: null })

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
            bp: parseRange(status[3].value),
            temp: parseRange(status[4].value),
            hp: parseSlash(status[5].value),
            mp: parseSlash(status[6].value),
        }
    }, [status])

    useEffect(() => {
        if (!config) return

        let timer: ReturnType<typeof setTimeout>
        let isMounted = true

        const update = () => {
            if (!isMounted) return
            const { bp, temp, hp, mp } = config

            setValues({
                bp: bp.valid
                    ? Math.random() * (bp.max - bp.min) + bp.min
                    : null,
                temp: temp.valid
                    ? Math.random() * (temp.max - temp.min) + temp.min
                    : null,
                hp: hp.valid ? Math.random() * hp.max : null,
                mp: mp.valid ? Math.random() * mp.max : null,
            })

            timer = setTimeout(update, Math.random() * 2000 + 2000)
        }

        update()
        return () => {
            isMounted = false
            clearTimeout(timer)
        }
    }, [config])

    if (!status || status.length !== 7 || !config) return null

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
                        <div className={`stat-value text-pink-500`}>
                            {values.bp !== null ? (
                                <AnimatedNumber value={values.bp} toFixed={2} />
                            ) : (
                                status[3].value
                            )}
                        </div>
                        <div className="stat-desc">{status[3].discription}</div>
                    </div>
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
                            {values.hp !== null ? (
                                <AnimatedNumber value={values.hp} toFixed={0} />
                            ) : (
                                config.hp.cur
                            )}
                            {config.hp.maxStr ? `/${config.hp.maxStr}` : ''}
                        </div>
                        <div className="stat-desc">{status[5].discription}</div>
                    </div>
                    <div className="stat place-items-center">
                        <div className="stat-title">{status[6].name}</div>
                        <div className={`stat-value text-blue-500`}>
                            {values.mp !== null ? (
                                <AnimatedNumber value={values.mp} toFixed={0} />
                            ) : (
                                config.mp.cur
                            )}
                            {config.mp.maxStr ? `/${config.mp.maxStr}` : ''}
                        </div>
                        <div className="stat-desc">{status[6].discription}</div>
                    </div>
                </div>
            </div>
        </>
    )
}
