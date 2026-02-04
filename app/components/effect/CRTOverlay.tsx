import CRTScreen from './CRTScreen'

export default function CRTOverlay({
    className,
}: {
    className?: string | undefined
}) {
    return (
        <CRTScreen className={'z-10 ' + (className || '')}>
            <div
                className="dark:via-primary/10 absolute inset-x-0 top-0 h-full bg-linear-to-b from-transparent to-transparent will-change-transform"
                style={{ animation: 'scan 3s linear infinite' }}
            ></div>
        </CRTScreen>
    )
}
