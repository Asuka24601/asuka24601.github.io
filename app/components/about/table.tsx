import TextJitter from '../effect/textJitter'

interface Item {
    name: string
    value: number
    color?: string
}

const Separator = () => (
    <>
        <div className="text-primary/50 select-none">+</div>
        <div className="border-primary/50 relative top-[-0.55em] border-b-3 border-dashed"></div>
        <div className="text-primary/50 select-none">+</div>
        <div className="border-primary/50 relative top-[-0.55em] border-b-3 border-dashed"></div>
        <div className="text-primary/50 select-none">+</div>
    </>
)

export default function Table2Col({
    items,
    t1,
    t2,
    className,
    style,
}: {
    t1: string
    t2: string
    items: Item[] | undefined
    className?: string
    style?: React.CSSProperties
}) {
    if (!items) return null

    return (
        <div
            className={`w-full font-mono text-sm ${className || ''}`}
            style={style}
        >
            <div className="border-terminal">
                <TextJitter className="bg-base-300 text-base-content/80 flex flex-col">
                    <div className="grid grid-cols-[auto_1fr_auto_auto_auto]">
                        <Separator />

                        {/* Header */}
                        <div className="text-primary/50 select-none">|</div>
                        <div className="text-primary px-2 font-bold uppercase">
                            {t1}
                        </div>
                        <div className="text-primary/50 select-none">|</div>
                        <div className="text-primary px-2 text-right font-bold uppercase">
                            {t2}
                        </div>
                        <div className="text-primary/50 select-none">|</div>

                        <Separator />

                        {/* Body */}
                        {items?.map((item, index) => (
                            <div key={index} className="group contents">
                                <div className="text-primary/50 group-hover:bg-primary/20 group-hover:text-primary transition-colors select-none">
                                    |
                                </div>
                                <div className="group-hover:bg-primary/20 flex items-center gap-2 overflow-hidden px-2 transition-colors">
                                    {item.color && (
                                        <span
                                            style={{ color: item.color }}
                                            className="text-xs"
                                        >
                                            ■
                                        </span>
                                    )}
                                    <span className="truncate opacity-80 transition-opacity group-hover:opacity-100">
                                        {item.name}
                                    </span>
                                </div>
                                <div className="text-primary/50 group-hover:bg-primary/20 group-hover:text-primary transition-colors select-none">
                                    |
                                </div>
                                <div className="group-hover:bg-primary/20 px-2 text-right opacity-80 transition-all group-hover:opacity-100">
                                    {item.color
                                        ? item.value.toFixed(1)
                                        : item.value}
                                </div>
                                <div className="text-primary/50 group-hover:bg-primary/20 group-hover:text-primary transition-colors select-none">
                                    |
                                </div>
                            </div>
                        ))}

                        <Separator />
                    </div>

                    <div className="mt-2 text-xs">
                        <span className="text-accent/50 uppercase before:content-['>>_END_OF_TABLE']"></span>
                        <span className="text-accent ml-1 animate-pulse before:content-['\_']"></span>
                    </div>
                </TextJitter>
            </div>
        </div>
    )
}
