import type { SpecialAbiliteItem } from '../../interfaces/archive'

export default function SpecialAbilities({
    items,
}: {
    items: SpecialAbiliteItem[]
    className?: string
}) {
    if (!items || items.length === 0) return null

    return (
        <div className="flex flex-col gap-4">
            <div className="border-primary/30 flex items-end justify-between border-b-2 border-dashed pb-2">
                <div>
                    <div className="mb-1 text-[10px] font-bold tracking-widest text-white uppercase opacity-50 before:content-['\/\/_ACTIVE\_MODULES']"></div>
                    <div className="text-secondary text-xl font-black tracking-widest uppercase before:content-['SPECIAL\_ABILITIES']"></div>
                </div>
                <div className="text-right">
                    <div className="text-[10px] font-bold tracking-widest text-white uppercase opacity-50 before:content-['MODULE\_COUNT']"></div>
                    <div className="text-secondary text-xs opacity-70 after:content-['_ACTIVE']">
                        {items.length}
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="flex flex-col gap-3">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="border-base-content/10 group bg-modalBox/50 hover:bg-modalBox/80 flex flex-col gap-2 border p-3 transition-colors"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex flex-col">
                                <div className="text-secondary text-sm font-bold tracking-wider uppercase">
                                    {item.name}
                                </div>
                                <div className="mt-0.5 font-mono text-[10px] text-white/60 before:content-['TYPE:_']">
                                    {item.level}
                                </div>
                            </div>
                            <div className="border-secondary/30 text-secondary bg-darkpink border px-2 py-1 text-[10px] font-bold before:content-['EFX:_']">
                                {item.effect}
                            </div>
                        </div>

                        <div className="my-1 border-t border-dashed border-white/10"></div>

                        <div className="text-xs leading-relaxed text-white/80 opacity-90">
                            <span className="text-secondary/50 mr-2 select-none">{`>>`}</span>
                            {item.discription}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-1">
                <span className="text-[10px] text-white uppercase opacity-50 before:content-['>>_DIAGNOSTIC\_COMPLETE']"></span>
                <span className="text-secondary ml-1 animate-pulse after:content-['\_']"></span>
            </div>
        </div>
    )
}
