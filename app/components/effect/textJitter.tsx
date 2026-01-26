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
                'border-primary/20 relative flex flex-col border p-4 md:p-6 ' +
                className
            }
            style={{
                textShadow: '0 0 2px currentColor',
                ...style,
            }}
        >
            {children}
        </div>
    )
}
