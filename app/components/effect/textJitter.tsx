export default function TextJitter({
    children,
    className = '',
    style,
}: {
    children: React.ReactNode
    className?: string
    style?: React.CSSProperties
}) {
    return (
        <div
            className={
                'border-primary/20 flex flex-col gap-3 border p-4 text-gray-300 will-change-transform lg:p-6 ' +
                (className || '')
            }
            style={{
                textShadow: '0 0 2px currentColor',
                animation: 'text-jitter 0.08s linear infinite',
                ...style,
            }}
        >
            {children}
        </div>
    )
}
