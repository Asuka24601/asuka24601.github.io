import TextJitter from './effect/textJitter'

export default function FloatMenu({
    className,
    style,
    children,
}: {
    className?: string
    style?: React.CSSProperties
    children?: React.ReactNode
}) {
    return (
        <>
            <div className="relative max-w-60 overflow-hidden">
                <TextJitter className="border-none! p-0!">
                    <nav
                        className={`text-[10px] lg:text-xs ${className || ''}`}
                        style={style}
                    >
                        <menu className="flex flex-col border-l border-dashed border-white/10 pl-2 [&_a]:text-wrap [&_a]:break-all">
                            {children}
                        </menu>
                    </nav>
                </TextJitter>
            </div>
        </>
    )
}

export function TreeStructure({ level }: { level: 1 | 2 | 3 | 4 | 5 | 6 }) {
    return (
        <>
            <span className="text-base-content/30 shrink-0 select-none">
                {level === 1 ? (
                    <span className="mr-2 font-bold">{`>_`}</span>
                ) : (
                    <>
                        <span
                            style={{
                                display: 'inline-block',
                                width: `${(level - 2) * 1.2}rem`,
                            }}
                        ></span>
                        <span className="mr-2">{`├─`}</span>
                    </>
                )}
            </span>
        </>
    )
}
