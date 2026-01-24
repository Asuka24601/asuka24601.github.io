import { useEffect, useRef, useState } from 'react'

export default function AnimatedNumber({
    value,
    toFixed = 0,
}: {
    value: number
    toFixed?: number
}) {
    const [displayValue, setDisplayValue] = useState(value)
    const previousValue = useRef(value)

    useEffect(() => {
        previousValue.current = displayValue
    }, [displayValue])

    useEffect(() => {
        let startTimestamp: number | null = null
        const duration = 1000
        const startValue = previousValue.current

        let animationFrameId: number

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp
            const progress = Math.min(
                (timestamp - startTimestamp) / duration,
                1
            )
            const ease = 1 - Math.pow(1 - progress, 4) // Ease out quart

            setDisplayValue(startValue + (value - startValue) * ease)

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(step)
            }
        }

        animationFrameId = requestAnimationFrame(step)
        return () => cancelAnimationFrame(animationFrameId)
    }, [value])

    return <>{displayValue.toFixed(toFixed)}</>
}
