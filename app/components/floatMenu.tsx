import CRTOverlay from './effect/CRTOverlay'
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
            <div className="bg-modalBlack! relative overflow-hidden">
                <CRTOverlay />
                <TextJitter>
                    <nav
                        className={`font-mono text-xs lg:text-sm ${className || ''}`}
                        style={style}
                    >
                        <menu className="flex flex-col border-l border-dashed border-white/10 pl-2">
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
            <span className="shrink-0 font-mono text-white/30 select-none">
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
