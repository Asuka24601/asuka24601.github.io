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
            <div className="border-neutral/30 flex items-end justify-between border-b-2 border-dashed pb-2">
                <div>
                    <div className="text-base-content mb-1 text-[10px] font-bold tracking-widest uppercase opacity-50 before:content-['\/\/_ACTIVE\_MODULES']"></div>
                    <div className="text-accent text-xl font-black tracking-widest uppercase before:content-['SPECIAL\_ABILITIES']"></div>
                </div>
                <div className="text-right">
                    <div className="text-base-content text-[10px] font-bold tracking-widest uppercase opacity-50 before:content-['MODULE\_COUNT']"></div>
                    <div className="text-accent text-xs opacity-70 after:content-['_ACTIVE']">
                        {items.length}
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="flex flex-col gap-3">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="border-base-content/10 group bg-base-300/50 hover:bg-base-300/80 flex flex-col gap-2 border p-3 transition-colors"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex flex-col">
                                <div className="text-accent text-sm font-bold tracking-wider uppercase">
                                    {item.name}
                                </div>
                                <div className="text-base-content/60 mt-0.5 font-mono text-[10px] before:content-['TYPE:_']">
                                    {item.level}
                                </div>
                            </div>
                            <div className="border-secondary/30 text-secondary bg-base-300/20 border px-2 py-1 text-[10px] font-bold before:content-['EFX:_']">
                                {item.effect}
                            </div>
                        </div>

                        <div className="my-1 border-t border-dashed border-white/10"></div>

                        <div className="text-base-content/80 text-xs leading-relaxed opacity-90">
                            <span className="text-primary/50 mr-2 select-none">{`>>`}</span>
                            {item.discription}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-1">
                <span className="text-base-content text-[10px] uppercase opacity-50 before:content-['>>_DIAGNOSTIC\_COMPLETE']"></span>
            </div>
        </div>
    )
}
